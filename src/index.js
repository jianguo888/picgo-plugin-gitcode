/**
 * 全局配置常量
 */
const CONFIG = {
  UPLOADER_NAME: 'gitcode',        // 上传器名称
  DOMAIN: 'https://gitcode.com',   // GitCode平台域名
  DEFAULT_MSG: 'picgo commit',     // 默认提交信息
  CONFIG_NAME: 'picBed.gitcode',   // 配置存储键名
  API_VERSION: 'v5',               // API版本号
};

const urlParser = require('url');

/**
 * GitCode图床上传器类
 * 实现图片上传到GitCode平台的核心功能
 */
class GitCodeUploader {
  /**
   * 构造函数
   * @param {Object} ctx PicGo上下文对象
   */
  constructor(ctx) {
    this.ctx = ctx;
    // 绑定方法到实例，确保方法中的this指向正确
    this.register = this.register.bind(this);
    this.handle = this.handle.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  /**
   * 注册上传器到PicGo
   */
  register() {
    this.ctx.helper.uploader.register(CONFIG.UPLOADER_NAME, {
      handle: this.handle,
      name: 'GitCode图床',
      config: this.getUploaderConfig,
    });

    this.ctx.on('remove', this.onRemove);
  }

  /**
   * 获取请求头配置
   * @returns {Object} HTTP请求头
   */
  getHeaders() {
    return {
      'Content-Type': 'application/json;charset=UTF-8',
    };
  }

  /**
   * 获取用户配置并构建完整配置信息
   * @returns {Object} 完整的用户配置信息
   * @throws {Error} 当找不到配置信息时抛出错误
   */
  getUserConfig() {
    const userConfig = this.ctx.getConfig(CONFIG.CONFIG_NAME);
    if (!userConfig) {
      throw new Error('找不到上传器配置信息');
    }

    return {
      ...userConfig,
      baseUrl: `${CONFIG.DOMAIN}/api/${CONFIG.API_VERSION}/repos/${userConfig.owner}/${userConfig.repo}`,
      previewUrl: `${CONFIG.DOMAIN}/${userConfig.owner}/${userConfig.repo}/raw/master${this.formatConfigPath(userConfig)}`,
      message: userConfig.message || CONFIG.DEFAULT_MSG,
    };
  }

  /**
   * 处理图片上传
   * @param {Object} ctx PicGo上下文对象
   * @returns {Object} 处理后的上下文对象
   */
  async handle(ctx) {
    const userConfig = this.getUserConfig();
    const realUrl = `${userConfig.baseUrl}/contents${this.formatConfigPath(userConfig)}`;

    for (const item of ctx.output) {
      try {
        await this.uploadImage(item, realUrl, userConfig);
      } catch (err) {
        this.handleUploadError(err);
      }
    }

    return ctx;
  }

  /**
   * 上传单个图片
   * @param {Object} imgItem 图片项
   * @param {string} baseUrl 基础URL
   * @param {Object} userConfig 用户配置
   */
  async uploadImage(imgItem, baseUrl, userConfig) {
    const image = imgItem.buffer || Buffer.from(imgItem.base64Image, 'base64');
    const perRealUrl = `${baseUrl}/${imgItem.fileName}`;
    const postConfig = this.createPostOptions(perRealUrl, image, userConfig);

    await this.ctx.Request.request(postConfig);
    imgItem.imgUrl = `${userConfig.previewUrl}/${imgItem.fileName}`;

    // 清理临时数据
    delete imgItem.base64Image;
    delete imgItem.buffer;
  }

  /**
   * 处理上传错误
   * @param {Error} err 错误对象
   */
  handleUploadError(err) {
    const isDuplicate = err.message.includes('A file with this name already exists');
    this.ctx.emit('notification', {
      title: '上传失败',
      body: isDuplicate ? '文件已经存在了' : JSON.stringify(err),
    });
    this.ctx.log.error(`[上传操作]异常：${err.message}`);
  }

  /**
   * 创建POST请求配置
   * @param {string} url 请求URL
   * @param {Buffer} image 图片数据
   * @param {Object} config 配置信息
   * @returns {Object} 请求配置对象
   */
  createPostOptions(url, image, config) {
    return {
      method: 'POST',
      url: encodeURI(url),
      headers: this.getHeaders(),
      formData: {
        access_token: config.token,
        content: image.toString('base64'),
        message: config.message || CONFIG.DEFAULT_MSG,
      },
    };
  }

  /**
   * 处理图片删除
   * @param {Array} files 要删除的文件列表
   */
  async onRemove(files) {
    const filesToRemove = files.filter(file => file.type === CONFIG.UPLOADER_NAME);
    if (!filesToRemove.length) return;

    const config = this.getUserConfig();
    const failedFiles = [];

    for (const file of filesToRemove) {
      try {
        await this.removeFile(file, config);
      } catch (err) {
        failedFiles.push(file);
        this.ctx.log.error(`[删除操作]失败：${err.message}`);
      }
    }

    this.notifyRemoveResult(failedFiles.length);
  }

  /**
   * 删除单个文件
   * @param {Object} file 文件对象
   * @param {Object} config 配置信息
   */
  async removeFile(file, config) {
    const filepath = this.getFilePath(file.imgUrl);
    const sha = await this.getSha(filepath);

    const url = this.buildDeleteUrl(filepath, config, sha);
    const opts = {
      method: 'DELETE',
      url: encodeURI(url),
      headers: this.getHeaders(),
    };

    await this.ctx.request(opts);
  }

  /**
   * 构建删除URL
   * @param {string} filepath 文件路径
   * @param {Object} config 配置信息
   * @param {string} sha 文件SHA值
   * @returns {string} 完整的删除URL
   */
  buildDeleteUrl(filepath, config, sha) {
    return `${filepath}?access_token=${config.token}&message=${config.message}&sha=${sha}`;
  }

  /**
   * 通知删除结果
   * @param {number} failCount 失败数量
   */
  notifyRemoveResult(failCount) {
    this.ctx.emit('notification', {
      title: '删除提示',
      body: failCount === 0 ? '成功同步删除' : `删除失败${failCount}个`,
    });
  }

  /**
   * 获取文件在GitCode中的路径
   * @param {string} url 原始URL
   * @returns {string} GitCode API路径
   */
  getFilePath(url) {
    // 使用现代的 URL API 替换废弃的 url.parse()
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
    return url
      .replace(baseUrl, `${baseUrl}/api/${CONFIG.API_VERSION}/repos`)
      .replace('raw/master', 'contents');
  }

  /**
   * 获取文件的SHA值
   * @param {string} filepath 文件路径
   * @returns {string} SHA值
   */
  async getSha(filepath) {
    const config = this.getUserConfig();
    const url = `${filepath}?access_token=${config.token}`;

    const opts = {
      method: 'GET',
      url: encodeURI(url),
      headers: this.getHeaders(),
    };

    const res = await this.ctx.Request.request(opts);
    return JSON.parse(res).sha;
  }

  /**
   * 格式化配置路径
   * @param {Object} userConfig 用户配置
   * @returns {string} 格式化后的路径
   */
  formatConfigPath(userConfig) {
    return userConfig.path ? `/${userConfig.path}` : '';
  }

  /**
   * 获取上传器配置界面配置
   * @param {Object} ctx PicGo上下文对象
   * @returns {Array} 配置项数组
   */
  getUploaderConfig(ctx) {
    const userConfig = ctx.getConfig(CONFIG.CONFIG_NAME) || {};

    return [
      {
        name: 'owner',
        type: 'input',
        default: userConfig.owner,
        required: true,
        message: 'owner',
        alias: 'owner',
      },
      {
        name: 'repo',
        type: 'input',
        default: userConfig.repo,
        required: true,
        message: 'repo',
        alias: 'repo',
      },
      {
        name: 'path',
        type: 'input',
        default: userConfig.path,
        required: false,
        message: 'path;根目录可不用填',
        alias: 'path',
      },
      {
        name: 'token',
        type: 'input',
        default: userConfig.token,
        required: true,
        message: 'token',
        alias: 'token',
      },
      {
        name: 'message',
        type: 'input',
        default: userConfig.message,
        required: false,
        message: CONFIG.DEFAULT_MSG,
        alias: 'message',
      },
    ];
  }
}

/**
 * 模块导出函数
 * @param {Object} ctx PicGo上下文对象
 * @returns {Object} 上传器注册信息
 */
module.exports = ctx => {
  const uploader = new GitCodeUploader(ctx);
  return {
    uploader: CONFIG.UPLOADER_NAME,
    register: uploader.register,
  };
};

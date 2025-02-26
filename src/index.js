/**
 * picgo-plugin-gitcode
 * PicGo上传插件 - GitCode图床
 * 
 * 本插件用于将图片上传到GitCode代码托管平台，作为图床使用
 * 支持图片上传和删除功能，可配置仓库路径和提交信息
 * 
 * @version 1.0.2
 * @author 坚果派
 * @license MIT
 * @homepage https://gitcode.com/nutpi/picgo-plugin-gitcode
 */

/**
 * 全局配置常量
 * 定义插件使用的关键常量，便于统一管理和修改
 */
const CONFIG = {
  UPLOADER_NAME: 'gitcode',        // 上传器名称，用于PicGo识别
  DOMAIN: 'https://gitcode.com',   // GitCode平台域名
  DEFAULT_MSG: 'picgo commit',     // 默认Git提交信息
  CONFIG_NAME: 'picBed.gitcode',   // 配置在PicGo中的存储键名
  API_VERSION: 'v5',               // GitCode API版本号
};

// 引入依赖包
const { v4: uuidv4 } = require('uuid');  // 用于生成唯一文件名

/**
 * GitCode图床上传器类
 * 实现图片上传到GitCode平台的核心功能
 */
class GitCodeUploader {
  /**
   * 构造函数
   * @param {Object} ctx PicGo上下文对象，提供日志、请求、配置等功能
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
   * 将本上传器注册到PicGo系统中，使其可以在界面上选择
   */
  register() {
    this.ctx.helper.uploader.register(CONFIG.UPLOADER_NAME, {
      handle: this.handle,         // 上传处理函数
      name: 'GitCode图床',         // 显示名称
      config: this.getUploaderConfig, // 配置项获取函数
    });

    // 监听删除事件，实现图片删除功能
    this.ctx.on('remove', this.onRemove);
  }

  /**
   * 获取请求头配置
   * @returns {Object} HTTP请求头对象
   */
  getHeaders() {
    return {
      'Content-Type': 'application/json;charset=UTF-8',
    };
  }

  /**
   * 获取用户配置并构建完整配置信息
   * 从PicGo配置中读取用户设置，并添加额外的派生配置
   * 
   * @returns {Object} 完整的用户配置信息
   * @throws {Error} 当找不到配置信息时抛出错误
   */
  getUserConfig() {
    const userConfig = this.ctx.getConfig(CONFIG.CONFIG_NAME);
    if (!userConfig) {
      throw new Error('找不到GitCode上传器配置信息，请先完成配置');
    }

    return {
      ...userConfig,
      // 构建API基础URL
      baseUrl: `${CONFIG.DOMAIN}/api/${CONFIG.API_VERSION}/repos/${userConfig.owner}/${userConfig.repo}`,
      // 构建预览URL
      previewUrl: `${CONFIG.DOMAIN}/${userConfig.owner}/${userConfig.repo}/raw/master${this.formatConfigPath(userConfig)}`,
      // 使用用户配置的提交信息或默认信息
      message: userConfig.message || CONFIG.DEFAULT_MSG,
    };
  }

  /**
   * 处理图片上传的主函数
   * 遍历所有待上传图片并逐一处理
   * 
   * @param {Object} ctx PicGo上下文对象
   * @returns {Object} 处理后的上下文对象
   */
  async handle(ctx) {
    const userConfig = this.getUserConfig();
    const realUrl = `${userConfig.baseUrl}/contents${this.formatConfigPath(userConfig)}`;

    this.ctx.log.info('[GitCode上传] 开始上传图片...');

    for (const item of ctx.output) {
      try {
        await this.uploadImage(item, realUrl, userConfig, ctx);
      } catch (err) {
        this.handleUploadError(err);
      }
    }

    this.ctx.log.info('[GitCode上传] 上传任务完成');
    return ctx;
  }

  /**
   * 上传单个图片
   * 将图片内容上传到GitCode仓库
   * 
   * @param {Object} imgItem 图片项，包含文件名和图片数据
   * @param {string} baseUrl 基础URL
   * @param {Object} userConfig 用户配置
   * @param {Object} ctx PicGo上下文
   */
  async uploadImage(imgItem, baseUrl, userConfig, ctx) {
    // 获取图片数据
    const image = imgItem.buffer || Buffer.from(imgItem.base64Image, 'base64');

    // 生成唯一文件名前缀，避免文件名冲突
    const getUUIDV4 = `a${uuidv4()}`; // 添加字母前缀确保文件名有效
    const perRealUrl = `${baseUrl}/${getUUIDV4}${imgItem.fileName}`;

    // 创建上传请求配置
    const postConfig = this.createPostOptions(perRealUrl, image, userConfig);

    this.ctx.log.info(`[GitCode上传] 正在上传: ${imgItem.fileName}`);

    // 发送上传请求
    await ctx.Request.request(postConfig);

    // 设置图片URL，用于后续访问
    imgItem.imgUrl = `${userConfig.previewUrl}/${getUUIDV4}${imgItem.fileName}`;

    // 记录成功日志
    ctx.log.success(`[GitCode上传] 成功: ${imgItem.fileName}`);

    // 发送成功通知
    ctx.emit('notification', {
      title: 'GitCode上传成功',
      body: `${imgItem.fileName} 已成功上传到GitCode仓库`,
    });

    // 清理临时数据，减少内存占用
    delete imgItem.base64Image;
    delete imgItem.buffer;
  }

  /**
   * 处理上传错误
   * 根据错误类型提供友好的错误提示
   * 
   * @param {Error} err 错误对象
   */
  handleUploadError(err) {
    // 检查是否为文件已存在错误
    const isDuplicate = err.message.includes('A file with this name already exists');

    // 发送错误通知
    this.ctx.emit('notification', {
      title: 'GitCode上传失败',
      body: isDuplicate ? '文件已经存在于仓库中' : `错误: ${err.message}`,
    });

    // 记录错误日志
    this.ctx.log.error(`[GitCode上传] 异常: ${err.message}`);
  }

  /**
   * 创建POST请求配置
   * 构建上传图片所需的API请求参数
   * 
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
        access_token: config.token,  // 访问令牌
        content: image.toString('base64'),  // Base64编码的图片内容
        message: config.message || CONFIG.DEFAULT_MSG,  // 提交信息
      },
    };
  }

  /**
   * 处理图片删除
   * 当PicGo删除图片时，同步删除GitCode仓库中的图片
   * 
   * @param {Array} files 要删除的文件列表
   */
  async onRemove(files) {
    // 过滤出属于GitCode上传器的文件
    const filesToRemove = files.filter(file => file.type === CONFIG.UPLOADER_NAME);
    if (!filesToRemove.length) return;

    this.ctx.log.info(`[GitCode删除] 开始删除${filesToRemove.length}个文件...`);

    const config = this.getUserConfig();
    const failedFiles = [];

    for (const file of filesToRemove) {
      try {
        await this.removeFile(file, config);
        this.ctx.log.success(`[GitCode删除] 成功: ${file.fileName || '未命名文件'}`);
      } catch (err) {
        failedFiles.push(file);
        this.ctx.log.error(`[GitCode删除] 失败: ${err.message}`);
      }
    }

    this.notifyRemoveResult(failedFiles.length);
    this.ctx.log.info('[GitCode删除] 删除任务完成');
  }

  /**
   * 删除单个文件
   * 从GitCode仓库中删除指定文件
   * 
   * @param {Object} file 文件对象
   * @param {Object} config 配置信息
   */
  async removeFile(file, config) {
    // 获取文件在GitCode中的路径
    const filepath = this.getFilePath(file.imgUrl);

    // 获取文件的SHA值，GitCode API要求提供SHA以确认删除
    const sha = await this.getSha(filepath);

    // 构建删除请求URL
    const url = this.buildDeleteUrl(filepath, config, sha);
    const opts = {
      method: 'DELETE',
      url: encodeURI(url),
      headers: this.getHeaders(),
    };

    // 发送删除请求
    await this.ctx.request(opts);
  }

  /**
   * 构建删除URL
   * 生成用于删除文件的API URL
   * 
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
   * 向用户展示删除操作的结果
   * 
   * @param {number} failCount 失败数量
   */
  notifyRemoveResult(failCount) {
    this.ctx.emit('notification', {
      title: 'GitCode删除结果',
      body: failCount === 0
        ? '所有文件已成功从GitCode仓库中删除'
        : `删除操作部分失败: ${failCount}个文件未能删除`,
    });
  }

  /**
   * 获取文件在GitCode中的路径
   * 将预览URL转换为API URL
   * 
   * @param {string} url 原始URL
   * @returns {string} GitCode API路径
   */
  getFilePath(url) {
    // 使用现代的 URL API 解析URL
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
    return url
      .replace(baseUrl, `${baseUrl}/api/${CONFIG.API_VERSION}/repos`)
      .replace('raw/master', 'contents');
  }

  /**
   * 获取文件的SHA值
   * GitCode API要求提供SHA以确认删除操作
   * 
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

    // 获取文件信息
    const res = await this.ctx.Request.request(opts);
    return JSON.parse(res).sha;
  }

  /**
   * 格式化配置路径
   * 确保路径格式正确
   * 
   * @param {Object} userConfig 用户配置
   * @returns {string} 格式化后的路径
   */
  formatConfigPath(userConfig) {
    return userConfig.path ? `/${userConfig.path}` : '';
  }

  /**
   * 获取上传器配置界面配置
   * 定义PicGo配置界面中显示的配置项
   * 
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
        message: '用户名/组织名',
        alias: '所有者',
        description: '请输入GitCode的用户名或组织名'
      },
      {
        name: 'repo',
        type: 'input',
        default: userConfig.repo,
        required: true,
        message: '仓库名称',
        alias: '仓库',
        description: '请输入用于存储图片的仓库名称'
      },
      {
        name: 'path',
        type: 'input',
        default: userConfig.path,
        required: false,
        message: '存储路径（可选）',
        alias: '路径',
        description: '图片存储在仓库中的路径，不填则存储在根目录'
      },
      {
        name: 'token',
        type: 'password',
        default: userConfig.token,
        required: true,
        message: '访问令牌',
        alias: '令牌',
        description: '请输入GitCode的访问令牌（Personal Access Token）'
      },
      {
        name: 'message',
        type: 'input',
        default: userConfig.message || CONFIG.DEFAULT_MSG,
        required: false,
        message: '提交信息（可选）',
        alias: '提交信息',
        description: '上传图片时的Git提交信息，默认为"picgo commit"'
      },
    ];
  }
}

/**
 * 模块导出函数
 * PicGo插件的入口点
 * 
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

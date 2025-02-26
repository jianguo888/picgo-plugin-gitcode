# PicGo-Plugin-GitCode

> 一个基于 GitCode 的 PicGo 图床插件，让您的图片管理更简单高效

<p align="center">
  <img src="https://nutpi-e41b.obs.cn-north-4.myhuaweicloud.com/8bc8dd1a2bc24184a16a142654c4a49e.png" alt="PicGo-Plugin-GitCode Logo" width="200">
  <br>
  <a href="https://www.npmjs.com/package/picgo-plugin-gitcode"><img src="https://img.shields.io/npm/v/picgo-plugin-gitcode.svg?style=flat-square" alt="NPM version"></a>
  <a href="https://www.npmjs.com/package/picgo-plugin-gitcode"><img src="https://img.shields.io/npm/dt/picgo-plugin-gitcode.svg?style=flat-square" alt="Downloads"></a>
  <a href="https://github.com/nutpi/picgo-plugin-gitcode/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/picgo-plugin-gitcode.svg?style=flat-square" alt="License"></a>
</p>





## 📖 简介

这是一个 PicGo 的插件，支持将图片上传到 GitCode 平台，并作为图床使用。GitCode 是一个国内优秀的代码托管平台，提供稳定可靠的服务和 CDN 加速。

### ✨ 主要功能

- 🚀 将图片上传到您的 GitCode 仓库
- 🔗 自动生成图片访问链接
- 🗑️ 支持图片删除功能
- 📝 支持自定义提交信息
- 📂 支持自定义存储路径
- 🔒 安全的令牌管理

## 🤔 开发背景

在使用 Markdown 写作时，图片管理一直是一个痛点。虽然已经有了很多图床服务，但是：

1. 第三方图床可能存在稳定性问题
2. 免费图床可能有带宽限制
3. 付费图床成本较高
4. 对图片资源缺乏控制权

基于以上原因，我们开发了这个 GitCode 图床插件。选择 GitCode 的原因是：

- 免费且稳定的存储服务
- 完整的版本控制
- 支持大文件存储
- 提供 CDN 加速
- 可以完全控制自己的图片资源

## 📥 安装

### 方式一：图形界面安装（推荐）
1. 打开 PicGo 客户端
2. 进入「插件设置」
3. 搜索 `picgo-plugin-gitcode`
4. 点击「安装」按钮

### 方式二：命令行安装
```bash
# 全局安装 PicGo-Core
npm install picgo -g

# 安装 GitCode 插件
picgo install picgo-plugin-gitcode

# 或者使用 npm 直接安装
npm install picgo-plugin-gitcode -g
```

## ⚙️ 配置说明

### 必要参数

插件需要配置以下参数：

| 参数名 | 说明 | 是否必填 | 示例 |
|-------|------|---------|------|
| owner | GitCode 仓库所有者用户名 | 是 | your-username |
| repo | 仓库名称 | 是 | your-repo |
| path | 图片存储路径 | 否 | images |
| token | GitCode 的访问令牌 | 是 | your-token |
| message | 提交信息 | 否 | Upload by PicGo |

### 获取 Token 步骤

1. 登录 [GitCode](https://gitcode.com) 账号
2. 进入「设置」→「安全设置」→「私人令牌」
3. 点击「生成新令牌」（需要勾选 repo 权限）
4. 复制并保存生成的令牌（注意：令牌只显示一次！）



### 配置示例

在 PicGo 客户端中：

或者在配置文件中：

```json
{
  "picBed": {
    "current": "gitcode",
    "gitcode": {
      "owner": "your-username",
      "repo": "your-repo",
      "path": "images",
      "token": "your-token",
      "message": "Upload by PicGo"
    }
  }
}
```

## 🚀 使用方法

1. 完成插件配置
2. 在 PicGo 中选择「GitCode图床」作为默认图床
3. 上传图片即可自动同步到 GitCode 仓库

### 上传方式

- **拖拽上传**：直接将图片拖拽到 PicGo 上传区
- **剪贴板上传**：截图后使用快捷键上传
- **文件选择**：点击上传区选择图片文件

### 删除图片

在 PicGo 相册中，右键点击图片，选择「删除图片」，插件会同时删除 GitCode 仓库中的对应图片。

## ⚠️ 注意事项

- 确保仓库为公开仓库，否则图片无法正常访问
- token 请妥善保管，不要泄露
- 建议设置专门的图床仓库
- 首次使用时，如果仓库中不存在配置的路径，插件会自动创建

## 🔧 常见问题

### 上传失败

- **检查网络连接**：确保能够正常访问 GitCode
- **检查 Token**：确认 Token 有效且具有足够权限
- **检查仓库设置**：确认仓库名称和路径正确

### 图片无法显示

- **检查仓库可见性**：确保仓库为公开仓库
- **CDN 缓存**：新上传的图片可能需要几分钟时间更新 CDN 缓存

## 📚 进阶使用

### 与 Typora 集成

1. 在 Typora 中，进入「文件」→「偏好设置」→「图像」
2. 选择「上传图片」并选择 PicGo 路径
3. 点击「验证图片上传选项」测试配置

### 自定义 CDN

如果您有自己的 CDN，可以在配置中添加 `customUrl` 字段：

```json
{
  "customUrl": "https://your-cdn.com/path"
}
```

## 🛠️ 开发相关

### 本地开发

```bash
# 克隆仓库
git clone https://gitcode.com/nutpi/picgo-plugin-gitcode.git

# 安装依赖
cd picgo-plugin-gitcode
npm install

# 链接到全局
npm link

# 在 PicGo 中启用开发中的插件
picgo use picgo-plugin-gitcode
```

### 贡献代码

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 📝 参考文档

- [PicGo 核心文档](https://picgo.github.io/PicGo-Core-Doc/)
- [GitCode API 文档](https://docs.gitcode.com/docs/apis/)

## 👥 贡献者

特别感谢:
- 坚果
- 全栈若城

## 📞 联系方式

- 微信公众号：nutpi
- 官方网站：[nutpi.net](https://nutpi.net)
- 邮箱：jianguo@nutpi.net

## 📄 许可证

[MIT License](LICENSE) © 坚果派

---

<p align="center">
  <sub>Made with ❤️ by 坚果派团队</sub>
</p>


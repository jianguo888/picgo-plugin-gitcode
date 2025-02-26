# PicGo + GitCode 图床配置指南

## 1. 简介

本文档详细介绍如何使用 PicGo 配合 GitCode 平台搭建个人图床，实现 Markdown 文档中图片的便捷上传和管理。这种方案完全免费，稳定可靠，适合博客写作者、文档编写者和开发人员使用。

## 2. 前期准备

### 2.1 所需工具

- **PicGo**: 一款优秀的图片上传工具，支持多种图床
- **Picgo-plugin-gitcode 插件**: 专为 GitCode 平台开发的 PicGo 插件

### 2.2 安装步骤

1. 从[官方网站](https://molunerfinn.com/PicGo/)下载并安装 PicGo
2. 打开 PicGo，进入「插件设置」，搜索并安装 `picgo-plugin-gitcode` 插件
3. 安装完成后重启 PicGo 使插件生效

## 3. 创建 GitCode 图床仓库

### 3.1 创建新仓库

1. 登录 [GitCode 平台](https://gitcode.com/)
2. 点击右上角的「+」号，选择「新建仓库」
   
   ![创建新仓库](https://luckly007.oss-cn-beijing.aliyuncs.com/nutpi/image-20250220133316492.png)

### 3.2 仓库配置要点

1. **仓库名称**: 输入一个简洁明了的名称，如 `images` 或 `pic-bed`
2. **可见性**: 必须设置为「公开」，否则图片无法正常访问
3. **初始化**: 勾选「使用 README 文件初始化这个仓库」
4. 点击「创建仓库」完成设置

   ![仓库配置](https://luckly007.oss-cn-beijing.aliyuncs.com/nutpi/image-20250220133654658.png)

## 4. 配置 PicGo

### 4.1 获取访问令牌 (Token)

1. 点击 GitCode 右上角头像，进入「设置」
2. 在左侧菜单找到「安全设置」→「私人令牌」
3. 点击「生成新令牌」，只需勾选 **projects** 权限
4. 输入密码验证身份后，系统会生成令牌
   
   ![获取令牌](https://luckly007.oss-cn-beijing.aliyuncs.com/nutpi/image-20250220133414618.png)

> **重要提示**: 令牌只会显示一次！请立即复制并保存到安全的地方。如果遗失，需要重新生成新的令牌。

### 4.2 配置 GitCode 插件

1. 打开 PicGo，切换到「图床设置」→「GitCode」
2. 填写以下信息:
   - **所有者**: 您的 GitCode 用户名
   - **仓库名**: 刚才创建的仓库名称
   - **分支名**: 通常为 `master`
   - **Token**: 粘贴刚才生成的私人令牌
   - **存储路径**: 建议填写 `img`（可选）
   - **自定义域名**: 留空即可
   
   ![PicGo配置](https://luckly007.oss-cn-beijing.aliyuncs.com/nutpi/image-20250220133443679.png)

3. 点击「确定」保存配置
4. 在 PicGo 主界面将默认图床设置为 GitCode

## 5. 使用方法

### 5.1 上传图片

- **方法一**: 直接将图片拖拽到 PicGo 上传区
- **方法二**: 使用快捷键 `Ctrl+Shift+P`(Windows) 或 `Command+Shift+P`(Mac) 唤出上传窗口
- **方法三**: 从剪贴板上传截图，默认快捷键为 `Ctrl+Shift+C`

### 5.2 验证配置

上传成功后，PicGo 会自动复制图片链接到剪贴板。您可以在 Markdown 编辑器中粘贴链接，验证图片是否正常显示。

![验证图片](https://gitcode.com/qq_39132095/gitcodeimg/raw/master/img/image-20250221142531801.png)

## 6. 常见问题与解决方案

### 6.1 上传失败

- **检查令牌**: 确认令牌未过期且具有正确权限
- **仓库路径**: 确认仓库名称大小写正确，建议直接从浏览器地址栏复制
- **网络问题**: 检查网络连接是否正常

### 6.2 图片无法显示

- **仓库可见性**: 确认仓库设置为公开
- **路径问题**: 检查 PicGo 配置中的存储路径是否正确
- **缓存问题**: 尝试清除浏览器缓存或使用隐私模式查看

## 7. 进阶技巧

- **批量上传**: PicGo 支持同时上传多张图片
- **重命名规则**: 在 PicGo 设置中可自定义图片命名规则
- **自动压缩**: 安装 `picgo-plugin-compress` 插件实现图片自动压缩
- **Typora 集成**: 在 Typora 偏好设置中将图片上传服务设置为 PicGo

## 8. 总结

通过 PicGo + GitCode 的组合，您可以轻松构建一个免费、稳定的个人图床系统，告别图片外链失效的烦恼。这套方案特别适合经常编写 Markdown 文档的用户，能够显著提高写作效率。

## 9. 开源项目地址

### 9.1 相关项目

- **PicGo 官方项目**: [https://github.com/Molunerfinn/PicGo](https://github.com/Molunerfinn/PicGo)
- **GitCode 插件源码**: [https://gitcode.com/nutpi/picgo-plugin-gitcode](https://gitcode.com/nutpi/picgo-plugin-gitcode)
- **插件 NPM 包**: [https://www.npmjs.com/package/picgo-plugin-gitcode](https://www.npmjs.com/package/picgo-plugin-gitcode)

### 9.2 如何贡献

我们欢迎社区贡献，您可以通过以下方式参与:

1. 在 GitCode 上 Fork 项目并提交 Pull Request
2. 提交 Issue 报告 Bug 或提出新功能建议
3. 完善文档或提供使用教程
4. 在社区中分享您的使用经验

### 9.3 开源协议

本项目采用 [MIT 开源许可证](https://gitcode.com/nutpi/picgo-plugin-gitcode/blob/master/LICENSE)，您可以自由使用、修改和分发。

---

**作者**: 坚果派  
**最后更新**: 2025年2月21日  
**联系方式**: [jianguo@nutpi.net](mailto:jianguo@nutpi.net)  
**项目主页**: [https://gitcode.com/nutpi/picgo-plugin-gitcode](https://gitcode.com/nutpi/picgo-plugin-gitcode)


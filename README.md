# PicGo-Plugin-GitCode

> 一个基于 GitCode 的 PicGo 图床插件

## 简介

这是一个 PicGo 的插件，支持将图片上传到 GitCode 平台，并作为图床使用。通过此插件，您可以：

- 将图片上传到您的 GitCode 仓库
- 自动生成图片访问链接
- 支持图片删除功能
- 支持自定义提交信息

## 安装

### 方式一：搜索安装
1. 打开 PicGo 客户端
2. 进入插件设置
3. 搜索 `picgo-plugin-gitcode`
4. 点击安装

### 方式二：命令行安装
```bash
npm install picgo-plugin-gitcode -g
```

## 配置说明

插件需要配置以下参数：

- **owner**: GitCode 仓库所有者用户名
- **repo**: 仓库名称
- **path**: 图片存储路径（可选，不填则存储在根目录）
- **token**: GitCode 的访问令牌
- **message**: 提交信息（可选，默认为 "picgo commit"）

### 获取 Token

1. 登录 GitCode 账号
2. 进入设置 -> 私人令牌
3. 生成新的访问令牌（需要 repo 权限）

### 配置示例

```json
{
  "owner": "your-username",
  "repo": "your-repo",
  "path": "images",
  "token": "your-token",
  "message": "Upload by PicGo"
}
```

## 使用方法

1. 完成插件配置
2. 在 PicGo 中选择 "GitCode图床" 作为默认图床
3. 上传图片即可自动同步到 GitCode 仓库

## 注意事项

- 确保仓库为公开仓库，否则图片无法正常访问
- token 请妥善保管，不要泄露
- 建议设置专门的图床仓库

## 开发相关

- 项目地址：[picgo-plugin-gitcode](https://gitcode.com/nutpi/picgo-plugin-gitcode)
- 问题反馈：[Issues](https://gitcode.com/nutpi/picgo-plugin-gitcode/issues)

## 参考文档

- [PicGo 核心文档](https://picgo.github.io/PicGo-Core-Doc/)
- [GitCode API 文档](https://docs.gitcode.com/docs/apis/)

## 贡献者

- 坚果
- 若城

## 许可证

MIT License


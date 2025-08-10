# 使用 OpenAI SDK 调用讯飞星火大模型配置指南

本项目已配置为使用 OpenAI SDK 调用讯飞星火大模型的兼容接口，实现无缝切换。

## 🚀 快速开始

### 1. 申请讯飞星火 API

1. 访问 [讯飞开放平台](https://console.xfyun.cn/)
2. 注册并登录账号
3. 创建应用，获取以下配置信息：
   - `SPARK_API_PASSWORD`: 控制台获取的APIPassword（这是讯飞星火的统一认证密钥）

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```bash
# 讯飞星火大模型配置
SPARK_API_PASSWORD=your_actual_api_password
```

### 3. 重启开发服务器

```bash
pnpm dev
```

## 🔧 技术实现

### OpenAI SDK 配置

项目使用 OpenAI SDK，但配置了自定义的 `baseURL` 和请求头来调用讯飞星火的兼容接口：

```typescript
const openai = new OpenAI({
  apiKey: process.env.SPARK_API_PASSWORD, // 使用控制台获取的APIPassword
  baseURL: 'https://spark-api-open.xf-yun.com/v1'
});
```

### 模型配置

- 使用模型：`generalv3.5` (讯飞星火3.5)
- 兼容 OpenAI 的 Chat Completions API
- 支持相同的参数配置（temperature, max_tokens 等）

## 🎯 功能特性

- ✅ **无缝切换**: 使用 OpenAI SDK 调用讯飞星火模型
- ✅ **兼容接口**: 完全兼容 OpenAI Chat Completions API
- ✅ **错误处理**: 完善的错误处理和超时控制
- ✅ **配置检查**: 自动检查必要的环境变量
- ✅ **日志记录**: 详细的调用日志便于调试

## 🧪 测试功能

1. 启动开发服务器后，访问博客文章页面
2. 查看文章摘要是否正常生成
3. 检查浏览器控制台和服务器日志

## ⚠️ 注意事项

1. **API 配额**: 讯飞星火有免费额度限制，请注意使用量
2. **网络环境**: 确保服务器能访问讯飞的 API 端点
3. **模型差异**: 讯飞星火和 GPT 的响应可能略有不同
4. **配置安全**: 不要将 API 密钥提交到代码仓库

## 🔍 故障排除

### 常见错误

1. **配置不完整**
   ```
   讯飞星火API配置不完整
   ```
   - 检查 `.env.local` 文件中的 `SPARK_API_PASSWORD` 是否已设置

2. **API 调用失败**
   ```
   创建讯飞星火API请求时出错
   ```
   - 检查 APIPassword 是否正确（从讯飞控制台获取）
   - 确认网络连接正常
   - 查看讯飞控制台的 API 使用情况

3. **超时错误**
   ```
   讯飞星火API请求超时
   ```
   - 检查网络连接
   - 讯飞服务可能暂时不可用

### 调试步骤

1. 检查服务器控制台日志
2. 确认环境变量配置
3. 测试 API 连接性
4. 查看讯飞控制台的调用记录

## 🔄 切换回 OpenAI

如需切换回 OpenAI，只需：

1. 修改 `route.ts` 中的配置
2. 更新环境变量为 `OPENAI_API_KEY`
3. 将模型改回 `gpt-3.5-turbo`

## 📚 相关文档

- [讯飞开放平台文档](https://www.xfyun.cn/doc/)
- [OpenAI SDK 文档](https://github.com/openai/openai-node)
- [讯飞星火模型介绍](https://xinghuo.xfyun.cn/)

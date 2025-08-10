# 生产环境配置指南

本文档说明如何在生产环境中安全配置环境变量。

## 1. GitHub Secrets 配置

在 GitHub 仓库中添加以下 Repository secrets：

1. 进入 GitHub 仓库 → Settings → Secrets and variables → Actions
2. 添加以下 secrets：

```
SPARK_API_PASSWORD=你的讯飞星火API密码
OSS_ACCESS_KEY_ID=你的阿里云OSS访问密钥ID
OSS_ACCESS_KEY_SECRET=你的阿里云OSS访问密钥Secret
NEXT_PUBLIC_OSS_REGION=oss-cn-chengdu
NEXT_PUBLIC_OSS_BUCKET=你的OSS存储桶名称
NEXT_PUBLIC_OUR_DOMAIN=你的域名
NEXT_PUBLIC_SITE_LINK_PREVIEW_ENABLED=true
OPENAI_API_KEY=你的OpenAI API密钥（可选）
SERVER_IP=你的服务器IP
SERVER_USER=你的服务器用户名
SERVER_SSH_KEY=你的SSH私钥
ALIYUN_REGISTRY=你的阿里云镜像仓库地址
ALIYUN_USERNAME=阿里云镜像仓库用户名
ALIYUN_PASSWORD=阿里云镜像仓库密码
ALIYUN_NAMESPACE=阿里云镜像仓库命名空间
ALIYUN_REPO=阿里云镜像仓库名称
```

## 2. 本地开发环境

1. 复制 `.env.production.example` 为 `.env.local`
2. 填入你的开发环境配置

```bash
cp .env.production.example .env.local
```

## 3. 部署流程

当你推送代码到 `main` 分支时，GitHub Actions 会自动：

1. 构建 Docker 镜像
2. 推送到阿里云镜像仓库
3. 在服务器上创建 `.env` 文件（包含所有环境变量）
4. 部署应用

## 4. 手动部署（如果需要）

如果需要手动在服务器上部署：

```bash
# 在服务器上创建 .env 文件
cd /root/workspace/blog-next
cat > .env << 'EOF'
SPARK_API_PASSWORD=你的实际密码
OSS_ACCESS_KEY_ID=你的实际密钥
# ... 其他环境变量
EOF

# 设置文件权限
chmod 600 .env

# 部署
./deploy.sh
```

## 5. 安全注意事项

- ✅ 敏感信息存储在 GitHub Secrets 中
- ✅ 本地 `.env` 文件使用占位符
- ✅ 生产环境 `.env` 文件权限设置为 600
- ✅ `.env` 文件已添加到 `.gitignore`
- ❌ 不要在代码中硬编码敏感信息
- ❌ 不要将真实的 API 密钥提交到代码仓库

## 6. 验证配置

部署后，可以通过以下方式验证环境变量是否正确加载：

```bash
# 检查容器环境变量
docker exec -it blog-next env | grep SPARK_API_PASSWORD

# 检查应用日志
docker logs blog-next
```

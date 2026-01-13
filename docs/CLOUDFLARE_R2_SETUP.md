# Cloudflare R2 完整配置指南

## 🌟 为什么选择 Cloudflare R2？

### 核心优势

✅ **完全免费**（10GB 内）
- 存储：10 GB 免费
- 出站流量：**完全免费**（无限制）
- 无隐藏费用

✅ **性能强大**
- 全球 CDN 加速
- 延迟极低
- 自动优化

✅ **S3 兼容**
- 支持标准 S3 API
- 无需改动太多代码
- 易于迁移

✅ **操作简单**
- 网页界面友好
- 支持 wrangler CLI
- 支持 rclone

### 成本对比

| 项目 | Cloudflare R2 | AWS S3 | 阿里云 OSS |
|------|---------------|---------|-----------|
| **存储** | $0.015/GB/月 | $0.023/GB/月 | $0.02/GB/月 |
| **免费额度** | **10 GB** ✅ | 无 | 无 |
| **出站流量** | **$0** ✅✅✅ | $0.09/GB | $0.03/GB |
| **你的成本** | **$0/月** | $5-10/月 | $2-5/月 |

**607 MB 照片在 Cloudflare R2 上完全免费！** 🎉

---

## 🚀 快速开始

### 方案 A：使用 Wrangler CLI（推荐）

#### 步骤 1：安装 Wrangler

```bash
# 全局安装
npm install -g wrangler

# 或在项目中安装
cd /Users/suqingyao/workspace/blog-next
pnpm add -D wrangler

# 验证安装
wrangler --version
```

#### 步骤 2：登录 Cloudflare

```bash
# 登录（会打开浏览器）
wrangler login

# 验证登录
wrangler whoami
```

#### 步骤 3：创建 R2 Bucket

```bash
# 创建 bucket
wrangler r2 bucket create my-blog-photos

# 查看 buckets
wrangler r2 bucket list

# 输出：
# my-blog-photos
```

#### 步骤 4：上传照片

```bash
cd /Users/suqingyao/workspace/blog-next

# 上传整个目录
wrangler r2 object put my-blog-photos --file=public/photos --recursive

# 或使用脚本（更可靠）
bash scripts/upload-to-r2.sh
```

#### 步骤 5：配置公共访问

```bash
# 方式 1：使用 Cloudflare 公共域名
# 在 Cloudflare Dashboard 中:
# R2 → my-blog-photos → Settings → Public Access → Enable

# 方式 2：绑定自定义域名
# R2 → my-blog-photos → Settings → Custom Domains
# 添加：photos.your-domain.com
```

#### 步骤 6：获取访问凭证

```bash
# 在 Cloudflare Dashboard 中:
# R2 → Manage R2 API Tokens → Create API Token

# 记录：
# - Access Key ID
# - Secret Access Key
# - Account ID
```

#### 步骤 7：配置 Builder

```bash
# 创建 .env.local
cat > .env.local << 'EOF'
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=my-blog-photos
R2_PUBLIC_URL=https://photos.your-domain.com
EOF

# 添加到 .gitignore
echo ".env.local" >> .gitignore
```

#### 步骤 8：更新 builder.config.ts

```typescript
import { defineBuilderConfig, localStoragePlugin } from './src/lib/builder/index.js';

export default defineBuilderConfig(() => ({
  storage: {
    provider: 's3', // R2 使用 S3 兼容 API
    bucket: process.env.R2_BUCKET_NAME!,
    region: 'auto', // R2 使用 'auto'
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    
    // 公共访问 URL（你的自定义域名或 R2 公共域名）
    customDomain: process.env.R2_PUBLIC_URL,
    
    // 可选：前缀
    prefix: 'photos/',
  },
  
  system: {
    processing: {
      defaultConcurrency: 10,
      enableLivePhotoDetection: true,
      digestSuffixLength: 0,
    },
  },
  
  plugins: [
    localStoragePlugin(),
  ],
}));
```

#### 步骤 9：重新构建

```bash
# 清除旧 manifest
rm src/data/photos-manifest.json

# 使用 R2 重新构建
pnpm build:photos

# 检查 manifest
cat src/data/photos-manifest.json | grep "originalUrl" | head -3
# 应该看到 R2 的 URL
```

#### 步骤 10：验证访问

```bash
# 测试公共 URL
curl -I https://photos.your-domain.com/sichuan/IMG_20251007_134904.jpg

# 应该返回 200 OK
```

---

### 方案 B：使用 rclone（批量上传）

#### 安装 rclone

```bash
# macOS
brew install rclone

# 配置 R2
rclone config

# 选择：
# n) New remote
# name: r2
# type: s3
# provider: Cloudflare
# env_auth: false
# access_key_id: YOUR_ACCESS_KEY
# secret_access_key: YOUR_SECRET_KEY
# endpoint: https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
# acl: private
```

#### 上传照片

```bash
cd /Users/suqingyao/workspace/blog-next

# 同步上传
rclone sync public/photos/ r2:my-blog-photos/photos/ --progress

# 或增量上传
rclone copy public/photos/ r2:my-blog-photos/photos/ --update --progress

# 查看已上传文件
rclone ls r2:my-blog-photos/photos/
```

---

## 📝 详细配置步骤（网页操作）

### 1. 创建 Cloudflare 账户

1. 访问：https://dash.cloudflare.com/sign-up
2. 注册账户（免费）
3. 验证邮箱

### 2. 创建 R2 Bucket

1. 登录 Cloudflare Dashboard
2. 侧边栏：**R2 Object Storage**
3. 点击：**Create bucket**
4. Bucket 名称：`my-blog-photos`
5. 位置：**Automatic**（推荐）
6. 点击：**Create bucket**

### 3. 配置公共访问

#### 选项 A：使用 R2 公共域名

1. 进入 bucket：`my-blog-photos`
2. **Settings** → **Public Access**
3. 点击：**Allow Access**
4. 启用：**Public R2 Bucket**
5. 复制公共 URL：`https://pub-xxxxx.r2.dev`

#### 选项 B：绑定自定义域名（推荐）

1. 进入 bucket：`my-blog-photos`
2. **Settings** → **Custom Domains**
3. 点击：**Connect Domain**
4. 输入域名：`photos.your-domain.com`
5. 点击：**Continue**
6. 添加 CNAME 记录（如果域名在 Cloudflare）
7. 等待生效（1-5 分钟）

### 4. 创建 API Token

1. **R2** → **Manage R2 API Tokens**
2. 点击：**Create API Token**
3. Token 名称：`blog-photos-builder`
4. 权限：
   - ✅ **Object Read & Write**
   - ✅ 选择 bucket：`my-blog-photos`
5. 点击：**Create API Token**
6. **重要**：复制以下信息：
   ```
   Access Key ID: xxxxxxxxxxxxxxxx
   Secret Access Key: yyyyyyyyyyyyyyyy
   Account ID: zzzzzzzzzzzzzz
   ```

---

## 🔧 创建上传脚本

### scripts/upload-to-r2.sh

```bash
#!/bin/bash

set -e

echo "📸 上传照片到 Cloudflare R2..."

# 加载环境变量
if [ -f .env.local ]; then
    export $(cat .env.local | xargs)
fi

# 检查必要的环境变量
if [ -z "$R2_ACCOUNT_ID" ] || [ -z "$R2_ACCESS_KEY_ID" ] || [ -z "$R2_SECRET_ACCESS_KEY" ]; then
    echo "❌ 错误: 缺少 R2 环境变量"
    echo "请在 .env.local 中配置："
    echo "  R2_ACCOUNT_ID=xxx"
    echo "  R2_ACCESS_KEY_ID=xxx"
    echo "  R2_SECRET_ACCESS_KEY=xxx"
    exit 1
fi

BUCKET_NAME=${R2_BUCKET_NAME:-"my-blog-photos"}
SOURCE_DIR="public/photos"
ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"

echo "📦 Bucket: $BUCKET_NAME"
echo "📂 源目录: $SOURCE_DIR"
echo ""

# 检查目录
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ 源目录不存在: $SOURCE_DIR"
    exit 1
fi

# 计算统计
TOTAL_FILES=$(find "$SOURCE_DIR" -type f | wc -l | tr -d ' ')
TOTAL_SIZE=$(du -sh "$SOURCE_DIR" | cut -f1)

echo "📊 统计:"
echo "   文件数: $TOTAL_FILES"
echo "   大小: $TOTAL_SIZE"
echo ""

# 使用 wrangler 上传
echo "⬆️  开始上传..."

# 方式 1：使用 wrangler（推荐）
if command -v wrangler &> /dev/null; then
    echo "使用 wrangler 上传..."
    
    cd "$SOURCE_DIR"
    find . -type f | while IFS= read -r file; do
        # 移除开头的 ./
        clean_path="${file#./}"
        echo "  上传: $clean_path"
        wrangler r2 object put "$BUCKET_NAME/$clean_path" --file="$file"
    done
    cd ../..
    
    echo ""
    echo "✅ 上传完成！"
else
    echo "❌ wrangler 未安装"
    echo "请运行: npm install -g wrangler"
    exit 1
fi

echo ""
echo "🎉 完成！"
echo ""
echo "下一步："
echo "  1. 配置公共访问（Cloudflare Dashboard）"
echo "  2. 更新 builder.config.ts"
echo "  3. 运行: pnpm build:photos"
echo ""
```

保存并添加执行权限：

```bash
chmod +x scripts/upload-to-r2.sh
```

---

## 🔄 完整迁移流程

### 一键迁移脚本

```bash
cd /Users/suqingyao/workspace/blog-next

# 使用自动化脚本
bash scripts/migrate-to-cloud-storage.sh cloudflare-r2
```

### 或手动迁移

#### 步骤 1：安装 wrangler

```bash
npm install -g wrangler
wrangler login
```

#### 步骤 2：创建 bucket 并上传

```bash
# 创建 bucket
wrangler r2 bucket create my-blog-photos

# 上传照片
bash scripts/upload-to-r2.sh
```

#### 步骤 3：配置公共访问

**访问 Cloudflare Dashboard**：
1. R2 → my-blog-photos
2. Settings → Public Access
3. Enable Public Access
4. 复制公共 URL：`https://pub-xxxxx.r2.dev`

#### 步骤 4：配置环境变量

```bash
cat > .env.local << 'EOF'
# Cloudflare R2 配置
R2_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_here
R2_SECRET_ACCESS_KEY=your_secret_key_here
R2_BUCKET_NAME=my-blog-photos
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
EOF
```

#### 步骤 5：更新 builder.config.ts

```typescript
import { defineBuilderConfig, localStoragePlugin } from './src/lib/builder/index.js';

export default defineBuilderConfig(() => ({
  storage: {
    provider: 's3',
    bucket: process.env.R2_BUCKET_NAME!,
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    customDomain: process.env.R2_PUBLIC_URL,
    prefix: 'photos/',
  },
  
  system: {
    processing: {
      defaultConcurrency: 10,
      enableLivePhotoDetection: true,
      digestSuffixLength: 0,
    },
  },
  
  plugins: [
    localStoragePlugin(),
  ],
}));
```

#### 步骤 6：清理本地文件

```bash
cd /Users/suqingyao/workspace/blog-next

# 1. 添加到 .gitignore
cat >> .gitignore << 'EOF'

# Photos now in cloud storage
public/photos/
src/assets/photos/
*.jpg
*.jpeg
*.mp4
*.mov
!public/thumbnails/**
EOF

# 2. 从 Git 移除（保留本地）
git rm -r --cached public/photos/
git rm -r --cached src/assets/photos/ 2>/dev/null || true

# 3. 提交
git add .gitignore
git commit -m "chore: migrate photos to Cloudflare R2"
git push origin main
```

#### 步骤 7：重新构建

```bash
# 使用 R2 重新生成 manifest
rm src/data/photos-manifest.json
pnpm build:photos

# 检查 manifest
cat src/data/photos-manifest.json | grep "originalUrl" | head -3
```

应该看到 R2 的 URL：
```json
"originalUrl": "https://pub-xxxxx.r2.dev/photos/sichuan/IMG_20251007_134904.jpg"
```

#### 步骤 8：测试访问

```bash
# 测试照片 URL
curl -I "$(cat src/data/photos-manifest.json | jq -r '.data[0].originalUrl')"

# 应该返回 200 OK

# 启动 dev 测试
pnpm dev
# 访问 http://localhost:2323/photos
```

---

## 🎨 自定义域名配置（推荐）

### 为什么需要自定义域名？

- ✅ 更专业：`photos.your-domain.com`
- ✅ 避免 R2 域名变化
- ✅ 更好的 SEO
- ✅ HTTPS 自动配置

### 配置步骤

#### 1. 在 Cloudflare 中添加域名

1. **R2** → **my-blog-photos** → **Settings** → **Custom Domains**
2. 点击：**Connect Domain**
3. 输入：`photos.your-domain.com`
4. 点击：**Continue**

#### 2. 添加 DNS 记录

如果域名在 Cloudflare（自动）：
- ✅ 自动添加 CNAME 记录
- ✅ 自动配置 SSL

如果域名在其他服务商：
- 添加 CNAME 记录：
  ```
  photos.your-domain.com → my-blog-photos.r2.dev
  ```

#### 3. 等待生效（1-5 分钟）

```bash
# 测试
curl -I https://photos.your-domain.com/test.jpg
```

#### 4. 更新环境变量

```bash
# .env.local
R2_PUBLIC_URL=https://photos.your-domain.com
```

---

## 📦 批量操作命令

### 使用 wrangler

```bash
# 上传单个文件
wrangler r2 object put my-blog-photos/photos/test.jpg --file=public/photos/test.jpg

# 上传目录（递归）
cd public/photos
find . -type f | while read file; do
    wrangler r2 object put "my-blog-photos/photos/${file#./}" --file="$file"
done
cd ../..

# 列出文件
wrangler r2 object list my-blog-photos --prefix=photos/

# 下载文件
wrangler r2 object get my-blog-photos/photos/test.jpg --file=downloaded.jpg

# 删除文件
wrangler r2 object delete my-blog-photos/photos/test.jpg
```

### 使用 AWS CLI（S3 兼容）

```bash
# 安装 AWS CLI
brew install awscli

# 配置 R2 endpoint
aws configure set aws_access_key_id $R2_ACCESS_KEY_ID
aws configure set aws_secret_access_key $R2_SECRET_ACCESS_KEY

# 同步上传
aws s3 sync public/photos/ s3://my-blog-photos/photos/ \
  --endpoint-url "https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"

# 列出文件
aws s3 ls s3://my-blog-photos/photos/ \
  --endpoint-url "https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
```

---

## 🔒 安全配置

### 1. API Token 权限最小化

创建 API Token 时：
- ✅ 只选择必要的 bucket
- ✅ 只给 Read & Write 权限
- ✅ 不给 Admin 权限

### 2. 配置 CORS（如果需要）

```bash
# 使用 wrangler 配置 CORS
wrangler r2 bucket cors put my-blog-photos --config=cors.json
```

```json
// cors.json
[
  {
    "AllowedOrigins": ["https://your-domain.com"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

### 3. 配置缓存规则

在 Cloudflare Dashboard：
1. **Cache** → **Configuration**
2. **Browser Cache TTL**: 1 year
3. **Edge Cache TTL**: 1 month

---

## 📊 成本估算（你的项目）

### 存储成本

```
照片大小：607 MB
免费额度：10 GB
使用率：6.07%

成本：$0/月 ✅
```

### 出站流量成本

```
访问量：任意
出站流量：无限制
Cloudflare CDN：免费

成本：$0/月 ✅✅✅
```

### 总成本

```
总计：$0/月（完全免费）🎉
```

---

## 🆚 与 Git LFS 对比

### Git LFS（GitHub）

| 项目 | 成本 |
|------|------|
| 存储（607 MB） | $0 ✅ |
| 带宽（1 GB/月） | $0 ✅ |
| 带宽（>1 GB/月） | $5-15/月 ❌ |
| **预估总成本** | **$0-15/月** |

### Cloudflare R2

| 项目 | 成本 |
|------|------|
| 存储（607 MB） | $0 ✅ |
| 带宽（无限） | $0 ✅✅✅ |
| **总成本** | **$0/月** 🎉 |

**Cloudflare R2 完全免费！**

---

## 🎯 额外优势

### 1. 全球 CDN 加速

- ✅ 照片访问速度更快
- ✅ 用户体验更好
- ✅ 自动优化

### 2. Git 仓库轻量

```
迁移前：
.git/ → 800 MB (包含照片历史)

迁移后：
.git/ → 50 MB (只有代码)

git clone 速度：提升 16 倍！🚀
```

### 3. 易于扩展

- ✅ 添加新照片：直接上传到 R2
- ✅ 删除照片：从 R2 删除
- ✅ 不影响 Git 仓库

### 4. 备份简单

```bash
# 下载所有照片备份
rclone sync r2:my-blog-photos/photos/ ./backup/photos/
```

---

## 🔄 迁移后的工作流

### 添加新照片

```bash
# 方式 1：本地添加 + builder 自动上传
cp ~/Downloads/new-photo.jpg src/assets/photos/
pnpm build:photos
# Builder 会自动上传到 R2

# 方式 2：直接上传到 R2
wrangler r2 object put my-blog-photos/photos/new-photo.jpg --file=new-photo.jpg
pnpm build:photos
```

### 删除照片

```bash
# 从 R2 删除
wrangler r2 object delete my-blog-photos/photos/old-photo.jpg

# 重新构建 manifest
pnpm build:photos
```

### 更新照片

```bash
# 覆盖上传
wrangler r2 object put my-blog-photos/photos/photo.jpg --file=new-version.jpg

# 强制重建
pnpm build:photos:force
```

---

## 🐛 常见问题

### Q: 上传很慢怎么办？

**优化方案**：
```bash
# 使用 rclone（更快，支持并发）
rclone sync public/photos/ r2:my-blog-photos/photos/ \
  --progress \
  --transfers=10 \
  --checkers=20
```

### Q: 如何配置 CDN 缓存？

**在 Cloudflare Dashboard**：
1. Cache → Configuration
2. Browser Cache TTL: 1 year
3. Edge Cache TTL: 1 month

### Q: 可以私有访问吗？

**可以！** 使用预签名 URL：

```typescript
// 在 Builder 中生成预签名 URL
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const command = new GetObjectCommand({
  Bucket: 'my-blog-photos',
  Key: 'photos/private-photo.jpg',
});

const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
// url 有效期 1 小时
```

### Q: 如何回滚到本地存储？

```bash
# 1. 从 R2 下载所有照片
rclone sync r2:my-blog-photos/photos/ public/photos/

# 2. 恢复 builder 配置
# 改回 local provider

# 3. 重新构建
pnpm build:photos:force
```

---

## 📊 性能对比

### Git Push 速度

| 方案 | 大小 | 时间 |
|------|------|------|
| **原始（Git）** | 607 MB | 5-10 分钟 |
| **Git LFS** | 几 KB | 5-10 秒 |
| **R2** | 0 字节 | **2-3 秒** ⚡⚡⚡ |

### Git Clone 速度

| 方案 | 下载大小 | 时间 |
|------|---------|------|
| **原始（Git）** | 800 MB | 10-20 分钟 |
| **Git LFS** | 50 MB + 607 MB LFS | 5 分钟 |
| **R2** | **50 MB** | **30 秒** ⚡⚡⚡ |

**R2 方案最快！**

---

## 💰 长期成本预估

### 未来 1 年（假设增长到 5 GB）

| 方案 | 存储成本 | 流量成本 | 总成本 |
|------|---------|---------|--------|
| **GitHub LFS** | $0 (< 1GB) | $5-15/月 | **$60-180/年** |
| **AWS S3** | $1.15/月 | $10-20/月 | **$133-254/年** |
| **Cloudflare R2** | $0 (< 10GB) | $0 | **$0/年** ✅✅✅ |

**Cloudflare R2 完全免费！**

---

## 🎯 推荐配置

### 开发环境

```bash
# 1. 本地保留照片（开发使用）
src/assets/photos/ (不提交到 Git)

# 2. Builder 上传到 R2
pnpm build:photos
```

### 生产环境

```bash
# 1. 只保留 R2 上的照片
# 2. 本地删除原图（节省空间）
rm -rf public/photos/

# 3. Builder 从 R2 读取
pnpm build:photos
```

---

## 🔗 与其他工具集成

### Next.js Image Component

```typescript
// next.config.ts
const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-xxxxx.r2.dev', // R2 公共域名
      },
      {
        protocol: 'https',
        hostname: 'photos.your-domain.com', // 自定义域名
      },
    ],
  },
};
```

### Vercel 部署

```bash
# 在 Vercel 项目设置中添加环境变量
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=my-blog-photos
R2_PUBLIC_URL=https://photos.your-domain.com
```

### Docker 部署

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# 环境变量
ENV R2_ACCOUNT_ID=${R2_ACCOUNT_ID}
ENV R2_ACCESS_KEY_ID=${R2_ACCESS_KEY_ID}
ENV R2_SECRET_ACCESS_KEY=${R2_SECRET_ACCESS_KEY}

# 构建
RUN pnpm build:photos
RUN pnpm build

CMD ["pnpm", "start"]
```

---

## 📚 相关资源

### 官方文档
- [Cloudflare R2 文档](https://developers.cloudflare.com/r2/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [R2 定价](https://developers.cloudflare.com/r2/pricing/)

### 工具
- [rclone](https://rclone.org/) - 强大的云存储同步工具
- [s3cmd](https://s3tools.org/s3cmd) - S3 命令行工具

---

## 🎉 总结

### Cloudflare R2 优势

✅ **完全免费**（10GB 内）
- 你的 607 MB 完全免费
- 出站流量完全免费
- 无隐藏费用

✅ **性能优秀**
- 全球 CDN
- 延迟极低
- Git 仓库轻量

✅ **易于使用**
- S3 兼容 API
- 友好的网页界面
- 强大的 CLI 工具

### 与 Git LFS 对比

| 指标 | Git LFS | Cloudflare R2 |
|------|---------|---------------|
| **存储成本** | $0 (< 1GB) | $0 (< 10GB) |
| **带宽成本** | $5-15/月 | **$0** ✅ |
| **Git 仓库大小** | 大 | **小** ✅ |
| **Clone 速度** | 慢 | **快** ✅ |
| **推荐度** | ⭐⭐⭐ | **⭐⭐⭐⭐⭐** |

### 立即开始

```bash
cd /Users/suqingyao/workspace/blog-next

# 使用自动化脚本
bash scripts/migrate-to-cloud-storage.sh cloudflare-r2

# 或手动配置
npm install -g wrangler
wrangler login
wrangler r2 bucket create my-blog-photos
bash scripts/upload-to-r2.sh
```

---

**创建日期**：2026-01-13  
**适用于**：607 MB 照片项目  
**推荐度**：⭐⭐⭐⭐⭐

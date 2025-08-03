# 生产环境静态资源404问题修复

## 问题描述

在生产环境中，Next.js应用的静态资源（CSS、JS、字体文件等）出现404错误：

```
GET http://47.120.36.110/_next/static/css/08b4f43aa77ec1d1.css net::ERR_ABORTED 404 (Not Found)
GET http://47.120.36.110/_next/static/chunks/webpack-980d70bbb30b3a78.js net::ERR_ABORTED 404 (Not Found)
...
```

## 问题原因

nginx配置中存在冲突的静态文件处理规则：

1. **错误的静态文件匹配规则**：原配置中的 `location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$` 规则会拦截所有静态文件，但没有正确代理到Next.js应用
2. **缺少_next/static/路径处理**：Next.js的构建产物存放在 `_next/static/` 路径下，需要专门的nginx规则处理
3. **root指令冲突**：使用了 `root /app/public` 但容器内实际路径可能不匹配

## 解决方案

### 1. 修复nginx配置

已修复 `nginx.conf` 文件，主要改动：

```nginx
# Next.js 静态资源缓存
location /_next/static/ {
    proxy_pass http://127.0.0.1:2323;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
}

# 公共静态资源缓存
location ~* ^/(images|photos|sounds|avatar\.png|broken-image\.png|next\.svg|vercel\.svg|favicon\.ico) {
    proxy_pass http://127.0.0.1:2323;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    expires 30d;
    add_header Cache-Control "public, no-transform";
    add_header Vary Accept-Encoding;
}
```

### 2. 关键修复点

- **专门处理 `/_next/static/` 路径**：确保Next.js构建的静态资源正确代理
- **移除冲突的通用静态文件规则**：避免拦截Next.js的静态资源
- **保持代理设置**：所有静态资源都通过代理访问Next.js应用
- **优化缓存策略**：Next.js静态资源设置1年缓存，公共资源30天缓存

## 重新部署步骤

### 方法1：通过GitHub Actions自动部署

1. 提交并推送代码到main分支：
```bash
git add .
git commit -m "fix: nginx static assets 404 issue"
git push origin main
```

2. GitHub Actions会自动：
   - 构建新的Docker镜像
   - 上传nginx配置到服务器
   - 重新加载nginx配置
   - 部署新容器

### 方法2：手动部署

如果需要立即修复，可以手动更新nginx配置：

```bash
# 1. 登录服务器
ssh root@47.120.36.110

# 2. 备份当前nginx配置
cp /etc/nginx/sites-available/nginx.conf /etc/nginx/sites-available/nginx.conf.backup

# 3. 上传新的nginx配置文件到服务器
# (通过scp或直接编辑)

# 4. 测试nginx配置
nginx -t

# 5. 重新加载nginx
systemctl reload nginx

# 6. 重启应用容器（可选，确保完全生效）
cd /root/workspace/blog-next
docker compose restart
```

## 验证修复

部署完成后，访问 `http://47.120.36.110` 检查：

1. 页面是否正常加载
2. 浏览器开发者工具Network面板中是否还有404错误
3. 静态资源是否正确返回200状态码

## 预防措施

1. **本地测试**：在本地使用Docker环境测试nginx配置
2. **分阶段部署**：先在测试环境验证配置
3. **监控日志**：定期检查nginx和应用日志
4. **配置版本控制**：确保nginx配置变更都通过Git管理

## 相关文件

- `nginx.conf` - nginx配置文件
- `docker-compose.yml` - Docker容器配置
- `Dockerfile` - Docker镜像构建配置
- `.github/workflows/docker-deploy.yml` - CI/CD部署流程
# GitHub Actions 工作流优化说明

## 优化内容

### 1. 添加并发控制 (Concurrency Control)

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

**作用：**
- 当有新的代码推送到同一分支时，会自动取消之前正在运行的工作流
- 避免多个部署任务同时运行，节省资源和时间
- 确保只有最新的代码变更会被部署

**工作原理：**
- `group`: 使用工作流名称和分支引用作为组标识符
- `cancel-in-progress: true`: 启用自动取消功能
- 当新的工作流启动时，同组的旧工作流会被自动取消

### 2. .env 文件的作用说明

**.env 文件确实有实际用途：**

1. **Docker Compose 环境变量注入**
   ```yaml
   # docker-compose.yml 中的环境变量引用
   environment:
     - SPARK_API_PASSWORD=${SPARK_API_PASSWORD}
     - OSS_ACCESS_KEY_ID=${OSS_ACCESS_KEY_ID}
     # ... 其他环境变量
   ```

2. **运行时配置**
   - Docker Compose 会自动读取 `.env` 文件中的变量
   - 这些变量会被注入到容器的环境中
   - Next.js 应用在运行时会使用这些环境变量

3. **安全性**
   - 敏感信息（API密钥、数据库密码等）不会硬编码在代码中
   - 通过 GitHub Secrets 安全传递到服务器
   - `.env` 文件权限设置为 `600`，只有所有者可读写

## 工作流程说明

### 部署流程

1. **代码推送触发**
   - 推送到 `main` 分支时自动触发
   - 如有正在运行的工作流会被取消

2. **Docker 镜像构建**
   - 构建新的 Docker 镜像
   - 推送到阿里云容器镜像服务

3. **服务器配置更新**
   - 上传 `nginx.conf` 配置文件
   - 重新加载 Nginx 配置

4. **应用部署文件准备**
   - 上传 `deploy.sh` 部署脚本
   - 上传 `docker-compose.yml` 配置文件
   - **创建 `.env` 文件**（包含所有环境变量）

5. **应用部署**
   - 执行部署脚本
   - 停止旧容器，启动新容器
   - 新容器会读取 `.env` 文件中的环境变量

### 环境变量使用链路

```
GitHub Secrets → GitHub Actions → 服务器 .env 文件 → Docker Compose → 容器环境变量 → Next.js 应用
```

## 优化效果

### 1. 资源节省
- 避免多个构建任务同时运行
- 减少不必要的服务器资源消耗
- 缩短总体部署时间

### 2. 部署可靠性
- 确保只有最新代码被部署
- 避免旧版本覆盖新版本的情况
- 减少部署冲突

### 3. 开发体验
- 快速迭代时不需要等待旧的构建完成
- 立即开始最新代码的构建和部署
- 更快的反馈循环

## 注意事项

1. **环境变量安全**
   - 确保所有敏感信息都通过 GitHub Secrets 管理
   - 不要在代码中硬编码任何密钥或密码

2. **部署监控**
   - 关注 GitHub Actions 的执行日志
   - 确认部署成功后再进行功能测试

3. **回滚准备**
   - 保持之前版本的镜像标签
   - 必要时可以快速回滚到稳定版本
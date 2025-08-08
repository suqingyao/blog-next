# 博客内容管理脚本

本目录包含了用于管理博客内容的各种脚本，包括检查文章是否支持搜索和 AI 摘要、生成搜索索引和 AI 摘要等。

## 脚本列表

### check-posts.js

检查所有已发布的文章是否支持搜索和 AI 摘要。

```bash
# 检查文章并报告问题
pnpm check:posts

# 在 git hooks 中使用，自动创建临时文件
pnpm check:posts:hooks
```

### generate-search-index.js

生成搜索索引，用于全文搜索功能。

```bash
pnpm generate:search-index
```

### generate-summaries.js

生成文章的 AI 摘要。

```bash
# 生成缺失的摘要
pnpm generate:summaries

# 强制重新生成临时摘要
pnpm generate:summaries:force
```

> 注意：当使用 git hooks 自动创建临时摘要后，需要使用 `pnpm generate:summaries:force` 命令来替换这些临时摘要。

## Git Hooks 配置

本项目使用 `simple-git-hooks` 配置了 `pre-push` 钩子，在 `git push` 前自动检查所有已发布的文章是否支持搜索和 AI 摘要。如果发现问题，会自动创建临时文件，以便 `git push` 能够继续执行，但会提示用户在开发环境中运行相应命令生成正式索引和摘要。

### 配置方式

1. 在 `package.json` 中添加以下配置：

```json
{
  "simple-git-hooks": {
    "pre-push": "pnpm check:posts:hooks"
  }
}
```

2. 运行以下命令安装 git hooks：

```bash
pnpm prepare
```

### 工作流程

1. 当你运行 `git push` 时，`pre-push` 钩子会自动运行 `pnpm check:posts:hooks`。
2. 如果所有文章都支持搜索和 AI 摘要，`git push` 会正常执行。
3. 如果发现问题，脚本会自动创建临时文件，并允许 `git push` 继续执行，但会提示你在开发环境中运行相应命令生成正式索引和摘要。
4. 在开发环境中，你可以运行 `pnpm generate:search-index` 和 `pnpm generate:summaries` 来生成正式索引和摘要。
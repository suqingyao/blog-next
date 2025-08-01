# Blog Next 项目介绍

## 📖 项目概述

Blog Next 是一个基于 Next.js 14 构建的现代化个人博客系统，采用 App Router 架构，支持 MDX 内容管理，具备先进的搜索功能和优雅的用户界面。

## 🏗️ 项目结构

### 核心目录结构

```
blog-next/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── api/                # API 路由
│   │   │   ├── feed/          # RSS Feed API
│   │   │   ├── search/        # 搜索 API
│   │   │   └── ai/            # AI 相关 API
│   │   ├── posts/             # 文章页面
│   │   ├── photos/            # 相册页面
│   │   └── layout.tsx         # 根布局
│   ├── components/             # React 组件
│   │   ├── application/       # 应用级组件
│   │   ├── search/            # 搜索组件
│   │   ├── ui/                # 基础 UI 组件
│   │   └── common/            # 通用组件
│   ├── lib/                   # 工具库
│   │   ├── site.ts           # 站点配置
│   │   ├── highlighter.ts    # 代码高亮
│   │   └── utils.ts          # 工具函数
│   ├── models/                # 数据模型
│   │   └── post.model.ts     # 文章模型
│   ├── hooks/                 # React Hooks
│   ├── constants/             # 常量配置
│   ├── styles/                # 样式文件
│   └── markdown/              # Markdown 处理
├── posts/                     # MDX 文章内容
├── public/                    # 静态资源
├── scripts/                   # 构建脚本
└── 配置文件
```

### 关键配置文件

- `next.config.ts` - Next.js 配置
- `tailwind.config.ts` - Tailwind CSS 配置
- `package.json` - 项目依赖和脚本
- `tsconfig.json` - TypeScript 配置

## 🚀 技术栈

### 前端框架
- **Next.js 15** - React 全栈框架，使用 App Router
- **TypeScript** - 类型安全的 JavaScript
- **React 18** - 用户界面库

### 样式和动画
- **Tailwind CSS** - 原子化 CSS 框架
- **Motion** - 现代动画库
- **@egoist/tailwindcss-icons** - 图标系统

### 内容管理
- **MDX** - Markdown + React 组件
- **Gray Matter** - Frontmatter 解析
- **Shiki** - 代码语法高亮
- **KaTeX** - 数学公式渲染
- **Mermaid** - 图表渲染

### 状态管理和数据
- **Jotai** - 原子化状态管理
- **TanStack Query** - 数据获取和缓存
- **Algolia** - 搜索服务（可选）

### 开发工具
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **pnpm** - 包管理器

## ✨ 核心功能

### 1. 内容管理系统

#### MDX 支持
- 支持 Markdown 语法编写文章
- 可在文章中嵌入 React 组件
- 自动解析 Frontmatter 元数据
- 支持代码块语法高亮
- 支持数学公式和图表

#### 文章功能
- 文章分类和标签
- 发布状态控制
- 创建时间管理
- AI 自动摘要生成
- 文章摘要缓存

### 2. 搜索系统

#### 本地搜索
- 实时搜索结果
- 键盘快捷键支持 (⌘K)
- 搜索结果高亮
- 模糊匹配算法

#### 搜索功能
- 标题搜索
- 内容全文搜索
- 标签搜索
- 搜索历史记录

### 3. 用户界面

#### 响应式设计
- 移动端优先设计
- 自适应布局
- 触摸友好的交互

#### 主题系统
- 深色/浅色主题切换
- 系统主题自动检测
- 主题状态持久化

#### 导航系统
- 固定顶部导航栏
- 页面标题动态显示
- 滚动状态感知
- 面包屑导航

### 4. RSS 订阅

#### Feed 功能
- 标准 RSS 2.0 格式
- 自动生成文章摘要
- XSS 安全过滤
- 缓存优化

### 5. 相册系统

#### 图片管理
- 图片懒加载
- 图片压缩优化
- 相册分类展示
- 图片预览功能

### 6. 性能优化

#### 构建优化
- 静态生成 (SSG)
- 增量静态再生 (ISR)
- 代码分割
- 图片优化

#### 缓存策略
- 文章内容缓存
- 搜索索引缓存
- AI 摘要缓存
- 浏览器缓存优化

## 🛠️ 开发脚本

### 基础命令
```bash
pnpm dev              # 启动开发服务器 (端口 2323)
pnpm build            # 构建生产版本
pnpm start            # 启动生产服务器
pnpm lint             # 代码检查
pnpm lint:fix         # 自动修复代码问题
```

### 内容管理
```bash
pnpm new:post                    # 创建新文章
pnpm generate:summaries          # 生成文章摘要
pnpm generate:search-index       # 生成搜索索引
pnpm compress:images             # 压缩图片
```

### Algolia 搜索
```bash
pnpm setup:algolia              # 设置 Algolia
pnpm init:algolia               # 初始化 Algolia
pnpm upload:algolia             # 上传数据到 Algolia
```

## 🔧 配置说明

### 环境变量
- `NEXT_PUBLIC_OUR_DOMAIN` - 网站域名
- `NEXT_PUBLIC_VERCEL_URL` - Vercel 部署 URL
- Algolia 相关配置（可选）
- AI 服务配置（可选）

### 自定义配置
- 应用名称和描述在 `src/constants/app.ts`
- 导航链接在 `src/components/application/app-navbar.tsx`
- 主题配置在 `tailwind.config.ts`

## 📝 内容创作

### 文章格式
```yaml
---
title: "文章标题"
summary: "文章摘要"
createdTime: "2024-01-01"
tags: ["标签1", "标签2"]
published: true
---

# 文章内容

这里是文章正文...
```

### 支持的组件
- 代码块高亮
- 数学公式 (KaTeX)
- Mermaid 图表
- 自定义 React 组件
- 图片懒加载
- 链接预览

## 🚀 部署

### Vercel 部署
1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署

### 自定义部署
1. 构建项目：`pnpm build`
2. 启动服务：`pnpm start`
3. 配置反向代理（可选）

## 🎯 特色亮点

1. **现代化架构** - 基于 Next.js 15 App Router，性能优异
2. **开发体验** - TypeScript + ESLint + Prettier，代码质量保证
3. **内容优先** - MDX 支持，写作体验流畅
4. **搜索体验** - 快速本地搜索，支持键盘快捷键
5. **视觉设计** - 简洁现代的界面，支持深色模式
6. **性能优化** - 多层缓存策略，加载速度快
7. **SEO 友好** - 静态生成，搜索引擎优化
8. **可扩展性** - 模块化设计，易于定制和扩展

这个博客系统适合个人开发者、技术博主和内容创作者使用，提供了完整的博客功能和优秀的用户体验。
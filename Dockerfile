# 选择官方 Node 镜像
FROM node:18-alpine AS builder

WORKDIR /app

# 拷贝依赖文件并安装依赖
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# 拷贝全部代码并构建
COPY . .
RUN pnpm build

# 生产环境镜像
FROM node:18-alpine AS runner

WORKDIR /app

# 只拷贝生产依赖和构建产物
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
EXPOSE 2323

CMD ["pnpm", "start"]
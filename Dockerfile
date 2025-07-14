# 选择官方 Node 镜像
FROM node:22-alpine AS builder

# ARG OSS_ACCESS_KEY_ID
# ARG OSS_ACCESS_KEY_SECRET
# ARG NEXT_PUBLIC_OSS_REGION
# ARG NEXT_PUBLIC_OSS_BUCKET

# ENV OSS_ACCESS_KEY_ID=$OSS_ACCESS_KEY_ID
# ENV OSS_ACCESS_KEY_SECRET=$OSS_ACCESS_KEY_SECRET
# ENV NEXT_PUBLIC_OSS_REGION=$NEXT_PUBLIC_OSS_REGION
# ENV NEXT_PUBLIC_OSS_BUCKET=$NEXT_PUBLIC_OSS_BUCKET

WORKDIR /app

# 拷贝依赖文件并安装依赖
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# 拷贝全部代码并构建
COPY . .
RUN pnpm build

# 生产环境镜像
FROM node:22-alpine AS runner

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 只拷贝生产依赖和构建产物
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
EXPOSE 2323

CMD ["pnpm", "start", "-p", "2323"]
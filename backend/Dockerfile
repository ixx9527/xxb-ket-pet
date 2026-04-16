# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建
RUN npm run build

# 运行阶段
FROM node:20-alpine

WORKDIR /app

# 只复制生产依赖和构建产物
COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

# 暴露端口
EXPOSE 3000

# 启动
CMD ["node", "dist/main.js"]

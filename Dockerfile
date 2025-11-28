FROM node:18-alpine

# 安裝必要工具和 PM2
RUN apk add --no-cache curl
RUN npm install pm2 -g

# 設定工作目錄
WORKDIR /app

# 複製 package 檔案
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製源代碼
COPY . .

# 建置應用
RUN npm run build

# 建立日誌目錄
RUN mkdir -p logs

# 暴露端口
EXPOSE 8080

# 設定環境變數
ENV NODE_ENV=production
ENV PORT=8080

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
	CMD curl -f http://localhost:8080/health || exit 1

# 使用配置檔案啟動
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
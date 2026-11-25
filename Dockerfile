FROM node:20-alpine
WORKDIR /app
COPY bot/package*.json ./bot/
WORKDIR /app/bot
RUN npm install --omit=dev --no-audit --no-fund
WORKDIR /app
COPY bot/ ./bot/
WORKDIR /app/bot
RUN mkdir -p data
ENV NODE_ENV=production
CMD ["node", "src/index.js"]

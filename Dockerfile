FROM node:24-slim AS builder
WORKDIR /app
COPY . .

WORKDIR /app/backend
RUN npm ci
RUN npm run build

FROM node:24-slim
WORKDIR /app

COPY --from=builder /app/backend/package*.json ./
COPY --from=builder /app/backend/dist ./dist

RUN npm ci --omit=dev

EXPOSE 3000
CMD ["node", "dist/main"]
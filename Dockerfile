FROM node:24-slim AS builder
WORKDIR /usr/src/app
COPY . .
RUN npm ci --prefix backend
RUN npm run build --prefix backend

FROM node:24-slim
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/backend/package*.json ./
COPY --from=builder /usr/src/app/backend/dist ./dist

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "dist/main"]
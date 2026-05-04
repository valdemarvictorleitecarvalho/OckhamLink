FROM node:24-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/

RUN npm ci --prefix backend

COPY backend/ ./backend/

WORKDIR /app/backend
RUN npx tsc -p tsconfig.build.json

FROM node:24-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/backend/package*.json ./
COPY --from=builder /app/backend/dist ./dist

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "dist/main"]
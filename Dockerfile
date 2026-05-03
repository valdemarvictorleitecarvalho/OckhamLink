FROM node:24-slim AS builder

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build --prefix backend

RUN npm prune --omit=dev

FROM node:24-slim

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

RUN rm -rf frontend

EXPOSE 3000

CMD ["npm", "run", "start:prod", "--prefix", "backend"]
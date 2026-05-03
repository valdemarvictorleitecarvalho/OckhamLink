FROM node:24-slim AS builder

WORKDIR /usr/src/app

COPY . .

RUN npm ci --prefix backend

RUN npm run build --prefix backend

FROM node:24-slim

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

RUN npm ci --omit=dev --prefix backend

RUN rm -rf frontend

EXPOSE 3000

CMD ["npm", "run", "start:prod", "--prefix", "backend"]
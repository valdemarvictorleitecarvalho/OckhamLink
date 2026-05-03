FROM node:24-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build && test -d dist || (echo "Error: Dist folder was not generated!" && exit 1)

FROM node:24-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
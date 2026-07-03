FROM node:24-alpine as builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate

RUN pnpm run build

FROM node:24-alpine as production

ENV NODE_ENV=production

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY --from=builder /app/dist ./

COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/src/generated ./src/generated

EXPOSE 5500

CMD [ "node", "src/server.js" ]
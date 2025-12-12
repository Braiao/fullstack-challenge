FROM node:18-alpine AS base
WORKDIR /app

COPY package*.json ./
COPY turbo.json ./
COPY packages ./packages

FROM base AS development
COPY apps/notifications-service/package*.json ./apps/notifications-service/
RUN npm install
COPY apps/notifications-service ./apps/notifications-service
WORKDIR /app/apps/notifications-service
CMD ["npm", "run", "dev"]

FROM base AS builder
COPY apps/notifications-service/package*.json ./apps/notifications-service/
RUN npm install -w notifications-service
COPY apps/notifications-service ./apps/notifications-service
WORKDIR /app/apps/notifications-service
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/apps/notifications-service/dist ./dist
COPY --from=builder /app/apps/notifications-service/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]

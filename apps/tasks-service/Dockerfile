FROM node:18-alpine AS base
WORKDIR /app

COPY package*.json ./
COPY turbo.json ./
COPY packages ./packages

FROM base AS development
COPY apps/tasks-service/package*.json ./apps/tasks-service/
RUN npm install
COPY apps/tasks-service ./apps/tasks-service
WORKDIR /app/apps/tasks-service
CMD ["npm", "run", "dev"]

FROM base AS builder
COPY apps/tasks-service/package*.json ./apps/tasks-service/
RUN npm install -w tasks-service
COPY apps/tasks-service ./apps/tasks-service
WORKDIR /app/apps/tasks-service
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/apps/tasks-service/dist ./dist
COPY --from=builder /app/apps/tasks-service/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]

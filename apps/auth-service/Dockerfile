FROM node:18-alpine AS base
WORKDIR /app

COPY package*.json ./
COPY turbo.json ./
COPY packages ./packages

FROM base AS development
COPY apps/auth-service/package*.json ./apps/auth-service/
RUN npm install
COPY apps/auth-service ./apps/auth-service
WORKDIR /app/apps/auth-service
CMD ["npm", "run", "dev"]

FROM base AS builder
COPY apps/auth-service/package*.json ./apps/auth-service/
RUN npm install -w auth-service
COPY apps/auth-service ./apps/auth-service
WORKDIR /app/apps/auth-service
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/apps/auth-service/dist ./dist
COPY --from=builder /app/apps/auth-service/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]

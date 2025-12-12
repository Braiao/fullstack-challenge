FROM node:18-alpine AS base
WORKDIR /app

COPY package*.json ./
COPY turbo.json ./
COPY packages ./packages

FROM base AS development
COPY apps/api-gateway/package*.json ./apps/api-gateway/
RUN npm install
COPY apps/api-gateway ./apps/api-gateway
WORKDIR /app/apps/api-gateway
CMD ["npm", "run", "dev"]

FROM base AS builder
COPY apps/api-gateway/package*.json ./apps/api-gateway/
RUN npm install -w api-gateway
COPY apps/api-gateway ./apps/api-gateway
WORKDIR /app/apps/api-gateway
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY --from=builder /app/apps/api-gateway/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]

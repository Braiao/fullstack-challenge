FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web

FROM base AS development
RUN npm install
WORKDIR /app/apps/web
CMD ["npm", "run", "dev"]

FROM base AS builder
RUN npm install
WORKDIR /app/apps/web
RUN npm run build

FROM nginx:alpine AS production
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

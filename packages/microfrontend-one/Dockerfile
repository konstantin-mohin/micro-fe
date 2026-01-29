# ==========================================
# STAGE 1: Pruner
# ==========================================
FROM node:20-alpine AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=microfrontend-one --docker

# ==========================================
# STAGE 2: Builder
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

# Copy json files
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY --from=pruner /app/out/full/ .

# Build the project
RUN pnpm turbo run build --filter=microfrontend-one

# ==========================================
# STAGE 3: Runner
# ==========================================
FROM nginx:alpine AS runner
COPY --from=builder /app/packages/microfrontend-one/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
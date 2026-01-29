# ==========================================
# STAGE 1: Pruner
# ==========================================
FROM node:20-alpine AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=server --docker

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
RUN pnpm turbo run build --filter=server

# ==========================================
# STAGE 3: Runner
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

# Copy the built server and node_modules
COPY --from=builder /app/packages/server/dist ./packages/server/dist
COPY --from=builder /app/packages/server/package.json ./packages/server/package.json
COPY --from=builder /app/out/json/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD [ "node", "packages/server/dist/index.js" ]
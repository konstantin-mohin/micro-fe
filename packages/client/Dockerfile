# ==========================================
# STAGE 1: Pruner
# Goal: Create a partial monorepo with only the "client" and its dependencies
# ==========================================
FROM node:20-alpine AS pruner
WORKDIR /app
# Install turbo globally so we can run the prune command
RUN npm install -g turbo
COPY . .
# This command generates a folder "out" with only the files needed for "client"
# It automatically includes shared packages (e.g., packages/ui) if client uses them!
RUN turbo prune --scope=client --docker

# ==========================================
# STAGE 2: Builder
# Goal: Install dependencies and build the app
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

# A. Copy "json" files first (package.json, lockfile)
# This allows Docker to cache the "pnpm install" step if deps haven't changed
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# B. Install dependencies
RUN pnpm install --frozen-lockfile

# C. Copy the source code (the "full" folder from pruner)
COPY --from=pruner /app/out/full/ .

# D. Build the project
# Note: We filter for client, but Turbo will build dependencies first if needed
RUN pnpm turbo run build --filter=client

# ==========================================
# STAGE 3: Runner
# Goal: Serve the static files with Nginx
# ==========================================
FROM nginx:alpine AS runner

# Copy the built assets from the builder stage
# CHECK THIS PATH: Verify if your build output is in "packages/client/dist" 
# or "apps/client/dist" depending on your folder structure.
COPY --from=builder /app/packages/client/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
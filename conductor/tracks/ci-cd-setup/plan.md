# Implementation Plan: CI/CD Setup

## Phase 1: Infrastructure & Tooling (Turborepo)
*Goal: Replace manual scripts with Turborepo to handle build orchestration and caching.*

- [x] Install Turborepo: Add turbo as a dev dependency to the workspace root.
- [x] Create turbo.json Config:
    - Define the pipeline for standard tasks: build, test, lint, dev.
    - Crucial: Configure dependsOn to ensure libraries build before apps (e.g., "build": { "dependsOn": ["^build"] }).
    - Define outputs for caching (e.g., dist/**, .next/**, build/**).
- [x] Update Root package.json:
    - Replace concurrently scripts with turbo run dev.
    - Add a build script: "build": "turbo run build".
- [x] Verify Caching: Run pnpm build twice locally. The second run should be near-instant and say FULL TURBO.

## Phase 2: Docker Preparation
*Goal: Ensure every application has a working Dockerfile that respects the pnpm monorepo structure.*

- [x] Create .dockerignore (Root): Exclude node_modules, .git, and local env files to keep images small.
- [x] Create Dockerfiles: Add a Dockerfile to each of the 4 apps:
    - packages/server/Dockerfile
    - packages/client/Dockerfile
    - packages/microfrontend-one/Dockerfile
    - packages/layout/Dockerfile
- [x] Implement "Turbo Prune" (Advanced Requirement):
    - Note: Standard Dockerfiles often fail in monorepos because they can't access shared packages/.
    - Requirement: Use turbo prune --scope=<app-name> --docker inside the Docker build process (or before it) to isolate only the necessary files for that specific app before building the image.

## Phase 3: CI/CD Pipeline Strategy (GitHub Actions)
*Goal: Create a workflow that detects changes and builds Docker images in parallel.*

- [ ] Set up Container Registry:
    - Decision: Use GitHub Container Registry (GHCR). It is built into your GitHub account, private, and free for personal use.
- [ ] Create Workflow File: .github/workflows/ci-cd.yml
- [ ] Define Jobs:
    - Job 1: CI (Quality Check):
        - Run Lint & Test using Turbo: turbo run test lint.
        - (Turbo will automatically skip apps that didn't change).
    - Job 2: Build & Push Images (The "4 Pipelines" Logic):
        - Use a GitHub Actions Matrix strategy. Instead of copying code 4 times, write one job that runs 4 times in parallel.
        - Define the matrix: [server, client, microfrontend-one, layout].
        - Filter Condition: Use turbo run build --filter=${{ matrix.app }}...[origin/main] to check if a build is actually needed.
        - Docker Login: Authenticate with GITHUB_TOKEN.
        - Docker Build: Build the image tagging it with the commit SHA (e.g., ghcr.io/user/server:sha-123).
        - Docker Push: Push the image to the registry.

## Phase 4: Definition of Done (Acceptance Criteria)
- Local Dev: Running pnpm dev starts all apps correctly.
- PR Checks: When a PR is opened, tests run only for affected apps.
- Merge Actions: When code merges to main:
    - Docker images are built only for the apps that changed.
    - Images appear in your GitHub Packages section.
- Zero Conflicts: The implementation must not break the existing local development flow.

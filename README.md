# JS Practice Monorepo

A modern, scalable monorepo demonstration featuring a microfrontend-capable architecture, a headless design system, and robust engineering practices.

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Architecture & Workspace Structure](#2-architecture--workspace-structure)
3. [UI Library & Design System](#3-ui-library--design-system)
4. [Testing Strategy](#4-testing-strategy)
5. [Deployment & CI/CD](#5-deployment--cicd)

---

## 1. Project Overview

This project serves as a comprehensive practice ground for modern web engineering. It demonstrates how to manage multiple applications and shared libraries within a single repository while maintaining high performance, strict type safety, and seamless developer experience.

### Key Technologies
- **Monorepo Management:** Turborepo + pnpm Workspaces
- **Frontend:** React 19, TypeScript, Tailwind CSS 4
- **Bundling:** Webpack 5 (Apps), tsdown (UI Library)
- **Backend:** Node.js (Express)
- **Testing:** Jest, React Testing Library, Playwright (E2E)
- **Design System:** React Aria Components (Headless) + CVA

---

## 2. Architecture & Workspace Structure

### Monorepo (Turborepo)
The project is structured as a **pnpm workspace**, managed by **Turborepo**. This allows for:
- **Parallel Execution:** Running builds, lints, and tests across all packages simultaneously.
- **Remote Caching:** Drastically reducing CI times by caching task outputs.
- **Dependency Sharing:** Managing shared logic and styles efficiently across `packages/`.

**Workspace Map:**
- `packages/client`: The main host application.
- `packages/microfrontend-one`: A remote microfrontend demonstrating Module Federation.
- `packages/server`: Express backend with SSE (Server-Sent Events) support.
- `packages/ui`: The project's Design System (Internal NPM Package).
- `packages/shared`: Common utilities and types.
- `packages/e2e`: Playwright test suite.

### Application Architecture (Feature Sliced Design)
The `client` application follows **Feature Sliced Design (FSD)** principles to ensure maintainability as the project grows:
- **Features:** User-facing functionalities (e.g., `big-list`, `server-driven-ui`).
- **Components:** Shared UI components specific to the application.
- **Lib:** Application-specific utilities (e.g., `queryClient`, `theme`).
- **Routes:** Centralized routing configuration.

### Configuration Management

#### TypeScript Inheritance
We use a **base-extension model** for TypeScript configuration:
- **Root `tsconfig.json`:** Defines the global compiler options, strictness rules, and environment defaults.
- **Package `tsconfig.json`:** Each package extends the root configuration and adds its own specific rules (e.g., `jsx` support for frontend packages).

#### Tailwind CSS Hierarchy
Styling is managed through a centralized configuration strategy:
- **Shared Config:** A root `tailwind.config.js` (or a shared package) defines the theme, plugins, and core design tokens.
- **Local Overrides:** Each package (like `ui` or `client`) consumes the shared config and specifies its own `content` paths to ensure Tailwind only scans relevant files for utility generation.

---

## 3. UI Library & Design System (`packages/ui`)

The `ui` package is the cornerstone of the project's visual identity, built as a high-performance, internal NPM library.

### Bundling & Distribution
Instead of using microfrontend federation, the UI library is pre-compiled using **tsdown** (powered by Rolldown). 
- **Internal NPM Package:** Other apps consume it via standard imports (`import { Button } from 'ui'`).
- **Externalized Dependencies:** To prevent bundle bloat and React Context conflicts, all runtime dependencies (React, React Aria, etc.) are externalized in the build and provided by the host application.

### The "Headless" Approach
We leverage **React Aria Components** to handle the heavy lifting of accessibility, keyboard navigation, and browser behavior. This allows us to focus entirely on the design and styling while ensuring the components are accessible to all users out-of-the-box.

### Component Composition & Styling
Styling is handled via a powerful combination of **Tailwind CSS**, **CVA**, and **tailwind-merge**. This pattern allows for type-safe variants and conflict-free class merging.

#### Code Example: The Button Pattern
Here is how we compose a component using the "Headless" + "Atomic Styling" approach:

```tsx
import { Button as AriaButton, composeRenderProps } from 'react-aria-components';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils'; // Uses clsx + tailwind-merge

const buttonVariants = cva(
  'rounded-button font-medium transition-all duration-200...',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
      },
      size: { md: 'px-6 py-2', lg: 'px-8 py-3' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <AriaButton
      {...props}
      className={composeRenderProps(className, (className, renderProps) => cn(
        buttonVariants({ variant, size }),
        renderProps.isPressed && 'scale-95',
        className // Allows for custom overrides from the consumer
      ))}
    />
  );
}
```

### Storybook
We use **Storybook** for isolated development and documentation of the UI library. It allows developers to test components in various states and variants without needing to run the full application.
- **Run Storybook:** `pnpm --filter ui storybook`

---

## 4. Testing Strategy

Quality is ensured through a multi-layered testing strategy covering everything from individual utilities to full end-to-end user flows.

### Unit & Integration Tests
We use **Jest** and **React Testing Library** for unit and integration testing. Tests are colocated with the code they verify.
- **Run All Tests:** `pnpm turbo run test`
- **Package Specific:** `pnpm --filter ui test`

### End-to-End (E2E) Tests
Comprehensive E2E tests are located in `packages/e2e`, utilizing **Playwright**. These tests verify that the frontend, microfrontends, and backend work together correctly in a production-like environment.
- **Run E2E Tests:** `pnpm turbo run e2e`

---

## 5. Deployment & CI/CD

### GitHub Actions Pipeline
Our CI/CD pipeline (`.github/workflows/ci-cd.yml`) automatically runs on every pull request and push to the `master` branch. It handles:
1. **Linting & Type Checking:** Ensuring code quality and consistency.
2. **Automated Testing:** Running all unit and E2E tests.
3. **Docker Image Generation:** Automatically building and pushing Docker images for `server`, `client`, and `microfrontend-one` to the GitHub Container Registry (GHCR).

### Docker Infrastructure
Each application is containerized using a dedicated `Dockerfile`.
- **Server:** Node.js production environment.
- **Frontend Apps:** Nginx-based containers serving the static Webpack build.

---

*Generated by Gemini CLI - 2026*

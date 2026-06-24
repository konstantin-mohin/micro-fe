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
- **Frontend:** React 19, TypeScript, Tailwind CSS 4, React Query
- **Bundling:** Webpack 5 (Apps), tsdown (UI Library)
- **Backend:** Node.js (Express)
- **Testing:** Jest, MSW (Integration), Playwright (E2E & Component Testing)
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
- **Features:** User-facing functionalities (e.g., `big-list`, `server-driven-ui`, `react-query`).
- **Components:** Shared UI components specific to the application.
- **Lib:** Application-specific utilities (e.g., `queryClient`, `theme`, `virtualization`).
- **Routes:** Centralized routing configuration.

### Configuration Management

#### Microfrontend Architecture & Dynamic Injection
The `client` application acts as a host for microfrontends (e.g., `microfrontend-one`) using Webpack Module Federation. Currently, the remote entry injection is handled dynamically via `window.APP_MANIFEST`. This dynamic approach is particularly important for our **Docker deployments**, allowing us to inject the correct remote URLs at runtime without rebuilding the static assets.
- **How it works:** The host fetches the manifest (often provided by the Docker container environment) and dynamically constructs a `<script>` tag to inject the remote entry based on the provided URL or falls back to local dev ports (e.g., `http://localhost:5174`).
- **TODO [Architecture Improvement]:** Investigate and implement a more robust, declarative approach for remote injection. Potential solutions include using Webpack's native `promise` syntax combined with a dedicated remote loader utility, or leveraging modern module federation management tools (like `@module-federation/enhanced`). The goal is to avoid manual `<script>` tag manipulation and improve error boundaries, while maintaining the runtime flexibility required by our Docker infrastructure.

#### TypeScript Inheritance
We use a **base-extension model** for TypeScript configuration:
- **Root `tsconfig.json`:** Defines the global compiler options, strictness rules, and environment defaults.
- **Package `tsconfig.json`:** Each package extends the root configuration and adds its own specific rules (e.g., `jsx` support for frontend packages).

#### Tailwind CSS Hierarchy
Styling is managed through a centralized configuration strategy:
- **Shared Config:** A root `tailwind.config.js` (or a shared package) defines the theme, plugins, and core design tokens.
- **Local Overrides:** Each package (like `ui` or `client`) consumes the shared config and specifies its own `content` paths to ensure Tailwind only scans relevant files for utility generation.

---

## 3. UI Library & Design System

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
import { Button as AriaButton, ButtonProps as AriaButtonProps, composeRenderProps } from 'react-aria-components';
import { cva, type VariantProps } from 'class-variance-authority';
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

export interface ButtonProps extends AriaButtonProps, VariantProps<typeof buttonVariants> {
  className?: string;
}

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

The project employs a comprehensive, multi-layered testing strategy designed to verify behavior at every level of the application stack.

### 4.1 Unit Testing (Isolated Logic)
Focuses on verifying pure functions and complex business logic in isolation. We extract heavy logic (e.g., virtualization math) into pure utilities to ensure high precision and testability.
- **Tools:** Jest
- **Example:** `packages/client/src/lib/virtualization.test.ts`

### 4.2 Component Testing (Real Browser Isolation)
Verifies complex UI components in a real browser environment but in isolation from the rest of the application. This is ideal for components with complex CSS, animations, or DOM-heavy logic like virtualization.
- **Tools:** Playwright Component Testing (CT)
- **Example:** `packages/client/src/components/VirtualizedList.spec.tsx`

### 4.3 Integration Testing (Consumer Testing)
Tests the interaction between pages and their data sources. We use a "Consumer Testing" strategy where the page is tested with its real data fetching logic (intercepted by MSW) while mocking downstream UI components to focus on data flow and state management.
- **Tools:** Jest, React Testing Library, MSW (Mock Service Worker)
- **Example:** `packages/client/src/features/big-list/BigListPage.test.tsx`

### 4.4 End-to-End (E2E) Testing (User Journey)
Validates the full user journey across multiple applications and services. These tests run against a production-like environment.
- **Tools:** Playwright
- **Example:** `packages/e2e/tests/big-list.spec.ts`

### Running Tests
- **All Tests (Turbo):** `pnpm turbo run test`
- **Unit & Integration:** `cd packages/client && npm test`
- **Component Tests:** `cd packages/client && npx playwright test -c playwright-ct.config.ts`
- **E2E Tests:** `pnpm turbo run e2e`

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

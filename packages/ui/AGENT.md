# UI Package Design System Guidelines

This package is a modern Design System built with **React 19**, **Tailwind CSS 4**, and **React Aria Components**. It uses **CVA (Class Variance Authority)** for styling orchestration.

## 🏗 Architectural Core
1.  **Logic vs. Style**: Always use `react-aria-components` as the functional base. Do not reinvent accessible logic (tabs, overlays, buttons).
2.  **Styling**: Use Tailwind 4 utility classes via the `cva` function.
3.  **Conflict Resolution**: Use the `cn()` utility (`lib/utils.ts`) to merge classes. This combines `clsx` and `tailwind-merge`.

## 🎨 Design Tokens (Tailwind 4)
We use a **CSS-First** approach. Design tokens are defined in `src/index.css` under the `@theme` block.
- **Semantic Colors**: Use `primary`, `secondary`, `surface`, and `border` instead of raw Tailwind colors (like `blue-600`).
- **Radii**: Use `rounded-button` or `rounded-card`.
- **Shadows**: Use `shadow-soft` for a premium look.

## 🛠 Creating a New Component
When creating a component (e.g., `MyComponent.tsx`):

1.  **Define Variants**: Create a `myComponentVariants` constant using `cva` at the top of the file.
2.  **Extend Types**: Export an interface that extends the base element props and `VariantProps<typeof myComponentVariants>`.
3.  **Use React Aria**: Wrap the appropriate React Aria primitive.
4.  **State Styling**: Use React Aria's `renderProps` (e.g., `isHovered`, `isPressed`) inside the `cn()` function to apply state styles.

### Example Template:
```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { MyAriaComponent, type MyAriaProps } from 'react-aria-components';
import { cn } from '../../lib/utils';

const variants = cva('base-classes', {
  variants: {
    intent: { primary: 'bg-primary', secondary: 'bg-secondary' }
  },
  defaultVariants: { intent: 'primary' }
});

export interface MyProps extends MyAriaProps, VariantProps<typeof variants> {}

export function MyComponent({ intent, className, ...props }: MyProps) {
  return (
    <MyAriaComponent
      {...props}
      className={(renderProps) => cn(
        variants({ intent }),
        renderProps.isHovered && 'brightness-110',
        className
      )}
    />
  );
}
```

## 📚 Documentation & Stories
- Every component **must** have a `.stories.tsx` file in its directory.
- Use the `autodocs` tag to generate documentation.
- Ensure the `Layout` decorator is used in `.storybook/preview.tsx` to maintain visual consistency.

## 🚀 Build & Integration
- **Local Dev**: Run `pnpm storybook` for a live playground.
- **Static Build**: `pnpm build-storybook` generates a build in `storybook-static`.
- **Consumption**: The `client` app serves the Storybook build at `/design-system/`.

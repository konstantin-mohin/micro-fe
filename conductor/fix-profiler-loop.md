# Plan: Fix DevProfiler Infinite Loop

The `DevProfiler` component currently suffers from an infinite render loop when enabled. This is because it subscribes to the same store that it updates during the profiling phase, causing a recursive cycle of updates and renders.

## Objective
Decouple the profiling logic from the data subscription to prevent recursive re-renders.

## Key Files & Context
- `packages/client/src/components/DevProfiler.tsx`: The component containing the logic for the profiler and the data store.

## Implementation Steps

### 1. Refactor `DevProfiler.tsx`
- Create a new internal component `ProfilerDisplay` to handle the subscription to `profilerDataStore`.
- Move `useSyncExternalStore` and the overlay visibility logic into `ProfilerDisplay`.
- Update `DevProfiler` to render `ProfilerDisplay` outside of the `<Profiler>` component.
- Remove the redundant `setInterval` logic used for showing the overlay.

## Verification & Testing
- **Manual Verification**: Enable the profiler in the client application and verify that:
    1. The infinite loop is gone.
    2. The profiler overlay appears correctly.
    3. The performance data updates as expected.
    4. The overlay can be closed.

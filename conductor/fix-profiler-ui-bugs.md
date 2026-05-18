# Plan: Fix DevProfiler UI Bugs

The `DevProfiler` has a few remaining UI issues:
1. A blank white space appears at the bottom of the page when the profiler is enabled.
2. The data overlay reappears automatically (e.g., on scroll) after being closed via the 'x' button.

## Objective
Fix the layout issue and ensure the overlay stays closed until manually re-enabled.

## Key Files & Context
- `packages/client/src/components/DevProfiler.tsx`: Component logic and UI.

## Implementation Steps

### 1. Fix Layout Issue
- Remove the `div` wrapper with `mt-10` around `ProfilerOverlay` in the `ProfilerDisplay` component. Since `ProfilerOverlay` is `fixed`, it doesn't need a wrapper that takes up layout space.

### 2. Fix Overlay Reappearing
- Remove the "auto-reopen" logic in `ProfilerDisplay` that resets `isManuallyClosed` whenever new data arrives.
- Ensure that if the user disables and then re-enables the profiler via the main button, the overlay becomes visible again.

## Verification & Testing
- **Manual Verification**:
    1. Enable profiler -> Verify no white space at bottom.
    2. Click 'x' -> Scroll up/down -> Verify overlay does NOT reappear.
    3. Click 'Disable' then 'Enable' -> Verify overlay reappears.

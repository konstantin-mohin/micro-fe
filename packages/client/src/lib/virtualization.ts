export const ITEM_HEIGHT = 120;
export const BUFFER_ITEMS = 5;

interface VirtualizationParams {
  scrollTop: number;
  containerHeight: number;
  totalItems: number;
  itemHeight?: number;
  buffer?: number;
}

export interface VirtualizationResult {
  startIndex: number;
  endIndex: number;
}

/**
 * Calculates the range of visible items based on scroll position and container height.
 */
export function calculateVirtualization({
  scrollTop,
  containerHeight,
  totalItems,
  itemHeight = ITEM_HEIGHT,
  buffer = BUFFER_ITEMS,
}: VirtualizationParams): VirtualizationResult {
  if (totalItems === 0) {
    return { startIndex: 0, endIndex: -1 };
  }

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const endIndex = Math.min(
    totalItems - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + buffer
  );

  return { startIndex, endIndex };
}

/**
 * Calculates scrolling velocity to determine if "fast scrolling" mode should be active.
 * Returns true if velocity exceeds the threshold.
 */
export function isScrollingFast(
  currentScrollTop: number,
  lastScrollTop: number,
  currentTime: number,
  lastTime: number,
  threshold = 40
): boolean {
  const timeDelta = currentTime - lastTime;
  const distanceDelta = Math.abs(currentScrollTop - lastScrollTop);
  const velocity = timeDelta > 0 ? distanceDelta / timeDelta : 0;

  return velocity > threshold;
}

import { useRef, useState, useLayoutEffect, useMemo, memo } from "react";
import { debounce } from "../lib/utils";
import { useBigListStore } from "../features/big-list/store";

const ITEM_HEIGHT = 120; // Fixed height for each item in pixels
const BUFFER_ITEMS = 5; // Extra items to render above and below the visible area

interface VirtualizedListItemProps {
  id: number;
  index: number;
  isScrollingFast: boolean;
}

const VirtualizedListItem = memo(({ id, index, isScrollingFast }: VirtualizedListItemProps) => {
  const item = useBigListStore((state) => state.items[id]);

  if (!item) return null;

  return (
    <div
      className="absolute top-0 left-0 w-full p-4 border-b bg-card text-card-foreground"
      style={{
        height: ITEM_HEIGHT,
        transform: `translateY(${index * ITEM_HEIGHT}px)`
      }}
    >
      {isScrollingFast ? (
        <div className="flex flex-col gap-2 opacity-30 animate-pulse">
          <div className="h-6 w-1/2 bg-muted rounded"></div>
          <div className="h-4 w-full bg-muted rounded"></div>
          <div className="h-4 w-3/4 bg-muted rounded"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <h3 className="font-semibold truncate flex-1">{item.title}</h3>
            <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-bold rounded-full transition-all duration-300">
              ❤️ {item.likes}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.body}
          </p>
          <div className="mt-2 text-xs text-muted-foreground/60">
            User ID: {item.userId} | Post ID: {item.id}
          </div>
        </>
      )}
    </div>
  );
});

VirtualizedListItem.displayName = "VirtualizedListItem";

export default function VirtualizedList() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const [isScrollingFast, setIsScrollingFast] = useState(false);
  const scrollTracker = useRef({ top: 0, time: performance.now(), timeout: 0 });

  const itemIds = useBigListStore((state) => state.itemIds);

  // Debounced height updater to prevent excessive re-renders during resize
  const debouncedSetHeight = useMemo(
    () => debounce((height: number) => setContainerHeight(height), 100),
    []
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        debouncedSetHeight(entry.contentRect.height);
      }
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [debouncedSetHeight]);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = e.currentTarget.scrollTop;
    const currentTime = performance.now();

    const timeDelta = currentTime - scrollTracker.current.time;
    const distanceDelta = Math.abs(currentScrollTop - scrollTracker.current.top);
    const velocity = timeDelta > 0 ? distanceDelta / timeDelta : 0;

    if (velocity > 40) {
      setIsScrollingFast(true);
    }

    window.clearTimeout(scrollTracker.current.timeout);
    scrollTracker.current.timeout = window.setTimeout(() => {
      setIsScrollingFast(false);
    }, 150);

    scrollTracker.current.top = currentScrollTop;
    scrollTracker.current.time = currentTime;

    setScrollTop(currentScrollTop);
  };

  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_ITEMS);
  const endIndex = Math.min(
    itemIds.length - 1,
    Math.floor((scrollTop + containerHeight) / ITEM_HEIGHT) + BUFFER_ITEMS
  );

  const visibleIds = itemIds.slice(startIndex, endIndex + 1);
  const totalHeight = itemIds.length * ITEM_HEIGHT;

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden border rounded-md">
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto relative bg-background"
      >
        <div style={{
          height: totalHeight, position: 'relative', backgroundImage: `repeating-linear-gradient(
      to bottom,
      var(--card) 0px,
      var(--card) ${ITEM_HEIGHT - 1}px,
      var(--border) ${ITEM_HEIGHT - 1}px,
      var(--border) ${ITEM_HEIGHT}px
    )`,
          backgroundColor: 'var(--card)'
        }}>
          {visibleIds.map((id, index) => (
            <VirtualizedListItem
              key={id}
              id={id}
              index={startIndex + index}
              isScrollingFast={isScrollingFast}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

import { calculateVirtualization, isScrollingFast, ITEM_HEIGHT, BUFFER_ITEMS } from "./virtualization";

describe("virtualization logic", () => {
  describe("calculateVirtualization", () => {
    const totalItems = 1000;
    const containerHeight = 600; // 5 items visible

    test("calculates correct range at the top", () => {
      const { startIndex, endIndex } = calculateVirtualization({
        scrollTop: 0,
        containerHeight,
        totalItems,
      });

      expect(startIndex).toBe(0);
      // Math.floor(600 / 120) = 5. Plus buffer 5 = 10.
      // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
      expect(endIndex).toBe(5 + BUFFER_ITEMS);
    });

    test("calculates correct range in the middle", () => {
      const scrollTop = 1200; // Scrolled past 10 items
      const { startIndex, endIndex } = calculateVirtualization({
        scrollTop,
        containerHeight,
        totalItems,
      });

      // 1200 / 120 = 10. 10 - buffer 5 = 5.
      expect(startIndex).toBe(5);
      // (1200 + 600) / 120 = 15. 15 + buffer 5 = 20.
      expect(endIndex).toBe(20);
    });

    test("calculates correct range at the bottom", () => {
      const totalItems = 20;
      const scrollTop = 2400 - 600; // End of list (2400 total height - 600 container)
      const { startIndex, endIndex } = calculateVirtualization({
        scrollTop,
        containerHeight,
        totalItems,
      });

      // 1800 / 120 = 15. 15 - buffer 5 = 10.
      expect(startIndex).toBe(10);
      // End index should be limited by totalItems - 1
      expect(endIndex).toBe(19);
    });

    test("returns empty range for zero items", () => {
      const { startIndex, endIndex } = calculateVirtualization({
        scrollTop: 0,
        containerHeight: 600,
        totalItems: 0,
      });

      expect(startIndex).toBe(0);
      expect(endIndex).toBe(-1);
    });
  });

  describe("isScrollingFast", () => {
    test("detects fast scrolling", () => {
      const lastScrollTop = 0;
      const currentScrollTop = 500;
      const lastTime = 0;
      const currentTime = 10; // 50 pixels per ms > 40 threshold
      
      expect(isScrollingFast(currentScrollTop, lastScrollTop, currentTime, lastTime)).toBe(true);
    });

    test("detects slow scrolling", () => {
      const lastScrollTop = 0;
      const currentScrollTop = 100;
      const lastTime = 0;
      const currentTime = 10; // 10 pixels per ms < 40 threshold
      
      expect(isScrollingFast(currentScrollTop, lastScrollTop, currentTime, lastTime)).toBe(false);
    });

    test("handles zero time delta", () => {
      expect(isScrollingFast(100, 0, 10, 10)).toBe(false);
    });
  });
});

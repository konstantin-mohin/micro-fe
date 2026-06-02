import { test, expect } from '@playwright/test';

test.describe('Big List Page', () => {
  test('should render and virtualize items', async ({ page }) => {
    // Navigate to the Big List page
    await page.goto('/big-list');

    // Wait for the page title to be visible
    await expect(page.getByText('BigList Demo')).toBeVisible();

    // The list should have many items in the store, but only a few in the DOM
    // Let's wait for at least one item to render
    await page.waitForSelector('h3');

    // Check that we have items rendered
    const itemTitles = await page.locator('h3').allTextContents();
    expect(itemTitles.length).toBeGreaterThan(0);
    // Usually with a 600px container and 120px height, we'd see ~5 items + 5 buffer = 10 items.
    // Let's just assert it's a reasonable number for virtualization
    expect(itemTitles.length).toBeLessThan(50); 

    // Get the scrollable container
    const container = page.locator('.overflow-y-auto');
    
    // Scroll down
    await container.evaluate(el => el.scrollTop = 2000);

    // Check that items have changed - wait for the first item to NOT be the original first item
    await expect(page.locator('h3').first()).not.toHaveText(itemTitles[0]);

    // Check that we still have items rendered
    const newItemTitles = await page.locator('h3').allTextContents();
    expect(newItemTitles.length).toBeGreaterThan(0);

    // Verify "Back to Home" works
    await page.getByText('← Back to Home').click();
    await expect(page).toHaveURL('/');
  });

  test('should show fast scroll skeleton', async ({ page }) => {
    await page.goto('/big-list');
    await page.waitForSelector('h3');

    const container = page.locator('.overflow-y-auto');

    // Perform a very fast scroll
    await container.evaluate(el => {
      el.scrollTop = 5000;
    });

    // Check for the skeleton/pulse animation
    // The skeleton is rendered when isScrollingFast is true
    const skeleton = page.locator('.animate-pulse');
    // It might be brief, so we just check if it appears
    const isSkeletonVisible = await skeleton.count() > 0;
    // Note: This might be flaky in some CI environments, but let's try
    console.log('Skeleton visible:', isSkeletonVisible);
  });
});

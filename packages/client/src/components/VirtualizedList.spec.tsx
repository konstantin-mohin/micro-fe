import { test, expect } from '@playwright/experimental-ct-react';
import VirtualizedList from './VirtualizedList';
import { TestStoreWrapper } from './TestStoreWrapper';
import React from 'react';

test.use({ viewport: { width: 500, height: 600 } });

test('should render visible items and handle scrolling', async ({ mount, page }) => {
  const dummyItems = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `Post ${i + 1}`,
    body: `Body ${i + 1}`,
    userId: 1,
    likes: 10,
  }));

  // Mount with a fixed height container to ensure virtualization works correctly
  // Using 610px to ensure the inner scrollable area is at least 600px after borders
  const component = await mount(
    <div style={{ height: '610px', display: 'flex', flexDirection: 'column' }}>
      <TestStoreWrapper items={dummyItems}>
        <VirtualizedList />
      </TestStoreWrapper>
    </div>
  );

  // Assert: Verify initial visible items
  // Math: floor(0/120) - 5 = 0. floor((0+600)/120) + 5 = 10.
  // Indices 0 to 10 = 11 items.
  const items = component.locator('h3');
  await expect(items).toHaveCount(11);
  await expect(items.first()).toHaveText('Post 1');
  await expect(items.last()).toHaveText('Post 11');

  // Act: Scroll down
  const container = component.locator('.overflow-y-auto');
  await container.evaluate(el => el.scrollTop = 1200); // Scroll past 10 items

  // Assert: Verify updated visible items
  // Math: floor(1200/120) - 5 = 5. floor((1200+600)/120) + 5 = 20.
  // Indices 5 to 20 = 16 items.
  await expect(items).toHaveCount(16);
  await expect(items.first()).toHaveText('Post 6');
  await expect(items.last()).toHaveText('Post 21');
});

test('should show skeletons during fast scroll', async ({ mount, page }) => {
  const dummyItems = Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    title: `Post ${i + 1}`,
    body: `Body ${i + 1}`,
    userId: 1,
    likes: 10,
  }));

  const component = await mount(
    <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <TestStoreWrapper items={dummyItems}>
        <VirtualizedList />
      </TestStoreWrapper>
    </div>
  );

  const container = component.locator('.overflow-y-auto');

  // Perform a fast scroll using mouse wheel to trigger velocity threshold
  await container.hover();
  await page.mouse.wheel(0, 5000);

  // Verify that pulse animation skeletons appear
  const skeleton = component.locator('.animate-pulse');
  // It might be brief, so we wait for at least one to be visible
  await expect(skeleton.first()).toBeVisible();
});

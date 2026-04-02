import { test, expect } from '@playwright/test';

test.describe('Monorepo E2E', () => {
  test('API and Home Page Validation', async ({ page }) => {
    await page.goto('/');

    // Assert the basic title
    await expect(page).toHaveTitle(/Client/i);

    // Verify the network request to Express successfully rendered the message
    const apiMessageHeading = page.locator('h1', { hasText: /Hello from the server! okay/i });
    await expect(apiMessageHeading).toBeVisible();
  });

  test('Microfrontend Validation', async ({ page }) => {
    await page.goto('/');

    // Assert the remote button from microfrontend-one successfully loads
    const remoteButton = page.locator('button', { hasText: 'Hello from microfrontend-one!' });
    await expect(remoteButton).toBeVisible();
  });

  test('Theming Validation (Dark/Light Mode)', async ({ page }) => {
    await page.goto('/');

    const htmlElement = page.locator('html');

    // Make sure we start from a clean state (localStorage is empty, or defaults to light)
    // Actually playwright contexts are isolated, but we'll just check what's there
    let isDark = await htmlElement.evaluate((el) => el.classList.contains('dark'));
    let isLight = await htmlElement.evaluate((el) => el.classList.contains('light'));
    
    // Find the toggle button
    const toggleButton = page.locator('button', { hasText: /Switch to (Dark|Light) Mode/i });
    await expect(toggleButton).toBeVisible();

    const textBefore = await toggleButton.innerText();

    // Click it to toggle
    await toggleButton.click();

    // The text on the button should have flipped
    if (textBefore.includes('Dark')) {
      await expect(toggleButton).toHaveText('Switch to Light Mode');
      await expect(htmlElement).toHaveClass(/dark/);
    } else {
      await expect(toggleButton).toHaveText('Switch to Dark Mode');
      await expect(htmlElement).toHaveClass(/light/);
    }
  });

  test('RSC Page Validation', async ({ page }) => {
    await page.goto('/rsc');

    // Wait for the mock server component tree to render
    const header = page.locator('h1', { hasText: /React Server Components \(Simulated\)/i });
    await expect(header).toBeVisible();

    // The note content is inside an Expandable component, so we need to click "Toggle" first
    const toggleButton = page.locator('button', { hasText: 'Toggle' }).first();
    await toggleButton.click();

    // The component tree should render Expandables and paragraphs
    const noteContent = page.locator('p', { hasText: /Remember to buy milk \(from Server DB\)/i });
    await expect(noteContent).toBeVisible();
  });
});

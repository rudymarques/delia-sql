import { test, expect } from '@playwright/test';

test('Example page has title', async ({ page }) => {
  await page.goto('https://example.com/');
  await expect(page).toHaveTitle(/Example Domain/);
});

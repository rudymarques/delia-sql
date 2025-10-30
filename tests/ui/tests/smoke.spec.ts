import { test, expect } from '@playwright/test';

test('smoke example', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

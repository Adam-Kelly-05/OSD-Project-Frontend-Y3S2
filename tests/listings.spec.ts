import { test, expect } from '@playwright/test';

test('Listings page should display correctly', async ({ page }) => {
  await page.goto('/listing-list');

  const listingItems = page.locator('mat-card').first();
  await expect(listingItems).toBeVisible();
});

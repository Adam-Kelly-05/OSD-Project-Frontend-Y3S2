import { test, expect } from '@playwright/test';

test('Search should return valid results', async ({ page }) => {
  await page.goto('/');
  const searchBar = page.locator('input').first();

  const searchString = 'Charizard';
  await searchBar.fill(searchString);
  await searchBar.press('Enter');

  const listingItems = page.locator('mat-card').first();
  await expect(listingItems).toBeVisible();

  const firstListingTitle = page.locator('mat-card mat-card-title').first();
  await expect(firstListingTitle).toContainText(searchString);
});

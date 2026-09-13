import { test, expect } from '@playwright/test';

test('Navbar overview tab test', async ({ page }) => {
  // Yeh URL tab tak render karega jab aapka dev server running ho
  await page.goto('http://localhost:5173'); 
  
  // Checking if 'Overview' button exists
  await expect(page.getByText('Overview')).toBeVisible();
});
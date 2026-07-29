import { test, expect } from '@playwright/test'

test.describe('Confusable Banner in Daily Lessons', () => {
  test.beforeEach(async ({ page }) => {
    // Use demo mode to bypass auth
    await page.goto('/')
    await page.getByRole('button', { name: /Kirishsiz sinab ko'rish/i }).click()
    await page.waitForURL(/\/(lesson|dashboard)/)
  })

  test('shows confusable warning banner in theory tab for quantifiers lesson', async ({ page }) => {
    // Navigate to lesson page
    if (!page.url().includes('/lesson')) {
      await page.goto('/lesson')
    }

    // Wait for lessons to load (level tabs + lesson cards)
    await page.waitForTimeout(3000)

    // Click A2 level tab
    await page.getByRole('button', { name: /^A2\s/ }).click()
    await page.waitForTimeout(1000)

    // Find and click Quantifiers lesson card (has 'much', 'many', 'some', 'any' vocabulary)
    await page.locator('button').filter({ hasText: /Quantifiers/i }).first().click()
    await page.waitForTimeout(3000)

    // Verify confusable banner is visible with warning text
    await expect(page.getByText(/Diqqat! Bu darsda chalkash so'zlar bor/i)).toBeVisible()

    // Verify specific confusable pairs are listed (use .first() to avoid strict mode issues)
    await expect(page.getByText(/much \/ many/i).first()).toBeVisible()
    await expect(page.getByText(/some \/ any/i).first()).toBeVisible()
  })

  test('confusable banner appears in Speaking tab', async ({ page }) => {
    if (!page.url().includes('/lesson')) {
      await page.goto('/lesson')
    }
    await page.waitForTimeout(3000)

    // Click A2 level tab
    await page.getByRole('button', { name: /^A2\s/ }).click()
    await page.waitForTimeout(1000)

    // Open Quantifiers lesson
    await page.locator('button').filter({ hasText: /Quantifiers/i }).first().click()
    await page.waitForTimeout(3000)

    // Switch to Speaking tab
    await page.getByRole('button', { name: /Gapirish/i }).click()
    await page.waitForTimeout(1000)

    // Verify confusable banner is visible in Speaking tab
    await expect(page.getByText(/Diqqat! Bu darsda chalkash so'zlar bor/i)).toBeVisible()
  })

  test('confusable banner appears in Writing tab', async ({ page }) => {
    if (!page.url().includes('/lesson')) {
      await page.goto('/lesson')
    }
    await page.waitForTimeout(3000)

    // Click A2 level tab
    await page.getByRole('button', { name: /^A2\s/ }).click()
    await page.waitForTimeout(1000)

    // Open Quantifiers lesson
    await page.locator('button').filter({ hasText: /Quantifiers/i }).first().click()
    await page.waitForTimeout(3000)

    // Switch to Writing tab
    await page.getByRole('button', { name: /Yozish/i }).click()
    await page.waitForTimeout(1000)

    // Verify confusable banner is visible in Writing tab
    await expect(page.getByText(/Diqqat! Bu darsda chalkash so'zlar bor/i)).toBeVisible()
  })

  test('Batafsil button navigates to confusable-pairs page', async ({ page }) => {
    if (!page.url().includes('/lesson')) {
      await page.goto('/lesson')
    }
    await page.waitForTimeout(3000)

    // Click A2 level tab
    await page.getByRole('button', { name: /^A2\s/ }).click()
    await page.waitForTimeout(1000)

    // Open Quantifiers lesson
    await page.locator('button').filter({ hasText: /Quantifiers/i }).first().click()
    await page.waitForTimeout(3000)

    // Click the Batafsil → button in the confusable banner
    const batafsilBtn = page.getByRole('button', { name: /Batafsil/i })
    await expect(batafsilBtn).toBeVisible()
    await batafsilBtn.click()

    // Should navigate to /confusable-pairs
    await expect(page).toHaveURL(/\/confusable-pairs/)
  })

})

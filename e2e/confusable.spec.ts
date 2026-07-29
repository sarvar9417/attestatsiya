// ═══════════════════════════════════════════════════════════════════════════
// Confusable Pairs — Playwright E2E tests
// ═══════════════════════════════════════════════════════════════════════════

import { test, expect } from '@playwright/test'

/** Enter demo mode and navigate to the confusable pairs page */
async function enterDemoAndGotoConfusable(page: import('@playwright/test').Page) {
  // Go to auth page
  await page.goto('/')
  // Wait for auth page to load (the demo button is on this page)
  await page.waitForTimeout(2000)

  // Check if demo button exists on auth page
  const demoBtn = page.getByRole('button', { name: /sinab ko'rish/i })
  if (await demoBtn.isVisible().catch(() => false)) {
    await demoBtn.click()
    // Wait for the app to fully load after demo mode
    await page.waitForTimeout(2000)
  }

  // Navigate to confusable pairs using full page load
  await page.goto('/confusable-pairs')
  // Wait for the lazy-loaded page to render
  await page.waitForTimeout(2000)

  // Verify we're on the right page
  await expect(page.getByText('Confusable Pairs')).toBeVisible({ timeout: 15_000 })
}

test.describe('Confusable Pairs — E2E', () => {
  test('browse view: renders page with all pair cards', async ({ page }) => {
    await enterDemoAndGotoConfusable(page)

    // Card buttons should be visible
    await expect(page.getByRole('button').filter({ hasText: /make/i }).first()).toBeVisible()
    await expect(page.getByRole('button').filter({ hasText: /say/i }).first()).toBeVisible()
    await expect(page.getByRole('button').filter({ hasText: /lend/i }).first()).toBeVisible()
    await expect(page.getByRole('button').filter({ hasText: /much/i }).first()).toBeVisible()

    // Quiz button renders
    await expect(page.getByRole('button', { name: /Test/i })).toBeVisible()
  })

  test('browse view: search filters cards', async ({ page }) => {
    await enterDemoAndGotoConfusable(page)

    const searchInput = page.getByPlaceholder(/Qidirish/i)
    await expect(searchInput).toBeVisible()

    // Search filters
    await searchInput.fill('much')
    await page.waitForTimeout(500)
    // 'lend' should not be visible after filter
    await expect(page.getByText(/lend/i)).not.toBeVisible()

    // Clear restores all
    await searchInput.fill('')
    await page.waitForTimeout(500)
    await expect(page.getByRole('button').filter({ hasText: /lend/i }).first()).toBeVisible()
  })

  test('browse view: shows empty state for no match', async ({ page }) => {
    await enterDemoAndGotoConfusable(page)

    await page.getByPlaceholder(/Qidirish/i).fill('zzzzz')
    await page.waitForTimeout(500)
    await expect(page.getByText('Hech narsa topilmadi')).toBeVisible()
  })

  test('detail view: clicking a card shows full detail', async ({ page }) => {
    await enterDemoAndGotoConfusable(page)

    // Click the make/do card
    await page.getByRole('button').filter({ hasText: /Yaratish va Bajarish/i }).first().click()
    await page.waitForTimeout(500)

    // Detail sections are visible
    await expect(page.getByText(/Qoida/i)).toBeVisible()
    await expect(page.getByText(/Yodda Saqlash/i)).toBeVisible()
    await expect(page.getByText(/Misollar/i)).toBeVisible()
    await expect(page.getByText(/Sherikni kechiktirish/i)).toBeVisible()
    await expect(page.getByText(/SRS ga saqlash/i)).toBeVisible()
  })

  test('detail view: back button returns to browse', async ({ page }) => {
    await enterDemoAndGotoConfusable(page)

    // Go to detail
    await page.getByRole('button').filter({ hasText: /Yaratish va Bajarish/i }).first().click()
    await page.waitForTimeout(500)
    await expect(page.getByText(/Qoida/i)).toBeVisible()

    // Click back
    await page.getByRole('button', { name: /Orqaga/i }).click()
    await page.waitForTimeout(500)
    await expect(page.getByText('Confusable Pairs')).toBeVisible()
  })

  test('detail view: SRS delay button is visible and clickable', async ({ page }) => {
    await enterDemoAndGotoConfusable(page)
    await page.getByRole('button').filter({ hasText: /Yaratish va Bajarish/i }).first().click()
    await page.waitForTimeout(500)

    // Click partner delay button
    await page.getByRole('button').filter({ hasText: /kechiktirish/i }).first().click()
    await page.waitForTimeout(500)
    // No crash = success
  })

  test('detail view: SRS push button is visible and clickable', async ({ page }) => {
    await enterDemoAndGotoConfusable(page)
    await page.getByRole('button').filter({ hasText: /Yaratish va Bajarish/i }).first().click()
    await page.waitForTimeout(500)

    // Click SRS push button
    await page.getByRole('button').filter({ hasText: /SRS ga qo'shish/i }).first().click()
    await page.waitForTimeout(500)
    // No crash = success
  })

  test('quiz: start quiz from Test button', async ({ page }) => {
    await enterDemoAndGotoConfusable(page)

    await page.getByRole('button', { name: /Test/i }).click()
    await page.waitForTimeout(500)

    await expect(page.getByRole('button', { name: /Orqaga/i })).toBeVisible()
    const answerOpts = page.getByRole('button').filter({ hasText: /^[A-D]/ })
    expect(await answerOpts.count()).toBeGreaterThanOrEqual(2)
  })

  test('quiz: full flow — answer all questions and view results', async ({ page }) => {
    await enterDemoAndGotoConfusable(page)

    // Start quiz
    await page.getByRole('button', { name: /Test/i }).click()
    await page.waitForTimeout(500)

    for (let i = 0; i < 10; i++) {
      // Check if results page is showing
      if (await page.getByText(/to'g'ri javob/i).isVisible().catch(() => false)) break

      // Check for restart button (means quiz is done)
      if (await page.getByText(/Qayta boshlash/i).isVisible().catch(() => false)) break

      // Get answer buttons
      const opts = page.getByRole('button').filter({ hasText: /^[A-D]/ })
      if ((await opts.count()) === 0) break

      // Click first answer
      await opts.first().click()
      await page.waitForTimeout(300)

      // Check explanation appeared
      if (!(await page.getByText(/Izoh/i).isVisible().catch(() => false))) break

      // Click next / view results
      const nextBtns = page.getByRole('button').filter({ hasText: /Keyingi|Natijani/ })
      if ((await nextBtns.count()) === 0) break
      await nextBtns.first().click()
      await page.waitForTimeout(400)
    }

    // Should see results
    await page.waitForTimeout(500)
    await expect(page.getByText(/to'g'ri javob/i).first()).toBeVisible({ timeout: 5_000 })
  })

  test('quiz: restart works after completing quiz', async ({ page }) => {
    await enterDemoAndGotoConfusable(page)

    // Start quiz
    await page.getByRole('button', { name: /Test/i }).click()
    await page.waitForTimeout(500)

    // Answer questions quickly
    for (let i = 0; i < 10; i++) {
      if (await page.getByText(/Qayta boshlash/i).isVisible().catch(() => false)) break
      if (await page.getByText(/to'g'ri javob/i).isVisible().catch(() => false)) break

      const opts = page.getByRole('button').filter({ hasText: /^[A-D]/ })
      if ((await opts.count()) === 0) break

      await opts.first().click()
      await page.waitForTimeout(200)

      if (!(await page.getByText(/Izoh/i).isVisible().catch(() => false))) break

      const nextBtns = page.getByRole('button').filter({ hasText: /Keyingi|Natijani/ })
      if ((await nextBtns.count()) === 0) break
      await nextBtns.first().click()
      await page.waitForTimeout(200)
    }

    // Click restart
    await expect(page.getByRole('button', { name: /Qayta boshlash/i })).toBeVisible()
    await page.getByRole('button', { name: /Qayta boshlash/i }).click()
    await page.waitForTimeout(500)

    // New quiz should start
    await expect(page.getByRole('button').filter({ hasText: /^[A-D]/ }).first()).toBeVisible()
  })
})

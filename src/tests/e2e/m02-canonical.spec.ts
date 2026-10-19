import { test, expect } from '@playwright/test'

test.describe('M02 canonical learner navigation (mocked session)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('attestatsiya.session.v1', JSON.stringify({
        access_token: 'm02-e2e-access-token',
        refresh_token: 'm02-e2e-refresh-token',
        expires_at: Date.now() + 60 * 60 * 1000,
        user: {
          id: '20000000-0000-4000-8000-000000000099',
          email: 'm02-e2e@example.invalid',
          display_name: 'M02 E2E',
          role: 'user',
        },
      }))
    })
    await page.route('http://localhost:3001/api/auth/onboarding', async route => {
      const headers = {
        'access-control-allow-origin': 'http://localhost:3000',
        'access-control-allow-headers': 'authorization,content-type',
        'access-control-allow-methods': 'GET,OPTIONS',
        'content-type': 'application/json',
      }
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({ status: 204, headers, body: '' })
        return
      }
      await route.fulfill({
        status: 200, headers,
        body: JSON.stringify({
          available: true,
          completed: true,
          display_name: 'M02 E2E',
          exam_date: null,
          daily_goal_minutes: 30,
          timezone: 'Asia/Tashkent',
          locale: 'uz-Latn',
          onboarding_completed_at: new Date().toISOString(),
        }),
      })
    })
  })

  test('four lessons display and open without exposing archived nine-topic navigation', async ({ page }) => {
    await page.goto('/learn/M02')
    await expect(page.getByRole('heading', { name: 'Kompyuter tizimlari va dasturiy muhit' })).toBeVisible()
    for (const title of [
      'Kompyuter qurilmalari va ularning vazifalari',
      'Operatsion tizimlar va ularning imkoniyatlari',
      'Fayl va papkalar bilan ishlash',
      'Tizimli, amaliy va xizmat ko‘rsatuvchi dasturlar',
    ]) {
      await expect(page.getByRole('button', { name: new RegExp(title) })).toBeVisible()
    }
    await expect(page.getByRole('button', { name: 'Mobil qurilmalar' })).toHaveCount(0)
    await page.getByRole('button', { name: /Kompyuter qurilmalari va ularning vazifalari/ }).click()
    // The complete canonical lesson uses the shared book sections, not the old two-block pages.
    // Walk through real pages and verify the section was not truncated.
    const target = page.locator('.book-chapter').getByText('Texnik taʼminotni tanlash va tashxislash')
    const nextSection = page.locator('.book-pager-button.is-next')
    await expect(page.locator('.book-navbar')).toBeVisible()
    for (let i = 0; i < 100 && await target.count() === 0 && await nextSection.count() > 0; i++) {
      await nextSection.click()
    }
    await expect(target).toBeVisible()
  })
})

import { test, expect } from '@playwright/test'

test.describe('TASK-284 long-form textbook reader in non-M01 modules', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('attestatsiya.session.v1', JSON.stringify({
        access_token: 'task284-e2e-token',
        refresh_token: 'task284-e2e-refresh',
        expires_at: Date.now() + 60 * 60 * 1000,
        user: {
          id: '20000000-0000-4000-8000-000000000099',
          email: 'task284@example.invalid',
          display_name: 'TASK284 E2E',
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
          display_name: 'TASK284 E2E',
          exam_date: null,
          daily_goal_minutes: 30,
          timezone: 'Asia/Tashkent',
          locale: 'uz-Latn',
          onboarding_completed_at: new Date().toISOString(),
        }),
      })
    })
  })

  test('M03.05 Excel opens with M01-style study goals and substantial chapter outline', async ({ page }) => {
    await page.goto('/learn/M03')
    await expect(page.getByRole('heading', { name: 'Microsoft Office' })).toBeVisible()
    await page.getByRole('button', { name: /Excel formulalari va funksiyalari/ }).click()
    await expect(page.locator('.book-navbar')).toBeVisible()
    await expect(page.locator('[data-block="goal"]')).toContainText('Bob yakunida')
    await expect(page.locator('.book-navbar-dot')).toHaveCount(10)
    await page.getByRole('button', { name: /Mundarija/ }).click()
    await expect(page.getByRole('navigation', { name: 'Bob mundarijasi' })).toContainText('Katak havolalari va nusxalash')
    await expect(page.getByRole('navigation', { name: 'Bob mundarijasi' })).toContainText('Ma’lumotni tasdiqlash')
  })

  test('M15.01 pedagogy opens as a multi-section textbook, not a short four-block summary', async ({ page }) => {
    await page.goto('/learn/M15')
    await expect(page.getByRole('heading', { name: 'Umumiy pedagogika' })).toBeVisible()
    await page.getByRole('button', { name: /Pedagogika, didaktika va yosh psixologiyasi/ }).click()
    await expect(page.locator('.book-navbar')).toBeVisible()
    await expect(page.locator('[data-block="goal"]')).toContainText('Bu bobni yakunlagach')
    const sectionCount = await page.locator('.book-navbar-dot').count()
    expect(sectionCount).toBeGreaterThanOrEqual(10)
    await page.getByRole('button', { name: /Mundarija/ }).click()
    await expect(page.getByRole('navigation', { name: 'Bob mundarijasi' }))
      .toContainText('Ilmiy-pedagogik tadqiqot')
  })
})

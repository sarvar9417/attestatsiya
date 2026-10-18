import { expect, test } from '@playwright/test'

const ids = {
  m1: '10000000-0000-4000-8000-000000000001',
  m15: '10000000-0000-4000-8000-000000000015',
  l1: '20000000-0000-4000-8000-000000000001',
  l15: '20000000-0000-4000-8000-000000000015',
  exam: '30000000-0000-4000-8000-000000000001',
}

test.describe('TASK-210 custom test construction', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('attestatsiya.session.v1', JSON.stringify({
        access_token: 'custom-e2e-token',
        refresh_token: 'custom-e2e-refresh',
        expires_at: Date.now() + 60 * 60 * 1000,
        user: { id: '20000000-0000-4000-8000-000000000099',
          email: 'custom-e2e@example.invalid', display_name: 'Custom Tester', role: 'user' },
      }))
    })
    const headers = {
      'access-control-allow-origin': 'http://localhost:3000',
      'access-control-allow-headers': 'authorization,content-type',
      'access-control-allow-methods': 'GET,POST,OPTIONS',
      'content-type': 'application/json',
    }

    await page.route('http://localhost:3001/api/auth/onboarding', async route => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({ status: 204, headers, body: '' })
        return
      }
      await route.fulfill({
        status: 200, headers,
        body: JSON.stringify({
          available: true, completed: true, display_name: 'Custom Tester',
          exam_date: null, daily_goal_minutes: 30, timezone: 'Asia/Tashkent',
          locale: 'uz-Latn', onboarding_completed_at: new Date().toISOString(),
        }),
      })
    })

    await page.route('http://localhost:3001/api/custom-tests/**', async route => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({ status: 204, headers, body: '' })
        return
      }
      const pathname = new URL(route.request().url()).pathname
      if (pathname.endsWith('/catalog')) {
        await route.fulfill({ status: 200, headers, body: JSON.stringify([
          { id: ids.m1, code: 'M01', title_uz: 'Informatika',
            order_idx: 1, lessons: [
              { id: ids.l1, module_id: ids.m1, slug: 'info-1',
                title_uz: 'Axborot va kodlash', order_idx: 1 },
            ] },
          { id: ids.m15, code: 'M15', title_uz: 'Pedagogika',
            order_idx: 15, lessons: [
              { id: ids.l15, module_id: ids.m15, slug: 'ped-1',
                title_uz: 'Pedagogik metodlar', order_idx: 1 },
            ] },
        ]) })
        return
      }
      const config = route.request().postDataJSON()
      if (pathname.endsWith('/preflight')) {
        const total = config.total_count as number
        await route.fulfill({ status: 200, headers, body: JSON.stringify({
          ready: true, requested: total, available: total, gaps: [],
          slots: config.topics.map((topic: {lesson_id: string; count: number}) => ({
            lesson_id: topic.lesson_id, difficulty: 3,
            requested: topic.count, available: topic.count,
          })),
        }) })
        return
      }
      if (pathname.endsWith('/start')) {
        const total = config.total_count as number
        await route.fulfill({ status: 200, headers, body: JSON.stringify({
          exam_id: ids.exam, kind: 'custom', duration_sec: config.duration_sec,
          started_at: new Date().toISOString(),
          selection_meta: null,
          items: Array.from({ length: total }, (_, index) => {
            const id = String(index + 1).padStart(12, '0')
            return {
              item_id: `40000000-0000-4000-8000-${id}`,
              order_idx: index + 1,
              question_id: `50000000-0000-4000-8000-${id}`,
              format: 'Y1', stem_md: `TASK210 savol ${index + 1}`,
              assets: [],
              options: [
                { id: `60000000-0000-4000-8000-${id}`, side: 'a', content_md: 'Birinchi' },
                { id: `70000000-0000-4000-8000-${id}`, side: 'a', content_md: 'Ikkinchi' },
              ],
            }
          }),
        }) })
        return
      }
      await route.fulfill({ status: 404, headers, body: '{}' })
    })
  })

  test('mixes modules, preserves question total and opens protected runner', async ({ page }) => {
    await page.goto('/custom-test')
    await expect(page.getByRole('heading', { name: 'Shaxsiy test konstruktori' })).toBeVisible()

    await page.getByRole('button', { name: /M01 · Informatika/ }).click()
    await page.getByLabel('Axborot va kodlash', { exact: true }).check()
    await page.getByRole('button', { name: /M15 · Pedagogika/ }).click()
    await page.getByLabel('Pedagogik metodlar', { exact: true }).check()
    await expect(page.getByText('10 ta', { exact: true }).last()).toBeVisible()

    await page.getByRole('button', { name: 'Savollar yetarliligini tekshirish' }).click()
    await expect(page.getByText('Tanlangan barcha kvotalar bajariladi.')).toBeVisible()
    await page.getByRole('button', { name: 'Testni boshlash', exact: true }).click()

    await expect(page).toHaveURL(/\/exam\/custom/)
    await expect(page.getByRole('heading', { name: 'Shaxsiy test' })).toBeVisible()
    await page.getByRole('button', { name: 'Sinovni boshlash' }).click()
    await expect(page.getByText('TASK210 savol 1')).toBeVisible()
  })

  test('prevents direct runner access without a valid config', async ({ page }) => {
    await page.goto('/exam/custom')
    await expect(page).toHaveURL(/\/custom-test/)
  })
})

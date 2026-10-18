import { expect, test } from '@playwright/test'

const ids = {
  m1: '10000000-0000-0000-0000-000000000001',
  m15: '10000000-0000-4000-8000-000000000015',
  l1: '20000000-0000-0000-0000-000000000001',
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

    let presets: Array<{ id: string; name: string; config: unknown; created_at: string; updated_at: string }> = []
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
      if (pathname.endsWith('/presets') && route.request().method() === 'GET') {
        await route.fulfill({ status: 200, headers, body: JSON.stringify(presets) })
        return
      }
      if (pathname.endsWith('/presets') && route.request().method() === 'POST') {
        const input = route.request().postDataJSON()
        const record = {
          id: '80000000-0000-4000-8000-000000000001',
          name: input.name as string,
          config: input.config,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        presets = [record, ...presets]
        await route.fulfill({ status: 201, headers, body: JSON.stringify(record) })
        return
      }
      if (pathname.includes('/presets/') && route.request().method() === 'PATCH') {
        const change = route.request().postDataJSON()
        presets = presets.map(preset => ({ ...preset, ...change }))
        await route.fulfill({ status: 200, headers, body: JSON.stringify(presets[0]) })
        return
      }
      if (pathname.includes('/presets/') && route.request().method() === 'DELETE') {
        presets = []
        await route.fulfill({ status: 200, headers, body: '{"deleted":true}' })
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

  test('saves, reloads, renames and deletes a personal test preset', async ({ page }) => {
    await page.goto('/custom-test')
    await page.getByRole('button', { name: /M01 · Informatika/ }).click()
    await page.getByLabel('Axborot va kodlash', { exact: true }).check()

    await page.getByPlaceholder('Masalan, Qiyin Python va Excel').fill('Takroriy mavzular')
    await page.getByRole('button', { name: 'Joriy sozlamalarni saqlash' }).click()
    await expect(page.getByText('Test shabloni saqlandi.')).toBeVisible()
    await expect(page.getByText('Takroriy mavzular', { exact: true })).toBeVisible()

    // Editing a visible setting tests restoring the persisted config without
    // coupling this flow to accordion scroll/expanded state.
    await page.getByLabel('Test rejimi').selectOption('learning')
    await page.getByRole('button', { name: 'Yuklash', exact: true }).click()
    await expect(page.getByLabel('Test rejimi')).toHaveValue('exam')
    await expect(page.getByText('Shablon yuklandi. Savollar yetarliligini qayta tekshiring.')).toBeVisible()

    await page.getByRole('button', { name: 'Nomini o‘zgartirish' }).click()
    await page.getByRole('textbox', { name: 'Shablon nomini o‘zgartirish' }).fill('Yangi nom')
    await page.getByRole('button', { name: 'Saqlash', exact: true }).click()
    await expect(page.getByText('Yangi nom', { exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'O‘chirish', exact: true }).click()
    await page.getByRole('button', { name: 'O‘chirishni tasdiqlash' }).click()
    await expect(page.getByText('Shablon o‘chirildi.')).toBeVisible()
    await expect(page.getByText('Yangi nom', { exact: true })).toHaveCount(0)
  })

})

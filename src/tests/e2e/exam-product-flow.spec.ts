import { test, expect } from '@playwright/test'

const ids = {
  exam: '20000000-0000-4000-8000-000000000001',
  item: '20000000-0000-4000-8000-000000000011',
  question: '20000000-0000-4000-8000-000000000021',
  optionA: '20000000-0000-4000-8000-000000000031',
  optionB: '20000000-0000-4000-8000-000000000032',
} as const

test.describe('Attestatsiya protected product flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'attestatsiya.session.v1',
        JSON.stringify({
          access_token: 'e2e-access-token',
          refresh_token: 'e2e-refresh-token',
          expires_at: Date.now() + 60 * 60 * 1000,
          user: {
            id: '20000000-0000-4000-8000-000000000099',
            email: 'e2e@example.invalid',
            display_name: 'E2E User',
            role: 'user',
          },
        }),
      )
    })

    await page.route('http://localhost:3001/api/exam/**', async route => {
      const request = route.request()
      const url = new URL(request.url())
      const corsHeaders = {
        'access-control-allow-origin': 'http://localhost:3000',
        'access-control-allow-headers': 'authorization,content-type',
        'access-control-allow-methods': 'GET,POST,OPTIONS',
        'content-type': 'application/json',
      }

      if (request.method() === 'OPTIONS') {
        await route.fulfill({ status: 204, headers: corsHeaders, body: '' })
        return
      }

      if (url.pathname === '/api/exam/start') {
        await route.fulfill({
          status: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            exam_id: ids.exam,
            kind: 'mock',
            duration_sec: 7200,
            started_at: new Date().toISOString(),
            items: [
              {
                item_id: ids.item,
                order_idx: 1,
                question_id: ids.question,
                format: 'Y1',
                stem_md: 'E2E yagona javob savoli',
                assets: [],
                options: [
                  { id: ids.optionA, side: 'a', content_md: 'Variant A' },
                  { id: ids.optionB, side: 'a', content_md: 'Variant B' },
                ],
              },
            ],
          }),
        })
        return
      }

      if (url.pathname === '/api/exam/submit') {
        await route.fulfill({
          status: 200,
          headers: corsHeaders,
          body: JSON.stringify({ saved: true }),
        })
        return
      }

      if (url.pathname === '/api/exam/finish') {
        await route.fulfill({
          status: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            exam_id: ids.exam,
            total_score: 2,
            max_score: 2,
            passed: true,
            breakdown: [
              { group_code: 'S1.INFO', jami: 1, togri: 1 },
            ],
            already_finished: false,
          }),
        })
        return
      }

      await route.fulfill({
        status: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: { code: 'NOT_FOUND', message: 'Not found' } }),
      })
    })
  })

  test('valid session → mock start → answer → finish → server result', async ({ page }) => {
    await page.goto('/exam/mock')

    await expect(
      page.getByRole('heading', { name: 'Attestatsiya mock sinovi' }),
    ).toBeVisible()

    await page.getByRole('button', { name: 'Sinovni boshlash' }).click()
    await expect(page.getByText('E2E yagona javob savoli')).toBeVisible()

    await page.getByRole('button', { name: /Variant B/ }).click()
    await page.getByRole('button', { name: 'Javobni saqlash' }).click()

    await page.getByRole('button', { name: 'Sinovni yakunlash' }).first().click()

    const confirm = page.getByRole('button', { name: /yakunlash/i })
    if (await confirm.count() > 1) {
      await confirm.last().click()
    }

    await expect(
      page.getByRole('heading', { name: 'Sinov yakunlandi' }),
    ).toBeVisible()
    await expect(page.getByText('2 / 2')).toBeVisible()
    await expect(page.getByText('S1.INFO')).toBeVisible()
    await expect(page.getByText('100% natija')).toBeVisible()
  })
})

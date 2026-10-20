import { expect, test } from '@playwright/test'
import { MODULES } from '../../data/contentTree'

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test.describe(`complete lesson book ${viewport.width}px`, () => {
    test.use({ viewport })
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem('attestatsiya.session.v1', JSON.stringify({
          access_token: 'reader-fixture-token', refresh_token: 'reader-fixture-refresh',
          expires_at: Date.now() + 3600000,
          user: { id: '20000000-0000-4000-8000-000000000099', email: 'reader@example.invalid', display_name: 'Reader QA', role: 'user' },
        }))
      })
      await page.route('**/api/**', async route => {
        const headers = {
          'access-control-allow-origin': 'http://localhost:3000',
          'access-control-allow-headers': 'authorization,content-type',
          'access-control-allow-methods': 'GET,OPTIONS',
          'content-type': 'application/json',
        }
        if (route.request().method() === 'OPTIONS') {
          await route.fulfill({ status: 204, headers, body: '' }); return
        }
        const path = new URL(route.request().url()).pathname
        let body: unknown
        if (path === '/api/auth/onboarding') {
          body = { available: true, completed: true, display_name: 'Reader QA', exam_date: null, daily_goal_minutes: 30,
            timezone: 'Asia/Tashkent', locale: 'uz-Latn', onboarding_completed_at: new Date().toISOString() }
        } else if (path.endsWith('/topic-test-preflight')) {
          body = { ready: false, required: 20, available: 0, duration_sec: 1200, reason: 'pool_insufficient', coverage: [], critical_objective_gaps: [], missing_required_objectives: [] }
        } else if (/\/lessons\/M(?:02|14|15|16)\.01$/.test(path)) {
          body = {
            id: '20000000-0000-4000-8000-000000000001', module_id: '20000000-0000-4000-8000-000000000002',
            title_uz: 'Manbali dars', slug: 'reader-source', status: 'published', order_idx: 1, est_minutes: 20,
            constructs: [], blocks: null, blocks_kind: 'chapter',
            body_mdx: [
              '## Nashr qilingan asos', 'Asosiy manbali tushuntirish saqlanadi.',
              '## Tekshirilgan qo‘shimcha: amaliy vaziyat', 'Tekshirilgan qo‘shimcha ham o‘qiladi.',
              '## Chuqurlashtirilgan nazariya — manba korpusi',
              '## To‘liq misol', 'Yakuniy manbali tushuntirish saqlanadi.',
              '| Tushuncha | Izoh |', '|---|---|', '| Manba | To‘liq jadval |',
            ].join('\n\n').replace('| Tushuncha | Izoh |\n\n|---|---|\n\n', '| Tushuncha | Izoh |\n|---|---|\n'),
          }
        } else {
          await route.fulfill({ status: 503, headers, body: JSON.stringify({ error: { code: 'FIXTURE_UNAVAILABLE', message: 'No fixture' } }) }); return
        }
        await route.fulfill({ status: 200, headers, body: JSON.stringify(body) })
      })
    })

    for (const module of ['M02', 'M14', 'M15', 'M16']) {
      test(`${module}: original and source material share navigation through the final page`, async ({ page }) => {
        test.setTimeout(60000)
        const errors: string[] = []
        page.on('pageerror', error => errors.push(error.message))
        await page.goto(`/learn/${module}`)
        const title = MODULES.find(item => item.code === module)!.subtopics[0].title
        await page.getByRole('button').filter({ has: page.getByRole('heading', { name: title, exact: true }) }).click()
        await expect(page.locator('.book-chapter')).toBeVisible()
        const paginated = await page.locator('.book-navbar').count() > 0
        if (paginated) await expect(page.locator('.book-navbar')).toBeVisible()
        const sections: string[] = []
        for (let index = 0; index < 120; index++) {
          sections.push(await page.locator('.book-chapter').innerText())
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
          const next = page.locator('.book-pager-button.is-next')
          if (await next.count() === 0) break
          await next.click()
        }
        const content = sections.join('\n')
        expect(content).toContain('Yakuniy manbali tushuntirish saqlanadi.')
        expect(content).toContain('To‘liq jadval')
        if (module === 'M15') expect(content).toContain('Pedagogikaning obyekti, predmeti va tadqiqot metodlari')
        if (module === 'M02') {
          expect(content).toContain('Texnik taʼminotni tanlash va tashxislash')
          expect(content).not.toContain('Asosiy manbali tushuntirish saqlanadi.')
        } else if (module === 'M15') {
          expect(content).not.toContain('Asosiy manbali tushuntirish saqlanadi.')
        } else expect(content).toContain('Asosiy manbali tushuntirish saqlanadi.')
        await expect(page.getByText(paginated ? 'Bob o‘qib bo‘lindi' : 'Mavzu o‘qib bo‘lindi')).toBeVisible()
        await expect(page.getByRole('button', { name: /Test tayyorligi kutilmoqda/ })).toBeDisabled()
        await page.getByRole('button', { name: /Keyingi mavzu:/ }).click()
        await expect(page.locator('.book-chapter')).toBeVisible()
        expect(errors).toEqual([])
      })
    }
  })
}

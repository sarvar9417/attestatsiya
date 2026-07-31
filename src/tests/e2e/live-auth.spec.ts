import { test, expect } from '@playwright/test'

// CI'da haqiqiy Supabase credential yo'q (placeholder env ishlatiladi) —
// live login testlarini faqat real supabase mavjud bo'lganda ishga tushiramiz.
const hasLiveSupabase = !(process.env.VITE_SUPABASE_URL ?? '').includes('example.invalid')

const EMAIL = 'live-e2e@test.attestatsiya.uz'
const PASSWORD = 'LiveTest123!'
const KEY = 'attestatsiya.session.v1'

test.describe('Live auth regression', () => {
  test.skip(!hasLiveSupabase, 'Live Supabase credentiallarisiz (CI) skip qilinadi')
  test('login -> profil; muddati o\'tgan session reload\'da refresh qilinadi', async ({ page }) => {
    await page.goto('/auth')
    await page.getByLabel('Email').fill(EMAIL)
    await page.getByLabel('Parol', { exact: true }).fill(PASSWORD)
    await page.locator('form').getByRole('button', { name: 'Kirish' }).click()

    await expect(page).toHaveURL('/', { timeout: 15_000 })

    await page.goto('/profile')
    await expect(page.getByRole('heading', { name: 'Profil' })).toBeVisible()

    const stored = await page.evaluate((k) => JSON.parse(localStorage.getItem(k) as string), KEY)
    expect(stored.expires_at).toBeGreaterThan(Date.now())

    await page.evaluate(
      ([k, s]) => localStorage.setItem(k, JSON.stringify({ ...s, expires_at: Date.now() - 60_000 })),
      [KEY, stored] as const
    )

    await page.reload()
    await expect(page).toHaveURL(/\/profile/)
    await expect(page.getByRole('heading', { name: 'Profil' })).toBeVisible()

    const after = await page.evaluate((k) => JSON.parse(localStorage.getItem(k) as string), KEY)
    expect(after.expires_at).toBeGreaterThan(Date.now() + 300_000)
  })

  test('chiqishdan keyin barcha sahifalar /auth ga qaytaradi', async ({ page }) => {
    await page.goto('/auth')
    await page.getByLabel('Email').fill(EMAIL)
    await page.getByLabel('Parol', { exact: true }).fill(PASSWORD)
    await page.locator('form').getByRole('button', { name: 'Kirish' }).click()
    await expect(page).toHaveURL('/', { timeout: 15_000 })

    await page.goto('/learn')
    await expect(page).toHaveURL(/\/learn/, { timeout: 10_000 })

    await page.goto('/profile')
    await page.getByRole('button', { name: 'Chiqish' }).click()

    await expect(page).toHaveURL(/\/auth/, { timeout: 10_000 })
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Dashboard' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: "O'rganish" })).toHaveCount(0)

    await page.goto('/learn')
    await expect(page).toHaveURL(/\/auth\?returnTo=/)
    await page.goto('/')
    await expect(page).toHaveURL(/\/auth\?returnTo=/)

    const stored = await page.evaluate((k) => localStorage.getItem(k), KEY)
    expect(stored).toBeNull()
  })
})

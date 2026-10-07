import { test, expect } from '@playwright/test'

test.describe('Attestatsiya auth E2E', () => {
  test('auth sahifasi login formasini ko\'rsatadi', async ({ page }) => {
    await page.goto('/auth')
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Parol', { exact: true })).toBeVisible()
    await expect(page.locator('form').getByRole('button', { name: 'Kirish' })).toBeVisible()
    await expect(page.getByText('Parolni unutdingizmi?')).toBeVisible()
  })

  test('ro\'yxatdan o\'tish tabiga o\'tilganda qo\'shimcha maydonlar chiqadi', async ({ page }) => {
    await page.goto('/auth')
    await page.getByRole('button', { name: "Ro'yxatdan o'tish" }).first().click()
    await expect(page.getByLabel('Ism')).toBeVisible()
    await expect(page.getByLabel('Parolni tasdiqlang')).toBeVisible()
    await expect(page.locator('form').getByRole('button', { name: "Ro'yxatdan o'tish" })).toBeVisible()
  })

  test('formaga kirish validatsiyasi backend chaqirmasdan ishlaydi', async ({ page }) => {
    await page.goto('/auth')
    await page.getByLabel('Email').fill('test@test.com')
    await page.getByLabel('Parol', { exact: true }).fill('123')
    await page.locator('form').getByRole('button', { name: 'Kirish' }).click()
    await expect(page.getByText('Parol kamida 6 ta belgidan iborat bo\'lishi kerak')).toBeVisible()
    await expect(page.getByText('Email formati noto\'g\'ri')).toHaveCount(0)
  })

  test('parolni tiklash modalida email validatsiyasi ishlaydi', async ({ page }) => {
    await page.goto('/auth')
    await page.getByText('Parolni unutdingizmi?').click()
    await expect(page.getByText('Parolni tiklash')).toBeVisible()
    await page.getByLabel('Tiklash emaili').fill('invalid-email')
    await page.getByRole('button', { name: /Yuborish/ }).click()
    await expect(page.getByText('Email formati noto\'g\'ri')).toBeVisible()
  })

  test('himoyalangan sahifa /auth ga returnTo bilan qaytaradi', async ({ page }) => {
    await page.goto('/profile')
    await expect(page).toHaveURL(/\/auth\?returnTo=%2Fprofile/)
    await expect(page.getByLabel('Email')).toBeVisible()
  })

  test('expired parametri session tugagan bannerini ko\'rsatadi', async ({ page }) => {
    await page.goto('/auth?expired=1')
    await expect(page.getByText(/Session muddati tugadi/i)).toBeVisible()
  })
})


test.describe('Attestatsiya product-flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'attestatsiya.session.v1',
        JSON.stringify({
          access_token: 'e2e-access-token',
          refresh_token: 'e2e-refresh-token',
          expires_at: Date.now() + 60 * 60 * 1000,
          user: {
            id: '00000000-0000-4000-8000-000000000901',
            email: 'product-e2e@example.invalid',
            display_name: 'Product E2E',
            role: 'user',
          },
        })
      )
    })

    await page.route('**/api/content/modules**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '[]',
      })
    })
  })

  test('dashboard → o‘rganish → birinchi modul oqimi ishlaydi', async ({ page }) => {
    await page.goto('/')

    const start = page.getByRole('button', { name: /O‘rganishni boshlash|Darsni davom ettirish/ })
    await expect(start).toBeVisible()
    await start.click()
    await expect(page).toHaveURL(/\/learn(?:\/M01)?$/)

    if (new URL(page.url()).pathname === '/learn') {
      await expect(page.getByRole('heading', { name: 'O‘rganish' })).toBeVisible()

      const firstModule = page.locator('main button').filter({ hasText: 'O‘rganish' }).first()
      await expect(firstModule).toBeVisible()
      await firstModule.click()
    }

    await expect(page).toHaveURL(/\/learn\/M01$/)
    await expect(page.getByText('Nazariya → bilimni tekshirish → amaliy qo‘llash')).toBeVisible()
    await expect(page.getByRole('button', { name: /Nazariya va mavzu testi mavjud/ }).first()).toBeVisible()
  })
})

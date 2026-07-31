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

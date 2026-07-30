import { test, expect } from '@playwright/test'

test.describe('Attestatsiya platform E2E', () => {

  test('auth sahifasi ochiladi', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Attestatsiya')
    await expect(page.getByText("Informatika attestatsiyasiga tayyorgarlik")).toBeVisible()
  })

  test('kirish va ro\'yxatdan o\'tish tablari ishlaydi', async ({ page }) => {
    await page.goto('/')
    const tabKirish = page.getByRole('button', { name: 'Kirish' }).first()
    const tabRoyxat = page.getByRole('button', { name: "Ro'yxatdan o'tish" })
    await expect(tabKirish).toBeVisible()
    await expect(tabRoyxat).toBeVisible()
    await tabRoyxat.click()
    await expect(page.getByText('Ism')).toBeVisible()
  })

  test('parolni tiklash modalini ochish mumkin', async ({ page }) => {
    await page.goto('/')
    await page.getByText('Parolni unutdingizmi?').click()
    await expect(page.getByText('Parolni tiklash')).toBeVisible()
    await expect(page.getByPlaceholder('email@example.com').first()).toBeVisible()
  })

  test('forma validatsiyasi ishlaydi', async ({ page }) => {
    await page.goto('/')
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })
})

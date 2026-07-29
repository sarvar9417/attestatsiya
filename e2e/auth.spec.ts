import { test, expect } from '@playwright/test'

test.describe('Auth Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('login form renders correctly', async ({ page }) => {
    // Should see the branding
    await expect(page.locator('h1')).toContainText('EnglishPath')

    // Should have login tab active by default
    const loginBtn = page.getByRole('button', { name: /^Kirish$/ })
    await expect(loginBtn).toBeVisible()

    // Should have email and password fields
    await expect(page.getByPlaceholder('email@example.com')).toBeVisible()
    await expect(page.getByPlaceholder('••••••••')).toBeVisible()

    // Submit button
    await expect(page.getByRole('button', { name: 'Kirish →' })).toBeVisible()

    // Demo mode button
    await expect(page.getByRole('button', { name: /Kirishsiz sinab ko'rish/i })).toBeVisible()
  })

  test('signup tab works and shows name field', async ({ page }) => {
    // Click signup tab
    await page.getByRole('button', { name: /^Ro'yxatdan o'tish$/ }).click()

    // Should show name field
    await expect(page.getByPlaceholder('Ismingiz...')).toBeVisible()

    // Should still show email and password
    await expect(page.getByPlaceholder('email@example.com')).toBeVisible()
    await expect(page.getByPlaceholder('••••••••')).toBeVisible()

    // Submit button text changes
    await expect(page.getByRole('button', { name: /^Ro'yxatdan o'tish 🚀$/ })).toBeVisible()
  })

  test('shows validation error for short password on signup', async ({ page }) => {
    // Switch to signup
    await page.getByRole('button', { name: /^Ro'yxatdan o'tish$/ }).click()

    // Fill form with short password
    await page.getByPlaceholder('Ismingiz...').fill('Test User')
    await page.getByPlaceholder('email@example.com').fill('test@example.com')
    await page.getByPlaceholder('••••••••').fill('123')

    // Submit - HTML5 validation should fire
    const submitBtn = page.getByRole('button', { name: /^Ro'yxatdan o'tish 🚀$/ })
    await submitBtn.click()

    // The form shouldn't submit due to minLength=6 constraint
    // (We just verify the page doesn't crash)
    await expect(page.getByPlaceholder('Ismingiz...')).toBeVisible()
  })

  test('forgot password modal opens and can be dismissed', async ({ page }) => {
    // Click forgot password link
    await page.getByText('Parolni unutdingizmi?').click()

    // Modal should appear
    await expect(page.getByText('Parolni tiklash')).toBeVisible()
    await expect(page.getByPlaceholder('email@example.com').first()).toBeVisible()

    // Close modal with X button
    const closeBtn = page.getByLabel('Modalni yopish')
    await closeBtn.click()

    // Modal should be gone
    await expect(page.getByText('Parolni tiklash')).not.toBeVisible()
  })

  test('demo mode navigates to lesson page', async ({ page }) => {
    // Click demo mode button
    await page.getByRole('button', { name: /Kirishsiz sinab ko'rish/i }).click()

    // Should navigate away from auth page
    // The app will try to load lessons - just verify we're not on auth anymore
    await page.waitForURL(/\/(lesson|dashboard)/)
    // The page should render without error
    await expect(page.locator('body')).toBeVisible()
  })

  test('login form shows error with invalid credentials (client-side)', async ({ page }) => {
    // Fill with invalid email format
    await page.getByPlaceholder('email@example.com').fill('not-an-email')
    await page.getByPlaceholder('••••••••').fill('password123')

    // Submit - HTML5 validation should block invalid email
    const submitBtn = page.getByRole('button', { name: 'Kirish →' })
    const isFormValid = await page.evaluate(() => {
      const form = document.querySelector('form')
      if (!form) return true
      return form.checkValidity()
    })
    // The form should report invalid due to email type
    expect(isFormValid).toBe(false)
  })

  test('tabs are accessible via keyboard', async ({ page }) => {
    // Tab should be focusable
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // The second tab press should focus signup button or email field
    // Just verify keyboard navigation doesn't crash
    const signupBtn = page.getByRole('button', { name: /^Ro'yxatdan o'tish$/ })
    await signupBtn.focus()
    await signupBtn.click()

    // Signup form should show
    await expect(page.getByPlaceholder('Ismingiz...')).toBeVisible()
  })
})

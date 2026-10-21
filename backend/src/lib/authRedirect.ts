/**
 * The public URL used in account-verification and password-reset emails.
 *
 * Vercel production must never fall back to localhost, even if a sensitive
 * environment variable is absent, blank or left at a developer value.
 * Preview/local builds can keep their explicitly configured destination.
 */
export const PRODUCTION_AUTH_ORIGIN = 'https://attestatsiya-five.vercel.app'

export function resolveAuthRedirectUrl(
  env: Record<string, string | undefined> = process.env,
): string {
  if (env.VERCEL_ENV === 'production') return PRODUCTION_AUTH_ORIGIN

  return env.AUTH_REDIRECT_URL?.trim() ||
    `http://localhost:${env.FRONTEND_PORT || '3000'}`
}

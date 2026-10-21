/**
 * Vercel's /api/:path* rewrite forwards the captured path as an extra
 * `path` query parameter. That is transport metadata, not user input:
 * the strict Fastify/Zod query schemas must not see it.
 *
 * Remove it only when there is exactly one captured value and it matches
 * the actual API route. Keep every other query key intact, so unexpected
 * client parameters are still rejected by the route schema.
 */
export function normalizeVercelApiRequestUrl(url: string | undefined): string | undefined {
  if (!url) return url

  const queryIndex = url.indexOf('?')
  if (queryIndex < 0) return url

  const pathname = url.slice(0, queryIndex)
  if (!pathname.startsWith('/api/')) return url

  const expectedCapture = pathname.slice('/api/'.length)
  if (!expectedCapture) return url

  const query = new URLSearchParams(url.slice(queryIndex + 1))
  const capturedPaths = query.getAll('path')
  if (capturedPaths.length !== 1 || capturedPaths[0] !== expectedCapture) return url

  query.delete('path')
  // Protected Vercel share links may also forward their platform-only token.
  // Vercel validates it before this function executes; it is not an API scope.
  query.delete('_vercel_share')

  const remainingQuery = query.toString()
  return pathname + (remainingQuery ? `?${remainingQuery}` : '')
}

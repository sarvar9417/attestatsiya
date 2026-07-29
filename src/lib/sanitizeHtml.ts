/**
 * Simple HTML sanitizer — XSS prevention.
 *
 * Uses a whitelist approach: only known-safe tags and attributes are kept.
 * All other tags, attributes, and script content are stripped.
 *
 * Usage:
 *   dangerouslySetInnerHTML={{ __html: sanitizeHtml(userContent) }}
 */

// Allowed HTML tags — only these survive sanitization
const ALLOWED_TAGS = new Set([
  'strong', 'em', 'b', 'i', 'u', 'br', 'p', 'span', 'code', 'a',
])

// Allowed attributes per tag
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel', 'className']),
  span: new Set(['className']),
  strong: new Set(['className']),
  code: new Set([]),
}

/** Strip dangerous protocols from URLs */
function safeUrl(url: string): string {
  const dangerous = /^\s*(javascript|data|vbscript|file|blob):/i
  if (dangerous.test(url)) return ''
  return url
}

/** Escape & < > " ' to prevent HTML injection */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Sanitize an HTML string — only whitelisted tags and attributes survive.
 * All script/iframe/object/style/onclick etc. are removed.
 */
export function sanitizeHtml(html: string): string {
  // Remove known-dangerous tags and their content
  const noDangerous = html.replace(
    /<script[\s\S]*?<\/script>|<iframe[\s\S]*?<\/iframe>|<object[\s\S]*?<\/object>|<embed[\s\S]*?<\/embed>|<style[\s\S]*?<\/style>/gi,
    '',
  )

  // Process remaining tags: parse and rebuild
  return noDangerous.replace(
    /<\/?(\w+)((?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*\/?>/g,
    (full, tagName: string, attrsStr: string) => {
      const tag = tagName.toLowerCase()
      const isClosing = full.startsWith('</')

      // Remove tags not in whitelist (but keep their content)
      if (!ALLOWED_TAGS.has(tag)) return ''

      if (isClosing) return `</${tag}>`

      // Parse and filter attributes
      const allowedAttrs = ALLOWED_ATTRS[tag]
      let safeAttrs = ''
      if (allowedAttrs) {
        const attrRegex = /\s+(\w+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g
        let match
        while ((match = attrRegex.exec(attrsStr)) !== null) {
          const attrName = match[1].toLowerCase()
          // Skip event handlers and javascript: URLs
          if (attrName.startsWith('on')) continue
          if (!allowedAttrs.has(attrName) && attrName !== 'class') continue

          const attrValue = match[2] ?? match[3] ?? match[4] ?? ''
          if (attrName === 'href' && !safeUrl(attrValue)) continue
          if (attrName === 'href' && safeUrl(attrValue)) {
            safeAttrs += ` href="${escapeHtml(attrValue)}"`
            safeAttrs += ' target="_blank" rel="noopener noreferrer"'
            continue
          }
          if (attrValue) {
            safeAttrs += ` ${attrName}="${escapeHtml(attrValue)}"`
          }
        }
      }

      return `<${tag}${safeAttrs}>`
    },
  )
}

import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

/**
 * Reject invalid/duplicated Supabase CLI migration versions before any DB
 * connection or deployment. Filename content must remain untouched; a version
 * uniquely identifies one migration even if filenames have different labels.
 */
export function checkMigrationVersions(filenames) {
  const errors = []
  const seen = new Map()
  for (const name of filenames) {
    if (!name.endsWith('.sql')) continue
    const match = /^(\d{14})_([a-z][a-z0-9_]*)\.sql$/.exec(name)
    if (!match) {
      errors.push(`Noto‘g‘ri migratsiya fayli: ${name}`)
      continue
    }
    const [version] = [match[1]]
    const prior = seen.get(version)
    if (prior) {
      errors.push(`Takroriy migratsiya versiyasi ${version}: ${prior}; ${name}`)
      continue
    }
    seen.set(version, name)
    const y = +version.slice(0, 4)
    const mo = +version.slice(4, 6)
    const d = +version.slice(6, 8)
    const h = +version.slice(8, 10)
    const mi = +version.slice(10, 12)
    const s = +version.slice(12, 14)
    const date = new Date(Date.UTC(y, mo - 1, d, h, mi, s))
    if (date.getUTCFullYear() !== y ||
      date.getUTCMonth() + 1 !== mo ||
      date.getUTCDate() !== d ||
      date.getUTCHours() !== h ||
      date.getUTCMinutes() !== mi ||
      date.getUTCSeconds() !== s) {
      errors.push(`Noto‘g‘ri UTC vaqt belgisi: ${name}`)
    }
  }
  return errors
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const files = readdirSync(join(root, 'supabase', 'migrations'))
  const errors = checkMigrationVersions(files)
  if (errors.length) {
    for (const error of errors) console.error(error)
    process.exitCode = 1
  } else {
    console.log(`Migration version preflight: PASS (${files.filter(name => name.endsWith('.sql')).length} SQL files)`)
  }
}

#!/usr/bin/env node
/**
 * Read-only lockfile audit reporter. Input: npm audit --json output files.
 * It never runs npm install, audit fix, or any production operation.
 */
import { readFileSync, appendFileSync } from 'node:fs'

const scopes = [
  ['frontend-runtime', process.argv[2]],
  ['backend-runtime', process.argv[3]],
  ['frontend-full', process.argv[4]],
  ['backend-full', process.argv[5]],
]

const counts = ['critical', 'high', 'moderate', 'low', 'info']
const rows = []
const issues = []
for (const [scope, path] of scopes) {
  if (!path) throw new Error('Usage: report-npm-audit.mjs ROOT_PROD BACKEND_PROD ROOT_FULL BACKEND_FULL')
  let parsed
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    throw new Error(`Cannot parse ${scope} audit report (${path}): ${String(error)}`)
  }
  if (!parsed.metadata?.vulnerabilities || typeof parsed.vulnerabilities !== 'object') {
    throw new Error(`Missing audit metadata for ${scope}; check npm registry connectivity`)
  }
  const meta = parsed.metadata.vulnerabilities
  rows.push(`| ${scope} | ${counts.map(k => Number(meta[k] ?? 0)).join(' | ')} |`)
  for (const [name, v] of Object.entries(parsed.vulnerabilities)) {
    if (!['critical','high'].includes(v.severity)) continue
    const advisoryIds = (v.via ?? []).filter(x => typeof x === 'object')
      .map(x => x.url ?? x.title ?? String(x.source)).slice(0, 2)
    const fix = v.fixAvailable === false ? 'none listed' :
      typeof v.fixAvailable === 'object'
        ? `${v.fixAvailable.name}@${v.fixAvailable.version} (possible breaking update)`
        : 'fix suggested'
    issues.push({ scope, name, severity:v.severity, advisory:advisoryIds.join(' '), fix })
  }
}
const header = [
  '## NPM dependency audit (review only)',
  '',
  'No package or production state was modified. Runtime rows omit development dependencies.',
  '',
  '| Lockfile scope | Critical | High | Moderate | Low | Info |',
  '| --- | ---: | ---: | ---: | ---: | ---: |',
  ...rows,
  '',
  '### High/critical candidates (not automatically exploitable)',
  '',
  '| Scope | Package | Severity | Fix hint |',
  '| --- | --- | --- | --- |',
  ...issues.sort((a,b) => a.scope.localeCompare(b.scope) || a.name.localeCompare(b.name))
    .map(i => `| ${i.scope} | \`${i.name.replaceAll('|','')}\` | ${i.severity} | ${i.fix.replaceAll('|','')} |`),
  '',
  'Review fix paths and runtime exposure before proposing lockfile upgrades. Do not run \`npm audit fix --force\`.',
  '',
].join('\n')
process.stdout.write(header+'\n')
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, header+'\n')

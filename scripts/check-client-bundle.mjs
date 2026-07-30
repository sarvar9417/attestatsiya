import { readdirSync, readFileSync } from 'node:fs'
import { extname, join } from 'node:path'

function javascriptFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return javascriptFiles(path)
    return extname(entry.name) === '.js' ? [path] : []
  })
}

const forbiddenMarkers = [
  {
    marker: 'correctAnswer',
    reason: 'client mock answer key',
  },
]

const findings = []

for (const file of javascriptFiles('dist')) {
  const content = readFileSync(file, 'utf8')
  for (const forbidden of forbiddenMarkers) {
    if (content.includes(forbidden.marker)) {
      findings.push(`${file}: ${forbidden.reason}`)
    }
  }
}

if (findings.length > 0) {
  for (const finding of findings) console.error(finding)
  console.error('Client bundle xavfsizlik tekshiruvi muvaffaqiyatsiz')
  process.exit(1)
}

console.log('Client bundle: exam answer-key markerlari yo‘q')

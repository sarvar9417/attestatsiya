import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const base = resolve(import.meta.dirname, '..');
const outputArg = process.argv[2];
if (!outputArg) {
  console.error('Usage: node scripts/task423-render-flowcharts.mjs <output-dir>');
  process.exit(2);
}
const outDir = resolve(outputArg);
if (outDir.startsWith(resolve(base, 'public') + '/')) {
  console.error('Refusing to render review-only figures directly into public/.');
  process.exit(2);
}
mkdirSync(outDir, { recursive: true });
for (let n = 15; n <= 24; n += 1) {
  const source = resolve(base, 'docs/qa/task423-flowcharts', 'savol_' + n + '.dot');
  const svg = execFileSync('dot', ['-Tsvg', source], { encoding: 'utf8' });
  // Graphviz inserts a remote SVG DTD; strip it before shipping local preview.
  const safe = svg.replace(/<!DOCTYPE\s+svg[\s\S]*?>/i, '');
  if (/<script|<foreignObject|onload\s*=|<image\b|xlink:href\s*=\s*["']https?:/i.test(safe)) {
    throw new Error('Unsafe generated SVG for question ' + n);
  }
  writeFileSync(resolve(outDir, 'savol_' + n + '.svg'), safe, 'utf8');
}
console.log('Rendered 10 review-only SVGs to ' + outDir);

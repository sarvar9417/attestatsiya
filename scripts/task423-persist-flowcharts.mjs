import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const base = resolve(root, 'docs/qa/task423-flowcharts');
const rendered = resolve(base, 'rendered');
const check = process.argv.includes('--check');
const items = [];
const listed = readdirSync(rendered).filter((p) => p.endsWith('.svg')).sort();
assert.deepEqual(listed, Array.from({ length: 10 }, (_, i) => `savol_${i + 15}.svg`));

const sha = (data) => createHash('sha256').update(data).digest('hex');
for (let n = 15; n <= 24; n += 1) {
  const file = `savol_${n}.svg`;
  const dot = `savol_${n}.dot`;
  const source = readFileSync(resolve(base, dot));
  const data = readFileSync(resolve(rendered, file));
  const svg = data.toString('utf8');
  assert.ok(data.length > 1000 && data.length < 120_000, `unexpected size: ${file}`);
  assert.match(svg, /<svg\b/);
  assert.match(svg, new RegExp(`<title>savol_${n}</title>`));
  assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<script|<foreignObject|<image\b|onload\s*=|onerror\s*=|javascript:|data:text\/html|xlink:href\s*=\s*["']https?:/i);
  items.push({ source_question_no: n, pdf_page: n - 6, dot, dot_sha256: sha(source), svg: file, svg_sha256: sha(data) });
}

const manifest = {
  schema_version: 1,
  source_file_id: '13k9q8hDA5b-s-5x8p1apCAnRqJaLKtmi',
  state: 'review_only_not_published',
  publish_ready: false,
  items,
};
const path = resolve(rendered, 'manifest.json');
const expected = JSON.stringify(manifest, null, 2) + '\n';
if (check) {
  assert.ok(existsSync(path), 'manifest missing');
  assert.equal(readFileSync(path, 'utf8'), expected, 'asset checksums and manifest out of sync');
} else {
  writeFileSync(path, expected, 'utf8');
}
console.log(`TASK-423: ${items.length} review SVGs and SHA256 manifest verified (${check ? 'check' : 'write'})`);

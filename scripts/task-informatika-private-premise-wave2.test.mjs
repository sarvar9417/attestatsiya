import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const privateSchema = readFileSync(new URL('../supabase/migrations/20261022102800_task548_informatika_private_editorial_derivatives.sql', import.meta.url), 'utf8');
const auditSql = readFileSync(new URL('../supabase/maintenance/informatika_pdf_private_wave2_READONLY.sql', import.meta.url), 'utf8');

const mask = (p) => (0xffffffff << (32 - p)) >>> 0;
const ip = (text) => text.split('.').reduce((a, x) => (((a << 8) | Number(x)) >>> 0), 0);
const str = (v) => [24, 16, 8, 0].map(i => (v >>> i) & 255).join('.');
const subnet = (address, bits) => str(ip(address) & mask(bits));
const usableHosts = (bits) => (2 ** (32 - bits)) - 2;

test('IPv4 /27 and /24 network boundaries use masks rather than guesswork', () => {
  assert.equal(subnet('10.8.5.46', 27), '10.8.5.32');
  assert.equal(subnet('10.8.5.61', 27), '10.8.5.32');
  assert.equal(subnet('10.8.5.70', 27), '10.8.5.64');
  assert.equal(subnet('10.8.5.46', 24), '10.8.5.0');
  assert.equal(usableHosts(27), 30);
  assert.equal(usableHosts(24), 254);
  assert.equal(str((ip('10.8.5.46') & mask(27)) | ~mask(27)), '10.8.5.63');
});
test('swapping adjacent pairs must preserve trailing odd-position character', () => {
  const swap = (s) => {
    const a = [...s];
    for (let i = 0; i < a.length - 1; i += 2) [a[i], a[i+1]] = [a[i+1], a[i]];
    return a.join('');
  };
  assert.equal(swap('abcdefghi'), 'badcfehgi');
  assert.equal(swap(swap('abcdefghi')), 'abcdefghi');
  assert.equal(swap('ab'), 'ba');
});
test('a defined counting domain includes zero but excludes text', () => {
  const synthetic = [4, 'text', 0, 12, null];
  assert.equal(synthetic.filter(x => typeof x === 'number').length, 3);
});
test('JavaScript odd/even branch is deterministic after variable initialization', () => {
  const evaluate = (n) => { let a = n; if (a % 2 === 0) a /= 2; else a *= 3; return a; };
  assert.equal(evaluate(13), 39);
  assert.equal(evaluate(18), 9);
  assert.equal(evaluate(0), 0);
});
test('one-byte storage assumptions must be explicit, not inferred from symbol alphabet', () => {
  const bytes = (symbols, bitsPerSymbol) => symbols * bitsPerSymbol / 8;
  assert.equal(bytes(5, 8), 5);
  assert.equal(bytes(5, 16), 10);
});
test('no learner release or fabricated human review via private SQL audit', () => {
  assert.match(privateSchema, /ENABLE ROW LEVEL SECURITY/);
  assert.match(privateSchema, /REVOKE ALL ON TABLE[\s\S]*?FROM PUBLIC, anon, authenticated/);
  assert.match(privateSchema, /CHECK \(learner_publish_ready IS FALSE\)/);
  assert.match(privateSchema, /CHECK \(independently_human_approved IS FALSE\)/);
  assert.match(auditSql, /source_stem_md5\s*=\s*md5\(source_stem\)/);
  assert.match(auditSql, /original_blocked/);
  assert.match(auditSql, /has_table_privilege\('anon'/);
  assert.doesNotMatch(auditSql, /\b(?:INSERT|UPDATE|DELETE|TRUNCATE|GRANT|REVOKE)\b/i);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const schema = readFileSync(new URL('../supabase/migrations/20261022102800_task548_informatika_private_editorial_derivatives.sql', import.meta.url), 'utf8');

test('a bar-chart ratio must be reconciled with linked spreadsheet cells', () => {
  const a = 4, c = 10, a2 = 8;
  const b2 = Math.min(a,c);
  const c2 = a2 / 2;
  const b1 = c2 / b2;
  assert.equal(b1,1);
  assert.equal(3*Math.sqrt(b1)*a + 6*c2,36);
});
test('an age word problem needs an explicit present-age premise', () => {
  const grandfatherAtTen = (combinedAge, currentChild) =>
    (combinedAge - currentChild) + (10 - currentChild);
  assert.equal(grandfatherAtTen(80, 5),80);
  assert.notEqual(grandfatherAtTen(80,5),grandfatherAtTen(80,6));
});
const asNum = a => a.split('.').reduce((v,part) => (((v<<8)|Number(part))>>>0),0);
const fromNum = n => [24,16,8,0].map(b=>(n>>>b)&255).join('.');
const subnet = (a,p) => asNum(a) & ((0xffffffff << (32-p))>>>0);
test('IPv4 broadcast and usable range exclude network and broadcast', () => {
  const n = subnet('172.20.8.57',27), end=(n|~((0xffffffff<<5)>>>0))>>>0;
  assert.equal(fromNum(n),'172.20.8.32');
  assert.equal(fromNum(end),'172.20.8.63');
  assert.equal(fromNum(n+1),'172.20.8.33');
  assert.equal(fromNum(end-1),'172.20.8.62');
});
test('private proposal does not confer human approval or public release', () => {
  assert.match(schema, /CHECK \(learner_publish_ready IS FALSE\)/);
  assert.match(schema, /CHECK \(independently_human_approved IS FALSE\)/);
  assert.match(schema, /REVOKE ALL ON TABLE[\s\S]*?FROM PUBLIC, anon, authenticated/);
});

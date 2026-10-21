import test from 'node:test';
import assert from 'node:assert/strict';

// Review-only regression for source defects in Mantiq 2-dars.pdf.
// These are editorial corrections, NOT published exam answer keys.
const integers = Array.from({ length: 201 }, (_, i) => i - 100);
const halfStep = Array.from({ length: 401 }, (_, i) => (i - 200) / 2);
const sameOnDomain = (a, b, xs = halfStep) => xs.every((x) => a(x) === b(x));
const exactlyOne = (expected, candidates) =>
  candidates.map((fn) => sameOnDomain(expected, fn)).filter(Boolean).length === 1;

test('Q2: whole-number domain makes the -4 < x < 10 minimum unique', () => {
  const allowed = integers.filter((x) => x > -4 && !(x >= 10));
  assert.equal(Math.min(...allowed), -3);
  assert.deepEqual([-4, -3, -2, 0].filter((x) => x === Math.min(...allowed)), [-3]);
  // In the real domain the original bound is open and has no least element.
  assert.ok((-4 + (-3.9)) / 2 > -4);
});
test('Q3: negation of OR expression is x >= 7', () => {
  const falseWhen = (x) => !(!(x >= 7) || x < 2);
  const options = [(x) => x < 7, (x) => x <= 7, (x) => x >= 7, (x) => x > 7];
  assert.ok(sameOnDomain(falseWhen, options[2]));
  assert.ok(exactlyOne(falseWhen, options));
});
test('Q4: 0 < x <= 15 on integers has minimum 1', () => {
  const valid = integers.filter((x) => x <= 15 && x > 0);
  assert.equal(Math.min(...valid), 1);
  assert.deepEqual([0, 1, 14, 15].filter((x) => x === Math.min(...valid)), [1]);
});
test('Q8: -5 < x < 17 on integers has maximum 16', () => {
  const valid = integers.filter((x) => !(x <= -5) && x < 17);
  assert.equal(Math.max(...valid), 16);
  assert.deepEqual([-4, 16, 17, -5].filter((x) => x === Math.max(...valid)), [16]);
});
test('Q9: false domain is x <= 1 OR x >= 9, not strict endpoints', () => {
  const falseWhen = (x) => !(x > 1 && x < 9);
  const options = [
    (x) => x < 1 || x > 9,
    (x) => x <= 1 || x >= 9,
    (x) => x > 1 && x < 9,
    (x) => x >= 1 && x <= 9,
  ];
  assert.ok(sameOnDomain(falseWhen, options[1]));
  assert.ok(exactlyOne(falseWhen, options));
});
test('Q13: outside [-2, 5] is x < -2 OR x > 5', () => {
  const falseWhen = (x) => !(x >= -2 && x <= 5);
  const options = [
    (x) => x < -2 || x > 5,
    (x) => x <= -2 || x >= 5,
    (x) => x >= -2 && x <= 5,
    (x) => x < -2 && x > 5,
  ];
  assert.ok(sameOnDomain(falseWhen, options[0]));
  assert.ok(exactlyOne(falseWhen, options));
});
test('Q14: NOT(x >= 0) OR NOT(x < 20) equals x < 0 OR x >= 20', () => {
  const trueWhen = (x) => !(x >= 0) || !(x < 20);
  const options = [
    (x) => x < 0 || x >= 20,
    (x) => x <= 0 || x > 20,
    (x) => x >= 0 && x < 20,
    (x) => x < 0 && x >= 20,
  ];
  assert.ok(sameOnDomain(trueWhen, options[0]));
  assert.ok(exactlyOne(trueWhen, options));
});


test('Q59: new 4-choice XOR set has exactly one equivalent formula', () => {
  const goal = (a, b) => (!a) === b; // ¬A ↔ B
  const candidates = [
    (a, b) => (!a && b) || (a && !b),     // XOR
    (a, b) => (a && b) || (!a && !b),     // XNOR
    (a, b) => (!a && b) || (a && b),      // B
    (a, b) => (a && !b) || (a && b),      // A
  ];
  const truth = (fn) => [false, true].flatMap((a) => [false, true].map((b) => Boolean(fn(a, b))));
  const target = truth(goal);
  assert.deepEqual(target, [false, true, true, false]);
  assert.deepEqual(candidates.map((x) => truth(x).every((v, i) => v === target[i])), [true, false, false, false]);
  assert.equal(new Set(candidates.map((x) => truth(x).map(Number).join(''))).size, 4);
});

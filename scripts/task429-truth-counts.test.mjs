import test from 'node:test';
import assert from 'node:assert/strict';

const source = {
  44: { fn: (a,b,c) => !a || b || (!c && a), type: 'false', expected: 1, correct_idx: 0, opts: [1,2,3,4] },
  46: { fn: (a,b,c) => !(a || !c) || (!a && b), type: 'false', expected: 5, correct_idx: 2, opts: [3,4,5,6] },
  47: { fn: (a,b,c) => !(!a || b) || (c && !b), type: 'true', expected: 3, correct_idx: 1, opts: [2,3,4,5] },
  49: { fn: (a,b,c) => a || b || (c && !b), type: 'true', expected: 7, correct_idx: 2, opts: [5,6,7,8] },
  50: { fn: (a,b,c) => !(!a || c) || (b && !c), type: 'false', expected: 5, correct_idx: 1, opts: [4,5,6,7] },
};
for (const [sourceNo, row] of Object.entries(source)) {
  test(`Source logic Q${sourceNo}: exactly one correct 8-row truth-table count`, () => {
    const evaluated = [];
    for (const a of [false,true]) for (const b of [false,true]) for (const c of [false,true]) {
      evaluated.push(Boolean(row.fn(a,b,c)));
    }
    const count = evaluated.filter(Boolean).length;
    assert.equal(row.type==='true'?count:8-count,row.expected);
    assert.equal(row.opts.length,4);
    assert.equal(new Set(row.opts).size,4);
    assert.equal(row.opts[row.correct_idx],row.expected);
    assert.equal(row.opts.filter(v=>v===row.expected).length,1);
  });
}

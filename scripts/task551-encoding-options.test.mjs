import test from 'node:test';
import assert from 'node:assert/strict';

// Source: Axborot kodlash test.pdf, original Q1-20.
// This tests source defects, NOT an approved answer key or a publication action.
test('Q2 rejects duplicate time-valued distractors',()=>{
  const aSeconds=3600;
  const bSeconds=60*60;
  assert.equal(aSeconds,bSeconds);
  const characters=128*32*60;
  const assumedBitsPerCharacter=8; // Assumption absent from the original source.
  assert.equal(characters*assumedBitsPerCharacter/512,3840);
  assert.equal(3840/60,64);
});
test('Q10 options are distinct, but algorithm still underspecified',()=>{
  const options=['C4A9','B4A','C4B','C4A'];
  assert.equal(new Set(options).size,4);
  assert.notEqual(options[0],options[3]);
  // 27 and 15 are odd integers, while 'odd digits' may refer to individual
  // digits within them; source does not define its transform/remove order.
  assert.notEqual('27'.split('').filter(d=>Number(d)%2!==0).join(''),'27');
});

import test from 'node:test';
import assert from 'node:assert/strict';
const output=n=>{
  let divisible=false;
  for(let i=2;i<=Math.floor(Math.sqrt(n));i++){
    if(n%i===0){divisible=true;break;}
  }
  return divisible?'N':'Y';
};
test('Attestatsiya7 Q3 original has two YNY choices, corrected has exactly one',()=>{
 const original=[[15,36,45],[17,35,41],[23,27,29],[16,29,36]];
 assert.deepEqual(original.map(xs=>xs.map(output).join('')),['NNN','YNY','YNY','NYN']);
 const corrected=[[15,36,45],[17,35,41],[23,27,28],[16,29,36]];
 const results=corrected.map(xs=>xs.map(output).join(''));
 assert.deepEqual(results,['NNN','YNY','YNN','NYN']);
 assert.equal(results.filter(x=>x==='YNY').length,1);
});

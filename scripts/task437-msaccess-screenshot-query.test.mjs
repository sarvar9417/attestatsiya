import test from 'node:test';
import assert from 'node:assert/strict';

// Original MS Access savollar.pdf Q10/Q11, screenshot page 4.
// Access LIKE *n* acts as substring match. Criteria on same row = AND;
// Criteria vs Or row = OR. Source answers are independent QA, not original keys.
const mevalar=[
 {id:1,name:'Olam',price:15000,kg:80,country:'Uzbekistan'},
 {id:2,name:'Ananas',price:25000,kg:50,country:'Xitoy'},
 {id:3,name:'Anor',price:20000,kg:90,country:'Eron'},
 {id:4,name:'Banan',price:18000,kg:120,country:'Ekvador'},
 {id:5,name:'Limon',price:35000,kg:64,country:'Tojikiston'},
];
test('Q10 Access Query Grid: Criteria both in same row is AND',()=>{
 const matched=mevalar.filter(r=>r.name.toLowerCase().includes('n')&&r.kg>80);
 assert.deepEqual(matched.map(r=>r.name),['Anor','Banan']);
 assert.equal(matched.length,2);
});
test('Q11 Access Query Grid: Criteria and Or on different lines is OR',()=>{
 const matched=mevalar.filter(r=>r.name.toLowerCase().includes('n')||r.price<=20000);
 assert.deepEqual(matched.map(r=>r.id),[1,2,3,4,5]);
 assert.equal(matched.length,5);
});
test('Different Access Criteria line matters for excluded fruit',()=>{
 const q10=mevalar.filter(r=>r.name.toLowerCase().includes('n')&&r.kg>80);
 const q11=mevalar.filter(r=>r.name.toLowerCase().includes('n')||r.price<=20000);
 assert.equal(q10.some(r=>r.id===1),false);
 assert.equal(q11.some(r=>r.id===1),true);
});

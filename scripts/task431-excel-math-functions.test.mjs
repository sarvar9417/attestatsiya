import test from 'node:test';
import assert from 'node:assert/strict';

// Source: Excelda Matematik funksiyalarga doir savollar uyga vazifa.pdf
// Review-only source calculations, NOT author-verified answer keys.
const abs=[-854,67,-133,-651,0,-931];
const signs=[-7.4,-63,97,-33,9.83,0];
const roots=[196,144,121,441,0.16,169];
const mods=[[93,4],[143,7],[144,16],[28,7],[-148,50],[-256,9],[35,49],[133,985],[-21,54],[-31,69],[-49,-14],[-97,-28],[-31,-79],[-143,-833]];
const powers=[[9,3],[7,4],[81,1/4],[8,3],[225,1/2],[27,2]];
const rounded=[[74.321,2],[48.567,1],[9.85,0],[152.456,0],[854,-2],[9872,-3],[-52.461,2],[-45.324,3]];
const products=[[8,6,3],[9,21,0]];
const expected=[854,67,133,651,0,931,-1,-1,1,-1,1,0,14,12,11,21,.4,13,1,3,0,0,2,5,35,133,33,38,-7,-13,-31,-143,729,2401,3,512,15,729,74.32,48.6,10,152,900,10000,-52.46,-45.324,144,0];
const excelMod=(n,d)=>n-d*Math.floor(n/d);
const excelRound=(n,k)=>Math.sign(n)*Math.floor(Math.abs(n)*10**k+.5+1e-10)/10**k;
const values=[
...abs.map(Math.abs),
...signs.map(Math.sign),
...roots.map(Math.sqrt),
...mods.map(([n,d])=>excelMod(n,d)),
...powers.map(([x,p])=>x**p),
...rounded.map(([n,k])=>excelRound(n,k)),
...products.map(ns=>ns.reduce((x,y)=>x*y,1))];
test('48 original Excel expressions have the verified numeric values',()=>{
 assert.equal(values.length,48);
 for(let i=0;i<48;i++)assert.ok(Math.abs(values[i]-expected[i])<1e-8,`Source question ${i+1}: expected ${expected[i]}, got ${values[i]}`);
});
test('MOD follows divisor sign, including negative divisors',()=>{
 assert.deepEqual(mods.slice(10).map(([n,d])=>excelMod(n,d)),[-7,-13,-31,-143]);
});
test('Excel FLOOR legacy source expressions omit required significance',()=>{
 const original=['=FLOOR(6.34)','=FLOOR(9.52)','=FLOOR(-27.48)','-FLOOR(-93.62)'];
 assert.equal(original.length,4);
 for(const formula of original)assert.equal(formula.match(/FLOOR\(([^,)]+)\)/)?.[1].includes(';'),false);
});

import test from 'node:test';
import assert from 'node:assert/strict';

// Source: Access takrorlash savollari.pdf pages 5, 6, 9.
// These are faithful TABLE transcriptions from screenshots, not invented answer keys.
const fruits=[
 {id:1,name:'Shaftoli',kg:25,price:12000,country:'Uzbekistan'},
 {id:2,name:'Banan',kg:20,price:22000,country:'Hindiston'},
 {id:3,name:'Kivi',kg:15,price:28000,country:'Eron'},
 {id:4,name:'Mandarin',kg:18,price:24000,country:'Tojikiston'},
 {id:5,name:'Mango',kg:22,price:30000,country:'Braziliya'},
];
const market=[
 {id:1,name:'Apple',unit:47,price:14000,cost:724000,region:'Uzbekistan'},
 {id:2,name:'Carrot',unit:28,price:12000,cost:246000,region:'Russia'},
 {id:3,name:'Lemon',unit:49,price:27000,cost:1245000,region:'Turkiye'},
 {id:4,name:'Pineapple',unit:36,price:87000,cost:982000,region:'Columbia'},
 {id:5,name:'Orange',unit:21,price:33000,cost:504000,region:'China'},
 {id:6,name:'Tomato',unit:57,price:15000,cost:648000,region:'Uzbekistan'},
];
test('Access source Q7: simultaneous Criteria kg>=18 and country Like *a*',()=>{
 const result=fruits.filter(r=>r.kg>=18 && /a/i.test(r.country));
 assert.deepEqual(result.map(x=>x.id),[1,5]);
 assert.deepEqual(result.map(x=>[x.name,x.kg,x.price]),[['Shaftoli',25,12000],['Mango',22,30000]]);
 // The third original source image is the only exact match.
});
test('Access source Q8: Not Like *a*o* and narxi >15000; Show excludes kg/country',()=>{
 const result=fruits.filter(r=>!/a.*o/i.test(r.name) && r.price>15000)
                    .map(r=>({id:r.id,meva_nomi:r.name,narxi:r.price}));
 assert.deepEqual(result,[
 {id:2,meva_nomi:'Banan',narxi:22000},
 {id:3,meva_nomi:'Kivi',narxi:28000},
 {id:4,meva_nomi:'Mandarin',narxi:24000},
 ]);
 // Fourth source image has exactly these three selected columns.
});
test('Access source Q13: SELECT product, price, region, ORDER BY unselected unit',()=>{
 const result=market.filter(r=>r.price<18000 && /l.*e/i.test(r.name))
   .sort((a,b)=>a.unit-b.unit)
   .map(r=>({product_name:r.name,price:r.price,region:r.region}));
 assert.deepEqual(result,[{product_name:'Apple',price:14000,region:'Uzbekistan'}]);
 assert.deepEqual(Object.keys(result[0]),['product_name','price','region']);
 // Second source image, NOT variants that improperly include unit/total_cost.
});

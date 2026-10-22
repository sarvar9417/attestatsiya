// Original JavaScript 1-fayl tahlili.pdf (Drive 1lucZUL4Z4npGWVNt3iAF6Q93YLxqGxNA).
// 21 restored, SECTION-scoped snippets. Source text is static, individually reviewed.
// These are educational example outputs, not author-provided A-D answer keys.
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const examples=[
  {
    "id": 1001,
    "page": 1,
    "code": "let a = 100;\nif (a >= 100) {\n  console.log(\"Topding!\");\n}",
    "expected": [
      "Topding!"
    ]
  },
  {
    "id": 1002,
    "page": 1,
    "code": "let parol = \"1234\";\nif (parol == \"12345\") {\n  console.log(\"To'g'ri\");\n}",
    "expected": []
  },
  {
    "id": 1003,
    "page": 1,
    "code": "let num = -3;\nif (num < 0) {\n  console.log(\"Manfiy\");\n}",
    "expected": [
      "Manfiy"
    ]
  },
  {
    "id": 1004,
    "page": 1,
    "code": "let ball = 85;\nif (ball >= 90) {\n  console.log(\"A\");\n}\nif (ball >= 80) {\n  console.log(\"B\");\n}",
    "expected": [
      "B"
    ]
  },
  {
    "id": 1005,
    "page": 2,
    "code": "let age = 16;\nif (age >= 18) {\n  console.log(\"Ruxsat\");\n}",
    "expected": []
  },
  {
    "id": 1006,
    "page": 2,
    "code": "let x = 4;\nif (x > 3) {\n  x = x * 2;\n}\nconsole.log(x);",
    "expected": [
      "8"
    ]
  },
  {
    "id": 1007,
    "page": 2,
    "code": "let a = 15;\nif (a % 5 == 0) {\n  a = a + 10;\n}\nconsole.log(a);",
    "expected": [
      "25"
    ]
  },
  {
    "id": 1008,
    "page": 2,
    "code": "let son = -2;\nif (son < 0) {\n  son = son * -1;\n}\nconsole.log(son);",
    "expected": [
      "2"
    ]
  },
  {
    "id": 1009,
    "page": 2,
    "code": "let ball = 70;\nif (ball >= 60) {\n  ball = ball + 5;\n}\nconsole.log(ball);",
    "expected": [
      "75"
    ]
  },
  {
    "id": 1010,
    "page": 3,
    "code": "let x = 8;\nif (x % 2 == 0) {\n  x = x / 2;\n}\nconsole.log(x);",
    "expected": [
      "4"
    ]
  },
  {
    "id": 2002,
    "page": 3,
    "code": "let son = -4;\nif (son > 0) {\n  son = son + 10;\n} else {\n  son = son * -1;\n}\nconsole.log(son);",
    "expected": [
      "4"
    ]
  },
  {
    "id": 2004,
    "page": 4,
    "code": "let ball = 45;\nif (ball >= 60) {\n  ball = ball + 5;\n} else {\n  ball = ball + 15;\n}\nconsole.log(ball);",
    "expected": [
      "60"
    ]
  },
  {
    "id": 2005,
    "page": 4,
    "code": "let x = 12;\nif (x > 5) {\n  x = x - 2;\n} else {\n  x = x + 2;\n}\nconsole.log(x);",
    "expected": [
      "10"
    ]
  },
  {
    "id": 2007,
    "page": 4,
    "code": "let y = 3;\nif (y > 5) {\n  y = y * 2;\n} else {\n  y = y + 4;\n}\nconsole.log(y);",
    "expected": [
      "7"
    ]
  },
  {
    "id": 2008,
    "page": 4,
    "code": "let a = 20;\nif (a >= 100) {\n  a = a / 10;\n} else {\n  a = a * 2;\n}\nconsole.log(a);",
    "expected": [
      "40"
    ]
  },
  {
    "id": 2009,
    "page": 5,
    "code": "let login = \"user\";\nif (login == \"admin\") {\n  console.log(\"Admin panel\");\n} else {\n  console.log(\"Oddiy foydalanuvchi\");\n}",
    "expected": [
      "Oddiy foydalanuvchi"
    ]
  },
  {
    "id": 2011,
    "page": 5,
    "code": "let ism = \"Ali\";\nif (ism == \"Ali\") {\n  console.log(\"Salom, Ali\");\n} else {\n  console.log(\"Salom, mehmon\");\n}",
    "expected": [
      "Salom, Ali"
    ]
  },
  {
    "id": 3001,
    "page": 6,
    "code": "let ball = 82;\nif (ball >= 90) {\n  console.log(\"A\");\n} else if (ball >= 70) {\n  console.log(\"B\");\n} else {\n  console.log(\"C\");\n}",
    "expected": [
      "B"
    ]
  },
  {
    "id": 3006,
    "page": 7,
    "code": "let x = 15;\nif (x < 10) {\n  x = x * 2;\n} else if (x < 20) {\n  x = x + 5;\n} else {\n  x = x - 5;\n}\nconsole.log(x);",
    "expected": [
      "20"
    ]
  },
  {
    "id": 3010,
    "page": 8,
    "code": "let score = 45;\nif (score >= 80) {\n  console.log(\"Super!\");\n} else if (score >= 50) {\n  console.log(\"Yaxshi\");\n} else {\n  console.log(\"Qayta urinib ko‘ring\");\n}",
    "expected": [
      "Qayta urinib ko‘ring"
    ]
  },
  {
    "id": 3014,
    "page": 9,
    "code": "let age = 20;\nlet hasID = false;\nif (age >= 18) {\n  if (hasID) {\n    console.log(\"Kirish mumkin\");\n  } else {\n    console.log(\"ID kerak\");\n  }\n} else {\n  console.log(\"Yosh yetmaydi\");\n}",
    "expected": [
      "ID kerak"
    ]
  }
];
test('PDF extraction restored precisely 21 distinct omitted snippets',()=>{
 assert.equal(examples.length,21);
 assert.equal(new Set(examples.map(x=>x.id)).size,21);
 assert.ok(examples.every(x=>x.page>=1&&x.page<=9));
});
for (const example of examples) {
 test(`PDF source #${example.id} page ${example.page} deterministic console output`,()=>{
  const emitted=[];
  const sandbox={console:{log:(...args)=>emitted.push(args.map(String).join(' '))}};
  vm.runInNewContext(example.code,sandbox,{timeout:100});
  assert.deepEqual(emitted,example.expected);
 });
}

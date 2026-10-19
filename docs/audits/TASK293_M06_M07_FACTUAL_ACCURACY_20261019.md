# TASK-293 — M06/M07 ilmiy aniqlik, Scratch 3.0 audit (2026-10-19)

## Aniqlangan faktik kamchiliklar va tuzatishlar

| Dars | Avvalgi muammo | Tuzatish |
|---|---|---|
| M06.01 Algoritm xossalari | Diskretlik haqida «chekli qadamlardan iborat» savoli natijalilik bilan chalkash | Savol alohida bosqichlarga bo‘linishni so‘raydi, javob kaliti saqlanadi |
| M06.04 Murakkablik | 1000 ta obyekt uchun bubble/quick sort aniq 1 000 000/10 000 taqqoslash deb ko‘rsatilgan | Bubble odatda O(n²), quicksort o‘rtacha O(n log n), yomon holatda O(n²); sanog‘i implementatsiyaga bog‘liq |
| M06.04 Sikl testi | «Bitta sikl» murakkabligi avtomatik O(n) deb noto‘g‘ri umumlashtirilgan | Savol n ta element bir martadan tekshirilishini aniq aytadi |
| M07.01 Scratch tarixi | MIT o‘rniga Massachusetts universiteti deb yozilgan | Scratch 2007-yilda MIT Media Labdagi Lifelong Kindergarten guruhidan, keyinchalik Scratch Foundation tomonidan rivojlantirilgan |
| M07.01 Koordinatalar | Sprayt har startda x=0, y=0 deya qat’iy xulosa | Savol sahna markaziga aylantirildi; spraytning haqiqiy koordinatasi o‘zgarishi mumkin |
| M07.02 Bo‘limlar | Asosiy bloklar 8 ta degan eskirgan savol, My Blocks yo‘q | Scratch 3.0 My Blocks qo‘shildi, savol yangi kategoriya vazifasini so‘raydi |

Har ikki Scratch darsiga auditorlik manba bloki kiritildi. Hech bir mavjud savol ID va correctIndex o‘zgartirilmadi; **M07.02-q3 savol matni va variantlari zamonaviy bilimga moslashtirildi**. Serverdagi nashr etilgan assessmentlar, DB va boshqa mavzular o‘zgartirilmadi.

## Manba izlari

1. [Scratch Foundation — Scratch tarixi](https://www.scratchfoundation.org/home): MIT Media Lab (2007), Mitchel Resnick boshchiligidagi guruh; Scratch Foundation (2019).
2. [Scratch Foundation rasmiy Scratch 3.0 interfeysi](https://scratchfoundation.github.io/scratch-gui/): Motion, Looks, Sound, Events, Control, Sensing, Operators, Variables, **My Blocks**.
3. [Scratch Team — Scratch 3.0 eʼloni](https://scratch.mit.edu/discuss/post/3372979/): kengaytmalar (Extensions) yordamida yangi bloklar.
4. Algoritmning diskretlik/natijalilik ajratilishi hamda Big-O murakkabligi umumiy informatika nazariyasi; aniqlangan misollar qo‘shimcha mustaqil ekspert talqini.

## Sifat chegarasi

Bu PR qisqa nazariyani to‘liq darslikka aylantirmaydi; **faktik aniqlik hotfixi** xolos. M06/M07 mazmunini keyinchalik mustaqil batafsil boblar bilan boyitish zarur. Physical PDF page verification talabini qamrab olmaydi.

## Test

src/tests/TASK293M06M07ScientificAccuracy.test.ts: aniq definitsiyalar, manbalar, Scratch 3.0 kategoriya, o‘zgarmagan javob kalitlari va Quick Sort murakkabligi.

CI frontend unit, lint, typecheck, build, E2E; backend/database/quality to‘liq o‘tmaguncha merge yo‘q. Deploy yo‘q.

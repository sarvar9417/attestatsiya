# TASK-345 — O‘rganish sahifalarini mantiqiy birlashtirish (2026-10-20)

## Muammo
M01–M16 bo‘yicha bir xil `BookReader` algoritmi `splitBalancedSections()`
bo‘limni ko‘pi bilan 4 blok / 4200 belgi hisobida kesgan. Shu sababli
masalan «Ikki o‘lchovli ro‘yxat» izohi va «Ishlangan misol 4» kabi qo‘shni
bloklar alohida «— davomi» sahifalariga chiqishi mumkin edi.

## Yechim
- Kitobning mualliflik `heading` va boshqa nazariya bloklari tarkibi, manba izi,
  kod, jadval hamda tartibi o‘zgartirilmadi.
- Qisqa bo‘limlar imkon qadar yonma-yon birlashtiriladi; sarlavhalar
  sahifa ichida ko‘rinishda qoladi.
- Odatiy sahifa chegarasi 16 blok / 6500 belgiga ko‘tarildi. Qisqa bloklarni
  majburan kesmaslik uchun blok soni yumshoq chegara hisoblanadi.
- Bir bo‘lim uzoq bo‘lsa bo‘linadi, lekin `example/solved/task` va
  unga bevosita tutash `code` bloklari birga saqlanadi.
- Qisqa oxirgi `— davomi` sahifasi, mazmunga mos va hajmga sig‘sa, oldingi
  sahifaga qo‘shiladi. Turli katta mavzularni majburan aralashtirish shart emas.
- Navigatsiya ko‘rsatkichi `BookReader`ning haqiqiy `sections.length`i,
  mundarija va avvalgi/keyingi tugmalar yangi sahifalar ro‘yxatidan olinadi.
- Published Supabase dars reviziyalari, test savollari va progress backend
  sxemasi o‘zgarmaydi. Deploy qilinmaydi.

## Sifat mezonlari
`src/tests/LessonPageConsolidation.test.ts`: 2D ro‘yxat/kod birligi,
qisqa sarlavhalarni birlashtirish, mayda oxirgi sahifa, barcha statik
nazariya bloklarining birma-bir saqlanishi.
`src/tests/BookReader.test.tsx`: uzun server-side Markdown nazariya
navigatsiyasi regressiyasi. `UnifiedLessonBookDesign` va `TASK277`
testlari avvalgi 4-blokli cheklov o‘rniga mazmun to‘liqligini tekshiradi.

## Release chegarasi
CI (lint, typecheck, vitest/build) va haqiqiy mobil/desktop UI tekshiruvi
aniqlangan natija bo‘yicha belgilanadi. DB migration yoki production release
talab qilinmaydi.

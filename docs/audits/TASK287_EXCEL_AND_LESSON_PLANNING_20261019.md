# TASK-287 — M03.04 va M15.04 nazariyani kitob darajasida kengaytirish (2026-10-19)

## Muammo

- **M03.04 «Excel vazifalari va elementlari»** statik asosiy dars dastlab 5 blok, xolos. «Workbook / Worksheet / Cell / Range» tushunchalari bor, ammo ish jarayoni, tahlil, maʼlumot turi va tekshirish misollari yetarli emas.
- **M15.04 «Dars turlari, rejalashtirish va sinfni boshqarish»** asosiy statik dars dastlab 6 blok. Dars turlarining jadvali bilan cheklangan; darsni loyihalash va real sinfni boshqarish bo‘yicha yaxlit bob yo‘q.
- Manbaviy qo‘shimchalarni ikkinchi marta bir xil qisqa nazariya shaklida berish o‘qishni qiyinlashtiradi.

## Bajarilgan

| Mavzu | Yangi bloklar | Sarlavhali bo‘limlar | Tarkib |
|---|---:|---:|---|
| M03.04 | 61 | 12 | Workbook/Worksheet, 16 384 ustun va 1 048 576 qator doirasi, manzil/diapazon, ma’lumot turi, formula kirish, reference, AutoFill, sort/filter, grafik, data quality, 6 mashq va javob |
| M15.04 | 65 | 15 | Tashkiliy shakl/metod/dars turini farqlash, 6 didaktik tur, rejalashtirish, diagnostika, xavfsiz boshqaruv, inklyuziya, baholash, refleksiya, 6 keys-mashq va javob |

- Yangi boblar **BookReader boshida**. Oldingi bir-birini takrorlovchi 5/6 asosiy konspekt bloki alohida ikkinchi nazariya bo‘lib chiqarilmaydi.
- M03.04 da avvalgi **5 ta tekshirilgan Office manbaviy qo‘shimcha bloklari** kitob ichida saqlangan; to‘rtta asl nazorat savoli va javob kalitlari o‘zgarmadi.
- M15.04 ning `getPedagogyStudyNotes` orqali ulangan manbaviy izohlari saqlangan; serverda baholanadigan pedagogika sinovi uchun frontendga yangi javob kalitlari chiqarilmagan.
- Format, test banki, backend maʼlumotlari, migrations yoki publishing statuslari o‘zgartirilmagan.

## Manbalar

1. [Cambridge+ «Informatika va axborot texnologiyalari», 10–11-sinf (2021)](https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view) — 8-bob «Elektron jadvallar» bosma 103-betdan, ayniqsa 8.01 katak, diapazon, tekshirish, import/eksport, jadval modellariga kirish.
2. [Cambridge+ 7-sinf](https://drive.google.com/file/d/1RhIRuHi8i7i18mkrd3eQQt2lJrbnfCkS/view) — elektron jadval va grafik orqali ma’lumotni taqdim qilish amaliyoti.
3. [F. O. Mirzayeva «Pedagogika nazariyasi va tarixi»](https://drive.google.com/file/d/1GG9dH4_kdMyj5cqKML21lQoZufO40E38/view) — 6-mavzu «Ta’limni tashkil etish shakllari va turlari», bosma taxminan 99–110-betlar, o‘qituvchining darsga tayyorgarligi bo‘yicha amaliy vazifalar taxminan 220-bet.
4. [«Dars turlari» o‘quv konspekti](https://drive.google.com/file/d/1L4PXxcviDgk5_iaOW5zLCG7536I6z0Ya/view) — didaktik turlarni farqlashda oldindan qayd etilgan yordamchi manba, mustaqil normativ kuchi tasdiqlanmagan.

Manba kontentlari **original o‘zbekcha pedagogik qayta bayon** tarzida yozilgan. Ayrim amaliy mashqlar, hisoblar va informatika sinfi vaziyatlari mustaqil tuzilgan; PDF’ning har bir beti, tasviri yoki jadvali so‘zma-so‘z transkripsiya qilinmagan. Excel tugmalari va mahalliy sana/raqam ko‘rinishi versiya/sozlamaga bog‘liq.

## Qabul mezonlari

`src/tests/TASK287ExcelClassroomBooks.test.ts` mavzu bloklari/bo‘limlari, birinchi ochilish ketma-ketligi, Office qo‘shimchalari, M15 manba qaydlari, Excel savollari kalitlari, qisqa konspekt takrorlanmasligi hamda boshqa darslarga taʼsir qilmasligini tekshiradi. `TASK284TheoryDepthInventory` va `TASK284CanonicalBookParity` navbatdagi qisqa mavzularni sentinel sifatida qayd qiladi.

**Merge faqat barcha required GitHub CI yashil bo‘lsa; deploy qilinmasin.** Matnning hamma bosma betlariga 100% to‘liqlik hali tasdiqlanmagan. Navbatdagi qisqa darslar: M03.06, M15.05 va auditdagi qolgan `brief` mavzular.

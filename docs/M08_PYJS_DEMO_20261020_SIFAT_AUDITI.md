# TASK — M08 Python va JavaScript: attestatsiya uslubidagi sifat auditi

**Sana:** 2026-10-20. **Modul:** M08 / S4.CODE. **Muhit:** `attestatsiya100%` Supabase; `sarvar9417/attestatsiya` monorepo. **Maqom:** kod audit + xavfsiz DRAFT staging, ekspert tasdig‘i va release hali ochiq.

## Qamrov va manba ishonchliligi

- **Etalon 1 — demodagi skrinshotlar:** Google Drive `Attestatsiya` papkasidagi *Informatika Demo testi .pdf*: PDFning **11-beti, 22-savol** — JavaScript massivga `push`/`pop`, indeks o‘zgarishi va `for`dagi shartli yig‘indi (javob 0); **16-beti, 31-savol** — Python funksiyasi yordamida uchta massivning monotonligini baholash, 2 ta `True`. Bu rasmlardagi ko‘rinadigan savollar uslubiy namuna; materialni vakolatli tashkilot tasdiqlagan rasmiy asl nusxa ekani mustaqil isbotlanmagan. QR/imzo/sertifikat mavjudligi da'vo qilinmaydi.
- **Etalon 2 — 2026-yil tushgan savollar yig‘masi:** `13.04.2026 Attetasiya Tushgan savollar.pdf`, **11-bet 23-savol**: JavaScript matndan raqamlarni teskari yig‘ish (`131991`); **12-bet 24-savol**: `pop` + elementni o‘zgartirish + juft/toq indeks bo‘yicha hisoblash (`-7`). Yig‘ma muallifi tomonidan qayd qilingan savollar; bu rasmiy davlat savollarining autentifikatsiyasi degani emas.
- **Darslik va spetsifikatsiya:** `Informatika Testlar spesifikatsiyasi.pdf`; ICT 9-sinf (Python), ICT 10-sinf (ro‘yxat/funksiya), Cambridge 10–11-sinf (JavaScript). Bankdagi manba sahifalari metadata sifatida mavjud, ammo **420 savolning har biriga darslik beti bo‘yicha insoniy mustaqil verifikatsiya bajarilgan deb bo‘lmaydi**.
- **Tarixiy yordamchi material:** `Test.pdf` (2019) dasturlash kodi va chalg‘ituvchilar uslubini ko‘rsatadi, lekin asosan Pascal, shu sabab 2026 Python/JS savollariga fan mazmuni bo‘yicha etalon emas.
- **Cheklov:** *Demo 2026 test 10 000 so‘mlik.pdf*, *20000 LIK informatika.pdf* va *2025 kuzgi demo*da matn qatlamining yo‘qligi/rasmli PDFlar sabab barcha savollar mashinali ajratib, to‘liq tekshirilgani da'vo qilinmaydi. Ular bo‘yicha qo‘shimcha betma-bet rasm auditi talab qilinadi.

## 1. Mavjud 420 bank — strukturaviy audit

| Mezon | Natija |
|---|---:|
| Kirish JSON savollar | 420 |
| Y1/Y2/Y3 | 252 / 84 / 84 |
| Har bobda | 18 / 6 / 6 |
| Bajarish kodi mavjud | 231 |
| Barcha 231 kod sintaktik/bajarilish muvaffaqiyatli | **231/231** |
| Kodli Y1: interpreter chiqishi bilan javob mos | **161/161** |
| Kodli Y3: to‘rt chiqish ketma-ketligi mos | **70/70** |
| `verified:false` manba yozuvlari | **189** (fan eksperti kerak) |
| Y1 da aynan bir xil to‘liq variantlar | **0** |
| Y1 da faqat registr bilan farq qiladigan variantlar | **19** (avtomatik xato EMAS; tahririy baho zarur) |
| 70 yangi Y2: aynan bir xil umumiy izoh | **70** |
| 70 yangi Y3: aynan bir xil formatdagi buyruq | **70** |
| Original Y2/Y3 qog‘oz ko‘rinishi — authoring JSON’da `a`/`pairs`/`seq` yo‘q | **14 Y2 va 14 Y3**; DB’da native shakli alohida tekshiriladi |

*Metod:* xususiy `private_rebalanced_420.json` fayli; Python 3 / Node.js dastur bajarilishi; natija–javob solishtirish; variantlar takrorlanishi, format/key shape, umumiy matn qoliplari. Dastur ishlashi fan uslubi, manba yoki barcha distractorlarning sifatli ekaniga dalil emas.

### Aniqlangan nuqsonlar

1. **Y2/J02-R2-01**: `Number("12")` va `parseInt("12px")` ikkalasi ham JSdagi `number` turidagi `12` qiymatini beradi; `12 soni` bilan `12 butun soni` bir-birini istisno qiladigan toza javoblar emas. **Bazadagi bu savol `published` holatida**. Variantlarni dastlabki tahrirda tuzatish mumkin, lekin *published* versiya joyida o‘zgartirilmaydi — yangi revision va editorial tasdiq kerak.
2. 70 ta yangi Y2 uchun **to‘liq mosliklarni emas, bir xil umumiy izohni** ko‘rsatish metodik nuqson; tahrir takliflari `140_ta_Y2_Y3_izoh_tahrir_TAKLIF.json` da.
3. 70 ta Y3 savolning aksariyatida `Har bir qadam oldingi o‘zgarishlarga tayanadi` jumlasi ishlatilgan. Bu ba'zi funksiyani mustaqil hisoblash misollarida **doim to‘g‘ri emas**. Takliflar haqiqiy konsol chiqishlari asosida yozildi.
4. 19 Y1 savolning noto‘g‘ri variantlarida *faqat katta/kichik harf o‘zgarishi* ko‘p ishlatiladi. Bu qiymatlar Python/JS chiqishiga nisbatan formal boshqa bo‘lishi mumkin; shu sabab **bir xil variant** deb avtomatik o‘chirmaslik, har birini tahririy baholash kerak.
5. 2026-yil demo namunalarida (Q22, Q23, Q24, Q31) ko‘p bosqichli sintez bor, bankda esa 91 Y1 kodsiz tushuncha savoli va ko‘p bir xil stem qoliplari mavjud. **Faqat memorization** savollarini qisman chuqurroq kod tahlili bilan almashtirish kerak, ammo asosiy faktlar ham saqlanadi.

### Zudlik bilan ko‘rish kerak bo‘lgan Y1 `review` IDlar

`P01-020`, `P01-025`, `P02-022`, `P02-026`, `P02-028`, `P03-019`, `P03-020`, `P03-026`, `P03-028`, `P04-020`, `P05-020`, `J01-026`, `J02-015`, `J02-019`, `J02-028`, `J03-019`, `J03-020`, `J03-021`, `J05-022`.

## 2. Attestatsiya savoli qanday qurilishi kerak?

Demo/tushgan savollar asosida **xulosa (nisbat bo‘yicha rasmiy talab emas)**:

- Matn ortidan haqiqiy bajariladigan dastur keltiriladi.
- Bir nechta semantik qadam birga keladi: massivni yangilash, shart, sikl, funksiya, satr kesimi, tipga aylantirish.
- `A/B/C/D` variantlar haqiqiy hisoblash xatolaridan kelib chiqadi: indeks yoki iteratsiyani noto‘g‘ri sanash, `pop()`dan keyin indeksni yangilamaslik, `break` bilan `continue`ni chalkashtirish, Python/JS operator ustuvorligini adashtirish.
- Birgina `print(5+3)` yoki identifikator ta'rifiga tayanadigan savollar kirish nazorati uchun foydali, ammo haqiqiy murakkab imtihon uslubini yetarlicha takrorlamaydi.
- Y2/Y3 ko‘nikma mashqlari sifatida saqlanadi; **252/84/84 nisbat rasmiy mockning qat'iy foizi emas**. S4.CODE rasmiy 50 savollik blueprintida jami 3 savol.

## 3. Hozir bajarilgan DB ishlari va xavfsizlik

**Kiritildi:** 14 ta original, ko‘p bosqichli **Y1 demo-uslubidagi** savol, har bir bob uchun bittadan (`P01–P07`, `J01–J07`). Python/Node yordamida 14/14 kodi va bir qiymatli to‘rt distractori tekshirildi. Har biri mavjud S4.CODE konstruktiga va source-backed darsga bog‘langan, kalitlari `question_keys` server jadvalida. Yangi savollar 2026-10-20 kuni **`draft`**, `published=0`; mavjud savollarga, attemptlarga va lessonlarga yozuv amalga oshirilmadi.

DB migratsiya nomi: `task_m08_pyjs_demo_style_14_questions_20261020_draft`. Xususiy SQL/kalitlar GitHub’ning ommaviy repozitoriysiga yozilmaydi.

**Muhim parallel o‘zgarish aniqlangan:** 2026-10-20 read-only so‘rovda eski `pyjs-2026-v2:*` savollaridan **386 published, 19 review, 155 archived**; yana boshqa `expert-audit:*` guruhda alohida nashrlar mavjud. Shuning uchun original 420 yozuvini biz tomonidan avtomatik arhivlash yoki `published` joyida tahrirlash **to‘xtatildi**. Ekspert revision workflow va maqomlar reconciliation zarur.

## 4. Tayyor tahrir paketi va keyingi yopilmagan ishlar

- `420_test_sifat_reyestri.json`: 420 savol bo‘yicha kod chiqarishi, manba/format ogohlantirishlari, flag va takrorlanish auditi.
- `sifat_statistikasi.json`: qisqa dasturiy statistika.
- `140_ta_Y2_Y3_izoh_tahrir_TAKLIF.json`: 70 Y2 moslik va 70 Y3 konsol ketma-ketligi asosida konkretroq izoh takliflari; ustiga 1 muhim semantik tuzatish (J02-R2-01) **proposal**.
- `xususiy_14_yangi_murakkab_y1.json`: 14 draft savolning mualliflik manba nusxasi, javoblari va izohlari. Joriy production `published` poolga qo‘shilmagan.
- `PRIVATE_20261020_14_demo_uslubidagi_y1_DRAFT.sql`: bajarilgan xususiy DB migratsiyasi.

**Release bloklovchilari:** (a) 189 verified:false savolning manba/ilmiy mustaqil reviewi; (b) 19 case-only distractorni tahririy ko‘rish; (c) J02-R2-01 uchun immutable published revision workflow; (d) 140 Y2/Y3 izohlarining inson eksperti tasdig‘i; (e) qolgan rasmli demo materiallar bo‘yicha to‘liq qo‘lda ko‘rish/OCR; (f) QA/test E2E va rasmiy mock feasibility; (g) release signoff. **Sifat tekshiruvi avtomatik bo‘lishi = ekspert signoff emas.**
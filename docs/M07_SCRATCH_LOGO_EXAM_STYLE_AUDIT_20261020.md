# M07 — Scratch/LOGO testlari bo‘yicha sifat auditi (2026-10-20)

## Manbalar va chegaralar

* 2026-yil **Informatika Testlar spesifikatsiyasi.pdf**, PDF 4-betdagi Scratch/LOGO kompetensiyalari: o‘zgaruvchilar, koordinatalar, bloklar, shart/sikl, Pen va Toshbaqa grafikasi; asosiy imtihonda ushbu yo‘nalishdan **3 ta topshiriq**.
* **13.04.2026 Attetasiya Tushgan savollar.pdf**, PDF 4-bet, №10: ichma-ich `REPEAT`, `FD 30`, `RT 90` va oraliq `RT 45` orqali murakkab toshbaqa chizmasini berish. Savolga **rasm** biriktirilgan. Ushbu bitta PDF haqiqiy attestatsiya savollarining barcha mumkin bo‘lgan uslublarini aks ettirmaydi.
* Drive: **Informatika Kuzgi demo testlari.docx** ichidan q04 va q34 kabi grafik savollar ishlab chiqilganligi ishlab chiqarish bazasidagi manba izlari bilan tasdiqlangan; foydalanuvchi tomonidan yuklangan **2025 kuzgi demo @Informatika_fani_ustozlari.pdf** skanerlangan va 14 betni vizual o‘rganish mumkin.
* Mahalliy manbalar: `testlar_metadata_v3.json` — 180 v2 + 60 v3; `scratch_logo_y2_y3_bank.json` — 24 Y2 + 24 Y3.
* Platforma: Supabase `plyqezulrfowyblsfpzy`, M07 12 asosiy published lesson. **Audit vaqtida boshqa ish jarayonlari bankni ko‘paytirayotgan bo‘lishi mumkin**. Dastlab 318 yozuv, 317 published, 1 archived qayd etilgan; yangi raqamlarni har tekshiruvda qayta hisoblash kerak.

## Tekshirilgan asosiy natijalar

| Mezon | Natija va izoh |
| --- | --- |
| 240 ta Y1 v2/v3 source fayllari | Variantlar, manba maydonlari, izohlar va 60 yangi savoldagi kod/rasm mavjudligi avtomatik tekshirildi. Bu **barcha matematik kalitlar mustaqil isbotlangan** degani emas. |
| 48 ta oldingi Y2/Y3 | Format va javob kaliti mavjudligi tasdiqlangan; mazmuniy darajadagi ayrim ehtiyot choralar kerak (masalan, ikki alohida Scratch hodisasini bitta skript sifatida ko‘rsatmaslik). |
| 60 ta v3 Y1 yangi savol | **0 ta qo‘shimcha kod fragmenti va 0 ta figura** (`code/figure` maydonlari). Bularning bir qismi qisqa tushunchani eslash savollari. Qiyinlik 1–5 darajasi ko‘pincha qator shabloni bo‘yicha berilgan, bilim talabini mustaqil ekspert tekshirishi kerak. |
| Oldingi 180 ta v2 | 97 ta kodli hamda 11 ta figura belgilangan namunalar mavjud; PDFdagi belgilar platformadagi haqiqiy rasm assetlari bilan bir xil degani emas. |
| Production grafikali savollar | Auditorlikning birinchi snapshotida faqat **2 ta published savolda chizma asseti** mavjud; biri kuzgi demo Scratch, biri LOGO. |
| Noto‘g‘ri formatdagi Y2 | `4fa5c094-ea5f-41bb-964b-7dbf00d6900a` va `5340d0fd-1894-4c10-bbc8-d9691ab07d9b` da o‘ng tarafdagi 4 tadan variant `side='a'` bo‘lgan. Har ikkisi **production bazasida `side='b'` qilib tuzatildi**; savol, javob-kalit va option UUIDlar saqlandi. |
| Arxivlangan savol | `BK 15` — `Scratch-LOGO-2026-v2:SL2-06-017` arxivda; uni nashr qilingan deb hisoblash yoki avtomatik tiklash mumkin emas. |
| To‘liq dublikatlar | Dastlabki snapshotda bo‘shliq normallashtirilgan savol matni bo‘yicha aynan takror topilmadi; **semantik/parafraz dublikatlar bundan mustasno**. |

## Sifat bo‘yicha ustuvor ishlar

1. **Amaliy yo‘nalish:** ta’riflar emas, algoritmning yakuniy qiymati, chiqishi, koordinata o‘zgarishi, ichma-ich `REPEAT` va rasmli chizmalar ko‘proq bo‘lishi kerak. 2026 spetsifikatsiyasining beshta amaliy komponenti alohida qoplanadi.
2. **Vizual moslik:** grafikli savolning rasmi berilmasa uni oddiy qog‘oz variantiga to‘liq mos deyish mumkin emas. Vektor chizma statik asset sifatida, qat’iy allowlist bilan beriladi.
3. **Y2/Y3 semantik shakl:** moslashtirishda har bir juftlik alohida asoslangan, ketma-ketlikda to‘rtta elementning tartibi shart bilan yagona bo‘lishi lozim. `when green flag clicked` va `when I start as a clone` kabi ikki hat (hat) blokni **bitta ulangan skript** deb tushuntirish mumkin emas.
4. **Murakkablikni qayta kalibrlash:** `show`, `pen up` kabi to‘g‘ridan-to‘g‘ri ta’rif savoliga 5/5 daraja bermaslik. Yuqori qiyinlik ko‘p bosqichli hisob yoki geometriya bilan tasdiqlanishi kerak.
5. **Statistik cheklov:** platformada qiyinlik darajasining avtomatik regressiyasi aniqlangan, lekin real imtihondagi item difficulty uchun empirik javob-statistika zarur; faqat muallif bahosi yetarli emas.

## Yangi original namuna banki

`new_review_questions.json` da **14 ta yangi original savol** mavjud: 12 ta Y1 (hisoblash, sikl, koordinata, shart, LOGO/Pen chizish), 1 ta Y2 va 1 ta Y3. №12 ning A–D variantlari `m07_logo_nested_squares_20261020.svg` vektor chizmada joylashgan. `import_review_questions.sql` ular uchun **idempotent review import** beradi, **avtomatik published qilishni nazarda tutmaydi**.

Manba izlarida “USLUB” / “ORIGINAL_REVIEW” ko‘rsatiladi. Ular asl attestatsiyada tushgan ayni savollar emas; manbalardagi ta’limiy va vizual shakldan ilhomlangan mustaqil topshiriqlar.

## Qolgan sifat eshiklari

* 317+ ta savolning **har bir** semantik yechimi inson eksperti / ishonchli Scratch yoki LOGO bajarilish modeli bilan qayta tekshirilmagan — 100% ekspert tekshiruvi bajarildi deb e’lon qilinmaydi.
* Yangi SVG frontend static pathi va serverdan qaytadigan `assets` bilan real brauzerda sinovdan o‘tmaguncha №12 published qilinmaydi.
* Yangilangan savollarni nazoratsiz `UPDATE/DELETE` qilish mumkin emas: yozuv UUIDlari hamda tarixiy attempt reference'lar saqlanishi kerak.
* Eski 313/317 testlarning sifat baholari bo‘yicha yakuniy expert-review jadvalini ishlab chiqish alohida davom etadi.
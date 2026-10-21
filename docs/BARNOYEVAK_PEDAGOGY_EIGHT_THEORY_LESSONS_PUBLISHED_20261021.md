# Pedagogika — sakkizta nazariy darsning jonli nashri (2026-10-21)

## Bajarilgan ish

Foydalanuvchining “Tayyorlarini merge va publish qilib ishlashda davom et” ko‘rsatmasi asosida Barnoyevak Drive manbalari va mavjud nashr qilingan darslar bilan solishtirilib, `public.lessons` jadvalidagi **8 ta `review` nazariy dars** bevosita `published` holatiga o‘tkazildi. Darslar `umumiy-pedagogika` modulida, modulning o‘zi ham `published`.

| Order | Slug | Manba va nazorat |
|---:|---|---|
| 108 | `pedagogika-fan-sifatida-tadqiqot-metodlari` | Mirzayeva pedagogika nazariyasi 2-mavzu; konseptual konspekt |
| 109 | `inklyuziv-talim-asoslari-va-moslashtirish` | Qodirova/Pulatova (2022); mustaqil manba o‘qilishi bilan tasdiqlangan, normativ akt o‘rnida emas |
| 110 | `korreksion-pedagogika-mutaxassislik-yonalishlari` | `Inklyuziv_talim_va_korreksion_pedagogika_qollanma.docx`; uchta asosiy mutaxassislik manbadan tekshirildi, ehtiyotkor terminologiya |
| 113 | `pedagogik-mahorat-tort-komponent-va-kasbiy-rivojlanish` | Xoliqov I bobining pedagogik mahorat tasnifi |
| 114 | `baholash-nazariyasi-distraktor-va-test-sifati` | Komil Jalilov (2020) — distraktorlar va savol sifati; tahlil namunasi baholanadigan test emas |
| 115 | `moslashtirish-va-ketma-ketlik-topshiriqlari-aniqligi` | Komil Jalilov (2020) — aniq topshiriq shartlari |
| 116 | `pedagogik-kreativlik-sifatlari-va-kompetentlik` | Muslimov va hammualliflar (2015) — kreativlik va kompetentlik |
| 117 | `oqituvchi-nutqining-yetti-kommunikativ-sifati` | Mahmudov (2007) — nutqning yetti sifat tasnifi |

Darslardan o‘quvchiga ko‘rsatilmasligi kerak bo‘lgan ayrim ichki `review` / “hali nashr qilinmaydi” izohlari manba va cheklovlarni yashirmasdan o‘quvchiga mos eslatmalarga almashtirildi. Boshqa matn mazmuni, slug yoki mavzu tartibi o‘zgartirilmadi.

## Baza postflight

- `public.modules.slug='umumiy-pedagogika'` — `published`
- Ushbu modulda nashr qilingan nazariy darslar: **8 → 16**.
- Hali reviewda: **2** — `baholash-nazariyasi-38-savol-takrorlash` va `pedagogik-refleksiya-va-kasbiy-tashxis`; ularni tekshiruvsiz nashr qilmaslik kerak.
- Barcha sakkizta yangi nashr qilingan darsda **asl manba izi mavjud**; tashqi manba o‘rniga rasmiy attestatsiya kaliti da’vosi qilinmagan.
- `public.questions.source_lesson_id` bo‘yicha ushbu sakkiz darsga biriktirilgan **0 ta scored savol** — `topic_test_question_count=20` esa konfiguratsiyadagi **maqsad**, yaratilgan testlar soni emas.
- Manba PDF nomzodlari, `question_keys`, `question_options`, `questions`, baholangan urinishlar va oldingi hisob-kitoblar ushbu nazariya nashri uchun o‘zgartirilmadi.
- `public.lessons` SELECT RLS siyosati `status='published'` yozuvlarini o‘qishga ruxsat beradi. Shu sababli mavjud ilova nazariya ma’lumotini status filtri bo‘yicha olishi mumkin. Alohida UI E2E ko‘rigi ushbu SQL postflightning o‘rnini bosmaydi.

## CI va merge holati

Ushbu fayl nashrni izga qo‘yish uchun GitHub audit materialidir, DB dagi 8 darsning o‘zi ilgari allaqachon kiritilgan va nashr holati **jonli** o‘zgartirilgan. Oldingi PR #475 va #482 da CI tekshiruvi noyob migratsiya versiyasi kolliziyasi sabab yiqilgan edi; ushbu noaloqador xatoni boshqa oqimdagi **PR #481** migration versiyasi va seed guard bilan tuzatdi. Yangi nashr darslari uchun qo‘lda frontend yoki production deployment qilinmadi.

Reproduktiv read-only query: `scripts/audits/pedagogy_eight_published_lessons_20261021.sql`.

## Qolgan ish

Ikki review darsdagi terminlar/yorliqlar/ilmiy izohlarni alohida tekshirish, manba PDFlaridan xavfsiz yana dars/test qilish, oldindan mavjud 416+ xususiy nomzod javoblarini mustaqil solishtirish. Unverified testlarni faqat nashr soni oshishi uchun `published` qilmang.

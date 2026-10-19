# TASK-251 — 20-savollik mavzu testlarining yetishmovchiligini manba asosida yopish

**Audit sanasi:** 2026-10-19  
**Manba:** production Supabase `plyqezulrfowyblsfpzy` — faqat SELECT va `topic_test_preview`; foydalanuvchi urinishlari, savol kalitlari, statuslari o‘zgartirilmadi.  
**GitHub:** P0/P1 xavfsizlik va strict-generator kodi PR #193 orqali `main`ga merge qilingan, **production SQL migratsiyasi/deploy qo‘llanmagan**. Shu bois production `topic_test_preview` ayrim kam savolli mavzularni hanuz xatosiz qaytaradi.

## Umumiy natija

- Nashr qilingan: **16 modul / 98 dars**.
- **25 ta test talab qiladigan dars** belgilangan 20 savoldan kam; har bir dars bo‘yicha jami **339 ta test o‘rni** to‘ldirilishi kerak.
- Ulardan **21** tasida kam savolli preview uchun `reason = null` (noto‘g‘ri ready), **4** tasida `topic_pool_insufficient`. PR #193 dagi qat’iy migration keyinchalik buning oldini oladi, lekin savol kamchiligini hal qilmaydi.
- **4 ta M01 ma’lumotnoma-ilovasi** mavzu testi talab qilmagani uchun bu hisobdan chiqarilgan; M01 AXB 19-bob mashqlari alohida.
- `direct review` — aynan shu darsning `source_lesson_id`iga bog‘langan review + key rekordlar. `construct review` — kamida bitta umumiy construct orqali bog‘langan review + key yozuvlar; bu **tasdiqlangan savollar emas**. Bir savol bir nechta darsga sanalishi, format, tasvir, mavzu semantikasi yoki author/editorial signoff talabga mos kelmasligi mumkin. Yangi savollar sonini ushbu ustunlar bilan bevosita hisoblab bo‘lmaydi.

| Modul | Dars (slug) | Published test | Yetishmaydi | Direct review | Construct review |
|---|---|---:|---:|---:|---:|
| M03 | excel-filtr-saralash-diagramma | 5 | 15 | 0 | 26 |
| M03 | excel-formulalar-va-funksiyalar | 11 | 9 | 0 | 90 |
| M03 | powerpoint-taqdimot-animatsiya-otish | 7 | 13 | 0 | 58 |
| M03 | word-hujjat-formatlash-va-tuzilma | 5 | 15 | 0 | 89 |
| M06 | algoritm-va-turlari | 8 | 12 | 0 | 30 |
| M06 | blok-sxema-va-psevdokod | 14 | 6 | 0 | 52 |
| M06 | masala-algoritmini-tuzish | 0 | 20 | 6 | 114 |
| M08 | javascript-shart-sikl-funksiya-massiv | 12 | 8 | 0 | 150 |
| M08 | javascript-sintaksis-asoslari | 0 | 20 | 6 | 66 |
| M08 | python-funksiya-va-massiv | 10 | 10 | 0 | 90 |
| M08 | python-ozgaruvchi-shart-sikl | 16 | 4 | 0 | 60 |
| M08 | python-sintaksis-asoslari | 7 | 13 | 0 | 60 |
| M09 | access-jadval-va-malumot-kiritish | 5 | 15 | 21 | 69 |
| M09 | kalitlar-va-jadvallarni-boglash | 6 | 14 | 0 | 48 |
| M09 | malumotlar-bazasi-va-mbbt-asoslari | 3 | 17 | 0 | 96 |
| M09 | murakkab-sorovlar-va-natijani-tahlil-qilish | 4 | 16 | 0 | 48 |
| M09 | sorovlar-yaratish | 7 | 13 | 0 | 48 |
| M10 | kompyuter-grafikasi-turlari | 11 | 9 | 0 | 76 |
| M10 | paint-va-photoshop-asoslari | 3 | 17 | 0 | 76 |
| M11 | css-stillarini-qollash | 7 | 13 | 0 | 76 |
| M11 | html-jadval-va-forma | 3 | 17 | 0 | 68 |
| M11 | html-matn-rasm-royxat | 7 | 13 | 0 | 8 |
| M12 | arxitektura-va-topologiyalar | 0 | 20 | 6 | 82 |
| M12 | internetdan-xavfsiz-va-maqsadli-foydalanish | 0 | 20 | 6 | 44 |
| M12 | tarmoqlar-va-qurilmalar | 10 | 10 | 9 | 85 |

**Modullar kesimi:** M03 52, M06 38, M08 55, M09 75, M10 26, M11 43, M12 50 = **339 ta per-lesson slot**.

## Ish tartibi va nazorat darvozalari

1. **P0 (nol savolli 4 dars):** M06 `masala-algoritmini-tuzish`, M08 `javascript-sintaksis-asoslari`, M12 `arxitektura-va-topologiyalar` va `internetdan-xavfsiz-va-maqsadli-foydalanish`. 20 savolli topic testni foydalanuvchiga yolg‘ondan ko‘rsatmaslik; source/construct va native format bilan 20 ta haqiqiy savolni tekshirish.
2. **P1:** M09 (75 slot), M08 qolgan 35 slot, M03 (52), M11 (43), M06 qolgan 18 slot, M10 (26), M12 qolgan 10 slot. Ayni manbadan takror savolni har xil darsga majburlab bermaslik.
3. **Per-question QA:** `source_reference`, `source_lesson_id`, `construct_id`, format (Y1/Y2/Y3), original vazifa, javob kaliti, distractor, izoh, zarur asset, savolning kognitiv darajasi, bir-biriga o‘xshash variantlarni mustaqil tekshirish.
4. **Ekspert tasdig‘i:** editorial checklist va haqiqiy imzo yo‘q bo‘lsa review status saqlansin; DB triggerini chetlab o‘tish yoki soxta signoff taqiqlanadi.
5. **QA:** yangi published pool faqat haqiqiy editorial tasdiqdan keyin 20/20 va `reason:null`; 15/50 blueprint, Y1/Y2/Y3, admin RLS, timer, offline/retry, mobile va test tarixini haqiqiy test akkauntida E2E tekshirish.
6. **Release:** foydalanuvchining alohida roziligisiz production SQL/publish/deploy qilinmaydi. Merge ≠ deploy.

**Qayta bajariladigan so‘rov:** [`scripts/audit-deficient-topic-review-candidates.sql`](../../scripts/audit-deficient-topic-review-candidates.sql). U javob kaliti payloadini qaytarmaydi va bazaga yozmaydi.

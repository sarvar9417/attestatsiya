# TASK-276 — 7 modul bo‘yicha takrorlangan savol matni risk-auditi

**2026-10-19 · Production SELECT-only, no stems/options/answer keys exported.**

## Reproduced live results

Normalized exact `stem_md` (harf registri kichraytirilib, bo‘shliqlar bitta ko‘rinishga keltirilib) bo‘yicha bir modulda **bir nechta savol UUID** bir xil matnga ega bo‘lgan 7 ta guruh topildi:

| Modul | Normalizatsiyalangan bir xil matnli guruhlar | Ortiqcha teng matnli UUID |
|---|---:|---:|
| M06 algoritmlar | 1 | 8 |
| M08 Python/JavaScript | 4 | 94 |
| M12 tarmoqlar | 2 | 15 |
| **Jami** | **7** | **117** |

**Tuzilma:**
- M06: bir guruhda 9 ta `review` UUID, hammasi `is_generated`.
- M08: 35+35+14+14 = 98 ta `review` UUID, 4 guruh; hammasi `is_generated`.
- M12: 10 ta `review` UUID (generator emas) va alohida 7 ta `published` generated UUID; bir xil matnli 2 guruh.
- Natijalarga ko‘ra ushbu 7 guruh savollari `assets` orqali ko‘rinadigan qo‘shimcha tasvirlarni saqlamaydi. Biroq variantlari, formatlari, konstruktlari, parametrlar/izohlaridagi haqiqiy farq **hali mustaqil tekshirilmagan**.

**117 raqami avtomatik yaroqsiz savollar soni emas.** Matematik va parametrik masalalarda bir xil stem turli raqamlar, variantlar, formula manbalari bilan mazmunli farqlanishi mumkin. Ayrim hollarda esa bu bir darsning testida bir savol takrorlanish xavfi. Shuning uchun `review` yoki `published` statusi avtomatik o‘zgartirilmaydi.

## Tekshiruv qoidalari

1. Har bir collision fingerprint uchun barcha revision UUIDlarni yopiq ekspert muhitida chiqarish (GitHubga savol javob kalitlarini kiritmasdan).
2. Savol matnidan tashqari variantlar, konstrukt, kognitiv daraja, manba sahifasi, Y1/Y2/Y3 kalit tuzilmasi va `source_lesson_id` ni qiyoslash; `is_generated` parametrlarining haqiqiy qiymatlarini alohida baholash.
3. Agar savollar semantik jihatdan aynan takror bo‘lsa, published revisionni mutatsiya qilmasdan yangi revision/archiv oqimi bilan hal qilish. `question_editorial_checks` ning to‘rtta mustaqil tasdiq belgisini talab qilish.
4. Stagingda bitta test sessiyasida bir xil stem fingerprint yoki semantik ekvivalent savollar qayta tushmasligi, 20/20 preflight hamda 50/120 imtihon kvotasi buzilmasligini tekshirish.
5. Published M12ning 7 ta itemli guruhiga ehtiyotkorlik bilan qarash: avtomatik o‘chirish foydalanuvchi natijalari va qayta ko‘rish tarixi yaxlitligini buzishi mumkin.

## Kod va foydalanish

- `scripts/sql/TASK276_SEVEN_MODULE_DUPLICATE_STEM_READONLY.sql` — DB ichida normalizatsiyalangan stem bilan tekshiradi, tashqariga faqat 12 belgili SHA? **Yo‘q: MD5 psevdonim identifikator**, guruh va sanash metadata qaytariladi (reversibil kalit emas); hech qanday stem, variant, answer key yoki user record chiqarilmaydi.
- `src/tests/TASK276StemCollisionAudit.test.ts` — SQL faqat SELECT ekanini, barcha 7 modulni, collision formulasini va human-review gate’ni himoyalaydi.

## Holat

GitHubdagi source QA/himoya kodega qo‘shimcha bo‘lib, bu audit **339 ta published test deficitini kamaytirmaydi**. TASK-275 bo‘yicha 25 darsda 339 bo‘sh o‘rin va 0 signed review mavjud. Shu bilan birga 1713 mapped keyed review occurrence noyob/approved item soni emas.

**Production DB yozish: 0. Release: 0. Human editorial sign-off: 0.**

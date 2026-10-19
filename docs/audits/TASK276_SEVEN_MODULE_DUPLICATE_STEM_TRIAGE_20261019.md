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

**Chuqur ikkinchi tekshiruv natijasi (muhim tuzatish):** 7 guruhning barchasi **Y2 matching yoki Y3 ordering** formati (M06: 9 Y2; M08: 35+35+14 Y2 va 14 Y3; M12: 10+7 Y2). Savol matni tabiatan bir xil «moslashtiring/tartiblang» vazifasi bo‘lishi mumkin. `question_options.content_md` matnlari tartibdan mustaqil ravishda normalizatsiya qilinib, fingerprint bo‘yicha qiyoslanganda **bir xil stem + bir xil variantlar to‘plamiga ega qo‘shimcha savol topilmadi (0 collision)**. Demak, dastlabki «117 excess» — **faqat stemga qarab chiqarilgan false-positive risk**; 117 ta noto‘g‘ri savol yoki olib tashlanadigan item deb hisoblash taqiqlanadi. Kalitdagi moslik/tartib semantikasi va manba tekshiruvi hamon kerak.\n\n**Tuzilma:**
- M06: bir guruhda 9 ta `review` UUID, hammasi `is_generated`.
- M08: 35+35+14+14 = 98 ta `review` UUID, 4 guruh; hammasi `is_generated`.
- M12: 10 ta `review` UUID (generator emas) va alohida 7 ta `published` generated UUID; bir xil matnli 2 guruh.
- Natijalarga ko‘ra ushbu 7 guruh savollari `assets` orqali ko‘rinadigan qo‘shimcha tasvirlarni saqlamaydi. Biroq variantlari, formatlari, konstruktlari, parametrlar/izohlaridagi haqiqiy farq **hali mustaqil tekshirilmagan**.

**117 raqami yaroqsiz savollar soni EMAS. Option-fingerprint tekshiruvi bo‘yicha 0 exact option collision.** Matematik va parametrik masalalarda bir xil stem turli raqamlar, variantlar, formula manbalari bilan mazmunli farqlanishi mumkin. Ayrim hollarda esa bu bir darsning testida bir savol takrorlanish xavfi. Shuning uchun `review` yoki `published` statusi avtomatik o‘zgartirilmaydi.

## Tekshiruv qoidalari

1. Har bir collision fingerprint uchun barcha revision UUIDlarni yopiq ekspert muhitida chiqarish (GitHubga savol javob kalitlarini kiritmasdan).
2. Savol matnidan tashqari variantlar, konstrukt, kognitiv daraja, manba sahifasi, Y1/Y2/Y3 kalit tuzilmasi va `source_lesson_id` ni qiyoslash; `is_generated` parametrlarining haqiqiy qiymatlarini alohida baholash.
3. Agar savollar semantik jihatdan aynan takror bo‘lsa, published revisionni mutatsiya qilmasdan yangi revision/archiv oqimi bilan hal qilish. `question_editorial_checks` ning to‘rtta mustaqil tasdiq belgisini talab qilish.
4. **Y2/Y3 uchun stem-only filterni qo‘ymang**: variantlari farqlanuvchi moslashtirish/tartiblash topshiriqlari bir xil umumiy matnga ega bo‘lishi tabiiy. Faqat to‘liq variant/kalit/payload va semantik jihatdan aynan takror variantlar expert-reviewdan so‘ng sessiya miqyosida cheklansin; 20/20 va 50/120 kvotalar saqlansin.
5. Published M12ning 7 ta itemli guruhiga ehtiyotkorlik bilan qarash: avtomatik o‘chirish foydalanuvchi natijalari va qayta ko‘rish tarixi yaxlitligini buzishi mumkin.

## Kod va foydalanish

- `scripts/sql/TASK276_SEVEN_MODULE_DUPLICATE_STEM_READONLY.sql` — DB ichida normalizatsiyalangan stem bilan tekshiradi, tashqariga 12 belgili MD5 psevdonim stem identifikatori, tur, option-to‘plamlarining faqat sanog‘i va boshqa guruh metadata qaytariladi (reversibil kalit emas); hech qanday stem, variant, answer key yoki user record chiqarilmaydi.
- `src/tests/TASK276StemCollisionAudit.test.ts` — SQL faqat SELECT ekanini, barcha 7 modulni, collision formulasini va human-review gate’ni himoyalaydi.

## Holat

GitHubdagi source QA/himoya kodega qo‘shimcha bo‘lib, bu audit **339 ta published test deficitini kamaytirmaydi**. TASK-275 bo‘yicha 25 darsda 339 bo‘sh o‘rin va 0 signed review mavjud. Shu bilan birga 1713 mapped keyed review occurrence noyob/approved item soni emas.

**Production DB yozish: 0. Release: 0. Human editorial sign-off: 0.**

# TASK-431 — Informatika manba PDF bazasi: 695 ta savol uchun sistematik QA inventarizatsiya

**Sana:** 2026-10-22. **Owner:** loyiha egasi topshirig‘i asosida AI-assistant. **Scope:** faqat `attest_ingest.telegram_informatika_pdf_question_candidates` yopiq source-staging jadvali. Production `public.questions` va tarixiy test natijalariga tegilmagan.

## Live SQL bilan tasdiqlangan natijalar

| Mezon | Miqdor |
|---|---:|
| Barcha source PDF savollari | 695 |
| Asl PDF sahifasi mavjud / vizual tekshirish belgisi | 695 |
| Asl `answer_key` yo‘q | 695 |
| Asl `extracted_answer_options=[]` | 376 |
| Variantlari mavjud | 319 |
| Boshqa fayldagi savol bilan aynan bir xil normallashtirilgan matn | 45 yozuv |
| Aynan shu PDFning ichida aynan bir xil normallashtirilgan matn | 6 yozuv |
| Learner nashrga tayyor source candidate | 0 |
| Originaldan asoslangan, **alohida yangi** nashr qilingan Y1 successors | 15 (TASK-428:10, TASK-429:5) |

## Productionga yozilgan idempotent, review-only sifat belgilari

1. `qa20261022_no_original_answer_options_confirmed` — faqat 376 ta `jsonb_array_length(extracted_answer_options)=0` va `answer_key IS NULL` holatida. Kontrolla: variantli savollarda 0 noto‘g‘ri flag.
2. `qa20261022_cross_source_identical_stem_review_only` — boshqa `source_file_id`dagi matn bilan `md5(regexp_replace(lower(stem),'[[:space:][:punct:]]+','','g'))` teng: 45. **Faqat tekshiruv belgisi**, matn bir xil bo‘lsa ham variant/rasm va kalitlar alohida tekshiriladi.
3. `qa20261022_same_pdf_exact_duplicate_review_only` — HTML savollar 1.pdf #4/#8 va Mantiq 2-dars.pdf #51/#53, #55/#59 juftliklari, jami 6 yozuv. Original nusxalar o‘chirilmagan. #59 allaqachon boshqa corrected successor orqali nashr etilgan; original ikkita kalit nuqsoni saqlanmoqda.

`quality_flags` arrayiga qo‘shish faqat belgisi oldin yo‘q yozuvlarda bajarilgan. Barcha source `extracted_question_text`, `extracted_answer_options`, `answer_key`, `source_pdf_url`, `source_page_number` saqlangan.

## Faol ish navbati (695 ta yozuv)

| Keyingi harakat | Soni |
|---|---:|
| 01_fix_source_defect | 170 |
| 02_restore_visual_source_asset | 53 |
| 05_human_editorial_approval | 472 |

Bu avtomatik `review_queue`ning `next_action` qiymatlari, ularning barchasi nashr blokidan o‘tgani yoki tasdiqlanganini anglatmaydi. 472 editorial bosqichidagi yozuvda ham original `answer_key` yo‘q. Asl PDFdagi bepoyon noaniq savollarga kalitni taxmin qilib `publish_ready` qo‘yish mumkin emas.

### Keyingi aniq partiyalar

- `Excelda Matematik funksiyalarga doir savollar uyga vazifa.pdf` — 52 ta formulasimon, asl MC variantlarisiz; natija/so‘rov aniqlash va qayta yozish.
- `Excelda Matematik va Mantiqiy funksiyalarga oid savollar.pdf` — 40 ta; mustaqil Excel formulasi hisoblagichi bilan QA.
- `Mantiq 2-dars.pdf` — 60 tadan 50 tasida asl variantlar yo‘q; formula va talabning mosligini ko‘rib chiqish.
- `MS PowerPoint testlar.pdf` — 9 rasmli savol xususiy PNG arxivga qayta tiklangan, ammo stable learner assetga ulanmagan; №10 noaniq shart release-blocked.
- Qolgan 53 grafik manbani savol reviziyasiga biriktirish va mobile/E2E render tekshiruvi.

**Doimiy nashr standarti:** yangi savol revision ID, 4 ta aniq farqli variant, yagona isbotlangan key, didaktik tushuntirish, subject–construct–lesson bog‘lanishi, `is_generated=true` (AI tahririda), immutable snapshot, source va grafika mosligi, hammasini live postflight orqali tekshirish. Inson eksperti bo‘lmagan joyda `human_approved=true` ni soxtalashtirmaslik.

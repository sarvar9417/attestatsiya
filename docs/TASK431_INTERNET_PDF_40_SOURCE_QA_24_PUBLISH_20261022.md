# TASK-431 — Internet test PDF: 40/40 original nazorat, 24 yangi savol release (2026-10-22)

**Source:** [Internet test.pdf](https://drive.google.com/file/d/1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX/view), 3 bet, 40 ta original A/B/C/D. Original PDFdan pdftotext -layout orqali ikki ustunli sahifalar birma-bir tekshirildi.

## Production QA va chiqarilgan natija

- **24 ta** manba topshirig‘i asosida **yangi savol (immutable source successor)** yozildi; source PDFdagi xatoli/qisqa variantlar emas, mavzuga mos yaqin distractorlar va ba’zilarida amaliy vaziyat berildi.
- Original savol raqamlari: **1,3,4,7,8,10,12,13,14,17,18,22,24,25,26,27,28,30,31,32,34,35,38,40**.
- Nisbiy sinov: Supabase production `BEGIN…ROLLBACK` **PASS**, so‘ng `COMMIT` **PASS**.
- Postflight: **24/24 published**, **96/96 A-D option**, **24/24 keyed+pedagogical explanation**, **24/24 official_mock_eligible**, **24/24 immutable fingerprint release ledger**, **0 fictitious editorial human signoffs**.
- `S6.NET.05` (brauzer, qidiruv va WWW) va `S6.NET.04` (Internetdan xavfsiz foyd.) construct va published lesson links tekshirildi.
- `is_generated=true`: yangi savollar AI yordamida qayta tuzilgan; **mustaqil inson eksperti imzosi yo‘q**.
- 24 ta asl staging candidate `separate_corrected_successor_published_20261022_original_remains_blocked` deb belgilandi; ularning `answer_key` qiymati hanuz NULL.

## Qolgan 16 ta original Internet savoli

Quyidagi 16 savol uchun faqat yopiq expert QA notes yozildi (`attest_ingest.telegram_informatika_pdf_free_response_qa`, review-only). Original source o‘zgarmadi, to‘g‘ri tasdiqlanmagan kalit kiritilmadi:

| Original № | Vaziyat |
|---|---|
| 2 | Internet so‘zini qat’iy acronym deb yozish noaniq |
| 5,6 | Ilk WWW sayti va muallifi; Internet vs Web aniqlik talab |
| 9 | URL «nechta asosiy qism» standard/misolga bog‘liq, aniq kalit yo‘q |
| 11 | `.uz` TLD va `www.google` partial hostname aralashgan |
| 15 | Web 1.0 «asosan» statik, istisnolarni inkor etmaslik kerak |
| 16 | «Faqat dasturchi» mutlaq xato: vakolatli muallif/muharrir ham bor |
| 19 | YouTube pedagogik Web 2.0 tipologiyasi — kontekstni aytish kerak |
| 20,21,39 | Web 3.0 atamasi semantic/decentralized/AI talqinlari bilan bahsli |
| 23 | browse so‘zining tarjimasi kontekstli bo‘lishi lozim |
| 29 | «Eng mashhur» subyektiv, aniq servis turlarini ajratish |
| 33 | Qidiruv natijasi FAQ/snippet/knowledge panel sabab faqat link emas |
| 36,37 | Mijoz brauzeri vs server/URL, yoki sahifani manzillash so‘rovi aniqlashtirilishi lozim |

Avval mavjud bo‘lgan source blockerlar saqlangan; №2, 16, 33 uchun qo‘shimcha manba release guard yaratildi. 40 ta source savolning **24 tasi yangi nashrga asos bo‘ldi, 16 tasi asoslangan expert reviewda**, bu 40 originalni to‘g‘ridan-to‘g‘ri nashrga tayyor deb da’vo qilmaydi.

## Release nazorati

`supabase/maintenance/task431_publish_24_internet_source_rewrites.sql` — exact source ID/no, 4 unique answers, key, educational explanation, source vis-check, construct/lesson preflight, no duplicates, official eligible and immutable fingerprint postflight. Matn `published` tarixiy savollarni UPDATE qilmaydi; `exam_items` va attemptsga tegmaydi.

`scripts/task431-internet-source.test.mjs` / `.github/workflows/task431-internet-qa.yml` — 24 manifest/option integrity va 4 kalit pozitsiyalar balansini tekshiradi.

**Qolgan 695 PDF stagingdagi candidate answer_key 0**. 24 yangi published successor original source validation emas.

# TASK-431 — Excel Matematik funksiyalar, 52 manba formula bo‘yicha QA

Original PDF: [Excelda Matematik funksiyalarga doir savollar uyga vazifa.pdf](https://drive.google.com/file/d/1QiqRt1THGPr86C4MraFDpJrSLbjF0K-s/view). Private source ID `1QiqRt1THGPr86C4MraFDpJrSLbjF0K-s`.

2026-10-22: **48/48 mustaqil hisoblangan natija va Uzbek explanation** `attest_ingest.telegram_informatika_pdf_free_response_qa`ga idempotent yozilgan. Barcha `human_approved=false`, `publish_ready=false`, chunki asli 52 ta faqat hisoblash mashqi (A-D variantlari berilmagan). Original formulas, content and source metadata saqlanadi.

### Hisoblangan natijalar

| Savol № | Natija |
|---:|---:|
| 1 | 854 |
| 2 | 67 |
| 3 | 133 |
| 4 | 651 |
| 5 | 0 |
| 6 | 931 |
| 7 | -1 |
| 8 | -1 |
| 9 | 1 |
| 10 | -1 |
| 11 | 1 |
| 12 | 0 |
| 13 | 14 |
| 14 | 12 |
| 15 | 11 |
| 16 | 21 |
| 17 | 0.4 |
| 18 | 13 |
| 19 | 1 |
| 20 | 3 |
| 21 | 0 |
| 22 | 0 |
| 23 | 2 |
| 24 | 5 |
| 25 | 35 |
| 26 | 133 |
| 27 | 33 |
| 28 | 38 |
| 29 | -7 |
| 30 | -13 |
| 31 | -31 |
| 32 | -143 |
| 33 | 729 |
| 34 | 2401 |
| 35 | 3 |
| 36 | 512 |
| 37 | 15 |
| 38 | 729 |
| 39 | 74.32 |
| 40 | 48.6 |
| 41 | 10 |
| 42 | 152 |
| 43 | 900 |
| 44 | 10000 |
| 45 | -52.46 |
| 46 | -45.324 |
| 47 | 144 |
| 48 | 0 |

Funksiyalar bo‘yicha guruhlar: ABS №1–6, SIGN №7–12, SQRT №13–18, MOD №19–32, POWER №33–38, ROUND №39–46, PRODUCT №47–48. `MOD(n;d)=n-d·FLOOR(n/d)` formulada manfiy bo‘luvchi holatlari e’tibor bilan hisoblandi: №29→−7, №30→−13, №31→−31, №32→−143. ROUND(-52.461;2)→−52.46, ROUND(9872;−3)→10000. PDF'dagi `POWER(81;1/4)` va `POWER(225;1/2)` source matni shu holda explanationda saqlandi.

### To‘rt sintaksis nuqsoni / RELEASE BLOCKED

№49 `=FLOOR(6.34)`; №50 `=FLOOR(9.52)`; №51 `=FLOOR(-27.48)`; №52 `-FLOOR(-93.62)`. Excel `FLOOR(number,significance)` talab qiladi; asl 4 mashqda `significance` yo‘q. `FLOOR.MATH` boshqa funksiyadir. Hech bir natija taxmin qilib to‘g‘ri deb kiritilmadi. 4 `invalid_source_formula` private nashr blocker yaratildi. Tahrir qilinadigan yangi Y1 shakllar uchun significance va Excel versiyasini shartda aniq belgilash kerak.

**Tasdiqlash (live postflight):** 52 source rows; 48 free-response QA rows №1–48; 48 private/not approved; release blockers №49–52; 0 source answer key. Bu mashqlarning biri ham shu qadamda learner bankka nashr qilinmadi.

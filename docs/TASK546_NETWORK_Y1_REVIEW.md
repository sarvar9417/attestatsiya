# TASK-546 — 8 ta tarmoq va qidiruv Y1 testining javob variantlarini sifatli qayta ishlash

**Sana:** 2026-10-22. **Scope:** `S6.NET` guruhining aynan sakkizta `published` Y1 asl savoli uchun yangi **REVIEW** nusxalari. Owner tomonidan full-bank QA davom ettirishga ruxsat berilgan, ammo mustaqil inson ekspertizasini o‘tkazilgan deb ko‘rsatish mumkin emas.

## Sifat tuzatishlari
| Original ID | Atama yoki kontekst | Asl kalit bilan munosabat | Manba tekshiruvi |
|---|---|---|---|
| `03866ab9-6791-5e6b-3403-999d93ddb138` | Repeater: signalni regeneratsiya qilish | Aynan saqlangan; router/switch/DNS yaqin distractorlar | **ICT 11 (2021) PDF 160-sahifa**, bevosita ko‘rildi |
| `ed3c2030-e2ac-1d94-32d6-8cd8d6e20836` | T-568A va T-568B | Aynan saqlangan; kabel standartiga yaqin alternativalar | **ICT 11 (2021) PDF 153-sahifa**, pin/rang sxema rasmi bilan |
| `7bb51b69-dd0d-eed7-9c1e-590dd7445992` | IP orqali kirish ishlaydi, domen ishlamaydi | Aynan saqlangan; DNS faqat ehtimoliy sabab degan izoh | **ICT 11 PDF 175–176-sahifa**, nom↔IP moslashtirish |
| `37b107a3-959e-8df2-daf6-2d61d720d1b1` | TCP qayta uzatadi, UDP o‘zi kafolatlamaydi | Aynan saqlangan; UDP ilova darajasida boshqacha bo‘lishi mumkin | **ICT 11 PDF 172-sahifa** TCP/IPni qisqacha eslatadi, TCP–UDP farqi bu betda to‘liq ko‘rsatilmagan |
| `83d304a8-e9df-c386-bda0-babff03533b6` | VLSM blok chegarasi va manzil diapazoni | Aynan saqlangan | **Source mismatch**: asl izohdagi RFC 4291 IPv6 Addressing Architecture haqida; VLSM bo‘yicha bevosita darslik sahifasi topilmadi |
| `cdc2e64a-e62b-e35e-3fda-28994efce954` | Qidiruvni kalit/operator bilan yaxshilash | Aynan saqlangan | M6/C5 darslik sahifasi hali bevosita tekshirilmagan |
| `fac120d8-5157-0300-4f31-5f1bfe247f33` | Homiylik natijasida joylashish tartibi | Aynan saqlangan | M6/C5 darslik sahifasi hali bevosita tekshirilmagan |
| `2b613454-06ad-44c3-8907-2f115cc1f199` | Saytning haqiqiyligi va ma’lumot zarurligi | Aynan saqlangan | `specgap-2026` sahifa dalili hali bevosita tekshirilmagan |

**Manba ajratish:** ICT 11-sinf kitobidagi sahifalar aynan foydalanuvchi yuklagan `ICT 11_sinf-2021(1).pdf` orqali `pdftotext` va vizual ko‘rish bilan tahlil qilindi. Bu eski `source_reference` dagi M11/C11 kitob kodlari aynan bir xil nashr ekanini avtomatik isbotlamaydi. RFC rasmiy mazmuni: [RFC 4291 — IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291.html). Manba tafsilotlari: `docs/quality/task546_network_8_source_evidence.json`.

## Exact audit / xavfsizlik
- 8 original `published`, `S6.NET`, `Y1`, barcha `source_lesson_id` bilan, hech birida avvalgi `question_bank_revisions` source-revision yo‘q.
- 3 ta mavzuga yaqin distractor + **byte-for-byte** o‘zgarmagan original correct text; to‘rttasi noyob, bir dona mapped correct key, variantlar uzunligi max/min ≤1.8, correct/max wrong ≤1.25.
- AI-draftdagi yangi savollar `is_generated=true`, `status=review`, mustaqil human approval **false**, `release_performed=false`. Ko‘rib chiqish uchun `medium` alert: asl savollar eligibility holatiga yangi high-severity to‘siq qo‘shilmaydi.
- Original 8 ta savolning o‘zi `published`, ulardan **2 ta** eski exam item bog‘lanishi qoladi. Ushbu sakkiz asl savoldan **0** tasi hozir official-mock eligible (avvalgi sifat findinglari sabab); draft stage buni o‘zgartirmasligi kerak.
- **Production BEGIN…ROLLBACK staging rehearsal 2026-10-22: 8 yangi review/32 variants/8 remapped keys PASS**, `official_mock_eligible_original=0`, hech qanday doimiy yozuv yo‘q.
- CI/lint/TypeScript/frontend/backend/db/e2e gate + GitHub main merge shart. Keyin faqat REVIEW-only migration runner orqali bir martalik stage va read-only postflight; learner publication keyingi alohida editorial task.
- **Nashr uchun muhim blocker:** VLSMga noto‘g‘ri RFC 4291 havolasi, TCP–UDP manba qismanligi, qolgan 3 savolning PDF sahifalari hali tasdiqlanmagan. Manba dalilini to‘ldirmasdan «ekspert tasdiqladi» deyish mumkin emas.

## Handoff
Task: TASK-546. Natija: 8 source-pinned review proposals; kitob dalillari 3 verified, 1 partial, 1 mismatch, 3 pending. O‘zgargan fayllar: SQL, test, PDF-evidence JSON, ushbu hujjat va task tracking. Migratsiya: CI/main gate'dan oldin yo‘q. Test: production full BEGIN→ROLLBACK PASS. Qolgan xavf: nashr uchun ekspert va sahifa dalillari, concurrent main drift. Parent: GitHub #469.

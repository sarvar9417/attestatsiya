# TASK-275 — production topic-test kamchiliklari va tahririy tasdiqlar (SELECT-only)

**Sana:** 2026-10-19. **Loyiha:** production Supabase `plyqezulrfowyblsfpzy` (`attestatsiya100%`). SQL faqat SELECT; savol kaliti, foydalanuvchi ma’lumotlari, o‘zgarish/migratsiya yo‘q.

## Yangi production SELECT natijalari

`public.topic_test_preview` qaytargan `available_count` hisobidan:

| Modul | Yetarli bo‘lmagan darslar | Yetishmayotgan published+keyed o‘rin |
|---|---:|---:|
| M03 | 4 | 52 |
| M06 | 3 | 38 |
| M08 | 5 | 55 |
| M09 | 5 | 75 |
| M10 | 2 | 26 |
| M11 | 3 | 43 |
| M12 | 3 | 50 |
| **Jami** | **25** | **339** |

**To‘rtta 0/20 P0 mavzu:** M06 «Masalaning algoritmini tuzish»; M08 «JavaScript sintaksisi asoslari»; M12 «Internetdan xavfsiz va maqsadli foydalanish»; M12 «Tarmoq arxitekturasi va topologiyalari».

Productionning eski preview kodi `reason=null` qaytarsa ham, bu 20/20 qat’iy tayyorlikni bildirmaydi. GitHubdagi qattiq 20 savolli preflightni productionga migratsiya qilish ushbu auditda bajarilmagan.

## Mapped review savollar va mustaqil editorial verdict

Quyidagi raqamlar productiondan har modul doirasida **DISTINCT savol ID** bilan qayta SELECT qilingan; bitta savol boshqa modul/konstruktga ham kirishi mumkin. **Jami global noyob savollar soni sifatida yig‘mang.**

| Modul | Modul bo‘yicha mapped review DISTINCT | To‘rtta talabning hammasidan o‘tgan review |
|---|---:|---:|
| M03 | 263 | 0 |
| M06 | 282 | 0 |
| M08 | 426 | 0 |
| M09 | 309 | 0 |
| M10 | 228 | 0 |
| M11 | 152 | 0 |
| M12 | 401 | 0 |

To‘liq editorial verdict `answer_verified`, `reference_verified`, `wording_verified`, `original_authorship_verified` birgalikda true bo‘lishini anglatadi. Nomuvofiq `source_lesson_id`, tur/kalit shakli, takroriy variantlar va semantik noto‘g‘riliklar tekshirilib, barcha yangi javob kalitlari faqat serverning himoyalangan tizimida saqlanishi shart.

## Takrorlash yo‘li

- `scripts/sql/TASK251_topic_pool_gap_readonly.sql`: mavjud 25 darsning published pool hisobi.
- `scripts/sql/TASK275_25_TOPIC_EDITORIAL_READINESS_READONLY.sql`: yangilangan per-lesson deficit, keyed review, full-editorial va source-lesson-matched sonlari; **0/20 P0 lar birinchi**.
- `src/tests/TASK275EditorialReadinessQuery.test.ts`: SQL faqat SELECT; shaxsiy ma’lumotlar yoki javob payloadlari o‘qilmasligi va har to‘rt editorial gate tekshirilishi invariantlari.

## Qolgan real yakunlash mezoni

1. Kamchilik mavjud barcha 25 mavzuda har bir noyob revision, source-page, konstrukt, Y1/Y2/Y3 format va har bir noto‘g‘ri variant mustaqil mutaxassis tekshiruvidan o‘tsin.
2. Shaxsiy review qatorlar uchun tasdiq imzosi va protected key pariteti qayd etilsin. **No batch review→published flip**.
3. Alohida ruxsat etilgan revision-safe stagingda har bir mavzu uchun **20/20 published+keyed**, objective slot va duplicate exclusion tekshiruvi, key secrecy, rasm/LaTeX/JS code execution va xatoli chegaralar sinalsin.
4. 50/120 rasmiy mock blueprint, mobil/desktop, keyboard, auth/recovery, API scoring, history/resume E2E to‘liq bajarilsin.
5. **Production deploy faqat alohida ruxsat** bilan. `vercel.json`dagi `git.deploymentEnabled=false` saqlanadi.

**Muayyan farq:** source-cited 13 ta M11, 25 ta M09 va 56 ta boshqa yangi draft/review savol loyihalari production poolni avtomatik oshirmaydi. GitHub merge ≠ expert approval ≠ production publish.

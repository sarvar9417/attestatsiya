# Pedagogika sifat nazorati — 2026-10-21 qo‘shimcha tekshiruv

## Manbaga tayangan mazmuniy tuzatish

Google Drive original: `Pedmahorat to'plam 2025 kuzgi (3).pdf` (`1xWf80PkokZJ_fwo6L7ICbFBHpPNt5xnM`), nutq ravonligi, mantiqiyligi va ritmikasiga oid savollarning manba kalitlari matn orqali tekshirildi:

- Nutq ravonligi: fikr uzluksizligi, ifodalilik, temp/ritm — asl 1,2,4.
- Nutq mantiqiyligi: izchillik, sabab-oqibat, ta’kidlash, izoh-asos — asl 2,3,4,5.
- Nutq ritmikasi: tembr, intonatsiya, urg‘u, pauza — asl 1,2,3,4.

Raqamlar kombinatsiyasi o‘rniga vaziyatdan tushunchani tanlashga yo‘naltirilgan ikkinchi avlod review nusxalari yaratildi; original published nusxalar tarixiy natija uchun joyida o‘zgartirilmadi.

## Production postflight

2026-10-21 vaqtida bevosita Supabase `plyqezulrfowyblsfpzy`da tasdiqlangan holat:

| Mavzu | Yangi savol | Holat |
|---|---|---|
| Nutq ravonligi | `31994ff1-dd3c-4d9f-9bb2-8d9beb222256` | published |
| Nutq mantiqiyligi | `6d047efe-2a23-4099-a842-3ce3c71a067a` | published |
| Nutq ritmikasi | `a9321c9b-1456-4339-88ef-a5b2619291ca` | published |
| Pedagogik nazokat | `7d066980-5c61-4c71-8f78-92496524fc93` | published |
| Musiqa xatoni topish | `7782afd8-62e4-4acc-bbf5-2e9e2946f649` | review |

Production-wide pedagogy published `KS/PM.GEN/PM.MET` stems matched by the expanded provenance/source-label detector: **0** at the last postflight.

The music question's previous **correct option contained a Telegram watermark** (`◀@PedMahoratGuli`). Its review draft stem, all four option texts and explanation were corrected without changing the answer-option UUID. The read-only regression `supabase/tests/pedagogy_option_provenance_leak_qa.sql` executed without error on production. Archived historical source content was not rewritten.

## Files and release safety

- `supabase/maintenance/20261021_pedagogy_second_generation_three_reviews.sql` — immutable-old, review-only second-generation staging; applied.
- `supabase/tests/pedagogy_case_based_second_generation_qa.sql` — option, stem and answer-key linkage regression; production check passed.
- `supabase/tests/pedagogy_option_provenance_leak_qa.sql` — Telegram markers must not leak into active learner-facing pedagogy options; production check passed.
- Earlier combined four-question SQL was superseded because three originals were concurrently published, and removed from PR.

Do not attribute independent human reviewer approval to these AI-led checks. Do not merge this draft PR as a separate release while the existing pedagogy coordinated-release freeze remains in force. Review learner-visible question selection and saved attempts in a coordinated end-to-end release regression.

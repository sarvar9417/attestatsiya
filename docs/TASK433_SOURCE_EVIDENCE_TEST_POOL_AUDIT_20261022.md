# TASK-433 — barcha test turlarida tasdiqlanmagan manba savollarini tanlamaslik

**Sana:** 2026-10-22. **Muhit:** Supabase `plyqezulrfowyblsfpzy`. **Ko‘lam:** KS, PM.GEN, PM.MET.

## Sabab va dalil

Dastlabki auditda 201 ta `published` savolda `editorial_evidence_missing` ochiq (`medium`) ekani aniqlandi: KS 60, PM.GEN 92, PM.MET 49. Oldingi `is_question_official_mock_eligible` faqat `high/critical` darajalarni chiqarardi. Ayrim generatorlar faqat `status=published` va answer key borligini tekshirardi. Natija: to‘liq manba tasdig‘i bo‘lmagan savollar kelgusi mock/quizlarga qayta kirishi mumkin edi.

## Tuzatish

`supabase/migrations/20261022073000_task433_filter_unverified_source_all_test_pools.sql`:

- `public.question_source_evidence_eligible(uuid)` — manba-dalil findinglaridan (`editorial_evidence_missing`, `source_provenance_unverified`, `answer_key_unverified`, `revision_source_no_longer_published`) **istalgan severity**da ochiq qaydi bor pedagogika savollarini rad etadi. Boshqa fanlarga mavjud qoidalar saqlanadi.
- Helper `SECURITY INVOKER`, to‘liq kvalifikatsiyalangan jadval nomlari va yopiq `search_path` bilan yozilgan. `anon/authenticated/PUBLIC` uchun bevosita `EXECUTE` o‘chirilgan. Uni mavjud, ruxsatlari saqlangan server-side `SECURITY DEFINER` RPC’lar ishlatadi.
- Quyidagi 10 funksiya yangi filtrni ishlatadi:

| RPC | Tekshirilgan tanlov/oldindan tekshirish nuqtalari |
| --- | ---: |
| `generate_topic_test` | 5 |
| `topic_test_preflight` | 2 |
| `topic_test_preview` | 2 |
| `generate_section_mock` | 9 |
| `generate_professional_practice_15` | 2 |
| `generate_custom_exam` | 1 |
| `custom_exam_preflight` | 1 |
| `admin_custom_exam_pool_coverage` | 1 |
| `group_mock_create` | 4 |
| `is_question_official_mock_eligible` (rasmiy va `group_mock_eligible` uchun) | 1 |
| **Jami** | **28** |

Mavjud funksiyaning barcha so‘rov nuqtalariga **bitta shart** qo‘shildi, boshqa quiz generation (quota, distribution, shuffling, difficulty, history) logikasi o‘zgartirilmadi. Migratsiya mavjud funksiya identifikatori, SECURITY DEFINER sozlamasi, grants, narxlar va boshqa parametrlarni saqlash uchun katalogdan `CREATE OR REPLACE FUNCTION` oladi; tekshirilmagan matn bo‘lsa yangilashni to‘xtatadi.

## Sifat va regressiya

`supabase/tests/task433_all_test_pools_source_evidence.test.sql` funksiyalar ichidagi 28 integratsiya nuqtasini tekshiradi, namuna `published` savolga `medium editorial_evidence_missing` topilmasini vaqtincha yaratib eligibilityni yo‘qqa chiqaradi va topilma hal qilinganida eligibilityni tiklaydi. **Test tranzaksiya bilan ROLLBACK** qilinadi.

Production postflightda 201 ta shubhali manbali savol yangi helper orqali **false**, shuning uchun yangi pool tanlovida chiqarib tashlangan. Tarixiy `questions.status`, `question_options`, `question_keys`, `exam_items`, `answers` yoki `attempts`ga tegilmagan.

## Kuzatiladigan cheklov

Manba tasdig‘i ochiq qolgan ayrim konstrukt/turlarda pool kamayadi: PM.MET ning Y2 turida mavjud bitta nashrdagi savol ham ochiq manba finding sababli filtrlanadi. Ushbu format talab qilinsa, tizim allaqachon mavjud `insufficient pool` mexanizmi bilan to‘xtashi kerak, eski sifatsiz savolni majburan kiritmasligi kerak. Manba tekshiruvlari keyinchalik haqiqiy dalil bilan yopilganda savol avvalgi published holatida yana eligible bo‘ladi.

**Mustaqil inson ekspertizasi** yoki hukumatning rasmiy answer key tasdig‘i amalga oshirilgan deb da’vo qilinmaydi.

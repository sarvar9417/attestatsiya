# TASK-572 — Guruhli test manba-dalil filtrining regressiya tekshiruvi

## Sabab (GitHub CI, 2026-10-22)
PR #569 bazaviy database CI tekshiruvi `task433_all_test_pools_source_evidence.test.sql`da `group_mock_create expected 4 guarded paths, found 0` bilan to‘xtadi.

Oldingi `task433` funksiyasi `q.status='published'` filtrlari yoniga bevosita `question_source_evidence_eligible(q.id)` qo‘shgan. Keyinroq `20261022131000_group_mock_pedagogy_20_30.sql` migratsiyasi `group_mock_create`ni yangidan tuzgan: endi `spec`, `pedagogy`, `topics`, `manual` modlarida savol `group_mock_eligible(...)` orqali tekshiriladi.

**Read-only production dalili:** `group_mock_eligible(p_question)` `is_question_official_mock_eligible(q.id)` funksiyasiga murojaat qiladi; u esa `question_source_evidence_eligible(q.id)` orqali unresolved medium source-evidence risklarni rad etadi. Demak oldingi regressiya testi faqat bevosita funksiya matniga qaragani sabab false positive bo‘lgan.

## Tuzatish
- Eski direct guard (4 ta) uchun legacy assertion saqlanadi.
- Yangi indirect implementation uchun **7 ta** `group_mock_eligible` candidate-call (spec 2, pedagogy 2, topics 2, manual 1) hamda `group_mock_eligible → is_question_official_mock_eligible → question_source_evidence_eligible` zanjiri tasdiqlanadi.
- Testning `BEGIN...ROLLBACK` ichidagi synthetic unresolved/resolved source finding tekshiruvi endi `group_mock_eligible` uchun ham ishlaydi.
- Historical migration/RPC, ishlab chiqarish database, imtihon xonalari va savollar yangilanmaydi.

## Tekshiruv va release
Fail-closed regression: `supabase/tests/task433_all_test_pools_source_evidence.test.sql` clean database CI da qayta bajariladi. GitHub CI backend/frontend/database PASS bo‘lsa PR merge qilish mumkin. **Vercel deployment va production Supabase o‘zgarishlari yo‘q.**

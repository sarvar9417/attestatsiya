# TASK-385 — Production migration tarixiga mos filename reconciliation (2026-10-21)

## Muammo
Clean database CI checks `scripts/check_migration_filenames.py` quyidagi ikki faylga aynan bitta `20261021221000` versiyasi berilgani uchun to‘xtadi:

- `supabase/migrations/20261021221000_task376_pedguli_verified_intake.sql`
- `supabase/migrations/20261021221000_task382_office_38_explicit_y3_goals_immutable_revisions.sql`

## Productiondagi yagona haqiqiy tarix
Live Supabase `supabase_migrations.schema_migrations`:
- `20261021144805` — `task382_office_38_explicit_y3_goals_immutable_revisions`
- `20261021145214` — `task376_pedguli_verified_intake`

Source `task376_pedguli_verified_intake.sql`ning GitHub SQL tanasi bazadagi `statements[1]` bilan **aynidir**: ikkala tomon 13 019 UTF-8 bayt/belgidan iborat; `md5=9740ed8ec22aca8088bbeb1e7984db81`. Diff: **faqat nom**, SQL satrlarini yangidan yozmadik. Supabase production schema_migrations yozuvi, amaliy DB jadvali va tarixiy savollar mutlaqo o‘zgartirilmaydi.

## Xavfsiz yechim
Source alias filename `20261021221000_task376_pedguli_verified_intake.sql` → exact already-applied production migration version filename `20261021145214_task376_pedguli_verified_intake.sql`.

Original SQL body **bit-for-bit unchanged**; exact md5 regression `src/tests/task385MigrationHistoryReconciliation.test.ts`da. Migration naming validator o‘zgartirilmagan. Boshqa `task382_office` historical file ham o‘zgartirilmagan. Bundan keyingi `supabase db push` bu release'ni productionda yangi, noma’lum versiya deb qayta ko‘rmasligi kerak, chunki production historyda ayni versiya allaqachon mavjud.

## Gate va xavf
- CI database full clean migration chain, backend, frontend lint/build/E2E PASS bo‘lishi shart.
- Productionga faqat ushbu *repo filename* fix uchun migratsiya qo‘llanmaydi.
- Fresh-schema test source data dependeсy muammosi chiqsa, alohida aniqlang; tarixiy SQL mazmunini o‘zgartirmang.
- After fix merge, TASK-384 CI fixture guards PR #476 va TASK-379 full bank QA PR #470 rerun; 8 REVIEW candidate stage migration only after green CI, without learner publication or historical attempt mutation.

Handoff: TASK-385; target blocker issue #480.

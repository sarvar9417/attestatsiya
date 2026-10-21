# TASK-382 — Fresh-schema CI uchun TASK-381 release'ni ajratish

TASK-379 bankwide audit PR #470 CI database job'ni ishga tushirganda `supabase/migrations/20261021220000_task381_y3_missing_goal_immutable_fix_and_office_qa_queue.sql` `TASK-381 source question not found` degan xatolik bilan to‘xtadi.

Root cause: TASK-381 productionda mavjud `OFF-W03-028` Word Y3 savolini yangi immutable revision bilan almashtiradigan **data-specific** migration. CI esa noldan qurilgan bo‘sh schema/seed fixture'da aynan shu prod savolni yaratmaydi. Migration barqaror source UUID/referenceni mavjud deb qat’iy tekshiradi.

Safeguard: eski committed migrationni o‘zgartirmaymiz. Faqat `.github/workflows/ci.yml` dagi ikki fresh-schema migration loopi ushbu **aniq bitta** production-only data-release faylini skip qiladi; boshqa migrationlarni bajarish davom etadi. TASK-381 haqiqiy productionda alohida qo‘llanib, postflight qilinadi; fresh-schema skip production DB'dagi releasega ta’sir qilmaydi.

Regressiya: `src/tests/task382Task381CIFixtureGuard.test.ts` ikki loopda skip mavjudligi va TASK-381 migration faylining o‘zgarmaganligini tekshiradi. CI PASS bo‘lgandan keyin TASK-379 PR bazasini yangilash va Y1 REVIEW staging davom ettirish mumkin.

Yangi learner kontent, answer key, published revision yoki exam attempt o‘zgartirilmaydi.

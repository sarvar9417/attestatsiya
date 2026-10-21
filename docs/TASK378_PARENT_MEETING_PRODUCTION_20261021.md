# TASK-378 — Foydalanuvchi ko‘rsatgan ota-ona suhbat savolini productionga chiqarish

**2026-10-21**, TASK-377 dagi 16 ta savol muvaffaqiyatli chiqarilgach, foydalanuvchining **asl ko‘rsatgan misoli** ham hali REVIEW ekanligi aniqlandi. Shu maxsus savolni chiqarish ham topshiriqning asl maqsadiga kiradi.

Original source: `2e951830-a7b7-4788-ac68-1cb3ebf21b31`, REVIEW replacement: `b64b8def-e21f-4e1b-aaeb-97f973cc281e`.

Preflight: 1 source published / 1 review, KS Y1, lesson/subject/construct bir xil, 4 xil variant va to‘g‘ri javob valid, manba 4 ta tarixiy exam itemda ishlatilgan. Revision B javobi va qolgan 3 distraktor pedagogik jihatdan baholandi. Boshqa savol chiqarilmaydi.

Release `supabase/maintenance/task378_parent_meeting_example_owner_release.sql`: 2026-10-18 dagi explicit no-external-expert owner waiver + 2026-10-21 production instruction, mustaqil inson eksperti sifatida ko‘rsatilmaydi. Aynan bir admin, fingerprint va per-source revision guard; `publish_pedagogy_revision` atomic new published/old archived. Old question/answer/4 historical items immutable.

Production Supabase `BEGIN; ... ROLLBACK;` dry-run **PASS** (1 staged, no durable writes). Production apply requires controlled migration runner and postflight. Faqat data update, Vercel app redeploy kerak emas.

Full bank semantic QA issue #461 doirasida alohida davom etadi.

# TASK-251 — Topic test pool readiness (2026-10-19, read-only snapshot)

**Status: inventory COMPLETE / editorial readiness BLOCKED / NO production changes.**

## 1. Verified boundary and source of evidence

- Repository: `sarvar9417/attestatsiya`; PR [#193](https://github.com/sarvar9417/attestatsiya/pull/193) merged on **2026-10-19 05:45:46 UTC**, merge SHA `18016dfb9bc6c6a1c23b0ac5e34b009efb69817d`. This fixed strict generator/preflight parity and P0/P1 assessment safeguards in **main code only**.
- Verified on production project `attestatsiya100%` (`plyqezulrfowyblsfpzy`) using **read-only SELECT** of published lessons, modules, `topic_test_preview`, and aggregate keyed question statuses. No writes or answer keys retrieved.
- Snapshot: **25 underfilled assessed lessons**, each configured for 20 questions, with **339 total missing pool slots** across **7 modules**. Across these lessons, **1709 mapped keyed review candidate occurrences** were counted. This occurrence total **is not a unique-question count**, an approval count, or proof of usable candidates; cross-lesson construct mapping can duplicate an item.
- M01's four non-assessed appendices are not treated as failed 20-question lessons. M01 assessed topic readiness must still be monitored independently.
- **Critical warning:** production currently uses older short-count `topic_test_preview` semantics; it can return 5/20 with `reason=null`. PR #193's strict SQL migration is in main but applying it to production is **not authorized**. Never call existing production preview `reason=null` proof of readiness.
- Audit repeatability: [`scripts/sql/TASK251_topic_pool_gap_readonly.sql`](../../scripts/sql/TASK251_topic_pool_gap_readonly.sql).

## 2. Topic-level pool deficits

| Modul | Nashrdagi mavzu | Published eligible | Missing to 20 | Mapped keyed review occurrences |
|---|---|---:|---:|---:|
| M03 | MS Excel: filtr, saralash va diagramma tahlili | 5/20 | 15 | 26 |
| M03 | MS Excel: formulalar va funksiyalar | 11/20 | 9 | 90 |
| M03 | MS PowerPoint: taqdimot, animatsiya va o‘tish effektlari | 7/20 | 13 | 58 |
| M03 | MS Word: hujjat formatlash va tuzilma | 5/20 | 15 | 89 |
| M06 | Algoritm tushunchasi, xossalari va turlari | 8/20 | 12 | 30 |
| M06 | Algoritmni blok-sxema va psevdokodda tasvirlash | 14/20 | 6 | 52 |
| M06 | Masalaning algoritmini tuzish | 0/20 | 20 | 114 |
| M08 | JavaScript sintaksisi asoslari | 0/20 | 20 | 66 |
| M08 | JavaScript: shart, sikl, funksiya va massiv | 12/20 | 8 | 150 |
| M08 | Python sintaksisi asoslari | 7/20 | 13 | 60 |
| M08 | Python: funksiyalar va ro‘yxatlar | 10/20 | 10 | 90 |
| M08 | Python: o‘zgaruvchi, shart va sikl | 16/20 | 4 | 60 |
| M09 | Birlamchi va tashqi kalitlar, jadvallarni bog‘lash | 6/20 | 14 | 48 |
| M09 | Ma’lumotlar bazasi va MBBT asoslari | 3/20 | 17 | 96 |
| M09 | MS Access: jadval yaratish va ma’lumot kiritish | 5/20 | 15 | 69 |
| M09 | Murakkab so‘rovlar va natijani tahlil qilish | 4/20 | 16 | 48 |
| M09 | So‘rovlar yaratish va mezonlar bilan tanlash | 7/20 | 13 | 48 |
| M10 | Kompyuter grafikasi turlari | 11/20 | 9 | 76 |
| M10 | MS Paint va Adobe Photoshop: asosiy amallar | 3/20 | 17 | 76 |
| M11 | CSS stillarini HTML elementlariga qo‘llash | 7/20 | 13 | 76 |
| M11 | HTML: jadval va forma elementlari | 3/20 | 17 | 68 |
| M11 | HTML: matn, rasm va ro‘yxatlar | 7/20 | 13 | 8 |
| M12 | Internetdan xavfsiz va maqsadli foydalanish | 0/20 | 20 | 44 |
| M12 | Kompyuter tarmoqlari va tarmoq qurilmalari | 10/20 | 10 | 85 |
| M12 | Tarmoq arxitekturasi va topologiyalari | 0/20 | 20 | 82 |
| **TOTAL** | **25 lessons** | **161/500** | **339** | **1709 (overlapping)** |

Module missing slots: M03 **52**, M06 **38**, M08 **55**, M09 **75**, M10 **26**, M11 **43**, M12 **50**.

The simple keyed/mapped review count above omits semantic approval, source licensing, edition revision, exact Y1/Y2/Y3 validity, required objective slots, duplicates, and visual assets. It **cannot** be used to publish or bypass preview. The minimum *numerical* gap after hypothetically approving all 8 M11 HTML text/graphic/list candidates would still be 5 slots, but the real editorial gap may be much larger.

## 3. Ordered next work (no publishing)

1. **P0 retention:** keep the strict fail-closed 20-count migration in the repository only; run fresh DB, backend and Playwright regression checks before claiming local readiness. Until remote migration rollout is explicitly authorized, production's old short-count behavior must not be advertised as fixed.
2. **M11 first-pass editorial triage:** HTML matn/rasm/ro‘yxatlar has only 8 mapped keyed review occurrences against a 13-item deficit; assess source coverage and prepare **at least 5 additional unique valid candidates** if all 8 are approved, otherwise more.
3. **M09 → M08 → M03** source and answer validation by lesson with current textbooks/specification, then M12 → M11 → M06 → M10. Prioritize 0/20 lessons for inability to start: M06 algorithm composition, M08 JS syntax, M12 safe Internet and network architecture.
4. Every candidate must pass (a) precise source reference/page + originality/copyright, (b) unique stem/options, (c) single reliable answer or full Y2/Y3 mapping/order, (d) active construct and topic mapping, (e) grade-independent difficulty A–E and required-critical objective quotas, (f) independent editorial verdict. **Review** never silently becomes **published**.
5. Build guarded release batch/migrations with immutable published revisions, fresh DB tests and 20/20 re-preflight for all 25 lessons in isolated staging. Require separately approved authenticated learner/admin E2E, feedback secrecy, 15/50 exact official blueprints and keyboard/mobile UX. No paid staging setup without cost consent.
6. Verify `vercel.json` keeps `git.deploymentEnabled=false`; local source can be reviewed after main merge. Production Vercel, live SQL migrations and bulk publish remain separately approval-gated.

## 4. Completion criteria

- **Audit report:** DONE when 25 lesson rows, 7 module totals, reproducible read-only query, accurate blockers, and merge trace are committed and CI verified.
- **Content pool remediation:** NOT DONE until the 25 assessed lessons individually pass exact 20-count + objective/format/unique key validation in a controlled environment and source/editorial sign-offs are recorded.
- **Production rollout:** NOT REQUESTED. Do not deploy, write to production DB, create a paid Supabase branch, or auto-publish review questions.

This report is an as-of snapshot; rerun the SELECT after any later, separately approved migrations/imports.

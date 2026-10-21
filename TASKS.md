## TASK-426 — Informatika PDF: HTML va Mantiq 2-dars private QA (2026-10-21)

| Task | Status | Scope / release |
|---|---|---|
| TASK-426 | 21/21 HTML Chromium explanatory QA + 7/7 logic rewrite private Supabase PASS; GitHub Node regressiya CI pending | 8 eskirgan blocker dalili haqiqiy manba nuqsoniga moslandi; 21 ta original PDF question unchanged, source pages 21/21. 7 logic editorial proposal restricted to private blocker/free-response QA, original source intact. `scripts/task426-pdf-logic.test.mjs`, `.github/workflows/task426-pdf-source-qa.yml`, [handoff](docs/TASK426_INFORMATIKA_PDF_SOURCE_REMEDIATION_20261021.md). No learner publish, no Vercel deploy. |

## TASK-425 — Bankwide Y1 sifat tuzatishlari, ikkinchi 8 ta savol release (2026-10-21)

| Task | Status | Verification |
|---|---|---|
| TASK-425 | AI-assisted owner-approved 8 source/review manifest; live Supabase complete ROLLBACK trial PASS; CI+production cutover pending | All 8 Y1 wrong distractors source-backed, correct answer text pinned unchanged; 8 new immutable published and 8 predecessors archived only after quality gates; old exam history retained. Evidence: `docs/TASK425_BANKWIDE_WAVE2_IMMUTABLE_RELEASE_20261021.md`. |

## TASK-420 — M13 dars yangilanishida modulga tashlab yuborilishini tuzatish (2026-10-21)

| Task | Status | Acceptance / release |
|---|---|---|
| TASK-420 | QA / CI pending | M13 11 legacy → 7 published katalog almashganda ochiq dars saqlanadi; refresh URLdan darsni tiklaydi; oldingi M13.06 noto‘g‘ri published bobga almashtirilmaydi; loading va invalid query xavfsiz. 5 regressiya testi; legacy elektron tijorat qo‘shimcha mavzu sifatida ochiladi, asosiy progressga qo‘shilmaydi. **Main merge ONLY, production deploy va DB yozuvi yo‘q.** [Handoff](docs/TASK420_M13_LESSON_REFRESH.md). |

## TASK-422 — PedGuli Telegram savollarini owner-authorized ekspert release (2026-10-21)

| Task | Status | Acceptance / release |
|---|---|---|
| TASK-422 | DONE — production postflight 16/16; CI + GitHub merge pending | User yakuniy tahririy qarorni ChatGPTga topshirdi. 16 ta `task421:expert-rewrite:v1` Y1 savol grammatikasi, kaliti, taksonomiya/lesson mappingi, variant sifati va dublikatlari fail-closed tekshirildi; 16 published, 16 valid key/4-option set, 16 balance pass, 16 waiver va 16 immutable snapshot. Migration `20261021151001_task422_pedguli_16_owner_authorized_release`; mustaqil inson eksperti da’vosi yo‘q. Vercel/application deploy yo‘q. |

## TASK-378 — Ota-ona bilan suhbat savoli, alohida production release (2026-10-21)

| Task | Status | Acceptance / release |
|---|---|---|
| TASK-378 | QA / production ROLLBACK dry-run PASS, release pending | Userning aynan ko‘rsatgan savoli (KS) 1 REVIEW successor; 4 ta tarixiy exam item saqlansin, 4 variant + kalit, immutable publish/archival va owner waiver. `supabase/maintenance/task378_parent_meeting_example_owner_release.sql`; `src/tests/task378ParentDialogueRelease.test.ts`. |

## TASK-377 — Pedagogika 16 savol uchun production release (2026-10-21)

| Task | Status | Acceptance / release |
|---|---|---|
| TASK-377 | DONE: production Supabase release; CI PASS; postflight 16/16 and 41 historic refs intact | User "productionga chiqar" instruction. Apply only 16 TASK-376 wrong-option edits to REVIEW successors, record explicit historical owner waiver (not expert signoff), atomically publish 16 successors and archive 16 prior versions with preserved fingerprints and 41 historical exam refs. Production SQL only via migration, no Vercel app deploy needed. Evidence: `docs/TASK377_PEDAGOGY_PRODUCTION_RELEASE_20261021.md`. |

## TASK-376 — Pedagogika javob variantlari: semantic QA (2026-10-21)

| Task | Status | Acceptance / release |
|---|---|---|
| TASK-376 | 16 REVIEW distractor revisions prepared; rollback rehearsal PASS; PR + CI pending | 823 published KS/PM.GEN/PM.MET; 471 lexical flags (includes archived), 105 active flags with 105 REVIEW successors. 20 semantic-cue review candidates, 16 context-checked wrong options rewritten in rehearsal (16/16 PASS, ROLLBACK). Exact old-text/key guards, no published mutation, no deploy. Full bank expert review and owner-authorized immutable release remain open. Report: `docs/TASK376_PEDAGOGY_DISTRACTOR_QUALITY_20261021.md`. |

## TASK-375 — Savollar bazasidagi bir qatorli kodlarni Markdown code blockka o‘tkazish (2026-10-21)

| Task | Status | Acceptance / release |
|---|---|---|
| TASK-375 | DONE — production postflight PASS; main merge prepared | 37 inline-backtick va 22 markersiz psevdokod savol immutable revision orqali til yorliqli fenced blockka aylantirildi. 59 successor published, 59 source archived, 0 semantic mismatch, 80 ochiq quality finding ko‘chirildi, audited inline remainder 0. SQL/Vitest/lint/typecheck/build PASS; application deploy yo‘q. `docs/TASK375_DATABASE_CODE_BLOCKS_20261021.md`. |

## TASK-374 — Umumiy pedagogika PM.GEN, M15dan tashqari 30 ta qisqa izoh (2026-10-21)

| Task | Status | Acceptance / release |
|---|---|---|
| TASK-374 | 30 rationale review drafts; PR CI/main merge pending | `PM.GEN` M15dan tashqari 96 ta qisqa izohdan 30 tasi savol, eski izoh va to‘g‘ri variantning mazmuniga ko‘ra tahlil qilindi. 30 ta 297–355 belgilik o‘zbekcha pedagogik izoh `supabase/maintenance/task374_pmgen_30_explanations_ROLLBACK_ONLY.sql`da; migration emas, productionga qo‘llanmagan, `ROLLBACK` bilan tugaydi. `src/tests/task374GeneralPedagogyRationales.test.ts` unique/rationale/no-commit/no-publish va read-only audit. Handoff `docs/TASK374_PMGEN_30_EXPLANATIONS_20261021.md`. **Foydalanuvchi ko‘rsatmasi: faqat GitHub main merge; production deploy/DB write/publish qat’iyan taqiqlangan.** |

## TASK-373 — Kasbiy standart (KS) 60 ta qisqa izoh uchun didaktik tahrir (2026-10-21)

| Task | Status | Acceptance / release |
|---|---|---|
| TASK-373 | 60 pedagogik rationales prepared; PR CI/main merge required | 211 published Y1 KS savolining 60 tasida 80 belgidan qisqa izoh topildi; har biri savol va mavjud to‘g‘ri javob bilan solishtirildi. 60 individual 285–359 belgilik didaktik izoh `supabase/maintenance/task373_ks_60_explanations_ROLLBACK_ONLY.sql`da; **migration emas, ROLLBACK-only, productionga qo‘llanmagan**. `src/tests/task373KSExplanationReview.test.ts` 60 manba/no-commit/no-publish tekshiruvi; read-only audit va `docs/TASK373_KS_60_EXPLANATIONS_20261021.md`. **Faqat GitHub main merge. User alohida buyurmaguncha production deploy, database write, publish qat’iyan yo‘q.** |

## TASK-372 — Metodika (PM.MET) bo‘yicha 35 qisqa javob izohini chuqurlashtirish (2026-10-21)

| Task | Status | Acceptance / release |
|---|---|---|
| TASK-372 | 35 pedagogik tushuntirish review draft; PR CI/main merge pending | 35 published Y1 PM.MET savolining har biri uchun alohida 267–328 belgilik sababli izoh tayyorlandi. `supabase/maintenance/task372_pmmet_35_explanations_ROLLBACK_ONLY.sql` **migration emas, ROLLBACK-only, prodga qo‘llanmagan**. Read-only audit, Vitest 35 unique / no publish / no COMMIT; `docs/TASK372_METHODICAL_EXPLANATIONS_20261021.md`. Foydalanuvchi ruxsatisiz production deploy/db write/publish yo‘q — faqat `main`ga merge. |

## TASK-371 — M15 pedagogika qisqa izohlarini 56 ta to‘liq pedagogik tushuntirishga tayyorlash (2026-10-21)

| Task | Status | Acceptance / release contract |
|---|---|---|
| TASK-371 | 56 review-only rationales ready in branch; CI / PR pending | 8 ta M15 mavzudan 56 ta published Y1 savolning 80 belgidan qisqa izohiga 56 ta har biri kamida 155 belgilik alohida pedagogik tushuntirish yaratildi. `supabase/maintenance/task371_m15_56_explanation_revisions_ROLLBACK_ONLY.sql` — migration emas, `ROLLBACK` bilan tugaydi. Vitest unique/reference/rollback/no-publish reggressiyasi hamda read-only audit bor. **Faqat GitHub main merge; user alohida buyurmaguncha production deploy, db push va publish YO‘Q.** `docs/TASK371_M15_56_PEDAGOGY_EXPLANATIONS_20261021.md`. |

## TASK-350 — M14/M15 nazariyada Telegram import izohlarini o‘quvchi ko‘rinishidan tozalash (2026-10-21)

| ID | Status | Scope | Acceptance |
|---|---|---|---|
| TASK-350 | CODE COMPLETE — CI/PR verification | Kasb standartining 7 sohasiga oid Telegram 15293 izohi va unga o‘xshash M14/M15 import sarlavhalari | 7 sohaga qo‘shimcha izohli jadval; «Telegram manbasidan», «Kanal muallifining», tahririy heading/kanal source-only satrlari learner readerda yo‘q; PDF manbalari va original published body saqlangan; boshqa modullar va savollar o‘zgarmagan. `docs/TASK350_PEDAGOGY_LEARNER_TEXT_CLEANUP_20261021.md`. |

## TASK-369 — O‘quvchi javob izohlaridan PDF/Telegram/kandidat tahririy yozuvlarini tozalash (2026-10-21)

| Task | Status | Acceptance / release contract |
|---|---|---|
| TASK-369 | Implemented; PR CI + main merge required | 26 authored PDF savolining oldingi izohlarida manba-kalit va kandidat metama’lumoti topildi; 972 published izohda alohida source paragraph mavjud. Umumiy `learnerExplanation` filtri 5 o‘quvchi ko‘rinishiga ulandi; javob-kalitlar frontendga ko‘chirilmagan. 26 alohida didaktik izoh `supabase/maintenance`da **ROLLBACK-only REVIEW tayyorlama**, productionga qo‘llanmagan. Regressiya testlari va `docs/TASK369_LEARNER_EXPLANATION_EDITORIAL_20261021.md`. **Explicit owner permission bo‘lmaguncha production DB/deploy taqiqlangan; faqat GitHub merge.** |

## TASK-348 — Guruhli Mock resilient xona UX (2026-10-20)

| ID | Status | Scope | Acceptance |
|---|---|---|---|
| TASK-348 | CODE READY / CI PENDING | `group_mock_my_rooms` orqali xonaga qaytish; 8 belgili kodga havola; lobby-only cancel/leave; server membership/RLS; qo‘lda tanlangan savollar tartibini o‘zgartirish; poll ulanish ogohlantirishi | `group_mock_resilience.test.sql` + frontend ordering test, CI `quality`, staging two-users, no production DB/deploy. `docs/TASK348_GROUP_MOCK_RESILIENCE_20261020.md`. |

## TASK-347 — Guruhli Mock Test (2026-10-20)

| ID | Status | Scope | Acceptance |
|---|---|---|---|
| TASK-347 | CODE IN BRANCH / CI AND DB ACCEPTANCE PENDING | 8 belgili xona kodi; 3 savol tanlash rejimi (rasmiy spesifikatsiya, mavzu/daraja, qo‘lda); barcha qatnashchilarga bitta savol; server baholash, muhokama, reyting | RLS/private keys; auto-reveal/all-answer; host next/override; Y1/Y2/Y3; GitHub quality + fresh SQL regressions + authenticated multi-browser QA; no deploy. `docs/TASK347_GROUP_MOCK_20261020.md`. |

## TASK-346 — PedGuli rasmli savolni tuzatish (2026-10-20)

| ID | Status | Scope | Acceptance |
|---|---|---|---|
| TASK-346 | CODE READY / CI PENDING | Published PM.GEN Telegram 4843 original foto 867, review 4842 original foto 866, first-party image render | 4843 aynan source JPG bilan ko‘rinsin; noto‘g‘ri savolga rasm chiqmasin; 4842 bilan adashmasin; original SHA256 pin; published revision/keys/exam attempts immutable; frontend/backend/E2E CI; production DB/deploy yo‘q. `docs/TASK346_PEDGULI_MISSING_SOURCE_PHOTO_20261020.md`. |

## TASK-343 — Test javoblaridagi manba-only izohlarni o‘quv izohlariga almashtirish (2026-10-20)

| Task | Status | Scope | Acceptance |
|---|---|---|---|
| TASK-343 | IN_PROGRESS — 140 ta nomzod sanaldi; QA gate CODE READY / rollback sinovi PASS; production release qilinmagan | Telegram ✅/✔ kalitga tayangan 84 published + 56 review Y1 pedagogika izohi; boshqa qisqa izohlarni alohida semantik audit | Educational-explanation publish guard, SQL regression va keyless audit; pedagogik takt uchun immutable revision operator script rollback testdan o‘tdi. 139 ta kontent izohini individual yozish, rasmsiz 2 itemni tekshirish va production publish huquqi ochiq. `docs/TASK343_ANSWER_EXPLANATION_EDITORIAL_20261020.md` |

## TASK-345 — O‘rganish sahifalarini mantiqiy birlashtirish (2026-10-20)

| ID | Status | Scope | Acceptance |
|---|---|---|---|
| TASK-345 | CODE READY / CI PENDING | M01–M16 `BookReader` qisqa bo‘limlarini birlashtirish; oldingi/keyingi, progress, kontent va testlar | «Ikki o‘lchovli ro‘yxat» va ishlangan misol bir sahifada; mayda headinglar jamlanadi; kod/misol bo‘linmaydi; barcha bloklar va savollar saqlanadi; regression test, lint/typecheck/CI; DB/deploy yo‘q. `docs/TASK345_LESSON_PAGE_CONSOLIDATION_20261020.md`. |

## TASK-305 — Sinov savollarida Excel/Markdown jadvallarini to‘g‘ri ko‘rsatish (2026-10-20)

| Task | Status | Scope | Acceptance |
|---|---|---|---|
| TASK-305 | CODE READY / CI PENDING | Learner sinovlari Y1/Y2/Y3 hamda tugagan sinov tahlili; manbadagi literal \n, jadval, kod bloklari | Escaped va odatiy Markdown jadval semantik table ko‘rinishida; kod/formula va server savol kalitlari o‘zgarmaydi; mobil gorizontal scrolling; Vitest regressiyalar; CI tekshiruvi |

## TASK-306 — Test bank ekspert remediatsiyasi (2026-10-19)

| ID | Status | Dependency | Deliverable |
|---|---|---|---|
| TASK-306 | DONE — PRODUCTION POSTFLIGHT PASS / FINAL CI+MERGE | TASK-240, TASK-244, TASK-246, TASK-282 | Demo 50 immutable review revision (8/35/7, q53→PM.GEN.08); productiondagi 20 aktiv legacy Y2 uchun native 4+4 review revision; universal independent-editorial/fingerprint gate va private QA navbati; `official-mock-v4`; 5 147/5 147 published snapshot; 27/27 kvota katagi yetarli. Human sign-off soxtalashtirilmaydi, deploy yo‘q. `docs/TASK306_QUESTION_BANK_EXPERT_REMEDIATION_20261020.md`. |

## TASK-304 — M14 kasbiy standart PDF va savollarini yakuniy manba nazorati (2026-10-19)

| TASK-304 | REVIEW AUDIT DONE / HUMAN PUBLISH APPROVAL OPEN | TASK-303 QA, TASK-301 learner source-safety | 13-betli PDF SHA-256 mustaqil tekshirildi; 7 M14 uchun 7×12 sahifali annotated review-only blok; 140 published KS savolning stem va keyed variantlari, barcha 8 Y2 juftlik va 2 Y3 tartibi ko‘rildi; 1 Y2da 8×side=a topildi, staging-only draft script tayyor; 37/140 full editorial flags, 103 human sign-off debt. `docs/audits/TASK303_M14_FINAL_SOURCE_SEMANTIC_QA_20261019.md`; nashr qilingan DB/dars o‘zgarmaydi, deploy yo‘q. Final CI/merge rekvizitlarini PR orqali tekshirish kerak. |

## TASK-262 — Nazariya darslarining yagona kitob dizayni (2026-10-19)

| TASK-262 | IN_PROGRESS — CODE IN FEATURE BRANCH / QA OPEN | T-M01-002, T-M01-003 DONE | M01 BookReader/BookBlock standartini barcha mavjud M02–M16 nazariy darslariga qo‘llash; Markdown jadval/ro‘yxat compatibility; regression test; docs/TASK262_UNIFIED_LESSON_BOOK_DESIGN_20261019.md. Final lint, typecheck, unit, mobil/auth UI QA va release approval ochiq. Merge/deploy YO‘Q. |

## TASK-261 — M09 DB/Access 5-mavzu review QA

| TASK-261 | IN_PROGRESS — INVENTORY DONE / EDITORIAL BLOCKED | TASK-251 | M09 5 canonical topics: 75 missing published slots, 309 mapped keyed review occurrences (189 Y1/60 Y2/60 Y3), 0 signed editorial checks, only 21 canonical source_lesson matches. ICT 11 PDF 4–52 source crosswalk and safe SQL/test added; no keys/publish/deploy. See docs/TASK261_M09_DB_ACCESS_SOURCE_QA_20261019.md. |

## TASK-260 — M11.01 HTML Y1 draft and Y2/Y3 review QA

| TASK-260 | IN_PROGRESS — DRAFT CANDIDATES / EDITORIAL BLOCKED | TASK-251 audit | 8 review Y2/Y3 key structures and source-lesson mapping triaged; 13 PDF-page-cited Y1 candidate prompts + four unique options in docs/audits/TASK260_M11_HTML_Y1_CANDIDATES.json; automated guard test. No human approval, answer keys, DB import or production release. See docs/TASK260_M11_HTML_SOURCE_AND_CANDIDATE_QA_20261019.md. |

## TASK-250 — M02 34 Y1 savol source-review

| ID | Status | Natija | Ekspert/shart |
|---|---|---|---|
| TASK-250 | IN_PROGRESS / REVIEW-ONLY | 34 Y1 fallback IDs → 4 kanonik mavzu; 6 ehtiyotkor tarixiy/vaqtga bog‘liq tahririy risk; CI gate | Variant va izohlarning darslik sahifasi bilan ekspert tekshiruvi; reviewdan publishedga avtomatik o‘tish yo‘q |

## TASK-244 — M01: 13 ta darslikni bittalab, asl sahifasi bo‘yicha nazariya tekshiruvi (2026-10-19)

| ID | Status | Scope | Natija va qolgan release sharti |
| --- | --- | --- | --- |
| TASK-244 | SOURCE AUDIT 13/13; FINAL QA IN_PROGRESS / RELEASE BLOCKED | ICT 5–11 + Cambridge+ 5, 6, 7, 8, 9, 10–11; 12 M01 mavzu, asl PDF sahifa va UI kontent integratsiyasi | **59 ta page-cited original theory additions**; `m01.ts` generated base va questions saqlangan, regressiyalar `src/tests/M01*BookAudit.test.tsx`. Har darslik uchun PDF concordance: `docs/TASK244_M01_BOOK_BY_BOOK_SOURCE_AUDIT_20261019.md`, `docs/TASK244_*_M01_PAGE_CONCORDANCE_20261019.md`. CI final run, yakuniy real authenticated learner desktop/mobile visual QA, attestatsiya specs bo‘yicha savol–mavzu ekspert review hali release gate. **Merge authorized on 2026-10-19; no manual deploy or production DB write.** |

## TASK-249 — M01.05/M01.06 darslik manbalari

| ID | Status | Natija | Ochiq ish |
| --- | --- | --- | --- |
| TASK-249 | IN_PROGRESS | M01.05 100 + M01.06 110 item source trace; avvalgi boblar bilan jami 400/400 provenance holati; 239 topic-supported, 149 partial, 12 source-gap; 400-ID regression gate | Har bir savolning to‘g‘ri kaliti, distractor va izohi ekspert tasdig‘idan o‘tishi; topilmagan 12 page debt; productionga import/publish qilinmagan |

## TASK-248 — M01.04 savollarini darslik sahifalari bilan tekshirish

| ID | Status | Qamrov | Qolgan talab |
| --- | --- | --- | --- |
| TASK-248 | IN_PROGRESS | `ARS-03` dagi 70 item: 42 topic-supported, 25 partial, 3 source-gap, `M0104ItemSourceTrace.test.ts` | Barcha variant/explanationlar ekspert ko‘rigidan o‘tishi; M01.05 100 va M01.06 110 source-review; production publish/deploy yo‘q |

## TASK-247 — M01 400 savol source/numeric QA

| ID | Status | Scope | Open gate |
| --- | --- | --- | --- |
| TASK-247 | IN_PROGRESS | M01.02 va M01.03 uchun 120 individual PDF sahifa reyestri; 81 oldingi + 84 yangi = 165 hisobli savol mustaqil formula bilan nazorat qilinadi | 81 topic-supported / 34 partial / 5 source-gap; 280 boshqa savol source-trace va barcha 400 itemning ekspert tekshiruvi; ishlab chiqarish muhitiga o‘zgartirish yo‘q |

## TASK-244 — Y2 matching UX va javob kontrakti

| ID | Status | Dependency | Deliverable |
|---|---|---|---|
| TASK-244 | IN_PROGRESS | TASK-240 | Mavzu testlarida takror/o‘rinsiz/bo‘sh Y2 moslashtirishni bloklash, tanlovlar qayta renderda barqarorligi, klaviatura uchun label va testlar; source-validity expert approval alohida. Merge/deploy yo‘q. |

## TASK-243 — M02 nazariya va dizayn auditi (2026-10-19)

| ID | Status | Scope | Natija / qolgan talab |
| --- | --- | --- | --- |
| TASK-243 | IN_PROGRESS (release BLOCKED) | M02.01–04, 2026 spetsifikatsiyasi, 9 legacy bo‘lim va 13 ICT/Cambridge+ manbadan M02 qamrovi | 36 ta tarixiy/statik matn va kalitga oid aniqlashtirish; 7 noto‘g‘ri `Y2`→`Y1` static savol; 2 source jadvalning to‘liq ko‘rinishi; sarlavha sahifa oxirida qolmasligi; regressiya testlari va `docs/TASK243_M02_SOURCE_AND_DESIGN_AUDIT_20261019.md`. To‘liq source-concordance, auth E2E, real mobil/desktop UI va yakuniy CI hali release shartlari. Merge/deploy/DB write yo‘q. |

## TASK-242 — M01 nazariya manba va dizayn auditi (2026-10-19)

| ID | Status | Scope | Natija / qolgan shart |
| --- | --- | --- | --- |
| TASK-242 | IN_PROGRESS (review gate) | M01.01–M01.12, 2026 spetsifikatsiyasi, ICT/Cambridge+ 5–11, LaTeX konverter, kitob UI | 10 ta misol sarlavhasi + `\\difficulty` noto‘g‘ri renderi tuzatildi; 12 mavzu, 10 diagramma va dastlabki manba qamrovi regressiya bilan himoyalandi. To‘liq sahifama-sahifa ekspert tekshiruvi, mobil/desktop real UI va authenticated learner E2E hali ochiq. `docs/TASK242_M01_SOURCE_AND_DESIGN_AUDIT_20261019.md`. Merge/deploy/production migration yo‘q. |

## TASK-240 — Informatika savollar banki chuqur sifat nazorati

| ID | Status | Dependency | Natija yoki qolgan shart |
|---|---|---|---|
| TASK-240 | DONE | TASK-060, TASK-063 | 5 966 aktiv savol bo‘yicha avtomatik chuqur QA va source-corpus solishtiruvi bajarildi. Ekspert dalilisiz xato published qilingan 380 ta S5.WEB/GV2 savol productionda immutable archive + yangi review revision orqali karantinga olindi; publication/fingerprint/immutability guard, regression, audit SQL va `docs/TASK240_INFORMATIKA_QUESTION_BANK_DEEP_QA.md` qo‘shildi. Ochiq ekspert release shartlari hisobotda qayd etilgan. |

## TASK-239 — Office V2 grafik savollarini yakunlash
| ID | Status | Dependency | Natija / release sharti |
|---|---|---|---|
| TASK-239 | IN_PROGRESS (release BLOCKED) | M03 9 review dars / 270 review/draft savollar | PR #178: 7 SVG, frontend allowlist, 7 draft→review migratsiya va testlar; qolgan: CI, Vercel deploy limiti, tasdiqlangan ekspert QA, production smoke. **Kontentni avtomatik publish qilish mumkin emas.** |

## TASK-230–238 — Shaxsiy test konstruktori: kod, QA va release

| ID | Status | Dependency | Natija yoki qolgan shart |
|---|---|---|---|
| TASK-230 | DONE | TASK-210 | Published/active construct filtri va exact SQL quotas |
| TASK-231 | DONE | TASK-230 | Owner-only finished analytics: lesson/A–E/Y1–Y3 |
| TASK-232 | DONE | TASK-231 | Active exam resume, saved answers, idempotent start |
| TASK-233 | DONE | TASK-232 | Learning-only submitted feedback va exact equal quotas |
| TASK-234 | DONE | TASK-233 | Admin-only source-backed, keyless coverage |
| TASK-235 | DONE | TASK-234 | Fresh database/backend/frontend/Playwright mobile CI; PR #168 merged |
| TASK-236 | DONE | TASK-235 | Owner isolation, prefinish secrecy va keyless resume regressions; PR #172 merged |
| TASK-237 | BLOCKED | TASK-236 | Authenticated staging learner/admin acceptance: independent, cost-approved Supabase staging kerak |
| TASK-238 | BLOCKED | TASK-237 | Production migrations va Vercel release: owner release authorization va smoke kerak |

> TASK-230–236 kodi GitHub main branch'iga merge qilingan; PR #168 commit 75a079744211 va PR #172 commit 792dd6a2aee0. TASK-230–234 yangi migrations productionga qo‘llanmagan. Staging qoidalari docs/TASK237_CUSTOM_BUILDER_STAGING_ACCEPTANCE.md.

## TASK-214 — Grafika va veb-texnologiyalar: qo‘shimcha Y2/Y3

| ID | Status | Dependency | Deliverable |
|---|---|---|---|
| TASK-214 | IN_PROGRESS | TASK-213 review-only bank | 5 × (8 Y2 + 8 Y3) = 80 yangi original topshiriq; jami 380 (280/50/50), bazaga qo‘shimcha review migratsiyalari va testlari. Qolgan ekspert ko‘rigi / release shartlari: `docs/TASK214_GRAPHICS_WEB_380_Y2_Y3.md`. |

## TASK-213 — Grafika va veb-texnologiyalar V2 integratsiyasi

| ID | Status | Dependency | Deliverable |
|---|---|---|---|
| TASK-213 | IN_PROGRESS | M10/M11 original lessons + active `S5.WEB` constructs | 6 review lessons + 300 review questions (Y1/Y2/Y3), 8 SVG, additive migrations, fresh DB invariant, guarded editorial approval and production verification; see `docs/TASK213_GRAPHICS_WEB_V2_INTEGRATION.md` |

# TASKS.md — atomik backlog

> Loyiha React+Vite, Supabase, files/ spec bo'yicha.

## Qoidalar

- Statuslar: `READY`, `CLAIMED`, `IN_PROGRESS`, `BLOCKED`, `DONE`
- Dependency `DONE` bo'lmasdan task boshlanmaydi
- "Done" bandlari test bilan isbotlanadi

## P0 — Xavfsizlik va barqarorlashtirish

| ID | Status | Dependency | Deliverable |
|----|--------|------------|-------------|
| TASK-P0-001 | DONE | — | Secretlarni repodan chiqarish, safety checkpoint, root README, stack/taksonomiya ADR, auditga mos project state |
| TASK-P0-002 | DONE | TASK-P0-001 | GitHub CI: secret scan, lint, unit, build va Playwright smoke |
| TASK-P0-003 | DONE | TASK-P0-001, remote migration audit | Bitta toza UUID migration baseline va rasmiy 2026 seed |
| TASK-P0-004 | DONE | TASK-P0-003 | Role escalation, exam membership va idempotent submit xavfsizlik tuzatishlari |
| TASK-P0-005 | DONE | TASK-P0-001 | Admin route deny-by-default guard va xavfsiz bo‘lmagan client mock’ni production bundle’dan chiqarish |

## Oldingi foundation natijalari — audit holati

| ID | Status | Deliverable |
|----|--------|-------------|
| T-001 | DONE | React+Vite+TypeScript strict+Vitest+Playwright |
| T-002 | DONE | Supabase remote project (plyqezulrfowyblsfpzy) |
| T-003 | DONE | Eski BIGINT liniya arxivlandi; UUID baseline fresh va drift-upgrade ssenariylarida isbotlandi |
| T-004 | DONE | `submit_answer` owner/membership tekshiradi, answer immutable va retry idempotent |
| T-005 | DONE | Remote seed 16 modul, 15 guruh, 50/120 va 8/35/7 kontraktiga reconcile qilindi |
| T-006 | DONE | Frontend role guard + admin panel UUID schema/type reconciliation yakunlangan; AdminDashboard/Modules/Questions/Attempts typed oqimda, main CI typecheck/build yashil |
| T-007 | DONE | T-006 | RLS learner/admin access matrix + protected mock exam start→answer→finish→server result Playwright product-flow E2E; fresh DB CI bilan tasdiqlangan |

## Darslik kontenti ekstraksiyasi

| ID | Status | Dependency | Deliverable |
|----|--------|------------|-------------|
| T-DL-001 | DONE | — | Adabiyotlar.txt, spetsifikatsiya — attestatsiya hujjatlaridan kontent code va adabiyotlar ro'yxati ajratildi |
| T-DL-002 | DONE | T-DL-001 | Cambridge+ (5–11 sinf) va ICT (5–11 sinf) darsliklaridan to'liq matn ekstraksiyasi, 18 fayl |
| T-DL-003 | DONE | T-DL-002 | Content code bo'yicha Cambridge kontentini tartiblash → `barcha_kontent_kodlar_boyicha.txt` (~87K qator) |
| T-DL-004 | DONE | T-DL-003 | 38 ta individual code fayli (1.1.txt–13.2.txt) — Cambridge + ICT + tematik manbalar birlashtirildi (~124K qator) |

## M01 kontenti — qo'llanmadan sinxronizatsiya

| ID | Status | Dependency | Deliverable |
|----|--------|------------|-------------|
| T-M01-001 | DONE | — | `Axborot_va_axborot_jarayonlari_LaTeX` boblari kitobdagi ketma-ketlikda strukturaviy bloklarga o'girildi (`scripts/latex_to_blocks.py` → `scripts/gen_m01_ts.py` → `src/data/topics/m01.ts`); 22 mavzu, 691 blok |
| T-M01-002 | DONE | T-M01-001 | Kitob dizayni: quti turlari, KaTeX formulalar, jadval, sxemalar va bob mundarijasi (`src/components/learning/theory/`, `.book-*` CSS) |
| T-M01-003 | DONE | T-M01-002 | Bo'limli o'qish rejimi: `\section` bo'yicha sahifalash, sticky holat paneli, mundarija, klaviatura navigatsiyasi va yakunda bitta "Testni boshlash" (`BookReader.tsx`); takroriy CTA'lar olib tashlandi |
| T-M01-004 | DONE | T-M01-003 | Kontent yangi manbaga ko'chirildi: `I_qism_..._yagona.tex` (yagona fayl, 10 raqamli + 4 raqamsiz bob) → 12 mavzu, 783 blok; eski 22 mavzulik kontent va 33 savol butunlay o'chirildi; yangi quti turlari (Tayanch atamalar, Ishlanadigan misollar, Bosqichma-bosqich yechimlar, Bob maqsadi, tahlil qutilari) va 10 ta yangi sxema qo'shildi |

## Phase 1 — Core app (keyingi)

| ID | Status | Dependency | Deliverable |
|----|--------|------------|-------------|
| T-008 | DONE | TASK-P0-003 | database.types.ts UUID schema bo'yicha yangilash |
| T-009 | DONE | T-008 | ExamRunner + Y1/Y2/Y3 komponentlarini UUID schema ga moslash |
| T-010 | DONE | T-008, T-009 | contentTree.ts, topicContent.ts ni UUID schema ga moslash |
| T-011 | DONE | T-010 | Learning moduli (mavzu o'qish, test) |
| T-012 | DONE | T-010 | Y1/Y2/Y3 generatorlar (axborotHajmi, sanoqSistema, mantiqAmal, ipMaska): 9 rasmiy konstrukt, seeded determinism, 100-seed semantic uniqueness va mustaqil formula testlari |
| T-013 | DONE | T-011, T-012 | ExamRunner bo‘lim/mavzu/mock sinovlarini server gateway → backend RPC oqimida ishga tushiradi; fallback xavfsizligi regressiya testlari bilan yopildi (PR #30) |
| T-014 | DONE | T-013 | Natija ekrani server-authoritative ball, passed qarori va guruh kesimini saqlaydi; client qayta hisoblash regressiyasi yopildi (PR #31) |
| T-015 | DONE | T-014 | Mock exam UI: server-authoritative timer, navigator va client-side review flaglari regressiya testlari bilan yopildi (PR #32) |
| T-016 | DONE | — | User auth frontend: login/register/profil/logout UX (validatsiya, EMAIL_NOT_CONFIRMED, redirect), profilga parol o'zgartirish, route himoyasi va session expiry |
| T-017 | DONE | T-011, T-012 | M01 darslik kontenti va 400 savolni frontend → backend → DB oqimiga ko'chirish (lessons.blocks + questions seed + lessonContentGateway) |
| T-018 | DONE | T-017 | Dars testi 20 ta random savol (faqat joriy dars pool'idan) + javoblar aralashishi (option_order) + umumiy vaqt savollar×2 daqiqa (server timer) + admin sinov urinishlarini ko'rish (API + admin panel sahifasi); Vercel deploy (frontend + backend) va ko'p segmentli /api/* routing fix (PR #9 — rewrites) |
| T-019 | DONE | T-018 | Zod validatsiya xatolari 400 `VALIDATION_ERROR` qaytaradi (ilgari 500): ildiz sabab — `setErrorHandler` route'lardan keyin chaqirilgani uchun Fastify route context'lari default handler'ni ushlab qolgan; endi handler route'lardan oldin o'rnatiladi + zod 3.25.x `issues`/`errors` strukturaviy tekshiruvi; regressiya testlari (`error-handler.test.ts`, 3 ta) |
| T-021 | DONE | T-019 | Backend Vercel loyihasi GitHub'ga ulandi (`POST /link`, productionBranch=main, rootDirectory=backend); auto-deploy tasdiqlandi (push → production deploy, preview ham); PR #13 |
| T-022 | DONE | T-021 | Backend alohida `sarvar9417/attestatsiya-backend` (public) repoga ko'chirildi; Vercel qayta ulandi (rootDirectory bekor, repo ildizi); yangi repo CI (tsc + vitest 102 + secrets scan); push → auto-deploy tasdiqlandi; asosiy repodan `backend/` olib tashlandi |
| T-023 | DONE | T-012 | Parametrik generatorlardan deterministik DB seed pipeline: 9 konstrukt × 30 = 270 savol, UUIDv5, Y1/Y2/Y3 key materialization, append-only SQL builder (PR #35) |
| T-024 | DONE | T-023 | Generated 270-savol SQL fresh PostgreSQL CI’da ikki marta qo‘llandi; idempotency, 9×30 distribution, option/key invariantlari va FK yaxlitligi yashil tasdiqlandi |
| T-025 | DONE | T-024 | 270-savollik versiyalangan migration production `plyqezulrfowyblsfpzy` Supabase’ga apply qilindi; remote history exact version bilan reconciled va generated savollar soni 270 bilan verifikatsiya qilindi |
| T-026 | DONE | — | Dashboard Blueprint strip: 15 rasmiy guruh kengligi 3:2:5:3:2:3:3:3:2:5:2:2:5:7:3 nisbatida, 50 savol va 35/5/7/3 section taqsimoti; CI yashil (PR #46) |
| T-027 | DONE | T-014, TASK-UI-009 | Learner `Natijalar tarixi`: backend `/api/exam/history` kontrakti frontend gatewayga ulandi, protected `/history` sahifasi, pagination, loading/error/empty holatlari va desktop/mobile navigation qo‘shildi; server-authoritative ballardan tashqari qayta hisoblash yo‘q |
| T-028 | DONE | T-027 | Frontend + Fastify backend bitta `sarvar9417/attestatsiya` monorepoda: frontend rootda, backend `backend/` ichida; root CI frontend/backend/database qatlamlarini tekshiradi; production backend monorepo `main` commitidan muvaffaqiyatli deploy qilindi |
| T-029 | DONE | T-015, TASK-UI-004 | Figma tasdiqlangan test interfeysi parity: `/exam/*` immersive shell, asosiy savol chapda, nomzod/vaqt/savol navigatsiyasi o‘ngda, 10 ustunli holat palitrasi va legend, light/dark boshqaruv; server timer/scoring va explicit answer submit xulqi saqlanadi |
| T-030 | DONE | T-029, T-027, TASK-UI-009 | Figma/chat post-exam flow: yakuniy Natija ekranidan server-backed savollar tahlili, Natijalar tarixi va Xatolarni qayta ishlashga aniq next-action yo‘llari; answer key faqat finalized sessiondan keyin review endpoint orqali |
| T-031 | DONE | T-030 | UX_SPEC/Figma persistent Natija route: learner faqat o‘z finalized attemptini `/results/:examId`da qayta ochadi; tarix kartalari detailga olib boradi; result endpoint owner-filtered, review faqat finalized sessiondan olinadi |
| T-032 | DONE | T-031, TASK-UI-009 | Xatolar notebook → real retest: due-review sahifasidan `/exam/takrorlash` server sessioniga aniq CTA; `takrorlash`/`zaif` route’lari mockga yashirin fallback qilmaydi; mavjud server-authoritative scoring/timer saqlanadi |
| T-033 | DONE | T-032, T-016 | Onboarding + diagnostika, imtihon sanasi, kunlik maqsad va learner gate `main`da; `20261007131000_onboarding_profile.sql` production Supabase’ga apply qilindi va schema verifikatsiyasi yashil |
| T-034 | DONE | T-032 | Mastery/SRS foundation: append-only evidence, cognitive counters, learning/provisional/stable/regressed state, deterministic 1/3/7/14/30 interval scheduler va authenticated `/api/progress/mastery` read model; PR #57 full CI yashil |
| T-035 | DONE | T-034 | Blueprint-weighted readiness v1 + confidence/coverage + server-prioritized next action (`due review → regressed → diagnostic → learn`); Dashboard fake completion-as-readiness o‘rniga evidence-based readiness ko‘rsatadi; PR #59 full CI yashil |
| T-037 | DONE | T-025, T-033, T-034 | Production Supabase reconcile: 4 pending migration productionga atomik apply qilindi; 270 generated savol, onboarding, mastery/SRS, question-key policy va backend DB health verifikatsiya qilindi |
| T-038 | DONE | T-037 | Frontend + Fastify backend bitta `attestatsiya` Vercel projectida: root `/api/*`, production same-origin API, bitta env boundary; production deploy READY, `/api/health` va `/api/content/modules` yashil, eski `attestatsiya-backend` project PAUSED |
| T-039 | DONE | T-034, T-035, T-038 | Adaptive practice selector: 10 savol, 50/25/15/10 target, immediate exact retry yo‘q, exposure penalty va fallback audit metadata |
| T-040 | DONE | T-039 | Published savol → objective/source/cognitive/difficulty coverage auditi; M01 matrix, orphan/mis-tagged va traceability issue report, admin `/admin/coverage` |
| T-041 | DONE | T-040 | Objective-complete topic-test assembler: configurable 10–50, required/critical objective hard slots, insufficient-pool no-session guard, key/taxonomy validation va low-exposure preference |
| T-042 | DONE | T-038 | Single-Vercel cleanup: standalone backend Vercel config olib tashlandi, root `/api/*` entry CI typecheck bilan himoyalandi, production same-origin API regressiya testi qo‘shildi, backend README/project state bitta origin bilan reconcile qilindi; CI #792 yashil |\n| TASK-043 | DONE | T-041, T-042 | Xususiy M01 professional bank import/audit: 570 savolni public Gitga answer key sizdirmasdan admin-only batch import qilish, REVIEW staging, objective/source metadata, idempotency va audit log |\n| TASK-044 | DONE | TASK-043 | M01 50-savollik section mock: topic/critical objective coverage, deterministic feasibility, unseen preference, 45/50 + critical floor, audited assembly metadata |
| TASK-045 | DONE | TASK-044 | Rasmiy 2026 full mock: 50 savol, 120 daqiqa, active blueprint bo‘yicha exact group×cognitive kvota, preflight feasibility, unseen preference, audit metadata |
| TASK-046 | DONE | TASK-045 | Xususiy 570 savollik professional bank payloadini strukturaviy validatsiya, taksonomiya tekshiruvi, formula-risk auditi va xavfsiz importga tayyorlash |
| TASK-047 | DONE | TASK-046 | M09 ma’lumotlar bazasi bo‘limi uchun 5 ta active S4.DB konstruktni qamrab oluvchi source-backed darslar, source trace va DB regressiya testi |
| TASK-048 | DONE | TASK-047 | M14 kasb standarti uchun 7 ta KS konstruktga source-backed darslar, rasmiy source registry va DB regressiya |
| TASK-049 | DONE | TASK-048 | M16 informatika o‘qitish metodikasi uchun PM.MET.01–03 source-backed darslar, source trace va DB regressiya |
| TASK-050 | DONE | TASK-049 | M15 umumiy pedagogika uchun PM.GEN.01–08 source-backed darslar, source trace, final source-gap closure va DB regressiya |
| TASK-051 | DONE | TASK-050 | M02 kompyuter tizimlari uchun S2.HW.01–04 source-backed darslar, source trace va DB regressiya |
| TASK-052 | DONE | TASK-051 | M03 Microsoft Office uchun S2.OFFICE.01–04 source-backed darslar, source trace va DB regressiya |
| TASK-053 | DONE | TASK-052 | A3: M04/M05/M06 uchun S3.LOGIC, S3.NUM va S3.ALGO source-backed darslar va DB regressiya |
| TASK-054 | DONE | TASK-053 | A4: M07/M08 uchun S4.BLOCK va S4.CODE source-backed dasturlash darslari va DB regressiya |
| TASK-055 | DONE | TASK-054 | M10/M11 uchun S5.WEB.01–06 source-backed grafika va veb darslari, aniq construct mapping va DB regressiya; PR #82 |
| TASK-056 | DONE | TASK-055 | M12/M13 uchun S6.NET.01–05 va S7.SEC.01–06 source-backed tarmoq, xavfsizlik va raqamli xizmat darslari; PR #84 |
| TASK-057 | DONE | TASK-056 | 77/77 active official construct uchun published lesson coverage CI invariant; topilgan S1.INFO.06 bo‘shlig‘i source-backed uzatish tezligi darsi bilan yopildi; PR #85 |
| TASK-058 | DONE | TASK-057 | Project state/TASKS reconciliation: auth va production activation blockerlarini, qolgan question-bank coverage ishini aniq qayd etish; PR #86 |
| TASK-059 | DONE | TASK-057 | Blueprint bo‘yicha real question-pool feasibility auditi: production assembler eligibility bilan bir xil published+keyed+active taxonomy qoidalari, group × cognitive exact deficit, AC-CNT-04 release reserve va admin UI; PR #87 |
| TASK-060 | DONE | TASK-059 | Source-backed savol banklarini spetsifikatsiya bo‘yicha kengaytirish yakunlandi: private AXB 570/570 productionda (540 published, 30 review quarantine); 17 ta exact gapfill + 334 ta reserve = 351 ta public source-backed Y1 savol qo‘shildi; official 50/50 feasibility va AC-CNT-04 har required group×cognitive slot uchun ≥20 candidate bilan 0-deficit |
| TASK-061 | DONE | TASK-057 | Yuqori amaliy og‘irlikdagi S5.WEB/S6.NET/S7.SEC darslariga worked code, IP/maska hisoblash, xavfsizlik scenario va Web-Freelance workflow qo‘shildi; 7 ta lesson uchun DB regression invariant |
| TASK-062 | DONE | TASK-060 | Rasmiy S1.INFO taxonomy reconciliation: “axborotni saralash va xulosa chiqarish” S1.INFO.08 bilan yopildi; private AXB 570/570 strukturaviy auditdan o‘tdi va productionga xavfsiz import qilindi; keyingi source/construct review natijalari TASK-060/TASK-063 da yuritiladi |
| TASK-063 | DONE | TASK-062 | Private bank + multi-format reconciliation yakunlandi: 540 AXB published, 30 supplementary review-only quarantine; 24 ta Y2 + 24 ta Y3 source-backed savol productionga published qilindi; M02/M05 canonical stable lesson ID/construct mapping production drifti xavfsiz reconcile qilindi; regression testi Y2/Y3 key shape, check_answer va source-lesson mappingni qoplaydi |
| TASK-064 | DONE | T-016 | Password recovery stability kodi current main’ga PR #112 bilan merge qilindi va production Vercel deployment `dpl_8uzytLVAJKAReW7zrWbr8Rs6gNz5` READY; recovery token snapshoti rerender/fallback race’ni yopadi, reset redirect canonical va URL secret boundary qattiqlashtirilgan. Final real-email acceptance B-AUTH-001 da alohida qoladi |

## UI modernizatsiya — Figma approved design

| ID | Status | Dependency | Deliverable |
|----|--------|------------|-------------|
| TASK-UI-009 | DONE | TASK-UI-008 | Server-backed Xatolarni qayta ishlash sahifasi: due-review ro‘yxati, accuracy ustuvorligi, loading/error/empty/retry, desktop/mobile navigation va full CI yashil |
| TASK-UI-008 | DONE | TASK-UI-007 | Auth, Profile va Reset Password Figma design systemga moslashtirildi; auth/session/validation behaviori saqlandi; duplicate metadata regressiyalari tuzatildi; ResetPassword testlari va full CI yashil |
| TASK-UI-007 | DONE | TASK-UI-006 | QuestionFormModal va savol yaratish/tahrirlash formasi Figma design systemga moslashtirildi; mavjud Y1 save behaviori saqlandi; validation/error holatlari inline ko‘rsatildi; Y2/Y3 cheklovi aniq ko‘rsatildi; regressiya testlari qo‘shildi |
| TASK-UI-006 | DONE | TASK-UI-005 | Admin Modules, Questions va Attempts sahifalari Figma design systemga moslashtirildi; mavjud CRUD/status transition/filter/detail behaviori saqlandi; loading/error/empty holatlari birxillashtirildi; regressiya testlari qo‘shildi |
| TASK-UI-005 | DONE | TASK-UI-004 | Figma admin yo‘nalishiga mos AdminLayout va AdminDashboard redesign qilindi; mavjud typed Supabase count oqimi saqlandi, loading/error/refresh holatlari qo‘shildi, soxta analytics kiritilmadi, regressiya testlari yozildi |
| TASK-UI-004 | DONE | TASK-UI-003 | Figma assessment yo‘nalishiga mos ExamRunner intro, active status va results UI redesign qilindi; server-authoritative timer/scoring/navigation behaviori saqlandi; regressiya testlari kengaytirildi |
| TASK-UI-003 | DONE | TASK-UI-002 | Figma lesson yo‘nalishiga mos TopicView shell yaratildi: stage navigator va nazariya/test/result holatlari vizual birlashtirildi; mavjud content, BookReader va server-check behaviori o‘zgartirilmadi; regressiya testlari qo‘shildi |
| TASK-UI-002 | DONE | TASK-UI-001 | Figma tasdiqlangan Learning va Module/Section overview ekranlari mavjud catalog/progress oqimi bilan implement qilindi; qidiruv, progress va topic ochish behaviori saqlandi; regressiya testlari qo‘shildi |
| TASK-UI-001 | DONE | T-011, T-016 | Figma tasdiqlangan dashboard va asosiy sidebar vizual tizimi mavjud React+Vite arxitekturasida implement qilindi; real catalog/progress/auth ma'lumotlari saqlandi; responsive holat va regressiya testlari qo'shildi |

## Blockerlar

| ID | Tavsif |
|----|--------|
| B-SEC-001 | RESOLVED — repodan chiqarildi va Supabase tomonda rotate qilindi |
| B-DB-001 | RESOLVED — HTTPS read-only audit remote migratsiya metadata jadvali mavjud emasligini ko‘rsatdi |
| B-DB-002 | RESOLVED — legacy liniya arxivlandi, faol UUID baseline va migration history yaratildi |
| B-QA-001 | RESOLVED — CI secret scan, lint, typecheck, unit, build va E2E bilan yashil |
| B-001 | RESOLVED — T-012/T-023: Y1/Y2/Y3 parametrik generatorlar va deterministik SQL seed pipeline yaratildi |
| B-002 | RESOLVED — TypeScript types remote UUID schema bo'yicha generatsiya qilindi |
| B-003 | RESOLVED — server-scored ExamRunner UUID RPC kontraktiga o‘tkazildi |
| B-AUTH-001 | OPEN — signup/recovery code tuzatishlari PR #90/#94 bilan main’ga merge qilingan; yakuniy production acceptance uchun Supabase redirect allowlist + SMTP/email template va real-email E2E (register → verify → login → forgot → reset → login) hali talab qilinadi |
| B-PROD-001 | RESOLVED — Supabase `sarvar9417` connection orqali production project `plyqezulrfowyblsfpzy` ko‘rinadi; 2026-10-12 kuni S1.INFO.08 reconciliation migrationi muvaffaqiyatli apply qilindi va private bank import qilindi |
| B-CONTENT-001 | RESOLVED — TASK-060/TASK-063 production auditi: official 50-question exact group×cognitive feasibility 0-deficit; AC-CNT-04 bo‘yicha har required slot uchun ≥20 eligible published+keyed+active-taxonomy candidate; Y1 bank ustiga 24 Y2 + 24 Y3 source-backed item qo‘shildi |

## Test talabi

Har task uchun kamida:
- happy path
- permission/validation failure
- chegaraviy holat
## Pedagogika source-bank sifat nazorati — 2026-10-16

| ID | Status | Dependency | Deliverable |
|----|--------|------------|-------------|
| TASK-200 | IN_PROGRESS | TASK-050, TASK-060 | 4 tarixiy PDFdan 15 ta yangi, uzunligi mutanosib, manbasi verified Y1 savol production REVIEWga import qilindi (7 KS + 8 PM.GEN); SQL regressiya passed; 649 candidate qolgan qamrov, published bank bias remediation, expert approval va Testlar/Maxsus pedagogika UI acceptance hali OPEN. Batafsil: docs/TASK200_PEDAGOGY_BALANCED_BATCH.md |

| TASK-201 | IN_PROGRESS | TASK-200 | Pedagogika chuqur audit: KS/PM editorial publication gate, immutable published question snapshotlari, 15-item distinct construct/random tie-break, yangi SQL security regressiya va production verifikatsiya. 118 biased legacy Y1 hamda editorial review UI alohida OPEN. Audit: docs/TASK201_PEDAGOGY_DEEP_AUDIT.md |

| TASK-203 | IN_PROGRESS | TASK-202 | 424 production published questions; 249 owner-batch approvals (82 AI-edited wrong-option sets), no review. Git parity via six maintenance-only replay scripts, QA regression and precise provenance; CI and one merge required. Existing 118 legacy proposals and PR #127 security blockers remain separate. Docs: docs/TASK203_PEDAGOGY_OWNER_APPROVAL_PARITY.md |
| TASK-202 | IN_PROGRESS | TASK-201 | Bitta yakuniy pedagogika release branchida: 649 PDF private source triage, 155 tekshirilgan unlinked source uchun original REVIEW authoring UI, barcha KS/PM savollari bo‘yicha paginated editor va source filters, human editorial checklist, 118 length-biased published itemlar uchun review revision queue, safe atomik publish/archive va Y1/Y2/Y3 key xavfsizligi; **human signoff + final CI + one merge + one deploy** hali OPEN. PR #121 DRAFT; yakunda yangi user buyrug‘isiz release taqiqlangan. See docs/TASK202_ONE_FINAL_PEDAGOGY_RELEASE.md |


| TASK-211 | IN_PROGRESS | TASK-056 | M13 “Axborot xavfsizligi va raqamli xizmatlar”: 7 yangi nazariya, 210 source-backed didaktik test, `review` migratsiya, oldingi published kontent saqlangan. Draft PR #145. Ekspert tasdiqlashi, local migration DB QA, lesson resolver/topic test E2E va alohida production release tasdig‘i OPEN. Docs: `docs/content/TASK-211-M13-AXR.md`. |

## TASK-210 — Universal shaxsiy test konstruktori

| ID | Status | Dependency | Deliverable |
|---|---|---|---|
| TASK-210 | IN_PROGRESS | T-013, T-014, T-015 (DONE) | RFC + backend/API + atomic DB generator, answer-leak guard, universal UI, history and SQL/backend/Playwright regressiyalar branchda ishlangan va CI yashil. Preset CRUD/RLS, microtopic filtr, analytics, resume, production verification OPEN. [RFC](docs/TASK210_UNIVERSAL_CUSTOM_TEST_BUILDER.md), [status](PROJECT_STATE.md), [PR #144](https://github.com/sarvar9417/attestatsiya/pull/144). |

| TASK-212 | IN_PROGRESS | TASK-202/TASK-203 (audit only) | Pedagogika hub va 2026 spesifikatsiya 18-maqsad xaritasi; M15/M16 matn tuzatishlari, nullable verdict regressiyasi; 2026-10-18 production SELECT auditida 424 published, 26 KS review; M14ning 7/7 mavzusida published-keyed 20 pool deficit (3+3+2+6+4+4+4). Editorial expert approval, full preflight, mobil E2E va release hali OPEN. DRAFT PR #149; docs/TASK212_PEDAGOGY_UNIFIED_READINESS_AUDIT_20261018.md. |


## TASK-247 — barnoyevak pedagogika ZIP intake va source-backed dastlabki QA (2026-10-19)

| ID | Status | Dependency | Deliverable |
|---|---|---|---|
| TASK-247 | IN_PROGRESS / SOURCE_EDITIONAL_QA | Text-source triage 59/59, per-page source and question key audits pending | Barnoyevak Drive `attestatsiya/pedagogika/files` ichida **59 PDF + 5 DOCX** matni tekshirildi: 55 PDF matn qaytardi, 4 PDF extract bo‘sh, 2 PDF shaxsiy natijalar (import man); 5 DOCX ochildi. M14.01–07 7/7 fallback nazariya kasb standarti matniga mos qayta ishlangan va published M14 uchun mustaqil ochiladigan manba jadvali UI qo‘shilgan; M15.01–08 o‘qish izohlari darsliklar bilan boyitildi. **24 Vitest source regressiya**; bitta oldingi commit CI PASS, yakuniy branch SHA CI alohida gate. Tarixiy dublikatlar, 2026 5/7/3 mapping va barcha 18 mavzu auditlari davom etadi. No merge, deploy, production DB write. [Full corpus](docs/TASK247_PDF_SOURCE_INVENTORY_20261019.md), [M14](docs/TASK247_M14_7_SOURCE_RECONCILIATION_20261019.md). |

| TASK-301 | IN_REVIEW / MERGE_AUTHORIZED | TASK-UI-003 (DONE); existing reader on main | Preserve existing theory/notes/verified supplements in M01-style reading, retain rendering and navigation, test content-loss regressions; merge authorized after green CI, no deploy. |
| TASK-277 | IN_PROGRESS / MERGE_AUTHORIZED | TASK-262/TASK-301 reader foundation | Global balanced BookReader pagination; current-main TASK-289 PowerPoint va TASK-290 M15.07–08 books preserved; depth triage now 93 brief / 7 partial / 21 substantial candidate. Remaining brief topics and authenticated production visual QA OPEN. User authorized merge; no deploy/DB write. |

| TASK-344 | IMPLEMENTED / REVIEW READY | TASK-277 reader; current `main` | 115 learner topic audit: 110 chapter + 5 appendix; 110/110 chapter book contract PASS. M04/M06/M07 source-complete books, M02/M08/M09/M12.06–09/M13/M14/M16 unified self-study flow, M05 stable pagination + exercise/answers/source. 173 files / 1113 tests, lint/typecheck/build/bundle PASS. `docs/TASK344_SOURCE_COMPLETE_THEORY_CORPUS.md`. Merge/deploy/production DB write alohida ruxsatsiz YO‘Q. |


| TASK-305 | IN_PROGRESS / DRAFT PR | TASK-211/212/213 DONE; current main | M13 source benchmark (2026 demo and 13.04 claimed test), 414 published database QA; 49 Y1 easy-distractor + 24 key-length flags, 70 4×4 Y2 risk; one definite malformed published Y2 (`T063-Y2-022`) versioned migration/test awaiting CI and approval; 21 keyless review candidates (Y1/Y2 4×5/Y3), no production insert, public repo answer exposure P0 mitigation separate. PR #315, `docs/audits/TASK305_M13_ATTESTATSIYA_QUESTION_QUALITY_20261020.md`. |


| TASK-306 | IN_PROGRESS | TASK-305 (Y2 contract fixed) | M13 seven chapters: 7 pilot Y2 4×5 review revisions from published 4×4, database-private key remap (no keys in Git), preserving 70 published originals and history; 4×5 scorer unit and DB regression. Source QA docs/audits/TASK306_M13_MATCHING_4X5_PILOT.md; require CI, parity and future versioned publication. |


| TASK-307 | IN_PROGRESS / RELEASE_AWAITING_CI | TASK-306 (DB review import DONE) | Owner-authorized 7 published 4×4 Y2 -> 7 verified published 4×5 Y2 via atomic new version status + old archive; 71 active Y2 and 414 active M13 unchanged, existing attempts immutable. Release SQL and TASK-213/306/307 QA contracts; #323 public source-answer issue still OPEN. |

| TASK-220 | IN_PROGRESS — QA sync | M12 380-item source & 2025 demo audit, 42 independent review candidates, documented migrations, published-only frontend navigation. PR #331 clean-main sync. 22 published high-risk items need independent expert signoff; **new publication NOT authorized by AI-only QA**. |
## TASK-421 — PedMahoratGuli Telegram tarixidan attestatsiya testlarini ekspert qabul qilish (2026-10-21)

| Task | Status | Acceptance / release |
|---|---|---|
| TASK-421 | DONE — ChatGPT, 2026-10-21 | Barnoyevak Drive `attestatsiya/pedagogika/result.json` (21 085 xabar) to‘liq inventarizatsiya qilindi. 20 591 oddiy xabarning 20 588 tasi private archive bilan parity berdi; qolgan 3 tasi test emas. Faqat attestatsiyaga aloqador, aniq mavzuli, 4 variantli va mustaqil tekshirilgan 16 ta yangi savol 7 konstrukt bo‘yicha `review`ga kiritildi. Poll/reklama/shaxsiy natija, kalitsiz/noaniq/eskirgan va dublikat kontent learner bankiga chiqarilmadi. Production SQL migratsiya bilan, 16/16 postflight; Vercel/application deploy yo‘q. |

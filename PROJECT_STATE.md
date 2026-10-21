Warning: truncated output (original token count: 34881)
Total output lines: 1679

## TASK-422 — PedGuli Telegram savollarining yakuniy tahririy release'i (2026-10-21)

- **Owner:** ChatGPT; user 2026-10-21 kuni to‘liq review va yakuniy qaror vakolatini berdi, qayta tasdiq talab qilinmaydi.
- **Status:** DONE — production migration `20261021151001_task422_pedguli_16_owner_authorized_release`; postflight 16 published / 16 four-option+key valid / 16 balance pass / 16 waiver / 16 immutable snapshot / 0 open finding / 0 historical exam reference.
- **Release contract:** owner-authorized AI editorial qarori alohida provenance bilan yoziladi; mustaqil inson eksperti tasdig‘i deb ko‘rsatilmaydi. Exact-scope va fingerprint guardlari, atomar publish va postflight talab qilinadi.
- **Quality edits:** 2 ta o‘zbekcha qaratqich xatosi tuzatildi; barcha variantlar mazmunan yaqinroq va production length-bias gate’iga moslashtirildi; exact normalized stem duplicate 0.
- **Delivery:** production Supabase data update bajarildi; GitHub `main` merge pending. Vercel/application deploy qilinmaydi. Evidence: `docs/TASK422_PEDGULI_OWNER_RELEASE_20261021.md`.

## TASK-378 — Ota-ona suhbat misoli productionga chiqarish (2026-10-21)

- **Owner:** ChatGPT. Oldingi 16 ta TASK-377 release muvaffaqiyatli (Supabase postflight 16/16, 41 historic).
- **Status:** Source KS published, improved successor review; atomic release dry-run ROLLBACK 1/1 PASS. GitHub CI va haqiqiy production apply pending.
- **Scope:** User ko‘rsatgan original `2e951830-a7b7-4788-ac68-1cb3ebf21b31` → `b64b8def-e21f-4e1b-aaeb-97f973cc281e`; oldingi 4 exam refs immutable.
- **Path:** `supabase/maintenance/task378_parent_meeting_example_owner_release.sql`, `src/tests/task378ParentDialogueRelease.test.ts`, `docs/TASK378_PARENT_MEETING_PRODUCTION_20261021.md`. Boshqa savollar out-of-scope.

## TASK-377 — Pedagogika savollarining 16 variantini productionga chiqarish (2026-10-21)

- **Owner:** ChatGPT; user expressly requested production release of previous TASK-376 work.
- **Status:** DONE: controlled production release applied as migration `20261021114342_task377_owner_authorized_pedagogy_16_release`; CI PASS, postflight 16 successors published / 16 sources archived, 41 historical exam links intact, snapshots/waivers/ledgers 16.
- **Scope:** 16 REVIEW successors only; 16 original published, 41 historical exam-item references retained. 15 successor correct answer phrases differ semantically-equivalent from source; answer-key option IDs must remain intact.
- **Release protection:** versioned `publish_pedagogy_revision`, owner-waived existing protocol with provenance and no false human-editor claims. Explicit source/fingerprint/option match, all-or-nothing 16 release.
- **Files:** `supabase/maintenance/task377_pedagogy_16_owner_authorized_release.sql`, `src/tests/task377PedagogyProductionRelease.test.ts`, docs.
- **Production app:** Supabase data release only; no frontend change or Vercel redeploy required. Remaining pedagogy bank work issue #461.

## TASK-376 — Pedagogika distractorlari semantik sifati (2026-10-21)

- **Owner:** ChatGPT, user requested full pedagogical-option review and fixes.
- **Status:** REVIEW DRAFT / 16 option rewrites preview verified / CI+PR+editorial release pending.
- Production read-only inventory: 823 published in KS/PM.GEN/PM.MET; 1,346 flagged-view rows, 471 flagged across statuses; 105 published flagged items have 105 REVIEW successors. 20 pending revisions have potential categorical-word cues.
- First scoped intervention: 16 incorrect distractors in 16 REVIEW successors; transaction preflight/integrity PASS, ROLLBACK (production data unchanged).
- Never overwrite published revisions, scoring keys, or historical exams. Owner's prior rule: no production deployment or DB publish without separate explicit release authorization.
- Files: `supabase/maintenance/task376_pedagogy_distractor_revisions_ROLLBACK_ONLY.sql`, audit READONLY, `src/tests/task376PedagogyDistractors.test.ts`, report.
- Remaining: independent semantic review for all questions, then approved immutable revisions and postflight. No claim of completion for whole bank.

## TASK-375 — Savollar bazasidagi bir qatorli kodlarni bloklarga ajratish (2026-10-21)

- **Status:** DONE — production postflight PASS; repository quality gates PASS; GitHub main merge tayyor.
- 59 ta published Y1 savolda bajariladigan kod/psevdokod savol gapiga bir qatorda qo‘shilgan: 37 inline-backtick, 22 markersiz `FOR` psevdokod. Qisqa identifikator/ifoda/formulalar scope’dan tashqarida.
- Published tarix immutable: 59 ta yangi revision yaratiladi, option/key UUIDlari xavfsiz remap qilinadi, javob semantikasi va tarixiy attemptlar saqlanadi; eski qatorlar faqat yangi revision tekshirilib published bo‘lgach archived qilinadi.
- Production: 59 published successor / 59 archived source / 0 semantic mismatch / 0 audited inline remainder / 0 published snapshot gap. Eski 80 ta ochiq quality finding successorlarga ko‘chirildi; official-mock eligibility 54 dan tarixiy gate bilan mos 45 taga qaytarildi.
- Verification: transactional migration+SQL regression PASS, production SQL regression PASS, 190 Vitest file / 1 210 test PASS, lint/typecheck/build/bundle PASS. `tsx` IPC cheklovi sabab generated-content check aynan `node --import tsx` bilan PASS.
- Foydalanuvchi database tuzatishni va GitHub main merge’ni so‘radi. Vercel/application deploy qilinmaydi.
- Handoff: `docs/TASK375_DATABASE_CODE_BLOCKS_20261021.md`.

## TASK-374 — Pedagogika PM.GEN 30 ta Y1 izoh ekspert tahriri (2026-10-21)

- Read-only Supabase: 495 published PM.GEN Y1, 152 ta qisqa izoh; M15dagi 56 ta oldingi TASK-371 tayyorlamasi ayrilganda qolgan 96 tadan 30 tasi tanlandi.
- 30 ta noyob 297–355 belgilik pedagogik tushuntirish `supabase/maintenance/task374_pmgen_30_explanations_ROLLBACK_ONLY.sql`da faqat **review-only**, migration emas, `ROLLBACK`, production bazasida bajarilmagan.
- Regressiya: `src/tests/task374GeneralPedagogyRationales.test.ts`; read-only audit `supabase/maintenance/task374_pmgen_short_audit_READONLY.sql`. Hisobot `docs/TASK374_PMGEN_30_EXPLANATIONS_20261021.md`.
- Published revisions, correct answer keys va exam attempts o‘zgartirilmagan. Inson eksperti review’i alohida talab. User alohida buyurmaguncha **faqat GitHub main merge, production deploy/SQL write/publish yo‘q**.

## TASK-373 — Kasbiy standart 60 Y1 savolning tushuntirish sifatini oshirish (2026-10-21)

- Read-only Supabase QA: 211 published KS Y1 savoldan 60 tasining izohi 80 belgidan qisqa va hali reviziya navbatida yo‘q; savol matni, eski izoh va server to‘g‘ri varianti mazmunan solishtirildi.
- 60 ta individual, 285–359 belgilik didaktik rationale: `supabase/maintenance/task373_ks_60_explanations_ROLLBACK_ONLY.sql`, **faqat review draft**, migratsiya emas, productionda bajarilmagan va `ROLLBACK` bilan tugaydi.
- Regression: `src/tests/task373KSExplanationReview.test.ts` 60 noyob source, mazmun bo‘limlari, no-publish/no-COMMIT; read-only audit: `supabase/maintenance/task373_ks_short_explanation_audit_READONLY.sql`.
- Handoff `docs/TASK373_KS_60_EXPLANATIONS_20261021.md`.
- Published question keys, historical attempts va statuses unchanged. **User release rule: faqat GitHub `main`ga merge; ruxsatsiz production deploy/Supabase write/publish yo‘q.**

## TASK-372 — PM.MET qisqa savol izohlari sifati (2026-10-21)

- Read-only QA: 88 published Y1 PM.MET savolidan 35 tasida 80 belgidan qisqa izoh; har biri stem, eski izoh va javob semantikasi bilan solishtirildi.
- 35 noyob va 267–328 belgilik pedagogik-metodik asoslash draft sifatida `supabase/maintenance/task372_pmmet_35_explanations_ROLLBACK_ONLY.sql`da; skript migratsiya emas, `ROLLBACK` bilan tugaydi, live bazada bajarilmagan.
- `src/tests/task372MethodologyExplanationReview.test.ts` — 35 manba, uzunlik, fan qamrovi, no-commit/no-publish regressiyasi.
- `supabase/maintenance/task372_pmmet_short_audit_READONLY.sql` va `docs/TASK372_METHODICAL_EXPLANATIONS_20261021.md`.
- Immutable published, unchanged answer keys, no user attempt changes. **Release: user explicit buyurmaguncha productionga deploy, SQL write, publish qilinmaydi; faqat GitHub `main` merge.**

## TASK-371 — M15 Y1 pedagogika 56 izoh sifatini chuqurlashtirish (2026-10-21)

- 2026-10-21 read-only QA: 5 415 published savoldan 1 945 tasida 70 belgidan qisqa izoh; M15 `authored:m15-topictest-20261018:*` qismidagi 8 mavzu bo‘yicha 56 published Y1 savol uchun alohida didaktik izoh tayyorlandi.
- **Immutable release:** published savollar, javob kalitlari va exam attempts o‘zgartirilmadi. `supabase/maintenance/task371_m15_56_explanation_revisions_ROLLBACK_ONLY.sql` — qo‘lda ko‘riladigan, ROLLBACK-only tayyorlama, migration emas, productionda bajarilmagan.
- Read-only audit: `supabase/maintenance/task371_m15_short_explanation_audit_READONLY.sql`. Vitest: `src/tests/task371M15PedagogyDraft.test.ts`.
- Report: `docs/TASK371_M15_56_PEDAGOGY_EXPLANATIONS_20261021.md`.
- **User release rule:** faqat GitHub `main`ga merge. Production deploy, db push, publish yoki migration explicit alohida ruxsatgacha taqiqlangan.

## TASK-350 — Kasb standarti darsidagi ortiqcha Telegram izohlarini tozalash (2026-10-21)

- **Root cause:** `public.lessons.body_mdx`ga import qilingan Telegram matnining sarlavha, manba havolasi va tahririy izlari o‘quvchi BookReaderiga ham ko‘chgan. `oquv-jarayonini-rejalashtirish`da `/15293` asosiy misol.
- **Fix:** M14/M15 learner uchun `cleanLearnerPedagogyText` orqali 7 sohani sifatli taqqoslash jadvaliga aylantirish va besh xil editorial sarlavha/source izini yashirish. Original nashrdagi dars body maydoniga yozilmadi (published immutable) va manbalar audit izi saqlandi.
- **Scope:** `src/features/content/learnerPedagogyTextCleanup.ts`, `professionalLessonTheory.ts`, Vitest regressiya testlari, `docs/TASK350_PEDAGOGY_LEARNER_TEXT_CLEANUP_20261021.md`. Database migration va qo‘lda deploy yo‘q.
- **Status:** implemented; GitHub CI + PR merge acceptance verifikatsiyasi.

## TASK-369 — Pedagogika/PDF manba kandidat izohlari (2026-10-21)

- User release rule: **faqat kodni `main`ga merge; explicit buyruq bo‘lmaguncha productionga deploy yoki Supabase o‘zgarish YO‘Q**. `vercel.json`da `git.deploymentEnabled=false` inspeksiya qilingan.
- QA snapshot: 8 363 jami savol, 5 415 published; 26 published PDF kandidat/source-key editorial signali; 972 published alohida `Manba:`/source paragrafi. Bu source izlari har doim noto‘g‘ri kalit emas.
- Yechim: `src/features/exam/learnerExplanation.ts` tozalash qatlami; ExamRunner, ExamReviewList, GroupMockPage, lessonContentGateway, TopicView funksiyalariga ulangan. Backend scoring javob kaliti clientga muddatidan avval chiqmaydi.
- 26 savolning individual tushuntirishlari `supabase/maintenance/task369_pdf_explanations_review_ONLY_NO_PRODUCTION.sql`da saqlanadi; `ROLLBACK`, **hech qanday prod qo‘llash va publish yo‘q**.
- Regression va audit: `src/features/exam/learnerExplanation.test.ts`, `src/features/exam/ExamReviewList.test.tsx`, `supabase/maintenance/task369_explanation_audit_READONLY.sql`.
- Documentation: `docs/TASK369_LEARNER_EXPLANATION_EDITORIAL_20261021.md`. Further release requires new direct owner instruction.

## TASK-348 — Guruhli Mock Test xonalarini tiklash (2026-10-20)

- **Base:** TASK-347 #352 GitHub main merge SUCCESS, `72ce5b67d9e918312e5ea65f973246561ea811fc` (2026-10-20).
- **Branch:** `task/TASK-348-group-mock-resilience`; hali main merge/production deploy qilinmagan.
- **Status:** CODE READY / CI + staging 2-session acceptance PENDING.
- **Scope:** a'zolik bo‘yicha qayta kirish ro‘yxati, xonani lobbyda bekor qilish, a'zoning boshlashdan oldin chiqishi, taklif havolasi, manual savol ID ketma-ketligini boshqarish va stale polling response guard.
- **Security:** auth.uid() ga bog‘langan group_mock_my_rooms, direct table select yo‘q, host-only lobby cancellation, started room + scores uchun fail closed; migration va SQL regression yangi.
- **Evidence:** `docs/TASK348_GROUP_MOCK_RESILIENCE_20261020.md`.

## TASK-347 — Guruhli Mock Test (2026-10-20)

- **Owner:** ChatGPT; foydalanuvchi 2026-10-20 loyiha bajarilishini tasdiqladi.
- **Branch:** `task/TASK-347-group-mock`, based on 2026-10-20 main.
- **Status:** CODE IN BRANCH / CI + fresh DB + multiuser QA PENDING; merge/deploy/production DB migration yo‘q.
- **Scope:** Spetsifikatsiya 50 / mavzular soni va darajasi / bankdan ID bilan qo‘lda tanlash; 8 belgili taklif kodi, lobby, host start/reveal/next, cross-client 2.5 s poll, Y1/Y2/Y3, all-answer auto-reveal, 2/0 scoreboard and chat.
- **Security:** Authoritative scoring, no pre-reveal answer keys, 5 private RLS tables, explicit authenticated RPC only, room membership/host checks, immutable per-question answer. `supabase/tests/group_mock.test.sql` and frontend privacy tests added.
- **Next gates:** CI lint/typecheck/build/unit, database reset/SQL role regression, two authenticated browser sessions, generated DB types. Docs: `docs/TASK347_GROUP_MOCK_20261020.md`.

## TASK-346 — PedGuli xabar 4843 rasm tiklash (2026-10-20)

- **Owner:** ChatGPT — foydalanuvchi rasm yo‘qligi haqida xabar berdi.
- **Branch:** `task/TASK-346-pedguli-missing-method-photos`.
- **Status:** CODE READY / CI PENDING, no merge/deploy/production DB writes.
- **Source:** Pedagogika Telegram JSON `@PedMahoratGuli:4843`, exact JPEG `photo_867@09-10-2025_17-17-41.jpg`; 4842 analog rasm ham asl holicha saqlandi. Original tekshiruv ✔ belgisi Debat variantida.
- **Problem:** published `d41ab61f-a43e-4b2d-919b-5b06dde05341` savolida `assets=[]`; tarixiy exam bog‘lanishi 1. 4842 review nusxada ham `assets=[]`.
- **Fix:** Immutable published reviziya/key/tarixni o‘zgartirmasdan, frontend rasmni faqat aniq ID va bo‘sh assets holatida tiklaydi; review sahifasida qat’iy stem+4-option fingerprint tekshiradi. Same-origin asset allowlist, JPEG SHA256 test, fail-closed tests.
- **Acceptance:** fayllarning checksumlari mos, ma’lumot va baholash o‘zgarmaydi, rasm noto‘g‘ri savollarga tushmaydi, CI success. **Production saytda tuzatish faqat deploydan keyin ko‘rinadi**. Rasmli yangi DB revision va human editorial approval alohida.
- **Evidence:** `docs/TASK346_PEDGULI_MISSING_SOURCE_PHOTO_20261020.md`.

## TASK-343 — Pedagogik javob izohlari sifat nazorati (2026-10-20)

- **Owner request:** savollarda Telegram kanalining ✅/✔ javob belgisiga tayangan “izoh” o‘rniga o‘quvchini o‘rgatuvchi pedagogik tushuntirish berilishi.
- **DB READ-ONLY audit:** 8 025 keyed savol; 140 Telegram marker-only explanation: 84 published (9 historical exam uses), 56 review; 2 “rasm/surat” savolda assets=[] (biri published).
- **Code:** `20261021000000_task343_source_only_explanation_publish_gate.sql` yangi source-only izoh bilan publishni bloklaydi; `task343_source_only_explanation_gate.test.sql` positive/negative/boundary; `task343_explanation_source_only_readonly.sql` keyless inventory.
- **Sample revision:** `task343_pedagogic_tact_immutable_revision_AFTER_APPROVAL.sql` pedagogik taktga didaktik izoh kiritadi, eski published/historical snapshotlarni saqlaydi. Live transaction ROLLBACK rehearsal PASS: yangi replacement yaratiladi, so‘ng o‘zgartirishlar qaytarildi. Productionda yozuv yo‘q; bundan “saytda tuzatildi” xulosasi kelib chiqmaydi.
- **Status:** CODE READY / editorial rollout PARTIAL; 140 itemning hammasi qayta yozilmadi, yangi guard productionga apply qilinmadi; main merge alohida. Authenticated UI va prod release, 139 qolgan savol semantik editorial, rasmsiz savollarni karantinga olish ochiq. Vercel deploy yo‘q.

## TASK-345 — O‘rganish kitob bo‘limlarini birlashtirish (2026-10-20)

- **Owner:** ChatGPT (2026-10-20, confirmed by user).
- **Branch:** `task/TASK-345-consolidate-short-lesson-pages`, `main`dan.
- **Status:** CODE READY / CI & release checks PENDING (test va GitHub CI natijalariga qarab yangilanadi).
- **Scope:** Har bir M01–M16 nazariya sahifasini `BookReader.splitBalancedSections` orqali bo‘lish. 4 blokli ortiqcha ajratish o‘rniga mazmunli bo‘limlar, qisqa bo‘limlarni bitta sahifaga jamlash; example/solved/task+code birligi; orphan tail nazorati.
- **Invariants:** `TheoryBlock` tarkibi va ketma-ketligi, published revision, savol identifikatorlari va kalitlar o‘zgarmaydi; browser progress `sections.length`dan avtomatik hisoblanadi. Testlar `LessonPageConsolidation`, `BookReader`, `UnifiedLessonBookDesign`, `TASK277`da.
- **Not in scope:** Ma’lumotlar bazasi migratsiyasi, published darsni joyida tahrirlash, deploy, kontekstni qayta yozish yoki yangi savollar nashri.
- **QA:** Manba: `docs/TASK345_LESSON_PAGE_CONSOLIDATION_20261020.md`. Final workflow CI hamda mobil/desktop authenticated UI smoke statusi alohida ko‘rsatiladi.

Warning: truncated output (original token count: 38340)
Total output lines: 2050

## TASK-342 — Photoshop ta’lim yo‘li, modul sinovi 50, 8 savol nashri (2026-10-20)

- **Owner requested:** darslik va 2026 spetsifikatsiyasiga muvofiq Adobe Photoshop mavzusini o‘rganish, yetarli sifatli savollarni publish va main merge.
- **Integrated work:** TASK-332 (#336), TASK-337 (#340), TASK-338 (#341), combined PR on TASK-342. Three discoverable Photoshop study chapters M10.02/M10.03/M10.04, original ICT 7-sinf exercises + official Photoshop tools. 50 savol/100 daqiqa module UX; existing protected assessment unchanged.
- **Production Supabase release:** TASK-338 migration applied through Supabase on 2026-10-20, journal version `20261020053127`; EXACTLY 8 Photoshop/Paint GV2 reviews moved to published M10 canonical lesson, 4 Y2 + 4 Y3. M10 eligible 59→67, remaining 220 M10 review, 0 unauthorized GV2 published. Fingerprint 8/8, live immutable guard and RLS pass; `reviewer_kind=ai`, NO human editorial claim.
- **Limits:** Published canonical DB has 3 official required-construct lessons vs 7 legacy static study topics; four other static topics have no safe published DB/test parity. No claim of textbook PDF diagrams 1:1 visual verification. Other review/archived banks remain quarantined. No Vercel production deploy.
- **Status:** Combined code pending Github required `quality` gate + merge. See `docs/TASK332_M10_MODULE_EXAM_50_COVERAGE_AUDIT_20261020.md`, `docs/TASK337_PHOTOSHOP_TEXTBOOK_LEARNING_PATH_20261020.md`, `docs/TASK338_M10_OWNER_AI_PHOTOSHOP_8_20261020.md`.

## TASK-305 — Excel/Markdown savol ko‘rinishi (2026-10-20)

- **Status:** CODE READY / CI previously PASS (frontend/backend/database/quality on PR #335), final current-base gate pending. Branch: `task/TASK-305-exam-markdown-table-render`.
- **Scope:** Savollarning serverdagi `stem_md`/`content_md` qiymatlari va scoringni o‘zgartirmasdan, learner Y1/Y2/Y3 hamda yakuniy exam reviewda escape qilingan qatorlar, semantik Markdown jadval va mavjud fenced kod renderingini to‘g‘rilash.
- **Files:** `src/features/exam/questions/ExamProse.tsx`, `ExamRichText.tsx` va uning Vitest regression testi, `ExamRunner.tsx`, `ExamResultPage.tsx`.
- **Verification:** CI/lint/typecheck/test statusini PR tekshiruvidan keyin yangilash; production DB va deployga tegilmagan.

## TASK-306 — Test bank ekspert remediatsiyasi (2026-10-19)

- **Status:** DONE — production migration/postflight PASS; final GitHub required CI va merge ushbu handoff commitida bajariladi; deploy yo‘q.
- **Owner:** Codex; foydalanuvchi 2026-10-19 19:23 Asia/Samarkandda topilgan barcha savol-bank kamchiliklarini tuzatish va ishchi holatda topshirishni buyurdi.
- **Branch:** `task/TASK-306-question-bank-expert-remediation` (`origin/main`dan).
- **Result:** demo 50 immutable review revision (8/35/7, q53→PM.GEN.08); 20 production legacy Y2 native 4+4 review revision; universal independent-editorial/fingerprint publish gate; private QA queue; `official-mock-v4` quality gate; 5 147/5 147 published snapshot; 27/27 blueprint capacity cells yetarli, min zaxira +11. Published revision joyida tahrirlanmadi, reviewer imzosi soxtalashtirilmadi, Vercel deploy qilinmadi. Batafsil: `docs/TASK306_QUESTION_BANK_EXPERT_REMEDIATION_20261020.md`.

## TASK-304 — M14 source-verified QA audit handoff (2026-10-19)

- **Branch:** `task/TASK-304-m14-final-qa-safe-merge`; 2026-10-19 main'dan yangi olingan; eski TASK-303 branch 23 main commit ortida qolgani uchun eski ishlar bilan konflikt chiqarmaslik maqsadida yangi branch ishlatildi.
- **Scope:** 13 betlik `Pedagogning kasbiy standarti - qollanma.pdf` (SHA256 `404bf773e4fd6daea75a96a45543ddbe5be9f94d2cf7e711be7917bb2d95d9b2`) va Drive `Informatika Testlar spesifikatsiyasi.pdf`. 7×12 review-only canonical pedagogical theory blocks; PDF 5/6 cover numbering vs main chapters mismatch va PDF 11-bet mediator/2025 amaldagi LexUZ mediatsiya farqi ochiq qayd etildi.
- **Production SELECT QA:** 140/140 KS published stems+130 Y1 keyed correct contents semantically checked; 8 Y2 four-pair content + 2 Y3 order individually reviewed; 1 broken KS.03 Y2 side mapping (8a/0b), 37/140 full editorial flags, 103 remaining; no keys/source edits, no API/exam edits, no DB writes. Staging-only draft repair SQL in docs, NOT migrations.
- **Files:** `src/data/topics/m14ProfessionalStandardGuide.ts`, `src/tests/M14ProfessionalStandardGuide.test.ts`, `docs/audits/TASK303_M14_FINAL_SOURCE_SEMANTIC_QA_20261019.md`, related source/SQL audit docs.
- **Safety:** new theory is not wired to learner; published immutable; human editorial publish gate & authenticated learner staging smoke open. After CI success this QA artifact may be merged as source/evidence only; no deployment requested.

## TASK-261 — M09 Access/SQL source/provenance triage (2026-10-19)

- **Status:** 5/5 canonical lesson metadata audit DONE; 75 missing exact-20 slots, 309 mapped keyed review occurrences (not unique approved), 0 full editorial approvals and 21 matching canonical source_lesson occurrences. ICT11 PDF 4–52 candidate topic-page crosswalk; production SELECT-only. Human key/source review, unique question reconciliation, authenticated acceptance, production release OPEN/BLOCKED. Task branch task/TASK-261-m09-db-access-review-audit. See docs/TASK261_M09_DB_ACCESS_SOURCE_QA_20261019.md.

## TASK-260 — M11.01 HTML source and draft-candidate pool remediation (2026-10-19)

- **Status:** draft pool + source/key triage staged on branch task/TASK-260-m11-html-review-candidates; 7/20 production eligible, 8 construct-mapped review-only Y2/Y3 (0 expert signatures), 13 new source-page-cited draft Y1 candidate items WITHOUT keys. Editorial, duplicate/revision/construct verification and live authenticated QA still BLOCKED. No production DB mutation/deployment. See docs/TASK260_M11_HTML_SOURCE_AND_CANDIDATE_QA_20261019.md.

## TASK-250 — M02 local Y1 question source candidates and editorial risk (2026-10-19)

- **Status:** REVIEW-ONLY / QA; new branch `task/TASK-250-m02-review-main-reconcile` reconciled from current main.
- **Scope:** 34 legacy Y1 fallback questions, 4 canonical M02 topics, and source-book/page candidates. Six items flagged for ambiguous historical/time-sensitive wording.
- **Artifacts:** `docs/audits/TASK250_M02_34_STATIC_QUESTION_SOURCE_REVIEW.tsv`; `src/tests/M02StaticQuizSourceTrace.test.ts`.
- **Boundary:** candidate locators are not evidence of correct answer or expert approval; unrelated production/private KTD bank unchanged; no deploy or production DB modification.

## 2026-10-19 — TASK-244: M01 13/13 original ICT/Cambridge+ textbooks, page-by-page source review

- **Status:** 13/13 **M01-relevant** textbook sections compared with original Google Drive PDFs; 59 **page-cited** original learner-theory insertions; generated `m01.ts` unchanged. **NOT yet final release-ready:** final GitHub CI, real mobile/desktop authenticated lesson display and editorial/spec question coverage review are outstanding.
- **Branch:** `task/TASK-244-m01-book-by-book-source-audit`, created from TASK-243; merge authorized (2026-10-19), no manual production deploy, no production DB writes.
- **ICT books:** 5-sinf (6 inserts), 6-sinf (4), 7-sinf (7), 8-sinf (4), 9-sinf (3), 10-sinf (3), 11-sinf (5); sum **32**.
- **Cambridge+ books:** 5-sinf (4), 6-sinf (4), 7-sinf (3), 8-sinf (3), 9-sinf (6), 10–11-sinf (7); sum **27**. Total **59**.
- **Code:** `src/data/topics/m01TextbookAudit*.ts`, `src/data/topicContent.ts`. Inserts use exact pre-existing canonical topic/heading, preserve every source block, source provenance and question object unchanged.
- **Test:** `src/tests/M01ICT5BookAudit.test.tsx`, `M01ICT6BookAudit.test.tsx` ... `M01ICT11BookAudit.test.tsx`, `M01Cambridge5BookAudit.test.tsx` ... `M01Cambridge1011BookAudit.test.tsx`, `src/tests/m01Content.test.ts`; source references and base-preservation regressions.
- **Source page evidence:** `docs/TASK244_M01_BOOK_BY_BOOK_SOURCE_AUDIT_20261019.md`; each subsequent book has `docs/TASK244_ICT{6,7,8,9,10,11}_M01_PAGE_CONCORDANCE_20261019.md` and `docs/TASK244_CAMBRIDGE{5,6,7,8,9,1011}_M01_PAGE_CONCORDANCE_20261019.md`.
- **Important factual defects distinguished:** ICT7 2021 audio 48 kHz×16 bit×3min = 17,280,000 B ≈ 16.48 MiB, not printed “1,64 Mb”; ICT9 46×40×67 one-byte text ≈0.118 MiB; four-colour raw 2048×1366 =683 KiB; Cambridge9 and 10–11 data validation≠verification, archival codecs and privacy; dynamic/primary/secondary source meanings.
- **Limit:** PDFs were inventoried in full by accessible text/chapters and M01-relevant sections individually read; **not all pages/pictures of every volume have independent visual QA**. Cross-check of every textbook exercise/test vs official attestatsiya specs and final in-browser authenticated mobile/desktop QA **not complete**. Never label FULLY COMPLETE until these release gates pass.

## TASK-249 — M01.05/M01.06 remaining 210 source-page traces (2026-10-19)

- **Status:** IN_PROGRESS; `task/TASK-249-m01-encoding-media-source-trace`.
- **Scope:** `ARS-04-001..100` va `ARS-05-001..110` uchun 210 item source-status line; `docs/audits/TASK249_M01_05_06_210_ITEM_SOURCE_TRACE.tsv`.
- **M01 completed inventory:** oldingi TASK-247/248 bilan **400 / 400** itemga manba yoki ochiq source debt qaydi bor: 239 topic-supported, 149 partial, 12 source-gap. *Zero item has expert sign-off*; `needs_item_editorial_review` hammasida qoladi.
- **Numeric gate:** 81 + 84 = 165 formula-driven review checks TASK-247 orqali main'da mavjud. `ARS-04-071` rounding policy review-only.
- **Regression:** `src/tests/M01All400SourceTrace.test.ts` barcha bank ID, manba holati va 12 source-gap uchun invariantlar.
- **Release safety:** savollarning answer keylari/revisionlari va live DB o‘zgartirilmagan; production migration yoki deploy yo‘q. Barcha distractor/izoh source-by-source expert review hali bajarilmagan.

## TASK-248 — M01.04 source item trace (2026-10-19)

- **Status:** IN_PROGRESS; branch `task/TASK-248-m01-info-process-source-trace`.
- **Scope:** `ARS-03-001..070` barcha 70 axborot jarayoni va qidiruv savoli uchun alohida `docs/audits/TASK248_M01_04_70_ITEM_SOURCE_TRACE.tsv` yaratilgan.
- **Provenance states:** 42 topic-supported, 25 partial, 3 source-gap. Uchta source-gap `Yo‘q qilish` tushunchasining savol ko‘rinishlari, materialning to‘liq expert approvali emas.
- **Regression:** `src/tests/M0104ItemSourceTrace.test.ts` barcha ID, concept, form va sahifa holatini nazorat qiladi.
- **Inherited:** TASK-247 orqali M01.02/M01.03 120 qatorli reyestr `main`ga kiritilgan; M01 bo‘yicha jami 190 question-level provenance status, hali 210 item ochiq.
- **Safety:** review-only; production DB, published answer revision va Vercel deployment o‘zgarmaydi.

## TASK-247 — M01 source locators and numeric QA (2026-10-19)

- **Status:** IN_PROGRESS; branch `task/TASK-247-m01-numeric-and-source-verification`.
- **Textbook review:** 120 individual M01 questions have book/page trace rows in `docs/audits/TASK247_M01_02_60_ITEM_SOURCE_TRACE.tsv` and `docs/audits/TASK247_M01_03_60_ITEM_SOURCE_TRACE.tsv`.
- **Evidence status:** 81 topic-supported, 34 partial, 5 source-gap; all 120 await item/distractor expert review.
- **Independent numeric gate:** the original 81 numeric checks are extended with 84 additional independently recomputed items in `src/tests/M01AdditionalNumericQA.test.ts`. Total intended numeric coverage: 165 of 400. CI for final head to be checked.
- **Follow-up:** remaining 280 ARS questions need individual page trace; unverified answers must not be published; no production changes or deploy.

## TASK-244 — Y2 moslashtirish testlarining to‘liqligi va tanlov sifati (2026-10-19)

- **Status:** IN_PROGRESS.
- **Owner:** ChatGPT; foydalanuvchi 2026-10-19 sanasida testlar sifati uchun ruxsat berdi.
- **Branch:** `task/TASK-244-y2-matching-quality`.
- **Dependency:** TASK-240 DONE; published kontent va production DB joyida o‘zgarmaydi.
- **Scope:** Y2 matchingning bir-biriga mos (one-to-one) tanlovi, bo‘sh/duplicate javoblarni rad etish va variantlarning qayta renderda o‘zgarmasligi; regressiya testlari.
- **Source boundary:** Drive darsliklari va attestatsiya spetsifikatsiyasi semantik review uchun; xususiy savol matni/answer key public Gitga kiritilmaydi.
- **Release:** mustaqil ekspert approval bo‘lmasa savollar published qilinmaydi; foydalanuvchi alohida aytmaguncha merge, deploy va production migration yo‘q.

## 2026-10-19 — TASK-243: M02 darslik, nazariya va dizayn

- **Status:** IN_PROGRESS / release BLOCKED. 2026 rasmiy specs: 2 ta M02 savol, 4 kanonik konstrukt, 9 legacy mavzu turli bo‘limlarga birlashtirilgan.
- **Branch:** `task/TASK-243-m02-source-and-theory-audit` (`TASK-242` branchdan). `main`ga tegilmagan.
- **Darsliklar:** Drive’dagi ICT5/10, Cambridge+9/10–11 darsliklari matni va 2026 specs o‘qildi; oldingi M02 13-book sampled index foydali, ammo to‘liq page-by-page audit emas.
- **Fix:** SSD/NAND nomlanishi, RAM/cache, ROM/flash BIOS, virtual memory, fayl/papka/katalog, kengaytma, Windows filename, litsenziya vs narx, Android bozori va tarixiy ENIAC wording. Statik 34 savol ichida 7 tasi `Y2` (pairs yo‘q), endi `Y1` ID/correctIndex saqlangan; metadata/quiz productionga yozilmadi. Source jadval `rows` original to‘liq bayonga mos.
- **UX:** 4 M02 topicda heading orphan qilmaydigan paginatsiya; boshqa modullarning standart pagination o‘zgarmagan.
- **QA:** `src/tests/M02SourceFidelity.test.tsx` canonical/group/question/source/pagination regressiyalari; GitHub Actions terminal CI natijasi va authenticated learner E2E tekshirilishi kerak.
- **Evidence & gates:** `docs/TASK243_M02_SOURCE_AND_DESIGN_AUDIT_20261019.md`.
- **No production release:** merge, deploy, migrations, published question status o‘zgartirilmadi.

## 2026-10-19 — TASK-242: M01 nazariya manba va dizayn auditi

- **Status:** IN_PROGRESS / EDITORIAL REVIEW PENDING; owner request: M01 birinchi, so‘ng M02–M16 ketma-ket; merge va deploy uchun alohida ruxsat kerak.
- **Branch:** `task/TASK-242-m01-source-fidelity-and-design`, `task/TASK-241-theory-source-ui-audit`dan davom etadi, `main`dan alohida.
- **Scope:** M01.01–M01.12, asl LaTeX qo‘llanma, 2026 attestatsiya spetsifikatsiyasi, Drive’dagi ICT/Cambridge+ 5–11 darsliklari; learner theory UI.
- **Fix:** 10 ta sarlavhali `examplebox` avval `{1-misol... @@Oddiy@@}` deb noto‘g‘ri chizilgan. Konverterda label ajratish, `\\difficulty` formatini source markeridan farqlash, `m01.ts` generated parity va `BookBlock` label rich rendering yangilandi.
- **Tests:** `src/tests/M01SourceFidelity.test.tsx`: 12 canonical topic, barcha section bloklarini saqlash, 10 diagramma, 10 to‘g‘ri sarlavhali misol, markerlar. GitHub Actions CI yakuniy commitga tekshirilishi kerak; test mavjudligi PASSni anglatmaydi.
- **Source integrity:** spesifikatsiyaning M01 7 konstrukt yo‘nalishi dastlabki nazariya xaritasida bor; 13 manbaning matnlari qidirildi, to‘liq sahifa-by-sahifa ekspert tasdig‘i va auth E2E tugamagan.
- **Handoff / blockers:** `docs/TASK242_M01_SOURCE_AND_DESIGN_AUDIT_20261019.md`; 12 dars visual mobile/desktop; manba page trace; real authenticated learner QA; inson editorial gate.
- **Production:** mutlaqo o‘zgarmagan. No merge/deploy/DB mutation.

## TASK-240 — Informatika savollar banki chuqur sifat nazorati (2026-10-18)

- **Status:** DONE (kritik exposure tuzatildi; qolgan ekspert release shartlari hisobotda).
- **Owner:** Codex; foydalanuvchi 2026-10-18 20:53 Asia/Samarkandda tasdiqlagan.
- **Branch:** `task/TASK-240-question-bank-deep-qa`.
- **Scope:** productiondagi barcha informatika savollari (`published`, `review`, `draft`; archived tarixiy kontekst sifatida), rasmiy spetsifikatsiya, 5–11 ICT/Cambridge+ darsliklari, Drive source fayllari, real va demo testlar bilan strukturaviy, format, mapping, provenance va semantik audit.
- **Mutation boundary:** production published revision joyida o‘zgarmaydi; tasdiqlangan tuzatish faqat yangi revision/archive-replacement migration va test bilan. Human ekspert tasdig‘i bo‘lmagan AI kontent auto-publish qilinmaydi.
- **Deliverables:** to‘liq audit SQL/skriptlari, tasdiqlangan tuzatish migrations/testlari, `docs/TASK240_INFORMATIKA_QUESTION_BANK_DEEP_QA.md` va Git handoff.
- **Production natija:** 380 ta review-only S5.WEB/GV2 xato published nusxa immutable `archived`; 380 ta UUID-rekeyed `review` revision; 0 ta GV2 learner-published; 53 ta avvalgi S5.WEB published savol saqlandi; aktiv S5 blueprint 22/27/4 zaxira bilan feasible.
- **QA:** frontend 65/480 va backend 22/225 test PASS; lint/typecheck/build/generated-content check PASS; production SQL regression PASS.

## 2026-10-18 — TASK-239 Office 2.0 release gate
- Owner: Office V2 integration task. Branch: `task/TASK-239-office-v2-visual-assets`; PR #178.
- DB read-only audit (active project `plyqezulrfowyblsfpzy`): M03 office-v2 9 review lessons, 270 questions (162 Y1, 54 Y2, 54 Y3), 263 review + 7 draft visual questions. Other 4 published Office lessons remain untouched.
- Seven audited SVG diagram reproductions and a strict allowlist are staged on branch; additive migration upgrades only seven original visual `draft` items to `review`, no `published` status or attempt mutation.
- Vercel commit deployment failed due build rate limit (retry 24h). GitHub CI must complete before merge; production migration not yet applied.
- HUMAN APPROVAL GATE: independent content/expert validation is required for all 9 lessons, all 270 question keys and graphics before separate publication. Do not claim full completion without it.
- Tests: branch includes `src/tests/officeV2VisualAssets.test.tsx`; CI pending at time of update.
- Next: CI green; merge authorized technical PR; apply reviewed migration in controlled release; Vercel deploy/smoke; expert approvals; independent published revision.

## TASK-230–238 — Shaxsiy test konstruktori: main merge, staging pending (2026-10-18)

- **GitHub merged:** PR #168 (TASK-230–235) SHA 75a0797442119715caff548015aa77399ab96850; PR #172 (TASK-236 QA) SHA 792dd6a2aee01cad38f9f916a7da3f60ce7d9a51.
- **CI:** PR #168 branch head a016c935, workflow 39137536934 (backend/database/quality success); PR #172 head bda694e7, workflow 39138376125 success.
- **Implemented:** construct selection, owner-only finished analytics, session resume and idempotent start, learning-mode feedback, exact quota suggestion, admin coverage, mobile/keyboard QA and cross-user security tests.
- **TASK-210 early production DB:** initial two SQL migrations 20261018230000 and 20261018231000 applied in production Supabase on 2026-10-18; 2-topic preflight succeeded. PR #144 and UUID fix #161 merged.
- **TASK-230–234 DB:** five new SQL migrations in main but **not** applied to production.
- **Vercel production:** last observed READY deployment SHA 73b48a79989b1f991eca7ed78803ba472e90d68e (old). No new production deployment was requested; prior create attempt was blocked by HTTP 402 daily deployment quota.
- **Staging blocker:** Supabase project attestatsiya100% has no development branch. Creation asked for paid hourly cost confirmation; none given, so branch not created. Do not use Cambridge production or test/write into Attestatsiya production.
- **Next gates:** TASK-237 isolated staging with cost agreement, real learner/admin acceptance, independent code/security review; TASK-238 owner-approved migration and production deploy with verified rollback.
- **Handoff:** docs/TASK237_CUSTOM_BUILDER_STAGING_ACCEPTANCE.md.

## TASK-214 — Grafika va veb-texnologiyalar 380 test (2026-10-18)

- **Holat:** IN_PROGRESS — 300 mavjud review bank saqlangan, 5 bo‘limga 8 ta Y2 + 8 ta Y3 qo‘shimcha, jami 380 (Y1=280, Y2=50, Y3=50). Source text: V2 nazariya va ICT/Cambridge boblari; yozilgan savollar original, mustaqil human QA kutmoqda.
- **GitHub:** TASK-213 Draft PR #152 branchida 5 ta yangi additive review migration + `task214_graphics_web_380_practice_review_contract.test.sql`; full fresh-DB CI natijasi bilan tasdiqlanishi kerak.
- **Release xavfi:** Y2/Y3 uchun bir-biriga mos UUID pairs/order, mavjud 6 published lesson va 53 published savol o‘zgarmas; avtomatik nashr/deploy qilinmaydi. Barcha 380 savol ekspert ko‘rigi va learner E2E o‘tgachgina release mumkin.
- **Batafsil:** `docs/TASK214_GRAPHICS_WEB_380_Y2_Y3.md`.

## TASK-213 — Grafika va veb-texnologiyalar V2 (2026-10-18)

- **Holat:** IN_PROGRESS — 6 review-only V2 lesson + 300 review-only question, 8 SVG diagrams in dedicated branch; existing published M10/M11 6 lessons and 53 S5.WEB published questions preserved.
- **GitHub:** `task/TASK-213-graphics-web-v2-staging`; PR/CI and release verification pending.
- **Security:** Y1/Y2/Y3 answer keys only in `question_keys`; never auto-publish unreviewed AI-authored questions.
- **Acceptance blockers:** independent 300-item editorial review, 9 figure-question comparison, HTML/math/table BookReader parity, learner E2E, CI and verified production DB/deploy. See `docs/TASK213_GRAPHICS_WEB_V2_INTEGRATION.md`.

## TASK-210 — Universal shaxsiy test konstruktori (2026-10-18, functional branch verified)

- **Status:** IN_PROGRESS — PR #144 and #161 merged, early SQL migrations applied to production Supabase; production Vercel not yet updated and full acceptance remains open.
- **Branch:** `task/TASK-210-custom-test-builder`; change scope: RFC, Zod quota parser/planner, safe catalog/preflight, atomic `custom` exam RPC and key-leak guard, frontend wizard and shared ExamRunner, history/result labels, SQL/backend/E2E tests.
- **Validatsiya:** latest functional commit `68adea436e46` da CI backend, fresh PostgreSQL/database (jumladan `supabase/tests/custom_exam.test.sql`), quality/lint/typecheck/build/Playwright E2E = **SUCCESS**. Shu hujjat commitidan keyin CI qayta tekshirilsin.
- **DB:** `20261018230000_task210_custom_exam.sql` va `20261018231000_task210_custom_exam_feedback_guard.sql` — production Supabasega qo‘llangan (2026-10-18). `exam_kind='custom'`, public `custom_exam_preflight(jsonb)`, `generate_custom_exam(jsonb)`; user auth, exact per-lesson A–E quotas, published/keyed/source-backed filters va all-or-nothing.
- **UI:** `/custom-test` protected wizard → `/exam/custom`, ko‘p modul, qo‘lda A–E kvota, Y1/Y2/Y3, exposure, mode, timer. All results in same server-authoritative history flow. Learning mode hozir feedbackni **yakunda** ko‘rsatadi.
- **Qolgan va `DONE` uchun majburiy:** shaxsiy preset saqlash CRUD + RLS; construct-level microtopic selection; domain analytics/result breakdown by selected topic; active attempt resume/idempotent start; migration remote rollout / production acceptance, accessibility va UX smoke. Yakunlanmagan bo‘limlarni “Completed” deb belgilamang.
- **Release restriction:** iznsiz `main` merge, Vercel production deploy yoki production DB migration yo‘q. PR #144 Draft qoladi.


## TASK-203 — Pedagogika 249 owner-approved production bank Git parity (2026-10-18)

- **Production audit:** KS/PM.GEN/PM.MET 424 published, 0 review. Of these 249 were approved as a **project-owner batch**, and 82 had wrong-option text AI-redrafted after initial approval for balanced length; never describe them as independent expert-signed certifications.
- **Source/key safeguards:** all 424 published revisions locked; 0 fingerprint mismatches; 0 rejected PDF keys linked. Legacy 118 private repair proposals remain unpublished, and two previously published malformed Y2 items need separate approved revisions.
- **Repo:** six manual-only fail-closed SQL replay files with exact approved source IDs + finalized wrong text; one owner-bank QA SQL test. All six scripts were dry-run with rollback against production and owner QA test passed. No changes to previously published question/answer records.
- **Release restriction:** merge **TASK-203 parity PR only**, do not merge PR #127 (unresolved `/api/content/questions/check` key-exposure risk and missing scope) or unrelated drafts. No manually initiated Vercel deploy; previous queued deploy retry disabled. See `docs/TASK203_PEDAGOGY_OWNER_APPROVAL_PARITY.md`.

## Pedagogika consolidated release audit — 2026-10-18, before final merge

- User authorization: complete single consolidated merge and production deployment; **freeze all future merges and deploys afterward until another explicit request**.
- Green consolidated CI on `9361a4770b90ed449f3ded3a0c5ce45124fad4a6` (run `39098671181`): database, backend, quality/Playwright.
- Production DB preparation: M15 lessons and 94 new M15 topic-bank questions staged `review`; total KS/PM published 175 (unchanged), review 249; original 175 source snapshots and keys locked. Two conflicting 2026 PDF answer keys remain source `rejected/conflict`, revised original items `review` only.
- 126 published Y1 length-hint risks have separate private rewrite proposals and revision queue entries; all 118 pass the mechanical size/uniqueness QA, but **none were automatically published or falsely human-approved**.
- The private PDF source queue preserves provenance; 649 historical candidates require source-aware independent semantic checking. Work remaining for future editorial approval must never be conflated with this guarded technical release.
- Final PR: `#121`; final Vercel SHA/READY must be verified, not inferred from GitHub merge. Refrain from any subsequent automatic GitHub or Vercel release.

## One-release-only pedagogika completion gate — TASK-202 (2026-10-18)

- **Release instruction:** exactly one final merge + one production deploy after work is complete; **no subsequent merge or deploy without a fresh explicit user request**.
- **Current:** PR #121 DRAFT on `task/TASK-202-pedagogy-single-final-release`; not merged, not production deployed, not production migrated. See `docs/TASK202_ONE_FINAL_PEDAGOGY_RELEASE.md`.
- **Implemented in branch:** private PDF source-review queue + verified source → original review test workflow; full server-paginated KS/PM question bank and expert editor checklist; length-bias revision queue; 118 legacy Y1 risk candidates to be staged as separate review revisions; atomic signed revision publish + source archive; Y1 side='a' storage fix, Y2/Y3 key preservation and immutable published key transfer guard.
- **Blocking finality:** human reviewers must evaluate 153 review items and corrected 118 length-biased published questions, and confirm independent keys for any newly authored items. 155 verified unlinked source candidates require actual authoring decisions; 335 accepted_general source keys remain unverified. No model-generated false approvals; existing published attempt history must remain intact.
- **No repeated release:** CI green alone does not prove human editorial content approval; keep PR in Draft and refrain from production DB changes until all gates are satisfied.

## Pedagogika release security va practice fairness (TASK-201, 2026-10-16)

- **Status:** IN_PROGRESS — 328 KS/PM bank: 175 published, 153 review; no editorial-check approvals. 649 PDF candidate, 195 verified, 335 accepted_general, 119 rejected.
- **Audit:** 169 published pedagogika Y1 savolidan 126 tasida correct variant >30% longer than all wrong. Existing published content immutable, no auto rewrite.
- **Patch:** new server-side publish gate for PDF-derived and all KS/PM, fingerprint locked to source/options/answers; immutable published snapshots survive archive; 15-item practice tie randomization keeps 5+7+3 and distinct constructs.
- **No auto-publish:** 153 review savolga expert signoff talab; source key alone not definitive official truth.
- **Remaining:** expert/editorial approval UX, 118 legacy questions replacement-by-new-revision, 155 verified unlinked source candidates, general-pedagogy non-official lane; see `docs/TASK201_PEDAGOGY_DEEP_AUDIT.md`.

## Pedagogika distractor sifati — TASK-200 (2026-10-16)

- **Status:** IN_PROGRESS. Private PDF candidate inbox (649) saqlangan, 15 ta original Y1 pedagogika/kasb standarti savoli yangi batch sifatida production DBda `review` holatda (KS 7, PM.GEN 8); 0 auto-published.
- **Manba:** 2024 bahor, 2025 bahor, 2025 kuz va 2026 bahor PDFlaridagi `verified + independently_verified` candidate-lar. 15/15 provenance/answer key/4 option va option-length SQL regressiya muvaffaqiyatli.
- **Jiddiy bias:** 169 published Y1 pedagogika savolining 126 tasida to‘g‘ri javob boshqa barcha variantlardan >30% uzun. Published revision immutable: expert approval, new revision va attempt snapshot preservation talab etiladi.
- **Remaining:** 649 source candidate to‘liq savolga aylantirilmagan; 335 general-pedagogy candidate alohida practice bucket; 15 yangi savol expert approval kutmoqda; Testlar/Maxsus pedagogikadan tayyorlanish learner E2E qabul tekshiruvi va PR CI tugamagan.
- **Files:** `docs/TASK200_PEDAGOGY_BALANCED_BATCH.md`, SQL migration, SQL QA regressiya, admin-only audit query.

## Auth recovery stability (TASK-064, 2026-10-16)

- **Status:** DONE — implementation, regression coverage, preview validation, merge va production deploy yakunlandi.
- **Root cause hardening:** reset sahifasi recovery access tokenni birinchi renderda snapshot qiladi; useAuth/sessionStore URL hashni tozalagach ham forma tokenni yo‘qotmaydi va fallback ekranga “refresh” bo‘lib ketmaydi.
- **URL safety:** recovery tugagach token fragmenti `history.replaceState` orqali URLdan olib tashlanadi; faqat hashdagi `type=recovery` access token qabul qilinadi. Query-param access token ataylab rad etiladi, chunki u server/proxy/referrer loglariga tushishi mumkin.
- **Backend redirect:** reset email redirecti canonical `/reset-password` URL bilan quriladi; trailing-slash drift yo‘q.
- **Regression preservation:** current main’dagi hard-refresh va rejected/expired recovery testlari saqlanib, pending-submit rerender race hamda explicit snapshot-token testlari qo‘shildi.
- **CI:** PR #112 backend, database va quality jobs to‘liq yashil; quality ichida secret scan, lint, TypeScript, unit, generated-pool invariantlari, production build va Playwright smoke muvaffaqiyatli.
- **Preview:** `dpl_G6SNfdAHZX4wKUWdRVFujqMk6iyv` READY; `/api/health`, `/reset-password` va `/auth` HTTP 200.
- **Merge:** PR #112 → main commit `0e818437fa0dd9564cb830f04ce17ca00a57f35f`.
- **Production:** Vercel deployment `dpl_8uzytLVAJKAReW7zrWbr8Rs6gNz5` READY va `attestatsiya-five.vercel.app` aliasiga ulangan; production `/api/health`, `/reset-password` va `/auth` HTTP 200.
- **Real email evidence:** oldingi haqiqiy Supabase Auth reset xati Gmailga yetib kelgan va verify link `redirect_to=https://attestatsiya-five.vercel.app/reset-password` ni olib yurgan.
- **Acceptance boundary:** B-AUTH-001 hali OPEN — yangi production buildda fresh real-email `forgot → email → recovery link → yangi parol → yangi parol bilan login` E2E hali qo‘lda tasdiqlanishi kerak. Bu TASK-064 deploy yakunlanganini o‘zgartirmaydi, lekin authni 100% acceptance deb e’lon qilishga to‘sqinlik qiladi.

## Multi-format bank + lesson drift reconciliation (TASK-063, 2026-10-12)

- **Y2/Y3 source-backed expansion:** 48 ta original savol productionga qo‘shildi va `published` qilindi — **24 Y2 (matching)** + **24 Y3 (ordering)**. Bank specialty, professional-standard va pedagogy/methodology constructlarini qamraydi.
- **Format QA:** TASK-063 savollarida Y2 uchun 8 option + 4 valid pair, Y3 uchun 4 option + 4 valid order; barcha key option UUIDlari o‘z savoliga tegishli, `check_answer(format, key, key)` 48/48 o‘tadi, source-lesson/construct mosligi 48/48.
- **Production format hajmi:** mavjud 7 Y2 va 15 Y3 ustiga yangi batch qo‘shilgach published pool **Y2 = 31**, **Y3 = 39** bo‘ldi.
- **M02 canonical reconcile:** production legacy M02 lessonlari learner progress/exam/attempt reference = 0 ekanligi tekshirilib, canonical stable lessonlar `92000000-...001..004` (S2.HW.01–.04) published/source-backed holatga keltirildi. Eski production-only lessonlar o‘chirilmadi — `archived` qilindi; savollar construct bo‘yicha canonical lessonlarga qayta bog‘landi.
- **M05 canonical reconcile:** canonical stable lessonlar `95000000-...001..003` (S3.NUM.01–.03) bilan production moslashtirildi; legacy lessonlar xavfsiz `archived`, savol source-linklari canonical construct lessonlariga ko‘chirildi.
- **Mock/release invariants:** TASK-063 o‘zgarishlaridan keyin official 50-savollik exact feasibility va TASK-060 AC-CNT-04 reserve talabi saqlanadi; M02/M05 constructlarda null/mismatched source-lesson qolmasligi regression bilan tekshiriladi.
- **Production migrations:** `20261012045226_task063_y2_y3_format_bank_01` va `task063_m02_m05_lesson_drift_reconcile` production migration historyga kiritildi.
- **Regression:** `supabase/tests/task063_format_bank_reconcile.test.sql` Y2/Y3 soni, key shape, `check_answer`, canonical M02/M05 lessonlar va question→lesson construct mosligini tekshiradi.
- **Xavfsizlik:** private AXB payload/public answer-key Git tarixiga ko‘chirilmagan; yangi Y2/Y3 savollar original source-backed content.

## Production question-bank reconciliation (TASK-060/TASK-063, 2026-10-12)

- **Production Supabase:** `plyqezulrfowyblsfpzy` (`attestatsiya100%`) active/healthy.
- **Private AXB bank:** 570/570 savol productionda. 540 ta savol active construct + answer key + 4 option + source-lesson/construct mosligi tekshiruvidan keyin `published`; 30 ta savol `review` quarantine holatida.
- **Quarantine siyosati:** 21 ta validation/verifikatsiya/data-entry savoli source-backed bo‘lsa ham 2026 spetsifikatsiyada alohida band sifatida aniq ko‘rsatilmaganligi sabab review-only; 9 ta parity/checksum/CRC savoli ham tarmoq prinsiplari bilan yaqin, lekin 2026 scope’da nomma-nom berilmaganligi sabab review-only. Ular official mock pool’iga kirmaydi.
- **Public source-backed bank expansion:** TASK-060 doirasida 17 ta exact gapfill va 334 ta release-reserve savol — jami **351 ta original Y1** — productionga qo‘shildi va `published` qilindi. Batchlar S2.HW/OFFICE, S3.ALGO, S4.BLOCK/CODE/DB, S5.WEB, S7.SEC, KS, PM.GEN va PM.MET bo‘shliqlarini yopadi.
- **Migration history:** `20261012042634_task060_exact_blueprint_gapfill`, `20261012042958_task060_release_reserve_r1`, `20261012043228_task060_release_reserve_r2`, `20261012043749_task060_release_reserve_r3`, `20261012044013_task060_release_reserve_r4`, `20261012044400_task060_release_reserve_r5`, `20261012044425_task060_release_reserve_r6`.
- **Official mock feasibility:** production eligibility qoidalari bilan 15/15 quota group, 50/50 unique selection va barcha exact group×cognitive deficit = 0 verifikatsiya qilindi. Authenticated RPC xulqi o‘zgartirilmadi.
- **AC-CNT-04 release reserve:** **DONE** — har bir required blueprint group×cognitive slotda kamida 20 ta eligible published+keyed+active-taxonomy candidate mavjud; production `release_total_deficit = 0`.
- **Drift ogohlantirishi:** productionda M02/S2.HW.04 va M05/S3.NUM.02 uchun source lesson gaplarini yopish maqsadida canonical stable UUIDlar bilan lessonlar mavjud, biroq production legacy lesson orderlari sabab eski `20261009073000_m02_source_backed_lessons.sql` va `20261009080000_a3_logic_num_algo_lessons.sql` migratsiyalarini productionga ko‘r-ko‘rona qayta qo‘llash mumkin emas. Fresh DB chain va production drift alohida reconcile qilinadi.
- **Xavfsizlik:** private AXB savol matni/javob kalitlari public Git tarixiga kiritilmagan. Public Git faqat yangi original source-backed TASK-060 savollarini saqlaydi.

## A4 source-backed programming lessons (TASK-054, 2026-10-09)

- **Holat:** DONE — PR #80 CI backend/database/quality yashil; production migration access tiklanganda apply qilinadi.
- **Branch:** `task/TASK-054-a4-programming-lessons`.
- **Qamrov:** M07 Scratch/LOGO (5), M08 Python/JavaScript (5) — jami 10 ta published dars.
- **Constructlar:** S4.BLOCK.01–05 va S4.CODE.01–05.
- **Manbalar:** Cambridge+ 8-sinf Scratch; Cambridge+ 9-sinf Toshbaqa grafika; ICT 9-sinf (2020) Python; Cambridge+ 10–11-sinf 19-bob JavaScript.
- **QA:** 10/10 lesson, exact one-to-one construct mapping, source-trace/body invariant.
- **Production:** PR merge’dan keyin production Supabase access mavjud bo‘lganda apply qilinadi.

## A3 source-backed logic, numeral systems and algorithms (TASK-053, 2026-10-09)

- **Holat:** DONE — PR #79 CI backend/database/quality yashil; production migration access tiklanganda apply qilinadi.
- **Branch:** `task/TASK-053-a3-logic-num-algo-lessons`.
- **Qamrov:** M04 (4), M05 (3), M06 (4) — jami 11 ta published dars.
- **Constructlar:** S3.LOGIC.01–04, S3.NUM.01–03, S3.ALGO.01–04.
- **Manbalar:** ICT 9-sinf (2020) mantiq, modellashtirish va algoritmlash; ICT 7-sinf (2021) sanoq sistemalari; Axborot va axborot jarayonlari qo‘llanmasi 6-bob.
- **QA:** 11/11 lesson, one-to-one construct mapping, source-trace/body invariant.
- **Production:** PR merge’dan keyin production Supabase access mavjud bo‘lganda apply qilinadi.

## M03 source-backed Microsoft Office lessons (TASK-052, 2026-10-09)

- **Holat:** DONE — PR #78 CI backend/database/quality yashil; Vercel preview build-rate-limit sabab preview yaratilmagan.
- **Branch:** `task/TASK-052-m03-office-lessons`.
- **Qamrov:** S2.OFFICE.01–S2.OFFICE.04 uchun 4 ta published dars.
- **Manbalar:** ICT 5-sinf (2020) MS Word; Cambridge+ 10–11-sinf 8-bob elektron jadvallar; ICT 6-sinf (2021) PowerPoint.
- **Mapping:** Word → S2.OFFICE.01; Excel formula/funksiya → S2.OFFICE.02; Excel filter/sort/chart → S2.OFFICE.03; PowerPoint → S2.OFFICE.04.
- **QA:** 4/4 lesson, 4/4 construct link, one-to-one va source-trace invariantlari.
- **Production:** PR merge’dan keyin production Supabase access mavjud bo‘lganda apply qilinadi.

## M02 source-backed hardware/software lessons (TASK-051, 2026-10-09)

- **Holat:** DONE — PR #77, CI #968 backend/database/quality yashil.
- **Branch:** `task/TASK-051-m02-hardware-lessons`.
- **Qamrov:** S2.HW.01–S2.HW.04 uchun 4 ta published dars.
- **Manbalar:** ICT 5-sinf (2020) kompyuter tuzilishi, boshqaruvchi dasturlar va fayl/papka mavzulari; ICT 10-sinf (2021) operatsion tizimlar, fayl tizimi va xizmat dasturlari; Cambridge+ 10–11-sinf 2-bob.
- **Mapping:** apparat qurilmalari → S2.HW.01; OT → S2.HW.02; fayl/papka → S2.HW.03; tizimli/amaliy/xizmat dasturlari → S2.HW.04.
- **QA:** regressiya 4/4 published lesson, 4/4 construct link, one-to-one mapping va source-trace invariantlarini tekshiradi.
- **Production:** migration PR merge’dan keyin production Supabase access tiklanganda apply qilinadi.

## M15 source-backed pedagogy lessons (TASK-050, 2026-10-09)

- **Holat:** DONE — PR #76, CI #957 yashil.
- **Branch:** `task/TASK-050-m15-umumiy-pedagogika-lessons`.
- **Qamrov:** PM.GEN.01–PM.GEN.08 uchun 8 ta published dars.
- **Manbalar:** Mavlonova va boshq. — “Umumiy pedagogika” (2018); Tolipov, Ro‘ziyeva — “Pedagogik texnologiyalar va pedagogik mahorat” (2019); 2026 attestatsiya spetsifikatsiyasi.
- **Mapping:** pedagogika/didaktika → tamoyillar → tarbiya → dars/sinf boshqaruvi → sinf rahbari → etika/nutq/texnika/takt → qobiliyatlar → ta’lim texnologiyalari.
- **Gap:** PM.GEN yopilgach `SOURCE_BLOCKED_GROUPS` bo‘sh; KS, PM.GEN va PM.MET source-backed kontent bilan qamrab olingan.
- **QA:** DB regressiya 8/8 published lesson, 8/8 construct link, one-to-one mapping va source trace invariantlarini tekshiradi.
- **Production:** migration merge bo‘lgach production Supabase write access tiklanganda apply qilinadi.

## M16 source-backed methodology lessons (TASK-049, 2026-10-09)

- **Holat:** DONE — PR #74, CI #934 yashil.
- **Branch:** `task/TASK-049-m16-informatika-metodikasi-lessons`.
- **Qamrov:** PM.MET.01–PM.MET.03 uchun 3 ta published dars.
- **Manba:** Mamarajabov, Toshtemirov, Yuldashev — “Informatika o‘qitish metodikasi” (2023), rasmiy attestatsiya adabiyoti.
- **Mapping:** metodik tizim → PM.MET.01; metod/usul farqlash → PM.MET.02; dars va pedagogik qarorni dalil asosida tahlil qilish → PM.MET.03.
- **Gap:** PM.MET source blocker yopildi; endi faqat PM.GEN source-backed kontenti qoladi.
- **QA:** DB regressiya 3/3 published lesson, 3/3 construct link, one-to-one mapping va source trace invariantlarini tekshiradi.
- **Production:** migration merge bo‘lgach production Supabase write access tiklanganda apply qilinadi.

## M14 professional-standard lessons (TASK-048, 2026-10-09)

- **Holat:** DONE — PR #73, CI #916 yashil.
- **Branch:** `task/TASK-048-m14-kasb-standarti-lessons`.
- **Qamrov:** KS.01–KS.07 uchun 7 ta published dars.
- **Rasmiy manba:** Pedagogik mahorat va xalqaro baholash ilmiy-amaliy markazidagi “Umumiy o‘rta ta’lim maktab o‘qituvchisi” kasb standarti (17 sahifa).
- **Mapping:** A/01.6–A/05.6, B/01.6–B/02.6 vazifalari platformadagi KS.01–KS.07 konstruktlariga birma-bir bog‘landi.
- **Provenance:** `docs/ATTESTATION_SOURCE_REGISTRY.md` qo‘shildi; to‘liq copyrighted PDF repoga kiritilmaydi.
- **Gap:** KS source blocker yopildi; `SOURCE_BLOCKED_GROUPS` endi faqat PM.GEN va PM.MET.
- **QA:** database regressiya 7/7 published lesson, 7/7 construct link, one-to-one mapping va source trace invariantlarini tekshiradi.
- **Production:** migration merge bo‘lgach production Supabase write access tiklanganda apply qilinadi.

## M09 source-backed database lessons (TASK-047, 2026-10-09)

- **Holat:** DONE — PR #72, CI #899 yashil.
- **Branch:** `task/TASK-047-m09-database-lessons`.
- **Qamrov:** S4.DB.01–S4.DB.05 uchun 5 ta published dars.
- **Manbalar:** ICT 11-sinf (2021) ma’lumotlar bazasi darslari va Cambridge+ 10–11-sinf 9-bob; dars matni manbalarni ko‘chirmasdan sintez qilingan, har darsda PDF source trace bor.
- **Mapping:** har dars aynan bitta active S4.DB konstruktga bog‘lanadi.
- **QA:** database regressiya 5/5 published lesson, 5/5 construct link va source-trace invariantlarini tekshiradi.
- **Production:** migration merge bo‘lgach Supabase production access tiklanganda apply qilinishi kerak.

## Private 570-item professional bank validation (TASK-046, 2026-10-08)

- **Holat:** DONE — local 570/570 extraction+validation passed; PR #71 CI #887 yashil.
- **Branch:** `task/TASK-046-private-bank-validation`.
- **Maqsad:** 19 bob × 30 = 570 savollik xususiy payloadni Git'ga qo‘ymasdan importdan oldin qat’iy tekshirish.
- **Validator:** `npm run content:private-bank:validate -- <private.json>`.
- **Invariantlar:** 570/570 ID, 4 variant, answer-key index, active construct kodi, A–E → cognitive/difficulty kontrakti, source locator va PDF sahifa metadata.
- **Xavfsizlik:** private payload patternlari `.gitignore`ga qo‘shildi; validator faqat aggregate diagnostika va ID-level warning chiqaradi.
- **Formula audit:** sanoq sistemasi, birliklar, bit/s/baud kabi tipografiyasi ekstraksiyada buzilishi mumkin bo‘lgan savollar source PDF bilan REVIEW bosqichida tekshirish uchun flag qilinadi.

## Official 2026 full mock (T…4881 tokens truncated… + lessonContentGateway). Faqat pre-existing
  `BookReader` diagramma timeout testi yiqiladi (clean tree'da ham).
- **Live tekshiruv:** M01.02 → 60 savol (Y1), key leak yo'q; check to'g'ri
  javob + izoh qaytardi.
- **Eslatma:** `backend/.env` dagi eski `SUPABASE_SERVICE_KEY` (sbp_...) noto'g'ri
  edi — CLI orqali olingan haqiqiy service_role key bilan almashtirildi
  (.env gitignore'da).

## Dars testi 20 random + shuffle va admin urinishlar (T-018, 2026-07-31)

- **Migratsiya:** `20260731000016_lesson_test_pool_20.sql` (remote'ga push
  qilingan). `exam_items.option_order uuid[]` — har urinish uchun
  aralashtirilgan variant tartibi (side guruhi ichida random);
  `generate_topic_test` — `source_lesson_id` bo'yicha random 20 ta savol,
  yetmay qolsa dars konstruktlari orqali to'ldirish, darsda <20 bo'lsa —
  borlari; `exam_payload` — `option_order` tartibini ko'rsatadi va item
  tartibini integer bo'yicha (eski text-sort xatosi tuzatildi); eski
  exam'lar (`option_order` null) natural tartibda ko'rsatiladi.
- **Migratsiya:** `20260731000017_topic_test_duration.sql` — mavzu testi
  umumiy vaqti: `duration_sec = savollar_soni × 120` (har savolga 2 daqiqa;
  20 savol → 40 daqiqa). Vaqt umumiy — bitta savolga alohida cheklov yo'q.
  Deadline server-authoritative: `submit_answer` `vaqt_tugadi` qaytaradi,
  frontend timer 0 ga yetganda `finish_exam` chaqiradi (ExamRunner line 221).
  <20 savol bo'lsa vaqt ham haqiqiy sonda hisoblanadi.
- **Backend:** `GET /api/admin/attempts` (kind/lesson_id/user_id/from/to
  filter + pagination; email, display_name, lesson_slug, answered_count),
  `GET /api/admin/attempts/:id` (har bir savol: matn, ko'rsatilgan variant
  tartibi, user javobi, `correct_option_id` + izoh — faqat admin). Role
  tekshiruvi: token → `profiles.role = 'admin'`, aks holda 403.
- **Frontend:** `src/features/admin/attemptsApi.ts` (zod strict kontraktlar),
  `src/pages/admin/AttemptsPage.tsx` (filter bar, jadval, pagination,
  detal paneli — to'g'ri/noto'g'ri javoblar rang bilan belgilanadi),
  AdminLayout NAV + `/admin/attempts` route. ExamRunner o'zgarishsiz —
  `duration_sec` avtomatik ishlaydi (timer + auto-finish mavjud edi).
  Mavzu testi intro ekranida "Vaqt cheklovi yo'q" o'rniga haqiqiy cheklov
  ko'rsatiladi: `ExamGateway.previewTopicTest` (backendGateway) dars
  pool'idan `min(savollar, 20) × 2 daqiqa` hisoblaydi — "20 ta savol ·
  40 daqiqa"; preview olib bo'lmasa "Umumiy vaqt: har bir savol uchun
  2 daqiqa" fallback. (3 ta yangi test: 60 savol → 20×40, <20 → haqiqiy
  son, xato → null.)
- **Testlar:** backend 99/99 (admin.test.ts: 9 ta — 401/403/404, list,
  kod→UUID resolve, 400, detal variant tartibi, eski exam natural tartib);
  frontend 238/239 (attemptsApi.test.ts: 5 ta). Lint 0 xato, tsc clean
  (yangi fayllar); faqat pre-existing BookReader timeout.
- **Live E2E:** ikkita urinish → har birida 20 ta distinct savol, takror
  urinishda ~5/20 overlap (random); umumiy savolda variant tartibi har
  urinishda farq qiladi (0/5 bir xil); submit/finish → DB'da `user_answer`,
  `is_correct`, `score`, `time_spent_sec`, `answered_at` saqlanadi;
  admin list/detail real ma'lumotlarni qaytardi (answered_count javob
  berilgan item'lar soni — `.not('answered_at', 'is', null)`).
  000017 push'idan so'ng: M01.02 exam start → 20 item, `duration_sec 2400`
  javobda ham, `exams` jadvalida ham (40 daqiqa).
- **Eslatma:** local docker mavjud emas — migratsiya remote'ga `supabase
  db push --linked --yes` orqali qo'llandi (sintaksis va xatti-harakat
  live tekshirildi). Backend `backend/.env` PORT=3001.

## Vercel deploy va routing tuzatish (TASK-018, 2026-07-31)

- **Deploy:** frontend `attestatsiya` → https://attestatsiya-five.vercel.app (login forma ishlaydi,
  qora ekran yo'q); backend `attestatsiya-backend` → https://attestatsiya-backend.vercel.app
  (`/api/health` → `healthy`, DB ulangan). Frontend env: `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL` (Production + Preview). Backend env:
  `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `AUTH_REDIRECT_URL` (Production).
- **Qora ekran sababi (yechildi):** `vercel.json`'dagi `@` secret reference nomlari kichik
  harfda, Vercel loyihasida katta harfda edi — nom mos kelmasligi sabab "Secret does not
  exist" xatosi. Env block olib tashlandi; Vercel env var'lar build'ga to'g'ridan-to'g'ri
  beriladi.
- **Backend routing bug (topildi va yechildi, PR #9):** Vercel CLI 58.4.4 (va remote
  builder) `api/[...all].ts` uchun `^/api/([^/]+)$` — faqat BIR segmentli — route
  generatsiya qiladi; ko'p segmentli `/api/auth/login` kabi yo'llar platforma 404
  qaytarardi. Bu fastify preset yoki `outputDirectory`'ga bog'liq emas (3 throwaway
  loyihada — fastify'li/fastify'siz, outputDirectory'li/li'siz — bir xil natija).
  Yechim: `backend/vercel.json`'ga
  `"rewrites": [{"source": "/api/:path*", "destination": "/api/[...all]"}]` qo'shildi.
  Rewrite asl URL'ni saqlaydi (`req.url = /api/auth/me?path=auth%2Fme`), Fastify
  pathname bo'yicha to'g'ri route qiladi.
- **Live tasdiqlash (to'liq oqim):** register → confirm (SDK `admin.updateUserById`,
  `email_confirmed_at` yoziladi) → login (`access_token`) → `/api/progress/modules` real
  data (M01, topic_count 12) → `/api/content/modules` 200 → exam start (mavzu M01.02:
  20 item, `duration_sec` 2400, Y1 format, 4 variant) → finish (`max_score` 40,
  `S1.INFO` breakdown). `/api/auth/me`, `/api/exam/due-reviews`, `/api/progress/modules`
  auth'siz 401 (TOKEN_REQUIRED) qaytaradi.
- **Brauzer e2e (Playwright):** `src/tests/e2e/live-auth.spec.ts` deployed backend'ga
  qarshi yashil (2/2): login → dashboard → profil; muddati o'tgan session reload'da
  auto-refresh; chiqish → barcha sahifalar `/auth`ga qaytaradi.
- **Eslatma (T-019, TASK-020'da yechildi):** `POST /api/auth/register` noto'g'ri body bilan
  400 o'rniga 500 qaytarar edi — asl sabab `setErrorHandler` route'lardan keyin
  chaqirilgani (route context'lari default handler'ni ushlab qolgan) + zod 3.25.x
  `errors` API'si; endi 400 `VALIDATION_ERROR` qaytadi (regressiya testlari bilan).
- **Xavfsizlik eslatmasi:** Vercel token, Supabase service key chatda yozilgan —
  hammasi ishlagach token va service key'ni rotate qilish tavsiya etiladi (repo toza,
  `check-secrets` o'tdi).

## To'q ko'k ekran va manifest xatosi tuzatish (TASK-020, 2026-07-31)

- **Foydalanuvchi xabari:** konsolda `Manifest: Line 1, column 1, Syntax error`, ekran
  to'q ko'k (hech narsa ko'rinmaydi). Chuqur tahlil frontend + backend + live serverlar
  bo'yicha o'tkazildi, 3 ta asosiy sabab topildi:
- **1) `public/` katalogi umuman yo'q edi** — `/manifest.json`, `/favicon.svg`,
  `/apple-touch-icon.png`, `/og-image.png` 404 bo'lgan; root `vercel.json` SPA rewrite
  (`/(.*) → /index.html`) tufayli `/manifest.json` index.html (HTML) qaytargach brauzer
  "Manifest: Line 1, column 1, Syntax error" bergan. Yechim: `public/` yaratildi —
  `manifest.json` (Attestatsiya), `favicon.svg`, `robots.txt`, `apple-touch-icon.png`,
  `og-image.png` (`scripts/gen_assets.mjs` — sof node:zlib PNG encoder, qo'shimcha
  dependency'siz, qayta generatsiya mumkin). Vercel real statik faylni rewrite'dan oldin
  beradi.
- **2) index.html'da EnglishPath brendi qolgan edi** (title/og EnglishPath, `lang="en"`,
  `theme-color #1a56db` ko'k, noto'g'ri supabase preconnect) — Attestatsiya brendiga
  almashtirildi: `lang="uz"`, to'g'ri supabase preconnect, `theme-color` #ffffff default
  (dark rejimda inline skript #030712 qo'yadi; theme.ts ham moslashtirildi).
- **3) apiClient'da fetch timeout yo'q edi** — backend javob bermasa loading abadiy
  qolib, to'q ekran ko'rinardi. Endi `fetchWithTimeout` (AbortController, 20s) barcha
  so'rovlarda (refresh ham); AbortError → aniq "Server javob bermadi" xabari.
- **T-019 asl ildiz sababi topildi (backend zod 500):** `setErrorHandler` route'lardan
  KEYIN chaqirilgani uchun Fastify route context'lar yaratilganda default handler'ni
  snapshot qilib olgan (fastify/lib/context.js — `errorHandler || server[kErrorHandler]`)
  → global handler hech qachon ishlamagan; qo'shimcha: zod 3.25.x (v4-core transitional)
  `error.errors` o'rniga `issues` ishlatadi. Yechim: (1) `setErrorHandler` route'lardan
  oldin ko'chirildi; (2) `errors.ts` ga `getZodIssues()` strukturaviy tekshiruv
  (`name === 'ZodError'` + `issues`/`errors` massivlari), sendError'da 400
  VALIDATION_ERROR branch; (3) handler ichi try/catch bilan himoyalandi.
- **Validatsiya:** frontend tsc + build yashil, 242 test; backend tsc + `tsconfig.api.json`
  yashil, 102 test (3 ta yangi regressiya — `backend/src/lib/__tests__/error-handler.test.ts`:
  register {} → 400, login noto'g'ri email → 400, logout tokensiz → 401 global handler
  orqali). Live `app.inject` tekshiruvida register {} endi 400 VALIDATION_ERROR
  (avval 500 Fastify default format).
- **Eslatma:** foydalanuvchi to'q ekranni eski bundle keshidan ham ko'rgan bo'lishi
  mumkin — yangi deploy yangi asset hash'lar bilan keladi; bitta hard refresh
  (Cmd+Shift+R) yetarli bo'ladi.

## Backend GitHub auto-deploy (TASK-021, 2026-07-31)

> ⚠️ Bu bo'lim tarixiy holatni tasvirlaydi — keyinroq TASK-022 da backend alohida
> `attestatsiya-backend` repoga ko'chirildi va Vercel qayta ulandi. Quyidagi
> monorepo ulanish (repo: attestatsiya, rootDirectory: backend) endi mavjud emas.

- **Backend loyihasi (attestatsiya-backend) Vercel GitHub integratsiyasiga ulandi:**
  `POST /v9/projects/prj_xDVzqUZyqVP33Eiy2OoMqoes6fgI/link` bilan
  `{"type":"github","repo":"attestatsiya","org":"sarvar9417"}` — endi har
  `main`'ga push'da avtomatik production deploy bo'ladi.
- **`rootDirectory: backend`** (PATCH /v9/projects/{id}) — build `backend/` katalogidan
  bajariladi, `backend/vercel.json` ishlatiladi (rewrites + buildCommand/outputDirectory).
- **`productionBranch: main`** — ulanishda avtomatik o'rnatildi.
- **Env var'lar (production):** SUPABASE_URL, SUPABASE_SERVICE_KEY, AUTH_REDIRECT_URL —
  avvalgi CLI deploy'lardagi kabi. Preview env var'lari hali yo'q — PR preview'lari
  env'siz ishga tushadi (kerak bo'lsa alohida qo'shilishi mumkin).
- **Eslatma:** bundan oldin backend faqat qo'lda `vercel deploy --prod --token` bilan
  deploy qilinardi (GitHub integratsiya ulanmagan edi); frontend (attestatsiya)
  allaqachon ulangan edi. Endi ikkala loyiha ham main push'da avtomatik deploy bo'ladi.

## Backend alohida repo'ga ko'chirildi (TASK-022, 2026-07-31)

- **Backend endi mustaqil GitHub repoda:** `sarvar9417/attestatsiya-backend` (public,
  to'liq ko'chirish — asosiy repodagi `backend/` katalogi o'chirildi). Asosiy repo
  `attestatsiya` faqat frontend (va supabase migrations, hujjatlar) uchun.
- **Yangi repo tarkibi:** `src/`, `api/[...all].ts`, `vercel.json`, tsconfig'lar,
  `vitest.config.ts`, `package-lock.json`, `.env.example` (faqat placeholder'lar),
  `README.md`, `.gitignore` (node_modules/.env/.vercel/dist/coverage/*.log),
  `.github/workflows/ci.yml` (npm ci + check:secrets + tsc + tsc:api + vitest run,
  placeholder env bilan — testlar .env'siz ishlaydi), `scripts/check-secrets.mjs`
  (`sb_secret_` va JWT pattern'lar).
- **Vercel qayta ulandi:** attestatsiya-backend loyihasi endi yangi repoga bog'langan
  (`POST /link` → `{type: github, repo: attestatsiya-backend, org: sarvar9417}`);
  eski monorepo bog'lanishi o'chirildi; `rootDirectory` bekor qilindi (repo o'zi
  backend ildizi); `productionBranch: main`.
- **Auto-deploy tasdiqlandi:** yangi repoga push (`e82a477`) → Vercel production
  deploy avtomatik (sha: e82a4773, ref: main, target: production, READY). Jonli:
  `/api/health` healthy (DB env'lar ishlayapti), `register {}` → 400 VALIDATION_ERROR.
- **Env var'lar (Vercel, production):** SUPABASE_URL, SUPABASE_SERVICE_KEY,
  AUTH_REDIRECT_URL — o'zgarmadi (loyiha darajasida).
- **Env var'lar (Vercel, preview, 2026-07-31 qo'shildi):** SUPABASE_URL va
  SUPABASE_SERVICE_KEY (type sensitive) — production qiymatlari preview
target'iga ko'chirildi (API orqali; decrypt API bo'sh qaytgani uchun qiymatlar
lokal `.env`dan olindi — production bilan bir xil manba). Endi PR preview'lari
runtime'da env'siz 500 bermaydi. `AUTH_REDIRECT_URL` preview'ga ataylab
qo'shilmadi: ixtiyoriy (config'da default) va preview frontend URL'i har
deploy'da dinamik. Eslatma: Vercel'da key rotatsiyasi bo'lsa preview'ni ham
yangilash kerak.
- **SSO himoyasi:** `ssoProtection: all_except_custom_domains` — barcha custom
  bo'lmagan domaynlar (preview URL'lari, GitHub PR preview'lari ham) Vercel
auth talab qiladi; production `attestatsiya-backend.vercel.app` (custom alias)
ochiq. Preview'lar faqat Vercel'ga login bo'lgan tekshiruvchilarga ko'rinadi
(standart sozlama; xohlasangiz alohida o'chirish mumkin).
- **Lokal (yangi tuzilma, 2026-07-31):** `~/Desktop/attestatsiya` papkasi ichida
  ikkita alohida repo: `frontend/` (attestatsiya repo — frontend + supabase +
  hujjatlar) va `backend/` (attestatsiya-backend repo). Backend `.env`
  `~/Desktop/attestatsiya/backend/.env` da (gitignore'da). Lokal backend
  `~/Desktop/attestatsiya/backend` da ishlaydi (`npm run dev`, PORT=3001).
  Har ikkala repo'ning GitHub/Vercel ulanishi o'zgarmadi.
- **Asosiy repoda:** 44 backend fayli olib tashlandi; README/CI frontend'ga
  bog'liq emasligi uchun o'zgarmadi; faqat PROJECT_STATE.md va TASKS.md yangilandi.

## Vercel platformani to'liq jonli tekshiruv va tuzatishlar (2026-07-31)

- **Asosiy sabab ("platforma ishlamayapti" shikoyati):** Supabase Auth `site_url`
  `http://localhost:3000` edi va redirect allow-list bo'sh edi — ro'yxatdan o'tish
  tasdiqlash xatidagi link localhost'ga yo'nalardi; resend/reset `redirect_to`'lari
  esa "Invalid redirect" xatosiga uchragan bo'lardi.
- **Tuzatishlar (Supabase Management API orqali):** `site_url` →
  `https://attestatsiya-five.vercel.app`; `uri_allow_list` (vergul bilan ajratilgan
  string) → `https://attestatsiya-five.vercel.app,https://attestatsiya-five.vercel.app/reset-password,http://localhost:3000`.
  Eslatma: Management API'dagi maydon `additional_redirect_urls` EMAS —
  `uri_allow_list` (string, vergul bilan ajratiladi); noto'g'ri maydon jimgina
  qabul qilinmaydi (site_url o'tdi, allow-list qolmadi — shu aniqlangan edi).
- **AUTH_REDIRECT_URL (Vercel backend, production):** masked/tekshirib
  bo'lmaydigan qiymat o'chirilib, `https://attestatsiya-five.vercel.app` bilan
  almashtirildi (sensitive env'da PATCH ishlamaydi — DELETE + POST qilindi);
  production redeploy qo'llandi. Bu resend-confirmation va reset-password
  redirect'larida ishlatiladi.
- **Email strategiya:** Supabase default email provayderi (foydalanuvchi tanlovi).
  Free-tier chegara: 2 xat/soat — `over_email_send_rate_limit` (429). Backend endi
  buni aniq `EMAIL_RATE_LIMITED` (429, "Xat yuborish chegarasiga yetildi. Bir necha
  daqiqadan keyin qayta urinib ko'ring.") xabari bilan qaytaradi (`mapAuthError`
  yangi branch + 2 test; backend 104/104 yashil).
- **Jonli tasdiqlash:** frontend 0 konsol xato + himoya kodi bundle'da;
  backend healthy; register → admin confirm → login → me → progress/modules to'liq
  oqim ishlaydi; test foydalanuvchilar tozalandi. Route himoyasi ishlab turibdi
  (bundle'da `auth?returnTo`/`SESSION_EXPIRED`/`expired=1` kodlari bor).

## E2E tekshiruv — mock imtihon cheklovi (2026-07-31)

- **Brauzer render:** login/ro'yxatdan o'tish formasi to'liq ko'rinadi, 0 konsol
  xato, failed request yo'q (`attestatsiya-five.vercel.app`).
- **To'liq API oqim ishladi:** register (201) → admin confirm → login (200,
  access_token) → `/api/auth/me` → `/api/exam/start` (bolim/M01 → 15 savol,
  1800s) → `/api/exam/submit` (saved:true) → `/api/exam/finish` (breakdown).
  Test foydalanuvchilari tozalandi.
- **Ma'lum cheklov — mock imtihon (`kind=mock`) 503 `INSUFFICIENT_POOL`:
  "Savollar bazasi yetarli emas"** — Dashboard'dagi "Sinov imtihoni — 50 savol ·
  120 daqiqa" tugmasi shu yo'lni ishlatadi. Ildiz sabab: blueprint 50 savolni
  13+ guruh bo'yicha (`S1.INFO`, `S2.HW`, `S2.OFFICE`, `S3.LOGIC`, `S3.NUM`,
  `S3.ALGO`, `S4.BLOCK` …) `bilish`/`qollash`/`mulohaza` taqsimoti bilan talab
  qiladi; DB'da esa faqat M01 kontenti (`S1.INFO`, 400 savol, hammasi `bilish`)
  bor, boshqa guruhlarda 0–1 savol. Qaror (foydalanuvchi): **hozircha
  qoldiriladi** — keyingi modullar (M02–M16) kontenti import qilinganda mock
  imtihon ishlay boshlaydi. Agar oldinroq kerak bo'lsa: (a) blueprint
  quota'larini mavjud kontentga moslash (migration + ADR) yoki (b) `start_exam`
  RPC'sida mock uchun qat'iy 50-savol shartini yumshatish (kod + migration +
  testlar).

## Ochiq masalalar — M01 kontenti

- M01.01 (appendix) ga savol biriktirilmagan: `generate_topic_test` da
  `savol_yoq` xatosi qaytadi, UI buni "Bu mavzu uchun savollar mavjud emas"
  deb ko'rsatadi. Boshqa 11 mavzuda `source_lesson_id` orqali savol pool'i
  mavjud (M01.02 → 60).
- `scripts/` da eski (endi yo'q bo'lgan `chapters/` papkasiga tayangan)
  m01 pipeline qoldiqlari bor: `rebuild_m01*.py`, `fix_m01_content.py`,
  `generate_m01.py`, `clean_m01.py`, `audit_m01.py`, `m01_*.txt`,
  `m01_content.json`. Ular hech qayerdan chaqirilmaydi.
- Frontend `tsc` da pre-existing admin sahifa xatolari qolmoqda (66 ta,
  eski `QuestionFormModal/ModulesPage/QuestionsPage/SourcesPage/SpecsPage`
  schema nomlaridan) — T-017/T-018 ga tegishli emas.

## Environment holati

| Muhit | URL | Database | Holat |
|-------|-----|----------|-------|
| Local frontend | `http://localhost:3000` (vite) | Remote Supabase (plyqezulrfowyblsfpzy) | M01 12 dars + 400 savol DB'da; dars testi 20 random/shuffle |
| Local backend | `http://localhost:3001` (`~/Desktop/attestatsiya/backend`) | Remote Supabase | Alohida repo: `sarvar9417/attestatsiya-backend`; /api/admin/attempts faol |
| Production (frontend) | https://attestatsiya-five.vercel.app | Remote Supabase | Deploy; login forma ishlaydi, qora ekran yo'q |
| Production (backend) | https://attestatsiya-backend.vercel.app | Remote Supabase | /api/health healthy; barcha /api/* route'lar Fastify'ga yetib boradi |

## Muhim havolalar

- **Supabase project:** https://supabase.com/dashboard/project/plyqezulrfowyblsfpzy
- **DB connection:** secret manager yoki lokal `.env` orqali boshqariladi
- **Service Role Token:** repoda saqlanmaydi; Supabase secret manager orqali boshqariladi
- **files/ spec:** `files/00-README.md` dan boshlanadi


## Blueprint strip (T-026, 2026-10-07)

- Dashboardga 2026 rasmiy baholash blueprintining 15 guruhli proportional strip komponenti qo‘shilmoqda.
- Segment kengliklari `BLUEPRINT_GROUPS.questionCount` dan olinadi; hardcoded alohida nusxa yo‘q.
- Acceptance nisbat: `3:2:5:3:2:3:3:3:2:5:2:2:5:7:3`, jami 50 savol.
- Section legend: mutaxassislik 35, kasb standarti 5, pedagogika 7, metodika 3.
- Test: segment soni, flexGrow, nisbat va jami savol invariantlari tekshirildi; secret scan, lint, typecheck, unit, generated-pool invariantlari, build, Playwright E2E va database job yashil.


```text
Task: T-026
Natija: 2026 Blueprint strip dashboardga qo‘shildi va rasmiy 15-guruh nisbatida render qilinadi
O‘zgargan fayllar: src/components/dashboard/BlueprintStrip.tsx; src/pages/DashboardPage.tsx; src/tests/BlueprintStrip.test.tsx; TASKS.md; PROJECT_STATE.md
Migratsiyalar: yo‘q
Testlar: GitHub CI full green
Qolgan blocker: T-025 remote Supabase migration history permission
```


## Learner natijalar tarixi (T-027, 2026-10-07)

- **Yangi protected route:** `/history`.
- **Real backend data:** sahifa mavjud `GET /api/exam/history?page=&page_size=`
  endpointidan faqat autentifikatsiyalangan learnerning yakunlangan urinishlarini oladi.
- **Frontend kontrakti:** `examHistoryResponseSchema` server javobini strict Zod
  bilan tekshiradi; answer key yoki client-side qayta scoring kiritilmagan.
- **UX:** current-page o‘rtacha natija, o‘tgan urinishlar soni, jami urinishlar,
  loading, empty, API error/retry va 20 talik pagination mavjud.
- **Navigation:** desktop Sidebar va mobile bottom navigation ichiga
  `Natijalar tarixi / Natijalar` qo‘shildi.
- **Test qamrovi:** history sahifa server-data, empty, failure→retry va pagination bilan;
  frontend↔backend integration testi `/api/exam/history` URL va payload kontraktini
  tekshiradi. GitHub CI quality + database to‘liq yashil.
- **T-025 holati:** Supabase connector hozir ham `plyqezulrfowyblsfpzy` projectini
  ko‘rsatmayapti; remote migration history reconciliation bloklanganicha qoladi.

### Handoff

```text
Task: T-027
Natija: server-backed learner Natijalar tarixi UI tayyor
Route: /history
Data source: GET /api/exam/history?page=&page_size=
O‘zgargan asosiy fayllar: contracts.ts; examGateway.ts; backendGateway.ts; ExamHistoryPage.tsx; App.tsx; Sidebar.tsx; MobileBottomNav.tsx; ExamHistoryPage.test.tsx; apiIntegration.test.ts
Migratsiyalar: yo‘q
Qolgan blocker: T-025 remote Supabase migration history permission
```


## Monorepo konsolidatsiyasi (T-028, 2026-10-07)

- **Source-of-truth:** `sarvar9417/attestatsiya` endi frontend, Fastify backend,
  Supabase migrations va loyiha hujjatlarini bitta repositoryda saqlaydi.
- **Tuzilma:** frontend mavjud rootda qoladi; backend to‘liq `backend/` ostiga
  ko‘chirildi. Bu frontend Vercel rootini o‘zgartirmasdan monorepo qilishga imkon beradi.
- **Parity:** eski `sarvar9417/attestatsiya-backend` main branchidagi 46 ta
  source/config fayl `backend/`ga byte-for-byte mos ko‘chirildi; nested eski GitHub
  workflow ko‘chirilmadi, chunki root CI uning o‘rnini bosadi.
- **CI:** root workflowga alohida `backend` job qo‘shildi: `npm ci`,
  secret scan, server typecheck, Vercel API-entry typecheck va unit testlar.
- **Local workflow:** root package scriptlari orqali `npm run dev:backend` va
  `npm run check:backend` qo‘shildi.
- **Deploy:** frontend Vercel loyihasi o‘zgarishsiz. Backend production
  `attestatsiya-backend` Vercel projectiga monorepo `main` commit
  `c46437fa6d5e72d6bdd8e638c264e7fcb6fe8ffe` dan `backend/` root bilan
  production deploy qilindi va READY holatiga keldi; custom alias
  `attestatsiya-backend.vercel.app` saqlandi.
- **Legacy repo:** `sarvar9417/attestatsiya-backend` tarixiy/rollback fallback sifatida
  vaqtincha qoladi; yangi backend featurelar monorepodagi `backend/`da qilinadi.
- **Vercel Git integration cheklovi:** production deploy monorepodan bajarildi, ammo
  Vercel MCP mavjud `attestatsiya-backend` projectining Git linkini boshqa repoga
  qayta ulash operatsiyasini bermaydi. Project hali eski repo bilan Git-linked;
  monorepo backend o‘zgarishlari hozircha explicit Vercel deployment orqali chiqariladi
  yoki Vercel dashboardda Git repo `sarvar9417/attestatsiya`, Root Directory `backend`
  qilib bir marta relink qilinadi.


### T-028 Handoff

```text
Task: T-028
Natija: frontend + backend + Supabase artefaktlari bitta sarvar9417/attestatsiya monorepoda
Backend path: backend/
Production backend deploy: READY, source sarvar9417/attestatsiya@c46437f, root backend/
GitHub CI: frontend quality + backend quality + database — yashil
Migratsiyalar: yo‘q
Qolgan operatsion cheklov: Vercel backend project Git linki dashboard/MCP orqali eski repo'dan monorepoga avtomatik relink qilinmadi
Keyingi backend source-of-truth: sarvar9417/attestatsiya/backend
```


## Figma exam shell parity (T-029, 2026-10-07)

- **Maqsad:** oldingi Figma/chat tasdiqlangan test ekraniga faol `ExamRunner`
  shellini yaqinlashtirish; scoring, timer va answer lifecycle biznes qoidalarini
  o‘zgartirmaslik.
- **Design basis:** saqlangan `Dual-Theme Attestatsiya Test Interface` referensi
  bo‘yicha asosiy savol chapda, nomzod ma’lumoti + vaqt + savollar navigatsiyasi
  o‘ngda, 10 ustunli number grid va answered/current/flagged/unanswered legend.
- **Figma MCP:** Academik Starter workspace uchun joriy tool-call limiti tugagan;
  shu sabab yangi live node read qilinmadi. Ish avval tasdiqlangan Figma yo‘nalishi,
  saqlangan reference va mavjud TASK-UI-004 behavior contractiga tayangan.
- **Xavfsizlik:** mavjud auth’da yo‘q `guruh` kabi ma’lumotlar uydirilmaydi;
  nomzod kartasi faqat display name/email/id va fan kabi real platforma
  ma’lumotlarini ko‘rsatadi.
- **Behavior boundary:** answer hali ham explicit `Javobni saqlash` orqali
  serverga yuboriladi; flag scoring payloadiga kirmaydi; timer va final score
  server-authoritative qoladi.
- **Route shell:** `/exam/*` global learner sidebar/mobile bottom navdan ajratilib,
  sinov vaqtida immersive layout ishlatadi.
- **Test natijasi:** frontend secret scan, lint, TypeScript, 297 unit test,
  generated-content invariantlari, production build va Playwright E2E yashil;
  backend va database CI joblari ham yashil.
- **Regression:** eski `Sinovni yakunlash` accessibility contracti saqlandi;
  Figma ko‘rinishida tugma matni `Testni yakunlash`, ammo mavjud test/assistive
  contract buzilmadi.

### T-029 Handoff

```text
Task: T-029
Natija: Figma approved immersive exam shell parity
O‘zgargan fayllar: src/App.tsx; src/features/exam/ExamRunner.tsx; src/index.css; src/tests/MockExamFlags.test.tsx; src/tests/e2e/exam-product-flow.spec.ts; TASKS.md; PROJECT_STATE.md
Migratsiyalar: yo‘q
Testlar: GitHub CI quality + backend + database — yashil
Behavior: explicit answer submit, server timer/scoring, local review flag semantikasi saqlandi
Figma live read: Starter tool limit sabab bloklangan; saved approved reference + prior screen contract ishlatildi
Keyingi tavsiya: Natija/Xatolar ekranlarining Figma parity auditini davom ettirish
```


## Post-exam learner flow (T-030, 2026-10-07)

- **Reja manbasi:** oldingi chatlarda tasdiqlangan Figma oqimi
  `Mock Test → Natija → Xatolar` va `UX_SPEC.md` Result/Errors talablari.
- **Figma holati:** `WkjyxZbrAGkolxjYop7VrS` file live o‘qilishi Starter MCP
  call limit sabab bloklangan; shu task mavjud tasdiqlangan visual system,
  T-029 exam shell va repositorydagi UX specdan chetga chiqmaydi.
- **Natija → action:** finalized natija ekranida `Xatolarni qayta ishlash` va
  `Natijalar tarixi` yo‘llari ko‘rsatiladi.
- **Item review:** `Tahlilni ochish` learnerning joriy finalized exam idsi bilan
  `getReview(exam_id)`ni chaqiradi. Savol holati, construct, stem va explanation
  serverdan keladi; review exam tugashidan oldin yuklanmaydi.
- **Xavfsizlik:** client scoring qayta hisoblanmaydi; answer key browserga exam
  tugashidan oldin chiqarilmaydi; mavjud explicit submit va server finish semantikasi
  o‘zgarmadi.
- **Ataylab qo‘shilmagan:** UX specdagi vaqt, 4 section, 16 module va cognitive
  kesimlari joriy finish kontraktida yo‘q, shuning uchun UI’da uydirilmagan.


### T-030 Handoff

```text
Task: T-030
Natija: finalized Natija → savollar tahlili → Xatolar/Natijalar tarixi learner oqimi
O‘zgargan fayllar: src/features/exam/ExamRunner.tsx; src/tests/ExamResultDecision.test.tsx; TASKS.md; PROJECT_STATE.md
API: mavjud GET /api/exam/:id/review, /api/exam/history, /api/exam/due-reviews
Migratsiyalar: yo‘q
Testlar: GitHub CI quality + backend + database — yashil
Xavfsizlik: review faqat finalized result ekranidan; scoring va answer submit server-authoritative
Figma: live read Starter MCP limit sabab bloklangan; approved file/chat flow + UX_SPEC.md ishlatildi
Keyingi UI yo‘nalish: real backend kontraktini kengaytirmasdan uydirma readiness/section/module/cognitive metrikalarini ko‘rsatmaslik
```


## Persistent learner result (T-031, 2026-10-07)

- **Plan basis:** `UX_SPEC.md` dagi `/results/[sessionId]` route va
  oldingi Figma/chat `Natija → Xatolar` oqimi.
- **Backend:** `GET /api/exam/:id/result` faqat autentifikatsiyalangan learnerning
  o‘z finalized attemptini qaytaradi. Query `id` + `user_id` bilan explicit
  filterlanadi va RLS ham faol qoladi; boshqa learner attempti 404 sifatida yashiriladi.
- **Frontend:** protected `/results/:examId` sahifasi serverdagi score, passed,
  lesson metadata va mavjud group breakdownni ko‘rsatadi.
- **History continuity:** `/history` kartalari persistent result detailga bog‘landi.
- **Review boundary:** answer/explanation `getReview(examId)` orqali faqat
  foydalanuvchi finalized result sahifasida `Tahlilni ochish`ni bosganda olinadi.
- **No fabricated analytics:** vaqt sarfi, 4 section, 16 module, cognitive va
  weakest-objective ko‘rsatkichlari joriy server kontraktida yo‘q; UI’da uydirilmaydi.
- **Figma live access:** Starter MCP limit hali faol; mavjud approved visual system
  va repository UX contract source-of-truth sifatida ishlatilmoqda.


### T-031 Handoff

```text
Task: T-031
Natija: persistent /results/:examId learner natija sahifasi va secure single-result API
Backend: GET /api/exam/:id/result; id + authenticated user_id filter; finalized-only
Frontend: ExamResultPage; history → result detail; lazy finalized review
O‘zgargan asosiy fayllar: backend/src/services/exam.service.ts; backend/src/routes/exam.ts; backend/src/schemas/exam.ts; src/features/exam/contracts.ts; examGateway.ts; backendGateway.ts; src/pages/ExamResultPage.tsx; ExamHistoryPage.tsx; App.tsx
Migratsiyalar: yo‘q
Testlar: backend service/route guard; frontend result page; history navigation; API integration
GitHub CI: quality + backend + database — yashil
Xavfsizlik: boshqa learner resulti 404; unfinished result 400; answer key faqat finalized review endpointda
```


## Xatolar → qayta tekshirish oqimi (T-032, 2026-10-07)

- **Reja manbasi:** Figma/chat oqimidagi `Natija → Xatolar` bosqichi va
  `UX_SPEC.md` tamoyili: “Xato jazolash emas, keyingi o‘rganish actioniga aylantiriladi”.
- **Aniqlangan regressiya:** `ExamPage` faqat `mock/bolim/mavzu` kindlarini
  tan olgani uchun `/exam/takrorlash` va `/exam/zaif` yashirin ravishda
  mock examga fallback qilardi.
- **Yechim:** `ExamRunner` va gateway server qo‘llaydigan `takrorlash/zaif`
  kindlarini explicit qo‘llaydi; due-review sahifasida real
  `/exam/takrorlash` CTA mavjud.
- **Xavfsizlik:** review queue clientda savol yoki answer-key qurmaydi; yangi session
  mavjud `POST /api/exam/start { kind: 'takrorlash' }` orqali serverda yaratiladi.
- **Figma live MCP:** Academik Starter plan tool-call limiti hali faol; yangi node
  read qilib bo‘lmadi. Ish oldin tasdiqlangan visual system va repository UX contractiga
  tayangan.


### T-032 Handoff

```text
Task: T-032
Natija: /review → /exam/takrorlash real server-selected retest oqimi
Backend contract: POST /api/exam/start { kind: "takrorlash" | "zaif" }
Frontend: takrorlash/zaif explicit route; mock fallback yo‘q; backUrl=/review
Testlar: ReviewPage CTA, ExamPage focused-kind, API integration
GitHub CI #587: quality + backend + database — SUCCESS
Merge: PR #53, main commit 647fd36351234e3ae980e54b7a61bdf4a7c375b3
Migratsiyalar: yo‘q
Keyingi bajarilmagan blok: onboarding + diagnostika + daily plan
```


## Onboarding + diagnostika (T-033, 2026-10-07)

- **Plan basis:** UX_SPEC Onboarding va PRODUCT_REQUIREMENTS J-01: ism, imtihon
  sanasi (noma'lum mumkin), kunlik 10/20/30/45/60 daqiqa va diagnostika taklifi.
- **DB migration:** `20261007131000_onboarding_profile.sql` profile'ga
  `timezone`, `locale`, `exam_date`, `daily_goal_minutes`,
  `onboarding_completed_at`, `updated_at` qo'shadi; daily goal 5–240 DB
  constraint bilan himoyalanadi.
- **Backend:** `GET/PATCH /api/auth/onboarding`; o'tgan exam_date rad qilinadi.
  Remote schema hali eski bo'lsa GET `available=false` fail-open qaytaradi,
  PATCH esa `ONBOARDING_SCHEMA_PENDING` 503 qaytaradi.
- **Frontend:** standalone `/onboarding` ekran, learner-only OnboardingGate,
  diagnostikani boshlash yoki skip qilish. Admin/editor guarddan o'tadi.
- **Diagnostika:** mavjud DB `start_exam('diagnostika')` RPC'iga frontend/backend
  route support qo'shildi; mock examga yashirin fallback yo'q.
- **Remote blocker:** Supabase connector `plyqezulrfowyblsfpzy` projectini hali
  ko'rsatmaydi. Shu sabab migration productionga bu branchda qo'llanmaydi;
  feature schema mavjud bo'lmaguncha production oqimini bloklamaydi.


### T-033 Handoff

```text
Task: T-033
Kod holati: MERGED
Merge: PR #55, main commit c7770361738d9e6f65f8a6a80d1178e2268c126b
CI: GitHub Actions #630 — quality + backend + database SUCCESS
Frontend: /onboarding + learner OnboardingGate + /exam/diagnostika
Backend: GET/PATCH /api/auth/onboarding; diagnostika start accepted
Migration: supabase/migrations/20261007131000_onboarding_profile.sql
Production migration: YO‘Q
Status: BLOCKED faqat remote activation bo‘yicha
Blocker: Supabase connector plyqezulrfowyblsfpzy projectini hali ko‘rsatmaydi
Safety: schema yo‘q bo‘lsa GET available=false compatibility holati; majburiy gate oddiy network/server xatosida fail-closed
Parallel keyingi ish: mastery/SRS/adaptive foundation remote schema activationdan mustaqil ravishda migration+CI sifatida tayyorlanishi mumkin
```


## Mastery/SRS foundation (T-034, 2026-10-07)

- **Plan basis:** PRODUCT_REQUIREMENTS FR-MASTERY: independent evidence, cognitive
  natijalarni alohida yuritish, explicit mastery status va 1/3/7/14/30 review.
- **Schema:** `mastery_status`, `mastery_evidence_kind`,
  append-only `mastery_evidence`; `user_construct_stats`ga review stage,
  evidence counters va bilish/qollash/mulohaza counterlari qo‘shildi.
- **Scheduler v1:** to‘g‘ri mustaqil evidence review stage'ni 1→5 oshiradi va
  1/3/7/14/30 kunlik due interval beradi. Stage 2–4 provisional, stage 5 stable.
  Provisional/stable'dan xato javob regressed holatiga tushiradi.
- **Evidence boundary:** accepted first answer `exam_items` transition triggeri orqali
  aynan bir append-only evidence yaratadi; idempotent retry duplicate evidence
  yaratmaydi. Learner Data API orqali evidence insert/update/delete qila olmaydi.
- **Cognitive:** bilish/qollash/mulohaza attempts/correct alohida saqlanadi.
- **Read model:** authenticated `GET /api/progress/mastery` answer key yoki
  full question matnini qaytarmasdan construct status, accuracy, SRS stage va
  cognitive countersni beradi.
- **Remote:** mastery/SRS migration production `plyqezulrfowyblsfpzy` Supabase’ga apply qilindi va remote schema audit bilan tasdiqlandi.


### T-034 Handoff

```text
Task: T-034
Natija: mastery evidence + 1/3/7/14/30 SRS foundation va authenticated mastery read model
Migration: supabase/migrations/20261007184500_mastery_srs_foundation.sql
Backend: GET /api/progress/mastery
Frontend: progressGateway.getMastery()
Security: evidence learner uchun read-only; first-answer idempotency duplicate evidence yaratmaydi
CI: GitHub Actions #655 — quality + backend + database SUCCESS
Merge: PR #57, main commit bc2fca87b9600c18293f87a647054486263f813c
Remote apply: HA; production schema audit yashil
Keyingi non-blocked task: adaptive selector + readiness/next-action service
```


## Blueprint-weighted readiness + next action (T-035, 2026-10-07)

- **Plan basis:** UX_SPEC Dashboard va PRODUCT_REQUIREMENTS FR-AN-05:
  readiness blueprint vaznida taxminiy ko‘rsatkich bo‘lishi kerak; “50/50 kafolat”
  yozilmaydi.
- **Readiness v1:** faqat `mastery_evidence.evidence_kind=independent` evidence
  ishlatiladi. Har blueprint group accuracy o‘z `question_count` vazniga ega.
  Evidence yo‘q group score'ga 0 sifatida qo‘shilmaydi — alohida coverage va
  confidence orqali ko‘rsatiladi.
- **Confidence heuristic v1:** insufficient <10 independent yoki <20% coverage;
  low <50 yoki <50%; medium <200 yoki <80%; high >=200 va >=80%.
  Bu rasmiy attestatsiya kafolati emas, versioned product heuristic.
- **Next action priority:** due review → regressed construct → diagnostika
  (insufficient evidence) → learning.
- **Backend:** authenticated `GET /api/progress/readiness`; service-role
  query'lari explicit user_id filter bilan. Answer key yoki full prompt yo‘q.
- **Compatibility:** T-034 remote schema hali productionga apply qilinmagan bo‘lsa
  endpoint fake score bermaydi; `available=false`,
  `unavailable_reason=mastery_schema_pending` qaytaradi.
- **Dashboard:** eski local completion percent “TAYYORLIK” sifatida ko‘rsatilmaydi;
  server readiness, confidence, independent evidence va blueprint coverage
  ko‘rsatiladi; server tavsiya qilgan next action Bugungi reja CTA'iga ulanadi.


### T-035 Handoff

```text
Task: T-035
Natija: blueprint-weighted readiness + confidence/coverage + server next-action
Backend: GET /api/progress/readiness
Frontend: progressGateway.getReadiness(), DashboardPage evidence-based readiness card
Heuristic: confidence only; official attestatsiya score/guarantee emas
CI: GitHub Actions #678 — quality + backend + database SUCCESS
Merge: PR #59, main commit ef84655a3b8f1cc755733173d636b60ffdd8739c
Remote activation dependency: RESOLVED — T-034 mastery schema productionda mavjud
Keyingi non-blocked task: adaptive practice selector (weak + due + new) va revision-repeat himoyasi
```


## Production Supabase reconciliation (T-037, 2026-10-08)

- `plyqezulrfowyblsfpzy` project remote auditda healthy.
- Productionga atomik apply qilindi:
  `20261007000018_question_keys_staff_only`,
  `20261007052732_parametric_generated_questions`,
  `20261007131000_onboarding_profile`,
  `20261007184500_mastery_srs_foundation`.
- Verifikatsiya: generated questions = 270; onboarding profile mavjud;
  mastery status + `mastery_evidence` mavjud; learner-readable eski
  `question_keys_readable` policy yo‘q.
- Production backend health audit: database healthy.
- Remote tarixda oldindan mavjud `20260801000018 exam_batch_finish` migrationi
  tegilmay saqlandi; source reconciliation alohida task.


## Single Vercel application (T-038, 2026-10-08)

- **Talab:** Git monorepo kabi production deploy ham bitta project bo‘lishi shart.
- **Target:** mavjud `attestatsiya` Vercel project.
  Frontend `/`, Fastify backend `/api/*`.
- **Entry:** root `api/[...all].ts` → `backend/src/app.ts`.
- **Frontend API:** productionda `VITE_API_BASE_URL`siz same-origin `/api/*`;
  lokal developmentda default `http://localhost:3001`.
- **Build:** root Vercel install frontend va `backend/` dependenciesni o‘rnatadi;
  Vite output `dist/`, API serverless function shu projectda build qilinadi.
- **Secret boundary:** `SUPABASE_SERVICE_KEY` yagona Vercel projectda faqat
  server runtime env; client bundle VITE-prefixed secret olmaydi.
- **Cutover:** production deploy `dpl_GYeUVSG7eStpAPrEoghAj2y24skf` READY.
  `https://attestatsiya-five.vercel.app` HTTP 200; shu origin ichidagi
  `/api/health` HTTP 200 va database healthy; `/api/content/modules` HTTP 200.
  Production JS bundle eski `attestatsiya-backend.vercel.app` yoki
  `localhost:3001` URLlarini o‘z ichiga olmaydi va relative `/api/*` ishlatadi.
- **Legacy backend deploy:** `attestatsiya-backend` Vercel project PAUSED;
  uning `/api/health` endpointi `503 DEPLOYMENT_PAUSED` qaytaradi. Source/history
  rollback uchun saqlanadi, production traffic unga bog‘liq emas.


### T-038 Handoff

```text
Task: T-038
Natija: frontend + Fastify backend bitta Vercel project/origin
Git: PR #62 merged, main commit 319f3d1492be8b4a998fb051f634629b2bc307e4
Production project: attestatsiya
Production domain: https://attestatsiya-five.vercel.app
Frontend: /
Backend: /api/*
Production deployment: dpl_GYeUVSG7eStpAPrEoghAj2y24skf — READY
Smoke:
  / -> 200
  /api/health -> 200, database healthy
  /api/content/modules -> 200
Bundle audit:
  attestatsiya-backend.vercel.app -> absent
  http://localhost:3001 -> absent
  relative /api/* -> present
Legacy Vercel project: attestatsiya-backend -> PAUSED
GitHub CI PR #62: quality + backend + database SUCCESS
```


## Single Vercel cleanup (T-042, 2026-10-08)

- **Maqsad:** T-038 production cutoverni repository va CI darajasida yakuniy qilish.
- **Standalone config removed:** `backend/vercel.json` olib tashlandi; backendni
  tasodifan ikkinchi Vercel project sifatida deploy qilish yo‘li yopildi.
- **Unified entry checked:** `backend/tsconfig.api.json` endi root
  `api/[...all].ts` entryni ham typecheck qiladi.
- **Frontend regression:** `resolveApiBaseUrl` testlari productionda explicit
  override yo‘q bo‘lsa same-origin `/api/*`, lokalda esa `localhost:3001`
  ishlatilishini lock qiladi.
- **Docs:** `backend/README.md` production backend domenini alohida project
  sifatida ko‘rsatmaydi; yagona production origin `attestatsiya-five.vercel.app`.
- **Runtime:** eski `attestatsiya-backend` Vercel project allaqachon PAUSED;
  uning endpointi 503 `DEPLOYMENT_PAUSED`. Yagona app `/api/health` esa 200.
- **Permanent deletion:** Vercel project deletion platformda foydalanuvchi
  tasdig‘ini talab qiladi; code/runtime cutover deletiondan mustaqil yakunlangan.


### T-042 Handoff

```text
Task: T-042
Natija: bitta Vercel project arxitekturasi repo/CI darajasida qat'iylashtirildi
Production project: attestatsiya
Origin: https://attestatsiya-five.vercel.app
Frontend: /
Backend: /api/*
Removed: backend/vercel.json
CI: GitHub Actions #792 — quality + backend + database SUCCESS
Old Vercel project: attestatsiya-backend PAUSED; permanent delete Vercel user confirmation talab qiladi
```


## Content coverage reconciliation (TASK-055–TASK-057, 2026-10-11)

- **TASK-055 / PR #82:** M10/M11 source-backed content added and merged.
  S5.WEB.01–06 now have published lessons for graphics, raster/vector editing,
  Paint/Photoshop, HTML text/list/image/table/form, and CSS.
- **TASK-056 / PR #84:** M12/M13 source-backed content added and merged.
  S6.NET.01–05 and S7.SEC.01–06 now have published lessons for networks,
  topology, IP/mask, safe internet/search, security, phishing/malware,
  antivirus, e-government/e-signature, SMM/CMS/LMS/MOOC and Web-Freelance.
- **TASK-057 / PR #85:** database CI now executes all source-backed lesson
  regression files and a global official-construct coverage invariant.
  The first run exposed a real gap at `S1.INFO.06`; a dedicated
  source-backed “Axborot uzatish tezligi” lesson was added.
  Fresh PostgreSQL CI then verified **76/76 active constructs covered**.
- **CI state:** PR #82, #84 and #85 completed GitHub quality/backend/database
  checks successfully before merge. The coverage invariant is now permanent
  regression protection.

### Remaining external/product work

1. **Auth production acceptance (PR #81):** code CI and Vercel preview are green,
   but production Supabase redirect allowlist, SMTP/email template delivery and
   a real-email end-to-end flow must pass before merge:
   register → verify email → login → forgot password → reset password → login.
2. **Production DB activation:** the current Supabase connector does not expose
   the Attestatsiya production project `plyqezulrfowyblsfpzy`; therefore newly
   merged content migrations cannot be safely applied through the available
   connector session.
3. **Question-bank breadth:** the official/mock assemblers and coverage tooling
   exist, but real published question sufficiency outside M01 and the existing
   270 parametric pool must be audited against every blueprint group × cognitive
   quota before claiming full production mock readiness.


## Practical lesson depth upgrade (TASK-061, 2026-10-11)

- 76/76 structural coverage’dan keyingi pedagogik audit bo‘yicha applied constructlar chuqurlashtirildi.
- M10 Paint/Photoshop: crop/resize/layer/transform vaziyatli workflow.
- M11 HTML/CSS: real code fragmentlari, table/form controls, selector/property/value va external stylesheet tahlili.
- M12 IP/maska: bitwise AND bilan /26 worked example va ikki mustaqil network-address masalasi.
- M13 security/freelance: threat-mechanism scenario matrix va profile→portfolio→buyurtma→delivery ish oqimi.
- Database regressiya 7 ta lesson markerini, HTML/CSS code blocks, IP calculation va freelance workflowni majburiy tekshiradi.


## TASK-211 — M13 AXR 7 bob / 210 test, review import (2026-10-18)

- **Branch:** `task/TASK-211-m13-axr-review-import`, **Draft PR:** #145 (main/production unchanged).
- **Staged source:** `docs/content/m13_axr_2026_lessons.json` (7 theory chapters), `docs/content/m13_axr_2026_questions.json` (210 items, 30/chapter), `supabase/migrations/20261019010000_task211_m13_axr_review_content.sql`.
- **DB:** 7 new lessons + 210 questions in `review` only. No overwrite of existing published M13 lessons, keys/options/attempts; answer keys stay in `question_keys`.
- **Constructs:** chapters 1/2/3/4/5+6/7 → S7.SEC.01/.02/.03/.04/.05/.06.
- **Format caveat:** source marks 7 Y2 + 7 Y3 but all 14 are Y1 multiple-choice combinations; DB format is Y1 until true native interaction is separately authored. `source_reference` preserves original kind.
- **Regression:** new `task211_m13_axr_review_contract.test.sql`, plus exact review-corpus exemption to TASK-064 M13 canonical drift check while published drift remains rejected.
- **Incomplete:** human source/key editorial review, local disposable PostgreSQL migration QA, frontend reader/resolver navigation/topic-preflight E2E, future expert-approved publication; merge, live Supabase migration and Vercel production deploy require separate user signoff.


### TASK-211 merge/import handoff — 2026-10-18

- **GitHub:** PR #145 merged into main (squash SHA `dde444fbb7e3a9acc07bae9663f5dede3e353d4c`). Rebased CI quality/backend/database all successful.
- **Supabase:** project `plyqezulrfowyblsfpzy`, applied `20261018130412_task211_m13_axr_review_content_20261019`.
- **Production read-only audit:** 7/7 new review lessons; 210/210 review questions; each chapter 30; 840 options; 210 keys; 210 correct lesson associations; 0 missing/invalid keys. Pre-existing 60 published S7.SEC questions remained.
- **Release gate OPEN:** new lessons and questions are `review`, NOT visible to learners. Require expert signoff, promotion in a separate version-safe migration, topic-test preflight, API scoring and UI smoke test. Do not treat merge/import as publication approval.

## TASK-212 — pedagogika yagona o‘quv sahifasi va manba auditi (2026-10-18)

- **Owner:** ChatGPT assistenti (foydalanuvchining shu suhbatdagi tasdig‘i bilan); branch: task/TASK-212-pedagogy-learning-hub-audit-20261018; DRAFT PR #149.
- **Ish turi:** frontend landing/navigatsiya va mavjud manbalarning audit reyestri; backend, production DB va published kontent o‘zgartirilmaydi.
- **Bajarildi:** 18 kanonik M14/M15/M16 mavzu keltirilgan hub, manba va sinov havolalari, Vitest regressiyalar; M16.02dagi manbasi tasdiqlanmagan 70% kompyuter-vaqti me’yori chiqarildi.
- **Holat:** IN_PROGRESS; QA (exact head SHA), 18/18 nazariya-source-validity, professional savollar editorial review, mobile live smoke, production quota/security parity va yangi release ruxsati OCHIQ.
- **Cheklov:** PEDAGOGY_RELEASE_FREEZE saqlanadi; no merge / no production deployment. Detallar: docs/TASK212_PEDAGOGY_UNIFIED_READINESS_AUDIT_20261018.md.

## TASK-212 — 2026-10-18 production read-only update

- Supabase ACTIVE_HEALTHY project: attestatsiya100%; only SELECT queries performed.
- KS: 114 published/keyed + 26 review/keyed; PM.GEN 233 published; PM.MET 77 published; professional total 424 published / 26 review.
- M14 7 canonical lessons each 20-question target, published-keyed source deficits [3,3,2,6,4,4,4] = 26; 26 review items have mechanical structure/key-reference/source/explanation/length flags all zero, but no semantic approval.
- 18 official competence map (2-jadval, physical pp. 6–7), null pass verdict fix, textual source caution corrections and regression tests staged in DRAFT PR #149.
- CI must be reverified against final SHA. Main advanced after branch creation; future rebase/conflict and production parity review required.
- **DO NOT MERGE/DEPLOY**; user approval, editorial expert review, authenticated E2E and release checklist remain OPEN.


## TASK-247 — barnoyevak ZIP source intake (2026-10-19)

- **Owner:** ChatGPT assistenti (foydalanuvchining 2026-10-19 tasdig‘i), **branch:** `task/TASK-247-pedagogy-source-intake-20261019`.
- **Source:** barnoyevak Drive `attestatsiya/ChatExport_2026-10-19.zip` = 546831018 bayt; ZIPning o‘zi 413/268435456-byte limitga tushdi. Ammo extracted `ChatExport_2026-10-19/files` katalogida hozircha **104 fayl (59 PDF, 5 DOCX, 37 JPG, 1 PNG, 1 OGG, 1 MP3)** ko‘rinadi. Xoliqov, kasb standarti, Mirzayeva va Qodirova/Pulatova PDFlari matni ochildi; yuklash davom etmoqda, 18/18 betma-bet audit hali tugamagan.
- **Partial:** Barnoyevak `pedagogika/files` ichidagi **59 PDF 59/59 matn fetch (55 success, 4 no-text), 5 DOCX 5/5 read**; 2 shaxsiy reyting PDF va bitta reklama materialini importga yaroqsiz deb belgilash. M14.01–07 uchun kasb standarti matni bilan yangi 7 statik nazariya va published M14da optional jadval/misol, M15.01–08 source-aligned quick notes, **24 Vitest**; 2025 nusxa-dublikatlar aniqlangan. Docs: `docs/TASK247_PDF_SOURCE_INVENTORY_20261019.md`, `docs/TASK247_M14_7_SOURCE_RECONCILIATION_20261019.md`, `docs/TASK247_PEDAGOGY_BARN_SOURCE_INTAKE_20261019.md`.
- **Dependency:** 4 PDFni maxsus PDF/physical-page usulida ochish, 59 ta PDF va 5 DOCXning betma-bet manba/fakt/source-locator ekspertizasi, 18/18 source mapping va tarixiy savollar independent answer-key check. Early CI PASS SHA `913111b54d48b198193be51fb8c9bc094999d741`; latest branch SHA uchun CI va mobile/E2E alohida gate.
- **Release:** feature branch only; main/production DB/Vercel o‘zgarmadi; userning yangi merge/deploy ruxsatisiz release YO‘Q.

## TASK-262 — Yagona kitob nazariya ko‘rinishi (2026-10-19)

- **Owner:** ChatGPT assistenti; **branch:** `task/TASK-262-unified-lesson-book-design-20261019`.
- **Scope:** M01 namunasidagi `BookReader` / `BookBlock`ni barcha nazariy darslar uchun umumlashtirish, ayniqsa M14–M16. Oldingi published lesson / backend / DB / savol banki o‘zgarmaydi.
- **Implemented on branch:** `TopicView` umumiy book mode, `BookReader` sarlavhali hamda legacy adaptive sahifalash, `BookBlock` Markdown jadval va fallback ro‘yxat, regressiya testlari.
- **Status:** IN_PROGRESS / REVIEW ONLY. Local npm suite va real desktop/mobile authenticated acceptance hali verifikatsiya qilinishi shart; release-frozen pedagogika PRiga o‘zboshimchalik bilan qo‘shilmaydi.
- **Release:** main merge, production migratsiya va production deploy YO‘Q. See `docs/TASK262_UNIFIED_LESSON_BOOK_DESIGN_20261019.md`.

## TASK-277 — Informatika va pedagogika nazariyalarini yagona kitobga keltirish (2026-10-19)

- Branch: task/TASK-277-unified-theory-book; **MERGE_AUTHORIZED**.
- Barcha nazariya uchun sourcega bog‘liq bo‘lmagan, blok tartibini saqlovchi
  balanced pagination qo‘shildi (4 blok / 4200 belgi, katta blok kesilmaydi).
- Yangilangan main bilan reconciled: M03.08–M03.10 uchun TASK-289 va
  M15.07–M15.08 uchun TASK-290 dagi chuqurroq kitoblar saqlandi; TASK-277
  endi ularning barchasiga yagona global sahifalash kontraktini beradi.
- M03 test ID/kalitlari saqlandi; M15ga lokal kalit qo‘shilmadi.
- Depth triage: 121 mavzu = 93 brief, 7 partial, 21 substantial candidate.
  Qolgan 93 brief bob ochiq.
- Production visual audit auth bilan bloklandi. Foydalanuvchi mergega ruxsat
  berdi; **deploy va production DB write taqiqlangan**. Batafsil:
  docs/audits/TASK277_UNIFIED_THEORY_BOOK_ROLLOUT_20261019.md.

## TASK-344 — Darsliklarga tayangan yagona to‘liq nazariya korpusi (2026-10-20)

- **Owner:** Codex; **branch:** `task/TASK-344-source-complete-theory-corpus`.
- Foydalanuvchi barcha qisqa nazariyalarni biriktirilgan sinf darsliklari,
  2026 spetsifikatsiya, demo va tarixiy testlar bilan mos, yagona kitob
  shaklida to‘liq boyitishni so‘radi.
- Yakuniy learner-visible audit: **115 topic = 110 chapter + 5 appendix**;
  **110/110 chapter kitob kontraktidan o‘tdi, incomplete 0**. Eski 121-topic
  audit M02 legacy dublikatlarini sanaydi va current learner catalog uchun
  yakuniy haqiqat emas. Yangi `theory:learner:audit` faqat `contentTree`
  ichidagi real learner mavzularini tekshiradi.
- M04.01–06, M06.01–04 va M07.01–06 uchun yangi source-complete kitoblar;
  M02, M08–09, M12.06–09, M13, M14 va M16 uchun source bloklarni saqlovchi
  yagona self-study kitob skeleti; M05 uchun mavjud 9/14/21 sahifali kitobni
  buzmasdan mashq, javob va manba izi qo‘shildi.
- Katta darslik matni so‘zma-so‘z ko‘chirilmaydi: didaktik qayta bayon,
  aniq PDF/printed-page locator, maqsad, kamida oltita bo‘lim, ishlangan
  misol, mustaqil mashq, javob, xato va xulosa kontrakti qo‘llanadi.
- Lokal darvozalar: lint PASS, typecheck PASS, 173 test fayli / 1113 test
  PASS, build va client answer-key scan PASS. Handoff:
  `docs/TASK344_SOURCE_COMPLETE_THEORY_CORPUS.md`.
- **Status:** IMPLEMENTED / REVIEW READY. **Release:** feature branch only.
  Merge, deploy va production DB write alohida foydalanuvchi ruxsatisiz
  taqiqlangan.

## TASK-301 — Mavjud dars kontentini yagona kitobda to‘liq ko‘rsatish

- Owner: Codex; started: 2026-10-19T08:05:00Z. Status: IN_REVIEW / MERGE_AUTHORIZED.
- Branch: `task/TASK-301-restore-complete-lesson-reader`; rebased onto current `main`.
- Scope: shared reader content preservation, M15 existing notes and marked source supplements, renderer/navigation regressions, explicit source-load retry. Recent merged source-ordering work is preserved.
- User authorization: push and merge after green CI. Deployment and database writes remain prohibited.
- TASK-301 validation after final rebase: 141 files / 905 tests passed with 4 workers and 30s timeout; affected 3 files / 58 tests passed. Lint/typecheck/build/bundle scan PASS.
- Local Chromium absent; browser download returned a corrupt archive, so desktop/mobile E2E scenarios are delegated to GitHub CI. No production write. Handoff: `docs/TASK301_COMPLETE_LESSON_READER.md`.
- TASK-301 user authorization, 2026-10-19: push and merge requested explicitly; do not deploy. `vercel.json` has `git.deploymentEnabled: false`; no deploy workflow found. Awaiting exact-head CI before merge.


## TASK-305 M13 imtihon uslubi bo'yicha chuqur QA — 2026-10-20

- Branch `task/TASK-305-m13-attestation-style-quality-audit`, PR #315 **DRAFT**.
- Benchmarks: official 2026 informatika test specification M13 34–35; paid 2026 demo physical p18 q33 (4×5 matching, q34 hosting), 13.04.2026 reported PDF p21/p27/p28 (missing-stage/CMS/multi-statement); historical demo source officiality not presumed.
- Live Supabase read-only snapshot: 414 published M13 = 271 Y1 + 71 Y2 + 72 Y3; 15 archived and 1 review. Published 414 key presence 0 gaps; 1 format-contract P0 (`T063-Y2-022`: all 8 matching options side `a`); proposed revision SQL auto-remaps private keys without exposing answers.
- 350 AXR source items: 49 potentially trivial distractor and 24 correct-answer-length flags among 196 ordinary Y1; 14 paper Y2/Y3 metadata are published as native Y1; 70 native Y2 are 4×4 unlike sampled 4×5 demo.
- 21 **keyless** new source-benchmark original question proposals, no answer/ordering maps in public HEAD, no DB writes. Publication requires source/content review and separately approved private-key workflow.
- **P0 SECURITY:** GitHub repo is public; existing historical M13 JSON/migration files disclose/reconstruct answer keys from source, despite runtime key RLS. New questions should not repeat leakage; remediation requires key migration + versioning, not just deleting tracked files.
- CI/merge/release status: PR branch automated gates pending. Production database and Vercel not changed by TASK-305 as of this entry.
- Full details: `docs/audits/TASK305_M13_ATTESTATSIYA_QUESTION_QUALITY_20261020.md`.


## TASK-306 — M13 4×5 matching pilot, 2026-10-20
- User has explicitly directed continued assistant-led source/exam-style QA without waiting for separate outside human expert. This is **AI-assisted source review**, not a claim of independent human certification.
- Branch `task/TASK-306-m13-matching-4x5-revisions`. Seven old published Y2 stay immutable; seven new reviewed candidates (one per M13 chapter) are inserted in `review` using private DB re-keying, with one sensible surplus right-side distractor each.
- Old public Git answer/key exposure remains **OPEN** issue #323.
- Validation: database 4×5 encrypted-key contract, frontend exam Y2 4-left/5-right completeness and duplicate-right prevention, canonical other revisions intact, full backend+frontend CI.
- Production release NOT yet executed. Full docs: `docs/audits/TASK306_M13_MATCHING_4X5_PILOT.md`.


## TASK-307 — M13 4×5 reviewed revision publication, 2026-10-20
- Branch `task/TASK-307-m13-4x5-release`.
- Scope restricted to TASK-306 7 `review` Y2 revised questions. Following user's instruction, assistant conducts AI-led topical/source/technical QA and proceeds without waiting for another separate human editor, **but no claim of independent human certification**.
- Atomic publication migration promotes seven 4x5 review revisions, archives only their seven published 4x4 versions, keeps immutable options/keys and old attempts; 71 live Y2 and 414 live M13 total required.
- Updates exact old/new logical test census in TASK-213; maintains canonical source integrity; adds TASK-307 regression.
- **Pending:** complete GitHub CI, merge, apply migration to production, verify post-apply 414 (271 Y1,71 Y2,72 Y3) and zero malformed keys.
- No frontend code changes required for 4x5; `src/features/exam/contracts.ts` already permits 4 left/5 right and rejects duplicate/unknown right selections (TASK-306 unit coverage). Live learner E2E after deploy still required.
- Open risk: public Git historical answer exposure issue #323; improving distractor count is not a full secret-bank rotation.


## TASK-220 — M12 audit/main sync, 2026-10-20
- Owner: ChatGPT; status: CODE MERGE READY AFTER GREEN CI / CONTENT RELEASE BLOCKED.
- Original PR #155 conflicts with main; clean-main PR #331 is active: https://github.com/sarvar9417/attestatsiya/pull/331
- M12 10 textbook theory chapters already published in live DB by other workflow; initial 380 source questions: 321 published and 59 review at audit snapshot.
- 20 original exam-style Y1 + 22 separate safer revision candidates = 42 new REVIEW, independently stored without modifying published items/attempts. Targeted audit scope 422.
- 380-ID QA matrix: 35 high risk, 197 medium, 148 low. 22 published high-risk items need expert editorial assessment and version-safe publication if accepted.
- 2025 kuzgi Informatika demo PDF was visually inspected: PDF p11 Q25, /27 mask = 255.255.255.224, 32 total vs 30 usable. docs/TASK220_M12_2025_DEMO_CIDR_SOURCE_Q25.md.
- Original source and six tracked migrations are in PR #331; production DB had already applied them through tracked Supabase apply_migration calls.
- Gate: independent human specialist approval of full M12 source/key/distractor review, final authorized learner checks and release migration still OPEN. Never auto-promote 101 review items or rewrite 321 published snapshots.
## TASK-421 — PedMahoratGuli Telegram tarixidan attestatsiya testlari (2026-10-21)

- **Status:** DONE; owner ChatGPT; branch `task/TASK-421-pedguli-telegram-test-intake`.
- **Source:** Barnoyevak Drive `attestatsiya/pedagogika/result.json`, kanal `Pedmahorat|Guli`, 21 085 xabar; Telegram export read-only olinadi.
- **Gate:** faqat attestatsiya pedagogikasi/kasbiy standart/metodika konstruktiga mos, to‘rt variantli, source locatorli va javobi mustaqil tekshirilgan savol qabul qilinadi. Kalitsiz poll, reklama, shaxsiy ma’lumot, dublikat va noaniq item release qilinmaydi.
- **Result:** 20 591 oddiy xabarning 20 588 tasi xususiy production arxivida; qolgan 3 tasi testga aloqasiz (2 bo‘sh, 1 shaxsiy motivatsion hikoya). 16 ta mustaqil qayta yozilgan Y1 savol 7 konstrukt/7 canonical darsga `review` holatida kiritildi; 16/16 variant, kalit va izoh kontrakti postflightdan o‘tdi.
- **Mutation boundary:** published kontent joyida tahrirlanmadi; yangi savollar migratsiya va DB regressiya bilan; application deploy qilinmadi.

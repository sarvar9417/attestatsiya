# ACCEPTANCE_CRITERIA.md

## 1. Darajalar

- `MVP-BLOCKER`: bajarilmasa release yo‘q.
- `RELEASE-TARGET`: production uchun bajariladi.
- `POST-MVP`: keyingi bosqich.

## 2. Foundation

- AC-FND-01 `MVP-BLOCKER`: Fresh clone documented commandlar bilan ishga tushadi.
- AC-FND-02 `MVP-BLOCKER`: Exact lockfile va Node 24 pin.
- AC-FND-03 `MVP-BLOCKER`: CI lint/type/unit/db/build/E2E smoke green.
- AC-FND-04 `MVP-BLOCKER`: Hech qanday secret repository’da yo‘q.

## 3. Identity va authorization

- AC-AUTH-01 `MVP-BLOCKER`: Register/login/logout/reset ishlaydi.
- AC-AUTH-02 `MVP-BLOCKER`: Learner boshqa user data/session/resultini ko‘ra olmaydi.
- AC-AUTH-03 `MVP-BLOCKER`: User role’ni o‘zi o‘zgartira olmaydi.
- AC-AUTH-04 `MVP-BLOCKER`: Author/reviewer/publisher/admin permission server va RLS’da.
- AC-AUTH-05 `RELEASE-TARGET`: Admin MFA active.

## 4. Curriculum va sources

- AC-CUR-01 `MVP-BLOCKER`: Active specification versioned.
- AC-CUR-02 `MVP-BLOCKER`: 16 module va stable code.
- AC-CUR-03 `MVP-BLOCKER`: Module counts 50ga, cognitive counts 50ga teng.
- AC-CUR-04 `MVP-BLOCKER`: Published lesson/question source reference’siz bo‘lmaydi.
- AC-CUR-05 `MVP-BLOCKER`: Prerequisite cycle bloklanadi.

## 5. Content CMS

- AC-CMS-01 `MVP-BLOCKER`: Lesson Y1/Y2/Y3 authoring.
- AC-CMS-02 `MVP-BLOCKER`: Draft→review→approve→publish.
- AC-CMS-03 `MVP-BLOCKER`: Author o‘z revisionini approve qila olmaydi.
- AC-CMS-04 `MVP-BLOCKER`: Published revision edit/delete qilinmaydi.
- AC-CMS-05 `MVP-BLOCKER`: Revision diff va old attempt tarixiy to‘g‘ri.
- AC-CMS-06 `MVP-BLOCKER`: Import dry-run va draft-only commit.
- AC-CMS-07 `RELEASE-TARGET`: Coverage va duplicate dashboard.

## 6. Learner

- AC-LRN-01 `MVP-BLOCKER`: Onboarding va dashboard.
- AC-LRN-02 `MVP-BLOCKER`: Curriculum, lock state va lesson.
- AC-LRN-03 `MVP-BLOCKER`: Y1/Y2/Y3 mobile va keyboard.
- AC-LRN-04 `MVP-BLOCKER`: Practice feedback first submitdan keyin.
- AC-LRN-05 `MVP-BLOCKER`: Save/offline/conflict holati aniq.
- AC-LRN-06 `MVP-BLOCKER`: Error notebook yangi savol bilan remediation.

## 7. Mastery

- AC-MAS-01 `MVP-BLOCKER`: First independent evidence guided/retry’dan ajraladi.
- AC-MAS-02 `MVP-BLOCKER`: Default threshold `DOMAIN_RULES.md`ga teng.
- AC-MAS-03 `MVP-BLOCKER`: Provisional keyingi node’ni ochadi.
- AC-MAS-04 `MVP-BLOCKER`: 1/3/7/14/30 review.
- AC-MAS-05 `MVP-BLOCKER`: Fail/regression ishlaydi.
- AC-MAS-06 `MVP-BLOCKER`: Calculation version va audit saqlanadi.
- AC-MAS-07 `RELEASE-TARGET`: Readiness confidence/evidence bilan “taxminiy”.

## 8. Mock exam

- AC-EX-01 `MVP-BLOCKER`: Aynan 50 savol.
- AC-EX-02 `MVP-BLOCKER`: M01–M16 countlar exact.
- AC-EX-03 `MVP-BLOCKER`: 8/35/7 exact.
- AC-EX-04 `MVP-BLOCKER`: 120 daqiqa server timer.
- AC-EX-05 `MVP-BLOCKER`: Y1/Y2/Y3 full-credit 2/0.
- AC-EX-06 `MVP-BLOCKER`: Total 100.
- AC-EX-07 `MVP-BLOCKER`: Same seed bir xil assembly.
- AC-EX-08 `MVP-BLOCKER`: Insufficient pool invalid exam yaratmaydi.
- AC-EX-09 `MVP-BLOCKER`: Double submit double score bermaydi.
- AC-EX-10 `MVP-BLOCKER`: Correct answer finalgacha clientga chiqmaydi.
- AC-EX-11 `MVP-BLOCKER`: Timeout auto-finalize.
- AC-EX-12 `RELEASE-TARGET`: 20 audited mock combination.

## 9. Security

- AC-SEC-01 `MVP-BLOCKER`: Barcha public table RLS decision/test.
- AC-SEC-02 `MVP-BLOCKER`: IDOR/role escalation test pass.
- AC-SEC-03 `MVP-BLOCKER`: XSS/import/upload validation.
- AC-SEC-04 `MVP-BLOCKER`: CSP va security headers.
- AC-SEC-05 `MVP-BLOCKER`: Rate limit critical endpoints.
- AC-SEC-06 `MVP-BLOCKER`: Correct-answer leakage E2E.
- AC-SEC-07 `RELEASE-TARGET`: Backup restore rehearsal.

## 10. Accessibility va performance

- AC-UX-01 `MVP-BLOCKER`: Core flow keyboard-only.
- AC-UX-02 `MVP-BLOCKER`: Y2/Y3 non-drag control.
- AC-UX-03 `MVP-BLOCKER`: Automated axe critical violation yo‘q.
- AC-UX-04 `RELEASE-TARGET`: Manual screen-reader smoke.
- AC-PERF-01 `RELEASE-TARGET`: Typical page p75 LCP ≤2.5s.
- AC-PERF-02 `RELEASE-TARGET`: Autosave p95 ≤500ms normal load.
- AC-PERF-03 `RELEASE-TARGET`: 10k bank assembly p95 ≤2s.

## 11. Operations

- AC-OPS-01 `MVP-BLOCKER`: Local/preview/staging/prod config ajralgan.
- AC-OPS-02 `MVP-BLOCKER`: Migration clean reset.
- AC-OPS-03 `MVP-BLOCKER`: Monitoring core failurelarga alert.
- AC-OPS-04 `RELEASE-TARGET`: Daily backup va restore evidence.
- AC-OPS-05 `MVP-BLOCKER`: App/content rollback documented va smoke tested.

## 12. Content release

- AC-CNT-01 `MVP-BLOCKER`: Pilot M01/M05/M08 har biri ≥100 approved savol.
- AC-CNT-02 `RELEASE-TARGET`: M01–M16 required source mavjud.
- AC-CNT-03 `RELEASE-TARGET`: ≥3 000 approved published savol.
- AC-CNT-04 `RELEASE-TARGET`: Har blueprint slot ≥20 candidate.
- AC-CNT-05 `RELEASE-TARGET`: Source coverage 100%.
- AC-CNT-06 `RELEASE-TARGET`: Critical factual/answer error ochiq emas.
- AC-CNT-07 `RELEASE-TARGET`: M14–M16 human pedagogic expert sign-off.

## 13. Demo acceptance script

Release candidate’da reviewer quyidagini bajaradi:

1. Yangi learner yaratadi.
2. Onboarding va diagnostika.
3. M01 lesson va Y1.
4. M05 Y2 yoki hisob.
5. M08 code/Y3.
6. Xato feedback va error notebook.
7. Provisional mastery fixture.
8. Due review.
9. 50 savollik mock.
10. Timer/network refresh.
11. Submit va 100 ball scale result.
12. Author savol yaratadi.
13. Reviewer changes/approve.
14. Publisher publish.
15. Learner yangi revisionni ko‘radi.
16. Eski attempt eski revisionda qoladi.

Har qadam screen recording emas, automated test yoki aniq pass/fail evidence bilan.

## 14. Definition of Done

Feature `DONE`:

- requirement;
- code;
- migration;
- validation;
- permission;
- tests;
- accessibility;
- error/empty/loading;
- observability;
- docs;
- handoff

tegishli qismlari yakunlanganda. “Komponent chizildi” feature tugadi degani emas.

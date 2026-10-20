# TASK-306 — M13 4×5 Y2 sifatli moslashtirish pilot (2026-10-20)

**Scope:** 7 ta M13 bobining har birida 1 ta avval `4×4` bo‘lgan original published matching savolini **yangi `4×5` review revision** sifatida yaratish. Bitta ortiqcha o‘ng variant bor. Oldingi published savollar o‘z holatida qoladi; import bosqichida release/archiving yo‘q.

## Evidence va baholash chegaralari

- `Informatika Testlar spesifikatsiyasi.pdf`, fizik p.6: M13 34–35 savollarining aniq mavzu qamrovi (xavfsizlik, malware/phishing, antivirus, e-hukumat, SMM/CMS/LMS/MOOC, kontent-auditoriya, freelance).
- `Demo 2026 test 10 000 so`mlik.pdf`, fizik p.18, Q33: to‘rtta LMS/platforma bandiga beshta izoh bilan ishlovchi **paper-style matching**. Uning internetdagi sotuvchisi imtihon idorasi emas: faqat *strukturaviy taqqoslash*, officiality claim yo‘q.
- `ICT 11_sinf-2021(1).pdf`, fizik pp.257–260: axborot xavfsizligi maxfiylik/yaxlitlik/mavjudlik va ularning farqi; fizik pp.311+ elektron hukumat bo‘limi.
- `8-sinf informatika (Cambridge +)(1).pdf`, fizik pp.103–106: tarmoq xavfsizligi, zararli dasturlar va zaxiralash.
- NIST CSRC information security glossary — https://csrc.nist.gov/glossary/term/information_security (CIA).
- UNESCO digital education terms / LMS-MOOC: https://unesdoc.unesco.org/ark:/48223/pf0000385723

## Seven concrete review revisions

| BOB | Original source ID | Ortiqcha B-variant | Nega asosiy to‘rtta moslikka kirmaydi |
|---|---|---|---|
| 1, CIA | `AXRN-01-Y2-01` | Foydalanuvchi o‘z shaxsini ikkinchi omil bilan tasdiqlaydi | MFA/authentication jarayoni; CIA uchligi va audit-izining **ta’rifi** emas |
| 2, malware | `AXRN-02-Y2-01` | Fayllarni shifrlab, ochib berish uchun to‘lov talab qilishi mumkin | Ransomware belgisi; virus/worm/trojan/spyware uchun farqlovchi asosiy belgi emas |
| 3, antivirus | `AXRN-03-Y2-01` | Zararli kod signaturalari bazasini eng so‘nggi versiyaga yangilash | Signature update jarayoni; real-time/quick/full scan yoki karantin vazifasi emas |
| 4, e-hukumat | `AXRN-04-Y2-01` | Elektron hujjat muallifining raqamli imzosini tekshirish | Imzo verifikatsiyasi; elektron hukumat/portal/ariza/natija **asosiy ta’riflari** bilan aynan bir xil emas |
| 5, CMS/LMS | `AXRN-05-Y2-01` | Mijozlar bilan munosabatlar va savdo bitimlarini boshqarish tizimi | CRM; SMM/CMS/LMS/MOOCdan boshqa maqsad |
| 6, kontent | `AXRN-06-Y2-01` | Materialning mualliflik huquqi va foydalanish litsenziyasini belgilash | Huquqiy foydalanish sharti; auditoriya/maqsad/format/kanal emas |
| 7, freelance | `AXRN-07-Y2-01` | Buyurtmachi mablag‘ini shart bajarilguncha vositachida saqlash | Escrow xizmati; portfolio/brief/milestone/deadline emas |

**Private key:** public SQL migratsiya yangi `correct` yoki mosliklarni matnda saqlamaydi; eski himoyalangan `question_keys` va `question_options`dan UUIDlarni **PostgreSQL ichida** versiyalab o‘tkazadi. Git tarixidagi oldingi answer-bearing source muammosi alohida issue #323 bo‘lib **ochiq**.

## Security and QA

- New `review` status (7/7), version ref `m13-qc-v2:Y2:AXRN-XX-Y2-01`.
- Four `a` options and five `b` options; exactly four private keyed pairs, no repeats.
- Original 70 published Y2 / answer histories immutable. Regression each pair **semantic text** agrees with original.
- `examItemSchema` allows 4×5; `isAnswerComplete` requires all 4 left mapped with distinct allowed right IDs; excess B is unused.
- Frontend new key does not leak before scoring. Legacy immediate-feedback TopicView uses only static pairs and is *not* authority for the 4×5 native timed-exam flow.
- Source-based validation is assistant-authored, not independent human review. Content should be visually smoke-tested in learner /exam/mavzu before mainline publication.
- **No production write or deploy** in this staging task until CI and source/semantic QA done. Subsequent publication via separate versioned status-migration and atomic archive is required, never in-place edit.

## Acceptance
`supabase/tests/task306_m13_native_4x5_contract.test.sql`, `src/tests/examContracts.test.ts`, existing `task213` and canonical drift; GitHub database/backend/quality green, SQL migration applied to production as **review only**, read-only parity audit afterwards. Reviewer waiver if user confirms platform release; old independent-human editorial signoff is not falsely claimed.


## TASK-306 actual production result, 2026-10-20
- PR #325 merged to main at `6862b9d693fefc4f86229f522f28a2e444e6c5af`.
- Supabase applied migration `task306_m13_seven_native_y2_4x5_review_20261020` successfully.
- Read-only audit confirms 7 review items, all 7 are 4×5, all 7 keys contain exactly 4 protected pair mappings, 0 mismatched keys. Published M13 unchanged: 414 total, 71 native Y2, 72 Y3.
- TASK-307 is separate follow-up versioned release, not performed during TASK-306.

## TASK-307 release approach
- New version `m13-qc-v2:Y2:AXRN-XX-Y2-01` 7 review -> published; corresponding original `m13-axr-native-v1:Y2:AXRN-XX-Y2-01` 7 published -> archived in **same DB transaction**.
- Fails closed on any mismatch of source lesson, construct, original stem, option sides, protected pair mapping, or expected 71 active Y2.
- Old attempt history and old answer keys remain immutable. Old `task213` and `task306` regressions updated for 63 original published Y2 + 7 revised published Y2; 70 logical native AXR Y2 preserved.
- The owner explicitly instructed ongoing assistant-led source/format quality control without waiting for another external human examiner. This is a **scope-specific owner override** of an external editorial sign-off for M13. It is *not* an independent human or official exam certification.
- Answer exposure risk #323 (public Git history) remains open; the new revision does not cure already-public original answers.

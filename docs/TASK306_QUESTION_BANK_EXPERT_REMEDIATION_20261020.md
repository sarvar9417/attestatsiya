# TASK-306 — savollar banki ekspert remediatsiyasi

Sana: 2026-10-20  
Holat: amalga oshirilgan, production postflight PASS, deploy qilinmagan

## Qamrov va mezon

Audit rasmiy 2026 blueprint kontrakti (50 savol, 120 daqiqa, har biri 2 ball,
15 guruh, 8 `bilish` / 35 `qollash` / 7 `mulohaza`), kuzgi 50 savollik demo,
eski attestatsiya Y2 saqlash formati va amaldagi published/review bank asosida
bajarildi. AI tekshiruvi inson ekspert imzosi deb yozilmadi; published matn yoki
kalit joyida tahrirlanmadi.

## Tuzatilgan kamchiliklar

- Kuzgi demo bankidagi yolg‘on bir xil kognitiv tasnif 50 ta immutable revision
  bilan 8/35/7 ga tuzatildi. Asl 50 qator archived, yangi 50 qator `review`da;
  `q53` noto‘g‘ri metodika guruhidan `PM.GEN.08`ga ko‘chirildi.
- Aktiv 8×`side=a` Y2 saqlash nuqsonlari uchun productionda 20 ta native
  4×`a` + 4×`b` review revision yaratildi. Published asl nusxalar tarixiy
  attempt va topic-test mosligi uchun immutable qoldi; rasmiy mock ularni sifat
  gate orqali olmaydi. Review holatidagi eski 8×`a` qator qolmadi.
- `question_quality_findings` va `question_bank_revisions` private, RLS-enabled
  audit jadvallari qo‘shildi. `anon` va `authenticated` rollarida SELECT yo‘q.
- Missing editorial dalil, javob uzunligi orqali kalitni sezdirish va boshqa
  aniqlangan sifat qarzlari admin navbatiga chiqarildi. Production postflightda
  486 high va 5 892 medium ochiq finding qayd etildi; bu sonlar “inson tasdig‘i”
  bilan avtomatik yopilmadi.
- Barcha review savollar uchun universal admin editorial UI/API ochildi.
  Muallif o‘z savolini tekshira olmaydi; publish uchun to‘rtta tekshiruv,
  kamida 20 belgili izoh, mustaqil reviewer va joriy content fingerprint shart.
- Published savollar universal immutable snapshot bilan himoyalandi. Production
  postflight: 5 063 / 5 063 published savol snapshotlangan.
- `official-mock-v4` har to‘rtta candidate oqimida
  `is_question_official_mock_eligible` gate ishlatadi. Gate source, published
  lesson/construct, izoh, native Y1/Y2/Y3 payload va unresolved high/critical
  finding yo‘qligini talab qiladi.
- PostgreSQLning default PUBLIC EXECUTE huquqi qayta yaratilgan ichki editorial
  trigger-funksiyadan append-only hardening migratsiyasi bilan olib tashlandi.

## Production postflight

| Nazorat | Natija |
|---|---:|
| Demo root / archived / terminal review | 50 / 50 / 50 |
| Demo kognitiv taqsimot | 8 / 35 / 7 |
| Native legacy Y2 review revision | 20 |
| Aktiv review 8×`side=a` Y2 | 0 |
| Published immutable snapshot | 5 063 / 5 063 |
| Blueprint non-zero kvota kataklari | 27 |
| Yetishmaydigan kvota kataklari | 0 |
| Eng kichik eligible zaxira | +11 (`S2.HW`, `bilish`) |
| Mock v4 quality-gate chaqiruvi | 4 / 4 |
| Private jadval learner SELECT | 0 |
| Ichki eligibility/trigger learner EXECUTE | 0 |

Qo‘llangan migratsiyalar:

1. `official_mock_v3_diversity_task306_prereq`
2. `task306_question_bank_expert_remediation`
3. `official_mock_v4_quality_gate`
4. `task306_trigger_execute_hardening`

Security advisor TASK-306 obyektlari uchun yangi executable SECURITY DEFINER
ogohlantirishi bermadi. Private audit jadvallarida policy yo‘qligi haqidagi INFO
qayd ataylab deny-all dizaynidir: RLS yoqilgan, learner grantlari bekor qilingan,
faqat `service_role` o‘qiydi. Advisor ko‘rsatgan boshqa eski platforma lintlari
ushbu savol-bank o‘zgarishidan oldin mavjud bo‘lgan va bu release’da
kengaytirilmagan.

## Avtomatik tekshiruvlar

- Frontend lint va TypeScript: PASS.
- Frontend Vitest: 172 fayl, 1 109 test PASS.
- Backend TypeScript/API typecheck: PASS.
- Backend Vitest: 24 fayl, 246 test PASS.
- Fresh PostgreSQL migration/seed/regression, build, generated-content check va
  E2E: GitHub required CI orqali final head uchun majburiy.

## Halol release chegarasi

Tuzatilgan demo va legacy Y2 revisionlari mustaqil inson editorial tekshiruvidan
o‘tmaguncha `review`da qoladi. Tizim ularni published deb ko‘rsatmaydi va rasmiy
mockka kiritmaydi. Bu blok ishlashdagi nuqson emas, balki tasdiqni soxtalashtirmaslik
uchun release xavfsizlik shartidir.

Vercel yoki boshqa application deploy bajarilmadi.

# TASK-379 — Butun testlar bazasi bo‘yicha format va distractor sifat auditi (2026-10-21)

**Ruxsat:** foydalanuvchi 2026-10-21: «Tasdiqlayman ishni boshla» — 8 603 savol bo‘yicha tizimli audit, tasdiqlangan tuzatishlarni bosqichma-bosqich production qilish. AI taklifining o‘zi mustaqil inson ekspert tasdig‘ini anglatmaydi.

## Read-only live database snapshot
| Metrika | Son |
|---|---:|
| Jami `public.questions` | **8 603** |
| Published | **5 438** (Y1: 4 438, Y2: 506, Y3: 494) |
| Review | 1 406 |
| Draft | 33 |
| Archived | 1 726 |
| Ochiq `question_quality_findings` (publishedga bog‘langan finding yozuvlari) | 6 504 (bu alohida xato savollar soni emas) |
| Y1: correct word count > 1.5 × max wrong word count | **257 signal** |
| Y1: 2+ keskin absolyut ibora va oddiy sanash shakli bo‘lmagan nomzod | **308 signal** |
| Qisqa izoh (null yoki < 70 belgi, barcha faol formatlar) | **1 934 signal** |
| Manba ko‘rsatkichi yoki source_lesson_id yo‘q | 0 |
| Y2/Y3 formal strukturali nomuvofiqlik, konservativ kriteriy | **20 Y2 signal**; status: manual adjudication pending |

**Kalibrlash:** Birinchi testda «197 structural fail» chiqdi, chunki Y2 dagi haqiqiy 3×3, 4×5 va Y3 dagi 3–6 javobli formatlar noto‘g‘ri universal 4×4 deb belgilangan. SQL tuzatildi: **20 Y2 candidate** qoldi. Kod natijalaridagi `True`, `true`, `TRUE` bir xil emas; case-folding qilinmaydi. 20 Y2 candidate eski 8×a / 0×b ko‘rinishidagi imtihon formatlari; talabdan chetda turishi *mumkin*, ammo asl validator qoidasi bo‘yicha alohida ko‘rilmasdan ommaviy qayta yozilmaydi.

## Bosqich A — sakkiz manbaga tayangan Y1 tuzatishlar
`supabase/maintenance/task379_wave1_EIGHT_REVIEW_STAGE.sql` faqat quyidagilarning **yangi REVIEW** nusxasini yaratadi:

| Bo‘lim | Mavzu | Source UUID |
|---|---|---|
| S1.INFO | Bit | `d6ff215f-f268-5717-a5f0-b03536a809d3` |
| S1.INFO | Rang chuqurligi | `315a3f23-8889-588c-9c4a-bd858a808faa` |
| S1.INFO | Multimedia | `0eaad8e9-b4a7-5c5d-a6d9-77e7f0aa87d6` |
| S1.INFO | Media konteyner | `2562fd1d-5205-519c-aac2-63822efa85d4` |
| S1.INFO | Piksel | `253ad9c7-c687-5304-87b9-35459839911b` |
| S1.INFO | Unicode | `739023a8-d9c3-5fcd-964a-f1398e773b10` |
| S2.OFFICE | Excel workbook | `ba1a0cf6-1b94-08a3-0b60-09c224fd4840` |
| S6.NET | IP subnetlararo diagnostika | `6799c556-8dec-13b1-62b2-491868eed33a` |

Sakkiz original published savol, eski javoblar kaliti va exam tarixiga tegilmaydi. Yangi 3 distractor va didaktik izoh beriladi; to‘g‘ri javob matni ham, semantikasi ham o‘zgarmaydi. Subnet savolida `ping + IP-address` sharti bilan DNS taxminining noaniqligi yo‘qotiladi.

Stage QA: source fingerprint, status va original correct option qiymati, exactly 4 case-sensitive distinct options, word count max/min 1.8, correct/max_wrong ≤1.25, 8 review, 32 options, 8 answer keys, ledger `question_bank_revisions`, originalga review-pending audit finding. Supabase production `BEGIN ... ROLLBACK` sinovi: **8/8 staged**, **32/32 options**, **8/8 review**, production o‘zgarmagan. No human reviewer signature, no publication.

**Nashr talabi:** stage PR va CI’dan keyin migration runner bilan REVIEWga kiritiladi. Shu sakkiztalikni ommaga chiqarish oldidan original manba bo‘yicha ekspert/owner semantic adjudication, ishlab turgan testdagi eskisini immutable archiving, yangi savol uchun publication fingerprint+permissions+exam regression, va release postflight kerak. Qolgan barcha Y1/Y2/Y3 semantik tekshiruvini oldingi 8 ta bilan «bajarildi» deb ko‘rsatmaslik.

## Keyingi partiyalar
1. 20 Y2 legacy matching/sides candidate bo‘yicha haqiqiy savol shakli, kalit va UI validatorini birma-bir tekshirish; Y3 permutation va kod natijalari uchun case-sensitive tahlil.
2. 257 Y1 outlierning manba + correct keyga tayangan semantik triage; keyin tanlangan kichik review waves.
3. 308 absolyut ibora kandidati; `faqat` to‘g‘ri kombinatsiya formatida ham bo‘ladi — heuristik belgi bilan darhol noto‘g‘ri hukm chiqarmaslik.
4. 1 934 qisqa izohni mavzu bo‘yicha kengaytirish; bunday bayon ekspert tekshiruvini almashtirmaydi.
5. Har bir approved batch uchun CI+immutable production swap va historical attempts reconciliation.

## Handoff
Task: TASK-379.
Natija: birinchi qayta ishlatish mumkin bo‘lgan **butun bank** Y1/Y2/Y3 audit skripti; 8 ta source-backed distractor tahriri.
O‘zgargan fayllar: `supabase/maintenance/task379_full_bank_option_quality_audit_READONLY.sql`, `supabase/maintenance/task379_wave1_EIGHT_REVIEW_STAGE.sql`, `src/tests/task379BankwideQualityAudit.test.ts`.
Migratsiyalar: production staging only, release pending.
Qolgan xavf: 5 438 publishedning semantik ekspert ko‘rigi hali tugamagan, 20 Y2 kandidat formatini tekshirish va keyingi QA partiyalar kerak.

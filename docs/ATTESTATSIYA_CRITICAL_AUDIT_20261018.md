# ATTESTATSIYA — P0 chuqurlashtirilgan texnik va kontent auditi

**Audit sanasi:** 2026-10-18. **Repo:** `sarvar9417/attestatsiya`, bazaviy `main` commit `8a27772b5045f5f99f119530bb948579390e208b`. **Ishchi PR:** #165, faqat Draft. Ishchi migratsiyalar production bazasiga QO‘LLANMAGAN.

## 1. Qo‘llangan tekshiruvlar

- Public frontend (React/Vite), Fastify backend, exam route + SQL RPC, M01 kitob ilovalari, server-side natija va javob kaliti oqimi, admin kontent chegarasi, yangi AXB 19-bob mashqlari.
- Supabase production **faqat SELECT** bilan: 16 modul, 92 published lesson, 3,070 published / 1,858 review questions. Faqat `published` + mavjud kalit + active construct + group match bilan pool hisoblangan.
- GitHub main va Vercel production SHA o‘zaro solishtirildi; yangi main ishlab turgan READY deployment SHA bilan bir xil emas.
- Lokal/browser E2E haqiqiy account bilan hali mustaqil o'tkazilmadi, shuning uchun release tasdiqlangan deb belgilanmaydi.

## 2. Tasdiqlangan P0 kod xatolari va tuzatishlar

| Kod / muammo | Audit dalili | Draft PR #165 tuzatishi |
|---|---|---|
| **Mavzu testi 20 o‘rniga 3–19 savolga sezdirmasdan kamayishi** | Production `generate_topic_test` ichida `v_target := least(v_target,v_available)` mavjud, `topic_test_preflight` esa 20 talab qiladi. API ni to‘g‘ridan-to‘g‘ri chaqirish bilan preflightdan chetlab o‘tish mumkin | `20261019190000_exact_topic_test_count.sql`: yetishmasa `topic_pool_insufficient`, **hech qanday exam yaratilmaydi**; `topic_test_preview` ham 0/insufficient qaytaradi |
| **Savoli yo‘q dars progressining noto‘g‘ri tugallanishi** | `TopicView.handleTopicTestAction` test yo‘q bo‘lsa ham oddiy mavzuni `handleComplete(0,0)` qilgan | Testga tayyor bo‘lmagan oddiy mavzu finish tugmasi bloklanadi; haqiqiy `appendix` o‘qib yakunlanadi; `BookReader`da ham no-test finish bloklandi |
| **M01 formulalar ilovasi uchun soxta test** | `M01.09` `kind='appendix'`, o‘z test banki yo‘q, ammo shared construct pool 122 bo‘lgani uchun test CTA yoqilishi mumkin | `isAppendix` har doim rasmiy test CTA ustidan ustuvor; faqat ilova tugallash oqimi |
| **Rasmiy imtihon savollarining javob kalitlari oshkor bo‘lishi** | `POST /api/content/questions/check` token talab qilmasdan `correct_option_id` va izohni qaytargan, S1.INFO kabi official bank guruhlari uchun ham. Pedagogika guruhi ilgari bloklangan, qolganlar yo‘q | Legacy route endi `410 DIRECT_KEY_CHECK_DISABLED`, `no-store`; service-role `checkAnswer` metodi olib tashlandi; haqiqiy test `submit_answer/finish_exam/get_review` bilan ishlaydi |
| **Xavfli optimistik nazariya yakuni** | Appendiks bo‘lmagan `BookReader`da 0 savol holatida ham faol “Mavzuni yakunlash” tugmasi bor edi | No-test non-appendix tugma disabled; yangi regressiya testlari |

**Muhim:** Yangi SQL migratsiyasi productionga o‘tmaguncha eski server generatori mos kelmaydi. SQL va frontend/backend release birgalikda, alohida ruxsat bilan qilinadi.

## 3. Ma’lumotlar bazasidagi kontent holati

`topic_test_question_count = 20` bo‘lgan nashr darslarda **36/92 ta** darsning konstruktga mos published-keyed zaxirasi 20 tadan kam. **To‘rttasi M01’ning test majburiy bo‘lmagan ilovalari** (`M01.01`, `M01.10`, `M01.11`, `M01.12`); ularni avtomatik testga chiqarish shart emas. Qolgan **32 ta haqiqiy testga mo‘ljallangan dars**da savollar soni yetarli emas.

| Modul | Umumiy dars | 20 dan kam linked pool | Yetishgan linked savol | Izoh |
|---|---:|---:|---:|---|
| M01 | 13 | 4 | 80 | 4 tasi ilova, qo‘shimcha savol kerak emas; M01.08 uchun local bank 0, ko‘ndalang shared konstrukt ishlatiladi |
| M02 | 4 | 0 | 0 | Son qamrovi yetarli |
| M03 | 4 | 4 | 52 | Word/Excel/PowerPoint kontent to‘ldirish |
| M04 | 6 | 0 | 0 | Son qamrovi yetarli |
| M05 | 3 | 0 | 0 | Son qamrovi yetarli |
| M06 | 4 | 3 | 38 | Algoritmlar |
| M07 | 6 | 0 | 0 | Son qamrovi yetarli |
| M08 | 5 | 5 | 55 | Python/JavaScript |
| M09 | 5 | 5 | 75 | Ma’lumotlar bazasi/MS Access |
| M10 | 3 | 2 | 26 | Grafika |
| M11 | 3 | 3 | 43 | HTML/CSS |
| M12 | 5 | 3 | 50 | Tarmoqlar |
| M13 | 13 | 0 | 0 | 5 darsda o‘z (source-lesson) savollari 20 dan kam; shared construct qamrovi orqali to‘lyapti; **mavzuga mosligini ekspert tekshirishi shart** |
| M14 | 7 | 7 | 26 | 26 yangi savol productionda **review**, ekspert tasdiqisiz nashr emas |
| M15 | 8 | 0 | 0 | Son qamrovi yetarli |
| M16 | 3 | 0 | 0 | Son qamrovi yetarli |

Agar to‘rtta M01 ilovasi chiqarib tashlansa, qolgan 32 dars uchun test sonini 20 ga yetkazish uchun **kamida 365 published-keyed, sifatli va mos yangi savol** talab etiladi. Bu arifmetik minimum; kognitiv/format balans, majburiy bilimlar va source-page tekshiruvi bilan son ko‘payishi mumkin. Soxta AI ekspert tasdig‘i yoki hammasini ommaviy import qilish man etiladi.

`M13` 5 darsning own-source kamligi umumiy 83 savol; bu shared-construct pool yetarli bo‘lsa ham mazmuniy aniqlik riskidir. `M01`ning bitta baholanadigan bobida (M01.08) local savollar 0: u fanlararo/umumlashtiruvchi bo‘lgani uchun savol-mavzu mosligini alohida tekshirish talab etiladi.

AXB 19-bob banki: 570 jami, 540 published, 30 review; 16-bob 3/30, 19-bob 27/30. SQL RPC avvalgi user ruxsati bilan o‘rnatilgan, bu auditda qayta yozilmadi.

## 4. Xavfsizlik va integratsiya bo‘yicha release talablari

1. **P0:** `direct check` endi javob kaliti qaytarmasligini Fastify regressing test va live smoke bilan tasdiqlash.
2. **P0:** yangi strict topic SQL fresh DB test, API preview va exam session quotalarini bir xil qilish; test yetishmasa foydalanuvchi progressini soxta belgilamaslik.
3. **P0:** GitHub `main` commit / Vercel production SHA / Supabase migratsiya versiyasi mos kelishi. CI yashilligi production deploy tasdig‘i emas.
4. **P1:** M03/M06/M08/M09/M10/M11/M12/M14’ning 32 testga tayyor bo‘lmagan darslarini manbaga bog‘langan review banki + haqiqiy muharrir tasdig‘i bilan to‘ldirish. 15 va 50 savollik rasmiy blueprint qoidalarini o‘zgartirmaslik.
5. **P1:** M13/M01 uchun shared-construct savollarining mazmuniy mosligini ekspert nazoratidan o‘tkazish; manbasi noto‘g‘ri dars savollarini faqat to‘g‘ri revision workflow bilan tuzatish.
6. **P1:** authenticated desktop + mobile browser E2E: learning → preflight → 20-question attempt → submit/retry → finish → review → history; AXB 3/10/15/30, 15 professional, 50 official mock; offline/reconnect, a11y va qaytish navigatsiyasi.
7. **P2:** per-topic content quality dashboardda source-local va linked pool alohida ko‘rsatilishi, o‘quvchiga review inventory ko‘rinmasligi.

## 5. Reproduksiya va izchillik

- `scripts/audit-topic-pools.sql`: faqat SELECT, savol matni yoki kalitni bermaydi.
- `supabase/tests/adaptive_topic_test_pool.test.sql`: atigi 3/20 pool, hech qanday exam yozuvi yaratilmasligi kerak.
- `src/tests/BookReader.test.tsx`: no-test darsni yakunlash tugmasi disabled; ilova tugallanishi mumkin.
- `backend/src/routes/__tests__/content.test.ts`: eskincha kalit olish 410, JSON va DB query yo‘q.
- Oldingi product testlari va GitHub Actions CI yakuniy gate.

**Ruxsat cheklovi:** barcha kod o‘zgarishi faqat PR #165 da; hech qanday production write, merge yoki deploy amalga oshirilmagan.

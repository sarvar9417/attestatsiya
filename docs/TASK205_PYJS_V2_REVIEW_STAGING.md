# TASK-205 — M08 Python/JavaScript V2 integratsiyasi (ekspert ko‘rib chiqishi)

**Sana:** 2026-10-18  
**Repo:** `sarvar9417/attestatsiya` — yagona monorepo  
**Modul:** `M08`, rasmiy guruh `S4.CODE`, attestatsiya blueprinti: 3 savol  
**Maqom:** **DATABASE STAGED / NOT PUBLISHED / PR DRAFT ONLY**

## Tasdiqlangan manba va integratsiya

- Mualliflik sintezi: `Python_JavaScript_Attestatsiya_2026_QAYTA_ISHLANGAN` paketi.
- Darsliklar: 9-sinf Python, 10-sinf Python qo‘shimcha mavzulari, Cambridge 10–11-sinf JavaScript 19-bob; rasmiy 2026-yil attestatsiya spetsifikatsiyasi.
- 14 ta `review` bob: `P01–P07`, `J01–J07`; 3 ta `review` ilova: `A01–A03`.
- 420 ta original `review` savol: **392 Y1, 14 Y2, 14 Y3**; har bir bobda 30 ta.
- Kodli savollar matni va kod fence’lari saqlangan. Y2/Y3 qog‘ozdagi kombinatsion variantlardan haqiqiy moslashtirish/ketma-ketlik ma’lumotiga o‘tkazilgan.
- Savollar `question_options` hamda serverdagi `question_keys`ga ajratilgan. `source_reference`: `pyjs-2026-v2:<external_id>`.
- Boblar `S4.CODE.01–05` faol konstruktlariga bog‘langan.
- 5 ta avvaldan `published` M08 darsi, 51 ta mavjud `S4.CODE` savoli, o‘quvchi attempt/progress tarixi **o‘zgartirilmagan**.
- Yangi modul, yangi schema yoki eski published reviziyalariga yozish qilinmadi.

## DB migratsiyalar (Supabase connector orqali bajarilgan)

**Proyekti:** `attestatsiya100%` (`plyqezulrfowyblsfpzy`).

- `task205_m08_pyjs_v2_review_lessons`: 17 ta lesson, 14 ta construct link.
- `task205_m08_pyjs_v2_questions_p01_review` ... `task205_m08_pyjs_v2_questions_j07_review`: jami 14 × 30 ta question, option va private key.

DB ga qo‘yilgan contentning to‘liq matni, private savollar va javob kalitlari **public Git repository ichiga qo‘yilmaydi**. Import payloadning source of truth — berilgan xususiy JSON/LaTeX arxivi va Supabase migration history. Bu repo parity cheklovi hisoblanadi: kelajakdagi toza lokal bazada ayni kontentni takrorlash uchun xususiy artefaktlar bilan boshqariladigan import va alohida tajriba tekshiruvi zarur. Ko‘r-ko‘rona `supabase db push` **taqiqlangan**.

## Read-only staging auditi

`supabase/maintenance/20261018_pyjs_v2_review_integrity.sql` ni ishlating.

2026-10-18 dagi production Supabase staging natijasi:

| Tekshiruv | Natija |
|---|---:|
| Review lesson | 17 |
| Lesson-construct link | 14 |
| Review question | 420 |
| Y1/Y2/Y3 | 392/14/14 |
| Question keys yo‘q | 0 |
| Source lesson/construct mismatch | 0 |
| Noto‘g‘ri Y1/Y2/Y3 option/key shape | 0 |
| Yangi published lesson/question | 0 |

Bu strukturaviy tekshiruv **savollarning ilmiy-pedagogik to‘g‘riligiga inson ekspertining tasdig‘i** emas. JSON manbadagi ayrim `verified:false` yozuvlar editorial tekshiruvdan o‘tmaganini bildiradi.

## Katalogda xavfsiz chiqarish

`withPublishedPyjsV2Lessons()` faqat **14 bobning barchasi** `published` bo‘lganda M08 katalogini yangisiga o‘tkazadi. Review/draft yoki qisman published kontent mavjud bo‘lsa, platforma eski 12 mavzuli M08 katalogidan foydalanishda davom etadi.

3 ta ilova alohida nashr qilingan bo‘lsa boblar ortidan ko‘rsatiladi. Hech qaysi review material learner API’ga tasodifan chiqmasligi shart. Savollar faqat mavjud server-authoritative topic/section/official mock flow orqali beriladi.

## Qo‘shimcha bajarilishi shart acceptance gates

- [x] Source/specialization mapping, 17 lesson va 420 savolni strukturaviy import qilish.
- [x] Y2 va Y3 ni haqiqiy interaktiv formatga o‘tkazish.
- [x] Kalitlarni faqat server jadvaliga qo‘yish va read-only shape audit.
- [x] Eski M08 katalogi uchun atomic publication guard va unit regressiya testlari.
- [ ] 420 savol uchun mustaqil subject-matter ekspert review (distractor, key, manba, kod natijasi).
- [ ] Yangi dars nazariyasi HTML/Markdown/render audit, mobil code scroll va o‘qish oqimi preview E2E.
- [ ] Y1/Y2/Y3 testlarni haqiqiy browser+server orqali yakunlash, no-early-key disclosure QA.
- [ ] Local/CI `lint`, `typecheck`, `test`, `build`, E2E green.
- [ ] Migration parity uchun xususiy payload qayta qo‘llash rejasini tasdiqlash.
- [ ] Ekspert tasdiqlagan savol va darslarni kanonik revision workflow bilan bosqichli publish.
- [ ] Owner final release sign-off, merge + deploy preview/production smoke, regressiya.

**Hech bir kontentni faqat ushbu staging muvaffaqiyati sababli `published` qilmang.**

### Handoff
- **Task:** TASK-205 M08 Py/JS V2 review staging.
- **Result:** 17 review lesson; 420 review question, 0 published.
- **Git changes:** atomic M08 catalogue selector, hooked fallback, six regression cases, read-only SQL QA, docs.
- **DB:** external connector orqali yuqoridagi 15 review import migratsiyasi.
- **Risk:** human signoff, CI/E2E, private-payload parity, deployment approval ochiq.
- **Next:** editorial review → CI/preview → approved controlled release.

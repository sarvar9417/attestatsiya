# TASK-220 — M12 Kompyuter tarmoqlari V2: pre-production QA va release gate

**Sana:** 2026-10-18  
**Repository:** `sarvar9417/attestatsiya`; **PR:** https://github.com/sarvar9417/attestatsiya/pull/155  
**Holat:** production Supabase ma'lumotlar bazasida **nashr qilinmagan kontent** tayyor. Learner release hali yo‘q.

## Kontent versiyasi

- Spetsifikatsiya (2026): 6-mazmun sohasi, 32–33-savollar, S6.1–S6.6.
- M12 ichida avvalgi 5 ta `published` dars saqlangan.
- V2 nazariya: 10 ta alohida `draft` dars. 11-sinf milliy darsligi (129–196-betlar) tayanch; 6-sinf va Cambridge qo‘shimcha.
- V2 testlar: **300 ta** (`review`) — har bobda 30 tadan; 280 Y1, 10 **native Y2**, 10 **native Y3**.
- Manba: `src/content/tarmoq/Kompyuter_tarmoqlari_nazariya_V2.tex` va `Kompyuter_tarmoqlari_300_savol_V2.json`. Native Y2/Y3 rekonstruksiyasi alohida `Kompyuter_tarmoqlari_native_y2_y3_V2.json`da.
- Web-reader: original LaTeX’dan **20 Markdown jadval, 3 moslangan semantik SVG sxema, 7+ displey formula**; `Kompyuter_tarmoqlari_theory_reader_V2.json`.
- Chetga chiqish yo‘q: avvalgi 91 ta S6.NET savol, foydalanuvchi natijalari va boshqa modullar saqlanadi.

## Tracked migratsiyalar

1. `20261018220000_task220_m12_network_v2_review_import.sql` — dastlabki append-only review/draft import.
2. `20261019210000_task220_m12_v2_theory_render_fix.sql` — faqat draft darslardagi jadval, formula, sxemalarni tiklash.
3. `20261019220000_task220_m12_native_y2_y3_review.sql` — faqat 20 review savol formatini Y2/Y3 ga o'tkazish.

Uchala migratsiya **plyqezulrfowyblsfpzy** loyihasida qo‘llangan. Yangi kontentni tasdiqsiz `published`ga o‘tkazish qat'iyan taqiqlanadi.

## Texnik regressiya

- `supabase/tests/task220_m12_network_v2_review.test.sql` — son, format, 4/6/3–4 javob varianti, kalit, bog‘lanish, avvalgi darslar.
- `supabase/tests/task220_m12_v2_theory_render.test.sql` — 10 nazariya, 20 jadval, 3 sxema, displey formulalar va eski darslar.
- `src/tests/m12NetworkV2Catalog.test.ts` — barcha 10 bob nashr qilinmaguncha learner katalogi faqat eski versiyani ko‘rsatadi.
- `src/tests/m12NetworkV2Rendering.test.tsx` — KaTeX, Markdown jadvallar va SVG figura komponentlari.
- Published kontent darslar va savollar bilan almashtirilmaydi; draft/review kontentni learner API orqali kalitlari bilan oldindan ko‘rsatmaslik kerak.

## Manual acceptance — nashrdan OLDIN

- [ ] **Fan eksperti** nazariyaning 10 bobini 2026 spetsifikatsiyasi va manba sahifalariga solishtirib chiqdi.
- [ ] **Fan eksperti** 300 savolning to‘g‘ri javobi, chalg‘ituvchilari, izohlari va manbasini har bir item bo‘yicha tasdiqladi; native Y2/Y3 juftlash va tartiblarini tekshirdi.
- [ ] Matnli manba–savol reyestri va barcha IP/maska hisoblari ikkinchi mustaqil tekshiruvdan o'tdi.
- [ ] Admin paneldan 10 dars/300 savol preview qilinib, taqsimot va role-based permission tekshirildi.
- [ ] Mobil (320/375/768px) va desktopda 20 jadvalning horizontal scroll / o‘qilishi, 3 diagrammaning semantik yorliqlari, 7 displey formula va 10 bob navigatsiyasi tekshirildi.
- [ ] Testning 30 talik bob rejimi / adaptive preflight / Y1-Y2-Y3 javob yuborish / yakuniy natija / qaytish / scroll / admin statistika E2E tekshirildi.
- [ ] Learner test API finalized examga qadar key/pair/order payload bermasligi tekshirildi.
- [ ] Main bilan branch to'liq sinxronlangan, CI: lint, typecheck/build, backend, database, E2E muvaffaqiyatli.
- [ ] Ekspertning tasdiq dalili saqlandi; **nashr uchun alohida release migratsiyasi** tayyorlanib review qilindi.
- [ ] Merge/deploy vaqtida eski darslar, savollar, attemptlar va RLS/access sozlamalari buzilmagani tekshirildi.

## Qat'iy nashr blokerlari

1. **Inson eksperti tasdig‘i yo‘q:** AI authoring review/draft bosqichidan yuqoriga o‘tkazilmaydi.
2. **Real authorized learner E2E hali topshirilmagan:** nazariya + 30 savol + natija oqimi production login bilan tekshirilishi kerak.
3. **Published test bankga o'tkazish gate'i**: key/rationale/source faktlari tasdiqlangan bo'lishi shart. M12 learner katalogi barcha 10 dars published bo'lmaguncha eskisini ko'rsatadi.

## Qaytarish va tuzatish

Shu bosqichgacha hech qanday foydalanuvchi attempti yangi 300 savol bilan yaratilmasligi kerak. Xato aniqlansa draft/review yozuv uchun navbatdagi timestamped **forward-fix migratsiya** ishlatilsin. Published tarix hech qachon o‘chirilmasin. Diff, tests va migration history GitHub PR #155 da turadi.

# TASK-220 — Kompyuter tarmoqlari V2 integratsiya

## Manba va chegaralar
- Mavjud **M12** moduliga integratsiya; alohida modul yaratilmaydi.
- 2026 attestatsiya spesifikatsiyasi: 32–33-savollar, S6.1–S6.6.
- Asosiy manba: milliy 11-sinf Informatika, 129–196-betlar; qo‘shimcha 6-sinf, Cambridge darsliklari.
- Original V2 JSON: `src/content/tarmoq/Kompyuter_tarmoqlari_300_savol_V2.json`.
- Original V2 nazariya: `src/content/tarmoq/Kompyuter_tarmoqlari_nazariya_V2.tex`.
- V2 nazariyadan 10 ta Markdown-ish `body_mdx` yozuvi migratsiyaga ajratildi.
- S6.1 → NET.01, S6.2 → NET.02, S6.3 → NET.03, S6.4 → NET.04, S6.5–6 → NET.05.

## Migratsiya va xavfsizlik
`supabase/migrations/20261018220000_task220_m12_network_v2_review_import.sql`
- 10 ta yangi dars: `tarmoq-v2-bob-01` … `10`, `order_idx` 11–20, faqat `draft`.
- 300 ta barqaror `TAR-XX-YYY` manba IDli savol, barcha savollar `review`.
- Har bir savol 4 ta javob variantiga, alohida `question_keys`da saqlanadigan 1 ta kalitga va izohga ega.
- Qayta import `md5(... )::uuid` identifikatorlari bilan idempotent; `ON CONFLICT DO NOTHING` eskisini almashtirmaydi.
- Published M12 darslari/savollari, foydalanuvchi attempt/resultlari o‘zgartirilmaydi.
- Manbadagi 280 Y1 + 10 Y2 + 10 Y3: dastlabgi kombinatsion savollardan **10 native moslashtirish (Y2)** va **10 native ketma-ketlik (Y3)** source-backed ravishda qayta tuzildi. Jami bank 300 ta; barcha savollar `review` holatida. Native `pairs` / `order` kalitlari faqat server DB da.
- 25 vizual kodning statik matnli muqobillari stem ichiga kiritilgan. TikZ sxemalari va jadvalning pixel-pariteti hali to‘liq emas; vizual QA shart.

## Holat va nashr siyosati
**Stage only / NOT learner published.** `AGENTS.md` va `README.md` bo‘yicha AI yaratgan kontent `draft/review`dan inson eksperti imzosisiz `published`ga o‘tkazilmaydi. Admin ko‘rigidan so‘ng native mavzu-kod routingini (M12.10–M12.19), mobil renderingni, preflight minimumini, 30 savollik bob testini va 50 talik bo‘lim mockini yakunlab alohida release qilish kerak. Nashr bo‘lmagan darslarni learner katalogiga kiritmang.

## Tekshiruvlar
- V2 JSON: 300 noyob ID, 10 bob × 30 savol, javob variantlari va to‘g‘ri javob mosligi.
- Migratsiya: `BEGIN … ROLLBACK` bilan mavjud Supabase loyihasida sintaksis/constraint preflight muvaffaqiyatli.
- SQL regression: `supabase/tests/task220_m12_network_v2_review.test.sql`.
- CI backend/database/quality 2026-10-18 holatida muvaffaqiyatli (run 39131096051).
- Supabase plyqezulrfowyblsfpzy ga migratsiya haqiqatan qo‘llandi: 10 draft, 300 review, 1200 variant, 300 kalit; oldingi 91 savol va 5 published dars saqlandi.
- Live SQL regression `task220_m12_network_v2_review.test.sql` muvaffaqiyatli.
- **Production DB staging bajarildi, ammo learner release emas.** Ekspert tasdig‘i, admin UI ko‘rigi, front-end/math/diagram QA va real learner E2E bo‘lmaguncha nashr va merge qilmang.

## Rollback / forward-fix
Migratsiya append-only. Sinovda xato topilsa yangi versiyalangan forward-fix migratsiyasi kiriting; nashr qilingan oldingi dars va savollarni hech qachon o‘chirmang. User natijalari bilan bog‘langan manbalar ustida DELETE/UPDATE qilmang.

## Handoff
Task: TASK-220
Natija: source-backed M12 V2 kontent SQL/staging; learner release emas.
Migratsiya: 20261018220000_task220_m12_network_v2_review_import.sql
Qolgan ish: human review, real render/diagram audit, topic frontend routing, E2E, main bilan branch sync va learner release.

## 2026-10-18 davomiy preproduction update
- 20261019210000: `Kompyuter_tarmoqlari_theory_reader_V2.json` asosida **20 table, 3 SVG diagram marker, 7 display math** bilan draft theory forward-fix. Reader regressiya testlari live Supabase'da yashil.
- 20261019220000: 20 review kombinatsion savol haqiqiy native Y2/Y3 ga migratsiya qilindi; 280 Y1 / 10 Y2 / 10 Y3. Live 300-item savol–variant–key testi yashil.
- `src/hooks/useCatalog.ts`: M12 V2 faqat o‘nta bob **barchasi published** bo‘lsa learner katalogida paydo bo‘ladi; incomplete va offline rejim eski M12 ni saqlaydi.
- `src/components/learning/TopicView.tsx`: published M12 UUID dars nazariyasi va server preflight ulanadi, test tayyor bo‘lmasa noto‘g‘ri `completeTopic` yo‘q.
- `src/features/content/professionalLessonTheory.ts` va `BookDiagrams.tsx`: formula/jadval/diagram bloklari native reader bilan render qilinadi.
- Alohida release checklist: `docs/TASK220_M12_PREPRODUCTION_RELEASE_QA.md`.
- **Hali nashr qilinmagan:** original 91 ta S6.NET savol va 5 published dars saqlangan. Inson eksperti approval + real learner E2E bo‘lmaguncha `published` migratsiyasi qilinmaydi.

# TASK-297 — M10.01–M10.03 grafik nazariyalarini kengaytirish va Paint faktini tuzatish

**Sana:** 2026-10-19. **Status:** source-guided reader material, CI va editorial QA pending. Deploy taqiqlanadi.

## Muammo va asosiy tuzatish
M10.01–M10.03 darslari 4–5 qisqa seed nazariy blokdan va TASK-273 manbaviy izoh ilovalaridan iborat edi. Ishchi dizayn yagona BookReader bo‘lsa-da, o‘quvchi uchun chuqur kitob darajasi yo‘q edi.

Ayniqsa M10.02 eski matnida MS Paint qatlamlar bilan **ishlamaydi** degan noto‘g‘ri universal da’vo bor edi. [Microsoft Windows Paint sahifasi](https://www.microsoft.com/en-US/windows/paint) Windows 11 Paintda qatlamlarni boshqarish imkoniyatini ko‘rsatadi; [Paint release notes, June 2026](https://learn.microsoft.com/en-us/windows-insider/release-notes/apps/paint) ham layer funksiyalaridagi tuzatishlarni qayd etadi. Demak, test «Photoshopning Paintdan farqi — qatlam mavjudligi» degan yagona to‘g‘ri javobni hozirgi mahsulot uchun xato belgilaydi.

**Tuzatish:** nazariyada Paintning eski/yangi versiyasi farqlanadi; savol IDsi va to‘g‘ri javob indeksi 1 saqlanib, professional farq (layer mask, Smart Object, adjustment layer) tushunchalari asosida savol qayta yozildi. Seed jadvalidagi noto‘g‘ri Paint qatlamlari haqidagi taqqoslash ham tuzatildi. Boshqa mavzular va savollariga tegilmadi.

## Yangilangan darslar

| Mavzu | Yangidan asosiy blok | Tabiiy bo‘lim | Muhim mazmun |
|---|---:|---:|---|
| M10.01 Grafika turlari, rang modellari va formatlar | 72 | 13 | Rastr/vektor; bit/byte hisob; PPI/DPI; RGB/CMYK/HSV; JPEG/PNG/SVG/GIF/TIFF; eksport |
| M10.02 Paint va Photoshop interfeysi | 66 | 12 | Zamonaviy Paint Layers; UI/workspace; qatlam, opacity; Smart Object; maska va nondestruktiv rang tuzatish |
| M10.03 Belgilash, kesish, rang va qatlamlar | 66 | 12 | Marquee/Lasso/Magic Wand; tolerance, crop/resize; qatlam/maska, rang tuzatish, eksport |
| **Jami** | **204** | **37** | 37 ta vaziyatli topshiriq va 3 bobning tekshirish yo‘nalishi |

Yangi bob avval, TASK-273 manbaviy qo‘shimchalar esa o‘qish oqimining oxirida saqlanadi; eski 4–5 blokli qisqa seed ikkinchi yashirin dars sifatida qayta takrorlanmaydi. Offline testlar (M10.01: 3, M10.02: 3, M10.03: 2) hamda mavzu IDlari saqlangan, M10.02-q1 faktik eskirish sabab qayta bayon qilingan.

## Manbalar va chegaralar
- [Cambridge+ 8-sinf darsligi](https://drive.google.com/file/d/1hZyLM5n0OUtuJI3M3dFeAz8kyv9Sr6Ng/view): animatsiya bobida, bosma taxminan 121–123-betlar, piksel/rastr/vektor/qatlam va kompozitsiya.
- [Cambridge+ 10–11-sinf darsligi](https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view): 1-bob ma’lumot kodlash, JPEG/PNG/GIF/SVG formatlari hamda qatlamli ishchi fayllar.
- [Adobe official Layers](https://helpx.adobe.com/photoshop/desktop/create-manage-layers/create-layer-compositions/create-layers-and-layer-groups.html), [Adobe Masks](https://helpx.adobe.com/photoshop/desktop/create-masks/layer-masks/edit-and-refine-layer-masks.html), [Adobe Adjustment Layer](https://www.adobe.com/learn/photoshop/web/adjustment-layer).
- [Microsoft Paint](https://www.microsoft.com/en-US/windows/paint), [Paint 2026 release notes](https://learn.microsoft.com/en-us/windows-insider/release-notes/apps/paint).

Ta’rif, sonli misollar, masalalar mustaqil mualliflik qayta bayoni. Bu 204 blok **M01.02 ning har bir sahifasi bilan aynan bir xil chuqurlik** yoki har bir bosma/PDF bet va tasvirni yakuniy tasdiqlash degani **emas**. Page-by-page darslik crosswalk, xususan rasm va sxema sifat QA: unverified; authentic learner server-published UI va mobile smoke: not performed.

## Sinov mezonlari va xavfsizlik
- TASK297GraphicsCanonicalBooks regressiya: bob boshlanishi, 12/13 tabiiy bo‘limlar, barcha bloklarning ketma-ketligi, manba izlari, qo‘shimchalar saqlanishi, savol ID/indekslari va M10.02 faktik tuzatish.
- M10 ning boshqa to‘rtta mavzusi o‘zgarmagan; Supabase published savollar, DB migratsiya, preview/release/tashqi deploy yo‘q.
- Lint, TypeScript, unit, build, Playwright E2E, backend, database va quality CI majburiy tekshiruvlari yashil bo‘lgandagina PR merge qilish mumkin. Boshqa parallel PR merges sodir bo‘lsa tarmoqni yangilangan main bilan moslab qayta tekshirish shart.

## Keyingi ustuvorlik
M10.04–M10.07 va M11.01–M11.03 hamon brief/partial triage; ularni Cambridge+ rasm/multimedia va HTML darsliklari bilan source-first yo‘lida davom ettirish. M01.02 bilan tenglik mavzuma-mavzu ekspert reviewdan keyin e’lon qilinadi.

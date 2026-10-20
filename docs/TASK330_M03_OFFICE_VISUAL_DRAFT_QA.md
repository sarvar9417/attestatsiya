# TASK-330 — Office M03 yettita grafikni majburiy sifat gate bilan tuzatish

## Dalil va o‘zgarish
2026-10-20 production read-only audit: 7 ta original Office V2 savol `draft`, `assets=[]`, stemda `[Rasm ilovasi hali biriktirilmagan]` belgisi. `public/office-v2/off_*.svg` statik fayllari va frontend allowlist avvalgi TASK-239 bilan Git’da mavjud, lekin production SQL biriktirilmagan.

Yangi migratsiya `supabase/migrations/20261020093000_task330_m03_office_visual_draft_assets.sql` yettita original *draft* savolga first-party `src` ulaydi va bo‘sh rasm placeholderini olib tashlaydi. **Status `draft`ligicha qoladi**, `question_keys` yoki `published`ga tegmaydi. Faqat ikkala shart mutlaq mos kelganda yangilaydi; aks holda fail-closed. Re-run idempotent, fresh DBda bank yo‘q bo‘lsa safe skip.

## Manbaviy cross-check va hisoblash
- OFF-E04-006: A=18, B=24 ⇒ farq **6 nafar**
- OFF-E04-012: sentabr 40, oktabr 50, noyabr 45 ⇒ **Oktabr**
- OFF-E04-018: Word 20%, Excel 30%, PowerPoint 50% ⇒ **50%**
- OFF-E04-024: 85, 68, 74, 59; ≥70 ⇒ **2 ta**
- OFF-P01-018: Slide Layout taqdimot joy-ajratkichlarini belgilaydi ⇒ **Slide Layout**
- OFF-P02-018: uchinchi effekt avvalgisidan keyin ⇒ **After Previous**
- OFF-W03-018: 28−26 + 30−27 ⇒ **5 nafar**

Ushbu yetti javob productiondagi `question_keys` orqali oldindan solishtirilgan. Izohlar va statik grafik original 7 vaziyatga asoslangan **mualliflik sxemasi**, uchinchi tomon skrinshoti emas.

## Nashr yo‘li
1. CI: fresh-migration chain, frontend lint/unit/build, backend unit/E2E.
2. Controlled production migration, postflight 7/7 `assets` + `draft` status, key isolation.
3. Rasm assetlari production URL 200; mobil/desktop haqiqiy ko‘rish smoke.
4. Manbani, har bir savolni va izohni haqiqiy inson ekspert tasdiqlaganidan keyingina keyingi published revision.

**O‘tkazilmagan ishlar:** model tekshiruvi inson approval o‘rnini bosa olmaydi; 54 Y2 va 36 yangi review savolini ommaviy publish qilmang. Published qatorlar va prior attempts immutable.

## Rollback
Qaytarish kerak bo‘lsa yangi forward migration’da faqat aynan TASK-330 asset shape holatidagi draft savollar uchun oldingi placeholderga qaytish. Oldingi published revision va attemptsga hech qachon tegmang.

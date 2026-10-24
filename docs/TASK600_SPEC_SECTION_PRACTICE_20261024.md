# TASK-600 — Spetsifikatsiyaning asosiy bo‘limlari: barcha savollarni izoh bilan ishlash

Sana: 2026-10-24
Branch: `task/TASK-600-specification-full-section-practice`
Status: implementation/draft review. Main / production / Supabase schema o‘zgarmagan.

## Foydalanuvchi tasdiqlagan scope

- `O‘rganish` sahifasining o‘zida **2026-yilgi attestatsiya spetsifikatsiyasining asosiy** bo‘limlari chiqadi; kichik mavzular bo‘yicha ajratilmaydi.
- S1–S7, Kasb standarti (KS), Pedagogik mahorat (PM, shu jumladan PM.MET) — jami 9 ta asosiy soha.
- Har bo‘limda unga tegishli `questions.status='published'` savollarni **to‘liq** ko‘rish; server javobni 20 tadan sahifalaydi, lekin savollar sonini cheklamaydi.
- Har bir Y1 javob variantini belgilaganda to‘g‘riligi, to‘g‘ri javob, `question_keys.explanation_md` darhol chiqadi. Y2/Y3 da to‘liq moslashtirish/tartiblash kiritilgach izoh ko‘rsatiladi.
- `draft`, `review`, `archived` savollar ochilmaydi. Oldingi 50 savollik mock, topic test va ularning javob-key maxfiyligi o‘zgarmaydi.

## Ma’lumotga tayangan sxema

`public.questions.group_code`:
- S1.% — 1-bo‘lim; S2.% — 2-bo‘lim; S3.% — 3-bo‘lim; S4.% — 4-bo‘lim;
- S5.% — 5-bo‘lim; S6.% — 6-bo‘lim; S7.% — 7-bo‘lim;
- KS — kasb standarti;
- PM.% — pedagogik mahorat + metodika.

2026-10-24 read-only hisob:
S1=1031; S2=448; S3=1720; S4=973; S5=130; S6=598; S7=420; KS=510; PM=927; jami=6757 ta published. Har birida kalit va bo‘sh bo‘lmagan izoh mavjudligi o‘qish rejimida tekshirildi. Sonlar vaqt bilan o‘zgarishi mumkin, UI dinamik sanaydi.

## Xavfsizlik va UX

- Session token `auth.getUser` orqali serverda tekshiriladi.
- `GET` faqat savol/variantlarni beradi, `question_keys` qaytmaydi.
- Javob yuborish `POST` endpointi: savol `published`, kerakli bo‘limga tegishli, variantlar savolning o‘zidan ekanligi, Y2/Y3 javobi to‘liq va takrorsizligi tekshiriladi. Natijada kalit va izoh qaytariladi.
- Xizmat rolidagi kalit frontendga chiqmaydi. Source-screenshot Drive ID kabi muharrirga tegishli asset metama’lumotlari learnerga yuborilmaydi.
- Eski, vaqtli mock va natijalar saqlanishiga ta’sir qilmaydi.
- Test interfeysi bir savolni ko‘rsatadi; keyingi sahifa tugaganda avtomatik qo‘shiladi, avvalgi savollarga qaytish mumkin.

## Qabul shartlari / QA

- [x] Asosiy 9 bo‘lim metadata mapping 2026-yil PDF spetsifikatsiyasi bilan mos.
- [x] Frontend route, ro‘yxat va savol/izoh komponenti yozilgan.
- [x] Backend validation/auth/section filter va maxfiy key chegarasi yozilgan.
- [x] API va domain uchun Y1/Y2/Y3, invalid-section/answer, auth unit testlari qo‘shilgan.
- [ ] GitHub CI typecheck, lint, unit, E2E va dastlabki deployed smoke tekshiruvi.
- [ ] Mustaqil code review va release ruxsati.
- [ ] User alohida tasdiqlamagancha MAIN merge, Vercel production deploy yoki DB write **YO‘Q**.

## Qaytarish

DB migratsiya yo‘q. Branch/PRni merge qilmaslik yoki mergedidan keyin frontend va server o‘zgarishlarini revert qilish yetarli.

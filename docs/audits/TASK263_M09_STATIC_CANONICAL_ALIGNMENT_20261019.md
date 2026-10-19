# TASK-263 — M09.05 statik fallback va kanonik dars nomuvofiqligi

**2026-10-19. Review-only.** Hech qanday Supabase yozuvi, published revision, ishlab turgan imtihon kaliti yoki deploy o‘zgarmadi.

## Tekshirilgan nomuvofiqlik

- Kanonik published M09.05: **murakkab Access so‘rovlari va tanlash shartlari** (M09 TASK-261 inventarida belgilangan).
- Oldin `src/data/topicContent.ts` dagi aynan **M09.05** statik fallback mavzusi **«Import va eksport»** edi; shu ID bilan berilgan uchta Y1 mashq ham import, MP3 eksport va ODBC haqida edi.
- Backenddan kanonik mavzu matnini olish imkonsiz bo‘lgan fallback yo‘lda shu farq o‘quvchini boshqa ko‘nikmaga yo‘naltirishi mumkin. Static fallback va productionda published DB darsi aynan bitta narsa deb taxmin qilinmaydi.

## Original manbaga qayta bog‘lash

**ICT 11-sinf (2021)**, Xaytullayeva va boshqalar, 7-dars «Ma’lumotlarni so‘rovlar yordamida saralash», **bosma 44–52-betlar**. Sarvar Drive fayl ID: `1CFmUVZnq7S7YmZxHGaI1q58ogdD-2fEi`.

- 44–50-betlar: Access Query Design, jadvaldan maydonlar tanlash, bitta/ko‘p jadvalli so‘rov asoslari.
- 51–52-betlar: `Like "gul*"` — boshlanishi; `Like "*a"` — tugashi; `Like "*gul*"` — ichida qatnashishi; `Not Like "*gul*"` — aks shart; `Between 5 And 11` — sonli oraliq.
- Ushbu misollar Accessning darslikda ishlatilgan `*` wildcardi bilan bog‘liq. Standart SQL `LIKE` dagi `%` bilan aralashtirmaslik kerak; Date maydonlariga mahalliy formatli matn patternini qo‘llashni umumiy qoida sifatida tavsiya qilmaymiz.

## Tuzatish doirasi

1. M09.05 statik fallback nazariyasi va uchta **lokal mashq** so‘rovlar mavzusiga ko‘chirildi. Oldingi savol IDlari qayta ishlatilmadi — yangi source-versioned IDlar tarixiy xotira bilan aralashmaydi.
2. Import/eksportga doir eski mazmun manba nuqtai nazaridan alohida qo‘shimcha darsga rejalashtirilsin; u M09.05 bo‘yicha so‘rov testini almashtirmasligi kerak. Eski uchta mini-quiz professional bankga import qilinmagan va bu audit ularni nashr qilmaydi.
3. Regression test mavzu sarlavhasi, darslikdagi `Like/Not Like/Between`, yangi IDlar, indekslar va to‘rt noyob variantni tekshiradi.

## Ochiq sifat shartlari

- Local fallback faqat **ta’limiy mashq**, rasmiy server-baholanadigan test emas. Yangi mashqlarning barcha kalit/distraktorlari mustaqil muharrir tasdig‘idan keyingina professional bankka muhokama qilinishi mumkin.
- M09 published kanonik darslar 5/5, biroq TASK-261 bo‘yicha **75/100 savol o‘rni yetishmaydi**; 309 construct-mapped review occurrence tasdiqlangan 309 savol emas. Ushbu tuzatish 75 o‘rinni to‘ldirmaydi.
- Darslikdagi so‘rov dizayni tasvirlari va real Access UI amaliy testi, history/mobile sinovlari hamon ochiq. Production DBga avtomatik publish/merge-deploy qilinmaydi.

# TASK-252 — M16 informatika o‘qitish metodikasi: rasmiy maqsad / static theory farqi

**Sana:** 2026-10-19. **Branch:** `task/TASK-252-pedagogy-m16-methodology-audit-20261019`. **Status:** PARTIAL / source-book missing.

## 1. Aynan nima manbadan tekshirildi?

Sarvar Drive’da `Informatika Testlar spesifikatsiyasi.pdf` (Toshkent, 2026), original matnli nusxa. [Drive file](https://drive.google.com/file/d/1jJstcqgFXwTJKuH9bkRIpvATEsjM2UnQ/view).

Uning 2-jadvalida:
- **M16 / 2.2 Informatika o‘qitish metodikasi — 3 ta savol.**
- Informatika mazmun sohasini o‘qitish yondashuvlari, metodikasi va texnologiyalarini bilish.
- Fanni o‘qitish usul/metodlarini farqlash va vaziyatga mos tanlash.
- Informatikani o‘qitishga oid berilgan metodik qarorlarga baho berish.
- Tavsiya etilgan darslik: **Mamarajabov M.E. va boshqalar, «Informatika o‘qitish metodikasi», Toshkent: Bookmany print, 2023, 460 bet**.

**Source debt:** Ushbu tavsiya etilgan darslikning asl 460 sahifali nusxasi `barnoyevak/attestatsiya/pedagogika/files`dagi 59 PDF nomidan aniqlanmadi, Sarvar Drive qidiruvida ham topilmadi. Shuning uchun u bo‘yicha fizik sahifa yoki ekspert tasdig‘i mavjud deb da’vo qilinmaydi. 2026 rasmiy spetsifikatsiyasining maqsadlari bevosita tasdiqlandi; quyidagi informatika vaziyatlari mustaqil didaktik *illustration*, kitobdan ko‘chirma yoki rasmiy savol emas.

## 2. Muvofiqlashtirish

| Kanonik modul | 2026 rasmiy maqsad | Oldingi statik matndagi xavf | Bajarilgan tahrir |
|---|---|---|---|
| M16.01 | Fan mazmuni va o‘qitish yondashuvlari | To‘rtta yondashuv nomlari bilan cheklangan, ularning o‘qitish vaziyatidagi tanlovi ochilmagan | Mazmun/metod farqi, spirallik, shart operatori uchun besh bosqichli misol |
| M16.02 | O‘qitish usullari va metodini farqlash | Metod, vosita (Scratch/Python/slayd), grafik tashkillashtirgichlar bir qatorda sanalgan | Metod-vositani ajratish, kodni sinash, juftlik tekshiruvi, Ishikava, unplugged/computer qo‘llanishi |
| M16.03 | Informatika vaziyatida qabul qilingan metodik qarorni baholash | Ko‘proq umumiy intizom mavzusi, javoblar «to‘g‘ri/noto‘g‘ri» degan mutlaq belgi bilan | Algoritm xatosi, kompyuter yetishmasligi, individual farq, kod ishlamasligi, xavfsizlikda dalil bilan qaror |

### UX va baholash xavfsizligi

- Faqat `src/data/topicContent.ts`da har bir M16 mavzuning **source, jadval, tushunarli misol, note va definition** fallback bo‘limlari qayta yozilgan. Yangi front-end imtihon formatlari yoki production published dars o‘zgarmagan.
- Uchala M16 `questions: []`ligicha qoladi. Mavzu savollari faqat preflightdan o‘tgan server-scored bankdan olinadi; tarixiy PDFdagi javob kaliti front-endga yozilmaydi.
- `src/tests/PedagogyM16Source.test.ts` — 6 ta yangi Vitest: 2026 blueprint trace, original darslik source debt, aniq metod-vositani farqlash, vaziyatli hukm, 70% majburiy vaqt qoidasi yo‘qligi, local keys bo‘lmasligi.
- Bu **AI editorial tahriri**, mustaqil inson metodistining yoki original 2023 darslikning betma-bet ekspertizasi emas.

## 3. Qolgan release va source-review shartlari

1. Mamarajabov (2023) original 460 betli kitob mavjudligidan keyin har bir uchta mavzudagi tushuncha va misolni fizik bet bilan tekshirish (source locator).
2. 2026 spetsifikatsiyasi bo‘yicha 3 ta PM.MET savolni mustaqil ekspert kaliti, Y1/Y2/Y3, izoh, dublikat va ishonchlilik mezonlari bilan tekshirish.
3. Backenddagi published matn bilan static fallback bir xil manba/statusga egami — read-only DB snapshot audit; hech qanday production update ekspert signoffsiz bo‘lmaydi.
4. Exact SHA frontend quality/backend/database CI, preview mobil E2E va authenticated exam history.
5. Foydalanuvchi faqat TASK-247 branchining mergeiga ruxsat berdi; TASK-252 **alohida branch** bo‘lib, kelgusi review/merge alohida baholanadi. Deploy qilinmadi.

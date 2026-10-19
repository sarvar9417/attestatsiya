# TASK-252 — M16 informatika o‘qitish metodikasi: rasmiy maqsad / static theory farqi

**Sana:** 2026-10-19. **Branch:** `task/TASK-252-pedagogy-m16-methodology-audit-20261019`. **Status:** PARTIAL / original 2023 textbook found and first selected physical pages verified, full 460-page audit pending.

## 1. Aynan nima manbadan tekshirildi?

Sarvar Drive’da `Informatika Testlar spesifikatsiyasi.pdf` (Toshkent, 2026), original matnli nusxa. [Drive file](https://drive.google.com/file/d/1jJstcqgFXwTJKuH9bkRIpvATEsjM2UnQ/view).

Uning 2-jadvalida:
- **M16 / 2.2 Informatika o‘qitish metodikasi — 3 ta savol.**
- Informatika mazmun sohasini o‘qitish yondashuvlari, metodikasi va texnologiyalarini bilish.
- Fanni o‘qitish usul/metodlarini farqlash va vaziyatga mos tanlash.
- Informatikani o‘qitishga oid berilgan metodik qarorlarga baho berish.
- Tavsiya etilgan darslik: **Mamarajabov M.E. va boshqalar, «Informatika o‘qitish metodikasi», Toshkent: Bookmany print, 2023, 460 bet**.

**2026-10-19 yangilanishi — asosiy manba topildi:** Tavsiya etilgan 2023-yilgi **460 sahifali asl darslik** ochiq ravishda [universitet resursida PDF](https://turan-edu.uz/media/books/2024/05/22/1708324536.pdf) shaklida mavjud. Mualliflar M.E. Mamarajabov, D.E. Toshtemirov, O‘.A. Yuldashev, 2023; PDF titul sahifasi ko‘rildi. Shu muhim source gap endi **book located / partial physical-page verified**; 460 betning hammasi to‘liq o‘qildi yoki barcha nazariya tasdiqlandi degani emas. `barnoyevak` va `sarvar9417` Drivelaridagi original fayl hali topilmagani alohida masala, biroq internetdagi original PDF mavjud. Kitobdagi mazmun va misollar parafraz qilinadi, to‘liq PDF GitHubga ko‘chirilmaydi.

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

1. Mamarajabov (2023) topilgan original 460 betli PDFning **qolgan sahifalarini** har uch mavzu bilan davomli moslab, har bir termin va misolni fizik bet bilan tekshirish (source locator).
2. 2026 spetsifikatsiyasi bo‘yicha 3 ta PM.MET savolni mustaqil ekspert kaliti, Y1/Y2/Y3, izoh, dublikat va ishonchlilik mezonlari bilan tekshirish.
3. Backenddagi published matn bilan static fallback bir xil manba/statusga egami — read-only DB snapshot audit; hech qanday production update ekspert signoffsiz bo‘lmaydi.
4. Exact SHA frontend quality/backend/database CI, preview mobil E2E va authenticated exam history.
5. Foydalanuvchi faqat TASK-247 branchining mergeiga ruxsat berdi; TASK-252 **alohida branch** bo‘lib, kelgusi review/merge alohida baholanadi. Deploy qilinmadi.


## 4. 2023-yilgi Mamarajabov darsligidan dastlabki real sahifa tekshiruvi

Asl universitet PDF: https://turan-edu.uz/media/books/2024/05/22/1708324536.pdf . **Fizik PDF sahifa indeksi 0 dan boshlanadi**; jadvaldagi betlar foydalanuvchi ko‘radigan 1-asosli PDF sahifalar (indeks+1) sifatida berilgan.

| Modullar | PDF 1-asosli sahifalar | Asl mazmunda topilgan dalil | Shart |
|---|---|---|---|
| M16.01 | 173–175, 180–181 | Informatika metodikasining maqsadi, fan mazmunini ajratish, informatika o‘quv predmetining «nimani va qanday o‘qitish» savoli | Yondashuv va shart operatori misoli — didaktik mualliflik misoli; kitobdan aynan ko‘chirilmagan |
| M16.02 | 15–16, 46–47, 72–73 | Metodning o‘qituvchi-o‘quvchi hamkorlikdagi faoliyat ekanligi, metodlarni turlicha tasniflash, muammoli vaziyatga asoslangan o‘rganish | Fishbone/unplugged/Python misollari o‘rganishga mos illustratsiya, aynan kitob sahifasidan emas |
| M16.03 | 90–91, 172–175 | Nazorat va baholash bilan teskari aloqa, informatika o‘qitish metodikasi kasbiy vazifalari | Qarorlar jadvalidagi Python/texnika yetishmasligi misollari mustaqil tahririy vaziyat |

**Izoh:** `src/data/topicContent.ts`dagi barcha uch M16 manba izlari va ushbu jadval PDF ko‘ruvchining **1-asosli sahifalarini** bir xil ishlatadi (web indeksiga +1). Originalni ko‘rishda sarlavha sahifasi ham 1-bet sifatida sanaladi. Yakuniy ekspertizadan oldin jadval, rasm, kod namunalarini sahifa renderida takror tekshirish kerak.

**Javob kaliti:** asli topilgan kitob testlarning avtomatik aniq to‘g‘ri variantini bermaydi. Har bir answer key expert ko‘rigi va 2026 spetsifikatsiyaga mos kelishi majburiy.

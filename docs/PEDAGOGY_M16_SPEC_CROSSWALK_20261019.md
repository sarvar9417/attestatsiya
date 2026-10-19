# M16 informatika o‘qitish metodikasi — 2026 spetsifikatsiyasi crosswalk (2026-10-19)

## Birlamchi mazmun va chegaralar

- [«Informatika Testlar spesifikatsiyasi.pdf» (2026)](https://drive.google.com/file/d/1jJstcqgFXwTJKuH9bkRIpvATEsjM2UnQ/view), 2-jadval, «2.2. Informatika o‘qitish metodikasi»: (1) fan mazmunini o‘qitish yondashuvlari/metodikasi/texnologiyalari; (2) fan sohasini o‘qitish metodlarini farqlash va vaziyatga mosini tanlash; (3) ta’limiy vaziyatda qabul qilingan qarorni baholash. **3 ta imtihon savoli** metodika uchun, individual kanonik mavzu uchun bittadan qat’iy kvota demak emas. Pedagogik mahorat umumiy 10 (umumiy pedagogika 7 + metodika 3), kasb standarti 5; fanning o‘zi 35. 50 savol, 100 ball, 120 daqiqa; Y1/Y2/Y3 formatlari.
- [Kamaltdinova/Sayfurov, «Informatika va axborot texnologiyalari», 5-sinf, 2020](https://drive.google.com/file/d/1KPjag_YqjgQbtd4HFEcEkQviJiwaduC9/view): mundarijada xavfsizlik, axborot, amaliy ish, grafik muharrir, Scratch va animatsiya. Bu darslikning bo‘limlari yordamida **muharrir tomonidan tayyorlangan misollar**; u **2026 spetsifikatsiyasining tavsiya etilgan Ellis/Lawrey/Dickinson Cambridge 2023** nashrini o‘rnini bosmaydi.
- [«Mirzayeva Pedagogika nazriyasi qollanma 2-mavzu.pdf»](https://drive.google.com/file/d/1woZMas8dNbzk6yephzNH_XdmT19ess-l/view): didaktika, metod/vosita; *ikkilamchi qo‘llanma*.
- [«Kasb-standarti.pdf»](https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view): baholash, qayta aloqa va xavfsizlikka oid umumiy o‘qituvchi faoliyati. Huquqiy maqomning hozirgi verifikatsiyasi ochiq.
- [Komil Jalilov, «Baholash nazariyasi asoslari» (2020)](https://drive.google.com/file/d/1-l4tFRqNEBuDEtvIavoh8yYB2pYp1JFN/view): qarorni dalillash va natija talqini; maktab metodikasining maxsus darsligi o‘rnida emas.

## Crosswalk

| Mavzu | 2026 2-jadvaldagi konstrukt | Fallback nazariyaga kiritilgan asosiy dalil |
|---|---|---|
| M16.01 | Fan mazmunini o‘qitish yondashuvlari/metodikasi/texnologiyalari | Natija, diagnostika, faoliyat, mezon, qayta aloqa; kompetensiyaviy/faoliyatli/tizimli/spiral/shaxsiy yondashuv |
| M16.02 | Metodlarni farqlash va vaziyatga mos tanlash | Metod/vosita/tashkiliy shakl farqi; namoyish, debugging, loyiha, bahs; Fishbone va Venn uchun metodik vazifa |
| M16.03 | Ta’limiy vaziyatda qabul qilingan qarorni baholash | Maqsad, dalil, individual ehtiyoj, xavfsizlik/etika, qayta aloqa mezonlari va qaror tahlili algoritmi |

## Test and publication gate

- M16 source-fallback `questions: []` saqlangan: brauzerda testning yashirin to‘g‘ri javobi paydo bo‘lmaydi. Backenddagi published testlar ushbu branchda o‘zgarmaydi.
- `src/tests/PedagogyM16MethodologySource.test.ts` da manba izi, mavzu tarkibi, vaziyat tahlili va answer-key izolatsiyasi sinovlari.
- Mustaqil tekshirilmagan: fizik sahifa tasvirlari, tavsiya qilingan 2023 Cambridge darsligi bilan har-bir tushunchaning solishtirilishi, live M16 test banki ID/kalit/sifat auditi, test generatorining E2E holati va barcha UX breakpointlari.
- Audit yakunlanmaguncha **yangi savollarni publishedga chiqarish yoki production DB yozuvi bajarilmaydi**.

## 2026 spetsifikatsiyasida tavsiya etilgan 2023-yilgi asosiy metodika darsligi bilan bevosita qiyoslash (2026-10-19)

Rasmiy spetsifikatsiyaning **fizik 9-sahifasida** M.E. Mamarajabov va boshqalarning *Informatika o‘qitish metodikasi* (2023, 460 bet) darsligi tavsiya qilingan. Mustaqil nashrning [onlayn to‘liq elektron nusxasi](https://pedmasterycenter.uz/uploads/files/0896d872-7672-4387-8ca0-b671b0f98b5d.pdf) topilib, muqova/bibliografiyasi taqqoslandi: **M.E. Mamarajabov, D.E. Toshtemirov, O‘.A. Yuldashev; Bookmany print, Toshkent, 2023; 460 bet.** Ushbu ma’lumotlar elektron PDF matni va rasmiy spetsifikatsiya ro‘yxatiga mos. Elektron nusxaning barcha 460 sahifasi betma-bet ekspertizadan o‘tkazilgani haqida da’vo qilinmaydi.

| Kanonik mavzu | Elektron PDF fizik sahifalari (birinchi betdan sanaladi) | Elektron matnda aniqlangan yadro konseptlar |
|---|---|---|
| M16.01 | 173–175; 180–182 | Informatika metodikasining predmeti, maqsadi, mazmuni; nima uchun / nimani / qanday o‘rgatamiz? |
| M16.02 | 45–46; 342–344 | Ta’lim metodining o‘qituvchi-o‘quvchi hamkorligi; mashq, topshiriq murakkabligi, differensial yordam |
| M16.03 | 94–95; 167 | Bilimni baholash va o‘qitish usulini moslashtirish, dars tahlili mezonlari |

**Metodologiya:** manbaning sahifa raqamlari elektron PDF matn indeksidagi ko‘rsatkichlardan olingan; PDF sahifalarining rasmlari tashqi server tomonidan qaytarilmagani sababli bu qism *matn-based verification*, **vizual sahifa tasdig‘i emas**. Oldingi 2020-yilgi 5-sinf Scratch misollari aynan kitobdan ko‘chirilmagan, pedagogik vaziyatlar mualliflik misoli sifatida qoladi.

**Keyingi xavfsizlik bosqichi:** manbada M16 haqidagi tushunchalar mavjudligi published 3 metodika savolining javob kaliti to‘g‘ri degani emas; savol ID, distractor, explanation, konstrukt va bibliografik bet bo‘yicha alohida ekspert tekshiruvi zarur.

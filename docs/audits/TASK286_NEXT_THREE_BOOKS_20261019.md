# TASK-286 — uch keyingi qisqa nazariya bobi (2026-10-19)

## Boshlang‘ich muammo

M03.02 «Word formatlash vositalari», M03.03 «Word obyektlari», M15.03 «Tarbiya va uning turlari» darslari asosan jadval/konspekt ko‘rinishida edi. Yagona BookReader dizayni to‘liq tushuntirish, ishlangan vaziyat, mustaqil topshiriq va javobni o‘zi yaratmaydi.

## Yangi, birinchi o‘qiladigan boblar

| Dars | Yangi nazariya bloki | Ichki bo‘lim | Amaliy urg‘u |
|---|---:|---:|---|
| M03.02 Word formatlash | 52 | 11 | belgi/abzats/sahifa/stil, Heading, oraliq, raqamlash, section break, 5 mashq |
| M03.03 Word obyektlari | 57 | 13 | rasm, alt text, wrapping, jadval, diagramma, SmartArt, Equation, Link, caption, 5 mashq |
| M15.03 Tarbiya turlari | 55 | 12 | 9 ijtimoiy tarbiya yo‘nalishi, metod/shakl/vosita, xavfsiz pedagogika, 6 mashq |

Yangi boblar **asosiy o‘qishning boshida**, qolgan manbaviy Office qo‘shimchalari va `withPedagogyStudyNotes` ichidagi avvalgi qaydlar ulardan keyin qoladi. Static savollar, original javob kalitlari, nashr holatlari va backend ma'lumotlariga tegilmaydi.

## Manba doirasi va mulohazalar

- [Cambridge+ 10–11-sinf, 1-bob «Matn bilan ishlash», bosma 37–38-bet](https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view) — uslublar, sarlavhalar, jadvallar, izohlar, ramkalar, raqamlash va matn tekislash imkoniyatlari.
- [Cambridge+ 9-sinf, matnli hujjatlar bo‘limlari](https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view) — oldingi M03 manba korpusi bilan izchil bo‘lishi uchun.
- [F.O. Mirzayeva — «Pedagogika nazariyasi va tarixi»](https://drive.google.com/file/d/1GG9dH4_kdMyj5cqKML21lQoZufO40E38/view) — tarbiya nazariyasi, ijtimoiy tarbiya yo‘nalishlari (taxminan 23, 150–151-bet), fuqarolik/axloqiy/jismoniy/estetik tarbiya amaliy mashg‘ulotlari (taxminan 247-bet).

**Yozish usuli:** darsliklarning mazmuniy yo‘nalishlariga mos mustaqil o‘zbekcha didaktik bayon. Amaliy keyslar, Word vaziyatlari, test/namunalar va izohlar mustaqil tuzilgan; PDFning har bir beti, rasmi va asl tili to‘liq ko‘chirilgani yoki har bir menyu har versiyada aynan bir xil ekanligi da’vo qilinmaydi. Tarbiya tarixidagi «jazolash» kabi terminlar jismoniy/ruhiy zo‘ravonlikka asos sifatida talqin etilmaydi.

## Regressiya mezonlari

`src/tests/TASK286WordPedagogySourceBooks.test.ts` min. blok/bo‘lim chuqurligi, dastlabki o‘qish tartibi, eski nazariya, manbaviy qaydlar, test savollari va pedagogika savollarini o‘zgartirmaslik, qolgan mavzularni izolyatsiya qilishni tekshiradi.

Eski TASK-284 sifat darvozasi endi M03.04/M15.04 kabi hanuz qisqa darslarga qo‘llanadi. Keyingi audit navbati M03.04, M15.04 va boshqa `brief` qatorlar; CI barcha 4 asosiy tekshiruvdan o‘tmaguncha merge emas. Deploy yo‘q.

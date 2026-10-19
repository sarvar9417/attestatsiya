# TASK-244 — Cambridge+ 10–11-sinf: M01 sahifa–nazariya qiyosi

**Kitob tartibi:** 13/13. **Sana:** 2026-10-19.  
**Drive original:** `10-11-sinf informatika (Cambridge +)_compressed.pdf`, ID `1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ`.  
**Fayl:** 360 PDF sahifa, 9 619 312 bayt; SHA256 `70cc04baf99b61958e40967ff3feda0fa349fd50014585721424817bcfaf5b79`. Cambridge International AS & A Level IT Coursebook asosidagi 2021 o‘zbekcha kitob. Asosiy boblarda **PDF indeksi = bosma bet +9** (PDF 10 — bosma 1).

## Original manbani modulga ajratish

360 betning mundarijasi va bo‘lim chegaralari xaritalandi. **M01ga bevosita bog‘liq PDF 10–31, 70–86 va 193–205** matni ketma-ket ko‘rib chiqildi, formula/jadvalli tanlangan sahifalar grafik ko‘rinishda tekshirildi. **Barcha 360 sahifaning alohida vizual tekshiruvdan o‘tgani tasdiqlanmaydi.** Boshqa bo‘limlarning batafsil amaliy kontenti o‘z kanonik modullariga qoldirildi.

| PDF sahifa | Original kitobdagi mavzu | M01 / boshqa modul |
|---|---|---|
| 10–12 | Data → information → knowledge (bilimlar bazasi), kontekst | M01.02/M01.03, maʼlumot va bilim farqi |
| 13 | Statik va dinamik manba | M01.03, yangilanish modeli |
| 14–15 | Bevosita/bilvosita manba, o‘lchov va xatolik | M01.03, manba kelib chiqishi |
| 16 | Axborotning to‘g‘rilik, dolzarblik va tafsilot kabi sifatlari | M01.03, sifati ajratib tekshirildi |
| 17–19 | Dasturiy kodlash, maʼlumotlarni ikkilik tasvirlash | M01.05; dasturlash kodini shifrlash bilan chalkashtirmaslik |
| 20–22 | Run Length Encoding, video va bitrate, siqish | M01.05 va M01.06; RLE bo‘yicha original yechim |
| 23–25 | Simmetrik/asimmetrik shifrlash, sertifikat va xabar | Chuqur M13; M01ga faqat maxfiylik prinsipining mavjud qismi |
| 26–28 | Presence, type, format, range va consistency | M01.04, validation mezonlari |
| 29–30 | Verification: asl maʼlumotga mosligi, vizual tekshiruv, prufriding | M01.04, verification ≠ validation |
| 31 | Birinchi bobni umumlashtirish | M01.02–06 |
| 32–69 | Qurilmalar, saqlash vositalari, dasturiy taʼminot, sanoat avtomatizatsiyasi | M02, M08/M13; M01ga takror ko‘chirilmagan |
| 70–76 | Phishing, malware, tovlamachi dastur, shaxsiy maʼlumot | M01.04 xavfsiz odat; batafsil M13 |
| 77–79 | Ekran ergonomikasi, kabellar, ish joyi xavfsizligi | M01.04, ehtiyotkor amaliy prinsip |
| 80–86 | Raqamli tengsizlik, infratuzilma, yosh, iqtisod, hudud va 2012 xarita | M01.04, zamonaviy dolzarblik izohi |
| 87–192 | Tarmoq, Excel, Access, axborot tizimlari va boshqa amaliy modullar | Asosan M12/M03/M09/M11 |
| 193–205 | Audio/video tahrirlash, kadr, sample, eksport va format | M01.06 texnik asos; amaliy editor M10 |
| 206–360 | Texnologiya, tizim sikli, ishlab chiqish va boshqa amaliy boblar | Boshqa modullar, M01ga nusxalanmagan |

## M01ga kiritilgan 7 ta original sahifali qo‘shimcha

1. `M01.03` — PDF 10–16: maʼlumot, axborot, bilimlar bazasi va statik/dinamik tushunchalar; «bilimlar bazasi» inson bilimlari uchun ishlatilganini ekspert tizimi maʼlumot tuzilmasidan ajratish zarur.
2. `M01.03` — PDF 10–32: bevosita/bilvosita manba, maʼlumot sifati, to‘g‘rilik va dolzarblik. Bevosita har doim to‘g‘ri, bilvosita doim noto‘g‘ri deyilmagan.
3. `M01.04` — PDF 80–86: raqamli tengsizlikning infratuzilma, narx, ko‘nikma, accessibility omillari; **2012-yil xarita** bugungi internet ulushi emas.
4. `M01.06` — PDF 193–205: tovush sample, media tahrirlash va konvertatsiyaning farqi; video kadr va soundtrack asoslari.
5. `M01.05` — PDF 19–22: RLE **AAAABBBCC → 4A3B2C**, takrorlar va **ABCDEF → 1A1B1C1D1E1F** siqmasligi. Original misol, kitobdagi RLE tamoyilidan.
6. `M01.04` — PDF 25–30: presence/type/range/format va verification; darslikdagi asli A bo‘lgan bahoni xato C kiritish qoidaga mos kelishi mumkin, lekin aslga mos emas.
7. `M01.04` — PDF 70–79: fishing, ijtimoiy maʼlumot, zaxira, zararli dastur va ergonomika; barcha servislar kontentni albatta bir xil muddat saqlaydi deyish noto‘g‘ri.

**O‘qish sharti:** dastlabki 4 ta qo‘shimcha faylda avval boshlangan audit kontentini saqlaydi, yangi 3 ta manbali yechim bilan to‘ldirildi. Har biri kitobning PDF sahifa diapazoniga bog‘langan. Generated `m01.ts` o‘zgarmagan. 

**Kod:** `src/data/topics/m01TextbookAuditCambridge1011.ts`, `src/data/topics/m01TextbookAudit.ts` aggregate; alohida test `src/tests/M01Cambridge1011BookAudit.test.tsx`.

**Jami:** original 7 ICT va 6 Cambridge+ kitob = **13/13 kitob bo‘yicha M01ga tegishli bo‘limlar ko‘rib chiqildi**, jami **59 ta manbali nazariya qo‘shimchasi**. Bu barcha 13 PDFning har sahifasi grafik dizayn darajasida tekshirilgan degani emas. Final CI, authenticated learner mobile/desktop ko‘rigi, source-to-question integrity va yakuniy inson editorial tasdig‘i release-gates sifatida ochiq.

**Merge, production deploy va production DB write qilinmadi.**

# TASK-244 — ICT 11-sinf (2021) M01 sahifa–nazariya qiyosi

**Sana:** 2026-10-19. **Kitob tartibi:** 7/13.
**Asl Drive PDF:** `ICT 11_sinf-2021_compressed.pdf`, ID `1CFmUVZnq7S7YmZxHGaI1q58ogdD-2fEi`.
**Korpus:** **340 PDF bet**, 4 953 847 bayt, SHA256 `a8a20db236cb99e2702a08ee6fcc900e49ebd168f50291188741e434168faca4`.

## Ish usuli va chegarasi

340 betli PDFdagi matn va boblar inventarlandi. M01ga bevosita aloqador **11, 66–70, 296–305 PDF sahifalar** sahifama-sahifa o‘qildi va tanlangan jadval/diagramma sahifalari grafik ko‘rinishda tekshirildi. **340 ta rasm/sahifaning barchasi vizual ko‘rildi degan daʼvo yo‘q.** Ushbu materiallar 11-sinf MBBT, Data Mining va raqamli xizmatlarga oid katta o‘quv dasturining M01 bilan kesishuvchi qismlaridir.

- M09 uchun qoladigan bilimlar: Access, MBBT/SQL, jadvallar, so‘rovlar va import/eksport amaliyoti (PDF 4–65), chuqur data mining.
- M08/M09ga yoki alohida zamonaviy texnologiya moduliga tegishli: sunʼiy intellekt va uning dasturlari.
- M12ga tegishli: tarmoq turlari, Internet protokollari, arxitektura va xizmatlar (PDF 186 atrofidan).
- M13ga tegishli: antivirus, xavfsizlik devori, zaxiralash, simmetrik/asimmetrik shifrlash, E-IMZO, elektron hukumat, to‘lovlar, blockchain (PDF 265–295, 306–339 atrofida). M01da bu texnik boblar ko‘chirilmaydi.

## M01ga aloqador har bir tekshirilgan sahifa

| PDF sahifa | Asl kitobdagi mazmun | Mavzu | O‘zgarish yoki chegaralash |
|---:|---|---|---|
| 11 | Maʼlumotning aniqlik, to‘g‘rilik, dolzarblik, to‘liqlik, muvofiqlik, izchilligi | M01.03/M09 | 6 qatorli sifat mezonlari jadvali |
| 66 | Big Data kirish, hajm prognozlari va katta o‘lchov birliklari | M01.02/M09 | Tarixiy 2025 bashorati va nostandart Bronto/Geop birliklar universallashtirilmagan |
| 67 | Tuzilmali, tuzilmasiz va yarim tuzilmali maʼlumot | M01.02/M09 | 3 qatorli tashkil etilish jadvali |
| 68 | Big Data 5V va Data Miningga kirish | M01.02/M09 | 5V taʼrif; aniqlik va qiymat universal sonli standart emas |
| 69 | Data Mining: ajratish, guruhlash, natijadan foydalanish | M01.02/M09 | Maktab qatnashish misoli bilan original izoh |
| 70 | Tanlangan maʼlumot asosida yangi foydali axborot va tavsiya | M01.02/M09 | Xom maʼlumot, tahlil, xulosaning chegarasi ajratildi |
| 296 | 61–62-dars raqamli dunyo va izga kirish | M01.04/M13 | Raqamli savodxonlik konturi |
| 297 | Axborot/kompyuter/kommunikativ/raqamli savodxonlik | M01.04 | Asl mavzu bilan solishtirildi |
| 298 | Raqamli fuqaro odobi, mualliflik va hamkorlik | M01.04 | Netiket va raqamli masʼuliyat oldingi mazmunga bog‘landi |
| 299 | Raqamli iz tushunchasi, faol iz misollari | M01.04 | Faol izlar uchun jadval |
| 300 | Passiv iz: cookie, joylashuv, IP, tashrif logi | M01.04 | Faol/passiv farqi; server doim saqlashi universal emas |
| 301 | 7 manba ishonchliligi belgisi | M01.04 | 7 savolga asoslangan tekshirish ro‘yxati |
| 302 | Manbaga havola, phishing, parol, MFA va xavfsiz link | M01.04/M13 | Manba ishonchliligi + mustaqil tasdiq; MFA vaziyatli izoh |
| 303 | Onlayn do‘st, shaxsiy maʼlumot, Wi-Fi, kiberbulling | M01.04/M13 | Amaliy holatlar; shifrlangan ulanishni alohida baholash |
| 304 | Raqamli iz va onlayn odob savollari | M01.04 | Vaziyat bilan qiyos |
| 305 | Internet manbasi va xavfsizlik mustahkamlash | M01.04 | 7 mezon + foydalanuvchi xavfsizligi |

## Kiritilgan 5 ta aniq manbali qo‘shimcha

1. `M01.03`, PDF 11: aniqlik, to‘g‘rilik, dolzarblik, to‘liqlik, muvofiqlik, izchillik — har biriga bittadan tekshiriladigan vaziyat.
2. `M01.02`, PDF 66–70: tuzilmali/yarim tuzilmali/tuzilmasiz maʼlumot + Data Miningning saralash–tahlil–foydali xulosa namunasi. 2020/2025 statistik prognoz va Bronto/Geop birliklari bugungi o‘lchov standarti deb olinmadi.
3. `M01.04`, PDF 296–300: faol va passiv raqamli izning 2 qatorli taqqoslanishi; "hamma o‘chirilgan maʼlumotlar doim qoladi" universal hukm emasligi.
4. `M01.04`, PDF 301–302: muallif, aloqa, tashqi manba, fakt, taqdimot, maqsad, dolzarblik — **7 savol**; chiroyli sayt avtomatik ishonchli emas.
5. `M01.04`, PDF 302–305: shubhali e-mail, ilova, xavfsiz havola, MFA, umumiy Wi-Fi va raqamli etiket; havola va hisobdan chiqish chegarasi.

`src/data/topics/m01TextbookAuditICT11.ts`, `src/tests/M01ICT11BookAudit.test.tsx`, umumlashtiruvchi `src/data/topics/m01TextbookAudit.ts`. ICT5–11: **6+4+7+4+3+3+5=32 ta manbasi ko‘rsatilgan nazariya paketi**. Generatsiyalangan M01 fayli buzilmagan.

**Status:** ICT5–11 / 7 kitob qamrovi yakunlangan kontent tekshiruvi, 6 ta Cambridge+ kitobi hali navbatda; CI va real learner mobile/desktop QA alohida release-gate. **Merge ham deploy ham bajarilmagan.**

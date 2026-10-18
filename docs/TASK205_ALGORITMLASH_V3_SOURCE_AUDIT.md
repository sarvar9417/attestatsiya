# TASK-205 — Algoritmlash V3 manbaviy qamrov va uslubiy audit

**Vaqt:** 2026-10-18. **Korpus:** M06 Algoritmlash. **PR branch:** task/TASK-205-algoritmlash-v3-coverage.

## 1. Tekshirilgan asosiy dalillar

- Rasmiy spetsifikatsiya: `Informatika Testlar spesifikatsiyasi.pdf`, PDF **3–4** — Y1/Y2/Y3 shakllari, **Algoritmlash 3 ta** rasmiy savol, **to‘rt kompetensiya**. Dasturlash tillari sintaksisi bu bo‘limdan alohida.
- `ICT 9_sinf-2020(1).pdf`, PDF **28–46**: algoritm xossalari, ifodalash, chiziqli/tarmoqlanuvchi, *shart oldin tekshiriluvchi (toki)*, *shart keyin tekshiriluvchi (gacha)*, parametrli sikl, siklni qadamma-qadam bajarish, aralash algoritm va Yevklid usuli.
- `Ma'ruza (Tayyor).pdf`, PDF **46–55**: algoritm, shakllar, chiziqli/shart/sikl va EKUB masalalari.
- `Test.pdf`, PDF **53–63**: tushuncha-variantni farqlash, dastur/algoritm ijro izi, sanagich va ichma-ich sikl, oxirgi qiymatni topish. **Faylning o‘zida ayrim kalitlar yoki savollar xatoli bo‘lishi mumkinligi haqida ogohlantirish bor.** Uslub namuna, javob rasmiy kalit emas.
- `5-sinf informatika (Cambridge +)(1).pdf`, PDF **80**: blok-sxemani o‘qish/yasash bo‘yicha ko‘rgazmali topshiriq, grafik uslubda qamrovni to‘ldirishga asos.
- `10-11-sinf informatika (Cambridge +)(1).pdf`, PDF **28–30**: ma’lumotni tekshirish va tekshirish usullari — tegishli holatlargagina ko‘prik; umumiy validatsiya boshqa bo‘limga ham tegishli.
- Oldingi V2: 8 bob, 3 ilova, 240 savol, 12 rasmli Y1.

## 2. To‘rtta spetsifikatsiya konstruktiga iz

| Spetsifikatsiya konstrukt | V2 mavjud material | TASK-205 V3 to‘ldirishi | Holat |
|---|---|---|---|
| Algoritm va turlarini farqlash | ALG-01 va ALG-03, 9-sinf PDF 28–40 | ALG-V3-B001,B005,B006; 10-bob | Qamrab olingan |
| Blok-sxema va psevdokod, mantiqiy tekshiruv | ALG-02,06, 9-sinf PDF 31–40 | Diagramlar 6 joyda tiklandi; ALG-V3-B002–B004, B021 | Qamrab olingan |
| Masalaning algoritmini tuzish va hisoblash | ALG-04,05,07, 9-sinf PDF 41–46 | Yangi 9-bob; ALG-V3-A001–A024; 10-bob ijro izi | Oldingi «gacha» va chegara bo‘shlig‘i bartaraf etildi |
| Tahlil va maqbulini tanlash | ALG-08, 2026 spec PDF 4 | ALG-V3-B017–B020,B022; 10-bob | Qamrab olingan; Big-O/qidiruv qo‘shimcha sifatida |

## 3. Yangi nazariya va savol uslublari

**9-bob**: shartni tanadan oldin/keyin tekshirish farqi, «toki / gacha / parametr» jadvali, kamida 0/1 takrorlar, yozuvning semantikasi, manfiy terminal qiymatni qo‘shmaslik, 5..49 toq qiymatlar (23 ta had), 1..5 ko‘paytma va chegara xatolari. To‘g‘ridan-to‘g‘ri tayanch: 9-sinf, PDF 41–45.

**10-bob**: ijro izi jadvali, ichma-ich sikl sonini sanash, manfiy elementlar maksimumi, 4 standart blok shakli, terminal/chegara xatolari, EKUB, shartga mos qidiruv, tezlik/maqbullik. Uslub: 9-sinf, Ma’ruza va 2019-yil Test.pdf; sonli topshiriqlar **original**.

**48 ta yangi savol**: Y1=40, Y2=4, Y3=4, ikki mavzuga 24 tadan (ALG-V3-A001…A024; ALG-V3-B001…B024). Javob kalitlari va izohlar serverda. Qo‘shilgan bankning yangi umumiy hajmi **288** ta, shundan V2=240, V3=48.

### Konkret moslik

| Source qismidagi ko‘nikma/uslub | V3 test dalili |
|---|---|
| 9-sinf 22-dars, «gacha» | ALG-V3-A001–A008, A016–A019, A021 |
| 9-sinf 23-dars, 1..5 va 5..49 ko‘paytma | ALG-V3-A009–A010, A014, A020 |
| 9-sinf, terminal manfiy qiymatgacha yig‘indi | ALG-V3-A011–A013, A024 |
| 2019-yil testlarida aniq ijro izi uslubi | ALG-V3-B007–B010, B014, B020 |
| 2019-yil va 9-sinfda ta’riflarni farqlash | ALG-V3-B001–B006 |
| 9-sinf/Yevklid, manfiy maksimum xatosi | ALG-V3-B011–B015, B024 |
| 2026 Algoritmlash konstruktidan maqbullik | ALG-V3-B016–B019, B022 |
| Y2/Y3 to‘g‘ridan-to‘g‘ri javob shakli | ALG-V3-A021–A024, ALG-V3-B021–B024 |

## 4. Diagramlar

Oldingi 6 ta nazariya sahifasidagi «PDFda mavjud» placeholderi haqiqiy mahalliy SVG yo‘liga almashtirildi: yig‘indi, maksimum, sikl, baholar, Yevklidning ayirishli va qoldiqli varianti. Qo‘shimcha yangi **post-test sikl** blok-sxemasi yaratildi. Tasvirlar faqat allowlist `/algoritmlash-v2/*.svg` va `/algoritmlash-v3/*.svg` lokal manzillar orqali ko‘rsatiladi.

## 5. Sifat nazorati va chegaralar

- DBga original nashr qilingan savollar/attemptlar o‘zgartirilmagan; yangi 48 savol `review`, yangi 2 dars `review`. Oldingi V2ning 12 tasida rasm assetlari bor, lekin savollar haligacha `draft`.
- V3 barcha 48 savolida option/keys/format mantiqi avtomatik SQL orqali tekshiriladi; testlarning namunaviy hisoblari qo‘lda ham asoslangan.
- Kitoblardagi **Algoritmlash kompetensiyasiga aloqador barcha mayda detallar** bo‘yicha mutlaq 100% sahifama-sahifa ekspert tasdig‘i taqdim etilmaydi. Ushbu audit manbaviy dalilga bog‘langan **maqsadli qamrov auditi**; butun 5–11-sinf korpusining barcha sahifalarida to‘liq mustaqil tekshiruv yakunlandi degan xulosa chiqarib bo‘lmaydi.
- Test.pdf 2019-yilgi material; «o‘tgan rasmiy attestatsiyada aynan tushgan» deb aytilmaydi. Drive to‘plamlarining barcha varianti savolma-savol tekshirilmagan. Manba va uslub manbalarini adashtirmang.
- Yangi darslar va savollar userga chiqishi uchun loyiha publish-gate qoidalari saqlanadi: **review/draft** ma’lumotini yashirincha **published**ga o‘tkazish yo‘q.

## 6. Amalda bajarilgan ishlar

1. V2–V3 orasidagi manba qamrovi bo‘shlig‘i aniqlangan va 9–10-bob bilan to‘ldirilgan.
2. 48 ta original savol JSON-li SQL orqali bazaga idempotent kiritilgan.
3. V2 nazariyasida 6 ta chizma placeholderi tiklangan, 2 yangi grafik fayl qo‘shilgan.
4. Markdown theory parser, TopicView va useCatalog V3 ni ko‘rishga tayyorlanmoqda.
5. SQL QA regressiya va Vitest parser testi GitHub’da saqlangan.
6. Barcha o‘zgarishlar alohida TASK-205 PR orqali tekshiriladi, user tasdig‘i asosida merge qilinadi.

**Baholash:** 2026 spetsifikatsiyasidagi 4 kompetensiya va 9-sinfning asosiy 13–24-darslari algoritmlash hajmida o‘quv materiallar bilan qamrab olingan. Ammo butun 5–11-sinf korpusi/Drive manbalarida mutlaq to‘liqlik bo‘yicha kafolat berilmaydi.

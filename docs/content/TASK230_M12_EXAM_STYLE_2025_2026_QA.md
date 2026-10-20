# TASK-230 — M12: 2025/2026 attestatsiya testlari asosida uslubiy va fan QA

**Sana:** 2026-10-20. **Qamrov:** M12 V2/V3 banki 380 ta savol (280 Y1, 50 Y2, 50 Y3); oldingi S6.NET banki alohida regressiya/taqqoslash doirasida. **Holat:** avtomatik 380-item audit va namunaviy fan tekshiruvi, inson ekspertining tasdig‘i kutilmoqda. Nashr qilingan savollar immutable.

## Namuna manbalarning kelib chiqishi va dalili

1. **Drive: 2025 kuzgi demo @Informatika_fani_ustozlari.pdf**, 11-bet, 25-savol. CIDR `/27` ni dotted-decimal niqobga aylantirish; to‘rtta yaqin ko‘rinadigan variant va hisoblash izohi. **Tasnif:** o‘qituvchi kanalida izohlangan demo nusxa; uning javob kalitini rasmiy standart deb qabul qilmaslik.
   - **Diqqat:** manbada `192.168.10.32/27` go‘yoki odatiy kompyuter host IP sifatida berilgan; aslida `192.168.10.32/27` shu subnetning **network address**idir. Maska `255.255.255.224` to‘g‘ri, ammo topshiriq holatida texnik noaniqlik bor. Shuning uchun aynan ko‘chirmadik.
2. **Drive: Demo 2026 test 10 000 so‘mlik.pdf**, 14-bet 26-savol — `/19` maskani hisoblash; 15-bet 27-savol — aralashtirilgan IP bo‘laklaridan xususiy manzil yig‘ish; 15-bet 28-savol — qidiruv to‘plamlari sonidan kesishma topish (qo‘shish-ayirish). **Tasnif:** tijoriy demo; **rasmiy imtihon o‘zi emas**. Faqat masala shakli, mantiqiy murakkablik va plausibil chalg‘ituvchilar andozasi.
3. **Drive: 13.04.2026 Attetasiya Tushgan savollar.pdf**, 2-bet — aniq ibora + OR qidiruv; 16-bet, 33-savol — 32 bit IPv4 ni o‘nlik oktetlarga aylantirish; 26-bet — hub/switch bo‘yicha ikki hukmning rostlik qiymati. **Tasnif:** avvalgi imtihondan qayd etilgan xotira asosidagi to‘plam, rasmiy verifikatsiyadan o‘tmagan. 16-betda javob variantlari to‘liq emas; hech qanday manba-kalit farazi chiqarilmaydi.
4. **Drive: Informatika Testlar spesifikatsiyasi.pdf**, 6-bo‘lim 32–33-savollar, tarmoqlar/devices, arxitektura/topologiya, IPv4/maska/network hisobi, maqsadli/xavfsiz internet, brauzer va qidiruv.
5. **Milliy ICT 11-sinf 2021**, 129–196-betlar (tarmoq/internet), boshqa tegishli bo‘limlar; ICT 6-sinf va Cambridge qo‘shimcha darsliklar. **Fakt va terminologiya manbasi**. Rasmiy spetsifikatsiya baholash chegarasini belgilaydi.

Bu fayllar vazifaga tegishli sahifa va savol tuzilishi bo‘yicha ko‘rilgan. Suratlarga asoslangan PDFlarning hamma variantlari matn sifatida OCR qilinmagan; namuna shaklidan tashqari to‘liq savol-kalit verifikatsiyasi da'vo qilinmaydi.

## Haqiqiy namunalar bilan test banki orasidagi farqlar

| Namuna xossasi | 2025–26 namunalarda | M12 bankida aniqlangan risk | Amal |
|---|---|---|---|
| Hisoblashning bir necha qadami | CIDR prefiks→mask; IPv4 bitlari→oktet; qidiruv qo‘shish-ayirish | Y1 testlarning sezilarli qismi qisqa ta'rif | Yangi original, ko‘p qadamli Y1, matematik mustaqil oracle |
| Bir necha hukmning rostligini ajratish | Hub/switch ikki hukm | Kam sonli muhokama-savollari | Qurilma va xavfsizlik bo‘yicha juft-mulohaza |
| Moslashtirish | Termin/vazifa jadvali yoki 1–a ko‘rinish | Dastlabki 10 native Y2 ning aynan bir xil umumiy savol matni | 10 ta Y2 stemini mavzuga xos qilish, variant/kalitni saqlash |
| Grafik/jadval | Rasm, jadvalli mantiq va IP bo‘laklari | 25 ta vizual marker render-paritetni talab qiladi | Ko‘rgazmali QA uchun alohida reyestr; yangi masalalarda matnli aniq jadval |
| Isbotga yaqin distractor | Prefiksga yaqin niqoblar, hisobdagi odatiy xatolar | 80 Y1 savolda `Faqat ...` bilan boshlanadigan kamida bir variant; 34 tasida ikki yoki undan ko‘p | Human rewrite queue, nashr qilinganlari joyida tahrirlanmaydi |

## Avtomatik test-bank auditining cheklangan, takrorlanadigan natijasi

- **380 ta** yagona V2/V3 ID reyestrda mavjud: [380-item CSV](./TASK230_M12_380_ITEM_QA_REGISTRY.csv), [flaglar/statistika](./TASK230_M12_380_QA_METRICS.json).
- 10 ta **bir xil umumiy native Y2 savol matni** topilgan; 10 ta review savolda mavzuga mos retitle forward-fix tayyor.
- **80 ta Y1** javob variantida kamida bitta `Faqat ...` distractor bor; 34 tasida ikki+ (bularning har biri xato degani emas, ammo chalg‘ituvchining oson ajralishini ko‘rsatishi mumkin).
- 25 vizual marker uchun haqiqiy mobil/desktop render va talqin tekshiruvi alohida.
- **31 ta** CIDR maska/network/broadcast/host hisobining javobi `ipaddress` kutubxonasi bilan mustaqil qayta hisoblangan: 31/31 mos. Regression: `src/tests/m12NetworkIpOracle.test.ts`.
- 380 ta savolning barchasi haqiqiy darslikning har bir sahifasi bilan mustaqil ekspert tomonidan tekshirilgan **emas**. Har bir variant/izohning tashqi fan-ekspert signoff'i hozircha **0**.

## Yaratilgan yangi savollar va o‘zgarishlar

- `src/content/tarmoq/M12_demo_style_20_original_Y1_v4.json`: har 10 bob uchun 2 tadan **20 original Y1** masala; CIDR, network/broadcast, 32 bit IPv4, VLSM, RFC1918, tarmoq diagnostikasi, hub/switch rost-yolg‘on, protokollarni juftlash, qidiruv to‘plami, xavfsizlik.
- `src/tests/m12ExamStyle20.test.ts`: 20 ID, 4 ta noyob variant, source, math oracle, qamrov.
- `src/content/tarmoq/M12_10_native_Y2_source_specific_stems_v4.json`: umumiy matn o‘rniga 10 ta aniq mavzuga mos native Y2 matni; **variantlar, juftliklar va izoh o‘zgarmaydi**.
- `20261020234000_task230_m12_examstyle_20_review.sql`: 20 yangi savol faqat `review`; eski 380 ta savolni o‘zgartirmaydi.
- `20261020235000_task230_m12_10_review_y2_stems.sql`: faqat hozir ham review bo‘lgan 10 savol matnini retitle qiladi; nashr qilinganidan birortasi o‘zgargan yoki original matnidan drift bo‘lgan bo‘lsa migratsiya avtomatik **rad etiladi**.
- `supabase/tests/task230_m12_exam_style_qa.test.sql`: serverdagi variantlar, maxfiy keylar, M12 mapping, 380 original qator va 10 native Y2 mavzuga xos matn.

## Baza holati va nashr cheklovi

2026-10-20 tekshiruvida tashqi jarayon nashr holatlarini allaqachon o‘zgartirgani ko‘rindi: **V2/V3 380 dan 321 ta published, 59 ta review**, 10 ta nazariya boblari ham published. Shu sabab oldingi "380 ham review" degan raport endi eskirgan. Bunday yozuvlarni **o‘sha qatorni o‘zgartirib tuzatish qat’iyan mumkin emas**; mustaqil ekspert tasdig‘idan so‘ng yangi reviziya yoki supersession kerak. Ushbu task hech bir published originalni UPDATE yoki DELETE qilmaydi.

**Ekspert uchun navbatdagi vazifa:** har bir 380 itemdan kelib chiqqan flag bo‘yicha fakt, mos difficulty, barcha distractor, tushuntirish va darslikning aniq sahifasini tasdiqlash; 20 yangi va 10 matni o‘zgargan Y2 review savollarini tasdiqlash; nashr qilingan riskli savollarga yangi reviziya va regression. Demo testdagi noto‘g‘ri qo‘yilgan host manzili kabi xatolar platformaga ko‘chirilmasligi kerak.

## Handoff

Task: TASK-230. Natija: 380-item audit reyestri, manbalar uslubiy taqqoslanishi, 31 matematik oracle, 20 original imtihon-shaklli review Y1, 10 review Y2 stem patch. Migratsiyalar: 20261020234000, 20261020235000. Qolgan: mustaqil fan ekspert signoff, barcha flaglar bo‘yicha ehtimoliy yangi nashr reviziyalari, vizual E2E, PR merge/deploy. Ekpert signoff va production learner release bu taskda qilinmaydi.

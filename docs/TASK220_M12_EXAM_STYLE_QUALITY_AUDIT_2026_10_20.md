# TASK-220 / M12 — 2026-10-20 imtihon uslubi va bank sifati auditi (ISHCHI)

## Audit doirasi va haqiqiy manba
- Aso­siy 380 ta M12 V2/V3 savol: 280 Y1, 50 native Y2, 50 native Y3. 10 bob x 38 savol.
- 2026 attestatsiya spetsifikatsiyasi (6-mazmun sohasi, 32–33-savollar, S6.1–S6.6).
- `13.04.2026 Attetasiya Tushgan savollar.pdf` (foydalanuvchidagi **qayta tiklangan** savollar; rasmiy asl nusxa deb tasdiqlanmadi):
  - PDF 2-bet: qo‘shtirnoqdagi aniq ibora + OR qidiruvi; AND/OR variantlarini ajratish.
  - PDF 16-bet: **32 bitli IPv4 manzilni ikkilikdan o‘nlikka aylantirish**; hujjatda ko‘rinadigan A varianti `195.168.201.99`, hisob-kitob bo‘yicha `11000011.10101000.11001001.01101101` = **195.168.201.109**. Ko‘rinadigan A variantini «to‘g‘ri javob» deb qabul QILMANG — u chalg‘ituvchi yoki ma’lumot to‘liq emas.
  - PDF 26-bet: hub va switch haqida ikki mulohaza berilib, 1/2 rost-yolg‘on qiymatini tanlash. Switchning o‘rganilgan unicast MAC holati bilan broadcast/unknown unicast istisnolari farqlansin.
- `Informatika Demo testi .pdf` (skanerlangan ekran tasvirlari): PDF 6-betda ikki mulohaza, PDF 13-betda vizual HTML/CSS taqqoslash namunasi ko‘rilgan. `Demo 2026 test 10 000 so\`mlik.pdf` 6-betda blok-sxema va Scratch vizual savollar bor. M12 ga tegishli har bir skan-sahifani tizimli OCR/qo‘lda yakuniy indekslash hali amalga oshirilmagan.
- Google Drive `Attestatsiya` papkasidagi `Informatika Kuzgi demo testlari.docx` topilgan, lekin matnli konnektor uni bo‘sh qaytardi; uning M12 savollari tekshirilgan deb **da’vo qilinmaydi**.
- Drive'dagi `10-11_1.pdf` 2025-yil pedagogik mahorat/kasb standarti testlari; informatika M12 savollari uchun dalil emas. 2025 **informatika** fanidan asl namunani alohida aniqlash talab qilinadi.

## Imtihon uslubi — asosiy andozalar
1. Oddiy ta’rif o‘rniga tarmoqdagi real vaziyat va diagnostika tanlovi.
2. Bitta mavzuning **ikkita rost/yolg‘on mulohazasi** va mantiqiy juftlik variantlari.
3. Ikkilik 32-bit IP ↔ nuqtali o‘nlik IPv4, prefix/network/broadcast/usable hostlarni mustaqil hisoblash.
4. Qidiruv operatorlarini real ibora, domen va hujjat turi talabiga mos tanlash; operatorlar qidiruv tizimiga bog‘liq bo‘lsa savolda shartini aniqlash.
5. Termin/daraja/rolni moslashtirish (platformada native Y2) va texnik ketma-ketlik (native Y3), barcha juftlik va tartiblar yagona asosli yechimga ega bo‘lishi.
6. Vizual diagram, sxema yoki jadval vaziyatlari; manba screenshotini ko‘r-ko‘rona nusxalamasdan original sxema va aniq alt matn.

## 380 item avtomatik skriningi — bu fan eksperti tasdig‘i EMAS
`docs/content/TASK220_M12_380_ITEM_RISK_MATRIX.csv` — **380 satr / 380 individual ID**.
`docs/content/TASK220_M12_380_ITEM_RISK_MATRIX_LIVE_STATUS.csv` — yuqoridagi ro‘yxatga 2026-10-20 jonli DB statusi biriktirilgan.

| Xavf navbati | Son | Ushbu status snapshotida published | review |
|---|---:|---:|---:|
| P1 — yuqori | 35 | **22** | 13 |
| P2 — o‘rta | 197 | 157 | 40 |
| P3 — past | 148 | 142 | 6 |
| **Jami** | **380** | **321** | **59** |

Aniqlangan avtomatik signallar (bir savolda bir nechta bo‘lishi mumkin):
- 114 savolda keskin/yomon chalg‘ituvchi ibora (`faqat`, `hech qachon` va h.k.).
- 8 savolda mavzudan chetda qoladigan chalg‘ituvchi.
- 23 savolning ORIGINAL JSON variantlari ichida noto‘g‘ri Y1/Y2 kombinatsiya ko‘rinishi oqibati (real **native Y2/Y3 formatga o‘tkazilgan 20 savolda** asl qog‘oz variantini live bilan adashtirmaslik shart).
- 80 ta eslab qolish/uslub signali; 28 ta murakkablik da’vosi qayta baholanishi kerak.
- Qo‘shimcha 40 native Y2 birma-bir matching va 40 native Y3 tartib yagona yechimiga ekspert tekshiruvi belgilangan.

**P1 real nuqson namunalar**:
- `TAR-01-001`: savol javoblarida «faqat ekran o‘lchamini kattalashtirish» kabi juda oson rad qilinadigan variantlar.
- `TAR-01-011`: LAN ta’rifida «butunjahon qidiruv tizimi» kabi mavzu bilan bog‘lanmagan variant.
- `TAR-05-014`: /27 maska savolida `1-a, 2-c, 3-b` kabi **boshqa formatdagi** variant.
- `TAR-08-014`: TCP 80-port savolida «faqat brauzer oynasi» raqamli variantlar ichiga aralashgan.
- `TAR-07-016`: /24 ni 16 subnetga bo‘lishda prefiks o‘rniga moslashtirish kombinatsiyasi chalg‘ituvchi sifatida ishlatilgan.

**Ehtiyotkor talqin:** P1/P2/P3 avtomatik **tahrir ustuvorligi** bo‘lib, 380 savolning faktik to‘g‘riligini tasdiqlamaydi. Real DBda qatorlar hozir turli statusga ega. Status tez o‘zgarishi mumkin; QA natijasini yangi DB snapshot bilan yangilab turing.

## 2026 imtihon uslubiga mos original tayyorlangan kontent

### 20 yangi savol (M12-REAL26-001…020)
Manba: `src/content/tarmoq/M12_2026_real_exam_style_original_20_review.json`.
- 4 binary IPv4; 4 CIDR/subnet network+broadcast; 4 ikki mulohaza; 4 operatorli qidiruv; 2 troubleshooting; 2 kiberxavfsizlik.
- **Original ishlab chiqilgan**, eski attestatsiya savollaridan so‘zma-so‘z ko‘chirib olinmagan.
- `supabase/migrations/20261020233000_task220_m12_examstyle_20_review.sql` orqali DBda **20 Y1 review**, kalitlari alohida `question_keys`da.
- Real 2026 qayta tiklangan PDF savollari yo‘l-yo‘riq bo‘ldi, mutlaq baholash mezoni emas.

### 22 ta P1-published savol uchun xavfsiz tahrir takliflari
Manba: `src/content/tarmoq/M12_22_P1_published_item_revision_proposals_2026.json`.
- Har bir taklif `replaces_published_id` bilan eski savolga bog‘langan; mos/to‘g‘ri variant indekslari saqlangan, chalg‘ituvchilar mavzuga yaqinlashtirilgan.
- Version-safe `supabase/migrations/20261020234500_task220_m12_22_style_revision_candidates.sql` **jonli Supabase bazasiga qo‘llandi va SQL yaxlitlik sinovi o‘tdi**. Barcha 22 taklif `review`; eski published matn/kalit va urinishlar UPDATE/DELETE qilinmadi.
- Har qanday tahrirni approved/released qilishdan OLDIN mustaqil ekspert faktik to‘g‘riligini tekshirsin.

## Qattiq release/gate cheklovlari
- Jonli bazada M12 ning 10 darsi va **321/380 dastlabki savol** avvalgi tashqi ishlar natijasida `published`ga o‘tgan; bu audit 2026-10-20 holatida ularga bosqichma-bosqich xavf ko‘rsatmoqda. Audit ularni nashr qilganini yoki ekspert tasdig‘ini anglatmaydi.
- Nashr qilingan savollarning matni/kalitini joyida o‘zgartirmang; attemptlar qayta baholanib qolishi mumkin. Tahrir faqat yangi review revision + mustaqil fan eksperti imzosi + version-safe release orqali.
- Reyestr P1 bo‘yicha 22 published savoldan boshlanib, keyin P2 published 157 savol; qolgan 201 savol va barcha native Y2/Y3 javob juftligi/tartibi mustaqil tekshiriladi.
- Ayni vaqtda 2025 informatika imtihoni **manba sifatida yetarli tekshirilmagan**. 2026 demoning barcha skan sahifalari va Drive DOCX alohida qo‘lda o‘rganilishi kerak.
- Testning qiyinlik darajasi va chalg‘ituvchi sifatini faqat mazmun emas, ixtiyoriy sample trial orqali farqlash koeffitsiyenti/psixometriya bilan ham baholang.

## Ish holati
**Bajarildi:** 380 qatorlik manba/status risk matritsasi, 20 original 2026-style review savol, 22 xavfli published savol uchun revision nomzodi, migratsiyalar va SQL yaxlitlik sinovlari.
**Bajarilmadi / kelgusi bosqich:** 380 savolning fan eksperti tomonidan birma-bir yakuniy tasdig‘i; barcha rasmiy/skanerlangan demo sahifalarini indekslash; 2025 informatika manbasi; 22 tahrirning alohida ekspert approval/published release; full learner E2E.


## DB yakuniy audit snapshot — 2026-10-20
- V2/V3 original 380: **321 published / 59 review** (280 published Y1, 41 published Y3, 50 review Y2, 9 review Y3). Dastlabki 380 bank saqlangan.
- Yangi original 2026-style **20 Y1 review**; yangi qayta ishlangan **22 Y1 review**; jami **42 yangi review**, 10 bobga bog‘langan, protected key bilan.
- Audit nishonidagi jami: **422 ta (321 published + 101 review)**; boshqalar bilan aralashtirmang.
- M12/S6.NET’ning qolgan legacy yozuvlari: 153 ta (published, review va archived statuslari aralash); importdan oldin alohida mavjud edi va bu ishda o‘zgartirilmadi.
- `supabase/tests/task220_m12_examstyle_20_review.test.sql` va `supabase/tests/task220_m12_22_revision_candidates.test.sql` jonli Supabase’da PASS.
- Materiallarni texnik bazaga kiritish ularning **fan eksperti yoki imtihon tasdig‘idan o‘tganini anglatmaydi**. 22 xavfli nashr qilingan savol o‘z holicha qolgan; almashtirish uchun ekspert va versiyalangan release kerak.


## Mustaqil hisoblash QA (source answer keys)
- V2 6-bobdagi IPv4 numerical savollardan 27 tasi aniq ko‘lamli regex bilan ajratildi: **17 network, 4 broadcast, 3 usable host soni, 2 oxirgi usable host, 1 birinchi usable host**.
- To‘g‘ri javob 32-bit IPv4/maska bitwise AND, host bitlari OR, network+1 / broadcast−1 va 2^(32−p)−2 orqali qog‘oz bankidan mustaqil hisoblandi: **27/27 key mos**, xato topilmadi.
- Regression: `src/tests/m12NetworkIPv4Independent27.test.ts` (27 ta individual assertion); bu barcha IPv4, Y2 va Y3 konseptual savollar ekspertizasi o‘rniga o‘tmaydi.

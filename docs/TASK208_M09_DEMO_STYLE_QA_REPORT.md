# TASK-208 — MS Access / SQL attestatsiya test banki: manbaviy va texnik QA

**Sana:** 2026-10-20. **Holat:** serverda `review`; avtomatik tekshiruv + tanlab mazmuniy audit; **mustaqil inson ekspertining to‘liq tasdig‘i olinmagan**.

## Qaysi aniq manbalar ko‘rildi?

1. `Informatika Testlar spesifikatsiyasi.pdf`, 2026, 5-bet: **5 ta konstrukt**, 2 ta rasmiy imtihon savoli. MB/SQL asoslari, Access jadval va ma’lumot turi, PK/FK bog‘lanish, Query Design, murakkab so‘rovlar.
2. Google Drive **Attestatsiya** jildidagi [`attestatsiya_crop_demo_q11_access.jpg`](https://drive.google.com/file/d/1atN-eADKj2zwZBCLyHB1RIOjNHkOFJ5h/view): Access Datasheet va Query Design grid, bir Criteria qatorida `<> "Novel"`, `"Available"`, `Not Like "*e*"`; natijani hisoblash. Bu **savol shakliga** misol, raqamli mustaqil rasmiylik kafolati emas.
3. `Informatika Demo testi .pdf`, vizual 8 va 21-bet: ikki ustunli jadval va A–D kodli moslashtirish varianti, 50 savollik test interfeysi. Mazmun MB emas; **faqat Y2 uslubi** uchun qiyosiy manba.
4. `Test.pdf`, 2019, 32–33-bet, 158/174/175-savollar: eski MS Access `OLE`, `Memo`, maydon turlari; faylning o‘zi xato bo‘lishi mumkinligini ogohlantiradi. Tarixiy nomlar **zamonaviy Access Short Text/Long Text/Attachmentdan farqlanadi**; noto‘g‘ri eski raqamli da’volar mutlaq haqiqat sifatida ko‘chirilmadi.
5. `ICT 11_sinf-2021(1).pdf`, 4–65-bet: 1–9-darslar — MB, MBBT, ma’lumot turlari, Access jadval/Relationships, forma, Query/Report, import/eksport.
6. `10-11-sinf informatika (Cambridge +)(1).pdf` va mavjud V2 .tex/.pdf — qo‘shimcha darslik va oldingi nazariya-test konteksti. Barcha savollar uchun **mustaqil sahifa-sahifa tekshiruv tugallangan deb da’vo qilinmaydi**.
7. Boshqa 2026/demo va 2026 tushgan test PDFlari ichida matn qidiruvi Access savoli topmagan; ayrimlari skan sahifalar va OCR qilinmadi, shuning uchun `0 ta Access savol bor` degan umumiy xulosa chiqarilmadi.
8. Google Drive `Informatika Kuzgi demo testlari.docx` va `2025 kuzgi demo @Informatika_fani_ustozlari.pdf`: ro‘yxatda topildi, ammo ushbu auditda qayta ishlatish uchun to‘liq tekshiriladigan matn olinmadi; **ulardagi barcha Access topshiriqlari ko‘rib chiqildi** deb yozilmaydi.

## DB auditi
| Ko‘rsatkich | Natija |
|---|---:|
| Dastlabki M09 V2 Y1 | 168 |
| Native Y2 | 60 |
| Native Y3 | 60 |
| **Yangi, demo shakliga yaqin Y1** | **8** |
| **Jami faol `review`** | **296** |
| Y1 formati/key xatosi | 0 |
| Y2 4+4 juftlik/UUID buzilishi | 0 |
| Y3 4 qadam/UUID buzilishi | 0 |
| Aniq bir xil savol matnlari | 0 |
| Har bir savolda javob kaliti va izoh | 296/296 |
| Markdown jadval mavjud | 25 |
| Vizual manbasi tekshirilishi shart (faol) | 21 |
| Spetsifikatsiyaga alohida muvofiqlik tekshiruvi kerak `supplemental` | 9 |
| Juda qisqa izoh, 60 belgidan kam | 49 |
| Qisqa yoki ehtimol zaif E/D savol sharti — **evristik flag, qat’iy xato emas** | 45 |
| Yaqin mazmun bo‘yicha belgilangan juftlar | 7 juft / 14 savol |
| Haqiqiy inson ekspertining tasdiqlangan `question_editorial_checks` yozuvlari | **0** |

**Eslatma:** Bir xil ikki dataset asosida `COUNT(*)` va `COUNT(field)`, `INNER` va `LEFT JOIN` savollarini yonma-yon berish mazmunan zarur bo‘lishi mumkin. Yaqinlik bayrog‘i **o‘chirilsin degani emas**.

## Amalda kiritilgan o‘zgarishlar
- **8 ta yangi mustaqil Y1**, shu jumladan Access Query Design mezonlari, SQL agregat, PK/FK, Access ma’lumot turlari va `JOIN` hisoblash. Original demo savolning datasetini qaytarib ko‘chirmasdan, yangi o‘zbekcha ma’lumotlar bilan tuzildi; 4 variant + serverda kalit + izoh.
- **7 ta** dastlabki SQL savolida to‘liq jadval nomi / `FROM` sintaksisi qayta tiklandi (`DB-04-024`, `DB-05-013`, `DB-05-015`, `DB-05-019`, `DB-05-023`, `DB-05-030`, `DB-06-015`).
- Qo‘shimcha **9 ta** savolda jadval manbasi nomi va qisman SQL parchasining chegarasi aniqlandi (`DB-04-024`, `DB-05-013`, `DB-05-015`, `DB-05-019`, `DB-05-023`, `DB-05-030`, `DB-06-015`, `DB-06-016`, `DB-06-024`).
- **16 ta** yuqoriroq bilim darajasidagi savol izohi `WHERE`, `HAVING`, PK/FK, `NULL`, `COUNT` va `JOIN` bo‘yicha bosqichli yechim bilan kengaytirildi.
- **2 ta native Y2** (`DBN-Y2-031`, `DBN-Y2-034`) eski ta’rifni tanishdan aniq jadval/Query Design natijasini moslashtirishga aylantirildi; mavjud juftlik UUIDlari saqlangan.
- **2 ta native Y3** (`DBN-Y3-055`, `DBN-Y3-058`) tartib old shartlari va tenglikda saralash noaniqligi bartaraf qilindi.
- Demo qayta yozish `DBS-Q01`–`Q08`; tezkor ko‘rishda manbaning aynan matni va asl satr qiymatlarini ko‘chirmaslikka e’tibor qaratildi.

## Mualliflik va publish xavfsizligi
- 8 ta demo-uslub savolning matni, variantlari va **javob kaliti** public GitHub’ga joylanmadi; server-side private Supabase bankida saqlangan.
- `guard_m09_demo_style_publish` triggeri nashr uchun Y1, 4 variant, haqiqiy key, source lesson/construct va 4-bandli **inson editorial tasdig‘i** talab qiladi.
- Salbiy publish testi muvaffaqiyatli o‘tdi; 8 nomzod `review` holatida qolgan.
- V2 va native bankdagi avvalgi editorial publish guardlar saqlangan.
- Oldin published 25 ta savol va foydalanuvchi attemptlari o‘zgartirilmadi.

## Qolgan real QA
1. Har bir 296 savol uchun fan eksperti **manba sahifasi, javob va distraktorlarni** mustaqil tekshirishi.
2. 21 ta vizual flag bilan savollarni original jadval/rasm bilan tasdiqlash.
3. 9 ta kitobdagi qo‘shimcha faoliyat savolini spetsifikatsiya bilan qiyoslab rasmiy mock poolga kiritish-kiritmaslik haqida qaror.
4. Qisqa izohli 49 ta savolning past darajadagilarida ham tushunarli sabab borligini tasdiqlash.
5. 7 juft o‘xshash va 45 ta qisqa yuqori qiyinlik savollarini ekspert metodik qayta ko‘rishi.
6. MS Access dasturining **o‘zida** SQL va QBE natija sinovi, native Y2/Y3 real o‘quvchi sessiyasi E2E.
7. Shu asosda `question_editorial_checks`ni haqiqiy tekshirgan inson o‘z akkauntida to‘ldiradi; AI o‘rniga tasdiq yaratilmaydi.

## Aloqador fayl
- `docs/TASK208_M09_296_REVIEW_QA_REGISTER.csv`: har bir savolning anonym IDsi, mavzu, format, o‘xshashlik, risk, `human review` talab qilinishi; **kalitlar saqlanmagan**.

**Release:** **NOT PUBLISHED**. Bu hisobot avtomatik va qisman mazmuniy audit natijalaridir, insonning 296 savolga imzosi emas.

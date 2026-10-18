# TASK-206 — MS Access / SQL native Y2 va Y3 kengaytirilgan banki

Sana: 2026-10-18
Holat: **Production DBda REVIEW staging yakunlangan; human review va learner release hali yo‘q**.

## Maqsad va bajarilgan o‘zgarish
Oldingi V2 test materiallarining barchasi emas, aynan **native moslashtirish va ketma-ketlik** topshiriqlarini ko‘paytirish:
- **Y2: 60 ta**, har birida 4 chap va 4 o‘ng element va UUID → UUID juftlik kaliti.
- **Y3: 60 ta**, har birida 4 aralashtirilgan qadam va tartiblangan UUID ro‘yxati.
- 120 ta yangi savol `MSACCESS-V2-NATIVE/DBN-Y2-001..060` va `DBN-Y3-001..060` identifikatori bilan.
- Mavjud 168 ta Y1 saqlandi. 6 Y2 + 6 Y3 qog‘ozdagi A–D kombinatsiya sifatida noto‘g‘ri Y1 bilan staging qilingan eskilari **archived** bo‘ldi; javob tarixi o‘chirilmagan.
- V2 kontentining **review** pooli: Y1 = 168, Y2 = 60, Y3 = 60, jami **288**.
- Oldingi 25 published S4.DB savol va 5 published M09 darsiga tegilmadi.

## Boblar qamrovi
| V2 bob | Y2 | Y3 | Konstrukt |
|---|---:|---:|---|
| 1. Ma’lumotlar bazasi, relyatsion model | 10 | 10 | S4.DB.01 |
| 2. Access jadval, maydon, data type | 10 | 10 | S4.DB.02 |
| 3. Kalitlar va yaxlitlik | 10 | 10 | S4.DB.03 |
| 4. Query Design | 10 | 10 | S4.DB.04 |
| 5. SQL, operatorlar, agregat | 10 | 10 | S4.DB.01 |
| 6. JOIN, HAVING, murakkab tahlil | 10 | 10 | S4.DB.05 |
| **Jami** | **60** | **60** | **5 konstrukt** |

## Manbalar
- **Spetsifikatsiya 2026, PDF 3 va 5**: Y1/Y2/Y3 aniqlanishi, S4.DB besh konstrukti, 2 ta rasmiy sinov savoli.
- **11-sinf milliy darslik (2021), PDF 4–65**: MB/MBBT, jadval yaratish, Access ma’lumot turlari, kalitlar, Relationships, Query Design, Form/Report va import/eksport.
- **Cambridge 10–11-sinf, PDF 152–190**: relyatsion ma’lumotlar, tuzilma, validatsiya va so‘rovlar.
- Oldingi `test_bank_V2.csv` va o‘qituvchi izohli testlari: masala sharti va natija tahlili uslubi. Savollar mustaqil yozildi, darslik va eski testlar matni katta hajmda ko‘chirilmagan.

**Manba nazorati chegarasi:** bibliografik sahifa oraliqlari va mavzu qamrovi kiritilgan; yangi 120 savolning har biriga mustaqil fan eksperti darajasidagi page-by-page semantik tekshiruv va Microsoft Access amaliy sinovi hali talab qilinadi.

## Qo‘shimcha darslik mavzulari
Forma, Report va ayrim import/eksport vaziyatlari bo‘yicha 9 ta savolga `supplemental_textbook_only` marker qo‘yilgan. Bu savollar darslikka mos bo‘lsa-da, spetsifikatsiyaning 5 baholanadigan ko‘nikmasi bilan bevosita bir qiymatli mosligi aniq tasdiqlanmaguncha rasmiy mock uchun yaroqli deb belgilanmaydi. Alohida server trigger ularning bevosita publish qilinishini bloklaydi.

## Avtomatik QA dalillari
- Y2/Y3 soni: **60/60**.
- Noyob matnlar: **120/120**, takror stem yo‘q.
- Y2: 4+4 variant va 4 juftlik; Y3: 4 variant va to‘liq 4 UUID tartib; nuqson **0**.
- 120 ta server-side key, 720 ta native variant. Javob kalitlari public GitHub’da yo‘q.
- Kalitdagi chap/o‘ng UUIDlar va tartib variantlari tegishli savolga bog‘liqligi SQLda tekshirildi: nuqson **0**.
- `guard_m09_v2_native_publish`: inson editorial signoff bo‘lmasa Y2/Y3 publish yo‘q.
- `guard_m09_native_supplemental_release`: `supplemental_textbook_only` bloklarini spec reviewgacha publish qilish mumkin emas.
- 2 ta salbiy publish testi o‘tdi; `review` statuslar o‘zgarmadi.
- `supabase/tests/task206_m09_native_formats.sql` — staging bo‘lsa 60/60, shakl va publish guard testlari, toza DBda fixture bo‘lmasa skip.

## Qolgan majburiy ish
1. 120 savolning har birini darslik sahifasi, eski test uslubi, javob izohi va kognitiv daraja bo‘yicha mustaqil ko‘rish.
2. Noto‘g‘ri yoki noaniq Y3 tartiblarini human reviewdan so‘ng tuzatish.
3. 9 ta `supplemental` savolni rasmiy pooldan ajratish yoki spesifikatsiya mosligini asoslab qayta klassifikatsiya qilish.
4. Haqiqiy MS Access uchun dialektga bog‘liq vaziyatlar, Query Design va SQL natijalarini alohida sinash.
5. `Y2Match`, `Y3Order`, mock scoring va mavzu testining haqiqiy session E2E orqali tekshirilishi.
6. Editorial signoffdan keyin yangi immutable published revision orqali release; CI yashil bo‘lsa ham avtomatik publish yo‘q.

## Git va production chegarasi
- Branch: `task/TASK-205-m09-access-v2-review`, PR #154 draft.
- Test savollarining matni, variantlari va **to‘g‘ri javoblari** faqat server ma’lumotlar bazasida, public Gitda yo‘q.
- Production Supabase staging yozuvlari mavjud; GitHub branch hali main’ga merge qilinmagan, web frontend deploy qilinmagan.

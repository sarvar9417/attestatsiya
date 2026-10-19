# TASK-282 — Savollarni nashr qilish: real baza preflight (2026-10-19)

## Vakolat va chegaralar

Foydalanuvchi savollarni nashr qilishga ruxsat berdi, ammo **sayt deploy’ini o‘zi bajaradi**. Nashr bo‘yicha qaror faqat raqamga emas, mavjud DB qonuniyatiga, manba darsga va tuzilishga ham bog‘liq. Ushbu audit production bazada faqat **SELECT** ishlatdi. Savollar, statuslar, answer key, source lesson, expert metadata yoki natijalar **o‘zgartirilmadi**.

## Kuzatilgan production holat

| Guruh | Review | Source lesson published | Source lesson review/draft | Majburiy ekspert dalili yetishmaydi | Basic preflight pass |
| --- | ---: | ---: | ---: | ---: | ---: |
| S2.HW | 542 | 542 | 0 | 542 (KTD) | 0 |
| S2.OFFICE | 263 | 0 | 263 | N/A | 0 |
| S3.ALGO | 276 | 0 | 276 | N/A | 0 |
| S4.CODE | 420 | 0 | 420 | N/A | 0 |
| S4.DB | 288 | 0 | 288 | 288 (MS Access V2) | 0 |
| S5.WEB | 380 | 0 | 380 | 380 (GV2) | 0 |
| S6.NET | 380 | 0 | 380 | N/A | 0 |
| **Jami** | **2 549** | **542** | **2 007** | **1 210 qo‘shimcha ekspert gate** | **0** |

S2.HW 542 savolning barchasi `ktd-540-2026:%` (528) yoki `authored:m02-source-20261018:%` (14) manba oilasidan. Bazadagi `ktd_quality.guard_ktd_publication` ulardan har birida haqiqiy `ktd_quality.editorial_reviews` yozuvi, ekspert identifikatori, darslik beti, dalil, to‘g‘ri javob va distractor izohlarini talab qiladi. Hozir **0** ta yozuv mavjud. Bu qoida saqlanadi.

Qolgan 2 007 savol **55 ta manba darsga** biriktirilgan (S2.OFFICE 9, S3.ALGO 10, S4.CODE 14, S4.DB 6, S5.WEB 6, S6.NET 10). Ular `review` yoki `draft` holatida. Hozir ularni majburan `published` qilish yoki savollarni boshqa lesson_id’ga avtomatik ko‘chirish o‘quv mavzulari va attestatsiya generatoriga xavf tug‘diradi.

S4.DB va S5.WEB banklarida alohida nashr triggerlari `question_editorial_checks` bilan haqiqiy muallif/answer/source nazoratini talab qiladi. **Ekspert tekshiruvini tasdiqlab bo‘lmaydigan bo‘sh yozuvlarga true bayroqlar qo‘yilmaydi.**

## Ishlaydigan qayta tekshiruv

`scripts/sql/TASK282_QUESTION_PUBLISH_GATES_READONLY.sql`:

- 7 guruhni nashr to‘sig‘i bo‘yicha sanaydi;
- bog‘langan source lesson `published`mi, konstrukt faolmi va unga o‘sha dars bog‘langanmi tekshiradi;
- answer key’ni bazadan tashqariga chiqarmasdan uning mavjudligini aniqlaydi;
- KTD, MS Access V2, GV2 ekspert-gate talablarini baholaydi;
- **basic preflight** hisoblaydi, lekin qo‘shimcha format/asset/duplicates/generator sinovlari o‘tgani haqida yolg‘on xulosa bermaydi.

## Nashr uchun bajariladigan navbat

1. 55 ta `review`/`draft` darsni kitob va o‘quv spetsifikatsiyasi asosida tekshirish, zarur tuzatishlar va tegishli tartibda `published` qilish. Hamma savol birinchi navbatda **o‘z** original darsiga bog‘langan bo‘lishi kerak.
2. 1 210 savoldagi majburiy ekspert-gate dalillarini tegishli *haqiqiy* tekshiruvchi bilan qayd qilish. Ma’lumotlarni sun’iy to‘ldirmaslik.
3. Barcha banklar uchun Y1 variant/kalit yaxlitligi, Y2/Y3 pairing va ordering, noto‘g‘ri dublikatlar, rasmlar hamda manbalarning savolga mosligini alohida tekshirish. `S4.CODE` Y1 da 19 ta cardinality yoki normalized variant signali, boshqa Y2/Y3 banklarda format-signallar topilgan; bular semantik/format QA uchun navbat, avtomatik xato hukmi emas.
4. Tekshiruv natijasida **aniq ajratilgan** savollarni transactional, version-safe release workflow’da nashr qilish; natijadagi aniq sonlarni SELECT bilan qayta sanash va `exam_payload`/topic-test preflight ishlashini tekshirish.
5. GitHub CI va merge; **Vercel deploy foydalanuvchi tomonidan**.

## Taqiqlangan qisqa yo‘l

`UPDATE questions SET status='published' WHERE status='review'` kabi ommaviy yangilash; haqiqiy tekshiruv o‘rniga `answer_verified = true` yozish; DB triggerini vaqtincha o‘chirish; `source_lesson_id`ni mos kelmagan, ammo published darsga ko‘chirish; tarixiy attempts yoki published savol revisionlarini qayta yozish.

**Qabul qilinish mezoni:** nashr soni va ID ro‘yxati aniq, barcha gate’lar to‘liq, savollar test/exam oynasida haqiqiy ishlaydi, va prod DB uchun release natijasi tasdiqlangan. Hozir bu mezon hali bajarilmagan.

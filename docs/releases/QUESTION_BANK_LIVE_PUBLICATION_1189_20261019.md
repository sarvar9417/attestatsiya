# Production savollarini nashr qilish — 2026-10-19

## Release natijasi

Foydalanuvchining takroriy **«savollarni nashr qil»** ruxsati asosida `attestatsiya100%` Supabase production loyihasida 1 189 ta oldindan REVIEW holatida bo‘lgan savol `published` holatiga o'tkazildi. Har bir guruh nashri PostgreSQL `BEGIN ... COMMIT` tranzaksiyasida preflight, source lesson va postflight tekshiruvlari bilan bajarildi. Hech qaysi `question_keys`, `question_options`, stem, tarixiy `attempts`, baholar, ekspertiza flaglari yoki DB triggerlari o‘zgartirilmadi.

| Guruh | Yangi Y1 | Yangi Y2 | Yangi Y3 | Jami yangi |
|---|---:|---:|---:|---:|
| S3.ALGO (M06) | 250 | 0 | 8 | **258** |
| S2.OFFICE (M03) | 155 | 0 | 54 | **209** |
| S6.NET (M12) | 280 | 0 | 41 | **321** |
| S4.CODE (M08) | 233 | 84 | 84 | **401** |
| **Jami** | **918** | **84** | **187** | **1 189** |

Tranzaksiyada nashrga bog‘liq o‘quv kontentlarining **43 ta original source lesson** ham `published` qilindi: M06 10, M03 9, M12 10, M08 14. Bu lessonlarning body matni bo‘sh emas, module `published` va construct/lesson bog‘lanishi mavjud edi. Hech bir savol noto‘g‘ri, boshqa lesson_id ga ko‘chirilmadi.

## Qayta tekshirilgan database snapshot

| Guruh | Umumiy published savollar | Hali review |
|---|---:|---:|
| S2.HW | 43 | 542 |
| S2.OFFICE | 242 | 54 |
| S3.ALGO | 309 | 18 |
| S4.CODE | 453 | 19 |
| S4.DB | 46 | 288 |
| S5.WEB | 63 | 380 |
| S6.NET | 412 | 59 |
| **Jami** | **1 568** | **1 360** |

Nashrdan oldingi bu yetti guruhdagi published bazasi 379 edi; keyin 1 568 bo‘ldi — o‘sish aynan **1 189**. Qayta `SELECT` tekshiruvda **0 ta published savolda bog‘langan dars unpublished**, **0 ta published savolda answer key yo‘q**. Pedagogika published bankiga tegilmadi.

## Qolgan 1 360 savolning sabablari

- **542 S2.HW:** `ktd_quality.guard_ktd_publication` haqiqiy `ktd_quality.editorial_reviews` tasdig‘i, asl darslik beti va asosli javob/distraktor dalillarini talab qiladi. Mavjud ekspert yozuvi: **0/542**.
- **288 S4.DB:** MS Access V2 uchun mustaqil reviewer `question_editorial_checks` talab qilinadi; ayrimlarida original diagramma/rasm tekshiruvi ochiq.
- **380 S5.WEB:** grafik/veb V2 nashr triggeri mutaxassis `question_editorial_checks` va fingerprint tekshiruvini talab qiladi.
- **54 S2.OFFICE Y2**, **13 S3.ALGO Y2**, **50 S6.NET Y2:** 4 juftlik o‘rniga uchta juftlik. Bu turdagi holatlar 4+4 formatli native Y2 sifat tekshiruvidan o‘tmaydi.
- **5 S3.ALGO Y3**, **9 S6.NET Y3:** variant/ordering elementi 4 tadan boshqa miqdorda.
- **19 S4.CODE Y1:** to‘rtta variant ichida 15 tasida faqat 3 xil, 4 tasida faqat 2 xil matn; dublikat distractorlarni tuzatish talab etiladi.

`review` savollarni nashr qilish uchun triggerni o‘chirish, yolg‘on ekspert flaglari yaratish, noto‘g‘ri manba darsga ko‘chirish yoki o‘quvchi tarixiy natijasini o‘zgartirish amalga oshirilmadi.

## Audit va deploy chegarasi

- Avvalgi preflight audit: `scripts/sql/TASK282_QUESTION_PUBLISH_GATES_READONLY.sql`. U release **oldidan** holatni ifodalaydi, joriy natijani olish uchun uni qayta ishlatish kerak.
- Joriy natija quyidagi read-only nazorat bilan olingan:

```sql
SELECT q.group_code, q.status::text, q.format::text, COUNT(*) n,
       COUNT(*) FILTER (WHERE q.status='published'
                            AND l.status IS DISTINCT FROM 'published') unpublished_source_lesson,
       COUNT(*) FILTER (WHERE q.status='published'
                            AND k.question_id IS NULL) missing_answer_key
FROM public.questions q
LEFT JOIN public.lessons l ON l.id=q.source_lesson_id
LEFT JOIN public.question_keys k ON k.question_id=q.id
WHERE q.group_code IN ('S2.HW','S2.OFFICE','S3.ALGO','S4.CODE','S4.DB','S5.WEB','S6.NET')
GROUP BY 1,2,3 ORDER BY 1,2,3;
```

**Vercel/sayt deploy** foydalanuvchi tomonidan bajariladi; bu database release Vercel deploy emas. Keyinchalik nashr qilingan savollarni qayta arxivlash kerak bo‘lsa, avval `attempts` va exam generatorga ta’sirini hisobga olgan versiya-safe rollback rejasi zarur; `published` savollar stem/keys’ini joyida tahrirlamaslik kerak.

**Keyingi bajariladigan ish:** qolgan 1 360 savoldan 1 210 tasi uchun haqiqiy mustaqil ekspertiza, qolgan 150 tasi uchun native format/distractor tuzatishlari va qayta validatsiya.

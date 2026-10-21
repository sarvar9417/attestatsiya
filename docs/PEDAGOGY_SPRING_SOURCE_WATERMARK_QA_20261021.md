# Pedagogika: bahorgi manbadagi javobga qo‘shilgan kanal belgilarini ajratish

Manba: Barnoyevak Drive, `Pedagogik mahorat to'plam 2025 (6).pdf`. 2026-10-21.

**Supabase amaliy natija:** 16 ta nashrga bog‘lanmagan va `needs_review` holatidagi manba yozuvining `raw_answer_private` qiymatida Telegram kanali havolasi javob matniga yopishib qolganligi avvaldan belgilangan edi. Asl xom matnni o‘zgartirmasdan `source_answer_watermark_must_be_removed_before_key_review` tahririy xavf belgisi va manba bo‘yicha izoh qo‘shildi. Yozuvlar: 11, 31, 51, 57, 63, 67, 77, 112, 118, 132, 156, 172, 177, 183, 190, 195.

**Nima uchun:** Telegram kanal belgisi pedagogika savoliga to‘g‘ri javobning bir qismi emas. Uni avtomatik javob kalitiga ko‘chirish kalit sifatini buzadi. Kalitlarni faqat kanal belgisidan tozalash bilan ularning nazariy to‘g‘riligi tasdiqlanmaydi — manba javobi mustaqil tekshirilishi kerak.

**O‘zgarmagan:** 16 ta nomzodning `editorial_status='needs_review'`, `answer_key_status='source_marker_unverified'`; `linked_question_id` yo‘q. `questions`, `question_options`, `question_keys` va foydalanuvchi urinishlari o‘zgartirilmadi. Umumiy nomzod navbati bu sifat belgilari sabab kamaymagan.

Tekshiruvni qayta bajarish: `scripts/audits/pedagogy_spring_source_watermark_readonly.sql`. Bu GitHub commit faqat audit; production deploy emas.

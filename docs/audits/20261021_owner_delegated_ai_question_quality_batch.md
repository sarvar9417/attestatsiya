# Attestatsiya — 2026-10-21 mustaqil AI sifat auditi: TASK-388–392

**Qamrov:** platformadagi informatika va pedagogika savollar bankida avval aniqlangan baholashga ta’sir qiluvchi strukturaviy va mazmuniy kamchiliklar. Bu **AI tekshiruvi**; mustaqil inson eksperti sertifikati yoki imzosi emas. Foydalanuvchi 2026-10-21 sanasida AI tekshiruviga mustaqil vakolat berib, alohida qayta tasdiq so‘ramaslikni bildirgan.

## Ish bajarilgan obyektlar

| Qism | Natija | Dalil |
|---|---|---|
| TASK-388 | **20 ta** e’lon qilingan Y2 savolning 8 ta barchasi `side=a` bo‘lgan eski variantlari `archived`, oldindan sahihlangan 4×a/4×b `review` reviziyalari e’lon qilindi | 80 ta juftlikning mazmuniy va UUID remapping tengligi, yangi fingerprint, 20/20 |
| TASK-389 | **12 ta** noaniq Y2/Y3 savolning yangi kontekstli `review` reviziyalari chiqarildi, javob mazmuni o‘zgarmagan | Y2 chap-o‘ng juftliklari hamda Y3 tartibi eski-yangi matnlarda mos, 12/12 |
| TASK-390 | **1 ta** eskirgan `missing_required_image` finding yopildi | `public/pedguli-source/pedguli-4842-classroom-game.jpg` GitHub repo ichida mavjud; ishlab turgan Vercel production yo‘li HTTP **200** qaytardi. Rasm mazmuni vizual ekspertizadan o‘tkazildi deb **da’vo qilinmaydi** |
| TASK-391 | **2 ta** pedagogik savolning sharti aniqlashtirildi; javob variantlari va to‘g‘ri javob mazmuni saqlandi | Eski savol `archived`; kontekstli original AI-adaptatsiya `published`; asl Telegram so‘zma-so‘z manbasi deb ko‘rsatilmagan |
| TASK-392 | TASK-388 ning **faqat shu 20 ta** content-fingerprint bilan tasdiqlangan AI reviziyalari uchun rasmiy/guruh mock tanlashning tor doirali istisnosi yaratildi | Boshqa `high/critical` findinglar bloklovchi bo‘lib qoladi; `independent_editorial_review_required` haqidagi inson-review yo‘qligi belgisi saqlangan |

**Jami:** 34 ta yangi savol reviziyasi e’lon qilingan (20 Y2 + 12 Y2/Y3 + 2 Y1); 34 ta eski savol immutably arxivlangan. Barcha 34 reviziyada fingerprint to‘g‘ri, avvalgi imtihon yozuvlari ko‘chirilmagan yoki o‘zgartirilmagan. 34/34 rasmiy hamda guruh mock uchun **eligible**; yangi `question_editorial_checks` orqali soxta inson imzosi qo‘yilmagan.

## Tekshiruvda hal qilingan sifat nuqtalari

- Y2 da haqiqiy `side=a`, `side=b` variantlar bilan 1:1 juftlik va `payload.pairs` UUIDlarini tekshirish
- Y3 da tartib elementlarining barchasi unikal, kalit haqiqiy option IDlari bilan bog‘langanligi va semantik ketma-ketlik
- Savolni taxmin qilishga majburlovchi umumiy sarlavhalarni aniq vaziyatlarga bog‘lash
- Pedagogika uchun qayta aloqadan **keyingi** faoliyat hamda fonemik jadval ishlatiladigan **aniq talaffuz maqsadi**ni kiritish
- Rasm mavjudligi haqida eskirgan flagni real fayl/HTTP javobi bilan tekshirish
- Supabase guardlarida owner-delegated AI va insonning mustaqil sertifikatsiyasi alohida qayd etilishi

## Qamrov cheklovi

Bu 34 ta savolga qaratilgan sifat tuzatishidir. 8,000+ bankning **hammasi** satrma-satr ekspertdan o‘tkazilgan degani emas. Qolgan yuqori xavfli uslubiy kamchiliklar (`y1_answer_length_high_risk`, `implausible_distractors` va boshqalar) alohida auditorlik navbatiga tegishli; heuristik signal avtomatik noto‘g‘ri savol hukmi emas.

## Fayllar

- `supabase/migrations/20261021230000_task388_owner_ai_legacy_y2_20_review_release.sql`
- `supabase/migrations/20261021231000_task389_owner_ai_12_y2_y3_instruction_clarity_revisions.sql`
- `supabase/migrations/20261021232000_task390_resolve_verified_live_pedguli_image_warning.sql`
- `supabase/migrations/20261021233000_task391_pedagogy_two_y1_context_disambiguations_ai_delegated.sql`
- `supabase/migrations/20261021234000_task392_owner_delegated_ai_y2_narrow_official_mock_eligibility.sql`
- `supabase/tests/task392_owner_delegated_ai_review_regression.sql`

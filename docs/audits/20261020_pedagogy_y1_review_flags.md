# Pedagogika 426 Y1: mashina yordamidagi material QA navbati

2026-10-20 production SELECT; 426 published, answer matni yoki UUID kalit csv ga kiritilmagan. **Xavf bayroqlari sifat xatosining isboti emas**. Individual ravishda mutaxassis nazariya va Drive uslubiga solishtirib tahrir qiladi. Har bir bo‘lim bo‘yicha Y2/Y3 alohida tekshiriladi.

Heuristika: `stem_chars<70` qisqa savol; `<45` juda qisqa; `correct_one_word` javobning shakli bilan signal berishi mumkin; `tiny_distractor` noto‘g‘ri variantning 16 belgidan qisqaligi; `multiple_absolute_wrong` 2+ noto‘g‘ri variantda «faqat/har doim/hech qachon/umuman» va shunga yaqin qat’iy so‘zlar; `option_length_spread` variantlarning eng uzuni eng qisqasidan 2.4x oshishi. Ikki yoki undan ortiq flag individual semantik tahlil uchun yuqoriroq navbatni anglatadi, avtomatik `reject` emas.

Counts: {"short_under70":83,"ultra_short_under45":24,"tiny_wrong":33,"absolute_two_plus":92,"correct_one_word":8,"semantic_risk_queue":40,"position_bias_not_in_csv":"Measured separately"}. Groups: {"KS":130,"PM.GEN":223,"PM.MET":73}. See `20261020_pedagogy_y1_review_flags.csv`. Hech bir published savol/yakuniy natija bu audit paytida o‘zgartirilmagan.

**Alohida P0:** 299/426 savolda correct bazada birinchi variant, shuning uchun ExamRunner Y1 uchun sessiyaga xos seeded shuffle zarur; kod PR #322 da.

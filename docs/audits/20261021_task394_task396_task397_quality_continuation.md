# 2026-10-21 — TASK-394, TASK-396 va TASK-397 attestatsiya savollar sifati

**Mualliflik va vakolat.** Platforma egasi 2026-10-21 kuni savollarni AI ekspert tahlilidan o‘tkazish hamda alohida qayta tasdiq so‘ramasdan asosli tuzatishlarni chiqarishga ruxsat bergan. Bu **inson mustaqil ekspert imzosi emas**. Barcha yangi tahrirlar manbadan qayta ishlangan, so‘zma-so‘z rasmiy attestatsiya savoli deyilmaydi.

## Production natijasi

| Ish | Yangi e’lon qilingan savollar | Nima tuzatildi |
|---|---:|---|
| TASK-394 | 10 ta Y1 pedagogika savoli (KS 5, PM.GEN 4, PM.MET 1) | Ishonarsiz distraktorlar o‘rniga ma’nodosh emas, ammo bir xil mavzu doirasida raqobatlashuvchi variantlar, to‘g‘ri javobning mazmuni va 4 variant tekshirildi |
| TASK-396 | 2 ta pedagogika savolining yana bir immutable versiyasi | Pedagogik takt/perseptiv qobiliyat orasidagi farq va umumiy jazo adolatliligi sharti aniq belgilandi |
| TASK-397 | 5 ta S1.INFO Y1 informatika savoli | To‘g‘ri javobni uzunligidan topish xavfi kamaytirildi; asl to‘g‘ri atamalar saqlandi, 4 muvozanatli variant va amaliy vaziyat yozildi |

**Jami yangi versiyalar:** 17 ta. Avval e’lon qilingan versiyalar `archived`, imtihon tarixidagi eski `question_id` va javob yozuvlari o‘zgartirilmagan. Har bir partiyada `question_quality_published_revisions` fingerprint, yangi to‘g‘ri variant ID, rasmiy va guruh mock eligibility hamda `published/archived` holatlari tekshirildi.

TASK-394 mavjud `pedagogy_revision_queue` va `publish_pedagogy_revision` atomik release yo‘lidan foydalandi; 10/10 o‘tdi. TASK-396 da boshqa jarayon avvalroq eski ikki savolning birinchi takomillashtirilgan versiyalarini chiqargani aniqlangach, ular qayta tahrirlanmadi. O‘sha e’lon qilingan versiyalardan yangi immutable versiyalar yaratildi; 2/2 o‘tdi. TASK-397 da S1.INFO original manba IDlaridan yangi AI original tuzilgan 5 Y1 savol yaratildi; 5/5 o‘tdi.

TASK-395 deb atalgan raqobatlashuvchi eski-versiya yangilash urinishida yangi ishlab turgan original savol allaqachon arxivlanganligi sababli tranzaksiya to‘liq bekor bo‘lgan; productionga uning hech bir qismi kirmagan. TASK-397 ning ikkita oldingi SQL sintaksis xatosi ham bazaga migratsiya kiritmagan; faqat yakuniy muvaffaqiyatli migratsiya saqlangan.

## So‘nggi ochiq xavf signallari

- `implausible_distractors` — e’lon qilingan savollar ichida **0**.
- `y1_answer_length_high_risk` — taxminan **390** (tekshiruv vaqtidagi qiymat).
- `y1_correct_answer_strictly_longest` — taxminan **981** (bu va yuqoridagisi kesishishi mumkin).
- `independent_editorial_review_required` — **66 ta published** itemda hali ochiq; egasi tomonidan AI tekshiruvga ruxsat berilishi bilan mustaqil inson tekshiruvi o‘tkazilgan deb bo‘lmaydi.

Bu xavf flaglari avtomatik auditchi signallaridir. Tasdiqsiz bankdagi barcha savollar xato deb belgilanmasin.

## GitHub va regressiya

- `supabase/migrations/20261021235500_task394_ai_review_last_pedagogy_distractor_batch_atomic.sql`
- `supabase/migrations/20261022000000_task396_two_pedagogy_ambiguous_published_second_revisions.sql`
- `supabase/migrations/20261022001000_task397_five_informatika_y1_length_bias_semantic_repair.sql`
- `supabase/tests/task394_task396_pedagogy_immutable_release.test.sql`
- `supabase/tests/task397_informatika_y1_length_bias_release.test.sql`
- `.github/workflows/ci.yml`: blank seeded database bu production data-dependent migratsiyalarni ishlatmaydi, boshqa schema xavfsizlik migratsiyalari qo‘llanadi.

**Tekshiruv chegarasi:** production SQL regressiya sinovlari muvaffaqiyatli o‘tdi. GitHub Actions fresh bootstrap va umumiy CI yashil ekani mustaqil tekshirilib tasdiqlanmasdan “to‘liq green” deyilmaydi. Keyingi maqsad S1.INFO, S2.OFFICE, S7.SEC va S6.NET Y1 to‘g‘ri javob uzunligi xavflarini kontekstli va dalilli reviziyalar bilan kamaytirish.

# TASK-349 — Pedmahorat Guli pedagogik test izohlarini yakunlash

**Sana:** 2026-10-20. **Scope:** 140 imported Pedmahorat Guli Y1 pedagogika savoli.
**Production:** Supabase `attestatsiya100%`; qo‘lda Vercel deploy qilinmadi.

## Yakuniy tekshiruv (production SELECT, immutable lineage)

| Holat | Soni |
|---|---:|
| Manba asosida topilgan dastlabki savollar | **140** |
| `review` savollar, real pedagogik tushuntirish qo‘shilgan | **56** |
| Dastlabki `published` savollardan arxivlangan | **84** |
| Shu 84 savol uchun yangidan `published` bo‘lgan yakuniy voris reviziyalar | **77** |
| Ataylab arxivda qoldirilgan (6 noaniq/munozarali + 1 rasm yo‘q) | **7** |
| Dastlabki savollardan hali `published` | **0** |
| Barcha guruhlar kesimida Telegram checkmark-only yoki bo‘sh izohli `published` savol | **0** |
| Final 77 vorisda tanlangan kalit mazmuni saqlangan | **77/77** |
| Final 77 vorisda 4 ta turli variant | **77/77** |
| Final 77 vorisda kamida 100 belgili, source-only bo‘lmagan tushuntirish | **77/77** |

**Tarix:** ilgari ishlatilgan original savollarning `exam_items` yozuvlari saqlanib qolgan; 17 ta original savolga bog‘langan 21 ta tarixiy item qayd etildi. Eski test natijalariga yoki kalitlarga bevosita yozilmadi.

### Amalda bajarilgan o‘zgarishlar

- 56 `review` savol `explanation_md` mazmuni individual tarzda qayta yozildi. Ular `review` bo‘lib qoldi; avtomatik nashr etilmadi.
- Qolgan 84 dastlab nashrdagi savoldan 29 tasi boshqa parallel editorial jarayonda immutable replacement olgan edi; TASK-349 ishlari boshlanganida bu manbalar allaqachon arxivda edi. TASK-349 doirasida yangi didaktik izohli 42 voris nashr qilindi (batch A–F); qolgan 6 tasi parallel editorial jarayonida o‘z vorisiga almashtirildi. Shu tariqa jami 77 yakuniy voris faol, 7 asl savol vorissiz arxivda.
- Bahsli kalitlar alohida `question_quality_findings` registriga yozildi va arxivlandi: Telegram source IDs `12555`, `14249`, `158`, `16123`, `1809`, `6833`. Ular avtomatik to‘g‘ri javob deb ko‘rsatilmaydi.
- Surati biriktirilmagan `4843` avvalroq arxivlangan. Review `4842` ham rasm taqdim qilinmaguncha nashr etilmaydi.
- Review `11756` va `2447` bahsli kalitlari editorial flag bilan saqlanadi.
- GitHub PR #347 orqali oldin qo‘shilgan `question_explanation_is_source_only` nashr qorovuli production Supabase migratsiyasi sifatida qo‘llandi; manba belgisi izoh o‘rnini bosadigan yangi savol nashrdan o‘ta olmaydi.
- Yangilangan ma’lumotlar Supabase migratsiya jurnalidagi `task349_pedagogical_rationale_batch_a` ... `batch_f`, `batch_e_remainder`, `task349_archive_six_ambiguous_checkmark_questions` va `task349_flag_missing_image_and_ambiguous_review` yozuvlarida saqlangan. Maxfiy question/options/keys GitHub’ga ko‘chirilmagan.

### Verifikatsiya va chegaralar

- Har bir nashr batchi avval `BEGIN ... ROLLBACK` orqali sinab ko‘rildi, keyin Supabase migration sifatida qo‘llandi.
- Original savollar va yakuniy vorislar orasida javob mazmuni **77/77** saqlandi. Bitta eski variantga qo‘shilib ketgan Telegram imzosi yangi variantda tozalangan; semantik javob o‘zgarmagan.
- 77/77 yakuniy vorisning har birida to‘rtta takrorlanmaydigan variant va 100+ belgili ta’limiy izoh mavjud.
- `supabase/maintenance/task349_pedguli_explanation_postflight_readonly.sql` qayta ishga tushiriladigan tekshiruvdir.
- **Bu qamrov 140 ta muayyan Telegram savolining source-only izohi uchun 100%.** Bu butun platformadagi 8 mingdan ortiq har bir savol mazmuni mustaqil inson ekspertiza imzosi bilan tasdiqlangan degani emas. AI tayyorlagan tushuntirishlar egasining bevosita ko‘rsatmasi asosida qo‘llandi; tashqi inson eksperti tasdig‘i soxtalashtirilmadi.
- Savol arxivlash/successor nashri mavjud tarixiy imtihon yozuvlarini o‘zgartirmaydi. Vercel production deploy buyurilmagan va qo‘lda amalga oshirilmagan.

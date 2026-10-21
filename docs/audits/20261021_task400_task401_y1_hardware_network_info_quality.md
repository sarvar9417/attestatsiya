# Attestatsiya savollar auditi — 2026-10-21, TASK-400 va TASK-401

## Maqsad va vakolat

Ega avval AI muharrirga mustaqil ekspert sifatida davom etishga, har partiyaga alohida tasdiq so‘ramaslikka ruxsat bergan. Ushbu ish **AI tahriri**, mustaqil *inson* eksperti imzosi emas. Manbadagi eski savollarning mazmuni va javob kaliti bazada tekshirildi; yangi shart, muqobil variantlar va izohlar AI tomonidan mualliflik asosida ishlab chiqildi. Ular rasmiy 2026-yil attestatsiya testidan so‘zma-so‘z ko‘chirilgan savollar sifatida ko‘rsatilmasin.

## Productionda e’lon qilingan tahrirlar

| Batch | S1.INFO | S2.HW | S6.NET | Jami |
|---|---:|---:|---:|---:|
| TASK-400 | 0 | 4 | 6 | 10 |
| TASK-401 | 6 | 4 | 0 | 10 |
| **Jami** | **6** | **8** | **6** | **20** |

- **TASK-400**: CPU, RAM, motherboard, device driver, firewall qoidalari, DNS tashxisi, CIDR maskaning uzluksizligi, IPv6 multicast/broadcast farqi, qidiruv tizimi indeksi va crawler vazifalari.
- **TASK-401**: kiritish–qayta ishlash–chiqarish, analog va raqamli axborot, bevosita/bilvosita manba, kombinatsiyalashgan axborot, uzatish/qabul qilish, post manbasining ishonchliligini tekshirish, sensorli ekran, OS resurslarini boshqarish, fayl yo‘li, utility antivirus dasturi.

## Mazmuniy va texnik sifat nazorati

Har bir original savol uchun oldindan quyidagilar tekshirildi:

1. Original `published` holatida; Y1 formatiga va aniq guruhga tegishli, qayta nashr zanjiriga oldindan bog‘lanmagan.
2. Originalga `y1_answer_length_high_risk` ochiq finding mavjud, original `question_quality_published_revisions.content_fingerprint` ishlab turgan kontentga mos.
3. To‘g‘ri javobning **asl matni** o‘zgartirilmagan, qayta nashr variantlarida **to‘rtta noyob** javob bor; to‘g‘ri variantning so‘z soni eng uzun noto‘g‘ri variantdan ko‘p emas; eng uzun/qisqa variant so‘z uzunligi nisbatida chegara **1,6**.
4. Har bir yangi distraktor alohida mavzu/texnik konsepsiyani anglatadigan qilib tekshirildi; alohida shart va izoh yaratildi.
5. Eski `question_id` arxivda saqlandi, `exam_items` hamda tarixiy javoblar yangidan yozilmadi.
6. Yangi savol `published`, fingerprint mos, `is_question_official_mock_eligible()` va `group_mock_eligible()` true, yuqori/critical ochiq finding yo‘q.
7. `question_bank_revisions` yangi–eski ID bog‘lanishini va *owner-delegated AI*, *no independent human certification* kelib chiqishini saqlaydi.

**Nol-bazali va bir-bazali indekslar**: TASK-400 dagi original S6.NET variantlari 1..4, yangi Y1 variantlar esa 0..3 edi. Oldingi to‘g‘ri variant ordinali normalizatsiya qilindi. Aniq eski to‘g‘ri variant matni, yangi correct_option_id va ordeni regressiya sinovida alohida tekshirildi.

Yakuniy production tekshiruvi: har ikki batch 10/10 live, 10/10 eski archived, 10/10 fingerprint, 10/10 official/group mock eligible, 0 yangi yuqori severity quality findings, **0 eski to‘g‘ri javob matni o‘zgargan holat**.

## SQL/migratsiyalar va regressiya testlari

- `supabase/migrations/20261022004000_task400_ten_y1_hardware_network_length_bias_repairs.sql`
- `supabase/migrations/20261022005000_task401_ten_y1_information_hardware_concept_length_repairs.sql`
- `supabase/tests/task400_hardware_network_y1_balance_release.test.sql`
- `supabase/tests/task401_information_hardware_y1_balance_release.test.sql`
- `.github/workflows/ci.yml`: ikkala production-data-specific migratsiya yangi bo‘sh CI bootstrapda 2 yo‘lda skip qilinadi; faqat productionda mavjud original kontentga bog‘langanligi uchun. Toza CI uchun fixture asosidagi takrorlanadigan sinovlar keyinroq alohida kuchaytirilishi kerak.

Ikkala SQL regressiya sinovi production database'da muvaffaqiyatli o‘tdi. **GitHub Actions bo‘yicha yakuniy all-green xulosasi chiqarilmaydi**: tekshirish paytida so‘nggi commit uchun ishga tushirishlar `in_progress`, ketma-ket yangilanishlarda boshqa run'lar `cancelled` edi.

## Tekshiruv vaqtida qolgan ochiq quality findinglari

| Kod | Hozir e’lon qilingan savollar |
|---|---:|
| `implausible_distractors` | 0 |
| `y1_answer_length_high_risk` | 334 |
| `y1_correct_answer_strictly_longest` | 871 |
| `independent_editorial_review_required` | 71 |

Bu qiymatlar bir-biri bilan kesishadi va boshqa parallel jarayonlar sabab vaqt davomida o‘zgaradi. AI tahriri o‘tkazilishi `independent_editorial_review_required` ni yolg‘ondan mustaqil inson tekshiruvi sifatida yopishga sabab emas.

## Davomiy ish

Yuqori xavfli Y1 uzunlik biasini semantik tahrir bilan davom ettirish; savollarni texnik nuqtadan sinash, noto‘g‘ri variantlarning plausibility tekshiruvi va savol tasdiqida human/AI provenance farqini oshkora saqlash. CI data-dependent skiplarini ko‘paytirish o‘rniga source fixturelar bilan migratsiyalarni qayta ishlab chiqish masalasi alohida texnik qaror sifatida ko‘rilishi kerak.

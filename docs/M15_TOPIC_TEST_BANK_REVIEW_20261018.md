# M15 mavzu testlari: savol bankini tiklash (2026-10-18)

**Status:** [Draft PR #125](https://github.com/sarvar9417/attestatsiya/pull/125). Foydalanuvchining keyingi roziligisiz **merge, production deploy, Supabase migration va savollarni publish qilish TAQIQLANGAN**.

## Muammo sababi — production bazadan faqat SELECT orqali aniqlangan

`generate_topic_test(p_lesson_id)` (20261008113000 migration) har mavzu uchun `lessons.topic_test_question_count` (20) ta `published` + `question_keys` + `group_code` mos savol talab qiladi. Qamrov konstruktining kamida bitta majburiy sloti alohida tekshiriladi. Eksik pool haqida `topic_pool_insufficient` chiqadi; backend uni 409 va uzbekcha xabarga aylantiradi. Muammo frontendning nazariya dizayniga bog‘liq emas.

| M15 | Bazadagi nashr etilgan Y1 savol | Yetishmagan |
|---|---:|---:|
| .01 | 8 | 12 |
| .02 | 8 | 12 |
| .03 | 8 | 12 |
| .04 | 10 | 10 |
| .05 | 7 | 13 |
| .06 | 9 | 11 |
| .07 | 7 | 13 |
| .08 | 9 | 11 |
| **Jami** | **66** | **94** |

Production bazada `M15` kodiga tegishli 14 ta dars chiqdi, jumladan boshqa eski/legacy `order_idx` qiymatlari 101–107. Migratsiyalar faqat canonical 1–8 va `PM.GEN.01–08` faol konstruktlarini bog‘laydi, legacy darslarni o‘zgartirmaydi.

## Manbalar, mualliflik va yaxlitlik

- Google Drive → Attestatsiya folderida `Pedagogik mahorat to'plam 2025.pdf`, `Pedmahorat to'plam 2025 kuzgi.pdf`, `PedKasb tushgan testlar ...` va boshqa PDFlar borligi tekshirildi; dastlabki ikkitasining mazmuni o‘qilib, pedagogika tamoyillari, induksiya/deduksiya/analogiya, refleksiya, muomala, darsni tashkil etish tushunchalari bilan mosligi tekshirildi.
- 649 source candidate mavjud: 195 tasi `independently_verified`, ammo ularning hammasi live testda emas. Private test korpusi avtomatik yoki kalitsiz savollar bilan chiqmagan.
- Yangi savollar *platforma uchun maxsus mualliflik testlari*, tarixiy attestatsiyada tushgan original savol deb taqdim etilmaydi. Ular M15 nazariyasi, `pedagogyStudyNotes` va mavzularga oid yuborilgan qo‘llanmalardagi terminlarga tayanib, vaziyatli uslubda yozildi. Source reference `authored:m15-topictest-20261018:...`.
- 94 ta Y1 (har birida 4 javob, 1 deterministik javob kaliti, asosli izoh), 8 kanonik mavzuga `source_lesson_id` va `construct_id` orqali tegishli.
- To‘g‘ri javoblar uzunligi qolgan variantlarga qaraganda oshkora ko‘rinib qolmasligi uchun `guard_pedguli_question_publish`ning so‘z-soni tengligi shartlari **review bosqichidayoq** avtomatik tekshiriladi. CI/kriptografik fingerprint majburiy.
- Migratsiyalar `md5('m15-y1-20261018:' || topic || ':' || ordinal)` asosidagi barqaror UUIDlardan foydalanadi: takroran qo‘llash shu savollarni yana ko‘paytirmaydi.

## Muhim editorial xavfsizlik cheklovi

`20261016224000_task201_pedagogy_editorial_revision_safety.sql` pedagogika toifasi (`PM.GEN`) uchun to‘g‘ridan-to‘g‘ri `published` insertni rad etadi. Dastlab CI aniqlagan **`PEDAGOGY_REVIEW_BEFORE_PUBLICATION_REQUIRED`** xatosi shu mexanizm ishlayotganini tasdiqladi. Shuning uchun to‘rtta yangi migratsiyada savollar **`review`** holatida yoziladi. Bu qasddan qilingan, xavfsiz tartib. Himoya triggeri o‘chirilmaydi yoki aldab o‘tilmaydi.

Mavzu testlari faqat mavjud 66 ta savol bilan 20 taga yetmagani sababli **hozircha ishlab ketmaydi**. To‘ldirish uchun quyidagi jarayon shart:

1. Draft savollarni mualliflik, ilmiy asos, javob kaliti, grammatik sifat, variantlar balansi va mavzu mosligi bo‘yicha alohida editorial ko‘rib chiqish. 94 savolni ommaviy, ko‘r-ko‘rona tasdiqlamang.
2. `public.question_editorial_checks` ga haqiqiy mustaqil tasdiqlar: `answer_verified`, `reference_verified`, `wording_verified`, `original_authorship_verified`; kamida 20 belgi `reviewer_notes`; to‘liq matn+variant+kalitning imzosi `professional_question_fingerprint` bilan mos kelishi kerak.
3. Har bir savolda **faqat** `status: review → published` o‘zgartirish, hech qanday bir vaqtdagi matn/kalit tahririsiz.
4. Nashrdan keyin M15.01–08 uchun real `generate_topic_test` va UI end-to-end testini faqat maxsus test akkauntida tekshirish. Natijalar, javoblarni yuborish va yakunlash to‘liq ishlashi kerak.

## Tekshiruvlar va cheklovlar

- `supabase/migrations/20261018120000...–20261018123000...` → 94 ta faqat review savol.
- `supabase/migrations/20261018124000_m15_topic_bank_release_gate.sql` → sakkiz mavzu uchun 20 tadan nashr etilgan **yoki review** to‘liq savol mavjudligini, 94 yangi draft va variant/javob tuzilishi, to‘g‘ri javob uzunligi cheklovlarini tekshiradi. Bu *tayyorlangan* bankni tasdiqlaydi, *nashr etilgan* bankni emas.
- `supabase/tests/m15_topic_bank_complete.test.sql` → qo‘shimcha transactional test, uni alohida CI scriptga ulash mumkin.
- Frontend nazariya dizayni, mavjud savollar kaliti va rasmiy 5+7+3 kvotasi o‘zgartirilmadi.
- PROD: yangi migratsiyalar qo‘llanmagani va QA/editorial nashr bo‘lmagani uchun real foydalanuvchida 20 talik test hali tuzatilgan deb e'lon qilinmaydi.

**Release readiness = false**, toki sifat nazoratidan o‘tgan barcha mavzularda 20 tadan `published` savol va E2E muvaffaqiyati bo‘lmaguncha.

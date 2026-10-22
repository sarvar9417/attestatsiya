# Attestatsiya — TASK-404 / TASK-405 AI tahriri va savollar sifati auditi

Sana: 2026-10-22. Production: Supabase question bank; kod ombori: `sarvar9417/attestatsiya`.

## Ko‘lam va provenance

Platforma egasining avvalgi mustaqil davom etish vakolati asosida jami **20 ta published Y1 savolning yangi, o‘zgarmas versiyalari** yaratilib production bazada nashr qilindi. Savollar **AI tomonidan** mazmunan qayta ishlab chiqildi. Bu **mustaqil inson eksperti tasdig‘i emas**, inson tekshiruvi mavjud bo‘lmagan savollarga soxta ekspert imzosi yozilmadi. Original test va uning javob kaliti production bazasida ko‘rib chiqildi; yangi savol matnlari eski savollarning aynan nusxasi yoki rasmiy attestatsiyadan so‘zma-so‘z olingan deb talqin qilinmasin.

| Partiya | S1.INFO | S2.OFFICE | S3.ALGO | S4.CODE | S7.SEC | Jami |
|---|---:|---:|---:|---:|---:|---:|
| TASK-404 | 4 | 3 | 0 | 0 | 3 | 10 |
| TASK-405 | 0 | 0 | 4 | 3 | 3 | 10 |
| **Jami** | **4** | **3** | **4** | **3** | **6** | **20** |

**TASK-404**: axborotlashgan jamiyat va raqamli iqtisodiyot, kombinatsiyalashgan axborot, throughput/bandwidth/latency, audio bit depth; Excel COUNTIF/SUMIF, PowerPoint With/After Previous, Word Ctrl+X/Ctrl+C; phishingdan himoya kombinatsiyasi, ransomwarega chidamli zaxira, login va ERI farqi.

**TASK-405**: algoritm ta’rifi, manfiy sonlardan maksimum qidirishda noto‘g‘ri boshlang‘ich qiymat, nolga bo‘lishni tekshirish, amallar soni va shartli samaradorlik; JavaScript switch fall-through, Python while o‘zgaruvchisini yangilash, Python mutable default; sinxronlash va versiyali backup farqi, zararli dasturdan keyingi parol/sessiya nazorati, shubhali idoraviy faylni mustaqil tekshirish.

## Originalga sodiqlik

Har bir savolni yangilashdan avval `source_reference`, `status='published'`, `format='Y1'`, mavzu bo‘limi, `y1_answer_length_high_risk` aktiv holati, original fingerprint va avvalgi revision zanjiri tekshirildi.

- Original to‘g‘ri javob **matni hamda variantdagi tartib raqami o‘zgarmadi**; yangi options UUID uchun answer key qayta bog‘landi.
- To‘rtta turlicha variantning uzunlik nisbati (eng uzun/eng qisqa so‘zlar soni) maksimal **1.6** va to‘g‘ri javob boshqa variantlardan qat’iy uzun emas.
- Distraktorlar so‘zlarni mexanik cho‘zish orqali emas, mavzuga yaqin noto‘g‘ri tushunchalar orqali ishlab chiqildi; vaziyatli shartlar va yangi tushuntirishlar berildi.
- Original savollar `archived`; yangi savollar `published`. Oldingi `exam_items` va tarixiy natijalar qayta yozilmadi.
- `question_bank_revisions` tegishli `TASK-404`/`TASK-405` evidence bog‘lanishini va AI provenance/no independent human review holatini saqlaydi.

## Postflight va SQL regressiya

TASK-404: **10/10** nashr/arxiv, **10/10** fingerprint, **10/10** rasmiy va guruh mock eligible, yangi ochiq high/critical finding **0**.
TASK-405: **10/10** nashr/arxiv, **10/10** fingerprint, **10/10** rasmiy va guruh mock eligible, yangi ochiq high/critical finding **0**, oldingi to‘g‘ri javob matni o‘zgargan **0**.

Har ikki partiya uchun alohida production SQL regressiya testlari muvaffaqiyatli ishga tushirildi. Regression testlar original javob matni/variant tartibi, 4 ta turlicha distraktor, so‘z uzunligi balansi, immutable snapshot, release holati va rasmiy/group mock yaroqlilikni tekshiradi. Bu dasturiy tekshiruvlar **mustaqil inson subject-matter ekspertizasining o‘rnini bosmaydi**.

## GitHub yozuvlari

- `supabase/migrations/20261022008000_task404_ten_y1_info_office_security_distractor_balance.sql`
- `supabase/migrations/20261022080902_task405_ten_y1_algorithms_python_js_security_semantic_repair.sql`
- `supabase/tests/task404_info_office_security_y1_balance_release.test.sql`
- `supabase/tests/task405_algorithms_python_js_security_y1_release.test.sql`
- `.github/workflows/ci.yml`: productiondagi original savol qatorlari talab qiladigan ushbu ikki migratsiya yangi bo‘sh schema/bootstrap uchun **ikki CI yo‘lida** istisno qilingan. Bu texnik qarz — kelgusida mustaqil source fixturelar bilan qayta bajariladigan testlar kerak.

Production regressiya testlari PASS. GitHub Actions’ning eng yangi commit bo‘yicha umumiy yashil natijasi bu hisobot yozilgan vaqtda **tasdiqlanmagan**; oxirgi run `in_progress` edi. Frontend deploy amalga oshirilgani da’vo qilinmaydi.

## Qolgan ochiq quality findinglari

Yakuniy production o‘lchovi:

| Finding kodi | Published open |
|---|---:|
| `y1_answer_length_high_risk` | 294 |
| `y1_correct_answer_strictly_longest` | 831 |
| `independent_editorial_review_required` | 71 |
| `implausible_distractors` | 0 |

Bu toifalar **kesishadi**. Dastlabki 314/851 dan 294/831 ga tushish aynan shu davrdagi 20 savol almashtirilgani bilan mos keladi; boshqa parallel jarayonlar faol bo‘lishi mumkinligi sabab barcha global dinamikani faqat mazkur partiyalarga bog‘lab bo‘lmaydi.

## Keyingi ustuvor vazifalar

Y1 savollarni **mazmuniy audit** qilish, savolni imkoni bo‘lsa kichik kod yoki hisob bilan tekshirish, javob uzunligi va chalg‘ituvchi variantlar sifatini yaxshilash, tahrir tarixi va test ishlagan foydalanuvchilarning eski natijalarini o‘zgartirmaslik. Testlar bilan bir qatorda CI istisnolari sonini kamaytiradigan fixture-backed data migration strategiyasi ko‘rib chiqilsin.

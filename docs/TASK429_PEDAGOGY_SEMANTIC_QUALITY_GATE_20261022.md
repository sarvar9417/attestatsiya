# TASK-429 — Pedagogika Y1 savollari uchun semantik sifat nazorati

**Sana:** 2026-10-22. **Loyiha:** Attestatsiya, KS / PM.GEN / PM.MET.

## Muammo
Avvalgi nashr tekshiruvi Y1 formatida 4 ta alohida variant, to‘g‘ri javob identifikatori va variantlar so‘z uzunligini nazorat qilgan. Lekin to‘g‘ri variant savolni takrorlashi, yakka izohli «atama — ta’rif» shaklida bo‘lishi yoki noto‘g‘ri variantlarning «faqat», «hech», «doimo» kabi mutlaq iboralar bilan ataylab mantiqsiz ko‘rinishi nazoratdan chetda qolgandi.

## Yechim
Migration: `supabase/migrations/20261022032353_task429_pedagogy_y1_semantic_answer_cue_quality_gate.sql`.

- `pedagogy_semantic_quality_signals(uuid)` savol variantlari, yopiq javob kaliti va savol matni asosida **evristik** sifat signallarini qaytaradi. Bu ekspert tasdig‘i emas.
- **Nashrni to‘xtatadigan high signallar:** `answer_definition_only` (izohli tire faqat to‘g‘ri javobda); `answer_stem_echo_strong` (to‘g‘ri javobda savoldan 3+ muhim token, noto‘g‘ri javoblarda 0); `distractor_absolute_pair` (kamida 2 noto‘g‘ri variantda keskin absolyut ibora, to‘g‘rida yo‘q).
- **Tekshirish navbatiga kiritiladigan medium signal:** `answer_stem_echo_imbalance` (savol bilan to‘g‘ri javob o‘rtasida leksik ustunlik). Yolg‘iz medium signal nashrni to‘xtatmaydi, chunki qonuniy pedagogik terminlar bilan noto‘g‘ri signal berishi mumkin.
- Savol `review` yoki `published` statusiga o‘tganda aniqlangan signal `question_quality_findings` registriga yoziladi. Yopilgan yoki eski qaydlar qayta yozilmaydi.
- `high` signal aniqlansa, `PEDAGOGY_SEMANTIC_CUE_REVIEW_REQUIRED` xabari bilan nashr rad etiladi. Admin yoki ownerning umumiy waiver’i bu aniq semantik tekshiruvni chetlab o‘tolmaydi.
- Funksiya va triggerlar `anon` hamda `authenticated` rollarida **EXECUTE huquqiga ega emas**, chunki ichki kalitlar maxfiy.

## Test va xavfsizlik
`supabase/tests/task429_pedagogy_semantic_publish_gate.test.sql` transaksiyada vaqtinchalik savol yaratadi va `ROLLBACK` bilan yakunlaydi. Test yuqori xavfli variantlar avtomatik qayd qilinishi, nashrning bloklanishi, review holatining saqlanishi va funksiyalar oddiy foydalanuvchi uchun yopiq ekanini tekshiradi.

Production sinovida yangi migratsiya qo‘llangandan keyin high flagli review savolini nashr etishga urinish **rad etildi** va hech qanday test savoli bazada qoldirilmadi.

## Cheklovlar va keyingi qadamlar
Bu statik til qoidalari barcha mazmuniy xatolarni topmaydi. Pedagogika va informatikadan mutaxassis tahlili, PDF/TG manba solishtiruvi, javoblarning fan nuqtai nazaridan yakka to‘g‘riligi hamon zarur. Yangi check **faqat KS / PM.GEN / PM.MET format Y1** uchun; Y2/Y3 yoki boshqa bo‘limlarga asossiz umumlashtirilmaydi.

Migratsiya mavjud `published` savollarni o‘zgartirmaydi, eski test urinishlari va statistikasi saqlanadi. Mavjud savollar orasidagi yangi high/medium signallar alohida semantik remediatsiya talab qiladi; ularni kod joriy etilgani uchun avtomatik «tuzatildi» deb belgilash mumkin emas.

## 2026-10-22 — productionda yakuniy sifat holati

- KS / PM.GEN / PM.MET bo‘limlarida faol Y1: **893**; noto‘g‘ri variant soni, takroriy variant yoki yaroqsiz javob kaliti: **0**.
- Kuchli semantik ishoralar: **0**; AI-evristik o‘xshashlik bo‘yicha keyin tekshiriladigan yumshoq nomzodlar: **8**.
- TASK-429 doirasida 16 ta tarixiy savol o‘rniga yangi versiya nashr qilindi; eskilari arxivda, avvalgi test urinishlari saqlangan.
- Hujjatli manba dalili hali tasdiqlanishi kerak bo‘lganlar: 201; mustaqil ekspert talab qilinadiganlar: 44. Ularni noto‘g‘ri «tasdiqlangan» deb yopish mumkin emas.
- Toza PostgreSQL CI ikkita mustaqil migratsiya tiklash ssenariysini ishlatadi. Ikkala ssenariy ham productionda avvaldan tayyorlangan review-fingerprintlarga bog‘langan TASK-428 batch02–05 kontent importlarini yangi baza uchun o‘tkazib yuboradi. TASK-429 xavfsizlik migratsiyasi va sintetik rollback testi esa toza bazada majburiy bajariladi.

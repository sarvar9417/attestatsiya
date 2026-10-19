# TASK-291 — nazariya qamrovi va keyingi ishlar navbati (2026-10-19)

## Nega audit kerak?

Barcha darslar BookReader dizaynida bir xil ko‘rinishi mazmun bir xil chuqurlikda ekanini anglatmaydi. Hajmga asoslangan «% M01.02» ko‘rsatkichi ham sahifama-sahifa darslik mosligini isbotlamaydi. 2026-10-19 holatidagi `main`da allaqachon TASK-288 (M03.06, M03.07, M15.05, M15.06) va TASK-289 (M03.08–M03.10) boblari bor. Ularni qayta yozish emas, qolgan bo‘shliqlarni aniqlash kerak.

## Audit vazifasi

`npm run theory:backlog:audit` yoki `npm run theory:backlog:audit -- --json` quyidagi yetishmovchiliklarni ko‘rsatadi:
- manba belgisi yo‘q (`no_source_trace`);
- bo‘limlarga ajratilmagan (`no_heading`);
- o‘quv maqsadi yo‘q (`no_goal`);
- izohli ishlangan vaziyat yo‘q (`no_worked_example`);
- mustaqil mashq yo‘q (`no_independent_exercise`);
- bazaviy M01.02 hajmi bilan solishtirishdagi «brief» holati (`short_chapter`);
- mashq bor, lekin javob/izoh yo‘q (`no_exercise_answers`).

`critical / high / medium / review_only` faqat **muharrirlik navbati** uchun. `review_only` ham «verified» yoki «to‘liq» degani emas. Modullar bo‘yicha manba, mashq va javob kamchiliklari soni alohida chiqariladi.

## Qattiq chegaralar

1. Faqat `TOPIC_CONTENT` statik/offline canonical materiallar tekshiriladi. Serverda saqlangan UUID lesson, remote-only published lessons va Supabase authentication kontenti qamrovdan tashqarida.
2. Pedagogik `withPedagogyStudyNotes` ilovalari hisobga olinadi; ammo ularning ham fizik sahifa mosligi **tekshirilmagan**.
3. Darslikdagi chizma, rasm va jadval fizik ko‘rinishi bo‘yicha ekspert solishtirish bu audit doirasiga kirmaydi.
4. BookReader’da manbaviy izoh borligi pedagogika matni ilmiy jihatdan yakuniy tasdiqlanganini bildirmaydi.
5. Savollar bankining javob kalitlari, nashr holati, backend, database va foydalanuvchi progressi mutlaqo o‘zgartirilmaydi.

## Amaliy navbat

- **M15.07–M15.08:** alohida PR #293 da batafsil boblar bor. GitHub CI muvaffaqiyatli bo‘lgach `main` bilan sinxron holatda merge qilinadi; buning ustidan parallel branchda nusxa ko‘chirmang.
- **M03.01–M03.10:** Word, Excel va PowerPoint canonical nazariya darslari qo‘shilgan, lekin fizika/rasm/xatoliklar bo‘yicha original darslik bilan to‘liq birma-bir ko‘rik hali qilinmagan.
- **Boshqa M01–M16 modullar:** auditdagi `critical` va `high` satrlar manba, worked example, mashq va javob bo‘yicha to‘ldirilishi kerak. Har biri uchun manba izi va regressiya testi talab qilinadi.
- **Remote published kontent:** autentifikatsiyali real platformada alohida UI/API tekshiruv, qisqa summary uzoq darsni bosib yubormasligini tekshirish.
- **Yakuniy source QA:** PDF fizik sahifalari, rasm va diagrammalar, original metodik terminlar bo‘yicha pedagogika/informatika ekspert ko‘rigi.

`src/tests/TASK291TheoryBacklog.test.ts` qamrov, izchil saralash va modul bo‘yicha hisoblarning muvofiqligini tekshiradi. Deploy qilinmasin.

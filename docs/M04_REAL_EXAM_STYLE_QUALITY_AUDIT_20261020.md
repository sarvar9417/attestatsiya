# M04 — real attestatsiya testlariga moslik va sifat auditi (1-bosqich)
**Sana:** 2026-10-20 · **Modul:** M04 — Mantiqiy mulohazalar va modellar · **Repo:** sarvar9417/attestatsiya.

## Manbalar va ularning ishonchliligi
1. **2026-yilgi rasmiy attestatsiya spetsifikatsiyasi**, PDF 3–4, 8-betlar: M04 uchun 3 savol; to'rtta konstrukt — mulohazalarni tuzish, amallar, masaladan xulosa, rostlik jadvali/sxema. Y1/Y2/Y3 formatlar mumkin. **Kognitiv 8/35/7 butun 50 savolli imtihon uchun**, har bir modul uchun alohida qat'iy nisbat emas.
2. **`13.04.2026 Attetasiya Tushgan savollar.pdf`**, PDF 6-bet, 13-savol: `A∧(B↔C)→(¬B∨C)` ning nechta holatda rost bo'lishi. Barcha 8 holatda rost (muallif kalitiga ko'r-ko'rona ishonilmasdan mustaqil hisoblandi). **Bu manbadagi topshiriqlar rasmiy muassasa tomonidan autentifikatsiya qilingani alohida tasdiqlanmagan.**
3. **`Demo 2026 test 10 000 so\`mlik.pdf`**, PDF 5-bet, 10-savol: `(X>1)∧(X<3)` shartidagi butun sonlarni sanashga yaqin shakl. Mazmunni o'zicha qayta tushuntirish va diapazonni aniq berish muhim. Bu **tijoriy/demo namunasi**, rasmiy attestatsiya normasi sifatida qabul qilinmadi.
4. **`Test.pdf`** (2019), PDF 41–45-betlar, «6-§. Mantiq amallari»: atamalar va shartli mulohazalar bilan bir qatorda teng kuchlilik, formulani soddalashtirish, rost holatlar soni, to'rt o'zgaruvchili qiymatlash va aralash fan vaziyatlari. **Manba o'zida ayrim savol/javob xatolari borligidan ogohlantiradi**; xato kalitlar nusxalanmaydi.
5. **`Informatika Demo testi .pdf`**, **`20000 LIK informatika.pdf`**: sahifalar skanerlangan; oddiy matn ekstraksiyasi M04 savollarini to'liq tiklamaydi. Ayrim sahifalar vizual ko'rildi, **butun hujjatdagi barcha M04 savollar ajratib tugatilgani tasdiqlanmagan**.
6. Drive/Attestatsiya papkasining shu bosqichda ko'rilgan ro'yxatida 2025 kuzgi demo ham bor; **ushbu auditda uning har bir savoli hali alohida transkripsiya qilinmadi**.

## Database: amalda aniqlangan holat
Audit boshida M04 guruhida 624 ta `published` savol bor edi (oldingi suhbatdagi 582 raqam eskirgan). Shu vaqt ichida M04 bo'yicha boshqa commitlar/materiallar ham qo'shilgan.
Birinchi bosqich yakunidagi holat:
- **649 `published`**: **463 Y1, 93 Y2, 93 Y3**; 0 `review`; **65 `archived`**.
- Ta'rif/atama yoki «nima deyiladi?»ga o'xshash **93 ta savol** — *ko'rib chiqish navbati*, avtomatik yaroqsizlik hukmi emas.
- Y2/Y3 ichida qisqa/generic stemli **7 ta savol** — ularning variantlari va joriy sharti alohida mazmuniy tekshirilishi kerak.
- To'liq kalit yo'q savollar (dastlabki agregat audit): 0. Aynan bir xil stemlar (dastlabki agregat audit): 0.
- Shu moduldanoq kamida 59 ta savol real `exam_items` yozuvlarida qo'llangan; **o'tmishdagi sessiyalarni buzish taqiqlanadi**.

## Ushbu bosqichda bajarilgan DB o'zgarishlari
### Noto'g'ri/bir nechta javobli Y1 lar xavfsiz arxivlandi
- `m04-latex2026-v2:MAN-01-007`: «12 soni 3 ga bo'linadi» bir vaqtning o'zida **mulohaza**, **sodda mulohaza** va **rost mulohaza**, biroq variantlar bularning uchalasini alohida taklif qilgan.
- `m04-latex2026-v2:MAN-01-010`: «8 soni 2 ga bo'linadi» **rost mulohaza** ham, oddiygina **mulohaza** ham.
- `m04-latex2026-v2:MAN-01-011`: «9 soni 2 ga bo'linadi» **yolg'on mulohaza** ham, **mulohaza** ham.
Uchtasining ham `exam_items` bilan aloqasi 0 bo'lgani tekshirildi. **O'chirilmagan**, `archived` holatiga o'tkazilgan.

### 28 ta yangi original analog savol
- `m04-20261020-examstyle:STY-RC-001..012`: uchta mantiqiy o'zgaruvchi qatnashadigan, 8 qatorli rostlik jadvali yordamida rost qiymatlar sonini topadigan 12 ta Y1. **Formula andozasi**: 13.04.2026 (PDF 6-bet, 13-savol), 2019 `Test.pdf` (PDF 42–44). 12 tasining har biri 8 holat bo'yicha qayta hisoblangan; to'rtta unikal javob varianti tekshirilgan.
- `m04-20261020-examstyle:STY-INT-001..008`: sonli mantiqiy tengsizlik, kon'yunksiya/diz'yunksiya/inkor va butun sonlarni sanashga oid 8 ta Y1. **Uslub namuna**: 2026 demo (PDF 5-bet). Har birida `x` butun son ekani va chegaralar ochiq ko'rsatilgan; mos qiymatlar mustaqil sanalgan.
- 28/28 yangi savol avval `review`ga yozilib, variant/kalit/formal yaxlitlik tekshirilgach `published` qilingan. Takroriy importni to'suvchi `source_reference` tekshiruvi mavjud.

## Real imtihon uslubiga moslash mezoni
- **Y1**: aniq bitta to'g'ri javob; faqat yodlash emas, ikki–to'rt bosqichli hisoblash va taxmin bilan osongina topib bo'lmaydigan variantlar.
- **Y2**: haqiqiy interaktiv `a` va `b` ustunlar, kalit `pairs`, chalg'ituvchilar mazmuniy; Y1ga niqoblangan moslashtirish emas.
- **Y3**: haqiqiy `order` kaliti, mantiqan yagona ketma-ketlik; faqat matn uzunligi oshirilmasin.
- Original/demo savollar va **yangi analoglar** alohida manba belgisi bilan saqlansin. Tayyorlangan analog **rasmiy testning aynan nusxasi emas**.
- Qamrov: to'rtta rasmiy konstrukt, oltita backend mavzu, har savolga `source_lesson_id`, `construct_id`, `question_keys`.
- Muallif javoblari emas, formula hisob-kitoblari / qarshi-misol orqali kalitni mustaqil tekshirish.

## Ochiq ishlar — to'liq sifat attestatsiyasi deb hisoblamaslik kerak
1. 649 ta nashrdagi savolning har birini individual semantik qayta tekshirish va yakuniy **savol-ID × manba × uslub × xato × qaror** jadvalini yopish.
2. 93 ta atama/shakl savolini chuqur ekspert formatida ko'rish: ba'zilari spetsifikatsiyadagi «bilish» uchun kerak, qolganlarini hisoblash/xulosa ko'rinishiga o'tkazish.
3. Demo/2025 kuzgi demo va to'liq skanerlangan PDFlar sahifalarini vizual transkripsiya qilib qo'shimcha M04 manbalarini xaritalash.
4. 52 ta mantiqiy sxema va yangi Y2/Y3 masalalarning production foydalanuvchida render, input, server baholash va progress saqlanishini authenticated E2E bilan isbotlash.
5. Formula yechish, mantiqiy ekvivalentlik, rostlik jadvali vektori, Y2/Y3 mapping uchun takrorlanadigan mustaqil validator ishlab, barcha savollarni muntazam tekshirish.
6. So'nggi frontend+backend deployment holatini alohida tekshirish; **ma'lumotlarning production bazada published bo'lishi brauzer E2E isboti emas**.

### Natija mezoni
Bu hujjat **1-bosqich tekshiruv natijasi**, 649/649 individual sifat tasdiqi EMAS. Qolgan masalalar bo'yicha noto'g'ri umumiy «hammasi 100% tayyor» xulosasi berilmaydi.

## Qo'shimcha chuqur mashina auditi (shu kunning keyingi pass'i)
- **649/649** published savolda kalit payload mavjud va mos option ID ga ulangan; har savolning **mantiqiy formatga xos** option tomoni va soni, aktiv S3.LOGIC konstrukt hamda nashrdagi M04 darsi bog'lanishi yaroqli.
- **186/186** ta haqiqiy Y2/Y3 savol: juftlashning barcha chap elementlari qamralgan, moslangan o'ng elementlar takrorlanmaydi; Y3 kalitida har bir variant aynan bir marta bor.
- **89** ta «rost holat soni»ga o'xshash savol tekshiruv navbatiga ajratildi. Shulardan **80 ta** formula parseri bilan 2–4 o'zgaruvchining barcha kombinatsiyasi bo'yicha hisoblab chiqildi: **80/80 mos**.
- Qolgan **8 ta to'rt o'zgaruvchili** formula (M4A-03-007/008/009/011/012, M4A-04-008/009/010) 16 kombinatsiya bo'yicha alohida Python enumeratsiyasi bilan tekshirildi: **8/8 mos**.
- Oxirgi **1 ta** (`MAN-02-019`) formulali son masalasi emas, bosqichlarni tartiblash shaklidagi Y1 bo'lib, «rostlik» kalit so'zi tufayli filtrga tushgan; u bu hisoblash auditiga qo'shilmadi.
- Yana ham **93 ta atamaviy** va **7 ta qisqa Y2/Y3** savolni semantik tahrir qilish, mustaqil foydalanuvchi sessiyalaridagi joriy oqimni sinash ochiq. Bu tekshiruvning yakuni «har bir savolning semantik variantlari mustaqil baholandi» degani emas.
- Savol-ID asosida qayta ko'rish uchun `docs/M04_20261020_FULL_QUESTION_INVENTORY.csv` saqlangan. Faylda javob kalitlari emas, 649 ta savolning ID, manba, konstrukt darajasi, mavzu tartibi va alohida QA holati qayd etilgan.

### Drive 2025 kuzgi demo: qo'shimcha M04 shakllari tekshirildi
- `2025 kuzgi demo @Informatika_fani_ustozlari.pdf`, **PDF 12-bet**, 15-savol: **qisman berilgan rostlik jadvali** bo'yicha mantiqiy ifodani tanlash. 19-savol: **ko'p elementli mantiqiy sxemaning yolg'on chiqishlari soni**. Hujjatning boshqa betlarida boshqa modullar savollari ham mavjud. PDF skaner, avtomatik matn ekstraksiyasi ishlamaydi, ammo tegishli betlar vizual ko'rildi.
- `m04-20261020-examstyle:STY-PARTIAL-001..008`: 8 ta original **qisman rostlik jadvalidan formula topish** Y1 savoli qo'shildi; har birida 4 formula ham berilgan qatorlarda hisoblangan va **aynan 1 ta mos keluvchi variant** kafolatlangan. Avval `review`ga yozilgan, so'ng baza kaliti/variant auditidan o'tkazilib `published` qilingan.
- Ko'p bosqichli sxema savollari uchun alohida **aniq grafik topologiya**, tugun belgilari va production renderer E2E kerak; mavjud ikki tugunli sxemalarni ko'p tugunli imtihon sxemasi deb noto'g'ri ko'rsatish mumkin emas.

# TASK-207: Algoritmlash — attestatsiya uslubiga moslash va sifat nazorati

**Sana:** 2026-10-20. **Maqsad:** V2/V3 test bankini demo va oldingi testlar haqiqiy shakli bilan taqqoslash, xavfli/gapli savollarni aniqlash, original va tekshiriladigan amaliy variantlar tayyorlash.

## Aniq o‘qilgan manbalar va mazmun chegarasi

| Manba | Ko‘rilgan material | Algoritmlash uchun olinadigan uslub | Ehtiyotkorlik |
|---|---|---|---|
| `Informatika Testlar spesifikatsiyasi.pdf` PDF 3–4 | Algoritmlash 3 savol; 4 kompetensiya; Y1, Y2, Y3 | Barcha savollarni aniq algoritm ko‘nikmasiga bog‘lash | Scratch/LOGO va Python/JavaScript **alohida bo‘limlar**, Algoritmlashga sintaksisni majburiy ko‘chirmaslik |
| `Demo 2026 test 10 000 so`mlik.pdf` PDF **6, 7, 8** | PDF6 Q12 ko‘paytmali blok-sxema natija/vazifasi; Q13 Scratch mantiqiy shart; PDF7 Scratch shakl; PDF8 Python sikl va break | Blok-sxema bilan ifodalangan **amaliy masala**, javobga yaqin noto‘g‘ri variantlar | Pullik demo faylining rasmiy davlat namunasi ekani tasdiqlanmagan; Scratch/Python savollarining predmet chegarasi boshqa |
| `20000 LIK informatika.pdf` PDF **6–7** | PDF6 Q13 DAG yo‘llarini sanash, Q14 kirish qiymatlari bilan flowchart natijasi; PDF7 kod va Scratch | Yo‘naltirilgan graf, qadamma-qadam flowchart, terminal qiymat | Mualliflik jamlanmasi; rasmiy imtihon kaliti deb qabul qilinmaydi |
| `Informatika Demo testi .pdf` PDF **18** | Q35 blok-sxemaning yechadigan masalasini aniqlash | Grafik sxemani maqsadiga ko‘ra talqin qilish | Rasm-skrinshotning rasmiyligi tasdiqlanmagan |
| `2025 kuzgi demo @Informatika_fani_ustozlari.pdf` PDF **4, 6–9, 12** | Scratch blokli savol; kodni kuzatish; mantiqiy sxema va rostlik jadvali | Ko‘p qadamli hisoblash, jadval/rasm, mantiqiy chalg‘ituvchi javob; izoh bilan yechish | PDF12 mantiqiy sxema — spetsifikatsiyada **Mantiqiy mulohazalar** (Algoritmlash emas); kod sintaksisi alohida bo‘limga tegishli |
| `13.04.2026 Attetasiya Tushgan savollar.pdf` PDF **4, 11–12** | Toshbaqa/LOGO kodi, JavaScript kod natijasi | Manba savolni imtihon ish uslubi sifatida ko‘rish | Foydalanuvchi jamlanmasi, rasmiy kalit va tushganlik da’vosi mustaqil tasdiqlanmagan; mazmuni ko‘proq Dasturlash bo‘limiga tegishli |
| `Tushgan testlar 07.04.2026.pdf` | Pedagogik vaziyatlar | Algoritmlash savoliga bevosita tatbiq etilmadi | Informatika algoritm savollari ushbu faylda aniqlanmadi |
| `Test.pdf` PDF 53–64 | Oldingi ta’rif, Pascal sikl natijasi, ichma-ich hisoblash | Hisoblash bilan tekshiriladigan to‘rt javobli test tuzish | Fayl muqaddimasi kalit/savol xatolari mumkinligini bildiradi, Pascal sintaksisi 2026 Algoritmlash majburiyati emas |

## Bazadagi 288 V2/V3 savol auditi

- **V2 240 + V3 48 = 288**. Tekshiruv sanasida **255 published, 18 review, 12 draft, 3 archived**.
- Jami **288/288** savol uchun serverda javob-kalit bog‘lanishi bor. Y1 da 4 variant/ID, Y2 da 3+3 juftlash, Y3 da mavjud ID tartibi strukturaviy tekshirilgan; **0 ta texnik kalit bog‘lash xatosi**.
- Har bir savol uchun `public.algoritmlash_style_audit` jadvaliga **source_reference, format, status, kontent fingerprint, style_category, findings, priority, source_evidence** yozildi.
- Avtomatik saralash: **128 medium**, **1 high**, **159 routine** V2/V3 element. Bular **tekshirish navbati**, ilmiy jihatdan 129 savol noto‘g‘ri degani emas; har bir mantiqiy javobni matematik tekshirish alohida ish.
- High: `algoritmlash-v2:ALG-07-009` — savol «Ning raqamlar soni...» deb boshlanadi, aniqlik past. Savolning jonli yozuviga tegmasdan aniq ijro izli **ALG-V4-025** yangi variant tayyorlandi.
- Y2 namunalarda `Moslang.` qisqa stem bo‘lishi mumkin: chap-o‘ng ustunlar UI bilan birga qaralishi shart, bu o‘z-o‘zidan dublikat emas.
- Matematik ifodada **−1 va 1** yoki **A−B va A+B** kabi javoblar bir-birining dublikati EMAS — qidiruvda arifmetik operatorlarni saqlash kerak.

## Aniq uslubiy o‘zgarish

- **ALG-V4-001/002**: demo uslubidagi blok-sxema, sanagich va ko‘paytmaning oraliq/yakuniy qiymatini ajratish.
- **ALG-V4-003/004**: birinchi manfiy son bilan yakunlanuvchi yig‘ish sxemasi, terminal qiymat chiqarib tashlanadi.
- **ALG-V4-005/006**: yangi, original, 10-tugunli yo‘naltirilgan graf; A→J **8 ta yo‘l**, E→I qirrasi olib tashlansa **6 ta**; dinamik sanash bilan tekshirilgan.
- **ALG-V4-007–020**: ichma-ich sikllar, ajratilgan shartli yig‘indi, holatlar ketma-ketligi, REPEAT–UNTIL, EKUB, matematik chegaralar, samaradorlik. Hammasida to‘rt javob varianti va izoh.
- **ALG-V4-021/022**: Y2 muqobil chap-o‘ng variantlarni moslashtirish (3 juft).
- **ALG-V4-023/024**: Y3 algoritm bosqichlarini/dinamik graf sanashni tartiblash (5 qadam).
- **ALG-V4-025**: N=0 va N=1000 uchun raqamlar sonini hisoblash; post-test sikl, to‘g‘ri juft **(1,4)**.

**Qo‘shildi: 25 original savol (Y1=21, Y2=2, Y3=2)**, shundan **6 ta savolda 3 ta original SVG sxema** qayta ishlatiladi. Yangi savollar faqat review, avtomatik published emas. Jami bazada **313 item** (V2/V3/V4, shu jumladan archived/draft/review).

## Nega avvalgi published savollar to‘g‘ridan-to‘g‘ri o‘zgartirilmadi?

Manba bankining 255 savoli nashr etilgan va foydalanuvchi urinishlari bilan bog‘liq bo‘lishi mumkin. Mazmun, variant yoki javob kalitini shu ID ostida almashtirish tarixiy baholarni buzishi mumkin. `question_quality_published_revisions` va `question_quality_quarantines` muhofaza qilinadigan strukturalar mavjud. Shu sababli noto‘g‘ri/zaif eski savol uchun yangi versiya + tekshiriladigan manba relatsiyasi yo‘li tanlandi.

## Tekshiruv darajasi, keyingi sifat bosqichi

**Bajarilgan:** barcha 288 eski yozuvda tizimli variant-kalit tekshiruvi; xatolik va uslubiy chetga chiqish uchun flags; aniq 1 ta matn nomukammalligi va uning yangilangan savol versiyasi; real PDF rasmlaridagi qamrov/stil kategoriyalari bilan 25 yangi topshiriq; avtomatik SQL regressiya va graf yo‘l sanog‘ini mustaqil hisoblash.

**Bajarilmagan / to‘liq tasdiqlanmagan:** barcha 288 ta eski savolning matematik yechimi birma-bir mutaxassis darajasida mustaqil qayta hisoblandi, demo to‘plamlaridagi barcha mumkin bo‘lgan savol shakllari 100% bazada mavjud, savollar rasmiy attestatsiyada aynan tushadi — bu da’volar uchun dalil yetarli emas. 128 ta medium savolni alohida tahrir qilish navbati reyestrda saqlangan.

**Kengaytirishga tavsiya:** amaliy hisoblash savollarini asta-sekin ko‘paytirish, ayniqsa blok-sxema, yo‘naltirilgan graf va terminal qiymatlar misollarini; haddan tashqari absurd noto‘g‘ri javob variantlarini haqiqiy xato hisoblashlardan olingan javoblar bilan almashtirish. Manba qamrovini har bir savolga imkon qadar PDF sahifasi bilan bog‘lash.

## Kod va hujjatlar

- `supabase/migrations/20261020100500_task207_algorithm_style_audit_snapshot.sql`
- `supabase/migrations/20261020101500_task207_original_attest_style_examples.sql`
- `supabase/migrations/20261020102000_task207_quality_replacement_07_009.sql`
- `supabase/tests/task207_algorithm_style_quality.test.sql`
- `docs/audits/TASK207_algoritmlash_313_savol_sifat_reyestri.csv`

**Izoh:** QA jadvali shu tartibda 288 mavjud savolni yoppasiga tizimli tekshiradi, lekin faqat ekspert/mustaqil hisob orqali to‘liq kalit kafolatlanadi.

# TASK-246 — Kuzgi 2026 demo testlari: 54 ta skrinshot → 50 ta savol xaritasi

**Holat:** SOURCE INVENTORY / REVIEW ONLY. Testlar platformaga import qilinmagan, javob kalitlari nashr qilinmagan.  
**Sana:** 2026-10-19.  
**Google Drive asl manba:** [Informatika Kuzgi demo testlari.docx](https://drive.google.com/file/d/13VVttASqpDVP4R1fsVtt3YARHs4uHnB8/view)  
**Material turi:** 3,879,784 bayt, Word hujjati; 54 ta inline skrinshot, savol matni oddiy Word paragraflarida mavjud emas.

## Muhim natija

54 ta rasmni tekshirib, **50 ta alohida savolga** biriktirish xaritasi tuzildi. Bu **2026-yil rasmiy spetsifikatsiyadagi 35+5+10 = 50** (informatika, kasb standartlari, pedagogik mahorat) qamroviga mos.

- 6 juft rasm `4–5, 11–12, 14–15, 21–22, 27–28, 34–35` bitta-bittadan **bir savolning ikki qismi** ekanini ko‘rsatadi (12 skrinshot → 6 savol).
- 31 va 32-indeksli skrinshotlarning **har birida ikki xil savol** mavjud (2 skrinshot → 4 savol); xaritada `31a/31b`, `32a/32b` ishlatiladi.
- Qolgan 40 skrinshot bitta savoldan. Natija: `54 − 6 + 2 = 50`.
- Informatika qismi skrinshot 1–39 oralig‘idan rekonstruksiya qilingan **35 ta savol**; 40–44 — **5 ta kasb standarti**; 45–54 — **10 ta pedagogik mahorat**.
- Savollarning skrinshotda yozilgan asl raqamlari bir xil bo‘lib takrorlanishi mumkin: 35 savolni tartibga solishda `01..50` **faqat inventar tartibi**, asl imtihon savol IDsi **emas**.

## Savol → manba skrinshoti → konstrukt xaritasi

Ushbu jadvaldagi konstrukt identifikatorlari **vaqtincha predmet oilasi (candidate taxonomy)**, production DBdagi haqiqiy construct ID ekanini tekshirmasdan import uchun ishlatilmasin. Rasmlar qayta tarqatilmaydi, mualliflik/tarqatish huquqi tekshiriladi.

| Inventar raqam | DOCX image indekslari | Predmet/mavzu (qisqa metadata) | Konstrukt nomzodi | Qayta ishlash talabi |
|---|---|---|---|---|
| 01 | 1 | PowerPoint: yozib olingan audio amallari | S2.OFFICE | Y1; ilova UI rasmlari |
| 02 | 2 | Mantiqiy ifodani baholash | S3.LOGIC | Y1; formula |
| 03 | 3 | Scratch: kiritish, sikl va o‘zgaruvchi | S4.SCRATCH | Y1; kod bloklari |
| 04 | 4–5 | Scratch Pen: chizma va kod orasidagi moslik | S4.SCRATCH | Y1; ikki skrinshot bir savol |
| 05 | 6 | Excel: shartli formulani qayta hisoblash | S2.OFFICE | Y1; formula |
| 06 | 7 | HTTPS va phishing bilan xavfsiz ishlash | S7.SECURITY | Y1; vaziyat |
| 07 | 8 | Python: kodning bajarilish natijasi | S4.CODE | Y1; kod |
| 08 | 9 | JavaScript: satr amallari | S4.CODE | Y1; kod |
| 09 | 10 | SMM, CMS, LMS, MOOC atamalarini farqlash | S7.DIGITAL | Y1; moslikka o‘xshash |
| 10 | 11–12 | MS Access: so‘rov jadvali va natija | S4.DATABASE | Y1; ikki rasm bir savol |
| 11 | 13 | Excel xato kodlarini farqlash | S2.OFFICE | Y1 |
| 12 | 14–15 | Logo/robot: chizma va algoritm | S4.SCRATCH | Y1; ikki rasm bir savol |
| 13 | 16 | Ma’lumot, axborot va bilimni farqlash | S1.INFO | Y1 |
| 14 | 17 | Grafik muharrir: Photoshop qatlam/tasvir | S5.GRAPHICS | Y1; ko‘rsatma rasm |
| 15 | 18 | Algoritm: blok-sxemadan natija | S3.ALGO | Y1; sxema |
| 16 | 19 | Word: tasvirning matn bilan joylashuvi | S2.OFFICE | Y1; UI rasm |
| 17 | 20 | Access SQL: WHERE shartlari | S4.DATABASE | Y1; SQL |
| 18 | 21–22 | HTML/CSS natijani topish | S5.WEB | Y1; ikki rasm bir savol |
| 19 | 23 | Sanoq sistemalari: ifoda | S3.NUM | Y1 |
| 20 | 24 | HTML: ro‘yxat/tuzilma | S5.WEB | Y1; kod |
| 21 | 25 | JavaScript: massiv/shart operatori | S4.CODE | Y1; kod |
| 22 | 26 | Sanoq sistemalari orasida o‘tkazish | S3.NUM | Y1 |
| 23 | 27–28 | HTML jadval: birlashtirilgan kataklar | S5.WEB | Y1; ikki rasm bir savol |
| 24 | 29 | Tasvirning bit chuqurligi | S5.GRAPHICS | Y1 |
| 25 | 30 | Mantiqiy sxema | S3.LOGIC | Y1; sxema |
| 26 | 31a | Antivirus/himoya | S7.SECURITY | Y1; 31-rasm birinchi savol |
| 27 | 31b | Protsessor va uning vazifalari | S2.HARDWARE | Y1; 31-rasm ikkinchi savol |
| 28 | 32a | Tizimli va amaliy dasturiy ta’minot | S2.SOFTWARE | Y1; 32-rasm birinchi savol |
| 29 | 32b | Ma’lumot uzatish va vaqt hisobi | S1.INFO | Y1; 32-rasm ikkinchi savol |
| 30 | 33 | HTML/CSS: rang/formatlash | S5.WEB | Y1 |
| 31 | 34–35 | Logo/turtle: koddan chizma | S4.SCRATCH | Y1; ikki rasm bir savol |
| 32 | 36 | Algoritm: bo‘luvchilarni hisoblash | S3.ALGO | Y1 |
| 33 | 37 | Kompyuter tarmog‘i/router va mulohazalar | S6.NET | Y1 |
| 34 | 38 | Mantiqiy qonun: distributivlik | S3.LOGIC | Y1; formula |
| 35 | 39 | Word: matn atrofida tasvir joylashuvi | S2.OFFICE | Y1; UI rasm |
| 36 | 40 | Xavfsiz rivojlantiruvchi ta’lim muhiti | S8.PROFESSIONAL | Y1; 5 ta kasbiy standartdan 1 |
| 37 | 41 | O‘quvchi individual xususiyatlariga moslashtirish | S8.PROFESSIONAL | Y1 |
| 38 | 42 | Pedagogning o‘z-o‘zini rivojlantirishi | S8.PROFESSIONAL | Y1 |
| 39 | 43 | Ota-ona va hamkasblar bilan hamkorlik | S8.PROFESSIONAL | Y1 |
| 40 | 44 | Tarbiyaviy faoliyatni tashkil etish | S8.PROFESSIONAL | Y1 |
| 41 | 45 | Ta’lim texnologiyasini tanlash | S9.PEDAGOGY | Y1 |
| 42 | 46 | Tarbiyaning turi | S9.PEDAGOGY | Y1 |
| 43 | 47 | Didaktik tamoyillar | S9.PEDAGOGY | Y1 |
| 44 | 48 | Dars turi va takrorlash | S9.PEDAGOGY | Y1 |
| 45 | 49 | Pedagogik muloqot va nutq | S9.PEDAGOGY | Y1 |
| 46 | 50 | Tarbiyaning turlari va natijalari | S9.PEDAGOGY | Y1; jadval |
| 47 | 51 | Didaktika kategoriyalari | S9.PEDAGOGY | Y1 |
| 48 | 52 | Pedagogik takt va muloqot | S9.PEDAGOGY | Y1 |
| 49 | 53 | Ta’lim metodlarini farqlash | S9.PEDAGOGY | Y1 |
| 50 | 54 | Pedagogikaning bo‘limlari | S9.PEDAGOGY | Y1 |

## Nashr va importdan oldingi talablar

1. Original Word skrinshotini **tasvir** holicha tekshirib, har bir savol stem/variant/sxema/kod/jadvalini aniqlash. Ikkiga bo‘lingan savollar birlashtiriladi, bittaga joylangan ikki savol alohida ajratiladi. Hech qanday tashqi OCRni asossiz ishonchli deb qabul qilmaslik.
2. Rasm, kod, jadval bilan ishlovchi savollar uchun skrinshot vizual kontenti yo‘qolmaydigan savol formatini tanlash; dekorativ skrinshotni javobni oshkor qiladigan learner assetga aylanib qolishidan saqlash.
3. 2026 rasmiy specs konstrukt IDlariga **one-to-one** mapping: muayyan savol boshqa mavzudagi darsga o‘tmasin.
4. Darslikdagi **aniq nashr/bet** asosida javob kalitini mustaqil tekshirish; skrinshotda tanlangan radio tugma bo‘lsa, uni avtomatik to‘g‘ri javob sifatida talqin qilmaslik.
5. Repozitoriy/DBda mavjud savollarga semantik dublikat/variantlarni taqqoslash. Aniqlangan aynan yoki semantik takrorlarni takror import qilmaslik.
6. Manbaga/provenancega oid xususiy ma'lumotlarni public repo'ga kiritmaslik. Private key va raw skrinshotlarni commit qilmaslik.
7. Savolning avval `review` yozuvi va keyin tasdiqlovchi ekspert/human editorial sign-off; **production publish va DB write yo‘q**.

## Shu bosqichda tasdiqlanmaganlar

- 50 ta savolning to‘g‘ri javoblari va distractorlarining fan jihatdan to‘g‘riligi.
- Mualliflik/litsenziya jihatidan har bir skrinshotni o‘quvchilar oldida namoyish qilishga ruxsat borligi.
- Mavjud 5 966 aktiv savol bazasi bilan semantik qaytarilmaslik.
- Mavzularning aniq DB construct taxonomiyasi; bu jadvaldagi kodlar preliminary.

**Xulosa:** ushbu material **aniqlangan va segmentatsiya qilingan 50 savollik manba**, lekin **published yoki tasdiqlangan 50 savollik bank emas**. Ishni shu tartibda davom ettirish lozim.

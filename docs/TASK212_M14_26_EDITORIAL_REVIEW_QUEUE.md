# TASK-212 · M14 bo‘yicha 26 ta REVIEW savolni tekshirish varaqasi

**Holat:** 2026-10-18 read-only Supabase snapshoti. Barcha 26 savol `review`, `published` emas. Ushbu varaq kimningdir tekshiruvdan o‘tkazgani yoki tasdiqlagani haqida da’vo qilmaydi.

**Manba lokatori:** bazadagi `source_reference` satrida `authored:ai-assisted:m14-closed-20261018:kasb-standarti:page-N:topic-N:question-N`. Bu **AI yordamida yaratilgan qoralama** va lokator ekanini bildiradi; sahifa manba PDFga haqiqatan mosligini inson mustaqil tekshirishi kerak. Bu faylda savol matni, maxfiy javob kaliti yoki shaxsiy ma’lumot joylashtirilmaydi.

## Har bir savol uchun majburiy qabul protokoli

- [ ] Keltirilgan source PDFning aynan o‘sha beti va qoidasi ochib tekshirildi.
- [ ] Savol bayoni mazmunan aniq; yakka to‘g‘ri javob isbotlangan; to‘g‘ri variant manba bilan mos.
- [ ] Uch noto‘g‘ri variant bir xil mavzu va mantiqiy darajada, lekin to‘g‘ri javobga aylanmaydi; kalitni ochib beradigan uzunlik/grammatika alomati yo‘q.
- [ ] Savol allaqachon published bankdagi yoki boshqa REVIEW savoldagi semantik dublikat emas; mavzu va kognitiv talab to‘g‘ri.
- [ ] Reviewer/approver va manba-bet tekshiruvi auditda real identifikator/vaqt bilan qayd etilgan (soxta signoff yo‘q).
- [ ] Muallif/reviewer mustaqilligi, immutable revision, archive/history, security/RLS va server preflight saqlangan.

## Tekshiruv reyestri (boshlang‘ich hammasi PENDING)

| Mavzu | Bazadagi AI-assisted source locator | Manba-bet | Key/distractor | Ekspert | Holat |
|---|---|---|---|---|---|
| M14.01 | kasb-standarti:page-2:topic-1:question-1 | ☐ | ☐ | ☐ | PENDING |
| M14.01 | kasb-standarti:page-2:topic-1:question-2 | ☐ | ☐ | ☐ | PENDING |
| M14.01 | kasb-standarti:page-2:topic-1:question-3 | ☐ | ☐ | ☐ | PENDING |
| M14.02 | kasb-standarti:page-4:topic-2:question-1 | ☐ | ☐ | ☐ | PENDING |
| M14.02 | kasb-standarti:page-4:topic-2:question-2 | ☐ | ☐ | ☐ | PENDING |
| M14.02 | kasb-standarti:page-5:topic-2:question-3 | ☐ | ☐ | ☐ | PENDING |
| M14.03 | kasb-standarti:page-6:topic-3:question-1 | ☐ | ☐ | ☐ | PENDING |
| M14.03 | kasb-standarti:page-7:topic-3:question-2 | ☐ | ☐ | ☐ | PENDING |
| M14.04 | kasb-standarti:page-8:topic-4:question-1 | ☐ | ☐ | ☐ | PENDING |
| M14.04 | kasb-standarti:page-8:topic-4:question-2 | ☐ | ☐ | ☐ | PENDING |
| M14.04 | kasb-standarti:page-8:topic-4:question-3 | ☐ | ☐ | ☐ | PENDING |
| M14.04 | kasb-standarti:page-8:topic-4:question-6 | ☐ | ☐ | ☐ | PENDING |
| M14.04 | kasb-standarti:page-9:topic-4:question-4 | ☐ | ☐ | ☐ | PENDING |
| M14.04 | kasb-standarti:page-9:topic-4:question-5 | ☐ | ☐ | ☐ | PENDING |
| M14.05 | kasb-standarti:page-10:topic-5:question-1 | ☐ | ☐ | ☐ | PENDING |
| M14.05 | kasb-standarti:page-10:topic-5:question-2 | ☐ | ☐ | ☐ | PENDING |
| M14.05 | kasb-standarti:page-10:topic-5:question-3 | ☐ | ☐ | ☐ | PENDING |
| M14.05 | kasb-standarti:page-10:topic-5:question-4 | ☐ | ☐ | ☐ | PENDING |
| M14.06 | kasb-standarti:page-12:topic-6:question-1 | ☐ | ☐ | ☐ | PENDING |
| M14.06 | kasb-standarti:page-12:topic-6:question-2 | ☐ | ☐ | ☐ | PENDING |
| M14.06 | kasb-standarti:page-12:topic-6:question-3 | ☐ | ☐ | ☐ | PENDING |
| M14.06 | kasb-standarti:page-12:topic-6:question-4 | ☐ | ☐ | ☐ | PENDING |
| M14.07 | kasb-standarti:page-13:topic-7:question-1 | ☐ | ☐ | ☐ | PENDING |
| M14.07 | kasb-standarti:page-13:topic-7:question-2 | ☐ | ☐ | ☐ | PENDING |
| M14.07 | kasb-standarti:page-13:topic-7:question-3 | ☐ | ☐ | ☐ | PENDING |
| M14.07 | kasb-standarti:page-13:topic-7:question-4 | ☐ | ☐ | ☐ | PENDING |

**Hisob:** 26 ta review, 0 ta ekspert tasdig‘i ushbu varaq doirasida qayd qilindi. `PENDING` savol generatoriga kiritilmaydi.

## Releasedan oldingi shart

M14ning 7/7 mavzusida 20 ta `published + keyed + canonical active` savolga yetish, barcha 26 savol bo‘yicha haqiqiy ekspert imzosi va no-mutating test preflight PASS, dedicated 15 va official 50 mock kvota/format/guruh/regressiya, exact Git SHA / production DB parity, foydalanuvchining yangi aniq release tasdig‘i. **Bular bajarilmaguncha `main`ga merge ham, production deploy yoki publish ham taqiqlanadi.**


## 2026-10-18 · Birlamchi PDF va savollarni AI yordamida solishtirish

**Manba topildi:** shaxsiy Library ichidagi “Pedagogning kasbiy standarti - qollanma.pdf”, 13 fizik PDF beti. Har bir M14 qo‘llanma bo‘limining sahifalari ajratildi; 26 REVIEW source locatorining tegishli tematik sohasi bilan matn mazmuni birlamchi solishtirildi. Bu mustaqil inson ekspertizasi va yakuniy ilmiy-normativ tasdiq EMAS. 26/26 savol PENDING saqlanadi.

| M14 mavzu | PDF sohasi / bet | Dastlabki manba mavzusi |
|---|---|---|
| 01 | 1-soha, 2-bet | DTS, o‘quv dasturi, yoshga mos rejalashtirish, AKT |
| 02 | 2-soha, 4–5-bet | Faol usullar, metakognitsiya, individual ehtiyojlar |
| 03 | 3-soha, 6–7-bet | Hamkasb maslahatlari, diagnostik/formativ/summativ baholash |
| 04 | 4-soha, 8–9-bet | O‘zini boshqarish, tolerantlik, sayohat/tadbir me’yorlari |
| 05 | 5-soha, 10-bet | Teng imkoniyat, xavfsizlik, mediasavodxonlik, inklyuzivlik |
| 06 | 6-soha, 12-bet | Kasbiy o‘sish, adabiyot, uslubiy kengash va refleksiya |
| 07 | 7-soha, 13-bet | Ota-ona/mutaxassis/jamoatchilik bilan hamkorlik |

### Dastlabki nomzod sifatida ajratilgan tahrir signallari

Quyidagi lokatorlar hech qanday javob kalitini oshkor qilmaydi, faqat review uchun diagnostika:

| Source locator (M14.topic, page, question) | Daraja | Masala |
|---|---|---|
| M14.01 · p2 · q1 | Termin aniqligi | Javobda keltirilgan standart/ta’lim talabi atamasi manbadagi rasmiy nom bilan satrma-satr bir xil emas; tahrirda tekshirish |
| M14.01 · p2 · q3 | Distractor | Ba’zi muqobil javoblar pedagogik rejalashtirish bilan mazmunan uzoq |
| M14.04 · p8 · q3 | Distractor / tahrir | Kutubxona yuritish haqidagi bir muqobil javob noaniq va past ishonchlilikda |
| M14.04 · p8 · q6 | Distractor | Uch muqobil javobning bir qismi tarbiyaviy kompetensiyaga yaqin emas |
| M14.06 · p12 · q2 | Distractor | Yolg‘on variantlar metodik kengash vaziyatida juda oson rad qilinadi |
| M14.06 · p12 · q3 | Distractor | Asosiy javobdan boshqa variantlar mazmunga juda uzoq |
| M14.07 · p13 · q1 | Grammar cue / distractor | Noto‘g‘ri variantlarning bir xil cheklovchi iboralar bilan boshlanishi topishni osonlashtiradi |
| M14.07 · p13 · q3 | Distractor | Jamoatchilik hamkorligi vaziyatiga aloqasiz variantlar bor |

**Bu ro‘yxat minimum diagnostik flaglar:** qolgan savollarga ekspert sifati bo‘yicha PASS berilmagan. Mashina hisoblagan 0 uzunlik flagi savolning yakkayu yagona to‘g‘ri javobga ega ekanini yoki distractorlarning mazmunan yaxshi ekanini isbotlamaydi.

### Xavfsiz keyingi qadam
1. Mualliflik/review huquqli muharrir uchun yuqoridagi 8 lokatorni original variantlar bilan ochish; xato semantik/chalg‘ituvchi variantlarni manba va o‘quv maqsadiga mos qayta yozish.
2. Har bir o‘zgarishni oldingi source-key va archived/history integritetini saqlaydigan revision workflow orqali reviewda saqlash.
3. Barcha 26 item bo‘yicha haqiqiy manba-bet, yagona javob, normativ dolzarblik va distractor eksperti tasdiqlamaguncha statusni reviewda qoldirish.

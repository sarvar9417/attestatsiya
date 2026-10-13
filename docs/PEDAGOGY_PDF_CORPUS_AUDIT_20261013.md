# Pedagogika PDF korpusi auditi — 2026-10-13

**Status:** faol import/review ishlari. Ushbu hujjat foydalanuvchi taqdim etgan pedagogik mahorat, kasb standarti va diagnostika PDFlarini platformadagi M14/M15/M16 nazariya hamda savol bankiga xavfsiz aylantirish uchun inventar hisobidir.

## 1. Rasmiy release kontrakti

2026 Informatika attestatsiya spetsifikatsiyasi platforma uchun ustuvor kontrakt bo‘lib qoladi:

- jami 50 test, 120 daqiqa;
- 35 ta fan, 5 ta kasb standarti, 10 ta pedagogik mahorat;
- pedagogik qismda 5 KS + 7 umumiy pedagogika + 3 informatika o‘qitish metodikasi sloti;
- Y1/Y2/Y3 formatlari;
- test topshiriqlari tavsiya etilgan manbalardagi tamoyil va yondashuvlarga mos bo‘lishi, ammo manba matnini mexanik nusxalamasligi kerak.

Tarixiy “tushgan testlar” to‘plami rasmiy spetsifikatsiyani almashtirmaydi. Ular mavzu chastotasi, savol vaziyati va terminologiya signali sifatida ishlatiladi; javob kaliti birlamchi nazariy manba bilan moslashtirilmaguncha mustaqil haqiqat deb qabul qilinmaydi.

## 2. Savol korpusi inventari

| Fayl | Sahifa | Kuzatilgan yuqori raqam / hajm | Holat |
|---|---:|---:|---|
| Attestatsiya to'plam ped mahorat @PedMahoratGuli.pdf | 81 | 345 gacha | 2024 bahorgi tarixiy savollar + nazariya ilovalari |
| Pedagogik mahorat to'plam 2025.pdf | 43 | 200 gacha | 2025 bahorgi tarixiy savollar + nazariya ilovalari |
| Pedmahorat to'plam 2025 kuzgi.pdf | 23 | 49 gacha | 2025 kuzgi tarixiy savollar + qobiliyat nazariyasi |
| PedKasb tushgan testlar PedMahoratGuli (1) (1) (1).pdf | 40 | 192 gacha | 2026 bahorgi tarixiy savollar |
| Pedagogika testi 3.pdf | 5 | 15 | amaliy/diagnostik savollar |
| Pedmahorat 4.pdf | 7 | 15 | amaliy/diagnostik savollar |
| pedagogika6.pdf | 6 | 15 | amaliy/diagnostik savollar |
| diagnostika.pdf | 6 | 15 | amaliy/diagnostik savollar |

Nominal raqamlangan slotlar yig‘indisi **taxminan 846**. Bu **846 ta noyob va tekshirilgan savol degani emas**: yillar orasida takrorlar, qayta ifodalangan savollar, bir savol ichidagi raqamlangan bandlar va ayrim raqamlash/OCR anomaliyalari mavjud. Yakuniy unique bank soni deduplikatsiya va editorial tekshiruvdan keyin chiqadi.

## 3. Nazariya uchun asosiy manbalar

### Pedagogning kasbiy standarti - qollanma.pdf — 13 sahifa
Kasbiy standartning 7 doirasini to‘liq qamrab oladi:
1. O‘quv jarayonini rejalashtirish.
2. Ta’lim samaradorligini ta’minlash.
3. O‘zlashtirishni baholash va qayta aloqani taqdim etish.
4. Tarbiyaviy faoliyatni tashkil etish.
5. Xavfsiz rivojlantiruvchi ta’lim muhitini yaratish va ta’minlash.
6. O‘z-o‘zini rivojlantirish va kasbiy o‘sish.
7. Hamkasblar va ota-onalar bilan hamkorlik.

Har bir sohada mehnat vazifalari, zarur ko‘nikmalar va zarur bilimlar platformadagi M14 nazariyasiga source-grounded tarzda kiritiladi.

### Xoliqov Pedagogik mahorat.pdf — 28 sahifa
Korpus pedagogik mahoratning mohiyati, komponentlari, kasbiy tayyorgarlik, pedagogik qobiliyatlar, ijodkorlik, muloqot madaniyati, sinfni boshqarish uslublari, pedagogik nazokat, pedagogik texnika, mimika/pantomimika va nutq xususiyatlarini qamrab oladi. M15 nazariyasining asosiy manbalaridan biri.

### Tarixiy to‘plamlardagi nazariya ilovalari
2024–2025 to‘plamlarning oxirgi qismlarida pedagogik tadqiqot metodlari, DTS tarkibi, pedagogik texnologiya darajalari, pedagogik qobiliyatlar va boshqa terminologik jadvallar mavjud. Ular tegishli canonical darslarga manba izi bilan qo‘shiladi.

## 4. Importdan chiqarilgan materiallar

- **pdf_6aa7467ea6c64_2026-09-14_00-57-34.pdf** — test natijalari jadvali; savol/nazariya korpusiga kiritilmaydi va undagi shaxsiy natijalar savol bankiga ko‘chirilmaydi.
- **Xodiyev Academy Turbo Marafon- 2026.pdf** — asosan marketing va marafon tashkiliy materiali. Faqat spetsifikatsiya yoki o‘qish jarayoniga oid mazmunli pedagogik konsept bo‘lsa signal sifatida ishlatiladi; reklama matni import qilinmaydi.

## 5. Savol bankiga aylantirish qoidasi

Har bir tarixiy yoki diagnostik savol quyidagi bosqichlardan o‘tadi:

1. source file + sahifa/raqam identifikatsiyasi;
2. normallashtirish va dublikat/rephrase aniqlash;
3. official construct (KS / PM.GEN / PM.MET) bilan mapping;
4. historical answer markerini birlamchi nazariya bilan tekshirish;
5. qarama-qarshi yoki terminologik noaniq javobni **review/quarantine**da qoldirish;
6. original, copyright-safe learner wordingini yaratish;
7. 4 variant/format invariantlari, server-side key va explanation;
8. source_lesson va source_reference;
9. editorial review;
10. shundan keyingina publish.

Masalan, 2026 tarixiy to‘plamda “talab qilinayotgan kattalikdan boshlab berilgan kattaliklarga tomon borish” uchun “sintetik usul” javobi berilgan. Bu atama mustaqil manba bilan tasdiqlanmaguncha platformada avtomatik canonical kalitga aylantirilmaydi.

## 6. Hozirgi bajarilgan ish

- 84 ta mustaqil yozilgan, PedGuli mavzu signallaridan kelib chiqqan savol productionda **review** holatida.
- M14 dagi barcha 7 canonical kasb-standarti darsi to‘liq manba asosida kengaytirildi.
- M15 pedagogik mahorat darslarining asosiy qismi Xoliqov va yuklangan attestatsiya nazariyasi bilan kengaytirildi.
- 10 ta bo‘sh, ishlatilmaydigan M14/M15 legacy dars learner-visible holatdan chiqarilib archived qilindi.
- Published savollar integrity: missing key = 0, missing source reference = 0, missing source lesson = 0, construct/source lesson mismatch = 0.
- M15ning qolgan nazariy qamrovi va barcha 3 ta M16 metodika darsi ham source-grounded nazariya bilan kengaytirildi.
- Productionda service-role-only `pedagogy_pdf_source_candidates` inbox yaratildi; raw tarixiy matn learner APIga ochilmaydi.
- Hozir private inboxga **649 ta yuqori/o‘rta ishonchli ajratilgan source candidate** kiritildi: 2024 bahor 273, 2025 bahor 150, 2025 kuz 36, 2026 bahor 190.
- 649 qatorda **622 ta exact-text fingerprint** bor; 26 ta exact dublikat guruhida jami 53 qator qatnashadi. Bu faqat aynan bir xil matnni ushlaydi; rephrase dublikatlar keyingi semantik reviewda ajratiladi.
- 2026 faylida numbering bo‘yicha 122 va 143 yo‘q: manbada 121 dan 123 ga, 142 dan 144 ga o‘tadi. Shu sabab bu ikkisi “parser yo‘qotgan savol” deb avtomatik to‘ldirilmaydi.
- Qolgan nominal slotlar avtomatik ravishda “yetishmayotgan savol” deb hisoblanmaydi: ayrim PDFlarda raqamlash sakrashi, bir savol ichidagi raqamlangan bandlar, nazariya jadvallari va layout/parsing anomaliyalari bor. Ular manual/semantic parsing navbatida.

## 7. Muhim cheklov

“Tarixiy test to‘plamida javob yozilgan” = “rasmiy tekshirilgan kalit” emas. Platforma manbaga zid yoki tekshirilmagan javobni faqat tezroq bankni kattalashtirish uchun publish qilmaydi. Maqsad son emas, spetsifikatsiya bo‘yicha **to‘liq qamrov + to‘g‘ri manba + ishonchli kalit**.

## 8. Review-pipeline holati — 2026-10-13

649 ta private source candidate productionda strukturaviy triage qilindi. Mapping faqat aniq source signal mavjud bo‘lganda `mapped_construct_id`ga yoziladi; weighted qoidalar qolganlari uchun faqat `suggested_constructs` beradi.

- hard-safe mapped: **175**
- medium suggestion: **192**
- ambiguous: **46**
- low/unmapped: **236**
- exact duplicate links: **27**
- conservative near-duplicate review links: **22**
- parser bleed flag: **42**
- negative-wording review flag: **15**
- known answer/terminology conflicts: **2**
- independently source-lesson bilan tekshirilgan historical answer marker: **12**

Muhim fail-closed misol: 2026 manbadagi jismoniy tarbiya haqidagi, lekin javobida baholash natijasiga ko‘ra rejani moslashtirish aytilgan savol avtomatik `PM.GEN.03` ga bog‘lanmadi; hard-safe gate uni `mapped_construct_id = NULL` holatiga qaytardi. Shuningdek, 2026 q14 analitik/sintetik terminologiyasi va q144 bullying savoli source-key conflict sifatida avtomatik learner keydan chiqarilgan.

Raw candidate jadvali learner rollariga ochilmagan: `anon SELECT = false`, `authenticated SELECT = false`.

### Original review bank v1

PDF korpusi va canonical M14/M15/M16 nazariyasidan foydalanib **36 ta yangi, original Y1 savol** yozildi:

- 18 ta rasmiy pedagogika constructining har biriga aynan 2 tadan;
- 36/36 `review`, **0 published**;
- 36 server-side key;
- 144 variant;
- source lesson/construct mismatch = 0;
- 12 ta tarixiy source marker canonical dars bilan mustaqil tekshirilib source candidate bilan provenance link olgan.

Bu bank historical savol matnlarini ko‘chirmaydi. Ular mavzu/vaziyat signali sifatida ishlatilgan, learner savollari esa canonical nazariya asosida qayta, original yozilgan.

Production holati shu bosqichdan keyin: **1645 published (o‘zgarmagan), 186 review, 5 archived; published integrity issues = 0.**

Keyingi editorial ish: medium/ambiguous/low candidate-larni semantik guruhlash va source bilan tekshirish; review bankni inson editorial tasdig‘isiz publish qilmaslik.

## 9. Review wave 2 — 2026-10-13

Keyingi editorial wave productionda fail-closed tartibda bajarildi.

### Source candidate verification
- **13 ta yangi candidate** canonical M14/M15/M16 nazariyasi bilan individual tekshirildi.
- Oldingi v1 provenance bilan birga hozir **25 ta candidate** `answer_key_status = independently_verified`, `editorial_status = verified` va review-question provenance linkiga ega.
- `mapped_construct_id` soni **186** ga yetdi.
- **2 ta source conflict** o‘zgarishsiz quarantine holatda qoldi.
- exact duplicate = **27**, near-duplicate review = **22**.

Verification faqat raw manbadagi javob canonical nazariya bilan aniq mos kelganda beriladi. Medium/ambiguous signalning o‘zi verification hisoblanmaydi.

### Original review bank v2
Yana **18 ta original review-only savol** yaratildi:
- **9 ta Y2 matching**;
- **9 ta Y3 ordering**;
- 18 rasmiy KS/PM constructining **har biriga bittadan**;
- source lesson/construct mismatch = **0**;
- published = **0**.

v1 + v2 bo‘yicha PDF-korpusdan kelib chiqqan original review savollar jami **54 ta** bo‘ldi. Production umumiy holati: **1645 published, 204 review, 5 archived**; published integrity issue = **0**.

Raw tarixiy savol va javoblar learnerga ochilmagan. Review bank historical wordingni ko‘chirmaydi; source candidate mavzu/provenance signali, canonical nazariya esa javob va izoh uchun release contract sifatida ishlatiladi.

## 10. Exhaustive 624-candidate editorial disposition — 2026-10-13

Foydalanuvchi ko‘rsatmasiga binoan qolgan **624 ta `needs_review` candidate** to‘liq yakuniy dispositiondan o‘tkazildi. Raw source qatorlari o‘chirilmagan; har biri private provenance sifatida bazada saqlanadi.

### Yakuniy natija
- oldindan verified: **25**
- ushbu exhaustive wave’da canonical M14/M15/M16 nazariyasi bilan qoida asosida mustaqil tekshirilgan: **170**
- jami verified source candidate: **195**
- rejected/quarantine: **454**
- qolgan `needs_review`: **0**
- jami private candidate: **649**
- mapped construct mavjud: **265**

### 454 rejected/quarantine tarkibi
Bu qatorlar **o‘chirilmagan** va “foydasiz” deb hisoblanmaydi. Ular learner savoliga avtomatik aylantirish xavfsiz bo‘lmagani uchun yakuniy review disposition oldi:

- no safe official construct mapping: **335**
- historical answer canonical nazariya bilan mustaqil tasdiqlanmadi: **29**
- parser bleed / non-atomic extraction: **39**
- exact duplicate provenance: **27**
- near-duplicate provenance: **22**
- known source-answer/terminology conflict: **2**

Bu kategoriyalar jami **454**. Parser-bleed umumiy flagi 42 qatorda mavjud, lekin 3 qator yuqoriroq ustuvor duplicate/conflict dispositioniga tushgani sabab alohida parse-reject soni 39.

### Verified gate
`verified` status faqat quyidagi shartlarda berildi:
1. source answer marker canonical nazariyadagi aniq tushuncha bilan mos;
2. bitta active official KS/PM constructga bir ma’noli mapping bor;
3. conflict yo‘q;
4. exact/near duplicate emas;
5. parser bleed yo‘q.

Verified qatorlarda duplicate = 0, near-duplicate = 0, parser-bleed = 0, conflict = 0, unmapped = 0, unverified answer = 0.

### Learner-bank holati
Exhaustive source review learner savollarini avtomatik publish qilmaydi. Savollar soni o‘zgarmadi: **1645 published, 204 review, 5 archived**; published integrity issue = **0**.

Shu bilan private PDF candidate inboxda **`needs_review = 0`** ga erishildi. Keyingi savol-bank kengayishi faqat verified source signal + canonical lesson asosida original wording bilan bajariladi; rejected/quarantine qatorlaridan tasdiqlanmagan key olinmaydi.


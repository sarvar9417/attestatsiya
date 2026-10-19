# TASK-253 — M01: 5 ta HIGH editorial item uchun qayta yozish takliflari

**Holat: DRAFT / REVIEW-ONLY, 2026-10-19.** Manba: 400 itemli public authoring bank va `docs/audits/TASK252_M01_58_ITEM_SOURCE_REVIEW.tsv`. Asl savollar, kalit, migration va production **o‘zgartirilmagan**. Quyida o‘quvchi ko‘radigan yangi variant faqat ekspert tasdig‘idan keyingi revision uchun.

## 1. ARS-01-042 — AKT vs raqamli texnologiya

**Muammo:** Kompyuter, proyektor va onlayn aloqadan foydalanish AKT bilan birga keng ma’noda raqamli texnologiyalar hamdir; «asosiy tushuncha» yetarlicha chegaralanmagan.

**Yangi candidate stem:** «O‘qituvchi kompyuterdan o‘quv materialini tayyorlash, proyektorda namoyish qilish va internet orqali ota-onalarga yetkazish uchun foydalanmoqda. Qaysi atama aynan axborotni qayta ishlash va telekommunikatsiya vositalari orqali almashishni birgalikda qamrab oladi?»

**Candidate key:** AKT (oldingi to‘g‘ri variant), lekin distractor «Raqamli texnologiya» ham juda yaqin; uni alohida keskinroq tafovutli distractorga almashtirish yoki faqat qonuniy aniqlangan qo‘llanma terminidan foydalanish kerak.

**Source candidate:** Cambridge+10–11 1-bob, bosma 1–8-bet. Darslikda mazkur farq aynan belgilangani ekspert tomonidan hali isbotlanmagan.

## 2. ARS-01-043 — elektron imzo va raqamli kodlash

**Muammo:** Elektron imzoli skanerlash AKTning ham qo‘llanishidir; asosiy ta’rif raqamli format va ikkilik kodga bevosita ishora qilishi zarur.

**Yangi candidate stem:** «Skanerdan olingan tasvir kompyuter xotirasida piksel qiymatlari — diskret sonli kodlar sifatida saqlandi. Bu ta’rifdagi asosiy belgi qaysi texnologiya turiga xos?» 

**Candidate key:** Raqamli texnologiya, boshqa distractorlar original savolnikidek, lekin «AKT»ni savolga kiritishdan oldin source-concordance aniqlansin.

**Source candidate:** ICT7 26–33-bet: matn kodlash, rastr va RGB; Cambridge+10–11 1-bob. Bu source mapping individual wording approval emas.

## 3. ARS-01-049 — obyekt vs kutubxona haqidagi xabar

**Muammo:** «Kutubxona haqidagi ma’lumotlar yig‘ildi» iborasida na obyekt, na xabar qanday vazifa bajarishi ko‘rsatilgan; 4 ta variantdan «xabar» ham o‘quvchi uchun asosli bo‘lishi mumkin.

**Yangi candidate stem:** «Tadqiqotchi maktab kutubxonasining fondi, joylashuvi va kitobxonlar sonini o‘rganmoqda. Bu yerda o‘rganilayotgan maktab kutubxonasi axborot modeli nuqtayi nazaridan nima hisoblanadi?»

**Candidate key:** Obyekt.

**Source gate:** hozirgi TSV `NONE_VERIFIED / OPEN`; bosma bet topilmaguncha savolni approved deb belgilamaslik. Keyingi audit ICT9 modellash mavzusi (17–26-bet) bilan solishtirsin.

## 4. ARS-02-037 — kombinatsiyalashgan axborot

**Muammo:** Slayddagi audio vaqt bo‘yicha dinamik, matn va diagramma statik — «dinamik axborot» distractori asosli ko‘rinishi mumkin.

**Yangi candidate stem:** «Bir o‘quv resursi matn, diagramma va ovozli izohdan tashkil topgan. Resursning **turli ifoda shakllari birga qo‘llanganligi** bo‘yicha tasnifini toping.»

**Candidate key:** Kombinatsiyalashgan axborot.

**Source candidate:** ICT7 26–38-bet: kodlash, grafika, ovoz. «Kombinatsiyalashgan» terminining aynan shu ko‘rinishi darslikda uchrashi alohida tasdiqlansin.

## 5. ARS-03-047 — yaratish/yig‘ish va qayta ishlash

**Muammo:** Hisobot tuzish ham, so‘rovnomani jamlash ham axborotni qayta ishlash va tahlil qilish bilan qoplanishi mumkin.

**Yangi candidate stem:** «O‘quvchi yangi kuzatish natijalarini yozib oldi va sinfdoshlaridan hali qayta ishlanmagan so‘rovnoma javoblarini to‘pladi. Hozir faqat qaysi bosqichlar amalga oshirilgan?»

**Candidate key:** Axborotni yaratish va yig‘ish.

**Source candidate:** ICT7 4–8-bet: input–process–output. Original TSV `RELATED_ONLY`; konkret aynan shu juft jarayon kitobda ta'riflanganini alohida tekshirish kerak.

## Umumiy release gate

1. Darslikning aniq bosma beti + terminning aynan ta’rifini tasdiqlovchi dalil.
2. 2026 rasmiy spetsifikatsiyasida ushbu ko‘nikma mavzuga mosligi.
3. To‘rt variantning bitta aniq to‘g‘ri javobi borligi, mutaxassis review.
4. Yangi immutable revision, regressiya testlari, sinov muhiti va tasdiqlangan publish amali. **Hozircha hech qaysisi published emas.**

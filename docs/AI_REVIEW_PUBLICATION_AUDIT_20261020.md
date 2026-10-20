# Attestatsiya — AI-sifat auditi va nashrga chiqarish hisoboti

**Sana:** 2026-10-20
**Database:** sarvar9417 / Supabase `plyqezulrfowyblsfpzy`
**So'rov:** review navbatidagi savollarni ekspert darajasida mustaqil tekshirish va xavfsiz nashr qilish; egasi tashqi ekspert imzosini majburiy deb hisoblamaydi.

## Haqiqiy bajarilgan nashr

**30 ta S5.WEB / GV-EXAMSTYLE:20261020 savol** (M10/M11 da allaqachon `published` bo'lgan darslar):
- **20 ta Y1**: CSS specificity/combinators, box model, Paint/Photoshop, RGB/CMYK, rastr/vector, HTML tags/jadvallar/formalar, crop/resize/PPI. To'g'ri variant va qolgan uch variant mazmunan tekshirildi.
- **5 ta Y2**: CSS selektorlari, grafik muharrir asboblari, grafik formatlar, HTML fragmentlari, grafik operatsiyalar. Chap-o'ng ustun va 4 juft to'liq.
- **5 ta Y3**: CSS kaskadi, Photoshop maskasi, logo eksporti, ichma-ich HTML ro'yxati, crop/eksport amallari. 4 bosqichning tartib kaliti to'liq.
- Nashrdan **keyin** 30/30 javob payload va variant bog'lanishlari qayta tekshirildi, 0 texnik xato.
- Qamrov faqat `GV-EXAMSTYLE:20261020:%` **va nashrdagi darslar** bilan chegaralangan; boshqa review savollar holati tasodifan o'zgartirilmadi.

## Tahrir qilingan, lekin hali reviewda qolgan

Pedagogika korpusidagi ikki savolda distractor uzunligi notekis:
- `drive:13VVttASqpDVP4R1fsVtt3YARHs4uHnB8:q42` — 3 ta chalg'ituvchi variant qayta yozildi; so'z uzunligi 5–6 oralig'ida; original to'g'ri option ID saqlanadi.
- `drive:13VVttASqpDVP4R1fsVtt3YARHs4uHnB8:q53` — 3 ta chalg'ituvchi variant qayta yozildi; so'z uzunligi 4–5 oralig'ida; original to'g'ri option ID saqlanadi.
Bu savollardan oldingi imtihon sessiyasida foydalanilmagani tekshirilgan. **Boshqa inson tekshirgan deb noto'g'ri qayd kiritilmadi.**

## Audit natijasidagi bloklar

Dastlab 1 286 ta `review` savol mavjud edi. Shu jarayon davomida **men 30 tasini** `published` qildim. Boshqa mustaqil jarayon 6 ta M06 algoritmlash grafikali savolni chiqardi va `public/algoritmlash-v4` SVG fayllarini `main`da joyladi; men bu 6 tasining nashrini o'zimning ish natijam deb ko'rsatmayman.

Keyingi snapshot bo'yicha **1 250 ta review** qolgan:

| Guruh | Review | Sabab |
|---|---:|---|
| KS | 13 | `PEDAGOGY_EDITORIAL_APPROVAL_REQUIRED`: tasdiqlangan editor / aniq owner waiver qaydi yo'q |
| PM.GEN | 17 | xuddi shu editorial nashr qoidasi |
| PM.MET | 2 | xuddi shu editorial nashr qoidasi |
| S2.HW (M02) | 542 | `KTD_INDEPENDENT_EXPERT_REVIEW_REQUIRED`: `ktd_quality.editorial_reviews` yozuvlari mavjud emas |
| S4.DB (M09) | 296 | manba darslar hali `review`; savollarni endigina `published` qilish yetarli emas |
| S5.WEB (M10/M11) | 380 | manba darslar hali `review`; `GV2` nashri uchun yana editorial dalil majburiy |
| **Jami** | **1 250** | |

Qolgan korpusning dastlabki avtomatik yaxlitlik auditi javob key payloadlari, variant sonlari, aktiv konstrukt va aniq stem takrorlari bo'yicha manfiy natija bermadi. **Bu har bir savol semantik jihatdan mutlaq to'g'ri degani emas.** M02 review ichidagi 542 savoldan **196 tasida** 1.8:1 dan ortiq variant-so'z uzunligi tafovuti yoki javob variantining boshqalarga nisbatan uzunligi 1.25 marta ko'proq bo'lishi aniqlangan (yagona sabab va mustaqil inson tasdig'i emas). 528 ta KTD generatsiyasi alohida manbaga asoslangan semantik ekspertiza uchun qoladi.

## Muhim audit yaxlitligi talabi

Bazadagi triggerlar real ekspert yoki egasi vakolatini tekshiradi. Chatdagi AI tanqidiy tahlilini o'zboshimchalik bilan insonning `reviewer_id` imzosiga tenglashtirish yoki E2E/test admin akkaunti nomidan owner waiver kiritish **noto'g'ri**. Shu sabab himoya triggerlari o'chirilmadi, egasi nomidan soxta qayd kiritilmadi.

Agar haqiqiy foydalanuvchi tomonidan tasdiqlangan owner waiver/AI QA yo'li talab qilinsa, alohida dasturiy autentifikatsiya, fingerprints va audit izi bilan ishlab chiqilishi kerak. Bu joyga kelmaguncha `review` yozuvlarini majburan ommaviy `published`ga o'tkazish sifatsiz/yaroqsiz kontentni foydalanuvchiga ko'rsatish xavfini oshiradi.

## Alohida M04

M04 / S3.LOGIC `review` = **0**; ushbu ish M04dagi allaqachon `published` savollarni qayta ochib/yashirincha tahrirlamadi. Oldingi auditga ko'ra M04da **649 ta `published`** savol mavjud.

## Keyingi bajariladigan aniq ishlar

1. Ownerni ilovadagi **haqiqiy autentifikatsiya** bilan identifikatsiya qilish; AI-revizor yo'lini alohida, rost qayd bilan boshqarish (agar loyiha siyosati bunga ruxsat etsa).
2. KTD 528, authored M02 14, pedagogika 32 va qolgan 676 ta reviewdagi yangi kontent uchun manba-bet-variant/javob izohi bilan savolma-savol tekshiruv.
3. M09 va M10/M11 reviewdagi nazariyalarni sinovdan o'tkazib, avval mavzularni rasmiy nashr qilish; shundan keyin test chiqarishni qayta baholash.
4. Authenticated E2E test: Y1/Y2/Y3 navigatsiya, kalit, grafik, javob qayd etilishi va progress.

**Bu hujjat real qilingan ishlarning audit izi; qolgan 1 250 savol nashr qilingan yoki yakuniy ekspertizadan o'tgan deb da'vo qilmaydi.**

## KTD 528 savolning qo'shimcha ichki ta'rif-kalit tekshiruvi
- Generator guruhlari: 108 ta «eng aniq ta'rif», 108 ta «atama–ta'rif juftligi», 70 ta «noto'g'ri izoh», 76 ta ikkita mulohaza, 166 ta vaziyatli savol.
- 108+108 ta manbadan **104 atama** bo'yicha ichki tushunchalar lug'ati tiklandi. 6 ta so'zlashuv farqi qayd etildi (kesh, firmware, maxsus dastur); ular avvalo muqobil to'g'ri izohlar, avtomatik javob xatosi emas.
- **70/70** «noto'g'ri izohni toping» savolidagi tanlangan izoh atamaning lug'atdagi asosiy izohi bilan **matnan bir xil emas**; uning boshqa to'g'ri muqobil ta'rif bo'lish ehtimoli uchun mustaqil mazmuniy tekshiruv talab qilinadi.
- **76** ikkita mulohazali savoldan **73 tasi** avtomatik tekshiruvga to'liq mos, **2 tasi** ayni ma'noni boshqa jumlada ifodalagani uchun avtomatik «false negative», **1 tasi** til shabloni ajratilmagani uchun yana qo'lda tekshirish kerak.
- 166 vaziyatli savoldan **94 tasi** lug'atdagi ayni ibora bilan qoplanadi; **72 tasida** vaziyatli izohlar sabab avtomatik bir xillik yetarli emas.
- Bu nazorat **mustaqil tashqi manba ekspertizasi yoki autentifikatsiyalangan editorial imzo emas**. Ushbu guruh `review` holatida saqlanadi.

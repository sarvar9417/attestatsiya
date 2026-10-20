# TASK-338 — M10 Adobe Photoshop: 8 ta maxsus AI-audit savolini nashr qilish

**Sana:** 2026-10-20. **Haqiqiy manba:** [2026-yil Informatika attestatsiyasi spetsifikatsiyasi, 27–31-savollar](https://drive.google.com/file/d/1jJstcqgFXwTJKuH9bkRIpvATEsjM2UnQ/view), [ICT 7-sinf 2021, 50–79-betlar](https://drive.google.com/file/d/1QMT7y-6nJLQ-f1-4SySBV8y8JrRpp4q-/view). **Review turi:** AI yordamida yakka matn/kalit izchil tekshiruvi va foydalanuvchining shu suhbatdagi bevosita publish ko‘rsatmasi. **Mustaqil inson eksperti imzosi yo‘q.**

## Manbaga moslik
7-sinf 13-dars: Photoshop interfeysi; 14-dars: belgilash, kesish va rang; 15-dars: qatlamlar; 17-dars: matn; 18-dars: sahifa dizayni. 2026 spetsifikatsiyasi faqat Paint/Photoshop yaratish va tahrirlash amallarini majburiy konstrukt sifatida belgilaydi; 27–31-savollardagi beshta savol HTML/CSS va grafika uchun umumiy.

## Faqat sakkizta tanlangan yozuv
- **Y2 4 ta:** Paint/Photoshop asboblari; qatlam boshqaruv xossalari; Layer Mask/Smart Object/adjustment/duplicate layer; Brightness/Contrast/Hue-Saturation/Gaussian Blur.
- **Y3 4 ta:** Paint asl tasvirni asragan holda Save As; Photoshop tanlovni qatlamga olish; maska orqali fonni qaytariladigan yashirish; adjustment layer va PSD/PNG eksport ketma-ketligi.
- Javoblarning 4×4 mosliklari, to‘rt bosqichli tartiblari, alohida kalitlari, variant uzunligi va qarama-qarshi ma’nosi, noaniq joylari manba asosida tekshirildi. Mavjud nashr etilgan savollarda **aynan bir xil stem** borligini tekshiruvchi DB sharti bor. Bu to‘liq semantik klon audit emas.
- Sakkiztasining barchasida **assets=[]**. Bu 8 ta uchun rasmga bog‘liq noaniqlik yo‘q; boshqa GV2 rasmli savollar majburiy rasm-auditdan o‘tmaguncha reviewda qoladi.
- Serverdagi original review savollari o‘quvchilarga oshkor qilinmaydi: faqat manba va ID kontrakti repositoryda.

## Qattiq nashr kontrakti
1. Qo‘shilgan `m10_owner_ai_release_waivers` jadvali RLS ON; faqat service_role selekt/insert; bitta faol admin ishlatiladi; `reviewer_kind='ai'` aniq, inson ekani da’vo qilinmaydi.
2. SHA-256 o‘rniga mavjud `professional_question_fingerprint` (MD5 content signature) bazasi ishlatiladi; stem, turlar, kalit, manba, variantlar fingerprintda. Bu mavjud fingerprint *tamper-detection* funksiyasi, parol-xavfsizligi kafolati emas.
3. `guard_graphics_web_v2_publication` oldingi mustaqil inson tasdiqlash yo‘lini saqlaydi; **faqat** shu 8 ta waiver+admin+fingerprint+ma’lum canonical lesson+construct bo‘lganda istisno. Qolgan 372 GV2 revisions avtomatik nashr qilinmaydi.
4. Qoidaga mos `Y2` va `Y3` key/option invarianti, sakkiz unique ID+reference, nashr etilgan source lesson, distinct options, zero image va maxsus scope tekshirilsagina tranzaksiya commit.
5. Eski `review`ning manbasi `paint-photoshop-v2-review`dan mavjud `paint-va-photoshop-asoslari` published canonical darsiga ko‘chiriladi, manba darsning original UUIDsi waiver ledgerda saqlanadi. Yangi V2 nazariya ommaviy nashr qilinmaydi.
6. Nashr qilgandan keyin savol/option/key immutable; har qanday tahrir yangi reviziyada bo‘lishi kerak.
7. Clean CI’da jonli random 8 UUID topilmasa **hech narsa publish bo‘lmaydi**, faqat kengaytirilgan trigger/ledger yaratiladi. Noma’lum to‘liq bo‘lmagan cohort bloklanadi.

## Rollback va tekshiruv
2026-10-20 production strukturasida `BEGIN ... ROLLBACK` tranzaksiya rejalashtirilgan sakkizta yozuv bilan sinab ko‘rilgan; **0 ta real production publication** shu rehearsal hisobida. GitHub CI birinchi mustaqil nashr sharti. CI yashil va PR merge’dan keyin aynan migration productionga bir marta qo‘llanadi. Keyin 8/8 statuses, fingerprint, published canonical lesson, qolgan review statuslari va topic-test / 50-item module pool qayta SELECT bilan tekshiriladi.

**Qolgan ochiq ish:** ba’zi savollar murakkablik ko‘rsatkichi keyin kalibratsiya qilinishi mumkin; barcha 76 Paint/Photoshop V2 va 380 Graphics/Web korpusi tekshirilib nashr qilingan deb bo‘lmaydi. Eski rasmli diagrammalar uchun PDF rasmiga 1:1 vizual ekspertiza hali kerak. Ishchi sahifaning 7 mavzusiga mos mavzuga oid nazariya bu o‘zgarishda avtomatik server-publish qilinmaydi. Vercel deploy alohida jarayon.

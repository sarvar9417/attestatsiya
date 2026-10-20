# TASK-210 — MS Access V2: birinchi mustaqil tekshirilgan release nomzodlari

Sana: 2026-10-20

## Alohida AI orqali mazmuni hisoblangan 8 Y1 savol
`MSACCESS-DEMO-STYLE-2026/DBS-Q01`–`DBS-Q08`.

Bular yangi, mustaqil yaratilgan va demo savolning uslubiga moslashtirilgan topshiriqlar; asl imtihon savoli deb da'vo qilinmaydi.

### AI QA dalillari (human editorial review emas)
- 8/8: Y1 format, to‘rttadan noyob variant va 75+ belgili izoh mavjud.
- 8/8: javob kalitlari manbaviy fakt/mantiqiy xulosaga mos deb AI tomonidan qayta tekshirildi.
- 6/6: Q01–Q06dagi ma'lumotdan olinadigan natijalar maxsus vaqtinchalik PostgreSQL VALUES asosidagi **mustaqil hisoblash** bilan javob kalitiga solishtirildi va mos chiqdi. Bu Microsoft Access.exe ishga tushirilgan degani emas.
- Q07: Excel manba kodi 0018 matn sifatida saqlanishi savolda aniq qayd etildi. Access: Short Text, Currency, Yes/No, Date/Time bilan mos kelishi tekshirildi.
- Q08: ota SinfID qiymatlari 1/2, bola FK 103=2. 103 ni mavjud 1 kalitiga qayta bog‘lash FKga zid emas; qolgan variantlarda ota qatori/yetim FK yoki takror PK xatolari bor.

### Tahririy tasdiqning haqiqiy yo‘li
- `question_editorial_checks` yozuvini **faqat haqiqiy administrator** o‘z JWT tokeni bilan endpoint orqali beradi. `reviewer_id` odamning `auth.users.id` qiymati.
- M09 demo-uslub manba prefiksi uchun editorial modal + backend ruxsati qo‘shildi; boshqa 288 nomzodning tasdiqlash qoidasi kengaytirilmadi.
- Javob, manba, matn, mualliflik bo‘yicha to‘rtta tasdiq va dalilli 20+ belgili izoh talab qilinadi.
- So‘ng administrator `review → published` o‘tishni tanlashi mumkin; production trigger ma'lumotlar to‘liq bo‘lmaganda qaytaradi.
- Bu foydalanuvchining chatdagi nashrga ruxsatini inson nomidan soxta imzoga aylantirmaydi.

### Hozirgi status
- 8/8 savol: **review**, 0 published.
- 296 umumiy M09 V2 savol: **review**.
- 6 V2 nazariya bobi: **review**.
- GitHub PR #316: **draft**, admin tekshiruvi interfeysi kodini birlashtirish va deploy qilishdan avval CI/yakuniy reviewer QA talab etiladi.
- Legacy published kontent, javob tarixi o‘zgarmaydi.

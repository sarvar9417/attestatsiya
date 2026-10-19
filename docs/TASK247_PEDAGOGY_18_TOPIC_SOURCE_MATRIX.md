# TASK-247 — 18 kanonik pedagogika mavzusi bo‘yicha source-readiness matritsasi
**Sana:** 2026-10-19. **Holat:** feature branch audit; yuklash davom etmoqda, final emas.

Quyidagi **manba mavjudligi** «fizik PDF sahifasi + ekspert tasdig‘i» degani emas. 2026-yilgi rasmiy kvota 5 KS + 7 umumiy pedagogika + 3 informatika metodikasi; 7+8+3 esa platformaning o‘quv mavzulari soni. Manba turi va expert gate bir-biridan ajratiladi.

| Kod | O‘quv mavzusi | Extract qilingan yoki ilgari tanilgan material | Joriy tekshiruv holati / xavf |
|---|---|---|---|
| M14.01 | Rejalashtirish | Pedagogning kasbiy standarti; kasb standarti 1-soha | Ikkilamchi soha ochildi; original normativ bilan solishtirish ochiq |
| M14.02 | Samaradorlik | Pedagogning kasbiy standarti; Kasb standarti 2-soha | Ikkilamchi soha ochildi; metod va standart mezonlari ochiq |
| M14.03 | Baholash va qayta aloqa | Pedagogning kasbiy standarti; Kasb standarti 3-soha | Ikkilamchi soha ochildi; diagnostik/formativ/summativ kalit QA ochiq |
| M14.04 | Tarbiyaviy faoliyat | Pedagogning kasbiy standarti; Xoliqov | Manbaviy sarlavha ochildi; normativ ish vazifalari bilan tekshirish ochiq |
| M14.05 | Xavfsiz muhit | Pedagogning kasbiy standarti; Qodirova/Pulatova | Qo‘llanma 1-betda 5/6 sohani chalkashtirgan; asosiy bo‘limga solishtirilgan, original normativ ochiq |
| M14.06 | Kasbiy o‘sish | Pedagogning kasbiy standarti; Muslimov | Qo‘llanma 1-betda 5/6 sohani chalkashtirgan; original normativ ochiq |
| M14.07 | Hamkorlik | Pedagogning kasbiy standarti | Ikkilamchi soha ochildi; savol/kalit ekspertizasi ochiq |
| M15.01 | Pedagogika, didaktika | Xoliqov; Mirzayeva 2-mavzu | Manba matni ochildi; obyekt/predmet va tadqiqot metodlari statik note boyitildi |
| M15.02 | Ta’lim tamoyillari | Mirzayeva; pedagogika manbalari; Bloom (Sarvar Drive) | Bloom talqinlari qo‘shildi; 2026 kognitiv tasnifga 1:1 tenglashtirilmaydi |
| M15.03 | Tarbiya | Mirzayeva 2-mavzu; Xoliqov | Fayl matnida tarbiya turlari bor; alohida sahifa va test QA ochiq |
| M15.04 | Dars va boshqaruv | Dars turlari.pdf; dars tahlili turlari.pdf | 6 didaktik dars va 5 tahlil to‘liq qisqa matndan o‘qildi; static/notes tuzatildi |
| M15.05 | Sinf rahbari | Pedagogning kasbiy standarti; Mirzayeva | Manba bor; sinf hujjatlari bo‘yicha amaldagi normativ QA ochiq |
| M15.06 | Etika, nutq, refleksiya | Xoliqov; Muslimov; Mahmudov nutq madaniyati | Xoliqov/Muslimov matni ochildi; Mahmudov matni hali tekshirilmagan |
| M15.07 | Qobiliyatlar | Pedagogik qobilyatlar umumiy.pdf; Xoliqov | Perseptiv/empatik/kommunikativ farqlari notesda yangilandi |
| M15.08 | Ta’lim texnologiyalari | Qodirova/Pulatova (2022); Tolipova | Inklyuziya statik matni boyitildi; Tolipova ordinary fetch’da bo‘sh |
| M16.01 | Fan mazmuni va yondashuv | Mamarajabov, Toshtemirov, Yuldashev (2023), universitet PDF, 173–175 va 180–181 viewer sahifalari | Asl darslik topildi; tanlangan sahifalar bo‘yicha taqqoslandi, 460-bet full audit ochiq |
| M16.02 | O‘qitish usullari | Mamarajabov va boshq. (2023), PDF viewer 15–16, 46–47, 72–73 | Metodning ta’rifi va muammoli ta’lim matni ochildi; misollar didaktik original, to‘liq sahifa auditi ochiq |
| M16.03 | Vaziyatli qarorlarni baholash | Mamarajabov va boshq. (2023), PDF viewer 90–91 va 172–175 | Baholash, metodik vazifa ko‘rildi; Python/jihoz vaziyatlari mualliflik misoli, independent item key QA ochiq |

## Quality gate

- **18/18** mavzu uchun dastlabki manba yo‘nalishi ko‘rsatilgan, ammo **18/18 manba-bet va savol-kalit mustaqil tekshirilmagan**.
- M14 5/6 soha: ikkilamchi konspektdagi bosh ro‘yxat ichki sarlavhalardan farq qiladi. Asl davlat kasb standarti bo‘yicha alohida audit qilinmasdan «normativ jihatdan tasdiqlandi» deb belgilamang.
- **TASK-252 yangilanish:** barnoyevak extract papkasida Mamarajabov (2023) original PDF ajratilmadi, ammo universitetning https://turan-edu.uz/media/books/2024/05/22/1708324536.pdf ochiq manbasi orqali **asl 460-betli kitob** topildi. M16 uchun aniq tanlangan PDF viewer sahifalari ko‘rib chiqildi; qolgan boblar va barcha savollar uchun manba-bet/item-key ekspertizasi hali yakunlanmagan.
- Matnli extract bo‘sh qaytgan PDF: alohida raw-byte PDF/page view yoki boshqa ochish usuli talab etadi; OCR chiqishi dalil bo‘lganda ham fizik sahifa va jadval/chizma qo‘lda tekshiriladi.
- Tarixiy testlar uchun savol matni, to‘rt mantiqiy variant, answer key, tushuntirish va manba-bet bo‘yicha individual audit; dublikatlari karantinda.
- Faqat o‘quv nazariyasining statik fallbacki va izohlari yangilangan; production published lesson/question/attemptlar, server javob kalitlari va imtihon generatori o‘zgartirilmagan.

## Ish tartibi

1. M15.01, M15.02, M15.04, M15.07, M15.08 da aniqlangan manba-teoriya mosligini regressiya bilan himoyalash.
2. M14.01–M14.07: kasb standarti asl normativ matni bilan taqqoslash va 5/6 xatoni manbaning o‘zida qayta tekshirish.
3. M15.03, M15.05, M15.06: Mirzayeva/Xoliqov/Muslimov/Mahmudov asosida dars nazariyasi, terminlar va manba sahifalari.
4. M16.01–M16.03: TASK-252’da topilgan Mamarajabov (2023) original PDF bilan barcha boblarni fizik sahifalarda taqqoslash, source-key ekspertizasini to‘liq yakunlash.
5. 2025/2026 tarixiy test variantlarini fingerprint orqali ajratish; yetarli per-topic published pool va review gate.
6. Yakuniy CI, 18/18 theory-to-source trace, 15/50 exam QA, mobile/accessibility/answer secrecy. Foydalanuvchi ruxsatisiz release YO‘Q.

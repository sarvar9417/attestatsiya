# Pedmahorat|Guli: 2026-10-21 primary-source release and archive QA

## Maqsad
2025-yilgi asl PDF savollarini to‘g‘ri bosma raqam va sahifa bilan, javob kaliti va pedagogik izohlarini yo‘qotmagan holda nashr qilish; noto‘g‘ri OCR/PDF importlarini o‘zboshimchalik bilan tasdiqlamaslik. Ushbu PR **README va read-only sifat nazorati SQL** qo‘shadi, production ma’lumotlarini SQL migratsiya orqali qayta yozmaydi.

## Production Supabase’da bajarilgan ishlar (loyiha `plyqezulrfowyblsfpzy`)
- **11 ta yangi Y1 savol** nashr qilindi; har biri 4 xil javob, 1 to‘g‘ri kalit, mazmunli izoh, tegishli dars va asl PDF kandidati bilan bog‘langan.
- Asl hujjat `Pedagogik mahorat to'plam 2025 (6).pdf`: PDFning **8, 9, 10, 12, 14 va 16-betlari** manba sifatida ishlatildi. Bosma savol № **38, 39, 40, 41, 44, 47, 62, 71, 72, 75, 82**. Bu bosma indekslar bazadagi `source_question_no` bilan bir xil emas: **36→38, 37→39, 38→40, 39→41, 42→44, 45→47, 59→62, 68→71, 69→72, 72→75, 79→82**.
- PDF sahifalari PyMuPDF orqali matn va kontakt-varaq rasmlari bilan solishtirildi, asl hujjatdagi **qizil `Javob`** belgisi asos qilib olindi. Muallif matni manba kandidatida saqlandi; platforma uchun o‘qishli variantlar va izohlar yangidan yozildi.
- `@PedMahoratGuli/4844` vizual savoli: asl `photo_868@09-10-2025_17-38-32.jpg` ko‘rildi; asosiy javob **C: Diskussiya** manbada ✔ bilan belgilangan. `public/pedguli-source/pedguli-4844-discussion.jpg` aynan GitHub `main`da mavjudligi 119454 baytli GitHub asset metadata bilan tekshirildi; eski `review` savol `published`ga o‘tkazildi.
- Ikki mavjud published nazariya darsi manbaga tayangan holda kengaytirildi: M14.01 «Tashxislash → bashoratlash → loyihalash» (PDF 8-bet №38–40); PM.GEN.06 «Ishontirish, talab, suhbat» (PDF 9-bet №41–43). Informatika misollari asl PDFdan ko‘chirma emas — yangi didaktik moslashtirish.

## Texnik QA
Oxirgi read-only nazorat natijalari:
- Pedagogika nashrdagi testlar: **816** (boshqa ishlar bilan bir vaqtda o‘zgarishi mumkin).
- Ushbu to‘plamga xos 11 ta published savolda **11/11** variantlar to‘rtta, kalit bitta, tanlovlar noyob, PDF back-link mavjud.
- PDF kandidatlari **953**; linked **213**; `needs_review` **306**; `verified && independently_verified && linked_question_id IS NULL` **0**.
- Ushbu PDFning `needs_review` 168 nomzodida **55 ta savol raqamidan boshlanmaydi**, **103 tasi import va bosma indeks bilan mos emas**, **18 tasining xom javobida watermark bor**. 55 va 18 tagi maxsus xavf bayrog‘i bilan annotatsiya qilindi, xom manba saqlandi. Guruhlar bir-biriga mos kelishi mumkin; ularni qo‘shib noto‘g‘ri «yangi nomzodlar» soni chiqarilmasin.
- Boshqa PDF va 2026 skaner nomzodlaridagi asl kalit bo‘yicha noaniqliklar ochiq qoldi. `needs_review` holati = nashrga ruxsat emas.

## Telegram audio/video omboridagi haqiqiy to‘siq
Telegram `result.json` eksportidagi media xabarlari tekshirildi:
- 417 `audio_file`, 183 `voice_message`, 75 `video_file`, 16 `video_message` = **691** audio/video yozuv.
- Asl baytlar **522** yozuvda eksportga kiritilmagan (431 audio + 91 video); **169** yozuvda nom/nisbiy yo‘l bor, lekin to‘liq fayl bu ish muhitiga ulanmagan.
- Shu sabab **audio transkripsiya qilinmagan**; o‘qilmagan audio matni o‘ylab topilmaydi. Original fayllarni Telegramning «include media» eksporti yoki original Drive katalogidan olish kerak. Individual media + status inventari suhbat fayli `pedguli_media_availability_20261021.csv`da saqlandi, GitHub’da foydalanuvchining media-fayl yo‘llari va shaxsiy xabarlari joylanmadi.
- Telegram `attest_ingest.telegram_pedagogy_archive_items`: 5488 media-reference, ulardan faqat 28 tasi `image_content_reviewed=true`, 12 tasida Drive ID mavjud; bu qolgan media mazmuni o‘rganilgan degani emas.

## Qabul shartlari va keyingi navbat
1. Rejalashtirilgan read-only SQL tekshiruv bilan **11 original nashr** va **4844 rasmli nashr** holatini qayta tekshirish.
2. `needs_review` 306 PDF nomzodining **faqat haqiqiy manba + bosma № + sahifa + qizil javob** orqali qo‘shimcha ekspertizasini o‘tkazish.
3. Telegram nazariya va testlarni bir-biridan ajratish (ilgari aniqlangan 1402 4-variantli yozuv), takrorlarni (ilgari 1100 matnan bir xil nusxa) takror nashr qilmaslik.
4. Asl rasm/audio fayllarining baytlari mavjud bo‘lmaguncha OCR/transkripsiya yoki tasvirga bog‘langan yangi testlarni `published` qilmaslik.
5. **`supabase db push` va qo‘lda deploy yo‘q** — migration drift haqida ochiq PR #357 alohida audit talab qiladi.

**Manbalar:** Original Google Drive PDF, Telegram @PedMahoratGuli/4844, original `result.json` eksporti. Ushbu hisobot original manbada yo‘q kalitlarni «rasmiy» deb kiritmaydi.

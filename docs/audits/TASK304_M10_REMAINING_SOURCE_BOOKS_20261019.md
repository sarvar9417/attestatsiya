# TASK-304 — M10.04–M10.07 chuqur manbali o‘quv boblari

**Sana:** 2026-10-19. **Chegara:** offline static/canonical reader, real DB UUID va authenticated UX emas. **Deploy yo‘q**.

## Muammo
M10.04–M10.07 darslari 4–5 bloklik qisqa asosiy konspekt va har mavzuga 5 bloklik qo‘shimcha bilan cheklangan. M01.02 namunasi darajasida tushuncha, vaziyat, amaliy hisob, xato, mustaqil mashq va javob ketma-ketligi yetishmasdi.

## Yangilanishlar

| ID | Mustaqil asosiy bloklar | Mavzuli bo‘limlar | Mazmun |
|---|---:|---:|---|
| M10.04 Matn, foto va rasmlarni tahrirlash | 66 | 12 | Type Tool, Crop, Levels/Curves, Hue/Saturation, Clone Stamp, qatlam/maska, Sharpen/Blur, mualliflik |
| M10.05 3D modellashtirish | 66 | 12 | xyz/mesh, vertex/edge/face, extrude, transform, texture, kamera/yoritish, render, CAD/3D printer, rigging |
| M10.06 Animatsiya va Adobe Animate | 67 | 12 | Frame/FPS hisob, keyframe/tween, timeline, easing, symbol, storyboard, export, accessibility |
| M10.07 Audio va video tahrirlash | 67 | 12 | PCM hajmi, sample Hz, bit depth, mono/stereo, FLAC/MP3, codec/container, FPS/bitrate, caption |
| **Jami** | **266** | **48** | 48 mustaqil mashq va har bobda javob yo‘nalishlari |

Readerning boshida yaxlit canonical book, keyin avvalgi M10_GRAPHICS_TEXTBOOK_ADDITIONS source ilovasi joylashadi; takroriy qisqa asosiy konspekt yashirin ikkinchi dars sifatida ko‘rsatilmaydi. 10 ta original offline testning IDsi, options, correctIndex va cognitive Y turi o‘zgarmagan. Supabase published exam keys va publication protsedurasiga tegilmagan.

## Mualliflik va manbalar
- [Cambridge+ 8-sinf, animatsiya, kadr va qatlam mavzulari](https://drive.google.com/file/d/1hZyLM5n0OUtuJI3M3dFeAz8kyv9Sr6Ng/view), bosma taxminan 110–124-betlar.
- [Cambridge+ 9-sinf, 3D printer va multimedia](https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view).
- [Cambridge+ 10–11-sinf, CAD va raqamli audio kodlash, tovush, video](https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view).
- [Blender 4.5 LTS Reference](https://docs.blender.org/manual/en/4.5/index.html) — mesh, primitives, materials va render.
- [Adobe Photoshop Clone Stamp (2026)](https://helpx.adobe.com/photoshop/desktop/repair-retouch/heal-clone/retouch-images-with-the-clone-stamp-tool.html).
- [Adobe Animate maintenance mode (2026-06-08)](https://helpx.adobe.com/animate/desktop/kb/maintenance-mode.html) — ilova mavjud va qo‘llab-quvvatlanadi, xavfsizlik va bug fixlar davom etadi, yangi funksiyalar rejalashtirilmagan. 2026-yil fevraldagi to‘xtatish rejasi haqidagi eskirgan yangilikka tayanmang.
- [Audacity rasmiy bit depth](https://manual.audacityteam.org/man/sample_format_bit_depth.html) va [FLAC export](https://manual.audacityteam.org/man/flac_export_options.html).

Matn mustaqil original o‘zbekcha pedagogik bayon. Fizik PDFning har bir sahifasi, rasm, sxema bo‘yicha 1:1 to‘liqlik da’vo qilinmaydi. 3D va Adobe professional vositalarini source materialning aynan PDFdagi jumlalari deb ko‘rsatmaslik kerak; darslik + rasmiy interfeys resurslari sintezidir.

## Faktik tuzatishlar
1. M10.06 dastur holati: Adobe Animate maintenance mode, to‘xtatilgan emas; versiyaga bog‘liq. 24/30/60 FPS — amaliy variant, barcha ishlar uchun qat’iy universal standart emas.
2. M10.07 AAC faqat Apple’ga tegishli degan noto‘g‘ri soddalashtirish chiqarildi; AAC keng qo‘llanadigan audio kodek. WAV ko‘pincha PCM konteyner, MP4 video/audio oqim konteyneri, H.264 kodek. PCM bit depth boshqa, MP3 bitrate boshqa.
3. Mustaqil savol bankiga yangi javob kalitlari kiritilmadi, faqat nazariya matni va legacy seedning noto‘g‘ri izohi tuzatildi.

## CI va ochiq xavflar
- TASK304RemainingM10CanonicalBooks.test.ts — 4 ta kitob, 12 tadan bo‘lim, 266 blok, to‘g‘ri source, BookReader ketma-ketligi, 10 savol kaliti/Y turining saqlanishi, termin va formula regressiyasi.
- M10.01–03, M11 va boshqa modullar o‘zgarmaydi.
- Typecheck, lint, unit, build, Playwright E2E, backend, database va quality yashil bo‘lmaguncha merge yo‘q.
- Production yoki authenticated desktop/mobile kitobni ochib, har bir PDF betini vizual manba bilan tekshirish hali bajarilmagan.
- Keyingi ustuvorlik: M11.01–M11.03 HTML/CSS boblari hamda boshqa kam qamrovli M04–M13 bo‘limlari; mavjud sourced files va published content alohida audit qilinsin.

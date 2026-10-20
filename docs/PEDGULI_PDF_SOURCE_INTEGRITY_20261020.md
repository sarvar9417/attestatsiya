# PedGuli PDF manba integriteti — 2026-10-20

## Maqsad
Telegram/PDF pedagogika savollarida manba ko‘rsatkichi, savol indeksi va javob kalitini asl Google Drive PDF baytlari bilan solishtirish. Bu **faqat manba auditi**, hech bir tarixiy test javobi yoki foydalanuvchi urinishlarini o‘zgartirmaydi.

## Mustaqil PDF tekshiruv
- `Attestatsiya to'plam ped mahorat @PedMahoratGuli.pdf`: 81 bet, SHA-256 `de6bd57d8ccd0f0a69ded4511951532e384f73f2a1d792acf26725c5a42c2c49`.
- `Pedagogik mahorat to'plam 2025.pdf`: **9 bet**, SHA-256 `ddd97d430c7c35f548540172cf94ccac7f7edc83be56bd9a46a7d5502393038b`. Savollar faqat 1–40 oralig‘ida.
- `Pedagogik mahorat to'plam 2025 (6).pdf`: **43 bet**, SHA-256 `324e1e1c0a837ff6e7b7c163fe7c5459f0ef7cdfdb47ea98b8236856316493a6`. 193-savol 38-betda.
- `Pedagogik mahorat to'plam 2025 (5).pdf` ham (6) bilan **baytma-bayt bir xil** SHA-256 fayl. Bu ikkisini ikki mustaqil savol manbasi deb sanamaslik kerak.
- `PedKasb tushgan testlar PedMahoratGuli (1) (1) (1).pdf`: 40 bet, SHA-256 `7ffb7576d6fa88c987f8fff3d5aad03dce8341d9505b16ca2ba9fa826f1e0c66`.

## Production indeks sloti to‘qnashuvi
Production Supabase `public.pedagogy_pdf_source_candidates` audit natijasi:
- Eski 9-betlik fayl nomiga yozib qo‘yilgan **40-indeksdan keyingi 113 ta** kandidat; 18 tasi allaqachon boshqa testga bog‘langan (preflightdagi hisob).
- Asl kengaytirilgan `(6).pdf` nomi bilan **196 ta** kandidat mavjud.
- 113 tadan 109 ta indeks **mavjud slot bilan to‘qnashadi**; 37 tasida eski yozuv `verified`, kengaytirilgan yozuv `needs_review`.
- `UPDATE source_file_name` urinishida `pedagogy_pdf_source_slot_uniq` cheklovi sabab tranzaksiya bekor bo‘ldi. Kanonik nomni masshtabli almashtirish hamda `on conflict do nothing` orqali javobni yo‘qotish taqiqlanadi.
- Tekshirish bosqichi: raqamning o‘zi emas, **fayl hash + sahifa + normallashtirilgan savol matni + asl javob** bilan moslashtirish. Ikkala yozuvni aynan bir savol deb qabul qilishdan oldin matn mosligini ko‘rish shart.

## PDFda sahifa orqali tasdiqlangan xatolar

| Manba | Savol | Sahifa | Aynan kuzatilgan muammo |
|---|---:|---:|---|
| 2024 bahor PDF | 251 | 51 | 251-savolning 4 bandi bor, **javob belgisi yo‘q**. Importdagi `Evristik metod` 52-betdagi **252-savol** javobidir. |
| 2024 bahor PDF | 273 | 56 | Asl kalit **1, 2, 3**. Importdagi `raw_answer_private` keyingi **nutq** bo‘limigacha oqib ketgan. |
| 2024 bahor PDF | 289 | 65 | Asl kalit **Diksiya**; import qilingan javobga keyingi metod/texnologiya jadvali qo‘shilgan. |
| 2024 bahor PDF | 293 | 66 | Asl kalit **Tembr**; import javobiga keyingi *Dars turlari* bo‘limi qo‘shilgan. |
| 2025 kengaytirilgan PDF | 193 | 38 | Tavsif **xususiydan umumiyga** (induksiya) o‘tish haqida, ammo PDF kaliti **Deduksiya**. Bu *manbaning o‘zidagi konseptual ziddiyat*, model xulosasini asl kalit deb ko‘rsatib bo‘lmaydi. |

## Xavfsiz to‘g‘rilash
1. #251 va #193 ni javobi tekshirilgan deb avtomatik nashr qilish mumkin emas. #273, #289, #293 uchun asl javobni sahifa orqali olib, faqat tasdiqlangan muharrirlik reviziyasiga bog‘lash mumkin.
2. Import qilingan `raw_*` asl dalil maydonlarini saqlash; xatoni alohida korrektura/audit izi bilan yuritish.
3. 2025-yildagi kengaytirilgan faylga xos 40+ indekslar uchun noto‘g‘ri qisqa nomli iqtiboslarni tuzatish alohida mutatsiya talab qiladi; tarixiy `published` revision va `exam_items`ni joyida qayta yozmaslik.
4. 2025 (5)/(6) bir xil hash bo‘lgani uchun savol inventarini umumiy bir manbadan deduplikatsiya qilish, lekin turli javob variantli savollarni ko‘rmasdan birlashtirmaslik.

## Tekshiruv doirasi
Bu audit 5 ta isbotlangan PDF muammosi va manba kolliziyasini hujjatlashtiradi; 99 ta oldindan `verified` deb belgilangan, ammo hali bazadagi savolga ulanmagan kandidatlarning barchasi semantik ekspertizadan o‘tdi degani emas. 597 ta eksportga kirmagan original media, ovoz transkripsiyasi va to‘liq rasmli savollar ekspertizasi alohida ochiq ishlar. **Production SQL, deploy va yangi javob keysi qo‘shilmadi.**

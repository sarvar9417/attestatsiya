# Microsoft Office — vizual va LaTeX auditi (V2)

## Manba va usul
- Supabase `attestatsiya100%` bazasining barcha `published` va `review` savollari bilan taqqoslandi.
- 389 ta amaldagi savol (381 published, 8 review); 148 archived va 7 draft chiqarilgan.
- Y1 264 ta, Y2 63 ta, Y3 62 ta. Har bir savol uchun variant, kalit va izoh asl database yozuviga mos saqlandi.

## Aniqlangan va tuzatilgan muammolar
1. **LaTeX ko‘rsatish nuqsoni:** avvalgi nashrda 389 ta savolning metama'lumot satrida `{\\footnotesizecolor{muted}...` ko'rinishidagi buyruq xato. V2 da `{\\footnotesize\\color{muted}...` qilib tuzatildi.
2. **Excel jadvali yo‘qligi:** 27 ta Excel savoliga kataklar koordinatasi bilan jadval rekonstruksiyasi kiritildi. Jumladan DB `a5f4df57-6ffc-436f-ae18-363697a9a4bc` (12-savol), A1:C3 qiymatlarining 3x3 ko‘rinishi.
3. **Tasvir manbalari:** 3 ta original ilustratsiya repo ichida mavjud, tasvir manbalari tekshirildi; manba SVG havolalari V2 da ham saqlangan, tavsifli vizual ko‘rsatmalar qo‘shilgan. Ammo asl rasmlar PDFga **joylashtirilmagan**. Offline rasmli savollar bundan keyingi ishning ochiq masalasi.
4. **Ikki holatli Excel savoli:** `45b5b2af-fbbf-5eb5-9b52-39d6a179710a` savolida avval/keyin qiymatlar farq qilgani uchun yagona (chalg‘ituvchi) jadval qurilmadi; asl ikki holat savolda saqlanadi.

## Kompilyatsiya va strukturaviy nazorat
- PDF qayta kompilyatsiya qilindi: 658,382 bayt.
- V2 LaTeX tarkibi: 389 DB savol identifikatori, 389 to'g'ri javob/izoh, 27 jadval, 3 tasvir manbasi havolasi.
- Ruscha menyu nomlari avvalgi nashrdagi kabi lotincha transliteratsiya qilingan; bu muhim uslubiy cheklov, manbadagi asl Kirill yozuvli atamalar bilan aynan bir xil ko‘rinmaydi.
- **Cheklov:** savollarning ilmiy-pedagogik to‘g‘riligi yoki rasmlarning PDFga embeddingi yakuniy mustaqil ekspert tasdig‘idan o‘tgan, deb da’vo qilinmaydi.

## Materiallar
- [V2 PDF](https://files.strivemath.org/storage/v1/object/public/worksheet-pdfs/public/worksheets/2026/10/bvkw5kxn-Microsoft_Office_389_v2_visual_audit.pdf)
- [V2 LaTeX](./Microsoft_Office_389_test_v2_vizual_audit.tex)
- [V2 LaTeX arxiv hosting](https://files.strivemath.org/storage/v1/object/public/generated-tex-files/public/worksheets/2026/10/jo67t4ea-Microsoft_Office_389_v2_visual_audit-chatgpt_latex.tex)

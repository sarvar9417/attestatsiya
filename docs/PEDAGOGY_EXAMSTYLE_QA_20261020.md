# Pedagogika imtihon-uslubi chuqur QA — 2026-10-20

## Audit doirasi va manbalar

- Rasmiy tayanch: `Informatika Testlar spesifikatsiyasi.pdf`, 2026, 6–8-betlar; 5 KS, 7 umumiy pedagogika, 3 informatika metodikasi. 50-savollik imtihon uchun bilish/qo‘llash/mulohaza = 8/35/7.
- Uslub namunasi: Drive `Attestatsiya to'plam ped mahorat @PedMahoratGuli.pdf` (2024), `Pedagogik mahorat to'plam 2025.pdf`, `Pedmahorat to'plam 2025 kuzgi.pdf`, `PedKasb tushgan testlar PedMahoratGuli ...pdf` (2026), hamda foydalanuvchi yuklagan `Tushgan testlar 07.04.2026.pdf`. To‘plamlardagi «real tushgan» degan da’volar yoki manba kalitlari mustaqil rasmiy tasdiq emas. Test matnlarini nusxalash o‘rniga ushbu testlarning pedagogik **uslub va strukturasi** o‘rganiladi.
- Fakt va nazariya asoslari: productiondagi M14–M16, jami 18 ta canonical published dars; kasbiy standart, pedagogika va metodika manbalari. PDFdagi ayrim savol-javoblar (masalan, 2026 darsni rejalash misoli) bir-biriga mos bo‘lmasligi mumkin, shuning uchun xom PDF kaliti ko‘chirilmaydi.

## Production read-only SQL, ish boshidagi holat

| Blok | Published Y1 | Published Y2 | Published Y3 | REVIEW Y1 | Y1 stem < 70 belgi | Y1 stem >= 180 belgi |
|---|---:|---:|---:|---:|---:|---:|
| KS | 130 | 8 | 2 | 13 | 21 | 1 |
| PM.GEN | 223 | 3 | 7 | 17 | 43 | 1 |
| PM.MET | 73 | 0 | 4 | 2 | 19 | 0 |
| **Jami** | **426** | **11** | **13** | **32** | **83** | **2** |

426/426 Y1 uchun to‘rt xil variant, key-UUID mosligi tekshiruvdan o‘tdi. **0** uniquely-longest correct answer. Bu faqat mashina yordamidagi shartlar. Aynan `<70` savolga avtomatik «xato» hukmi chiqarilmaydi; ularni alohida kontekst va kognitiv vazifa bo‘yicha tekshirish kerak.

## Tarixiy savol korpusi
Private PDF inbox jami 649: 195 `independently_verified` (40 linked, 155 unlinked), 335 `accepted_general` kaliti tekshirilmagan, 119 karantinda. 119 ichida 39 answer-parse-bleed, 29 answer-key-unverified, 27 exact duplicate, 22 near duplicate, 2 source-key conflict. Faqat original, tekshirilgan yangi savolga aylantirish mumkin. Asl kalit/manba yozuvlariga yoki tarixiy urinishlarga tegilmasin.

## Kalibrlash qoidalari
1. Real pedagogik vaziyat va qaror dalillari; yodlash, qo‘llash va mulohaza nisbatini maqsadga mos belgilash.
2. Y1: bitta asosli to‘g‘ri javob, 4 xil plausibly-related variant, uzunlikdan, negatsiya yoki mutlaq so‘zlardan javobni taxmin qilib bo‘lmaydi.
3. Y2: bir ma’noli mosliklar va bitta-to-bitta kalit; Y3: mantiqiy zarur ketma-ketlik va UUID-based order.
4. Manba va kanonik darsga aniq bog‘lash; manba qarama-qarshiligida tekshirilmagan kalitni nashr qilmaslik.
5. Yangi material avval `review` statusda, mavjud `published` immutable, oldingi attempt/keys saqlanadi.
6. E2E: 15 practice va 50 mock, variantlarni aralashtirish, topic preflight, mavzuga mos kalit, natija UX.

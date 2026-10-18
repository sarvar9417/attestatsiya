# Attestatsiya — texnik va kontent auditining navbatdagi bosqichi (2026-10-18)

## Tekshirilgan qatlamlar
- GitHub `main` dagi M01, AXB banki, server-side scoring va mavzu modul navigatsiyasi
- Supabase production: bankdagi statuslar, RPC funksiyalar va review javob variantlari RLS
- Vercel production deployment ro‘yxati va GitHub `main` SHA
- Regressiya testlarining mavjudligi va yangi katalog kontrakti

## Aniqlangan va shu PRda tuzatilgan (P1)
1. **AXB katalogida identifikatsiya tekshiruvi yetarli emas edi.** Frontend `z.array(...).length(19)` shartidan tashqari 19 ta turli bob borligini, `published + review <= 30` va `total_pdf = 30` invariantlarini tekshirmas edi. Malformed response takroriy bob tugmasi yoki noto‘g‘ri savol miqdorini ko‘rsatishi mumkin. `src/features/exam/backendGateway.ts`ga qat’iy Zod validatsiyasi qo‘shildi. `src/tests/AxbChapterCatalogContract.test.ts` da to‘rtta regression test bor.

## Qo‘shimcha tuzatilgan xavflar (P1/P0)

- **P1: Offline javoblarni yo‘qotish xavfi.** `ExamRunner` sinovni yakunlashdan oldin ayni imtihon uchun local queue'dagi javoblarni tekshirmas edi. Shu sabab internet tarmog‘i uzilgan va hali yuborilmagan javoblar yakuniy natijaga qo‘shilmay qolishi mumkin edi. `hasPendingAnswersForExam` va `flushOfflineAnswers` yordamida *faqat shu urinish* bo‘yicha avval sinxronlash qo‘shildi; javob qolsa finalizatsiya to‘xtaydi va foydalanuvchiga qayta urinish taklif etiladi. Offline navbat regression testi kengaytirildi. Timer expiry / network reconnect brauzer E2E alohida bajarilishi kerak.
- **P1: Noaniq Authorization header.** Imtihon API `getToken` oldin `authorization.replace('Bearer ', '')` qilgani sabab `Basic` yoki noto‘g‘ri Bearer qiymatini ham token sifatida downstreamga uzatishi mumkin edi. Endi faqat bo‘sh bo‘lmagan yagona Bearer credential qabul qilinadi. API testlari Basic, bo‘sh va ortiqcha bo‘shliqli qiymatlarni `401 TOKEN_REQUIRED` bilan rad etishni tekshiradi.
- **P1: Imtihon API request validation** — AXB bob 20, 31 savol, 0 savol yoki keraksiz kalit maydoni bilan yuborilgan payload uchun 400 qaytarilishi regressiya bilan qamrab olindi.

## Production haqida qat’iy dalillar
2. **Production va `main` versiyasi pariteti tasdiqlanmagan (P0 release).** Audit vaqtida GitHub `main` SHA `6ed8e78e1b28db27486391b39d6d08170b03b3d9`, Vercel `target=production` so‘nggi `READY` build SHA esa `73b48a79989b1f991eca7ed78803ba472e90d68e`. Bu ikki SHA farq qiladi. Saytning ayni domenida butun yangi kod ishlayotganini Vercel alias va deployment metadata bilan alohida tekshirish zarur. GitHub CI yashil bo‘lishi deploy tasdig‘i emas. **Ushbu PR deployment qilmaydi.**
3. **AXB 19-bob katalog SQL ishlab turibdi.** Productionda `axb_chapter_catalog()` va `generate_axb_chapter_practice(integer,integer)` mavjud; 19 bob: 570 manba savolidan 540 published va 30 review. 16-bobda 3 ta, 19-bobda 27 ta published. Boblar bo‘yicha 10/15/30 tugmalar manba sonini ko‘rib ko‘rsatilishi zarur.
4. **M14 bo‘yicha eski audit hisoboti eskirgan.** Hozir productionda `KS` = **140 published**, `PM.GEN` = **233 published**, `PM.MET` = **77 published**. KS guruhidagi archived=48; M14 oldingi 114 published/26 review hisoblari joriy holatga tatbiq etilmasin. `authored:ai-assisted:m14-closed-20261018:%` review hozir 0 — oldingi auditor hisobotini yangilash shart.
5. **Javob varianti maxfiyligi:** `question_options` ning `options_read` siyosati faqat published yoki muharrir/admin uchun. `question_keys` staff-only. Oldingi `USING(true)` leak siyosati production ro‘yxatida mavjud emas. Keyingi release’da anon/authenticated regressiyani saqlash shart.

## Hali alohida sinov va ish talab etiladi
- P0: frontend Vercel production commit, backend deployed revision va Supabase migration parity; test foydalanuvchi bilan `/learn/M01?extra=axb` sahifasini ochib ko‘rish.
- P0: haqiqiy auth orqali AXB katalog, start→submit→finish→review/history, 16-bob 3, 19-bob 27, boshqa bob 30. Oldingi DB tranzaksiyali sinovlar foydali, ammo ular browser auth E2E o‘rniga o‘tmaydi.
- P1: KS/PM professional 18/18 mavzu uchun construct/required-coverage; faqat savol soni yetarli bo‘lishi sifat kafolati emas.
- P1: admin kontent banklarining haqiqiy editorial approval/provenance yozuvlari va yashirin javob banki pariteti; AI-generated namunalar uchun mustaqil inson nazorati.
- P1: accessibility (keyboard, zoom), mobil ekranda uzun savol/rasm scrolling, 15 va 50 savollik sinov blueprintlari, tarmoq uzilishi va takroriy javob idempotentligi.
- P2: M01 qo‘shimcha mashqlar bilan asosiy mavzu testlarining UX tushuntirishini foydalanuvchi tajribasida tekshirish.

## O‘zgartirish chegarasi
Faqat AXB frontend katalogni validatsiya qilish va testlar; **hech qanday savol kaliti, published status, foydalanuvchi natijasi, production DB yoki production deploy o‘zgartirilmagan.** Merge bo‘yicha alohida ruxsat talab etiladi.

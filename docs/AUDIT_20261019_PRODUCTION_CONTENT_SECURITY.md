# Attestatsiya — mustaqil ishlab chiqarish auditi (2026-10-19)

## Tekshiruv chegaralari
- **Kod:** `sarvar9417/attestatsiya` `main` SHA `c3b60c3655093343d7530ec8bf2be901520f4ce7` (audit boshlangan payt).
- **Production:** Supabase `sarvar9417` o‘qish rejimida; GitHub Actions va Vercel deployments metadata. UI login/account bilan haqiqiy brauzer E2E amalga oshirilmagan.
- **Maqsad:** xavfni tekshirish, tasdiqlangan holatlarni o‘zgartirmaslik, xatolarni alohida PR ichida hal qilish. Hech qanday savol holati o‘zgartirilmaydi, production SQL yozilmaydi.

## Tekshirilgan amaldagi baza
- Savollar: **3 344 published**, **2 603 review**, **737 archived**, **19 draft**.
- `construct_id`si mavjud bo‘lmagan savollar: **0**.
- Published Y1 variant/kalit kontrakti buzilgan savollar: **0** (4 ta `side='a'`, to‘g‘ri variant ID kalitda mavjud).
- Published manbasi bo‘sh savollar: **0**.
- **Pedagogika kontenti yangi holat:** M14 ning yettita kanonik mavzusi **20/20 tadan published+keyed**; M15 sakkiz mavzusi 25–37 tadan, M16 uch mavzusi 25–27 tadan. Bu faqat sanog‘i va kaliti bo‘yicha qamrov; manba hamda bilim objective sifati tasdiqlanganini isbotlamaydi.
- 19 bob AXB manbasi: **570 jami / 540 published / 30 review**. Bob 16: **3**, bob 19: **27**, qolgan 17 bob **30** tadan; `axb_chapter_catalog()` bu sonlarni to‘g‘ri qaytarmoqda. Anon RPC chaqirishi bekor qilingan; `generate_axb_chapter_practice()` server-scorer, first-answer lock va mashq paytidagi kalit maxfiyligi oldin rollback-only sinovda tekshirilgan.

## Savol matnlari o‘xshashligi: noto‘g‘ri pozitivlar
Normalized question stem bo‘yicha **9 ta takrorlovchi matn guruhi** aniqlandi, lekin **9 ta aynan bir xil savol degani emas**:
- 15 ta `Sonlarni kichigidan kattasiga qarab tartiblang` savolida **15 xil option set**;
- 7 ta CIDR moslashtirish savolida **7 xil option set**;
- qolgan 7 guruhda bittadan matn ikki marta keladi, lekin **har bir juftlikning variantlar to‘plami farq qiladi**.
- Ularga avtomatik archive/delete tatbiq qilish mumkin emas; ular manba va variantlar mazmuni, javob kalitlari, vazifa turi va tarixiy attemptlarga bog‘lanishi bo‘yicha *ekspert tekshiruvi* talab qiladi. Shu paytgacha 0 ta tasdiqlangan butunlay bir xil savol aniqlangan.

## Aniq dastur nuqsoni va tuzatish
**M01 AXB katalogini yuklashda stale request race:** `src/pages/AxborotPracticePage.tsx` StrictMode effect ikkinchi bor ishlashi, sahifadan chiqish yoki bir nechta qayta urinish natijasida oldingi so‘rov keyingisidan kech qaytsa, eski snapshot yoki xato holati yangi natijani bosishi mumkin edi.

**Tuzatildi (branch):** `requestId` orqali faqat eng so‘nggi so‘rovning natijasi va xatolari UI ga chiqadi; unmount paytida eski so‘rovlar bekor hisoblanadi. Regressiya testi out-of-order ikki so‘rovni sinaydi. Server banki, test tarixlari, haqiqiy savollar va mavzu nazariyasi o‘zgartirilmadi.

## Release bloklari va alohida tekshirilishi zarur qismlar
1. **Deployment SHA parity:** `main` hozir o‘ta faol, shuning uchun Vercel target=production dagi tayyor commitni `main` bilan alohida qiyoslash kerak. Preview `READY` production bilan bir xil degani emas.
2. **Authenticated E2E**: barcha 16 modul, 19 AXB bob kirishlari, mavzu→test→natija, 15 / 50 savollik blueprintlar, admin muharrirlik, mobil, offline retry, test tarixini real browser orqali tekshirish zarur. Bunga green unit/SQL CI yetarli emas.
3. **2 603 review savol**: har birining fakt/manba/format mualliflik va ekspert tasdig‘i kerak; automatik publish mumkin emas.
4. **Maxfiy javob banki**: public GitHub, browser bundle va learner accessible RPC'larda javob kalitlari ochilib ketmasligini maxsus attack-oriented auditdan o‘tkazish zarur.
5. **Admin CMS, role/RLS va assessment security**: staff/read-only, review→published imzolari, qayta yuborilgan javoblar, vaqt va foydalanuvchi izolyatsiyasi uchun haqiqiy rol yordamida E2E security sinov zarur.

## Merge / deploy
Bu audit branchida avtomatik merge, production deploy, `review`→`published` yoki SQL write yo‘q. CI natijasi alohida qayd qilinadi.

# TASK-348 — Guruhli Mock Test: xonaga qaytish va xavfsiz lobby boshqaruvi (2026-10-20)

## Talab va kod holati
- Base: `main`, TASK-347 PR #352 merge commit `72ce5b67d9e918312e5ea65f973246561ea811fc`.
- Branch: `task/TASK-348-group-mock-resilience`.
- Scope: eski xonalar ro‘yxatiga qaytish, kod/havolani ulashish, lobbyda host bekor qilishi yoki ishtirokchi chiqishi, qo‘lda tanlangan savollarni qayta tartiblash va polling aloqasi haqida ogohlantirish.
- Migration: `supabase/migrations/20261021002500_task348_group_mock_resilience.sql`.
- CI regression: `supabase/tests/group_mock_resilience.test.sql`; `src/features/group-mock/manualSelection.test.ts`.

## Xavfsizlik va mantiq
1. `group_mock_my_rooms(20)` javobi faqat `auth.uid()` a'zoligi tasdiqlangan xonalarni qaytaradi. 20 dan ko‘p ma'lumot chiqarilmaydi; javobda savollar, kalitlar, tushuntirish yoki javoblar yo‘q.
2. `group_mock_cancel(room)`: tashkilotchi **faqat `lobby`** bosqichidagi xonani va uning hali ishlatilmagan maxfiy savol nusxalarini o‘chiradi. Barcha ishtirokchilar o‘sha kod bilan qayta kira olmaydi; 5 faol xona limiti bo‘shaydi. Boshlangan test/reytingni o‘chirishga ruxsat yo‘q.
3. `group_mock_leave(room)`: qatnashchi faqat lobby bosqichida chiqadi. Host chiqish o‘rniga bekor qiladi; test boshlanganidan keyingi o‘zboshimcha chiqish natijalarning yaxlitligini buzmasligi uchun bloklanadi.
4. Xonaga qaytish sahifadan/brauzerdan chiqib qayta kirishda mavjud a'zolik orqali ishlaydi. 2,5 soniyalik yangilashda eskirgan javob kechroq kelib sahifani ortga qaytarmasligi uchun request tartibi nazorat qilinadi.
5. Qo‘lda tanlangan savollarning ID ketma-ketligi o‘zgarmas nusxa orqali siljitiladi va serverda aynan shu tartibda snapshot qilinadi.

## Qabul shartlari
- Fresh DB migrations + `group_mock_resilience.test.sql` (host/membership/code isolation, cancelled-code revoke, started-room preservation).
- Frontend lint/typecheck/unit/build + Playwright E2E.
- Ikkita haqiqiy autentifikatsiyalangan brauzer sessiyasi orqali lobby → start → answer → reveal → next va qayta ulanish stagingda test qilinmaguncha production tayyor deb hisoblanmaydi.
- Production Supabase migratsiya, Vercel deploy, release/checks **shu branch yozilishi bilan avtomatik isbotlanmaydi**.

## Ochiq qolgan takomillashtirishlar
- To‘liq push/Reatime (hozir polling), host timebox/taymer, ko‘p kunlik tarix va yakuniy savollarni qayta ko‘rish, spam moderation.
- Rasmiy blueprint uchun qo‘shimcha production authenticated smoke test; monitoring va foydalanuvchi sesiyasi bilan qabul testlari.

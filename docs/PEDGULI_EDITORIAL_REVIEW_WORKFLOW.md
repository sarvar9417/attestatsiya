# Pedmahorat Guli — 84 ta qo‘shimcha savolni tekshirish va nashrga tayyorlash

**Joriy holat:** GitHub Draft PR #97, yangi migratsiyalar FAQAT test bazasida. **Production Supabase/Vercel uchun ruxsat berilmagan.**

## Bankning xavfsiz tarkibi

| Partiya | Soni | Migratsiyadan keyingi holat |
|---|---:|---|
| Professional v1 (rasmiy spetsifikatsiya va M14–M16 darslariga tayangan original mashqlar) | 36 | published — mavjud amaliy test yig‘ish uchun |
| Pedguli mavzu-signali v2 | 30 | **review** |
| HTML eksport mavzulari v3 | 24 | **review** |
| Informatika metodikasi bo‘yicha v4 | 30 | **review** |
| **Jami** | **120** | 36 published + 84 review |

`Review` holati — **savol hamda uning javob kaliti bazada mavjud, lekin o‘quvchiga ko‘rinmaydi va 15 savollik testga tanlanmaydi**. Bu «tekshirildi» degani emas.

## Administrator uchun aniq ish tartibi

1. **Admin → Savollar** sahifasini oching; «Manba» filtrida **Pedmahorat — original mashqlar** ni tanlang. Zarur bo‘lsa holatni **Review** ga qo‘ying. Shu orqali 84 ta savolni topish mumkin.
2. Savoldagi **Tahrirlash** tugmasi bilan to‘rtta variant, belgilangan to‘g‘ri javob va izohni ko‘ring. Savol mazmunini **M14/M15/M16** darsi, 2026 attestatsiya spetsifikatsiyasi va manbalar bilan mustaqil tekshiring.
3. **Tahririy tekshiruv** oynasida tekshirilganlarga belgi qo‘ying: javob, pedagogik manba va mavzu, til/aniqlik, mustaqil mualliflik. To‘rttalasi tekshirilmagan bo‘lsa nashrga chiqarilmaydi.
4. **Tekshiruv dalillari** maydoniga kamida 20 belgili aniq izoh yozing: darslik nomi/bo‘limi, manba va nima uchun aynan shu variant to‘g‘ri. «Men tekshirdim» kabi mazmunsiz izoh yozmang.
5. **Tekshiruvni saqlash** tugmasini bosing. **Faqat administrator** buni bajaradi.
6. Zarur bo‘lsa savolni qayta tahrirlang va checklistni qayta saqlang. Savol tahrirdan keyin checklist saqlanmasa, javob o‘zgarganida ham nashrga ruxsat berilmaydi.
7. So‘ng **Published** ni bosish mumkin. PostgreSQL triggeri tasdiqning to‘liqligi, izoh va savolning o‘zgarmaganligini tekshiradi.

## Xavfsizlik va chegaralar

- Published holatidagi Pedguli-original mashqlarni bevosita tahrirlab bo‘lmaydi. Zarur bo‘lsa **Published → Archived → Draft → Review** zanjiri bilan qayta ishlang.
- Savolga tegishli variant/kalit ham Published davrida o‘zgartirilmaydi. Bu tasdiqdan keyingi «kalit almashishi» xatosini kamaytiradi.
- Tekshiruv ma’lumotlari `public.question_editorial_checks` jadvalida alohida saqlanadi; RLS bo‘yicha anon va authenticated rollarga o‘qish/yazish huquqi berilmaydi. O‘zgartirish faqat admin tekshiruvidan o‘tgan backend xizmatining service-role kaliti orqali mumkin.
- Ruxsatsiz Telegram post matnlarini yoki audio/PDF/rasmlarni platformaga ommaviy ko‘chirmang. Bu savollar **mustaqil yozilgan mashqlar**, rasmiy avvalgi imtihon savollari emas.
- Original 1 394 Telegram savol nomzodi faqat shaxsiy tahrir uchun ajratilgan; ularning javoblari mustaqil tasdiqlanmagan. Ular **120 ta savolning bir qismi deb talqin qilinmaydi**.

## Texnik tekshiruv

`supabase/tests/pedguli_editorial_fingerprint_gate.test.sql`:
- 84 savol faqat review; baseline 36 published;
- imzosiz yoki chala checklist nashrni bloklaydi;
- savolni/kalitni o‘zgartirganda fingerprint mos kelmaydi;
- to‘liq tasdiqlangan va o‘zgartirilmagan savol nashr qilinishi mumkin;
- nashrdan so‘ng matn/variant/kalitni tahrirlash bloklanadi.

**Yakuniy eslatma:** ishchi platforma va production bazaga faqat foydalanuvchi yakuniy ruxsat berganidan keyin chiqiladi.

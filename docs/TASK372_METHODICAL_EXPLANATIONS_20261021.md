# TASK-372 — Informatika o‘qitish metodikasi: 35 javob izohining ekspert tahriri

## Qoida: GitHub main merge xolos

Foydalanuvchi faqat GitHub `main`ga merge’ga ruxsat bergan. **Production deploy, database write, published savolni o‘zgartirish, migratsiya bajarish, revision publish taqiqlangan.** Mavjud imtihon natijalari va javob kaliti server-authoritative qoladi.

## Audit va ko‘lam (2026-10-21, read-only Supabase)

- `PM.MET`: 88 published Y1 savol, **35 tasining tushuntirishi 80 belgidan qisqa**.
- Tekshiruv: har birining savol matni, eski izohi, serverdagi mavjud kalitga mos kelgan to‘g‘ri variantning **ma’nosi** o‘qib baholandi.
- Qisqalik avtomatik noto‘g‘rilik belgisi emas; lekin bu 35 holatda o‘quvchiga nima sababdan variant mos kelishi va boshqa tushunchalardan farqini yoritish imkoniyati mavjud.
- Mavzular: metod va usul, interfaollik, maqsad-baholash mosligi, kuzatiladigan dalil, algoritm iz jadvali, Python sikl chegarasi, reproduktiv/amaliy faoliyat, jigsaw, loyiha va inklyuziv metodik yordam.

## Ishlab chiqilgan material

- `supabase/maintenance/task372_pmmet_35_explanations_ROLLBACK_ONLY.sql`: 35 ta noyob source-reference bo‘yicha individual, 267–328 belgilik, tushuncha sababini yorituvchi o‘zbek lotin yozuvidagi tushuntirishlar.
- Savol kaliti, variant va sessiya tarixlari kiritilmagan; ular browserga hech qachon jo‘natilmasligi shart.
- `src/tests/task372MethodologyExplanationReview.test.ts`: 35 noyob izoh, minimum uzunlik, fan qamrovi, rollback-only va no-publish himoya testlari.
- `supabase/maintenance/task372_pmmet_short_audit_READONLY.sql`: status bo‘yicha keyless qayta audit.

## Ta’minlangan xavfsizlik

- Ushbu SQL **migratsiya emas**, `supabase/maintenance`da saqlanadi, yakuni `ROLLBACK;`; hech qachon productionda bajarilmagan.
- Unda faqat mavjud published savolning mustaqil `review` vorisini yaratish tartibi ko‘rsatilgan, asl versiyaga `UPDATE` qilinmaydi.
- AI tomonidan tayyorlangan izohlar o‘z-o‘zidan publish qilinmaydi. Inson eksperti va egasining alohida release ruxsati zarur.
- Mavjud imtihonlar, foydalanuvchi ma’lumotlari, sertifikat va ballar o‘zgarmaydi.

## Handoff

Task: TASK-372
Natija: 35 pedagogik-metodik izoh draft + avtomatik strukturaviy test.
Migratsiyalar: yo‘q.
Ishga tushirilgan testlar: GitHub PR CI bilan tasdiqlanadi.
Qolgan xavf: yangi izohlar live bazaga tatbiq qilinmagan; nashrga faqat egasining ruxsati va inson nazorati bilan chiqariladi.
Keyingi ustuvor paket: `KS` qisqa izohlari va `PM.GEN`ning M15dan tashqari qolganlari.

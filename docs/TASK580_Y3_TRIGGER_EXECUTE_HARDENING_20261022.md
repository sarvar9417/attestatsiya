# TASK-580 — Y3 trigger funksiyasining RPC huquqini yopish

**Sana:** 2026-10-22. **Muhit:** Supabase `plyqezulrfowyblsfpzy`.

Supabase security advisor `public.guard_y3_explicit_task_goal()` funksiyasini client rollari bevosita chaqira olishini ko‘rsatdi. Funksiya `SECURITY DEFINER`, lekin u RPC emas: faqat `questions` jadvalidagi `trg_guard_y3_explicit_task_goal` triggeri orqali yangi published Y3 savollardagi umumiy, maqsadsiz promptlarni bloklaydi.

Migratsiya `PUBLIC`, `anon` va `authenticated` uchun bevosita `EXECUTE` huquqini bekor qiladi. Triggerning o‘zi faol qoladi; jadval hodisasida PostgreSQL trigger funksiyasini alohida client `EXECUTE` huquqisiz bajaradi.

`public.auth_role()` o‘zgartirilmadi: amaldagi ochiq kontent RLS siyosatlari uni anonymous o‘qish vaqtida ishlatadi va mavjud regressiya testi bu istisnoni aniq himoya qiladi.

Regressiya testi ikki invariantni tekshiradi: client rollari trigger helperni chaqira olmaydi va Y3 sifat guard triggeri `questions` jadvalida faol qoladi.

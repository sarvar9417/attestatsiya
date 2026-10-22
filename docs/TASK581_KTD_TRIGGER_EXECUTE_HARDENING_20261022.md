# TASK-581 — KTD publication trigger huquqlarini mustahkamlash

**Sana:** 2026-10-22. **Muhit:** Supabase `plyqezulrfowyblsfpzy`.

Production inventarizatsiyada `ktd_quality.guard_ktd_publication()` `SECURITY DEFINER` trigger funksiyasi PostgreSQLning standart `PUBLIC EXECUTE` huquqini saqlab qolgani aniqlandi. Funksiya faqat `public.questions` jadvalidagi `ktd_unverified_publication_guard` orqali KTD savollarini mustaqil ekspert va manba dalilisiz nashr qilishni bloklash uchun ishlatiladi; u client RPC emas.

Migratsiya `PUBLIC`, `anon` va `authenticated` rollarining bevosita `EXECUTE` huquqini bekor qiladi. Funksiya tanasi, ekspert talablari, fingerprint tekshiruvi va trigger bog‘lanishi o‘zgartirilmaydi.

Yangi umumiy regressiya testi barcha user schemalardagi `SECURITY DEFINER` trigger funksiyalarini tekshiradi. Kelajakda shunday helper tasodifan client-executable bo‘lib qolsa CI darhol to‘xtaydi.

# TASK-582 — yangi funksiyalar uchun default-deny huquqlari

**Sana:** 2026-10-22. **Muhit:** Supabase `plyqezulrfowyblsfpzy`.

Production `pg_default_acl` tekshiruvida `postgres` tomonidan `public` schemada yaratiladigan har bir yangi funksiya `anon`, `authenticated` va `service_role` uchun avtomatik `EXECUTE` olishi aniqlandi. Bu holat trigger-only `guard_y3_explicit_task_goal()` va `ktd_quality.guard_ktd_publication()` helperlarining tasodifan client-executable bo‘lib qolishiga sabab bo‘lgan.

Migratsiya kelajakdagi funksiyalar uchun PostgreSQL `PUBLIC` defaultini global bekor qiladi va `public` schemada `anon` hamda `authenticated` avtomatik grantlarini olib tashlaydi. `service_role` defaulti saqlanadi. Mavjud funksiyalar ACL’i o‘zgarmaydi, shu sabab hozirgi test, mock, progress va guruhli test RPC’lari ishlashda davom etadi.

Kelajakdagi yangi client RPC migratsiyasi kerakli rolga `GRANT EXECUTE`ni aniq yozishi shart. Regressiya testi `pg_default_acl` effective katalog yozuvlarini hamda mavjud `start_exam` caller contractini tekshiradi.

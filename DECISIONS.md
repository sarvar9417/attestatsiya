# DECISIONS.md — Architectural Decision Records

Har bir muhim qaror shu yerda ADR formatida qayd etiladi (AGENTS.md, 8.4).

## ADR-001: Backend'da user-auth operatsiyalari uchun alohida supabase client (2026-07-31)

**Kontekst:** `login` (`signInWithPassword`) va `refresh` (`refreshSession`)
umumiy service-role `supabase` client'ida bajarilar edi. Bu chaqiruvlar
client'ning in-memory session holatini o'zgartirib, keyingi REST
so'rovlarining `Authorization` header'ini service-role kalitidan foydalanuvchi
access token'iga almashtirardi.

**Natija:** client'dagi barcha keyingi DB so'rovlari user-scope bo'lib, RLS
qo'llanar edi. Live DB'da `profiles` UPDATE user-scope'da 0 satr qaytargani
uchun profile yangilash "muvaffaqiyatli" ko'rinib, hech qanday o'zgarish
qilmasdi (silent no-op). Selectlar ishlagan, shuning uchun muammo uzun vaqt
aniqlanmagan.

**Qaror:** user-auth operatsiyalari (login, refresh, reset-password) uchun
har chaqiruvda yangi `createServiceClient()` yaratiladi va tashlanadi.
Umumiy `supabase` client faqat admin va DB operatsiyalarida qoladi va unda
session o'rnatadigan auth metodlari ishlatilmaydi. `getAuthedClient()`
(user token bilan) user-scope RPC uchun saqlanadi.

**Natija:** live zanjir to'liq ishladi — profile update DB'ga yozildi.
Backend testlar 90/90.

**Alternativlar ko'rib chiqildi:**
- login'dan keyin client'ni `signOut()` bilan tozalash — nozik, future'da
  qaytib keladigan bug' manbai;
- client'ni yagona tuzatib bo'lmasdi, chunki signInWithPassword
  session'ni o'zi o'rnatadi.

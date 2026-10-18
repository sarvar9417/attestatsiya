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


## ADR-002: M13 AXR owner-authorized didactic publication without expert signoff (2026-10-18)

**Kontekst:** TASK-211 orqali M13 moduliga 7 yangi nazariya bobi va 210 didaktik test `review` holatida import qilindi. Asosiy qoida — sun'iy intellekt tomonidan yaratilgan materialni nashrdan oldin ekspert tekshiradi. Loyiha egasi suhbatda ushbu **aniq M13 AXR banki** uchun ekspert bosqichini o'tkazmasdan `published` qilishni bevosita so'radi.

**Qaror:** TASK-212 mazkur bir martalik loyiha egasi qaroriga binoan faqat `m13-axr-01..07` darslarini va `m13-axr-v1:*:AXR-*` bankini nashr qiladi. Boshqa modullarning editorial gate talablariga tegilmaydi. Nashr jarayoni javob kaliti, variantlar soni, bob taqsimoti, construct bog'lanishi, status va matn yaxlitligini avtomatik tekshiradi; **ilmiy-pedagogik ekspert xulosasi bor deb da'vo qilinmaydi**.

**Risk:** savollar va nazariyaning semantik haqiqiyligi inson tomonidan mustaqil tekshirilmagan; ehtimoliy xatolar foydalanuvchiga ko'rinishi mumkin. Avvalgi test urinishlari va kanonik M13 materiallari saqlanadi. Matn/javobni kelajakda tuzatish uchun yangi versiya yaratiladi, published snapshot joyida o'zgartirilmaydi. Manbadagi 14 ta Y2/Y3 qog'oz savoli interaktiv Y2/Y3 deb taqdim etilmaydi, real format Y1.

**Yakuniy qamrov:** faqat TASK-212 bir martalik chiqarilishi, umumiy ekspert siyosatini o'zgartirmaydi.

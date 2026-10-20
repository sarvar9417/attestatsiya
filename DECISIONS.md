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


## ADR-004: M09 owner-authorized AI-reviewed eight-question release (2026-10-20)

**Context:** The platform's general ADR-009 and AGENTS.md rules require independent human review of AI-generated content. The owner directly instructed the AI to act as subject expert and publish M09 questions already checked. ADR-002 for M13 previously established the pattern of a **scope-limited, documented owner exception**; neither a waiver nor an AI review should be labeled human review.

**Decision:** One-time publication of **exactly** `MSACCESS-DEMO-STYLE-2026/DBS-Q01..Q08`. All eight have independent calculation/answer rationale evidence. A separate RLS-protected `m09_owner_ai_release_waivers` table documents account-based owner authorization, the old V2 lesson source, answer-option fingerprint, named AI reviewer kind and source limits; it does not write to `question_editorial_checks`. Human signed review remains mandatory for every other newly authored M09 item. Exact waiver, 4 unique answer options, published canonical construct/lesson mapping, publication immutable snapshot and private server keys are DB-enforced. No previously published question or attempt is changed.

**Risk and limits:** AI-only review is not equivalent to a human expert's independent signoff. This does not certify authenticity of historic exams nor native Microsoft Access runtime. The remaining 288 questions and 6 V2 lessons remain in review, and this exception does not change the default product editorial policy. See `docs/TASK211_M09_OWNER_AI_EIGHT_RELEASE.md`.

# Pedmahorat | Guli: 1 394 ta noyob Telegram savolini xavfsiz import qilish

**Holat:** Draft PR #97. Ishchi saytdagi Vercel hamda production Supabase `plyqezulrfowyblsfpzy` ga qo‘llash **TAQIQLANGAN**, faqat foydalanuvchining alohida yakuniy ruxsatidan keyin.

## Asos va real hisob

Manba — foydalanuvchi taqdim etgan `messages.html`–`messages20.html` (2025-02-03 dan 2026-08-10 gacha). Xususiy audit: `pedguli_audit_shaxsiy_review.json` (ommaviy Git repoga qo‘yilmaydi).

| Guruh | Soni |
|---|---:|
| Eksportdagi jami xabarlar | 19 536 |
| A–D javob formatiga o‘xshash nomzod xabarlar | 2 408 |
| **Normallashtirilgan noyob matnli nomzodlar** | **1 394** |
| Takroriy Telegram xabarlari | 1 014 |
| Mavzu teglari bilan dastlabki ajratilgan noyob nomzodlar | 673 |
| Aniq mavzu tegi qo‘yilmagan noyob nomzodlar | 721 |
| Javob belgisi topilgan (kaliti tasdiqlanmagan) noyob nomzodlar | 105 |

**Muhim:** original xabarlar mazmuni, A–D variantlari va takrorlanish avtomatik ajratilgan; bu **1 394 ta mustaqil tekshirilgan, huquqi olingan yoki rasmiy attestatsiya testlari** degani emas. Hech qanday javob avtomatik ravishda `correct_option_id` ga aylantirilmaydi.

## Lokal staging bazasi — 1 394 ta real yozuv

Yuborilgan HTML eksport auditi asosida quyidagi **shaxsiy SQLite baza** yaratildi:
`/mnt/data/pedguli_1394_staging_review.sqlite3`

Undagi asosiy jadvallar:
- `source_candidates` — **1 394 ta** asl manba xabari, havola, sana, matn, taxminiy teg, sha256 xesh, tekshiruv holati. Barchasi `needs_review`.
- `candidate_duplicate_posts` — **1 014 ta** takroriy xabar va uning kanonik xabarga bog‘lanishi.
- `import_batches` — tekshirilgan eksport qamrovi.

DB integriteti va noyob xeshlar tekshirildi. Baza **offline staging** hisoblanadi, bu production Supabase loyihasiga yozilganini anglatmaydi.

## Platforma PostgreSQL staging arxitekturasi

`supabase/migrations/20261012110000_pedguli_private_candidate_inbox.sql`:

1. `public.pedguli_source_candidates` — original Telegram matnlarini `public.questions` dan alohida saqlaydigan maxfiy staging jadvali.
2. RLS yoqilgan, `anon` va `authenticated` uchun jadvalga o‘qish/yazish berilmaydi; faqat backendning `service_role` ulanishi ishlatadi.
3. Telegram xabar ID va URL, sha256 matn izi, xabar matni uzunligi va ikki turdagi takroriy xabar cheklovlari mavjud.
4. Import savolni avtomatik `verified`/`published` holatiga o‘tkaza olmaydi. Savollar `public.questions` ga nusxalanmaydi.
5. Re-importda xesh bo‘yicha takroriy yozuvlar o‘tkazib yuboriladi, mavjud tahririy holatlar ustiga yozilmaydi.

Backend:
- `POST /api/admin/pedguli-candidates/import` — faqat faol **admin**, har paketda ko‘pi bilan 50 ta, server o‘zi xesh hisoblaydi, 1 394 savol uchun 28 ta paket. Production Supabase ref uchun alohida server-side ruxsat darvozasi bor.
- `GET /api/admin/pedguli-candidates?page=1&page_size=25` — faqat faol admin yoki muharrir, sahifalangan ko‘rish.
- Admin navigatsiyasi: **Telegram nomzodlari** — faqat xususiy ro‘yxat, to‘liq asl matn va manba havolasi; hech qanday javob avtomatik tasdiqlanmaydi.

## Haqiqiy eksportni import qilish — staging infratuzilma mavjud bo‘lganda

1. **Haqiqiy staging** Supabase/PostgreSQL loyihasini belgilang. Ishchi production loyihasini staging deb ishlatmang.
2. Draft branchdagi migratsiyalarni staging loyihaga ketma-ket qo‘llang; CI dastlab aynan shu SQLning vaqtinchalik bazada ishlashini tekshiradi.
3. Staging Fastify serverni o‘sha baza bilan ulang; admin login tokenini maxfiy muhit o‘zgaruvchisida saqlang. Token/chatda kalit ulashish shart emas.
4. Git repo **tashqarisidagi** xususiy `pedguli_audit_shaxsiy_review.json` fayli bilan quyidagi buyruqni ishlating:

```bash
# Faqat tekshiradi; hech qanday bazaga ulanmaydi.
node scripts/import-pedguli-candidates.mjs /private/pedguli_audit_shaxsiy_review.json

# Faqat haqiqiy staging backend + staging Supabase uchun.
PEDGULI_TARGET_ENV=staging \
ATTESTATSIYA_API_BASE=https://staging.example.org \
PEDGULI_ADMIN_TOKEN='staging_admin_jwt_from_secure_env' \
node scripts/import-pedguli-candidates.mjs /private/pedguli_audit_shaxsiy_review.json --execute
```

**Eslatma:** misoldagi staging URL va token haqiqiy emas. Real tokenni chatda yoki GitHub’da saqlamang. Import qiluvchi skript *production frontend manzilidan* foydalanishni rad etadi; server ham ma’lum production Supabase refga avtomatik yozishni bloklaydi.

5. Staging bazasida tekshirish:

```sql
select count(*) from public.pedguli_source_candidates;
-- Kutilgan 1394 (noldan boshlangan sof staging bazasi).

select editorial_status,count(*)
from public.pedguli_source_candidates
group by editorial_status;
-- needs_review = 1394.

select count(distinct text_sha256)
from public.pedguli_source_candidates;
-- 1394.

select count(*) from public.questions
where source_reference like 'authored:pedguli-%';
-- Bu so‘rov 84 ta alohida ORIGINAL mualliflik mashqlarini sanaydi;
-- Telegramdan kelgan 1394 nomzod hech qachon shu jadvalga avtomatik kirmaydi.
```

## Keyingi tahrir bosqichi

- 1 394 nomzod bo‘yicha variantlarning to‘liqligi, mazmuniy takrorlanish, xatoli kalit, manba va mavzu mosligini tekshirish.
- Kanal savol matnlarini ommaviy testda qayta nashr qilish uchun huquq/litsenziyani aniqlash.
- Tekshirilgan dalillardan kelib chiqib yangi **mustaqil** informatika-pedagogika mashqlarini yozish yoki asl matnni faqat tegishli foydalanish huquqi mavjud bo‘lganda tasdiqlash.
- Hech qanday kandidatdan foydalanuvchi testiga avtomatik nashr qilish yo‘q.

**Production roziligi:** PR #97 Draft va barcha yangi SQL migratsiyalar production’ga qo‘llanmagan holda saqlanadi.

## Qo‘shimcha sifat nazorati va qo‘lda tahrir (2026-10-12)

Haqiqiy 1 394 ta yozuvda Node.js bilan to‘liq import-validatsiya bajarildi: **1 394 valid ID**, **1 394 noyob SHA256 iz**, **0 noto‘g‘ri manba URL/fayl/teg**, **28 ta 50 tadan paket**. Mavzu yorliqlari: **673 ta mavjud**, **721 ta hali aniqlanmagan**. Media bilan bog‘liq yozuvlar: **35 ta**. «Javob belgisi bor, ammo kalit tasdiqlanmagan» yozuvlar: **105 ta**. Bularning hech biri avtomatik javob emas.

Xususiy SQLite v2 faylida `candidate_quality_review` jadvali paydo bo‘ldi. U **barcha 1 394 nomzodga** konservativ bayroq va tekshiruv ustuvorligi beradi:
- Ustuvorlik 3: **23 ta** (bir xil yoki juda o‘xshash javob variantlari bo‘lishi mumkin);
- Ustuvorlik 2: **38 ta** (masalan, media yoki variant strukturasi qo‘shimcha tekshiruv talab qiladi);
- Ustuvorlik 1: **1 333 ta** (kamroq yuqori xavfli belgilar bilan; javob baribir tekshirilmagan).
- A–D ketma-ketligi aniq topilgan: **1 389 ta**; qo‘lda ajratilishi kerak: **5 ta**.
- Ushbu flaglar **faqat ehtimoliy xato** ko‘rsatadi; manbani yoki kalitni tasdiqlamaydi. Bir nomzodda bir nechta flag bo‘lishi mumkin.

Platforma Draft branchiga quyidagilar qo‘shildi:
- `pedguli_source_candidates.quality_flags`, `review_priority` va `four_options_detected` ustunlari; flaglar server tomonidan hisoblanadi.
- Admin → **Telegram nomzodlari** sahifasida prioritet bo‘yicha saralash, filtrlash va ogohlantirishlar.
- **Qo‘lda tekshiruv oynasi**: konstrukt teglarini to‘g‘rilash, ma’lumot manbasi, qayta foydalanish huquqi, javob kaliti ishonchliligi, tarixiy imtihonga oid da’vo va dalil izohlarini kiritish.
- **Verified** holati faqat faol administrator uchun; pedagogik manba va javobni mustaqil tekshirish, foydalanish huquqi va yetarli qaydlar talab qilinadi. Bu holat ham `public.questions` ga original matnni avtomatik ko‘chirmaydi.
- Original Telegram matni/ID/URL/SHA256 keyinchalik o‘zgartirilmaydi; faqat tahririy metadata yangilanadi.
- Backend/SQL/frontend regressiya testlari nashrga chiqish yo‘qligini tekshiradi.

**Tahririy tekshiruv natijalari avtomatik chiqarilmagan**: lokal auditdagi barcha 1 394 nomzod hali odam tomonidan izchil tasdiqlanmagan. Xavfli deb belgilangan 23 ta yozuv uchun alohida *xususiy* ro‘yxat tayyor; bu ro‘yxatda to‘liq original savol matni ommaviy kodda saqlanmaydi.

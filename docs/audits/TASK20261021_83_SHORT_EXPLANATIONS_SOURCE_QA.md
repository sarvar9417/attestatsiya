# 2026-10-21 — REVIEW qisqa izohlar: manba va mazmuniy audit

**Holat: LOCAL QA / SOURCE TRIAGE. Production DML, migration yoki deploy YO‘Q.**
Ushbu hujjat ommaviy GitHub’ga maxfiy savol/javob kalitlarini chiqarmaydi. Tekshiruv yordamchi SQL `supabase/maintenance/task20261021_review_short_explanation_triage_READONLY.sql` da, faqat SELECT.

## 1. Dolzarb baza holati
2026-10-21 dagi `public.questions`/`public.question_keys` SELECT natijasi:
- `review` jami 1 291;
- izohi **30 ta belgidan qisqa**: **83**;
- `S5.WEB` Y1: **75**; `S4.DB` Y1: **6**; `S3.LOGIC` Y1: **1**; `S3.NUM` Y1: **1**.
- ushbu 83 ta savolda bo‘sh manba havolasi: **0**; bu havola to‘g‘ri va javobni isbotlaydi degani emas.

**Izoh uzunligi yagona sifat mezoni emas.** 83 tadan hech biri avtomatik karantindan chiqarilmaydi yoki rad etilmaydi.

## 2. Manba asosidagi birinchi sifat tekshiruvi

### S3.LOGIC va S3.NUM — 2 ta
Savol javoblari va izohlari mustaqil qayta hisoblandi. Mantiqiy sxema uchun `(1 ∧ 0) ∨ (0 ∧ 1) ∨ (1 ∧ 1) = 1`. Ikkilik `101101₂ = 45₁₀ = 55₈ = 2D₁₆`. Har ikkala kalit matematik jihatdan to‘g‘ri va izoh qisqa bo‘lsa-da, mazmunli. **Faqat 30 belgi chegarasidan kamligi uchun ularni xato deb belgilash asossiz.** Dastlabki asl savol-fayl bibliografiyasi mustaqil qayta tasdiqlanmagan; savollar `review`da.

### S4.DB — 6 ta
Javoblar (SELECT/WHERE/AVG/sonli filtrlash/DISTINCT/HAVING mavzulari) mustaqil SQL semantikasi bilan tekshirildi va ko‘rsatilgan vaziyatga mos deb topildi. **Ammo ulardagi manba ta'rifi alohida xato xavfi**: user-provided `ICT 11_sinf-2021(1).pdf` ning *fizik PDF* 30–52 va 44–52-betlari PyMuPDF matn qatlamida `SELECT`, `WHERE`, `AVG`, `DISTINCT`, `HAVING`, `COUNT` so‘zlari uchramadi. Ushbu boblarda Access’ning so‘rovlar/interfeys mavzusi mavjud, ammo aynan SQL operatorlari uchun iqtibos yetarli emas. Rasm/skrinshot ichidagi yozuvlar matn qidiruvidan chetda qolishi mumkin. **Vazifa:** 6 savol uchun asl darslikning tegishli aniq o‘rni yoki boshqa vakolatli SQL manbasini vizual tarzda tekshirish; o‘zboshimchalik bilan sahifa almashtirmaslik. Savollar `review`da qoladi.

Manba kodi: `MSACCESS-V2/DB-05-001`, `DB-05-003`, `DB-05-013`, `DB-05-014`, `DB-05-015`, `DB-06-017`.

### S5.WEB — dastlabki 16 ta CSS Y1
`GV-CS-002`, `004`, `006`, `007`, `008`, `009`, `010`, `014`, `015`, `016`, `018`, `019`, `020`, `023`, `037`, `038` texnik javoblari mustaqil yechib tekshirildi. Ikkita box-model hisobining arifmetikasi ham tekshirildi. **16 ta keys semantik jihatdan mos**, lekin bu to‘liq source signoff emas.

Fizik PDF **`9-sinf informatika (Cambridge +)(1).pdf` 295–300** matnida CSS selektor/deklaratsiya, fon rangi, text-align, padding, border-collapse, ranglar, ichki/tashqi uslub qo‘llash namunalari bor. `8-sinf informatika (Cambridge +)(1).pdf` 79–85-betlarida veb-sahifa dizayni va matn/rang shakllari muhokama qilinadi.

Quyidagi tushunchalar **ko‘rsatilgan PDF 295–303 matn qatlamida to‘liq bevosita tasdiqlanmadi**: `margin`, spetsifiklik/source-order tenglik qoidasi, descendant/child selektorlar farqi va ayrim `class/id` yozilish tafsilotlari. Bu javob xato degani emas; manbani aniqroq izlash kerak. Box-model misollarini mustaqil hisoblash to‘g‘ri, lekin manbaning shu sahifalarida jami tashqi en formulasi to‘liq berilganligi alohida tekshirilsin.

**Natija:** 16 ta birinchi ko‘rik, lekin hech qanday inson imzosi, nashr qilish yoki javob-kalit o‘zgarishi yo‘q.

## 3. Qolgan ishlar
83 ta muammoli uzunlik signalidan **24 tasi** (16 CSS + 6 Access + 2 hisoblash) mazmun bo‘yicha ushbu bosqichda ko‘rildi, **59 tasi hali alohida ko‘rilmagan**. Bu “83 ta xato” emas, balki tahririy tekshiruv navbati.

Har bir qolgan savol uchun: (1) to‘g‘ri kalitni mustaqil yechish; (2) noto‘g‘ri javoblar sifatini tekshirish; (3) haqiqiy PDF fizik va bosma sahifasini farqlab, kerak bo‘lsa rasmni tekshirish; (4) takrorlanish va rasm formatini ko‘rish; (5) AI tekshiruvini inson tahririy imzosi deb yozmaslik; (6) faqat tasdiqlangan lokal patchni tayyorlash.

## 4. Lokal foydalanish
```bash
git checkout main
git pull origin main
psql "$LOCAL_DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/maintenance/task20261021_review_short_explanation_triage_READONLY.sql
```
Agar lokal bazada savollar hali yuklanmagan bo‘lsa, tekshiruv natijalari bo‘sh yoki kamroq chiqishi tabiiy; bu productiondagi 83 ta faktni bekor qilmaydi. SQL hech qanday ma’lumotni o‘zgartirmaydi.

**Production deploy: taqiqlangan. Production yozuvlarini o‘zgartirish: bajarilmagan.**

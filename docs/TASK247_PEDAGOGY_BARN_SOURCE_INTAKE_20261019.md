# TASK-247 — barnoyevak pedagogika manbalari: ZIP intake va xavfsiz boshlang‘ich boyitish
**Sana:** 2026-10-19
**Branch:** `task/TASK-247-pedagogy-source-intake-20261019`
**Holat:** PARTIAL / SOURCE BLOCKED; **main merge, production deploy va DB write YO‘Q**

## 1. Arxiv aniqlangan, ammo ochilmagan

- Maqsad akkaunt: barnoyevak Google Drive.
- Foydalanuvchi ko‘rsatgan papka: https://drive.google.com/drive/folders/1XovTGCr2ELkRJJm_o7DQPnQoJsroSOoD
- Papkadagi fayl: `ChatExport_2026-10-19.zip`
- Drive ID: `1RyrFy-I-G2dKlvvgKkmshIVvTZgM1E1w`
- Hajmi: **546831018 bayt** (taxminan 546,8 MB).
- Google Drive connector `fetch(download_raw_file=true,include_base64=false)` natijasi: `413 File too large ... exceeds the 268435456-byte limit`.
- Matnli `fetch` ham ZIP arxiv tarkibini ochib bermadi.
- **Dalil chegarasi:** arxiv ichidagi fayllarning nomi, soni, sahifalari, dublikati va pedagogikaga daxldorligi hali noma’lum. Arxiv chiqarildi yoki barcha kitoblar auditdan o‘tdi degan iddao qilish taqiqlanadi.
- Hozircha na arxivga, na production bazaga o‘zgartirish kiritildi.

### Blokerni yopish sharti

Shu papkaga ZIP ichidan chiqarilgan manbalarni alohida fayl sifatida yoki mavzuga bo‘lingan **250 MB dan kichik mustaqil ZIP** to‘plamlari sifatida joylashtirish zarur. Bitta ZIPning baytlarini shunchaki bo‘laklash original arxiv ichidagi PDFlarni connector bilan ochish imkonini bermaydi.

Extractdan so‘ng fayllarni oldin **nomi + MIME + hajmi + manba toifasi** bo‘yicha ro‘yxatlash, pedagogikaga aloqasiz shaxsiy/chat ma’lumotlarini platformaga ko‘chirmaslik; keyin faqat mavzuga tegishli darslik, me’yoriy hujjat va testlarni o‘qish talab etiladi.

## 2. Pedagogika audit xaritasi

Platformadagi 18 kanonik mavzu foydalanuvchiga o‘quv yo‘li sifatida ko‘rsatiladi; rasmiy sinovda savol taqsimoti **KS=5, PM.GEN=7, PM.MET=3** (jami 15) — 18 o‘quv mavzusi bilan aynan bir xil son emas.

| Modul | Mavzular | Kutilayotgan arxiv manbalari | Hozirgi dalil |
|---|---:|---|---|
| M14 | 7 | Pedagog kasb standarti, mehnat vazifalari va amaliy holatlar | ZIP tarkibi hali noma’lum; avvalgi KS qo‘llanmasi repo auditida mavjud |
| M15 | 8 | Umumiy pedagogika, didaktika, tarbiya, etika, qobiliyatlar, inklyuziya, tarixiy testlar | ZIP noma’lum; mavjud statik nazariya va oldingi boshqa Drive manbalari bor |
| M16 | 3 | Informatika o‘qitish metodikasi, yondashuvlar, dars loyihalari | ZIP noma’lum; avvalgi manbaviy nazariya bor |

Har bir yangi manba uchun alohida `source_id`, fayl nomi, kitob muallifi/nashri, PDF fizik beti, mavzu kodi, mos ta’lim maqsadi, dalil turi, aniq tekshirilgan fakt, shubhali joy, ishlab chiqilgan savol va review holati yuritilishi kerak.

Tarixiy Telegram/test PDFdagi «to‘g‘ri javob» yorlig‘i mustaqil ekspert tekshiruvi yoki rasmiy sinov hujjati emas. Asl manba bilan tekshirilmagan itemlar **review/quarantine** holatidan nashrga avtomatik o‘tmaydi. Published revision/attemptlar joyida o‘zgartirilmaydi.

## 3. Shu branchda qilingan xavfsiz boshlang‘ich nazariya tuzatishi

**Qo‘shimcha, avvaldan mavjud alohida manba** (barnoyevak ZIP bilan adashtirilmasin):
- `Blum taskanomiyasi (2).pdf`, Sarvar Drive: https://drive.google.com/file/d/1vdzD1KgxOn651eAiJa8ztFdVtF9RCLYV/view . Unda 1956-yilgi 6 bosqich izohi mavjud; matnli o‘qish tasdiqlangan, fizik PDF bet lokatori **tekshirilmagan**. Bu ikkilamchi pedagogik o‘quv materiali, rasmiy spetsifikatsiya emas.
- Cornell University, Bloom's Taxonomy: https://teaching.cornell.edu/resource/blooms-taxonomy .
- University of Waterloo, Bloom's Taxonomy: https://uwaterloo.ca/centre-for-teaching-excellence/catalogs/tip-sheets/blooms-taxonomy .

**O‘zgarishlar:**
1. `src/data/pedagogyStudyNotes.ts`: M15.02 qo‘shimcha darsida 1956 **Bilish → Tushunish → Qo‘llash → Tahlil → Sintez → Baholash** va 2001 **Eslash → Tushunish → Qo‘llash → Tahlil → Baholash → Yaratish** talqinlari bo‘yicha taqqoslash, informatika vaziyatlari, testda adashmaslik izohi va source caveat.
2. `src/data/topicContent.ts`: M15.07da «Persiptiv» → «Perseptiv» terminologiyasi.
3. `src/tests/PedagogyBloomSource.test.ts`: ikki tarixiy talqin tartibi, informatika amaliy misoli, rasmiy kognitiv kvotadan farqi, ikkilamchi manba chegarasi va termin imlosi uchun Vitest regressiya.

**Aniq chegara:** Bu qo‘shimcha mavjud statik o‘quv izohini kuchaytiradi; barnoyevak ZIP ichidagi kitoblar hali ochilmagani sabab 18/18 manba tekshiruvi yoki test-bank qamrovi tugaganini bildirmaydi. M15 serverdagi published dars/tuzilish, backend scoring, answer key va production DBga tegilmadi.

## 4. Keyingi majburiy qadamlar va release gate

1. ZIP tarkibini alohida Drive fayllari yoki kichik mustaqil tematik arxivlarga ochish; to‘liq inventar va dublikat qidiruvi.
2. Har bir PDFni betma-bet o‘rganish; spetsifikatsiya `M14.01–M16.03` ↔ learning objective ↔ manba sahifasi ↔ theory block ↔ test item izchilligini tekshirish.
3. Qarama-qarshi izoh/test kalitlarini alohida redaktsion navbatda ko‘rish; PDF tarixiy da’vosi bilan mustaqil tekshiruvni aralashtirmaslik.
4. 18/18 topic pool preflight, dedicated 15 va official 50, server key secrecy, 4 variant / Y1,Y2,Y3, mobile UI va oldingi attempt tarixini tekshirish.
5. Exact branch SHA uchun lint/typecheck/Vitest/E2E/SQL regressiya; **bu sessiyada full test suite ishga tushirilmadi**. PR/merge, production migration va deploy uchun alohida foydalanuvchi ruxsati zarur.

## 5. Handoff

- **Natija:** Drive arxiv topildi, ochib bo‘lmasligi baytlar va connector limiti bilan qayd etildi; M15 didaktik izohi bir manba bo‘yicha kuchaytirildi; bitta termin xatosi tuzatildi, regression testi qo‘shildi.
- **Migrations:** yo‘q.
- **Tests:** test yozildi; haqiqiy CI hali tasdiqlanmagan.
- **Blocker:** asosiy 546,8 MB ZIP manbalarini joriy 256 MiB connector orqali o‘qish mumkin emas.
- **Release:** HOLD; **merge/deploy yo‘q**.

# Scratch / LOGO — 2026 attestatsiyasi, v3.0

Ushbu nashr 2026 informatika attestatsiyasi spetsifikatsiyasiga moslab Scratch/LOGO dasturlash mavzusini o‘rganish uchun tayyorlangan. **Savollar rasmiy imtihon bankidan ko‘chirilmagan; pedagogik mashqlar sifatida mualliflik sintezidir.**

### Hujjatlar
- `Scratch_LOGO_nazariya_v3.tex/.pdf` — manbalarga tayangan nazariya va yangi kengaytmalar.
- `Scratch_LOGO_testlar_oqituvchi_v3.tex/.pdf` — 240 test va yechimlar.
- `Scratch_LOGO_testlar_oquvchi_v3.tex/.pdf` — ayni testlar, javoblarsiz.
- `metadata_v3.json` — 240 savolning tahrirlanadigan strukturasi.
- `platform_import_v3_60_review.sql`, `platform_import_v3_60.json` — **faqat 60 yangi savol** va 6 ta kengaytirilgan nazariya nomzodini review/draft sifatida import qilish. Oldingi **180 published** savolga tegmaydi.
- `platform_chapter_01.md` ... `06.md` — platformaga mos Markdown nazariya.
- `QAMROV_TEST_REYESTRI.csv` — 240 savol va mavzu/manba ro‘yxati.
- `QAMROV_AUDITI_v3.md`, `SIFAT_NAZORATI_v3.md` — mazmuniy va texnik sifat chegaralari.
- `assets` — SVG chizmalar; `build_v3.py`, `compile_v3.py`, `make_platform_package.py` qayta qurish skriptlari.

### Formati
- Boblar: 6; har bob 40 savol; jami 240.
- Y1 = 216 ta; haqiqiy moslashtirish Y2 = 12 ta; haqiqiy ketma-ketlik Y3 = 12 ta.
- **Y1 to‘g‘ri variantlari** A/B/C/D = 54/54/54/54.
- Native Y2/Y3 to‘rt variantdan bittasini belgilash emas; javob strukturasi juftlik/ketma-ketlik.

### Platformaga chiqarish
V3 import rejalashtirilgan **draft/review** nashr. M07’da 2.0 darslari va foydalanuvchilarning ishlangan imtihonlari bor. Ularni avtomatik almashtirish xavfli; v3 ni alohida ko‘rib chiqish va keyin nashr qilish kerak. Tasdiqsiz production publish qilinmaydi.

### Qayta qurish
`python build_v3.py && python compile_v3.py && python make_platform_package.py`, keyin har bir `.tex` ni `xelatex` orqali ikki marta kompilyatsiya qiling; `python qa_v3.py` bilan tekshiring.
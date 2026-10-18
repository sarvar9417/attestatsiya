# TASK-214 — Grafika va veb-texnologiyalar: 380 savollik kengaytirilgan bank

**So‘rov:** mavjud 300 testni o‘chirmasdan har bir yo‘nalishga 8 ta yangi Y2 va 8 ta yangi Y3 qo‘shish. Ushbu qo‘shimcha bank 2026-yil spetsifikatsiyasining **27–31-savollar** mazmuniga tayyorlanish uchun mashq korpusi bo‘lib, **rasmiy imtihondagi Y1/Y2/Y3 kvotasi emas**.

## Sonlar va taqsimot

| Yo‘nalish | Y1 | Y2 | Y3 | Jami |
|---|---:|---:|---:|---:|
| Grafika turlari (GFX) | 56 | 10 | 10 | 76 |
| Rastr-vektor amallari (RV) | 56 | 10 | 10 | 76 |
| MS Paint va Photoshop (ED) | 56 | 10 | 10 | 76 |
| HTML, shu jumladan jadval/forma (HT) | 56 | 10 | 10 | 76 |
| CSS (CS) | 56 | 10 | 10 | 76 |
| **Jami** | **280** | **50** | **50** | **380** |

Asl **300** bank savollari (280 Y1 / 10 Y2 / 10 Y3) o‘chirilmagan. Qo‘shimcha **80** bank (40 Y2 / 40 Y3) 5 ta append-only migratsiya bilan kiritildi. Oldingi 53 ta **published S5.WEB** savol va 6 ta **published M10/M11** dars ham o‘zgarmaydi.

## Ko‘nikmalar va darslik izlari

- **GFX** — rastr/vektor/fraktal/3D, rang modellari RGB/CMYK/HSB/LAB, alpha, PNG/JPEG/SVG/PSD va eksport ketma-ketliklari. Manba: V2 nazariya bob 1; ICT 7-sinf PDF 40–47; 2026 spetsifikatsiya.
- **RV** — Crop/Resize/Select, o‘lcham va xom piksel hajmi, resampling, maska, union/intersection va aylanish, PPI. Manba: V2 bob 2; ICT 7-sinf PDF 29–47; Cambridge 5-sinf PDF 38–42.
- **ED** — Microsoft Paint uskunalari, Curved line, Copy/Cut/Paste, Photoshop tanlov, qatlam, adjustment, mask va PSD eksport. Manba: V2 bob 3; Cambridge 5-sinf PDF 27–44; ICT 7-sinf PDF 47–80.
- **HT** — HTML matn/rasm/ro‘yxat (4 Y2 + 4 Y3), jadval/forma (4 Y2 + 4 Y3); ichma-ich li, colspan, name, radio, input va file. Manba: V2 bob 4; ICT 7-sinf PDF 106–149; Cambridge 8/9 web-boblar.
- **CS** — element/class/id/descendant/child selektorlari, kaskad, width/box model, responsive, style va jadval/ro‘yxat. Manba: V2 bob 5; Cambridge 9-sinf PDF 285–303.

Savollar V2 nazariyadagi tushunchalardan **mualliflik asosida qayta tuzilgan**: darslikdagi savollar so‘zma-so‘z ko‘chirilmagan; tashqi mustaqil mazmuniy ekspertiza bo‘lib o‘tgan, deb da’vo qilinmaydi.

## Ma’lumot modeli

- 40 yangi **Y2**: har savolda **4 chap + 4 o‘ng variant**; `question_options.side` mos ravishda `a`/`b`; `question_keys.payload.pairs` = 4 ta UUID→UUID munosabat, har biri bitta-to-bitta.
- 40 yangi **Y3**: har savolda **4 ta bosqich**, ko‘rsatiladigan tartib aralash, `question_keys.payload.order` esa yagona mazmunan to‘g‘ri ketma-ketlikka mos 4 UUID.
- Savollar `status='review'`; hech biri avtomatik `published` emas. Kalitlar faqat `public.question_keys` server jadvalida.
- `id` va `option.id` deterministik UUID, `source_reference` da `GV2-EXT-...` identifikatori va manba yo‘li ko‘rsatilgan.
- HTML savollari teg nomlarini Markdown kod ko‘rinishida (backtick bilan) saqlaydi; HTML bo‘limi ikki konstrukt `S5.WEB.04` va `S5.WEB.05`ga taqsimlangan.
- Qo‘shimcha 80 savolda yangi grafik yo‘q; oldingi 9 rasmli savol va 8 SVG saqlangan.

## QA

`supabase/tests/task214_graphics_web_380_practice_review_contract.test.sql`:

1. 380 jami, 280/50/50 taqsimot va 5 × 76 qamrov;
2. har mavzuda 8 yangi Y2 va 8 yangi Y3;
3. har Y2 da 4+4 unique variant va 4 haqiqiy juft, har Y3 da 4 unique bosqich;
4. har bir yangi savolda mavjud `review` nazariya bog‘lanmasi va serverda javob kaliti;
5. yangi bankda duplikat stem va `published` yo‘qligi;
6. original 6 published lesson va published S5.WEB pool saqlanishi.

GitHub fresh-DB CI’da ushbu SQL test avtomatik ishlatiladi.

## Ekspert tasdig‘idan oldin qolganlar

- Original 300 savol + qo‘shimcha 80 savolning mustaqil pedagogik va texnik tekshiruvi;
- savol/shart, Y2 mosliklari, Y3 qadamlarining yagona mumkin bo‘lgan tartibi, kod sahna natijasi, variantlar sifati va darslik sahifasi;
- M10/M11 real UI-da Y2 4 juft va Y3 4 qadam ishlashini brauzer E2E bilan tasdiqlash;
- original PDF/LaTeX diagrams va BookReader tasvir/code/math parity;
- rasmiy 50 savollik blueprint o‘zgarmaganini tekshirish.

**Muhim:** TASK-214 — yangi `review` content staging. Editorial review tugamaguncha merge/publish/deploy bajarilmasin. CI yashil bo‘lishi mutaxassis tasdig‘i o‘rnini bosa olmaydi.

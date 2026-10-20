# TASK-291 — S5.WEB: demo-tipi bo‘yicha ekspert ko‘rigi, tekshirilgan ikkita xato

Sana: 2026-10-20. **Mualliflik va baholash modeli:** AI yordamida ekspert tahlili, manbalarni solishtirish va strukturaviy SQL isbotlari. Bu **mustaqil inson mutaxassisi imzosi** sifatida ko‘rsatilmaydi.

## Haqiqiy namuna korpusi

| Material | Tegishli namuna | Savol shakli |
|---|---|---|
| `2025 kuzgi demo @Informatika_fani_ustozlari.pdf`, 14-bet | HTML `<p>`, `style`, `text-align:center`, `<a>` va *About London* sahifa ko‘rinishi | Berilgan kod → 4 ta rasmlangan brauzer natijasidan bittasini tanlash |
| `13.04.2026 Attetasiya Tushgan savollar.pdf`, 14-bet | `<ul>/<ol>/<li>` ichki ro‘yxat variantlari | Qanday ichma-ich HTML ro‘yxat chiqishini kodlardan ajratish |
| Shu 2026 jamlanma, 22-bet | `input type=text`, `value`, `button` | Kod → vizual shakl natijasi |
| Shu 2026 jamlanma, 23-bet | `table`, `tr`, `th`, `td`, `color:green`, `background-color:red` | Berilgan CSS/HTMLda matn rangi va fon rangini FARQLASH |

**Muhim:** PDF to‘plamlari Drive'da mavjud, ammo «o‘tgan yili asl rasmiy imtihonda tushgan» degan da'vo ularning provayderi tomonidan mustaqil tasdiqlanmagan. Bu yerda ular **namuna material** sifatida keltirilmoqda; yozilgan savollar ularning nusxasi emas.

## Model tekshiruvida aniqlangan mazmuniy nuqsonlar

1. **GV-DEMO-2026-ED-017 (Y2)**: shart *oq maskada qora bilan bo‘yalsa nima bo‘ladi?* deb so‘ralgan, variantlari esa Color Picker/Lasso/Mask/Clone Stamp asboblarini **moslashtirish**ga mo‘ljallangan. Shart asboblarni vazifasiga moslashtirish talabiga almashtirildi. Google Docdagi nomzod hujjat bevosita tuzatildi.
2. **GV-DEMO-2026-ED-018 (Y3)**: *fonni tanlab Reveal Selection mask qo‘shish* asli fondagi tanlangan sohani ko‘rsatadi — **obyektni emas**. Endi saqlanadigan obyektni tanlab `Layer Mask > Reveal Selection` qo‘shish ko‘rsatilgan. [Adobe rasmiy Layer Masks](https://helpx.adobe.com/photoshop/desktop/create-masks/layer-masks/add-layer-masks.html), [mask qora-oq semantikasi](https://helpx.adobe.com/photoshop/desktop/create-masks/layer-masks/edit-and-refine-layer-masks.html).
3. **Production’dagi ikki eski nashr qilingan Y2**: `formatbank-2026:T063-Y2-018` (HTML) va `T063-Y2-019` (CSS) bo‘yicha 8 option ham `side='a'`, `side='b'` = 0; `question_keys.payload.pairs` da esa 4 ta juftlik. Har bir eski savoldan kamida 1 ta exam_item mavjud; ularni o‘zgartirish mavjud foydalanuvchilarning tarixiy tekshiruv ko‘rinishini buzishi mumkin. Shuning uchun `task291_native_y2_legacy_two_revisions_review` yangi UUIDli, o‘zgarmas *review* nusxalar yaratadi; oldingi savollar va attemptlar o‘zgarmaydi. Yangi versiyalarni nashr qilish va eskilarni arxivlash alohida, atomik forward-fix bo‘lishi kerak.

## Yangi mualliflik banki: birinchi ekspert bosqichi

`task291_gv_30_demo_style_review`: 5 yo‘nalishga 6 tadan, jami **20 Y1 + 5 Y2 + 5 Y3 = 30** ta yangi `review` savol. Savollarda HTML teglarining render natijasi, CSS cascade/selector/box model, rang modellari, xom piksel hisoblari, grafik edit operatsiyalari va Photoshop qatlam/maska muhiti qo‘llanadi.

- Y1: A/B/C/D kaliti 5 tadan, 4 ta alohida variant va izoh mavjud.
- Y2: har biri 4×4, chap/o‘ng aralash, 4 ta UUID↔UUID kalit, javoblar serverda.
- Y3: 4 ta aralash beriladigan qadam, to‘g‘ri ketma-ketlik UUID bilan.
- HTML va CSS misollarda CSS specificity doimo origin/importance/layerdan **keyin** qo‘llanishini hisobga oling: [MDN CSS specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Specificity).
- **Manba talqini:** sifatni tekshirish uchun namuna PDF, darslikning bob/bet oralig‘i, rasmiy spetsifikatsiya va yuqoridagi texnik hujjatlar ishlatilgan. Har savolning o‘ziga xos **aniq darslik beti** hali qayta mustaqil tasdiqlanmagan — manba mavjud degani avtomatik isbot emas.

## Qabul va xavfsizlik darvozasi

GitHub CI:
- `task291_gv_demo_30_review_key_integrity.test.sql` — 30 savol, 5×6, 20/5/5, kalit/javob variantlari, review-only, manba darsi published.
- `task291_gv_legacy_y2_revisions_review.test.sql` — eski 2 published savol o‘zgarmaydi; yangi ikkala Y2 review savoli native 4 chap/4 o‘ng juft.
- Boshqa S5.WEB 444 faol va 440 tarixiy testga yozuv o‘chirish/tahrirlash kiritilmaydi.

### Hozirgi ish chegarasi

Tahlil va 32 ta yangi *review* nomzodni yaratish **444 savolning 100% individual mazmuniy tekshiruvi tugadi degani emas**. Ushbu natijalar keyingi batch uchun foydali va real xatolarni topgan birinchi sifat bosqichi; mutlaq xatosizlik va inson ekspertizasi tasdig‘i haqida da'vo qilinmaydi.

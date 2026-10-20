# TASK-337 — Adobe Photoshop o‘quv yo‘li, 2026 spetsifikatsiya va 7-sinf darsligi

## Nima sababli Photoshop ko‘rinmagan?
- M10 bir xil 7 ta static subtopic saqlaydi, lekin avval M10.02 "Paint va Photoshop interfeysi", M10.03 "Belgilash, kesish...", M10.04 "Matn/foto..." nomlari ostida Photoshop bilimlari ko‘rinmas edi.
- 2026 Informatika test spetsifikatsiyasi (1-jadval, 27–31-savollar) **Grafika va veb-texnologiyalar** yo‘nalishida 5 umumiy savolni nazarda tutadi. 5 savol **faqat** Photoshop uchun degani emas.
- ICT 7-sinf (2021), II bob, 13-dars Adobe Photoshop interfeysi pp.50–56, 14-dars belgilash/kesish/rang pp.57–61, 15-dars qatlamlar pp.62–66, 17-dars matn pp.67–72, 18-dars sahifa dizayni pp.73–79. 16-dars — nazorat/loyiha.
- M10.02/03/04 static theory esa allaqachon chuqur, 12 bo‘limli canonical BookReader ko‘rinishida bor edi (TASK297/304), lekin mavzu nomi va alohida yo‘nalish kirish sahifasida yo‘q edi.

## O‘zgarish
- M10.02/03/04 katalog va reader sarlavhalarida **Adobe Photoshop** aniq ko‘rsatiladi.
- M10 landing sahifasiga accessible “Adobe Photoshop — darslik va attestatsiya bo‘yicha o‘quv yo‘li” qo‘shildi; u shu uchta mavjud IDni navigatsiya qiladi. 7 static mavzu soni, progress ID, modul sinovi marshruti o‘zgarmaydi.
- Har bir kitobning asosiy nazariyasidan so‘ng 8 tadan **original amaliy blok** qo‘shildi: panel/workspace/file, selection/crop/layer mask, Type/retush/PSD/export. Ular vaziyat, jadval, ishlangan ketma-ketlik, xato, topshiriq, javob va source trace’dan iborat.
- Original 7-sinf va Adobe manbalari bo‘yicha izohlar bor; o‘quv kontenti kitobdan katta parcha nusxa olmaydi.
- Istalgan bosqich nazariyasi ochiladi; review/draft statusdagi DB savollar nashr qilinmaydi, javob kalitlari client/server contracti o‘zgarmaydi.

## Manbalar
- [2026 Informatika Testlar spetsifikatsiyasi](https://drive.google.com/file/d/1jJstcqgFXwTJKuH9bkRIpvATEsjM2UnQ/view), grafika va veb, 27–31-savollar; Photoshop rasmi yaratish va tahrirlash.
- [ICT 7-sinf, 2021](https://drive.google.com/file/d/1QMT7y-6nJLQ-f1-4SySBV8y8JrRpp4q-/view), 13–18-darslar.
- [Adobe Photoshop 2026 workspace overview](https://helpx.adobe.com/photoshop/desktop/get-started/learn-the-basics/workspace-overview.html).
- [Adobe Photoshop add masks](https://helpx.adobe.com/photoshop/desktop/create-masks/layer-masks/add-layer-masks.html).
- [Adobe Photoshop layers](https://helpx.adobe.com/photoshop/desktop/create-manage-layers/create-layer-compositions/create-layers-and-layer-groups.html).
- [Adobe Save/Export](https://helpx.adobe.com/photoshop/desktop/save-and-export/save-files/save-your-work.html).

## Quality / release
- New `TASK337PhotoshopLearningPath.test.tsx` tests stage labels, keyboard-button navigation to M10.02, source/practical blocks and stable seven-topic IDs.
- Existing `TASK297GraphicsCanonicalBooks` and `TASK304RemainingM10CanonicalBooks` regression expectations extended to verify canonical book prefix + new labs + previous appendix. Offline quizzes and correctIndex preserved.
- **Not claimed:** every image and page of the printed textbook is visually one-to-one covered; full independent content/editorial approval; newly complete 50-item Photoshop-specific bank.
- **DB mismatch remains:** M10 has three published canonical lessons but seven static overview topics. M10.04 standalone DB topic test is not guaranteed available. Server-side 50-question generator is separate; do not claim it covers each of the seven static topics.
- No production Supabase write, no publishing review questions, no Vercel deploy.

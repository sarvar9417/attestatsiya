# TASK-346 — PedGuli 4843 savolida yetishmayotgan asl rasm (2026-10-20)

## Murojaat va tasdiqlangan sabab
Foydalanuvchi «Ushbu suratda qaysi metod tasvirlangan?» testida rasm yo‘qligini bildirdi.

Production Supabase **SELECT-only** tekshiruv:
- `d41ab61f-a43e-4b2d-919b-5b06dde05341` — `published`, `PM.GEN`, Telegram `@PedMahoratGuli:4843`, `assets=[]`; tarixiy `exam_items`ga 1 ta bog‘lanish.
- `05d53eb9-56de-454c-9440-e207668dd2c4` — `review`, `PM.GEN`, Telegram `@PedMahoratGuli:4842`, `assets=[]`; exam bog‘lanishi yo‘q.
- Telegram source JSON (Drive `pedagogika/result.json`) ichidagi **4843** xabarda `photo: photos/photo_867@09-10-2025_17-17-41.jpg`. Manba muallifi ✔ belgisini «Debat» varianti yonida qo‘ygan.
- **4842** xabarda `photo: photos/photo_866@09-10-2025_17-09-29.jpg`; boshqa variantlar. Bir xil savol matni qayta ishlatilgani uchun faqat stem orqali rasm bog‘lash xavfli.

## Rasm manbalari va mustaqil tekshiruv
Ikki JPG `barnayevak` Drive pedagogika Telegram export `photos` papkasidan aynan o‘z holicha olindi:

| Telegram xabar | Repository | Hajm | SHA-256 |
| --- | --- | --- | --- |
| 4842 | `public/pedguli-source/pedguli-4842-classroom-game.jpg` | 131219 | `5a95d7874adc55bddd47fb966150a5051ec926379841d36c5e560fca072d9783` |
| 4843 | `public/pedguli-source/pedguli-4843-debate.jpg` | 96247 | `ef131306d4b4ff3e65cf457c64fdcb5d205fd51127147437b87076724e790419` |

`TASK346PedguliOriginalPhotos.test.ts` JPEG signature, hajm va xeshni tekshiradi. **Rasm qayta chizilmadi, yasalmadi yoki boshqa surat bilan almashtirilmadi.**

## Minimal xavfsiz UI tuzatishi
- `ExamQuestionAssets.safeAsset()` faqat ikki xesh tasdiqlangan, **same-origin** rasm yo‘lini allowlist qiladi.
- Eski **published** savolning `question_id`si aynan `d41ab61f-...` va `assets=[]` bo‘lgandagina `ExamRunner` rasmni ko‘rsatadi.
- Yakunlangan sinov `ExamReviewList` API tarkibida `question_id` yo‘qligi sababli, **aynan bir xil savol matni va 4843 xabarning to‘rtta variantidan iborat fingerprint** mos tushgandagina surat ko‘rsatiladi. 4842 varianti adashib qo‘shilmaydi.
- Noma’lum diagram_id, tashqi URL, data URI, spoofed image va noto‘g‘ri savol IDsi qabul qilinmaydi.
- Published `questions`, `question_options`, `question_keys`, `exam_items`, foydalanuvchi urinishlari va baholash **o‘zgartirilmadi**.
- Bu 4843 uchun presentation-only legacy tiklash bo‘lib, production `assets=[]` maydonini tahrir qilmaydi. Ma’lumotlar bazasida to‘liq yangi immutable revisionni rejalash, muharrir nazorati va release alohida task bo‘lib qoladi; tasdiqni soxtalashtirmang.

## QA, rollout va cheklov
Frontend: `ExamQuestionAssets.test.tsx` va `TASK346PedguliOriginalPhotos.test.ts`.
CI: lint, typecheck, test, build, Playwright E2E, backend, database.
Bu commitda production SQL, Vercel deploy, mualliflik manbani avtomatik publish yoki test javob kalitini o‘zgartirish YO‘Q. Deploy bo‘lmaguncha production sayt eski ko‘rinishda qoladi.

Rollback: PR merge commitni revert qilish. Binary first-party assets qo‘shilishining DBga ta’siri yo‘q.

## Kengaytirilgan to‘liq rasm auditi (2026-10-20)
- **140** ta `telegram:@PedMahoratGuli:<id>` imported question / export JSON message ID qo‘shma solishtiruvi: aynan **2 xabar**, 4842 va 4843, `photo` maydoniga ega. Ikkala JPG original baytlarining SHA-256 va fayl hajmi saqlangan.
- Production SELECT: 4843 tarixiy savol hozir `archived` (`assets=[]`), `pedagogy_published_revisions` bilan qulflangan; 4842 `review` (`assets=[]`, nashr qilinmagan).
- **6 published `algoritmlash-v4`** rasmli savoli uchta haqiqiy SVG assetga murojaat qiladi, lekin oldingi renderer allowlistiga tushmagan. Uchala mavjud rasm `public/algoritmlash-v4/`dan tekshirilib, qat’iy whitelistga qo‘shildi. Savol/kalitlar o‘zgarmaydi.
- **9 `review` `graphics-web-v2`** rasmli savolida `src`/alt bor, ammo `diagram_id` yo‘q; 8 ta tasdiqlangan SVGni exact `src` asosida render qilish qo‘shildi. Boshqa manzillar qat’iyan qabul qilinmaydi.
- **52 published `logic_circuit`** source assetlar xato deb belgilanmadi: ular `[[FIG:G001]]` va `MantiqCircuit` orqali frontend proza ichida chiziladi. Faqat `safeAsset` tipiga qaramaslik kerak.
- Review `source_screenshot` provenance markerlari ham valid `demo_q..svg` bilan birga keladi. O‘z-o‘zicha img emas; existing static crop renderi saqlanadi.
- Strong visual-dependent stem / no-asset SQL preflight: aynan bitta **review** `4842` topildi; qolgan keng so‘z kalitli flaglar (`blok-sxemada romb nimani anglatadi`, `rasmda PPI` kabi) mustaqil vizual talab qilmaydi. Ommaviy noto‘g‘ri arxivlash yo‘q.

## Yangi himoya va testlar
`supabase/migrations/20261021000500_task346_missing_visual_gate.sql`:
1. Faqat ko‘rsatilgan `review` 4842 rasm maydonini asl, trusted `pedguli-4842-classroom-game.jpg`ga to‘ldiradi; tarixiy published/archived 4843ga tegmaydi.
2. Kelajakdagi `review -> published` status o‘tishda rasmga aniq ishora qilgan savolga yaroqli first-party asset talab etiladi; ifoda holida faqat `source_screenshot` yoki masofaviy URL rad etiladi.
3. Hech bir savolga ekspert tasdig‘i yoki javob kaliti uydirilmaydi, editorial gate'lar buzilmaydi.

`supabase/tests/task346_missing_visual_media_contract.sql` CI fresh-db ketma-ketligiga qo‘shilgan; `ExamQuestionAssets.test.tsx` 2 Telegram fotosurati + 11 SVG + spoofed path regressiyalarini o‘tkazadi. Ishdagi media tarkibi / nashr holati SQL ma’lumotini boshqa tasklar mustaqil o‘zgartirishi mumkin, merge oldi qayta tekshirilsin.

Rollback: TS/media revert; database trigger keyingi forward-fix migratsiyada `drop trigger` va `drop function`, review 4842 original `assets=[]`ga qaytarilishi mumkin (lekin release va urinish tarixiga tegmasin).

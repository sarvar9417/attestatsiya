# TASK-285 — Nega barcha nazariya boblari hali M01.02 ga teng emas?

**2026-10-19. Status: QISMAN BAJARILDI — CI + ekspert/manba sahifa auditi ochiq.** `main`ga merge va deploy avtomatik qilinmaydi.

## Talab va yondashuv

Foydalanuvchi namunasi: `M01.02 – Informatika, ma’lumot, axborot va bilim`. Sifat mezoni **ko‘rinishni o‘xshatish emas**, balki tekshiriladigan darslik bo‘limlari, maqsad, tushuncha, taqqoslash jadvali, tushuntirilgan misol, diagnostik xato, mustaqil mashq, javob izohi va aniq manbadir.

TASK-284 da 3 ta uzun bob yozilgan; TASK-273 da 81 mavzuga 415 ta qo‘shimcha blok qo‘shilgan. Bu ishlar **barcha mavzular sahifama-sahifa darslikka teng** degani emas edi. `BookReader` barcha bo‘limda ishlashi qalin nazariya tayyor degani emas.

## Bu branchda yaratilgan 13 ta yangi mualliflik bobi

| Mavzu | Yangi nazariya bloki | Asosiy manba |
|---|---:|---|
| M08.05 — Python shartlari | 31 | Fayziyeva va boshq. 9-sinf, IV bob, 76–81 |
| M08.06 — Python sikllari | 31 | 9-sinf IV bob, 82–90 |
| M08.07 — Python funksiyalari | 30 | 9-sinf IV bob, 91–98 |
| M11.01 — Veb va HTML | 26 | Cambridge+ 9-sinf, veb-sayt yaratish, 21-bob |
| M11.03 — HTML jadval va forma | 28 | Cambridge+ 9-sinf, 21-bob |
| M11.05 — CSS asoslari | 29 | Cambridge+ 9/10–11-sinf, veb |
| M15.04 — Dars turlari va rejalash | 32 | «Dars turlari» pedagogika konspekti |
| M15.03 — Tarbiya turlari | 28 | Mirzayeva 2-mavzu pedagogika konspekti |
| M09.06 — SQL SELECT/INSERT/UPDATE/DELETE | 36 | Cambridge+ 10–11-sinf, 9-bob (MBBT), original SQL misollar |
| M03.01 — Word hujjat interfeysi | 29 | Cambridge+ 9-sinf, matnli hujjat |
| M04.01 — Mantiq asoslari | 27 | Fayziyeva va boshq. 9-sinf, I bob |
| M04.02 — Mantiqiy amallar | 28 | Fayziyeva va boshq. 9-sinf, I bob |
| M04.03 — Rostlik jadvallari | 27 | Fayziyeva va boshq. 9-sinf, I bob |
| **Jami** | **382** | Fizik-bet 1:1 tasdig‘i haligacha ochiq |

Bu **yangi yozilgan original izohlar**. Kitoblardan katta hajmda so‘zma-so‘z nusxa olinmadi. Matnni ko‘paytirishning o‘zi to‘liqlik sertifikati emas.

## O‘quvchiga real ko‘rinishining farqi

- `src/data/topicContent.ts`: yuqoridagi 13 ta statik mavzu `goal`, `intro`, tabiiy `heading`, jadvallar, kod, masala va izohlardan iborat *birinchi* katta bob sifatida olinadi. Avvalgi nazariya va test savollari yo‘qotilmagan, o‘sha `BookReader` oxirida `Takrorlash` sifatida saqlangan.
- **M04 server-published yechimi:** `overlayPublishedProfessionalLesson()` ilgari statik uzun bobni to‘liq qisqa DB matniga almashtirardi. Endi faqat real `TASK-285` manbali M04.01/.02/.03 uchun avval yangi uzun bob, undan keyin e’lon qilingan server darsi ketma-ket ko‘rinadi. Synthetic/mock/remote-only M04 va M14/M16 yangilanmaydi. `published` flag, exam/scoring va backend permissions o‘zgarmaydi.
- M15 dagi avvalgi manbali eslatmalar mavjudligicha asosiy kitobda qoldi; yangi darslar ham eski material bilan birga o‘qiladi.

## Yopilmagan ishlar

1. **Qolgan barcha mavzular** — mavzular soni va kontent qamrovini `npm run theory:depth:audit -- --json` orqali tekshirish, so‘ng har mavzuga 5–11-sinf darsliklaridan to‘liq mualliflik matni yaratish. Hozir `M01` referens hajmi hamma uchun qaytarilmadi.
2. **Dalillar jadvali** — har mavzuning original darslik nashri, bob, bosma va fizik PDF sahifasi, rasm, formula, tushuncha, learner block va `verified/partial/unverified` holatini birma-bir ko‘rsatish. Bu branchda biror mavzu **page-verified** deb belgilangan emas.
3. **Authenticated route tekshiruvi** — M04/M06/M07/M13/M14/M16 published/UUID yo‘llarini real qurilma va backend bilan tekshirish. M04.01–.03 server-first bugi kod/test darajasida ko‘rib chiqildi, real production nashr qilinmadi.
4. **Vizual sifat** — mobile/desktop, formula, jadvallar, rasm va moslashuvchanlikni to‘liq ko‘rib chiqish; kod build smoke ishlab chiqarish ko‘rinishini sertifikatlamaydi.
5. **Savollar** — mavjud original bankga hech bir javob kaliti yoki test o‘zgartirish kiritilmadi; ishlab chiqarish bazasiga ham yozilmadi.

## Asosiy manbalar

- ICT 9, Fayziyeva et al. (2020): https://drive.google.com/file/d/1scsbz-Lgfy6_xAUrO_YVCfNE5KmV1qMe/view
- Cambridge+ 9 (2021): https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view
- Cambridge+ 10–11 (2021): https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view
- Dars turlari: https://drive.google.com/file/d/1L4PXxcviDgk5_iaOW5zLCG7536I6z0Ya/view
- Mirzayeva Pedagogika 2-mavzu: https://drive.google.com/file/d/1woZMas8dNbzk6yephzNH_XdmT19ess-l/view
- Kasb standarti: https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view

**Qisqa xulosa:** 382 ta *yangidan yozilgan* blok hamda published M04 source parity muammosi bo‘yicha kod yechimi tayyorlandi; ammo foydalanuvchi maqsadining to‘liq darslik qamrovi hali bajarilmadi. Bu cheklovni PR va keyingi hisobotlarda yashirmaslik kerak.

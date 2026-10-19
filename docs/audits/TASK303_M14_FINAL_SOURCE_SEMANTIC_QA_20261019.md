# TASK-303 — M14 7/7 nazariya va 140/140 savolning mustaqil AI auditorlik qaydi

**Ko‘rib chiqish:** 2026-10-19; **status:** AI-level educational/technical QA completed; **human independent approval:** NOT SIGNED; **publication:** BLOCKED; **production writes:** NONE.

## Tekshirilgan aynan shu manbalar

1. Foydalanuvchi yuborgan **«Pedagogning kasbiy standarti - qollanma.pdf»**, 13 sahifa. SHA-256 `404bf773e4fd6daea75a96a45543ddbe5be9f94d2cf7e711be7917bb2d95d9b2`; imzoli normativ birlamchi hujjat emas, @PedMahoratGuli metodik qayta bayoni.
2. Google Drive: [«Informatika Testlar spesifikatsiyasi.pdf»](https://drive.google.com/file/d/1jJstcqgFXwTJKuH9bkRIpvATEsjM2UnQ/view), 2026, IKT fan pedagoglari attestatsiyasi: 50 savol (35 ixtisoslik, **5 kasb standarti**, 10 pedagogik mahorat), 120 daqiqa, Y1/Y2/Y3, jami 100 ball; kasbiy standartdagi **7 kompetensiya**, vaziyatga tatbiq qilish.
3. [«Mediatsiya to‘g‘risida» O‘RQ-482](https://lex.uz/uz/docs/-3805227), xususan 4-, 7-, 8-, 9-moddalar: taraflar ixtiyoriy kelishadi, mediator xolis. Qonun sohasi maktabdagi barcha nizolarga avtomatik tatbiq qilinmaydi.
4. Supabase `plyqezulrfowyblsfpzy`dagi `published` KS savollari: individual 130 Y1 stem + to‘g‘ri variant matni, 8 Y2 ning har bir jufti, 2 Y3 ning to‘rtta bosqichi, `source_reference`, format/kognitiv metadata; barcha SELECT bilan o‘qildi. Distraktorlarning har biri uchun alohida inson sign-offi mavjud deb hisoblanmadi.

## Qo‘llanma → muallifiy konspekt sahifa izlari

| KS/mavzu | PDF fizik sahifa | Nazariya audit xulosasi | Muallifiy sintetik misol |
|---|---|---|---|
| KS.01 Rejalash | 2–3 | DTS/dastur, ehtiyojga moslash, fanlararo aloqalar, o‘lchanadigan natija, vaqt, AKT; 6/5/6 deb ajratilgan original bullet'lar yangi 6/5/5 umumlashgan elementga map qilingan | Shart operatori va avvalgi diagnostika |
| KS.02 Samaradorlik | 4–5 | Faol metod, loyiha, metakognitsiya, differensiallash, har bir bola ishtiroki, AKT; source bandlari semantik jihatdan guruhlangan, 1:1 so‘zma-so‘z ko‘chirilmadi | Bosqichli kod mashqi |
| KS.03 Baholash | 6–7 | Diagnostika, formativ, summativ manbada alohida; monitoring va qayta aloqa vazifasi farqlanadi | Excel havolasi xatosi |
| KS.04 Tarbiya | 8–9 | Muomala, qadr-qimmat, madaniy farq, bolaning tashabbusi, to‘garak/ekskursiya va tartib | Raqamli madaniyat |
| KS.05 Xavfsiz muhit | 10–11 | Teng imkoniyat, inklyuziya, jismoniy/psixologik/media xavfsizlik, 3 nizo yondashuvi | Masxarani to‘xtatish |
| KS.06 Kasbiy o‘sish | 12 | O‘zini tahlil qilish, uslubiy kengash, o‘zaro dars, seminar, yangi usulni amalda tekshirish | Dars vaqtini qayta baholash |
| KS.07 Hamkorlik | 13 | Ota-ona, hamkasb va mutaxassis ishtiroki, individual trayektoriya, muloqot | Rejalashtirilgan shaxsiy suhbat |

**Aniq topilgan manba tafovutlari:**
- PDF 1-betdagi tezkor reyestrda **05 = o‘sish, 06 = xavfsizlik**, lekin 10–12-betlardagi asosiy boblar hamda 2026 rasmiy attestatsiya spetsifikatsiyasi tartibi **05 = xavfsizlik, 06 = o‘sish**. Qo‘llanma boblari, 2026 spetsifikatsiya va platforma KS.05/KS.06 inobatga olindi.
- PDF 11-bet pedagogik «mediatsiya» izohida yakuniy qarorni vositachi qabul qilishi aytilgan; O‘RQ-482da esa huquqiy mediatsiya ixtiyoriy va yakuniy kelishuv **taraflarniki**. Qo‘shimchadagi yangi `exam` bloki PDFning aytganini ochiq qayd qilib, undan keyin qonunning mos qoidalarini alohida ko‘rsatadi.
- PDF muallifiy emas va yuridik kuchiga mustaqil rasmiy tasdiq topilmadi. Shu bois huquqiy normalar uning fikriga tenglashtirilmadi.

## Savollarning mavzu, kalit va format nazorati

- **KS.01–07**: 7×20=**140 published**; **130 Y1, 8 Y2, 2 Y3**; har bir nashr qilingan savol uchun `source_reference` va `source_lesson_id` mavjud. Kognitiv daraja (`bilish`, `qollash`, `mulohaza`) Y1/Y2/Y3 **formatidan alohida**, bu darajalar format bilan chalkashtirilmadi.
- 130/130 Y1 to‘g‘ri variant identifikatori real optionga ulanadi. 130 ta stem va kalit bilan bog‘langan javob matni birma-bir auditorlik ko‘rigidan o‘tkazildi: mavzu/didaktik ma’noga ochiq zid bo‘lgan javob aniqlanmadi; **barcha distraktorlar ham individual verifikatsiyalangan deb xulosa qilinmaydi**.
- 8/8 Y2 to‘rttadan key-value juftlik beradi; 7 tasida 4×`side=a` va 4×`side=b` mos. KS.03/Y2 **`fb83453d-1e42-4ac5-9ce2-864b24ceb022`**da to‘g‘ri semantik atamalar bor, lekin 8 variant **hammasi `side=a`**, right=0; learner matching UI uchun muhim funksional xato. Live published immutable. Alohida staging-only tuzatish skripti bor; avtomatik apply/production write yo‘q.
- 2/2 Y3: har bir to‘rtta bosqichdan iborat, ketma-ketlik semantik jihatdan izchil, payload IDs haqiqiy optionlarga mos.
- Bir xil so‘zli KS.03/Y2 stem `fb8345...` va `f35ce2...` o‘xshash: birinchisi «diagnostika/monitoring», ikkinchisi «diagnostik/formativ/summativ», **ayni bir savol emas**. Navbatdagi tahrirda ikkala stemni farqlash tavsiya etiladi.
- KS.02da jamoaviy ishda rollar, KS.03da feedback, KS.05da masxaralash, KS.06da «yangi metod → refleksiya» bo‘yicha o‘xshash vaziyatli Y1 stemlari bor. Bular yaroqsiz degani emas; **variant/semantik takror va diskriminatsiya**ni muharrir baholashi zarur.
- KS.03 «Monitoring nimani anglatadi?» qisqa matnli, bilish darajasida; kognitiv murakkablik bahosi va distractor validligi tahririy navbatda.
- `question_editorial_checks`: faqat **37/140** to‘liq flag, 103 tekshiruv uzilishi. Flaglar bitta `reviewer_id`ga tayangan; kimning inson tasdig‘i ekani alohida mustaqil tekshirilmagan. `ktd_quality.editorial_reviews`da KS uchun **0** imzoli yozuv.

## CI va xavfsizlik cheklovlari

- `src/data/topics/m14ProfessionalStandardGuide.ts` — o‘quvchi ilovaga ulanmagan, **review-only** manba, 7 ta mavzu × 12 ta typed block, source-PDF SHA+page; savol kalitlari kiritilmagan.
- Published core `src/data/topicContent.ts`, `professionalLessonTheory.ts`, real Supabase/DB yo‘llari qo‘l tegmagan: bu eski darsni avtomatik almashtirmaydi.
- `src/tests/M14ProfessionalStandardGuide.test.ts` mazmun tuzilishi, manba izlari va learners uchun qadimgi core o‘zgarmaganligini tekshiradi.
- `docs/audits/TASK303_KS03_Y2_DRAFT_REVISION_STAGING_ONLY.sql` faqat stagingda qo‘lda ishlatiladigan **draft** taklif; `supabase/migrations` chain’ida yo‘q. Zero production writes.
- GitHub CI green va branch/main sync holati alohida check bilan tasdiqlanadi. «Human editorial approval» belgisiga AI tomonidan yolg‘on tasdiq qo‘yilmaydi.

## Ochiq release cheklovi

Bu audit raqamli manbalar va ko‘rilgan savollar bo‘yicha AI tarafidan yakunlandi, ammo repo `AGENTS.md`/ADR-009 ga binoan yangi nazariya va savolni o‘quvchilarga **publish** qilish uchun inson mutaxassisning mas’uliyatli imzosi va real authenticated staging sinovlari kerak. Shuning uchun **faqat xavfsiz review artefaktlarini main'ga merge qilish mumkin**, learner sahifasini almashtirish yoki DB savolini arxivlash/publish qilish mumkin emas.

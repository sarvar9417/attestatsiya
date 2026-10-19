# TASK-303 — M14 «Pedagogning kasbiy standarti» nazariya va testlar auditi

**Holat:** REVIEW-ONLY / ekspert tasdig‘i, yakuniy CI va deploy sinovi ochiq.  
**Sana:** 2026-10-19. **Branch:** `task/TASK-303-m14-professional-standard-guide-qa`.  
**Production mutatsiyasi:** YO‘Q. **Published revision/answer key:** joyida O‘ZGARMAGAN.

## 1. Bosh manba va dalil chegarasi

Foydalanuvchi yuborgan `Pedagogning kasbiy standarti - qollanma.pdf`:
- 13 sahifa, umumta’lim pedagogi uchun metodik qo‘llanma;
- SHA-256: `404bf773e4fd6daea75a96a45543ddbe5be9f94d2cf7e711be7917bb2d95d9b2`;
- asosiy boblar: 1-soha PDF 2–3, 2-soha 4–5, 3-soha 6–7, 4-soha 8–9, 5-soha 10–11, 6-soha 12, 7-soha 13-bet.

**Manbaning o‘zi normativ-huquqiy asl hujjat deb tasdiqlanmagan** — metodik qayta bayon, imtihon uchun o‘quv manbasi; huquqiy kuchi haqida mustaqil tekshiruv kerak. PDF muqovasidagi dastlabki 05/06 kompetensiya sanog‘i bilan ichki boblarning 5/6 tartibi farq qiladi. Ushbu ishda **asosiy boblar** tartibi ishlatildi: 5 = xavfsiz ta’lim muhiti, 6 = kasbiy o‘sish. Oldingi kanonik KS.05/KS.06 shu ketma-ketlikda.

## 2. Nazariya: har bir sohaga bitta yaxlit bo‘lim

Yangi `src/data/topics/m14ProfessionalStandardGuide.ts` 7/7 darsga 12 tadan tiplangan `TheoryBlock` tayyorlaydi:
1. maqsad/kirish;
2. «Mehnat vazifalari» — PDFdagi yo‘nalishning amaliy harakatlari qayta bayon etiladi;
3. «Zarur ko‘nikmalar» — haqiqiy ko‘nikmalar vazifalardan alohida ajratiladi;
4. «Zarur bilimlar» — fan/didaktika/psixologiya/qonunchilik bilan bog‘liq bilimlar alohida;
5. manbadan emas, **muallifiy** informatika vaziyatiga asoslangan misol;
6. attestatsiyadagi sohalar/atamalar farqi;
7. tegishli PDF sahifasi va asl fayl SHA-256.

Oldingi ko‘rinishda DB `body_mdx`dagi qisqa nazariya + «to‘liq nazariya xaritasi» + frontendda eski M14 statik izohlar + `m14NormativeSourceAdditions` ketma-ket qo‘shilib, o‘xshash fikrlar ko‘p marta paydo bo‘lardi. Review-branchdagi `overlayPublishedProfessionalLesson` M14 uchun **bir xil, yagona o‘quv kitobi**ni tayyorlaydi; eski DB nusxalari **o‘chirilmaydi va tahrirlanmaydi**, sahifalash `BookReader`da ishlaydi. Mazkur o‘quv matnini learner uchun faol qilish **inson ekspertning alohida kontent tasdig‘idan keyin** mumkin (ADR-006, ADR-009, ADR-022 hamda AGENTS.md).

Tayyorlangan 7 konstrukt:
| Konstrukt | Soha | PDF sahifalari |
|---|---|---|
| KS.01 | O‘quv jarayonini rejalashtirish | 2–3 |
| KS.02 | Ta’lim samaradorligini ta’minlash | 4–5 |
| KS.03 | O‘zlashtirishni baholash va qayta aloqa | 6–7 |
| KS.04 | Tarbiyaviy faoliyatni tashkil etish | 8–9 |
| KS.05 | Xavfsiz rivojlantiruvchi muhit | 10–11 |
| KS.06 | O‘z-o‘zini rivojlantirish va kasbiy o‘sish | 12 |
| KS.07 | Hamkasblar va ota-onalar bilan hamkorlik | 13 |

## 3. Savollar: faqat real production SELECT, barcha 140 ta

Tekshirilgan loyiha: Supabase `plyqezulrfowyblsfpzy` (`attestatsiya100%`).

| Mezon | Aniqlangan holat |
|---|---:|
| Nashr qilingan KS savollari | 140 (7×20) |
| Formatlar | Y1=130, Y2=8, Y3=2 |
| `source_lesson_id` bilan bog‘langan | 140/140 |
| `source_reference` ko‘rsatilgan | 140/140 |
| Answer-key payload saqlangan | 140/140 |
| Har Y1da 4; Y2da 8; Y3da 4 variant | 140/140 |
| Bo‘sh yoki bitta savoldagi takroriy variant | 0 |
| To‘liq `question_editorial_checks` flaglari | **37/140** |
| `ktd_quality.editorial_reviews` flaglari | **0/140** |
| Manba/kattalar tasdig‘i ochiq | **103+** |

**37 ta flagning o‘zi mustaqil ekspert tasdig‘ining hujjatli isboti bo‘la olmaydi**: bitta reviewer_id bilan bog‘langan; inson imzosi, sahifa, javob va distraktor asoslari qayta tasdiqlanishi kerak. 103 ta savolda shu jadval bo‘yicha to‘liq flaglar yo‘q. Shuning uchun savol matni yoki javob kalitlarini avtomatik qayta nashr qilish mumkin emas.

### Muhim Y2 strukturaviy nosozlik

Savol `fb83453d-1e42-4ac5-9ce2-864b24ceb022`, KS.03, `Y2`:
- **8 ta variantning hammasi `side='a'`**, `side='b'` = 0;
- kalitdagi 4 ta juftlik strukturaviy mavjud, lekin javob taraflari noto‘g‘ri;
- yana bir KS.03/Y2 savol bilan **bir xil sarlavha**, ammo juftlanayotgan atamalar **boshqa**, shuning uchun ikkalasini bir xil savol deya o‘chirish xato;
- yangi immutable **`draft` reviziya** uchun `supabase/migrations/20261019200000_task303_m14_y2_draft_revision.sql` tayyorlandi: to‘g‘ri 4+4 taraf, aniqroq matn, yangi UUIDlar, yangi `question_keys` va `pedagogy_revision_queue` orqali review. Eski published savolga tegilmaydi;
- berilgan `draft` migratsiya **qo‘llanmagan**. Test preflight 20 savoldan 19 taga tushib ketmasligi uchun ishlab turgan savolni tekshirilgan replacement nashrisiz arxivlash **taqiqlanadi**.

Boshqa flag: `80a1409c-4f09-4b77-9148-c35f47d0e612` — «Monitoring nimani anglatadi?» savoli strukturaviy to‘g‘ri, lekin kontekst/ajratish kuchi alohida editorial review uchun belgilandi. To‘g‘ridan-to‘g‘ri archivlanmadi.

## 4. QA / tekshiruvlar

- `src/tests/M14ProfessionalStandardGuide.test.ts`: 7/7 PDF sahifasi, SHA, mehnat vazifalari → ko‘nikmalar → bilimlar tartibi, 3-soha baholash turlari, 5-soha arbitraj/muzokara/mediatsiya, yangi yagona kitob, published-status gate.
- `docs/audits/TASK303_M14_KS_140_QUESTION_AUDIT.sql`: productionda **faqat SELECT**, konstrukt/format, variant taraflari, duplikat matn, tahririy flag va manba metadata auditi.
- DBga yuborilgan read-only tekshiruvda Y2ni qayta tuzish formulasi: 8 ta noyob UUID, 4 left + 4 right, 4/4 kalitga mos; yangi draft UUID hali mavjud emas.
- So‘nggi GitHub CI va real mobil/desktop learner auth smoke **bu hisobot paytida tasdiqlanmagan**. README quality gate bo‘yicha tekshirilmaguncha DONE va release deb belgilamaslik kerak.

## 5. Chiqarish shartlari va forward fix

1. Mustaqil pedagogika eksperti 7 ta yangi o‘quv bobidagi har bir talab, farqlash va misolni PDF sahifasi bilan tasdiqlaydi. Metodik qo‘llanmadagi kamchiliklar o‘zboshimchalik bilan rasmiy norma deb o‘zgartirilmaydi.
2. 140 ta savol uchun stem + 4/8 variant + correct key + distractor + source page alohida editorial ro‘yxat. 103 ta gapsiz flaglarga yangi inson tekshiruvi.
3. Xatoli KS.03/Y2 savolga yangi draftni stagingda sinash; kalitni expert tasdiqlagach bir tranzaksiyada replacement publish + oldini archive, 20/20 published pool saqlanadi.
4. Barcha 7 mavzuni authenticated mobile/desktop BookReader bilan ochib, dars ketma-ketligi, to‘liq matn va yangi test preflightni tekshirish.
5. PR CI, lint/typecheck/tests va project ADR-022 mosligi nazoratidan keyin alohida **merge** va **deploy** qarori. Hozir productionda hech narsa o‘zgarmagan.

**Rollback/forward fix:** draft migration hali ishlatilmagani sabab DB rollback kerak emas. Agar keyinchalik stagingda qo‘llansa, faqat yangi draftning queue/key/options/question yozuvlarini unga bog‘liq foreign keylardan boshlab chiqarish mumkin; published manba savoli saqlanadi. Learnerga nashr qilingan yangi revisionni joyida qayta tahrirlash taqiqlanadi.

# TASK-273 — Darslik nazariyasi to‘liqligi: aniqlangan bo‘shliqlar va birinchi tuzatish

Sana: 2026-10-19. Status: **PARTIAL / EDITORIAL OPEN**. Branch: `task/TASK-273-pedagogy-theory-depth-20261019`.

## Nima sababdan oldingi natija yetarli emas?

TASK-262 faqat `BookReader` orqali yagona ko‘rinish berdi. Nazariya matnlarini Drive PDF darsliklari bilan **betma-bet solishtirmadi**. Dizaynning barcha mavzularda mavjudligi manba qamrovi yoki nazariyaning to‘liqligini anglatmaydi.

`src/data/topicContent.ts`dagi M15 statik yadro darslari: M15.01=4 blok, M15.02=5, M15.03=4, M15.04=6, M15.05=4, M15.06=4, M15.07=4, M15.08=6. `src/data/pedagogyStudyNotes.ts`da o‘sha mavzularga qo‘shimcha 11, 11, 10, 10, 10, 10, 12, 5 blok bor edi; ular dastlab faqat asosiy `BookReader`dan **keyingi yopiq** bo‘limda chiqardi.

### Shu branch’dagi konkret tuzatish

- Barcha **M15.01–M15.08** o‘quv mavzularida mavjud manbali konspekt bloklarini asosiy nazariyaga, avvalgi bloklardan **keyin** qo‘shdik. Hech bir original blok, javob kaliti yoki mavzu o‘chirilmaydi.
- Mavjud didaktik misollar, taqqoslash jadvallari, manba izlari endi boshqa yopiq bo‘limga o‘tishni talab qilmay, `BookReader` mundarijasi va progressiga kiradi.
- Pedagogika konspekti bo‘yicha ikki karra render oldi olindi (pastdagi eski accordion olib tashlandi).
- 8/8 mavzuning bloklari birorta ham tushib qolmasligi uchun regression test qo‘shildi.
- M15.01 chuqurroq bo‘lishi uchun Mirzayeva 2-mavzu matnidan pedagogika fanlari tizimi, ilmiy-pedagogik tadqiqot metodlari (suhbat va intervyu alohida), jadval, metodika/didaktika chegarasi, tadqiqot vaziyati va manba izi bo‘yicha **8 ta yangi original nazariya bloki** yozildi. Endi M15.01 avvalgi 4 yadro + mavjud 11 note + yangi 8 blokni (jami 23 blok) qamrab oladi.
- **Bu baribir kitoblardagi barcha bob va sahifalar to‘liq kiritildi degani emas.**

## Manba yo‘li / aniqlangan holat

| Yo‘nalish | Dalil | Keyingi ish |
|---|---|---|
| M01 | `src/data/topics/m01.ts` va `m01TextbookAudit*` registrlari; qo‘llanma va sinf darsliklari tanlanma auditlari | 13 kitobdagi aniq bob va sahifa bo‘yicha 1:1 qamrov |
| M02 | 4 kanonik dars + `src/data/topics/m02SourceTheory.ts`; `docs/TASK243_M02_SOURCE_AND_DESIGN_AUDIT_20261019.md` | 13 kitobning M02ga mos sahifalari; ixtiyoriy qo‘shimchalarni manba tekshiruvidan keyin birlashtirish |
| M03–M13 | Qisqa statik `topicContent.ts` konspektlari va bir qator alohida **published** dars migratsiyalari | Amaldagi published darsni birma-bir PDF bo‘limi bilan solishtirish; faqat fallback hajmini o‘lchab hukm qilmaslik |
| M14 | 7 kasb standarti mavzusi; `docs/TASK247_PEDAGOGY_18_TOPIC_SOURCE_MATRIX.md` | Original normativning amaldagi variantidan sohalar va bandlar; xususan 5/6 soha tafovuti |
| M15 | 8 qisqa yadro va ilgari yashirin 8 manbaga asoslangan notes to‘plami | Eshitma/konspekt emas, original darslikning jismoniy PDF sahifalari asosida barcha kompetensiyalar va sxemalarni audit qilish |
| M16 | 3 mavzu, qisqa statik nazariya; `TASK247` matritsasida nomi aniqlanmagan informatika metodikasi manbai | Aniq kitob nashri, metodika konseptlari va bet lokatorlarini yig‘ish |

### Real Drive manbalari

- Barnoyevak, pedagogika korpusi: https://drive.google.com/drive/folders/1XryoV_toq5QDVfLBxhKnsa-jwbcmk-KS
- Xoliqov «Pedagogik mahorat», I bob: https://drive.google.com/file/d/1lPKtFtuZOhS_3zpQvVFPHMAWX5gLtzUj/view
- «Mirzayeva Pedagogika nazriyasi qollanma 2-mavzu.pdf»: https://drive.google.com/file/d/1woZMas8dNbzk6yephzNH_XdmT19ess-l/view
- Sarvar, Cambridge+ 5-sinf: https://drive.google.com/file/d/1jiQYB3WiZ387MhjbSwUMO1xcDcIvbB1m/view
- Sarvar, umumlashtirilgan 52 boblik struktura: https://docs.google.com/document/d/1Yr8pDNvIPHmJgaULD7Z-1K8HQi5zqm6Hbx77z6JBuHw/edit

Mirzayeva materialining o‘qiladigan matni pedagogika obyekti, predmeti, analitik/prognostik/tashkiliy/metodologik vazifalari va tadqiqot metodlarini o‘z ichiga oladi. Xoliqov I bob pedagogik mahoratning 4 tayanch komponentini tushuntiradi. Bu manbalarning o‘qiladigan parchalari ko‘rildi, lekin fizik sahifalar va rasmlar bo‘yicha yakuniy ekspert qabul **yo‘q**. Cambridge+ materiallari huquq bilan himoyalangan; maqsad kitobdan so‘zma-so‘z katta ko‘chirma qilish emas, dalilga asoslangan original ta’limiy bayon tuzish.

## Yakuniy sifat mezoni (hali bajarilmagan)

Har bir mavzu uchun: `lesson_id`, konstrukt, darslik-nashr, bob, bosma sahifa, PDF sahifa, manbadagi atama/diagramma/jadval/tajriba, asosiy nazariyadagi tegishli blok, qamrov natijasi `verified/partial/gap/unverified`, ekspert tekshirgan sana. Manbaga zid umumlashtirish va mos kelmagan bob `gap` yoki `unverified` bo‘lsin. 100% ta’kidi faqat 1:1 manba qamrovi va barcha qabul testlaridan keyin mumkin.

Serverdagi published darslar, production DB, exam generator, server-answer keys, deploy o‘zgartirilmasin. Ish faqat branch/PRda; tegishli sahifa-bet auditi va ekspert tasdig‘isiz release qilinmaydi.

### Mirzayeva 2-mavzu PDF matni bilan qayta tekshiruv (2026-10-19)

Original Drive faylidan matn qayta olindi. «PEDAGOGIK TADQIQOT METODLARI» ro‘yxatida **suhbat (2)** va **intervyu (4)** alohida nomlangan; oldingi nazariya jadvali ikkisini yagona satrda berib, darslikdagi farqni yashirgan. Endi ularning vazifalari alohida bayon qilindi. Matnda ko‘rinadigan raqamlar **1–8 va 10**, 9-band ko‘rinmaydi; «10 metodning barchasi tasdiqlandi» degan xulosa chiqarilmaydi. Matn ekstraksiyasi to‘liq tasvirli PDF sahifasining ekspert tekshiruvi emas. Ushbu nomuvofiqlik M15.01 source-note va regressiya bilan ochiq qayd qilindi.

### Xoliqov I bob original manbasining mustaqil qayta tekshiruvi (2026-10-19)

Barnoyevak Drive’dagi `1lPKtFtuZOhS_3zpQvVFPHMAWX5gLtzUj` faylining 1-bob matni qayta olindi. Pedagogik mahorat tizimining 4 asosiy komponenti alohida yozilgan: **pedagogik insonparvarlik**, **kasbga oid fanlararo bilim**, **pedagogik qobiliyat**, **pedagogik texnika**. M15.01 konspektidagi to‘rtta tayanch shu asl bobning matniga mazmunan mos. Mustaqil PDF sahifa-tasvirni tekshirish va butun M15 korpusining darslik qamrovi hali ochiq, bu tekshiruv faqat aniq 4 komponent manbasiga taalluqli.

## 2026-10-19 — yangi nazariya bloklarining joriy qamrovi

**Holat:** Kod va source izlari tayyor, final verified emas. Har bir bayon mualliflik izohi; litsenziyali darslikning to‘liq matni ko‘chirilmadi.

| Modul | Yangilangan mavzular | Yangi nazariya bloklari | Ishchi manbalar |
|---|---:|---:|---|
| M03 — Word, Excel, PowerPoint | 10 | 50 | Cambridge+ 9, 10–11 |
| M08 — Python va JavaScript | 12 | 70 | Milliy ICT9 (2020), Cambridge+ 10–11 |
| M09 — Access, SQL, SI | 7 | 36 | Cambridge+ 9, 10–11 |
| M10 — Grafika va multimedia | 7 | 36 | Cambridge+ 9, 10–11 |
| M11 — HTML va CSS | 7 | 35 | Cambridge+ 9, 10–11 |
| M12 — Tarmoqlar va IoT | 9 | 46 | Cambridge+ 9, 10–11 |
| M13 — Xavfsizlik va raqamli madaniyat | 11 | 55 | Milliy ICT8 (2020), Cambridge+ |
| M14 — Kasb standarti | 7 | 35 | Kasb-standarti.pdf |
| M15 — Pedagogika | 3 ta yangi matn, 8 ta yangi reader holati | 26 | Mirzayeva, Dars turlari, Qodirova/Pulatova |
| M16 — Informatika metodikasi | 3 | 26 | Kasb standarti, Cambridge+ 5 |
| **Jami** | **76 ta mavzuga yangi blok; 81 ta turli mavzuga reader/kontent o‘zgarishi** | **415** | **Sahifama-sahifa ekspert tasdiqlash ochiq** |

M15ning 8/8 mavzularida avvaldan yozilgan source-notelar endi kitobning asosiy navbatida ko‘rsatiladi. Ular 415 ta **yangi** blok sanog‘iga kiritilmagan. M03/M08/M09/M10/M11/M12/M13/M14/M16 hamda M15 uchun qo‘shimcha regressiyalar mavjud.

### Ishlayotgan bazaning read-only inventari

`docs/audits/TASK273_PUBLISHED_98_LESSON_SOURCE_TRIAGE_20261019.md`:
- 98 ta published dars yozuvi, 12 ta bo‘sh M01 body_mdx (alohida statik M01 nazariyasi mavjud).
- 35 ta 2 000 belgidan qisqa published `body_mdx`; ba’zilari static boshqa kitob bilan qoplanadi. Qisqa matn tekshiruv ustuvorligi, xatolikning o‘zi emas.
- M15 8 ta published darsda nazariya / optional supplement chegarasi mavjud.
- Production bazaga faqat SELECT bajarildi; hech bir lesson, savol yoki schema o‘zgartirilmagan.

### Ochiq release/editorial shartlari

**Bu hali butun platforma uchun «darsliklardagidek 100% to‘liq» holat emas.** M01, M02, M04–M07 mavzularida alohida kitob/published manba qatlamlari bor, lekin 5–11-sinflarning barcha bosma/PDF sahifalari bilan global 1:1 konkordans tasdiqlanmagan. M03/M08–M16 yangi izohlarining ham sahifa lokatorlari va har bir rasm, formula, jadval va misoli mustaqil tekshiruvdan o‘tishi lozim.

Qabul uchun har bir mavzuda `construct_id`, kitob nashri/yili, bosma bet, fizik PDF bet, bayon qilingan teorema/formula/rasm, web lesson blok identifikatori, `verified/partial/gap` qarori va mas’ul tasdiq kerak. Barcha modullar uchun real brauzer/mobil va Y1/Y2/Y3 test savollaridagi o‘quv konstruktlari bilan to‘liq moslik alohida tekshiriladi.

Test kalitlari, imtihon banki, published DB revision, prod deploy va migration fayllari o‘zgartirilmadi. PR DRAFT, editorial qabul va final CI natijasidan oldin merge/deploy qilinmaydi.

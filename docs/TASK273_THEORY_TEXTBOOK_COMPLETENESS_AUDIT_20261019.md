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
- M15.01 chuqurroq bo‘lishi uchun Mirzayeva 2-mavzu matnidan pedagogika fanlari tizimi, sakkiz guruh ilmiy-tadqiqot metodlari, jadval, metodika/didaktika chegarasi, tadqiqot vaziyati va manba izi bo‘yicha **8 ta yangi original nazariya bloki** yozildi. Endi M15.01 avvalgi 4 yadro + mavjud 11 note + yangi 8 blokni (jami 23 blok) qamrab oladi.
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

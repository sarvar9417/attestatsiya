# TASK-530 — PedMahoratGuli test banki: yakuniy ekspert saralash

> Ish productionda TASK-428 yorlig‘i bilan boshlangan. `main`dagi parallel TASK-428 sabab repository koordinatsiyasi TASK-530ga o‘tkazildi; avval qo‘llangan migration va source-reference yorliqlari audit tarixini saqlash uchun o‘zgartirilmadi.

## Yakuniy qamrov

Telegram eksportidagi 429 ta noyob, qalin variant bilan belgilangan xabar to‘liq ko‘rib chiqildi.

| Boshlang‘ich toifa | Soni | Yakuniy qaror |
|---|---:|---|
| Bazada source mavjud | 37 | Mavjud lineage saqlandi |
| Kontent aynan takror | 18 | Qayta nashr qilinmadi |
| Stem o‘xshash/review | 16 | Mavjud revision jarayonida qamralgan |
| Yangi kandidat | 358 | 309 bazada ifodalandi, 49 sabab bilan rad etildi |
| **Jami** | **429** | **0 ta qarorsiz qoldi** |

358 yangi kandidatning production holati:

- 309 ta manba faol savol lineage’i bilan bazada ifodalangan;
- 290 tasi `task428:expert-rewrite` partiyalari;
- 16 tasi avvalgi `task421:expert-rewrite` lineage’i;
- 3 tasi boshqa mavjud source lineage’i;
- 49 tasi ekspertiza sababli nashr qilinmagan;
- 0 ta kandidat qarorsiz qolgan.

## Partiyalar

| Partiya | Yangi savol | Yo‘nalish |
|---|---:|---|
| batch 02 | 22 | KS vaziyatlari, metodlar va Bloom |
| batch 03 | 21 | Kasbiy standart, nutq va metodlar |
| batch 04 | 19 | Nazorat, tekshirish va baholash |
| batch 05 | 20 | Pedagogik texnika va qobiliyat |
| batch 06 | 30 | Umumiy pedagogika, didaktika va ta’lim shakllari |
| batch 07 | 30 | Kompetentlik, refleksiya, etika va qobiliyat |
| batch 08 | 30 | Muloqot, pedagogik takt va nizolar |
| batch 09 | 30 | Pedagogik mahorat, didaktika va metodlar |
| batch 10 | 30 | Kasbiy standartning yetti kompetensiya sohasi |
| batch 11 | 30 | Dars tahlili, tadqiqot metodlari va Bloom |
| batch 12 | 28 | Yakuniy yuqori ishonchli kandidatlari |
| **Jami** | **290** | **Barchasi additive expert rewrite** |

Batch 06–12 ushbu branchda 208 ta yangi savol qo‘shdi. Har partiya productionda avval `BEGIN … ROLLBACK` rehearsal orqali tekshirildi, keyin aynan shu SQL migration sifatida qo‘llandi.

## Sifat va xavfsizlik mezonlari

- Telegramdagi belgilangan variant mustaqil javob authority sifatida qabul qilinmadi; kalit mazmun bo‘yicha qayta tekshirildi.
- Har savolda to‘rtta noyob variant, bitta mavjud kalit, izoh, canonical construct va published lesson mavjud.
- Variant uzunligi va semantik signal gate’lari, active exact-stem duplicate, owner waiver va immutable publication snapshot tekshirildi.
- Source key xato bo‘lgan, lekin mazmuni yaroqli savollar faqat to‘g‘ri kalit va ekspert izohi bilan qayta yozildi.
- Eski published savollar, `question_keys`, tarixiy `exam_items` va attemptlar joyida o‘zgartirilmadi.
- Provenance owner-authorized AI ekspert tahriri sifatida rost qayd etildi; mustaqil inson eksperti tasdig‘i da’vo qilinmadi.

## Nashr qilinmagan 49 xabar

| Sabab | Soni | Telegram message IDlari |
|---|---:|---|
| Dublikat yoki mazmuni bazada qamralgan | 14 | 632, 657, 659, 795, 796, 797, 1450, 1559, 1572, 2185, 2486, 2487, 2722, 3113 |
| Premise/moslashtirish ustunlari yo‘q | 7 | 1260, 1350, 2260, 2404, 2684, 2685, 2687 |
| Xato, noaniq yoki ishonchli tasdiqlanmagan | 25 | 514, 664, 673, 739, 785, 863, 1033, 1036, 1112, 1115, 1214, 1488, 1575, 1888, 2174, 2242, 2243, 2244, 2245, 2246, 2247, 2480, 2688, 2689, 2696 |
| Versiyasiz/eskirishi mumkin bo‘lgan normativ mazmun | 3 | 1443, 1445, 1447 |

Mashina o‘qiydigan qaror reyestri: `docs/quality/task530_pedguli_adjudication.json`. Regression testi 429 inventar yig‘indisini, 358 yangi kandidatning 309+49+0 taqsimotini, 49 rad javobining yagona qaydini va batch 06–12dagi 208 source IDni tekshiradi.

## Release holati

- Supabase production data migrationlari qo‘llandi.
- GitHub `main` merge yakuniy CI’dan keyin bajariladi.
- Vercel/application deploy bajarilmaydi.

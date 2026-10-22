# TASK-530 — PedMahoratGuli to‘liq test banki: ekspert saralash holati

> Repository koordinatsiyasi: ish productionda TASK-428 yorlig‘i bilan boshlangan. Shu vaqt oralig‘ida `main`ga boshqa informatika TASK-428 merge bo‘lgani uchun ushbu ishning repository task raqami TASK-530ga o‘tkazildi. Qo‘llangan migration nomlari audit tarixini saqlash uchun o‘zgartirilmagan.

## Joriy natija

`result.json`dan ajratilgan 429 ta noyob kalitli xabar ustida to‘liq inventar asosida ishlanmoqda. Ushbu release to‘rtta yangi partiyani va avvalgi ikki `review` savolini qamrab oldi:

- 82 ta yangi, additive UUIDli ekspert-rewrite savol;
- 2 ta oldingi `review` savoli yakuniy tekshirilib nashr qilindi;
- 82 ta yangi manbaning barchasi productionda faol `published` reviziya bilan ifodalangan;
- parallel immutable sifat jarayoni 11 ta manba reviziyasini yanada aniqlashtirilgan vorisga almashtirgan: 71 tasi bevosita published, 11 tasi archived source + published successor;
- 82/82 faol reviziyada 4 ta variant va ishlaydigan yagona kalit mavjud;
- eski published savol, `question_keys`, `exam_items` va attemptlar joyida o‘zgartirilmadi.

## Partiyalar

| Partiya | Yangi | Qo‘shimcha release | Yo‘nalish |
|---|---:|---:|---|
| batch 02 | 22 | 2 review | KS vaziyatlari, metodlar va Blum |
| batch 03 | 21 | 0 | kasbiy standart, nutq va metodlar |
| batch 04 | 19 | 0 | nazorat, tekshirish va baholash |
| batch 05 | 20 | 0 | pedagogik texnika va qobiliyat |

Har partiya production sxemasida avval `BEGIN … ROLLBACK` bilan rehearsal qilindi. So‘ng aynan tekshirilgan SQL Supabase migration sifatida qo‘llandi. Har savol uchun canonical construct/lesson, 4 ta noyob variant, bitta mavjud kalit, production uzunlik-bias gate, active exact-stem duplicate, owner waiver va immutable publication snapshot tekshirildi.

## Tahririy qarorlar

- Telegramdagi qalin/belgilangan variant mustaqil javob authority sifatida qabul qilinmadi.
- Imlo, noaniq kontekst va javobni oshkor qiluvchi iboralar qayta yozildi.
- `2058` kabi bazada voris reviziyasi mavjud xabar qayta kiritilmadi.
- Premisasi yo‘q `Moslashtiring` xabarlari, xato kalitli yoki atamaviy chegarasi bahsli savollar nashrga qo‘yilmadi.
- AI-assisted owner-authorized provenance rost qayd etildi; mustaqil inson eksperti tasdig‘i da’vo qilinmadi.

## Migratsiyalar va regressiya

- `20261022031000_task428_pedguli_verified_batch02.sql`
- `20261022032000_task428_pedguli_verified_batch03.sql`
- `20261022033000_task428_pedguli_verified_batch04.sql`
- `20261022034000_task428_pedguli_verified_batch05.sql`
- `task428PedguliBatch02.test.ts`
- `task428PedguliBatch03.test.ts`
- `task428PedguliBatch04.test.ts`
- `task428PedguliBatch05.test.ts`

## Davom etayotgan scope

429 inventarning qolgan yangi kandidatlari keyingi atomar partiyalarda shu mezon bilan ko‘rib chiqiladi. “Barcha testlar” sharti har bir xabarni ko‘r-ko‘rona nashr qilish deb talqin qilinmaydi: dublikat, sharti yetishmaydigan yoki yagona javobi kafolatlanmaydigan xabar sabab bilan rad etiladi; yaroqli savol esa ekspert-rewrite ko‘rinishida bazaga kiritiladi.

Vercel/application deploy bajarilmadi.

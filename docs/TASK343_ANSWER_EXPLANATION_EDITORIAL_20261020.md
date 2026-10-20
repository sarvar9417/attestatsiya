# TASK-343 — Javob izohini manba belgisidan pedagogik tushuntirishga almashtirish

## Audit (2026-10-20, production READ ONLY)

8 025 keyed savol ko‘rildi. 140 ta pedagogika savolida `question_keys.explanation_md` faqat Telegram'dagi ekspert ✅/✔ kalitini bayon qiladi; real mavzu izohi yo‘q:
- 84 **published** (9 savol tarixiy imtihonlarda ishlatilgan);
- 56 **review**;
- hammasi Y1; asosiy guruh PM.GEN, qisman KS.
- `telegram:@PedMahoratGuli:4843` published savol «suratda» metod so‘raydi, `assets=[]`: rasm taqdim etilmaguncha uning key/rationale'ini ishonchli tasdiqlab bo‘lmaydi. `4842` review ham rasmsiz.

Bu sanash boshqa 7 885 savolning barcha izohlari mukammalligini isbotlamaydi. 2 490 ta izoh 65 belgidan qisqa — keyingi **semantik** tekshiruv signali, avtomatik xato degani emas.

## Tuzatish qoidasi

Foydalanuvchiga ko‘rinadigan `explanation_md` to‘g‘ri javobning **nega to‘g‘ri**ligini, muhim farqlash mezonini va zarur bo‘lsa distractor xatosini tushuntiradi. Telegram belgilari, PDF sahifasi, muallif, bibliografiya esa `source_reference` / editorial evidence qatlamida qoladi. Faqat javobni takrorlash yoki "kanalda ✅ belgisi bor" yozish izoh emas.

Yangi `question_explanation_is_source_only(text)` va status publish-triggeri manba/emoji-only izoh bilan yangi nashrni bloklaydi. Mavjud published materiallar o‘zgarmaydi — ular immutable. `task343_explanation_source_only_readonly.sql` hisob va ID navbati uchun, keylarni eksport qilmaydi.

## Namuna: pedagogik takt

- Source: `telegram:@PedMahoratGuli:14305`, old published UUID `55e95e8e-57d2-4f9d-afd4-b4ebd3bf904c`.
- Ma’no: pedagogik takt — talabchanlik va hurmat muvozanati, o‘quvchini kamsitmasdan xatoni tuzatish.
- Boshqa variantlar: emotsional ko‘mak, didaktik faollashtirish va mimika/imo-ishoralar — o‘zaro bog‘liq, ammo alohida kompetensiyalar.
- Maxsus `task343_pedagogic_tact_immutable_revision_AFTER_APPROVAL.sql`: bosqichma-bosqich yangi review revision → ta’limiy izoh → amaldagi owner-release mexanizmi → atomic published-new/archived-old. Tarixiy keys/options/o‘zgarmas savol saqlanadi.

**Status:** Source-only publish quality-gate va regressiya kod bilan tayyorlangan. `AFTER_APPROVAL` maintenance fayli productionga avtomatik deploy qilinmaydi. 140 ta savol uchun alohida individual didaktik matnlar va semantik tekshiruv yetkazilmasdan "140/140 tuzatildi" deyish mumkin emas. Ularni ommaviy avtomatik ravishda javobni takrorlovchi matnga aylantirish taqiqlanadi.

## Acceptance va test

1. 2 xil Telegram/✅ izohi va bo‘sh izoh reject;
2. haqiqiy pedagogik tushuntirish va asoslangan manba bilan birga kelgan hisob-kitob izohi pass;
3. status publish qorovuli nashrdagi mavjud savol/historic attemptni o‘zgartirmaydi;
4. owner-approvalli bitta namuna revision test bazada ROLLBACK dry-run orqali tekshirilsin, so‘ng alohida production release qarori;
5. qolgan 139 ta savol uchun savol/variant/keyga mos xususiy editorial izoh, rasmga bog‘liq savollar uchun asset-gate, immutable revizion va postflight.

**Chegara:** Human/external reviewer imzosi soxtalashtirilmaydi. Xususiy savol matnlari/kalitlar public Gitga joylanmaydi. Vercel deploy yo‘q.

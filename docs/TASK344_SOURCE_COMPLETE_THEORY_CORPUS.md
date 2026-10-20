# TASK-344 — Learner nazariyalarini yagona kitob korpusiga keltirish

Sana: 2026-10-20  
Branch: `task/TASK-344-source-complete-theory-corpus`  
Release: **merge, deploy va production DB write bajarilmadi**

## Natija

Learner katalogi `contentTree` orqali tekshirildi: 115 ko‘rinadigan mavzu,
shundan 110 bob va 5 ma’lumotnoma-ilova. Eski auditdagi M02.05–M02.09
migratsion yozuvlar learner mavzusi sifatida qayta sanalmaydi.

- 110/110 bob kitob mezonidan o‘tadi;
- 5 ilova bob mezonidan alohida baholanadi;
- mavjud test ID, variant, `correctIndex` va kognitiv teglar o‘zgarmadi;
- oldingi source-audit bloklari obyekt tartibi bilan saqlandi;
- katta darslik matni so‘zma-so‘z ko‘chirilmadi.

## Yangi to‘liq boblar

M04.01–M04.06 mantiq, rostlik jadvali, sxema, masala yechish va model
mavzulari ICT 9-sinfning I–II boblari bilan; M06.01–M06.04 algoritm
mavzulari ICT 9-sinfning III bobi bilan; M07.01–M07.05 Scratch mavzulari
ICT 5–6-sinf bilan; M07.06 LOGO/Toshbaqa grafika Cambridge yo‘nalishi
9-sinf manbasi bilan qayta bayon qilindi.

Har yangi bobda maqsad, kirish, tayanch atamalar, 5–6 mavzuli bo‘lim,
ishlangan misol, xato ogohlantirishi, mustaqil mashq, javob, xulosa va
aniq manba izi mavjud.

## Oldingi manbaviy boblarni birlashtirish

M02, M08, M09, M12.06–09, M13, M14 va M16 dagi qisqa, lekin oldin
tekshirilgan source bloklar oldiga yagona o‘quv yo‘li qo‘shildi. U avval
maqsad va atamalarni beradi, so‘ng tushunchalar bog‘lanishi, qo‘llash
tartibi, mavjud test izohlaridan ishlangan misollar, mustaqil mashqlar,
javob va xulosaga olib boradi. Oldingi nazariya bloklari ko‘chirilmaydi,
qisqartirilmaydi va joyidan olinmaydi; ular yangi o‘quv yo‘lidan keyin
to‘liq saqlanadi.

M05 sanoq sistemalari allaqachon 9/14/21 bo‘limli chuqur kitob bo‘lgani
uchun uning sahifa ankarlari o‘zgartirilmadi. Faqat mustaqil mashq,
javob kaliti va manba izi qo‘shildi.

## Avtomatik sifat darvozasi

`npm run theory:learner:audit` faqat learner-visible daraxtni tekshiradi.
Standart self-study bob kamida 5 sarlavha, 2 ishlangan misol/case, mustaqil
mashq, javob va manba iziga ega bo‘lishi kerak. M01.02–08 avvaldan yaratilgan
katta manbaviy monografiya kontrakti bilan alohida tan olinadi; M01 ilovalari
bob sifatida sun’iy ravishda kattalashtirilmaydi.

Yakuniy lokal natija:

| Ko‘rsatkich | Natija |
|---|---:|
| Learner topic | 115 |
| Bob | 110 |
| Ilova | 5 |
| Kitob mezonidan o‘tgan bob | 110 |
| Tugallanmagan bob | 0 |

## Tekshiruv

- `npm run lint` — PASS
- `npm run typecheck` — PASS
- `npm run theory:learner:audit` — 110/110 PASS
- `npm test` — 173 fayl, 1113 test PASS
- `npm run build` va client answer-key bundle scan — PASS

Bu natija statik/canonical learner nazariyasiga tegishli. Autentifikatsiyadan
keyin serverdan keladigan UUID lesson reviziyalari va production vizual E2E
ushbu branchda o‘zgartirilmagan va alohida release nazoratida qoladi.

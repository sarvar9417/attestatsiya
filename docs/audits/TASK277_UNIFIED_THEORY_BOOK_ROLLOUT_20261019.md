# TASK-277 — nazariyalarni yagona kitob shakliga keltirish auditi

**Sana:** 2026-10-19  
**Branch:** task/TASK-277-unified-theory-book  
**Release:** merge authorized — deploy va production DB yozuvi taqiqlangan

## Yakuniy hukm

Nazariya vizual komponent darajasida avvaldan umumiy BookReader/BookBlock
orqali ko‘rsatilgan. Ildiz muammo ikki qismdan iborat edi:

1. sahifalash source maydoni bor-yo‘qligiga bog‘langan; manbasi ko‘rsatilgan,
   ammo bir sarlavhali 10+ blok dars ham bitta uzun sahifada qolishi mumkin edi;
2. 121 statik/offlayn mavzuning chuqurligi keskin notekis: dastlab 97 brief,
   6 partial, 18 substantial candidate.

TASK-277 birinchi muammoni **barcha informatika va pedagogika nazariyalari
uchun global darajada** yopdi. Yakuniy reconciliationda uch PowerPoint bobi
`main`dagi TASK-289, ikki pedagogika bobi esa undan ham yangi TASK-290
kitoblari bilan saqlandi; TASK-277 ularning barchasiga yagona sahifalash
kontraktini beradi. Qolgan 93 brief
mavzu hali alohida mazmuniy tahrir talab qiladi; “barcha darsliklar
sahifama-sahifa to‘liq qamrab olindi” degan da’vo tasdiqlanmaydi.

## Yagona o‘qish kontrakti

splitBalancedSections endi barcha darsga bir xil qoida qo‘llaydi:

- muallif heading bloklari semantik bo‘lim chegarasi bo‘lib qoladi;
- uzun bo‘lim ko‘pi bilan 4 blok yoki 4200 belgi bo‘yicha davom sahifalariga
  ajraladi;
- juda katta bitta jadval yoki blok sun’iy kesilmaydi;
- blok qo‘shilmaydi, o‘chmaydi va qayta tartiblanmaydi;
- sarlavhasiz eski darslar ham shu kontrakt bilan sahifalanadi;
- davom sahifasida vizual sarlavha beriladi;
- mavzu almashganda eski yuqori indeks yangi qisqa darsda xato bermaydi.

## Boyitilgan informatika boblari

| ID | Bob | Blok | Belgi | Bo‘lim | Mashq | Daraja |
|---|---|---:|---:|---:|---:|---|
| M03.08 | PowerPoint interfeysi va dizayni | 71 | 10 079 | 13 | 12 | partial |
| M03.09 | PowerPoint obyektlari va multimedia | 71 | 9 973 | 13 | 12 | partial |
| M03.10 | Animatsiya va o‘tish effektlari | 71 | 10 156 | 13 | 12 | substantial candidate |

Har bobda maqsad, tushuncha, jadval, ishlangan vaziyat, xato, amaliy QA,
mashq, yopiq javob, xulosa va manba izi bor. Mavjud 4 tadan test savolining
IDsi va kalitlari o‘zgartirilmadi.

Manbalar: 6-sinf “Informatika va axborot texnologiyalari” (2021),
27–32-darslar, bosma 129–154-betlar; Cambridge+ 9-sinf ICT taqdimot
bo‘limlari. Biriktirilgan ICT6 PDFning fizik 131-betidagi interfeys va
153-betidagi Animation Pane/timing tasvirlari ko‘zdan kechirildi. Matn
original didaktik qayta bayondir.

## Boyitilgan pedagogika boblari

| ID | Bob | Blok* | Belgi* | Bo‘lim* | Mashq* | Daraja |
|---|---|---:|---:|---:|---:|---|
| M15.07 | Pedagogik qobiliyatlar | 73 | 11 405 | 13 | 11 | substantial candidate |
| M15.08 | Ta’lim texnologiyalari | 82 | 14 585 | 16 | 11 | substantial candidate |

\* Mavjud pedagogyStudyNotes bilan learner-visible holat hisoblangan.

M15.07 qobiliyat turlarini vaziyatlar bilan ajratadi va tarixiy “avtoritar
qobiliyat” atamasi chegarasini ko‘rsatadi. M15.08 texnologiya, metod, vosita
va shakl farqini; muammoli, loyiha, hamkorlik, interfaol, differensial,
inklyuziv va boshqa yondashuvlarni maqsad–faoliyat–baholash tizimida beradi.

Manbalar: 2026 attestatsiya spetsifikatsiyasi, Xoliqov “Pedagogik mahorat”,
“Pedagogik qobilyatlar umumiy”, Qodirova/Pulatova “Inklyuziv ta’lim:
nazariya va metodika” (2022) va mavjud manbaviy izohlar. M15 frontend savol
massivlari bo‘sh qoldi: server-scored siyosatni buzadigan lokal kalit yo‘q.

## Sifat darvozasi

TASK277UnifiedTheoryBooks testi quyidagilarni majburiy qiladi:

- besh bobda kamida 38 blok, 5500 belgi, 9 sarlavha, 1 maqsad, 3 mashq va
  4 ta misol/yechim/vaziyat;
- PowerPoint test IDlari va savol soni saqlanishi;
- pedagogikaga lokal savol kalitlari qo‘shilmasligi;
- barcha offlayn mavzularda sahifalash blok tartibini aynan saqlashi;
- manba izi bo‘lishi va tekshirilmagan to‘liq qamrov da’vo qilinmasligi.

## Qolgan ochiq kontent qarzi

| Daraja | Oldin | TASK-277 dan keyin |
|---|---:|---:|
| brief | 97 | 93 |
| partial | 6 | 7 |
| substantial candidate | 18 | 21 |
| jami | 121 | 121 |

Bu triage tahrir ustuvorligini ko‘rsatadi, fizik sahifa qamrovini isbotlamaydi.

Keyingi navbat:

1. M04–M06 mantiq, sanoq sistemalari va algoritm boblarini boyitish;
2. M07–M08 Scratch/Logo va dasturlashning server/statik parity auditi;
3. M09–M13 hamda M14/M16 qisqa fallbacklarini bobma-bob boyitish;
4. qolgan PDF/DOCX fizik sahifa lokatorlari va rasm/jadvallarini tekshirish;
5. login ortidagi production darslarini desktop/mobile vizual smoke qilish.

## Lokal QA natijasi

- ESLint: PASS, 0 warning.
- TypeScript typecheck: PASS.
- Vitest: **153 fayl / 1001 test PASS** (yangilangan `main` bilan exact merge-head).
- Production build: PASS.
- Client bundle answer-key marker scan: PASS.
- Theory depth audit: 121/121 statik mavzu hisoblandi.

## Cheklovlar

- Production sayt auth sahifasiga yo‘naltirdi; credential qidirilmadi.
- Production DBga yozilmadi.
- Foydalanuvchi mergega ruxsat berdi; deploy va production DB yozuvi qilinmaydi.
- Yangilangan `main`dagi chuqurroq TASK-289 PowerPoint va TASK-290 pedagogika
  kitoblari konfliktni yechishda saqlandi; TASK-277ning eski parallel M03/M15
  fayllari chiqarildi.
- Branch yagona reader va besh bob boyitilishini beradi, ammo hali butun
  korpusning mazmunan to‘liq ekanini anglatmaydi.

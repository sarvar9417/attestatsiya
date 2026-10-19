# TASK-244: sinf darsliklarini bittalab tekshirish — 5- va 6-sinf manba izlari

**Sana:** 2026-10-19  
**Scope:** 2026 yilgi rasmiy Informatika attestatsiya spetsifikatsiyasi va M01 testlarning ma'lum qismi.  
**Ish rejimi:** metadata/page-level source triage, **review-only**; savollar va javob kalitlari avtomatik o‘zgartirilmaydi. Ushbu jadval **manbaning bir savolga dalil bo‘lishi** bilan **javobning predmet eksperti tomonidan tasdiqlanishi**ni farqlaydi.

## Rasmiy 2026 spesifikatsiya (Drive)

- Mutaxassislik: 35 test; kasb standarti: 5; pedagogik mahorat: 10; jami 50, 120 daqiqa.
- Y1, Y2, Y3 formatlari.
- `S1.INFO`: **1–3-savollar, 3 ta**. Tegishli konstruktlar: informatika–axborot–ma'lumot–bilim; axborot manbalari/turlari; kodlash; hajm/tezlik; raqamli madaniyat, mualliflik; axborotni saralash va xulosa.
- **Manba:** Drive `Informatika Testlar spesifikatsiyasi.pdf`, III bo‘lim, 1-jadval.

## Birinchi darslik — 5-sinf, D. T. Kamaltdinova va D. M. Sayfurov (2020)

**O‘qilgan ikki qism:** `ICT 5_sinf-2020_1-61.pdf` va `ICT 5_sinf-2020_62-113.pdf` (bir darslikning ikki kesimi).
**Drive:** https://drive.google.com/file/d/1h4S97euXmiRCi-s-4PtVM0sIRYuY17p9/view va https://drive.google.com/file/d/1a_JNM33xuEA4gPCtjWSDN9UoruFP-khN/view

Kitobdagi mavzu/betlar:
- 9–12: informatika fani, informatika/kompyuter fanlari; `hardware/software/brainware` sxemasi 10-bet.
- 13–16: axborot, uni sezgilar bilan olish, analog/diskret ko‘rinish va axborot jarayonlari.
- 17–22: belgi va kod, Morze, kodlash/dekodlash, ikkilik kod va bit/bayt. 20-betdagi eski `Кb/Мb` birlik belgilash uslubini zamonaviy **SI kB = 1000 B** va **IEC KiB = 1024 B** tartibi bilan adashtirmaslik kerak.
- 67–84: grafik muharrir, sodda tasvirlar, rasmlar va piksellar bilan ishlash. Rastr va piksellar tilga olinadi, lekin murakkab rang chuqurligi, vektor, audio bitrate va konteyner haqida mustaqil aniq dalil sifatida qabul qilinmasin.

### ARS-01-001..020 bo‘yicha 5-sinf darsligidan **alohida** dalil holati

`B` = kitobda asosiy mazmuni bevosita ko‘rsatilgan; `Q` = mavzu/atama kontekstda bor, savoldagi to‘liq ta'rif boshqa manba bilan tekshiriladi; `Y` = tanlangan 5-sinf I bobi ichida tegishli aniq ta'rif topilmadi (savol avtomatik noto‘g‘ri degani emas).

| Test ID | Konstrukt/atama | 5-sinf betlari | Status | Izoh |
|---|---|---|:---:|---|
| ARS-01-001 | Informatika | 9–10 | B | Fan mazmuniga tayangan |
| ARS-01-002 | AKT | 9–10, 15–16 | Q | Kompyuter va aloqa orqali axborot almashish bor; aniq AKT ta'rifi kengroq |
| ARS-01-003 | Raqamli texnologiya | 13–16 | Q | Raqamli qayta ishlash bor; diskret qiymat ta'rifi alohida nazorat kerak |
| ARS-01-004 | Ma'lumot va kontekst | 13–14 | Q | Umumiy ma'lumot tushunchasi bor; DIKW farqi qat'iy bayon etilmagan |
| ARS-01-005 | Axborot | 13–14 | B | Ta'rif darslikda bor; bankdagi qo‘shimcha `noaniqlikni kamaytirish` aniqlashtirishi alohida manbadan |
| ARS-01-006 | Bilim | — | Y | Bilimni ma'lumot va axborotdan formal farqlash uchun boshqa darslik kerak |
| ARS-01-007 | Ma'lumot → axborot → bilim | — | Y | DIKW zanjiri mustaqil izlanadi |
| ARS-01-008 | Bilimlar bazasi | — | Y | Tibbiy ekspert tizimi kabi kontekstlar 5-sinfning ushbu bobida yo‘q |
| ARS-01-009 | Obyekt | — | Y | Umumiy fan atamasi; 5-sinf I bobda bankdagi ta'rif topilmadi |
| ARS-01-010 | Hodisa | — | Y | 5-sinf I bobda bankdagi ta'rif topilmadi |
| ARS-01-011 | Xabar | 14–16 | Q | Xabar misollari bor; aloqaning to‘liq modeli bilan solishtirish kerak |
| ARS-01-012 | Signal | 17–19 | Q | Morze signali va ikkilik holat mavjud; umumiy fizik ta'rif kengroq |
| ARS-01-013 | Axborot tashuvchi | 17–19 | Q | Belgilar va tashuvchilar misollari bor; formal ta'rif boshqa manbadan |
| ARS-01-014 | Insonning axborotni qabul qilishi | 13–14 | B | Sezgi organlari bevosita bayon etilgan |
| ARS-01-015 | Kiritish–qayta ishlash–chiqarish modeli | — | Y | Uch bosqichli formal model I bobda mustaqil aniqlanmadi |
| ARS-01-016 | Texnik ta'minot | 10 | B | Hardware ko‘rsatilgan |
| ARS-01-017 | Dasturiy ta'minot | 10 | B | Software ko‘rsatilgan |
| ARS-01-018 | Insoniy ta'minot | 10 | B | Brainware ko‘rsatilgan; bank izohidagi kadr-malakasi alohida tekshirilsin |
| ARS-01-019 | Analog/raqamli axborot | 14, 19–20 | B | Uzluksiz/diskret ko‘rinish tushuntirilgan; darslikdagi sodda misollar zamonaviy media bilan aralashtirilmasin |
| ARS-01-020 | Axborotlashgan jamiyat | — | Y | Ijtimoiy konsepsiyaning formal ta'rifi 5-sinf I bobda topilmadi |

**Bu kichik namuna natijasi:** 7 ta B, 6 ta Q, 7 ta Y; qolgan 40 ta ARS-01 va M01ning boshqa 340 ta savoli mazmuniy tasdiqlangan deb hisoblanmaydi. Aynan shu maqsadda qolgan 5–11-sinf darsliklarini birma-bir ochib dalil qidiriladi.

## Ikkinchi darslik — 6-sinf (2021)

**Drive:** https://drive.google.com/file/d/1e7ogcVQypNmSVdnqSZqI5ZqhWLP964vq/view

Tekshirilgan tarkib va manba locatorlari:
- 24–30: Scratch grafik muharririda **rastrli/vektorli** rejimlar va piksel (`ARS-05-003`, `ARS-05-004`, `ARS-05-005` uchun mavzu-darajasidagi manba; so‘ng har bir variant tekshirilishi kerak).
- 77–81: internetdan foydalanish (`M01.04`ga qo‘shimcha).
- 82–88: qidiruv tizimlari va kalit so‘zlar; `ARS-03-015`, `ARS-03-038`ni manbaga bog‘lash uchun mos boshlang‘ich bob.
- 89–93: rasm/audio/video qidirish; qidiruv natijalarini tanlash amaliyoti.
- 94–101: elektron pochta va xabar almashish; `ARS-03-020`, `ARS-03-043` uchun source-locator kandidat.
- 102–106: axborot madaniyati, mualliflik huquqi, plagiat, **Creative Commons**. Bu `S1.INFO` raqamli madaniyat konstruktiga bevosita tegishli.
- 107–114: internet xavflari; onlayn xatti-harakatlar bilan bog‘liq, ammo `netiket` va `raqamli iz` atamalarining aynan to‘liq ta'rifini bu PDF matnidan topib bo‘lmadi — ularga **Q** manba holati.
- 115–125: audio-video fayl va formatlar, codec atamasi, WAV/MP3/MP4; `ARS-05-012`, `ARS-05-023` uchun tematik manba. `Konteyner` ta'rifi alohida aniqlanmagan — `ARS-05-024`ni boshqa manba bilan solishtirish.

**Chegara:** bu 6-sinf materialida media formatlari borligi **sample-rate/bit-depth/bitrate hisoblarining har biri** 6-sinfga tayangan degani emas. Hisobli savollar uchun 7–11-sinf darsliklari va boshqa tekshirilgan qo‘llanmalarning aniq betlari talab qilinadi.

## Yakuniy nazorat prinsipi

1. Har bir **kitob alohida** o‘qiladi va kerakli sahifa/konstrukt qayd etiladi.
2. Keyin **har bir savol**: stem, javob varianti, izoh, rasm/jadval/kod, cognitive, lesson/construct mapping bo‘yicha alohida solishtiriladi.
3. `Y` yoki `Q` = manba qarzi yoki qisman asos; avtomatik noto‘g‘ri javob hukmi emas.
4. Manbasi yetishmaydigan yoki javobi shubhali savollar uchun **review-only** tuzatish taklifi yaratiladi, oldingi published revision o‘zgarmaydi.
5. Bu hujjatni to‘liq manba sertifikatsiyasi sifatida talqin qilish mumkin emas.


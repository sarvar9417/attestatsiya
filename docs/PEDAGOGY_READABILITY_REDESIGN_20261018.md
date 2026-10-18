# 2026-10-18 — Pedagogika nazariyasining tushunarliligi va dizayni

**Status:** faqat ishchi branch, PR #125 DRAFT. Foydalanuvchi tasdiqlamaguncha **merge va production deploy YO‘Q**.

## Aniqlangan muammo

1. `TopicView`ning avvalgi statik nazariya kartalari ta’rif / misol / jadval / eslatmani turli ko‘rinishda tasvirlaydi.
2. `professionalLessonTheory.ts` serverdan kelgan M14–M16 MDX mazmunining `##` sarlavhasini `text`ga aylantirar, qalin termin va manba belgilarini ko‘rsata olmas, ro‘yxatni oddiy matnga yig‘ib yuborar edi. Bu ko‘rgazmali, tushunarli nazariyani bir xil matn bloklariga aylantirib yuborgan.
3. 2026-10-18 yangidan yozilgan nazariya SQL migratsiyalari oldingi release doirasida **kodga merge bo‘lgan, lekin production DBga qo‘llanmagan**. Qachon qo‘llansa ham foydalanuvchini uzun izohlar bilan chalg‘itmaslik zarur.

## Real foydalanuvchi ko‘rsatgan muammo — 09:11 (2026-10-18)

Foydalanuvchining birinchi skrinshotida `/learn/M15` ichidagi an'anaviy **rangli jadval va misol** ko‘rinadi, birozdan so‘ng ikkinchi skrinshotda oddiy matn kartalari va katta oraliqlar qolgan.

**Tasdiqlangan sabab:** `TopicView.tsx` birinchi renderda `getTopicContent(subtopicId)` ni ishlatgan, keyin asinxron `getLessonDetail()` tugashi bilan `publishedTheory.content`ga almashtirgan. Ikkala manba uchun boshqa blok dizayni ishlagani sabab ko‘rinish almashgan. `liveQuestions` backenddan kelgach savollar sonining 2→8 bo‘lib o‘zgarishi ham skrinshotda ko‘rinadi, bu boshqa data-fetch oqimi va test kalitiga tegmasdan saqlangan.

**Yakuniy tuzatish:** `resolveLearnerTheoryContent()` M15 uchun server qaytganda ham **bir xil statik, eski chiroyli asosiy nazariya obyektini** qaytaradi; shu sabab ko‘rinish va progress kuzatuvchisining `content` dependencysi o‘zgarmaydi. Serverdagi mazmun alohida yopiq `Batafsil nazariya — qo‘shimcha manba` bo‘limida mavjud. M14/M16 canonical backend-first oqimi o‘zgarmaydi.

**Regressiya testi:** `professionalLessonTheory.test.ts` M15.08ning server so‘rovidan oldin va keyin *bir xil ma'lumot obyektini*, rangli `definition` bloki va o‘zgarmagan savollarni ishlatayotganini tekshiradi; M14/M16 backend policy saqlanadi.

## Tuzatish

- M14–M16 published darslari sarlavha, ro‘yxat, taqqoslash jadvali, maqsad va manba bo‘yicha **semantik bloklarga** aylantiriladi.
- `PedagogyTheoryBlock` semantik kartalari faqat source-backed M14–M16 content uchun; boshqa informatika modulining mavjud UI buzilmaydi. `PedagogyInline` qalin matnni xavfsiz React elementlarda ko‘rsatadi; raw HTML ishlatilmaydi.
- M15.01–M15.08 uchun `pedagogyStudyNotes`: sodda tushuncha → vaziyatli misol → testda farqlash → manba. Muayyan tarixiy test javob kalitlariga ko‘r-ko‘rona ishonilmaydi.
- Chuqurlashtirilgan SQL materiallar alohida `supplementalTheory`ga ajratiladi va faqat foydalanuvchi `Qo‘shimcha manbaviy ma’ruza`ni ochganda chiqariladi.
- M15 asosiy nazariyasi doim birinchi ko‘rinadi; misol va nozik farqlar uchun yana bitta ixtiyoriy ochiladigan bo‘lim bor. Offline rejimda avvalgi statik dizayn saqlanib, qo‘shimcha sodda misollar ham ishlaydi.
- Test savollari, kalitlari, natijalar, rasmiy 5/7/3 kvotalar, modul yo‘llari va Supabase production ma’lumotlari o‘zgartirilmaydi.

## Tekshirilgan manbalar (shu vazifa doirasida)

- `Xoliqov Pedagogik mahorat.pdf`, 1–2-bet — pedagogik mahoratning to‘rt tarkibi va qobiliyatga oid ta’riflar.
- `Pedagogik qobilyatlar umumiy.pdf`, 1–3-bet — turli tasniflar; qobiliyat, ko‘nikma va malaka farqi.
- `Dars turlari.pdf`, 1–2-bet — dars turlarining maqsad va faoliyatiga ko‘ra tasnifi.
- `dars tahlili turlari.pdf`, 1-bet — beshta tahlil turi.
- `Pedagogning kasbiy standarti - qollanma.pdf`, 1–2, 8, 12–13-betlar — mehnat vazifalari, hamkorlik, rejalash va tarbiya.
- Qodirova, Pulatova, `4-Inklyuziv-talim-nazariya-va-metodika.pdf`, 8–11-betlar — inklyuziv yondashuv.
- `Pedmahorat to'plam 2025 kuzgi(1).pdf`, 2-bet — induksiya/deduksiya/analogiya va refleksiya vaziyatlari (tarixiy test, normativ hujjat emas).

Boshqa yuborilgan tarixiy PDFlarning hammasi bu dizayn vazifasi doirasida to‘liq ekspert tahriridan o‘tkazildi deb da’vo qilinmaydi. Tarkibni keng qamrovli tasdiqlash keyingi editorial bosqich.

## Manual QA talablari

- [ ] M15.01–M15.08: barcha asosiy sarlavha, jadval, ta’rif, misol, manba; Desktop + kichik mobil viewport.
- [ ] Qo‘shimcha bo‘limni ochish/yopish; scroll va mobil jadvalni gorizontal surish.
- [ ] M14 va M16: semantic parser regressiyasi yo‘q.
- [ ] Backend ishlamasa: statik dars va oddiy izohlar ko‘rinishi.
- [ ] M15.04 dars tahlili nomlari, M15.07 tasniflar, M15.08 inklyuziya bo‘yicha manba bilan editorial tekshiruv.
- [ ] Foydalanuvchidan UI va yozilgan izohlarning yakuniy roziligi.

**Release gate:** CI yashil bo‘lishi ham production uchun avtomatik rozilik emas. `main`ga merge, production Vercel deploy va production DB migratsiyalari faqat foydalanuvchi alohida tasdiqlaganidan keyin.

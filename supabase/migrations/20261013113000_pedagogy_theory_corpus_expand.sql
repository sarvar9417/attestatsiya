-- Expand M14/M15 theory from user-provided 2026 professional-standard and
-- pedagogical-mastery source PDFs. The text below is a source-grounded synthesis,
-- not a verbatim republication of historical test compilations.
--
-- Sources reviewed:
-- * Pedagogning kasbiy standarti - qollanma.pdf (13 pages)
-- * Xoliqov Pedagogik mahorat.pdf (28-page study extract)
-- * 2024, 2025 spring/autumn, 2026 PedMahoratGuli test compilations
-- * official 2026 Informatics attestation specification
--
-- Safe/idempotent:
-- * canonical lesson IDs/slugs are preserved;
-- * learner progress is preserved;
-- * only empty, unreferenced legacy M14/M15 duplicates are archived;
-- * additions are marker-gated and append-only.

begin;

do $theory$
declare
  r record;
  v_refs bigint;
begin
  -- Remove learner-visible empty duplicates only after proving they are unused.
  for r in
    select l.id,l.slug,m.code
    from public.lessons l
    join public.modules m on m.id=l.module_id
    where m.code in ('M14','M15')
      and l.status='published'::public.content_status
      and l.slug in (
        'm14-03','m14-04','m14-05','m14-07',
        'm15-01','m15-03','m15-04','m15-05','m15-06','m15-07'
      )
  loop
    if length(coalesce((select body_mdx from public.lessons where id=r.id),''))<>0 then
      raise exception 'PEDAGOGY_THEORY legacy lesson % is unexpectedly non-empty',r.slug;
    end if;

    select
      (select count(*) from public.questions q where q.source_lesson_id=r.id)
      +(select count(*) from public.user_lesson_progress p where p.lesson_id=r.id)
      +(select count(*) from public.exams e where e.lesson_id=r.id)
      +(select count(*) from public.topic_test_attempts t where t.lesson_id=r.id)
    into v_refs;

    if v_refs<>0 then
      raise exception 'PEDAGOGY_THEORY legacy lesson % has % dependent records',r.slug,v_refs;
    end if;

    update public.lessons
       set status='archived'::public.content_status,
           updated_at=now()
     where id=r.id;
  end loop;

  -- M14 / KS.01
  update public.lessons l
     set body_mdx = l.body_mdx || $md$

## Kasb standarti: to‘liq nazariya xaritasi [THEORY-CORPUS-2026-10-13]

### Mehnat vazifalari
Bu sohada o‘qituvchi:
- davlat ta’lim standarti va o‘quv dasturi maqsadlariga muvofiq o‘quv rejasini ishlab chiqadi;
- zarur bo‘lsa, o‘quvchilarning ehtiyoj va qiziqishlaridan kelib chiqib dastur va rejalashtirishni moslashtiradi;
- fanlararo kompetensiyalar, korrelyatsiya va integratsiyani rejalashtirishga kiritadi;
- avvalgi baholash natijalaridan foydalanib aniq va o‘lchanadigan maqsad hamda natijalarni belgilaydi;
- yosh xususiyati va o‘zlashtirish darajasiga mos dars shakli va usullarini tanlaydi;
- o‘quv, namoyish va tarqatma materiallari hamda AKT integratsiyasini oldindan rejalashtiradi.

### Zarur ko‘nikmalar
- yil, chorak va dars kesimida natija va vazifalarni aniq shakllantirish;
- baholash ma’lumotlari asosida rejani muvofiqlashtirish;
- fanlararo bog‘lanishni mazmunli tashkil etish;
- zamonaviy AKTni fan mazmuniga singdirish;
- dars vaqtini, maqsadni, shaklni va usulni oqilona rejalashtirish.

### Zarur bilimlar
O‘qituvchi o‘quv reja va DTSni, maktab faoliyatining huquqiy-tashkiliy asoslarini, o‘z fanining asosiy umumta’lim dasturidagi o‘rnini, fanni o‘qitish usullarini, turli reja tuzish tamoyillarini, didaktik tamoyillarni va rejalashtirish uchun AKT imkoniyatlarini bilishi kerak.

### Savolda qanday ajratiladi?
**Rejalashtirish** — kelgusi dars yoki davr uchun maqsad, ketma-ketlik, resurs, usul va vaqtni oldindan belgilash. Agar vaziyatda “dars davomida” o‘qitishning o‘zi yoki keyingi qayta aloqa markazda bo‘lsa, u boshqa KS sohasiga tegishli bo‘lishi mumkin.

**Manba izi:** “Pedagogning kasbiy standarti — Umumta’lim tashkiloti pedagogi uchun metodik qo‘llanma”, 1-soha, 2–3-betlar; 2026 Informatika attestatsiya spetsifikatsiyasi, 2-jadval.
$md$,
         updated_at=now()
   where l.slug='oquv-jarayonini-rejalashtirish'
     and exists(select 1 from public.modules m where m.id=l.module_id and m.code='M14')
     and position('[THEORY-CORPUS-2026-10-13]' in coalesce(l.body_mdx,''))=0;

  -- M14 / KS.02
  update public.lessons l
     set body_mdx = l.body_mdx || $md$

## Kasb standarti: to‘liq nazariya xaritasi [THEORY-CORPUS-2026-10-13]

### Mehnat vazifalari
Ta’lim samaradorligini ta’minlashda o‘qituvchi:
- dars maqsadidan kelib chiqib erishimli vazifalar belgilaydi;
- mavzuga mos namoyish va tarqatma materiallardan foydalanadi;
- dars vaqtini oqilona boshqaradi;
- ta’limiy muammolarni hal qilishda AKTdan foydalanadi;
- baholash natijalari asosida yondashuv samaradorligini tahlil qiladi;
- yosh va ta’limiy maqsadga mos usullarni tanlaydi;
- faol usullarni qo‘llaydi, frontal ta’limni yagona ustun shaklga aylantirmaydi;
- asosiy kompetensiyalar va hayotiy ko‘nikmalarni rivojlantiradi;
- jamoaviy va loyiha ishlarini tashkil etadi;
- metakognitiv strategiyalar: rejalashtirish, nazorat va o‘z-o‘zini baholashni o‘rgatadi;
- individual ehtiyojga mos o‘z vaqtida differensial yordam beradi;
- mavzuni hayotiy misollar bilan bog‘laydi;
- har bir o‘quvchining fikr bildirish imkonini ta’minlaydi va motivatsiyani qo‘llab-quvvatlaydi;
- sinfda samarali muloqotni tashkil etadi.

### Zarur ko‘nikmalar
Samarali metod va interfaol usullarni tanlash, pedagogik vaziyatni kuzatib tahlil qilish, vaqt va o‘quvchi ishini boshqarish, AKTdan foydalanish, mustaqil ishni tashkil etish, ehtiyoj va qobiliyatni diagnostika qilish, ijodkorlik va tanqidiy fikrlashni rivojlantirish, motivatsion vaziyatlarni yaratish va sinfni boshqarish.

### Zarur bilimlar
Ta’lim nazariyalari va samarali o‘qitish usullari, turli ta’limiy ehtiyojlar va iqtidorli o‘quvchilar bilan ishlash, inklyuzivlik, xalqaro tajribani tahlil qilish, yosh pedagogikasi va psixologiyasi.

### Savolda qanday ajratiladi?
Kalit belgi — **darsning real bajarilish sifati va o‘quvchi faoliyatini samarali tashkil etish**. Rejalashtirish oldindan bo‘ladi; KS.02 esa ko‘pincha dars jarayonidagi tanlov va boshqaruvni baholaydi.

**Manba izi:** Kasbiy standart metodik qo‘llanmasi, 2-soha, 4–5-betlar; 2026 spetsifikatsiya.
$md$,
         updated_at=now()
   where l.slug='talim-samaradorligini-taminlash'
     and exists(select 1 from public.modules m where m.id=l.module_id and m.code='M14')
     and position('[THEORY-CORPUS-2026-10-13]' in coalesce(l.body_mdx,''))=0;

  -- M14 / KS.03
  update public.lessons l
     set body_mdx = l.body_mdx || $md$

## Kasb standarti: to‘liq nazariya xaritasi [THEORY-CORPUS-2026-10-13]

### Mehnat vazifalari
O‘qituvchi:
- natijani baholash va diagnostika qilish uchun turli usul-vositalardan foydalanadi;
- bilimni egallash darajasini muntazam kuzatadi;
- erishilgan yutuqlarni tahlil qiladi;
- tahlil natijasidan dars rejasi va usullarini moslashtirishda foydalanadi;
- bahoni asoslaydi;
- yutuqni baholash orqali o‘qishga motivatsiyani qo‘llab-quvvatlaydi;
- o‘quvchi duch kelgan qiyinchiliklarni kuzatadi va qayd qiladi;
- zarur holatda shu sinfdagi hamkasblar va tegishli mutaxassislar bilan maslahatlashadi.

### Zarur ko‘nikmalar
Baholash usullarini rivojlanishni rag‘batlantirishga xizmat qildirish; diagnostik va baholash testlarini ishlab chiqish; baholashni individual ehtiyojga moslashtirish; baholash ma’lumotlarini o‘qitish amaliyotini o‘zgartirish uchun talqin qilish; o‘quvchi va ota-onaga samarali qayta aloqa strategiyalaridan foydalanish.

### Uch baholash turi
- **Diagnostik baholash** — o‘qitish sikli boshida boshlang‘ich holat, bilim, ko‘nikma va munosabatlarni aniqlaydi; keyingi rejalashtirishni moslashtirish uchun xizmat qiladi.
- **Formativ baholash** — kundalik o‘qitish jarayonida joriy holatni ko‘rsatadi va tezkor qayta aloqa orqali keyingi o‘qitish qarorini yaxshilaydi.
- **Summativ baholash** — bo‘lim, semestr yoki o‘quv yili kabi uzoqroq sikl yakunida erishilgan natijani qayd etadi.

### Savolda qanday ajratiladi?
“Dars boshida nimani biladi?” — diagnostik. “Jarayon davomida nima o‘zgartiray?” — formativ. “Yakuniy natija qanday?” — summativ.

**Manba izi:** Kasbiy standart metodik qo‘llanmasi, 3-soha, 6–7-betlar.
$md$,
         updated_at=now()
   where l.slug='ozlashtirishni-baholash-va-qayta-aloqa'
     and exists(select 1 from public.modules m where m.id=l.module_id and m.code='M14')
     and position('[THEORY-CORPUS-2026-10-13]' in coalesce(l.body_mdx,''))=0;

  -- M14 / KS.04
  update public.lessons l
     set body_mdx = l.body_mdx || $md$

## Kasb standarti: to‘liq nazariya xaritasi [THEORY-CORPUS-2026-10-13]

### Mehnat vazifalari
Tarbiyaviy faoliyatda o‘qituvchi:
- o‘quvchi ehtiyojini hisobga olib rivojlantiruvchi maqsad va vazifalarni belgilaydi;
- zamonaviy va interaktiv tarbiyaviy shakl-usullarni dars va sinfdan tashqari faoliyatda qo‘llaydi;
- yosh, jins, madaniy va individual xususiyatlarni inobatga oladi;
- emotsional-qadriyatli sohani rivojlantiruvchi vaziyatlarni loyihalaydi;
- maktab ichki qoidalariga mos aniq odob-axloq me’yorlarini o‘rnatadi;
- o‘quvchilarning o‘zini o‘zi boshqarishini qo‘llab-quvvatlaydi;
- hudud va mahalliy tarixiy-madaniy imkoniyatlardan foydalanib sinfdan tashqari faoliyatlarni tashkil etadi;
- nizolarni hal qilish va ijobiy muloqot muhitini yaratadi;
- bag‘rikenglik, odob-axloq, hayotga tayyorgarlik, tashabbus, ijodkorlik va fuqarolik pozitsiyasini rivojlantiradi.

### Zarur ko‘nikmalar
Madaniy tafovut, yosh va individual farqlarni hisobga olish; bola bilan hurmatli muloqot; guruhni boshqarish; do‘stona muhit yaratish; qadr-qimmat va manfaatlarni himoya qilish; tenglik, adolat va hurmatga yo‘naltirish; sayohat va ekskursiyalarni pedagogik maqsadda tashkil etish.

### Zarur bilimlar
Klassik va zamonaviy tarbiya nazariyalari, yosh pedagogikasi va psixologiyasi, bola huquqlari va ta’lim qonunchiligi, didaktika, ko‘p madaniyatli ta’lim, ijtimoiylashuv, tarbiyaviy ish metodikasi va hududdan tashqari tadbirlarni tartibga soluvchi talablar.

### KS.04 va KS.05 ni farqlash
KS.04 markazida **qadriyat, xulq va tarbiyaviy rivojlanish** turadi. KS.05 markazida esa **xavfsizlik, teng imkoniyat va himoya** turadi.

**Manba izi:** Kasbiy standart metodik qo‘llanmasi, 4-soha, 8–9-betlar.
$md$,
         updated_at=now()
   where l.slug='tarbiyaviy-faoliyatni-tashkil-etish'
     and exists(select 1 from public.modules m where m.id=l.module_id and m.code='M14')
     and position('[THEORY-CORPUS-2026-10-13]' in coalesce(l.body_mdx,''))=0;

  -- M14 / KS.05
  update public.lessons l
     set body_mdx = l.body_mdx || $md$

## Kasb standarti: to‘liq nazariya xaritasi [THEORY-CORPUS-2026-10-13]

### Mehnat vazifalari
Xavfsiz rivojlantiruvchi muhitda o‘qituvchi:
- o‘zaro hurmat va erkin rivojlanish muhitini yaratadi;
- jins, millat, madaniyat, til, din, ijtimoiy-iqtisodiy holat yoki alohida ehtiyojidan qat’i nazar teng ishtirok imkonini beradi;
- nizoli vaziyatlarni yetarli darajada hal qiladi;
- xavfsizlik qoidalari mazmunini tushuntiradi va ularga amal qilishni qo‘llab-quvvatlaydi;
- odob-axloq qoidalarini yaratishga o‘quvchilarni jalb qiladi;
- turli tahdid va favqulodda vaziyatlarda harakat ketma-ketligini tushuntiradi;
- ehtiyojga mos aniq ko‘rsatma bilan sinf faoliyatini boshqaradi;
- maxsus ta’limiy ehtiyojga mos individuallashtirilgan ish olib boradi;
- zamonaviy media muhitida xavfsiz ishlash ko‘nikmalarini rivojlantiradi.

### Zarur ko‘nikmalar va bilimlar
Mazmunli muhit yaratish, madaniyatlararo kompetensiya, mas’uliyatli qaror qabul qilishni qo‘llab-quvvatlash, media savodxonlik, favqulodda vaziyatda to‘g‘ri harakat qilish va zarur bo‘lsa birinchi yordam. Bilimlar tarkibiga bola huquqlari, shaxslararo muloqot, sog‘liqni saqlovchi muhit, mehnat gigiyenasi, texnika xavfsizligi, hayot xavfsizligi va rivojlanish psixologiyasi kiradi.

### Nizoni hal qilish yondashuvlari
- **Arbitraj** — o‘qituvchi vaziyatni o‘rganib, hakam sifatida qaror beradi.
- **Muzokara** — tomonlar kelishmovchilikni hal qilish yo‘lini o‘zlari kelishib topadi.
- **Mediatsiya** — xolis vositachi tomonlar muloqotiga yordam beradi; yakuniy kelishuv tomonlarning ishtirokida shakllanadi.

### Savolda qanday ajratiladi?
Kamsitish, masxara, xavfsizlik qoidasi, favqulodda vaziyat, teng ishtirok, media xavfi yoki alohida ehtiyoj uchun sharoit yaratish — KS.05ning kuchli signallari.

**Manba izi:** Kasbiy standart metodik qo‘llanmasi, 5-soha, 10–11-betlar.
$md$,
         updated_at=now()
   where l.slug='xavfsiz-rivojlantiruvchi-talim-muhiti'
     and exists(select 1 from public.modules m where m.id=l.module_id and m.code='M14')
     and position('[THEORY-CORPUS-2026-10-13]' in coalesce(l.body_mdx,''))=0;

  -- M14 / KS.06
  update public.lessons l
     set body_mdx = l.body_mdx || $md$

## Kasb standarti: to‘liq nazariya xaritasi [THEORY-CORPUS-2026-10-13]

### Mehnat vazifalari
Kasbiy o‘sish:
- muntazam malaka oshirish;
- fanga oid adabiyotlarni doimiy o‘rganib, yangi bilimni amaliyotga qo‘llash;
- seminar, trening va boshqa rivojlanish tadbirlarida qatnashish;
- uslubiy kengashlarda tajriba almashish;
- o‘zaro darslarda qatnashish va tahlil natijasini o‘z amaliyotiga tatbiq etish;
- ochiq dars tayyorlash va o‘tkazish;
- o‘z ta’lim faoliyatining kuchli va zaif tomonlarini baholash;
- zarur o‘zgarishlarni amaliyotga kiritish.

### Zarur ko‘nikmalar
Shaxsiy kasbiy rivojlanish yo‘lini belgilash, o‘z faoliyatini tahlil qilish, modifikatsiya talab qiladigan yo‘nalishlarni aniqlash, AKT muhitidan foydalanish va zaruriyatga ko‘ra xorijiy tildan foydalanish.

### Zarur bilimlar
O‘z-o‘zini baholash, kuchli-kuchsiz tomonlarni aniqlash, kasbiy rivojlanishni rejalashtirish, AKT, xorijiy til va nutq madaniyati.

### Refleksiya sikli
**Dalil → tahlil → rivojlanish ehtiyoji → yangi yondashuv → amaliy sinov → qayta baholash.** Faqat kurs sertifikatiga ega bo‘lish kasbiy o‘sishning o‘zi emas.

**Manba izi:** Kasbiy standart metodik qo‘llanmasi, 6-soha, 12-bet; Xoliqov pedagogik mahorat bo‘yicha mustaqil o‘qish, ustoz tajribasi, kurs va ilmiy anjumanlar orqali rivojlanish tavsiyalari.
$md$,
         updated_at=now()
   where l.slug='oz-ozini-rivojlantirish-va-kasbiy-osish'
     and exists(select 1 from public.modules m where m.id=l.module_id and m.code='M14')
     and position('[THEORY-CORPUS-2026-10-13]' in coalesce(l.body_mdx,''))=0;

  -- M14 / KS.07
  update public.lessons l
     set body_mdx = l.body_mdx || $md$

## Kasb standarti: to‘liq nazariya xaritasi [THEORY-CORPUS-2026-10-13]

### Mehnat vazifalari
Hamkorlik sohasida o‘qituvchi:
- ota-onalarni ta’lim jarayoniga, sinf va maktab hayotiga jalb qiladi;
- ota-onalarni o‘quvchi rivoji va ta’lim muhiti bo‘yicha qarorlarda ishtirok ettiradi;
- individual ta’lim trayektoriyasini loyihalash va tuzatishda hamkasb va mutaxassislar bilan hamkorlik qiladi;
- tarbiyaviy muammolarni hal qilishda boshqa pedagoglar, mutaxassislar va tegishli jamoat tuzilmalari bilan ishlaydi.

### Zarur ko‘nikmalar
Jamoada ishlash; kasbiy muammoni hamkorlikda hal qilish; turli muhit va emotsional holatdagi odamlar bilan aloqa qilish; mahalliy hamjamiyat xususiyatlarini anglab, o‘quvchi manfaati uchun hamkorlik qilish.

### Zarur bilimlar
Samarali ijtimoiy muloqot asoslari, hamkorlik shakl-usullari, individual va jamoaviy ishlash xususiyatlari.

### Savolda qanday ajratiladi?
Agar asosiy harakat “ota-ona yoki mutaxassisni xabardor qilish” emas, balki **birgalikda qaror, ta’lim trayektoriyasi yoki muammoni hal qilish** bo‘lsa, KS.07 kuchli nomzod bo‘ladi.

**Manba izi:** Kasbiy standart metodik qo‘llanmasi, 7-soha, 13-bet.
$md$,
         updated_at=now()
   where l.slug='hamkasblar-va-ota-onalar-bilan-hamkorlik'
     and exists(select 1 from public.modules m where m.id=l.module_id and m.code='M14')
     and position('[THEORY-CORPUS-2026-10-13]' in coalesce(l.body_mdx,''))=0;

  -- M15 / PM.GEN.01
  update public.lessons l
     set body_mdx = l.body_mdx || $md$

## Pedagogik mahorat asoslari [THEORY-CORPUS-2026-10-13]

### Pedagogik mahoratning mohiyati
Pedagogik mahorat o‘qituvchining shaxsiy va kasbiy fazilatlarini, fan va metodikani bilishini, pedagogik-psixologik tayyorgarligini hamda o‘quvchini o‘qitish, tarbiyalash va rivojlantirishning optimal yo‘llarini topish qobiliyatini birlashtiradi.

### Asosiy komponentlar
Xoliqov materialida pedagogik mahoratning tayanch tarkibi sifatida quyidagilar ajratiladi:
1. o‘qituvchilik kasbiga sadoqat;
2. o‘z fanini va uni o‘qitish metodikasini mukammal bilish;
3. pedagogik qobiliyatlarni namoyish eta olish;
4. pedagogik texnikani o‘rinli qo‘llash.

Pedagog faoliyatining natijasi faqat bilim berish emas. O‘qituvchi bolani tushunish, kuzatish, nutq, tashkilotchilik, kelajakni ko‘ra bilish, diqqatni taqsimlash, vaziyatni baholash, nizoni bartaraf etish va o‘qishga qiziqtirish kabi qobiliyatlarni uyg‘unlashtiradi.

### Kasbiy tayyorgarlik yo‘nalishlari
- shaxsiy fazilatlar;
- ruhiy-psixologik tayyorgarlik;
- ijtimoiy-pedagogik va ilmiy-nazariy tayyorgarlik;
- maxsus va ixtisoslikka oid uslubiy bilimlar.

### Pedagogik mahoratni rivojlantirish
Mustaqil o‘qish, tajribali ustoz darslarini kuzatish, malaka oshirish, seminar-konferensiyalarda qatnashish va ilg‘or tajribani o‘rganish — pedagogik mahoratni doimiy takomillashtirish vositalaridir.

**Manba izi:** “Xoliqov Pedagogik mahorat” o‘quv materiali, 1-bob va pedagogik mahoratni egallash vositalari bo‘limlari; 2026 spetsifikatsiya 2.1.
$md$,
         updated_at=now()
   where l.slug='pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi'
     and exists(select 1 from public.modules m where m.id=l.module_id and m.code='M15')
     and position('[THEORY-CORPUS-2026-10-13]' in coalesce(l.body_mdx,''))=0;

  -- M15 / PM.GEN.04
  update public.lessons l
     set body_mdx = l.body_mdx || $md$

## Sinfni boshqarish uslublari [THEORY-CORPUS-2026-10-13]

Pedagogik muloqot va sinfni boshqarishda uch klassik uslubni vaziyat belgilaridan farqlash muhim.

### Avtoritar uslub
Asosiy qaror va ko‘rsatmalar o‘qituvchidan keladi, qat’iy intizom va so‘zsiz bo‘ysunish talabi kuchli. Buyruq, qattiqqo‘llik va yuqoridan boshqarish ustun bo‘lishi mumkin.

### Demokratik uslub
Sinf jamoasi fikri va tashabbusi hisobga olinadi. O‘quvchilarga erkin fikr bildirish, mas’uliyatni bo‘lishish va ongli intizom shakllantirish imkoniyati beriladi. Muloqotda iltimos, maslahat va samimiy muomala ustun.

### Liberal uslub
O‘qituvchi boshqaruvga kam aralashadi, topshiriq natijalarini kuzatish va javobgarlikni o‘z zimmasiga olish sustlashadi. Tashabbussizlik va nazoratning yetishmasligi bilan tavsiflanadi.

### Imtihon signali
O‘quvchi taklifini dars maqsadiga zid bo‘lmasa inobatga olish — demokratik yondashuv signali. Har qanday qat’iy talabni avtomatik “avtoritar” deb belgilash to‘g‘ri emas; kontekstda qaror qabul qilish usuli va muloqot ohangi muhim.

**Manba izi:** Xoliqov pedagogik mahorat materiali, o‘qituvchining muloqot asosida sinf jamoasini boshqarish uslublari, 19–21-betlar.
$md$,
         updated_at=now()
   where l.slug='dars-turlari-rejalashtirish-va-sinfni-boshqarish'
     and exists(select 1 from public.modules m where m.id=l.module_id and m.code='M15')
     and position('[THEORY-CORPUS-2026-10-13]' in coalesce(l.body_mdx,''))=0;

  -- M15 / PM.GEN.06
  update public.lessons l
     set body_mdx = l.body_mdx || $md$

## Muloqot, nazokat, pedagogik texnika va nutq [THEORY-CORPUS-2026-10-13]

### Pedagogik muloqot
Pedagogik muloqot — o‘qituvchi va o‘quvchi o‘rtasida ta’lim-tarbiya uchun qulay psixologik muhit yaratadigan kasbiy munosabat. Uning muhim vazifalari: axborot almashish, birgalikdagi faoliyatni tashkil etish, erkin fikrlashni qo‘llab-quvvatlash, salbiy holatlarni birgalikda bartaraf etish va o‘zaro yordamni rivojlantirish.

### Muloqotning uch jihati
- **Kommunikativ** — axborot almashish;
- **Interaktiv** — ikki tomonlama o‘zaro ta’sir va hamkorlik;
- **Perseptiv** — suhbatdoshni idrok etish, tushunish va uning holatini anglash.

### Pedagogik nazokat
Pedagogik nazokat — xulq va odob me’yorlariga rioya etgan holda o‘quvchi bilan to‘g‘ri masofa, talabchanlik va hurmat muvozanatini saqlash. U qo‘pollikni emas, vaziyatga mos axloqiy-me’yoriy qarorni anglatadi.

### Pedagogik texnika
Pedagogik texnika o‘qituvchining kasbiy ta’sirni boshqarishiga xizmat qiladi. Birinchi guruh ko‘nikmalariga o‘z hissiyoti, mimika, pantomimika, diqqat, kuzatuvchanlik, xayol va nutq texnikasini boshqarish kiradi. Ikkinchi guruhga didaktik, tashkilotchilik, konstruktiv va kommunikativ ta’sir, talab bajarilishini nazorat qilish hamda jamoani boshqarish kiradi.

**Mimika** — yuz va ko‘z ifodasi orqali holatni ifodalash.  
**Pantomimika** — gavda, qo‘l va oyoq harakatlarini maqsadli boshqarish.

### Nutqning asosiy xususiyatlari
1. to‘g‘rilik va ravonlik;
2. aniqlik va ta’sirchanlik;
3. mantiqiylik;
4. tozalik va ifodalilik.

Nutqning mantiqiyligi fikr va gaplarning izchil bog‘lanishi, tozaligi esa adabiy til me’yorlariga mosligi bilan belgilanadi.

**Manba izi:** Xoliqov pedagogik mahorat materiali, muloqot madaniyati, pedagogik nazokat, pedagogik texnika va nutq bo‘limlari, 15–28-betlar.
$md$,
         updated_at=now()
   where l.slug='pedagogik-etika-nutq-texnika-va-takt'
     and exists(select 1 from public.modules m where m.id=l.module_id and m.code='M15')
     and position('[THEORY-CORPUS-2026-10-13]' in coalesce(l.body_mdx,''))=0;

  -- M15 / PM.GEN.07
  update public.lessons l
     set body_mdx = l.body_mdx || $md$

## Pedagogik qobiliyatlar: kengaytirilgan nazariya [THEORY-CORPUS-2026-10-13]

### Qobiliyat, ko‘nikma va malaka
**Qobiliyat** — muayyan faoliyatni muvaffaqiyatli bajarishga imkon beruvchi individual-psixologik xususiyatlar tizimi.  
**Ko‘nikma** — tajriba va bilim asosida bajariladigan mukammallashgan ish usuli.  
**Malaka** — ongli faoliyatda shakllanib, avtomatlashgan komponentga aylangan kasbiy harakat.

### Pedagogik qobiliyatlar
Manbalarda quyidagi qobiliyatlar turli tasniflarda uchraydi:
- kommunikativ — samarali aloqa va ijobiy ruhiy iqlim yaratish;
- voqealarni oldindan ko‘ra olish / pedagogik tasavvur — ehtimoliy holat va reaksiyani oldindan taxmin qilish;
- perseptiv — o‘quvchining ichki holati va pedagogik vaziyatni sezish-idrok etish;
- empatik — o‘quvchining his-tuyg‘usini tushunish va hamdard bo‘lish;
- didaktik — mazmunni o‘quvchi uchun o‘zlashtiriladigan shaklda tashkil etish;
- tashkilotchilik — jamoa va faoliyatni uyushtirish;
- konstruktiv — ta’lim-tarbiya jarayonini oldindan puxta rejalashtirish;
- bilish/akademik — fan mazmunini chuqur egallash;
- mantiqiy — sabab-oqibat va muhim belgilarni tahlil qilish;
- o‘zini boshqara olish — hissiyot va xatti-harakatni vaziyatga mos boshqarish.

### Ijodkorlik
Pedagogik ijodkorlik manbada mahsuldor, evristik va kreativ ko‘rinishlarda yoritiladi. Muhim farq: evristik ijodkorlik mavjud yangiliklarni dadil o‘zlashtirib yangi g‘oya va farazlarni shakllantirishga, kreativ ijodkorlik esa ijtimoiy ahamiyatli yangi yechim va nazariyani yaratishga yo‘naltiriladi.

### Imtihon strategiyasi
Savolda “o‘quvchining holatini sezdi” — perseptiv; “mavzuni sodda tushuntirdi” — didaktik; “fani bo‘yicha murakkab masalani yecha olmadi” — akademik/bilish; “jamoani uyushtirdi” — tashkilotchilik; “iliq aloqa o‘rnatdi” — kommunikativ qobiliyat signalidir.

**Manba izi:** Xoliqov pedagogik mahorat materiali, “O‘qituvchi faoliyatida pedagogik qobiliyat” bo‘limi, 6–10-betlar; 2025 kuzgi attestatsiya to‘plamidagi qobiliyatlar nazariy jadvali.
$md$,
         updated_at=now()
   where l.slug='pedagogik-qobiliyat-va-uning-turlari'
     and exists(select 1 from public.modules m where m.id=l.module_id and m.code='M15')
     and position('[THEORY-CORPUS-2026-10-13]' in coalesce(l.body_mdx,''))=0;

  -- M15 / PM.GEN.08
  update public.lessons l
     set body_mdx = l.body_mdx || $md$

## Pedagogik texnologiya darajalari [THEORY-CORPUS-2026-10-13]

Pedagogik texnologiya attestatsiya savollarida uch darajada uchrashi mumkin:

- **Umumpedagogik (makro) daraja** — butun ta’lim jarayoniga taalluqli yirik pedagogik texnologiyalar. Muammoli, tabaqalashtirilgan, integratsion, shaxsga yo‘naltirilgan, rivojlantiruvchi, modulli yoki masofaviy ta’lim kabi yondashuvlar shu darajada ko‘rilishi mumkin.
- **Xususiy-metodik (mezo) daraja** — muayyan fan yoki kursni o‘qitish jarayonini loyihalash va rejalashtirish; texnologik model va xarita orqali konkret fan darslari tizimini tashkil etish.
- **Lokal (mikro) daraja** — o‘quv-tarbiya jarayonining alohida qismi yoki ma’lum ko‘nikma/sifatni shakllantirish texnologiyasi; masalan, mantiqiy fikrlashni rivojlantirish.

### Savolda qanday ajratiladi?
“Har bir dars uchun texnologik model/xarita” — mezo darajaga kuchli signal. “Butun ta’lim konsepsiyasi yoki yirik texnologiya” — makro. “Alohida ko‘nikmani shakllantirish” — mikro.

**Manba izi:** 2025 bahorgi pedagogik mahorat to‘plamidagi “Pedagogik texnologiya darajalari” nazariya jadvali.
$md$,
         updated_at=now()
   where l.slug='talim-texnologiyalari-va-vaziyatga-mos-tanlov'
     and exists(select 1 from public.modules m where m.id=l.module_id and m.code='M15')
     and position('[THEORY-CORPUS-2026-10-13]' in coalesce(l.body_mdx,''))=0;

  -- Fail closed: every canonical M14 construct and the expanded M15 lanes must now be non-empty.
  if exists (
    select 1
    from public.lessons l
    join public.modules m on m.id=l.module_id
    where m.code='M14' and l.order_idx between 1 and 7
      and (l.status<>'published'::public.content_status
           or length(coalesce(l.body_mdx,''))<1800)
  ) then
    raise exception 'PEDAGOGY_THEORY M14 canonical lesson expansion incomplete';
  end if;

  if exists (
    select 1
    from public.lessons l
    join public.modules m on m.id=l.module_id
    where m.code='M15'
      and l.slug in (
        'pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi',
        'dars-turlari-rejalashtirish-va-sinfni-boshqarish',
        'pedagogik-etika-nutq-texnika-va-takt',
        'pedagogik-qobiliyat-va-uning-turlari',
        'talim-texnologiyalari-va-vaziyatga-mos-tanlov'
      )
      and position('[THEORY-CORPUS-2026-10-13]' in coalesce(l.body_mdx,''))=0
  ) then
    raise exception 'PEDAGOGY_THEORY M15 source expansion incomplete';
  end if;
end
$theory$;

commit;

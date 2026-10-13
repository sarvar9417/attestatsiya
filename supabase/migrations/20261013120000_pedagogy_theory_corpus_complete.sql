-- Complete pedagogy theory coverage from the uploaded pedagogical corpus.
-- Original synthesis of supplied materials; historical question wording is not republished.
-- Marker: [THEORY-CORPUS-2026-10-13-P2]
begin;

do $complete$
begin
  update public.lessons l
     set body_mdx = l.body_mdx || $md$

## Pedagogik tadqiqot va ta’lim hujjatlari [THEORY-CORPUS-2026-10-13-P2]

### Pedagogik tadqiqot metodlari
Yuklangan pedagogik to‘plamlarda quyidagi metodlar qayta-qayta uchraydi:

- **Pedagogik kuzatish** — ta’lim-tarbiya jarayonini aniq maqsad asosida, izchil va tizimli kuzatib, muammo holati va o‘zgarishlar haqida dalil to‘plash.
- **Suhbat** — kuzatishda olingan ma’lumotni boyitish, vaziyatni chuqurroq tushunish va respondent fikrini ochishga xizmat qiladigan og‘zaki muloqot.
- **Anketa** — tizimlangan savollar orqali, ko‘pincha yozma javob shaklida ma’lumot yig‘ish.
- **Intervyu** — respondentga turkum savollar berib, muayyan hodisa yoki muammo jihatiga munosabatini aniqlash.
- **Ta’lim muassasasi hujjatlarini tahlil qilish** — pedagogik hodisa va dalillarni rasmiy hujjatlar, qaydlar va faoliyat materiallari orqali o‘rganish.
- **Test metodi** — nazariy bilim, amaliy ko‘nikma va malaka darajasini oldindan belgilangan mezonlar bo‘yicha aniqlash.
- **Pedagogik tahlil** — muammoning pedagogik, psixologik va nazariy jihatdan o‘rganilganlik holatini aniqlash va g‘oyani asoslash.
- **Bolalar ijodini o‘rganish** — kundalik, insho, yozma ish, referat va boshqa ijodiy mahsulotlar orqali individual qobiliyat hamda o‘zlashtirishni tahlil qilish.
- **Pedagogik tajriba (eksperiment)** — taklif etilgan metodika yoki sharoitning amaliy samaradorligini sinash va baholash.
- **Matematik-statistik metod** — tajriba natijalarini miqdoriy ko‘rsatkichlar va formulalar orqali qayta tahlil qilish.

### Davlat ta’lim standarti bilan bog‘liq atamalar
To‘plamlarda DTS tarkibiga oid quyidagi tushunchalar ham savol ko‘rinishida uchraydi:
- **tayanch o‘quv reja** — fanlar va minimal o‘quv yuklamasini sinflar bo‘yicha belgilovchi asos;
- **o‘quv dasturi** — fan mazmuni, hajmi, mavzular ketma-ketligi va shakllantiriladigan kompetensiyalarni belgilovchi hujjat;
- **malaka talablari** — majburiy ta’lim mazmuni va yakuniy natijalarga qo‘yiladigan talablar;
- **baholash tizimi** — o‘zlashtirish darajasi va ta’lim samaradorligini aniqlovchi mezonlar majmui.

To‘plamdagi terminologiyaga ko‘ra: **bilim** — ma’lumotni eslab qolish va qayta tushuntirish; **ko‘nikma** — bilimni tanish vaziyatda qo‘llash; **malaka** — shakllangan bilim-ko‘nikmani notanish vaziyatda qo‘llash va yangi bilim hosil qilish; **kompetensiya** — mavjud bilim, ko‘nikma va malakani kundalik faoliyatda qo‘llay olish.

**Manba izi:** 2024 va 2025 bahorgi PedMahoratGuli attestatsiya to‘plamlaridagi pedagogik tadqiqot metodlari va DTS nazariya jadvallari.
$md$,
         updated_at=now()
   where l.slug='pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi'
     and exists(select 1 from public.modules m where m.id=l.module_id and m.code='M15')
     and position('[THEORY-CORPUS-2026-10-13-P2]' in coalesce(l.body_mdx,''))=0;

  update public.lessons l
     set body_mdx = l.body_mdx || $md$

## Ta’lim tamoyillarini vaziyatdan aniqlash [THEORY-CORPUS-2026-10-13-P2]

### Asosiy tamoyillar
- **Onglilik va faollik** — o‘quvchi bilimni tayyor holda passiv qabul qilmaydi; mazmunni anglab, topshiriqda faol qatnashadi, fikr bildiradi va o‘z faoliyatini tushuntiradi.
- **Ko‘rgazmalilik** — mazmunni aniqroq va tushunarli qilish uchun rasm, sxema, jadval, model, tajriba va boshqa mos ko‘rgazmali vositalardan foydalaniladi.
- **Tizimlilik va muntazamlilik (izchillik)** — bilim ma’lum tartibda, mavzular orasidagi mantiqiy bog‘lanishni saqlagan holda va uzluksiz beriladi.
- **Ilmiylik** — o‘quv materiali fan nuqtayi nazaridan ishonchli va asoslangan bo‘ladi.
- **Tushunarlilik** — mazmun o‘quvchining yoshi, bilim darajasi va qabul qilish imkoniyatiga mos beriladi.
- **Nazariya va amaliyot birligi** — nazariy bilim real yoki amaliy vazifalarda qo‘llanadi.
- **Tarbiyaviylik** — ta’lim jarayoni bilim bilan birga qadriyat, munosabat va mas’uliyatni ham shakllantiradi.

### Imtihon signallari
- rasm, tajriba, model, sxema markazda bo‘lsa → ko‘rgazmalilik;
- “sodda tushuntirdi, lekin yosh/bilim darajasini hisobga olmadi” → tushunarlilik buzilgan;
- mavzular o‘zaro bog‘langan va ketma-ket davom ettirilgan → tizimlilik va muntazamlilik;
- o‘quvchi faol o‘ylaydi, tushuntiradi va mustaqil bajaradi → onglilik va faollik;
- nazariya real vaziyatda qo‘llanadi → nazariya-amaliyot birligi.

Bir vaziyatda bir nechta tamoyil bo‘lishi mumkin. Testda savolning **asosiy urg‘usi** qaysi tamoyilga qaratilganini tanlash kerak.

**Manba izi:** diagnostika.pdf dagi onglilik-faollik, ko‘rgazmalilik va tizimlilik-muntazamlilik moslashtirish savoli; Pedagogika testi 3.pdf va 2026 bahorgi to‘plamdagi ko‘rgazmalilik/tushunarlilik vaziyatlari.
$md$,
         updated_at=now()
   where l.slug='pedagogikaning-asosiy-tamoyillari'
     and exists(select 1 from public.modules m where m.id=l.module_id and m.code='M15')
     and position('[THEORY-CORPUS-2026-10-13-P2]' in coalesce(l.body_mdx,''))=0;

  update public.lessons l
     set body_mdx = l.body_mdx || $md$

## Tarbiya turlari va vaziyatni tasniflash [THEORY-CORPUS-2026-10-13-P2]

Tarbiya yaxlit jarayon, ammo attestatsiya savollarida ko‘pincha vaziyatdagi **yetakchi tarbiyaviy maqsad** aniqlanadi.

### To‘plamlarda uchraydigan asosiy turlar
- **Aqliy tarbiya** — ilm-fan, texnika va texnologiya haqidagi bilimlar orqali tafakkur, dunyoqarash va bilishga qiziqishni rivojlantirish.
- **Axloqiy tarbiya** — odob, mas’uliyat, hurmat, halollik va xulq me’yorlarini shakllantirish.
- **Estetik tarbiya** — go‘zallikni anglash, estetik his va did, san’atga qiziqish hamda ijodiy ehtiyojni rivojlantirish.
- **Mehnat tarbiyasi** — mehnatga ongli, mas’uliyatli munosabat va amaliy mehnat ko‘nikmalarini shakllantirish.
- **Jismoniy tarbiya** — sog‘lom jismoniy rivojlanish va jismoniy madaniyatni qo‘llab-quvvatlash.
- **Ekologik tarbiya** — tabiat va resurslarga mas’uliyatli munosabatni shakllantirish.
- **Huquqiy tarbiya** — huquq, majburiyat va qonuniy xulq haqidagi tushunchalarni shakllantirish.
- **Fuqarolik/vatanparvarlik tarbiyasi** — jamiyat va Vatanga mas’uliyat, fuqarolik pozitsiyasi va ijtimoiy faollikni rivojlantirish.

### Vaziyatni yechish
Rassomlik va musiqa asarlarini tahlil qilib go‘zallikni his qilish — **estetik tarbiya**. Fan-texnika yutuqlari orqali tafakkurni shakllantirish — **aqliy tarbiya**. Bir faoliyat bir nechta tarbiya turiga xizmat qilishi mumkin; savolda eng bevosita maqsadga e’tibor bering.

### Tarbiyaviy ta’sirda ehtiyotkorlik
Manbalardagi vaziyatlar o‘quvchining qadr-qimmati, individual holati va pedagogik taktni saqlash zarurligini ko‘rsatadi. Tarbiya shaxsni kamsitish bilan tenglashtirilmaydi.

**Manba izi:** 2025 bahorgi pedagogik mahorat to‘plamidagi aqliy va estetik tarbiya savollari; Pedagogika testi 3.pdf dagi estetik tarbiya vaziyati; kasbiy standartning tarbiyaviy faoliyat sohasi.
$md$,
         updated_at=now()
   where l.slug='tarbiya-va-uning-turlari'
     and exists(select 1 from public.modules m where m.id=l.module_id and m.code='M15')
     and position('[THEORY-CORPUS-2026-10-13-P2]' in coalesce(l.body_mdx,''))=0;

  update public.lessons l
     set body_mdx = l.body_mdx || $md$

## Sinf rahbarining amaliy vazifalari [THEORY-CORPUS-2026-10-13-P2]

Yuklangan amaliy testlarda sinf rahbarining roli uch asosiy yo‘nalishda takrorlanadi:

1. **O‘quvchining shaxsiy rivojlanishini kuzatish.** O‘zlashtirish, xulq, moslashuv, qiziqish va qiyinchiliklarni vaqtida aniqlash.
2. **Sinf jamoasini shakllantirish.** Hamkorlik, o‘zaro hurmat, ijobiy psixologik muhit va jamoaviy faoliyatni tashkil etish.
3. **Ota-onalar va zarur mutaxassislar bilan hamkorlik.** Ota-onani faqat muammo chiqqanda chaqirish emas, o‘quvchi rivoji va ta’lim jarayoniga muntazam jalb qilish.

### Yordamchi ta’lim shakllari
Tarixiy savol to‘plamida fan to‘garagi, fakultativ mashg‘ulot, o‘qituvchi maslahati, o‘quv ekskursiyasi va o‘quv konferensiyasi darsdan tashqari yordamchi shakllar sifatida uchraydi.

### Nizoli vaziyat
Sinf rahbari nizoda bir tomonni darhol aybdor deb e’lon qilish o‘rniga vaziyatni xolis o‘rganadi, tomonlarni tinglaydi, sabab va oqibatni aniqlaydi hamda kelishuvga yo‘naltiradi. Zarur bo‘lsa ota-ona, psixolog yoki boshqa mutaxassis jalb etiladi.

### Hujjat bilan ishlash
Sinfga oid qayd va hujjatlar pedagogik qaror uchun dalil bo‘lishi kerak: aniq, o‘z vaqtida, ehtiyotkor va maxfiylik talablariga mos yuritiladi. Yuklangan manbalar bu bo‘limda hujjatlarning to‘liq rasmiy ro‘yxatini bermaydi; shu sabab platforma nazariyasida manbada yo‘q aniq hujjatlar ro‘yxati o‘ylab topilmadi.

**Manba izi:** Pedagogika testi 3.pdf sinf rahbari majburiyati savoli; 2024–2025 attestatsiya to‘plamlaridagi darsdan tashqari yordam shakllari, ota-ona va nizoli vaziyatlar.
$md$,
         updated_at=now()
   where l.slug='sinf-rahbari-hujjatlar-jamoa-va-ota-ona'
     and exists(select 1 from public.modules m where m.id=l.module_id and m.code='M15')
     and position('[THEORY-CORPUS-2026-10-13-P2]' in coalesce(l.body_mdx,''))=0;

  update public.lessons l
     set body_mdx = l.body_mdx || $md$

## Fan metodikasida yondashuvni tanlash [THEORY-CORPUS-2026-10-13-P2]

Rasmiy spetsifikatsiya informatika o‘qitish metodikasi bo‘yicha fan mazmunini o‘qitish yondashuvlari, metodikasi va texnologiyalarini bilishni talab qiladi. Yuklangan pedagogik testlar esa bu talabni vaziyatlarda qanday so‘ralishini ko‘rsatadi.

### Muammoli o‘qitish
O‘quvchi oldiga tayyor javob o‘rniga muammo yoki ziddiyat qo‘yiladi. Maqsad — muammoni anglash, sabablarni tahlil qilish va asoslangan yechimga kelish.

### Hamkorlikdagi o‘qitish
O‘quvchilar umumiy maqsad uchun guruhda ishlaydi, fikr almashadi va bir-birining faoliyatiga tayanadi. Guruh ishining o‘zi avtomatik ravishda hamkorlikdagi o‘qitish emas; rollar va umumiy natija bo‘lishi muhim.

### Tadqiqot/izlanish yondashuvi
O‘quvchi savol yoki muammoni mustaqil tahlil qilib, dalil yig‘adi, taxmin yoki yechim ishlab chiqadi va xulosasini asoslaydi.

### Informatika uchun qo‘llash
Algoritm, dasturlash, ma’lumotlar bazasi yoki tarmoq mavzusida metod tanlashda “qaysi vosita zamonaviy?” degan savoldan ko‘ra “o‘quvchi qaysi amaliy va fikrlash harakatini bajarishi kerak?” degan savol asosiy.

**Manba izi:** 2026 rasmiy spetsifikatsiya, Informatika o‘qitish metodikasi 2.2; pedagogika6.pdf dagi muammoli + kooperativ + tadqiqot metodlari vaziyati.
$md$,
         updated_at=now()
   where l.slug='informatika-oqitish-yondashuvlari-va-metodikasi'
     and exists(select 1 from public.modules m where m.id=l.module_id and m.code='M16')
     and position('[THEORY-CORPUS-2026-10-13-P2]' in coalesce(l.body_mdx,''))=0;

  update public.lessons l
     set body_mdx = l.body_mdx || $md$

## O‘qitish metodlarini farqlash: imtihon belgilariga e’tibor [THEORY-CORPUS-2026-10-13-P2]

### Muammoli bayon
O‘qituvchi muammoli vaziyatni yaratadi, qarama-qarshilik yoki muammo sabablarini ko‘rsatadi, so‘ng yechimni **o‘zi** mantiqiy izchillikda bayon qiladi. O‘quvchi tayyor faktni emas, yechimga boruvchi fikrlash jarayonini kuzatadi.

### Evristik yondashuv
O‘qituvchi tayyor javobni bermaydi; yo‘naltiruvchi savol va topshiriqlar orqali o‘quvchini yechimga yaqinlashtiradi. Yuklangan to‘plamlarda guruhlarda turli yechim izlash va natijani taqdim etish evristik faoliyat signali sifatida uchraydi.

### Tadqiqot (izlanish) metodi
Muammo bo‘yicha mustaqil tahlil, izlanish, dalil va xulosa markazda. O‘qituvchi jarayonni tashkil qiladi, lekin yechimning asosiy mantiqini o‘quvchi ishlab chiqadi.

### Suhbat metodi
O‘qituvchi savollar orqali avvalgi bilimni faollashtiradi, tushunishni aniqlaydi yoki o‘quvchini yangi xulosaga yo‘naltiradi. Savol-javobning didaktik maqsadi muhim.

### Amaliy metod
O‘quvchi nazariy tushunchani real o‘lchash, tajriba, hisoblash yoki amaliy bajarish orqali o‘zlashtiradi va tekshiradi.

### Interfaol metodlar
To‘plamlarda **Asalari galasi**, **Ajurli arra**, **Aqliy hujum**, **Qarorlar shajarasi** kabi nomlar uchraydi. Metod nomini yodlashdan ko‘ra vaziyatdagi ishtirok shakli va kutiladigan natijani aniqlash muhim.

### Analitik/sintetik atamalar bo‘yicha ehtiyotkorlik
2026 bahorgi to‘plamning bir savolida “talab qilinayotgan kattalikdan boshlab berilgan kattaliklarga tomon borish” **sintetik usul** deb berilgan. Bu terminologiya boshqa metodik manbalarda boshqacha tasniflanishi mumkin; platforma bu tarixiy javobni mustaqil nazariy qoida sifatida tasdiqlamaydi va editorial tekshiruvsiz savol kaliti sifatida nashr etmaydi.

**Manba izi:** diagnostika.pdf dagi muammoli bayon savoli; pedagogika6.pdf; 2024–2026 PedMahoratGuli tarixiy to‘plamlari. Analitik/sintetik atama alohida review talab qiladi.
$md$,
         updated_at=now()
   where l.slug='oqitish-usullari-va-metodlarini-farqlash'
     and exists(select 1 from public.modules m where m.id=l.module_id and m.code='M16')
     and position('[THEORY-CORPUS-2026-10-13-P2]' in coalesce(l.body_mdx,''))=0;

  update public.lessons l
     set body_mdx = l.body_mdx || $md$

## Ta’limiy vaziyatdagi qarorni baholash algoritmi [THEORY-CORPUS-2026-10-13-P2]

Rasmiy spetsifikatsiya fan sohasini o‘qitish bo‘yicha berilgan ta’limiy vaziyatga oid qarorlarga baho bera olishni talab qiladi.

### 5 bosqichli tahlil
1. **Maqsadni aniqlang** — o‘quvchi nimani bilishi yoki bajara olishi kerak?
2. **Dalilni toping** — vaziyatda o‘quvchi faoliyatining qaysi natijasi kuzatiladi?
3. **Muammoni ajrating** — metod, resurs, vaqt, tushuntirish, diagnostika yoki boshqaruvdan qaysi biri yetishmayapti?
4. **Eng kichik maqsadli o‘zgarishni tanlang** — hamma narsani almashtirish emas, muammo sababiga mos chorani toping.
5. **Qayta tekshiring** — o‘zgarishdan keyin o‘quvchi natijasi yaxshilandimi?

### Informatika vaziyatlari
- Algoritm natijalari past bo‘lsa, o‘qituvchi o‘z metodini tahlil qilib, masalan, matnli kod bilan birga blok-sxema yoki qadamli vizualizatsiya zarurligini ko‘rib chiqadi.
- Dastur xatosida tayyor kodni berishdan ko‘ra, xato sababini aniqlashga yo‘naltiruvchi savol mustaqil debugging ko‘nikmasini rivojlantiradi.
- SQL so‘rovida noto‘g‘ri natija chiqsa, WHERE shartining namunaviy satrlarga qanday tatbiq bo‘lishini tekshirtirish muammoni konkretlashtiradi.
- Guruhli informatika ishida hamma o‘quvchi faol bo‘lmasa, tekshiriladigan rollar va individual dalil kiritiladi.

### Qarorni baholash mezonlari
Qaror o‘quv maqsadiga mosmi? O‘quvchining yoshi va tayyorgarligini hisobga oladimi? Faol va kuzatiladigan ish bormi? Baholash dalili bormi? Xavfsizlik va pedagogik etikaga mosmi?

**Manba izi:** 2026 rasmiy spetsifikatsiya 2.2; 2026 tarixiy to‘plamdagi algoritmlash metodikasini refleksiya qilish vaziyati; platformadagi source-backed M16 yondashuvlari.
$md$,
         updated_at=now()
   where l.slug='talimiy-vaziyat-va-pedagogik-qarorni-baholash'
     and exists(select 1 from public.modules m where m.id=l.module_id and m.code='M16')
     and position('[THEORY-CORPUS-2026-10-13-P2]' in coalesce(l.body_mdx,''))=0;

  if exists (
    select 1
    from public.lessons l
    join public.modules m on m.id=l.module_id
    where m.code='M15' and l.order_idx between 1 and 8
      and (l.status<>'published'::public.content_status or length(coalesce(l.body_mdx,''))<2000)
  ) then
    raise exception 'PEDAGOGY_THEORY_P2 M15 canonical coverage incomplete';
  end if;

  if exists (
    select 1
    from public.lessons l
    join public.modules m on m.id=l.module_id
    where m.code='M16' and l.order_idx between 1 and 3
      and (l.status<>'published'::public.content_status
           or position('[THEORY-CORPUS-2026-10-13-P2]' in coalesce(l.body_mdx,''))=0)
  ) then
    raise exception 'PEDAGOGY_THEORY_P2 M16 coverage incomplete';
  end if;
end
$complete$;

commit;

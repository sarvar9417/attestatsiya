-- M15 nazariyasini foydalanuvchi yuborgan 2024–2026 pedagogika korpusi
-- asosida chuqurlashtirish. Faqat kontent; imtihon kalitlari o'zgarmaydi.
-- Bu migration ishchi branchda qoladi, productionga qo'llanmaydi.
begin;

with additions(lesson_id, extra) as (
  values
  ('15000000-0000-4000-8000-000000000001'::uuid, $md$
## Chuqurlashtirilgan nazariya — manba korpusi (2026-10-18)

### Pedagogik mahoratning to‘rt tayanch jihati

Pedagogik mahorat faqat fan bo‘yicha bilimga teng emas. Manbadagi tizim: **insonparvar yo‘nalish**, **kasbiy bilim**, **pedagogik qobiliyat** va **pedagogik texnika**. Ular bir-biriga bog‘liq. O‘qituvchi nazariyani mukammal bilib, ammo o‘quvchining qiyinchiligini anglamasa, bilim berishning samarasi pasayishi mumkin.

| Tarkib | Darsdagi ko‘rinishi | Nimadan farqlanadi? |
|---|---|---|
| Insonparvar yo‘nalish | O‘quvchining qadr-qimmatini asraydi | Faqat yumshoqlik yoki talabchanlik emas |
| Kasbiy bilim | Fan, pedagogika va psixologiyani qo‘llaydi | Faqat faktlarni yod bilish emas |
| Pedagogik qobiliyat | Murakkab mazmunni tushunarli qiladi, sinfni uyushtiradi | Tayyor metodik ko‘rsatmaga ko‘r-ko‘rona ergashish emas |
| Pedagogik texnika | Nutq, mimika, ovoz, vaziyatdagi o‘zini boshqarishni uyg‘unlashtiradi | Shunchaki baland ovozda gapirish emas |

### Ta’lim — tarbiya — rivojlanish

**Ta’lim** bilim, ko‘nikma va kompetensiyalarni egallash jarayoni. **Tarbiya** qadriyat, munosabat va xulqni maqsadli shakllantirishdir. **Rivojlanish** esa fikrlash, hissiyot, iroda, ijtimoiy tajriba va boshqa sifatlarning o‘zgarib borishini qamrab oladi. Bitta darsda uchalasi ham kuzatilishi mumkin; savolda yetakchi maqsadni topish kerak.

**Pedagogika** — keng fan; **didaktika** — uning ta’lim va o‘qitish nazariyasiga oid qismi. **Metodika** esa aniq fanni yoki mazmunni qanday o‘qitish yo‘llarini o‘rganadi. Masalan, “ta’lim tamoyillari” — didaktik tushuncha, “Python siklini misollar orqali o‘rgatish ketma-ketligi” — predmet metodikasiga yaqin.

### Mustaqil tekshiruv uchun vaziyat

O‘qituvchi bir o‘quvchining noto‘g‘ri javobidan keyin uning tayanch tushunchani bilmasligini aniqlaydi va tushuntirishni qayta tuzadi. Bu yerda **o‘quvchini tushunish** va **didaktik moslashtirish** birga ishlagan. Savol faqat “o‘quvchining ruhiy holatini sezish”ga urg‘u bersa — perseptiv qobiliyat; “materialni qayta tuzish”ga urg‘u bersa — didaktik yoki konstruktiv harakat.

**Manbalar:** Xoliqov *Pedagogik mahorat.pdf*, 1–3-betlar; *Pedagogik qobilyatlar umumiy.pdf*, 1–2-betlar. Atamalar ushbu manbalardan mustaqil sintez qilingan; tarixiy test kalitlari avtomatik haqiqat sifatida qabul qilinmaydi.
$md$),

  ('15000000-0000-4000-8000-000000000002'::uuid, $md$
## Chuqurlashtirilgan nazariya — manba korpusi (2026-10-18)

### Xulosa chiqarish yo‘nalishi: induksiya, deduksiya, analogiya

| Usul | Fikrlash yo‘nalishi | Darsdagi namuna |
|---|---|---|
| Induksiya | Alohida holatlardan umumiy xulosaga | Bir nechta tajribani kuzatib, umumiy qoidani ifodalash |
| Deduksiya | Umumiy qoidadan xususiy holatga | Ma’lum qoida yordamida alohida masalani yechish |
| Analogiya | Bir xususiy holat o‘xshashligidan boshqa holat haqida taxmin | Bir tizimdagi o‘xshash funksiyaga qarab ikkinchisi haqida faraz qilish |

**Muhim farq:** induktiv xulosa kuzatilgan misollar bilan asoslanadi, ammo barcha ehtimoliy holatlar avtomatik isbotlangan bo‘lmaydi. Analogiya ham qat’iy isbot emas — taxminni tekshirish kerak. Deduksiyada esa umumiy qoida va qo‘llash shartlari to‘g‘ri bo‘lsa, xususiy xulosa mantiqan kelib chiqadi.

### Tamoyilni metod bilan aralashtirmang

**Ta’lim tamoyili** — o‘qitishni tashkil etishning umumiy talabi (masalan, ilmiylik, tushunarlilik, tizimlilik). **Metod** — shu talab asosida maqsadga erishish yo‘li (masalan, suhbat, namoyish, mashq, muammoli savol). **Vosita** — metodni amalga oshirishda ishlatiladigan resurs (slayd, model, tarqatma, kompyuter). **Shakl** — faoliyatning tashkiliy tuzilishi (yakka, guruhli, frontal).

Misol: “Ko‘rgazmalilik” — tamoyil; “namoyish qilish” — metod; “animatsion slayd” — vosita. Savolda rasm ishlatilgani uchun avtomatik ravishda “konstruktiv qobiliyat” deyish mumkin emas; vazifaning markazi darsni rejalash yoki vositani ko‘rsatishga bog‘liq.

### Diagnostik taqqoslash

- O‘quvchi qoida ma’nosini tushuntira olmayapti, ammo yod aytadi: onglilik va faollik tamoyilini tekshiring.
- O‘qituvchi oldingi bilimga tayangan holda yangi mazmunni bosqichma-bosqich beradi: tizimlilik va izchillik.
- Misollar o‘quvchilarning yoshi va tayyorgarligiga mos emas: tushunarlilik va individual yondashuv.
- Nazariy tushuncha amaliy vaziyatga ko‘chmayapti: nazariya bilan amaliyot birligi.

**Manbalar:** *Pedmahorat to‘plam 2025 kuzgi(1).pdf*, 2-bet (induksiya, deduksiya, analogiya); *Dars turlari.pdf*, 1-bet (dars vazifalarining ketma-ketligi); M15 bazaviy didaktika darslari.
$md$),

  ('15000000-0000-4000-8000-000000000003'::uuid, $md$
## Chuqurlashtirilgan nazariya — manba korpusi (2026-10-18)

### Tarbiyaning maqsadi va metodi

Tarbiya turini faoliyatning tashqi ko‘rinishiga qarab emas, **yetakchi pedagogik maqsad** orqali aniqlash to‘g‘riroq. Bir xil o‘quv tadbiri bir nechta tarbiyaviy yo‘nalishni qamrashi mumkin: ko‘chat ekish mehnat, ekologik, estetik va jamoaviy mas’uliyatni birlashtirishi mumkin. Testda “nima shakllantirilmoqda?” degan savolga qayting.

| Tarbiyaviy vazifa | Yetakchi yo‘nalish |
|---|---|
| Mas’uliyat, halollik va odob haqidagi qarorlarni muhokama qilish | Axloqiy |
| Fuqarolik burchi, jamoat ishida ishtirok etish | Fuqarolik |
| Mehnat jarayonini rejalash va ish natijasi uchun javob berish | Mehnat |
| Tabiiy resurslarga ehtiyotkor munosabat | Ekologik |
| Go‘zallikni idrok qilish va ijodiy didni rivojlantirish | Estetik |

**Rag‘batlantirish**, **namuna**, **mashq**, **ishontirish**, **tushuntirish**, **refleksiya** kabi metodlarning samarasi vaziyatga bog‘liq. Jazoni birinchi va universal yechim deb tanlamang: avval vaziyatning sababi, xavfsizlik, o‘quvchining ehtiyoji va oldini olish choralarini tahlil qiling.

### Pedagogik ta’sirning ketma-ketligi

Manbada vaziyatga mos pedagogik ta’sirning quyidagi mantiqiy tartibi berilgan: **vaziyatni tahlil qilish → yechim variantlarini saralash → optimal metodni tanlash → ta’sirni amalga oshirish**. Bu qat’iy har bir darsdagi yagona algoritm emas, lekin testda shoshilinch qarorni tahlildan ajratish uchun foydali.

### Vaziyat: o‘quvchi vazifaga jalb etilmayapti

Darhol tanbeh berishdan oldin o‘quvchining vazifani tushunganini, topshiriq darajasini, jamoa bilan munosabatini va qo‘llab-quvvatlash ehtiyojini tekshiring. Shu dalillardan keyingina mos tarbiyaviy yoki didaktik metod tanlanadi.

**Manbalar:** *Attestatsiya to‘plam ped mahorat @PedMahoratGuli(2).pdf*, 2-bet, pedagogik ta’sir ketma-ketligi; *Xoliqov Pedagogik mahorat.pdf*, pedagogik mahorat va insonparvarlik bo‘limlari. Tarixiy test javobi o‘quv nazariyasini mustaqil tekshirishni almashtirmaydi.
$md$),

  ('15000000-0000-4000-8000-000000000004'::uuid, $md$
## Chuqurlashtirilgan nazariya — manba korpusi (2026-10-18)

### Darsning didaktik vazifasiga ko‘ra turlari

| Dars turi | Yetakchi maqsad | Belgilovchi faoliyat |
|---|---|---|
| Aralash (kombinatsiyalashgan) | Bir necha didaktik vazifani uyg‘unlashtirish | Tekshirish, yangi bilim, mustahkamlash, baholash |
| Yangi material bilan tanishish | Yangi tushuncha va usulni shakllantirish | Tayanch bilimni faollashtirish, tushuntirish, ilk qo‘llash |
| Mustahkamlash va takrorlash | O‘rganilgan bilimni barqarorlashtirish | Og‘zaki-yozma mashq, qayta aloqa |
| Umumlashtirish va tizimlashtirish | Alohida mavzular orasidagi bog‘liqlikni ochish | Taqqoslash, tizim tuzish, yakuniy xulosa |
| Ko‘nikma va malakani shakllantirish | Bilimni faoliyatga ko‘chirish | Amaliy mashq va yangi vaziyatlarda qo‘llash |
| Bilimni tekshirish va baholash | Egallangan natijani aniqlash | Diagnostik vazifa, nazorat, mezonli baholash |

Darsda yangi material uchrashi uning albatta “yangi bilim berish darsi” ekanini anglatmaydi. Testda qaysi didaktik vazifa **ustun** ekanini aniqlang.

### Dars tahlilining besh turi

| Tahlil | Kuzatiladigan jihat |
|---|---|
| Didaktik (ta’limiy) | Mazmunning ilmiyligi, izchilligi, tushunarliligi va hayotga bog‘lanishi |
| Uslubiy (metodik) | Tanlangan metod, tashkiliy shakl va o‘quvchi xususiyatlariga moslik |
| Metodologik | Ta’lim yondashuvi, konseptual asoslar va tegishli talablar bilan uyg‘unlik |
| Psixologik | Diqqat, motivatsiya, sinfdagi ruhiy muhit va individual farqlar |
| Pedagogik | Muomala, pedagogik odob, tarbiyaviy ta’sir va o‘qituvchi mahorati |

**Chalg‘ituvchi yaqinlik:** “O‘quvchilar yoshiga metod mos keladimi?” — uslubiy tahlilga yaqin; “ular diqqatini jamlay oldimi?” — psixologik tahlilga yaqin; “material ilmiy va izchilmi?” — didaktik tahlilga yaqin. Bitta kuzatuv turli tahlillarga xizmat qilishi mumkin — savolning markaziga qarang.

### Dars kuzatuvidan keyingi refleksiya

1. Kuzatilgan faktni bahodan ajrating (“8 o‘quvchidan 3 tasi topshiriqni yakunladi”).
2. Maqsad va kutilgan natijaga solishtiring.
3. Sababni birgina o‘quvchiga yuklamang: metod, vaqt, material, oldingi bilim va muhitni tekshiring.
4. Keyingi dars uchun bitta aniq o‘zgarishni rejalashtiring.
5. O‘zgarish ta’sirini yangi dalil bilan baholang.

**Manbalar:** *Dars turlari.pdf*, 1–2-betlar; *dars tahlili turlari.pdf*, 1-bet; *Pedmahorat to‘plam 2025 kuzgi(1).pdf*, 2-bet (refleksiya vaziyati).
$md$)
)
update public.lessons l
set body_mdx = l.body_mdx || E'\n\n' || a.extra,
    updated_at = now()
from additions a
where l.id = a.lesson_id
  and l.status = 'published'::public.content_status
  and position('## Chuqurlashtirilgan nazariya — manba korpusi (2026-10-18)' in l.body_mdx) = 0;

commit;

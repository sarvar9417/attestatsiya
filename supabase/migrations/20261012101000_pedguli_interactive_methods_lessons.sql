-- Append original additional M14/M15/M16 pedagogy lessons inspired by PUBLIC themes.
-- Not a verbatim reproduction of @PedMahoratGuli materials.
-- Safe and idempotent; existing lesson IDs and progress retained. No production until user approval.
begin;
do $educ$
declare r record;
begin
  for r in select * from (values
    ('M15'::text, 'talim-texnologiyalari-va-vaziyatga-mos-tanlov'::text, $note$## Interfaol metodlarni farqlash — qo‘shimcha amaliy qo‘llanma [PEDGULI-STUDY-2026-01]

Bu qism ochiq pedagogik savollarda tez-tez uchraydigan mavzular asosida **mustaqil yozilgan o‘quv izohi**. Quyidagi atamalarni ta’rifni yodlash bilan emas, vaziyatning belgilari orqali taning.

| Metod | Hal qiluvchi belgi | Chalkashtirmang |
|---|---|---|
| **Akvarium** | Ichki kichik guruh mavzuni muhokama qiladi; tashqi guruh kuzatadi va tahlil qiladi; rollar almashadi | Shunchaki barcha guruhning bir vaqtda munozarasiga teng emas |
| **Asalari galasi** | Kichik guruhlar qisqa vaqtda ko‘p fikr almashadi, umumiy xulosaga keladi | Uzoq muddatli loyiha bilan bir xil emas |
| **Ajurli arra (Jigsaw)** | O‘quvchilar materialning bo‘laklarini ekspert guruhda o‘rganib, asl guruhiga o‘rgatadi | Akvariumdagi kuzatuvchi doira rolidan farq qiladi |
| **Keys-stadi** | Haqiqiy yoki modellashtirilgan vaziyatdagi dalillarni tahlil qilib qaror asoslanadi | Avval tayyor javob beriladigan mashq bilan teng emas |
| **Loyiha ta’limi** | Muammo → tadqiqot → reja → mahsulot → taqdimot va refleksiya | Har qanday kichik guruh ishi loyiha emas |
| **Individual/differensial yondashuv** | O‘quvchi ehtiyoji, sur’ati, murakkablik yoki ko‘mak moslashtiriladi | Maqsadni pasaytirish shart emas |
| **Muammoli ta’lim** | Bilishdagi muammo yoki ziddiyat qo‘yilib, izlanish bilan yechim topiladi | O‘qituvchining oddiy fakt savoli hamisha muammo bo‘lavermaydi |

### Asoslangan tanlov algoritmi

1. **O‘quv natijasi**: qaysi bilim yoki ko‘nikma tekshiriladi?
2. **Vazifa turi**: tezkor fikrlar, kichik mavzu bo‘laklari, kompleks qaror yoki uzoq loyiha?
3. **Ishtirokchi roli**: ekspert o‘rgatadimi, kuzatuvchi tahlil qiladimi, hamma birgalikda yaratadimi?
4. **Baholash dalili**: tushuntirish, kuzatuv varaqasi, mahsulot, xato tahlili yoki loyiha hisoboti?

### Mini-keys

*Bir guruh ma’lumotlarni shifrlash usullarini, ikkinchisi parollarni boshqarishni o‘rganadi. Har bir guruh vakili boshqa guruhga o‘z qismi bo‘yicha tushuntirish beradi.* Eng mos metod — **Ajurli arra**, chunki har o‘quvchi alohida bo‘lak bo‘yicha ekspert bo‘lib boshqalar bilan bilim almashadi.

**Manba izi:** M15 tayanch darsi; 2026 attestatsiya spetsifikatsiyasi 2-jadvali; @PedMahoratGuli ochiq postlarida uchragan interfaol metodlar. Bu matn kanal postlaridan ko‘chirilmagan.$note$::text),
    ('M15'::text, 'pedagogik-qobiliyat-va-uning-turlari'::text, $note$## Pedagogik xayol va oldindan ko‘ra olish [PEDGULI-STUDY-2026-01]

**Pedagogik xayol** o‘qituvchining darsdagi ehtimoliy holat, savol, o‘quvchi qiyinchiliklari va alternativ yechimlarni oldindan tasavvur qila olishi bilan bog‘liq. Misol: mavzuni o‘qitishdan oldin qaysi tushuncha chalkashishini taxmin qilib, qarshi misol tayyorlash.

**Perseptiv qobiliyat** ayni paytda o‘quvchining kayfiyati, tushunish darajasi yoki noverbal belgilarini idrok etish bilan ajraladi.

**Didaktik qobiliyat** esa mavzuni o‘zlashtirishga qulay vosita va tushuntirishni tanlash orqali namoyon bo‘ladi.

**Pedagogik texnika** — ovoz, mimika, nutq sur’ati, diqqat va o‘z hissiy holatini boshqarish singari amaliy vositalar. Bu qobiliyatlarning nomlarini almashtirib yubormang.

### Mustaqil solishtirish

- O‘qituvchi darsdan **avval** o‘quvchilarning odatiy xatolarini taxmin qildi → *pedagogik xayol*.
- Javob vaqtida o‘quvchining ikkilanishini sezdi → *perseptiv qobiliyat*.
- Fikrni yangi sodda misol bilan tushuntirdi → *didaktik qobiliyat*.
- Ovozi va ifodasini vaziyatga moslashtirdi → *pedagogik texnika*.

**Manba izi:** M15 pedagogik qobiliyat va pedagogik texnika mavzulari; kanalning ochiq savollari mavzu signali sifatida tekshirildi, asl savol matni takrorlanmadi.$note$::text),
    ('M14'::text, 'xavfsiz-rivojlantiruvchi-talim-muhiti'::text, $note$## Kasb standarti vazifasini vaziyatdan ajratish [PEDGULI-STUDY-2026-01]

Attestatsiya variantlarida o‘xshash mehnat vazifalarini to‘g‘ri farqlash talab qilinadi. Bir vaziyat bir necha yo‘nalishga tegishli bo‘lishi mumkin; **asosiy vazifa** va asosiy dalilga qarab tanlang.

- **KS.03 — baholash va qayta aloqa:** o‘zlashtirish dalillari aniqlanadi, xatoga mos aniq tavsiya beriladi.
- **KS.05 — xavfsiz rivojlantiruvchi muhit:** kamsitish, tazyiq yoki axborot xavfi oldi olinadi, hurmat va teng ishtirok ta’minlanadi.
- **KS.04 — tarbiyaviy faoliyat:** o‘quvchilarning mas’uliyat, qadriyat va ijtimoiy xulqi maqsadli rivojlantiriladi.
- **KS.07 — hamkorlik:** o‘qituvchi, ota-ona va mutaxassislar vazifalarni kelishadi, maxfiylik saqlanadi.

### Qaror misoli

Sinfda bir o‘quvchining kodidagi xato boshqalar tomonidan masxara qilinadi. O‘qituvchi avval masxarani to‘xtatib, xavfsiz va hurmatli muhitni tiklaydi (**KS.05**). Keyin aynan dastur xatosini konstruktiv tushuntiradi (**KS.03**). Birinchi va ikkinchi harakatni savoldagi urg‘uga qarab farqlang.

**Manba izi:** Kasb standarti A/03.6–A/05.6 va 2026-yil attestatsiya spetsifikatsiyasi. Kanal savolining ifodasi ko‘chirilmagan.$note$::text),
    ('M16'::text, 'oqitish-usullari-va-metodlarini-farqlash'::text, $note$## Informatikaga mos interfaol mashg‘ulotlar [PEDGULI-STUDY-2026-01]

**Akvarium** uchun dasturlash mavzusidagi holat: ichki guruh funksiyaning ikki xil yechimini bahslashadi, tashqi guruh algoritmning aniqligi va test qamrovini kuzatadi; keyin rollar almashadi.

**Ajurli arra** uchun mavzu: ekspert guruhlar *kirish ma’lumotlari*, *ma’lumotlarni qayta ishlash* va *natijani chiqarish* qismlarini o‘rganib, asosiy guruhiga qaytib butun dastur mantiqini tushuntiradi.

**Keys-stadi** uchun vazifa: maktabdagi foydalanuvchi parollari tarqalgani haqidagi holatni tahlil qilib, xavf, yechim, oqibat va xavfsiz harakatlar rejasi yoziladi.

**Muammoli ta’lim** uchun masala: ikkita to‘g‘ri ishlagandek ko‘ringan algoritm turli chegaraviy qiymatlarda har xil natija qaytaradi; o‘quvchilar sababni aniqlaydi va umumiy qoidaga keladi.

**Metodni tanlash mezoni:** o‘quv maqsadi, vazifa tabiati, kutiladigan o‘quvchi ishi va tekshiriladigan dalil. Informatika darsidagi texnik vositaning o‘zi metod o‘rnini bosmaydi.

**Manba izi:** Informatika o‘qitish metodikasi, M16; 2026 attestatsiya spetsifikatsiyasi 2-jadvali; @PedMahoratGuli ochiq metodik postlaridagi atama va pedagogik vaziyat turlari.$note$::text)
  ) as topics(module_code,lesson_slug,addition)
  loop
    if (select count(*) from public.lessons l join public.modules m on m.id=l.module_id
        where m.code=r.module_code and l.slug=r.lesson_slug
        and l.status='published'::public.content_status) <> 1 then
      raise exception 'missing_lesson_for_pedguli_addition: %.%',r.module_code,r.lesson_slug;
    end if;
    update public.lessons l set body_mdx = l.body_mdx || E'\n\n' || r.addition, updated_at=now()
    from public.modules m
    where l.module_id=m.id and m.code=r.module_code and l.slug=r.lesson_slug
      and position('[PEDGULI-STUDY-2026-01]' in coalesce(l.body_mdx,''))=0;
  end loop;
end
$educ$;
commit;

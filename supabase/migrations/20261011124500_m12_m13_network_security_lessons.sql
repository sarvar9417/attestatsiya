-- TASK-056: M12/M13 source-backed network, security and digital-services lessons.
--
-- Sources synthesized in original wording:
--   * ICT 11-sinf (2021): networks, devices, architectures/topologies,
--     IP addressing, internet services, security, digital signature/e-government.
--   * ICT 6-sinf (2021): internet search/email and safe information use.
--   * ICT 8-sinf (2020): SMM, CMS, LMS and MOOC.
--   * 2026 Informatics attestation specification: exact S6.NET/S7.SEC constructs.
--
-- Adds one published lesson per active S6.NET and S7.SEC construct.
-- Text is paraphrased; no textbook passage is copied.

begin;

do $$
declare
  v_m12 uuid;
  v_m13 uuid;
begin
  select id into strict v_m12 from public.modules where code = 'M12';
  select id into strict v_m13 from public.modules where code = 'M13';

  insert into public.lessons (
    id, module_id, order_idx, slug, title_uz, body_mdx, est_minutes, status
  )
  values
  (
    'c1200000-0000-4000-8000-000000000001', v_m12, 1,
    'tarmoqlar-va-qurilmalar',
    'Kompyuter tarmoqlari va tarmoq qurilmalari',
    $md$
## Maqsad

Kompyuter tarmog‘ining vazifasini tushuntirish, PAN/LAN/WAN kabi tarmoq ko‘lamlarini hamda NIC, switch, router, modem va WAP qurilmalarining vazifalarini farqlash.

## Tarmoq nima?

Kompyuter tarmog‘i qurilmalar o‘rtasida ma’lumot va resurs almashishga imkon beradigan bog‘lanishdir. Tarmoq orqali fayl, printer, internet ulanishi va boshqa xizmatlardan birgalikda foydalanish mumkin. Tarmoq turi qamrov hududi va vazifaga qarab tanlanadi: shaxsiy qurilmalar kichik PAN/WPANni, bino yoki maktab LAN/WLANni, uzoq hududlarni bog‘lash esa kengroq tarmoqni talab qiladi.

## Qurilmalarni farqlash

**NIC** kompyuterni tarmoqqa ulaydi va tarmoq interfeysini ta’minlaydi. **Switch** lokal tarmoqdagi qurilmalar o‘rtasida ma’lumotni kerakli yo‘nalishga uzatishga xizmat qiladi. **Router** turli tarmoqlar orasida paketlarni yo‘naltiradi. **Modem** internet xizmatiga ulanish jarayonida signal/aloqa turiga mos interfeys vazifasini bajaradi. **WAP** simsiz qurilmalarni tarmoqqa ulash uchun kirish nuqtasini yaratadi.

## Test strategiyasi

Savolda qurilma nomini emas, vazifani ajrating: “kompyuterni tarmoqqa ulash”, “lokal qurilmalar orasida uzatish”, “ikki tarmoq orasida yo‘naltirish” va “simsiz kirish” turli javoblarga olib keladi.

> **Manba izi:** ICT 11-sinf (2021), 19–25-darslar, PDF 129–165; 2026 attestatsiya spetsifikatsiyasi, 6-mazmun sohasi.
$md$,
    20, 'published'::public.content_status
  ),
  (
    'c1200000-0000-4000-8000-000000000002', v_m12, 2,
    'arxitektura-va-topologiyalar',
    'Tarmoq arxitekturasi va topologiyalari',
    $md$
## Maqsad

Client/server va peer-to-peer arxitekturalarini hamda yulduz, shina, halqa va gibrid topologiyalarini vaziyat va nosozlik oqibati bo‘yicha farqlash.

## Arxitektura

**Client/server** modelida xizmat yoki resurslarni markaziy server taqdim etadi, client qurilmalar esa ulardan foydalanadi. Bu markazlashgan boshqaruv va resurs nazoratini qulaylashtiradi. **Peer-to-peer** modelida qurilmalar teng huquqli tarzda resurs almashishi mumkin va alohida markaziy server talab qilinmasligi mumkin.

## Topologiya

Topologiya qurilmalar qanday bog‘langanini ifodalaydi. **Yulduz** topologiyasida tugunlar markaziy qurilmaga ulanadi; markaziy qurilma ishlamay qolsa butun segmentga ta’sir qilishi mumkin. **Shina** modelida umumiy asosiy aloqa yo‘li muhim nuqta bo‘ladi. **Halqa**da qurilmalar zanjirsimon halqa hosil qiladi. **Gibrid** topologiya bir necha topologiya xususiyatlarini birlashtiradi.

## Tahlil

Attestatsiya savolida “bitta tugun buzildi”, “markaziy qurilma buzildi” yoki “asosiy kabel uzildi” kabi shartlar berilishi mumkin. Avval qaysi komponent yagona nosozlik nuqtasi ekanini toping, keyin topologiyani aniqlang.

> **Manba izi:** ICT 11-sinf (2021), tarmoq komponentlari/arxitekturasi va topologiya, PDF 140–171.
$md$,
    20, 'published'::public.content_status
  ),
  (
    'c1200000-0000-4000-8000-000000000003', v_m12, 3,
    'ip-manzil-va-tarmoq-maskasi',
    'IP manzillash, tarmoq maskasi va tarmoq manzili',
    $md$
## Maqsad

IPv4 manzil tuzilishini tushunish, statik/dinamik va xususiy/global manzillarni farqlash hamda tarmoq maskasi yordamida tarmoq qismini aniqlash mantig‘ini qo‘llash.

## IP manzil

IPv4 manzil 32 bitdan iborat bo‘lib, odatda nuqta bilan ajratilgan to‘rtta o‘nlik qismda yoziladi. Har bir qurilma bir tarmoq doirasida yagona manzilga ega bo‘lishi kerak. **Statik** manzil o‘zgarmas qilib belgilanadi, **dinamik** manzil esa ulanish vaqtida berilib keyinchalik o‘zgarishi mumkin. Xususiy IP diapazonlari lokal tarmoqda, global manzillar esa internetdagi tashqi adreslashda ishlatiladi.

## Tarmoq maskasi

Tarmoq maskasi IP manzilning qaysi bitlari tarmoq qismini, qaysi bitlari tugun qismini ifodalashini aniqlash uchun ishlatiladi. Hisoblash savolida IP manzil va maskani ikkilik ko‘rinishda mos bitlar bo‘yicha tahlil qilish kerak; tarmoq manzili maska bilan belgilangan tarmoq qismini saqlaydi, host qismi esa tarmoq identifikatorida nol holatga keltiriladi.

## Ehtiyot bo‘ling

IP manzil, MAC manzil va domen nomi bir xil narsa emas. DNS odamga qulay domen nomini IP manzil bilan bog‘laydi. Savolda aynan qaysi identifikator yoki xizmat so‘ralayotganini tekshiring.

> **Manba izi:** ICT 11-sinf (2021), IP-manzillash va DNS, PDF 172–179; 2026 attestatsiya spetsifikatsiyasi: IP manzil, tarmoq maskasi va tarmoq manzilini hisoblash talabi.
$md$,
    22, 'published'::public.content_status
  ),
  (
    'c1200000-0000-4000-8000-000000000004', v_m12, 4,
    'internetdan-xavfsiz-va-maqsadli-foydalanish',
    'Internetdan xavfsiz va maqsadli foydalanish',
    $md$
## Maqsad

Internet va elektron xizmatlardan foydalanishda shaxsiy ma’lumot, akkaunt, elektron pochta va ulanish xavfsizligini saqlash bo‘yicha to‘g‘ri qarorlarni tanlash.

## Xavfsiz foydalanish

Internetdagi har bir xizmatga bir xil darajada ishonib bo‘lmaydi. Kuchli va maxfiy parol ishlatish, akkauntdan umumiy qurilmada chiqib ketish, xavfsizlik va maxfiylik sozlamalarini tekshirish, antivirus va dasturiy ta’minotni yangilab turish asosiy ehtiyot choralaridir.

Elektron pochta orqali bank karta ma’lumoti, parol yoki boshqa nozik ma’lumotni yuborish xavf tug‘dirishi mumkin. Kutilmagan havola yoki faylni ochishdan oldin yuboruvchini va mazmunni tekshirish zarur. Shaxsiy ma’lumotni saytda kiritishdan oldin xizmatning haqiqiyligi va nima uchun bu ma’lumot so‘ralayotganini baholang.

## Maqsadli foydalanish

Internetdan foydalanish faqat “sayt ochish” emas: kerakli ma’lumotni topish, manbani baholash, ishonchli xizmatni tanlash va natijani vazifaga mos ishlatish ham muhim. Xavfsizlik chorasi ishni to‘xtatish uchun emas, xavfni boshqarish uchun qo‘llanadi.

> **Manba izi:** ICT 6-sinf (2021), internet, qidiruv va elektron pochta xavfsizligi mavzulari; Cambridge+ 9-sinf, elektron xavfsizlik bo‘limi; ICT 11-sinf (2021), tarmoq va axborot xavfsizligi boblari.
$md$,
    18, 'published'::public.content_status
  ),
  (
    'c1200000-0000-4000-8000-000000000005', v_m12, 5,
    'brauzer-qidiruv-dns',
    'Brauzer, qidiruv tizimi va internetda axborot izlash',
    $md$
## Maqsad

Internet, WWW, brauzer, qidiruv tizimi, URL/domen va DNS tushunchalarini farqlash hamda samarali qidiruv so‘rovini tuzish.

## Tushunchalarni ajrating

**Internet** — tarmoqlar tarmog‘i; **WWW** esa internet orqali ishlaydigan veb-resurslar tizimidir. **Brauzer** veb-sahifalarni ochish va ko‘rsatish uchun ishlatiladigan dastur. **Qidiruv tizimi** internetdagi indekslangan resurslardan so‘rovga mos natijalarni topishga yordam beradi.

Domen nomi foydalanuvchiga eslab qolish oson bo‘lgan nom beradi. **DNS** domen/xost nomini mos IP manzilga bog‘lash vazifasini bajaradi. Shu sabab brauzer, qidiruv tizimi va DNS bir xizmat emas.

## Qidiruv strategiyasi

Umumiy so‘zlar o‘rniga mavzuni toraytiruvchi kalit so‘zlardan foydalaning. Natijani tanlashda sarlavha bilan cheklanmasdan manba, sana, muallif/tashkilot va mazmun mosligini tekshiring. Birinchi chiqqan natija avtomatik ravishda eng ishonchli natija bo‘lmaydi.

## Attestatsiya tuzog‘i

“Google” so‘zi ba’zan kompaniya, qidiruv tizimi yoki brauzer nomlari bilan aralashishi mumkin. Savolda funksiyani aniqlang: sahifani ko‘rsatish — brauzer, indeksdan topish — qidiruv tizimi, nomni IPga bog‘lash — DNS.

> **Manba izi:** ICT 6-sinf (2021), Internetda ishlash va qidiruv tizimlari, PDF 77–94; ICT 11-sinf (2021), DNS va internet xizmatlari, PDF 175–196.
$md$,
    19, 'published'::public.content_status
  ),

  (
    'd1300000-0000-4000-8000-000000000001', v_m13, 1,
    'xavfsizlik-tahdidlari-va-himoya',
    'Axborot xavfsizligi tahdidlari va himoya qatlamlari',
    $md$
## Maqsad

Axborotga tahdidni uning oqibati bilan bog‘lash va tashkiliy, dasturiy hamda texnik himoya choralarini vaziyatga mos tanlash.

## Nima himoyalanadi?

Axborot xavfsizligida ma’lumotning maxfiyligi, yaxlitligi va undan kerakli paytda foydalanish imkoniyati muhim. Tahdid ma’lumotni ruxsatsiz ko‘rish, o‘zgartirish, yo‘qotish yoki xizmatni izdan chiqarish ko‘rinishida bo‘lishi mumkin.

Bitta himoya vositasi barcha xavfni bartaraf etmaydi. Kuchli autentifikatsiya akkauntni himoya qiladi; kirish huquqlari kim nimani ko‘rishi yoki o‘zgartirishini cheklaydi; zaxira nusxa ma’lumot yo‘qolganda tiklashga yordam beradi; yangilanishlar ma’lum zaifliklarni yopadi; tarmoq himoyasi esa zararli yoki ruxsatsiz trafikni cheklashga xizmat qiladi.

## Vaziyatni tahlil qilish

Avval tahdidni aniqlang, keyin eng bevosita qarshi chorani tanlang. Masalan, “ma’lumot tasodifan o‘chirildi” vaziyatida antivirusdan ko‘ra zaxira nusxa muhimroq. “Begona foydalanuvchi tizimga kirdi” holatida esa autentifikatsiya va kirish nazorati markaziy ahamiyatga ega.

> **Manba izi:** ICT 11-sinf (2021), axborot, kompyuter va tarmoq xavfsizligi, PDF 256–285; 2026 attestatsiya spetsifikatsiyasi, 7-mazmun sohasi.
$md$,
    20, 'published'::public.content_status
  ),
  (
    'd1300000-0000-4000-8000-000000000002', v_m13, 2,
    'zararli-dastur-va-phishing',
    'Zararli dasturlar va phishing',
    $md$
## Maqsad

Zararli dastur bilan ijtimoiy muhandislikka asoslangan phishingni farqlash, alomat va tarqalish usuliga qarab xavfni aniqlash.

## Zararli dastur

Zararli dastur foydalanuvchi yoki tizimga zarar yetkazish, ma’lumotga ruxsatsiz kirish yoki tizim ishini buzish maqsadida yaratilgan dasturiy koddir. Turli zararli dasturlar turlicha tarqaladi va turli oqibat keltiradi, shuning uchun nomni yodlashdan ko‘ra xatti-harakatini tahlil qilish kerak.

## Phishing

**Phishing** ko‘pincha foydalanuvchini soxta xabar, sayt yoki murojaat orqali maxfiy ma’lumotini o‘zi berishga undashga qaratilgan. Xabar shoshilinchlik hissini yaratishi, tanish tashkilot nomidan yozilgandek ko‘rinishi yoki havola orqali login/parol kiritishni so‘rashi mumkin.

## Himoya

Noma’lum ilovani ishga tushirmaslik, kutilmagan fayl/havolani tekshirish, dasturiy ta’minotni yangilash va antivirusdan foydalanish zararli dastur xavfini kamaytiradi. Phishingda esa yuboruvchi va domenni tekshirish, maxfiy ma’lumotni xat orqali bermaslik va shubhali havola orqali login qilmaslik ayniqsa muhim.

> **Manba izi:** ICT 11-sinf (2021), kompyuter xavfsizligi, antivirus va kiberxavfsizlik, PDF 266–310; Cambridge+ 9-sinf, elektron xavfsizlik materiallari.
$md$,
    18, 'published'::public.content_status
  ),
  (
    'd1300000-0000-4000-8000-000000000003', v_m13, 3,
    'antivirus-va-himoya-vositalari',
    'Antivirus va himoya vositalari',
    $md$
## Maqsad

Antivirusning vazifasi va cheklovini tushunish, yangilanish, firewall, zaxiralash va kirish nazorati kabi vositalarni bir-biridan farqlash.

## Antivirus

Antivirus zararli dastur belgilarini aniqlash, shubhali fayllarni tekshirish va topilgan tahdidni bloklash yoki karantinga olishga yordam beradi. Antivirus bazasi va dasturining yangiligi muhim, chunki yangi tahdidlar paydo bo‘lib turadi.

## Boshqa himoya vositalari

**Firewall** tarmoq aloqalarini belgilangan qoidalar asosida nazorat qiladi. **Zaxira nusxa** tizim yoki fayl yo‘qolganida ma’lumotni qayta tiklash imkonini beradi. **Kirish nazorati** foydalanuvchining vakolatiga mos ruxsat beradi. **Shifrlash** esa ma’lumot mazmunini ruxsatsiz o‘qishdan himoyalashga xizmat qiladi.

## Muhim cheklov

“Antivirus o‘rnatilgan bo‘lsa, boshqa xavfsizlik kerak emas” degan xulosa noto‘g‘ri. Xavfsizlik qatlamli bo‘lishi kerak: foydalanuvchi xulqi, yangilanishlar, autentifikatsiya, ruxsatlar, tarmoq filtrlash va zaxiralash bir-birini to‘ldiradi.

> **Manba izi:** ICT 11-sinf (2021), 55–58-darslar, PDF 266–285; Cambridge+ 9-sinf, antivirus va xavfsiz internet bo‘limlari.
$md$,
    18, 'published'::public.content_status
  ),
  (
    'd1300000-0000-4000-8000-000000000004', v_m13, 4,
    'elektron-hukumat-va-elektron-imzo',
    'Elektron hukumat, elektron hujjat va elektron imzo',
    $md$
## Maqsad

Elektron hukumat xizmatlari, elektron hujjat aylanishi va elektron raqamli imzoning vazifalarini farqlash.

## Elektron xizmat

Elektron hukumat davlat organlari va foydalanuvchilar o‘rtasidagi ayrim xizmat va axborot almashinuvini raqamli muhitda tashkil etishga yordam beradi. Foydalanuvchi ariza yoki murojaatni elektron shaklda yuborishi, xizmat holatini kuzatishi yoki ma’lumot olishi mumkin.

## Elektron hujjat va imzo

Elektron hujjat axborot tizimi orqali yuborilishi va qabul qilinishi mumkin. **Elektron raqamli imzo (ERI)** elektron hujjatda imzo egasini tasdiqlash va hujjat yaxlitligini tekshirish jarayonlarida qo‘llanadi. ERIda yopiq kalit imzo yaratishda, unga mos ochiq kalit esa imzoni tekshirishda ishlatiladi.

Kalit va sertifikat tushunchalarini aralashtirmang: sertifikat ochiq kalitning egaga tegishliligini tasdiqlash zanjirining bir qismidir.

## Attestatsiya uchun

“Elektron hujjat”, “elektron imzo”, “ochiq kalit”, “yopiq kalit” va “elektron hukumat” bir-biriga bog‘liq, lekin bir xil tushunchalar emas. Savol qaysi vazifani so‘rayotganini aniqlang.

> **Manba izi:** ICT 11-sinf (2021), elektron imzo/hujjat almashinuvi va elektron hukumat, PDF 311–324.
$md$,
    20, 'published'::public.content_status
  ),
  (
    'd1300000-0000-4000-8000-000000000005', v_m13, 5,
    'smm-cms-lms-mooc',
    'SMM, CMS, LMS va MOOC tushunchalari',
    $md$
## Maqsad

SMM, CMS, LMS va MOOC atamalarini vazifasi va foydalanuvchi maqsadiga ko‘ra farqlash.

## SMM

**SMM (Social Media Marketing)** ijtimoiy media platformalari orqali auditoriya bilan ishlash, kontent tarqatish va loyiha yoki tashkilotni targ‘ib qilish faoliyatiga bog‘liq. Platformani tanlashda maqsadli auditoriya va kontent turi muhim.

## CMS

**CMS (Content Management System)** veb-sayt kontentini yaratish, tahrirlash, tartiblash va boshqarishga yordam beradigan tizimdir. CMSning asosiy markazi ta’limni boshqarish emas, veb-kontentni boshqarishdir.

## LMS va MOOC

**LMS (Learning Management System)** kurs materiali, topshiriq, test va o‘quv jarayonini boshqarish uchun ishlatiladi. Moodle va Google Classroom kabi platformalar o‘quv materialini va nazorat faoliyatini tashkil etishga xizmat qiladi.

**MOOC (Massive Open Online Course)** internet orqali ko‘p sonli o‘quvchiga ochiq tarzda ta’lim berishga mo‘ljallangan kurs modelidir. Unda video, matn, forum va mashqlar bo‘lishi mumkin. MOOCni LMS bilan tenglashtirmang: biri ommaviy onlayn kurs modeli, ikkinchisi ta’lim jarayonini boshqaruvchi tizim.

> **Manba izi:** ICT 8-sinf (2020), SMM PDF 5–36, CMS PDF 37–59, LMS PDF 60–76, MOOC PDF 77–93.
$md$,
    20, 'published'::public.content_status
  ),
  (
    'd1300000-0000-4000-8000-000000000006', v_m13, 6,
    'web-freelance-asoslari',
    'Web-freelance: yo‘nalishlar va platformalar',
    $md$
## Maqsad

Web-freelance tushunchasini, buyurtmachi va ijrochi o‘rtasidagi masofaviy ish modelini hamda freelance platformasining vazifasini tushunish.

## Freelance nima?

**Freelance** — mutaxassisning doimiy bitta ish beruvchiga bog‘lanmasdan, alohida buyurtma yoki loyiha asosida xizmat ko‘rsatish shakli. Web-freelance internet orqali buyurtma topish, talabni muhokama qilish, ish natijasini topshirish va kelishilgan shartlar asosida hamkorlik qilish imkonini beradi.

Freelance platformasi buyurtmachi bilan ijrochini uchrashtirish, loyiha tavsifi va takliflarni joylashtirish, profil/portfolio ko‘rsatish kabi jarayonlarni tashkil etishi mumkin. Platforma kasbning o‘zi emas; u xizmat bozori uchun vositadir.

## Yo‘nalishlar

Veb-sayt yaratish, grafik dizayn, matn tayyorlash, dasturlash va raqamli kontent bilan ishlash freelance shaklida bajarilishi mumkin. Yo‘nalishni tanlashda mavjud ko‘nikma, buyurtma talabi, muddat va natijani baholash mezonlari hisobga olinadi.

## Xavfsizlik

Noma’lum buyurtmachi bilan ishlashda shaxsiy va moliyaviy ma’lumotni ehtiyot qilish, platforma qoidalarini o‘qish va shubhali havola/fayllarni tekshirish muhim.

> **Manba izi:** ICT 8-sinf (2020), VI bob “Web-Freelance”, PDF 94–104; 2026 attestatsiya taksonomiyasi S7.SEC.06.
$md$,
    18, 'published'::public.content_status
  )
  on conflict (module_id, slug) do update
  set order_idx = excluded.order_idx,
      title_uz = excluded.title_uz,
      body_mdx = excluded.body_mdx,
      est_minutes = excluded.est_minutes,
      status = excluded.status,
      updated_at = now();

  delete from public.lesson_constructs lc
  using public.lessons l
  where lc.lesson_id = l.id
    and (
      (l.module_id = v_m12 and l.slug in (
        'tarmoqlar-va-qurilmalar','arxitektura-va-topologiyalar','ip-manzil-va-tarmoq-maskasi',
        'internetdan-xavfsiz-va-maqsadli-foydalanish','brauzer-qidiruv-dns'
      ))
      or
      (l.module_id = v_m13 and l.slug in (
        'xavfsizlik-tahdidlari-va-himoya','zararli-dastur-va-phishing','antivirus-va-himoya-vositalari',
        'elektron-hukumat-va-elektron-imzo','smm-cms-lms-mooc','web-freelance-asoslari'
      ))
    );

  insert into public.lesson_constructs (lesson_id, construct_id)
  select l.id, c.id
  from (
    values
      ('M12','tarmoqlar-va-qurilmalar','S6.NET.01'),
      ('M12','arxitektura-va-topologiyalar','S6.NET.02'),
      ('M12','ip-manzil-va-tarmoq-maskasi','S6.NET.03'),
      ('M12','internetdan-xavfsiz-va-maqsadli-foydalanish','S6.NET.04'),
      ('M12','brauzer-qidiruv-dns','S6.NET.05'),
      ('M13','xavfsizlik-tahdidlari-va-himoya','S7.SEC.01'),
      ('M13','zararli-dastur-va-phishing','S7.SEC.02'),
      ('M13','antivirus-va-himoya-vositalari','S7.SEC.03'),
      ('M13','elektron-hukumat-va-elektron-imzo','S7.SEC.04'),
      ('M13','smm-cms-lms-mooc','S7.SEC.05'),
      ('M13','web-freelance-asoslari','S7.SEC.06')
  ) as mapping(module_code, slug, construct_code)
  join public.modules m on m.code = mapping.module_code
  join public.lessons l on l.module_id = m.id and l.slug = mapping.slug
  join public.constructs c on c.code = mapping.construct_code and c.is_active
  on conflict do nothing;
end
$$;

commit;

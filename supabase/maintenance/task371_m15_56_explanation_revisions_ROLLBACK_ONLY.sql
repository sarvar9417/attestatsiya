-- TASK-371 | PREPARED REVIEW ONLY | NEVER EXECUTE ON PRODUCTION.
-- Published question rows, options, keys, attempt history and provenance immutable.
-- The user explicitly permits GitHub main merge ONLY, not Supabase writes/deploy.
-- The script stages 56 independent REVIEW successors inside a guaranteed ROLLBACK.
-- Do NOT turn this into a migration or change ROLLBACK to COMMIT.
BEGIN;
SET LOCAL lock_timeout='10s';
SET LOCAL statement_timeout='90s';

CREATE TEMP TABLE task371_candidate_rationales (
  source_reference text PRIMARY KEY,
  educational_explanation text NOT NULL CHECK(char_length(trim(educational_explanation)) >= 155)
) ON COMMIT DROP;

INSERT INTO task371_candidate_rationales(source_reference, educational_explanation)
VALUES
  ('authored:m15-topictest-20261018:1:10', 'Yosh psixologiyasini hisobga olish o‘quvchining faqat yoshini bilish emas, uning rivojlanish bosqichi, mavjud bilimlari va idrok imkoniyatiga mos dars vazifasini tanlashdir. Shu sabab bir xil mavzu turli yosh va tayyorgarlikdagi bolalarga turlicha misol va yordam bilan berilishi mumkin.'),
  ('authored:m15-topictest-20261018:1:11', 'Atamani yoddan takrorlash eslab qolish darajasini ko‘rsatadi, lekin tushunchani anglash yoki yangi holatda qo‘llashni isbotlamaydi. O‘quvchidan o‘z misolini keltirish va tushunchaning nima uchun mos kelishini izohlashni so‘rash uning mazmuniy o‘zlashtirishini tekshiradi.'),
  ('authored:m15-topictest-20261018:1:12', 'Pedagogik texnika o‘qituvchining muloqot vositalari — ovoz balandligi, nutq sur’ati, yuz ifodasi va imo-ishorani vaziyatga mos boshqarish mahoratidir. Bu vositalarni o‘rinli uyg‘unlashtirish tushuntirishni ravshan qiladi va o‘quvchi bilan hurmatli aloqa o‘rnatishga xizmat qiladi.'),
  ('authored:m15-topictest-20261018:1:2', 'Ko‘nikma ongli mashq davomida shakllanadigan harakat usulidir. Harakat muntazam va to‘g‘ri takrorlanib, ayrim bosqichlari ortiqcha ongli nazoratsiz bajarila boshlaganda malakaga aylanadi. Shuning uchun vaziyatdagi avtomatlashuv oddiy nazariy bilim emas, shakllangan malaka belgisidir.'),
  ('authored:m15-topictest-20261018:1:5', 'Kichik yoshdagi o‘quvchilar abstrakt qoida mazmunini tayanch tajribasiz anglashda qiynalishi mumkin. Avval tanish, ko‘rish yoki bajarish mumkin bo‘lgan misol keltirib, keyin umumiy xulosaga o‘tish mazmunni yoshga mos tushuntiradi; mavhum ta’rifni qayta-qayta aytishning o‘zi yetarli emas.'),
  ('authored:m15-topictest-20261018:1:6', 'O‘quvchi topshiriqni bajarmaganidan darhol uning xarakteri haqida xulosa chiqarish pedagogik jihatdan noto‘g‘ri. Avval ko‘rsatmaning tushunarliligi, tayanch bilim, vazifa qiyinligi va motivatsiya tekshiriladi. Sabab aniqlangach, mos yordam yoki mashq tanlanadi; yorliq qo‘yish vaziyatni hal qilmaydi.'),
  ('authored:m15-topictest-20261018:1:7', 'Ekologik tarbiya tabiatga mas’uliyatli munosabat, resurslarni ehtiyot qilish va atrof-muhitni asrashga oid odatlarni shakllantiradi. Savolda diqqat markazida aynan tabiatni muhofaza qilish xulqi turibdi; shuning uchun bu umumiy mehnat yoki huquqiy tarbiya emas, ekologik tarbiyadir.'),
  ('authored:m15-topictest-20261018:1:9', 'Perseptiv qobiliyat o‘qituvchining o‘quvchi kayfiyati, diqqatidagi o‘zgarish yoki yashirin qiyinchilikni kuzatib anglashiga yordam beradi. O‘qituvchi bolaning e’tibori susayganini sezgani ushbu qobiliyatni namoyon qiladi. Keyin qanday yordam berishi esa boshqa kommunikativ va didaktik qarorlarni talab qilishi mumkin.'),
  ('authored:m15-topictest-20261018:2:10', 'Tushunarlilik tamoyili materialning ilmiy mazmunini yo‘qotmasdan, uni o‘quvchining yoshiga, bilimiga va tafakkur imkoniyatiga mos bayon etishni anglatadi. Og‘ir ta’rifni tanish misol va sodda bosqichlar orqali tushuntirish shu tamoyilga mos; faqat qisqa gapirish tushunarli ta’limni kafolatlamaydi.'),
  ('authored:m15-topictest-20261018:2:11', 'Ko‘rgazmali vosita, jumladan sifatli video, darsdagi aniq o‘quv natijasiga xizmat qilishi kerak. Tasvir jozibali bo‘lsa ham, mavzuni anglashga yordam bermasa u vaqt va diqqatni chalg‘itadi. Pedagog vositani uning bezagi emas, bilim va ko‘nikma shakllantirishga qo‘shgan hissasi bilan tanlaydi.'),
  ('authored:m15-topictest-20261018:2:2', 'Deduksiya umumiy qoida, qonun yoki teoremadan kelib chiqib alohida holat bo‘yicha xulosa chiqarish usulidir. Savolda mavjud teorema konkret masalaga tatbiq etilgan. Induksiya buning aksicha, xususiy kuzatuvlardan umumiy xulosaga intiladi; ikki yo‘l fikrlashning boshlang‘ich nuqtasi bilan farqlanadi.'),
  ('authored:m15-topictest-20261018:2:6', 'Individuallashtirish o‘quv vazifasi va yordamni ma’lum o‘quvchining tayyorgarligi, sur’ati hamda ehtiyojiga mos tanlashni anglatadi. Bir xil mavzu doirasida kimdir tayanch mashq, boshqasi murakkabroq topshiriq olishi mumkin. Maqsad imkoniyatlarga mos o‘sish, o‘quvchilarni asossiz ajratish emas.'),
  ('authored:m15-topictest-20261018:2:7', 'Ilmiylik tamoyili darsdagi bilim va xulosalar tekshirilgan dalil hamda ishonchli manbalarga asoslanishini talab qiladi. Mish-mishni tajriba natijasi sifatida berish dalil bilan taxminni aralashtiradi. O‘qituvchi ma’lumotni tekshirishi va tasdiqlanmagan xabarni fakt deb taqdim etmasligi kerak.'),
  ('authored:m15-topictest-20261018:2:9', 'Mustahkamlik tamoyili bilimning bir martalik eslab qolish bilan cheklanmay, uzoq vaqt saqlanishi va kerakli vaziyatda qo‘llanishini ko‘zlaydi. O‘quvchi bir oy o‘tib ham tushunchadan foydalana olgan bo‘lsa, mashq va takrorlash orqali barqaror o‘zlashtirishga erishilganini ko‘rsatadi.'),
  ('authored:m15-topictest-20261018:3:1', 'Ekologik tarbiya tabiatga hurmatli munosabat va atrof-muhitni muhofaza qilishga doir amaliy xulqni rivojlantirishga qaratiladi. O‘quvchilarning daraxt ekishi jamoaviy mehnatni ham qamrashi mumkin, biroq vaziyatdagi yetakchi tarbiyaviy maqsad tabiiy muhitni asrashdir.'),
  ('authored:m15-topictest-20261018:3:10', 'Jazo xatti-harakatni vaqtincha to‘xtatishi mumkin, lekin uning sababini yoki o‘quvchining ehtiyojini o‘zi hal qilmaydi. Tarbiyaviy vaziyatda bolaning fikrini tinglash, xulq oqibatini tushuntirish va maqbul alternativ harakatni ko‘rsatish zarur. Tarbiyada hurmatli muloqot, qo‘llab-quvvatlash va izchillik uyg‘un bo‘lishi kerak.'),
  ('authored:m15-topictest-20261018:3:11', 'Bitta loyiha doirasida bir nechta tarbiyaviy maqsadga erishish mumkin: tabiatni muhofaza qilish ekologik mas’uliyatni, vazifani guruh bo‘lib bajarish esa hamkorlik va mehnat ko‘nikmasini rivojlantiradi. Tarbiya yo‘nalishlari amaliy faoliyatda bir-birini to‘ldiradi; ularni mutlaqo ajratib bo‘lmaydi.'),
  ('authored:m15-topictest-20261018:3:2', 'Huquqiy tarbiya inson huquqlari, majburiyatlar va qonuniy munosabat me’yorlarini anglash hamda ularga hurmatni shakllantirishga qaratiladi. Savolda boshqalarning huquqini hurmat qilish muhokama qilingan, shu sabab yetakchi yo‘nalish huquqiy tarbiyadir. Bu faqat umumiy odob qoidalarini eslash emas.'),
  ('authored:m15-topictest-20261018:3:4', 'Mehnat tarbiyasi mehnatsevarlik, topshiriqqa mas’uliyat, ishni yakunlash va jamoa natijasiga hissa qo‘shish sifatlarini rivojlantiradi. O‘quvchilar umumiy vazifani mas’uliyat bilan tugatgani shu yo‘nalishga mos. Vaziyatda hamkorlik ham bor, ammo asosiy faoliyat maqsadli mehnat jarayonidir.'),
  ('authored:m15-topictest-20261018:3:8', 'Shaxsiy namuna metodi o‘qituvchining o‘z xulqi bilan kerakli qadriyatni amalda ko‘rsatishidir. Bolalar ustozning odobi, mas’uliyati va boshqalarga hurmatidan kuzatish orqali saboq olishi mumkin. Bu usul og‘zaki nasihatdan farqli ravishda xulq namunasining bevosita ta’siriga tayanadi.'),
  ('authored:m15-topictest-20261018:3:9', 'Rag‘batlantirish ijobiy xatti-harakat va sa’y-harakatni o‘rinli e’tirof etib, uni davom ettirish istagini kuchaytiradi. O‘quvchining foydali ishi nima uchun qadrlanayotganini aniq aytish muhim. Bu asossiz maqtov yoki boshqa o‘quvchilar bilan solishtirishdan farq qiladi.'),
  ('authored:m15-topictest-20261018:4:10', 'Nazorat ishi dastlab o‘quvchilar nimani o‘zlashtirgani haqida dalil beradi. O‘qituvchi xatolarni tahlil qilib, qaysi mavzu yoki ko‘nikmada qiyinchilik borligini aniqlaydi va keyingi mashqlarni shunga moslashtiradi. Shuning uchun ketma-ketlik baholash, tahlil va o‘qitishni tuzatishdan iborat.'),
  ('authored:m15-topictest-20261018:4:2', 'Mustahkamlash va takrorlash darsida ilgari o‘tilgan tushuncha va qoidalar turli mashqlar orqali qayta qo‘llanadi. Maqsad yangi materialni birinchi marta tanishtirish emas, oldingi bilimni barqaror qilish va mustaqil foydalanishni kuchaytirishdir. Savoldagi qayta mashq aynan shu turga xos.'),
  ('authored:m15-topictest-20261018:4:4', 'Umumlashtirish va tizimlashtirish darsida o‘quvchilar alohida mavzularni bir butun bilim tizimiga birlashtirib, ular orasidagi bog‘lanishni ochadi. Savolda sxema tuzish va mavzulararo aloqa topish muhim. Oddiy takrorlashdan farqli ravishda bilimlarning tuzilishi va umumiy qonuniyati aniqlanadi.'),
  ('authored:m15-topictest-20261018:4:5', 'Didaktik tahlil darsning ta’limiy maqsadi, mazmuni, izchilligi, ilmiyligi va kutilgan o‘quv natijasiga mosligini baholaydi. Savolda aynan mazmunning fanga mosligi hamda ketma-ketligi tekshirilmoqda. Uslubiy tahlil esa ko‘proq tanlangan metod va vositalarning ishlashiga e’tibor qaratadi.'),
  ('authored:m15-topictest-20261018:4:6', 'Uslubiy tahlil o‘qitish metodi, shakli va vositalari dars maqsadi hamda o‘quvchi ehtiyojiga qanchalik mos tanlanganini ko‘rib chiqadi. Savolda guruhlash metodining o‘rinliligi muhokama qilingan, demak baho metodik qarorga qaratilgan. Mazmunning ilmiy izchilligini tekshirish esa didaktik tahlil doirasiga yaqin.'),
  ('authored:m15-topictest-20261018:4:9', 'Agar guruh ishida faqat bir necha o‘quvchi faol bo‘lsa, guruhli shaklning o‘zi hammaning o‘rganishini kafolatlamaydi. Rollar va vazifalarni aniq taqsimlash, ishtirokni kuzatish hamda har bir a’zoning hissasini ko‘rinadigan qilish zarur. Maqsad faol bolalarni cheklash emas, barchaga mazmunli imkon yaratishdir.'),
  ('authored:m15-topictest-20261018:5:12', 'Ota-ona va o‘qituvchining kutishlari farq qilganda avval bolaning ehtiyoji va umumiy ta’limiy maqsad aniqlanadi. Ikki tomon fikrini tinglab, bajariladigan ishlar, mas’ullar hamda qayta aloqaning vaqtini kelishib olish samaraliroq. Bir tomonning fikrini majburan o‘tkazish barqaror hamkorlik bermaydi.'),
  ('authored:m15-topictest-20261018:5:13', 'O‘quvchining ijobiy o‘zgarishi haqida ota-onaga aniq va hurmatli qayta aloqa berish boladagi yutuqni birgalikda qo‘llab-quvvatlashga yordam beradi. Bu o‘qituvchi va oila o‘rtasidagi ishonchni oshirib, kelgusi maqsadlarni kelishishni osonlashtiradi. Maqtov dalilga asoslangan va aniq bo‘lishi muhim.'),
  ('authored:m15-topictest-20261018:5:5', 'O‘quvchining shaxsiy muammosini uning roziligisiz butun sinfga oshkor qilish shaxsiy ma’lumot maxfiyligi va qadr-qimmatiga zarar yetkazadi. Pedagog bu kabi holatni zarur vakolatli mutaxassislar bilan cheklangan doirada muhokama qilishi lozim. Jamoaviy yig‘ilish individual ma’lumotlarni tarqatish uchun mos joy emas.'),
  ('authored:m15-topictest-20261018:5:6', 'Bir o‘quvchi haqida o‘qituvchilarning kuzatuvlari farq qilsa, darhol bittasini haq deb qabul qilish to‘g‘ri emas. Dalillarni, vazifa sharoitini va vaqtni solishtirib, umumiy ehtiyojni aniqlash kerak. Shundan so‘ng hamkasblar kelishilgan kuzatuv hamda yordam rejasini tuzishi samarali hamkorlikni ta’minlaydi.'),
  ('authored:m15-topictest-20261018:5:8', 'Ota-onalar yig‘ilishi faqat tanbeh berish maydoniga aylansa, oila va maktab birgalikda yechim izlash imkoniyatini yo‘qotadi. Samarali uchrashuv dalillarni xolis muhokama qilish, ijobiy natijani ko‘rish va kelgusi amaliy qadamlarni kelishishni talab etadi. Hurmatli muloqot hamkorlikni mustahkamlaydi.'),
  ('authored:m15-topictest-20261018:6:1', 'Pedagogik takt o‘quvchining xatosiga vaziyatni va uning qadr-qimmatini inobatga olgan holda munosabat bildirish mahoratidir. Noto‘g‘ri javobni kamsitmasdan, yo‘naltiruvchi savol yoki izoh bilan tuzatish bolani o‘qish jarayonida saqlab qoladi. Jazolovchi ohang o‘rniga hurmatli pedagogik ta’sir ustun bo‘ladi.'),
  ('authored:m15-topictest-20261018:6:10', 'Refleksiya o‘qituvchining o‘z faoliyatini dalil asosida tahlil qilib, kuchli va zaif jihatlarini ko‘rishi hamda keyingi darsga aniq o‘zgartirish kiritishidir. Xatoni yashirish va rejasini o‘zgartirmaslik tajribadan saboq olish imkonini kamaytiradi. Muhimi faqat xatoni tan olish emas, undan kelgusi qarorga foydalanishdir.'),
  ('authored:m15-topictest-20261018:6:11', 'Nutqning tushunarliligi fikrni tinglovchining yoshiga va tayyorgarligiga mos so‘zlar, aniq jumlalar hamda mantiqiy izchillik bilan yetkazishni anglatadi. O‘qituvchi o‘quvchi savoliga sodda va ravon javob bergani shu talablarga mos. Tez yoki baland gapirish o‘z-o‘zidan tushunarlilikni yaratmaydi.'),
  ('authored:m15-topictest-20261018:6:2', 'Kasbiy refleksiya darsdan keyin nima samarali bo‘lgani, qanday qiyinchilik tug‘ilgani va buning sababi haqida o‘ylashni anglatadi. Pedagog xulosasiga tayanib, keyingi dars usulini yangicha rejalaganida refleksiya amaliy yaxshilanishga aylanadi. Oddiy taassurot bilan cheklanmay, natijaga asoslanish muhim.'),
  ('authored:m15-topictest-20261018:6:3', 'Nutqning mantiqiyligi g‘oyalar o‘zaro izchil bog‘lanishi va xulosalar keltirilgan sabab hamda dalillardan kelib chiqishini anglatadi. Savolda fikrlar sabab-oqibat munosabatida bayon qilingan. Bu sifat ovozning balandligi yoki bezakli ifoda emas, mazmunning ichki tartibi bilan belgilanadi.'),
  ('authored:m15-topictest-20261018:6:4', 'Pedagogik texnika tarkibiga ovoz, nutq sur’ati, intonatsiya, mimika va boshqa ifoda vositalarini ongli boshqarish kiradi. Dars vaziyatiga ko‘ra ovoz kuchini moslashtirish tinglovchilarning diqqatini saqlash va ma’lumotni aniq yetkazishga yordam beradi. Bu bilim mazmunidan ko‘ra ifodalash mahoratini ko‘rsatadi.'),
  ('authored:m15-topictest-20261018:6:5', 'Pedagogik adolatlilik har bir o‘quvchiga shaxsiy yaqinlik yoki yoqtirishga emas, xolis mezon va teng hurmatga tayangan holda munosabat bildirishni talab qiladi. O‘qituvchi ikki bolaga faqat shaxsiy munosabati uchun turlicha qaraganida etik me’yor buziladi. Ehtiyojga ko‘ra farqlash bilan tarafkashlik bir xil emas.'),
  ('authored:m15-topictest-20261018:6:8', 'Hamkorlikdagi refleksiya o‘qituvchilarning dars tajribasini birga muhokama qilishi, kuzatuvlari va natijalarini taqqoslashi hamda foydali xulosa chiqarishidir. Savolda pedagog jamoa bilan faoliyatini tahlil qilgan. Shuning uchun bu faqat yakka o‘zini baholash emas, o‘zaro tajriba almashishga asoslangan refleksiyadir.'),
  ('authored:m15-topictest-20261018:6:9', 'Pedagogik nazokat yoki takt bolaning hissiyotini, vaziyatni va muomala me’yorini hisobga olib ta’sir ko‘rsatishdir. Tanqid mazmunan asosli bo‘lishi bilan birga, ifoda shakli ham o‘quvchining sha’nini asrashi kerak. Xatoni madaniyatli tuzatish o‘qituvchining shu sifatini namoyon qiladi.'),
  ('authored:m15-topictest-20261018:7:1', 'Didaktik qobiliyat murakkab o‘quv materialini auditoriya tayyorgarligiga moslashtirib, sodda, izchil va tushunarli yetkazish mahoratidir. O‘qituvchi mavhum tushunchani tanish misollar orqali ochib bergan. Fanni chuqur bilish zarur bo‘lsa-da, uni o‘quvchiga tushunarli qilib izohlash alohida qobiliyatdir.'),
  ('authored:m15-topictest-20261018:7:10', 'Perseptiv qobiliyat o‘quvchining holati va ehtiyojini payqashga, kommunikativ qobiliyat esa u bilan hurmatli aloqa o‘rnatib, fikrini tinglashga xizmat qiladi. O‘qituvchi jim qolish sababini anglashga urinib, suhbatdan keyin yordam bergani bu ikki qobiliyatning birgalikda qo‘llanishini ko‘rsatadi.'),
  ('authored:m15-topictest-20261018:7:11', 'Pedagogik qobiliyat shakllanishiga shaxsiy imkoniyatlar bilan birga ta’lim, amaliy tajriba, fikr-mulohaza va muntazam mashq ta’sir qiladi. Shu sabab ularni faqat tug‘ma xususiyat deb ko‘rish noto‘g‘ri. O‘qituvchi metodik yordam va refleksiya orqali muloqot, tashkilotchilik hamda tushuntirish qobiliyatini rivojlantirishi mumkin.'),
  ('authored:m15-topictest-20261018:7:12', 'Pedagogik qobiliyatlar turli tadqiqotchilar tomonidan har xil guruhlanishi mumkin, shuning uchun muallif nomi va tasnif mezoni savoldagi muhim shartdir. Bir olimning atamasini boshqasining tizimiga o‘zboshimchalik bilan ko‘chirish chalkashlik tug‘diradi. Javobni aynan savolda berilgan tasnifga tayanib aniqlash kerak.'),
  ('authored:m15-topictest-20261018:7:13', 'Tashkilotchilik qobiliyati o‘qituvchining umumiy maqsadga erishish uchun ish bosqichlari, vaqt, rollar va mas’uliyatni muvofiqlashtirish mahoratidir. Savolda jamoa vazifalari o‘rinli taqsimlangan va faoliyat rejalangan. Bu xatti-harakat bilimni bayon qilishdan ko‘ra guruh ishini uyushtirishga tegishli.'),
  ('authored:m15-topictest-20261018:7:2', 'Perseptiv qobiliyat o‘qituvchiga o‘quvchining holatini uning yuz ifodasi, xatti-harakati va muloqot belgilari orqali sezishda yordam beradi. Boladagi xavotirni payqash shuning misolidir; biroq kuzatuv yakuniy tashxis emas. Pedagog taxminini o‘quvchi bilan ehtiyotkor suhbatda aniqlashtirishi lozim.'),
  ('authored:m15-topictest-20261018:7:7', 'Diqqatni taqsimlash bir vaqtning o‘zida bir nechta pedagogik jarayonning muhim belgilarini kuzatib borish mahoratidir. O‘qituvchi mavzuni tushuntirish bilan birga sinfdagi faollik va tushunishni ham kuzatgan. Bu bir vazifadan boshqasiga mutlaqo e’tiborsiz o‘tish emas, nazoratni muvofiqlashtirishdir.'),
  ('authored:m15-topictest-20261018:7:9', 'Akademik qobiliyat pedagogning o‘z fani mazmunini chuqur bilishini bildiradi; didaktik qobiliyat esa shu bilimni o‘quvchilarga tushunarli va yoshiga mos qilib yetkazishga taalluqli. Savoldagi o‘qituvchi fanini yaxshi bilsa ham, bayon etishda qiynalgan. Demak, nazariy bilim kuchli, didaktik tushuntirish ustida ishlash zarur.'),
  ('authored:m15-topictest-20261018:8:1', 'Muammoli ta’limda pedagog tayyor xulosani avval aytmay, bilish qiyinchiligi yoki ziddiyatni o‘rtaga qo‘yadi. O‘quvchilar dalillarni tahlil qilib, taxmin va yechimlarni qidiradi. Savolda aynan muammoni mustaqil yechishga qaratilgan fikrlash ustun, shuning uchun oddiy ma’ruza yoki namoyish emas, muammoli yondashuv mos.'),
  ('authored:m15-topictest-20261018:8:10', 'Inklyuziv yondashuv o‘quvchining cheklanishini sabab qilib uni faoliyatdan ajratish o‘rniga, ko‘rsatma va materialni qulay formatda berishni ko‘zlaydi. Tasvirni ko‘rishda qiynalayotgan bola uchun yirik shrift, kontrast, og‘zaki tushuntirish yoki mos yordamchi vosita ishtirok imkonini oshiradi. Maqsad o‘quv natijasiga teng kirishdir.'),
  ('authored:m15-topictest-20261018:8:2', 'Loyihaga asoslangan ta’lim odatda muammo yoki amaliy vazifani rejalash, ma’lumot to‘plash, yechim ishlab chiqish va natijani taqdim etishni birlashtiradi. Savolda o‘quvchilar tadqiqot qilib ko‘rinadigan mahsulot yaratgan. Yakuniy mahsulotning mavjudligi muhim belgi, biroq jarayonni baholash ham chetda qolmasligi kerak.'),
  ('authored:m15-topictest-20261018:8:3', 'Ajurli arra metodida o‘quvchilar mavzuning bo‘laklarini taqsimlab oladilar, o‘z bo‘lagi bo‘yicha ekspert sifatida ishlaydilar va keyin boshlang‘ich guruhiga qaytib boshqalarga o‘rgatadilar. Har bir a’zoning hissasi umumiy mazmunni to‘ldiradi. Bu faqat guruhda birgalikda o‘qishdan farqli aniq o‘rgatish bosqichiga ega.'),
  ('authored:m15-topictest-20261018:8:6', 'Differensial ta’lim umumiy o‘quv maqsadini saqlagan holda topshiriqning murakkabligi, yordam miqdori yoki o‘qish yo‘lini o‘quvchi tayyorgarligiga moslashtiradi. Bir mavzuda turli darajadagi vazifalar berilgani shuni ko‘rsatadi. Maqsad adolatsiz ajratish emas, har bir o‘quvchining o‘sishini ta’minlashdir.'),
  ('authored:m15-topictest-20261018:8:8', 'Interfaol ta’lim o‘quvchining faqat tayyor ma’lumotni qabul qilishini emas, savol berish, fikr almashish, hamkorlik va asoslangan muhokamada faol qatnashishini ko‘zlaydi. Savolda o‘quvchilar o‘zaro muloqot qilmoqda. Oddiy tinglovchilikdan farqli ravishda bilim faol ishtirok orqali mustahkamlanadi.'),
  ('authored:m15-topictest-20261018:8:9', 'Loyihaviy mashg‘ulotda rejalashtirilgan amaliy mahsulot yoki tekshiriladigan yechim bo‘lishi kutiladi. Agar faoliyat faqat bahs bilan tugagan bo‘lsa, loyiha maqsadi, ish bosqichlari va natija mezonlarini qayta aniqlash zarur. Munozara loyiha ichida foydali bosqich bo‘lishi mumkin, ammo kutilgan natijaning o‘rnini avtomatik bosmaydi.');

DO $task371$
DECLARE
  item record;
  v_actor uuid;
  v_new uuid;
  v_count integer;
BEGIN
  SELECT count(*) INTO v_count FROM task371_candidate_rationales;
  IF v_count <> 56 THEN RAISE EXCEPTION 'TASK371_EXPECTED_56'; END IF;
  SELECT count(*) INTO v_count FROM public.profiles
  WHERE role='admin' AND NOT coalesce(is_blocked,false);
  IF v_count <> 1 THEN RAISE EXCEPTION 'TASK371_UNIQUE_ACTIVE_ADMIN_REQUIRED'; END IF;
  SELECT id INTO STRICT v_actor FROM public.profiles
  WHERE role='admin' AND NOT coalesce(is_blocked,false);

  SELECT count(*) INTO v_count FROM task371_candidate_rationales t
  JOIN public.questions q ON q.source_reference = t.source_reference
  JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.status='published' AND q.group_code='PM.GEN' AND q.format='Y1'
    AND char_length(trim(k.explanation_md)) < 80
    AND NOT EXISTS(SELECT 1 FROM public.pedagogy_revision_queue r
      WHERE r.source_question_id=q.id);
  IF v_count <> 56 THEN RAISE EXCEPTION 'TASK371_STALE_SOURCE_OR_DUPLICATE_REVISION_%',v_count; END IF;

  FOR item IN
    SELECT q.id, t.educational_explanation FROM task371_candidate_rationales t
    JOIN public.questions q ON q.source_reference=t.source_reference
    ORDER BY t.source_reference
  LOOP
    INSERT INTO public.pedagogy_revision_queue(source_question_id,reason)
    VALUES(item.id,'TASK-371: expand one-line M15 pedagogy explanation for educational clarity');
    v_new := public.stage_pedagogy_revision(item.id,v_actor);
    UPDATE public.question_keys SET explanation_md=item.educational_explanation,updated_at=now()
    WHERE question_id=v_new;
    GET DIAGNOSTICS v_count=ROW_COUNT;
    IF v_count <> 1 OR NOT EXISTS(
      SELECT 1 FROM public.questions WHERE id=v_new AND status='review'
    ) THEN RAISE EXCEPTION 'TASK371_DRAFT_STAGING_FAILED'; END IF;
  END LOOP;
END $task371$;

-- Mandatory: production is NEVER updated by this file.
ROLLBACK;

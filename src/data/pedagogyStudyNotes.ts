/**
 * Short source-grounded explanations available even when the 2026-10-18
 * optional SQL supplements have not yet been applied to a database.
 * Historical answer markers are NOT used as authoritative quiz keys.
 */
import type { TheoryBlock, TopicContent } from './topicContent'

const notes: Record<string, TheoryBlock[]> = {
  'M15.01': [
    { type: 'heading', content: 'Sodda qilib tushunamiz' },
    { type: 'definition', content: '**Pedagogik mahorat** — o‘qituvchining shaxsiy fazilatlari, kasbiy bilimlari, qobiliyatlari va ta’lim-tarbiya usullaridan samarali foydalanishidir. Manbada to‘rtta bog‘liq tayanch ko‘rsatilgan: insonparvarlik, kasbiy bilim, pedagogik qobiliyat va pedagogik texnika.' },
    { type: 'example', content: 'O‘qituvchi mavzuni biladi, lekin o‘quvchilar tushunmayotganini sezgach, boshqa misol va ko‘rgazmali vositani tanlaydi. U faqat bilimni emas, o‘quvchini tushunish va o‘qitish usulini ham qo‘lladi.' },
    { type: 'trap', content: '**Pedagogika** — ta’lim-tarbiya haqidagi keng fan. **Didaktika** — ta’lim nazariyasi. **Predmet metodikasi** — muayyan fanni o‘qitish usullari. Savolda uchalasining vazifasini farqlang.' },
    { type: 'source', content: 'Manba: Xoliqov, Pedagogik mahorat, 1–2-betlar.' },
    { type: 'heading', content: 'Pedagogikaning obyekti, predmeti va tadqiqot metodlari' },
    { type: 'definition', content: '**Obyekt** — yaxlit pedagogik jarayon; **predmet** — ta’lim-tarbiyaning mazmuni, qonuniyatlari, tamoyillari, shakl, metod va vositalari. Pedagogik tadqiqot usullari darsda o‘qitish metodlaridan farq qiladi.' },
    { type: 'table', content: '| Pedagogika vazifasi | Nima qiladi? |\n|---|---|\n| Analitik | Jarayon va sabab–oqibat aloqalarini tahlil qiladi |\n| Prognostik | Ta’lim rivoji uchun ilmiy asoslangan yo‘nalishlarni bashorat qiladi |\n| Tashkiliy | Tadqiqot natijalari va yangi yondashuvlarni amaliyotga tatbiq qiladi |\n| Metodologik | Pedagogik fanlarning umumiy nazariy asoslarini aniqlashtiradi |' },
    { type: 'example', content: 'O‘qituvchi sinfda o‘zlashtirish pasayishini o‘rgansa, **kuzatish** bilan real faoliyatni qayd etadi, **suhbat** orqali sabablarni ochadi, **anketa** bilan yozma javob yig‘adi, **pedagogik eksperiment** bilan tanlangan yondashuv samaradorligini sinaydi. Har metod boshqa turdagi dalil beradi.' },
    { type: 'trap', content: '**Anketa** — ko‘pincha tizimli yozma savollar; **suhbat/intervyu** — savol-javob asosidagi muloqot; **kuzatish** — faoliyatni maqsadli qayd etish; **eksperiment** — belgilangan sharoitda ta’sirni sinash. Bittasining natijasini boshqasining avtomatik isboti sifatida ko‘rsatmang.' },
    { type: 'source', content: 'Qo‘shimcha manba: «Mirzayeva Pedagogika nazriyasi qollanma 2-mavzu.pdf», «Pedagogika fan sifatida. Ilmiy-pedagogik tadqiqotlar metodologiyasi va metodlari» bo‘limi; barnoyevak Drive — https://drive.google.com/file/d/1woZMas8dNbzk6yephzNH_XdmT19ess-l/view . PDFning aniq fizik betlari hali tekshirilmagan, material ikkilamchi o‘quv qo‘llanma sifatida ishlatildi.' },
  ],
  'M15.02': [
    { type: 'heading', content: 'Tamoyil, metod va vositani adashtirmang' },
    { type: 'definition', content: '**Tamoyil** — darsni tashkil qilishdagi umumiy talab. **Metod** — maqsadga erishish yo‘li. **Vosita** — metodni qo‘llashga yordam beradigan predmet yoki resurs.' },
    { type: 'example', content: 'Masalan, **ko‘rgazmalilik** — tamoyil; **namoyish qilish** — metod; **model yoki slayd** — vosita. Bir vaziyatda uchalasi qatnashishi mumkin, ammo test nimani so‘raganini aniqlash kerak.' },
    { type: 'trap', content: '**Induksiya** — alohida misollardan umumiy xulosaga, **deduksiya** — umumiy qoidadan xususiy holatga, **analogiya** — o‘xshashlikdan taxminiy xulosaga borish. Analogiya qat’iy isbot bilan teng emas.' },
    { type: 'source', content: 'Manba: 2025 kuzgi pedagogik mahorat testlari, 2-bet (tarixiy savoldagi terminlar); M15 didaktika darsi. Tarixiy javob kaliti alohida tekshiruvni talab qiladi.' },
    { type: 'heading', content: 'Bloom taksonomiyasi: 1956 va 2001 talqinlarini farqlang' },
    { type: 'definition', content: '**Bloom taksonomiyasi** o‘quv maqsadlarini o‘quvchidan kutiladigan bilish faoliyati bo‘yicha tasniflashga yordam beradi. Dastlabki va qayta ko‘rib chiqilgan talqinda so‘nggi ikki bosqichning mazmuni va o‘rni farq qiladi.' },
    { type: 'table', content: '| Bosqich | 1956-yilgi tasnif | 2001-yilgi qayta ko‘rilgan tasnif |\n|---|---|---|\n| 1 | Bilish | Eslash |\n| 2 | Tushunish | Tushunish |\n| 3 | Qo‘llash | Qo‘llash |\n| 4 | Tahlil | Tahlil |\n| 5 | Sintez | Baholash |\n| 6 | Baholash | Yaratish |' },
    { type: 'example', content: '**Informatikada:** algoritm turlarini sanash — eslash; tayyor koddagi xato sababini aniqlash — tahlil; ikki yechimni aniq mezonlar bilan solishtirib qaror chiqarish — baholash; muammo uchun yangi algoritm tuzish — yaratish.' },
    { type: 'trap', content: '**Adashmang:** 1956-yilgi «sintez → baholash» tartibini 2001-yilgi «baholash → yaratish» bilan almashtirmang. Attestatsiya spetsifikatsiyasidagi «bilish / qo‘llash / mulohaza qilish» taqsimoti Bloomning oltita kategoriyasiga avtomatik 1:1 mos kelmaydi. Faqat topshiriqdagi fe’lga emas, bajarilishi kerak bo‘lgan fikrlash amaliga qarang.' },
    { type: 'source', content: 'Manbalar: «Blum taskanomiyasi (2).pdf» (Sarvar Drive, ikkilamchi o‘quv materiali; bet lokatori tekshirilmagan); Cornell Center for Teaching Innovation — https://teaching.cornell.edu/resource/blooms-taxonomy; University of Waterloo Centre for Teaching Excellence — https://uwaterloo.ca/centre-for-teaching-excellence/catalogs/tip-sheets/blooms-taxonomy. Bu qo‘shimcha barnoyevak ZIP arxividagi manbalar tekshirilganini bildirmaydi.' },
  ],
  'M15.03': [
    { type: 'heading', content: 'Tarbiya turini maqsadidan tanlang' },
    { type: 'definition', content: '**Tarbiya** — shaxsning munosabati, qadriyati va xulqiga maqsadli pedagogik ta’sir ko‘rsatish jarayoni. Bir tadbir bir nechta tarbiya yo‘nalishiga xizmat qilishi mumkin.' },
    { type: 'example', content: 'O‘quvchilar maktab hovlisiga ko‘chat ekishadi. Agar savolda **tabiatni asrash** ta’kidlansa ekologik tarbiya, **mehnatga mas’uliyat** ta’kidlansa mehnat tarbiyasi ustun bo‘ladi.' },
    { type: 'trap', content: 'Tarbiya **yo‘nalishi** (axloqiy, estetik, mehnat va boshqalar) va tarbiya **metodi** (tushuntirish, namuna, rag‘batlantirish, mashq) turli tushunchalardir. Birini ikkinchisi o‘rniga qo‘ymang.' },
    { type: 'source', content: 'Manba: M15 tarbiya nazariyasi; Xoliqov, Pedagogik mahorat, pedagogik ta’sir bo‘limlari.' },
    { type: 'heading', content: 'Tarbiya yo‘nalishi, usuli va shakli — uch xil tushuncha' },
    { type: 'table', content: '| Savolda nima so‘ralmoqda? | Misol |\n|---|---|\n| Tarbiya yo‘nalishi | Axloqiy, fuqarolik, huquqiy, iqtisodiy, ekologik, mehnat, aqliy, estetik, jismoniy |\n| Tarbiya metodi | Tushuntirish, namunaga ergashtirish, rag‘batlantirish, mashq qildirish |\n| Tarbiya shakli | Sinf muhokamasi, tadbir, loyiha yoki hamkorlikdagi mashg‘ulot |' },
    { type: 'example', content: 'O‘quvchilar internetda mualliflik huquqini buzmasdan kontent tayyorlashni muhokama qilsa, **huquqiy tarbiya** yo‘nalishi ustun; **suhbat** — metod; **sinf muhokamasi** — shakl. Bitta hodisada har uch o‘lcham bo‘lishi mumkin.' },
    { type: 'trap', content: 'Tarbiyaning vazifasi faqat sinfdan tashqarida emas: kasb standarti tarbiyaviy faoliyatning dars va darsdan tashqaridagi shakllarini alohida qayd qiladi. Testda faoliyat qayerda o‘tganini emas, maqsadini ham tekshiring.' },
    { type: 'source', content: 'Manbalar: «Mirzayeva Pedagogika nazriyasi qollanma 2-mavzu.pdf» — «Tarbiya nazariyasi», «Ijtimoiy tarbiya» bo‘limlari; «Kasb-standarti.pdf» — «Tarbiyaviy faoliyatni tashkil etish» bobining mehnat harakatlari, barnoyevak Drive/pedagogika/files. Normativ hujjatning amaldagi statusi mustaqil tekshirilmagan.' },
  ],
  'M15.04': [
    { type: 'heading', content: 'Dars turlari va dars tahlili farqi' },
    { type: 'definition', content: '**Dars turi** uning yetakchi didaktik maqsadini bildiradi; **dars tahlili** esa o‘tgan darsning qaysi jihati tekshirilayotganini ifodalaydi. Manbada aralash, yangi bilim, mustahkamlash-takrorlash, umumlashtirish-tizimlashtirish, ko‘nikma-malaka va nazorat-baholash darslari ajratilgan.' },
    { type: 'example', content: 'O‘qituvchi birinchi navbatda uy vazifasini tekshiradi, keyin yangi materialni tushuntiradi, mashq qildiradi va baholaydi. Bu **aralash dars**ga xos. Dars mazmunining ilmiyligi tekshirilsa esa **didaktik tahlil** bo‘ladi.' },
    { type: 'trap', content: '**Didaktik tahlil** — mazmun va ta’lim sifati; **uslubiy tahlil** — metod tanlovi; **psixologik tahlil** — diqqat va ruhiy muhit. **Pedagogik** va **metodologik** tahlil atamalari ham manbada alohida berilgan: so‘rovning asosiy belgisiga e’tibor bering.' },
    { type: 'source', content: 'Manbalar: Dars turlari.pdf, 1–2-betlar; dars tahlili turlari.pdf, 1-bet.' },
    { type: 'heading', content: 'Dars tahlilining besh yo‘nalishi — nima tekshiriladi?' },
    { type: 'table', content: '| Tahlil turi | Yetakchi savol |\n|---|---|\n| Didaktik | Mavzu ilmiy, izchil, tushunarli va hayotiy ochib berildimi? |\n| Uslubiy | Tanlangan metodlar dars maqsadi va o‘quvchilarning yoshiga mosmi? |\n| Metodologik | Ta’limdagi normativ, madaniy yoki dunyoqarash asoslari o‘rinli yoritildimi? |\n| Psixologik | O‘quvchi diqqati, ruhiy holati, motivatsiyasi va sinf muhiti hisobga olindimi? |\n| Pedagogik | Muomala, odob, tarbiyaviy ta’sir va o‘qituvchi nutqi qanchalik o‘rinli? |' },
    { type: 'example', content: 'Informatika darsida mavzu murakkabligi bosqichma-bosqich tushuntirilgani **didaktik**; vizual namoyish usuli to‘g‘ri tanlangani **uslubiy**; o‘quvchilarning xavotiri va diqqati kuzatilgani **psixologik** tahlil dalili bo‘ladi.' },
    { type: 'trap', content: '**Dars turi** (masalan, nazorat darsi) va **dars tahlili turi** (masalan, psixologik tahlil) boshqa mezonlar bo‘yicha ajratiladi. «Metodologik»ni «uslubiy» bilan bir ma’noda ishlatmang.' },
    { type: 'source', content: 'Manba: «dars tahlili turlari.pdf» — beshta nomlangan tahlil turi; barnoyevak Google Drive/ChatExport_2026-10-19/files. Soddalashtirilgan ikkilamchi konspekt; sahifa koordinatasi va mustaqil rasmiy status aniqlanmagan.' },
  ],
  'M15.05': [
    { type: 'heading', content: 'Hamkorlik nima uchun kerak?' },
    { type: 'definition', content: '**Sinf rahbari** o‘quvchi, sinf jamoasi, fan o‘qituvchilari va ota-onalar o‘rtasidagi tarbiyaviy hamkorlikni uyushtiradi. Maqsad ayb izlash emas, o‘quvchining rivojlanishini birgalikda qo‘llab-quvvatlashdir.' },
    { type: 'example', content: 'O‘quvchining darsdagi faolligi kamaydi. Sinf rahbari sababni tushunish uchun fan o‘qituvchilari va ota-ona bilan vaziyatni muhokama qiladi, keyin o‘quvchiga mos yordamni rejalashtiradi.' },
    { type: 'trap', content: 'Kasbiy standartda **hamkasblar va ota-onalar bilan hamkorlik** alohida kompetensiya. Bu har qanday holatda faqat sinf rahbarining vazifasi degani emas.' },
    { type: 'source', content: 'Manba: Pedagogning kasbiy standarti — metodik qo‘llanma, 1 va 13-betlar; M15 sinf rahbari darsi.' },
    { type: 'heading', content: 'Sinf rahbari faoliyati va umumiy kasbiy hamkorlik farqi' },
    { type: 'table', content: '| Holat | O‘qituvchining vazifasi |\n|---|---|\n| Sinf jamoasidagi hamkorlik | O‘quvchi, fan o‘qituvchisi va ota-onalar bilan mos tarbiyaviy yordamni rejalash |\n| Ota-ona bilan qaror | Fikrni tinglash, dalillarni tushuntirish va o‘quvchi manfaatida qarorga jalb qilish |\n| Individual ta’lim trayektoriyasi | Zarur pedagog va mutaxassis bilan vazifa, yordam va natijani kelishish |\n| Axborot xavfsizligi | O‘quvchining shaxsiy ma’lumotini faqat tegishli taraflar bilan va zarur hajmda muhokama qilish |' },
    { type: 'example', content: 'Bir o‘quvchining uy vazifasi bajarilmayotgani ma’lum bo‘ldi. Sinf rahbari muammoni umumiy Telegram guruhida tarqatmaydi: o‘quvchi bilan suhbatlashadi, zarur o‘qituvchilar va ota-ona bilan maxfiylikni saqlagan holda yordamni belgilaydi.' },
    { type: 'trap', content: 'Kasb standarti hamkorlikni faqat sinf rahbariga yuklamaydi: fan o‘qituvchisi ham ota-ona, hamkasb va mutaxassislar bilan maqsadli ishlashi mumkin. Tayyor qarorni shunchaki xabar qilish mazmunli ishtirokdan farq qiladi.' },
    { type: 'source', content: 'Manba: «Kasb-standarti.pdf», «Hamkasblar va ta’lim oluvchilarning ota-onalari bilan hamkorlik» bo‘limi; barnoyevak Drive/pedagogika/files. Sinf hujjatlari bo‘yicha hozirgi yuridik majburiyatlar bundan alohida normativ tekshiruvni talab qiladi.' },
  ],
  'M15.06': [
    { type: 'heading', content: 'Pedagogik etika, takt va refleksiya' },
    { type: 'definition', content: '**Etika** — kasbiy axloqiy me’yorlar. **Takt** — o‘quvchiga ta’sirda me’yor va vaziyatni his qilish. **Refleksiya** — o‘z darsini tahlil qilib, keyingi faoliyatni yaxshilash uchun xulosa chiqarish.' },
    { type: 'example', content: 'O‘quvchi javobda xato qildi. O‘qituvchi uni sinf oldida kamsitmasdan, xatoning sababini aniqlab yo‘l ko‘rsatdi — bu **pedagogik takt**. Keyin o‘qituvchi o‘z savoli tushunarsiz bo‘lganini anglab tuzatdi — bu **refleksiya**.' },
    { type: 'trap', content: 'Nutqning ravonligi — **nutq madaniyati**; ovoz, mimika va o‘zini boshqarish — **pedagogik texnika** bilan bog‘liq. Refleksiya esa shunchaki darsni eslab qo‘yish emas, uni baholab keyingi ishni moslashtirishdir.' },
    { type: 'source', content: 'Manba: Xoliqov, Pedagogik mahorat, nutq va pedagogik texnika bo‘limlari; 2025 kuzgi pedagogika testlari, 2-bet (refleksiya vaziyati).' },
    { type: 'heading', content: 'Refleksiya, pedagogik texnika va nutq sifati qanday ajratiladi?' },
    { type: 'table', content: '| Tushuncha | Faoliyatdagi dalil |\n|---|---|\n| Pedagogik takt | O‘quvchining qadr-qimmatini saqlab, vaziyatga mos ta’sir ko‘rsatish |\n| Pedagogik texnika | Ovoz, mimika, nutq sur’ati va o‘zini boshqarish |\n| Nutq madaniyati | Fikrning aniq, izchil, mantiqiy va tushunarli ifodalanishi |\n| Refleksiya | Dars natijasini tahlil qilib keyingi reja yoki metodni o‘zgartirish |\n| Pedagogik kreativlik | Maqsad va vaziyatga mos yangi pedagogik yechim ishlab chiqish |' },
    { type: 'example', content: 'Dars tushunarsiz bo‘lganini aniqlab, savol ketma-ketligini qayta tuzish — **refleksiya**. Murakkab algoritmni aniq va bosqichli izohlash — **nutq va didaktik mahorat**. O‘quvchi oldidagi noqulay vaziyatda muloyim, adolatli munosabat — **takt**.' },
    { type: 'trap', content: 'Refleksiya shunchaki sertifikat olish yoki darsni xotirlash bilan tugamaydi: tahlildan keyingi o‘zgarish muhim. Nutqning balandligi yoki mimika texnikasi nutq mazmunining ilmiy va mantiqiy sifatini avtomatik kafolatlamaydi.' },
    { type: 'source', content: 'Manbalar: «Xoliqov Pedagogik mahorat.pdf» (pedagogik texnika, takt, mimika ta’rifi), N. Muslimov va boshqalar «Pedagogik kompetentlik va kreativlik asoslari» (2015, kasbiy refleksiya), N. Mahmudov «O‘qituvchi nutqi madaniyati» (2007, kirishdagi nutq xususiyatlari); barnoyevak Drive/pedagogika/files. Kitobning fizik sahifa lokatorlari to‘liq ekspertizadan o‘tmagan.' },
  ],
  'M15.07': [
    { type: 'heading', content: 'Qobiliyatlar vaziyatda qanday bilinadi?' },
    { type: 'definition', content: '**Didaktik qobiliyat** — murakkab materialni sodda yetkazish; **perseptiv** — o‘quvchining ichki holatini sezish; **kommunikativ** — muloqot o‘rnatish; **tashkilotchilik** — sinf faoliyatini uyushtirish.' },
    { type: 'example', content: 'O‘qituvchi o‘quvchining ikkilanishini ko‘rdi — **perseptiv** qobiliyat. Unga yangi misol bilan mavzuni tushuntirdi — **didaktik** qobiliyat. Ikki amal bir vaziyatda qatnashgan, lekin test qaysi harakatni so‘raganini ajrating.' },
    { type: 'trap', content: 'Manbada qobiliyatlarning **turli mualliflar bo‘yicha turlicha tasniflari** uchraydi. Muallif ko‘rsatilgan savolda aynan o‘sha tasnifga tayangan holda javob bering; barcha ro‘yxatlarni bitta tasnif deb qabul qilmang.' },
    { type: 'source', content: 'Manba: Pedagogik qobilyatlar umumiy.pdf, 1–3-betlar; Xoliqov, Pedagogik mahorat, 1–2-betlar.' },
    { type: 'heading', content: 'Perseptiv, empatik va kommunikativ qobiliyatlar — nozik farq' },
    { type: 'table', content: '| Qobiliyat | Vaziyatdagi belgi |\n|---|---|\n| Perseptiv | O‘quvchining kayfiyati va holatidagi belgilarni sezish, idrok qilish |\n| Empatik | O‘quvchining his-tuyg‘usini tushunib, unga hamdard munosabat bildirish |\n| Kommunikativ | O‘quvchi bilan konstruktiv muloqot va ijobiy aloqa o‘rnatish |\n| Didaktik | Bilimni tushunarli usulda o‘rgatish |\n| Tashkilotchilik | Hamkorlikdagi faoliyatni tartibga solish |' },
    { type: 'example', content: 'Darsda o‘quvchi jim qolganini sezish — **perseptiv**; uning xavotirini tushunib qo‘llab-quvvatlash — **empatik**; tushunarli savol berib ochiq suhbat boshlash — **kommunikativ** qobiliyat ko‘rinishi.' },
    { type: 'trap', content: 'Manbada bir nechta muallifning turli tasniflari yonma-yon berilgan. «Avtoritar qobiliyat» atamasi ayrim tarixiy tasnifda shaxsiy obro‘ va ta’sir bilan bog‘langan; bu bolaga qo‘pol munosabat yoki majburlashni oqlamaydi.' },
    { type: 'source', content: 'Manba: «Pedagogik qobilyatlar umumiy.pdf», «Perseptiv qobiliyat», «Empatik qobiliyat» va boshqa pedagogik qobiliyatlar tavsifi; barnoyevak Google Drive/ChatExport_2026-10-19/files. Hali fizik sahifalar bo‘yicha locator ekspertizasi o‘tkazilmagan.' },
    { type: 'trap', content: '**Manbalar imlosi farqi:** 2026-yilgi informatika attestatsiyasi spetsifikatsiyasining 2-jadvalida «persiptiv-pedagogik qobiliyat» shakli yozilgan; «Pedagogik qobilyatlar umumiy.pdf» konspektida esa «Perseptiv qobiliyat» ishlatilgan. O‘quv mazmunida o‘quvchining holatini sezish va idrok qilish tushunchasini farqlang; rasmiy hujjatdagi imloni tahrir qilingan deb ko‘rsatmang.' },
    { type: 'source', content: 'Qo‘shimcha manba: «Informatika Testlar spesifikatsiyasi.pdf», Toshkent, 2026, 2-jadval («Umumiy pedagogika» kompetensiyalar ro‘yxati). Rasmiy spetsifikatsiya o‘z matnidagi «persiptiv-pedagogik» atamasini ishlatadi.' },
  ],
  'M15.08': [
    { type: 'heading', content: 'Ta’lim texnologiyalarini tanlash' },
    { type: 'definition', content: '**Muammoli ta’lim** fikrlashni talab qiluvchi vaziyatdan boshlanadi; **loyihaga asoslangan ta’lim** mahsulot yoki yechim tayyorlashga, **interfaol ta’lim** esa faol o‘zaro muloqotga tayanadi. Har birining maqsadi turlicha.' },
    { type: 'example', content: 'O‘quvchilar o‘z hududidagi ekologik masala yuzasidan ma’lumot yig‘ib, yechim ishlab chiqib taqdimot tayyorlashsa — loyihaga asoslangan yondashuv; oddiy bitta savolni muhokama qilish esa o‘z-o‘zidan loyiha bo‘lmaydi.' },
    { type: 'trap', content: '**Inklyuziv ta’lim** barcha o‘quvchining mazmunli ishtirokini ko‘zlaydi. Barchaga bir xil topshiriqni berish emas, zarur yordam va moslashtirish orqali ta’lim imkonini yaratish muhim.' },
    { type: 'source', content: 'Manba: Qodirova, Pulatova, Inklyuziv ta’lim: nazariya va metodika (2022), 8–11-betlar; M15 ta’lim texnologiyalari darsi.' },
    { type: 'heading', content: 'Inklyuziv ta’lim va korreksion yordamning vazifalari' },
    { type: 'definition', content: '**Inklyuziv ta’lim** — o‘quvchilarning individual ehtiyojlarini hisobga olib, umumiy ta’lim muhitida teng imkoniyat va mazmunli ishtirokni ta’minlash. **Korreksion pedagogika** — alohida rivojlanish va o‘rganish ehtiyojlarida maxsus pedagogik qo‘llab-quvvatlash yo‘nalishi. Inklyuziya faqat alohida mashg‘ulot bilan cheklanmaydi, maxsus yordam esa sinfdagi ishtirokni almashtirmaydi.' },
    { type: 'table', content: '| Vaziyat | Ta’limga kirish va ishtirok uchun moslashtirish |\n|---|---|\n| Eshitishdagi qiyinchilik | Og‘zaki yo‘riqnomani aniq yozma yoki subtitrli shaklda ham berish |\n| Ko‘rishdagi qiyinchilik | Kattalashtiriladigan yoki ekran o‘qigichga mos raqamli matn tanlash |\n| Nutqiy ifodalashdagi qiyinchilik | Bilimni yozma yoki muqobil usulda ko‘rsatish imkonini berish |\n| Turli tayyorgarlik darajasi | Bir o‘quv maqsadi uchun bosqichli qo‘llanma va turlicha yordam berish |' },
    { type: 'example', content: 'Informatika darsida barcha o‘quvchi algoritm ketma-ketligini tushuntirishi kerak. O‘qituvchi ayrim o‘quvchiga ekran o‘qigichga mos matn, boshqasiga bosqichlarga ajratilgan yo‘riqnoma beradi. **O‘quv maqsadi saqlanadi**, unga erishish yo‘li ehtiyojga ko‘ra moslashtiriladi.' },
    { type: 'trap', content: '**Atamalarni ajrating:** surdopedagogika — eshitish, tiflopedagogika — ko‘rish, logopediya — nutq bilan bog‘liq maxsus pedagogik yordam. Bular inklyuziv ta’limning o‘zi bilan sinonim emas. O‘qituvchi faqat sinfdagi kuzatuvga qarab tibbiy tashxis qo‘ymaydi; zarur yordamni tegishli mutaxassis va oila bilan kelishadi.' },
    { type: 'source', content: 'Manbalar: F.U. Qodirova, D.A. Pulatova, «Inklyuziv ta’lim: nazariya va metodika» (Chirchiq, 2022), «Kirish» va «Inklyuziv ta’lim» bo‘limlari — https://drive.google.com/file/d/1J67WL90Qh6uULzmI7yYIR0OJ6diTg3cX/view ; «Inklyuziv_talim_va_korreksion_pedagogika_qollanma.docx», «Inklyuziv ta’lim», «Korreksion pedagogika» va «O‘qituvchining vazifalari» bo‘limlari — https://docs.google.com/document/d/1-mz2ykvhEuG4dudIDq-k0zYofeLvbz2g/edit . DOCX ikkilamchi konspekt; sahifa raqamlari va amaldagi huquqiy talablar alohida tekshiriladi.' },
  ],
}

export function getPedagogyStudyNotes(subtopicId: string): TheoryBlock[] {
  return notes[subtopicId] ?? []
}

/**
 * The same previously published-on-screen M15 study notes belong in the main
 * paginated book, not a separate collapsed drawer after the reading CTA.
 * This does NOT approve their source pages or change answers/server lessons.
 */
export function withExistingPedagogyNotes(content: TopicContent): TopicContent {
  if (!/^M15\.0[1-8]$/.test(content.subtopicId)) return content
  const extra = getPedagogyStudyNotes(content.subtopicId)
  if (extra.length === 0) return content
  return { ...content, theory: [...content.theory, ...extra] }
}

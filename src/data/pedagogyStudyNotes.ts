/**
 * Short source-grounded explanations available even when the 2026-10-18
 * optional SQL supplements have not yet been applied to a database.
 * Historical answer markers are NOT used as authoritative quiz keys.
 */
import type { TheoryBlock } from './topicContent'

const notes: Record<string, TheoryBlock[]> = {
  'M15.01': [
    { type: 'heading', content: 'Sodda qilib tushunamiz' },
    { type: 'definition', content: '**Pedagogik mahorat** — o‘qituvchining shaxsiy fazilatlari, kasbiy bilimlari, qobiliyatlari va ta’lim-tarbiya usullaridan samarali foydalanishidir. Manbada to‘rtta bog‘liq tayanch ko‘rsatilgan: insonparvarlik, kasbiy bilim, pedagogik qobiliyat va pedagogik texnika.' },
    { type: 'example', content: 'O‘qituvchi mavzuni biladi, lekin o‘quvchilar tushunmayotganini sezgach, boshqa misol va ko‘rgazmali vositani tanlaydi. U faqat bilimni emas, o‘quvchini tushunish va o‘qitish usulini ham qo‘lladi.' },
    { type: 'trap', content: '**Pedagogika** — ta’lim-tarbiya haqidagi keng fan. **Didaktika** — ta’lim nazariyasi. **Predmet metodikasi** — muayyan fanni o‘qitish usullari. Savolda uchalasining vazifasini farqlang.' },
    { type: 'source', content: 'Manba: Xoliqov, Pedagogik mahorat, 1–2-betlar.' },
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
  ],
  'M15.04': [
    { type: 'heading', content: 'Dars turlari va dars tahlili farqi' },
    { type: 'definition', content: '**Dars turi** uning yetakchi didaktik maqsadini bildiradi; **dars tahlili** esa o‘tgan darsning qaysi jihati tekshirilayotganini ifodalaydi. Manbada aralash, yangi bilim, mustahkamlash-takrorlash, umumlashtirish-tizimlashtirish, ko‘nikma-malaka va nazorat-baholash darslari ajratilgan.' },
    { type: 'example', content: 'O‘qituvchi birinchi navbatda uy vazifasini tekshiradi, keyin yangi materialni tushuntiradi, mashq qildiradi va baholaydi. Bu **aralash dars**ga xos. Dars mazmunining ilmiyligi tekshirilsa esa **didaktik tahlil** bo‘ladi.' },
    { type: 'trap', content: '**Didaktik tahlil** — mazmun va ta’lim sifati; **uslubiy tahlil** — metod tanlovi; **psixologik tahlil** — diqqat va ruhiy muhit. **Pedagogik** va **metodologik** tahlil atamalari ham manbada alohida berilgan: so‘rovning asosiy belgisiga e’tibor bering.' },
    { type: 'source', content: 'Manbalar: Dars turlari.pdf, 1–2-betlar; dars tahlili turlari.pdf, 1-bet.' },
  ],
  'M15.05': [
    { type: 'heading', content: 'Hamkorlik nima uchun kerak?' },
    { type: 'definition', content: '**Sinf rahbari** o‘quvchi, sinf jamoasi, fan o‘qituvchilari va ota-onalar o‘rtasidagi tarbiyaviy hamkorlikni uyushtiradi. Maqsad ayb izlash emas, o‘quvchining rivojlanishini birgalikda qo‘llab-quvvatlashdir.' },
    { type: 'example', content: 'O‘quvchining darsdagi faolligi kamaydi. Sinf rahbari sababni tushunish uchun fan o‘qituvchilari va ota-ona bilan vaziyatni muhokama qiladi, keyin o‘quvchiga mos yordamni rejalashtiradi.' },
    { type: 'trap', content: 'Kasbiy standartda **hamkasblar va ota-onalar bilan hamkorlik** alohida kompetensiya. Bu har qanday holatda faqat sinf rahbarining vazifasi degani emas.' },
    { type: 'source', content: 'Manba: Pedagogning kasbiy standarti — metodik qo‘llanma, 1 va 13-betlar; M15 sinf rahbari darsi.' },
  ],
  'M15.06': [
    { type: 'heading', content: 'Pedagogik etika, takt va refleksiya' },
    { type: 'definition', content: '**Etika** — kasbiy axloqiy me’yorlar. **Takt** — o‘quvchiga ta’sirda me’yor va vaziyatni his qilish. **Refleksiya** — o‘z darsini tahlil qilib, keyingi faoliyatni yaxshilash uchun xulosa chiqarish.' },
    { type: 'example', content: 'O‘quvchi javobda xato qildi. O‘qituvchi uni sinf oldida kamsitmasdan, xatoning sababini aniqlab yo‘l ko‘rsatdi — bu **pedagogik takt**. Keyin o‘qituvchi o‘z savoli tushunarsiz bo‘lganini anglab tuzatdi — bu **refleksiya**.' },
    { type: 'trap', content: 'Nutqning ravonligi — **nutq madaniyati**; ovoz, mimika va o‘zini boshqarish — **pedagogik texnika** bilan bog‘liq. Refleksiya esa shunchaki darsni eslab qo‘yish emas, uni baholab keyingi ishni moslashtirishdir.' },
    { type: 'source', content: 'Manba: Xoliqov, Pedagogik mahorat, nutq va pedagogik texnika bo‘limlari; 2025 kuzgi pedagogika testlari, 2-bet (refleksiya vaziyati).' },
  ],
  'M15.07': [
    { type: 'heading', content: 'Qobiliyatlar vaziyatda qanday bilinadi?' },
    { type: 'definition', content: '**Didaktik qobiliyat** — murakkab materialni sodda yetkazish; **perseptiv** — o‘quvchining ichki holatini sezish; **kommunikativ** — muloqot o‘rnatish; **tashkilotchilik** — sinf faoliyatini uyushtirish.' },
    { type: 'example', content: 'O‘qituvchi o‘quvchining ikkilanishini ko‘rdi — **perseptiv** qobiliyat. Unga yangi misol bilan mavzuni tushuntirdi — **didaktik** qobiliyat. Ikki amal bir vaziyatda qatnashgan, lekin test qaysi harakatni so‘raganini ajrating.' },
    { type: 'trap', content: 'Manbada qobiliyatlarning **turli mualliflar bo‘yicha turlicha tasniflari** uchraydi. Muallif ko‘rsatilgan savolda aynan o‘sha tasnifga tayangan holda javob bering; barcha ro‘yxatlarni bitta tasnif deb qabul qilmang.' },
    { type: 'source', content: 'Manba: Pedagogik qobilyatlar umumiy.pdf, 1–3-betlar; Xoliqov, Pedagogik mahorat, 1–2-betlar.' },
  ],
  'M15.08': [
    { type: 'heading', content: 'Ta’lim texnologiyalarini tanlash' },
    { type: 'definition', content: '**Muammoli ta’lim** fikrlashni talab qiluvchi vaziyatdan boshlanadi; **loyihaga asoslangan ta’lim** mahsulot yoki yechim tayyorlashga, **interfaol ta’lim** esa faol o‘zaro muloqotga tayanadi. Har birining maqsadi turlicha.' },
    { type: 'example', content: 'O‘quvchilar o‘z hududidagi ekologik masala yuzasidan ma’lumot yig‘ib, yechim ishlab chiqib taqdimot tayyorlashsa — loyihaga asoslangan yondashuv; oddiy bitta savolni muhokama qilish esa o‘z-o‘zidan loyiha bo‘lmaydi.' },
    { type: 'trap', content: '**Inklyuziv ta’lim** barcha o‘quvchining mazmunli ishtirokini ko‘zlaydi. Barchaga bir xil topshiriqni berish emas, zarur yordam va moslashtirish orqali ta’lim imkonini yaratish muhim.' },
    { type: 'source', content: 'Manba: Qodirova, Pulatova, Inklyuziv ta’lim: nazariya va metodika (2022), 8–11-betlar; M15 ta’lim texnologiyalari darsi.' },
  ],
}

export function getPedagogyStudyNotes(subtopicId: string): TheoryBlock[] {
  return notes[subtopicId] ?? []
}

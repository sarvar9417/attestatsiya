/**
 * M03.01: independently authored, source-guided Word book chapter.
 * Not verbatim and not certified page-complete. Legacy theory is preserved in
 * topicContent.ts after this canonical reader, including all quiz keys.
 */
import type { TheoryBlock } from '../topicContent'

export const M03_01_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "Word matn protsessorining vazifasini aniqlash; hujjat, abzats, satr va bo‘limni farqlash; lenta, tezkor panel, holat satri va navigatsiyadan foydalanish; yangi hujjat yaratish, matnni belgilash va tahrirlash; Save va Save As, ochish va chop etish jarayonlarini xavfsiz bajarish; imlo, sharh va Track Changes bilan hamkorlikni tushuntirish."
  },
  {
    "type": "intro",
    "content": "Bu bob Word buyruqlarini yodlash bilan cheklanmaydi. Siz maktab jurnali uchun maqola tayyorlab, uni bir necha marta tuzatasiz, faylning nomi va joyini nazorat qilasiz, hujjatning mantiqiy tuzilishini saqlaysiz. Kompyuterda yozilgan matnning mazmuni bilan uning tashqi bezagi alohida tekshiriladi."
  },
  {
    "type": "heading",
    "content": "1. Matn protsessori va tayyor hujjat"
  },
  {
    "type": "definition",
    "content": "==Matn protsessori== — matnni kiritish, tahrirlash, tuzilmalash, bezash, saqlash va chiqarishga mo‘ljallangan dastur turidir. Microsoft Word shu turdagi dasturlardan biri. **Hujjat** matn, jadval, rasm, havola va boshqa obyektlardan tashkil topishi mumkin."
  },
  {
    "type": "text",
    "content": "Matn protsessori bilan oddiy matn muharriri orasidagi farq: protsessor sahifa maketi, uslublar, jadval, sahifa raqami, izohlar va chop etishga mos ko‘rinishni boshqaradi. Dastur nomidan ko‘ra bajariladigan **vazifa** va kerakli **funksiya**ni aniqlash muhim."
  },
  {
    "type": "table",
    "content": "| Vazifa | Kerakli imkoniyat | Natijani tekshirish |\n|---|---|---|\n| Xat va ariza | Matn, abzats, sahifa | Tiniq va tartibli hujjat |\n| Maktab jurnali maqolasi | Sarlavha, matn, rasm | Mazmun va manba ajratilgan |\n| Hisobot | Jadval, sahifa raqami, mundarija | Bo‘limlar izchil |\n| Guruhda tahrir | Sharh va o‘zgarishlarni kuzatish | Tuzatish muallifi ko‘rinadi |"
  },
  {
    "type": "trap",
    "content": "Word dasturining asosiy vazifasini rasm chizish, elektron jadvalda hisoblash yoki video montaj bilan aralashtirmang. Ularning ayrim obyektlari Word hujjatiga kiritilishi mumkin, lekin bu dasturning asosiy ixtisosini o‘zgartirmaydi."
  },
  {
    "type": "heading",
    "content": "2. Interfeysning vazifaviy xaritasi"
  },
  {
    "type": "table",
    "content": "| Element | Joylashuvi yoki vazifasi | Amaliy harakat |\n|---|---|---|\n| Title Bar | Hujjat va dastur oynasi nomi | Qaysi fayl ochilganini aniqlash |\n| Quick Access Toolbar | Tez-tez ishlatiladigan amallar | Save, Undo |\n| Ribbon | Buyruqlar sahifalari va guruhlari | Home / Insert / Layout |\n| Document area | Matn ustida ishlanadigan maydon | Kursorni joylashtirish |\n| Ruler | Abzats va maydon ko‘rsatkichlari | Chekinishni kuzatish |\n| Status Bar | Sahifa, so‘z soni va ayrim rejimlar | Hujjat holatini ko‘rish |\n| Navigation Pane | Sarlavha yoki qidiruv bo‘yicha o‘tish | Uzun matndan bo‘lim topish |"
  },
  {
    "type": "definition",
    "content": "==Ribbon (lenta)== buyruqlarni sahifalar (tabs) va guruhlarga ajratadi. **Home** matn va abzats, **Insert** obyekt, **Layout** sahifa maketi, **References** mundarija va havola, **Review** tekshirish va tahrir tarixini boshqaradi."
  },
  {
    "type": "text",
    "content": "Word interfeysi versiyaga, oynaning kengligiga va operatsion tizimga qarab biroz farq qiladi. Shuning uchun topshiriqda faqat bitta ikonkaning rangini emas, uning **nomi va maqsadi**ni tekshiring."
  },
  {
    "type": "example",
    "content": "Vaziyat: ikki sahifali hujjatda so‘zlar sonini topish kerak. Matnni qayta sanash o‘rniga holat satridagi Word Count ko‘rsatkichini tekshiring; zarur bo‘lsa Review → Word Count oynasidan kengaytirilgan ma’lumotni ko‘ring."
  },
  {
    "type": "heading",
    "content": "3. Hujjatning ichki tuzilishi"
  },
  {
    "type": "definition",
    "content": "==Belgi== — harf, son yoki tinish belgisi; ==so‘z== — belgilar ketma-ketligi; ==abzats== — Enter bilan yakunlangan mantiqiy bo‘lak. **Satr** ekranda ko‘rinadigan qator bo‘lib, u doim ham yangi abzats emas."
  },
  {
    "type": "table",
    "content": "| Amal | Natija | Qachon ishlatiladi |\n|---|---|---|\n| Enter | Yangi abzats | Yangi fikr boshlandi |\n| Shift+Enter | Shu abzats ichida qatorni uzish | Manzil yoki she’r satri |\n| Ctrl+Enter | Sahifa uzilishi | Yangi sahifadan boshlash |\n| Section Break | Bo‘lim ajratish | Turli sahifa yo‘nalishi yoki sarlavha sozlamasi |"
  },
  {
    "type": "trap",
    "content": "Sahifani pastga surish uchun ketma-ket Enter yoki Space bosmang: matn o‘zgarsa maket buziladi. **Page Break** va **Section Break** boshqa-boshqa vazifaga ega."
  },
  {
    "type": "heading",
    "content": "4. Yangi hujjat va shablon"
  },
  {
    "type": "text",
    "content": "Yangi hujjat uchun File → New → Blank Document yoki **Ctrl+N** ishlatiladi. Shablon esa oldindan tayyorlangan tuzilma va formatga ega. Maktab maqolasi uchun bo‘sh hujjat ham, hisobot shabloni ham mos kelishi mumkin."
  },
  {
    "type": "solved",
    "content": "**Ishlangan misol.** 1) Ctrl+N bosing. 2) Birinchi qatorda «Maktab axborotnomasi» sarlavhasini yozing. 3) Enter orqali yangi abzats oching. 4) Ikki gapli kirish yozing. 5) Hujjatga «informatika_maqola_01.docx» nomini bering. 6) Faylni qayta ochib tekshiring."
  },
  {
    "type": "note",
    "content": "File → New buyruqlari va shablonlar mavjudligi Office versiyasiga yoki tarmoqdagi shablon xizmatiga bog‘liq bo‘lishi mumkin. Shablon manbasi ishonchliligini tekshiring."
  },
  {
    "type": "heading",
    "content": "5. Matn kiritish va kursor harakati"
  },
  {
    "type": "definition",
    "content": "==Kiritish kursori== matn qayerga yozilishini ko‘rsatadi; sichqoncha ko‘rsatkichi esa ekranda boshqariladigan belgi. Ular doimo aynan bir nuqtada turmaydi."
  },
  {
    "type": "table",
    "content": "| Klavish | Umumiy harakat |\n|---|---|\n| Home / End | Satr boshiga / oxiriga o‘tish |\n| Ctrl+Home / Ctrl+End | Hujjat boshiga / oxiriga o‘tish |\n| Ctrl+← / Ctrl+→ | Oldingi / keyingi so‘z bo‘yicha yurish |\n| Ctrl+A | Hujjatdagi barcha matnni belgilash |\n| Backspace / Delete | Kursordan oldingi / keyingi belgini o‘chirish |"
  },
  {
    "type": "example",
    "content": "Matn: «Bugun kompyuter darsi boshlandi». «kompyuter» so‘zini «informatika»ga almashtirmoqchi bo‘lsangiz, kerakli so‘zni **belgilang** va yangisini yozing. O‘rinsiz bo‘sh joylar qo‘shishga hojat yo‘q."
  },
  {
    "type": "heading",
    "content": "6. Belgilash, ko‘chirish va nusxalash"
  },
  {
    "type": "table",
    "content": "| Amal | Klaviatura | Ta’siri |\n|---|---|---|\n| Cut | Ctrl+X | Belgilangan matnni olib, vaqtinchalik xotiraga o‘tkazish |\n| Copy | Ctrl+C | Asl matnni saqlab, nusxa olish |\n| Paste | Ctrl+V | Xotiradagi matnni joylash |\n| Undo | Ctrl+Z | So‘nggi amalni bekor qilish |\n| Redo | Ctrl+Y | Bekor qilingan amalni qaytarish (odatdagi Word sozlamasida) |"
  },
  {
    "type": "solved",
    "content": "**Ishlangan misol.** Hujjatda yakuniy xulosa boshida turibdi. Xulosani belgilang → Ctrl+X → hujjat oxiriga boring → Ctrl+V. Endi xulosa faqat oxirda qolishi lozim. Xato bo‘lsa Ctrl+Z bilan bitta qadam orqaga qayting."
  },
  {
    "type": "trap",
    "content": "Copy bilan Cut bir xil emas. Nusxa olish matnni eski joyida qoldiradi; kesib olish esa tanlangan bo‘lakni o‘sha joydan olib tashlaydi. Clipboard ichidagi matn boshqa dasturga ham joylanishi mumkin."
  },
  {
    "type": "heading",
    "content": "7. Qidirish va almashtirish"
  },
  {
    "type": "definition",
    "content": "==Find== hujjatdan kerakli harf yoki iborani topadi; ==Replace== topilgan matnni boshqa matn bilan almashtiradi. Ko‘p takrorlangan atamalar bilan ishlaganda bu amallar vaqtni tejaydi."
  },
  {
    "type": "solved",
    "content": "**Ishlangan misol.** Hujjatda «kompyutr» xatosi 12 marta takrorlangan. Ctrl+H → Find «kompyutr» → Replace with «kompyuter» → avval namuna orqali tekshiring, keyin Replace All. Natijani yana bir marta qidirib tekshiring."
  },
  {
    "type": "trap",
    "content": "Replace All hamma mos kelgan qismlarni almashtirishi mumkin. Masalan, qisqa «on» bo‘lagini ko‘r-ko‘rona almashtirish boshqa so‘zlarni ham buzadi. To‘liq so‘z yoki mos kelish shartlarini tanlash kerak."
  },
  {
    "type": "heading",
    "content": "8. Saqlash, boshqa nom bilan saqlash va ochish"
  },
  {
    "type": "definition",
    "content": "==Save== mavjud hujjatdagi o‘zgarishni saqlaydi. ==Save As== yangi nom, joy yoki format bilan alohida fayl yaratish uchun qo‘llanadi. Zamonaviy bulutli rejimlarda **AutoSave** bo‘lishi mumkin, ammo internet va xizmat sozlamalariga bog‘liq."
  },
  {
    "type": "table",
    "content": "| Amal | Odatdagi klavish | Nima tekshiriladi? |\n|---|---|---|\n| New | Ctrl+N | Yangi oynadagi hujjat |\n| Open | Ctrl+O | Ochilgan fayl manzili |\n| Save | Ctrl+S | So‘nggi tahrir yozilganmi? |\n| Save As | F12 (Windows Word) | Nom, papka, format |\n| Print | Ctrl+P | Printer, sahifa oralig‘i va masshtab |"
  },
  {
    "type": "text",
    "content": "**.docx** zamonaviy Word hujjatining keng tarqalgan formati. **.doc** eski format; **.pdf** sahifa ko‘rinishini keng muhitda saqlash uchun eksport qilinadi, lekin Word tahririga teng emas. Maxfiy hujjatni ulashishdan oldin ruxsatlar, muallif metama’lumotlari va sharhlarni tekshirish kerak."
  },
  {
    "type": "case",
    "content": "**Vaziyat.** O‘qituvchi «hisobot.docx» ustida ishlayapti. Uning arxiv nusxasi kerak bo‘lsa, Save As bilan «hisobot_2026_arxiv.docx» ni alohida yaratadi. Faqat Ctrl+S bosilsa, odatda shu faylning so‘nggi tahriri yoziladi."
  },
  {
    "type": "heading",
    "content": "9. Ko‘rish, sahifalash va chop etish"
  },
  {
    "type": "text",
    "content": "**Print Layout** sahifa chegaralarini, **Read Mode** o‘qishga mos ko‘rinishni beradi; ayrim versiyalarda Draft va Web Layout ham mavjud. Ko‘rish rejimini almashtirish hujjatning mazmunini o‘zgartirish shart emas."
  },
  {
    "type": "table",
    "content": "| Chop etishdan avval | Nima uchun kerak? |\n|---|---|\n| Print Preview | Rasm va matn uzilib qolmaganini tekshirish |\n| Page Range | Faqat kerakli sahifalarni chiqarish |\n| Orientation | Portret yoki albom yo‘nalishini tanlash |\n| Margins | Matn qog‘oz chetida kesilib qolmasligi |\n| Copies | Noto‘g‘ri ko‘p nusxa chiqarishdan saqlanish |"
  },
  {
    "type": "solved",
    "content": "**Ishlangan misol.** 6 sahifali hisobotning faqat 2–3-sahifalarini chiqarish kerak. Ctrl+P → sahifalar oraliği «2-3» → Preview orqali betlarni tekshirish → shundan keyin Print."
  },
  {
    "type": "heading",
    "content": "10. Matnni tekshirish va hamkorlik"
  },
  {
    "type": "text",
    "content": "Spelling/Grammar funksiyalari xatolarni aniqlashda yordam beradi, ammo har bir til va atamani to‘liq tanimasligi mumkin. Termin va ism xatolarini o‘qituvchi o‘zi tekshiradi."
  },
  {
    "type": "definition",
    "content": "==Comment== — hujjatga taklif yoki izoh yozish; ==Track Changes== — tahrirlar tarixini ko‘rsatish. Bu usullar hujjatdagi asosiy matn bilan tekshiruvchining fikrini ajratadi."
  },
  {
    "type": "case",
    "content": "**Vaziyat.** Uch o‘quvchi bitta maqolani tahrirlayapti. Birinchi o‘quvchi matn yozadi, ikkinchisi Comment orqali faktga manba so‘raydi, uchinchisi Track Changes bilan tuzatadi. Yakunda qaysi o‘zgarish qabul qilinishi guruh tomonidan hal qilinadi."
  },
  {
    "type": "trap",
    "content": "Matnda qizil yoki ko‘k belgi chiqishi uning albatta xato ekanini isbotlamaydi. Avtomatik imlo tekshiruvining til sozlamasi va terminologiyaga mosligini tekshiring."
  },
  {
    "type": "heading",
    "content": "11. Yaxshi hujjatning sifat nazorati"
  },
  {
    "type": "table",
    "content": "| Mezon | Amaliy mezon | Xavf |\n|---|---|---|\n| Mazmun | Fakt, sarlavha, izoh mos | Asossiz jumla |\n| Tuzilma | Abzats, bo‘lim va sarlavha izchil | Bo‘sh Enterlar bilan maket |\n| Qayta ochilish | Nom va papka aniq | Faylni topa olmaslik |\n| Rasm va jadval | Matnga xizmat qiladi | Bezash ortiqcha bo‘lishi |\n| Hamkorlik | Sharhlar ko‘rib chiqilgan | Tasdiqlanmagan tuzatish |\n| Maxfiylik | Shaxsiy ma’lumot ruxsat bilan | Noo‘rin ulashish |"
  },
  {
    "type": "quickcheck",
    "content": "1) Abzats bilan ekrandagi satrning farqi nima? 2) Nega Ctrl+S Save As emas? 3) Word’da yuqori panelning vazifasi qanday? 4) Ctrl+H nimaga xizmat qiladi? 5) Hujjatni PDF ko‘rinishga chiqarish bilan .docx tahrir qilishning farqini izohlang."
  },
  {
    "type": "heading",
    "content": "12. Mustaqil amaliy topshiriqlar"
  },
  {
    "type": "task",
    "content": "**1-mashq — boshlang‘ich.** Ctrl+N bilan yangi hujjat yarating; «Mening maktabim» deb sarlavha yozing; ikki abzats qo‘shing; Ctrl+S bilan aniq papkada saqlang va qayta oching."
  },
  {
    "type": "task",
    "content": "**2-mashq — o‘rta.** 150 so‘zli maqoladan uchta bir xil imlo xatosini Find/Replace orqali toping va tuzating. Natijani bitta-bitta tekshiring."
  },
  {
    "type": "task",
    "content": "**3-mashq — murakkab.** Birinchi sahifaga kirish, ikkinchisiga tavsif, uchinchisiga xulosa joylang. Buni ketma-ket bo‘sh Enter bilan emas, sahifa uzilishlari yordamida bajaring."
  },
  {
    "type": "task",
    "content": "**4-mashq — hamkorlik.** Sherigingiz hujjatidagi bir faktni izoh orqali aniqlashtiring; uning ruxsatisiz matnni o‘chirib yubormang. Ikki taklifni muhokama qiling."
  },
  {
    "type": "task",
    "content": "**5-mashq — attestatsiya.** «Bitta faylning nusxasini boshqa nomda saqlash», «tanlangan abzatsni boshqa joyga ko‘chirish» va «satr oxiridan keyingi sahifaga o‘tish» uchun to‘g‘ri buyruqlarni tanlang."
  },
  {
    "type": "answers",
    "content": "**Javob kaliti va izohlar.** 1) Hujjat yangi nom bilan qayta ochiladi. 2) Ctrl+H va tekshirilgan Replace; so‘z bo‘laklarini noto‘g‘ri almashtirmang. 3) Ctrl+Enter — sahifa uzilishi; Section Break talab qilinmagan bo‘lsa alohida bo‘lim shart emas. 4) Sharhlar kuzatiladi, tahrir muallifi aniq. 5) Save As (odatda F12); Cut/Paste (Ctrl+X/Ctrl+V); Page Break (Ctrl+Enter)."
  },
  {
    "type": "summary",
    "content": "Word hujjati sifatli bo‘lishi uchun **vazifa**, **mantiqiy tuzilma**, **tahrirlash amali**, **faylni saqlash** va **tekshiruv** birgalikda bajarilishi kerak. Shortcutlarni amaliy ma'nosidan ajratib yodlash kam foyda beradi."
  },
  {
    "type": "source",
    "content": "**Manba izi:** Cambridge+ «Informatika va axborot texnologiyalari», 5-sinf (2021), 1-modul «Matnli hujjat bilan ishlashni boshlash», bosma betlar taxminan 17–28, https://drive.google.com/file/d/1jiQYB3WiZ387MhjbSwUMO1xcDcIvbB1m/view ; Cambridge+ 10–11-sinf, 1-bob «Ma’lumot, axborot, bilimlar bazasi va matn bilan ishlash», matn bilan ishlash dasturlarining vazifalari, bosma bet 37–38, https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view . Izohlar va mashqlar original pedagogik qayta bayon; sahifama-sahifa to‘liq matn transkripsiyasi yoki Word versiyalariga universal moslik da'vo qilinmaydi."
  }
]

/** TASK-289: source-guided PowerPoint animation and transitions. */
import type { TheoryBlock } from '../topicContent'
export const M03_10_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "PowerPoint transition va animation farqini tushunish; Entrance, Emphasis, Exit, Motion Path kabi effektlardan maqsadli foydalanish; Animation Pane, Start, Delay, Duration va Trigger parametrlarini sozlash; o‘qilish va kirish imkoniyatini tekshirish."
  },
  {
    "type": "intro",
    "content": "Animatsiya tinglovchining fikrni bosqichma-bosqich tushunishiga yordam bersa foydali. Biror effektni qo‘shishdan avval «nimani ko‘rsataman», «qachon» va «nima uchun» savollariga javob bering. Harakatning ko‘pligi o‘qitish sifatining o‘lchovi emas."
  },
  {
    "type": "table",
    "content": "| Tushuncha | Nima boshqariladi? | Tipik maqsad |\n|---|---|---|\n| Transition | Butun slayd almashishi | Mavzular orasida o‘tish |\n| Entrance | Obyektning kirishi | Bosqichni ochish |\n| Emphasis | Mavjud obyektga urg‘u | Muhim qismni ajratish |\n| Exit | Obyektning chiqishi | Keraksiz qismni olib tashlash |\n| Motion Path | Obyekt yo‘li | Jarayon yo‘nalishi |"
  },
  {
    "type": "heading",
    "content": "1. O‘tish va animatsiya chegarasi"
  },
  {
    "type": "definition",
    "content": "Transition butun slaydning boshqa slaydga almashish usulini belgilaydi. Animation esa shu slayd ichidagi sarlavha, matn, shakl yoki rasmga qo‘llanadi. Ularning ikkalasi ma’lumot berishga xizmat qilishi, ortiqcha shovqin qilmasligi kerak."
  },
  {
    "type": "example",
    "content": "Slaydlar ketma-ket Fade orqali almashsin, lekin joriy slayddagi uch algoritm bosqichi birin-ketin ko‘rinsin. Fade — transition, uch bosqich — animation."
  },
  {
    "type": "trap",
    "content": "O‘tish effektini matn qutisiga qo‘llash mumkin deb adashtirmang: animatsiya obyektga tegishli."
  },
  {
    "type": "task",
    "content": "1-mashq. Bir slayd almashishi va ikki obyekt paydo bo‘lishini alohida nomlang."
  },
  {
    "type": "heading",
    "content": "2. Entrance — kirish animatsiyasi"
  },
  {
    "type": "definition",
    "content": "Entrance obyektning slaydda qanday paydo bo‘lishini boshqaradi. Appear va Fade kabi oddiy effektlar auditoriya e’tiborini yangi ma’lumotga qaratishda yetarli bo‘lishi mumkin; mavjud imkoniyatlar dastur versiyasiga qarab farqlanadi."
  },
  {
    "type": "solved",
    "content": "«Kiritish», «Hisoblash», «Natija» degan uchta shaklni On Click bilan ketma-ket oching: keyingi bosqich faqat oldingisi tushuntirilgach chiqadi."
  },
  {
    "type": "trap",
    "content": "Har satrga alohida shiddatli Fly In qo‘llash tinglovchini fikrdan chalg‘itishi mumkin."
  },
  {
    "type": "task",
    "content": "2-mashq. Uch bosqichli jarayonni kirish animatsiyasi bilan qisqa rejada yozing."
  },
  {
    "type": "heading",
    "content": "3. Emphasis — urg‘u berish"
  },
  {
    "type": "definition",
    "content": "Emphasis ekranda allaqachon turgan obyektga e’tibor qaratadi. U rang, o‘lcham yoki boshqa xususiyatni vaqtincha ta’kidlashi mumkin. Muhim fikrni oddiyroq statik belgi bilan berish yetarli bo‘lsa, animatsiya majburiy emas."
  },
  {
    "type": "case",
    "content": "Formuladagi `=SUM(B2:B6)` yozuvini ko‘rsating. Izoh berayotganda argument diapazonini ajrating, so‘ng asosiy qiymatni qayd eting."
  },
  {
    "type": "trap",
    "content": "Doimiy tebranadigan obyekt diqqatni band qilib qo‘yadi; faqat effekt uchun animatsiya qo‘shmang."
  },
  {
    "type": "task",
    "content": "3-mashq. Qaysi elementga urg‘u kerakligini, auditoriya nimani sezishi lozimligini ayting."
  },
  {
    "type": "heading",
    "content": "4. Exit — obyektni chiqarish"
  },
  {
    "type": "definition",
    "content": "Exit animatsiya bosqichlari tugagach obyektning yo‘qolish usulini belgilaydi. Ko‘rinmay qolgan obyekt haqidagi izoh hali davom etayotgan bo‘lsa, tinglovchi kontekstni yo‘qotishi mumkin."
  },
  {
    "type": "example",
    "content": "O‘qituvchi oldingi ikki yechim variantidan xato yo‘lni xulosa oldidan olib tashlab, to‘g‘risini slaydda qoldiradi."
  },
  {
    "type": "trap",
    "content": "Exit obyektni slayd faylidan o‘chirmaydi; tahrir rejimida obyekt hanuz mavjud."
  },
  {
    "type": "task",
    "content": "4-mashq. «Xato usulni ajratish» mashqida chiqish effektining mantiqiy vaqtini tanlang."
  },
  {
    "type": "heading",
    "content": "5. Motion Path va yo‘nalish"
  },
  {
    "type": "definition",
    "content": "Motion Path obyektning belgilangan yo‘l bo‘ylab harakatini ko‘rsatadi. U marshrut, jarayon va o‘zaro ta’sirni tushuntirishi mumkin; yo‘l, davomiylik va boshlanish holati mazmunga mos bo‘lishi kerak."
  },
  {
    "type": "solved",
    "content": "Tarmoq paketining «Kompyuter → Router → Server» yo‘lini qisqa harakat yo‘li bilan ko‘rsating, so‘ng har bir qurilma vazifasini izohlang."
  },
  {
    "type": "trap",
    "content": "Bezak uchun aylantirilgan, murakkab yo‘l foydali tarmoq topologiyasi yoki real tezlik dalili emas."
  },
  {
    "type": "task",
    "content": "5-mashq. Uch tugunli tarmoq paketining harakat yo‘lini chizib tushuntiring."
  },
  {
    "type": "heading",
    "content": "6. Animation Pane va qatlam tartibi"
  },
  {
    "type": "definition",
    "content": "Animation Pane joriy slayddagi effektlarni bitta joyda ko‘rish, tartiblash va vaqtini boshqarishga yordam beradi. Bir obyektga bir nechta animatsiya ulanadigan vaziyatda Add Animation kabi buyruqlar mavjud efektni almashtirib yubormaslik uchun ishlatiladi."
  },
  {
    "type": "case",
    "content": "Sarlavha Appear, rasm Fade, formula Emphasis bo‘lsin; panelda qaysi biri birinchi chiqishini tekshiring."
  },
  {
    "type": "trap",
    "content": "Obyektning qatlam tartibi va uning animatsiya vaqt navbati boshqa narsalar. Paneldagi 1, 2, 3 raqamlariga e’tibor bering."
  },
  {
    "type": "task",
    "content": "6-mashq. Uch obyektli slaydda effektlar navbatini mantiqiy izchil qilib qayta tartiblang."
  },
  {
    "type": "heading",
    "content": "7. Start: On Click, With Previous, After Previous"
  },
  {
    "type": "definition",
    "content": "On Click auditoriya yoki ma’ruzachi boshqaruviga bog‘liq; With Previous oldingi effekt bilan bir vaqtda, After Previous esa undan so‘ng ishga tushadi. Guruhlangan effektlarning ketma-ketligi namoyish rejimida sinov qilinadi."
  },
  {
    "type": "example",
    "content": "O‘qituvchi savolni On Click chiqaradi, savol yonidagi belgi With Previous bilan paydo bo‘ladi; javob esa keyingi boshqariladigan bosishda ochiladi."
  },
  {
    "type": "trap",
    "content": "With Previous va After Previous farqini adashtirish bir nechta obyektni kutilmagan paytda ko‘rsatadi."
  },
  {
    "type": "task",
    "content": "7-mashq. Savol, rasm va javob uchun mos Start sozlamalarini yozing."
  },
  {
    "type": "heading",
    "content": "8. Duration va Delay"
  },
  {
    "type": "definition",
    "content": "Duration effekt ijrosiga ketadigan vaqt, Delay esa boshlashdan avvalgi kutish. Qulay namoyishda vaqt auditoriya o‘qish tezligiga mos bo‘lishi zarur; darsdagi chuqur savolni avtomatik almashtirish noqulay bo‘lishi mumkin."
  },
  {
    "type": "solved",
    "content": "0,5 soniya Fade, 0 soniya kechikish va keyingi obyektni On Click tanlang; keyin nutq davomiyligi va o‘quvchining o‘qish ehtiyojini tekshiring."
  },
  {
    "type": "trap",
    "content": "Juda sekin effekt tinglovchini kutdiradi, juda tez effekt esa sabab-oqibatni ilg‘ashga imkon bermaydi."
  },
  {
    "type": "task",
    "content": "8-mashq. Ikki effekt uchun Delay va Duration farqini jadvalda ko‘rsating."
  },
  {
    "type": "heading",
    "content": "9. Transition galereyasi va Apply To All"
  },
  {
    "type": "definition",
    "content": "Fade, Push va Wipe kabi slaydlararo almashish turlari bir taqdimotda turli vazifaga mos keladi. Apply To All tanlangan o‘tishni tegishli slaydlarga umumiy qo‘llashi mumkin; uni barcha taqdimotga berishdan oldin mosligini tekshiring."
  },
  {
    "type": "case",
    "content": "12 slaydli ketma-ket mavzuda oddiy Fade qo‘llang. Muayyan demonstratsiyada alohida transition zarur bo‘lsa, u yerda ehtiyotkorlik bilan farqlang."
  },
  {
    "type": "trap",
    "content": "Apply To All har bir obyektga animation qo‘shmaydi; u transitions bo‘limi bilan bog‘liq."
  },
  {
    "type": "task",
    "content": "9-mashq. Olti slaydli konspekt uchun qaysi o‘tishni tanlaysiz va nega?"
  },
  {
    "type": "heading",
    "content": "10. Avtomatik slayd almashishi"
  },
  {
    "type": "definition",
    "content": "Transitions Timingda On Mouse Click va After kabi shartlar bo‘lishi mumkin. Avtomatik vaqt ko‘rsatishda ssenariy oldindan mashq qilinishi zarur; barcha slaydga bir xil vaqt berish har xil ma’lumot hajmini hisobga olmaydi."
  },
  {
    "type": "example",
    "content": "Fotosuratlardan iborat ko‘rgazmada 6 soniya oralig‘i qulay bo‘lishi mumkin, lekin murakkab formula uchun tinglovchi savoli tugamaguncha qo‘lda o‘tish afzal."
  },
  {
    "type": "trap",
    "content": "«After 5 seconds» sozlamasi obyektning har 5 soniyada qayta chiqishini anglatmaydi."
  },
  {
    "type": "task",
    "content": "10-mashq. Bir fotoalbom va bir murakkab dars slaydi uchun vaqt rejimini taqqoslang."
  },
  {
    "type": "heading",
    "content": "11. Trigger va interaktiv namoyish"
  },
  {
    "type": "definition",
    "content": "Trigger yoki obyekt ustiga bosish asosida efekt ishga tushirish imkoniyati ayrim taqdimotlarda mini-quiz yaratishga yordam beradi. Kutilmagan bosish, ekran o‘lchami va klaviatura orqali boshqarishni sinovdan o‘tkazing."
  },
  {
    "type": "solved",
    "content": "A, B va C kartochkali mini-testda tugmani bosgach tegishli izoh paydo bo‘lsin. Yashirin to‘g‘ri javobning oldindan ko‘rinib qolmasligini tekshiring."
  },
  {
    "type": "trap",
    "content": "Yashirin obyekt yoki animatsiya real imtihon javoblarini himoyalovchi server xavfsizligining o‘rnini bosa olmaydi."
  },
  {
    "type": "task",
    "content": "11-mashq. Interaktiv karta uchun trigger, javob izohi va qaytish tugmasi rejasini yozing."
  },
  {
    "type": "heading",
    "content": "12. Harakat sezgirligi va QA"
  },
  {
    "type": "definition",
    "content": "Tez chaqnash, katta harakat, takrorlanadigan ovozlar ayrim tinglovchilar uchun noqulay bo‘lishi mumkin. Harakatni kamaytirish variantini ko‘rib chiqing; oddiy statik slayd ham aniq tushuntirishga xizmat qiladi."
  },
  {
    "type": "case",
    "content": "Uchta animatsiyani ko‘rib, qaysi biri mazmunni ochishini, qaysi ikkitasi bezak ekanini belgilang. Bezagini olib tashlab, statik PDF nusxani ham tekshiring."
  },
  {
    "type": "trap",
    "content": "PowerPoint tahrir oynasidagi preview — haqiqiy proyektor, vaqt va obyektlar navbati sinovining o‘rnini bosmaydi."
  },
  {
    "type": "task",
    "content": "12-mashq. Besh bandli namoyish QA: tartib, vaqt, o‘qilish, audio, harakatsiz muqobilni tuzing."
  },
  {
    "type": "summary",
    "content": "Transition — slayd almashish, Animation — obyekt harakati. On Click ma’ruzachi boshqaruvi, With Previous birga, After Previous ketma-ket ishga tushishni anglatadi. Duration va Delay bir xil emas. Murakkab animatsiya o‘rniga mazmunga mos oddiy effekt va real namoyish sinovi afzal."
  },
  {
    "type": "answers",
    "content": "1) Slayd almashishi Transition, obyekt chiqishi Animation; 2) Entrance ketma-ket ochiladi; 3) Emphasis urg‘u beradi; 4) Exit obyektni fayldan o‘chirmaydi; 5) Motion Path yo‘nalishni ko‘rsatadi; 6) panel animatsiya vaqtini tartiblaydi; 7) On Click qo‘lda, With Previous birga, After Previous keyin; 8) Duration ijro, Delay kutish; 9) Apply To All transitionga; 10) murakkab dars uchun qo‘lda, fotoalbom uchun avtomatik mumkin; 11) Trigger qo‘lda test qilinadi; 12) ortiqcha harakat olib tashlanadi. Ochiq vazifalarda mantiqan asoslangan turli yechimlar mumkin."
  },
  {
    "type": "source",
    "content": "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), 19-bob «Taqdimot», bosma 240–250-betlar — o‘tishlar va taqdimot dizayni (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 7-sinf multimedia taqdimot va Transitions mavzulari (https://drive.google.com/file/d/1RhIRuHi8i7i18mkrd3eQQt2lJrbnfCkS/view). Animation Pane va Trigger tafsilotlari umumiy Office amaliyoti hamda mustaqil misollar asosida qayta bayon; fizik PDF barcha bet/rasm to‘liqligi tasdiqlanmagan. Menyu nomlari dastur versiyasiga qarab farqlanadi."
  }
]

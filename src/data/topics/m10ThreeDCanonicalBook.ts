/** TASK-304: original source-guided 3D modeling chapter. */
import type { TheoryBlock } from '../topicContent'
export const M10_05_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "3D koordinata, mesh, vertex/edge/face, primitive, transform, extrude, modellash usullari, material/texture, yorug‘lik, render, CAD/3D printer va rigging farqlarini amaliy vaziyat bilan tushunish."
  },
  {
    "type": "intro",
    "content": "3D model ekrandagi surat emas, fazoda joylashgan geometriya, material va sahna elementlarining yig‘indisidir. Qayta ishlanadigan sahna va eksport renderi vazifasi farq qiladi. Bu bob Blender amaliyoti va CAD/3D printer misollaridan boshlang‘ich chuqur tushuncha beradi."
  },
  {
    "type": "table",
    "content": "| Element | Nima boshqaradi? | Misol |\n|---|---|---|\n| Vertex | Fazodagi nuqta | (x,y,z) |\n| Edge | Qirra | Kub chegarasi |\n| Face | Yuza | Poligon |\n| Mesh | Geometriya tuzilmasi | Kub shakli |\n| Material/texture | Sirt ko‘rinishi | Yog‘och naqshi |\n| Camera/light | Kadr va yoritish | Render sahnasi |"
  },
  {
    "type": "heading",
    "content": "1. 3D koordinatalar va o‘lchov"
  },
  {
    "type": "definition",
    "content": "3D modelda nuqta x, y, z koordinata orqali aniqlanadi. Modellashda o‘lchov birligi, masshtab va obyektning koordinata boshlanishiga nisbatan joylashuvi muhim; ekran esa 3D sahnani ikki o‘lchamli proyeksiya orqali ko‘rsatadi."
  },
  {
    "type": "case",
    "content": "Kub markazi (0,0,0), eni 2 birlik: qirralari koordinata bo‘ylab taxminan -1 dan +1 gacha joylashishi mumkin; ish boshlashda birlikni belgilang."
  },
  {
    "type": "trap",
    "content": "3D obyekt ekranda kichik ko‘rinishi uning real sahna o‘lchami kichikligini isbotlamaydi: kamera va masofa ta’sir qiladi."
  },
  {
    "type": "task",
    "content": "1-mashq. x, y, z o‘qlarini belgilab, stol modeli uchun real o‘lcham tanlang."
  },
  {
    "type": "heading",
    "content": "2. Vertex, Edge, Face va Mesh"
  },
  {
    "type": "definition",
    "content": "Vertex uch, Edge ikkita uchni bog‘lovchi qirra, Face yuz; Mesh ular orqali ko‘pyoqli sirt tuzilmasini ifodalaydi. Polygon uchburchak yoki ko‘p burchakli bo‘lishi mumkin. Sirtning normal yo‘nalishi yoritish va ko‘rinishga ta’sir qiladi."
  },
  {
    "type": "solved",
    "content": "Oddiy kub 8 uch, 12 qirra va 6 kvadrat yoqqa ega. Kerak bo‘lsa renderlashda yoqlar uchburchaklarga ajratiladi."
  },
  {
    "type": "trap",
    "content": "Ko‘p poligon har doim yaxshi ko‘rinish degani emas: model maqsadi va ishlash unumdorligi ham mezon."
  },
  {
    "type": "task",
    "content": "2-mashq. Kub va piramidaning uch, qirra, yoq sonini mustaqil sanang."
  },
  {
    "type": "heading",
    "content": "3. Primitive va Edit/Object rejimlari"
  },
  {
    "type": "definition",
    "content": "Cube, Sphere, Cylinder kabi primitives tayyor boshlang‘ich geometriyalar. Blenderda Object Mode butun obyektni joylash va o‘lchash, Edit Mode esa mesh uchlari, qirralari va yoqlarini tahrir qilish uchun. Buyruqlar versiya va rejimga qarab farq qiladi."
  },
  {
    "type": "example",
    "content": "O‘quvchi silindrni Object Mode da stol ustiga qo‘yadi, Edit Mode da yuqori yuzni o‘zgartirib stakan maketi qiladi."
  },
  {
    "type": "trap",
    "content": "Obyektni butun ko‘chirish va uning bitta uchini siljitish turli o‘zgarishlar; noto‘g‘ri rejimda amalni bajarmang."
  },
  {
    "type": "task",
    "content": "3-mashq. Kubdan soddalashtirilgan kursi yasashda qaysi rejimda qaysi amalni bajarishni yozing."
  },
  {
    "type": "heading",
    "content": "4. Transform: Move, Rotate, Scale"
  },
  {
    "type": "definition",
    "content": "Move joyni, Rotate yo‘nalishni, Scale o‘lchamni boshqaradi; x, y, z o‘qlari bo‘yicha cheklash mumkin. Scale koeffitsienti birlik va obyekt lokal o‘qlariga bog‘liq. Interfeysda transformni qo‘llash (Apply) ayrim modifierlar uchun ahamiyatli."
  },
  {
    "type": "case",
    "content": "2 birlikli kub Scale 1.5 marta kattalashsa o‘lchami 3 birlik bo‘ladi, lekin shunchaki kamerani yaqinlashtirish geometriya o‘lchamini o‘zgartirmaydi."
  },
  {
    "type": "trap",
    "content": "View zoom va Scale bir xil emas; transformning ishlash tartibi parent va modifierlarda ko‘rinishni o‘zgartirishi mumkin."
  },
  {
    "type": "task",
    "content": "4-mashq. Bir obyektni x bo‘ylab ko‘chirib, z bo‘ylab aylantirish rejasini yozing."
  },
  {
    "type": "heading",
    "content": "5. Extrude, Inset va bevel"
  },
  {
    "type": "definition",
    "content": "Extrude tanlangan yuz/qirradan qo‘shimcha geometriya chiqaradi. Inset tanlangan yuz ichida yangi chegara hosil qiladi; Bevel keskin qirralarni yumshatadi. Amallar mesh murakkabligi va topologiyasini oshirishi mumkin."
  },
  {
    "type": "solved",
    "content": "Kubning yuqori yuzini Extrude qilib ustun hosil qiling, Inset yordamida oyna atrofiga ramka chiqaring, so‘ng ozgina Bevel bering."
  },
  {
    "type": "trap",
    "content": "Extrude paytida tasodifiy takrorlash ko‘rinishidan bilinmaydigan ustma-ust yuzlar paydo qilishi mumkin."
  },
  {
    "type": "task",
    "content": "5-mashq. Oddiy shkaf modeliga eshik uchun qaysi uchta amal mosligini ayting."
  },
  {
    "type": "heading",
    "content": "6. Poligonal, spline va sculpting usullari"
  },
  {
    "type": "definition",
    "content": "Poligonal modellash mesh uch, qirra va yuz bilan ishlaydi. Spline/curve usuli egri chiziqlarga tayanadi; sculpting go‘yo loyni shakllantirgandek organik sirt uchun, parametrik usul esa o‘lcham va qoidalarni boshqarishga qulay."
  },
  {
    "type": "example",
    "content": "Mebelning tekis panellari uchun poligonal yoki parametrik usul, o‘yin qahramoni yuzining organik shakli uchun sculpting qulay bo‘lishi mumkin."
  },
  {
    "type": "trap",
    "content": "Usullarning hech biri barcha obyekt uchun yagona eng samarali deb hisoblanmaydi; animatsiya, CAD va 3D print talablarining farqi bor."
  },
  {
    "type": "task",
    "content": "6-mashq. Stul, inson haykali va quvur uchun mos modellash usulini asoslang."
  },
  {
    "type": "heading",
    "content": "7. Material, texture va UV"
  },
  {
    "type": "definition",
    "content": "Material sirtning rang, yaltiroqlik, qo‘pollik va yorug‘likka munosabatini ifodalaydi. Texture sirt xususiyatlarini rasm yoki algoritmik naqsh bilan boshqaradi. UV koordinatalari ikki o‘lchamli rasmni 3D sirtga joylaydi."
  },
  {
    "type": "case",
    "content": "Yog‘och stolga material yarating, taxta teksturasini UV orqali to‘g‘ri yo‘naltirib, naqsh cho‘zilib ketmaganini tekshiring."
  },
  {
    "type": "trap",
    "content": "G‘isht rasmi qo‘yish devorda real chuqur geometrik g‘ishtlar borligini anglatmaydi; bump/normal va displacement farq qiladi."
  },
  {
    "type": "task",
    "content": "7-mashq. Tekstura va geometriya farqini shaffof misol bilan tushuntiring."
  },
  {
    "type": "heading",
    "content": "8. Yoritish, kamera va rendering"
  },
  {
    "type": "definition",
    "content": "Sahnani render qilish uchun obyekt geometriyasi, material, yorug‘lik, kamera va render sozlamalari muhim. Render 3D sahnadan rastr tasvir yoki animatsiya kadrlarini hisoblaydi; yoritish yo‘nalishi soyalar va faktura idrokini o‘zgartiradi."
  },
  {
    "type": "solved",
    "content": "Stol modeli bor sahnada kamera balandligi va asosiy lampani almashtiring: geometriyaga tegmagan holda natija boshqacha chiqadi."
  },
  {
    "type": "trap",
    "content": "Render qilindi — modelning geometriyasi, xavfsizligi yoki 3D bosmaga yaroqliligi tekshirildi degani emas."
  },
  {
    "type": "task",
    "content": "8-mashq. Bir sahna uchun kamera, material, yoritish va render chiqish formatini rejada belgilang."
  },
  {
    "type": "heading",
    "content": "9. CAD, 3D printer va ishlab chiqarish"
  },
  {
    "type": "definition",
    "content": "CAD o‘lcham va konstruktsiyaga asoslangan loyihani yaratish va tekshirishga xizmat qiladi. 3D printer odatda qatlamma-qatlam material qo‘shib fizik obyekt yaratadi; bosma uchun yopiq mesh, devor qalinligi, birlik va qo‘llab-quvvatlovchi struktura zarur bo‘lishi mumkin."
  },
  {
    "type": "example",
    "content": "Tayanch kronshteynni 3Dga tayyorlang: o‘lcham birliklarini mm qilib, yopiq korpus va material/print muhitini tekshiring."
  },
  {
    "type": "trap",
    "content": "Chiroyli renderni tayyor fizik detalga tenglashtirmang; material mustahkamligi va toleranslar alohida masala."
  },
  {
    "type": "task",
    "content": "9-mashq. 3D chop uchun modelda tekshiriladigan 4 bandli ro‘yxat tuzing."
  },
  {
    "type": "heading",
    "content": "10. 3D dasturlarini vazifaga ko‘ra solishtirish"
  },
  {
    "type": "definition",
    "content": "Blender umumiy 3D modellashtirish, animatsiya va renderga xizmat qiluvchi ochiq kodli paket. Tinkercad brauzerda soddaroq dizayn mashqlari uchun, professional CAD dasturlari esa o‘lchamli muhandislik loyihalarida foydalaniladi. Maya, 3ds Max va SketchUpning imkoniyat hamda litsenziyasi farq qiladi."
  },
  {
    "type": "case",
    "content": "O‘rta sinfda geometrik stakan modellashtirish Tinkercadda qulay; murakkab animatsiya uchun Blender mosroq, lekin real dastur tanlovi uskunaga bog‘liq."
  },
  {
    "type": "trap",
    "content": "«Bepul» va «pullik» dastur kategoriyasi o‘quv natijasi, kirish imkoniyati va eksport mosligini baholash o‘rnini bosmaydi."
  },
  {
    "type": "task",
    "content": "10-mashq. Uch vazifa uchun dastur, jihoz va eksport formatini jadvalda belgilang."
  },
  {
    "type": "heading",
    "content": "11. Model animatsiyasi va rigging"
  },
  {
    "type": "definition",
    "content": "Rigging suyaklar/armatura orqali model qismlarini bog‘lash, keyframe esa muhim vaqt holatini yozishga yordam beradi. Oddiy obyektni joylash animatsiyasi riggingsiz mumkin; murakkab qahramon deformatsiyasida og‘irliklar (weights) muhim."
  },
  {
    "type": "solved",
    "content": "Robot qo‘li harakatida aylanishni keyframelar bilan ifodalang; odam modeli uchun armatura va teri deformatsiyasini tekshirish kerak bo‘lishi mumkin."
  },
  {
    "type": "trap",
    "content": "Animatsiya modellashning barcha vazifasida majburiy bosqich emas; statik mahsulot uchun keraksiz."
  },
  {
    "type": "task",
    "content": "11-mashq. Statik mebel va jonli qahramon loyihalarida rigging ehtiyojini solishtiring."
  },
  {
    "type": "heading",
    "content": "12. Yakuniy amaliy loyiha"
  },
  {
    "type": "definition",
    "content": "Oddiy 3D obyekt uchun g‘oya, o‘lcham, primitive, mesh edit, material/texture, yorug‘lik, kamera, render va faylni saqlash bosqichlarini tizimli yozing. Yangi boshlovchi avval bir sahnani sinash orqali geometriya va ko‘rinish farqini ajratadi."
  },
  {
    "type": "example",
    "content": "Kitob javoni maketini 2 xil kamera burchagida render qiling; so‘ng uning o‘lcham parametrlarini tekshirib, ishchi .blend faylini saqlang."
  },
  {
    "type": "trap",
    "content": "Faqat render PNGni saqlash original .blend sahnani qayta tahrirlash imkoniyatini bermaydi."
  },
  {
    "type": "task",
    "content": "12-mashq. Raqamli render va fizik modelning sifatini alohida baholaydigan rubrika yozing."
  },
  {
    "type": "summary",
    "content": "Mesh uch-qirra-yuzlardan tashkil topadi; material va tekstura geometriyadan farq qiladi. Transform o‘lcham va holatni, kamerani yaqinlashtirish faqat ko‘rinishni boshqaradi. Render fizik obyektni tasdiqlamaydi. CAD/3D printer uchun geometrik yopiqlik, birlik va material sifatlari alohida tekshiriladi."
  },
  {
    "type": "answers",
    "content": "1) x/y/z va birlik; 2) kub 8 uch, 12 qirra, 6 yoq; 3) Object butun obyekt, Edit mesh; 4) Move/Rotate/Scale farqli; 5) Extrude geometriya chiqaradi; 6) poligonal/spline/sculpting; 7) texture ko‘rinish, geometry shakl; 8) yoritish va kamera renderga ta’sir; 9) yopiq mesh, mm va material; 10) vazifaga mos dastur; 11) rigging statik modelda majburiy emas; 12) .blend ishchi, PNG eksport. Ochiq masalalarda bir necha asosli yechim bo‘lishi mumkin."
  },
  {
    "type": "source",
    "content": "Manbalar: Cambridge+ 9-sinf 3D printer va uch o‘lchamli model mavzusi (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf CAD/CAM, 2D va 3D loyihalash bo‘limlari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view); Blender 4.5 LTS rasmiy qo‘llanmasi (https://docs.blender.org/manual/en/4.5/index.html). Aniq Blender vositalari amaliy manba bilan to‘ldirilgan mustaqil pedagogik izohdir; har bir fizik PDF bet va rasm 1:1 tasdiqlanmagan."
  }
]

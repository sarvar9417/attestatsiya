/** TASK-297: selection, crop, layers, masks and nondestructive edits. */
import type { TheoryBlock } from '../topicContent'
export const M10_03_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "Belgilash (Marquee/Lasso/Magic Wand), Crop, Resize, qatlam, maska, rang sozlash, matn va eksport farqini vazifada qo‘llash; nondestruktiv tahrir, xavfsiz saqlash va pedagogik sifat nazoratini bajarish."
  },
  {
    "type": "intro",
    "content": "Grafik tahrirda «nimani belgiladim», «qayerda tahrir qildim» va «nima o‘zgardi» savollariga javob juda muhim. Fotosuratni Crop qilish, belgilash va maskalash bir xil amal emas. Ushbu bobda amallar ishchi loyiha jarayoni bo‘ylab ketma-ket ko‘rsatiladi."
  },
  {
    "type": "table",
    "content": "| Vosita | Amaliy vazifa | Xavf |\n|---|---|---|\n| Marquee / Lasso | Hududni tanlash | Noaniq chegara |\n| Magic Wand | O‘xshash ranglarni tanlash | Tolerance noto‘g‘ri |\n| Crop | Kadrni kesish | Muhim obyekt yo‘qolishi |\n| Resize | O‘lchamni o‘zgartirish | Detal kamayishi |\n| Layer | Mustaqil kompozitsiya | Tartib va ko‘rinish |\n| Mask | Yashirish/ko‘rsatish | Faol thumbnail xatosi |"
  },
  {
    "type": "heading",
    "content": "1. Tahrir jarayonining maqsadi va originalni asrash"
  },
  {
    "type": "definition",
    "content": "Tasvirni tahrirlashdan oldin yakuniy maqsad: foto kesish, fonni ajratish, rangni tuzatish yoki kompozitsiya yaratish aniqlanadi. Ishchi originalni alohida saqlash tahrirni qaytarish imkonini beradi. Faqat eksport fayl bilan ishlash keyingi qayta tahrirni cheklashi mumkin."
  },
  {
    "type": "case",
    "content": "Maktab tadbiri uchun suratning orqa fonini almashtirishda dastlab original foto va ishchi qatlamli nusxa saqlanadi, keyin ajratish bajariladi."
  },
  {
    "type": "trap",
    "content": "Ctrl+Z bir nechta bosqichni qaytarishi mumkin, ammo butun loyiha strategiyasi faqat Undo tarixiga tayanmasligi kerak."
  },
  {
    "type": "task",
    "content": "1-mashq. Ishni boshlashdan oldingi besh amalli xavfsiz tahrir rejasi tuzing."
  },
  {
    "type": "heading",
    "content": "2. Selection: obyektni yoki piksel maydonini ajratish"
  },
  {
    "type": "definition",
    "content": "Selection vositalari tasvirning muayyan qismini keyingi amal uchun ajratadi. Marquee geometrik maydon, Lasso qo‘lda chizilgan kontur, rang o‘xshashligiga tayangan Magic Wand esa shartga mos piksel hududini belgilashi mumkin. Tolerance va Anti-alias natijaga ta’sir qiladi."
  },
  {
    "type": "example",
    "content": "Bir rangli fonli logotipda Magic Wand orqali fonni tanlab, chegaraning yumshoqligini tekshiring; notekis konturda Lasso yoki boshqa mos vosita tanlang."
  },
  {
    "type": "trap",
    "content": "Selection obyektdan barcha fonni o‘chirib tashladi degani emas. Tanlov hududi bilan asl rasm qatlamini alohida ajrating."
  },
  {
    "type": "task",
    "content": "2-mashq. Marquee, Lasso va Magic Wanddan qaysi vazifa uchun foydalanishni taqqoslang."
  },
  {
    "type": "heading",
    "content": "3. Magic Wand va tolerance"
  },
  {
    "type": "definition",
    "content": "Magic Wand rang jihatidan o‘xshash piksel maydonlarini tanlashga yordam beradi. Tolerance kabi parametr kichik bo‘lsa rang jihatidan yaqinroq, katta bo‘lsa kengroq rang oralig‘i belgilanishi mumkin. Contiguous faqat tutash hududlarni tanlashga ta’sir qiladi."
  },
  {
    "type": "solved",
    "content": "Oq fonli piktogrammada tolerance juda katta bo‘lsa predmetning och rangli qismi ham belgilanadi; qiymatni pasaytirib tanlovni tekshiring."
  },
  {
    "type": "trap",
    "content": "Sezgirlik parametrini bilmasdan belgilashni takrorlash fonni qoldirish yoki obyekt chetlarini yo‘qotishga olib kelishi mumkin."
  },
  {
    "type": "task",
    "content": "3-mashq. Yopishiq va yopishiq bo‘lmagan ikki oq hudud misolida Contiguous farqini izohlang."
  },
  {
    "type": "heading",
    "content": "4. Crop, resize va selection farqlari"
  },
  {
    "type": "definition",
    "content": "Crop tasvirning ko‘rinadigan ramkasini va kompozitsiyasini o‘zgartiradi; Resize eni/bo‘yi yoki piksel sonini o‘zgartiradi; Selection faqat tanlangan ish hududini belgilaydi. Crop vaqtida aspect ratio kerakli nashr maydoniga mos saqlanishi mumkin."
  },
  {
    "type": "case",
    "content": "16:9 rasmni 1:1 avatar uchun Crop bilan moslang, odam yuzi kadrda qolganini tekshiring; keyin eksport o‘lchamini masalan 512×512 piksel qilib belgilang."
  },
  {
    "type": "trap",
    "content": "800×600 rasmdan 400×300ni kesish tasvirni shunchaki 50% kichraytirish bilan bir xil mazmuniy natija bermaydi."
  },
  {
    "type": "task",
    "content": "4-mashq. Crop bilan Resize qilingan ikki natijaning farqini chizing."
  },
  {
    "type": "heading",
    "content": "5. Layer va ko‘rinish tartibi"
  },
  {
    "type": "definition",
    "content": "Layer kontentni alohida boshqarish imkonini beradi. Yuqori qatlam pastdagini qisman yoki to‘liq berkitishi, blend mode ranglarni aralashtirishi mumkin. Opacity qiymati 0–100% oralig‘ida ko‘rinishni boshqaradi; ko‘rinmaydigan qatlam hali faylda bo‘lishi mumkin."
  },
  {
    "type": "example",
    "content": "Afisha: fon — pastda, rasm — o‘rtada, yozuv — yuqorida. Yozuv ko‘rinmasa boshqa qatlam uni berkitmaganini va ko‘rinish belgisi yoqilganini tekshiring."
  },
  {
    "type": "trap",
    "content": "Layer tartibi bilan obyekt tanlash Selection amalini tenglashtirmang; bir qatlam ichida ham ko‘plab piksel bo‘lishi mumkin."
  },
  {
    "type": "task",
    "content": "5-mashq. Uch qatlamli afisha uchun ko‘rinish va joylashuv sxemasini tuzing."
  },
  {
    "type": "heading",
    "content": "6. Maska: ko‘rinishni asl pikselsiz boshqarish"
  },
  {
    "type": "definition",
    "content": "Layer Mask pikselni butunlay o‘chirib yubormasdan qaysi qismi ko‘rinishini boshqarishi mumkin. Oq maska ko‘rsatadi, qora yashiradi, kulrang qisman ko‘rsatadi. Maskaning o‘zi ham ish jarayonida tahrirlanadi."
  },
  {
    "type": "solved",
    "content": "Suratdagi shaxsni fonga qo‘shishda yumshoq qora Brush bilan maskaning chetini yashiring. Xato yashirilgan joyni oq Brush bilan qayta ko‘rsating."
  },
  {
    "type": "trap",
    "content": "Maskada ishlashdan oldin uning thumbnaili tanlanganiga ishonch hosil qiling, aks holda Brush asl rasmni bo‘yab yuborishi mumkin."
  },
  {
    "type": "task",
    "content": "6-mashq. Maska qo‘llab fonni qayta tiklashning qadamlarini yozing."
  },
  {
    "type": "heading",
    "content": "7. Brush, Eraser va gradient"
  },
  {
    "type": "definition",
    "content": "Brush piksel yoki maskada chizishi mumkin; Eraser ko‘pincha rasm tarkibini o‘chirishga xizmat qiladi, ammo ishlash prinsipi qatlam turi bilan bog‘liq. Gradient rang yoki maska qiymatining uzluksiz o‘tishini beradi; natijaga yumshoqlik, opacity va qatlam tartibi ta’sir qiladi."
  },
  {
    "type": "case",
    "content": "Ikki foto chegarasi keskin ko‘rinsa maskada oq-qora gradientdan foydalanib yumshoq o‘tish yarating; avval va keyin variantini yonma-yon solishtiring."
  },
  {
    "type": "trap",
    "content": "Gradient hech qanday mazmuniy kesish talab etilmagan suratga ishlatilsa bezak uchun tasvir sifatini pasaytirishi mumkin."
  },
  {
    "type": "task",
    "content": "7-mashq. Ikki rasmdan kompozitsiya yaratish uchun Brush yoki gradient tanlang va sababini ayting."
  },
  {
    "type": "heading",
    "content": "8. Rang tuzatish: brightness, contrast va saturation"
  },
  {
    "type": "definition",
    "content": "Brightness umumiy yorqinlik, Contrast tonlar farqi, Saturation rang to‘yinganligini boshqaradi. Kadrni to‘g‘rilashda avval exposure va tonal diapazon, keyin rang og‘ishini tekshirish foydali. Hue/Saturation yoki Levels adjustment layer tasvirni qaytariladigan usulda sozlashi mumkin."
  },
  {
    "type": "example",
    "content": "Juda qorong‘i suratda yorqinlikni oshirishdan oldin histogrammada butun detal qora yoki oq zonasiga yopishib qolmaganini ko‘ring; keyin nazoratli tuzatish qiling."
  },
  {
    "type": "trap",
    "content": "Juda oshirilgan contrast qorong‘i va yorqin joydagi ma’lumotni yo‘qotishi mumkin; saturatsiyani kuchaytirish faktni manipulyatsiya qilmasin."
  },
  {
    "type": "task",
    "content": "8-mashq. Bir foto rangdagi ikkita kamchilikni topib, adjustment yo‘lini yozing."
  },
  {
    "type": "heading",
    "content": "9. Matn, typografiya va o‘qilish"
  },
  {
    "type": "definition",
    "content": "Grafikadagi matn qatlamga ajratilib, shrift hajmi, satrlar oralig‘i, kontrast va sarlavha ierarxiyasi bo‘yicha baholanadi. Matnni rasmning juda murakkab joyiga qo‘yish o‘qilishni kamaytiradi. Rasmdagi ma’lumotni ko‘rish qobiliyati turlicha bo‘lgan auditoriya uchun izoh bilan berish kerak."
  },
  {
    "type": "solved",
    "content": "Fotosurat ustidagi oq sarlavha yorug‘ fon tufayli o‘qilmayapti: matn ostiga yarim shaffof to‘q maydon qo‘ying yoki boshqa joyga ko‘chiring."
  },
  {
    "type": "trap",
    "content": "Faqat shadow yoki glow ko‘paytirish har doim yetarli kontrast hosil qilmaydi."
  },
  {
    "type": "task",
    "content": "9-mashq. Telefon ekranida ham o‘qiladigan rasmli e’lon uchun uchta typografik mezon belgilang."
  },
  {
    "type": "heading",
    "content": "10. Fayl va eksport: qayta tahrir imkonini saqlash"
  },
  {
    "type": "definition",
    "content": "Ishchi faylda qatlam, maska va rang tuzatish komponentlari saqlanishi mumkin. JPEG yoki PNGga eksport qilinganda qatlam tuzilishi odatda saqlanmaydi. Eksportdan keyin alfa, format, o‘lcham, rang va faylning ochilishini qayta sinab ko‘ring."
  },
  {
    "type": "case",
    "content": "`afisha_master.psd`, `afisha_veb.png` va `afisha_print.tif` nusxalari bir-biridan maqsadi bilan farqlanadi; chop uchun formatni bosmaxona talabiga ko‘ra tanlang."
  },
  {
    "type": "trap",
    "content": "PNG formatiga eksport qildim, demak barcha Photoshop adjustment maskalari ham qayta ishlaydi degan taxmin xato."
  },
  {
    "type": "task",
    "content": "10-mashq. Bir xil foto uchun ishchi loyiha va ikkita eksport variantini yozing."
  },
  {
    "type": "heading",
    "content": "11. Manba huquqi, maxfiylik va tasvir etikasi"
  },
  {
    "type": "definition",
    "content": "Fotosuratda tanib olinadigan shaxs, shaxsiy hujjat yoki mualliflik bilan himoyalangan tasvir bo‘lishi mumkin. Ularni tarqatishdan oldin maqsadga muvofiq ruxsat va qonuniy asoslarni tekshiring. Ta’limdagi «oldin/keyin» ko‘rsatmasi haqiqiy tahrirni yashirmasin."
  },
  {
    "type": "example",
    "content": "O‘quvchi suratini maktab saytida ishlatishdan oldin tegishli rozilik va muassasa qoidalarini tekshiring. Kerak bo‘lsa yuzni yoki nomni yashiring."
  },
  {
    "type": "trap",
    "content": "Tasvirga filtrlash qo‘shilishi ma’lumotni soxtalashtirishga o‘tib ketmasin; xulosaga ta’sir qiluvchi tahrir qayd etilsin."
  },
  {
    "type": "task",
    "content": "11-mashq. Foto manbasi, rozilik va tahrir tarixini tekshirish jadvalini tuzing."
  },
  {
    "type": "heading",
    "content": "12. Amaliy yakun va regressiya"
  },
  {
    "type": "definition",
    "content": "Fon almashtirish topshirig‘ini izchil bajaring: originalni saqlang, sohani belgilang, maska qiling, qatlam tartibini sozlang, yumshoq chetni tekshiring, sarlavha qo‘shing va ishchi fayl hamda eksportni alohida saqlang. Har bosqichda qaytarilishini tekshirib boring."
  },
  {
    "type": "solved",
    "content": "Berilgan foto uchun dastlab rasmdagi asosiy obyektni aniq belgilang, keyin fonni maska bilan ajrating va uch xil fon ustida chetlarini sinab ko‘ring."
  },
  {
    "type": "trap",
    "content": "Bir dona chiroyli preview asl qatlamli fayl, eksport formati va muallif huquqi talablarini bajarganlikning isboti emas."
  },
  {
    "type": "task",
    "content": "12-mashq. Yakuniy loyiha uchun tanlov, maska, rang, o‘qilish va eksport bo‘yicha 5 mezonli rubrika tuzing."
  },
  {
    "type": "summary",
    "content": "Selection belgilaydi; Crop kadrni kesadi; Resize piksel yoki o‘lchamni o‘zgartiradi. Layer kontentni mustaqil saqlaydi, Mask originalni saqlagan holda ko‘rinishni boshqaradi. Adjustment rangga tegadi, eksport esa ko‘pincha qatlamlarni tekislaydi. Asl surat, ishchi loyiha va tarqatiladigan faylni ajrating."
  },
  {
    "type": "answers",
    "content": "1) original saqlanadi, maqsad aniqlanadi; 2) Marquee geometrik, Lasso erkin, Magic Wand rang bo‘yicha; 3) Contiguous tutash maydonga taalluqli; 4) Crop kadr, Resize pikselni o‘zgartiradi; 5) Layer ko‘rinish tartibi; 6) oq ko‘rsatadi, qora yashiradi; 7) gradient silliq o‘tish; 8) contrast/saturationni me’yorda sinash; 9) shrift va fon kontrasti; 10) PSD va PNG/JPEG alohida; 11) ruxsat va manba; 12) 5 mezon asoslangan baholanadi. Ochiq topshiriqlarda turli to‘g‘ri yechim bo‘lishi mumkin."
  },
  {
    "type": "source",
    "content": "Manba doirasi: Cambridge+ 8-sinf (2021) animatsiya, rastr va qatlamlar, bosma 121–123-betlar (https://drive.google.com/file/d/1hZyLM5n0OUtuJI3M3dFeAz8kyv9Sr6Ng/view); Cambridge+ 10–11-sinf, format va qatlamlarni saqlash (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view); Adobe Photoshopning rasmiy layer mask (https://helpx.adobe.com/photoshop/desktop/create-masks/layer-masks/add-layer-masks.html) va adjustment layer qo‘llanmalari (https://www.adobe.com/learn/photoshop/web/adjustment-layer). Tuzilma va amaliy misollar mualliflik qayta bayoni; PDFning har bir fizik beti/rasmi 1:1 verifikatsiya qilinmagan."
  }
]

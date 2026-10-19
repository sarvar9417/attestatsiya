/** TASK-273: primary teacher professional standard source-grounded expository additions.
 * Not a legal interpretation or a claim that every printed page has been checked.
 * Display after the authoritative published lesson while preserving question keys.
 */
import type { TheoryBlock } from '../topicContent'

export const M14_NORMATIVE_SOURCE_ADDITIONS: Record<string, TheoryBlock[]> = {
  "M14.01": [
    { type: "heading", content: "Kasb standarti A/01.6 — rejalashtirishning amaliy izchilligi" },
    { type: "table", content: "| Talab | Dars rejadagi dalil |\n|---|---|\n| DTS va fan dasturidagi maqsad | Aniq kompetensiya va mavzu natijasi |\n| O‘quvchining oldingi baholash natijasi | Qiyinchilikka mos topshiriq |\n| Yosh va individual xususiyat | Tushuntirish darajasi, yordam turi |\n| Fanlararo aloqadorlik | Matematik mantiq va algoritm misoli |\n| AKTdan maqsadli foydalanish | Ko‘rgazma, mashq va baholash vositasi |\n| O‘lchanadigan natija | Yangi masalani mustaqil yechish mezoni |" },
    { type: "example", content: "Algoritmlar mavzusini rejalashda natijani «shart operatorini farqlaydi va yangi masalada qo‘llaydi» deb belgilang. Avvalgi testda shartni noto‘g‘ri qo‘llaganlar uchun ko‘mak ko‘zda tutilsin. Dars oxirida aynan shu natijani ko‘rsatuvchi vazifa bo‘lsin." },
    { type: "trap", content: "Reja faqat vaqt jadvali yoki darslik sahifalari ro‘yxati emas. Maqsadning o‘lchanishi, metodning yoshga mosligi va baholashdan foydalanish birga tekshiriladi." },
    { type: "source", content: "Manba: «Kasb-standarti.pdf», «O‘quv jarayonini rejalashtirish» mehnat vazifasi, rejalashtirishdagi harakat/ko‘nikma/bilim bandlari (https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view). Misol original; PDFning jismoniy sahifalari yakuniy ekspert ko‘rigidan o‘tmagan." },
  ],
  "M14.02": [
    { type: "heading", content: "A/02.6 — ta’lim samaradorligi o‘quvchi faoliyati bilan o‘lchanadi" },
    { type: "table", content: "| Kasbiy harakat | Informatika darsida dalil |\n|---|---|\n| Erishimli vazifalar | Darajali, lekin bir maqsadga yo‘naltirilgan mashqlar |\n| Faol o‘qitish | O‘quvchi tahlil qiladi, sinab ko‘radi va izohlaydi |\n| Metakognitiv ko‘nikma | O‘quvchi reja tuzadi, natijani nazorat qiladi |\n| Individual yordam | Xatoga mos ko‘rsatma va qayta urinish |\n| AKT integratsiyasi | Vazifani osonlashtiruvchi, tanlangan vosita |\n| Refleksiya | Natijaga qarab keyingi darsga tuzatish kiritish |" },
    { type: "example", content: "Agar barcha o‘quvchilarga faqat tayyor kod ko‘rsatilsa, dars tashqi tomondan faol tuyulishi mumkin. Ularning kodga kichik o‘zgartirish kiritishi, natijani taxmin qilishi, tekshirishi va xulosalashi faol o‘rganishga yaqinroq." },
    { type: "trap", content: "Kompyuter ishlatilgan vaqt, slaydlar soni yoki o‘qituvchi gapirgan daqiqa mustaqil ravishda **ta’lim samaradorligining** isboti emas. Darsning natijasiga oid dalil talab qilinadi." },
    { type: "source", content: "Manba: «Kasb-standarti.pdf», «Ta’lim samaradorligini ta’minlash» (faol metodlar, jamoaviy loyiha, differensial yordam, metakognitiv strategiya va AKT) (https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view)." },
  ],
  "M14.03": [
    { type: "heading", content: "A/03.6 — diagnostika, baholash, qayta aloqa va moslashtirish" },
    { type: "table", content: "| Faoliyat | Savol | Ishonchli dalil |\n|---|---|---|\n| Diagnostika | Avval qaysi bilim yetishmaydi? | Boshlang‘ich vazifa va kuzatuv |\n| Joriy baholash | Hozir qaysi qadam muvaffaqiyatli? | Jarayondagi ish mahsuli |\n| Qayta aloqa | Qanday yaxshilash mumkin? | Aniq mezon va keyingi amal |\n| Natija tahlili | Qaysi tushunchada ko‘p xato? | Javoblarni konstruktlar bo‘yicha tahlil |\n| Rejani moslashtirish | Qaysi usul o‘zgarsin? | Maqsadli qayta o‘qitish |" },
    { type: "example", content: "Elektron jadvaldagi havolalarni noto‘g‘ri nusxalash tez-tez uchrasa, «xato» deb baho qo‘yish bilan cheklanmaslik kerak. Qaysi nisbiy manzil o‘zgarganini ko‘rsatib, o‘quvchidan yangi formulada tuzatishni so‘rang." },
    { type: "trap", content: "**Nazorat** va **o‘quvchiga qayta aloqa** bir-biriga yaqin, ammo bir xil emas: baho raqami xatoning sababini va keyingi harakatni tushuntirmaydi. Maxfiy individual qiyinchiliklarni asossiz oshkor qilmang." },
    { type: "source", content: "Manba: «Kasb-standarti.pdf», «O‘zlashtirishni baholash va qayta aloqani taqdim etish» bo‘limi (https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view). Bu bayon qonuniy ball berish qoidalarini o‘zgartirmaydi." },
  ],
  "M14.04": [
    { type: "heading", content: "A/04.6 — tarbiyaviy faoliyatni rejalash va tashkil etish" },
    { type: "table", content: "| Standartdagi talab | Pedagogik vaziyat |\n|---|---|\n| Yosh va individual xususiyat | Bir xil tarbiyaviy mazmunga turlicha yondashish |\n| Ijobiy muhit va nizoni hal etish | Guruh a’zolari bahsini muloqot bilan yechish |\n| O‘quvchi tashabbusini qo‘llash | Sinf jamoasi o‘z loyihasini taklif qiladi |\n| Madaniy xilma-xillikni hurmat qilish | Turli fikrni hurmat qiluvchi bahs mezonlari |\n| Raqamli madaniyat bilan bog‘lash | Mualliflik va netiketni real vaziyatda qo‘llash |" },
    { type: "example", content: "Sinfda kiberbulling haqida suhbat faqat taqiqlar ro‘yxati bilan tugamasin: guruhlar xavfsiz va hurmatli muloqot qoidalarini ishlab chiqib, vaziyatga mos javobni asoslasin." },
    { type: "trap", content: "Tarbiyaviy ish shunchaki «tadbir o‘tkazilgan» deb hisoblash emas; faoliyatdagi o‘quvchi ishtiroki, qadriyat va xulqdagi maqsadli o‘zgarish nazarda tutiladi." },
    { type: "source", content: "Manba: «Kasb-standarti.pdf», «Tarbiyaviy faoliyatni tashkil etish» mehnat vazifasi (https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view); raqamli madaniyat vaziyati original misol." },
  ],
  "M14.05": [
    { type: "heading", content: "A/05.6 — xavfsiz rivojlantiruvchi muhitning tarkibi" },
    { type: "table", content: "| Muhit jihati | Amalga oshirish |\n|---|---|\n| Jismoniy xavfsizlik | Ish joyi va jihozdan xavfsiz foydalanish |\n| Psixologik xavfsizlik | Kamsitmaslik va hurmatli qayta aloqa |\n| Madaniy va til xilma-xilligi | Teng ishtirok va mos muloqot |\n| Alohida ta’lim ehtiyojlari | Kerakli ko‘rsatma va individual yordam |\n| Raqamli/media xavfsizlik | Shaxsiy akkaunt, maxfiylik va tahdidlarni tushuntirish |\n| Favqulodda vaziyat | Qoida va harakat ketma-ketligini oldindan tushuntirish |" },
    { type: "example", content: "Kompyuter xonasida ishlashdan oldin elektr xavfsizligi va akkauntdan chiqish qoidalari o‘rgatiladi. O‘quvchi xato qilganida hammaga ko‘rsatib sharmanda qilish o‘rniga sababi tushuntiriladi va to‘g‘ri amal mashq qildiriladi." },
    { type: "trap", content: "5-vazifa — **xavfsiz muhit**. 6-vazifa esa boshqa yo‘nalishdagi **kasbiy rivojlanish**; ularning tartibini almashmang. Inklyuziya faqat jismoniy joylashtirish emas, mazmunli ishtirokni ham talab qiladi." },
    { type: "source", content: "Manba: «Kasb-standarti.pdf», «Xavfsiz rivojlantiruvchi ta’lim muhitini yaratish va ta’minlash» bo‘limi (https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view). Shu hujjatdagi 5/6 vazifa chegarasi tekshirildi." },
  ],
  "M14.06": [
    { type: "heading", content: "B/01.6 — refleksiya va kasbiy o‘sish sikli" },
    { type: "list", content: "1. Darsdagi kuchli va rivojlantiriladigan jihatlarni dalil bilan aniqlash.\n2. Aniq kasbiy maqsadni belgilash (masalan, differensial baholash usuli).\n3. Kurs, o‘zaro dars kuzatuvi, adabiyot va hamkasb tajribasidan foydalanish.\n4. O‘z darsida yangi yondashuvni sinab ko‘rish.\n5. O‘quv natijasini tahlil qilib keyingi rivojlanish vazifasini aniqlash." },
    { type: "example", content: "Informatika o‘qituvchisi o‘quvchilarni koddagi xatoni izohlashga undashda qiynalayotganini aniqlasa, hamkasb darsini kuzatadi, diagnostik savollar tuzadi va keyin o‘z darsidagi natijani solishtiradi." },
    { type: "trap", content: "Kasbiy rivojlanish faqat sertifikat yoki qatnashgan kurslar soni bilan o‘lchanmaydi. Bilimni o‘z faoliyatiga tatbiq etish, o‘z-o‘zini baholash va ish amaliyotini yaxshilash muhim." },
    { type: "source", content: "Manba: «Kasb-standarti.pdf», «O‘z-o‘zini rivojlantirish va kasbiy o‘sish» bo‘limi (https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view); B/01.6 ikkinchi yo‘nalishdagi birinchi vazifa." },
  ],
  "M14.07": [
    { type: "heading", content: "B/02.6 — hamkasb va ota-ona bilan maqsadli hamkorlik" },
    { type: "table", content: "| Ishtirokchi | Hamkorlik natijasi |\n|---|---|\n| Ota-ona yoki vakil | O‘quvchining ehtiyoj va rivojlanishini yaxshiroq tushunish |\n| Fan o‘qituvchisi | Qiyinchiliklarni boshqa darslar bilan solishtirish |\n| Tegishli mutaxassis | O‘quvchiga mos yordamni rejalash |\n| Maktab jamoasi | Sinf hayotiga ijobiy ishtirokni ta’minlash |\n| O‘quvchi | Qarorning mazmunini tushunib, faol ishtirok etish |" },
    { type: "example", content: "O‘quvchi algoritmlashda qiynalsa, muammoni chat guruhiga tarqatish o‘rniga shaxsiy va maqsadli suhbat hamda zarur o‘qituvchilar ishtirokida yordam rejasi ishlab chiqiladi. Yordam natijasi keyin kuzatiladi." },
    { type: "trap", content: "Hamkorlik shunchaki xabar yetkazish emas; qaror ishlab chiqish va bolaning rivojlanishiga ko‘makni tashkil etishdir. Shaxsiy ma’lumotni keraksiz taraflarga tarqatishdan saqlaning." },
    { type: "source", content: "Manba: «Kasb-standarti.pdf», «Hamkasblar va ta’lim oluvchilarning ota-onalari bilan hamkorlik» bo‘limi (https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view)." },
  ],
}

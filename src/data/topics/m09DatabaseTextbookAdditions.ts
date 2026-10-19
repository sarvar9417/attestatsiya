/** TASK-273: Source-grounded original database and AI study additions.
 * Cambridge+ grade 9/10-11, not a page-by-page licensed textbook copy.
 */
import type { TheoryBlock } from '../topicContent'

export const M09_DATABASE_TEXTBOOK_ADDITIONS: Record<string, TheoryBlock[]> = {
  "M09.01": [
    { type: "heading", content: "Ma’lumotlar bazasini oddiy jadvaldan farqlash" },
    { type: "table", content: "| Atama | Vazifasi | Taqqoslash |\n|---|---|---|\n| Ma’lumotlar bazasi | Tuzilgan va boshqariladigan ma’lumotlar to‘plami | Ma’lumotning o‘zi |\n| MBBT | Bazani saqlash, tahrirlash, so‘rash va boshqarish tizimi | Boshqarish dasturi |\n| Jadval | Bir turdagi obyekt yozuvlari | Satrlar va maydonlar |\n| Yozuv | Bitta obyektga oid ma’lumot | Jadvaldagi satr |\n| Maydon | Bir xususiyatning saqlanishi | Jadvaldagi ustun |" },
    { type: "example", content: "Maktabdagi o‘quvchilar va ular tanlagan kurslar haqidagi ma’lumotni bitta ustunlarga to‘la jadvalda takrorlash o‘rniga «O‘quvchi», «Kurs» va «Yozilish» jadvallarini alohida yuritish kerak bo‘lishi mumkin." },
    { type: "trap", content: "Ma’lumotlar bazasi — faqat Microsoft Access emas: Access, PostgreSQL va SQLite kabi MBBTlar turlicha xususiyatga ega. Bazada rasmiy ma’lumot mavjudligi har bir foydalanuvchi uni cheksiz o‘zgartira olishini anglatmaydi." },
    { type: "source", content: "Manbalar: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), relyatsion ma’lumotlar bazasi, birlamchi va tashqi kalitlar, Access va so‘rovlar bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view). Cambridge+ 10–11-sinf «Informatika va axborot texnologiyalari» (2021), ma’lumotlar bazasi, relatsiyalar va so‘rovlar (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Manba matniga asoslangan original izoh; to‘liq mavzu-bet qamrovi hali tekshirilmagan." },
  ],
  "M09.02": [
    { type: "heading", content: "Maydon turlari va ma’lumot yaxlitligi" },
    { type: "table", content: "| Maydon | Mos ma’lumot turi | Muhim nazorat |\n|---|---|---|\n| O‘quvchiID | Butun son yoki identifikator | Noyob, bo‘sh emas |\n| Ism | Qisqa matn | Keraksiz uzunlikni cheklash |\n| Tug‘ilgan sana | Sana/vaqt | To‘g‘ri sana qiymati |\n| To‘lov summasi | Decimal/valyuta | Hisoblash aniqligi |\n| Faolmi | Mantiqiy | Ha/yo‘q turi |" },
    { type: "example", content: "Telefon raqami bilan hisoblash qilinmaydi; uni son turi sifatida saqlash boshlang‘ich nol yoki «+» belgisini yo‘qotishi mumkin. Shuning uchun telefonni matn sifatida loyihalash maqsadga muvofiq." },
    { type: "trap", content: "Maydonning «son ko‘rinishida yozilishi» u albatta sonli tur bo‘lishini anglatmaydi. Identifikator, pochta indeksi va telefon uchun hisoblash shart emas. Access tur nomlari boshqa MBBTdagi atamalardan farq qiladi." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), relyatsion ma’lumotlar bazasi, birlamchi va tashqi kalitlar, Access va so‘rovlar bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view). Jadval va ma’lumot turlarini ajratish bo‘yicha o‘quv bayoni, amaliy misollar original." },
  ],
  "M09.03": [
    { type: "heading", content: "Kalitlar va munosabatlar: ma’lumot takrorini kamaytirish" },
    { type: "table", content: "| Atama | Vazifa | Misol |\n|---|---|---|\n| Birlamchi kalit | Yozuvni noyob aniqlaydi | O‘quvchiID |\n| Tashqi kalit | Boshqa jadval yozuviga murojaat | KursgaYozilish.O‘quvchiID |\n| 1:ko‘p munosabat | Bitta yozuvga bir necha bog‘liq yozuv | Bitta kurs, ko‘p yozilish |\n| Ko‘p:ko‘p munosabat | Bog‘lovchi jadval orqali ifodalanadi | O‘quvchi va kurslar |" },
    { type: "example", content: "Ikki o‘quvchining ism-familiyasi bir xil bo‘lishi mumkin. Ularni bog‘lashda ismni emas, har biriga berilgan noyob identifikatorni ishlatish to‘g‘riroq. Bog‘lovchi jadvaldagi tashqi kalitlar mavjud yozuvlarga mos kelishi kerak." },
    { type: "trap", content: "**Birlamchi** kalit ustunida takroriy yoki NULL qiymat bo‘lmasligi kerak. **Tashqi** kalit jadvalning birlamchi kaliti bo‘lishi shart emas, lekin ko‘rsatilgan ustun bilan munosabat yaxlitligi talab qilinadi." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), relyatsion ma’lumotlar bazasi, birlamchi va tashqi kalitlar, Access va so‘rovlar bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view). 9-sinf kitobidagi bir xil ismli mijozlarni noyob ID orqali ajratish misoli mavzuga dalil. Jadval yangi o‘quv izohi." },
  ],
  "M09.04": [
    { type: "heading", content: "Tanlash so‘rovi va mezonlar" },
    { type: "table", content: "| Mezon ma’nosi | Umumiy SQL ifoda | Izoh |\n|---|---|---|\n| 80 dan yuqori | Ball > 80 | 80 kirmaydi |\n| 80 va undan yuqori | Ball >= 80 | 80 ham kiradi |\n| Ma’lum diapazon | Ball BETWEEN 60 AND 80 | Ikki chegara odatda kiradi |\n| Matn boshlanishi | Ism LIKE 'A%' | Sintaksis MBBTga qarab farq qiladi |\n| Bo‘sh qiymat | Ism IS NULL | `= NULL` bilan teng emas |" },
    { type: "example", content: "«Balli 80 va undan yuqori o‘quvchilar» uchun >80 deb yozish 80 olganlarni chetga chiqaradi. So‘rovdan oldin «qat’iy katta» va «katta yoki teng» chegaralarini aniqlashtiring." },
    { type: "trap", content: "Access Query Design oynasidagi joker belgi sozlamalari ANSI-89 yoki ANSI-92 rejimiga bog‘liq: `*` va `%` ishlatilishi farq qilishi mumkin. Dasturga mos mezonni tekshiring; barcha SQL dialektlariga bitta shaklni universal deb bermang." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), relyatsion ma’lumotlar bazasi, birlamchi va tashqi kalitlar, Access va so‘rovlar bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view). Cambridge+ 10–11-sinf «Informatika va axborot texnologiyalari» (2021), ma’lumotlar bazasi, relatsiyalar va so‘rovlar (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). So‘rov operatorlari semantikasi umumiy SQL bo‘yicha original izoh; Access versiyalarida mezon belgilari farqlanadi." },
  ],
  "M09.05": [
    { type: "heading", content: "Murakkab mezonlarda AND, OR, NOT ning mantiqiy farqi" },
    { type: "table", content: "| So‘rov | Natijaviy tanlov |\n|---|---|\n| Fan='Informatika' AND Ball>=80 | Ikkala shart ham rost |\n| Fan='Informatika' OR Ball>=80 | Hech bo‘lmasa bittasi rost |\n| NOT (Ball < 60) | 60 yoki yuqori; NULL alohida |\n| ORDER BY Ball DESC | Natijani kamayish bo‘yicha saralaydi |" },
    { type: "example", content: "«Informatikadan yuqori natija va davomat yetarli» shartida AND qo‘llanadi. OR yozilsa, fan bo‘yicha yuqori ball yig‘magan yoki davomat talabini bajarmagan yozuvlar ham qo‘shilib ketishi mumkin." },
    { type: "trap", content: "AND va OR aralash bo‘lsa, qavs operatorlar ustuvorligini aniq qiladi. NULL bilan solishtirish uch qiymatli mantiqqa olib keladi; `NOT (Ball < 60)` ifodasi balli NULL bo‘lgan yozuvlarni odatda tanlamaydi." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), relyatsion ma’lumotlar bazasi, birlamchi va tashqi kalitlar, Access va so‘rovlar bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view). Tanlash/shart ifodalariga doir original nazariya; misollar textbook 1:1 to‘liq ko‘chirmasi emas." },
  ],
  "M09.06": [
    { type: "heading", content: "SQL amallarining xavf va vazifasini farqlash" },
    { type: "table", content: "| Operator | Asosiy vazifa | Muhim cheklov |\n|---|---|---|\n| SELECT | Yozuvlarni o‘qish | Mavjud holatni o‘zgartirmaydi |\n| INSERT | Yangi yozuv kiritish | Tur va cheklovlarga mos bo‘lishi kerak |\n| UPDATE | Mavjud yozuvni yangilash | WHERE shartisiz keng ta’sir qiladi |\n| DELETE | Yozuvni o‘chirish | WHERE shartisiz ko‘plab yozuvlar o‘chishi mumkin |" },
    { type: "code", content: "SELECT id, ism, ball\nFROM oquvchilar\nWHERE ball >= 80\nORDER BY ball DESC;" },
    { type: "example", content: "`UPDATE oquvchilar SET ball = 100` ifodasi cheklov bo‘lmasa barcha mos yozuvlarga ta’sir qilishi mumkin. Ma’lumotlarni yangilash yoki o‘chirishdan oldin WHERE shartini ayni SELECT bilan tekshirish va tranzaksiya/backup siyosatini hisobga olish zarur." },
    { type: "trap", content: "`DELETE` yozuvni o‘chiradi, `DROP TABLE` esa jadval obyektini o‘chiradi. So‘rov qatorlarini `ORDER BY` bo‘lmasa qat’iy kelish tartibida bo‘ladi, deb faraz qilmang. Misollar faqat o‘quviy, production bazada ishlatilmasin." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), relyatsion ma’lumotlar bazasi, birlamchi va tashqi kalitlar, Access va so‘rovlar bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view). M09 mavzusining SQL amaliyati bilan bog‘liq konstruktlari; SQL operatorlari qo‘shimcha qayta bayon, DBga yozish rejasini anglatmaydi." },
  ],
  "M09.07": [
    { type: "heading", content: "SI, qoidaviy ekspert tizim va ma’lumotdan o‘rganuvchi modellar" },
    { type: "table", content: "| Tizim | Qaysi dalilga tayanadi? | Xavf |\n|---|---|---|\n| Qoidaviy ekspert tizimi | Oldindan ifodalangan bilim/qoidalar | Qoidalar to‘liq bo‘lmasligi mumkin |\n| Mashinaviy o‘rganish modeli | O‘qituvchi namunalar va ma’lumotlar | Xatoli yoki noteng ma’lumot |\n| Oddiy avtomatlashtirish | Oldindan tuzilgan jarayon | Yangi vaziyatga moslashmaslik |" },
    { type: "example", content: "Avtomobilning ko‘p sensorlardan olgan ma’lumotiga asoslanib qaror chiqarishi murakkab masala. Natijaning ishonchliligi, ma’lumot cheklovi, inson nazorati va javobgarlik nuqtayi nazaridan baholanadi." },
    { type: "trap", content: "Har bir ekspert tizim neyron tarmoq emas; har bir avtomatlashtirilgan dastur mustaqil o‘rganuvchi SI ham emas. Darslikdagi tarixiy texnologiya misollarini bugungi har bir tizimning universal xususiyati deb talqin qilmang." },
    { type: "source", content: "Manba: Cambridge+ 10–11-sinf «Informatika va axborot texnologiyalari» (2021), sun’iy intellekt va ekspert tizimlari, haydovchisiz transport va javobgarlik muhokamasi (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). SI sinflanishi original tushuntirish, to‘liq sahifa concordance hali yo‘q." },
  ],
}

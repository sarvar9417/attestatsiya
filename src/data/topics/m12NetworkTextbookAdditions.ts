/** TASK-273: source-grounded M12 networking concepts, 5–11 ICT textbooks.
 * Broad historical teaching synthesis; full printed-page verification remains open.
 */
import type { TheoryBlock } from '../topicContent'
export const M12_NETWORK_TEXTBOOK_ADDITIONS: Record<string, TheoryBlock[]> = {
  "M12.01": [
    { type: "heading", content: "Tarmoqlarni qamrov va boshqaruv bo‘yicha farqlash" },
    { type: "table", content: "| Tarmoq | Odatdagi qamrov | Asosiy farq |\n|---|---|---|\n| PAN | Shaxs atrofidagi qurilmalar | Juda yaqin masofa |\n| LAN | Bino yoki kampus kabi lokal hudud | Lokal resurs almashish |\n| WLAN | Simsiz lokal tarmoq | LANning simsiz turi |\n| MAN | Shahar miqyosidagi hudud | Bir necha LANni bog‘lashi mumkin |\n| WAN | Keng geografik hudud | Masofadagi tarmoqlarni bog‘laydi |" },
    { type: "example", content: "Bir maktabdagi laboratoriya kompyuterlari Ethernet orqali bog‘lansa LAN, o‘sha maktabning Wi-Fi qurilmalari esa WLAN tashkil etadi. Internet birgina «katta LAN» emas: ko‘plab tarmoqlar o‘zaro protokollar bilan bog‘lanadi." },
    { type: "trap", content: "LAN/WAN odatda qamrov va boshqaruv doirasiga, simli/simsiz esa aloqa vositasiga ishora qiladi. WLANni WAN bilan yoki Wi-Fi’ni internetning o‘zi bilan tenglashtirmang." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), kompyuter tarmoqlari va internet bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view). Cambridge+ 10–11-sinf «Informatika va axborot texnologiyalari» (2021), aloqa, IP manzillar, internet va raqamli xizmatlar bo‘limlari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Aloqa turlari jadvali original umumlashtirish, fizik PDF sahifalarini qo‘lda tasdiqlash navbatda." },
  ],
  "M12.02": [
    { type: "heading", content: "Kommutator, marshrutizator, modem va kirish nuqtasi" },
    { type: "table", content: "| Qurilma | Yetakchi vazifa |\n|---|---|\n| Tarmoq adapteri (NIC) | Qurilmani tarmoqqa ulash |\n| Switch | Lokal kadrlarni kerakli portga uzatish |\n| Router | Turli tarmoqlar orasida IP paket yo‘naltirish |\n| Modem | Aloqa muhiti uchun signalni moslashtirish |\n| Access point | Wi-Fi mijozlarini lokal tarmoqqa ulash |\n| Repeater | Signalni qamrov bo‘yicha takrorlash |" },
    { type: "example", content: "Bitta sinfdagi ikki kompyuter switch orqali bir-biri bilan almasha oladi, lekin boshqa tarmoqqa chiqishi uchun routing sozlamasi yoki router talab qilinishi mumkin." },
    { type: "trap", content: "Router, modem va access point ba’zan bitta uy qurilmasida birlashadi, ammo **vazifalari** baribir har xil. Wi-Fi ulanishi mavjudligi tashqi internet provayderiga chiqish ishlayapti degani emas." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), kompyuter tarmoqlari va internet bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view). Cambridge+ 10–11-sinf «Informatika va axborot texnologiyalari» (2021), aloqa, IP manzillar, internet va raqamli xizmatlar bo‘limlari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Texnik qurilma tasniflari bo‘yicha original o‘quv tushuntirish." },
  ],
  "M12.03": [
    { type: "heading", content: "Tarmoq topologiyasi va nosozlik nuqtalari" },
    { type: "table", content: "| Topologiya | G‘oya | Xavf yoki afzallik |\n|---|---|---|\n| Yulduz | Qurilmalar markaziy tugunga ulanadi | Markaziy nosozlik ta’sir qiladi |\n| Shina | Umumiy aloqa muhiti | Eski tizimlarda kolliziya xavfi |\n| Halqa | Tugunlar aylana bo‘ylab bog‘lanadi | Uzilish tizim turiga ko‘ra ta’sir qiladi |\n| Mesh | Ko‘p bog‘lanishli yo‘llar | Zaxira yo‘llar, yuqori xarajat |\n| Daraxt | Iyerarxik bog‘lanish | Kengaytirish qulay, yuqori tugunlar muhim |" },
    { type: "example", content: "Maktab tarmog‘i har xonadagi kompyuterlarni switchga bog‘lasa, o‘sha xonada fizik yulduz topologiyasi kuzatiladi. Yuqori darajadagi switchlar orasidagi aloqa boshqa topologiyaga ega bo‘lishi mumkin." },
    { type: "trap", content: "**Fizik** va **mantiqiy** topologiya har doim bir xil ko‘rinmaydi; masalan, fizik yulduz ichida turli mantiqiy oqimlar mavjud bo‘lishi mumkin. Har topologiya «mutlaqo eng yaxshi» emas." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), kompyuter tarmoqlari va internet bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view). Tarmoq topologiyalari haqidagi umumiy tasnif qayta tushuntirildi." },
  ],
  "M12.04": [
    { type: "heading", content: "Paketning tarmoqdan o‘tishi: asosiy xizmatlar" },
    { type: "table", content: "| Qatlam/vazifa | Misol | Nima qiladi? |\n|---|---|---|\n| Ilova | HTTP/HTTPS | Veb resurs almashadi |\n| Transport | TCP/UDP | Ilovalar orasidagi yetkazishni tashkil etadi |\n| Tarmoq | IP | Paketni manzilga yo‘naltiradi |\n| Kanal | Ethernet/Wi-Fi | Lokal segmentda uzatadi |\n| Nomi aniqlash | DNS | Domenni IP kabi yozuvga bog‘laydi |" },
    { type: "example", content: "Brauzerga sayt nomi yozilganda DNS yozuvi tekshirilishi, so‘ng IP manzilga aloqa qurilishi va HTTPS protokoli bilan kontent olinishi mumkin. Bu jarayon server va kesh sozlamalariga qarab farqlanadi." },
    { type: "trap", content: "**DNS** fayl uzatish protokoli emas. **IP**ning vazifasi paket manzillash va yo‘naltirish; har paket ishonchli yetkazildi degani emas. **TCP** va **UDP** har doim bir xil kafolat bermaydi." },
    { type: "source", content: "Manba: Cambridge+ 10–11-sinf «Informatika va axborot texnologiyalari» (2021), aloqa, IP manzillar, internet va raqamli xizmatlar bo‘limlari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Protokollarni qisqa jadvalga qayta bayon qilish ko‘p manbali sintez, to‘liq standart matni emas." },
  ],
  "M12.05": [
    { type: "heading", content: "IPv4 prefiksi, maska, tarmoq va xost hisoblari" },
    { type: "table", content: "| Prefiks | Niqob | Odatdagi xost bitlari | An’anaviy foydalanish mumkin xostlar |\n|---|---|---:|---:|\n| /24 | 255.255.255.0 | 8 | 254 |\n| /25 | 255.255.255.128 | 7 | 126 |\n| /26 | 255.255.255.192 | 6 | 62 |\n| /27 | 255.255.255.224 | 5 | 30 |" },
    { type: "formula", content: "Standart oddiy IPv4 subnet uchun xostlar soni = 2^(32 - prefiks) - 2. /31 va /32 kabi maxsus hollarda oddiy formula umumiy qoida sifatida qo‘llanmaydi." },
    { type: "example", content: "**192.168.1.64/26**: maska 255.255.255.192, tarmoq manzili 192.168.1.64, broadcast 192.168.1.127, odatiy xost oraliq 192.168.1.65–192.168.1.126; 62 ta xost manzili. Blok qadam uzunligi 64 ga teng." },
    { type: "trap", content: "Subnet maskadagi 1 bitlar tarmoq prefiksini bildiradi; `/26` 26 ta qurilma degani emas. Oddiy broadcastli subnet qoidasini `/31` nuqtadan nuqtaga liniyalar uchun universal deyish mumkin emas." },
    { type: "source", content: "Manba: Cambridge+ 10–11-sinf «Informatika va axborot texnologiyalari» (2021), aloqa, IP manzillar, internet va raqamli xizmatlar bo‘limlari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). 10–11-sinfdagi IP va tarmoq terminlari bilan bog‘langan original hisob misoli. CIDR formulasi textbook transkripsiyasi emas; ekspert bet-ko‘rigi hali ochiq." },
  ],
  "M12.06": [
    { type: "heading", content: "Internet, brauzer, server va izlash jarayoni" },
    { type: "table", content: "| Tushuncha | Vazifa |\n|---|---|\n| Internet | O‘zaro bog‘langan tarmoqlar |\n| WWW | HTTP(S) kabi xizmatlar orqali veb resurslar |\n| Brauzer | Resursni so‘raydi va ko‘rsatadi |\n| Qidiruv tizimi | Indekslangan manbalar orasida natija izlaydi |\n| URL | Resursga murojaat manzili |\n| HTTPS | HTTPni transport xavfsizlik protokoli bilan himoyalaydi |" },
    { type: "example", content: "Brauzerning manzil satriga URL yozish bilan qidiruv tizimiga kalit so‘z yozish turli yo‘l. Qidiruv natijasi manbani tekshirishsiz avtomatik ishonchli fakt bo‘la olmaydi." },
    { type: "trap", content: "HTTPS aloqa kanalidagi ma’lumotni himoyalashga yordam beradi, biroq saytning barcha bayonotlari rost ekanini yoki zararli sayt bo‘lmasligini kafolatlamaydi. Internet va WWW sinonim emas." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), kompyuter tarmoqlari va internet bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view). Cambridge+ 10–11-sinf «Informatika va axborot texnologiyalari» (2021), aloqa, IP manzillar, internet va raqamli xizmatlar bo‘limlari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Brauzer va izlash jarayonining original o‘quv umumlashtirishi." },
  ],
  "M12.07": [
    { type: "heading", content: "Elektron xat uzatish va qabul qilish protokollari" },
    { type: "table", content: "| Protokol | Asosiy rol |\n|---|---|\n| SMTP | Xat yuborish va serverlar orasida uzatish |\n| IMAP | Serverdagi xatlarni sinxron o‘qish |\n| POP3 | Pochta xabarlarini mijozga olish |\n| HTTPS webmail | Brauzer orqali pochta ilovasiga ulanish |" },
    { type: "example", content: "Bir xil xabar telefon va noutbukda sinxron bo‘lishi uchun IMAP asosidagi pochta mijozidan foydalanish qulay. SMTP xatni yuborishga xizmat qiladi, ammo pochta qutisidagi xabarlarni listlab o‘qish vazifasi bilan teng emas." },
    { type: "trap", content: "`Cc` qabul qiluvchilarga odatda ko‘rinadi, `Bcc` esa yashirin nusxa oluvchilarni boshqa qabul qiluvchilarga ko‘rsatmaslik uchun. Noma’lum ilova fayllari va havolalarni ochishdan avval tekshiring." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), kompyuter tarmoqlari va internet bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view). Cambridge+ 10–11-sinf «Informatika va axborot texnologiyalari» (2021), aloqa, IP manzillar, internet va raqamli xizmatlar bo‘limlari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Elektron aloqa vazifalari qayta tushuntirildi; konfiguratsiya raqamlari provayderga qarab farq qiladi." },
  ],
  "M12.08": [
    { type: "heading", content: "Bulutli texnologiyaning xizmat modellari" },
    { type: "table", content: "| Xizmat | Nima boshqariladi? | Oddiy misol |\n|---|---|---|\n| SaaS | Tayyor dastur | Brauzerdagi matn muharriri |\n| PaaS | Ilova yaratish platformasi | Hosting va runtime |\n| IaaS | Virtual server/tarmoq resursi | Bulut virtual mashinasi |\n| Sync | Qurilmalar orasida bir xil holat | Sinxron papka |\n| Backup | Ma’lumotni tiklash uchun nusxa | Versiyalangan zaxira |" },
    { type: "example", content: "Bulutli papkadan o‘chirilgan fayl boshqa sinxron qurilmadan ham o‘chishi mumkin. Shuning uchun sinxronlashni mustaqil tarixli zaxira nusxa bilan tenglashtirmang." },
    { type: "trap", content: "«Bulut» ma’lumotni hech qayerda saqlamaydigan narsa emas: u real server va tarmoq infratuzilmasiga tayanadi. Internet uzilsa offline ishlash imkoniyati xizmatga bog‘liq." },
    { type: "source", content: "Manba: Cambridge+ 10–11-sinf «Informatika va axborot texnologiyalari» (2021), aloqa, IP manzillar, internet va raqamli xizmatlar bo‘limlari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Bulutli xizmatlar tasnifi pedagogik jihatdan qayta bayon qilindi." },
  ],
  "M12.09": [
    { type: "heading", content: "IoT, VR va AR: o‘xshash bo‘lmagan texnologiyalar" },
    { type: "table", content: "| Texnologiya | Asosiy xususiyat | Ta’limdagi misol |\n|---|---|---|\n| IoT | Sensor/aktuator va tarmoq aloqasi | Haroratni masofadan kuzatish |\n| VR | Immersiv virtual muhit | Laboratoriya simulyatsiyasi |\n| AR | Real muhitga raqamli qatlam qo‘shish | Kamera orqali 3D model ko‘rsatish |\n| Mobil aloqa | Simsiz aloqa infratuzilmasi | Telefon orqali ma’lumot uzatish |" },
    { type: "example", content: "Xonadagi sensor haroratni o‘lchab tarmoqqa yuboradi — IoT. O‘quvchi maxsus qurilma orqali virtual laboratoriyani ko‘radi — VR. Telefon real stol ustiga 3D modelni joylab ko‘rsatsa — AR." },
    { type: "trap", content: "IoT qurilmalarida har doim internet bo‘lishi shart emas — ayrimlari lokal tarmoqqa ulangan bo‘ladi. VR va ARni bir-birining sinonimi deb ishlatmang; qurilmaning mavjudligi xavfsizlik va shaxsiylik tekshiruvini bekor qilmaydi." },
    { type: "source", content: "Manba: Cambridge+ 10–11-sinf «Informatika va axborot texnologiyalari» (2021), aloqa, IP manzillar, internet va raqamli xizmatlar bo‘limlari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Mobil, sensorli va virtual texnologiyalar bo‘yicha original qo‘shimcha; barcha texnologik versiyalar aktual ekspert tekshiruvini talab etadi." },
  ],
}

/** TASK-308: full source-guided network scopes and services learner chapter. */
import type { TheoryBlock } from '../topicContent'
export const M12_01_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "Tarmoq tushunchasini, PAN/LAN/WLAN/MAN/WAN, Intranet/Internet, VPN va tarmoq sifatini tahlil qilish; texnologiya, geografiya va huquq chegaralarini farqlash."
  },
  {
    "type": "intro",
    "content": "Maktabdagi printer, telefon-soat, Wi-Fi, uzoq filial va elektron jurnal bir xil «tarmoq» so‘ziga bog‘langan bo‘lsa-da, qamrov, rol va himoya jihatidan farq qiladi. Ushbu bob tasnifni qat’iy masofa stereotiplari emas, real vazifalar bilan tushuntiradi."
  },
  {
    "type": "heading",
    "content": "1. Tarmoq: qurilmalar, aloqa va resurs"
  },
  {
    "type": "definition",
    "content": "Kompyuter tarmog‘i — kamida ikki qurilmaning kelishilgan aloqa vositasi va protokollar yordamida ma’lumot almashishi. Qurilmalar kompyuter, smartfon, printer yoki server bo‘lishi mumkin. Resurslar fayl, xizmat va umumiy printerdan iborat. Tarmoq mavjudligi Internet mavjudligini avtomatik anglatmaydi."
  },
  {
    "type": "solved",
    "content": "Maktabning uch kompyuteri lokal switch orqali printerga chop etish so‘rovini yubora oladi, hatto provayder liniyasi vaqtincha uzilgan bo‘lsa ham."
  },
  {
    "type": "trap",
    "content": "Ikkita qurilmaning yonma-yon turishi tarmoq emas: ular orasida aloqa yo‘li va kelishilgan uzatish qoidalari kerak."
  },
  {
    "type": "task",
    "content": "1-mashq. Tarmoq hosil qilish uchun uchta zarur elementni yozing."
  },
  {
    "type": "table",
    "content": "| Belgi | Qurilma misoli | Izoh |\n|---|---|---|\n| Tugun | Noutbuk/printer | Ma’lumot manbai yoki qabul qiluvchi |\n| Aloqa yo‘li | Ethernet/Wi-Fi | Bitlarni uzatish |\n| Protokol | TCP/IP | Kelishilgan format/qoidalar |\n| Resurs | Fayl, printer, API | Almashiladigan xizmat |"
  },
  {
    "type": "heading",
    "content": "2. PAN — shaxs atrofidagi aloqa"
  },
  {
    "type": "definition",
    "content": "Personal Area Network (PAN) shaxsga yaqin qurilmalar o‘rtasidagi tarmoqni anglatadi. Bluetooth orqali soat va telefon, quloqchin va telefon bog‘lanishi shunday misol. Qamrov qat’iy 1–10 metr qoidasi emas: standart va quvvatga qarab farqlanadi."
  },
  {
    "type": "example",
    "content": "Telefon bilan aqlli soat Bluetooth orqali sinxronlansa PAN; telefondagi internet mobil operator orqali ishlashi mumkin, PANning o‘zi internet emas."
  },
  {
    "type": "trap",
    "content": "USB kabel bilan oddiy zaryadlash doim ma’lumot tarmog‘ini hosil qilmaydi; bog‘lanish vazifasini tekshiring."
  },
  {
    "type": "task",
    "content": "2-mashq. PANga ikki misol yozing va uning internetga bog‘liqligini izohlang."
  },
  {
    "type": "heading",
    "content": "3. LAN — lokal tarmoq va boshqaruv"
  },
  {
    "type": "definition",
    "content": "Local Area Network (LAN) bitta bino, laboratoriya yoki kampusning boshqariladigan lokal aloqa muhitini anglatadi. LANni faqat aniq metr soni bilan belgilash xato; tashkiliy nazorat, hudud va texnik yechim ham muhim. Simli Ethernet va simsiz variantlar uchrashi mumkin."
  },
  {
    "type": "case",
    "content": "Maktabdagi ikki qavat kompyuterlari yagona boshqariladigan switchlar orqali bog‘langan; ular tashqi Internetsiz fayl almashadi."
  },
  {
    "type": "trap",
    "content": "LAN odatda yaqin hududda bo‘lsa ham har doim xavfsiz yoki Internetdan tez degani emas: siyosat, ortiqcha yuk va uskuna ta’sir qiladi."
  },
  {
    "type": "task",
    "content": "3-mashq. Maktab LAN uchun uch resurs va ikki xavfsizlik ehtiyojini yozing."
  },
  {
    "type": "table",
    "content": "| Tarmoq turi | Ko‘p uchraydigan qamrov | Tarmoqni belgilovchi jihat |\n|---|---|---|\n| PAN | Shaxs atrofida | Shaxsiy qurilmalar |\n| LAN | Bino/kampus | Lokal boshqaruv |\n| WLAN | Simli LAN hududida yoki shunga yaqin | Wi-Fi radio |\n| MAN | Shahar | Bir necha lokal nuqta |\n| WAN | Shaharlar/mamlakatlar | Uzoq tarmoqlarni bog‘lash |"
  },
  {
    "type": "heading",
    "content": "4. WLAN — simsiz lokal tarmoq"
  },
  {
    "type": "definition",
    "content": "Wireless LAN (WLAN) LANning radioaloqadan foydalanuvchi turi. Wi-Fi tarmoqqa ulanish texnologiyasi; qurilmaning Wi-Fi belgisiga ulanganligi butun Internetga yo‘l borligini isbotlamaydi. SSID tarmoq nomi, kirish nuqtasi esa mijozlarni ulashga yordam beradi."
  },
  {
    "type": "solved",
    "content": "Sinfxonadagi planshetlar Wi-Fi access pointga ulangan, ammo router/provayder ishlamayapti. Lokal resurs mavjud bo‘lishi mumkin, tashqi saytlar ochilmasligi mumkin."
  },
  {
    "type": "trap",
    "content": "Wi-Fi va Internetni sinonim deb qabul qilmang; lokal radio ulanish va global ulanish turli bosqich."
  },
  {
    "type": "task",
    "content": "4-mashq. Wi-Fi ulangan, sayt ishlamagan vaziyatga ikkita ehtimoliy sabab yozing."
  },
  {
    "type": "heading",
    "content": "5. MAN — shahar miqyosidagi tarmoq"
  },
  {
    "type": "definition",
    "content": "Metropolitan Area Network (MAN) bir shahar yoki yirik urban hududdagi bir necha lokal nuqtani bog‘lashi mumkin. Bu o‘quv tasnifi bo‘lib, shahar tarmog‘ining har biri MAN deb atalavermaydi. MAN va WANning qat’iy masofa chegarasi har doim bir xil emas."
  },
  {
    "type": "example",
    "content": "Bir shaharning uch kutubxonasi yagona xizmat provayderi orqali ulanib, muassasa ichki resursini bo‘lishadi. Qamrov LANdan kattaroq bo‘lgani uchun MAN misoli bo‘lishi mumkin."
  },
  {
    "type": "trap",
    "content": "Shahar Wi-Fi reklamasini ko‘rib «albatta MAN» deyish yetarli emas: qaysi tarmoqlar, kim boshqarishi va qanday bog‘langani ham muhim."
  },
  {
    "type": "task",
    "content": "5-mashq. Tarmoqni MAN deb tasniflash uchun hudud va boshqaruv belgilarini yozing."
  },
  {
    "type": "heading",
    "content": "6. WAN — masofadagi tarmoqlar"
  },
  {
    "type": "definition",
    "content": "Wide Area Network (WAN) uzoq geografik masofalarda alohida LANlarni birlashtiradi. Filiallarning operator kanali, ijaraga olingan aloqa yoki Internet ustidan VPN orqali bog‘lanishi WANga misol. WANning tezligi doim LANdan past emas, real kanal sig‘imi va kechikishiga bog‘liq."
  },
  {
    "type": "case",
    "content": "Toshkent va Nukusdagi maktab filiallari o‘z ma’lumot markaziga operator yoki himoyalangan Internet kanali orqali ulanadi."
  },
  {
    "type": "trap",
    "content": "«WAN = har doim sekin» va «WAN = butun Internet» xulosalari noto‘g‘ri; korporativ WAN xususiy bo‘lishi mumkin."
  },
  {
    "type": "task",
    "content": "6-mashq. Ikki filialni WAN orqali bog‘lashda sig‘im, kechikish va ishonchlilikni solishtiring."
  },
  {
    "type": "table",
    "content": "| Xususiyat | LAN | WAN |\n|---|---|---|\n| Qamrov | Mahalliy | Geografik uzoq |\n| Boshqaruv | Muassasa | Muassasa+operatorlar |\n| Tezlik | Infratuzilmaga bog‘liq | Kanalga bog‘liq |\n| Kechikish | Ko‘pincha kamroq | Masofa/routingga bog‘liq |"
  },
  {
    "type": "heading",
    "content": "7. Internet — tarmoqlar tarmog‘i"
  },
  {
    "type": "definition",
    "content": "Internet — ko‘plab mustaqil tarmoqlarni IP asosidagi aloqa orqali bog‘lovchi global infratuzilma. World Wide Web uning ustida ishlaydigan ko‘p xizmatlardan biri; elektron pochta ham Internetda yuradi. Internetni yagona kompaniya boshqarmaydi."
  },
  {
    "type": "solved",
    "content": "O‘qituvchi veb-sahifani HTTP/HTTPS orqali ochishi, o‘quvchi esa xatni elektron pochta orqali yuborishi mumkin; ikkalasi ham Internet ustidagi alohida xizmat."
  },
  {
    "type": "trap",
    "content": "Brauzer ochilmadi degani barcha internet xizmatlari ishlamayapti degani emas: xizmat, DNS yoki aloqa bosqichlari farq qiladi."
  },
  {
    "type": "task",
    "content": "7-mashq. Internet bilan WWW orasidagi farqni misol bilan tushuntiring."
  },
  {
    "type": "table",
    "content": "| Atama | Nima? |\n|---|---|\n| Internet | IP orqali o‘zaro ulangan tarmoqlar |\n| WWW | Veb sahifa/resurslar tizimi |\n| HTTP/HTTPS | Veb ilova protokoli |\n| Email | Xabar yuborish xizmati |"
  },
  {
    "type": "heading",
    "content": "8. Intranet va ekstranet"
  },
  {
    "type": "definition",
    "content": "Intranet — tashkilot xodimlari yoki a’zolariga mo‘ljallangan ichki xizmatlar majmuasi; ekstranet esa ayrim tashqi hamkorlarga nazoratli kirishni beradi. Bu atamalar ko‘pincha xizmatga kirish chegarasini anglatadi, faqat fizik kabel turini emas. Kirish huquqi autentifikatsiya va siyosat bilan ajratiladi."
  },
  {
    "type": "example",
    "content": "Maktab ichki jurnalini faqat xodimlar ishlatsa intranet maqsadiga mos; ota-onalarga ayrim sahifalar uchun login berilsa ekstranetga o‘xshash nazoratli kirish paydo bo‘ladi."
  },
  {
    "type": "trap",
    "content": "Intranet tashqi Internetdan ajratilgan bo‘lsa ham ichki xavfsizlik avtomatik mukammal emas."
  },
  {
    "type": "task",
    "content": "8-mashq. Intranet va ekstranet uchun kirish huquqlarining farqini yozing."
  },
  {
    "type": "heading",
    "content": "9. VPN — tarmoq ustidagi himoyalangan tunnel"
  },
  {
    "type": "definition",
    "content": "Virtual Private Network (VPN) mavjud tarmoq ustida mantiqiy, ko‘pincha shifrlangan tunel hosil qiladi. Foydalanuvchi filial resursiga masofadan kirishi mumkin; VPN himoyasining haqiqiy darajasi protokol, konfiguratsiya va ishonilgan provayderga bog‘liq. VPN tarmoqni sehrli tezlashtirmaydi."
  },
  {
    "type": "case",
    "content": "Uydagi o‘qituvchi maktab ichki serveriga tasdiqlangan VPN klienti orqali ulanadi; xizmatga ruxsat qo‘shimcha autentifikatsiyaga ham bog‘liq."
  },
  {
    "type": "trap",
    "content": "Har qanday VPN barcha kuzatuv, phishing yoki zararli dasturdan himoya qiladi degan xulosa noto‘g‘ri."
  },
  {
    "type": "task",
    "content": "9-mashq. VPN vazifasi, bir afzalligi va ikki cheklovini yozing."
  },
  {
    "type": "heading",
    "content": "10. Bandwidth, latency va throughput"
  },
  {
    "type": "definition",
    "content": "Bandwidth/kanal sig‘imi bir vaqt oralig‘ida uzatilishi mumkin bo‘lgan bitlar chegarasini ifodalaydi; throughput haqiqiy o‘tkazilgan foydali ma’lumot tezligidir. Latency javobning kelish kechikishi; paket yo‘qotilishi va jitter real foydalanishga ta’sir qiladi. 100 Mbit/s va 100 MB/s bir xil emas."
  },
  {
    "type": "solved",
    "content": "100 Mbit/s = 12.5 MB/s nazariy xom ekvivalent, amalda TCP/HTTP/protokol yuklari sabab fayl uzatish bundan past bo‘lishi mumkin."
  },
  {
    "type": "trap",
    "content": "Signal ustunlari to‘liq ko‘rinishi, internetdan amalda 100 Mbit/s fayl tushishini kafolatlamaydi."
  },
  {
    "type": "task",
    "content": "10-mashq. 100 Mbit/s qancha MB/s? Throughput va bandwidth farqini yozing."
  },
  {
    "type": "formula",
    "content": "1 byte = 8 bit. Shuning uchun 100 Mbit/s ÷ 8 = 12.5 MB/s (ideal birlik almashuvi). Bu transport overhead va disk tezligini hisobga olmaydi."
  },
  {
    "type": "heading",
    "content": "11. Tarmoq xavfsizligi va segmentatsiya"
  },
  {
    "type": "definition",
    "content": "Kirishni cheklash, shifrlash, yangilanish, kuchli autentifikatsiya va zaxira siyosati tarmoq himoyasining qismlaridir. Mehmonlar Wi-Fi sini maktab jurnalining ichki tarmog‘idan alohida segmentga ajratish xavfni kamaytirishi mumkin. Biroq segmentatsiya yagona himoya emas."
  },
  {
    "type": "example",
    "content": "Maktabdagi «O‘qituvchilar» va «Mehmonlar» WLANlari turli siyosat bilan o‘rnatilib, ichki elektron jurnalga faqat avtorizatsiyali foydalanuvchi kira olsin."
  },
  {
    "type": "trap",
    "content": "SSID nomi maxfiy ko‘rinsa ham bu tarmoqning o‘zi avtomatik shifrlangan yoki xavfsiz ekanini anglatmaydi."
  },
  {
    "type": "task",
    "content": "11-mashq. Mehmon va ma’muriy tarmoqni ajratish uchun uch sabab yozing."
  },
  {
    "type": "table",
    "content": "| Xavf | Nazorat |\n|---|---|\n| Begona mehmon ichki hujjatga kiradi | Segmentatsiya+kirish huquqi |\n| Kuchsiz parol | MFA va parol siyosati |\n| Eskirgan router | Firmware yangilash |\n| Hujjat noto‘g‘ri ulashiladi | Resurs ruxsatini audit |"
  },
  {
    "type": "heading",
    "content": "12. Tarmoq turini aniqlash bo‘yicha amaliy loyiha"
  },
  {
    "type": "definition",
    "content": "Tasniflashda avval qurilmalar, geografik qamrov, fizik/simsiz aloqa, kim boshqarishi va qaysi resurslar bo‘lishilishini tekshiring. PAN, LAN, WLAN, MAN, WAN va VPN bir xil o‘qdagi qarama-qarshi turlar emas: VPN ustki virtual mantiq, WLAN esa simsiz lokal yo‘l bo‘lishi mumkin."
  },
  {
    "type": "case",
    "content": "Telefon–soat Bluetooth PAN, maktab Wi-Fi WLAN va LAN qismi, viloyatlararo filial tarmog‘i WAN, masofadan kirish VPN deb asoslang."
  },
  {
    "type": "trap",
    "content": "Bir holat bir nechta yorliq olishi mumkin: mehmon WLAN ichidagi foydalanuvchi VPN bilan masofadagi WAN resursiga ulanadi."
  },
  {
    "type": "task",
    "content": "12-mashq. Beshta real vaziyatni nomlang va har biri uchun geografiya+texnologiya+maqsad bo‘yicha tasnif yozing."
  },
  {
    "type": "summary",
    "content": "PAN shaxs atrofida; LAN lokal boshqariladigan tarmoq; WLAN shu tarmoqning simsiz ko‘rinishi; MAN shahar; WAN keng geografiya. Internet ko‘p tarmoqlar tizimi, WWW xizmatlardan biri. VPN mantiqiy himoyalangan tunnel, lekin absolyut maxfiylik ham, tezlik ortishi ham kafolatlanmaydi. Throughput, bandwidth va latency farqli o‘lchamlar."
  },
  {
    "type": "answers",
    "content": "1) qurilma, aloqa vositasi, protokol; 2) soat/telefon va naushnik/telefon; 3) lokal fayl/printer; 4) WLAN internetdan mustaqil; 5) shahar tarmoq bog‘lanishi; 6) kanal/kechikish; 7) Internet infratuzilma, WWW xizmat; 8) rol chegarasi; 9) VPN ishonch/shifrlash konfiguratsiyasi; 10) 12.5 MB/s nazariy; 11) segmentatsiya va ruxsat; 12) bir vaziyatda bir necha tasnif mumkin."
  },
  {
    "type": "source",
    "content": "Cambridge+ 9-sinf, 4-bob «Kompyuter tarmoqlari va ulardan foydalanish», ~41-betdan (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf 6- va 13-bob tarmoqlar, ~78 va ~221-betlar (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view); Cloudflare Internet tushunchasi (https://www.cloudflare.com/en-gb/learning/network-layer/how-does-the-internet-work/). Darslikdan original pedagogik bayon; tasvir/betlarning to‘liq 1:1 auditidan o‘tmagan."
  }
]

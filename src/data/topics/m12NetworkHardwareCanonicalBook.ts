/** TASK-308: switch, router, NIC, media and troubleshooting textbook. */
import type { TheoryBlock } from '../topicContent'
export const M12_02_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "NIC/MAC, hub/switch/router/modem/AP, Ethernet va Wi-Fi, twisted-pair/coax/fiber, firewall va xavfsiz diagnostikaning vazifalarini real tarmoqda farqlash."
  },
  {
    "type": "intro",
    "content": "Bir dona uy routeri ichida router, switch, access point va ba’zan modem funksiyasi jamlangan bo‘lishi mumkin. Biroq ma’lumot qaysi qatlamda qanday uzatilishini tushunish uchun bu rollarni ajratish zarur."
  },
  {
    "type": "heading",
    "content": "1. Tarmoq tugunlari va asosiy qismlar"
  },
  {
    "type": "definition",
    "content": "Tarmoqda tugun — kompyuter, printer, server yoki tarmoqqa ulangan boshqa qurilma; aloqa liniyasi esa signallar uchun muhit. Tarmoqni barpo etishda NIC, switch/AP, marshrutizator va kerakli servislarni farqlash muhim. Bitta uy routeri bir necha funksiyani o‘zida jamlashi mumkin."
  },
  {
    "type": "solved",
    "content": "4 noutbuk, bitta tarmoq printeri, switch va Wi-Fi kirish nuqtasini chizing; qaysi qurilma foydalanuvchi, qaysisi tarmoq infratuzilmasi?"
  },
  {
    "type": "trap",
    "content": "Kompyuter, router va server atamalari doim alohida fizik qutilar degani emas: vazifa dastur yoki kombinatsiyalangan qurilmada bajariladi."
  },
  {
    "type": "task",
    "content": "1-mashq. Maktab sinfi uchun beshta tarmoq komponentini roliga ko‘ra guruhlang."
  },
  {
    "type": "table",
    "content": "| Komponent | Vazifasi |\n|---|---|\n| NIC | Lokal muhitga ulanish |\n| Switch | L2 kadrlarni yo‘naltirish |\n| Router | IP tarmoqlar o‘rtasida marshrutlash |\n| AP | Wi-Fi klient ulanishi |\n| Firewall | Ruxsat/taqiq siyosati |"
  },
  {
    "type": "heading",
    "content": "2. NIC va tarmoq interfeysi"
  },
  {
    "type": "definition",
    "content": "Network Interface Controller/Card (NIC) qurilmani Ethernet yoki simsiz aloqa muhitiga ulaydi. MAC manzil ko‘pincha lokal ma’lumot almashuvda ishlatiladigan kanal-sath identifikatori; operatsion tizim MAC randomizatsiyasini qo‘llashi mumkin. IP manzil boshqa sathdagi mantiqiy manzildir."
  },
  {
    "type": "case",
    "content": "Laptopda Ethernet adapterning MAC manzili bor, Wi-Fi adapterning ham MAC manzili mavjud bo‘lishi mumkin. IP konfiguratsiyasi esa tarmoqdan olinadi."
  },
  {
    "type": "trap",
    "content": "MAC manzilni dunyoda abadiy o‘zgarmas yoki doim yagona real shaxsni aniqlaydi deb hisoblamang."
  },
  {
    "type": "task",
    "content": "2-mashq. MAC va IPv4 manzilni vazifa va sath bo‘yicha solishtiring."
  },
  {
    "type": "heading",
    "content": "3. Hub va switch: kadr uzatish"
  },
  {
    "type": "definition",
    "content": "Oddiy hub fizika sathida olingan signalni ko‘p portga takrorlaydi. Odatdagi layer-2 switch esa Ethernet kadrining destination MAC maydoniga qarab chiqish portini tanlashga harakat qiladi. Switch MAC jadvali bilmagan manzil uchun ba’zan flood qiladi; barcha kadrlar har doim faqat bitta portga ketadi degan gap xato."
  },
  {
    "type": "example",
    "content": "A kompyuter B ga kadr jo‘natdi: switch B ning MAC jadvaldagi portini bilsa, o‘sha portga chiqaradi; hub esa signalni boshqa portlarga takrorlardi."
  },
  {
    "type": "trap",
    "content": "«Switch har bir qurilmaga doim alohida maxfiy kanal beradi» talqini noto‘g‘ri: broadcast va unknown unicast ko‘p portga yuborilishi mumkin."
  },
  {
    "type": "task",
    "content": "3-mashq. Hub va switchning bir farqini MAC jadvali misolida yozing."
  },
  {
    "type": "table",
    "content": "| Signal turi | Oddiy hub | Oddiy switch |\n|---|---|---|\n| Unknown unicast | Ko‘p portga takrorlaydi | Kerakli VLAN portlariga flood qilishi mumkin |\n| Known unicast | Ko‘p portga takrorlaydi | MAC jadvalga mos port |\n| Broadcast | Ko‘p portga | Broadcast domenidagi portlarga |"
  },
  {
    "type": "heading",
    "content": "4. Router va routing jadvali"
  },
  {
    "type": "definition",
    "content": "Router turli IP tarmoqlari orasida paketni keyingi hopga yuboradi. Marshrutlash qarori odatda destination IP va routing table asosida olinadi; default route manzilning maxsus qoidasi bo‘lmaganda qo‘llanadi. Lokal switchga ulangan qurilma Internetga chiqishi uchun gateway sozlamasi zarur bo‘lishi mumkin."
  },
  {
    "type": "solved",
    "content": "192.168.10.0/24 sinf LANi 192.168.20.0/24 server LANiga so‘rov yuborsa, segmentlar orasida L3 routing kerak; router gateway bo‘lishi mumkin."
  },
  {
    "type": "trap",
    "content": "Routerda Wi-Fi radiosi bo‘lishi majburiy emas; ko‘plab korporativ routerlar APdan alohida ishlaydi."
  },
  {
    "type": "task",
    "content": "4-mashq. Router bilan switch farqini manzil turi va tarmoqlar chegarasi orqali yozing."
  },
  {
    "type": "code",
    "content": "Client IP:      192.168.10.15/24\nLocal gateway:  192.168.10.1\nTarget:         192.168.20.25\nDecision:       Different subnet → default gateway"
  },
  {
    "type": "heading",
    "content": "5. Modem va xizmat ko‘rsatish kanali"
  },
  {
    "type": "definition",
    "content": "Modem aloqa muhitiga mos kodlash/modulyatsiya yoki terminal funksiyasini bajarishi mumkin. DSL modem telefon liniyasi, kabel modem koaksial tarmoq bilan ishlashi mumkin; optik internetda ONT optik terminal vazifasini bajaradi. Modemning aynan analog–raqamli juftligi barcha zamonaviy texnologiyani to‘liq qamrab olmaydi."
  },
  {
    "type": "case",
    "content": "Provayder optik kabel orqali ONT o‘rnatdi; uning Ethernet portidan ichki router WAN portiga ulanish bo‘lishi mumkin."
  },
  {
    "type": "trap",
    "content": "«Internet kelishi uchun har doim analog modem shart» noto‘g‘ri: optik, Ethernet va mobil operator turlari farq qiladi."
  },
  {
    "type": "task",
    "content": "5-mashq. DSL modem, ONT va router vazifalarini uch ustunli jadvalda yozing."
  },
  {
    "type": "table",
    "content": "| Operator muhiti | Odatdagi chekka qurilma |\n|---|---|\n| DSL liniyasi | DSL modem |\n| Koaksial keng polosali kanal | Kabel modem |\n| Optik PON | ONT |\n| Lokal Ethernet handoff | Router/switch porti |"
  },
  {
    "type": "heading",
    "content": "6. Access point va WLAN"
  },
  {
    "type": "definition",
    "content": "Access point (AP) Wi-Fi qurilmalarini lokal tarmoqqa ulash uchun radioaloqa xizmatini beradi. SSID ko‘rinadigan WLAN nomi; autentifikatsiya, kanal va shifrlash sozlamasi aloqa sifatiga ta’sir qiladi. Router va AP integratsiyalangan bo‘lishi mumkin, lekin mantiqan alohida rollardir."
  },
  {
    "type": "example",
    "content": "Maktabga 3 AP qo‘yildi: hammasi markaziy LAN switchlariga ulangan; o‘quvchilar sinflar bo‘ylab yurib Wi-Fi signalini oladi."
  },
  {
    "type": "trap",
    "content": "Wi-Fi signal kuchli bo‘lsa ham DNS yoki Internet provayder ishlamasligi mumkin; AP router bilan bir narsa emas."
  },
  {
    "type": "task",
    "content": "6-mashq. Access point va router vazifalarini bittadan misol bilan farqlang."
  },
  {
    "type": "heading",
    "content": "7. Repeater, bridge va tarmoq kengayishi"
  },
  {
    "type": "definition",
    "content": "Repeater signallarni belgilangan muhitda takrorlash/regeneratsiya qilishga xizmat qiladi; bridge lokal segmentlarni kanal sathida bog‘lash va filtrlash uchun ishlatiladi. Modern switch ko‘p-portli bridge sifatida tushuntirilishi mumkin. Wi-Fi extender o‘rnatilishi throughputga ta’sir qilishi mumkin."
  },
  {
    "type": "solved",
    "content": "Bitta xona signali qo‘shni xonada zaif; repeater qo‘shishdan oldin APni to‘g‘ri joylashtirish va simli uplink borligini tekshiring."
  },
  {
    "type": "trap",
    "content": "Signalni ko‘paytirish yangi provayder tezligi yoki qo‘shimcha Internet kanalini avtomatik yaratmaydi."
  },
  {
    "type": "task",
    "content": "7-mashq. Repeater va APning kutiladigan foydasi hamda kamchiligini yozing."
  },
  {
    "type": "heading",
    "content": "8. UTP va o‘ralgan juft kabel"
  },
  {
    "type": "definition",
    "content": "UTP yoki ekranlangan twisted-pair kabel juft simlarning o‘ralishi orqali elektromagnit xalaqitni kamaytirishga yordam beradi. Ethernet tezligi kabel toifasi, juftlar soni, masofa, ulagich, qurilma porti va sharoitga bog‘liq. Ko‘plab misga asoslangan Ethernet installatsiyalarida 100 metr odatiy kanal chegarasi, universal har qanday kabel uchun qonun emas."
  },
  {
    "type": "case",
    "content": "Sinfxonada Cat6 kabeli va gigabit switch bor, lekin NIC 100 Mbit/s: yakuniy aloqa 1 Gbit/sga o‘z-o‘zidan chiqmaydi."
  },
  {
    "type": "trap",
    "content": "«Cat6 bo‘lsa doim 10 Gbit/s» yoki «barcha Ethernet albatta 100 metr» deyish shart/sharoitni e’tiborsiz qoldiradi."
  },
  {
    "type": "task",
    "content": "8-mashq. Kabel toifasi, port tezligi va uzunlikning uchalasini qamragan sinov tuzing."
  },
  {
    "type": "table",
    "content": "| Omil | Nima cheklashi mumkin |\n|---|---|\n| Kabel kategoriyasi | Signal sifati/standart |\n| Kabel uzunligi | Susayish |\n| Switch va NIC porti | Muzokara qilingan tezlik |\n| Ulagich sifati | Paket xatolari |"
  },
  {
    "type": "heading",
    "content": "9. Koaksial kabel va optik tola"
  },
  {
    "type": "definition",
    "content": "Koaksial kabel markaziy o‘tkazgich va ekranlovchi qatlamdan iborat, kabel televideniyesi/broadbandda ishlatilishi mumkin. Optik tola axborotni yorug‘lik impulslari orqali uzatadi, elektromagnit xalaqitga nisbatan chidamli va katta sig‘im hamda uzoq masofalarga mos bo‘lishi mumkin. Alohida xizmat 100 Gbit/s bilan cheklanmaydi; texnologiya va transiverga qarab farq qiladi."
  },
  {
    "type": "example",
    "content": "Bino ichidagi Ethernet mis kabel bilan, filiallararo kanal optik tola bilan qurilishi mumkin; eng ma’qul yechim masofa, xarajat va servis shartiga bog‘liq."
  },
  {
    "type": "trap",
    "content": "«Optik tola mutlaqo eng tez, maksimal 100 Gbit/s» noto‘g‘ri qat’iy chegara; tashqi interfeys va uskunalar tezligi turlicha."
  },
  {
    "type": "task",
    "content": "9-mashq. Koaksial, twisted-pair va tolani masofa, immunitet va narx bo‘yicha jadvalga soling."
  },
  {
    "type": "table",
    "content": "| Aloqa muhiti | Kuchli jihat | Cheklov |\n|---|---|---|\n| Twisted-pair | Qulay Ethernet infratuzilma | Masofa/EMI |\n| Koaksial | Ekranlangan uzatish | Servisga bog‘liq |\n| Optik tola | Uzoq kanal va katta sig‘im | Optika/transiver narxi |\n| Wi-Fi | Mobil ulanish | Radio interferensiya |"
  },
  {
    "type": "heading",
    "content": "10. Simsiz aloqa: Wi-Fi va Bluetooth"
  },
  {
    "type": "definition",
    "content": "Wi-Fi lokal radio tarmoqda yuqori darajali IP xizmatlarini olib yurishi mumkin; Bluetooth qisqaroq masofa, energiya va qurilmalar protokollariga mo‘ljallangan turli rejimga ega. Radio muhitda devor, interferensiya, kanal kengligi va klient soni o‘zaro ta’sir qiladi. Simsiz aloqa kriptografiyasi tegishli xavfsizlik rejimi bilan sozlanishi kerak."
  },
  {
    "type": "solved",
    "content": "Kitobxonlik xonasida Bluetooth quloqchin va Wi-Fi orqali sayt ochish bir paytning o‘zida ishlashi mumkin, lekin aloqa maqsadlari boshqa."
  },
  {
    "type": "trap",
    "content": "Wi-Fi parolini bilish yoki tarmoqqa ulanib olish barcha server resursiga kirish huquqi degani emas."
  },
  {
    "type": "task",
    "content": "10-mashq. Wi-Fi va Bluetoothni uch mezon: rol, energiya, qamrov bo‘yicha solishtiring."
  },
  {
    "type": "heading",
    "content": "11. Firewall va tarmoq siyosati"
  },
  {
    "type": "definition",
    "content": "Firewall tarmoq trafikini yozilgan qoidalar bo‘yicha ruxsat etish yoki cheklashga xizmat qiladi; u qurilma, server va chegarada bo‘lishi mumkin. IP, port, yo‘nalish va holat kabi belgilar qarorga ta’sir qiladi. Firewall antivirusning to‘liq muqobili emas; turli xavflar turli himoyaga ehtiyoj tug‘diradi."
  },
  {
    "type": "case",
    "content": "Maktab ichki admin paneliga faqat xodimlar segmentidan ruxsat, mehmon WLANidan esa taqiqlash qoidasi ishlab chiqiladi."
  },
  {
    "type": "trap",
    "content": "Firewall yoqilgan bo‘lsa phishing, zararli fayl va noto‘g‘ri parollarga qarshi barcha xavf tugadi degan xulosa noto‘g‘ri."
  },
  {
    "type": "task",
    "content": "11-mashq. Firewall uchun ruxsat/taqiq qoidasiga bitta minimal misol yozing."
  },
  {
    "type": "heading",
    "content": "12. Amaliy diagnostika: muammo qayerda?"
  },
  {
    "type": "definition",
    "content": "Tarmoq nosozligida fizik aloqa, adapter holati, lokal IP sozlama, default gateway, DNS va kerakli ilova xizmatini alohida tekshiring. Brauzer ishlamasa avval tarmoqning qaysi qismigacha aloqa borligini aniqlang. O‘quv mashqida ping/traceroute faqat ruxsatli tizimga qo‘llanadi."
  },
  {
    "type": "example",
    "content": "Wi-Fi ulangan, lekin sayt ochilmadi: gatewayga aloqa bormi, nom IPga yechilyaptimi, HTTPS server javob berayaptimi, birma-bir tekshiring."
  },
  {
    "type": "trap",
    "content": "«Ping ishlamadi = server yo‘q» degan xulosa noto‘g‘ri: ICMP trafik firewall orqali bloklangan bo‘lishi mumkin."
  },
  {
    "type": "task",
    "content": "12-mashq. Gateway, DNS va sayt xatosini ajratish uchun xavfsiz 5 bosqichli reja tuzing."
  },
  {
    "type": "list",
    "content": "1. Adapter va aloqa chirog‘ini tekshirish.\n2. Qurilma lokal IP va maskasini ko‘rish.\n3. Gatewayga ruxsatli test.\n4. DNS nomi yechilishini tekshirish.\n5. Ilova/HTTPS xizmatini alohida tekshirish."
  },
  {
    "type": "summary",
    "content": "NIC lokal muhitga ulaydi; switch ko‘pincha MACga asoslangan L2 kadrlarni, router esa IP manzil bo‘yicha tarmoqlararo paketlarni yo‘naltiradi. Hub segment bo‘ylab signalni takrorlaydi, modem yoki ONT operator aloqa muhitini moslashtiradi. AP Wi-Fi ulanishini yaratadi. Tolada universal 100 Gbit/s chegarasi yo‘q; tezlik barcha komponentga bog‘liq. Firewall himoyaning yagona qismi emas."
  },
  {
    "type": "answers",
    "content": "1) tugun, aloqa, gateway, AP, xizmat; 2) MAC L2, IP L3; 3) MAC learning vs hub repeating; 4) gateway boshqa subnet uchun; 5) DSL/kabel/ONT; 6) AP WLANga; 7) repeater signalni uzaytiradi; 8) kabel+NIC+port uchalasi; 9) fiber sig‘im texnologiyaga bog‘liq; 10) Bluetooth PAN, Wi-Fi WLAN; 11) firewall qoidasi; 12) lokal link→IP→gateway→DNS→xizmat. Turli asoslangan loyihalar qabul qilinadi."
  },
  {
    "type": "source",
    "content": "Cambridge+ 9-sinf, 4-bob, 41–54-betlar «Kompyuter tarmoqlari va ulardan foydalanish» (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view), Cambridge+ 10–11-sinf, 13-bob, 221-betdan «Tarmoqlar» (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Cloudflare L3 IP va L2 switch faktlari (https://www.cloudflare.com/learning/network-layer/internet-protocol/). Diagramma va apparat konfiguratsiyasi mustaqil pedagogik bayon; fizik PDF grafikalarining to‘liq 1:1 ekspertizasi bajarilmagan."
  }
]

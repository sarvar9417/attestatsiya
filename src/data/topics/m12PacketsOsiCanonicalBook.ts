/** TASK-308: packet flow, OSI/TCP-IP, DNS/TCP/UDP/HTTP3 canonical book. */
import type { TheoryBlock } from '../topicContent'
export const M12_04_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "Paketli uzatish, OSI/TCP/IP, Ethernet-kadr/IP-paket/TCP segment, TCP/UDP, DNS, HTTPS/HTTP3, encapsulation, kechikish va xavfsiz diagnostika jarayonlarini aniqlik bilan tushuntirish."
  },
  {
    "type": "intro",
    "content": "Bitta URLga kirish ortida DNS, transport, tarmoqlararo routing va lokal kadr uzatish kabi bir necha vazifa ishlaydi. Qatlamlar real dunyoni tushunishga yordam beradigan model; ular mutlaq «7 bo‘lakdan iborat dastur» qoidasi emas. Zamonaviy QUIC/HTTP3 sabab veb faqat TCP emas."
  },
  {
    "type": "heading",
    "content": "1. Paketli uzatish va segmentlash"
  },
  {
    "type": "definition",
    "content": "Paketli uzatishda katta axborot aloqa jarayonida kichik birliklarga ajratilib, har bir birlik kerakli sath sarlavhalari bilan yuboriladi. Manzillash va marshrutlash butun faylni bitta katta signal sifatida uzatishni talab qilmaydi. Turli paketlarning bir xil yo‘ldan o‘tishi har doim shart emas."
  },
  {
    "type": "solved",
    "content": "5 MB fayl bir nechta paket orqali jo‘natiladi. Har paket manzillash metama’lumotiga ega bo‘lishi, qabul tomonida transport/ilova tomonidan qayta yig‘ilishi mumkin."
  },
  {
    "type": "trap",
    "content": "«Internetdagi paketlar doimo bir xil yo‘lni bosib o‘tadi» noto‘g‘ri; routing holati va trafik sharoitiga bog‘liq."
  },
  {
    "type": "task",
    "content": "1-mashq. Faylni paketlashning ikkita sababini va bitta xarajatini yozing."
  },
  {
    "type": "table",
    "content": "| Birlik | Qamrov |\n|---|---|\n| Ilova xabari | Foydalanuvchi ma’lumoti |\n| TCP segment / UDP datagram | Ilovalar/portlar oralig‘i |\n| IP paket | Tarmoqlararo manzil |\n| Ethernet kadr | Lokal link |\n| Bit/impuls | Fizik muhit |"
  },
  {
    "type": "heading",
    "content": "2. Protokol va qatlam tushunchasi"
  },
  {
    "type": "definition",
    "content": "Protokol — ikki yoki ko‘p tizim tushunadigan format va xatti-harakat qoidalari. Qatlamli model murakkab aloqani vazifalar bo‘yicha ajratib tushuntiradi. OSI yetti qatlamli konseptual model; TCP/IP amaliy Internet stekini qisqaroq guruhlarga ajratadi. Zamonaviy implementatsiya har bir funksiyani bitta qatlamga aynan moslamasligi mumkin."
  },
  {
    "type": "example",
    "content": "Brauzer HTTP so‘rovini yaratadi; transport va IP qatlamlari uni yetkazishga qatnashadi. Bu tasvir zarur konseptual qatlamlarni ko‘rsatadi, barcha operatsion tizim kodini emas."
  },
  {
    "type": "trap",
    "content": "OSI modeli fizik qurilmadan kelgan trafik har doim yettita mustaqil jarayondan qat’iy tartibda o‘tadi degan dastur spetsifikatsiyasi emas."
  },
  {
    "type": "task",
    "content": "2-mashq. OSI va TCP/IP modelining asosiy o‘xshashligi va farqini yozing."
  },
  {
    "type": "table",
    "content": "| OSI | Modeldagi vazifa | Amaliy misol |\n|---|---|---|\n| 7 Ilova | Xizmat | HTTP, DNS |\n| 6 Taqdimot | Ma’lumot ko‘rinishi | Kodlash/TLS bilan bog‘liq funksiyalar |\n| 5 Sessiya | Muloqot holati | Sessiya boshqaruvi konsepsiyasi |\n| 4 Transport | Ilova oqimlari | TCP, UDP |\n| 3 Tarmoq | Paketlarni marshrutlash | IPv4/IPv6 |\n| 2 Kanal | Lokal kadr | Ethernet/Wi-Fi |\n| 1 Fizik | Bit-signallar | Elektr/optika/radio |"
  },
  {
    "type": "heading",
    "content": "3. OSI 1–2: fizik va kanal qatlamlari"
  },
  {
    "type": "definition",
    "content": "1-fizik qatlam signallarni sim, yorug‘lik yoki radio ko‘rinishida uzatish g‘oyasini qamrab oladi. 2-kanal qatlami lokal segmentdagi freym/kadr, MAC manzil va muhit boshqaruviga tegishli. Ethernet va Wi-Fi lokal uzatishning turli texnologiyalari; 8P8C kabel ulagichi yoki RJ45 deb ataluvchi ulagich protokol emas."
  },
  {
    "type": "case",
    "content": "Switch Ethernet kadrini MAC jadvalga qarab yo‘naltiradi; fizik kabel esa bitlarni elektr impulsi ko‘rinishida olib yuradi."
  },
  {
    "type": "trap",
    "content": "«RJ45 OSI protokoli» yoki «MAC manzil Internetdagi barcha routerlar orasida yo‘nalish beradi» noto‘g‘ri."
  },
  {
    "type": "task",
    "content": "3-mashq. Fizik signal va MAC-kadrni bir chizmada ajrating."
  },
  {
    "type": "heading",
    "content": "4. OSI 3: IP va marshrutlash"
  },
  {
    "type": "definition",
    "content": "Tarmoq qatlami IP paketini mantiqiy destination manzil asosida tarmoqlar bo‘ylab yo‘naltirish imkonini beradi. Router forwarding jadvalidagi eng mos prefiksga qarab next hop tanlashi mumkin. IP o‘zi alohida ilova faylini mutlaq ishonchli, tartib bilan yetkazishga kafolat bermaydi."
  },
  {
    "type": "solved",
    "content": "192.168.1.10 dan 203.0.113.5 kabi hujjatlashtirish uchun ajratilgan manzilga paket yuborish misolida routerlar destination prefiksga qarab qaror qiladi."
  },
  {
    "type": "trap",
    "content": "IP manzilni MAC manzil bilan adashtirmang; lokal kadr va IP paket turli sath chegaralarida ishlaydi."
  },
  {
    "type": "task",
    "content": "4-mashq. Qanday vaziyatda client paketni default gatewayga yuborishini izohlang."
  },
  {
    "type": "code",
    "content": "Client: 192.168.10.20/24\nTarget: 192.168.20.7/24\nDifferent subnet → send packet via configured gateway\nRouter: select route by destination prefix"
  },
  {
    "type": "heading",
    "content": "5. OSI 4: TCP ulanishi"
  },
  {
    "type": "definition",
    "content": "TCP transport qatlamida ulanish holatini boshqarib, bayt oqimini tartibli yetkazish uchun tasdiqlash, qayta uzatish va oqim nazorati ishlatadi. Biroq uzilgan kanal, server nosozligi yoki timeout sabab ulanish xato bilan tugashi mumkin: to‘liq muvaffaqiyatni mutlaq kafolatlamaydi. Ilova xatoni qayta ishlashi zarur."
  },
  {
    "type": "example",
    "content": "Fayl jo‘natishda segment yo‘qoldi: TCP qayta uzatishni boshlashi mumkin. Agar aloqa uzoq vaqt tiklanmasa, ilova xato oladi va foydalanuvchiga ko‘rsatadi."
  },
  {
    "type": "trap",
    "content": "«TCP paketni 100% har doim yetkazadi» noto‘g‘ri; protokol ishonchli tartibli yetkazishga harakat qiladi, cheksiz qayta jo‘natmaydi."
  },
  {
    "type": "task",
    "content": "5-mashq. TCPning uch mexanizmi va kamida bir failure holatini yozing."
  },
  {
    "type": "table",
    "content": "| TCP holati | Yakun |\n|---|---|\n| Segment qabul qilindi | Tasdiqlash/ack |\n| Segment yo‘qoldi | Retransmission ehtimoli |\n| Aloqa uzildi | Timeout/xato; ilova xabar beradi |"
  },
  {
    "type": "heading",
    "content": "6. OSI 4: UDP datagramlari"
  },
  {
    "type": "definition",
    "content": "UDP transport qatlamida ulanish holatisiz datagram yuboradigan sodda protokol. UDPning o‘zida TCPdagidek retransmission, tartib yoki congestion control majburiy mexanizmlari yo‘q; lekin UDP ustida qurilgan ilovalar yoki QUIC kabi protokollar qo‘shimcha ishonchlilikni amalga oshirishi mumkin. «UDP doim tezroq» ham universal hukm emas."
  },
  {
    "type": "case",
    "content": "Real vaqtli ovoz oqimi kichik kechikish uchun UDPga tayansa, dastur kech yetib kelgan datagramni tashlab yuborishi mumkin; HTTP/3 esa UDP ustidagi QUICdan foydalanadi."
  },
  {
    "type": "trap",
    "content": "UDP ishlatadigan har qanday ilova xavfsiz emas yoki faqat video/o‘yin uchun deb belgilash noto‘g‘ri; DNS ham UDPdan tez-tez foydalanadi."
  },
  {
    "type": "task",
    "content": "6-mashq. TCP va UDPni tartib, ulanish, kafolat va amaliyot bo‘yicha jadvalga soling."
  },
  {
    "type": "table",
    "content": "| Taqqoslash | TCP | UDP |\n|---|---|---|\n| Aloqa | Holatli | Ulanishsiz datagram |\n| Tartib | Baytlar oqimini tartiblaydi | Ichki kafolat yo‘q |\n| Retransmission | Protokolda bor | Ilova/yuqori protokolda mumkin |\n| Misol | HTTP/2 transporti | DNS/QUIC tashuvchisi |"
  },
  {
    "type": "heading",
    "content": "7. OSI 5–7: sessiya, taqdimot va ilova"
  },
  {
    "type": "definition",
    "content": "OSI konsepsiyasida sessiya qatlamida muloqot holati, taqdimotda ma’lumot tasviri/kodlash/shifrlash, ilova qatlamida xizmat protokollari qaraladi. Bu pedagogik taqsim: zamonaviy TLS, HTTP va sessiya tokenlari amaliy stekda bir-biriga tutashgan ilova/transport qatlamida bajarilishi mumkin. HTTPS odatda HTTPning TLS bilan himoyalangan ishlashidir."
  },
  {
    "type": "solved",
    "content": "Brauzer so‘rovida veb ilova cookie yoki tokenni tekshiradi, TLS transportdagi ma’lumot almashinuvini himoyalaydi, HTTP so‘rov/javob formatini belgilaydi."
  },
  {
    "type": "trap",
    "content": "TLSni har sharoitda alohida «6-OSI qatlam protokoli» deyish amaliy tizimlarni soddalashtirib yuboradi."
  },
  {
    "type": "task",
    "content": "7-mashq. HTTP, TLS va veb sessiya tokenining uch vazifasini izohlang."
  },
  {
    "type": "table",
    "content": "| Xizmat/komponent | Odatdagi vazifa |\n|---|---|\n| HTTP | Ilova xabari |\n| TLS | Tarmoq ustida shifrlangan transport kanali |\n| Cookie/session | Ilova holati |\n| HTTPS | TLS bilan himoyalangan HTTP |"
  },
  {
    "type": "heading",
    "content": "8. DNS: nomdan manzil yozuvigacha"
  },
  {
    "type": "definition",
    "content": "Domain Name System (DNS) domen nomlariga tegishli resurs yozuvlari, jumladan A/AAAA IP manzillarini topishga yordam beradi. Resolver javobi keshda bo‘lishi, CNAME kabi oraliq yozuvlar mavjud bo‘lishi mumkin. DNSning o‘zi HTML faylni uzatmaydi, HTTP/HTTPSdan farq qiladi."
  },
  {
    "type": "example",
    "content": "Brauzer example.org saytini so‘raganda A/AAAA yozuvini DNSdan tekshirib, keyin mos manzilga TLS/HTTP aloqa o‘rnatadi; cache va HTTP/3 tanlovi jarayonni farqlashi mumkin."
  },
  {
    "type": "trap",
    "content": "«DNS domenni doim bitta IPv4ga aylantiradi» noto‘g‘ri: IPv6, bir nechta IP va resurs yozuvlari uchraydi."
  },
  {
    "type": "task",
    "content": "8-mashq. DNS va HTTPning farqini foydalanuvchi tashrif senariysida yozing."
  },
  {
    "type": "code",
    "content": "example.org → DNS A/AAAA record → server IP\nhttps://example.org/ → HTTPS request/response"
  },
  {
    "type": "heading",
    "content": "9. Encapsulation: frame, packet, segment"
  },
  {
    "type": "definition",
    "content": "Qatlamli uzatishda ilova ma’lumotiga transport sarlavhasi, IP sarlavhasi, lokal kadr sarlavhasi qo‘shilishi kapsullash (encapsulation) deb ataladi. Router IP paketni boshqa chiqish interfeysida boshqa lokal kadrga joylashi mumkin; Internet bo‘ylab MAC manzil bir xil qolishi shart emas. Terminologiya modelga bog‘liq."
  },
  {
    "type": "case",
    "content": "Maktab Ethernetidan provayder liniyasiga o‘tishda ichidagi destination IP o‘sha aloqa maqsadini bildiradi, ammo freym Ethernetdan boshqacha bo‘lishi mumkin."
  },
  {
    "type": "trap",
    "content": "«MAC manzil paket bilan butun Internet bo‘ylab o‘zgarmas olib yuriladi» noto‘g‘ri."
  },
  {
    "type": "task",
    "content": "9-mashq. Ma’lumot→segment→IP paket→kadr→bit qatlamini yozing."
  },
  {
    "type": "code",
    "content": "[Ethernet frame [IP packet [TCP segment [HTTP data]]]]\nRouter forwards IP, new local frame may differ"
  },
  {
    "type": "heading",
    "content": "10. Qidiruv/aloqa ketma-ketligi: HTTPS sayti"
  },
  {
    "type": "definition",
    "content": "Foydalanuvchi URL yozganda brauzer keshni yoki DNS javobini tekshirishi, kerak bo‘lsa serverga transport aloqa ochishi, so‘ng xavfsiz HTTP xabarlarini yuborishi mumkin. HTTP/1.1 va HTTP/2 odatda TCP/TLSdan, HTTP/3 esa UDP ustidagi QUICdan foydalanadi. Javob rasmlar/CSSni alohida so‘rov bilan talab qilishi mumkin."
  },
  {
    "type": "solved",
    "content": "Brauzer domenni topdi, keyin sertifikatni tekshirdi va GET yubordi; server 200 OK bilan HTML qaytardi. Ammo cache sabab ba’zi resurslar tarmoqsiz olinishi mumkin."
  },
  {
    "type": "trap",
    "content": "«Veb-sahifa doim TCP ishlatadi» HTTP/3ni inobatga olmaydi; «HTTPS bo‘lsa sayt mutlaq ishonchli» ham noto‘g‘ri."
  },
  {
    "type": "task",
    "content": "10-mashq. URL yozishdan HTML ko‘rinishigacha besh ehtimoliy bosqich yozing."
  },
  {
    "type": "list",
    "content": "1. URLni tekshirish.\n2. DNS/kesh orqali yozuv topish.\n3. TCP+TLS yoki QUIC aloqa o‘rnatish.\n4. HTTP so‘rov yuborish.\n5. HTML/CSS/rasmlarni olib ko‘rsatish."
  },
  {
    "type": "heading",
    "content": "11. Tarmoq ko‘rsatkichlari va yo‘qotilish"
  },
  {
    "type": "definition",
    "content": "Throughput va latency tezlik/sifatning turli jihatlari; packet loss TCP retransmission va ilova tajribasiga ta’sir etadi. Jitter paketlar yetib kelish vaqtidagi o‘zgarish bo‘lib, real-time audio/video uchun sezilarli. Bandwidth yuqori bo‘lsa ham yuqori RTT yoki server javob vaqti tajribani pasaytirishi mumkin."
  },
  {
    "type": "example",
    "content": "Fayl yuklash 100 Mbit/s, lekin jonli darsda ovoz uziladi: jitter yoki packet lossni tekshirish kerak, faqat maksimal tezlikga qarash yetmaydi."
  },
  {
    "type": "trap",
    "content": "Ping ishlamagani har doim «Internet yo‘q» degani emas; ICMP bloklangan bo‘lishi mumkin."
  },
  {
    "type": "task",
    "content": "11-mashq. Bir real-time va bir fayl uzatish holati uchun sifat mezonlarini yozing."
  },
  {
    "type": "heading",
    "content": "12. Amaliy paket yo‘lini diagnostika qilish"
  },
  {
    "type": "definition",
    "content": "Ruxsatli laboratoriyada o‘quvchi OSI/TCP-IP tushunchalari asosida muammo qatlamini aniqlashi mumkin. Avval link va IP sozlamasi, keyin gateway, DNS, HTTPS/server javobi tekshiriladi. Wireshark kabi paket tahlili vositalari faqat huquq, rozilik va maxfiylik qoidalariga amal qilib ishlatiladi."
  },
  {
    "type": "case",
    "content": "Bitta qurilmada link bor, IP va gateway to‘g‘ri, lekin faqat bitta sayt ishlamaydi: DNS, sertifikat yoki sayt servisiga doir nosozlik bo‘lishi mumkin."
  },
  {
    "type": "trap",
    "content": "Sinfxona tarmog‘idan ruxsatsiz trafik tutish, MITM yoki xizmatga bosim o‘tkazish laboratoriya diagnostikasi emas."
  },
  {
    "type": "task",
    "content": "12-mashq. Aloqani 5 qatlamga ajratib nosozlik xulosasini dalil bilan yozing."
  },
  {
    "type": "list",
    "content": "1. Link/adapterni tekshiring.\n2. IP/subnet va gatewayni ko‘ring.\n3. Ruxsatli gateway testini o‘tkazing.\n4. DNS nomi javobini ko‘ring.\n5. HTTPS xizmati va sertifikatni alohida tekshiring."
  },
  {
    "type": "summary",
    "content": "OSI yetti sath: fizik, kanal, tarmoq, transport, sessiya, taqdimot, ilova. Internetda IP paket yo‘naltiradi, lokal kadr MACga tegishli. TCP bayt oqimining tartibli/ishonchli uzatilishi uchun qayta uzatishni ishlatadi, lekin cheksiz kafolat bermaydi. UDP o‘zi retransmissionga ega emas; QUIC UDP ustida qo‘shimcha imkoniyat quradi. DNS nom yozuvini topadi, HTTP/HTTPS sayt resursini almashadi."
  },
  {
    "type": "answers",
    "content": "1) paketlar alohida marshrutlanadi; 2) OSI tushuncha, TCP/IP amaliy guruh; 3) signallar va lokal kadr; 4) IP routing; 5) ACK/retransmission/timeout; 6) UDP connectionless, yuqorida QUIC mumkin; 7) TLS/HTTP/sessiya turli rol; 8) DNS resurs yozuvi, HTTP content; 9) encapsulation; 10) HTTP/3 QUIC+UDP; 11) latency/jitter/loss; 12) link→IP→gateway→DNS→server. Ochiq mashqlarda manbaga mos asoslangan javob ham qabul qilinadi."
  },
  {
    "type": "source",
    "content": "Cambridge+ 10–11-sinf «Tarmoqlardan foydalanish» va «Tarmoqlar» boblari (~78, ~221-bet) (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view); Cambridge+ 9-sinf, 4-bob (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view). Cloudflare OSI qatlamlari (https://developers.cloudflare.com/fundamentals/reference/network-layers/) va IP (https://www.cloudflare.com/learning/network-layer/internet-protocol/); IETF TCP RFC 9293 (https://www.rfc-editor.org/rfc/rfc9293). Qatlamlar va zamonaviy QUIC bilan qo‘shimcha izoh original; PDFdagi barcha rasmlar 1:1 ko‘chirilgani da’vo qilinmaydi."
  }
]

/** TASK-308: topology architecture, physical/logical and mesh math book. */
import type { TheoryBlock } from '../topicContent'
export const M12_03_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "Tarmoq arxitekturasi va fizik/mantiqiy topologiyani, client-server va P2Pni, star/bus/ring/mesh/tree/gibridni ajratish; 7 tugunli full-mesh bog‘lanishini hisoblash va maktab topologiyasini loyihalash."
  },
  {
    "type": "intro",
    "content": "Tarmoqning «qaysi kompyuter xizmat beradi» savoli va «qanday kabel/tugunlar bog‘langan» savoli bir-biridan farq qiladi. Bob fizik bog‘lanish, mantiqiy oqim, nosozliklarning ta’sir sohasi va resurs narxini izchil tahlil qiladi."
  },
  {
    "type": "heading",
    "content": "1. Arxitektura va topologiya: ikki turli tushuncha"
  },
  {
    "type": "definition",
    "content": "Tarmoq arxitekturasi qurilmalar va xizmatlar o‘rtasida vazifalar qanday taqsimlanishini tushuntiradi; topologiya esa tugunlar qanday bog‘langanini yoki ma’lumot qanday yo‘l bilan ketishini ko‘rsatadi. Fizik aloqa simlar va radio yo‘liga, mantiqiy topologiya paket/kadr oqimiga ishora qiladi. Bir tarmoqda bir nechta arxitektura va qatlam topologiyasi bo‘lishi mumkin."
  },
  {
    "type": "case",
    "content": "Maktabda server jurnal ilovasini beradi (client-server), sinfxona kompyuterlari markaziy switchga ulangan (fizik star). Bu savollar har xil jihatni o‘lchaydi."
  },
  {
    "type": "trap",
    "content": "Client-server doim yulduz, peer-to-peer esa doim mesh shaklida bo‘ladi degan fikr xato."
  },
  {
    "type": "task",
    "content": "1-mashq. Server rolini topologiyadan ajratib ikki jumlada tushuntiring."
  },
  {
    "type": "table",
    "content": "| Savol | Arxitektura | Topologiya |\n|---|---|---|\n| Nima aniqlanadi? | Xizmat/rol kimga tegishli | Aloqa va ma’lumot yo‘li |\n| Misol | Client–server | Star |\n| Tekshiruv | So‘rovga kim javob beradi? | Kabel uzilsa nima bo‘ladi? |"
  },
  {
    "type": "heading",
    "content": "2. Client–server modeli"
  },
  {
    "type": "definition",
    "content": "Client–server arxitekturada mijoz xizmat yoki resurs so‘raydi, server uni qayta ishlaydi va ruxsat doirasida javob qaytaradi. Server alohida kuchli kompyuter, virtual mashina yoki bulut xizmati bo‘lishi mumkin. Markaziy xizmat boshqaruvni soddalashtiradi, biroq servis o‘chsa foydalanish to‘xtashi mumkin."
  },
  {
    "type": "solved",
    "content": "Elektron jurnal brauzerdagi foydalanuvchi uchun client; ma’lumotga ruxsatlarni server tekshiradi. O‘quvchining brauzeridagi ko‘rinadigan HTML server sirlarini bilmasligi kerak."
  },
  {
    "type": "trap",
    "content": "«Server bitta fizik qurilmada bo‘lsa, barcha ma’lumot mutlaq xavfsiz» noto‘g‘ri: backup, autentifikatsiya va availability alohida kerak."
  },
  {
    "type": "task",
    "content": "2-mashq. Mijoz so‘rovi va server javobi uchun sodda ketma-ketlik yozing."
  },
  {
    "type": "code",
    "content": "Mijoz brauzer → HTTPS so‘rov → Server API\nServer API → ruxsat tekshiruvi → ma’lumot\nServer API → HTTPS javob → mijoz"
  },
  {
    "type": "heading",
    "content": "3. Peer-to-peer (P2P) modeli"
  },
  {
    "type": "definition",
    "content": "Peer-to-peer (P2P) arxitekturada tugunlar boshqa tugunga ham resurs berishi, ham undan resurs olishi mumkin. P2P o‘zaro fayl almashish kabi vazifada qo‘llanadi; markaziy koordinator/treker ishlatiladigan P2P tizimlar ham mavjud. Har bir tugunning xavfsizlik siyosati muhim."
  },
  {
    "type": "example",
    "content": "Ikki laboratoriya noutbuki bir-birining ulashilgan papkasiga kirsa, ular P2P turidagi xizmat ko‘rsatishi mumkin; Internet provayderi bu almashinuvning mohiyatini belgilamaydi."
  },
  {
    "type": "trap",
    "content": "P2P har doim «hech qanday server ham, nazorat ham yo‘q» degani emas; muayyan tizim aralash arxitekturaga ega bo‘lishi mumkin."
  },
  {
    "type": "task",
    "content": "3-mashq. P2P uchun ikkita foyda va ikkita xavfni sanang."
  },
  {
    "type": "heading",
    "content": "4. Fizik va mantiqiy topologiya"
  },
  {
    "type": "definition",
    "content": "Fizik topologiya kabel, port, access point va qurilmalar joylashuvini ko‘rsatadi. Mantiqiy topologiya kadr va paketlar qaysi segment, virtual LAN yoki yo‘nalishda harakatlanishini izohlaydi. Ethernet switchga fizik star ulanish ichida bir necha VLAN bilan mantiqiy ajratish mumkin."
  },
  {
    "type": "case",
    "content": "Xonadagi 12 kompyuter bitta switchga fizik yulduzda bog‘langan; ma’muriy va o‘quv segmenti VLAN siyosatida ajratilgan."
  },
  {
    "type": "trap",
    "content": "Fizik kabel sxemasi o‘zgarmasa ham mantiqiy yo‘l/qoidalar o‘zgarishi mumkin; ikki sxemani bitta deb olmang."
  },
  {
    "type": "task",
    "content": "4-mashq. Fizik va mantiqiy tarmoqni ko‘rsatuvchi ikkita sxema tuzing."
  },
  {
    "type": "heading",
    "content": "5. Yulduz (Star) topologiyasi"
  },
  {
    "type": "definition",
    "content": "Yulduz topologiyada endpointlar markaziy switch yoki hub atrofida ulanadi. Bir endpointning kabeli uzilsa boshqa kabel bilan ishlayotgan endpointlar odatda davom etishi mumkin; markaziy switch uzilsa uning barcha portlaridagi endpointlarga ta’sir qiladi. Xizmat mavjudligi yuqoridagi tarmoqlar va serverga ham bog‘liq."
  },
  {
    "type": "solved",
    "content": "12 kompyuterli sinfxonada 1 kabel shikastlandi: faqat o‘sha kompyuter ulanishi uzilishi mumkin. Switchning quvvati o‘chsa barcha 12 port ishlamaydi."
  },
  {
    "type": "trap",
    "content": "«Yulduzda bitta nuqta uzilishi butun tarmoqni to‘xtatadi» noto‘g‘ri umumlashma: qaysi nuqta — endpoint kabelimi, markazmi — muhim."
  },
  {
    "type": "task",
    "content": "5-mashq. Star topologiyaning markaziy va periferik nosozligini ajrating."
  },
  {
    "type": "table",
    "content": "| Uzilish | Star odatdagi natija |\n|---|---|\n| Bir endpoint kabeli | Odatda faqat shu endpoint |\n| Markaziy switch quvvati | Shu switch portlaridagi endpointlar |\n| Internet gateway | Lokal xizmat qolishi mumkin, tashqi kanal yo‘q |"
  },
  {
    "type": "heading",
    "content": "6. Shina (Bus) topologiyasi"
  },
  {
    "type": "definition",
    "content": "Shina topologiyada qurilmalar umumiy kommunikatsiya magistraliga ulanadi. Klassik koaksial Ethernet segmentida terminatsiya va umumiy muhitdagi kolliziyalar muhim bo‘lgan. Zamonaviy switched Ethernetni avtomatik shina deb atash texnik jihatdan noto‘g‘ri."
  },
  {
    "type": "example",
    "content": "Eski laboratoriyada bitta koaksial magistralga bir necha tugun ulangan, terminator uzilishi signal akslanishi va tarmoq muammosiga olib kelishi mumkin."
  },
  {
    "type": "trap",
    "content": "«Shina eng arzon va har qanday zamonaviy maktabga eng yaxshi» noto‘g‘ri: eski texnologiya, single segment va xatolik ehtimoli baholanadi."
  },
  {
    "type": "task",
    "content": "6-mashq. Bus topologiyaning umumiy magistralga bog‘liq ikki cheklovini yozing."
  },
  {
    "type": "heading",
    "content": "7. Halqa (Ring) topologiyasi"
  },
  {
    "type": "definition",
    "content": "Halqada tugunlar yopiq yo‘lga ulanishi mumkin; ma’lumot halqa bo‘ylab o‘tadigan mantiqiy mexanizmlar mavjud. Bir kabel uzilishi oddiy bitta halqada aloqa uzilishiga olib kelishi mumkin, ammo redundant yoki self-healing ring texnologiyalari alternativ yo‘l bilan tiklanishi mumkin. Shuning uchun mutlaq xulosa to‘g‘ri emas."
  },
  {
    "type": "case",
    "content": "Bir halqali tarmoqda kabel uzilganda aloqasi yo‘qoldi; ikkinchi mustaqil halqali konfiguratsiyada uzilishdan keyin yo‘l almashtirish ishladi."
  },
  {
    "type": "trap",
    "content": "«Ringning bitta tuguni o‘chsa barcha tarmoq doimo to‘xtaydi» ko‘p halqa va redundancy mexanizmlarini inkor qiladi."
  },
  {
    "type": "task",
    "content": "7-mashq. Oddiy ring va redundant ring uchun uzilish ssenariysini solishtiring."
  },
  {
    "type": "heading",
    "content": "8. Mesh va to‘liq mesh hisoblash"
  },
  {
    "type": "definition",
    "content": "Mesh topologiyada tugunlar o‘rtasida ko‘plab alternativ bog‘lanishlar mavjud. Full meshda N tugunning har jufti orasida to‘g‘ridan-to‘g‘ri aloqa bo‘lsa, mustaqil bog‘lanish soni N×(N−1)/2; partial meshda hamma juft bog‘lanmaydi. Kengayish narxi tez oshadi."
  },
  {
    "type": "solved",
    "content": "5 tugunli full meshda 5×4/2=10 aloqa, 6 tugunda 6×5/2=15 aloqa zarur. Redundancy yuqori, ammo port/kabel xarajati ham ko‘p."
  },
  {
    "type": "trap",
    "content": "Mesh faqat kabel orqali qurilmaydi; simsiz mesh ham bo‘lishi mumkin; «full mesh mutlaqo uzilmaydi» degani emas."
  },
  {
    "type": "task",
    "content": "8-mashq. 7 tugunli full mesh aloqalar sonini hisoblang."
  },
  {
    "type": "formula",
    "content": "Full meshda juft bog‘lanishlar soni: E = n(n−1)/2. n = 7 → 7×6/2 = 21 bog‘lanish. Bu bir juftni ikki marta sanamaslik formulasi."
  },
  {
    "type": "heading",
    "content": "9. Daraxt va iyerarxik topologiya"
  },
  {
    "type": "definition",
    "content": "Tree topologiyada kirish switchlari distribution/core kabi yuqori pog‘onalarga ulanadi. Bir necha xonani boshqarish osonlashadi, lekin yuqori pog‘ona uzilishlari pastki segmentlarni kesishi mumkin. Ulangan daraxtning rezerv kanal qo‘shilishi uni oddiy daraxtdan gibridroq qiladi."
  },
  {
    "type": "example",
    "content": "Uch qavatli maktabda har qavatda switch, ularning hammasi markaziy distribution switchga ulangan. Markaz ishdan chiqsa qavatlararo aloqa uziladi."
  },
  {
    "type": "trap",
    "content": "Iyerarxiya boshqaruvni soddalashtiradi, lekin yagona yuqori router/switch avtomatik nosozlikdan himoyalanmagan."
  },
  {
    "type": "task",
    "content": "9-mashq. Bir bino uchun uch pog‘onali switch daraxtini chizing."
  },
  {
    "type": "table",
    "content": "| Daraja | Nimalar ulanadi |\n|---|---|\n| Access | Kompyuter, printer, AP |\n| Distribution | Sinf/qavat switchlari |\n| Core yoki markaz | Tarqatish segmentlari va tarmoqlararo bog‘lanish |"
  },
  {
    "type": "heading",
    "content": "10. Gibrid topologiya va qo‘shimcha yo‘llar"
  },
  {
    "type": "definition",
    "content": "Gibrid topologiya turli star/ring/mesh/daraxt elementlarining real birikmasi. Zarur joyga zaxira uplink berish tizimni chidamliroq qiladi, ammo Layer-2 loop kabi yangi xavflarni ham keltirib chiqaradi. Spanning Tree kabi mexanizmlar muayyan Ethernet looplardan saqlanishda ishlatiladi."
  },
  {
    "type": "case",
    "content": "Har qavatda star, qavatlar markazlarida redundant bog‘lanishlar. Qo‘shimcha kabel ulanishi oldidan loopdan himoya va avariyada yo‘l tanlovi ko‘riladi."
  },
  {
    "type": "trap",
    "content": "«Ko‘proq kabel doimo yaxshi» emas: noto‘g‘ri loop broadcast storm va tarmoq ishdan chiqishiga olib kelishi mumkin."
  },
  {
    "type": "task",
    "content": "10-mashq. Hibrid tarmoqda redundancy va loop xavfini bir sxemada izohlang."
  },
  {
    "type": "table",
    "content": "| Qo‘shimcha yo‘l | Foyda | Xavf |\n|---|---|---|\n| Zaxira uplink | Uzilishdan keyin yo‘l bor | L2 loop |\n| Ikkinchi core | Markaziy nuqta kamroq | Konfiguratsiya murakkab |\n| Ikkinchi operator | WAN redundancy | Xarajat |"
  },
  {
    "type": "heading",
    "content": "11. Qaror mezoni: xarajat, fault domain va o‘sish"
  },
  {
    "type": "definition",
    "content": "Topologiya tanlashda qurilma soni, kabel yotqizish masofasi, texnik xizmat, quvvat, markaziy nosozlik ehtimoli va qimmat servislar qamrovi hisobga olinadi. Muhim xodimlar serveri uchun zaxiralash va nosozlikni kuzatish alohida ko‘riladi. Ayni holatga «eng yaxshi» topologiya muhandislik talablariga bog‘liq."
  },
  {
    "type": "solved",
    "content": "8 sinfxonali maktabga star-of-stars sxemasi ma’qul bo‘lishi mumkin; Internet gateway uchun zaxira operator va UPS qo‘shish ham kerak bo‘lishi mumkin."
  },
  {
    "type": "trap",
    "content": "Topologiya nomining o‘zi tarmoq xavfsizligi, latency va maksimal tezlik haqida yakuniy dalil bermaydi."
  },
  {
    "type": "task",
    "content": "11-mashq. Bir variantni tanlash uchun 4 iqtisodiy va 3 texnik mezon jadvalini tuzing."
  },
  {
    "type": "heading",
    "content": "12. Loyiha: maktab tarmog‘ini chizing va sinang"
  },
  {
    "type": "definition",
    "content": "Topologiya loyihasi endpoint, uplink, AP, server, Internet gateway va muhim fault domainlarni aniq ko‘rsatishi kerak. Har asosiy nosozlik uchun qaysi sinf xizmatdan ayrilishini oldindan ayting. Dizaynni kontent/auditoriya va ma’lumotlarning kirish siyosati bilan tekshiring."
  },
  {
    "type": "example",
    "content": "10 sinfxonali maktabning birinchi qavatini yulduz, qavatlararo bog‘lanishni daraxt asosida chizing. Markaziy switch yo‘qolsa ta’sir ko‘lami va zaxira variantni yozing."
  },
  {
    "type": "trap",
    "content": "Maktabning chiroyli diagrammasi avtomatik ishlaydigan konfiguratsiya emas; test protokoli va vakolatli montaj zarur."
  },
  {
    "type": "task",
    "content": "12-mashq. Topologiya sxemasini 5 ballik xavf, zaxira, kengayish, rol, huquq mezoni bilan baholang."
  },
  {
    "type": "list",
    "content": "1. Xonalarni va endpointlarni belgilang.\n2. Har xonaga access switchni joylashtiring.\n3. Uplinklarni chizing.\n4. Server/gatewayni alohida belgilang.\n5. Har uzilishda qaysi xizmatlar to‘xtashini qayd eting."
  },
  {
    "type": "summary",
    "content": "Client–server va P2P resurs rollari haqidagi arxitektura, star/bus/ring/tree/mesh esa bog‘lanish topologiyalari. Fizik va mantiqiy topologiyani farqlang. Star endpoint kabeli uzilganda markaz qolsa boshqa qurilmalar ishlashi mumkin; markaz ishdan chiqsa uning segmenti to‘xtaydi. Meshda n(n−1)/2, 7 tugunda 21 link. Redundant ring va gibrid tarmoq oddiy uzilish stereotipidan murakkabroq."
  },
  {
    "type": "answers",
    "content": "1) rol vs aloqa; 2) server so‘rovga javob; 3) P2P ikki tomonlama; 4) fizik joylashuv/mantiqiy VLAN; 5) endpoint/markaz farqi; 6) eski shared cable; 7) redundancy turi; 8) 7×6/2=21; 9) access/distribution/core; 10) STP va loop; 11) risk, xarajat, qurilmalar; 12) dizayn/fault domain asoslangan sxema. Loyihalarda boshqa asosli variantlar qabul qilinadi."
  },
  {
    "type": "source",
    "content": "Cambridge+ 9-sinf «Kompyuter tarmoqlari va ulardan foydalanish», 4-bob ~41–54-bet (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf «Tarmoqlar», 13-bob ~221-bet (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Cisco «What is network topology?» physical vs logical and modern hybrid networks (https://www.cisco.com/site/us/en/learn/topics/networking/what-is-network-topology.html). Original didaktik misollar; fizik PDF sahifalar/rasmlar 1:1 to‘liq tasdiqlanmagan."
  }
]

# TASK-308 — M12.01–M12.04: tarmoq asoslari, qurilmalar, topologiya va protokollar

**Sana:** 2026-10-20. **Holat:** source-guided offline BookReader, deployment yo‘q. Fizik darslik sahifalari/rasmlari to‘liq 1:1 ko‘chirilgani da’vo qilinmaydi.

## Muammo va yangi natija

M12.01–M12.04 boshlang‘ich nazariyalari har biri atigi to‘rtta blok; Cambridge+ qo‘shimcha manbaviy 5 blok mavjud bo‘lsa-da, o‘qish oqimi qisqa edi. Eski misollarda universal bo‘lmagan taxminlar bor edi: PAN/LAN/MAN masofalari qat’iy raqam, WAN doim sekin, VPN doim mutlaq xavfsiz, fiber ko‘pi bilan 100 Gbit/s, TCP 100% kafolat, UDP doim tez, star yoki ringda bitta uzilish avtomatik butun tarmoqni o‘chiradi.

| Dars | Yangi kitob bloki | Bo‘lim | Muhim yangi bilim |
|---|---:|---:|---|
| M12.01 Tarmoq tushunchasi va turlari | 71 | 12 | PAN/LAN/WLAN/MAN/WAN, Internet/WWW, VPN, 100 Mbit/s va 12.5 MB/s |
| M12.02 Tarmoq qurilmalari/aloqa | 72 | 12 | MAC/NIC, switch flood vs hub, router, DSL/ONT, twisted-pair/coax/fiber, firewall, diagnostika |
| M12.03 Topologiya va arxitektura | 72 | 12 | Client–server/P2P; physical/logical, star/bus/ring/tree/mesh/hybrid, n(n−1)/2 va failure domain |
| M12.04 Tarmoq ishlash prinsipi | 75 | 12 | Qatlamlar, TCP/UDP, IPv4, DNS, kapsullash, HTTPS va HTTP/3 + QUIC, latency/packet loss |
| **Jami** | **290** | **48** | Har bo‘lim: izoh, yechilgan vaziyat, xato talqin va mustaqil mashq |

Har bir dars bitta uzluksiz source-first BookReader bobiga aylantirildi. Oldingi M12_NETWORK_TEXTBOOK_ADDITIONS darslikdan tekshirilgan manba izlari va 5 blokli ilova sifatida oxirida saqlanadi. Avvalgi qisqa asosiy seed qayta takror ko‘rsatilmaydi. Original 12 statik savolning ID, 4 variantlari, correctIndex va Y1/Y2 kognitiv darajalari o‘zgarmaydi, faqat oltita izoh/matn ilmiy aniqlashtiriladi. Y2 legacy format bilan Y1 UI format farqi mavjud bo‘lgani uchun tekshiruv displayedCognitiveLevel orqali o‘tkaziladi.

## Muhim fakt aniqlashtirishlar

1. LAN/WAN va tezlik: qamrov, boshqaruv, kanal sig‘imi, throughput va latency — boshqa tushunchalar.
2. VPN shifrlangan tunnelni hosil qilishi mumkin; konfiguratsiya, ishonchli xizmat, MFA va yakuniy servis siyosati talab etiladi.
3. Switch odatda MAC jadvaliga qarab kadr yuboradi, unknown unicast/broadcast flood bo‘lishi mumkin; hub fizik signalni takrorlaydi.
4. Fiber 100 Gbit/s bilan universal cheklanmaydi; standard/transceiver/tarmoq qurilmasi asosiy omil.
5. Yulduzda endpoint kabeli uzilishi bilan markaziy switch quvvati uzilishi ikki boshqa hodisa. Ring redundant bo‘lishi mumkin. Full mesh linklar soni n(n−1)/2, 7 tugun uchun 21.
6. TCP retransmit/ACK va tartibni ta’minlashga harakat qiladi, ammo tarmoq uzilganida muvaffaqiyatni 100% kafolatlamaydi. UDP transport retransmit qilmaydi, ammo UDP ustidagi QUIC ishonchli boshqaruvni amalga oshirishi mumkin. HTTP/3 UDP/QUICdan foydalanishi mumkin.

## Manbalar va qamrov cheklovi

- [Cambridge+ ICT 9-sinf, 4-bob, 41–54-betlar](https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view) — tarmoqlar, router, NIC, modem, aloqa turlari.
- [Cambridge+ ICT 10–11-sinf, 6- va 13-bob, 78- va 221-betdan](https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view) — Internet, kommunikatsiya, tarmoq nazariyasi, paket almashish.
- [Cisco network topology](https://www.cisco.com/site/us/en/learn/topics/networking/what-is-network-topology.html) — physical va logical topologiya farqi.
- [Cloudflare network layers](https://developers.cloudflare.com/fundamentals/reference/network-layers/) va [What is the network layer?](https://www.cloudflare.com/learning/network-layer/what-is-the-network-layer/).
- [RFC 9293 — Transmission Control Protocol (TCP)](https://www.rfc-editor.org/rfc/rfc9293).

Matnlar Cambridge va texnik standartlar asosida original o‘zbekcha pedagogik qayta bayon; fizik PDFdagi barcha jadval/grafika, live authenticated reader UX, published Supabase savollar 1:1 audit qilingan deb hisoblanmaydi.

## Avtomatik regressiya va merge chegarasi

- src/tests/TASK308M12NetworkCanonicalBooks.test.ts: 4 kitob, 12 bo‘lim va exercise, appendix/splitAdaptiveSections order, static ID/correctIndex/Y level, asosiy fakt va M12.05 CIDR himoyasi.
- M12.05–M12.09 hamda boshqa modul nazariyalari va API, DB, secrets, published mock questions o‘zgarmaydi.
- GitHub CI frontend lint/typecheck/unit/build/Playwright, backend, database, quality to‘liq yashil bo‘lgach merge. Deploy qilinmaydi.

Keyingi reja: M12.06–M12.09 Internet, email, cloud, IoT/AR/VR darslarini xuddi shunday chuqurlashtirish; 528 test bazasi manba auditi kabi mustaqil ishlarning faktlarini chalkashtirmaslik.

# TASK-244 — M01 nazariyasini 2026-yilgi attestatsiya spetsifikatsiyasiga solishtirish

**Tekshirilgan birlamchi hujjat:** Google Drive `Informatika Testlar spesifikatsiyasi.pdf` (ID `1jJstcqgFXwTJKuH9bkRIpvATEsjM2UnQ`), **10 PDF sahifa**, **306 871 bayt**, SHA256 `2c6f372b1bb3e8657d42ae93bfe40701cc4a67faeb48119998adcd58e816722c`. Muqova: Maktabgacha va maktab taʼlimi vazirligi huzuridagi Pedagogik mahorat va xalqaro baholash ilmiy-amaliy markazi, **Toshkent — 2026**. Manba Drive’dagi ayni fayl; bundan yangiroq rasmiy hujjat yo‘qligi mustaqil tasdiqlanmagan.

**Sinov ko‘lami (PDF 2–3, 6–8):** 35 ta mutaxassislik, 5 ta kasb standarti, 10 ta pedagogik mahorat — jami **50 topshiriq**, **120 daqiqa**, har to‘g‘ri javob **2 ball**, jami 100 ball. Topshiriq turlari **Y1**, **Y2**, **Y3**. **M01 kategoriyasi: 1–3-savollar, 3 ta**. Bu M01ning umumiy sinovdagi **6% savol ulushi**; 59 ta manbali qo‘shimcha 59 ta rasmiy savol degani emas.

## 2026 spetsifikatsiyasining M01 qismidagi yetti konstrukt

| PDF 3 dagi rasmiy konstrukt | Platformadagi kanonik joy | Tekshiruv xulosasi |
|---|---|---|
| Informatika, axborot, maʼlumot va bilim tushunchalarini bilish va farqlash | M01.02; M01.03 | Farqlar, kontekst, Data→Information→Knowledge misollari mavjud; darsliklardagi qo‘shimcha izohlar kiritilgan |
| Axborot turlari va manbalarini bilish | M01.03; M01.04 | Axborot shakli, axborot sifati, bevosita/bilvosita va statik/dinamik manba farqlari bor |
| Turli ko‘rinishdagi axborotlarni kodlay olish | M01.05; M01.06 | Belgi/alifbo/kod, Unicode/UTF, rastr rang chuqurligi, audio namunalash, video bitrate va RLE mavjud |
| Axborot o‘lchov birliklarini bilish va hisoblashda qo‘llay olish | M01.05; M01.07; M01.09 | Bit/bayt, SI va IEC (kB/KiB, MB/MiB), bir-biriga aylantirish va formulalar mavjud |
| Axborot hajmi va axborot uzatish tezligini hisoblash | M01.05; M01.07; M01.08; M01.09 | Matn/rastr/audio/video va kanal bitrate/time masalalari; kitobdagi aniq hisoblar bilan boyitildi |
| Raqamli muhitda axloq va mualliflik huquqi | M01.04 | Netiket, manbaga havola, litsenziya, rozilik, raqamli iz, email va xavfsizlik meʼyorlari mavjud |
| Axborotni saralash va xulosa chiqarish | M01.04; M01.08 | Saralash/filtrlash/guruhlash, manba solishtirish, dalil va xulosa chegarasini ajratish mavjud |

**Mazmuniy audit natijasi:** 7/7 rasmiy **konstrukt uchun tegishli M01 nazariyasi joyi aniqlangan**. Bu **savol banki barcha konstruktlar va Y1/Y2/Y3 shakllarini muvozanatli qamragan** yoki o‘quvchi real UI to‘liq ishlaydi degan avtomatik tasdiq emas. Savollar bo‘yicha alohida test-bank mapping va autentifikatsiyali UI testi release-gate bo‘lib qoladi.

## Kategoriya chegaralari — spetsifikatsiyani buzmaslik

- **M01 — 3 ta:** umumiy axborot, kodlash, hajm/tezlik, manba, raqamli axloq.
- **Q4–10 (7 ta):** OT, kompyuter va ofis dasturlari — asosiy mavzu M02/M03, M01dan to‘liq dublikat olinmaydi.
- **Q11–18 (8 ta):** mantiq, sanoq tizimlari va algoritmlash — M04/M05/M06; 9-sinf mantig‘ini M01ga ko‘chirish noto‘g‘ri.
- **Q19–26 (8 ta):** Scratch/LOGO, Python/JavaScript, Access/SQL — boshqa maxsus modullar.
- **Q27–31 (5 ta):** grafik muharrirlari va HTML/CSS — M10/M11; M01da faqat raqamli tasvirning **kodlash asoslari**.
- **Q32–33 (2 ta):** tarmoqlar, IP va internet orqali qidirish — asosiy texnik modul M12; M01.04da axborot savodxonligiga tegishli kichik bog‘lanishlar.
- **Q34–35 (2 ta):** axborot xavfsizligi/raqamli xizmatlar — asosiy texnik modul M13; M01da raqamli madaniyatning xavfsiz foydalanish odatlari.
- **Q36–40 (5 ta):** kasb standarti; **Q41–50 (10 ta):** pedagogik mahorat. M01 fan nazariyasi ularni o‘rnini bosa olmaydi.

## Nashrlar bo‘yicha muhim ochiq nomuvofiqlik

**Spetsifikatsiyaning PDF 9-sahifasi** Cambridge University Press mualliflari Ellis/Lawrey/Dickinson, Wright/Taylor va Long/Lawrey/Ellis bo‘yicha 5–9 hamda 10–11-sinf kitoblarini **2023 nashr** sifatida ro‘yxatlaydi. Drive’dagi taqqoslangan 6 ta Cambridge+ PDF esa titul va mualliflik sahifalarida **2021 o‘zbek moslashtirilgan nashr** deb yozilgan. Muallif va asar liniyasi mos, lekin **nashrlar bir xil ekanini isbotlovchi 2023 PDF versiya yo‘q**. Demak 13/13 audit mavjud manbalarga tegishli; 2023 nashrning har bir sahifasi bilan 1:1 moslik tasdiqlanmagan.

7 ta 2020/2021-yilgi mahalliy ICT kitobi spetsifikatsiyaning PDF 9-sahifasidagi tegishli sinf/yillar bilan mos.

## Keyingi release-gate

1. CI: lint, TypeScript, unit, generated content, build, Playwright E2E va backend/database.
2. M01ning 12 ta topici o‘quvchi sifatida kirib ko‘riladi: mobil/desktop; formulalar, jadvallar, manba izlari va savollar to‘liq ko‘rinadi.
3. M01 test banki Y1/Y2/Y3 hamda 7 konstrukt bo‘yicha alohida qiyoslanadi; 2023 Cambridge+ nashri bo‘lsa, yangilangan sahifalar bilan diff qilinadi.
4. Faqat yozma foydalanuvchi tasdig‘i bo‘lsa merge/deploy mumkin. Hozircha **NO MERGE / NO DEPLOY**.

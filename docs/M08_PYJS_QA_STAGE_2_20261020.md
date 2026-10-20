# M08 — Python va JavaScript: attestatsiya savollari sifat nazorati, II bosqich

**Tekshiruv kuni:** 2026-10-20  
**Loyiha:** `sarvar9417/attestatsiya`, M08 / S4.CODE  
**Material bazasi:** avval tayyorlangan 420 savolli xususiy JSON (252 Y1, 84 Y2, 84 Y3); Drive demo va tushgan savollar; 2026 spetsifikatsiyasi; ICT 9, ICT 10, Cambridge 10–11 darsliklari.

## I. Yakunlangan, qayta ijro etilgan ishlar

| Mezoni | Natija | Chegara |
|---|---:|---|
| Oldingi `verified:false` savollar uchun alohida triage | **189 ta** | 91 Y1, 84 Y2, 14 Y3. Ular savolma-savol AI tekshiruv reyestrida. |
| Mahalliy darslik PDF bo‘yicha sahifa/atama nomzodlari | **180/189 ta** | Matnda *kalit so‘z* uchragan, savol javobi to‘liq tasdiqlandi degani **emas**. |
| Atama bo‘yicha bironta to‘g‘ridan-to‘g‘ri sahifa mosligi topilmagan | **9 ta** | Texnik qoidaga rasmiy Python/MDN havolalari berildi; maktab darsligiga sun'iy sahifa yozilmadi. |
| Kodsiz Y1 savollarga alohida runtime mini-test | **27/27 ta** | Yordamchi sintetik kod; dastlabki Y1 javobi bilan bir xil qoidani tekshiradi. |
| Y3 ning 70 ta to‘liq kodini qayta ishga tushirish | **70/70 ta** | Kodning haqiqiy to‘rtta chiqarishi, tartibi va javob tartibi mos. |
| 70 Y2 izohi bo‘yicha shaxsiylashtirilgan tahrir loyihasi | **70/70 ta** | To‘rtta haqiqiy juftlik + maxsus qoida yozilgan; hali published emas. |
| 70 Y3 yechim/kod izi tahrir loyihasi | **70/70 ta** | To‘rtta haqiqiy chiqish va semantik mexanizm ko‘rsatilgan; hali published emas. |
| Y1 faqat katta-kichik harf bilan farqlanuvchi distractorlar | **19 ta** | Hammasi ID+variantlar bilan reyestrda; avtomatik «noto‘g‘ri» deb hisoblanmadi. |
| Ustuvor mazmuniy xatarlar reyestri | **10 ta** | 189 savolning bir qismi; har biriga tavsiya bor. |
| Yangi, sinovdan o‘tkazilgan revision savoli nomzodlari | **11 ta** | 7 Y2 va 4 Y3. Ulardan bittasi (`J07-R2-04`) *ixtiyoriy* yaxshilash, isbotlangan xato emas. |

**Ortiqcha da’vo qilinmaydi:** 180 ta kalit-so‘z mosligi `source-reviewed=true` emas, 189 ta savolning hammasi inson eksperti tomonidan tekshirildi degani emas. Zamonaviy til hujjatlari darslikdagi bobning o‘rnini bosa olmaydi; spetsifikatsiyadagi konstrukt ham alohida tekshiriladi.

## II. Asosiy mavzu va manba xaritasi (PDF sahifa, fizik bet raqami)

- `ICT 9_sinf-2020(1).pdf`: Python sintaksis/identifikator/turlar — taxminan **53–62**; amallar/satrlar — **63–72**; shartlar — **73–82**; sikllar — **83–91**; funksiya va lokal o‘zgaruvchi — **92–100**.
- `ICT 10_sinf-2021(1).pdf`: Python ro‘yxatlar va metodlari — **111–116** (keyingi sahifalarda tuple/dict/set materiallari ham bor).
- `10-11-sinf informatika (Cambridge +)(1).pdf`: **19-bob “Veb uchun dasturlash” PDF 316-sahifada boshlanadi**, JavaScript sintaksis, boshqaruv, massiv/funksiyalar 316–329 oralig‘ida. Oldingi `308–318` umumiy oralig‘i to‘liq va aniq manba emas: PDF 308–315 asosan mail merge bo‘limiga tegishli.
- Savol IDlari bo‘yicha 1–3 ta mumkin bo‘lgan bet, faqat kitobdan topilgan haqiqiy qisqa parcha va kalit so‘zlar: `189_source_semantic_evidence_triage.json`.

**Normativ tashqi manbalar:** Python tilining rasmiy `docs.python.org` ko‘rsatmalari hamda JavaScript `developer.mozilla.org` (MDN). Ushbu yordamchi qoidalar darslikda isbotlangan deb belgilanmaydi.

## III. Aniqlangan muammolar va nashrdagi amaldagi holat

| Savol ID | Nuqson / tahrir sababi | Tavsiya |
|---|---|---|
| `P02-R2-05` | Ikkita ifoda bir xil `4` qiymatini beradi | Asl `archived`; qayta nashr qilmang, takomillashtirilgan Y2 4 noyob natijali |
| `P06-R2-05` | `len(a)` va `len(a[0])` bir xil `2`, tavsiflar mazmun jihatidan aralashishi mumkin | Asl `archived`; 4 noyob chiqishli tuzatish |
| `J02-R2-01` | `Number("12")` va `parseInt("12px")` ikkisi ham JS Number 12; “butun son” alohida primitive turi emas | Published; yangi revision zarur |
| `J05-R2-01` va `J05-018` | `...args` rest/spread kontekstsiz yoki yetarlicha aniq emas | Published; sintaktik to‘liq deklaratsiya taklif qilindi |
| `J04-R2-05` | `for` boshlang‘ich/shart/qadam fragmentlari mustaqil JS dasturi emas | Published; to‘liq sikl ifodasi taklif qilindi |
| `P03-023` va `J03-023` | `else`/`else if` har doim bajariladigan qadam sifatida majburiy tartiblash noaniq | Published; haqiqiy 4 chiqishli shartli kod taklifi |
| `P06-023` va `J06-019` | Aniq dastursiz jarayon tartibi yagona bo‘lmasligi mumkin | Published; konkret bajariladigan kod taklifi |
| `J07-R2-04` | Ikki natija `true` bo‘lsa ham, tavsifda sababi alohida ko‘rsatilgan | **Majburiy nuqson emas**; faqat ixtiyoriy aniqlashtirish |

11 ta yangi savol matni, option va javoblar **faqat shaxsiy paketda**. Published savollar joyida tahrirlanmadi. Avvalgi urinishlarni saqlash va immutable revision qoidasiga rioya qilindi.

## IV. Testlarning attestatsiya uslubiga mosligi

- Drivedagi `Informatika Demo testi .pdf` 11-PDF sahifa 22-savolda JS `push/pop`, indeks yangilash va sikl birga tekshiriladi; 16-PDF sahifa 31-savolda Python funksiyalari va ketma-ketlik xossasi.
- `13.04.2026 Attetasiya Tushgan savollar.pdf` 11–12-PDF sahifalardagi JS misollarida satrdagi belgilar va massiv elementlarini o‘zgartirib, natijani topish zarur. Ushbu yig‘ma davlat tomonidan aynan original savol ekani mustaqil tasdiqlanmagan.
- 70 yangi Y3 orasida **40 xil to‘rtta natijali imzo** bor, shundan **24 imzo** kamida ikki savolda takrorlangan. Python/JS orasidagi to‘liq o‘xshash kodni o‘quv maqsadiga ko‘ra alohida tanlash mumkin, ammo attestatsiya simulyatsiyasining xilma-xilligi uchun muvozanat kerak.
- Bankdagi `252 Y1/84 Y2/84 Y3` — o‘quv banki uchun tanlangan nisbat, rasmiy 50 savollik test uchun majburiy Y1/Y2/Y3 foizi emas. S4.CODE spetsifikatsiyada **3 savol**.

## V. Productionga ta’sir va qolgan cheklovlar

- 2026-10-20 read-only ma’lumotiga ko‘ra eski `pyjs-2026-v2:*` bankda **386 published, 19 review, 155 archived**. Ulardan 2 ta muammoli Y2 allaqachon arxivda, 9 ta ustuvor ID esa published edi. Production holati parallel ishlar sabab tez o‘zgarishi mumkin.
- Ilgari 14 ta demo-uslubidagi Y1 savol alohida `draft` sifatida kiritilgan. Ushbu II bosqichda **original published savollar, learner urinishlari va javob kalitlari tahrirlanmadi**.
- Avval 5 ta Y2 `draft` importi xavfsizlik nazoratida bloklangan. Ushbu paketdagi yangi savol revision nomzodlarini bazaga yozilgan yoki avtomatik nashr qilingan deb ko‘rsatmaymiz.
- Hali **yopilmagan sifat darvozalari:** har bir savolning aniq darslik manba qoidasi va sahifasi bo‘yicha odam tekshiruvi; 70 Y2/Y3 izohning editorial tasdig‘i va versiyalash; 19 case-only variantlarning uslubiy ekspertizasi; preview brauzer E2E/mobil kod ko‘rinishi; 50 savollik mock feasibility; canonical release/merge approval.

## VI. Xususiy paket tarkibi

- `189_source_semantic_evidence_triage.json`: 189 ID, nomzod sahifalar, haqiqiy tekst parcha, official docs URL va ekspert qarori darajalari.
- `27_Y1_literal_technical_checks.json`: 27 dasturlash muhitida tekshirilgan qoida.
- `70_Y3_interpreter_retest.json`: 70 real kodning stdout/ordering isboti.
- `70_Y2_individual_explanation_proposals.json`: to‘rt moslikli har bir Y2 izohi.
- `70_Y3_output_trace_proposals.json`: Y3 izi, qayta yozilgan stem va izoh.
- `11_new_question_revision_candidates.json`: mustaqil original revision takliflari, private javob kalitlari.
- `19_case_distractor_editorial_review.json`: harf registri bo‘yicha 19 savolning tarkibiy bahosi.
- `Y3_repeated_output_signatures.json`: takror javob imzolari.
- `question_level_advanced_topic_check.json`: maktab kitobida bevosita tasdiqlanmagan, rasmiy JS/Python hujjati yoki spetsifikatsiya check talab qiladigan nomzod mavzular.
- `QA_STATISTICS.json` va qayta bajariladigan skriptlar.

**II bosqich maqomi: AI asosidagi manba nomzodlash + kod/format regressiyasi + xavfsiz editorial revision namunalari bajarildi. To‘liq inson ekspertizasi va nashr hali bajarilmagan.**
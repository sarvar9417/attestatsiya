# TASK-209 — MS Access V2: AI manba-auditi, mantiqiy va vizual aniqlik

**2026-10-20. Holat:** mustaqil AI-manba/semantika tekshiruvi davomi; `review` bosqichi, inson imzosi o‘rniga ishlatilmaydi.

## Tekshirilgan asoslar
- 2026 `Informatika Testlar spesifikatsiyasi.pdf`, 5-bet: S4.DB 5 baholanadigan ko‘nikma; ma’lumotlar bazasi uchun 2 rasmiy savol.
- `ICT 11_sinf-2021(1).pdf`, 15–16-betlar (maydon/jadval), 23–35-betlar (aloqa/PK/FK), 44–52-betlar (Query Design, mezonlar), 59–64-betlar (import/export).
- Microsoft rasmiy Access hujjatlari:
  - [Multiple-field AND and Or row](https://support.microsoft.com/en-us/access/create-a-simple-select-query)
  - [AutoNumber–Long Integer PK/FK compatibility](https://support.microsoft.com/en-us/access/introduction-to-data-types-and-field-properties)
  - [Access TOP includes boundary ties](https://support.microsoft.com/en-gb/access/all-distinct-distinctrow-top-predicates)
  - [Count(field) excludes Null; Count(*) includes](https://support.microsoft.com/en-us/access/functions/count-function)
  - [ANSI-89 vs ANSI-92 wildcards](https://learn.microsoft.com/en-us/office/client-developer/access/desktop-database-reference/comparison-of-microsoft-access-sql-and-ansi-sql)
  - [Date literals and #...#](https://support.microsoft.com/en-us/access/learn-to-build-an-expression)
- `Informatika Kuzgi demo testlari.docx` vizual Access Query Design + jadval natija savoli: savol shakli uchun, ko‘chirish uchun emas.

## Ushbu navbatda amalda bazada tuzatilgan savollar

| Savol kodi | Real muammo | Tuzatish (savol va kalit IDsi saqlanadi) |
|---|---|---|
| `DB-03-019` | Ota jadvalning 2 yozuvi va bola jadvalning 3 FKsi bir qatorda juftlab tasvirlangan, noto‘g‘ri bog‘lanish taassuroti | Alohida `Sinflar` PK jadvali va `Oquvchilar` FK jadvali; mustaqil satrlar |
| `DB-04-030` | 4 yozuv bitta satrning 4 ustuni sifatida ko‘rsatilgan | 4 ta alohida `Sinf` yozuvi, ID bilan |
| `DB-05-026` | LEFT JOINning ikki manbasi haqiqiy jadvalsiz uchta matn bo‘lagi sifatida berilgan | A jadvali (3 PK) va B jadvali (5 FK) aniq alohida ko‘rsatilgan |
| `DB-06-019` | Ota Kitoblar.ID va bola Berishlar.KitobID bir- biriga mos bo‘lmagan teng satrlarda ko‘rsatilgan | Alohida `Kitoblar` va `Berishlar` jadvallari, biri uchta kitob, biri uchta berish |
| `DB-01-019` | Matnda 8 berish, ko‘rgazmada 3 satr bor | Uch satr sakkiztadan namuna ekanini ochiq yozish |
| `DB-06-027` | Sinf, fan, ball jadvali noto‘g‘ri semantik `Sotuv` nomi bilan berilgan | `Baholar` nomiga moslashtirish |
| `DBN-Y2-043` | `Ball>90` uchun «91 va undan yuqori» noaniq/noto‘g‘ri, sonlar butun bilan cheklanmagan | 90.5 ham mosligi, `BETWEEN 80 AND 90` esa butun oraliqni qamrashi aniq yozildi |
| `DB-05-027` | Access `TOP 1` teng qiymatlar bilan ko‘proq qator qaytarishi «ko‘pincha» deb noaniq yozilgan | Aniq tartiblash, teng qiymat qoidasi va savolda «aniq nechta» ifodasi |
| `DB-04-027` | Sana literalining ISO qabul qilinishi, kun yakuni va vaqt chegarasi noaniq | MS Access sanalari `#1/1/2026#` formatida, dekabr emas yanvar misoli; yuqori chegarani keyingi oyning birinchi kuni bilan eksklyuziv qurish |

**Muhim:** `source_visual_review_required` flaglari yashirilmagan/o‘chirilmagan. Manba sahifasi va tasvir/semantika to‘liq tasdiqlanmaguncha QA ma’qullandi deb hisoblanmaydi.

## Verifikatsiya
- `review` bank: **296** (Y1: **176**, Y2: **60**, Y3: **60**).
- 12 eski noto‘g‘ri qog‘oz-formatlashtirilgan Y2/Y3 nomzodlari `archived`.
- Hozirgi konstrukt qamrovi: `S4.DB.01` 96, `.02` 49, `.03` 49, `.04` 52, `.05` 50.
- Test kalitlari yetishmasligi: 0; takroriy source ID: 0; Y1/Y2/Y3 texnik format buzilishi: 0.
- `review` savollardagi asl vizual tekshiruv flaglari: **21**; spetsifikatsiyaga alohida muvofiqlik talab qiladigan darslikdagi qo‘shimcha savollar: **9**.
- Mustaqil inson signoffi: **0**; ushbu hisobot **AI ko‘rigi** va uning dalillaridir.
- Savollar uchun source level aniq sahifa mapping hali barcha 296 uchun to‘liq emas, Access.exe/.accdb native runtime sinovi ham bajarmagan. Bu ikki bosqichni bajarilmagan holda «to‘liq tasdiqlandi» deb ko‘rsatmaslik kerak.

## Navajotdagi ish usuli
1. Har bir savolning qayta-qayta o‘rganiladigan bilimini ajratib, 5 konstruktga mosligini tekshirish.
2. Yuqori murakkablikdagi 49 qisqa izoh hamda 7 juft yaqin savolni boshidan metodik tekshirish.
3. QBE, SQL, MS Access dialekti, `NULL`, `TOP`, `DATE` misollarini rasmiy Microsoft hujjati bilan solishtirish.
4. Skan/kitob rasmlari bilan vizual savollarni manbaviy tekshirish va noto‘g‘ri grafika/ustunlarni versiya bilan yangilash.
5. Mustaqil tasdiq talab etadigan inson imzosini AI nomiga yozmasdan, ekspert uchun dalillangan QA reyestrini to‘ldirish.
6. `published` qilinmagan yangi savollar o‘quvchilarga ochilmaydi.

Private test matnlari, individual javob kalitlari va foydalanuvchi ma’lumotlari public GitHub’ga chiqarilmagan.

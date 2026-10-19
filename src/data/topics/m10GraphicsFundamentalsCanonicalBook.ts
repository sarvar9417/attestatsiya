/** TASK-297: graphics fundamentals and formats, source-guided original chapter. */
import type { TheoryBlock } from '../topicContent'
export const M10_01_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "Rastr/vektor tuzilishini, piksel va PPI/DPI farqini, RGB–CMYK–HSV rang modellarini, siqish va formatlarni hamda tasvirni eksport qilishdagi xavflarni izohlash; hisob va maqsadli tasvir tanlashni bajarish."
  },
  {
    "type": "intro",
    "content": "Kompyuter grafikasi faqat rasm chizish emas: tasvirni qaysi shaklda kodlash, qaysi qurilmada ko‘rsatish va qanday qayta ishlashni oldindan tanlashdir. Bir xil rasm ekran, bosma va vebda boshqa natija berishi mumkin. Ushbu bob aniq hisob, taqqoslash va topshiriqlar bilan bosqichma-bosqich yuradi."
  },
  {
    "type": "table",
    "content": "| Voqea | Rastr | Vektor |\n|---|---|---|\n| Asos | Piksel | Nuqta, yo‘l, geometrik shakl |\n| Odatdagi obyekt | Foto, tekstura | Logo, piktogramma |\n| Kattalashtirish | Mavjud detal cheklangan | Geometriya qayta hisoblanadi |\n| Ishchi format | PSD, rastr loyihasi | SVG, AI va boshqalar |\n| Eksport | JPEG/PNG | SVG/PDF yoki rastr eksport |"
  },
  {
    "type": "formula",
    "content": "Siqilmagan sof rang qiymati (bayt) = eni(piksel) × bo‘yi(piksel) × rang chuqurligi(bit/piksel) ÷ 8. Buni JPEG/PNG kabi haqiqiy fayl hajmi deb olmang."
  },
  {
    "type": "heading",
    "content": "1. Rastr va vektor tasvirning maqsadi"
  },
  {
    "type": "definition",
    "content": "Rastr tasvir piksellar panjarasidan iborat; har piksel rang qiymatini ifodalaydi. Vektor tasvir chiziq, egri chiziq va shakllarni koordinatalar hamda matematik tasvirlar orqali saqlaydi. Foto odatda rastr, logotip va geometrik ikon esa vektorda qulay."
  },
  {
    "type": "case",
    "content": "800×600 o‘lchamli foto 480 000 pikselga ega. Uni 4 marta kengaytirish mavjud pikselni kattalashtiradi yoki interpolatsiya qiladi, avtomatik yangi haqiqiy detallar bermaydi."
  },
  {
    "type": "trap",
    "content": "«Vektor istalgan holatda sifatini yo‘qotmaydi» iborasi noto‘liq: ekranga yoki chopga chiqishda vektor ham oxir-oqibat piksellarga rastrlanadi va juda nozik elementlar yo‘qolishi mumkin."
  },
  {
    "type": "task",
    "content": "1-mashq. Fotografiya, logotip, xarita va abstrakt fon uchun mos tur va sababini tanlang."
  },
  {
    "type": "heading",
    "content": "2. Tasvir o‘lchami, piksel va aniqlik"
  },
  {
    "type": "definition",
    "content": "Piksel o‘lchami — rasm eni va bo‘yi (masalan, 1920×1080). PPI chop etishda har dyuymga joylanadigan tasvir piksellarini anglatadi; monitorning haqiqiy aniqligi va faylning PPI metadata qiymati bir xil tushuncha emas. Sifatni baholashda ko‘rish masofasi va ekran/chop hajmi ham muhim."
  },
  {
    "type": "example",
    "content": "1200×900 piksel surat 300 PPI bilan taxminan 4×3 dyuym chop etiladi; ayni piksel sonini 150 PPI qilib belgilasangiz 8×6 dyuym bo‘ladi, original yangi tafsilot hosil bo‘lmaydi."
  },
  {
    "type": "trap",
    "content": "DPI printer nuqtalariga, PPI tasvir piksellariga nisbatan ishlatiladi; amalda aralash ishlatilsa ham texnik jihatdan farqlanadi."
  },
  {
    "type": "task",
    "content": "2-mashq. 1600×1200 rasmning jami piksel sonini va 200 PPI chop o‘lchamini toping."
  },
  {
    "type": "heading",
    "content": "3. Rang chuqurligi va xom xotira"
  },
  {
    "type": "definition",
    "content": "Rang chuqurligi — piksel rangini kodlash uchun ishlatiladigan bit miqdori. 24-bit RGB odatda qizil, yashil va ko‘k uchun 8 bitdan; 32-bit RGBA shu uch kanal va 8-bit alfa uchun qo‘llanadi. Bu qiymatlar xom piksel ma’lumoti hajmini baholaydi, fayl formati hajmini emas."
  },
  {
    "type": "solved",
    "content": "800×600 24-bit RGB = 800×600×3 = 1 440 000 bayt ≈ 1,37 MiB. Agar 32-bit RGBA bo‘lsa 800×600×4 = 1 920 000 bayt."
  },
  {
    "type": "trap",
    "content": "JPEG, PNG va BMP fayllari sarlavha, metadata, siqish va rang kodlash sabab shu hisobdan farq qiladi; barcha BMP har doim siqilmagan emas."
  },
  {
    "type": "task",
    "content": "3-mashq. 1024×768 24-bit rasm xom piksellari necha bayt? Hisoblang."
  },
  {
    "type": "heading",
    "content": "4. RGB — ekranda qo‘shuvchi model"
  },
  {
    "type": "definition",
    "content": "RGB qizil (Red), yashil (Green), ko‘k (Blue) yorug‘lik kanallarining qo‘shilishiga tayanadi. Odatiy 8-bit sRGB tasvirda kanal qiymatlari 0–255 bo‘ladi: qora (0,0,0), oq (255,255,255). Qizil va yashil nur to‘liq qo‘shilganda sariq ko‘rinishi mumkin."
  },
  {
    "type": "example",
    "content": "RGB(255,0,0) — qizil; RGB(0,255,0) — yashil; RGB(255,255,0) — sariq. Oqartirish uchun uch kanal qiymatini birgalikda oshirish mumkin, ammo rang fazosi va displey kalibrovkasi ham natijaga ta’sir qiladi."
  },
  {
    "type": "trap",
    "content": "HEX #FF0000 — RGB qizilning veb kodlanishi; HEXning o‘zi CMYK kabi alohida fizik rang modeli emas."
  },
  {
    "type": "task",
    "content": "4-mashq. RGB(0,0,255), RGB(255,255,255), RGB(0,0,0)ni nomlang."
  },
  {
    "type": "heading",
    "content": "5. CMYK va ekran–bosma tafovuti"
  },
  {
    "type": "definition",
    "content": "CMYK ko‘pincha bosma bo‘yoq (cyan, magenta, yellow, key/black) miqdorlarini boshqarish uchun ishlatiladi. Qog‘oz, siyoh, ICC rang profili va printer texnologiyasi natijaga ta’sir qiladi. Ekrandagi yorqin RGB ranglar bosmada aniq aynan shunday chiqmasligi mumkin."
  },
  {
    "type": "case",
    "content": "Maktab tadbiri uchun afisha ekranda to‘q moviy ko‘rindi, bosmada xira chiqdi. Hujjat profilini va bosma xizmatining talabini tekshirib, sinov nusxa chiqarish maqsadga muvofiq."
  },
  {
    "type": "trap",
    "content": "CMYK qiymatlarini ko‘r-ko‘rona RGB raqamiga tenglashtirib bo‘lmaydi; konvertatsiya rang profili bilan bog‘liq."
  },
  {
    "type": "task",
    "content": "5-mashq. Ekran uchun banner va bosma flayer uchun rang modelini hamda nazorat jarayonini belgilang."
  },
  {
    "type": "heading",
    "content": "6. HSB/HSV, HSL va rang tanlash"
  },
  {
    "type": "definition",
    "content": "Hue rang tusi, Saturation rang to‘yinganligini bildiradi. HSV/HSB modelida Value/Brightness yorqinlik, HSLda Lightness och-to‘qlik o‘lchovi sifatida ishlaydi; atamalar o‘xshash bo‘lsa ham hisoblash usullari farqli. Muharrirda rang tanlash uchun qulay boshqaruvdir."
  },
  {
    "type": "example",
    "content": "Bir xil ko‘k tusni ochroq qilishda HSV qiymatini yoki HSL lightnessni o‘zgartiring, natijani rasm fonida kontrast nuqtai nazaridan tekshiring."
  },
  {
    "type": "trap",
    "content": "HSVdagi «Brightness»ni oddiy foto ekspozitsiyasi bilan yoki HSL Lightness bilan aynan bir formula deb hisoblamang."
  },
  {
    "type": "task",
    "content": "6-mashq. Hue va saturationni farqlovchi o‘zingizning misolingizni yozing."
  },
  {
    "type": "heading",
    "content": "7. JPEG va yo‘qotishli siqish"
  },
  {
    "type": "definition",
    "content": "JPEG ko‘plab fotosuratlar uchun samarali bo‘lgan yo‘qotishli siqishdan foydalanadi: ayrim mayda tafsilotlar saqlashda kamayishi mumkin. Qayta-qayta tahrirlab JPEGga siqilgan holda yozish artefaktlarni kuchaytirishi ehtimol. Matnli ikon uchun kontur aniq ko‘rinmay qolishi mumkin."
  },
  {
    "type": "solved",
    "content": "Foto 4 MBdan 500 KBga tushdi. Yonma-yon kattalashtirib ko‘rilganda qirralarda blok artefaktlari paydo bo‘lsa, sifat parametrini oshiring yoki boshqa format tanlang."
  },
  {
    "type": "trap",
    "content": "«JPEG 16,7 million rangni qo‘llaydi, demak har bir JPEG mukammal» degan xulosa noto‘g‘ri. Rangi va sifati faylning haqiqiy kodlashiga bog‘liq."
  },
  {
    "type": "task",
    "content": "7-mashq. Rang o‘tishlari ko‘p fotoni vebga tayyorlang: o‘lcham, format va sifatni qaysi mezonlar bilan tanlaysiz?"
  },
  {
    "type": "heading",
    "content": "8. PNG, alfa kanal va shaffoflik"
  },
  {
    "type": "definition",
    "content": "PNG odatda yo‘qotishsiz saqlaydi hamda alfa orqali yarim shaffof pikselni ifodalashi mumkin. Ekran suratlari, matnli grafika va kichik rasmlarda foydali; murakkab foto katta faylga aylanishi mumkin. PNG formatining mavjudligi o‘zi animatsiya borligini anglatmaydi."
  },
  {
    "type": "example",
    "content": "Fon shaffof bo‘lgan maktab belgisi uchun PNG eksport qiling, oq va qora fon ustiga qo‘yib chetlarida oq halqa qolmaganini tekshiring."
  },
  {
    "type": "trap",
    "content": "Yarim shaffof piksel qiymatlari bilan asl qatlamli ishchi fayl bir xil emas: PNG eksporti Photoshop qatlamlarini qayta tahrirga olib bormasligi mumkin."
  },
  {
    "type": "task",
    "content": "8-mashq. Shu belgi uchun PNG va JPEG natijalaridagi fon farqini izohlang."
  },
  {
    "type": "heading",
    "content": "9. SVG va vektor hujjat"
  },
  {
    "type": "definition",
    "content": "SVG vektor shakllar, yo‘llar va matnni XMLga asoslangan tuzilishda ifodalashi mumkin. Geometrik ikon, oddiy diagramma va moslashuvchan grafik uchun foydali; ichidagi tasvirlar, shriftlar yoki effektlar muhitga qarab farq qilishi mumkin. Manbasi noma’lum SVGni ham xavfsizlik nuqtai nazaridan ko‘rib chiqish kerak."
  },
  {
    "type": "case",
    "content": "48 piksellik ekran ikoni va katta plakatda bir xil geometrik belgini ishlatish uchun SVG originalini saqlang, kerakli ko‘rinishda PNG variantini eksport qiling."
  },
  {
    "type": "trap",
    "content": "SVG har doim faqat vektor bo‘lmasligi mumkin: rastr surat joylashtirilgan bo‘lsa o‘sha qism kattalashganda cheklov saqlanadi."
  },
  {
    "type": "task",
    "content": "9-mashq. SVG va PNGdan veb ikon uchun qaysisini tanlaysiz, qanday sinaysiz?"
  },
  {
    "type": "heading",
    "content": "10. GIF, BMP va boshqa formatlar"
  },
  {
    "type": "definition",
    "content": "GIF indekslangan rang palitrasi asosida oddiy animatsiyalar uchun ishlatilishi mumkin; ranglar soni cheklanganligi sabab tabiiy foto uchun odatda samarasiz. BMP ko‘pincha piksel ma’lumotini bevosita yoki kam siqib saqlaydi, ammo BMPning barcha varianti majburiy siqilmagan emas. TIFF turli bit chuqurligi va siqish variantlarini qo‘llashi mumkin."
  },
  {
    "type": "example",
    "content": "Yugurayotgan belgining qisqa animatsiyasi uchun GIF mumkin, lekin boy rangli katta fotoni JPEG/WebP bilan taqqoslash kerak."
  },
  {
    "type": "trap",
    "content": "«BMP siqilmagan» va «GIF har doim 256 rangdan ortiqni umuman ko‘rsatolmaydi» kabi soddalashtirishlar format variantlarini e’tiborsiz qoldiradi."
  },
  {
    "type": "task",
    "content": "10-mashq. Foto, skaner arxivi, animatsiya va logotip uchun fayl formatlarini tanlang."
  },
  {
    "type": "heading",
    "content": "11. Rasterize, eksport va loyihaviy fayl"
  },
  {
    "type": "definition",
    "content": "PSD va o‘xshash muharrir fayllari qatlam, maska hamda qayta tahrir imkonini saqlashi mumkin. PNG/JPEG eksport ko‘pincha qatlamlarni tekislaydi. Rasterize vektor yoki aqlli obyektni piksel tasviriga aylantiradi, so‘ng masshtab uchun asl vektor nazorati kamayadi."
  },
  {
    "type": "solved",
    "content": "Afi sha tayyorlaganda `loyiha.psd` va `afisha.png`ni alohida saqlang. Matnni oxirida o‘zgartirish uchun ishchi faylni yo‘qotmang."
  },
  {
    "type": "trap",
    "content": "Fayl nomini .psdga almashtirish qatlamlarni tiklamaydi. Eksport bilan qayta ishlanadigan loyiha formati bir narsa emas."
  },
  {
    "type": "task",
    "content": "11-mashq. Ishchi loyiha, onlayn veb tasvir va bosma fayl uchun uch nusxa rejasini tuzing."
  },
  {
    "type": "heading",
    "content": "12. Grafik ma’lumotni o‘qish va manbalar"
  },
  {
    "type": "definition",
    "content": "Ko‘rgazmali rasm ilmiy yoki statistika da’vosini isbotlamaydi. Grafikda ma’lumot manbasi, o‘q/miqyos, rang izohi va tasvirning o‘zgartirilgan qismlari imkon qadar ravshan bo‘lsin. Boshqa muallifning fotosidan foydalanishda litsenziya va shaxsiy ma’lumot hurmat qilinadi."
  },
  {
    "type": "example",
    "content": "Sinf natijalari infografikasida 20% va 40% ustunlarning asosiy o‘qi noldan boshlansin; rasm manbasi ham yonida yozilsin."
  },
  {
    "type": "trap",
    "content": "Fotosurat kontrastini kuchaytirish natijani manipulyatsiyasiz ko‘rsatish mas’uliyatini olib tashlamaydi."
  },
  {
    "type": "task",
    "content": "12-mashq. Bir infografikada fakt, tasvir, rang va manbani tekshiruvchi besh bandni tuzing."
  },
  {
    "type": "heading",
    "content": "13. Yakuniy amaliy loyiha va nazorat"
  },
  {
    "type": "definition",
    "content": "Bitta mavzu uchun kamida ikki xil maqsadli tasvir yarating: foto uchun rastr, ikon uchun vektor. Rang profili, piksel o‘lchami, foydalanish huquqi va eksport sifatini tekshiring. Ishchi faylni alohida saqlang va taqqoslash jadvali tuzing."
  },
  {
    "type": "case",
    "content": "Maktab tadbiri uchun raqamli e’lon va 300 PPIga mos bosma element tayyorlang. Dastlab faylning real piksel miqdorini, so‘ng printer o‘lchamini hisoblang."
  },
  {
    "type": "trap",
    "content": "Rasmga «300 DPI» deb metadata yozish uning juda kichik piksel panjarasini keskinlashtirmaydi."
  },
  {
    "type": "task",
    "content": "13-mashq. Loyiha natijasini 0–2 ball bilan: mazmun, grafik turi, aniqlik, manba va qayta tahrir imkoniyati mezonlarida baholang."
  },
  {
    "type": "summary",
    "content": "Rastr pikseldan, vektor koordinata va shakldan iborat. RGB — nur, CMYK — odatda bosma siyoh; HSV/HSL rang tanlash parametrlari. JPEG ko‘pincha yo‘qotishli, PNG yo‘qotishsiz; SVG geometriyani saqlaydi. PPI ma’lumotini oshirish asl tafsilotni avtomatik oshirmaydi. Grafik sifati vazifa, auditoriya, format, manba va sinov bilan baholanadi."
  },
  {
    "type": "answers",
    "content": "2) 1600×1200 = 1 920 000 piksel, 200 PPIda 8×6 dyuym; 3) 1024×768×3 = 2 359 296 bayt; 4) ko‘k, oq, qora; 5) bosma profil va sinov zarur; 6) Hue tus, Saturation to‘yinganlik; 7) JPEG fotosurat uchun, artefakt sinovi; 8) PNG alfa fonni saqlaydi, JPEG odatda bunday kanalni saqlamaydi; 9) vektor ikonda SVG, eksport va xavfsizlik sinovi; 10) GIF qisqa indekslangan animatsiyada; 11) ishchi qatlamli va tekislangan eksport farqlanadi; 12) manba, o‘q, rang, ma’no, litsenziya; 13) natija mezonlari asos bilan baholanadi. 1 va boshqalar vaziyatga qarab asoslantiriladi."
  },
  {
    "type": "source",
    "content": "Manba doirasi: Cambridge+ 8-sinf «Informatika va axborot texnologiyalari», animatsiya bobidagi rastr/vektor, piksel va qatlam tushunchalari, bosma taxminan 121–123-betlar (https://drive.google.com/file/d/1hZyLM5n0OUtuJI3M3dFeAz8kyv9Sr6Ng/view); Cambridge+ 10–11-sinf tasvir formatlari va kodlash bo‘limi (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). O‘lcham, format va rang misollari mustaqil ishlab chiqilgan; har bir bosma/PDF fizik bet va rasm 1:1 ekspert tasdig‘idan o‘tmagan."
  }
]

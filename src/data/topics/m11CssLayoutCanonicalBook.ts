/** TASK-306: CSS box model, typography, forms and responsive layout textbook. */
import type { TheoryBlock } from '../topicContent'
export const M11_06_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "CSS shrift va matn, box model va box-sizing hisoblarini, list/table/form uslublari, display, flex/grid, media query va mobil overflow tekshiruvlarini mustaqil qo‘llash."
  },
  {
    "type": "intro",
    "content": "CSS matn va bloklar haqida gap ketganda ko‘rinish kod bilan hisoblanadi. Content, padding, border, marginni farqlamaslik bir necha piksel xatoga va butun sahifaning mobil ko‘rinishda buzilishiga olib keladi. Bob aniq hisob va real responsive tekshiruvga tayanadi."
  },
  {
    "type": "table",
    "content": "| Qatlam | Box modeldagi joyi | Kenglikka ta’sir |\n|---|---|---|\n| Content | Eng ichkari | width(content-box) |\n| Padding | Content tashqarisi | +2×padding |\n| Border | Padding tashqarisi | +2×border |\n| Margin | Border tashqarisi | Tashqi masofa |"
  },
  {
    "type": "formula",
    "content": "Content-boxda umumiy border-box eni = width + chap/o‘ng padding + chap/o‘ng border. Border-boxda content eni = width - ikki taraf padding - ikki taraf border (agar qolgan musbat bo‘lsa). Margin odatda tashqi joyga ta’sir qiladi."
  },
  {
    "type": "heading",
    "content": "1. CSS matn: font-family, font-size va font-weight"
  },
  {
    "type": "definition",
    "content": "font-family shriftlar ketma-ketligini, font-size belgilar o‘lchamini, font-weight qalinlik darajasini boshqaradi. Ekrandagi har bir shrift mavjud bo‘lmasligi mumkin; fallback nomi kerak. rem ildiz font-sizega bog‘lanib, foydalanuvchi sozlamalariga moslashishga yordam beradi."
  },
  {
    "type": "case",
    "content": "bodyda sans-serif fallback, h1da 2rem, pda 1rem ishlating; brauzer zoom 200% bo‘lganda matn qirqilib ketmasin."
  },
  {
    "type": "trap",
    "content": "16px har doim eng yaxshi o‘lcham yoki barcha qurilmada bir xil jismoniy uzunlik degani emas."
  },
  {
    "type": "task",
    "content": "1-mashq. Maktab sahifasi sarlavhasi va matni uchun font va rem rejasini yozing."
  },
  {
    "type": "code",
    "content": "body { font-family: system-ui, sans-serif; }\nh1 { font-size: 2rem; }"
  },
  {
    "type": "heading",
    "content": "2. Qator oralig‘i, text-align va matn bezagi"
  },
  {
    "type": "definition",
    "content": "line-height qatorlar orasidagi balandlik, text-align esa matnni blok ichida tekislaydi. text-decoration link yoki boshqa matn bezagini belgilaydi. Matnni uzun abzaslarda o‘qish uchun yetarli qator oralig‘i va satr uzunligi muhim."
  },
  {
    "type": "solved",
    "content": "p { line-height: 1.6; max-width: 65ch; } matnning uzun chiziqlarini kamaytirishi mumkin; tor telefonda esa moslashish kerak."
  },
  {
    "type": "trap",
    "content": "text-align:center uzun katta hajmli matnning o‘qilishini yengillashtirishi shart emas."
  },
  {
    "type": "task",
    "content": "2-mashq. 2 ta matn blokini qator oralig‘i va alignment bo‘yicha qiyoslang."
  },
  {
    "type": "code",
    "content": "p { line-height: 1.6; max-width: 65ch; }"
  },
  {
    "type": "heading",
    "content": "3. Box Model: content, padding, border, margin"
  },
  {
    "type": "definition",
    "content": "CSS qutisi ichkaridan content → padding → border → margin qatlamlariga ega. Content element mazmunining hududi, padding ichki oraliq, border chegara, margin esa tashqi oraliq. Bu to‘rt tushuncha responsive joylashuvda asosiy hisobdir."
  },
  {
    "type": "example",
    "content": "width:200px, padding:10px, border:2px, margin:5px holatida content-box gorizontal border-box eni 200+20+4=224px; ikki taraf margin qo‘shilganda tashqi joy talabi 234px."
  },
  {
    "type": "trap",
    "content": "margin ko‘pincha vertikal yo‘nalishda collapse bo‘lishi mumkin; oddiy qo‘shish har bir kontekstda aynan mos emas."
  },
  {
    "type": "task",
    "content": "3-mashq. Content eni 300px, ikki taraf padding 15px, border 2px bo‘lsa border-box enini toping."
  },
  {
    "type": "code",
    "content": ".card { width: 200px; padding: 10px; border: 2px solid #444; margin: 5px; }"
  },
  {
    "type": "heading",
    "content": "4. box-sizing: border-box"
  },
  {
    "type": "definition",
    "content": "Standart content-box modelda width contentga, border-boxda esa ko‘rsatilgan width odatda content+padding+border umumiy chegarasiga tegishli. Border-boxga o‘tish kenglik hisobini sodda qiladi. Box modelning qaysi turda ekanini DevToolsdan ko‘rish mumkin."
  },
  {
    "type": "case",
    "content": "box-sizing:border-box; width:300px; padding:20px; border:2px bo‘lsa content hudud eni 300-40-4=256px, margin esa tashqarida qoladi."
  },
  {
    "type": "trap",
    "content": "width:100% bilan padding qo‘shib, content-box ishlatilsa element parentdan chiqib ketishi mumkin."
  },
  {
    "type": "task",
    "content": "4-mashq. Border-box 360 px, padding 16 px va border 2 px har ikki tarafda; content eni nechaga teng?"
  },
  {
    "type": "code",
    "content": "*, *::before, *::after { box-sizing: border-box; }"
  },
  {
    "type": "heading",
    "content": "5. Margin va padding qachon ishlatiladi"
  },
  {
    "type": "definition",
    "content": "Padding elementning borderi ichidagi nafas olish maydoni; margin element bilan boshqa tashqi obyekt oralig‘i. Tugma kattalashtirishda padding foydali, kartalar orasidagi masofada gap/margin, ekran chekkasida konteyner padding ishlatilishi mumkin."
  },
  {
    "type": "solved",
    "content": "Tugma matni qisilib qolgan: paddingni oshiring. Ikkita kartaning orasidagi bo‘shliq uchun grid gapdan ham foydalanish mumkin."
  },
  {
    "type": "trap",
    "content": "Ikki kartaning marginlari ayrim vertikal kontekstda collapse bo‘lishini hisobga olmaslik natijani noto‘g‘ri taxmin qiladi."
  },
  {
    "type": "task",
    "content": "5-mashq. Qutining ichki va tashqi oraliqlarini sxemada ajrating."
  },
  {
    "type": "heading",
    "content": "6. Ro‘yxat, jadval va border-collapse"
  },
  {
    "type": "definition",
    "content": "list-style-type ro‘yxat markerini, list-style-position marker joyini boshqaradi. Jadvalda border-collapse:collapse qo‘shni chiziqlarni birlashtirishga yordam beradi; th/td padding katak ichidagi oraliqni ta’minlaydi. Semantik ol/ul va table tuzilmasi CSSdan mustaqil qoladi."
  },
  {
    "type": "example",
    "content": "Dars qadamlarini raqamli ro‘yxat sifatida qoldirib list-style turini o‘zgartiring; baholar jadvalida katak paddingini 8 px belgilang."
  },
  {
    "type": "trap",
    "content": "Jadvalning chiroyli CSS chegara chiziqlari table ichidagi semantik sarlavha bog‘lanishi yo‘qligini qoplay olmaydi."
  },
  {
    "type": "task",
    "content": "6-mashq. Bitta ol va bitta table uchun maqbul CSS yozing."
  },
  {
    "type": "code",
    "content": "table { border-collapse: collapse; }\nth, td { border: 1px solid #ddd; padding: 8px; }"
  },
  {
    "type": "heading",
    "content": "7. Form elementlarini o‘qiladigan qilish"
  },
  {
    "type": "definition",
    "content": "input, select, textarea va buttonda shrift o‘lchami, padding, border va fokus belgisi birgalikda tekshiriladi. Label foydalanuvchi uchun maydon nomini beradi va HTMLda semantik bog‘lanishi kerak. Error holat rangga qo‘shimcha ravishda izoh matnida ham berilsin."
  },
  {
    "type": "case",
    "content": "Mobil forma inputiga min-height va yetarli padding bering, :focus-visible bilan klaviatura fokusini aniq ko‘rsating."
  },
  {
    "type": "trap",
    "content": "outline:none bilan fokusni hech qanday muqobilsiz olib tashlash klaviatura foydalanuvchisiga zarar yetkazadi."
  },
  {
    "type": "task",
    "content": "7-mashq. Ikki inputli forma uchun fokus, xato va label mezonlarini yarating."
  },
  {
    "type": "code",
    "content": "input:focus-visible { outline: 3px solid #2563eb; }"
  },
  {
    "type": "heading",
    "content": "8. Display va joylashuv: block, inline, inline-block"
  },
  {
    "type": "definition",
    "content": "display:block odatda yangi qatorga chiqishi, inline esa matn oqimida qatnashishi mumkin; inline-block satr ichida bo‘lib, width/height kabi xossalarni qabul qiladi. CSS zamonaviy flex va grid modellarini ham qo‘llaydi."
  },
  {
    "type": "solved",
    "content": "Span yozuvi matnda inline turadi, kartalar containerida flex ishlatish qulay, bitta tugma esa inline-block bo‘lishi mumkin."
  },
  {
    "type": "trap",
    "content": "Barcha element display:block bo‘lishi dizaynni avtomatik responsiv qilmaydi."
  },
  {
    "type": "task",
    "content": "8-mashq. Block va inline farqini kodda ko‘rsating."
  },
  {
    "type": "code",
    "content": "span { display: inline; }\n.card { display: block; }"
  },
  {
    "type": "heading",
    "content": "9. Flexbox va Grid: vazifalar"
  },
  {
    "type": "definition",
    "content": "Flexbox asosan bir o‘q bo‘yicha elementlarni joylashtirish, Grid esa ikki o‘lchovli qator/ustun maketlarini qurish uchun qulay. gap elementlar orasidagi bo‘shliqni boshqaradi; flex-wrap tor joyda qatorga ko‘chirishni ta’minlashi mumkin."
  },
  {
    "type": "example",
    "content": "Navigatsiya tugmalari uchun flex gap, kartalar paneli uchun repeat(auto-fit,minmax(...)) bilan grid mos bo‘lishi mumkin."
  },
  {
    "type": "trap",
    "content": "Flex va Griddan birini mutlaq «eng yaxshi» deb belgilash mumkin emas; vazifa ikki/bit o‘qliligiga bog‘liq."
  },
  {
    "type": "task",
    "content": "9-mashq. 3 kartali layoutni grid bilan, tugmalar satrini flex bilan yozing."
  },
  {
    "type": "code",
    "content": ".cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); gap: 1rem; }"
  },
  {
    "type": "heading",
    "content": "10. Media query va moslashuvchan o‘lcham"
  },
  {
    "type": "definition",
    "content": "@media (max-width:600px) kabi so‘rov viewport muhitiga mos variant yaratadi. clamp(), min(), max() kabi CSS funksiyalar o‘lchamning minimal/afzal/maksimal qiymatini belgilashga yordam beradi. Mobil-first yondashuvda avval kichik ekran tartibi yaratiladi."
  },
  {
    "type": "case",
    "content": "Desktop uch ustunli katalog mobil ekranda bitta ustun bo‘lsin; font-size uchun clamp(1rem, 2vw, 1.5rem) kabi variantni sinab ko‘ring."
  },
  {
    "type": "trap",
    "content": "600px breakpoint hamma telefonning qat’iy nomi emas; kontent buziladigan chegara asosida breakpoint tanlang."
  },
  {
    "type": "task",
    "content": "10-mashq. 360px va 1280px sahifa ko‘rinishlarini ikki xatolik bilan sinang."
  },
  {
    "type": "code",
    "content": "@media (max-width: 600px) { .layout { display: block; } }"
  },
  {
    "type": "heading",
    "content": "11. Overflow, max-width va responsiv jadval"
  },
  {
    "type": "definition",
    "content": "max-width:100% tasvirning konteynerdan chiqishini oldini olishga yordam beradi; overflow-x:auto keng jadvalni o‘z hududida gorizontal aylantirish imkonini beradi. Lekin butun sahifadagi keraksiz horizontal scroll alohida tekshirilsin."
  },
  {
    "type": "solved",
    "content": "Jadval 900px, telefon 360px: jadvalni max-widthli scroll konteynerga o‘rang va barcha ustun mazmuni o‘qilishini sinang."
  },
  {
    "type": "trap",
    "content": "overflow:hidden bilan ma’lumotning bir qismini yashirish accessiblity va funksional yo‘qotishga olib kelishi mumkin."
  },
  {
    "type": "task",
    "content": "11-mashq. Mobilda keng jadval uchun ko‘rinadigan sarlavha va scroll variantini rejalang."
  },
  {
    "type": "code",
    "content": ".table-wrap { overflow-x: auto; max-width: 100%; }"
  },
  {
    "type": "heading",
    "content": "12. Yakuniy amaliy maket va tekshiruv"
  },
  {
    "type": "definition",
    "content": "Matn, ro‘yxat, jadval va forma uchun yaxlit responsive sahifa uslubi yarating. Box sizing, padding, border, line-height, focus-visible, flex/grid va media querydan vazifaga mos foydalaning. Real telefon/desktop, zoom va klaviatura sinovi bilan yakunlang."
  },
  {
    "type": "example",
    "content": "Maktab darslari sahifasida intro, fan jadvali, ro‘yxat va aloqa formasini joylashtiring; CSS ni o‘zgartirib ikki ekran hajmida sinab ko‘ring."
  },
  {
    "type": "trap",
    "content": "Ko‘p CSS qatori avtomatik tezroq yoki qulayroq sahifa degani emas; sinov, qayta ishlatish va semantika muhim."
  },
  {
    "type": "task",
    "content": "12-mashq. 0–2 balli: o‘qilish, hisob, fokus, mobil, semantika mezonli rubrika yozing."
  },
  {
    "type": "summary",
    "content": "Box model ichkaridan content→padding→border→margin. Content-box width asosiy mazmunni, border-box width shu mazmun va padding/borderni qamrab oladi. Tipografiya, formadagi fokus va xato izohlari, Flex/Grid tanlovi, media query va zoom/telefon sinovi responsive dizaynning asosidir."
  },
  {
    "type": "answers",
    "content": "3) 300+30+4=334px border-box; 4) 360-32-4=324px content; 1) rem rootga; 2) line-height; 5) padding ichki, margin tashqi; 6) table border-collapse, ol semantik; 7) fokus belgisi; 8) block/inline; 9) grid kartalar, flex tugmalar; 10) kontentga mos breakpoint; 11) overflow-x:auto; 12) 5 mezon. Ochiq masalada turli yechimlar bo‘lishi mumkin."
  },
  {
    "type": "source",
    "content": "Cambridge+ 9-sinf 21-bob CSS va veb-sayt yaratish (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); MDN CSS box model (https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model), Grid (https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout), Flexbox (https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout). Formulalar va misollar mualliflik tahlili; PDF sahifalar/rasmlar fizik 1:1 tasdiqlanmagan."
  }
]

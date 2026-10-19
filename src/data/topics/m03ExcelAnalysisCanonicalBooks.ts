/** TASK-288: full authored Excel data analysis books grounded in Cambridge+ chapter 8. */
import type { TheoryBlock } from '../topicContent'
export const M03_06_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "Excelda yozuv va maydonni, Sort/Filter/Find/Remove Duplicates farqlarini ajratish; oddiy va ko‘p bosqichli saralashni to‘g‘ri bajarish; matn/son/sana shartli filtrlarni yaratish, yashirin qatorlarni o‘chirilgan deb qabul qilmaslik; ifodaning AND/OR mantiqini qo‘llash va boshlang‘ich jadval butunligini tekshirish."
  },
  {
    "type": "intro",
    "content": "30 o‘quvchining ism, sinf va balli bitta jadvalda joylashgan. Maqsad «7-A sinfidagi 70 balldan yuqori o‘quvchilar»ni ko‘rish bo‘lsa Filter kerak; shu o‘quvchilarni balldan kamayish tartibida ko‘rsatish uchun yana Sort qo‘llanadi. Ikkala amal ma’lumotga boshqa usulda ta’sir qiladi."
  },
  {
    "type": "heading",
    "content": "1. Jadval yozuvi va bog‘langan ustunlar"
  },
  {
    "type": "definition",
    "content": "==Yozuv (record)== jadvalning bir satridagi bir obyektga tegishli maydonlar majmui; ==maydon (field)== sarlavhali ustun. Saralashda ism, sinf va ball birga ko‘chishi kerak, aks holda boshqa o‘quvchining balli noto‘g‘ri biriktiriladi."
  },
  {
    "type": "table",
    "content": "| ID | Ism | Sinf | Ball |\n|---|---|---|---:|\n| 101 | Ali | 7-A | 78 |\n| 102 | Laylo | 7-B | 92 |\n| 103 | Dilshod | 7-A | 65 |\n| 104 | Munisa | 7-A | 88 |"
  },
  {
    "type": "case",
    "content": "Faqat Ball ustunini saralab, Ism ustunini joyida qoldirsak, Laylo bali bilan Ali ismi yonma-yon kelishi mumkin. Ma’lumotlarning qatorlararo bog‘lanishini saqlash uchun saralashdan oldin butun jadval tanlanganini tekshiring."
  },
  {
    "type": "heading",
    "content": "2. Saralash (Sort) va qidirish (Find)"
  },
  {
    "type": "definition",
    "content": "==Sort== yozuvlarning joylashish tartibini o‘zgartiradi. ==Find== mos so‘z yoki qiymatni topadi; topishning o‘zi qatorlarni o‘zgartirmaydi. Saralash o‘suvchi, kamayuvchi yoki bir necha darajada bo‘lishi mumkin."
  },
  {
    "type": "table",
    "content": "| Maqsad | Amal | Natija |\n|---|---|---|\n| Ismni A→Z tartibida joylash | Sort ascending | Qatorlarning tartibi o‘zgaradi |\n| Ballni 100→0 tartibida ko‘rish | Sort descending | Ballga mos yozuvlar qayta joylashadi |\n| «Laylo»ni topish | Find | Joyi aniqlanadi, tartib qoladi |\n| Faqat 7-A sinfi yozuvlari | Filter | Qolgan satrlar vaqtincha yashirinadi |"
  },
  {
    "type": "trap",
    "content": "Harflarni saralashda til/collation sozlamalari, sonlarni saralashda esa qiymatning haqiqiy son yoki matn ekanligi natijaga ta’sir etishi mumkin."
  },
  {
    "type": "heading",
    "content": "3. Birinchi sort: sarlavhani ma’lumotga qo‘shib yubormang"
  },
  {
    "type": "solved",
    "content": "**Amaliy tartib.** 1) A1:D5 oralig‘ini belgilang; 2) Data → Sort; 3) «My data has headers» belgisini tekshiring; 4) Ball bo‘yicha Largest to Smallest tanlang; 5) Ali va uning 78 bali bir qatorda qoldimi, ko‘ring. Sarlavhaning «Ball» matni sonli ro‘yxatga qo‘shilmasligi kerak."
  },
  {
    "type": "example",
    "content": "Natija: Laylo—92, Munisa—88, Ali—78, Dilshod—65. 7-A va 7-B yorliqlari ham o‘z egasi bilan ko‘chadi."
  },
  {
    "type": "trap",
    "content": "Asl jadvalda noto‘g‘ri sort qilingan bo‘lsa, faqat ko‘rinishga qarab kim qaysi ballni olganini taxmin qilmang. Dastlabki nusxa, ID yoki ishonchli manba asosida qayta tiklang."
  },
  {
    "type": "heading",
    "content": "4. Ko‘p darajali Custom Sort"
  },
  {
    "type": "definition",
    "content": "==Custom Sort== avval birinchi mezon, bir xil qiymatlilar ichida esa ikkinchi mezon bo‘yicha tartiblashni amalga oshiradi. Mezondagi darajalar o‘rni almashsa natija farq qilishi mumkin."
  },
  {
    "type": "table",
    "content": "| Birinchi daraja | Ikkinchi daraja | Natija |\n|---|---|---|\n| Sinf A→Z | Ball katta→kichik | Har sinf ichida eng yuqori ball avval |\n| Ball katta→kichik | Ism A→Z | Teng ball bo‘lsa ism tartibi |\n| Sana eski→yangi | ID kichik→katta | Bir kundagi yozuvni ID ajratadi |"
  },
  {
    "type": "solved",
    "content": "Sinf bo‘yicha A→Z, keyin ball bo‘yicha katta→kichik sort qo‘llang. Yuqoridagi jadvalda 7-A ichida Munisa (88), Ali (78), Dilshod (65), keyin 7-B Laylo (92) chiqadi. Agar faqat ball bo‘yicha saralasangiz, Laylo boshda qoladi — bu boshqa savol."
  },
  {
    "type": "heading",
    "content": "5. Filtrlash: yashirish, o‘chirish emas"
  },
  {
    "type": "definition",
    "content": "==Filter== mezonga mos satrlarni ko‘rsatadi, qolgan satrlarni vaqtincha berkitadi. Uning natijasi yangi kichik jadval ko‘rinishi mumkin, lekin yashirin satrlarning ma’lumotlari saqlanib qoladi."
  },
  {
    "type": "solved",
    "content": "Data → Filter → «Sinf» sarlavhasi yonidagi ochiluvchi ro‘yxatdan faqat 7-A ni tanlang. Ko‘ring: Ali, Dilshod va Munisa ko‘rinadi, Laylo yo‘qolgandek. Filtrni tozalang — Laylo yana chiqadi."
  },
  {
    "type": "trap",
    "content": "Clear Filter bilan Delete Row farqli. Filtrni olib tashlash avval yashiringan satrlarni qayta ko‘rsatadi; o‘chirish esa ma’lumotni olib tashlaydi. Qaysi amal bajarilganini tekshiring."
  },
  {
    "type": "heading",
    "content": "6. Matn sharti va qisman moslik"
  },
  {
    "type": "table",
    "content": "| Filtr sharti | Ma’nosi | Namuna |\n|---|---|---|\n| Equals | To‘liq teng | Sinf = 7-A |\n| Contains | Ichida birikma bor | Ism ichida «li» |\n| Begins With | Boshlanishi mos | Kod 2026 bilan boshlanadi |\n| Ends With | Tugashi mos | Domen .uz bilan tugaydi |\n| Does Not Contain | Birikma yo‘q | Izohda «bekor» yo‘q |"
  },
  {
    "type": "case",
    "content": "Sinf nomi «7-A» bo‘lsa, Contains «7» filtri barcha 7-sinflarni qamrab olishi mumkin. Maqsad aynan 7-A bo‘lsa Equals ishlatish aniqroq."
  },
  {
    "type": "heading",
    "content": "7. Son sharti va oralig‘i"
  },
  {
    "type": "table",
    "content": "| Filtr | Matematik ifoda | E’tibor |\n|---|---|---|\n| Greater Than 70 | >70 | 70 kirmaydi |\n| Greater Than Or Equal To 70 | ≥70 | 70 kiradi |\n| Between 70 and 90 | 70–90 diapazoni | Chegaralar qo‘shilishi dialogga bog‘liq |\n| Top 10 | Eng yuqori n ta yoki foiz | Tenglik va n sozlamasini ko‘ring |\n| Below Average | O‘rtachadan kam | O‘rtacha qanday to‘plamdan olingan? |"
  },
  {
    "type": "solved",
    "content": "Yuqoridagi jadvalda «Ball > 70» sharti Ali (78), Laylo (92), Munisa (88)ni chiqaradi. Agar oldin «Sinf=7-A» bo‘yicha ham filtr bo‘lsa, Ali va Munisa qoladi. Savolda >70 va ≥70 farqini e’tibordan chetda qoldirmang."
  },
  {
    "type": "heading",
    "content": "8. Bir nechta ustun filtri: AND va OR"
  },
  {
    "type": "definition",
    "content": "Turli ustunlarda qo‘llangan oddiy filtrlar ko‘pincha mantiqiy ==AND== — barcha shartlar birgalikda bajarilishi natijasini beradi. Bitta ustunda bir nechta element belgilanishi yoki Custom Filter dagi OR esa shartlarning kamida bittasi bajarilishini bildirishi mumkin."
  },
  {
    "type": "table",
    "content": "| Ifoda | Qamrov | Jadvaldagi misol |\n|---|---|---|\n| Sinf=7-A AND Ball>70 | Ikkalasi to‘g‘ri | Ali, Munisa |\n| Sinf=7-A OR Ball>90 | Kamida bittasi | Ali, Dilshod, Munisa, Laylo |\n| Ball>70 AND Ball<90 | 70 dan katta, 90 dan kichik | Ali, Munisa |\n| Ball<70 OR Ball>90 | Ikkita ekstremal guruh | Dilshod, Laylo |"
  },
  {
    "type": "trap",
    "content": "Sinf=7-A OR Ball>90 uchun turli ustunlarning oddiy drop-down filtrini ketma-ket qo‘yish ko‘pincha **AND** beradi. OR uchun yordamchi formula yoki mos shartli filtr usulini tanlash kerak."
  },
  {
    "type": "heading",
    "content": "9. Sana, bo‘sh katak va qiymat turi"
  },
  {
    "type": "text",
    "content": "Sana ko‘rinishidagi matn haqiqiy sana qiymati bo‘lmasa, Date Filters to‘g‘ri ishlamasligi mumkin. Bir ustunda 8, 80, «80» va bo‘sh qiymatlar aralashsa sonli tartib va hisob natijasini tekshiring."
  },
  {
    "type": "case",
    "content": "01.02.2026 bir kompyuterda 1-fevral, boshqasida 2-yanvar deb talqin qilinishi mumkin. Fayldagi mintaqaviy format va asl qiymatni aniqlab, keyin filtrlang."
  },
  {
    "type": "heading",
    "content": "10. Jadval (Table) va AutoFilter"
  },
  {
    "type": "text",
    "content": "Excel jadvalini Table formatiga aylantirish sarlavha, avtomatik diapazon kengayishi va filtrlashni qulaylashtiradi. Lekin noto‘g‘ri sarlavha yoki bo‘sh qatorlar qamrovni noto‘g‘ri belgilashi mumkin. Jadval o‘sishida oxirgi yangi satr filtrga kirganini tekshiring."
  },
  {
    "type": "solved",
    "content": "10 yozuvli to‘garak ro‘yxatini Table ko‘rinishida yarating va bittasini qo‘shing. Ro‘yxat o‘lchami yangilangani va filtrlash yangi satrni ham qamrab olayotganini sinang."
  },
  {
    "type": "heading",
    "content": "11. Saralash natijasini mustaqil tekshirish"
  },
  {
    "type": "table",
    "content": "| QA savoli | Noto‘g‘ri holat belgisi | Chora |\n|---|---|---|\n| Barcha yozuvlar saqlandimi? | Qatorlar soni o‘zgardi | Filtrni tozalab sanang |\n| ID va ism birgami? | Ular alohida surilgan | To‘liq jadvalni tanlab sort |\n| Sonlar sonmi? | 100 qiymati 20 dan oldin emas | Type conversionni tekshiring |\n| Header ajratildimi? | «Ball» o‘rtadagi qator bo‘lib qolgan | Header sozlamasini tiklang |\n| Bir nechta mezon tartibi to‘g‘rimi? | Boshqa guruh ustuvor | Custom Sort Levelsni ko‘ring |"
  },
  {
    "type": "quickcheck",
    "content": "Sort=yozuvlarni tartiblash; Filter=vaqtincha ko‘rsatish; Find=qidirish; Remove Duplicates=ma’lum mezon bo‘yicha takrorlarni olib tashlash. Ularga bir xil amal sifatida qarash mumkin emas."
  },
  {
    "type": "heading",
    "content": "12. Mashqlar va izohli javoblar"
  },
  {
    "type": "task",
    "content": "1. Sinf=7-A, Ball>70 shartlari bilan natijani toping."
  },
  {
    "type": "answers",
    "content": "Ali va Munisa; Dilshodning balli yetmaydi, Laylo boshqa sinfda."
  },
  {
    "type": "task",
    "content": "2. Sinf bo‘yicha A→Z, keyin Ball katta→kichik tartibni yozing."
  },
  {
    "type": "answers",
    "content": "7-A: Munisa, Ali, Dilshod; so‘ng 7-B: Laylo."
  },
  {
    "type": "task",
    "content": "3. 70 balldagi yozuv >70 va ≥70 filtrlardan qaysisiga kiradi?"
  },
  {
    "type": "answers",
    "content": "Faqat ≥70 ga kiradi. Chegara ustidagi belgini aniq o‘qing."
  },
  {
    "type": "task",
    "content": "4. Filtr qo‘llangach Laylo ko‘rinmay qoldi. O‘chgan deb xulosa qilasizmi?"
  },
  {
    "type": "answers",
    "content": "Yo‘q, avval Clear Filter orqali yashirilgan qator qayta chiqishini tekshiring."
  },
  {
    "type": "task",
    "content": "5. Ball satrlari bilan Ism ustuni alohida saralangan. Qanday tiklanadi?"
  },
  {
    "type": "answers",
    "content": "Asl ma’lumot/IDli zaxira asosida bog‘liqlikni tiklab, butun yozuvni birga saralang."
  },
  {
    "type": "task",
    "content": "6. OR sharti uchun nega oddiy ikki ustun filtri yetarli emas?"
  },
  {
    "type": "answers",
    "content": "Turli ustunlardagi odatiy filtrlar AND bo‘yicha kesishadi; OR uchun yordamchi mantiq yoki advanced filter kerak."
  },
  {
    "type": "summary",
    "content": "Natijani boshqarish: ma’lumotlarni tozalash → to‘liq jadvalni ajratish → saralash yoki filtr mezonini tanlash → yashirin va ko‘rinadigan yozuvni farqlash → ID va qator butunligini tekshirish. Tahlil natijasi har doim manba raqamlari bilan mos bo‘lishi shart."
  },
  {
    "type": "source",
    "content": "**Manba izi:** Cambridge+ «Informatika va axborot texnologiyalari», 10–11-sinf (2021), 8-bob «Elektron jadvallar», ma’lumotlarni tartiblash, qidirish, qiymat turlari va jadvaldan foydalanish, https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view . Excel uchun filtrlash ssenariylari va kichik jadval **original didaktik misollar**; PDF sahifama-sahifa to‘liq ko‘chirilmagan, dastur versiyasi bo‘yicha ba’zi buyruq nomlari farqlanishi mumkin."
  }
]
export const M03_07_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "Excel diagrammasining vazifasi, ma’lumotlar qatori va kategoriyasini ajratish; Column, Bar, Line, Pie, Scatter va Histogramni noto‘g‘ri ishlatmaslik; o‘q, birlik, sarlavha, legenda, yorliq va masshtabni sozlash; manipulyatsion grafik belgilarini payqash; bir jadval asosida ikki tur diagramma tuzib, natijani tekshirish."
  },
  {
    "type": "intro",
    "content": "Grafik savolga javob berishi kerak: «qaysi sinf eng ko‘p qatnashdi?», «oylar bo‘yicha qanday o‘zgardi?», «jami byudjet nimaga sarflandi?» Bir ma’lumot uchun eng «chiroyli» ko‘rinish emas, semantik jihatdan mos ko‘rinish tanlanadi."
  },
  {
    "type": "heading",
    "content": "1. Diagramma va jadval bir-birini qanday to‘ldiradi?"
  },
  {
    "type": "definition",
    "content": "==Diagramma== jadvaldagi qiymatlarni tasviriy shaklda ko‘rsatadi. Ma’lumotlar qatori (series) — qiymatlar to‘plami; kategoriya (category) — ular tegishli guruh yoki vaqt yorlig‘i; o‘q (axis) esa koordinata va masshtabni beradi."
  },
  {
    "type": "table",
    "content": "| Oy | Yanvar | Fevral | Mart | Aprel |\n|---|---:|---:|---:|---:|\n| Kutubxona tashrifi | 40 | 55 | 50 | 70 |\n| Onlayn kurs qatnashuvi | 30 | 28 | 45 | 60 |"
  },
  {
    "type": "example",
    "content": "Shu jadvalda ikkita qator (kutubxona, kurs), 4 kategoriya (oylar) bor. «Martda jami qatnashuv nechta?» savoliga 50+45=95 deb jadval orqali hisoblab javob berish oson; trendni esa Line diagrammada ko‘rish mumkin."
  },
  {
    "type": "heading",
    "content": "2. Diagramma turini savolga mos tanlash"
  },
  {
    "type": "table",
    "content": "| Diagramma turi | Eng mos holat | Cheklov |\n|---|---|---|\n| Column | Kategoriyalar orasida miqdorni taqqoslash | Juda ko‘p ustun gavjum |\n| Bar | Uzun nomli kategoriyalarni qiyoslash | Vaqt trendini sezish qiyinlashishi mumkin |\n| Line | Vaqt tartibidagi ketma-ket nuqtalar | Noto‘g‘ri masofadagi vaqt oralig‘i |\n| Pie | Bir butunning qismlar nisbati | Manfiy qiymat va ko‘p bo‘lak uchun mos emas |\n| Scatter (XY) | Ikki sonli o‘zgaruvchi bog‘lanishi | Sababiyatni isbotlamaydi |\n| Histogram | Uzluksiz sonlarning interval bo‘yicha chastotasi | Oddiy kategoriyalar ustun diagrammasidan farq qiladi |"
  },
  {
    "type": "trap",
    "content": "Histogram va ustunli diagramma tashqi ko‘rinishi o‘xshashi mumkin, lekin histogramda sonli interval/chastota, oddiy Column’da esa mustaqil kategoriya qiyoslanadi."
  },
  {
    "type": "heading",
    "content": "3. Column va Bar diagramma"
  },
  {
    "type": "solved",
    "content": "**Amaliy.** A1:B5 kataklarda sinf va qatnashuv qiymatlari bo‘lsin: 7-A 35, 7-B 28, 8-A 40, 8-B 37. Kataklarni sarlavhalar bilan belgilang → Insert → Column → Chart Title «Sinf bo‘yicha qatnashuv» → qiymat o‘qini odam birlikda belgilang. 8-A eng yuqori ekanini tekshiring."
  },
  {
    "type": "text",
    "content": "Bar gorizontal qiymat chiziqlari bilan uzun kategoriya nomlari yaxshi sig‘ishi mumkin. Ikkala tur ham mustaqil sinflarni qiyoslaydi; auditoriya uchun o‘qilishi yaxshiroq variantni tanlang."
  },
  {
    "type": "heading",
    "content": "4. Line diagramma va vaqt"
  },
  {
    "type": "definition",
    "content": "==Line== tartiblangan kuzatuv nuqtalari orasidagi bog‘lanishni ko‘rsatadi. Vaqt oralig‘i turlicha bo‘lsa, odatiy kategoriya o‘qi masofalarni teng ko‘rsatishi mumkin; haqiqiy sonli vaqt oralig‘i uchun mos XY o‘qi kerak bo‘lishi mumkin."
  },
  {
    "type": "solved",
    "content": "Kutubxona qatori bo‘yicha Yanvar 40, Fevral 55, Mart 50, Aprel 70 qiymatlarini Line ko‘rinishida chizing. Natija har oy uzluksiz o‘sish emas — Fevraldan Martga pasayish ham bor. «Yanvardan aprelga umumiy o‘sdi» xulosasi bilan «har oy o‘sdi» xulosasini farqlang."
  },
  {
    "type": "trap",
    "content": "Chiziqning ko‘tarilishi sababiyat degani emas. 4 oylik grafik bo‘yicha keyingi har oy o‘sishi albatta davom etadi deb kafolatlash mumkin emas."
  },
  {
    "type": "heading",
    "content": "5. Pie va qismlarning bir butunga nisbati"
  },
  {
    "type": "table",
    "content": "| Xarajat | So‘m | Ulushi |\n|---|---:|---:|\n| Transport | 200 000 | 20% |\n| Material | 450 000 | 45% |\n| Oziq-ovqat | 350 000 | 35% |\n| Jami | 1 000 000 | 100% |"
  },
  {
    "type": "solved",
    "content": "Jami 1 000 000 so‘mni umumiy pie ichidagi uch bo‘lakka ajrating; **«Jami» qatorini** alohida bo‘lak sifatida kiritmang, aks holda kategoriya qiymatlari ikki marta hisoblanadi. Material eng katta ulush — 45%."
  },
  {
    "type": "trap",
    "content": "Bir-biriga bog‘liq bo‘lmagan miqdorlar yoki yig‘indisi mazmunli «bir butun» bo‘lmagan qiymatlarni Pie bilan berish o‘quvchini adashtiradi. Foizlar bir manbaga nisbatan hisoblanishi kerak."
  },
  {
    "type": "heading",
    "content": "6. Scatter/XY: sonli juftlik"
  },
  {
    "type": "definition",
    "content": "==Scatter (XY)== har bir nuqtani ikki sonli koordinata (x,y) bo‘yicha joylashtiradi. Kategoriya nomlari emas, mustaqil va bog‘liq bo‘lishi mumkin bo‘lgan sonli o‘lchovlar ishlatiladi."
  },
  {
    "type": "table",
    "content": "| Tayyorgarlik soati (x) | Sinov balli (y) |\n|---:|---:|\n| 1 | 45 |\n| 2 | 57 |\n| 3 | 62 |\n| 5 | 78 |"
  },
  {
    "type": "case",
    "content": "Nuqtalar yuqoriga qarab joylashgani musbat aloqaga o‘xshaydi; lekin ko‘proq o‘qish ballni shu miqdorda oshirishining yagona sababi deb xulosa qilish mumkin emas. Boshqa omillar ham bo‘lishi mumkin."
  },
  {
    "type": "heading",
    "content": "7. Chart Elements va o‘qiluvchanlik"
  },
  {
    "type": "table",
    "content": "| Element | Ma’nosi | Tekshiruv |\n|---|---|---|\n| Title | Diagramma savoli | «Diagramma 1» emas, mazmunli nom |\n| Legend | Qatorlar qaysi rangda? | Bir necha qator farqlanadimi? |\n| Axis Title | Birlik va o‘lchov | «So‘m», «Dona», «Oy» |\n| Data Labels | Aniq qiymatlar | Yozuvlar bir-birini yopmayaptimi? |\n| Gridlines | Taqqoslash uchun yordam | Ortiqcha chiziq chalg‘itmayaptimi? |\n| Source | Ma’lumot kelib chiqishi | Jadval bilan qayta tekshirish |"
  },
  {
    "type": "solved",
    "content": "O‘zgaruvchilar birligisiz «70» yozilgan Y o‘qini olsak 70 ta kitobmi yoki 70% ekanini bilib bo‘lmaydi. Axis Title yordamida «Tashrif (kishi)» yoki «Ulush (%)» deb ko‘rsating."
  },
  {
    "type": "heading",
    "content": "8. Ma’lumot manbaini to‘g‘ri belgilash"
  },
  {
    "type": "text",
    "content": "Insert → Chart oldidan sarlavha va haqiqiy qiymatlarni tanlang. 2–3 qatorni qoldirib ketish, «Jami» qatorini ikki marta qo‘shish, sonni matn sifatida saqlash yoki yashirin filtrlangan qatorlarni noto‘g‘ri kiritish grafikni buzadi."
  },
  {
    "type": "case",
    "content": "Jadvalda 2025 va 2026 yil qatorlari bor. Grafik faqat 2026 ni ko‘rsatayotgan bo‘lsa Select Data orqali ma’lumot diapazoni hamda qator va kategoriyalar to‘g‘ri bog‘langanini tekshiring."
  },
  {
    "type": "heading",
    "content": "9. Y o‘qi masshtabi va grafikni manipulyatsiya qilish"
  },
  {
    "type": "text",
    "content": "Ustunli grafiklarda o‘qni nolga yaqin boshlash miqdorlar farqini adolatli ko‘rsatishga ko‘maklashadi. Chiziqli grafikda esa maqsad kichik o‘zgarishlarni ko‘rsatish bo‘lishi mumkin; shunda o‘q chegaralarini oshkora yozish muhim."
  },
  {
    "type": "table",
    "content": "| Ko‘rsatkich | A | B | Haqiqiy farq |\n|---|---:|---:|---:|\n| Yillik natija | 98 | 100 | 2 birlik (taxminan 2%) |"
  },
  {
    "type": "trap",
    "content": "Agar ustunli grafikdagi Y o‘q 97 dan boshlansa, 98 va 100 orasidagi farq vizual juda katta bo‘lib ko‘rinadi. Sonli qiymat va boshlang‘ich o‘q chegaralarini tekshirmasdan katta o‘sish deb xulosa qilmang."
  },
  {
    "type": "heading",
    "content": "10. Chart Design / Format amallari"
  },
  {
    "type": "text",
    "content": "Diagramma elementini tanlang → Chart Design orqali tur, ma’lumot manbasi, qator/kategoriya yo‘nalishi kabi sozlamalarni tekshiring; Format orqali o‘qiluvchanlikka xizmat qiladigan shrift va element ko‘rinishini boshqaring. Dastur versiyasiga ko‘ra menyular farq qilishi mumkin."
  },
  {
    "type": "solved",
    "content": "Bir jadvaldan avval Column, keyin Line diagramma yasang. Har ikki holatda kategoriya 4 oy, ma’lumot esa bir xil raqamlardir. Tur almashtirilganda ma’lumot qiymati avtomatik o‘zgarmasligi kerak."
  },
  {
    "type": "heading",
    "content": "11. Dinamik yangilanish va cheklovlar"
  },
  {
    "type": "text",
    "content": "Diagramma manba kataklarga bog‘langan bo‘lsa, qiymatlar o‘zgarganda u yangilanadi. Ammo jadvaldan tashqariga qo‘shilgan yangi qator avtomatik diapazonga kirmasligi mumkin; Table va Select Data orqali tekshirish zarur."
  },
  {
    "type": "quickcheck",
    "content": "Grafikni baholashning besh savoli: (1) savolga mos diagrammami, (2) to‘g‘ri diapazonmi, (3) sarlavha/birlik bormi, (4) Y o‘q masshtabi halolmi, (5) diagrammadagi sonlarni jadvaldan qayta hisoblash mumkinmi?"
  },
  {
    "type": "heading",
    "content": "12. Mustaqil mashqlar va izohli yechim"
  },
  {
    "type": "task",
    "content": "1. 7-A: 28, 7-B: 33, 8-A: 40. Sinflarni qiyoslash uchun qaysi diagramma?"
  },
  {
    "type": "answers",
    "content": "Column yoki Bar. Kategoriyalar mustaqil sinflar; chiziqli trend doimo mos emas."
  },
  {
    "type": "task",
    "content": "2. Oylar bo‘yicha 40,55,50,70 qiymatida «har oy o‘sdi» degan da’voni tekshiring."
  },
  {
    "type": "answers",
    "content": "Noto‘g‘ri; 55 dan 50 ga tushish bor. Faqat birinchi va oxirgi oyni solishtirsak umumiy o‘sish kuzatiladi."
  },
  {
    "type": "task",
    "content": "3. Transport 20%, material 45%, oziq-ovqat 35%. Pie uchun «Jami=100%» satrini qo‘shish kerakmi?"
  },
  {
    "type": "answers",
    "content": "Yo‘q, jami qo‘shilsa ma’lumot ikki marta hisoblanadi; uch bo‘lakning o‘zi 100%."
  },
  {
    "type": "task",
    "content": "4. Scatter (x,y) bilan Line diagrammani qanday farqlaysiz?"
  },
  {
    "type": "answers",
    "content": "Scatter ikki sonli o‘zgaruvchi juftligi, Line odatda tartiblangan vaqt/kategoriya bo‘yicha trend."
  },
  {
    "type": "task",
    "content": "5. Y o‘q 97 dan boshlanib, 98 va 100 ustunlari berilgan. Nima xatar?"
  },
  {
    "type": "answers",
    "content": "2 birlik farq vizual haddan tashqari katta ko‘rinadi. O‘q chegarasi va haqiqiy qiymatlarni ko‘ring."
  },
  {
    "type": "task",
    "content": "6. Grafikka yangi May qatori qo‘shildi, ko‘rinmadi. Nima tekshiriladi?"
  },
  {
    "type": "answers",
    "content": "Manba diapazon kengaydimi, Table qamrovimi, Select Data va filter holatimi — tekshiriladi."
  },
  {
    "type": "summary",
    "content": "Diagramma tanlash algoritmi: savol → o‘lchov/ma’lumot turi → mos grafik → to‘liq ma’lumot diapazoni → sarlavha va o‘q → qiymat bilan tekshiruv → ehtiyotkor xulosa. Chiroyli ko‘rinish ilmiy va vizual to‘g‘rilikning o‘rnini bosmaydi."
  },
  {
    "type": "source",
    "content": "**Manba izi:** Cambridge+ 10–11-sinf «Informatika va axborot texnologiyalari» (2021), «8 Elektron jadvallar» diagramma va qiyosiy, chiziqli, doiraviy grafiklarni izohlash (bosma taxminan 130-betlar), https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view . Raqamli jadvallar, keyslar va 6 mashq mualliflik qayta bayoni; sahifama-sahifa PDF nusxasi emas."
  }
]

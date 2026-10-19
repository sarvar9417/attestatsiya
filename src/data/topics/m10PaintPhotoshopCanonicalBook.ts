/** TASK-297: Paint and Photoshop correct contemporary, version-aware comparison. */
import type { TheoryBlock } from '../topicContent'
export const M10_02_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "MS Paintning eski va yangi versiyalarini farqlash, grafik muharrir interfeysini tushunish, qatlamlar, maska, adjustment layer, Smart Object va eksportning vazifasini taqqoslash; maqsadli dasturni tanlash va sifat sinovi qilish."
  },
  {
    "type": "intro",
    "content": "Grafik muharrirlar tez rivojlanadi. Masalan, eski darsliklarda Paint qatlamlar bilan ishlamaydi deb yozilgan bo‘lishi mumkin, lekin Windows 11 uchun yangilangan Paint qatlamlarni qo‘llaydi. Dastur nomidan ko‘ra versiya va amaliy imkoniyatini aniqlash — attestatsiya savoliga ham, real darsga ham zarur."
  },
  {
    "type": "table",
    "content": "| Vazifa | Yangilangan Windows 11 Paint | Adobe Photoshop |\n|---|---|---|\n| Sodda rastr tahrir | Mos | Mos |\n| Qatlamlar | Mavjud (versiyaga bog‘liq) | Bor |\n| Professional layer mask | Photoshopga teng deb olinmaydi | Keng qo‘llanadi |\n| Adjustment layer | Teng funksiyalar kafolatlanmagan | Bor |\n| Smart Object | Odatdagi Paint imkoniyati emas | Bor |\n| Asbob/panel joyi | Paint versiyasiga bog‘liq | Workspace sozlanadi |"
  },
  {
    "type": "heading",
    "content": "1. Grafik muharrirni vazifaga ko‘ra tanlash"
  },
  {
    "type": "definition",
    "content": "Rastr muharriri pikselga asoslangan surat, skrinshot va fakturani tahrirlaydi. Soddaroq kundalik ishda Paint qulay, murakkab foto montaj, qatlam maskalari va rang tuzatishda Photoshop singari dasturlar kengroq vosita beradi. Natijani dastur brendiga emas, vazifaga qarab baholang."
  },
  {
    "type": "case",
    "content": "Rasmni tez kesish va belgilash uchun Paint yetarli; uch xil suratni tabiiy montaj qilishda qatlamlar, maska va adjustment layer kerak bo‘lishi mumkin."
  },
  {
    "type": "trap",
    "content": "«Professional» dastur har bir oddiy vazifada eng tez yoki eng yaxshi yechim degani emas."
  },
  {
    "type": "task",
    "content": "1-mashq. Maktab uchun belgini kesish va foto montaj qilish vazifalariga mos muharrir va sababini tanlang."
  },
  {
    "type": "heading",
    "content": "2. Paint tarixi va zamonaviy qatlamlar"
  },
  {
    "type": "definition",
    "content": "Eski MS Paint talqinlari asosan bitta rastr maydonida ishlagan. Windows 11 uchun yangilangan Paintda Layers (qatlamlar) mavjud: alohida qatlamlarni tahrirlash, joylashuvini o‘zgartirish va birlashtirish mumkin. Funksiya operatsion tizim hamda Paint versiyasiga bog‘liq."
  },
  {
    "type": "example",
    "content": "Windows 11 Paintda fon surati va yozuvni ikki qatlamga joylashtiring, matnni siljiting va fon buzilmaganini tekshiring. Eski kompyuterda funksiya bo‘lmasa muqobil dastur ishlating."
  },
  {
    "type": "trap",
    "content": "«Paintda qatlam hech qachon yo‘q» degan eski jadval 2026-yildagi Microsoft Paint uchun xato. Shu bilan birga Paintda qatlam borligi uni Photoshopning barcha maska va Smart Object vositalariga teng qilmaydi."
  },
  {
    "type": "task",
    "content": "2-mashq. Nega qatlam mavjudligi va professional tahrir chuqurligi ikki alohida mezon ekanini tushuntiring."
  },
  {
    "type": "heading",
    "content": "3. Ish muhiti va panel vazifalari"
  },
  {
    "type": "definition",
    "content": "Grafik muharrirda ishchi kanvas, asboblar paneli, rang tanlagich, qatlamlar ro‘yxati va menyular mavjud bo‘lishi mumkin. Photoshopda Window → Layers panelni ko‘rsatadi, lekin uning ekrandagi joyi workspace sozlamasi bilan o‘zgarishi mumkin. Paint interfeysi versiyadan versiyaga farq qiladi."
  },
  {
    "type": "solved",
    "content": "Photoshopda Layers panel ko‘rinmasa Window → Layersni sinab ko‘ring; biror toolbar yo‘qolgani butun fayl buzildi degani emas."
  },
  {
    "type": "trap",
    "content": "«Qatlamlar paneli qat’iy faqat o‘ng tomonda» emas: bu odatiy default joylashuv, foydalanuvchi sozlashi mumkin."
  },
  {
    "type": "task",
    "content": "3-mashq. Kanvas, toolbar, options bar va Layers panel vazifalarini to‘rtta aniq misol bilan farqlang."
  },
  {
    "type": "heading",
    "content": "4. Yangi loyiha: kanvas va rang sozlamasi"
  },
  {
    "type": "definition",
    "content": "Yangi rastr hujjat ochishda eni/bo‘yi, piksel o‘lchami, rang rejimi, fon va saqlash formati aniqlanadi. Ekran maketi bilan bosma loyiha turli o‘lcham va rang profiliga ega bo‘lishi mumkin. Hujjatni boshlashdan avval talabni yozish keyingi xatoni kamaytiradi."
  },
  {
    "type": "case",
    "content": "1024×768 ekran plakati va 210×297 mm bosma varaq uchun bir xil fayldan foydalanishdan avval piksel hisobini, chop xizmatining profilini va kesish bo‘shligini tekshiring."
  },
  {
    "type": "trap",
    "content": "«300 DPI»ni tanlash rasmdagi mavjud kam pikselni to‘liq sifatli bosma elementga aylantirmaydi."
  },
  {
    "type": "task",
    "content": "4-mashq. Bosma va mobil ekran uchun ikki turdagi yangi loyiha parametrlarini yozing."
  },
  {
    "type": "heading",
    "content": "5. Brush, Eraser, Shape va Text"
  },
  {
    "type": "definition",
    "content": "Brush (mo‘yqalam), Eraser (o‘chirg‘ich), Fill, Line, Shape va Text kabi asboblar turli vazifaga xizmat qiladi. Qatlamli ishda qaysi qatlam faol ekanini aniqlab, xatoni zudlik bilan Undo bilan qaytaring. Matnni rastrga aylantirmasdan oldin ishchi nusxa saqlang."
  },
  {
    "type": "example",
    "content": "Alohida matn qatlamida sarlavhani kiriting, rangini o‘zgartiring, fon qatlami ustiga joylashtiring va keyin yozuvga qayta tahrir qilish imkonini tekshiring."
  },
  {
    "type": "trap",
    "content": "Eraser bilan pikselni o‘chirib tashlash maskada ko‘rinishni yashirishdan farq qiladi."
  },
  {
    "type": "task",
    "content": "5-mashq. Uch asbobni va qaysi qatlamda ishlatishni rejalang."
  },
  {
    "type": "heading",
    "content": "6. Qatlamlar paneli: tartib, opacity va blend"
  },
  {
    "type": "definition",
    "content": "Layers panel qatlamlarning ketma-ketligi va ko‘rinishini boshqaradi. Yuqori qatlam ko‘pincha pastdagi elementni berkitadi; Opacity shaffoflik darajasini, blend mode qatlam rangining pastki qatlam bilan qanday uyg‘unlashishini belgilaydi. Guruhlar katta loyihani tartibli qiladi."
  },
  {
    "type": "solved",
    "content": "Fon, surat, logotip va sarlavha to‘rt qatlamda. Logotip yo‘qolsa qatlam yashirilmaganini va boshqa katta qatlam ostida qolmaganini tekshiring."
  },
  {
    "type": "trap",
    "content": "Opacity 0% obyekt yo‘qligini bildirmaydi; eksportdan oldin keraksiz yashirilgan qatlamlar tekshirilsin."
  },
  {
    "type": "task",
    "content": "6-mashq. 4 qatlamli afisha uchun Layer tartibi va ko‘rinish rejasini yozing."
  },
  {
    "type": "heading",
    "content": "7. Adjustment layer va nondestruktiv tuzatish"
  },
  {
    "type": "definition",
    "content": "Adjustment layer rang yoki tonni bevosita asl pikselga qaytarib bo‘lmas yozib qo‘ymasdan boshqarishga yordam beradi. U keyin sozlanishi, yashirilishi yoki maska bilan cheklanishi mumkin; Photoshopda ko‘p holatda pastdagi qatlamlarga ta’sir qiladi."
  },
  {
    "type": "case",
    "content": "Foto sariq tusga kirgan: asl surat qatlamini saqlab, Hue/Saturation yoki Levels adjustment layer orqali tuzating; keyin effektni o‘chirib farqni solishtiring."
  },
  {
    "type": "trap",
    "content": "Qatlamli loyiha JPEGga tekis eksport qilinganda oldingi nondestruktiv boshqaruv yo‘qolishi mumkin."
  },
  {
    "type": "task",
    "content": "7-mashq. To‘q suratni asl holatini saqlab tuzatish uchun bosqichlarni yozing."
  },
  {
    "type": "heading",
    "content": "8. Layer Mask va alfa nazorati"
  },
  {
    "type": "definition",
    "content": "Layer maskda odatda oq qism ko‘rinadi, qora qism yashiriladi, kulrang esa qisman ko‘rinish beradi. Asl surat pikseli maska sabab doimiy o‘chirilmasligi mumkin; uni keyin qayta ochish oson. Kichik qatlam panelidagi aktiv miniatyura — rasmmi yoki maskami — tekshiriladi."
  },
  {
    "type": "example",
    "content": "Ikki suratni birlashtirishda yuqoridagi rasm maskasida yumshoq gradient ishlatib, pastki rasmga silliq o‘tish hosil qiling."
  },
  {
    "type": "trap",
    "content": "Maskaning qora qismida turgan piksel fayldan avtomatik o‘chmagan. Maskani qo‘llash va maskada chizish turli bosqich."
  },
  {
    "type": "task",
    "content": "8-mashq. Oq–qora–kulrang maskaning vazifasini sxemada tushuntiring."
  },
  {
    "type": "heading",
    "content": "9. Smart Object va masshtab"
  },
  {
    "type": "definition",
    "content": "Photoshopdagi Smart Object transformatsiya va joylashtirilgan kontentni ko‘plab amalda asl manbaga tayanib tahrirlashga yordam beradi. Rasterize qilingach ayrim qaytariladigan xususiyatlar yo‘qolishi mumkin. Paint odatda bunday murakkab Smart Object tizimini taklif qilmaydi."
  },
  {
    "type": "solved",
    "content": "Kichik logotipni takror o‘lchamini o‘zgartirish kerak; manba vektor yoki Smart Objectni saqlang va bir necha qayta kattalashtirishda natijani solishtiring."
  },
  {
    "type": "trap",
    "content": "Smart Object asl rasmda yo‘q tafsilotni sehrli ravishda tiklamaydi; juda past aniqlik chegarasi saqlanadi."
  },
  {
    "type": "task",
    "content": "9-mashq. Qaysi ishni rasterizatsiyadan oldin alohida nusxada saqlash kerakligini tushuntiring."
  },
  {
    "type": "heading",
    "content": "10. Asboblarni tanlash va versiya noaniqligi"
  },
  {
    "type": "definition",
    "content": "Photo Editor interfeyslari ishchi maydon, versiya va operatsion tizimga qarab o‘zgaradi. Asbob nomlari, ikonka va joylashuvni faqat yodlash emas, bajaradigan funksiyasiga qarab izlash to‘g‘ri. Rasm, qatlam va maskani tahrirlash kontekstini ajrating."
  },
  {
    "type": "case",
    "content": "Noutbukdagi Photoshop ish maydoni sinf kompyuteridan farq qiladi. O‘qituvchi «qatlamlar panelini ko‘rsatish» vazifasini asosiy obyektlar va Window menyusi bilan tushuntiradi."
  },
  {
    "type": "trap",
    "content": "Bir versiyada bo‘lgan yangi AI funksiyasi barcha eski Paint yoki Photoshopda ishlashi shart emas; litsenziya va uskuna farq qiladi."
  },
  {
    "type": "task",
    "content": "10-mashq. Versiyaga bog‘liq ikki buyruq bo‘yicha aniq bo‘lmagan test savolini qanday tuzatishni yozing."
  },
  {
    "type": "heading",
    "content": "11. Saqlash: ishchi fayl va eksport"
  },
  {
    "type": "definition",
    "content": "PSD qatlam, maska va adjustment imkoniyatlarini saqlashga mos ishchi format. Paintning yangi versiyasidagi loyiha/eksport imkoniyatlari tanlangan format va versiyaga bog‘liq; bir qatlamli PNG/JPEG eksportda tahririy qatlamlar saqlanishiga ishonmang. File → Save As bilan asl nusxani ehtiyot qiling."
  },
  {
    "type": "example",
    "content": "`tadbir_asl.psd` va `tadbir_web.png` saqlang; ikkinchisini boshqalarga yuborishdan oldin rang, shaffoflik, hajm va fayl ochilishini tekshiring."
  },
  {
    "type": "trap",
    "content": "Fayl kengaytmasini qo‘lda o‘zgartirish asl qatlamli struktura yoki grafik sifatni yaratmaydi."
  },
  {
    "type": "task",
    "content": "11-mashq. Bir ishchi fayl, ikkita eksport va zaxira nusxa nomlash tizimini tuzing."
  },
  {
    "type": "heading",
    "content": "12. Mualliflik, tasvir xavfsizligi va sifat nazorati"
  },
  {
    "type": "definition",
    "content": "Rasmda tanib olinadigan shaxs, mualliflik huquqi va maxfiy ma’lumot bor-yo‘qligini tekshiring. Dizayn bahosi manba, o‘qilish, kontrast, ma’lumot haqqoniyligi va dasturdan mustaqil ochilish sinovlarini qamrab oladi."
  },
  {
    "type": "solved",
    "content": "Maktab tadbiridagi suratni ommaviy plakatta ishlatishdan oldin tegishli ruxsatlarni tekshiring, yuzlar yoki shaxsiy ma’lumotlar borligiga e’tibor bering."
  },
  {
    "type": "trap",
    "content": "Rasmni ko‘chirish osonligi undan ommaviy foydalanish mumkinligini anglatmaydi; foydalanuvchiga litsenziyani tekshiring."
  },
  {
    "type": "task",
    "content": "12-mashq. Yakuniy afisha uchun manba, rozilik, o‘qilish va fayl sinovidan iborat ro‘yxat yozing."
  },
  {
    "type": "summary",
    "content": "Paintning Windows 11 yangilangan versiyasida qatlamlar bor; bu asosiy fakt eski «Paintda qatlam yo‘q» qoidasini bekor qiladi. Photoshopning keng imkoniyatlari — layer mask, adjustment layer, Smart Object, guruhlar va nazoratli eksport. Ishchi loyiha faylini saqlab, PNG/JPEG eksportni alohida tekshirish kerak."
  },
  {
    "type": "answers",
    "content": "1) vazifaga mos dastur tanlanadi; 2) ikkala muharrir ham qatlamga ega bo‘lishi mumkin, Photoshop murakkab nondestruktiv mexanizmga ega; 3) Window → Layers, panel joyi o‘zgaruvchan; 4) kanvas o‘lcham, rang va maqsad; 5) faol qatlam belgilanadi; 6) qatlam tartibi, opacity; 7) adjustment layer asl pikselni saqlaydi; 8) oq ko‘rsatadi, qora yashiradi, kulrang qisman; 9) Smart Object ham past aniqlikni o‘zgartirmaydi; 10) interfeys versiyasini tekshirish; 11) ishchi PSD va eksport nusxa; 12) rozilik/manba/fayl sinovi. Javoblar tasnifga mos asoslantiriladi."
  },
  {
    "type": "source",
    "content": "Manba doirasi: Cambridge+ 8-sinf «Informatika va axborot texnologiyalari», bosma 121–123-betlar — qatlam/raster/vector (https://drive.google.com/file/d/1hZyLM5n0OUtuJI3M3dFeAz8kyv9Sr6Ng/view); Cambridge+ 10–11-sinf tasvir formati/qatlam tushunchalari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view); Microsoft Paint rasmiysi (https://www.microsoft.com/en-US/windows/paint) va 2026 release notes (https://learn.microsoft.com/en-us/windows-insider/release-notes/apps/paint); Adobe Layers (https://helpx.adobe.com/photoshop/desktop/create-manage-layers/create-layer-compositions/create-layers-and-layer-groups.html) va Mask (https://helpx.adobe.com/photoshop/desktop/create-masks/layer-masks/edit-and-refine-layer-masks.html). Izohlar original qayta bayon; barcha fizik PDF sahifa/rasm 1:1 tekshirilgani tasdiqlanmagan."
  }
]

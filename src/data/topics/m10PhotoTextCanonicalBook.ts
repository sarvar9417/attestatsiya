/** TASK-304: source-grounded photo text and retouch chapter. */
import type { TheoryBlock } from '../topicContent'
export const M10_04_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "Matn va fotosuratni xavfsiz tahrirlash, Crop/Resize, Type, Levels/Curves, Hue/Saturation, Clone Stamp, Sharpen/Blur, maska va eksport farqlarini bilish; amaliy sifat mezonini tuzish."
  },
  {
    "type": "intro",
    "content": "Grafik tahrirning markazida obyektning ma’nosi va uning haqqoniy ko‘rinishi turadi. Ushbu dars fotoga matn qo‘shishdan tortib nondestruktiv retush va format tanlashgacha bo‘lgan ish ketma-ketligini real masala bilan o‘rgatadi."
  },
  {
    "type": "table",
    "content": "| Amal | Maqsad | Tekshiruv |\n|---|---|---|\n| Crop | Kadrni cheklash | Muhim obyekt saqlanganmi? |\n| Levels/Curves | Tonni moslash | Detail yo‘qolmadi-mi? |\n| Hue/Saturation | Rangni sozlash | Rang tabiiyligicha qoldimi? |\n| Clone Stamp | Lokal nusxali retush | Sun’iy takror yo‘qmi? |\n| Layer Mask | Qaytariladigan ajratish | Chetlar sifatlimi? |"
  },
  {
    "type": "heading",
    "content": "1. Fotoni tahrirlashdan oldingi maqsad va original"
  },
  {
    "type": "definition",
    "content": "Foto tahriri kadrlash, rang, yorug‘lik, ortiqcha dog‘ yoki matn joylashuvini tuzatishdir. Dastlab qaysi auditoriya, qaysi format va qaysi huquqiy sharoitda ishlatilishini aniqlang. Originalni alohida saqlab, ishchi nusxada ishlash keyingi tuzatishni osonlashtiradi."
  },
  {
    "type": "case",
    "content": "Maktab e’lonidagi foto yoniga sana va joy yozilishi kerak: yuzni kesib tashlamasdan matn uchun bo‘sh joy qoldiring, ruxsatni tekshiring."
  },
  {
    "type": "trap",
    "content": "Yaxshi ko‘rinayotgan preview barcha eksport va mualliflik masalasi hal bo‘ldi degani emas."
  },
  {
    "type": "task",
    "content": "1-mashq. Sinf tadbiri fotosi uchun maqsad, ruxsat va ishchi/eksport fayl rejasini tuzing."
  },
  {
    "type": "heading",
    "content": "2. Crop va kompozitsiya"
  },
  {
    "type": "definition",
    "content": "Crop kadrning chegarasini o‘zgartiradi, Resize esa mavjud piksel o‘lchamini o‘zgartiradi. Thirds rule kompozitsiya uchun yo‘l-yo‘riq, majburiy qonun emas; asosiy obyekt va matnni yaxshi o‘qish uchun bo‘sh joy muhim."
  },
  {
    "type": "solved",
    "content": "16:9 fotosuratdan 1:1 avatar tayyorlashda asosiy obyektni saqlaydigan Crop tanlang, so‘ng yakuniy 512×512 eksportni tekshiring."
  },
  {
    "type": "trap",
    "content": "300 PPI metadata yetishmagan piksel detalini yaratmaydi; keraksiz Crop ham foydali kontekstni yo‘qotadi."
  },
  {
    "type": "task",
    "content": "2-mashq. Crop va Resize farqini bittadan hisobli misol bilan izohlang."
  },
  {
    "type": "heading",
    "content": "3. Type Tool va matn qatlamlari"
  },
  {
    "type": "definition",
    "content": "Photoshop Type Tool matn obyektini yaratadi; shrift, o‘lcham, satr oralig‘i, qalinlik va rang o‘qilishi uchun birgalikda tanlanadi. Matnni alohida qatlamda saqlash keyin sana yoki xatoni tuzatishni yengillashtiradi."
  },
  {
    "type": "example",
    "content": "Oq fonning och qismidagi oq matn o‘qilmayapti: kontrastli panel yoki matn joyini o‘zgartirib, telefonda tekshiring."
  },
  {
    "type": "trap",
    "content": "Glow va Shadow bezaklari rang kontrasti yetarli emasligini avtomatik bartaraf etmaydi."
  },
  {
    "type": "task",
    "content": "3-mashq. Bir afisha sarlavhasi va izohi uchun iyerarxiya, rang hamda qatlam rejasini yozing."
  },
  {
    "type": "heading",
    "content": "4. Brightness, Contrast va ekspozitsiya"
  },
  {
    "type": "definition",
    "content": "Brightness umumiy yorqinlik, Contrast to‘q va och tonlar farqi. Ekspozitsiya kamera orqali olingan yorug‘lik miqdoriga bog‘liq; muharrirda tonni o‘zgartirish ayrim yo‘qolgan detallarning qaytishini kafolatlamaydi. Histogram tonal taqsimotni ko‘rsatadi."
  },
  {
    "type": "case",
    "content": "Qorong‘i suratda oldin histogramni tekshiring, keyin tonal tuzatishni asta o‘zgartirib, soyada detail saqlanishiga qarang."
  },
  {
    "type": "trap",
    "content": "Kontrastni haddan ziyod oshirish oq-qora chegaralarda clipping hosil qilib, detallarni yo‘qotishi mumkin."
  },
  {
    "type": "task",
    "content": "4-mashq. Kontrasti past foto va ortiqcha yorug‘ foto uchun ikki xil tuzatish rejasini yozing."
  },
  {
    "type": "heading",
    "content": "5. Levels va Curves"
  },
  {
    "type": "definition",
    "content": "Levels qora nuqta, oq nuqta va o‘rta tonni boshqarishi mumkin. Curves kirish va chiqish yorqinligi orasidagi munosabatni grafik chiziq orqali nazorat qiladi. Adjustment Layer bilan ishlash asl pikselni shikastlamasdan qayta sozlashga yordam beradi."
  },
  {
    "type": "solved",
    "content": "Yuqori kontrastli S-simon Curves tasvirga kuchli urg‘u berishi mumkin; ammo avval keyin taqqoslab, oq yuzlarda detal yo‘qolmasligini tekshiring."
  },
  {
    "type": "trap",
    "content": "Levels va Curves faqat bitta tugma bilan barcha rang xatosini avtomatik tuzatadigan sehrli vosita emas."
  },
  {
    "type": "task",
    "content": "5-mashq. Levels bilan Curvesning boshqaruv ko‘rinishini va bitta umumiy imkoniyatini yozing."
  },
  {
    "type": "heading",
    "content": "6. Hue/Saturation va rang balansi"
  },
  {
    "type": "definition",
    "content": "Hue rang tusini, Saturation rang to‘yinganligini boshqaradi. Color Balance va White Balance yoritish manbasi sabab yuzaga kelgan rang og‘ishini me’yoriga keltirishi mumkin. Rang tuzatish ilmiy yoki hujjat tasviridagi faktlarni noto‘g‘ri aks ettirmasligi kerak."
  },
  {
    "type": "example",
    "content": "Ichki xona fotosi sariq tusda: oq fonni solishtirib neytrallashtiring, odam yuzining tabiiy ko‘rinishini tekshiring."
  },
  {
    "type": "trap",
    "content": "Saturationni oshirish hamma suratni sifatli qilmaydi; semantik ranglar va teri tusi buzilishi mumkin."
  },
  {
    "type": "task",
    "content": "6-mashq. Hue va Saturation farqini uchta oddiy rang misolida izohlang."
  },
  {
    "type": "heading",
    "content": "7. Clone Stamp va retush etikasi"
  },
  {
    "type": "definition",
    "content": "Clone Stamp tanlangan manba piksellarini boshqa joyga nusxalab, lokal dog‘ yoki shikastni tuzatadi. Manba nuqtasini to‘g‘ri belgilash, brush yumshoqligi va namuna qatlami muhim. Red Eye Tool yoki boshqa qizil ko‘z tuzatish usuli aniq sababga mos qo‘llansin."
  },
  {
    "type": "case",
    "content": "Foto burchagidagi chang dog‘ini yonidagi o‘xshash teksturadan Alt/Option orqali namuna olib yoping; chegaradagi takror naqsh paydo bo‘lmaganini tekshiring."
  },
  {
    "type": "trap",
    "content": "Clone Stamp faktik muhim obyektni yashirish uchun ishlatilsa auditoriyani chalg‘itishi mumkin; hujjat va ilmiy foto uchun etik mezon alohida."
  },
  {
    "type": "task",
    "content": "7-mashq. Retush bilan faktni soxtalashtirish orasidagi chegarani vaziyatda tushuntiring."
  },
  {
    "type": "heading",
    "content": "8. Blur, Sharpen va filtrlar"
  },
  {
    "type": "definition",
    "content": "Blur yumshatadi, Sharpen mavjud qirralar kontrastini oshiradi; yangi original detalni yaratmaydi. Filtr kuchini tasvir maqsadi va yakuniy o‘lchamga qarab tanlang. Smart Filter kabi usul qayta tahrirga qulay bo‘lishi mumkin."
  },
  {
    "type": "solved",
    "content": "Taniqlik yetarli bo‘lmagan suratni Sharpen bilan kuchaytirib, kontur atrofida halo paydo bo‘lsa intensivlikni kamaytiring."
  },
  {
    "type": "trap",
    "content": "Filtrlar asl yuqori aniqlikni qayta tiklamaydi; ortiqcha sharpen shovqin va artefaktni kuchaytiradi."
  },
  {
    "type": "task",
    "content": "8-mashq. Xira foto uchun qaysi holatda qayta suratga olish filtrlashdan yaxshiroq, izohlang."
  },
  {
    "type": "heading",
    "content": "9. Qatlam maskasi va qaytariladigan montaj"
  },
  {
    "type": "definition",
    "content": "Layer Mask oq rang bilan ko‘rsatadi, qora bilan yashiradi, kulrangda qisman ko‘rsatadi. Nondestruktiv tahrir asl piksellarni saqlash va keyin tuzatishga imkon beradi. Kompozitsiyada aktiv maska miniatyurasi tanlanganini tekshirish zarur."
  },
  {
    "type": "example",
    "content": "Obyektni fondan ajratib, yangi fon ustiga qo‘ying; maskaning chetini yumshoq Brush bilan moslang va asl fotoni alohida saqlang."
  },
  {
    "type": "trap",
    "content": "Bir qatlamni o‘chirib yuborish va maska bilan yashirish qayta tahrir uchun teng natija emas."
  },
  {
    "type": "task",
    "content": "9-mashq. Ikki fotoni birlashtirishda maska va qatlam tartibini ketma-ket yozing."
  },
  {
    "type": "heading",
    "content": "10. Matnni egri yo‘lga joylashtirish"
  },
  {
    "type": "definition",
    "content": "Path bo‘ylab Type ishlatish matnni egri chiziqga mos joylashtirishga xizmat qiladi; path yordamchi geometriya, harfning o‘zi alohida tahrirlanadigan matn qolishi mumkin. Dizaynda bezak aniqlik va o‘qilishga xalal bermasin."
  },
  {
    "type": "case",
    "content": "Doira bo‘ylab «Fan haftaligi» yozuvi tayyorlang, uni 200% kattalashtirib harflar ajralib o‘qilishini sinang."
  },
  {
    "type": "trap",
    "content": "Juda egri chiziqqa kichik matn berish bezak yaratadi, lekin o‘qilishni pasaytirishi mumkin."
  },
  {
    "type": "task",
    "content": "10-mashq. Egri matndan foydalanish foydali va zararli bo‘ladigan ikki holatni yozing."
  },
  {
    "type": "heading",
    "content": "11. Chop, ekran va format eksporti"
  },
  {
    "type": "definition",
    "content": "Loyiha PSD kabi qatlamli faylda, tarqatiladigan tasvir esa PNG/JPEG/TIFF kabi mos formatda saqlanishi mumkin. Eksportdan so‘ng o‘lcham, rang profili, alpha, yozuv, izoh va chopda kesish chegarasini tekshirish kerak."
  },
  {
    "type": "solved",
    "content": "Elektron plakatni sRGB PNG qilib, bosma varaqni bosmaxona talablari bo‘yicha alohida tayyorlang; ikkisini ochib ko‘ring."
  },
  {
    "type": "trap",
    "content": "Faqat fayl kengaytmasini o‘zgartirish haqiqiy rang profili yoki boshqa tasvir formatini hosil qilmaydi."
  },
  {
    "type": "task",
    "content": "11-mashq. Ishchi, telefon va bosma uchun uch xil fayl nusxasini rejalang."
  },
  {
    "type": "heading",
    "content": "12. Yakuniy mustaqil loyiha va rubrika"
  },
  {
    "type": "definition",
    "content": "Fotosurat asosidagi e’lonni tayyorlashda maqsad, original, Crop, tonal tuzatish, retush, matn, maska va eksportni izchil bajaring. Jarayon fotosi haqida shaffof bo‘lish hamda mualliflik/ruxsat masalasini tekshirish sifat mezonidir."
  },
  {
    "type": "example",
    "content": "Guruhlar ayni foto asosida ikkita e’lon tayyorlaydi: biri telefonda, ikkinchisi A4da. Baholashda matn o‘qilishi, mazmun, izchil rang, fayl sifati va huquq hisobga olinadi."
  },
  {
    "type": "trap",
    "content": "«Chiroyli» subyektiv bahosi kontrast, aniqlik yoki manba bo‘yicha aniq mezonlarning o‘rnini bosmaydi."
  },
  {
    "type": "task",
    "content": "12-mashq. 0–2 balli beshta mezonli rubrika va eng muhim ikki tekshiruvni tuzing."
  },
  {
    "type": "summary",
    "content": "Tahrir: originalni saqlash → kompozitsiya → tonal/rang sozlash → zarur retush → matn → qaytariladigan maska → mos format va tekshiruv. Clone Stamp piksel nusxalaydi; Hue/Saturation tus/to‘yinganlikni, Levels/Curves tonni o‘zgartiradi; Blur va Sharpen sifatni cheksiz oshirmaydi."
  },
  {
    "type": "answers",
    "content": "1) original+ishchi+eksport; 2) Crop kadr, Resize o‘lcham; 3) matn kontrast va alohida qatlam; 4) clipping oldini olish; 5) Levels uch tayanch nuqta, Curves nuqtali graf; 6) Hue va Saturation farqli; 7) Clone Stamp namunasi; 8) halo paydo bo‘lmasin; 9) maskada oq ko‘rsatadi, qora yashiradi; 10) Path egri matn uchun; 11) loyiha va eksport ajratiladi; 12) manba/maqsad/kontrast/aniqlik/fayl sinovi. Ochiq topshiriqlar asosli alternativlarga ega."
  },
  {
    "type": "source",
    "content": "Manbalar: Cambridge+ 10–11-sinf, tasvirni kodlash/qatlamli formatlar (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view); Cambridge+ 8-sinf tasvir/qatlam haqida, bosma 121–123-betlar (https://drive.google.com/file/d/1hZyLM5n0OUtuJI3M3dFeAz8kyv9Sr6Ng/view); Adobe Photoshop Clone Stamp rasmiy 2026 qo‘llanmasi (https://helpx.adobe.com/photoshop/desktop/repair-retouch/heal-clone/retouch-images-with-the-clone-stamp-tool.html). Misollar pedagogik qayta bayon; fizik PDF sahifalarining to‘liq 1:1 verifikatsiyasi tasdiqlanmagan."
  }
]

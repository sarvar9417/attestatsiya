/** TASK-273 — original Cambridge-based graphics, 3D and multimedia theory.
 * Page-by-page source concordance remains an editorial gate.
 */
import type { TheoryBlock } from '../topicContent'
export const M10_GRAPHICS_TEXTBOOK_ADDITIONS: Record<string, TheoryBlock[]> = {
  "M10.01": [
    { type: "heading", content: "Rastr, vektor va rang modeli" },
    { type: "table", content: "| Tushuncha | Tuzilma yoki vazifa | Qaysi xatarga ega? |\n|---|---|---|\n| Rastr | Piksel panjarasi | Kattalashtirganda xiralashadi |\n| Vektor | Geometrik obyektlar | Effektlarni rastrlash talab bo‘lishi mumkin |\n| RGB | Ekrandagi qo‘shiluvchi rang | Bosma natija bilan farqlanadi |\n| CMYK | Bosma jarayonidagi rang ajratish | Ekran va printer farqi |\n| PNG | Ko‘pincha yo‘qotishsiz rastr | Foto uchun hajm katta bo‘lishi mumkin |\n| JPEG | Yo‘qotishli foto siqish | Qayta saqlashda artefaktlar |" },
    { type: "formula", content: "24-bit RGB rastrning siqilmagan piksel xotirasi: eni × bo‘yi × 24 / 8 bayt; fayl hajmi metadata va siqish usuli sabab o‘zgaradi." },
    { type: "example", content: "800 × 600 piksel, 24-bit tasvirning sof piksel hajmi 800 × 600 × 3 = 1 440 000 bayt. JPEG fayli bundan ancha kichik bo‘lishi mumkin, chunki siqiladi." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), grafik tahrir, multimedia va taqdimot bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), audio/video va raqamli grafika mavzulari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Formulali hisob va rang taqqoslash original tushuntirish." },
  ],
  "M10.02": [
    { type: "heading", content: "Grafik tahrir muhitini vazifadan kelib chiqib tanlash" },
    { type: "table", content: "| Amal | Odatdagi vosita | Eslatma |\n|---|---|---|\n| Oddiy chizish | Paint turidagi rastr muharriri | Piksel bilan ishlaydi |\n| Professional foto tahrir | Qatlamli rastr muharriri | Nondestruktiv yo‘l afzal |\n| Logotip va sxema | Vektor muharriri | O‘lchamga moslashadi |\n| Dizayn eksporti | Format va profilni tanlash | Ekran/bosma maqsadiga mos |" },
    { type: "example", content: "Maktab logotipini katta banner va kichik ikonada ishlatish kerak bo‘lsa vektor yo‘l afzal; foto rangini tuzatishda qatlam va maskali rastr tahrir mos keladi." },
    { type: "trap", content: "«Photoshop» dastur nomi, «rastr muharriri» esa dasturlar sinfi. Tasvirga qatlam qo‘shilgani uning faylda har doim qatlamli saqlanishini anglatmaydi: eksportda formatni tekshiring." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), grafik tahrir, multimedia va taqdimot bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), audio/video va raqamli grafika mavzulari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Dastur oynasi va menyu atamalari nashr bo‘yicha farq qiladi." },
  ],
  "M10.03": [
    { type: "heading", content: "Belgilash, maska, kesish va qatlamlarning farqi" },
    { type: "table", content: "| Amal | Nima qiladi? | Qaytarish yo‘li |\n|---|---|---|\n| Selection | Piksel/obyekt sohasini belgilaydi | Tanlovni o‘zgartirish mumkin |\n| Crop | Ko‘rinadigan kadrni kesadi | Originalni asrash kerak |\n| Layer | Kontentni alohida qatlamda saqlaydi | Tartib/ko‘rinishni boshqarish |\n| Mask | Pikselni bekitadi yoki ochadi | Ko‘pincha originalni buzmaydi |\n| Color correction | Rang/yorug‘likni moslaydi | Adjustment layer afzal bo‘lishi mumkin |" },
    { type: "example", content: "Rasmdagi fonni o‘chirib yuborish o‘rniga maska qo‘llash keyinroq tanlangan sohani qayta tiklashni osonlashtiradi. Ishchi loyiha fayli va eksport tasvirini ajratib saqlang." },
    { type: "trap", content: "Qatlamning ko‘rinmas bo‘lishi uning o‘chirilgani degani emas. Kesish (crop) bilan tanlash (selection) ham bir xil amal emas." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), grafik tahrir, multimedia va taqdimot bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), audio/video va raqamli grafika mavzulari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Nondestruktiv tahrir tafsilotlari original metodik qo‘shimcha." },
  ],
  "M10.04": [
    { type: "heading", content: "Foto, matn va kompozitsiyani o‘qiladigan qilish" },
    { type: "table", content: "| Omil | Talab | Tekshirish |\n|---|---|---|\n| Rezolyutsiya | Vazifaga mos aniqlik | Katta chiqarilganda piksel ko‘rinmaydimi? |\n| Kontrast | Matn va fon farqi yetarli | O‘qish qiyin emasmi? |\n| Iyerarxiya | Muhim axborot ko‘zga tashlanadi | Ko‘ruvchi sarlavhani topadimi? |\n| Rang | Mazmun uchun ishlatiladi | Rangni ko‘rmaydiganlar tushunadimi? |\n| Manba | Mualliflik va foydalanish huquqi | Tasvir manbasi qayd etilganmi? |" },
    { type: "example", content: "Ochiq rangli surat ustiga oq matn qo‘yilsa, ayrim joyda matn yo‘qolishi mumkin. Fon qoplamasi yoki maxsus matn maydoni yordamida kontrastni boshqaring." },
    { type: "trap", content: "Rasmning piksel o‘lchami va chop etishdagi DPI/PPI bir xil tushuncha emas. Faqat PPI raqamini o‘zgartirish yangi detallar yaratmaydi." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), grafik tahrir, multimedia va taqdimot bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), audio/video va raqamli grafika mavzulari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Sifat va foydalanish huquqi bo‘yicha umumiy pedagogik izoh." },
  ],
  "M10.05": [
    { type: "heading", content: "3D modelning asosiy tarkibiy qismlari" },
    { type: "table", content: "| Atama | Nima? | Misol |\n|---|---|---|\n| Vertex | Fazodagi nuqta | (x,y,z) koordinata |\n| Edge | Ikki uch orasidagi qirra | Model konturi |\n| Face | Yuz/poligon | Uchburchak yoki to‘rtburchak |\n| Mesh | Geometriya to‘plami | 3D obyekt shakli |\n| Material/texture | Sirtning tashqi ko‘rinishi | Yog‘och fakturasi |\n| Camera/light | Renderni kuzatish va yoritish | Kadr yorug‘ligi |" },
    { type: "example", content: "Kublarning sonini ko‘paytirish bilan real geometriya batafsilligi oshadi, ammo poligonlar ko‘payishi ishlash tezligiga ta’sir qilishi mumkin. Vektor chizma va 3D mesh uch o‘lchamli emas yoki bir xil tuzilma emas." },
    { type: "trap", content: "Tekstura geometriyani almashtirmaydi: sirtga chizilgan g‘isht rasmi devorning real bo‘rtig‘ini har doim yaratmaydi. Renderdagi ko‘rinish yorug‘lik, kamera va materialga bog‘liq." },
    { type: "source", content: "Manba doirasi: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), grafik tahrir, multimedia va taqdimot bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), audio/video va raqamli grafika mavzulari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). 3D terminlarni tushuntirish mualliflik sintezi, 3D dasturining barcha buyruqlari audit qilinmagan." },
  ],
  "M10.06": [
    { type: "heading", content: "Animatsiya: kadr, vaqt va tayanch holatlar" },
    { type: "table", content: "| Tushuncha | Vazifa |\n|---|---|\n| Timeline | Vaqt bo‘yicha joylashuv |\n| Frame | Animatsiyaning bitta tasviri |\n| Keyframe | Muhim holatning chegarasi |\n| Tween | Oraliq harakatni hisoblash |\n| FPS | Bir sekunddagi kadrlar soni |\n| Easing | Harakatning tezlanish/sekinlashish shakli |" },
    { type: "example", content: "Obyekt 2 soniyada 60 kadrli animatsiya bilan joyini o‘zgartirsa, 30 FPS rejimda ikki soniya davomiylik hosil bo‘ladi. Harakatning tabiiy ko‘rinishi faqat kadr soniga emas, vaqt taqsimoti va easingga ham bog‘liq." },
    { type: "trap", content: "Slayd animatsiyasi va video animatsiyasi turli ishlab chiqish muhitiga ega. **Kadr chastotasi** ekran rezolyutsiyasi emas; katta FPS fayl/kuch talabini oshirishi mumkin." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), grafik tahrir, multimedia va taqdimot bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), audio/video va raqamli grafika mavzulari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Timeline/keyframe tushunchalarining mualliflik tahlili." },
  ],
  "M10.07": [
    { type: "heading", content: "Raqamli audio va videoning hisoblanadigan xususiyatlari" },
    { type: "table", content: "| Xossa | Izoh | Vazifaga ta’siri |\n|---|---|---|\n| Sampling rate | Sekundda olinadigan audio namuna soni | Tovush chastota qamrovi |\n| Bit depth | Namuna aniqligi | Audio amplituda detali |\n| Channels | Mono, stereo va boshqalar | Bir necha tovush oqimi |\n| Video resolution | Kadrdagi piksel o‘lchami | Detal miqdori |\n| FPS | Sekunddagi kadrlar | Harakat silliqligi |\n| Bitrate | Sekunddagi kodlangan bitlar | Fayl hajmi va sifat muvozanati |" },
    { type: "formula", content: "Siqilmagan PCM audio bayti ≈ sekund × namuna chastotasi × bit chuqurligi × kanal soni / 8. Siqilgan fayl va metadata buning bilan aniq teng bo‘lmasligi mumkin." },
    { type: "example", content: "44 100 Hz, 16-bit, stereo, 60 soniyalik siqilmagan PCM audio uchun sof namuna hajmi 44 100 × 16 × 2 × 60 / 8 = 10 584 000 bayt. Shu audioni kodek bilan siqish fayl hajmini kamaytiradi." },
    { type: "trap", content: "**Kodek** kodlash/siqish usuli, **konteyner** esa audio/video oqimlarini joylashtirish formati. MP4 konteyneri bitta universal kodek degani emas." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), grafik tahrir, multimedia va taqdimot bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), audio/video va raqamli grafika mavzulari (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). PCM hisob misoli manba terminlari asosida qayta tuzildi." },
  ],
}

/** TASK-337: independently navigable 2026 Photoshop learning path.
 * This is learning content, not a claim that additional published exam questions exist.
 * Spec: 2026 Informatika test specification, Grafika va veb (27–31).
 * Source: 7-sinf ICT (2021), printed lessons 13–18, pp. 50–79.
 */
import type { TheoryBlock } from '../topicContent'

export const PHOTOSHOP_STUDY_STAGES = [
  {
    id: 'M10.02',
    title: '1. Photoshop interfeysi va asboblari',
    textbook: '7-sinf: 13-dars, 50–56-betlar',
    topics: 'Workspace, Tools, Options, Layers, File/Open/New, asbob vazifalari va Paint farqi',
  },
  {
    id: 'M10.03',
    title: '2. Tanlash, kesish, rang va qatlamlar',
    textbook: '7-sinf: 14–15-darslar, 57–66-betlar',
    topics: 'Marquee/Lasso/Magic Wand, Crop, rang berish, qatlamlar, maska, amallar farqi',
  },
  {
    id: 'M10.04',
    title: '3. Matn, fotomontaj va tayyor dizayn',
    textbook: '7-sinf: 17–18-darslar, 67–79-betlar',
    topics: 'Type, matn effekti, foto retush, fon almashtirish, PSD va eksport, sahifa dizayni',
  },
] as const

/** Original worked exercises, not copied textbook passages.
 * The canonical 12-chapter books remain intact and precede these labs.
 */
export const M10_PHOTOSHOP_PRACTICAL_LABS: Partial<Record<string, TheoryBlock[]>> = {
  'M10.02': [
    { type: 'heading', content: 'Photoshop amaliyoti 1 — yangi loyiha va ish muhiti' },
    { type: 'goal', content: '2026 spetsifikatsiyasidagi «Adobe Photoshopda tasvir yaratish va tahrirlash» talabining birinchi qadami: fayl yaratish, panel topish, faol asbob va qatlamni tushunish.' },
    { type: 'table', content: '| Buyruq yoki panel | Vazifa | Nazorat savoli |\n|---|---|---|\n| File → New | Yangi kanvas va piksel o‘lchami | 1200×800 piksel nimani bildiradi? |\n| File → Open | Mavjud foto/hujjatni ochish | Original fayl qayerda? |\n| Tools | Move, Brush, Shape, Type kabi asbobni tanlash | Qaysi asbob faol? |\n| Options bar | Faol asbobning parametrlarini sozlash | O‘lcham/opasity qayerda? |\n| Window → Layers | Qatlamlar panelini ko‘rsatish | Qaysi qatlam tanlangan? |\n| File → Save As | Tahrirlanadigan ishchi nusxani saqlash | PSD va eksport farqi nima? |' },
    { type: 'solved', content: '**Bajarib ko‘ring.** 1) File → New orqali 1200×800 px RGB hujjat oching. 2) Fonni alohida qatlamda yarating. 3) Shape bilan to‘rtburchak chizing, Type bilan sarlavha kiriting. 4) Window → Layers orqali obyektlar alohida qatlamlarda ekanini tekshiring. 5) Ishchi faylni PSD sifatida saqlang; PNGni alohida eksport qiling.' },
    { type: 'trap', content: '1200×800 = 960 000 piksel; 24 bitli RGB xom tasvir xotirasi 2 880 000 bayt bo‘ladi. PSD yoki PNG faylining diskdagi hajmi aynan shu raqamga teng bo‘lishi shart emas.' },
    { type: 'case', content: '**Darslikning 13-darsidagi asboblar paneli.** Move Tool (V) tanlangan qatlamni yoki belgilangan sohani siljitadi; Rectangular Marquee (M) to‘g‘ri to‘rtburchak tanlaydi; Lasso (L) ixtiyoriy kontur bo‘ylab tanlaydi; Type Tool (T) matn yaratadi. Window → Layers panelni ochadi (ko‘p desktop versiyalarda F7 ham mavjud; klaviatura sozlamalari farqlanadi). Panels/Options/Tools joylashuvi versiyaga qarab o‘zgarishi mumkin.' },
    { type: 'task', content: '**Mustaqil loyiha.** 600×400 px banner tayyorlang: fon, shakl va yozuv alohida qatlamda bo‘lsin. Faol qatlamni almashtirmasdan Brush ishlatilsa nima xato ketishini tushuntiring.' },
    { type: 'answers', content: 'Tekshiruv: File → New yangi hujjat, Open mavjud fayl; Tools asbobni tanlaydi, Options uning sozlamasini ko‘rsatadi; Layers faol qatlamni boshqaradi; PSD qatlamli tahrir uchun, PNG esa tarqatish uchun. Dastur versiyasiga qarab panel joylashuvi o‘zgaradi.' },
    { type: 'source', content: 'Manbalar: [ICT 7-sinf (2021), 13-dars, 50–56-betlar](https://drive.google.com/file/d/1QMT7y-6nJLQ-f1-4SySBV8y8JrRpp4q-/view); [Adobe 2026 — Workspace](https://helpx.adobe.com/photoshop/desktop/get-started/learn-the-basics/workspace-overview.html); [Adobe — Save your work](https://helpx.adobe.com/photoshop/desktop/save-and-export/save-files/save-your-work.html). Mustaqil o‘quv misollari, darslikning so‘zma-so‘z ko‘chirmasi emas.' },
  ],
  'M10.03': [
    { type: 'heading', content: 'Photoshop amaliyoti 2 — obyektni ajratish va fonni saqlab qolish' },
    { type: 'goal', content: '7-sinf darsligining 14–15-darslari asosida tanlash, kesish, qatlam, rang va maskani bir-biridan farqlash va ish jarayonida to‘g‘ri qo‘llash.' },
    { type: 'table', content: '| Amal | Maqsad | Nima o‘zgarmaydi? |\n|---|---|---|\n| Marquee/Lasso | Ish hududini belgilash | Tanlovning o‘zi pikselni o‘chirmaydi |\n| Magic Wand | O‘xshash rang sohalarini belgilash | Tolerance natijaga ta’sir qiladi |\n| Crop | Kadr chegarasini o‘zgartirish | Rezolyutsiya oshib ketmaydi |\n| Resize | Piksel o‘lchamini o‘zgartirish | O‘chirilgan detal qaytmaydi |\n| Layer Mask | Qatlamning qaysi qismi ko‘rinishini boshqarish | Original piksellar saqlanishi mumkin |' },
    { type: 'solved', content: '**Fotomontaj amaliyoti.** 1) File → Open orqali portretni oching, ishchi nusxani PSD qilib saqlang. 2) Select Subject yoki mos Lasso/Quick Selection orqali odamni tanlang; chetini tekshiring. 3) Layers panelida tanlangan qatlamga Reveal Selection maskasini qo‘shing. 4) Boshqa fon qatlamini pastga joylashtiring. 5) Maska thumbnailini tanlab qora Brush bilan yashiring, oq bilan xatoni tuzating. 6) PSDni qayta saqlang va PNG/JPEG natijani tekshiring.' },
    { type: 'case', content: 'Masala: 800×600 px rasmdan 600×500 px hudud Crop qilindi. Natija 300 000 piksel. Agar 800×600 rasmni 50% Resize qilsangiz 400×300 = 120 000 piksel qoladi. Crop va Resize bir xil amal emas.' },
    { type: 'trap', content: 'Selection, Crop va maskani «o‘chirish» deb birlashtirish xato. Qora maska **yashiradi**, oq maska **ko‘rsatadi**; maska thumbnaili emas, rasm thumbnaili tanlangan bo‘lsa Brush tasvirni bevosita bo‘yashi mumkin.' },
    { type: 'case', content: '**Darslikning 14-darsidagi amaliy farqlar.** Rectangular Marquee to‘rtburchak, Elliptical Marquee ellips/doira (mutanosiblik uchun Shift), Polygonal Lasso to‘g‘ri segmentlar, Magnetic Lasso kontur chetiga moslashish, oddiy Lasso erkin chegara chizadi. Rangda Foreground va Background swatchlarini ajrating: D — odatiy oq/qora ranglar; X — asosiy/orqa rangni almashtirish. Hue/Saturation/Colorize bilan tanlangan sohada rangni moslang, lekin rang profil va versiyani tekshiring.' },
    { type: 'task', content: '**Mustaqil loyiha.** Portretning fonini ikkita turli rangga almashtiring, soch chetlari va yarim shaffof joylarni tekshiring. PSD qatlamlari bilan bitta final eksportini solishtirib, qaysi nusxani qayta tahrirlash mumkinligini yozing.' },
    { type: 'answers', content: 'Tekshiruv: Crop — kadr, Resize — o‘lcham, selection — ish sohasi, maska — ko‘rinish. Yuqori qatlam pastdagini to‘sishi mumkin. Maska oq/qora qoidasi va thumbnail tanlanishi amalda tekshiriladi.' },
    { type: 'source', content: 'Manbalar: [ICT 7-sinf (2021), 14–15-darslar, 57–66-betlar](https://drive.google.com/file/d/1QMT7y-6nJLQ-f1-4SySBV8y8JrRpp4q-/view); [Adobe — Add layer masks](https://helpx.adobe.com/photoshop/desktop/create-masks/layer-masks/add-layer-masks.html); [Adobe — Edit layer masks](https://helpx.adobe.com/photoshop/desktop/create-masks/layer-masks/edit-and-refine-layer-masks.html). Amaliy topshiriqlar mustaqil mualliflik bayoni.' },
  ],
  'M10.04': [
    { type: 'heading', content: 'Photoshop amaliyoti 3 — darslikdagi sahifa dizayni va retush' },
    { type: 'goal', content: '7-sinf 17–18-darslaridagi matn bilan ishlash va amaliy sahifa dizaynini mustaqil bajarish; 2026 spetsifikatsiyasidagi rasmni yaratish va tahrirlash talabiga natija bilan javob berish.' },
    { type: 'table', content: '| Vazifa | Photoshop vositasi | Ish yakunida tekshiriladi |\n|---|---|---|\n| Sarlavha | Type Tool | Matn o‘qilishi, shrift, qatlam |\n| Fon va kompozitsiya | Layers, Move, Transform | Obyektlar tartibi |\n| Dog‘ni kamaytirish | Clone Stamp/Healing | Tekstura va takror artefaktlar |\n| Tovlanish va kontrast | Levels/Curves Adjustment Layer | Muhim detallar yo‘qolmaganmi? |\n| Rangning to‘yinganligi | Hue/Saturation | Ranglar tabiiy ko‘rinadimi? |\n| Yetkazib berish | PSD + File → Export | Qatlamlar manbada saqlanganmi? |' },
    { type: 'solved', content: '**7-sinf loyiha uslubidagi afisha.** 1) Maktab tadbiri uchun original suratni alohida saqlang. 2) Photoshopda foto va fonni mustaqil qatlamlarda joylang. 3) Crop bilan kompozitsiyani tayyorlang, so‘ng Levels/Curves adjustment orqali yorqinlikni tekshiring. 4) Type Tool bilan sarlavha va sanani yozing; zarur bo‘lsa Stroke yoki kontrastli fon qo‘llang. 5) PSD loyiha nusxasini saqlang; veb uchun PNG/JPEG eksport qiling, matn va rangni tekshiring.' },
    { type: 'case', content: 'Berilgan vaziyat: foydalanuvchi 4 ta bir xil portretni 2×2 joylashtirib, ko‘k fon, qora ingichka ramka va matn yaratishi kerak. Layer/Move orqali nusxalarni joylashtirish, Layer Style → Stroke bilan ramka berish va Type Tool bilan matn qo‘shish kerak; fayl faqat tayyor JPEGga emas, PSDga ham saqlanadi.' },
    { type: 'trap', content: 'Photoshopdagi «Save» va «Export» maqsadlari bir xil emas. JPEGga tekislangan kompozitsiya qayta ochilganda qatlamli matn va maskalar odatda mustaqil tahrirlanmaydi; PSD ishchi faylini yo‘qotmang.' },
    { type: 'solved', content: '**7-sinf 17-darsdagi mustaqil matn mashqi.** 1) File → New: yangi PSD oching. 2) Type Tool (T) bilan ismingizni yozing. 3) Shriftni 24 pt va matn rangini binafsha qiling (kegl va ekranning piksel balandligini tenglashtirmang). 4) Warp Text menyusida FishEye deformatsiyasini tanlang. 5) Layer Style → Drop Shadow orqali qizil soya berib natijani tekshiring. 6) Faylni Ism.psd qilib qatlamlari bilan saqlang. Warp Text matnning bezagini o‘zgartiradi, u rasmning Crop amali emas.' },
    { type: 'case', content: '**7-sinf 18-darsdagi veb-sahifa maketi.** Photoshopda yangi hujjat ochib, sarlavha (header), navigatsiya menyusi, asosiy kontent, slayder va pastki qism (footer) uchun qatlam yoki guruhlar rejasini tuzing; rasmlar va matn qatlamlarini mustaqil tahrirlang. Bu — saytning grafik prototipi, tayyor HTML/CSS sayt emas. Maketni PSD loyiha va PNG ko‘rib chiqish nusxasi sifatida alohida saqlang.' },
    { type: 'task', content: '**Attestatsiya mashqi.** Portret nusxalash, qatlam tartibi, Crop/Resize farqi, maska va Type Tool ishtirok etgan 5 ta amaldan iborat vaziyat yozing. Har amal uchun asbobni va xato variantining sababini asoslang.' },
    { type: 'answers', content: 'Tekshiruv: matn alohida qatlamda; kompozitsiyada yuqori qatlam ko‘rinadi; Clone Stamp nuqta manbasi tanlanadi; adjustment layer qaytariladigan tahrirga yordam beradi; PSD qatlamlarni saqlaydi, eksport esa tarqatish nusxasi.' },
    { type: 'source', content: 'Manbalar: [ICT 7-sinf (2021), 17–18-darslar, 67–79-betlar](https://drive.google.com/file/d/1QMT7y-6nJLQ-f1-4SySBV8y8JrRpp4q-/view); [Adobe — Adjustment layers](https://helpx.adobe.com/photoshop/desktop/create-manage-layers/color-adjustment-fill-layers/create-adjustment-layers.html); [Adobe — Export PNG/GIF](https://helpx.adobe.com/photoshop/desktop/save-and-export/save-files/save-in-png-and-gif-formats.html); 2026 Informatika test spetsifikatsiyasi, 27–31-savollar, grafika va veb sohasi. Misollar original qayta bayon.' },
  ],
}

-- TASK-213 / Graphics & Web v2.0. Staging only, never auto-publish AI-derived content.
-- Sources: user-supplied 2026-10-18 v2 PDF, 2026 specification, ICT/Cambridge.
-- Protect ALL existing published lesson revisions and learner attempts.
BEGIN;
DO $$ BEGIN
 IF (SELECT count(*) FROM public.modules WHERE code IN ('M10','M11')) <> 2 THEN
   RAISE EXCEPTION 'Missing canonical M10/M11 modules';
 END IF;
END $$;
INSERT INTO public.lessons
 (id,module_id,order_idx,slug,title_uz,body_mdx,est_minutes,status)
VALUES
(
 'e2150000-0000-4000-8000-000000000001'::uuid,
 (SELECT id FROM public.modules WHERE code='M10'),
 21, 'grafika-turlari-v2-review', 'Grafika turlari — manbali nazariya V2',
 '> **Manba:** Grafika va veb-texnologiyalar V2 (2026-10-18), maktab va Cambridge darsliklari, rasmiy spetsifikatsiya 27–31. Ushbu PDFdan chiqarilgan matn ekspert ko‘rigiga muhtoj; grafiklar uchun original PDFga qarang.

Kompyuter grafikasi turlari va tasvirning asoslari


  Kompetensiya: Rastr, vektor va 3D grafikani farqlash; rang modellari va fayl format-
  larini vazifasiga ko‘ra tanlash. 2026 spetsifikatsiya: 27–31-savollardagi 1-band.



### 1.1 Grafik tasvirning matematik modeli

Kompyuter grafikasi – tasvirlarni raqamli muhitda yaratish, saqlash, qayta ishlash va aks
ettirish vositalari va usullari majmui. Tasvirning ekranda qanday ko‘rinishi bilan uning
faylda qanday ifodalanishi bir xil savol emas. Ekrandagi har qanday rasm yakunda pikselga
aylanishi mumkin, lekin asl hujjat rastrli, vektorli yoki uch o‘lchamli ma’lumotni saqlashi
mumkin.

  Kompyuter grafikasi

  Rastr: piksellar  Vektor: obyektlar  3D: fazoviy model


Manba: ICT7, PDF 40–43; Cambridge9, PDF 285–288.



### 1.2 Rastrli grafika: piksel va rezolyutsiya

Rastr tasvir piksellar matritsasidan iborat. Masalan, 8 × 6 tasvirda 48 ta piksel mavjud.
Koordinata (x, y) ma’lum pikseldagi rangni ifodalaydi. Piksel soni N = W · H: W – gorizontal, H – vertikal o‘lcham. Ekrandagi tasvirning aniqligi ekran piksel zichligiga ham bog‘liq;
rasmning W × H o‘lchami va bosma PPI/DPI bir xil tushuncha emas.
  Rastr foto, skrinshot, skanerlangan hujjatlar uchun qulay. Katta miqyosda kattalashtirganda yangi tafsilot avtomatik paydo bo‘lmaydi: interpolyatsiya mavjud namunalar asosida
taxminiy piksel ranglarini hisoblaydi. Shu bois piksel sonini ko‘paytirish bilan asl tafsilotni
tiklash farqlanadi.

  Hisoblash namunasi
  O‘lchami 800 × 600 bo‘lgan rasm 480 000 pikselga ega. Har o‘lchamni 2 baravar oshirish
  1600 × 1200 = 1 920 000 piksel beradi; piksel soni 2 emas, 4 baravar oshadi.


### 1.3 Vektorli grafika: obyekt, kontur va yo‘l

Vektorli rasm o‘zaro bog‘langan geometrik obyektlar (nuqta, chiziq, yo‘l/path, ellips,
to‘rtburchak), ularning koordinatalari, to‘ldirish rangi va chiziq xossalari yordamida ifodalanadi. Masshtablashda koordinatalar qayta hisoblanadi va konturlar qayta chiziladi:
bu manba geometriyasini saqlaydi. Logotip, ikonka, sxema, infografika kabi aniq konturli
ishlarda ayniqsa foydali. Murakkab fotosuratni to‘liq vektorga o‘tkazish odatda murakkab
geometrik modellar talab qiladi.
  Bezier egri chizig‘i tayanch nuqta hamda boshqaruv dastaklari orqali belgilanadi.
Stroke – kontur chizig‘i, fill – shaklning ichki to‘ldirilishi. Aylana, to‘g‘ri to‘rtburchak va
matn obyektlari mustaqil tahrirlanishi mumkin. Ekranda vektor ham brauzer yoki muharrir
tomonidan yakunda rastrlab namoyish qilinadi.

  Sinovdagi asosiy farq

  PNG fayliga joylashtirilgan vektor logotip eksportdan keyin rastrli bo‘ladi. SVG esa
  odatda vektorli tavsifni saqlaydi; biroq SVG tarkibida ichki rastr tasvir ham bo‘lishi
  mumkin. Kengaytma, ichki mazmun va tahrirlash imkoniyati alohida tekshiriladi.



### 1.4 Ikki tur grafikani taqqoslash

 Mezon  Rastr  Vektor

 Asosiy birlik  Piksel  Geometrik obyekt/path
 Masshtab  Piksel qayta namunalari talab qilinadi  Geometriya qayta chiziladi
 Muharrir  Paint, Photoshop  Inkscape, Illustrator, SVG muharriri
 Mos vazifa  Foto, skrinshot, rang o‘tishlari  Logotip, diagramma, piktogramma
 Tipik fayl  PNG, JPEG, BMP  SVG, EPS, AI

Rasmning ko‘rinishi haqidagi savolga emas, tasvirni tahrirlash modeliga asoslanib javob
bering. Photoshopdagi shape layer vektor xossasiga ega bo‘lishi mumkin, ammo JPEG
eksport tasvirni rastrlaydi.


### 1.5 Uch o‘lchamli grafikani farqlash

3D grafika x, y, z fazoviy koordinatalar asosida model, kamera, yorug‘lik va material xossalarini birlashtiradi. Modellashtirish – 3D obyekt geometriyasini yaratish; rendering –
uni ikki o‘lchovli tasvir sifatida hisoblash. 3D modelning suratini JPEGga olish JPEGni 3D
modelga aylantirmaydi. Perspektiva va chuqurlik mavjud ko‘rinish har doim asl faylda 3D
model saqlanishini anglatmaydi.


### 1.6 Rang modellari: RGB, CMYK, kulrang va alpha

RGB – qizil, yashil, ko‘k nurlar asosidagi additiv model; ekranlar uchun mos. 8 bitli kanal
bo‘lsa har biri 0–255 qiymat oladi: qora (0, 0, 0), oq (255, 255, 255), sariq (255, 255, 0). CMYK
– sian, magenta, sariq, qora bo‘yoq asosidagi bosma jarayon modeli. RGBning 3 kanali va
CMYKning 4 kanali mavjudligi ularning barchasi bir xil ma’noda 8 bitli degani emas: fayl
formati va rang profili rol o‘ynaydi.
  Alpha kanali shaffoflikni ifodalaydi: odatiy 8 bitli RGBA modelda alpha=0 to‘liq shaffof,
255 to‘liq xira (opaque). Greyscale (kulrang) bir yorqinlik kanali yordamida ifodalanishi
mumkin. Oq rang uchun RGB kanallari maksimal, lekin CMYKda bo‘yoq miqdorlari ideal
holda 0 bo‘lishi mumkin; ikki modelni bevosita arifmetik ekvivalent deb qabul qilmang.
Manba: ICT7, PDF 43–46, “Rang modellari va grafik formatlar”; zamonaviy alpha talqini – texnik aniqlashtirish.


### 1.7 Grafik formatni mazmunga qarab tanlash

 Format  Model  Kuchli tomoni  Cheklov

 BMP  Rastr  Tuzilishi sodda, siqilmagan  Hajmi katta bo‘lishi mumkin
  variantlari bor
 JPEG/JPG  Rastr  Fotosuratda yuqori siqish  Odatda yo‘qotishli; odatiy
  JPEG alpha saqlamaydi
 PNG  Rastr  Yo‘qotishsiz; shaffoflik  Fotosuratlarda JPEGdan
  yirikroq bo‘lishi mumkin
 GIF  Rastr  256 rangli palitra, oddiy  Rang chegarasi; alpha
  animatsiya  shaffoflik emas
 WebP  Rastr  Yo‘qotishli/yo‘qotishsiz  Rejimni tekshirish kerak
  rejimlar
 SVG  Vektor/XML  Kontur va matn  Murakkab foto uchun qulay
  masshtablanadi  emas
 PSD  Tahrirlash loyiha fayli  Qatlam va maskalarni  Ulashish/veb uchun bevosita
  saqlaydi  eng qulay emas

Yo‘qotishli siqish kodlashda ayrim tasviriy ma’lumotlarni tashlaydi; yo‘qotishsiz siqish
esa manba piksel qiymatlarini tiklashga imkon beradi (rang profili va eksport sozlamalari
kabi boshqa o‘zgarishlardan qat’i nazar). Rasmni “.png” deb qayta nomlash haqiqiy konversiya emas.


### 1.8 Tanlov algoritmi va diagnostika

1. Tahrirda geometrik obyektlar kerakmi? – SVG kabi vektorli manba saqlang.
2. Foto yoki skrinshotmi? – JPEG/WebP yoki PNG ehtiyojiga qarab.
3. Shaffof fon kerakmi? – alpha qo‘llaydigan PNG/WebP yoki mos SVG.
4. Photoshop qatlamlari kerakmi? – loyiha uchun PSD, tarqatish uchun alohida eksport.
5. Matn va ingichka grafik chiziqlar juda aniq bo‘lishi kerakmi? – PNG/SVG ko‘pincha afzal.

  O‘z-o‘zini tekshirish
  1) 1024 × 768 rasm piksel sonini toping. 2) Logotipni 20 baravar kattalashtirishda qaysi
  manba modeli ma’qul? 3) Qaysi formatda qatlamlar keyin tahrirlanishi mumkin? 4)
  RGB (255, 0, 255) qaysi rangga yaqin?
  Tekshiruv: 786 432; vektor; PSD; magenta.



### 1.9 Darslikdagi to‘rt tur: fraktal grafika ham alohida

7-sinf milliy darsligining “Kompyuter grafikasi va uning turlari” mavzusida rastrli, vektorli,
fraktal va uch o‘lchovli grafika ajratiladi. Fraktal grafika — o‘ziga o‘xshash tuzilma va
matematik formula orqali shakl hosil qilishga asoslangan yo‘nalish. U geometrik obyektlarni
alohida tahrirlashga asoslangan odatiy vektor chizmasiga to‘liq teng emas. Fraktal tasvir
oxir-oqibat rastrli ekranda piksel sifatida aks etishi uning boshlang‘ich matematik modelini
o‘zgartirmaydi.

 Tur  Asosiy tavsif  Masala belgisi

 Rastrli  Rangli piksellar matritsasi  Piksel, o‘lcham, bit chuqurligi
 Vektorli  Geometrik kontur va obyekt  Tugun, path, masshtab
 Fraktal  Formula va o‘z-o‘ziga o‘xshashlik  Iteratsiya, formula, masshtab
 3D  Fazodagi obyekt modeli  x, y, z, mesh, material

Manba: ICT7, PDF 40–42 (4 tur va ularning asosiy elementlari).


### 1.10 Darslikdagi HSV/HSB va LAB rang modellari

HSB (Hue, Saturation, Brightness) modeli rangning toni, to‘yinganligi va yorqinligini uch komponentda ifodalaydi. Darslikda H qiymati 0◦ dan 360◦ gacha, S va B esa foizlarda ko‘rsatiladi;
masalan, H=0◦ atrofida qizil, H=120◦ atrofida yashil, H=240◦ atrofida ko‘k tuslar tasvirlanadi.
HSV va HSB o‘quv kontekstida ko‘pincha yaqin tushunchalar sifatida ishlatiladi, ammo dastur interfeyslari bilan qat’iy formula va tizimlarni solishtirganda nomlashni aniqlashtirish
kerak.
  CIELAB (ko‘pincha LAB) rang fazosida L* — yorug‘lik darajasi, a* va b* — rangga oid
qarama-qarshi o‘qlar. Darslikda uning komponentlari yorqinlik va rangni mustaqil sozlash
bilan bog‘lanadi. Bu parametrlarni RGBdagi uch yorug‘lik kanali yoki CMYKdagi poligrafik
bo‘yoqlar bilan adashtirmang.

  Muhim farqlash

  RGB(255,255,255) — oq, RGB(0,0,0) — qora. HSB modelida Hue rang turi, Saturation
  uning to‘yinganligi, Brightness esa yorqinlikni bildiradi. LABning L komponenti ham
  Hue emas.

Manba: ICT7, PDF 43–45 (RGB, CMYK, HSB/HSV, LAB).



### 1.11 Grafik formatlar: TIFF, GIF, PNG, JPEG va SVG

Darsliklarda GIF animatsion kadrlar va cheklangan palitra bilan, TIFF skan va yuqori sifatli
tasvirni saqlash vaziyatlari bilan, JPEG fotosuratlarni yo‘qotishli siqish bilan, PNG shaffoflik
va yo‘qotishsiz saqlash bilan bog‘lanadi. SVG esa masshtablanadigan vektor tavsifdir. Fayl
kengaytmasi yakka o‘zi tasvirning aniqligini yoki hajmini kafolatlamaydi: o‘lcham, siqish, palitra, metama’lumot va kontent ham ta’sir qiladi.

 Format  Odatdagi kuchli jihat  Nima bilan adashmaslik kerak

 JPEG  Fotosurat va yo‘qotishli siqish  Alfa-shaffoflik uchun oddiy tanlov emas
 PNG  Rastr, lossless va alfa  JPEGdan doim kichik emas
 GIF  256 ranggacha palitra/kadr animatsiyasi  Barcha animatsiya faqat GIF emas
 TIFF  Skan/ishchi tasvir, sifat variantlari  Mutlaq bitta siqish algoritmi emas
 SVG  Vektor, masshtablanish  Oddiy foto o‘rnini to‘liq bosmaydi

Manba: ICT7, PDF 45–47 (grafik formatlar); ICT7, PDF 40–41 (tasvir turlari).

Rastr va vektor tasvirlar ustida amallar


  Kompetensiya: Rastr va vektor tasvirni kesish, o‘lchamini o‘zgartirish, burish, akslan-
  tirish; rang chuqurligi va xom hajmini hisoblash; natijani izohlash.



### 2.1 Rastr amallarining mazmuni

Select – tasvirning faqat bir sohasi bilan ishlashni tanlash, crop – tanlangan qismdan
tashqarini olib tashlab hujjat chegarasini qisqartirish. Resize image – tasvirning piksel
o‘lchamlarini o‘zgartirish, canvas size – ish maydoni chegarasini o‘zgartirish. Ularning
farqi testda tez-tez chalkashadi: 1200 × 800 rasmning markaziy 600 × 400 qismini kesish rasm
piksel sonini 4 baravar kamaytiradi; faqat ish maydonini kattalashtirish esa manba qatlam
piksellariga yangi tafsilot qo‘shmaydi.
  Rotate – tasvirni burish, flip horizontal – gorizontal akslantirish; bu 90 darajaga burish
bilan bir xil amal emas. Undo oxirgi holatni qaytaradi, redo bekor qilingan amalni tiklaydi.
Shaffof qatlamning background qatlami bilan farqini tushunish kesish va ko‘chirish natijalarini bashorat qilishda muhim.


### 2.2 Resampling: eng yaqin qo‘shni va interpolyatsiya

Nearest-neighbor algoritmi yangi piksel uchun eng yaqin manba piksel rangini oladi;
piksel-artni kattalashtirishda mos. Bilinear yaqin 4 piksel qiymatlaridan chiziqli aralashtirish asosida hisoblaydi va silliqroq chiqadi; bicubic odatda ko‘proq qo‘shni nuqtalarga asoslanadi. Hech biri yo‘q tasvir tafsilotini aniq qaytarish kafolatini bermaydi.

  O‘lchamni ikki tomondan o‘zgartirish

  600 × 400 rasmni 150% o‘lchamda (har ikki tomonni) qayta namunalasak, 900 × 600
  bo‘ladi. Piksel soni 240 000 dan 540 000 ga oshadi: koeffitsiyent 1.52 = 2.25. Agar faqat
  eni 150% bo‘lsa 900 × 400 va koeffitsiyent 1.5.



### 2.3 Rastr xom hajmi: formula va chegaralar

Siqilmagan piksel ma’lumotining nazariy hajmi:
  W ·H ·b
  Bbits = W · H · b,  Bbytes =  .

Bu yerda b – bir pikselga to‘g‘ri keladigan bitlar soni. Masalan, 24 bitli RGB 320 × 200 uchun
320 · 200 · 24/8 = 192 000 bayt. 32 bitli RGBA uchun shu rasm 256 000 bayt.',
 22, 'review'::public.content_status
),
(
 'e2150000-0000-4000-8000-000000000002'::uuid,
 (SELECT id FROM public.modules WHERE code='M10'),
 22, 'rastr-vektor-amallari-v2-review', 'Rastr va vektor amallari — nazariya V2',
 '> **Manba:** Grafika va veb-texnologiyalar V2 (2026-10-18), maktab va Cambridge darsliklari, rasmiy spetsifikatsiya 27–31. Ushbu PDFdan chiqarilgan matn ekspert ko‘rigiga muhtoj; grafiklar uchun original PDFga qarang.

Formula qachon ishlaydi?

  Natija – xom piksellar hajmi. Faylning diskdagi hajmi boshqa: sarlavhalar, qatorlarni
  to‘ldirish, metama’lumot, siqish, qatlamlar va rang profili bo‘lishi mumkin. Ba’zi BMP
  formatlarida qator uzunligi 4 bayt chegarasigacha to‘ldiriladi; shuning uchun W ·H ·b/8
  har doim aniq BMP fayl hajmi emas.



### 2.4 Indekslangan rang va ranglar soni

Har piksel b bit bo‘lsa, indekslar soni 2b tagacha: 1 bit 2, 4 bit 16, 8 bit 256. Indekslangan 8
bitli rasm har piksel uchun 8 bitli indeks saqlaydi, ranglarning RGB qiymati esa palitrada
beriladi. Shuning uchun 8 bitli indekslangan PNG 24 bitli RGB bilan bir xil emas. 8 bitli RGBA
rang kanallari deyilganda odatda 8 + 8 + 8 + 8 = 32 bit/piksel nazarda tutiladi.


### 2.5 Kesish, maskalash va shaffoflik

Mask qatlam qaysi qismda ko‘rinishini nazorat qiladi, manba pikselni majburiy o‘chirishi
shart emas. Eraser odatda qatlamdagi pikselning o‘zini o‘zgartiradi; layer mask esa tahrirni
qaytarish uchun qulay. Clipping mask yuqori qatlam ko‘rinishini pastdagi obyekt shakli
bilan cheklashga xizmat qilishi mumkin. Bularning aniq amaliy boshqaruvi muharrir va
uning versiyasiga bog‘liq.


### 2.6 Vektor amallari: transformatsiya va obyekt tartibi

Vektor obyektni translation bilan ko‘chirish: (x, y) 7→ (x + a, y + b). Scale bilan o‘lchash:
(x, y) 7→ (sx x, sy y) (tayanch koordinata boshida bo‘lsa). Aylantirish burchagi θ uchun
  ( ′) (  )( )
  x  cos θ − sin θ  x
  ′
  =  .
  y  sin θ cos θ  y

Koordinata boshiga nisbatan 90◦ soat miliga teskari aylantirishda (2, 3) → (−3, 2). Group
bir nechta obyektni birga boshqaradi, ungroup esa ularni ajratadi. Bring to front/send to
back ustma-ust turish tartibini o‘zgartiradi, geometrik o‘lchamni emas.


### 2.7 Konturlar bilan amallar

Union ikki yopiq shaklning birlashmasini, intersection umumiy qismini, difference
bir shakldan boshqasini ayirishni ifodalashi mumkin. Stroke width oshishi obyektni
egallagan ko‘rinadigan hududni o‘zgartiradi, lekin asosiy yo‘l (path)ning tayanch nuqtalari
o‘zgarmasligi mumkin. Vektorni rastrga aylantirish rasterization; rastrdan kontur aniqlash
orqali vektor shakl olish tracing deb ataladi; tracing doim ideal natija bermaydi.


### 2.8 Eksport, o‘lchov birliklari va tayyorlash zanjiri

Vebda piksel o‘lchami va fayl hajmi asosiy; bosmada kerakli fizik o‘lcham uchun PPI muhim.
Masalan, 300 PPI deb belgilangan 900 piksel enli rasmning nominal bosma eni 900/300 = 3
dyuym (7,62 sm). PPI metama’lumotini almashtirish piksel sonini o‘zi avtomatik oshirmaydi.
DPI printerdagi nuqta zichligiga nisbatan ishlatilishi mumkin; ko‘pincha PPI bilan adashtiriladi.

  Masala: xom hajm va masshtab

  400×300 RGB24 rasmni ikkala tomondan 2 baravar oshiramiz. Asl xom hajm 400 · 300 ·
  3 = 360 000 B, yangi xom hajm 800 · 600 · 3 = 1 440 000 B. Natija 4 marta oshadi; JPEG
  eksport hajmi shu nisbatda o‘sishi shart emas.

Manba: ICT7, PDF 29–34 (grafik axborotni kodlash), 40–47 (grafika turlari/rang); ICT5 PDF 71–83 (grafik amallar); hisoblash modellari – yuqorida ko‘rsatilgan shartli xom model.

  O‘z-o‘zini tekshirish
  1) 640 × 480 RGBA32 rasm xom hajmini baytda hisoblang. 2) Crop va resize farqini bir
  jumlada ayting. 3) (4, 5) nuqtani 90◦ soat miliga teskari buring. 4) Vektorda obyektlarn-
  ing ustma-ust tartibini qaysi amal o‘zgartiradi?
  Tekshiruv: 1 228 800 B; kesish/tasvir o‘lchami farqi; (−5, 4); bring to front/send to back.



### 2.9 Rang chuqurligi va hajmning ikki alohida modeli

Rastr uchun Sxom = W · H · b/8 formula faqat bit chuqurligi b pikselga tegishli bo‘lsa va qatorlarni to‘ldirish, sarlavha, palitra hamda siqish hisobga olinmasa qo‘llanadi. 24 bitli RGB
tasvirda bir piksel odatda 3 bayt, 32 bitli RGBA tasvirda 4 bayt saqlanadi. 8 bit indekslangan
rang esa 8 bitli 256 ta kulrang bilan har doim bir xil ma’no bermaydi: bitta indeks palitradagi
RGB rangni ko‘rsatishi mumkin. 256 rangli palitraning o‘zi ham faylda joy oladi.

  Hisob: 640×480 pikselli, 24 bitli siqilmagan tasvirning piksel massiv hajmi 640·480·3 =
  921600 bayt; bu faylning har qanday haqiqiy PNG/JPEG hajmi emas.

Manba: ICT7, PDF 29–34 (grafik kodlash); ICT7, PDF 40–47 (rang va format); qo‘shimcha hisoblash izohi: muallif sintezi.



### 2.10 Paint va Photoshop uchun amallar zanjiri

Belgilash (Select) va Kesish (Crop) bir xil emas: Select hudud tanlaydi, Crop esa odatda yakuniy kadr chegarasini o‘zgartiradi. Copy belgilangan ma’lumotni nusxalaydi, Cut esa uni asl
hududdan olib tashlashi mumkin, Paste buferdagi nusxani joylashtiradi. Flip Horizontal
oynaviy akslantiradi; Rotate 90° burchak bo‘yicha aylantiradi. Zoom ko‘rish masshtabini
o‘zgartiradi, lekin Resize namunalash rejimiga qarab piksel o‘lchamini o‘zgartiradi.

  Berilgan: 800 x 600 piksel
  Crop: x=100..699, y=150..449
  Natija: 600 x 300 piksel (chegaralar inklyuziv)
  Keyin Resize: 50%
  Natija: 300 x 150 piksel

Berilgan koordinatalarning inklyuziv yoki eksklyuzivligi masalada aytilishi shart; faqat
“crop 100 dan 700 gacha” kabi mavhum shart yagona javob bermasligi mumkin. Masala
yechishda alohida qilinadigan amallar tartibini yozib chiqing.
Manba: Cambridge5, PDF 38–42 (Select/Copy/Cut/Paste); ICT5, PDF 76–83 (belgilash va qayta ishlash); ICT7, PDF 47–67 (muharrir
amallari).



### 2.11 Vektor obyektlar va rastr ko‘rinish o‘rtasidagi bog‘lanish

Vektor modelda group va ungroup bir nechta obyektni birgalikda boshqaradi, align va
distribute ularni joylashtiradi, bring to front yoki send to back ustma-ust tushish tart-

ibini, union, subtract va intersect konturlar bo‘yicha yangi shakllarni yaratadi. Rasterize yo‘l yoki vektor shaklni pikselga aylantiradi; bu amalni faqat ko‘rish uchun Zoom bilan
adashtirish noto‘g‘ri. Yuqori rezolyutsiyali eksport vektor manbadagi obyektlarni keyingi
bosqichda alohida tahrirlash imkoniyatini avtomatik saqlamaydi.
Manba: ICT7, PDF 40–47 (turlar va xossalar); vektor kontur amallarining zamonaviy dasturiy izohi — qo‘shimcha.

MS Paint va Adobe Photoshop grafik
muharrirlari


  Kompetensiya: MS Paint va Adobe Photoshopda tasvir yaratish, belgilash, tahrirlash,
  qatlamlash, saqlash va eksport natijasini tahlil qilish.



### 3.1 Dasturlarni to‘g‘ri farqlash

MS Paint – Windows muhitidagi sodda rastr muharrir. Zamonaviy versiyalarda ayrim
qo‘shimcha funksiyalar bo‘lishi mumkin; testda dastur versiyasi berilgan bo‘lsa, o‘sha versiya imkoniyati ustuvor. Adobe Photoshop – rastr foto va kompozitsiya uchun rivojlangan
muharrir; qatlamlar, maskalar, filtrlar, tanlash uskunalari, rangni tuzatish va turli eksport
variantlarini qo‘llaydi. Paint.NET alohida mahsulot: 5-sinf ICT darsligidagi Paint.NET
ko‘rsatmalarini MS Paintning har bir versiyasiga ko‘r-ko‘rona tatbiq etib bo‘lmaydi.
Manba: ICT5, PDF 67–85 – aynan Paint.NET; ICT7, PDF 47–67 – Photoshop; 2026 spetsifikatsiya PDF 5 – MS Paint va Photoshop.



### 3.2 MS Paint asosiy uskunalari

Pencil qalam bilan erkin piksel chizadi; Brushes turli cho‘tka uslublarini beradi; Fill with
color tutash sohani tanlangan rang bilan to‘ldiradi; Color picker tasvirdan rang namunasi
oladi; Eraser o‘chirish imkonini beradi; Text matn qo‘shadi; Shapes tayyor shakllar chizadi.
Select orqali soha tanlanadi, so‘ng ko‘chirish, nusxalash, kesish yoki aylantirish bajariladi.

  Amaliy algoritm: logotip chizish

  1) New bilan ish maydoni oching. 2) Shapes/ellipse yordamida aylana chizing. 3) Fill
  orqali ichki rang bering. 4) Text yordamida nom yozing. 5) Save as orqali PNG nusxasini
  saqlang. Natijadagi tasvir odatda rastr sifatida saqlanadi.

  Rang bilan to‘ldirish cheklovi

  Bo‘yoq to‘kish amali ko‘pincha bir-biriga tutash rang hududida ishlaydi. Kontur ochiq
  qolgan bo‘lsa tashqi sohaga ham to‘lishi mumkin. Bir xil rangdagi uzilgan obyektlar
  har doim birdan bo‘yaladi, deb o‘ylamang.



### 3.3 Paintda fayl va belgilash amallari

Cut – tanlangan sohani olib, almashish buferiga (clipboard) joylaydi; Copy nusxa qiladi;',
 22, 'review'::public.content_status
),
(
 'e2150000-0000-4000-8000-000000000003'::uuid,
 (SELECT id FROM public.modules WHERE code='M10'),
 23, 'paint-photoshop-v2-review', 'MS Paint va Photoshop — nazariya V2',
 '> **Manba:** Grafika va veb-texnologiyalar V2 (2026-10-18), maktab va Cambridge darsliklari, rasmiy spetsifikatsiya 27–31. Ushbu PDFdan chiqarilgan matn ekspert ko‘rigiga muhtoj; grafiklar uchun original PDFga qarang.

Paste buferdagi ma’lumotni joylaydi. Ctrl+Z – undo, Ctrl+S – saqlash. Crop tanlov
chegarasidan tashqarini olib tashlash uchun xizmat qiladi. Resize esa rasm o‘lchamlarini
foiz yoki piksel bilan o‘zgartirishi mumkin. Rasmning eni va bo‘yining nisbatini saqlash
(maintain aspect ratio) yoqilsa, bir o‘lcham o‘zgarganda ikkinchisi mutanosib qayta
hisoblanadi.


### 3.4 Photoshop ish muhiti va asboblar

Photoshop oynasida Menu bar (menyu), Options bar (tanlangan uskuna sozlamalari),
Tools panel (uskunalar), Document window/canvas (hujjat), Panels (Layers va boshqalar)
muhim. Asbobni tanlash bilan uning parametrlarini o‘zgartirishni farqlang: Brush tanlanishi chizish rangining avtomatik o‘zgarganini bildirmaydi.

 Uskuna  Asosiy vazifa

 Move  Tanlangan qatlam/obyektni ko‘chirish
 Marquee  Geometrik (masalan, to‘rtburchak) soha tanlash
 Lasso  Erkin konturli tanlov
 Magic Wand/Quick Selection  Rang yoki obyekt chegarasi asosida tanlash
 Crop  Kadr chegarasini qayta belgilash
 Eyedropper  Namuna rangini olish
 Brush  Bo‘yoq izini chizish
 Clone Stamp  Bir hududdan namuna olib boshqa joyga bo‘yash
 Type  Matn qatlamini yaratish

Manba: ICT7, PDF 50–57 – Photoshop interfeysi, uskunalar; PDF 57–61 – tanlash va kesish.



### 3.5 Qatlamlar: tartib, ko‘rinish va shaffoflik

Layer – ustma-ust joylashuvchi mustaqil tahrir birligi. Yuqori qatlam shaffof bo‘lmagan piksellari bilan pastdagisini yopishi mumkin. Eye icon qatlamning ko‘rinishini yoqadi/o‘chiradi.
Opacity qatlamning umumiy shaffofligini boshqaradi; Fill esa ma’lum holatlarda qatlam
ichidagi tarkib ko‘rinishiga ta’sir qiladi, qatlam uslubi bilan farqlanishi mumkin. Lock qatlamga ayrim o‘zgartirishlarni cheklaydi.

  Qatlam tartibi bo‘yicha mulohaza

  Pastda ko‘k fon, uning ustida qizil to‘rtburchak, eng ustida oq matn bor. Agar o‘rta
  qatlam ko‘rinmas qilinsa, qizil to‘rtburchak yo‘qoladi, ammo fon va oq matn qoladi
  (ular mustaqil qatlam bo‘lsa).



### 3.6 Maskalar va buzmasdan tahrirlash

Layer maskda odatda oq – ko‘rsatish, qora – yashirish, kulrang – qisman ko‘rsatish. Adjustment layer rang/tonni manba pikselni bevosita qayta yozmasdan tuzatishi mumkin.
Smart Object ba’zi transformatsiyalarni qayta tahrirlash uchun mos tuzilmani saqlaydi.
Yassi JPEGda tahrir tarixini, qatlamlarni saqlab qolish majburiy emas; manba loyiha faylini
PSD ko‘rinishida saqlash maqsadga muvofiq.


### 3.7 Rang va tasvirni tuzatish

Brightness umumiy yorqinlikka, Contrast eng och va eng to‘q sohalar farqiga ta’sir
ko‘rsatadi. Hue/Saturation rang ohangi va to‘yinganligini o‘zgartiradi; Levels/Curves

ton diapazonini boshqaradi. Gaussian blur konturlarni yumshatadi, Sharpen ayrim
kontrastlar orqali ko‘rinadigan o‘tkirlikni oshiradi. Sifatli ishlovda asl faylni yo‘qotmaslik
uchun qatlam/maska yoki nusxa bilan ishlash tavsiya etiladi.


### 3.8 Saqlash va eksportni to‘g‘ri tanlash

Save mavjud ish faylini saqlaydi; Save As boshqa nom yoki mos formatda saqlash imkonini
beradi; Export tarqatishga mo‘ljallangan rasm versiyasini chiqaradi. PSD qatlam va tahrir
ma’lumotini saqlashga mo‘ljallangan; JPEG fotosurat uchun, PNG esa keskin chiziq va shaffoflik zarur bo‘lgan grafikada qulay. Photoshopga import qilingan SVGni raster qatlamga
aylantirib tahrirlash bilan uni saqlanib qoladigan vektor manbasi sifatida ishlatish boshqa
operatsiyalar.

  Attestatsiya tuzog‘i

  Uskuna belgisi kichik farq bilan o‘xshashi mumkin: Crop tasvir chegarasini o‘zgartiradi,
  Slice esa ayrim ish oqimlarida eksport bo‘laklarini ajratishga xizmat qiladi. Clone
  Stamp nusxa namunasini bo‘yaydi, Healing odatda tekstura va atrofiy ranglarni
  moslashtiradi.

  O‘z-o‘zini tekshirish
  1) Photoshopda qatlamni vaqtincha yashirish nima uchun qulay? 2) Bir rangli tutash
  hududni tez bo‘yash Paintda qaysi uskuna? 3) Qatlamlar saqlansin desa PSD yoki JPEG?
  4) Crop va canvas size farqi nima?
  Tekshiruv: qaytariluvchi kompozitsiya; Fill; PSD; kesish va ish maydoni chegarasi.



### 3.9 Microsoft Paint: 5-sinf Cambridge bo‘yicha asosiy ish oqimi

5-sinf Cambridge moslashtirilgan darsligining 2-modulida aynan Microsoft Paint nomi bilan kanvas, chizish, tanlash, nusxalash, o‘chirish va saqlash vazifalari keltiriladi. Bu manba
milliy 5-sinf darsligida uchraydigan Paint.NET bilan bir xil dastur emas.
 1. Line: kanvasda boshlanish va tugash nuqtalarini bosib chizish; Curved line: avval
  to‘g‘ri segment chizib, keyin uning egri shaklini sozlash (modulda ikki joyidan egish
  ko‘rsatiladi).
 2. Pencil — erkin, odatda ingichka chiziq; Brush — har xil teksturali mo‘yqalam; Size —
  chiziq qalinligini tanlash.
 3. Edit colours / Add to Custom Colours — tayyor palitradan tashqari maxsus rang tuzish.
 4. Shapes — shakl chizish; Fill — konturga bog‘liq bo‘lgan tutash sohani bo‘yash.
 5. Rectangular select va Free-form selection — sohani ikki usulda belgilash; Copy, Cut,
  Paste — clipboard yordamida joylashtirish.
 6. Eraser — belgilangan hududda o‘chirish; Undo — oxirgi amalni ortga qaytarish; Save as
  — yangi fayl nomi yoki formatini belgilab saqlash.

  Amallar ketma-ketligini tekshirish

  Ikki bir xil belgi kerak: avval bitta belgini chizing, so‘ng belgilab Copy, Paste. Uchta belgi
  kerak bo‘lsa, yana bitta Paste bajaring. Cut ishlatilsa, asl obyekt o‘sha joyida qolishi
  shart emas.

Manba: Cambridge5, PDF 27–44 (2-modul: Microsoft Paint; Curved line PDF 30–31; belgilash/nusxalash PDF 38–41; Save as PDF
42).


### 3.10 Adobe Photoshop: 7-sinf darslik bo‘yicha qatlam, tanlov va

  filtr
Marquee to‘g‘ri shaklli tanlovlarga, Lasso erkin tanlovga, Magic Wand va Quick Selection
rang/tasvir belgilariga asoslangan tanlovga yordam beradi. Feather (chegarani yumshatish)
qirqilgan kontur ko‘rinishiga ta’sir etishi mumkin. Move obyekt/qatlamni ko‘chiradi, Type
matn yaratadi, Clone Stamp manbadan namuna olib piksellarni qayta ishlaydi. Versiyaga
qarab asboblarning joylashuvi va nomlanishi farq qilishi mumkin.
  Layer (qatlam) yuqori-past ketma-ketlikda joylashadi. Opacity alfa aralashuvini sozlaydi;
Mask esa pikselni butunlay o‘chirmasdan ko‘rinishni boshqarishga xizmat qiladi. Layer
lock ko‘chirib bo‘lmaydigan yoki tahrir cheklangan qatlamga sabab bo‘lishi mumkin. Filter rasmga maxsus effekt qo‘shadi; Blur yumshatadi, Sharpen ayrim konturlar kontrastini
kuchaytiradi. PSDda qatlamlar saqlanishi mumkin; JPEGga oddiy eksportda qatlam tuzilishi
tiklanmaydi.
Manba: ICT7, PDF 47–80 (Photoshop asboblari, soha tanlash, qatlam, matn, sahifa dizayni); zamonaviy interfeys tafsilotlari dastur
versiyasiga bog‘liq.

HTML: matn, rasm, ro‘yxat, jadval va formalar


  Kompetensiya: HTML hujjat tuzilishini, teg va atributlarning vazifasini farqlash; kod
  natijasini oldindan aytish; matn, rasm, ro‘yxat, jadval va forma kodini tuzish hamda
  tuzatish.



### 4.1 HTMLning vazifasi va to‘liq hujjat

HTML (HyperText Markup Language) veb-sahifaning mazmun va tuzilishini belgilash tilidir.
U CSS bilan bezatilishi, JavaScript bilan interaktiv qilinishi mumkin. Dasturlash tilidagi
o‘zgaruvchi, sikl kabi operatorlarga tayangan algoritm bilan HTMLni tenglashtirmang.
Element ochilish tegi, mazmun va (odatda) yopilish tegidan tashkil topadi. Attribute
elementning ochilish tegida qo‘shimcha ma’lumot beradi.

  &lt;!doctype html&gt;
  &lt;html lang="uz"&gt;
  &lt;head&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;title&gt;Mening sahifam&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
  &lt;h1&gt;Salom!&lt;/h1&gt;
  &lt;p&gt;Bu &lt;strong&gt;birinchi&lt;/strong&gt; sahifa.&lt;/p&gt;
  &lt;/body&gt;
  &lt;/html&gt;

headda sahifaga oid metama’lumot va resurs ulanishlari, bodyda ko‘rinadigan asosiy kontent beriladi. title brauzer yorlig‘i nomiga xizmat qiladi, asosiy matnga emas. lang sahifa
tili haqida ma’lumot beradi; meta charset matn kodlanishini aniqlashtiradi.
Manba: ICT7, PDF 106–114 (HTML tuzilma); Cambridge8, PDF 57–60; Cambridge9, PDF 285–290.



### 4.2 Matn va semantik elementlar

h1–h6 sarlavha darajalari; p paragraf; br satr uzilishi; hr mavzu chegarasi; strong muhimlik, em urg‘u; b yoki i esa ko‘proq taqdimot uslubini bildirishi mumkin. sup/sub mos ravishda yuqori/pastki indeks. Brauzer ko‘rinishidagi qalin va kursivning semantik ma’nosi
doim bir xil emas.',
 22, 'review'::public.content_status
),
(
 'e2150000-0000-4000-8000-000000000004'::uuid,
 (SELECT id FROM public.modules WHERE code='M11'),
 21, 'html-asoslar-v2-review', 'HTML: matn, rasm va ro‘yxatlar — V2',
 '> **Manba:** Grafika va veb-texnologiyalar V2 (2026-10-18), maktab va Cambridge darsliklari, rasmiy spetsifikatsiya 27–31. Ushbu PDFdan chiqarilgan matn ekspert ko‘rigiga muhtoj; grafiklar uchun original PDFga qarang.

&lt;h2&gt;Kimyo&lt;/h2&gt;
  &lt;p&gt;H&lt;sub&gt;2&lt;/sub&gt;O va x&lt;sup&gt;2&lt;/sup&gt; + y&lt;sup&gt;2&lt;/sup&gt;.&lt;/p&gt;
  &lt;p&gt;Bu &lt;strong&gt;muhim&lt;/strong&gt; natija.&lt;/p&gt;

HTMLdagi oddiy ketma-ket bo‘shliqlar aksariyat holatda bitta bo‘shliq sifatida ko‘rsatiladi.
Matn formatini nazorat qilishda white-space CSS xossasi kerak bo‘lishi mumkin. font tegi
va align atributi eski darslik misollarida uchrashi mumkin; zamonaviy HTMLda ko‘rinish
uchun CSS tavsiya qilinadi. Imtihonda berilgan kodning kutilgan natijasi bilan zamonaviy
tavsiyani farqlang.


### 4.3 Gipermurojaat va rasm atributlari

a elementining href atributi havola manzilini beradi; img elementining src atributi rasm
manzilini, alt esa rasmni tushuntiruvchi muqobil matnni ifodalaydi. width va height
o‘lchamni belgilaydi, lekin manba rasm faylini almashtirmaydi. target="_blank" havolani
yangi kontekstda ochadi; xavfsizlik talablarida rel="noopener" keltirilishi mumkin.

  &lt;a href="darslar.html"&gt;Darslar&lt;/a&gt;
  &lt;img src="images/logo.png" alt="Maktab logotipi"
  width="160" height="80"&gt;
  &lt;a href="#aloqa"&gt;Aloqa bo''limi&lt;/a&gt;
  &lt;h2 id="aloqa"&gt;Aloqa&lt;/h2&gt;

Nisbiy yo‘l joriy hujjat yoki sayt joylashuviga qarab talqin qilinadi; mutlaq URL protokol
va domen kabi qismlarni o‘z ichiga olishi mumkin. images/logo.png va /images/logo.png bir xil
manzil emas (ikkinchisi sayt ildiziga bog‘liq). Brauzer rasmni ocholmasa, alt matn mazmunni
tushunishga yordam beradi.
Manba: ICT7, PDF 123–127 (rasm), 144–149 (havola); Cambridge9, PDF 290–294 (URL, tasvir va manzillar).



### 4.4 Ro‘yxatlar: tartibli, tartibsiz va ichma-ich

ul tartibsiz ro‘yxat, ol tartiblangan ro‘yxat, li bitta band yaratadi. ol start="4" bilan raqamlashni 4 dan boshlash mumkin; ol reversed teskari raqamlashni belgilaydi. Ichki ro‘yxat tegini tashqi lining ichiga joylashtirish semantik jihatdan to‘g‘ri.

  &lt;ol start="3"&gt;
  &lt;li&gt;Asoslar&lt;/li&gt;
  &lt;li&gt;Veb
  &lt;ul&gt;
  &lt;li&gt;HTML&lt;/li&gt;
  &lt;li&gt;CSS&lt;/li&gt;
  &lt;/ul&gt;
  &lt;/li&gt;
  &lt;/ol&gt;

Natijada yuqori darajada 3. Asoslar va 4. Veb ko‘rinadi, HTML va CSS esa Veb bandi ichida
markerli ichki ro‘yxatga kiradi. Tartiblangan ro‘yxatda bandlar sonini va boshlangan
raqamni farqlang: 3 dan boshlangan 2 band oxirgisi 4 bo‘ladi.
Manba: ICT7, PDF 120–123 (ro‘yxatlar va atributlar).


',
 24, 'review'::public.content_status
),
(
 'e2150000-0000-4000-8000-000000000005'::uuid,
 (SELECT id FROM public.modules WHERE code='M11'),
 22, 'html-jadval-forma-v2-review', 'HTML: jadvallar va formalar — V2',
 '> **Manba:** Grafika va veb-texnologiyalar V2 (2026-10-18), maktab va Cambridge darsliklari, rasmiy spetsifikatsiya 27–31. Ushbu PDFdan chiqarilgan matn ekspert ko‘rigiga muhtoj; grafiklar uchun original PDFga qarang.

### 4.5 Jadval tuzilishi va birlashtirish

table jadval, tr qator, th sarlavha katak, td oddiy ma’lumot katagi, caption sarlavha yozuvi.
rowspan bir katak qamrab oladigan qator soni, colspan ustun soni. Bitta qator ichidagi katak
teglar soni bilan mantiqiy ustunlar sonini adashtirmang.

  &lt;table&gt;
  &lt;caption&gt;Guruh natijalari&lt;/caption&gt;
  &lt;tr&gt;&lt;th&gt;Fan&lt;/th&gt;&lt;th colspan="2"&gt;Ball&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;HTML&lt;/td&gt;&lt;td&gt;25&lt;/td&gt;&lt;td&gt;30&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;CSS&lt;/td&gt;&lt;td colspan="2"&gt;28&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;

Bu jadvalning birinchi va uchinchi qatorlarida mos ravishda 2 ta HTML katagi, ammo 3
ta mantiqiy ustun bor. Birlashtirish qatordagi kataklar sonini avtomatik bir xil qilmaydi;
brauzer jadval joylashuvini qamrov qiymatlariga qarab hisoblaydi.
Manba: ICT7, PDF 128–135 (jadvallar, colspan/rowspan).



### 4.6 Formalar: qiymat yuborish mexanizmi

form foydalanuvchi ma’lumotlarini yig‘ish va yuborish hududini belgilaydi. action maqsad
manzil, method yuborish usuli; name forma maydonini yuborilgan ma’lumotda identifikatsiyalashda muhim. labelning for atributi inputning id qiymatiga mos kelganda maydon
yorlig‘i bog‘lanadi.

  &lt;form action="/register" method="post"&gt;
  &lt;label for="login"&gt;Ism:&lt;/label&gt;
  &lt;input id="login" name="username" required&gt;
  &lt;label for="age"&gt;Yosh:&lt;/label&gt;
  &lt;input id="age" name="age" type="number" min="7"&gt;
  &lt;button type="submit"&gt;Yuborish&lt;/button&gt;
  &lt;/form&gt;

type=”text” matn; password parolni ekranda niqoblaydi, uzatishni o‘zi shifrlamaydi; email
brauzer tekshiruviga yordam beradi; number son kiritishni chegaralashi mumkin; checkbox
ko‘p mustaqil tanlov; radio bir xil namega ega bo‘lsa bir guruhda bitta tanlov. select/option
ochiluvchi ro‘yxat, textarea ko‘p qatorli matn. required bo‘sh topshirishni client tomonida
cheklashi mumkin; server baribir tekshirish kerak.


### 4.7 GET va POST, parametr va cheklovlar

method="get" odatda parametrlarni URL query qismiga joylaydi; post so‘rov tanasiga joylaydi. POST o‘zi ma’lumotni shifrlamaydi; xavfsiz transport uchun HTTPS kerak. Formada
id bo‘lishi ma’lumot serverga yuborilishiga kafolat bermaydi: ko‘p boshqaruvlarda name
zarur. Belgilanmagan checkbox yoki radio tanlanmagan bo‘lsa ular odatda yuborilmaydi.
disabled bo‘lgan maydon odatda yuborilmaydi, readonly maydon (boshqa talablar bajarilsa)
yuborilishi mumkin.
Manba: ICT7, PDF 135–144 (forma teglari); zamonaviy HTML xulqiga oid aniqlashtirishlar hujjatdagi kod va tekshiruvlardan ajratilgan.



### 4.8 Attestatsiyada HTML kodini tekshirish tartibi

1. Teglar ichma-ich yopilganmi? Masalan, &lt;li&gt; tegining ichidagi ro‘yxat oldin yopiladi.

2. Tegning vazifasi to‘g‘rimi? href havola uchun, src rasm uchun.
3. Jadvalning rowspan/colspan qiymatlari joylashuvni o‘zgartiryaptimi?
4. Formada name, type, required, checked, disabled bor-yo‘qligini tekshiring.
5. Natijani brauzer versiyasi yoki qo‘shimcha CSSga bog‘liq hollardan ajrating.

  O‘z-o‘zini tekshirish
  1) &lt;ol start="5"&gt; ichida 3 li bo‘lsa oxirgi raqam qancha? 2) colspan="3" nima qiladi? 3)
  Bitta radio guruhini nima bog‘laydi? 4) alt nima uchun?
  Tekshiruv: 7; 3 ustunni qamraydi; bir xil name; rasmning muqobil tavsifi.



### 4.9 HTML formaning darslikdagi to‘liq input turlari

7-sinf milliy darsligining forma bobida input uchun turli type qiymatlari ko‘rsatiladi. text
matn, password niqobli parol, radio o‘zaro bog‘langan variant (bir xil name bilan), checkbox
mustaqil belgi, file foydalanuvchi faylini tanlash, image rasmli submit tugmasi, submit yuborish, reset boshlang‘ich qiymatlarni tiklash, hidden ko‘rinmaydigan maydon, button oddiy
tugmani ifodalaydi. date, email, number kabi turlar ham zamonaviy shakllarda qo‘llanadi.
Hidden qiymat xavfsiz sir emas: foydalanuvchi uni sahifa kodida ko‘ra oladi.

 Input type  Vazifasi  Muhim nazorat

 text/password  Matn / niqobli kiritish  Parolni yashirish HTTPS o‘rnini bosmaydi
 checkbox/radio  Ko‘p tanlov / bitta guruh  Radio uchun bir xil name kerak
 file  Fayl tanlash  Fayl yuborishda odatda multipart/form-
  data kerak
 submit/image  Formani jo‘natish  image koordinatalarni ham yuborishi
  mumkin
 reset  Dastlabki qiymatga qaytarish  Serverdagi  saqlangan  ma’lumotni
  o‘chirmaydi
 hidden  Ko‘rinmas qiymat  Maxfiylik kafolati yo‘q
 button  Oddiy tugma  Qo‘shimcha amal bo‘lmasa yubormaydi

Manba: ICT7, PDF 136–145 (input, form, select, textarea, label; xususan PDF 138–140).



### 4.10 HTMLning forma, ro‘yxat va jadval natijasini birlashtirgan

  misol

  &lt;form action="/send" method="post"
  enctype="multipart/form-data"&gt;
  &lt;label for="f"&gt;Fayl:&lt;/label&gt;
  &lt;input id="f" type="file" name="report"&gt;
  &lt;input type="hidden" name="group" value="7A"&gt;
  &lt;button type="submit"&gt;Jo''natish&lt;/button&gt;
  &lt;/form&gt;
  &lt;ol start="2"&gt;&lt;li&gt;Grafika&lt;ul&gt;
  &lt;li&gt;Rastr&lt;/li&gt;&lt;li&gt;Vektor&lt;/li&gt;
  &lt;/ul&gt;&lt;/li&gt;&lt;li&gt;Veb&lt;/li&gt;&lt;/ol&gt;

Ro‘yxatning tashqi bandlari 2. Grafika va 3. Veb; ichki bandlari esa Grafika bandining ichida
joylashadi. Forma jo‘natilganda report fayl maydoni bilan group=7A kalit-qiymat juftligi alohida ma’nolarga ega. Fayl maydonining tanlanmagan holati, browser va server konfiguratsiyasi haqiqiy HTTP natijasiga ta’sir qilishi mumkin.

  Darslik-muharrir farqi: ayrim darslik misollarida &lt;input&gt;...&lt;/input&gt; yozilgan. Zamonaviy HTMLda input — yopuvchi tegsiz void element; &lt;input ...&gt; yozilishi kerak. Tarixiy
bosma misolni texnik norma sifatida ko‘r-ko‘rona ko‘chirmaslik zarur.
Manba: ICT7, PDF 120–123 (ichma-ich ro‘yxat); PDF 128–135 (jadval); PDF 136–145 (forma). Zamonaviy sintaksis bilan farq izohi
— qo‘shimcha texnik aniqlashtirish.



### 4.11 Jadval kataklari va atributlar: odatiy imtihon tuzog‘i


  &lt;table&gt;
  &lt;tr&gt;&lt;th rowspan="2"&gt;Fan&lt;/th&gt;
  &lt;th colspan="2"&gt;Ball&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;th&gt;Oraliq&lt;/th&gt;&lt;th&gt;Yakuniy&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;HTML&lt;/td&gt;&lt;td&gt;20&lt;/td&gt;&lt;td&gt;30&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;

Birinchi qatorda HTML kodi bo‘yicha 2 ta katak elementi bor, lekin joylashuv bo‘yicha 3 ta
ustun: birinchi th keyingi qatorni ham egallaydi, ikkinchi th esa ikkita ustunni qamraydi.
Ikkinchi qatorda 2 ta yangi th bor; uchinchi mantiqiy ustunlar soni esa baribir 3. Ko‘pincha
tuzoq HTML katak teglari soni bilan mantiqiy ustunlar sonini adashtirishdir.
Manba: ICT7, PDF 128–135 (table, tr, td, th, rowspan, colspan).

CSS: HTML elementlarining ko‘rinishini
boshqarish


  Kompetensiya: CSS qoidalarini yozish va tatbiq etish; matn, rasm, ro‘yxat va jadvalni
  bezash; selektor, kaskad, box model va natijaviy ko‘rinishni tahlil qilish.



### 5.1 CSS qoidasining tuzilishi

CSS (Cascading Style Sheets) HTML elementlarining taqdimotini: rang, shrift, masofa,
chegara, joylashuv va boshqa ko‘rinish xossalarini boshqaradi. Qoida selektor hamda figurali qavs ichidagi deklaratsiya blokidan iborat. Har deklaratsiya xossa: qiymat ko‘rinishida
yoziladi.

  p { color: navy; font-size: 18px; }
  .notice { background-color: #fff4b8; }
  #title { text-align: center; }

Inline CSS: style atributida; internal CSS: &lt;style&gt; elementida; external CSS: &lt;link
rel="stylesheet" href="..."&gt; bilan alohida faylda. Tashqi fayl bitta saytning ko‘p sahifasidagi
uslublarni bir joyda boshqarish uchun mos.
Manba: Cambridge9, PDF 285–300, xususan 295–299 (CSS qoidalari); Cambridge8, PDF 79–85 (style atributi va natija).



### 5.2 Selektorlar: element, class, id va kombinatsiyalar

p barcha p elementlarini; .card class="card" elementlarini; #main id="main" elementini tanlaydi.
p.card faqat card sinfidagi p elementini tanlaydi; .card p esa card ichidagi barcha p avlodlarni qamraydi; .card &gt; p faqat bevosita farzand pni oladi. h1, h2 ikkala tur uchun bitta qoida
yaratadi.

  &lt;article class="card"&gt;
  &lt;p&gt;Bir&lt;/p&gt;&lt;section&gt;&lt;p&gt;Ikki&lt;/p&gt;&lt;/section&gt;
  &lt;/article&gt;
  &lt;style&gt;
  .card &gt; p { color: red; }
  .card p { font-weight: bold; }
  &lt;/style&gt;

Bu misolda Bir qizil va qalin; Ikki esa faqat qalin (agar boshqa uslub bo‘lmasa). Selektor',
 24, 'review'::public.content_status
),
(
 'e2150000-0000-4000-8000-000000000006'::uuid,
 (SELECT id FROM public.modules WHERE code='M11'),
 23, 'css-stillar-v2-review', 'CSS stillari — nazariya V2',
 '> **Manba:** Grafika va veb-texnologiyalar V2 (2026-10-18), maktab va Cambridge darsliklari, rasmiy spetsifikatsiya 27–31. Ushbu PDFdan chiqarilgan matn ekspert ko‘rigiga muhtoj; grafiklar uchun original PDFga qarang.

ichidagi bo‘shliq va &gt; belgisi bir xil emas.


### 5.3 Kaskad, spetsifiklik va meros

Bir xossaga bir nechta CSS qoida ta’sir qilsa kaskad tegishli qiymatni tanlaydi. Odatdagi
bir xil kelib chiqish va !important holati bo‘lmagan soddalashtirilgan tartibda: inline style
ko‘plab oddiy selektorlardan ustun, id – classdan, class – elementdan ustun. Bir xil spetsifiklikda keyinroq kelgan qoida yutadi. !important, kaskad qatlamlari va kelib chiqishlar bo‘lsa
kengaytirilgan qoidalar qo‘llanadi.

 p { color: blue; }
 .note { color: green; }
 #msg { color: red; }
 &lt;p id="msg" class="note"&gt;Salom&lt;/p&gt;

Natija – qizil, chunki #msg bu holatda eng yuqori spetsifiklikka ega. Lekin color meros qilinishi
mumkinligidan foydalanib border ham xuddi shunday meros bo‘ladi, deb xulosa qilmang:
barcha CSS xossalari meros bo‘lavermaydi.


### 5.4 Matn xossalari va birliklar

color matn rangini, background-color fon rangini belgilaydi. font-family shriftlar ro‘yxati,
font-size o‘lchami, font-weight qalinligi, font-style kursiv kabi uslubi, text-align tekislash,
text-decoration tagiga chizish va boshqa bezaklar, line-height qator orasi.

 h2 { color: #154360; text-align: center; }
 p { font-size: 1rem; line-height: 1.5; }
 a { text-decoration: none; }

px CSS pikseli; em nisbiy o‘lcham (xossaga qarab elementning tegishli shrift o‘lchamiga), rem
ildiz element shriftiga bog‘liq. % xossaga qarab turlicha bazaga nisbatan hisoblanadi: har
doim ota-ona eni degani emas.


### 5.5 CSS box model: content, padding, border va margin

Standart box-sizing: content-box rejimida ko‘rsatilgan width faqat content enidir; tashqi egallangan en = width + paddingL + paddingR + borderL + borderR + marginL + marginR (oddiy statik
joylashuv va mos o‘lchamlar uchun). box-sizing: border-box bo‘lsa ko‘rsatilgan width padding
va borderlarni o‘z ichiga oladi, lekin marginni emas.

  margin
  padding

  content

  border

  Box model masalasi
  Elementning content width qiymati 200px, chap/o‘ng padding 10px, border 2px, margin
  5px bo‘lsin. Jami gorizontal egallash 200+20+4+10 = 234px (shartdagi oddiy modelda).

  Marginni olib tashlasak tashqi border bilan birga en 224px.



### 5.6 Tasvirni bezash: o‘lcham va moslashuv

img{max-width:100%;height:auto;} rasmi ota konteynerdan keng chiqmasligiga yordam beradi,
nisbatni saqlashga intiladi. object-fit: cover rasmni berilgan qutiga to‘ldirib sig‘diradi, ortiqcha qismi kesilishi mumkin; contain butun rasmni ko‘rsatishga intiladi va bo‘sh joy qolishi mumkin.

 img.thumb {
  width: 180px; height: 100px;
  object-fit: cover;
  border: 2px solid #333;
  border-radius: 8px;
 }

Bu uslublar brauzerdagi ko‘rinishga ta’sir etadi, manba tasvir fayli piksel matritsasini qayta
eksport qilmaydi. HTML width atributi va CSS width deklaratsiyasi farqini, CSSning kaskadda
yakuniy natijani aniqlashini hisobga oling.


### 5.7 Ro‘yxat va jadval stillari

list-style-type  ro‘yxat markerining turini (masalan square, decimal, none) o‘zgartiradi.
list-style-position  marker joylashuviga ta’sir qiladi.  table{border-collapse:collapse;}
qo‘shni jadval chiziqlarini birlashtirishi mumkin; td,th{padding:8px;} katak ichki masofasini
belgilaydi; tr:nth-child(even) orqali jadvalning juft qatorlari bezatilishi mumkin.

 ul { list-style-type: square; }
 ol { list-style-type: upper-roman; }
 table { border-collapse: collapse; width: 100%; }
 th, td { border: 1px solid #777; padding: 8px; }
 tr:nth-child(even) { background: #eef4f7; }

HTMLda nechta qator/katak mavjudligi CSS fon va chegara qiymatlaridan mustaqil.
display:none bilan element joylashuvdan olinishi mumkin, ammo DOMdan o‘chirilmaydi;
visibility:hidden joyini saqlashi mumkin.



### 5.8 Ko‘rinish va ekranga moslashuv: layout asoslari

display:block odatda yangi qator egallovchi blok, inline matn oqimidagi element, flex esa
moslashuvchan qator/ustun joylashuv mexanizmi. margin:auto ayrim bloklarda gorizontal markazlash uchun ishlatiladi. Media query ekran/sharoitga qarab alohida qoida berish
imkonini beradi:

 .cards { display: flex; gap: 12px; }
 @media (max-width: 600px) {
  .cards { flex-direction: column; }
 }

Bu kod kichik ko‘rish maydonida kartochkalarni yonma-yon emas, ustun shaklida
ko‘rsatishga xizmat qiladi. Viewport width bilan haqiqiy qurilma ekran piksel soni bir
xil tushuncha emas.

Manba: Cambridge9, PDF 295–303 (CSS, selektorlar va jadvallar); CSS box model / media query – spetsifikatsiya talabini
chuqurlashtiruvchi texnik izoh.



### 5.9 CSS xatolarini topish metodikasi

1. HTML elementining class/id atributi selektorga mosmi?
2. Xossa nomi to‘g‘rimi (background-color, font-size)?
3. Qiymat va o‘lchov birligi kerak bo‘lsa yozilganmi?
4. Qavs va nuqtali vergullar kodni buzmaganmi?
5. Bir-biriga zid qoidalardan qaysi biri kaskad orqali yutishini tekshiring.
6. Xossaning meroslanishi yoki box model farqini hisobga oling.

  O‘z-o‘zini tekshirish
  1) .menu &gt; li qaysi lilarga tatbiq etiladi? 2) border-collapse:collapse qaysi element
  turida muhim? 3) color va background-color farqi nima? 4) 100px content, 5px padding
  (ikkala tomonda), 1px border (ikkala tomonda), 0 margin uchun tashqi en?
  Tekshiruv: bevosita farzandlar; jadval; matn/fon; 112px.



### 5.10 Cambridge 9-sinf 21-bob: CSSni uch usulda ulash

Inline: HTML elementning style atributi; internal: headdagi style bloki; external: alohida
.css faylni link rel="stylesheet" href="..." orqali bog‘lash. Bir xil sayt bo‘ylab bir uslubni
qo‘llash uchun tashqi uslub jadvali foydali. CSS qoida selektor va deklaratsiya blokidan iborat;
har bir deklaratsiya xossa: qiymat; shaklida yoziladi.

  &lt;head&gt;
  &lt;link rel="stylesheet" href="style.css"&gt;
  &lt;style&gt;p { color: blue; }&lt;/style&gt;
  &lt;/head&gt;
  &lt;body&gt;
  &lt;p class="x" style="color: green"&gt;Natija&lt;/p&gt;
  &lt;/body&gt;

Oddiy sharoitda inline green qoida ko‘rsatiladi, lekin !important, CSS origin/layer, ustuvorlik
va boshqa aniq holatlar natijani o‘zgartirishi mumkin. Darslikdagi “eng oxiri o‘qilgan uslub” degan soddalashtirishni universal qoida deb qabul qilmang. Avval amal qiladigan
deklaratsiyalar, muhimlik va spetsifiklik, shundan keyin tartib baholanadi.
Manba: Cambridge9, PDF 295–297 (21.03 bob: inline/internal/external, selector/declaration).



### 5.11 HTML elementlarining murakkab CSS tanlovi


  &lt;main class="card"&gt;&lt;p id="first"&gt;A&lt;/p&gt;
  &lt;section&gt;&lt;p&gt;B&lt;/p&gt;&lt;/section&gt;
  &lt;/main&gt;
  &lt;style&gt;
  .card p {color:blue;}
  .card &gt; p {color:red;}
  #first {font-weight:bold;}
  &lt;/style&gt;

.card p barcha p avlodlariga, .card &gt; p faqat bevosita farzandga tatbiq etiladi. Natija: A qizil
va qalin, B ko‘k. :hover kursor ustida turgan holatga, :nth-child(even) ayrim juft tartibdagi

farzandlarga qoida beradi. #id va .class boshqa-boshqa selektor kategoriyalaridir.
Manba: Cambridge9, PDF 296–299 (selektorlar va xossalar); murakkab kombinator namunasi — qo‘shimcha amaliy mashq.



### 5.12 Matn, rasm, ro‘yxat, jadval va quti modeli birga

 Element  CSS xossalari va vazifasi

 Matn  color, font-family, font-size, font-weight, line-height, text-align,
  text-decoration
 Rasm  width, height, max-width, object-fit, border-radius
 Ro‘yxat  list-style-type, list-style-position, padding-left
 Jadval  border, border-collapse, border-spacing, padding, background-color
 Quti  margin, border, padding, width, height, box-sizing


Masalan, width:200px, padding:10px, border:2px, margin:5px va content-box holatda jami gorizontal joy 200 + 2(10 + 2 + 5) = 234 px. Xuddi shu qoida border-boxda bo‘lsa, margin bilan jami
200 + 2 · 5 = 210 px. Bu hisob faqat berilgan deklaratsiyalar, oddiy oqim va boshqa o‘lcham
cheklovlari bo‘lmagan soddalashtirilgan model uchun.
Manba: Cambridge9, PDF 296–301 (CSS qoida va xossalar); quti modeli misoli — qo‘shimcha amaliy tushuntirish.',
 22, 'review'::public.content_status
)
ON CONFLICT(id) DO NOTHING;
DO $$ BEGIN
 IF (SELECT count(*) FROM public.lessons WHERE id::text LIKE 'e2150000-0000-4000-8000-%' AND status='review') < 6 THEN
  RAISE EXCEPTION 'TASK-213 theory staging incomplete or status mismatch';
 END IF;
END $$;
COMMIT;

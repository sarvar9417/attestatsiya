/** TASK-304: original digital audio and video production textbook. */
import type { TheoryBlock } from '../topicContent'
export const M10_07_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "Audio namuna chastotasi, PCM bit depth, mono/stereo, lossless/lossy, Audacity montaj, video FPS/bitrate, codec/container, subtitr va eksport bosqichlarini hisobli misollar bilan farqlash."
  },
  {
    "type": "intro",
    "content": "Raqamli media sifatini faqat fayl kengaytmasi yoki baland ovoz bilan o‘lchab bo‘lmaydi. Ushbu bob audio kodlash hisobidan boshlab tahrirga va yakuniy videoning muqobil ko‘rsatilishigacha ketma-ket mashqlar bilan yuradi."
  },
  {
    "type": "table",
    "content": "| Atama | Ma’nosi | Xato chalkashlik |\n|---|---|---|\n| Sample rate | Audio namuna/s | Video FPS emas |\n| Bit depth | PCM namuna aniqligi | MP3 bitrate emas |\n| FPS | Video kadr/s | Piksel aniqligi emas |\n| Bitrate | Bit/s | Fayl nomi emas |\n| Codec | Kodlash/siqish | Konteyner emas |\n| Container | Oqimlarni saqlash | Bitta kodek emas |"
  },
  {
    "type": "formula",
    "content": "Sof PCM bayt = davomiylik(s) × Hz × bit depth × kanal soni / 8. Bitrate bo‘yicha taxminiy oqim bayti = (bit/s × s) / 8; konteyner va boshqa oqimlar alohida hisoblanadi."
  },
  {
    "type": "heading",
    "content": "1. Audio va videoni tahrirlash maqsadi"
  },
  {
    "type": "definition",
    "content": "Audio tahriri yozuvni kesish, birlashtirish, shovqinni kamaytirish va tovush darajasini moslashga xizmat qiladi. Video montaj lavhalarni vaqt bo‘yicha yig‘adi, tasvir, sarlavha, ovoz va eksportni uyg‘unlashtiradi. Ikkalasida ham manba va shaxsiy ma’lumot huquqi tekshiriladi."
  },
  {
    "type": "case",
    "content": "Maktab podkasti uchun uch nutq yozuvi va kirish musiqasi bo‘laklarini to‘g‘ri tartiblang; ovoz balandligini sinab ko‘ring."
  },
  {
    "type": "trap",
    "content": "Katta effektlar soni yaxshi muloqot yoki sifatli ovoz isboti emas."
  },
  {
    "type": "task",
    "content": "1-mashq. Ikki daqiqalik video rolik uchun auditoriya, ovoz, subtitr va eksport rejasini yozing."
  },
  {
    "type": "heading",
    "content": "2. Analog signal, sample rate va namuna"
  },
  {
    "type": "definition",
    "content": "Raqamli audio analog signal qiymatini vaqt bo‘yicha muntazam namunalash orqali hosil qilinadi. Sample rate (Hz) sekunddagi namuna soni: 44 100 Hz sekundiga 44 100 namuna. Chastota qamrovi yozuv va diskretlash qoidalariga bog‘liq, raqamni shunchaki oshirish asl yozuvga yangi ma’lumot qo‘shmaydi."
  },
  {
    "type": "solved",
    "content": "44 100 Hz va bir kanal uchun 2 sekundda 88 200 namuna olinadi. 48 000 Hz bo‘lsa shu vaqtda 96 000 namuna."
  },
  {
    "type": "trap",
    "content": "Sample rate va FPS boshqa hodisa: audio namunalari bilan video kadrlari sonini adashtirmang."
  },
  {
    "type": "task",
    "content": "2-mashq. 22 050 Hz audio 4 sekundda nechta namuna olishini hisoblang."
  },
  {
    "type": "heading",
    "content": "3. Bit depth, amplituda va dynamic range"
  },
  {
    "type": "definition",
    "content": "PCM audioda bit depth bir namuna amplitudasini necha bitda ifodalashni ko‘rsatadi. 16-bit PCMda odatda 65 536 kvant darajasi mavjud; yuqoriroq aniqlik tahrirdagi shovqin va headroom bilan bog‘liq. Audacity ichki 32-bit float formatidan foydalanishi mumkin, eksport esa 16/24-bit PCM bo‘lishi mumkin."
  },
  {
    "type": "example",
    "content": "Bir xil namuna chastotali 24-bit stereo xom PCM 16-bitga nisbatan har soniyada 1,5 marta ko‘p joy egallaydi."
  },
  {
    "type": "trap",
    "content": "Yuqori bit depth sifatsiz mikrofonni mukammal qilmaydi; siqilgan MP3 bit rate bilan PCM bit depthni chalkashtirmang."
  },
  {
    "type": "task",
    "content": "3-mashq. 16-bit va 24-bit orasidagi xom hajm nisbatini hisoblang."
  },
  {
    "type": "heading",
    "content": "4. Mono, stereo va PCM xom hajmi"
  },
  {
    "type": "definition",
    "content": "Mono bitta, stereo ikki kanal bilan ishlaydi. Siqilmagan PCM sof data hajmi sekund × namuna chastotasi × bit depth × kanal soni / 8 baytga teng. Haqiqiy WAV konteyner sarlavhasi va metadata sabab boshqa qiymatga ega bo‘lishi mumkin."
  },
  {
    "type": "case",
    "content": "44 100 Hz × 16 bit × 2 kanal × 60 sekund ÷ 8 = 10 584 000 bayt xom PCM; shu yozuvni mono qilsangiz 5 292 000 bayt bo‘ladi."
  },
  {
    "type": "trap",
    "content": "Audio xom hajmini MP3 yoki FLAC fayli hajmiga tenglashtirmang: ular turlicha kodlaydi/siqadi."
  },
  {
    "type": "task",
    "content": "4-mashq. 48 000 Hz 16-bit mono audio 30 sekundda nechta sof bayt egallaydi?"
  },
  {
    "type": "heading",
    "content": "5. Compression: lossless va lossy"
  },
  {
    "type": "definition",
    "content": "Lossless siqish qayta ochilganda kodlangan original raqamli namunalarni yo‘qotishsiz tiklaydi; FLAC bunga misol. Lossy siqish ayrim audio axborotni qisqartirib, hajmni sezilarli kamaytiradi; MP3 odatda shunday. Muhim originalni arxivga saqlab, tarqatish nusxasini ajrating."
  },
  {
    "type": "solved",
    "content": "Podkastning tahrirlanadigan nusxasini WAV/FLACda, internetga yuklanadigan nusxasini mos MP3/AAC bilan tayyorlang."
  },
  {
    "type": "trap",
    "content": "«WAV har doim lossless format» deyish noto‘liq: WAV konteyneri turli audio kodlashlarni saqlashi mumkin; PCM WAV ko‘p tarqalgan."
  },
  {
    "type": "task",
    "content": "5-mashq. Arxiv va veb tarqatish uchun ikki formatni qo‘llab, qaysi ma’lumot saqlanishini ayting."
  },
  {
    "type": "heading",
    "content": "6. Audio dasturlar, ko‘p trek va montaj"
  },
  {
    "type": "definition",
    "content": "Audacity ko‘p trekli audio ishlar, kesish, shovqin pasaytirish va eksportda ishlatiladi. Adobe Audition qo‘shimcha professional vositalarga ega bo‘lishi mumkin. Ko‘p trekda ovoz, effekt va musiqa qatlamlari alohida nazorat qilinadi; mikslashda balandliklar muvozanatli bo‘lsin."
  },
  {
    "type": "example",
    "content": "Nutq alohida trekda, fon musiqasi pastroq trekda joylashgan. Fon nutqni bosib yuborsa musiqa darajasini pasaytiring."
  },
  {
    "type": "trap",
    "content": "Ctrl+X kesish hotkeyi faqat faol tanlov va dastur muhitida bajariladi; boshqa trekdagi nusxa ehtiyotsizlikdan yo‘qolmasin."
  },
  {
    "type": "task",
    "content": "6-mashq. Nutq va fon musiqasini uch bosqichda miks qilish ketma-ketligini yozing."
  },
  {
    "type": "heading",
    "content": "7. Noise reduction va tovush sifatini tekshirish"
  },
  {
    "type": "definition",
    "content": "Shovqinni kamaytirish algoritmlari fonni yumshatishi mumkin, ammo kuchli sozlamalar ovozga sun’iy metallik artefaktlar kiritishi mumkin. Quloqchin va dinamikda sinab ko‘rish, clippingni tekshirish va tinglash orqali qaror qilish muhim."
  },
  {
    "type": "case",
    "content": "Yozuvdagi ventilyator shovqinini namuna qilib Noise Reduction qo‘llang; o‘qituvchi ovozi buzilsa effektni kamaytiring yoki yaxshi qayta yozuvni tanlang."
  },
  {
    "type": "trap",
    "content": "Shovqinni cheksiz o‘chirish va tovushni cheksiz kuchaytirish original nutq sifatini qaytarmaydi."
  },
  {
    "type": "task",
    "content": "7-mashq. Tovushning shovqin va clipping xatolarini farqlang."
  },
  {
    "type": "heading",
    "content": "8. Video timeline, trim va transition"
  },
  {
    "type": "definition",
    "content": "Video editor timelineida kliplar vaqt bo‘yicha joylashadi, Trim keraksiz bosh/oxirni qisqartiradi, Split klipni bo‘ladi, Transition ikki kadr/lavha almashishini boshqaradi. B-roll asosiy nutqni mazmunli tasvirlar bilan to‘ldirishi mumkin."
  },
  {
    "type": "solved",
    "content": "Bir loyiha: kirish 5 soniya, asosiy jarayon 25 soniya, yakun 10 soniya; ortiqcha pauzalarni trim qiling, nutq sinxronligini saqlang."
  },
  {
    "type": "trap",
    "content": "Turli effektlar bilan klipdagi mazmuniy xatoni yashirib bo‘lmaydi; keraksiz transition auditoriyani chalg‘itadi."
  },
  {
    "type": "task",
    "content": "8-mashq. 40 soniyalik voqea uchun klip vaqt rejasi va kesish nuqtalarini yozing."
  },
  {
    "type": "heading",
    "content": "9. Video resolution, FPS va bitrate"
  },
  {
    "type": "definition",
    "content": "Video kadrining rezolyutsiyasi (masalan, 1920×1080) undagi piksel sonini, FPS esa sekunddagi kadrlarni belgilaydi. Bitrate sekundga kodlanadigan bitlar soni bo‘lib, siqish/sifat va fayl hajmiga ta’sir qiladi. VBR va CBR kabi kodlashda haqiqiy hajm taxminiy bo‘lishi mumkin."
  },
  {
    "type": "example",
    "content": "3 Mb/s o‘rtacha bitrateli 60 soniyalik video uchun sof oqim ≈ 3 000 000×60/8 = 22 500 000 bayt, lekin audio va konteyner sarlavhalari natijaga qo‘shiladi."
  },
  {
    "type": "trap",
    "content": "Bitrate bilan bit depth va FPS teng tushuncha emas; 60 FPS faqat ekran ravonligi uchun shartsiz tanlov emas."
  },
  {
    "type": "task",
    "content": "9-mashq. 1,5 Mb/s o‘rtacha video oqimi 2 daqiqada taxminan necha MB bo‘ladi?"
  },
  {
    "type": "heading",
    "content": "10. Codec va container farqi"
  },
  {
    "type": "definition",
    "content": "Kodek siqish/dekodlash usulini (masalan H.264, AV1, AAC) belgilaydi, konteyner esa video, audio va subtitr oqimlarini bitta faylga joylaydi (masalan MP4, MOV, MKV, WebM). Bir kengaytma bilan barcha qurilmada ishlash kafolatlanmaydi."
  },
  {
    "type": "case",
    "content": "MP4 ochilmayapti: fayl mavjudligini, video kodekni, audio kodekni, pleyer qo‘llovini va fayl buzilmaganini tekshiring."
  },
  {
    "type": "trap",
    "content": "MP4 bitta «video kodek» emas; WAV ham ko‘pincha konteyner sifatida ishlatiladi. AAC faqat Apple mahsulotlariga xos format emas."
  },
  {
    "type": "task",
    "content": "10-mashq. MP4, H.264, MOV, FLAC va AACni konteyner/kodek/turga ajrating."
  },
  {
    "type": "heading",
    "content": "11. Subtitr, mualliflik va auditoriya"
  },
  {
    "type": "definition",
    "content": "Subtitr eshitish imkoniyati cheklangan yoki ovozsiz ko‘ruvchi uchun yordam beradi; transkript nutqning matnli nusxasi sifatida qidirish va o‘rganishni osonlashtiradi. Audio/video lavhalarining litsenziyasi, o‘quvchi tasviri va shaxsiy ma’lumot bo‘yicha ruxsatni tekshiring."
  },
  {
    "type": "solved",
    "content": "Tajriba videosida ilmiy atamalarni subtitrga tushirib, uning tushunarliligini ovozsiz sinab ko‘ring; sinf o‘quvchisining yuzini tarqatishdan oldin ruxsatni tekshiring."
  },
  {
    "type": "trap",
    "content": "Avtomatik subtitr texnik atamalarda xato qilishi mumkin; uni ko‘rmasdan e’lon qilish xavfli."
  },
  {
    "type": "task",
    "content": "11-mashq. Bir ta’limiy rolik uchun alt muqobil, subtitr, transkript va ruxsat ro‘yxatini yozing."
  },
  {
    "type": "heading",
    "content": "12. Eksport, loyiha fayli va amaliy nazorat"
  },
  {
    "type": "definition",
    "content": "Import → tahrir → eksport video/audio ishining odatiy zanjiri; ishchi loyiha fayli va tayyor fayl farqlidir. Eksportdan so‘ng faylni boshqa qurilmada ochish, ovoz/tasvir sinxronligi, hajm, subtitr va havola ishlashini tekshirish kerak."
  },
  {
    "type": "example",
    "content": "Tadbir lavhasini montaj qilishda tahrirlanuvchi loyihani saqlang, so‘ng MP4 va alohida subtitr faylini boshqa kompyuterda sinang."
  },
  {
    "type": "trap",
    "content": "Render tugmasi bosilishi avtomatik ravishda faylning xavfsizligi, yaxlitligi va sifatini isbotlamaydi."
  },
  {
    "type": "task",
    "content": "12-mashq. Montajning 5 bosqichli sifat rubrikasi va bitta zaxira rejasini yozing."
  },
  {
    "type": "summary",
    "content": "Hz — audio namuna chastotasi; bit depth amplituda kodlanishi; mono/stereo kanallar. PCM xom hajmi formula bilan hisoblanadi. FLAC lossless, MP3 odatda lossy. Videoda FPS va bitrate turli o‘lchov; MP4/MOV konteyner, H.264/AV1 video kodek, AAC audio kodek. Import–montaj–eksportdan keyin subtitr, ruxsat va boshqa qurilmada sinov shart."
  },
  {
    "type": "answers",
    "content": "2) 22 050×4 = 88 200 namuna; 3) 24/16 = 1,5; 4) 48 000×16×1×30/8 = 2 880 000 bayt; 5) arxivga FLAC/PCM, vebga siqilgan; 6) ovoz balansli; 7) shovqin va clipping farqli; 8) 5+25+10 = 40 sekund; 9) 1 500 000×120/8 = 22 500 000 bayt = 22,5 MB (decimal); 10) MP4/MOV konteyner, H.264/AAC kodek, FLAC lossless audio kodek/format; 11) subtitr tekshiriladi; 12) tayyor fayl alohida sinov. Boshqa ochiq javoblar dalil bilan baholanadi."
  },
  {
    "type": "source",
    "content": "Manbalar: Cambridge+ 10–11-sinf 1-bobda tovush namunalash/bit chuqurligi/kadr tezligi/siqish va multimedia, bobning keyingi bo‘limlarida video tahrir (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view); Cambridge+ 8-sinf video yaratish (https://drive.google.com/file/d/1hZyLM5n0OUtuJI3M3dFeAz8kyv9Sr6Ng/view); Audacity rasmiy sample bit depth (https://manual.audacityteam.org/man/sample_format_bit_depth.html) va FLAC eksport qo‘llanmalari (https://manual.audacityteam.org/man/flac_export_options.html). Formulali misollar mualliflik qayta ishlanma; PDFning barcha fizik betlari/rasmlari 1:1 tasdiqlanmagan."
  }
]

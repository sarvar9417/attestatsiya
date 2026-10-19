/**
 * Page-audited, original digital-literacy syntheses from ICT 8-sinf (2020).
 * This book is mainly about SMM, web CMS, LMS, MOOC and freelance: platform
 * procedures belong to other modules; only M01.04 digital citizenship is
 * augmented here. Page traces are PDF indices in the full 113-page copy.
 */
import type { VerifiedTextbookInsertion } from './m01TextbookAudit'

export const ICT8_M01_PAGE_ADDENDA: readonly VerifiedTextbookInsertion[] = [
  {
    topicId: 'M01.04',
    beforeHeading: 'Axborot jarayonlari va hayot sikli',
    blocks: [
      { type: 'subheading', content: '8-sinf: ijtimoiy media kontenti, auditoriya va maqsad' },
      { type: 'table', content: '| Savol | Raqamli savodxonlik qarori | Muammoli misol |\n|---|---|---|\n| Maqsad | Xabar nimaga kerakligini aniqlang | Shov-shuv uchun sarlavha |\n| Auditoriya | Kimga kerakli va tushunarli ekanini aniqlang | Bolaga kattalar tilidagi ko‘rsatma |\n| Media | Matn, grafika, audio, video orasidan mosini tanlang | Dalilsiz rolik |\n| Natija | Dalilga asoslangan o‘zgarishni baholang | Faqat layk soniga qarash |',
        headers: ['Savol', 'Raqamli savodxonlik qarori', 'Muammoli misol'],
        rows: [
          ['Maqsad', 'Xabar nimaga kerakligini aniqlang', 'Shov-shuv uchun sarlavha'],
          ['Auditoriya', 'Kimga kerakli va tushunarli ekanini aniqlang', 'Bolaga kattalar tilidagi ko‘rsatma'],
          ['Media', 'Matn, grafika, audio, video orasidan mosini tanlang', 'Dalilsiz rolik'],
          ['Natija', 'Dalilga asoslangan o‘zgarishni baholang', 'Faqat layk soniga qarash'],
        ],
      },
      { type: 'trap', content: 'Ijtimoiy tarmoqda biror xabar ko‘p ko‘rilgani uning to‘g‘riligini isbotlamaydi. Reklama postlari, foydalanuvchi fikri va mustaqil manbali faktni farqlang. Darslikdagi platformalar mashhurligi, foydalanuvchilar soni va tugmalar joylashuvi **2020-yil kontekstiga oid**; hozir o‘zgargan bo‘lishi mumkin.' },
      { type: 'source', content: 'ICT 8-sinf (2020), PDF 5–22 (bosma 4–21-betlar); SMM asoslari, Facebook/YouTube/Telegram/Instagram va maʼlumotni tarqatish. Platforma interfeyslari ko‘chirilmagan.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: 'Axborot jarayonlari va hayot sikli',
    blocks: [
      { type: 'subheading', content: '8-sinf: raqamli loyiha xabarlarini masʼuliyat bilan rejalashtirish' },
      { type: 'case', content: 'Maktab kutubxonasiga yangi kitoblar kelgani haqida xabar tayyorlanmoqda. 1) Maqsadni aniqlang — o‘quvchilarni xabardor qilish; 2) auditoriyani belgilang — qaysi sinflar; 3) media tanlang — qisqa matn, tushunarli tasvir yoki video; 4) manba va suratga olishga ruxsatni tekshiring; 5) natijani foydali teskari aloqa orqali baholang. Bitta platformaning obunachilari ko‘p bo‘lgani uning hamma vaziyatda eng yaxshi kanal ekanini anglatmaydi.' },
      { type: 'list', ordered: false, content: 'Ruxsatsiz shaxsiy surat/manzil eʼlon qilmaslik.\nKontent muallifligi va litsenziya shartlariga rioya qilish.\nReklama yoki homiylik xabarini yashirmaslik.\nYosh va kontekstga mos ravishda auditoriyani himoya qilish.\nFikr-mulohazalarni hurmat bilan saralash va tekshirish.',
        items: [
          'Ruxsatsiz shaxsiy surat/manzil eʼlon qilmaslik.',
          'Kontent muallifligi va litsenziya shartlariga rioya qilish.',
          'Reklama yoki homiylik xabarini yashirmaslik.',
          'Yosh va kontekstga mos ravishda auditoriyani himoya qilish.',
          'Fikr-mulohazalarni hurmat bilan saralash va tekshirish.',
        ],
      },
      { type: 'source', content: 'ICT 8-sinf (2020), PDF 23–36 (bosma 22–35-betlar); SMM maqsadi, auditoriya, kanal tanlash va loyiha sahifasi, manba asosida original taʼlimiy misol.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: 'Axborotning to‘liq hayotiy sikli va dalil auditi',
    blocks: [
      { type: 'subheading', content: '8-sinf: CMS, LMS va MOOC tushunchalarining vazifasi' },
      { type: 'table', content: '| Tizim | Asosiy vazifasi | Savodxonlikda farqlanishi |\n|---|---|---|\n| CMS | Veb-sayt materiallarini boshqarish | Nashr, tahrir, rol va kontent |\n| LMS | O‘quv kursi va baholashni boshqarish | Tinglovchi, topshiriq, progress |\n| MOOC | Ommaviy ochiq onlayn kurs modeli | Keng auditoriya, masofaviy ta’lim |',
        headers: ['Tizim', 'Asosiy vazifasi', 'Savodxonlikda farqlanishi'],
        rows: [
          ['CMS', 'Veb-sayt materiallarini boshqarish', 'Nashr, tahrir, rol va kontent'],
          ['LMS', 'O‘quv kursi va baholashni boshqarish', 'Tinglovchi, topshiriq, progress'],
          ['MOOC', 'Ommaviy ochiq onlayn kurs modeli', 'Keng auditoriya, masofaviy ta’lim'],
        ],
      },
      { type: 'trap', content: 'CMS, LMS va MOOC bir xil texnologiya emas: MOOC — ko‘proq kursni tashkil qilish uslubi yoki ochiq kurs turi; uning ortida LMS ham ishlashi mumkin. «Ochiq kurs» degani har doim **bepul sertifikat** yoki to‘liq cheklovsiz material degani emas. Darslikdagi dastur yoki platforma misolining hozirgi funksiyasi alohida tekshiriladi.' },
      { type: 'source', content: 'ICT 8-sinf (2020), PDF 37–59 (CMS), 60–76 (LMS), 77–93 (MOOC), bosma betlarda odatda PDF indeksidan 1 kam; nazariya faqat asosiy tushuncha darajasida M01.04ga, sayt/kurs yaratish qadamlari boshqa modullarga qoldirildi.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: 'Raqamli xavfsizlikning kundalik minimumi',
    blocks: [
      { type: 'subheading', content: '8-sinf: onlayn hamkorlik va raqamli mehnat etikasini baholash' },
      { type: 'case', content: 'Internetda kichik loyiha uchun xizmat taklifi olindi. Ish hajmi, mualliflik huquqi, muddat va aloqa kanallarini aniq kelishish zarur. Shaxsni tasdiqlash va firibgarlikdan ehtiyot bo‘lish muhim; maxfiy hujjat, to‘lov rekviziti yoki parolni shubhali xabarga yubormang. Voyaga yetmaganlar uchun platforma shartlari va kattalar roziligi alohida ahamiyatga ega.' },
      { type: 'trap', content: 'Darslikdagi «boshlang‘ich mablag‘ talab qilinmaydi» yoki «katta daromad barqaror» kabi umumiy g‘oyalarni kafolat deb qabul qilmang. Platforma komissiyasi, to‘lov xavfi, shartnoma, soliqlar va raqamli xavfsizlik ehtiyojlari faoliyat turiga qarab farqlanadi. Attestatsiya nuqtayi nazarida bu raqamli xizmatlarni xavfsiz va axloqiy baholash uchun qo‘shimcha kontekst.' },
      { type: 'source', content: 'ICT 8-sinf (2020), PDF 94–104 (bosma 93–103-betlar); web-freelance, masofadan hamkorlik, imkoniyat va xatarlar. Huquqiy/bozor holati haqidagi qatʼiy tarixiy daʼvolar ko‘chirilmagan.' },
    ],
  },
]

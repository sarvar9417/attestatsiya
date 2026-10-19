/**
 * TASK-244 | Cambridge+ 6-sinf (Uzbek, 2021), based on ICT Starters Next Steps.
 * Source is complete 244-page PDF. The Internet/email chapters map to M01.04,
 * while database/Excel/word processing and Scratch map to other modules.
 * Printed page = PDF page minus 3 in relevant chapters.
 */
import type { VerifiedTextbookInsertion } from './m01TextbookAudit'

export const CAMBRIDGE6_M01_PAGE_ADDENDA: readonly VerifiedTextbookInsertion[] = [
  {
    topicId: 'M01.04',
    beforeHeading: 'URL va qidiruv natijasini texnik o‘qish',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 6-sinf: URL, qidiruv indeksi va natijani saralash algoritmi' },
      { type: 'table', content: '| Tushuncha | Nima uchun kerak? | Tekshirish usuli |\n|---|---|---|\n| URL | Resurs manzilini aniqlash | Protokol, host/domen, yo‘l va parametr |\n| Qidiruv indeksi | Topilgan sahifalardagi axborotni qidirishga mos tuzilma | Indeks barcha internetni to‘liq qamrab olmaydi |\n| Reyting algoritmi | Qidiruvga mos natijalarni tartiblash | Turli tizimlarda tartib farqlanishi mumkin |\n| Filtr | Natijalarni tanlangan shart bo‘yicha cheklash | Til, sana, manba yoki mavzu |',
        headers: ['Tushuncha', 'Nima uchun kerak?', 'Tekshirish usuli'],
        rows: [
          ['URL', 'Resurs manzilini aniqlash', 'Protokol, host/domen, yo‘l va parametr'],
          ['Qidiruv indeksi', 'Topilgan sahifalardagi axborotni qidirishga mos tuzilma', 'Indeks barcha internetni to‘liq qamrab olmaydi'],
          ['Reyting algoritmi', 'Qidiruvga mos natijalarni tartiblash', 'Turli tizimlarda tartib farqlanishi mumkin'],
          ['Filtr', 'Natijalarni tanlangan shart bo‘yicha cheklash', 'Til, sana, manba yoki mavzu'],
        ],
      },
      { type: 'case', content: '«Qadimgi Misr piramidalari» va «Kitlar» so‘rovini ikki yoki uch qidiruv tizimida taqqoslang. Top-5 natija bir xil bo‘lmasligi mumkin: indeks yangilanishi, reyting mezoni, foydalanuvchi mintaqasi va boshqa omillar taʼsir qiladi. Faqat yuqori o‘rin yoki tanish sayt nomiga qarab xulosa qilmang.' },
      { type: 'trap', content: 'Darslikda indeks «avval qidirgan kalit so‘zlar va veb-sahifalar ro‘yxati» sifatida soddalashtiriladi; qidiruv indeksi **shaxsiy qidiruv tarixining o‘zi emas**, tizim tomonidan topilgan sahifa/hujjatlarni qidirishga mos maʼlumot tuzilmasidir. `.uz` singari yuqori darajali domen **serverning haqiqiy fizik joylashuvini yoki kontentning har doim ishonchli ekanini isbotlamaydi**.' },
      { type: 'source', content: 'Cambridge+ 6-sinf, 2021, PDF 162–166 (bosma 159–163-betlar), 6-modul «Internetda ishlashni o‘rganish»: URL, domen, indeks, filtrlash, reyting algoritmlari va turli qidiruv tizimlarini taqqoslash.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: 'Axborotni taqdim etish, auditoriya va accessibility',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 6-sinf: manbalar orasidagi muvofiqlik va mustaqil tekshirish' },
      { type: 'case', content: 'Bitta saytda «eng katta it»ning bo‘yi, ikkinchi saytda esa vazni yozilgan. Ikkala natijani to‘g‘ridan-to‘g‘ri tenglashtirmasdan oldin **o‘lchov mezoni va birligini** moslang; muallif, sana va dalilini tekshiring. Bir necha mustaqil manba bir xil tasdiqlangan faktni keltirishi ishonchni oshirishi mumkin, lekin manbalarning bir-biridan ko‘chirganini ham istisno qilmaydi.' },
      { type: 'table', content: '| Manba bilan amal | Mazmuni | Ehtiyot chorasi |\n|---|---|---|\n| Bukmark (bookmark) | URLga tez qaytish uchun belgi | Veb-sahifa keyinchalik o‘zgarishi mumkin |\n| URL nusxalash | Manzilni qayd qilish | Muallif, sarlavha va sanani ham belgilang |\n| Matndan foydalanish | Dalilni o‘z izohingizda keltirish | Havola, iqtibos va litsenziyani tekshiring |\n| Veb-sahifani chop etish | Ayni paytdagi nusxa | Chop etish dalilning haqiqiyligini isbotlamaydi |',
        headers: ['Manba bilan amal', 'Mazmuni', 'Ehtiyot chorasi'],
        rows: [
          ['Bukmark (bookmark)', 'URLga tez qaytish uchun belgi', 'Veb-sahifa keyinchalik o‘zgarishi mumkin'],
          ['URL nusxalash', 'Manzilni qayd qilish', 'Muallif, sarlavha va sanani ham belgilang'],
          ['Matndan foydalanish', 'Dalilni o‘z izohingizda keltirish', 'Havola, iqtibos va litsenziyani tekshiring'],
          ['Veb-sahifani chop etish', 'Ayni paytdagi nusxa', 'Chop etish dalilning haqiqiyligini isbotlamaydi'],
        ],
      },
      { type: 'trap', content: 'Darslik Wikipedia sahifalarini umumiy tarzda «ishonchli manba emas» deya tasvirlaydi. Ta’limiy tekshiruvda uni **boshlang‘ich yo‘naltiruvchi manba** deb ishlatish mumkin, ammo muhim fakt uchun maqolaning ko‘rsatilgan **asl manbasini ochish va mustaqil tekshirish** zarur. Taniqli ensiklopediya ham xatodan butunlay xoli degani emas.' },
      { type: 'source', content: 'Cambridge+ 6-sinf, 2021, PDF 167–180 (bosma 164–177-betlar), 6-modul: Britannica/Wikipedia, bir necha manba, filtrlash, bukmark, URL va tadqiqotga havola, Quyosh loyihasi. Umumlashtirilgan ishonchlilik daʼvolari farqlab tushuntirildi.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: 'Mualliflik huquqi, litsenziya, maxfiylik va raqamli etika',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 6-sinf: Reply, Reply All, Forward, CC va BCC qamrovi' },
      { type: 'table', content: '| Amal | Qabul qiluvchi / ko‘rinish | Eng muhim tekshiruv |\n|---|---|---|\n| Reply | Asosan yuboruvchiga javob | Kerakli kishigagina yuboring |\n| Reply All | Javobdagi barcha tegishli oluvchilar | Hammaga zarurmi? |\n| Forward | Oldingi xabarni boshqa kishiga uzatish | Yuboruvchining roziligi va xat maxfiyligi |\n| CC | Ko‘rinadigan nusxa oluvchilar | Manzillar bir-biriga oshkor bo‘lishi mumkin |\n| BCC | Boshqalarga yashirin nusxa oluvchi | Olgan odam xatni ko‘rib, uni boshqa kishiga uzatishi mumkin |',
        headers: ['Amal', 'Qabul qiluvchi / ko‘rinish', 'Eng muhim tekshiruv'],
        rows: [
          ['Reply', 'Asosan yuboruvchiga javob', 'Kerakli kishigagina yuboring'],
          ['Reply All', 'Javobdagi barcha tegishli oluvchilar', 'Hammaga zarurmi?'],
          ['Forward', 'Oldingi xabarni boshqa kishiga uzatish', 'Yuboruvchining roziligi va xat maxfiyligi'],
          ['CC', 'Ko‘rinadigan nusxa oluvchilar', 'Manzillar bir-biriga oshkor bo‘lishi mumkin'],
          ['BCC', 'Boshqalarga yashirin nusxa oluvchi', 'Olgan odam xatni ko‘rib, uni boshqa kishiga uzatishi mumkin'],
        ],
      },
      { type: 'trap', content: '**BCC maxfiy xabar shifrlashi emas**; faqat ayrim oluvchilar manzilini xat sarlavhasi ro‘yxatida yashiradi. **Reply All** ni har bir guruh javobida ishlatish majburiy emas. Darslikda Forward qilishdan oldin boshqaning ruxsatini hisobga olish alohida uqtirilgan.' },
      { type: 'source', content: 'Cambridge+ 6-sinf, 2021, PDF 181–196 (bosma 178–193-betlar), 7-modul «Emaildan foydalanishni o‘rganish»: Reply All, guruh manzillari, CC/BCC va boshqa manzilga uzatishdan oldingi rozilik.' },
    ],
  },
  {
    topicId: 'M01.04',
    beforeHeading: 'Raqamli xavfsizlikning kundalik minimumi',
    blocks: [
      { type: 'subheading', content: 'Cambridge+ 6-sinf: xat ilovasi, tekshirish va papkalar' },
      { type: 'case', content: 'O‘qituvchi nomidan tasvir ilova qilingan xat keldi. **Faqat ko‘rsatilgan ismga ishonmang**: yuboruvchi manzilini va xat kontekstini tekshiring, kerak bo‘lsa boshqa kanal orqali tasdiqlang; keyin ilovani ochish yoki yuklab olishga qaror qiling. Biror faylning turi va kengaytmasi ham uning xavfsizligini kafolatlamaydi.' },
      { type: 'table', content: '| Vazifa | Texnik amal | Savodxonlik tekshiruvi |\n|---|---|---|\n| Fayl yuborish | Attachment / biriktirish | Hajm va xizmat limitini tekshirish |\n| Xatni tartiblash | Papka / label / yorliq | Hujjat qayerdaligini qayta topish |\n| Javobni qayta ishlash | Ilovani ochish/tahrirlash | Manba, rozilik va o‘zgarishlar izini saqlash |',
        headers: ['Vazifa', 'Texnik amal', 'Savodxonlik tekshiruvi'],
        rows: [
          ['Fayl yuborish', 'Attachment / biriktirish', 'Hajm va xizmat limitini tekshirish'],
          ['Xatni tartiblash', 'Papka / label / yorliq', 'Hujjat qayerdaligini qayta topish'],
          ['Javobni qayta ishlash', 'Ilovani ochish/tahrirlash', 'Manba, rozilik va o‘zgarishlar izini saqlash'],
        ],
      },
      { type: 'trap', content: 'Darslikda Gmail fayl biriktirish limiti «25Mb» deb berilgan. **Mb (megabit)** va **MB (megabayt)** farqli: limit birligi va miqdori servisning **hozirgi qoidalari** asosida aniqlanadi; 2021-yildagi bitta servis qiymati hamma elektron pochta uchun qatʼiy standart emas. Papka/yorliq nomlari va ularning ishlashi ham provayderga bog‘liq.' },
      { type: 'source', content: 'Cambridge+ 6-sinf, 2021, PDF 196–205 (bosma 193–202-betlar), 7-modul: email attachments, tanish manzildan kelgan ilovani tekshirish, papka/label va tahrirlangan hujjatni qayta yuborish.' },
    ],
  },
]

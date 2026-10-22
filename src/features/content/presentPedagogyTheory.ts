/**
 * Reader-only copy editing for the published M14–M16 pedagogy books.
 *
 * Source provenance remains in the immutable lesson body and authored additions.
 * Never use this projection to edit DB records or determine exam answer keys.
 */
import type { TheoryBlock } from '../../data/topicContent'

const sourceOnly = /^(?:>\s*)?\*{0,2}(?:asl manba|manba(?: izi|lar)?|telegramdagi manba(?:lar)?)\s*:\*{0,2}/i
const answerKeyOnly = /^\*\*\d{1,3}-savolning asl javobi:/i
const provenanceOnly = /^(?:qo‘shimcha tekshiruv|qo'shimcha tekshiruv)\s*:/i

function learnerHeading(heading: string): string {
  return heading
    .replace(/\s+\[(?:THEORY-CORPUS|PEDGULI-STUDY)[^\]]+\]/gi, '')
    .replace(/^Kasb standarti:\s*to‘liq nazariya xaritasi/i, 'Kasb standarti: vazifalar va ko‘nikmalar')
    .replace(/^Asl kasb standarti\s*[—-]\s*/i, 'Kasb standarti: ')
    .replace(/^(?:Kuzgi 2025|Kuzgi to‘plam|Bahorgi to‘plam|2025 bahorgi PDF|2025 bahor PDF|2024 to‘plam|2025 to‘plam|2025 PDF|PedKasb to‘plami|PedKasb|Bahorgi attestatsiya to‘plamidan|Telegram rasmlaridan|Telegram manbasidan|Pedmahorat\|Guli hujjatidan|Pedmahorat\|Guli manbasidan|Pedmahorat\|Guli|Telegram qo‘llanmasi):\s*/i, '')
    .replace(/^Manbalardagi qo‘llash ketma-ketligi/i, 'Qo‘llash ketma-ketligi')
    .replace(/^Chuqurlashtirilgan nazariya\s*[—-]\s*manba korpusi.*$/i, 'Chuqurlashtirilgan nazariya')
    .replace(/^Tekshirilgan qo‘shimcha:\s*/i, '')
    .trim()
    .replace(/^([a-z])/i, first => first.toUpperCase())
}

function learnerSentence(text: string): string {
  return text
    .replace(
      /^2025-yil kuzgi Pedmahorat\|Guli manbasining 14-betida ustoz yangi mavzudan oldin savol-javob va konseptual xarita yordamida bolalarning mavjud bilimini aniqlaydi\.?$/i,
      'Yangi mavzudan oldin o‘qituvchi savol-javob va konseptual xarita yordamida o‘quvchilarning mavjud bilimlari hamda noto‘g‘ri tushunchalarini aniqlaydi. Natijaga qarab dars maqsadi, mashqlar va yordam darajasi moslashtiriladi.',
    )
    .replace(/^\*\*O‘quv jarayonini rejalashtirish\.\*\*\s*4-betdagi \*\*A\/01\.6\*\* jadvali /i, '**O‘quv jarayonini rejalashtirish.** A/01.6 mehnat vazifasi ')
    .replace(/^Pedmahorat\|Guli manbasining \*Pedagogik mahorat to‘plam 2025 \(6\)\.pdf\* \*\*8-betidagi bosma 38–40-savollar\*\* darsga tayyorgarlikni farqlash uchun uchta bosqichni ko‘rsatadi:/i, 'Darsga tayyorgarlikning uch bosqichi bir-biridan farqlanadi:')
    .replace(/^Pedmahorat\|Guli to‘plamidagi \*\*38–40-savollar\*\* darsga tayyorgarlikni bir-biridan farqlanadigan uch bosqichda yoritadi\./i, 'Darsga tayyorgarlik uch bosqichdan iborat: tashxislash, bashoratlash va loyihalash.')
    .replace(/^2024-yilgi .+ manbasida o‘qituvchi faoliyatidagi \*\*demokratik\*\*, \*\*avtoritar\*\* va \*\*liberal\*\* uslublar alohida vaziyatlarda berilgan\./i, 'Sinfni boshqarishda **demokratik**, **avtoritar** va **liberal** uslublar farqlanadi. Ularni o‘qituvchining muloqot hamda qaror qabul qilish usuli orqali aniqlash mumkin.')
    .replace(/^2024-yilgi Pedmahorat\|Guli PDFning \*\*56-savoli\*\* bahoni asoslashning asosiy natijalarini \*maqsadga erishishni ko‘rsatish va motivatsiya berish\* deb belgilaydi\. Shu to‘plamning \*\*312-savoli\*\* o‘quvchi hamda ota-onalarga ta’lim va baholash natijalari yuzasidan qayta aloqa berish uchun turli strategiyalardan foydalanishni so‘raydi\./i, 'Bahoni asoslash o‘quvchi qaysi maqsadga erishganini ko‘rsatadi va keyingi o‘rganishga undaydi. O‘quvchi hamda ota-onaga natija yuzasidan tushunarli, xolis va keyingi qadamni ko‘rsatuvchi qayta aloqa berish muhim.')
    .replace(/^Pedmahorat\|Guli manbasidagi \*\*9-bet, bosma 41–43-savollar\*\* nizoga pedagogik munosabat bildirishning uch ko‘rinishini farqlaydi\./i, 'Pedagogik nizoni hal etishda ishontirish, talab qo‘yish va suhbat kabi yondashuvlarning vazifasini farqlash kerak.')
    .replace(/^Pedmahorat\|Guli kanalining \[7138-xabarida\]\([^)]+\) pedagogning ijodiy faolligi quyidagi \*\*to‘rt daraja\*\* orqali tasvirlangan\. Bu xabardagi o‘quv tasnifi; uni alohida rasmiy attestatsiya mezoni sifatida talqin qilish uchun qo‘shimcha normativ manba talab etiladi\./i, 'Pedagogning ijodiy faolligini quyidagi **to‘rt daraja** asosida o‘quv modeli sifatida taqqoslash mumkin. Bu tasnifni rasmiy attestatsiya mezoni bilan adashtirmaslik kerak.')
    .replace(/^2025-yilgi Pedmahorat\|Guli attestatsiya to‘plamida \*\*induksiya\*\* va \*\*deduksiya\*\*ning qarama-qarshi fikrlash yo‘nalishlari taqqoslanadi\./i, '**Induksiya** xususiy kuzatishlardan umumiy xulosaga, **deduksiya** esa umumiy qoidadan xususiy xulosaga boradi.')
    .replace(/^Kuzgi Pedmahorat\|Guli to‘plamining 2–3, 16–17-betlari asosida ushbu tushunchalarni taqqoslash:/i, 'Quyidagi tushunchalarni bir-biridan farqlang:')
    .replace(/^2025-yil kuzgi to‘plamdagi ayrim savollar quyidagi kognitiv amallarni farqlashni talab etadi\./i, 'Bilish jarayonida quyidagi kognitiv amallarni farqlash muhim.')
    .replace(/^Pedmahorat\|Guli kuzgi to‘plamida usullarning faqat ta’rifi emas, \*\*foydali va noto‘g‘ri qo‘llanganda salbiy natijasi\*\* ham taqqoslangan\./i, 'Tarbiya usulini baholashda uning nafaqat ta’rifi, balki **to‘g‘ri qo‘llangandagi foydasi va noo‘rin qo‘llangandagi salbiy oqibati** ham hisobga olinadi.')
    .replace(/^Dars kuzatuvida bir xil vaziyat turli mezon bilan tekshirilishi mumkin\. 2024-yilgi PDFda quyidagi ikki tahlil farqlanadi\./i, 'Dars kuzatuvida bir vaziyat turli mezon bilan tahlil qilinishi mumkin. Quyidagi ikki tahlil turini farqlang.')
    .replace(/^PedKasb to‘plamining \*\*9-savolida\*\* o‘qituvchi noto‘g‘ri javobni kamsitmaydi, uning sababini madaniyatli tushuntiradi, o‘quvchining fikr aytishiga imkon beradi va barcha bilan hurmat asosida muomala qiladi\./i, 'O‘quvchi noto‘g‘ri javob berganida o‘qituvchi uni kamsitmaydi: xato sababini xotirjam tushuntiradi, fikr aytishga imkon beradi va muloqotda hurmatni saqlaydi.')
    .replace(/^`Pedagogik mahorat to'plam 2025 \(6\)\.pdf`ning \*\*13-betidagi 67–68-moslashtirish savollari\*\* nutq texnikasining to‘rtta unsurini ajratadi\./i, 'Nutq texnikasida **diapazon**, **artikulyatsiya**, **tembr** va **ritmika** o‘ziga xos vazifaga ega. Ularni quyidagi belgilar orqali farqlang.')
    .replace(/^`Pedagogik mahorat to'plam 2025 \(6\)\.pdf`ning \*\*15-betidagi 76–77-moslashtirish savollari\*\* vosita turlarini farqlaydi\./i, 'Ta’lim vositalari moddiy va ideal shakllarga ajratilishi, shuningdek o‘rgatish yoki o‘rganish jarayonidagi vazifasiga ko‘ra farqlanishi mumkin.')
    .replace(/^`Pedagogik mahorat to'plam 2025 \(6\)\.pdf`ning \*\*2- va 12-betlarida\*\* pedagogik texnologiya darajalari uch vaziyat asosida farqlanadi\./i, 'Pedagogik texnologiyaning darajalarini quyidagi uch vaziyat asosida farqlang.')
    .replace(/^\*\*O‘z-o‘zini rivojlantirish va kasbiy o‘sish\.\*\* 2-betdagi xaritaga ko‘ra bu vazifa \*\*B\/01\.6\*\*, ya’ni \*\*B — kasbiy rivojlanish va hamkorlik\*\* guruhiga kiradi\./i, '**O‘z-o‘zini rivojlantirish va kasbiy o‘sish** — **B/01.6** mehnat vazifasi bo‘lib, kasbiy rivojlanish va hamkorlik yo‘nalishiga kiradi.')
    .replace(/^`PedKasb tushgan testlar PedMahoratGuli \(1\) \(1\) \(1\)\.pdf` ning \*\*59-savolida\*\* jismoniy tarbiya o‘qituvchisi/i, 'Jismoniy tarbiya darsida o‘qituvchi')
    .replace(/^`Pedagogik qobilyatlar umumiy\.pdf` faylida Xoliqovning «Pedagogik mahorat» darsligi asosida Olga Matveeva talqin qilgan oltita jihat keltiriladi:/i, 'Pedagogik qobiliyatlarni tushuntirishga doir yondashuvlardan birida quyidagi oltita jihat ajratiladi:')
    .replace(/^\*\*Eslatma:\*\* manbaning kuzgi savollarida aynan \*\*«Qo‘llash», «Tahlil qilish», «Yaratish»\*\* javoblari berilgan \(indekslar 62, 64, 58\)\. Bu jadval shu uchala savolni farqlashga xizmat qiladi; eski va yangilangan Blum tasniflarining barcha bosqichlari bir xil deb talqin qilinmaydi\./i, '**Eslatma:** ushbu jadval **«Qo‘llash», «Tahlil qilish», «Yaratish»** bosqichlarini farqlaydi. Blum taksonomiyasining eski va yangilangan tasniflarini to‘laligicha bir xil deb talqin qilish to‘g‘ri emas.')
    .replace(/^\*\*Manbadagi tasnif:\*\* Pedmahorat\|Guli Telegram kanalining \[6075-xabari\]\([^)]+\) pedagogik diagnostikaning to‘rtta vazifasini ajratadi\. Bu aynan kanal qo‘llanmasidagi tasnif bo‘lib, barcha ilmiy maktablar uchun yagona ro‘yxat sifatida ko‘rsatilmaydi\./i, 'Pedagogik diagnostikaning quyidagi to‘rtta vazifasini o‘quv modeli sifatida farqlash mumkin. Bu tasnifni barcha ilmiy maktablar uchun yagona ro‘yxat deb qabul qilmang.')
    .replace(/^\*\*Manbalardagi tasniflar bir xil emas\.\*\* \*Pedagogik qobilyatlar umumiy\.pdf\* muayyan olimlar tasniflarini ham keltiradi\. Testda muallif yoki tasnif aytilgan bo‘lsa, javobni aynan shu tasnif doirasida tekshiring; turli tasniflarni mexanik ravishda bitta ro‘yxatga qo‘shmang\./i, '**Pedagogik qobiliyatlarning tasniflari bir xil emas.** Turli olimlar qobiliyatlarni turlicha guruhlaydi. Savolda muallif yoki tasnif ko‘rsatilgan bo‘lsa, javobni aynan shu yondashuv doirasida aniqlang; ularni aralashtirmang.')
    .replace(/^2026 bahorgi to‘plamning bir savolida “talab qilinayotgan kattalikdan boshlab berilgan kattaliklarga tomon borish” \*\*sintetik usul\*\* deb berilgan\. Bu terminologiya boshqa metodik manbalarda boshqacha tasniflanishi mumkin; platforma bu tarixiy javobni mustaqil nazariy qoida sifatida tasdiqlamaydi va editorial tekshiruvsiz savol kaliti sifatida nashr etmaydi\./i, 'Ba’zi norasmiy mashqlarda analitik va sintetik fikrlash yo‘nalishlari turlicha nomlangan bo‘lishi mumkin. Usulni faqat to‘plamdagi javobga qarab emas, masala qaysi yo‘nalishda yechilayotganiga qarab farqlang.')
    .replace(/ \(\*\*(?:30|31)-savol\*\*\)/g, '')
    .replace(/ \*Manbada \d+-savol: [^*]+\*\./g, '.')
    .replace(/ \*\d+-savol: [^*]+\*/g, '')

}

function learnerTableCell(cell: string): string {
  return cell
    .replace(/^Asl manbada tasvirlangan faoliyat$/i, 'Pedagogning faoliyati')
    .replace(/^Informatika darsidan yangi amaliy misol$/i, 'Informatika darsidan amaliy misol')
}

/**
 * Never mutate authored blocks; discard audit-only blocks only in the reading UI.
 * Code, examples, normative A/01.6–B/02.6 codes and teaching tables are preserved.
 */
export function presentPedagogyTheory(blocks: TheoryBlock[]): TheoryBlock[] {
  const result: TheoryBlock[] = []
  let inBibliography = false
  for (const block of blocks) {
    const heading = block.type === 'heading' || block.type === 'subheading'
    if (heading) {
      inBibliography = /^(?:Manba(?:lar)?|Asl manba|Foydalanilgan manbalar)$/i.test(block.content.trim())
      if (inBibliography) continue
    }
    if (inBibliography || block.type === 'source') continue
    if (sourceOnly.test(block.content.trim()) || provenanceOnly.test(block.content.trim()) || answerKeyOnly.test(block.content.trim())) continue

    if (heading) {
      const content = learnerHeading(block.content)
      if (content) result.push({ ...block, content })
      continue
    }
    if (block.type === 'table' && block.headers?.length) {
      const headers = block.headers.map(learnerTableCell)
      const rows = block.rows ?? []
      result.push({
        ...block,
        headers,
        content: [
          '| ' + headers.join(' | ') + ' |',
          '| ' + headers.map(() => '---').join(' | ') + ' |',
          ...rows.map(row => '| ' + row.join(' | ') + ' |'),
        ].join('\n'),
      })
      continue
    }
    const content = learnerSentence(block.content)
    if (content.trim()) result.push(content === block.content ? block : { ...block, content })
  }
  return result
}

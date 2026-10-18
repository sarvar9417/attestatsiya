/** Titles follow the approved AXB PDF chapter contents. */
export const AXB_CHAPTER_TITLES = [
  'Informatika, ma’lumot, axborot va bilim',
  'Axborotning xossalari, turlari va shakllari',
  'Axborot manbalari va axborot jarayonlari',
  'Axborot texnologiyalari, raqamli muhit va axborot madaniyati',
  'Belgi, kod, kodlash va shifrlash',
  'Sanoq sistemalari va ikkilik arifmetika',
  'Bit, bayt, axborot birliklari va Xartli formulasi',
  'Matnli axborotni kodlash',
  'Grafik axborotni kodlash',
  'Audioaxborotni raqamlashtirish',
  'Videoaxborot va multimedia',
  'Fayl formatlari, kodeklar va siqish',
  'Axborot hajmini hisoblash strategiyasi',
  'Axborotni uzatish tezligi va aloqa kanali',
  'Axborotni izlash, saralash va manbani baholash',
  'Validatsiya, verifikatsiya va xatolarni aniqlash',
  'Mualliflik huquqi, litsenziya va raqamli etika',
  'Axborot xavfsizligi va himoya qatlamlari',
  'Attestatsiyadagi nozik farqlar va diagnostika',
] as const

export interface AXBChapter {
  chapter_no: number
  total_pdf: number
  published_count: number
  review_count: number
}

export function allowedAxborotSizes(count: number): number[] {
  if (!Number.isInteger(count) || count < 1) return []
  const sizes = [10, 15, 30].filter(size => size <= count)
  return sizes.length > 0 ? sizes : [count]
}

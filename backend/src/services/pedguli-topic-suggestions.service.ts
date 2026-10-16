/**
 * Conservative editorial topic SUGGESTIONS for privately imported Telegram
 * material. Only question stem is used, not A-D choices (which can contain
 * unrelated vocabulary). No answer, publication, licensing, or official-exam
 * authenticity is asserted. Collisions are held for human review.
 */
import { pedguliHighPriorityTopicProposals } from './pedguli-high-priority-topic-proposals.js'

export type TopicSuggestionState = 'strong_keyword' | 'ambiguous' | 'unclassified' | 'editorial_proposal'

export interface TopicSuggestion {
  proposed_constructs: string[]
  suggestion_state: TopicSuggestionState
  evidence_terms: string[]
}

const optionA = /(?<![\p{L}\p{N}_])A\s*[).:]\s*/iu
function simplify(text: string) {
  return text.normalize('NFKC').toLocaleLowerCase('uz-UZ')
    .replace(/[’‘ʻʼ\u0060´ʹ′]/g, "'")
    .replace(/[^\p{L}\p{N}\s']/gu, ' ')
    .replace(/\s+/g,' ').trim()
}

const rules: ReadonlyArray<[string, readonly RegExp[]]> = [
  ['PM.GEN.01', [
    /pedagogika qanday fan/, /pedagogika fanining asosiy kategori/,
    /pedagogik jarayonda ishtirok/, /pedagogika fani nimani o/,
    /ta.limning an.anaviy.*birligi/,
  ]],
  ['PM.GEN.02', [
    /didaktik tamoyil/, /ta.lim tamoyil/,
    /ta.limning (ilmiylik|ko.rsatmalilik|tizimlilik|izchillik|madaniyat bilan|tabiat bilan)/,
    /ko.rsatmalilik tamoyil/, /ta.lim qonuniyatlari/,
    /ta.lim qonuniyati/, /ta.limning umumiy qonuniyat/,
  ]],
  ['PM.GEN.03', [/tarbiya metodlari/, /tarbiya (tamoyili|qonuniyatlari|usuli)/,
    /tarbiyaviy ishlarning shakllari/, /axloqiy tarbiya/]],
  ['PM.GEN.04', [
    /dars (turi|turlari|tipi|tiplari|bosqichlari|strukturasi|tuzilishi)/,
    /darsga tayyorgarligi/, /o.qituvchining darsga tayyorgarligi/,
    /sinfni boshqarish/, /ta.limni tashkil etish shakli/,
    /darsni rejalashtirish/, /darsning didaktik vazif/,
  ]],
  ['PM.GEN.05', [/sinf rahbari/, /sinf rahbarining/,
    /ota onalar bilan hamkorlik/, /ota ona bilan suhbat/]],
  ['PM.GEN.06', [
    /nutq(ning|iy|da|i) (mantiqiyligi|tozaligi|ravonligi|to.g.riligi|aniqligi)/,
    /nutqiy xato/, /pedagogik takt/, /pedagogik texnika/,
    /pantomimika/, /pantomimik/, /notiqlik san/, /diksiya/,
    /og.zaki ta.sir qilish/, /xushmuomalalik mezon/, /jargonlardan/,
  ]],
  ['PM.GEN.07', [/pedagogik qobiliyat/, /pedagogik xayol/,
    /perseptiv qobiliyat/, /kommunikativ qobiliyat/,
    /didaktik qobiliyat/, /akademik qobiliyat/]],
  ['PM.GEN.08', [
    /pedagogik texnologiya/, /pedagogik texnologiyalar/,
    /umumpedagogik.*(makro|mezo|mikro)/,
    /makrotexnologiya/, /mezotexnologiya/, /metatexnologiya/,
    /mikrotexnologiya/, /loyiha asosida ta.lim/,
    /blum taksonomiyasi/, /bloom/, /venn diagramma/, /aqliy hujum/,
    /ajurli arra/, /evristik ta.lim/, /keys stadi/,
    /akvarium usuli/, /asalari galasi/,
  ]],
  ['KS.01', [/ta.lim jarayonini rejalashtirish/, /o.quv jarayonini rejalashtirish/]],
  ['KS.02', [/dars samarasizligining asosiy omili/, /ta.lim samaradorligini ta.minlash/]],
  ['KS.03', [/baholash mezonlari/, /o.zlashtirishni baholash/,
    /formativ baholash/, /summativ baholash/, /diagnostik baholash/,
    /nazorat qilish va hisobga olish/]],
  ['KS.04', [/tarbiyaviy faoliyatni tashkil etish/]],
  ['KS.05', [/xavfsiz rivojlantiruvchi/, /inklyuziv ta.lim muhiti/,
    /kamsitishning oldini olish/]],
  ['KS.06', [/kasbiy o.sish/, /o.z o.zini rivojlantirish/, /kasbiy rivojlanish/]],
  ['KS.07', [/pedagogik hamkorlik/, /oila bilan hamkorlik/]],
  ['PM.MET.01', [/informatikani o.qitish metodik tizim/, /informatika darsining maqsad/]],
  ['PM.MET.02', [/informatika darsida .*metod/, /dasturlashni o.qitish metod/]],
  ['PM.MET.03', [/informatika darsida .*xato/, /dasturlash.*pedagogik muammo/]],
]

export function suggestPedguliTopic(sourceText: string, messageId?: number): TopicSuggestion {
  // Initial source-specific content audit is a PROPOSAL, not an independent
  // pedagogical/source/answer signoff. These hints may correct old heuristic tags.
  const fromAudit=messageId===undefined ? undefined : pedguliHighPriorityTopicProposals[messageId]
  if(fromAudit) {
    return {proposed_constructs:[fromAudit],suggestion_state:'editorial_proposal',
      evidence_terms:['2026-10-12 source text preliminary review; must be verified by human reviewer']}
  }
  const question = sourceText.split(optionA, 1)[0] ?? sourceText
  const stem = simplify(question)
  const hits: Array<{code:string;term:string}> = []
  for (const [code, patterns] of rules) {
    for(const pattern of patterns) {
      const match=stem.match(pattern)
      if(match) {
        hits.push({code,term:match[0]})
        break
      }
    }
  }
  if(hits.length!==1) {
    return {proposed_constructs:[],suggestion_state:hits.length>1?'ambiguous':'unclassified',
      evidence_terms:hits.map(h=>h.code+': '+h.term)}
  }
  return {proposed_constructs:[hits[0].code],suggestion_state:'strong_keyword',
    evidence_terms:[hits[0].term]}
}

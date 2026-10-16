/**
 * Heuristic triage, NOT a verified answer extractor or automatic publication.
 * Derived from patterns in a user-provided Telegram HTML export; source text
 * remains confined to a private review table and authenticated staff UI.
 */
export type CandidateQualityFlag =
  | 'options_not_confirmed'
  | 'option_missing_or_short'
  | 'option_very_long'
  | 'duplicate_option_text'
  | 'near_identical_options'
  | 'extra_option_markers'
  | 'media_context_may_be_missing'
  | 'topic_unclassified'
  | 'long_complex_stem'
  | 'answer_marker_not_verified'

export interface CandidateQuality {
  flags: CandidateQualityFlag[]
  priority: 1 | 2 | 3
  four_options_detected: boolean
}

const optionMarker = /(?<![\p{L}\p{N}_])([ABCD])\s*[).:]\s*/giu

function normalizeOption(text: string) {
  return text.toLocaleLowerCase('uz-UZ')
    .replace(/['\u2018\u2019\u02bb\u0060]/g, "'")
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ').trim()
}

function editDistance(a:string,b:string):number {
  let prior=Array.from({length:b.length+1},(_,i)=>i)
  for(let i=0;i<a.length;i++){
    const current=[i+1]
    for(let j=0;j<b.length;j++){
      current.push(Math.min(current[j]+1,prior[j+1]+1,
        prior[j]+(a[i]===b[j]?0:1)))
    }
    prior=current
  }
  return prior[b.length]
}

/** Conservative warning on near-equal wordings; editor must decide equivalence. */
function nearEqual(a:string,b:string) {
  if(Math.min(a.length,b.length)<9 || a===b)return false
  const longest=Math.max(a.length,b.length)
  if(Math.abs(a.length-b.length)/longest>.08)return false
  return editDistance(a,b)/longest <= .08
}

export function analyzeCandidateQuality(
  rawText: string,
  hasMedia: boolean,
  constructs: readonly string[],
): CandidateQuality {
  const matches=[...rawText.matchAll(optionMarker)]
  const flags=new Set<CandidateQualityFlag>()
  let lastStart=-1
  for(let i=0;i<=matches.length-4;i++){
    if(matches.slice(i,i+4).map(m=>m[1].toUpperCase()).join('')==='ABCD') lastStart=i
  }
  const hasFour=lastStart>=0
  if(!hasFour){
    flags.add('options_not_confirmed')
  }else{
    if(lastStart+4<matches.length)flags.add('extra_option_markers')
    const seq=matches.slice(lastStart,lastStart+4)
    const options=seq.map((m,i)=>
      rawText.slice(m.index!+m[0].length,i<3?seq[i+1].index!:rawText.length).trim()
    )
    if(options.some(x=>x.length<2)) flags.add('option_missing_or_short')
    if(options.some(x=>x.length>450)) flags.add('option_very_long')
    const normalized=options.map(normalizeOption)
    if(new Set(normalized).size<4) flags.add('duplicate_option_text')
    for(let i=0;i<4;i++){
      for(let j=i+1;j<4;j++){
        if(nearEqual(normalized[i],normalized[j])) flags.add('near_identical_options')
      }
    }
  }
  if(hasMedia)flags.add('media_context_may_be_missing')
  if(constructs.length===0)flags.add('topic_unclassified')
  if(rawText.length>1500)flags.add('long_complex_stem')
  if(rawText.includes('✅'))flags.add('answer_marker_not_verified')
  const high=flags.has('duplicate_option_text') || flags.has('near_identical_options')
  const medium=flags.has('options_not_confirmed') || flags.has('media_context_may_be_missing')
  return { flags:[...flags].sort(), priority:high?3:medium?2:1,
    four_options_detected:hasFour }
}

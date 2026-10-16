#!/usr/bin/env node
/**
 * Offline, review-only curator for an authorized Telegram Desktop HTML export.
 * Use with the Pedmahorat|Guli channel's messages.html, messages2.html ... pages.
 *
 * node scripts/curate-pedguli-html.mjs /private/telegram-export /private/pedguli-review.json
 *
 * Outputs PRIVATE original source text, provenance and deduplication for human
 * editorial review. It does not import to a database, guess answers or publish.
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, join, dirname, relative } from 'node:path'
import { createHash } from 'node:crypto'
import { pathToFileURL } from 'node:url'
import { classifyTopic, CANONICAL_HANDLE } from './curate-pedguli-export.mjs'

const MEDIA_RE = /media_(?:photo|audio_file|file|voice_message|video)/g
const OPTION_SYMBOLS = ['A', 'B', 'C', 'D']

function decodeEntities(s) {
  const named = { amp:'&', apos:"'", quot:'"', lt:'<', gt:'>', nbsp:' ', hellip:'…',
    ldquo:'“', rdquo:'”', lsquo:'‘', rsquo:'’', mdash:'—', ndash:'–' }
  return s.replace(/&(#(?:x[0-9a-f]+|[0-9]+)|[a-z]+);/gi, (full, entity) => {
    if (entity[0]==='#') {
      const hex=entity[1]?.toLowerCase()==='x'
      const n=Number.parseInt(entity.slice(hex?2:1),hex?16:10)
      return Number.isSafeInteger(n) && n>=0 && n<=0x10ffff
        ? String.fromCodePoint(n) : full
    }
    return named[entity.toLowerCase()] ?? full
  })
}

function textFromFragment(fragment) {
  return decodeEntities(fragment
    .replace(/<br\s*\/?\s*>/gi,'\n')
    .replace(/<\/(?:p|blockquote|div|li)\s*>/gi,'\n')
    .replace(/<[^>]*>/g,'')
  ).replace(/[ \t\u00a0]+/g,' ').replace(/\n\s*\n+/g,'\n').trim()
}

function hasFourChoices(text) {
  return OPTION_SYMBOLS.every(letter => {
    const re=new RegExp('(?:^|\\n)\\s*'+letter+'[).:]\\s*\\S','i')
    return re.test(text)
  })
}

/** Parse only visible user-post divs, not generic poll votes, replies or service rows. */
export function parseTelegramHtml(html, sourceName) {
  if (!/Pedmahorat\s*\|\s*Guli/i.test(html.slice(0,2500))) {
    throw new Error('Channel heading Pedmahorat|Guli was not found in '+sourceName)
  }
  const messageBoundary=/<div\s+class="message\s+([^"]+)"\s+id="message(-?\d+)">/g
  const boundaries=[...html.matchAll(messageBoundary)]
  const out=[]
  for(let i=0;i<boundaries.length;i++){
    const at=boundaries[i]
    if(!at[1].split(/\s+/).includes('default'))continue
    const end=i+1<boundaries.length?boundaries[i+1].index:html.length
    const chunk=html.slice(at.index,end)
    const parts=[...chunk.matchAll(/<div\s+class="text"\s*>([\s\S]*?)<\/div\s*>/g)]
      .map(x=>textFromFragment(x[1])).filter(Boolean)
    const text=parts.join('\n').trim()
    const date=chunk.match(/<div\s+class="[^"]*\bdate\b[^"]*\bdetails\b[^"]*"\s+title="([^"]+)"/)
    const media=[...new Set(chunk.match(MEDIA_RE)??[])]
    const poll=chunk.includes('class="media_poll"')
    out.push({
      id:Number(at[2]),source_file:sourceName,
      date_local:date?date[1]:null,text,
      media_types:media,has_poll:poll,
      has_four_options:hasFourChoices(text)
    })
  }
  return out
}

/** Returns user-private, never-public-review output. */
export function buildHtmlAudit(pages) {
  const data=[]
  for(const page of pages) data.push(...parseTelegramHtml(page.html,page.name))
  const ids=new Set()
  const byFingerprint=new Map()
  const counts={message_count:0,text_count:0,media_count:0,poll_count:0,
    four_choice_candidates:0,unique_four_choice_candidates:0,
    duplicate_four_choice_posts:0,key_marker_unverified:0}
  const candidates=[]
  for(const post of data){
    if(!Number.isSafeInteger(post.id)||post.id<=0||ids.has(post.id))
      throw new Error('Invalid or duplicated Telegram message id '+post.id)
    ids.add(post.id);counts.message_count++
    if(post.text)counts.text_count++
    if(post.media_types.length)counts.media_count++
    if(post.has_poll)counts.poll_count++
    if(!post.has_four_options)continue
    counts.four_choice_candidates++
    const hash=createHash('sha256').update(post.text.toLocaleLowerCase('uz-UZ').replace(/\s+/g,' ').trim()).digest('hex')
    const duplicate=byFingerprint.get(hash)??null
    const source_url='https://t.me/'+CANONICAL_HANDLE+'/'+post.id
    if(duplicate)counts.duplicate_four_choice_posts++
    else {counts.unique_four_choice_candidates++;byFingerprint.set(hash,source_url)}
    const key_like=/✅|javob\s*[:\-]|to.g.ri\s+javo/i.test(post.text)
    if(key_like)counts.key_marker_unverified++
    candidates.push({
      source_url,source_file:post.source_file,date_local:post.date_local,
      message_id:post.id,source_hash:hash,potential_duplicate_of:duplicate,
      suggested_constructs:classifyTopic(post.text),
      rights_status:'not_cleared',editorial_status:'needs_manual_review',
      answer_key_status:key_like?'marker_present_unverified':'not_verified',
      historic_exam_claim_status:'unverified',
      private_source_text:post.text
    })
  }
  return {
    privacy:'PRIVATE EDITORIAL REVIEW — original channel texts, do not commit, republish or deploy',
    source:'@'+CANONICAL_HANDLE, counts,candidates
  }
}

function ensureExternal(input,output,root) {
  for(const [name,path] of [['input',input],['output',output]]){
    const rel=relative(resolve(root),resolve(path))
    if(rel===''||(!rel.startsWith('..')&&!rel.startsWith('/')))
      throw new Error(name+' must be outside tracked repository')
  }
}

async function main() {
  const [inputFolder,outputFile]=process.argv.slice(2)
  if(!inputFolder||!outputFile){
    console.error('Usage: node scripts/curate-pedguli-html.mjs /private/export/ /private/review.json')
    process.exitCode=2
    return
  }
  ensureExternal(inputFolder,outputFile,process.cwd())
  const files=(await readdir(inputFolder))
    .filter(x=>/^messages\d*\.html$/i.test(x))
    .sort((a,b)=>{
      const n=x=>Number((x.match(/^messages(\d*)\.html$/i)??[])[1]||1)
      return n(a)-n(b)
    })
  if(!files.length)throw new Error('No Telegram messages*.html pages found')
  const pages=await Promise.all(files.map(async name=>({name,
    html:await readFile(join(inputFolder,name),'utf8')})))
  const result=buildHtmlAudit(pages)
  await mkdir(dirname(resolve(outputFile)),{recursive:true,mode:0o700})
  await writeFile(resolve(outputFile),JSON.stringify(result,null,2),{
    flag:'wx',encoding:'utf8',mode:0o600
  })
  console.log(JSON.stringify({source:result.source,pages:files.length,counts:result.counts}))
  console.log('PRIVATE audit written outside repository; no questions published')
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  main().catch(err=>{console.error(err.message??String(err));process.exitCode=1})
}

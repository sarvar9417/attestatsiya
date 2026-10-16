#!/usr/bin/env node
/**
 * Private, review-only import of a user-provided Telegram Desktop HTML audit.
 * Raw source text MUST stay outside Git and must NOT be printed to logs.
 *
 * DRY RUN (safe): node scripts/import-pedguli-candidates.mjs /private/review.json
 * STAGING (requires an isolated non-production backend / database):
 * PEDGULI_TARGET_ENV=staging ATTESTATSIYA_API_BASE=https://staging.example \
 * PEDGULI_ADMIN_TOKEN=... node scripts/import-pedguli-candidates.mjs \
 * /private/review.json --execute
 */
import { readFile } from 'node:fs/promises'
import { resolve, relative } from 'node:path'
import { pathToFileURL } from 'node:url'

export function normalizeAuditCandidates(data) {
  if(!Array.isArray(data?.candidates)) throw new Error('Audit must contain candidates[]')
  if(data.export_channel!=='Pedmahorat|Guli') {
    throw new Error('Unexpected Telegram export channel')
  }
  const unique = data.candidates.filter(x=>!x.potential_duplicate_of)
  if(unique.length!==1394) throw new Error('Expected exactly 1394 unique source candidates, found '+unique.length)
  const ids=new Set()
  return unique.map(x=>{
    const id=Number(x.message_id)
    if(!Number.isSafeInteger(id)||id<=0||ids.has(id)
       ||x.telegram_url!=='https://t.me/PedMahoratGuli/'+id
       ||typeof x.full_text_private!=='string'
       ||x.full_text_private.trim().length<20
       ||!/^messages(?:[2-9]|\d{2,})?\.html$/.test(x.source_html)
       ||!Array.isArray(x.construct_candidates)) {
      throw new Error('Invalid source record for Telegram message '+x.message_id)
    }
    ids.add(id)
    return {
      message_id:id,
      source_url:x.telegram_url,
      source_html:x.source_html,
      date_local:x.date_local,
      raw_text_private:x.full_text_private,
      suggested_constructs:x.construct_candidates,
      media_present:Boolean(x.media_present_in_message),
      key_marker_unverified:x.answer_key_state==='marker_detected_not_verified',
    }
  })
}

export function assertOutsideRepository(input,repoRoot) {
  const rel=relative(resolve(repoRoot),resolve(input))
  if(rel===''||(!rel.startsWith('..')&&!rel.startsWith('/'))) {
    throw new Error('Private Telegram audit file must be outside the Git repository')
  }
}

async function main() {
  const [file,mode]=process.argv.slice(2)
  if(!file || (mode!==undefined&&mode!=='--execute')) {
    console.error('Usage: node scripts/import-pedguli-candidates.mjs /private/audit.json [--execute]')
    process.exitCode=2
    return
  }
  assertOutsideRepository(file,process.cwd())
  const items=normalizeAuditCandidates(JSON.parse(await readFile(resolve(file),'utf8')))
  const batches=[]
  for(let i=0;i<items.length;i+=50)batches.push(items.slice(i,i+50))
  if(mode!=='--execute') {
    console.log(JSON.stringify({mode:'dry-run',unique:items.length,batches:batches.length,
      answer_keys_imported:0,published:0,destination:'not contacted'}))
    return
  }
  if(process.env.PEDGULI_TARGET_ENV!=='staging') {
    throw new Error('Import refused: PEDGULI_TARGET_ENV must be staging')
  }
  const base=process.env.ATTESTATSIYA_API_BASE
  const token=process.env.PEDGULI_ADMIN_TOKEN
  if(!base||!token)throw new Error('Set staging API URL and authenticated admin token securely')
  const url=new URL(base)
  if(url.protocol!=='https:'||/attestatsiya-five\.vercel\.app$/i.test(url.hostname)) {
    throw new Error('Import refused: HTTPS staging endpoint required; production is prohibited')
  }
  let inserted=0,skipped=0
  for(const [index,batch] of batches.entries()) {
    const response=await fetch(new URL('/api/admin/pedguli-candidates/import',url),{
      method:'POST',
      headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
      body:JSON.stringify({items:batch}),
    })
    if(!response.ok) {
      throw new Error('Staging import stopped at batch '+(index+1)+'; HTTP '+response.status+
        '. No source text or token logged.')
    }
    const result=await response.json()
    if(result.submitted!==batch.length||result.status!=='needs_review'||result.published!==0) {
      throw new Error('Unexpected import acknowledgement: stopping without assuming success')
    }
    inserted+=result.inserted
    skipped+=result.already_present_or_duplicate
    console.log(JSON.stringify({batch:index+1,total_batches:batches.length,
      inserted_so_far:inserted,skipped_so_far:skipped}))
  }
  console.log(JSON.stringify({status:'complete',unique:items.length,inserted,skipped,published:0}))
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(e=>{ console.error(e.message);process.exitCode=1 })
}

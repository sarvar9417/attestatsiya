#!/usr/bin/env node
/**
 * Imports private v4 source review metadata to isolated STAGING only.
 * No Telegram question text, automatic grading, licensing or publication.
 * Dry run (default): node scripts/import-pedguli-stage4.mjs /private/stage4.json
 * Execute only after separate staging DB is connected and migrations applied.
 */
import {readFile} from 'node:fs/promises'
import {resolve,relative} from 'node:path'
import {pathToFileURL} from 'node:url'

export function validateStage4(input) {
 if(input?.schema!=='pedguli-private-stage4-v1'||
    input?.source!=='@PedMahoratGuli'||input?.human_validated!==false||
    input?.redistribution_rights_confirmed!==false||
    input?.source_candidate_count!==1394||
    !Array.isArray(input.topics)||input.topics.length!==673||
    !Array.isArray(input.answer_references)||input.answer_references.length!==7)
   throw new Error('Expected private 673-topic / 7-source-supported review bundle')
 const ids=new Set()
 const topics=input.topics.map(x=>{
   if(!Number.isSafeInteger(x.telegram_message_id)||x.telegram_message_id<=0||
      ids.has(x.telegram_message_id)||
      !['model_high_margin','model_low_margin','media_blocked'].includes(x.suggestion_mode)||
      !Number.isFinite(x.model_margin)||x.model_margin<0||
      !/^(KS|PM\.GEN|PM\.MET)\.\d{2}$/.test(x.second_choice)||
      (x.suggestion_mode==='media_blocked' ? x.suggested_construct!=='' :
        !/^(KS|PM\.GEN|PM\.MET)\.\d{2}$/.test(x.suggested_construct))){
     throw new Error('Invalid or duplicated topic source id '+x.telegram_message_id)
   }
   ids.add(x.telegram_message_id)
   return x
 })
 const answerIDs=new Set()
 const answer_references=input.answer_references.map(x=>{
   if(!ids.has(x.telegram_message_id)||answerIDs.has(x.telegram_message_id)||
     !['A','B','C','D'].includes(x.proposed_correct_letter)||
     !/^https:\/\//.test(x.source_url)||
     !/^(KS|PM\.GEN|PM\.MET)\.\d{2}$/.test(x.proposed_construct)){
     throw new Error('Invalid or duplicated reference source '+x.telegram_message_id)
   }
   answerIDs.add(x.telegram_message_id);return x
 })
 return {topics,answer_references}
}

async function main(){
 const [path,mode]=process.argv.slice(2)
 if(!path||mode&&mode!=='--execute')throw new Error('Usage: import-pedguli-stage4.mjs /private/stage4.json [--execute]')
 const rel=relative(process.cwd(),resolve(path))
 if(rel===''||(!rel.startsWith('..')&&!rel.startsWith('/')))
  throw new Error('Private research JSON must remain outside repository')
 const pack=validateStage4(JSON.parse(await readFile(resolve(path),'utf8')))
 if(mode!=='--execute'){
  console.log(JSON.stringify({status:'dry-run',topics:pack.topics.length,
    source_comparisons:pack.answer_references.length,
    batches:Math.ceil(pack.topics.length/50),released_to_students:0}))
  return
 }
 if(process.env.PEDGULI_TARGET_ENV!=='staging'){
  throw new Error('Refused: PEDGULI_TARGET_ENV=staging required')
 }
 const base=process.env.ATTESTATSIYA_API_BASE,token=process.env.PEDGULI_ADMIN_TOKEN
 if(!base||!token)throw new Error('Secure staging admin token and API base are required')
 const uri=new URL(base)
 if(uri.protocol!=='https:'||uri.hostname==='attestatsiya-five.vercel.app')
   throw new Error('Production URL rejected. Use isolated HTTPS staging backend')
 let doneTopics=0,doneReferences=0
 for(let i=0;i<pack.topics.length;i+=50){
  const body={topics:pack.topics.slice(i,i+50),
   answer_references:i===0?pack.answer_references:[]}
  const response=await fetch(new URL('/api/admin/pedguli-candidates/stage4',uri),{
   method:'POST',headers:{'Content-Type':'application/json',
     'Authorization':'Bearer '+token},body:JSON.stringify(body)})
  if(!response.ok)throw new Error('Stage4 private upload stopped at batch '+(1+Math.floor(i/50))+
    ', HTTP '+response.status)
  const answer=await response.json()
  if(answer.published!==0||answer.expert_approved!==0||
   answer.topic_suggestions_saved!==body.topics.length||
   answer.private_source_comparisons_saved!==body.answer_references.length){
    throw new Error('Unexpected staging response: do not assume publication safety')
  }
  doneTopics+=answer.topic_suggestions_saved
  doneReferences+=answer.private_source_comparisons_saved
  console.log(JSON.stringify({completed_batches:1+Math.floor(i/50),
    topics_done:doneTopics,reference_cases_done:doneReferences,published:0}))
 }
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 main().catch(e=>{console.error(e.message);process.exitCode=1})
}

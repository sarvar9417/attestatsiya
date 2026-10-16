import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeAuditCandidates, assertOutsideRepository } from '../import-pedguli-candidates.mjs'

function syntheticAudit() {
  return {
    export_channel:'Pedmahorat|Guli',
    candidates:[
      ...Array.from({length:1394},(_,i)=>{
        const id=1000+i
        return {
          message_id:String(id),telegram_url:'https://t.me/PedMahoratGuli/'+id,
          source_html: 'messages'+(i%20===0?'':(i%20+1))+'.html',
          date_local:'01.01.2026 12:00:00 UTC+05:00',
          full_text_private:'Sintez savol '+i+'? A. Bir B. Ikki C. Uch D. To‘rt',
          construct_candidates:i%4===0?['PM.GEN.04']:[],
          media_present_in_message:i%7===0,
          answer_key_state:'no_verified_key',potential_duplicate_of:null,
        }
      }),
      {message_id:'3000',potential_duplicate_of:'https://t.me/PedMahoratGuli/1000'},
    ],
  }
}

test('normalizes 1394 unique, not 2408 duplicate Telegram posts',()=>{
  const items=normalizeAuditCandidates(syntheticAudit())
  assert.equal(items.length,1394)
  assert.equal(new Set(items.map(x=>x.message_id)).size,1394)
  assert.equal(items[0].source_url,'https://t.me/PedMahoratGuli/1000')
  assert.equal(items[0].raw_text_private.startsWith('Sintez savol'),true)
  assert.equal('correct_index' in items[0],false)
  assert.equal('status' in items[0],false)
  assert.equal('published' in items[0],false)
})

test('rejects unrelated source channel and incomplete unique export',()=>{
  assert.throws(()=>normalizeAuditCandidates({...syntheticAudit(),export_channel:'Wrong'}),/channel/)
  assert.throws(()=>normalizeAuditCandidates({export_channel:'Pedmahorat|Guli',candidates:[]}),/1394/)
})

test('rejects source URL to message-id mismatch and repeated canonical IDs',()=>{
  const a=syntheticAudit()
  a.candidates[0].telegram_url='https://t.me/PedMahoratGuli/500'
  assert.throws(()=>normalizeAuditCandidates(a),/Invalid source/)
  const b=syntheticAudit()
  b.candidates[1].message_id=b.candidates[0].message_id
  assert.throws(()=>normalizeAuditCandidates(b),/Invalid source/)
})

test('rejects committing original copyright text into repository paths',()=>{
  assert.throws(()=>assertOutsideRepository('/repo/export.json','/repo'),/outside/)
  assert.doesNotThrow(()=>assertOutsideRepository('/private/export.json','/repo'))
})

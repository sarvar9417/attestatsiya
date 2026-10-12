import test from 'node:test'
import assert from 'node:assert/strict'
import {validateStage4} from '../import-pedguli-stage4.mjs'

function fixture(){
 return {
  schema:'pedguli-private-stage4-v1',source:'@PedMahoratGuli',
  source_candidate_count:1394,human_validated:false,
  redistribution_rights_confirmed:false,
  topics:Array.from({length:673},(_,i)=>({
   telegram_message_id:1000+i,suggested_construct:i===10?'':'PM.GEN.07',
   suggestion_mode:i===10?'media_blocked':'model_low_margin',
   model_margin:0.21,second_choice:'PM.GEN.04',
   source_scope_warning:'This is an unverified topic proposal',
  })),
  answer_references:Array.from({length:7},(_,i)=>({
    telegram_message_id:1000+i,proposed_correct_letter:'C',
    expected_concept:'Pedagogik mahorat',
    source_title:'Umumiy pedagogika',
    source_url:'https://lib.bimm.uz/items/download/10389',
    source_support_note:'Independent textbook concept comparison, without publishing the source post.',
    proposed_construct:'PM.GEN.01',
  })),
 }
}
test('supports exactly 673 candidate topic reports and 7 private references',()=>{
 const x=validateStage4(fixture())
 assert.equal(x.topics.length,673)
 assert.equal(x.answer_references.length,7)
 assert.equal('correct_option_id' in x.topics[0],false)
 assert.equal('published' in x.answer_references[0],false)
})
test('rejects pretending that author rights or expert answers were verified',()=>{
 assert.throws(()=>validateStage4({...fixture(),human_validated:true}),/Expected/)
 assert.throws(()=>validateStage4({...fixture(),redistribution_rights_confirmed:true}),/Expected/)
})
test('rejects duplicated IDs and media-blocked questions with guessed topic',()=>{
 const f=fixture()
 f.topics[1].telegram_message_id=f.topics[0].telegram_message_id
 assert.throws(()=>validateStage4(f),/duplicated/)
 const g=fixture()
 g.topics[10].suggested_construct='KS.03'
 assert.throws(()=>validateStage4(g),/Invalid/)
})
test('rejects source comparison that is not present among the 673 source records',()=>{
 const f=fixture()
 f.answer_references[0].telegram_message_id=999999
 assert.throws(()=>validateStage4(f),/Invalid/)
})

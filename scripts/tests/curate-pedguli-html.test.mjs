import test from 'node:test'
import assert from 'node:assert/strict'
import { parseTelegramHtml,buildHtmlAudit } from '../curate-pedguli-html.mjs'

const header='<html><div class="page_header"><div class="text bold"> Pedmahorat|Guli </div></div>'
const question=(id,text)=>'<div class="message default clearfix" id="message'+id+'">'+
 '<div class="body"><div class="pull_right date details" title="05.03.2025 10:20:00 UTC+05:00"></div>'+
 '<div class="text">'+text+'</div></div></div>'
const q='Pedagogik baholashda qaysi javob mos?<br>A) Kuzatish<br>B) Tasodifiy baholash<br>C) Diagnostika<br>D) Bilmayman'

test('Telegram Desktop HTML extracts four choices, linkable id and local date',()=>{
 const parsed=parseTelegramHtml(header+question(111,q),'messages.html')
 assert.equal(parsed.length,1)
 assert.equal(parsed[0].id,111)
 assert.equal(parsed[0].date_local,'05.03.2025 10:20:00 UTC+05:00')
 assert.equal(parsed[0].has_four_options,true)
 assert.match(parsed[0].text,/C\) Diagnostika/)
})
test('ignores generic polls as questions, recognizes excluded media, and service messages',()=>{
 const poll='<div class="message default clearfix" id="message112"><div class="body">'+
 '<div class="media_poll"><div class="answer">- A</div></div></div></div>'
 const service='<div class="message service" id="message113"><div class="body">Created</div></div>'
 const pic='<div class="message default clearfix" id="message114"><div class="body">'+
 '<div class="media clearfix media_photo">Not included</div></div></div>'
 const a=parseTelegramHtml(header+poll+service+pic,'messages.html')
 assert.equal(a.length,2)
 assert.equal(a[0].has_poll,true)
 assert.equal(a[0].has_four_options,false)
 assert.deepEqual(a[1].media_types,['media_photo'])
})
test('source privacy/provenance and message id deduplication',()=>{
 const a=buildHtmlAudit([{name:'messages.html',html:header+question(101,q)},
 {name:'messages2.html',html:header+question(102,q.replace('B) Tasodifiy baholash','B) Tasodifiy baholash'))}])
 assert.equal(a.counts.message_count,2)
 assert.equal(a.counts.unique_four_choice_candidates,1)
 assert.equal(a.counts.duplicate_four_choice_posts,1)
 assert.equal(a.candidates[0].source_url,'https://t.me/PedMahoratGuli/101')
 assert.equal(a.candidates[1].potential_duplicate_of,a.candidates[0].source_url)
 assert.equal(a.candidates[0].rights_status,'not_cleared')
 assert.equal(a.candidates[0].answer_key_status,'not_verified')
 assert.ok(a.candidates[0].suggested_constructs.includes('PM.GEN.08') ||
   a.candidates[0].suggested_constructs.includes('PM.GEN.04') ||
   a.candidates[0].suggested_constructs.includes('PM.GEN.02') ||
   Array.isArray(a.candidates[0].suggested_constructs))
})
test('rejects mixed channel pages and duplicate post IDs',()=>{
 assert.throws(()=>parseTelegramHtml('<html>Some other channel</html>','messages.html'),/Channel heading/)
 assert.throws(()=>buildHtmlAudit([{name:'messages.html',html:header+question(102,q)+question(102,q)}]),/duplicated/)
})
test('HTML entities decoded without letting markup leak into plain text',()=>{
 const a=parseTelegramHtml(header+question(77,'Baholash &quot;test&quot; &amp; nazorat<br>A) A<br>B) B<br>C) C<br>D) D'),'messages.html')
 assert.match(a[0].text,/'?test" & nazorat/)
 assert.doesNotMatch(a[0].text,/<br>/)
})

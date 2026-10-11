import test from 'node:test'
import assert from 'node:assert/strict'
import { curateTelegramExport, flattenTelegramText, classifyTopic, assertPrivatePath } from '../curate-pedguli-export.mjs'

test('mixed Telegram Desktop text segments are normalized without losing prose', () => {
  assert.equal(flattenTelegramText(['Akvarium ', { type: 'plain', text: 'metodi' }]), 'Akvarium metodi')
  assert.equal(flattenTelegramText(null), '')
})
test('correctly identifies source-defined teaching method topics', () => {
  assert.ok(classifyTopic('Akvarium metodi orqali dars').includes('PM.GEN.08'))
  assert.ok(classifyTopic('Xavfsiz rivojlantiruvchi ta’lim muhitida kasb standarti').includes('KS'))
  assert.ok(classifyTopic('Pedagogik xayol va oldindan ko‘ra olish').includes('PM.GEN.07'))
})
test('emits private, unverified review records; never auto-publishes or invents answer keys', () => {
  const report=curateTelegramExport({
    name:'Pedmahorat|Guli',
    messages:[
      {type:'message',id:123,date:'2026-09-12T10:00:00',text:'Akvarium metodini qachon qo‘llash maqsadga muvofiq?'},
      {type:'message',id:124,date:'2026-09-12T11:00:00',text:'AKVARIUM   metodini qachon qo‘llash maqsadga muvofiq?'},
      {type:'message',id:125,date:'2026-09-12T12:00:00',text:[{type:'plain',text:'Kasb standarti: '},'xavfsiz muhit mavzusi']},
      {type:'message',id:126,date:'2026-09-12T13:00:00',text:'Reklama'},
      {type:'service',id:127,text:'Savol va mavzu'}
    ]
  })
  assert.equal(report.counts.candidates,2)
  assert.equal(report.counts.duplicates,1)
  assert.equal(report.candidates[0].source_url,'https://t.me/PedMahoratGuli/123')
  assert.equal(report.candidates[0].review_status,'needs_manual_review')
  assert.equal(report.candidates[0].rights_status,'not_cleared')
  assert.equal(report.candidates[0].answer_key_status,'not_verified')
  assert.equal(report.candidates[0].claimed_exam_year,null)
  assert.ok(report.candidates[0].source_text_hash.match(/^[a-f0-9]{64}$/))
  assert.equal('correct_index' in report.candidates[0],false)
  assert.equal('status' in report.candidates[0],false)
})
test('wrong channel data cannot silently be attributed to PedGuli', () => {
  assert.throws(()=>curateTelegramExport({name:'Other Channel',messages:[]}),/channel name/)
  assert.throws(()=>curateTelegramExport({name:'Pedmahorat Guli'}),/messages array/)
})
test('forbids raw copyrighted export or review text in version-controlled project', () => {
  assert.throws(()=>assertPrivatePath('/repo/export.json','/secure/review.json','/repo'),/OUTSIDE/)
  assert.throws(()=>assertPrivatePath('/secure/export.json','/repo/review.json','/repo'),/OUTSIDE/)
  assert.doesNotThrow(()=>assertPrivatePath('/secure/export.json','/secure/review.json','/repo'))
})

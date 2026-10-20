#!/usr/bin/env node
/**
 * TASK-305 — public-safe QA report for M13 content.
 * No answer key, option UUID, correct pair mapping or correct order is emitted.
 * Findings are diagnostic flags requiring substantive review, NOT a claim of
 * automatic scientific / editorial approval.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const read = (p) => JSON.parse(readFileSync(resolve(process.cwd(), p), 'utf8'))
const a = read('docs/content/m13_axr_2026_questions.json').questions
const b = read('docs/content/M13_AXR_native_Y2_Y3_140.json').questions
const staged = read('docs/content/m13_task305_attestation_style_21_keyless_proposals.json').questions
const errors = []
const flags = []

const normalize = (s) => String(s || '').toLocaleLowerCase('uz').replace(/[‘’ʻʼ'`]/g, '').replace(/[^a-zа-яё0-9]+/gi, ' ').trim()
const words = (s) => normalize(s).split(/\s+/).filter(Boolean)
const count = (arr) => arr.reduce((a, v) => (a[v] = (a[v] || 0) + 1, a), {})
const add = (id, format, reason, severity='P1') => flags.push({ id, format, severity, reason })
const normIds = new Map()
const origY1 = a.filter((x) => x.kind === 'Y1')
const paperCombo = a.filter((x) => x.kind === 'Y2' || x.kind === 'Y3')
for (const q of a) {
  const id=q.id, norm=normalize(q.question)
  if (!id || !norm || normIds.has(norm)) errors.push('Original/duplicate stem: '+id)
  else normIds.set(norm,id)
  if (!Array.isArray(q.options) || q.options.length !== 4 ||
      !Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) errors.push('Bad Y1 scoring shape '+id)
  if (!String(q.explanation || '').trim()) errors.push('Missing explanation '+id)
  if (q.kind==='Y2' || q.kind==='Y3') add(id,'Y1','Paper-combination label is NOT native platform Y2/Y3','P1')
}
const suspectWords=['faqat','hech qachon','har doim','barcha','tasodifiy','albatta']
for (const q of origY1) {
  const id=q.id
  const wrong=q.options.filter((_,j)=>j!==q.answer)
  if(wrong.filter(x=>suspectWords.some(y=>normalize(x).includes(y))).length >=2)
    add(id,'Y1','At least two easy-to-eliminate distractors')
  const w=q.options.map(x=>words(x).length)
  const correct=w[q.answer]
  const other=w.filter((_,i)=>i!==q.answer)
  if (correct>=3 && correct>=Math.max(...other)*1.8)
    add(id,'Y1','Correct option distinctly longer than all distractors')
}
const nativeCounts={Y2:0,Y3:0}
for (const q of b) {
  if (!['Y2','Y3'].includes(q.format)) errors.push('Unsupported native format '+q.ref)
  nativeCounts[q.format]=(nativeCounts[q.format]||0)+1
  const id=q.ref||q.id
  if (!id || !String(q.stem || '').trim()) errors.push('Missing native reference/stem '+id)
  if(q.format==='Y2') {
    if(!Array.isArray(q.pairs) || q.pairs.length!==4 ||
      new Set(q.pairs.map(p=>p.left)).size!==4 ||
      new Set(q.pairs.map(p=>p.right)).size!==4)
      errors.push('Invalid native matching pair uniqueness '+id)
    add(id,'Y2','Only 4 right choices for 4 prompts: no surplus plausible distractor')
  }
  if(q.format==='Y3') {
    if(!Array.isArray(q.steps) || q.steps.length!==4 || new Set(q.steps).size!==4)
      errors.push('Invalid native ordering steps '+id)
    add(id,'Y3','Manual verification needed: is the ordering uniquely necessary?','P2')
  }
}
const stagedCounts={Y1:0,Y2:0,Y3:0}
for(const q of staged){
  stagedCounts[q.format]=(stagedCounts[q.format]||0)+1
  if(Object.keys(q).some(k=>['answer','correct','explanation','pairs','steps','correct_order'].includes(k)))
    errors.push('SECRET FIELD IN PUBLIC STAGING: '+q.ref)
  if(q.format==='Y1' && q.choices?.length!==4) errors.push('Y1 options '+q.ref)
  if(q.format==='Y2' && (q.left_labels?.length!==4 || q.right_choices?.length!==5 || q.unused_right_count!==1))
    errors.push('Y2 4x5 stage '+q.ref)
  if(q.format==='Y3' && q.scrambled_steps?.length!==4) errors.push('Y3 steps '+q.ref)
}
if(a.length!==210 || origY1.length!==196 || paperCombo.length!==14 ||
   b.length!==140 || nativeCounts.Y2!==70 || nativeCounts.Y3!==70 ||
   staged.length!==21 || Object.values(stagedCounts).some(v=>v!==7))
   errors.push('Bank distribution changed unexpectedly; re-audit baseline')
const reasons=count(flags.map(f=>f.reason))
const stats={
 original210:a.length,originalY1:origY1.length,originalPaperCombination:paperCombo.length,
 native140:b.length,nativeCounts,newKeylessProposals:staged.length,stagedCounts,
 flagsTotal:flags.length,flagsByReason:reasons,
 duplicateExactNormalizedStems:0,errors
}
if (process.argv.includes('--json')) {
  const target=process.argv[process.argv.indexOf('--json')+1]
  if (!target) errors.push('--json requires an output path')
  else writeFileSync(target,JSON.stringify({stats,flags},null,2)+'\n')
}
process.stdout.write(JSON.stringify(stats,null,2)+'\n')
if(errors.length) process.exitCode=1

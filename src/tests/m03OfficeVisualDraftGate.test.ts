import { describe, expect, it } from 'vitest'
import {readFileSync} from 'node:fs'
const sql=readFileSync('supabase/migrations/20261020093000_task330_m03_office_visual_draft_assets.sql','utf8')
const ids=['OFF-E04-006','OFF-E04-012','OFF-E04-018','OFF-E04-024','OFF-P01-018','OFF-P02-018','OFF-W03-018']
describe('TASK-330 Office visuals draft-only gate',()=>{
  it('defines exactly seven audited visual refs',()=>{
    for(const id of ids) expect(sql).toContain(id)
    const found=Array.from(sql.matchAll(/\('OFF-[A-Z0-9-]+','off_/g))
    expect(found).toHaveLength(7)
  })
  it('does not promote published or review states, or alter answer keys',()=>{
    expect(sql).toContain("q.status='draft'::public.content_status")
    expect(sql).toContain("q.assets='[]'::jsonb")
    expect(sql).not.toMatch(/SET\s+status\s*=/i)
    expect(sql).not.toMatch(/UPDATE\s+public\.question_keys/i)
  })
  it('has SVG files for all permitted diagram IDs',()=>{
    for(const id of ['off_bar','off_line','off_pie','off_table','off_slides','off_timeline','off_wordtable']){
       const svg=readFileSync('public/office-v2/'+id+'.svg','utf8')
       expect(svg).toContain('<svg ')
    }
  })
})

-- TASK-304: SOURCE-CITATION AND EDITORIAL QA — READ ONLY.
-- The `PDF sahifa` field may refer to an unidentified second document;
-- this query flags numeric contradictions for expert verification, not wrong answers.
-- No writes, no exam-history mutations, no hidden answer-key text output.

-- 1. KTD book-range / claimed-page coherence in 528 pending review questions.
with p as (
  select q.id,q.source_reference,
    regexp_match(k.explanation_md, 'PDF[[:space:]]+([0-9]+)[–-]([0-9]+)') as cited_range,
    regexp_match(k.explanation_md, 'PDF sahifa[[:space:]]+([0-9]+)') as claimed_page
  from public.questions q
  join public.question_keys k on k.question_id=q.id
  where q.status='review' and q.source_reference like 'ktd-540-2026:%'
)
select count(*) as ktd_review,
  count(*) filter(where cited_range is not null) as cited_ranges,
  count(*) filter(where claimed_page is not null) as page_claims,
  count(*) filter(where cited_range is not null and claimed_page is not null) as both_present,
  count(*) filter(where cited_range is not null and claimed_page is not null
    and claimed_page[1]::int not between cited_range[1]::int and cited_range[2]::int) as contradictory,
  count(*) filter(where cited_range is not null and claimed_page is not null
    and claimed_page[1]::int between cited_range[1]::int and cited_range[2]::int) as within_cited_range
from p;

-- 2. ID-only priority list (no proprietary answer keys). Includes named ranges and page claims.
with p as (
  select q.id,q.source_reference,
    regexp_match(k.explanation_md, 'PDF[[:space:]]+([0-9]+)[–-]([0-9]+)') as cited_range,
    regexp_match(k.explanation_md, 'PDF sahifa[[:space:]]+([0-9]+)') as claimed_page
  from public.questions q
  join public.question_keys k on k.question_id=q.id
  where q.status='review' and q.source_reference like 'ktd-540-2026:%'
)
select id,source_reference,
  cited_range[1]::int as source_start,
  cited_range[2]::int as source_end,
  claimed_page[1]::int as other_pdf_page
from p
where cited_range is not null and claimed_page is not null
  and claimed_page[1]::int not between cited_range[1]::int and cited_range[2]::int
order by source_reference
limit 50;

-- 3. Graphics/Web review explanations, assets and mapping.
with gv as (
 select q.id,q.format,q.assets,q.stem_md,
   length(btrim(coalesce(k.explanation_md,''))) as rationale_len,
   (select count(*) from public.question_options o where o.question_id=q.id) as options,
   (select count(distinct lower(btrim(o.content_md)))
    from public.question_options o where o.question_id=q.id) as distinct_options,
   exists(select 1 from public.lesson_constructs lc
     where lc.lesson_id=q.source_lesson_id and lc.construct_id=q.construct_id) as lesson_link,
   exists(select 1 from public.question_editorial_checks ec
     where ec.question_id=q.id and ec.answer_verified and ec.reference_verified
     and ec.wording_verified and ec.original_authorship_verified) as editorial_approved
 from public.questions q join public.question_keys k on k.question_id=q.id
 where q.status='review' and q.source_reference like 'GV2:%'
)
select format::text,count(*) as pending,
 count(*) filter(where rationale_len<40) as brief_explanations,
 count(*) filter(where jsonb_array_length(assets)>0) as has_assets,
 count(*) filter(where stem_md ~* '(rasm(dagi|da|ni)|chizma(dagi|da)|tasvir(dagi|da))'
   and jsonb_array_length(assets)=0) as image_phrase_without_asset_heuristic,
 count(*) filter(where options<>distinct_options) as duplicate_option_text,
 count(*) filter(where not lesson_link) as unmapped_construct,
 count(*) filter(where editorial_approved) as approved
from gv group by format order by format;

-- 4. Targeted TASK-304 review edit readback, without exposing keyed answers.
with target as (
 select q.id,q.group_code,q.format,q.status,
  q.cognitive,
  length(trim(k.explanation_md)) explanation_length,
  (select count(*) from public.question_options o where o.question_id=q.id) options,
  (select count(distinct lower(trim(o.content_md)))
    from public.question_options o where o.question_id=q.id) distinct_options,
  (select count(*) from public.question_options o
    where o.question_id=q.id and o.id::text=k.payload->>'correct_option_id') key_matches,
  exists(select 1 from public.lesson_constructs lc
    where lc.lesson_id=q.source_lesson_id and lc.construct_id=q.construct_id) mapped,
  (select count(*) from public.exam_items ei where ei.question_id=q.id) historical_exams
 from public.questions q join public.question_keys k on k.question_id=q.id
 where q.id=any(array[
 '4376803f-bccc-455f-a67c-168b00828fc7'::uuid,
 '890689d9-8c50-4731-bab7-1aa2b053427a'::uuid,
 '13f48dbb-63f9-4816-aa4e-23f9ccc8bffe'::uuid,
 '0823609c-81e8-4266-a751-902ea9127e4b'::uuid,
 '03aef049-ff4e-4c59-bcbe-6ef9acac26a1'::uuid,
 '75a0e2d1-be14-4a7d-b064-5a6b4a5ed683'::uuid,
 '1a87cb16-94e9-4e2c-8a76-87ecaf6012e2'::uuid,
 '385bb797-8ea7-4ef8-a4bd-aefccc4b483f'::uuid,
 '3860cfd7-a9bc-4128-9b23-065b6211d940'::uuid,
 '9898a914-9c7c-4bfd-aa8a-02c5c74c7324'::uuid])
)
select count(*) as edited_records,
count(*) filter(where status='review' and options=4 and distinct_options=4
  and key_matches=1 and mapped and explanation_length>=40 and historical_exams=0) as safe_verified,
count(*) filter(where group_code in ('KS','PM.GEN') and cognitive='bilish') as among_pedagogy_bilish
from target;

-- 5. Current review count and protected release states.
select count(*) as all_review,
count(*) filter(where group_code in ('KS','PM.GEN','PM.MET')) as pedagogy_review,
count(*) filter(where source_reference like 'ktd-540-2026:%') as strict_ktd_review,
count(*) filter(where source_reference like 'GV2:%') as graphics_web_review
from public.questions where status='review';

-- 2026-10-19: post-2023 attestation QA — READ ONLY.
-- Manual query only; NOT in supabase/migrations.
-- No stored correct answer keys, no student/account data, no changes/deploy.

-- 1. Overall live release state.
select status, count(*) as question_count
from public.questions
group by status order by status;

-- 2. Known 2019 source variants must remain completely outside published.
select
 count(*) filter (where status='published') as leaked_published_2019,
 count(*) filter (where status='archived') as archived_2019,
 count(*) as total_known_2019
from public.questions
where source_reference like 'drive:1tQ1L3-eQ-N3WlWElT83J9iX6RYtuMZeF:%'
   or source_reference like 'Drive:Attestatsiya/darsliklar/Test.pdf|2019|%';

-- 3. Check constraints installed in the live DB. This does not enforce
-- other unknown variants or prove the dates of untagged source material.
select conname, pg_get_constraintdef(oid) as rule
from pg_constraint
where conrelid='public.questions'::regclass
  and conname in ('no_2019_source_publication',
                  'no_2019_legacy_source_publication')
order by conname;

-- 4. AI content audit and protected publication state.
-- Absence of independent editorial sign-off is not repaired by AI metadata.
select q.status, a.source_period, a.result, count(*) as items
from attest_ingest.ai_question_reviews a
join public.questions q on q.id=a.question_id
group by q.status, a.source_period, a.result
order by a.source_period, q.status;

-- 5. QA candidates with no reliable release-year provenance:
-- This flags only obvious dates in metadata and is NOT a complete classifier.
select
 count(*) filter (where source_reference is null
                 or source_reference !~ '202[4-9]') as missing_simple_recent_date_marker,
 count(*) filter (where source_reference ~ '(201[0-9]|202[0-3])') as has_old_year_mention,
 count(*) as published
from public.questions
where status='published';

-- 6. Only print counts of protected pedagogy, not answer payloads.
select q.group_code,q.status,
 count(*) as questions,
 count(*) filter (where exists(
   select 1 from public.question_editorial_checks e
   where e.question_id=q.id and e.answer_verified and e.reference_verified
     and e.wording_verified and e.original_authorship_verified
 )) as with_complete_boolean_editorial_flags
from public.questions q
where q.group_code in ('KS','PM.GEN','PM.MET')
group by q.group_code,q.status order by q.group_code,q.status;

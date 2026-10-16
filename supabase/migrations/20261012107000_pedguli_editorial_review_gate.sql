-- Editorial quarantine for supplemental, independently written Pedmahorat Guli
-- topic-derived questions. Structural SQL tests are NOT pedagogical review.
-- Existing 36 v1 published source-backed questions remain available for the
-- 5 KS + 7 PM.GEN + 3 PM.MET practice until supplemental items are reviewed.
-- NO PRODUCTION APPLICATION WITHOUT EXPLICIT USER RELEASE APPROVAL.
begin;
do $editorial_gate$
declare
 v_count int;
begin
 select count(*) into v_count from public.questions q
 where q.source_reference like 'authored:pedguli-topic-study:v2:%'
    or q.source_reference like 'authored:pedguli-html-concepts:v3:%'
    or q.source_reference like 'authored:pedguli-topic-audit:v4:%';
 if v_count<>84 then
   raise exception 'Editorial batch size mismatch: expected 84, found %',v_count;
 end if;

 -- No answer key or question IDs change; learner exam selectors already filter
 -- exclusively on status='published'. Staff moderation uses draft/review/published.
 update public.questions q set status='review'::public.content_status,
   updated_at=now()
 where q.status='published'::public.content_status
   and (
    q.source_reference like 'authored:pedguli-topic-study:v2:%'
    or q.source_reference like 'authored:pedguli-html-concepts:v3:%'
    or q.source_reference like 'authored:pedguli-topic-audit:v4:%'
   );

 if exists(select 1 from public.questions q
 where (q.source_reference like 'authored:pedguli-topic-study:v2:%'
    or q.source_reference like 'authored:pedguli-html-concepts:v3:%'
    or q.source_reference like 'authored:pedguli-topic-audit:v4:%')
   and q.status<>'review'::public.content_status)
 then raise exception 'Supplemental topic-derived content did not reach review state'; end if;

 if (select count(*) from public.questions
     where source_reference like 'authored:professional-15:v1:%'
       and status='published'::public.content_status) <> 36
 then raise exception 'Baseline 36 published questions missing: do not break professional-15';end if;
end
$editorial_gate$;
commit;

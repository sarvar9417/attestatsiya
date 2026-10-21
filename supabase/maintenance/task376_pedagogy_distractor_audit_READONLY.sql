-- TASK-376 read-only scope and possible cue count; no data mutations.
WITH all_groups AS (
 SELECT q.group_code,q.status,count(*) n,
        count(*) FILTER (WHERE f.flagged_for_revision) flagged
 FROM public.questions q LEFT JOIN public.pedagogy_option_quality_flags f ON f.question_id=q.id
 WHERE q.group_code IN ('KS','PM.GEN','PM.MET')
 GROUP BY q.group_code,q.status
),
published_flags AS (
 SELECT q.id,q.group_code,pq.revision_question_id,revision.status review_status
 FROM public.questions q
 JOIN public.pedagogy_option_quality_flags f ON f.question_id=q.id
 LEFT JOIN public.pedagogy_revision_queue pq ON pq.source_question_id=q.id
 LEFT JOIN public.questions revision ON revision.id=pq.revision_question_id
 WHERE q.status='published' AND f.flagged_for_revision
),
draft_cue AS (
 SELECT pf.id,pf.group_code,
 bool_or(o.content_md ~* '(^|[^[:alpha:]])(faqat|hech|mutlaqo|barcha|doim|umuman|taqiqlash)([^[:alpha:]]|$)'
   AND o.id::text<>k.payload->>'correct_option_id') as possible_cue
 FROM published_flags pf JOIN public.question_options o ON o.question_id=pf.revision_question_id
 JOIN public.question_keys k ON k.question_id=pf.revision_question_id
 GROUP BY pf.id,pf.group_code
)
SELECT jsonb_build_object(
 'group_status_counts',(SELECT jsonb_agg(z) FROM all_groups z),
 'published_flagged',(SELECT count(*) FROM published_flags),
 'published_flagged_with_review_successor',(SELECT count(*) FROM published_flags WHERE review_status='review'),
 'published_flagged_drafts_with_possible_absolute_cue',(SELECT count(*) FROM draft_cue WHERE possible_cue),
 'cue_breakdown',(SELECT jsonb_agg(z) FROM (SELECT group_code,count(*) n,count(*) FILTER (WHERE possible_cue) cued FROM draft_cue GROUP BY group_code)z)
) AS audit;
-- Flag is a candidate, not proof: semantic review is essential.

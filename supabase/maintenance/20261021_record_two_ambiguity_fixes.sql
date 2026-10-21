-- Records the repair of two specifically identified ambiguity findings.
-- Only records completed AI semantic/structural remediation, not a human signature.
-- Idempotent. Requires the exact updated stem, four distinct options and stable key.
WITH eligible AS (
 SELECT q.id FROM public.questions q
 JOIN public.question_keys k ON k.question_id=q.id
 JOIN public.question_options correct ON correct.question_id=q.id
 AND correct.id=(k.payload->>'correct_option_id')::uuid
 WHERE q.id IN (
   '7782afd8-62e4-4acc-bbf5-2e9e2946f649'::uuid,
   'b3296a52-f20d-4f56-93f9-0b3f6cd18da9'::uuid)
 AND q.status='review'::public.content_status
 AND length(k.explanation_md)>130
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id)=4
 AND (SELECT count(DISTINCT lower(btrim(o.content_md))) FROM public.question_options o WHERE o.question_id=q.id)=4
 AND (
   (q.id='7782afd8-62e4-4acc-bbf5-2e9e2946f649'::uuid AND correct.order_idx=3
    AND q.stem_md ILIKE '%ball beriladi%') OR
   (q.id='b3296a52-f20d-4f56-93f9-0b3f6cd18da9'::uuid AND correct.order_idx=1
    AND q.stem_md ILIKE '%masofaviy sinxron%')
 )
)
UPDATE public.question_quality_findings f
SET resolved_at=now(),
 details=coalesce(f.details,'{}'::jsonb) ||
 jsonb_build_object('remediation','Specific context, four distinct distractors, answer rationale corrected',
 'editorial_type','assistant_semantic_quality_correction',
 'independent_person_approval_claimed',false)
WHERE f.finding_code='ambiguous_pedagogy_key'
AND f.resolved_at IS NULL AND f.question_id IN (SELECT id FROM eligible)
RETURNING f.question_id,f.resolved_at;
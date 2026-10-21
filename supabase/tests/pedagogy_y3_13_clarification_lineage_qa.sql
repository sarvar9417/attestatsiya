-- Read-only verification of 13 clarified pedagogy Y3 sequence stems.
-- The original published question remains immutable; a new review clone carries
-- a 1:1 remapping of choices and exact correct-order semantics.
BEGIN;
DO $qa$
DECLARE n integer; bad integer;
BEGIN
 WITH y3 AS (
 SELECT source.id original_id,revised.id revised_id,
 source.status source_status,revised.status revised_status,
 source.stem_md old_stem,revised.stem_md revised_stem,
 (SELECT string_agg(o.content_md,' | ' ORDER BY x.ord) FROM public.question_keys k
   CROSS JOIN LATERAL jsonb_array_elements_text(k.payload->'order') WITH ORDINALITY x(item,ord)
   JOIN public.question_options o ON o.id::text=x.item AND o.question_id=k.question_id
   WHERE k.question_id=source.id) original_correct_order,
 (SELECT string_agg(o.content_md,' | ' ORDER BY x.ord) FROM public.question_keys k
   CROSS JOIN LATERAL jsonb_array_elements_text(k.payload->'order') WITH ORDINALITY x(item,ord)
   JOIN public.question_options o ON o.id::text=x.item AND o.question_id=k.question_id
   WHERE k.question_id=revised.id) revised_correct_order,
 (SELECT count(*) FROM public.question_options o WHERE o.question_id=revised.id) option_n,
 (SELECT count(DISTINCT btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=revised.id) unique_n
 FROM public.question_bank_revisions b
 JOIN public.questions source ON source.id=b.source_question_id
 JOIN public.questions revised ON revised.id=b.revision_question_id
 WHERE b.revision_kind='pedagogy_y3_workflow_prompt_clarity'
 )
 SELECT count(*),count(*) FILTER(WHERE source_status<>'published'::public.content_status
   OR revised_status<>'review'::public.content_status
   OR old_stem=revised_stem OR original_correct_order IS NULL
   OR original_correct_order IS DISTINCT FROM revised_correct_order
   OR option_n<>4 OR unique_n<>4)
 INTO n,bad FROM y3;
 IF n<>13 OR bad>0 THEN
   RAISE EXCEPTION 'Y3 clarifications not ready: items %, errors %',n,bad;
 END IF;
 RAISE NOTICE 'PASS: 13 Y3 wording corrections preserve 13 original published snapshots and exact ordered answers';
END $qa$;
ROLLBACK;
-- TASK-291: safe cutover of two broken published Y2 questions to independently keyed 4x4 revisions.
-- QA source: authoritative HTML/CSS semantics + exact label-to-option content equivalence.
-- Never mutate published original options, question text, keys or past attempt rows.
BEGIN;
DO $$
DECLARE old_n int; new_n int; before_pool int; after_pool int; before_attempts int; after_attempts int; pair_mismatch int;
BEGIN
 SELECT count(*) INTO before_pool FROM public.questions WHERE group_code='S5.WEB' AND status='published';
 SELECT count(*) INTO old_n FROM public.questions WHERE source_reference IN
 ('formatbank-2026:T063-Y2-018','formatbank-2026:T063-Y2-019')
 AND status='published' AND format='Y2';
 IF old_n<>2 THEN RAISE EXCEPTION 'TASK291 cutover requires exactly 2 old published Y2, got %',old_n; END IF;
 SELECT count(*) INTO new_n FROM public.questions WHERE source_reference LIKE 'TASK291:Y2:NATIVE-REVISION-OF:%'
 AND status='review' AND format='Y2';
 IF new_n<>2 THEN RAISE EXCEPTION 'TASK291 cutover requires 2 candidate Y2, got %',new_n; END IF;

 SELECT count(*) INTO pair_mismatch FROM public.questions n
 JOIN public.questions o ON n.source_reference='TASK291:Y2:NATIVE-REVISION-OF:'||o.source_reference
 JOIN public.question_keys nk ON nk.question_id=n.id
 JOIN public.question_keys ok ON ok.question_id=o.id
 WHERE o.source_reference IN ('formatbank-2026:T063-Y2-018','formatbank-2026:T063-Y2-019')
 AND (
   n.stem_md IS DISTINCT FROM o.stem_md
   OR n.source_lesson_id IS DISTINCT FROM o.source_lesson_id
   OR n.construct_id IS DISTINCT FROM o.construct_id
   OR (SELECT count(*) FROM public.question_options a WHERE a.question_id=n.id AND a.side='a')<>4
   OR (SELECT count(*) FROM public.question_options b WHERE b.question_id=n.id AND b.side='b')<>4
   OR (SELECT count(*) FROM jsonb_each_text(nk.payload->'pairs'))<>4
   OR (SELECT jsonb_object_agg(a.content_md,b.content_md)
       FROM jsonb_each_text(ok.payload->'pairs') p
       JOIN public.question_options a ON a.id::text=p.key
       JOIN public.question_options b ON b.id::text=p.value
       WHERE a.question_id=o.id AND b.question_id=o.id)
      IS DISTINCT FROM
      (SELECT jsonb_object_agg(a.content_md,b.content_md)
       FROM jsonb_each_text(nk.payload->'pairs') p
       JOIN public.question_options a ON a.id::text=p.key AND a.side='a'
       JOIN public.question_options b ON b.id::text=p.value AND b.side='b'
       WHERE a.question_id=n.id AND b.question_id=n.id)
 );
 IF pair_mismatch<>0 THEN RAISE EXCEPTION 'TASK291: native Y2 answer text meaning mismatch, % items',pair_mismatch; END IF;

 SELECT count(*) INTO before_attempts FROM public.exam_items ei
 WHERE ei.question_id IN (SELECT q.id FROM public.questions q WHERE
 q.source_reference IN ('formatbank-2026:T063-Y2-018','formatbank-2026:T063-Y2-019'));
 -- Fresh CI seeds may have zero attempts; production had two. Require unchanged count in post-check, not an invented minimum.

 UPDATE public.questions
 SET status='published'::public.content_status
 WHERE status='review'::public.content_status
 AND source_reference LIKE 'TASK291:Y2:NATIVE-REVISION-OF:%';

 IF (SELECT count(*) FROM public.questions WHERE
 source_reference LIKE 'TASK291:Y2:NATIVE-REVISION-OF:%'
 AND status='published')<>2 THEN RAISE EXCEPTION 'TASK291 new published count mismatch'; END IF;

 UPDATE public.questions
 SET status='archived'::public.content_status
 WHERE status='published'::public.content_status
 AND source_reference IN ('formatbank-2026:T063-Y2-018','formatbank-2026:T063-Y2-019');

 SELECT count(*) INTO after_pool FROM public.questions WHERE group_code='S5.WEB' AND status='published';
 SELECT count(*) INTO after_attempts FROM public.exam_items ei
 WHERE ei.question_id IN (SELECT q.id FROM public.questions q WHERE
 q.source_reference IN ('formatbank-2026:T063-Y2-018','formatbank-2026:T063-Y2-019'));
 IF before_pool<>after_pool OR before_attempts<>after_attempts OR
 (SELECT count(*) FROM public.questions WHERE source_reference IN
 ('formatbank-2026:T063-Y2-018','formatbank-2026:T063-Y2-019') AND status='archived')<>2
 THEN RAISE EXCEPTION 'TASK291 old attempt/selection integrity changed, before-pool %, after-pool %, attempts-before %, attempts-after %',
  before_pool,after_pool,before_attempts,after_attempts; END IF;
END $$;
COMMIT;

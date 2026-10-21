-- Read-only postflight: two duplicate published stems fixed by safe content revisions.
-- Assertions check exact answer semantics, not merely valid UUID references.
BEGIN;
DO $qa$
DECLARE n integer; bad integer;
BEGIN
 WITH revisions AS (
 SELECT src.id old_id,rev.id new_id,src.format,
 src.status old_status,rev.status new_status,src.stem_md old_stem,rev.stem_md new_stem,
 (SELECT string_agg(o.content_md,'|~|' ORDER BY o.order_idx)
  FROM public.question_options o WHERE o.question_id=src.id) original_options,
 (SELECT string_agg(o.content_md,'|~|' ORDER BY o.order_idx)
  FROM public.question_options o WHERE o.question_id=rev.id) revised_options,
 (SELECT o.content_md FROM public.question_keys k
  JOIN public.question_options o ON o.id::text=k.payload->>'correct_option_id'
  AND o.question_id=k.question_id WHERE k.question_id=src.id) original_y1_answer,
 (SELECT o.content_md FROM public.question_keys k
  JOIN public.question_options o ON o.id::text=k.payload->>'correct_option_id'
  AND o.question_id=k.question_id WHERE k.question_id=rev.id) revised_y1_answer,
 (SELECT string_agg(a.content_md||' → '||b.content_md,'|~|' ORDER BY a.content_md)
  FROM public.question_keys k
  JOIN LATERAL jsonb_each_text(k.payload->'pairs') pair ON true
  JOIN public.question_options a ON a.id::text=pair.key AND a.question_id=k.question_id
  JOIN public.question_options b ON b.id::text=pair.value AND b.question_id=k.question_id
  WHERE k.question_id=src.id) original_y2_pairs,
 (SELECT string_agg(a.content_md||' → '||b.content_md,'|~|' ORDER BY a.content_md)
  FROM public.question_keys k
  JOIN LATERAL jsonb_each_text(k.payload->'pairs') pair ON true
  JOIN public.question_options a ON a.id::text=pair.key AND a.question_id=k.question_id
  JOIN public.question_options b ON b.id::text=pair.value AND b.question_id=k.question_id
  WHERE k.question_id=rev.id) revised_y2_pairs,
 (SELECT count(*) FROM public.question_options o WHERE o.question_id=rev.id) option_count
 FROM public.question_bank_revisions br
 JOIN public.questions src ON src.id=br.source_question_id
 JOIN public.questions rev ON rev.id=br.revision_question_id
 WHERE br.revision_kind='pedagogy_duplicate_stem_specificity'
 )
 SELECT count(*),
 count(*) FILTER(WHERE old_status<>'published'::public.content_status
 OR new_status<>'review'::public.content_status
 OR old_stem=new_stem OR original_options IS DISTINCT FROM revised_options
 OR (format='Y1'::public.question_format
  AND (option_count<>4 OR original_y1_answer IS DISTINCT FROM revised_y1_answer))
 OR (format='Y2'::public.question_format
  AND (option_count<>8 OR original_y2_pairs IS DISTINCT FROM revised_y2_pairs))
 ) INTO n,bad FROM revisions;
 IF n<>2 OR bad>0 THEN
  RAISE EXCEPTION 'Duplicate prompt fix QA failed: % rows, % mismatches',n,bad;
 END IF;
 RAISE NOTICE 'PASS: 2 duplicate stems disambiguated with preserved Y1 correct choice / Y2 pairing';
END $qa$;
ROLLBACK;
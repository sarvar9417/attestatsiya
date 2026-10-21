-- Read-only postflight for six safely released pedagogy Y1 quality revisions.
-- Does not forge independent reviewer signatures, modify content or rewrite attempts.
BEGIN;
DO $qa$
DECLARE n integer; bad integer;
BEGIN
 WITH q AS (
 SELECT src.id source_id,src.status source_status,
 rev.id revised_id,rev.status revised_status,
 w.content_fingerprint AS authorized_fingerprint,
 public.professional_question_fingerprint(rev.id) actual_fingerprint,
 (SELECT count(*) FROM public.question_options o WHERE o.question_id=rev.id) options,
 (SELECT count(DISTINCT lower(btrim(o.content_md))) FROM public.question_options o WHERE o.question_id=rev.id) distinct_options,
 (SELECT min(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
   FROM public.question_options o WHERE o.question_id=rev.id) shortest,
 (SELECT max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
   FROM public.question_options o WHERE o.question_id=rev.id) longest,
 (SELECT max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
   FROM public.question_options o JOIN public.question_keys k ON k.question_id=rev.id
   WHERE o.question_id=rev.id AND o.id::text=k.payload->>'correct_option_id') correct_len,
 (SELECT max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
   FROM public.question_options o JOIN public.question_keys k ON k.question_id=rev.id
   WHERE o.question_id=rev.id AND o.id::text<>k.payload->>'correct_option_id') largest_wrong_len
 FROM public.question_bank_revisions b
 JOIN public.questions src ON src.id=b.source_question_id
 JOIN public.questions rev ON rev.id=b.revision_question_id
 LEFT JOIN public.pedagogy_owner_release_waivers w ON w.question_id=rev.id
 WHERE b.revision_kind='pedagogy_high_cue_balanced_rescue'
 )
 SELECT count(*), count(*) FILTER (WHERE
 source_status <> 'archived'::public.content_status
 OR revised_status <> 'published'::public.content_status
 OR authorized_fingerprint IS DISTINCT FROM actual_fingerprint
 OR options <> 4 OR distinct_options <> 4
 OR shortest IS NULL OR longest>shortest*1.8
 OR correct_len>largest_wrong_len*1.25)
 INTO n,bad FROM q;
 IF n=0 THEN RAISE NOTICE 'No production-specific release records in empty fixture';RETURN;END IF;
 IF n<>6 OR bad<>0 THEN RAISE EXCEPTION 'Pedagogy Y1 six release QA failed: count %, violations %',n,bad;END IF;
 RAISE NOTICE 'PASS: 6 released revisions, six archived originals, valid keys and balanced options';
END $qa$;
ROLLBACK;
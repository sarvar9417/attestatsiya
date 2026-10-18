-- Expand the independent source/key/distractor editorial gate to both
-- the imported KTD cohort and the newly authored M02 REVIEW cohort.
-- No question is published by this migration.
-- Requires 20261018131000_ktd_independent_publication_gate.sql.
CREATE OR REPLACE FUNCTION ktd_quality.guard_ktd_publication()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE
  v_count int; v_correct_count int; v_correct_len int; v_correct_wc int;
  v_max_len int; v_max_wc int; v_longest_len int; v_longest_wc int;
BEGIN
  IF new.status <> 'published'::public.content_status
     OR (
       coalesce(new.source_reference,'') NOT LIKE 'ktd-540-2026:%'
       AND coalesce(new.source_reference,'') NOT LIKE 'authored:m02-source-20261018:%'
     )
  THEN RETURN new; END IF;
  -- Published revision may not be stealthily edited using a status update.
  IF tg_op='INSERT' THEN
    RAISE EXCEPTION USING ERRCODE='23514',MESSAGE='KTD_REVIEW_FIRST';
  END IF;
  IF old.status='published'::public.content_status
     AND old.source_reference IS NOT DISTINCT FROM new.source_reference
  THEN RETURN new; END IF;
  IF (to_jsonb(new)-'status'-'updated_at') <>
     (to_jsonb(old)-'status'-'updated_at')
  THEN
    RAISE EXCEPTION USING ERRCODE='23514',MESSAGE='KTD_EDIT_AND_PUBLISH_SEPARATELY';
  END IF;
  IF new.format<>'Y1'::public.question_format
    OR NOT EXISTS(
      SELECT 1 FROM public.constructs c
      JOIN public.lesson_constructs lc ON lc.construct_id=c.id
      JOIN public.lessons l ON l.id=lc.lesson_id
      WHERE c.id=new.construct_id AND c.is_active
        AND c.group_code=new.group_code
        AND l.id=new.source_lesson_id
        AND l.status='published'::public.content_status
    )
  THEN
    RAISE EXCEPTION USING ERRCODE='23514',MESSAGE='KTD_TAXONOMY_OR_FORMAT_INVALID';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM ktd_quality.editorial_reviews r
    WHERE r.question_id=new.id
      AND r.reviewer_id IS NOT NULL
      AND r.answer_verified AND r.source_verified
      AND r.distractors_verified AND r.wording_verified
      AND length(trim(r.source_book))>=3
      AND r.source_pdf_page>0
      AND length(trim(r.source_excerpt))>=30
      AND length(trim(r.answer_rationale))>=30
      AND length(trim(r.wrong_options_rationale))>=30
      AND r.item_fingerprint=ktd_quality.item_fingerprint(new.id)
  ) THEN
    RAISE EXCEPTION USING ERRCODE='23514',MESSAGE='KTD_INDEPENDENT_EXPERT_REVIEW_REQUIRED';
  END IF;

  WITH options AS (
     SELECT o.id, o.content_md,
       length(trim(o.content_md)) AS char_count,
       cardinality(regexp_split_to_array(trim(o.content_md),'[[:space:]]+')) AS wc,
       (o.id::text=k.payload->>'correct_option_id') AS correct
     FROM public.question_options o
     JOIN public.question_keys k ON k.question_id=o.question_id
     WHERE o.question_id=new.id AND o.side='a'
  ) SELECT count(*),count(*) FILTER(WHERE correct),
      max(char_count) FILTER(WHERE correct),max(wc) FILTER(WHERE correct),
      max(char_count),max(wc),
      count(*) FILTER(WHERE char_count=(SELECT max(char_count) FROM options)),
      count(*) FILTER(WHERE wc=(SELECT max(wc) FROM options))
    INTO v_count,v_correct_count,v_correct_len,v_correct_wc,
      v_max_len,v_max_wc,v_longest_len,v_longest_wc
    FROM options;

  IF v_count<>4 OR v_correct_count<>1
     OR (v_correct_len=v_max_len AND v_longest_len=1)
     OR (v_correct_wc=v_max_wc AND v_longest_wc=1)
  THEN
    RAISE EXCEPTION USING ERRCODE='23514',MESSAGE='KTD_DISTRACTOR_LENGTH_OR_KEY_REVIEW_REQUIRED';
  END IF;
  RETURN new;
END $$;

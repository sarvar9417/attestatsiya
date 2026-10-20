-- KTD-540 imported questions are REVIEW by default and may NEVER
-- become published without independent item-level source & answer signoff.
-- Does not publish or modify any existing question.
CREATE SCHEMA IF NOT EXISTS ktd_quality;
REVOKE ALL ON SCHEMA ktd_quality FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA ktd_quality TO service_role;

CREATE OR REPLACE FUNCTION ktd_quality.item_fingerprint(p_question_id uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT md5(
   coalesce(q.stem_md,'') || '|' || coalesce(q.construct_id::text,'') || '|'
   || coalesce(q.group_code,'') || '|' || coalesce(q.source_reference,'')
   || '|' || coalesce((
     SELECT string_agg(o.order_idx::text || ':' || o.content_md, '|'
              ORDER BY o.side,o.order_idx)
     FROM public.question_options o WHERE o.question_id=p_question_id
   ),'')
   || '|' || coalesce((
     SELECT k.payload::text || ':' || k.explanation_md
     FROM public.question_keys k WHERE k.question_id=p_question_id
   ),'')
 )
 FROM public.questions q WHERE q.id=p_question_id;
$$;
REVOKE ALL ON FUNCTION ktd_quality.item_fingerprint(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION ktd_quality.item_fingerprint(uuid) TO service_role;

CREATE TABLE IF NOT EXISTS ktd_quality.editorial_reviews (
  question_id uuid PRIMARY KEY REFERENCES public.questions(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES auth.users(id),
  answer_verified boolean NOT NULL DEFAULT false,
  source_verified boolean NOT NULL DEFAULT false,
  distractors_verified boolean NOT NULL DEFAULT false,
  wording_verified boolean NOT NULL DEFAULT false,
  source_book text NOT NULL DEFAULT '',
  source_pdf_page integer CHECK(source_pdf_page>0),
  source_excerpt text NOT NULL DEFAULT '',
  answer_rationale text NOT NULL DEFAULT '',
  wrong_options_rationale text NOT NULL DEFAULT '',
  item_fingerprint text NOT NULL DEFAULT '',
  reviewed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE ktd_quality.editorial_reviews ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE ktd_quality.editorial_reviews FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON TABLE ktd_quality.editorial_reviews TO service_role;

CREATE OR REPLACE FUNCTION ktd_quality.guard_ktd_publication()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE
  v_count int; v_correct_count int; v_correct_len int; v_correct_wc int;
  v_max_len int; v_max_wc int; v_longest_len int; v_longest_wc int;
BEGIN
  IF new.status <> 'published'::public.content_status
     OR coalesce(new.source_reference,'') NOT LIKE 'ktd-540-2026:%'
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
DROP TRIGGER IF EXISTS ktd_unverified_publication_guard ON public.questions;
CREATE TRIGGER ktd_unverified_publication_guard
BEFORE INSERT OR UPDATE OF status,source_reference,stem_md,construct_id
ON public.questions FOR EACH ROW EXECUTE FUNCTION ktd_quality.guard_ktd_publication();

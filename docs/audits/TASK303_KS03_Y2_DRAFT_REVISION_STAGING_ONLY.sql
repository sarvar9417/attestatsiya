-- TASK-303: Draft-only replacement for malformed published KS.03/Y2 option sides.
-- Never edits/deletes a published question, a historic exam, or the existing key.
-- This migration MUST NOT be applied to production without an approved release plan.
-- Reviewer must inspect source page 6–7 and independently verify all four pairs.
DO $task303$
DECLARE
  v_old constant uuid := 'fb83453d-1e42-4ac5-9ce2-864b24ceb022';
  v_new constant uuid := '30300000-0000-4000-8000-000000000001';
  v_key jsonb;
BEGIN
  IF EXISTS (SELECT 1 FROM public.questions WHERE id = v_new) THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.questions
      WHERE id = v_new AND status = 'draft'::public.content_status
        AND source_reference LIKE 'draft:task303:%'
    ) THEN
      RAISE EXCEPTION 'TASK303 draft UUID collides with an unrelated row';
    END IF;
    RETURN;
  END IF;

  SELECT k.payload INTO v_key
  FROM public.questions q
  JOIN public.question_keys k ON k.question_id = q.id
  WHERE q.id = v_old AND q.group_code = 'KS'
    AND q.format = 'Y2'::public.question_format
    AND q.status = 'published'::public.content_status;
  IF v_key IS NULL THEN
    RAISE EXCEPTION 'TASK303 source Y2 is missing or has changed state';
  END IF;

  -- Eight original options were mistakenly all tagged side='a'.
  -- The first four IDs are payload.pairs keys, last four its values.
  IF (SELECT count(*) FROM public.question_options WHERE question_id=v_old) <> 8
     OR (SELECT count(*) FROM public.question_options WHERE question_id=v_old AND side='a') <> 8
     OR (SELECT count(*) FROM public.question_options o
         WHERE o.question_id=v_old AND o.order_idx BETWEEN 1 AND 4
           AND v_key->'pairs' ? o.id::text) <> 4
     OR (SELECT count(*) FROM public.question_options o
         WHERE o.question_id=v_old AND o.order_idx BETWEEN 5 AND 8
           AND o.id::text IN (SELECT value FROM jsonb_each_text(v_key->'pairs'))) <> 4
  THEN
    RAISE EXCEPTION 'TASK303 source option/key topology changed; abort';
  END IF;

  INSERT INTO public.questions (
    id, subject_id, construct_id, group_code, format, cognitive,
    difficulty, stem_md, assets, is_generated, status, author_id,
    source_reference, source_lesson_id
  )
  SELECT v_new, subject_id, construct_id, group_code, format, cognitive,
         difficulty,
         'Diagnostika, monitoring, qayta aloqa va yakuniy baholashni mos vazifalari bilan juftlang.',
         assets, true, 'draft'::public.content_status, author_id,
         'draft:task303:professional-standard:pdf-p6-7:KS.03:Y2',
         source_lesson_id
  FROM public.questions WHERE id = v_old;

  INSERT INTO public.question_options(id, question_id, side, order_idx, content_md)
  SELECT md5(o.id::text || ':TASK303')::uuid,
         v_new,
         CASE WHEN o.order_idx <= 4 THEN 'a' ELSE 'b' END,
         CASE WHEN o.order_idx <= 4 THEN o.order_idx ELSE o.order_idx - 4 END,
         o.content_md
  FROM public.question_options o
  WHERE o.question_id = v_old
  ORDER BY o.order_idx;

  INSERT INTO public.question_keys(question_id, payload, explanation_md)
  SELECT v_new,
         jsonb_build_object('pairs', (
           SELECT jsonb_object_agg(
             (md5(p.key || ':TASK303')::uuid)::text,
             (md5(p.value || ':TASK303')::uuid)::text
           )
           FROM jsonb_each_text(v_key->'pairs') p
         )),
         'Diagnostika boshlang‘ich holatni bilishga, monitoring muntazam kuzatishga, qayta aloqa keyingi qadamni belgilashga, yakuniy baholash esa davr oxiridagi natijani umumlashtirishga yordam beradi.'
  FROM public.question_keys WHERE question_id = v_old;

  INSERT INTO public.pedagogy_revision_queue(
    source_question_id, revision_question_id, reason
  ) VALUES (
    v_old, v_new,
    'TASK303: one published Y2 has 8 side=a, 0 side=b; clone fixed 4+4 and distinguish identical stem; human source/key review pending'
  );

  IF (SELECT count(*) FROM public.question_options WHERE question_id=v_new AND side='a') <> 4
     OR (SELECT count(*) FROM public.question_options WHERE question_id=v_new AND side='b') <> 4
     OR (SELECT count(*) FROM public.question_keys WHERE question_id=v_new) <> 1
     OR (SELECT count(*) FROM jsonb_each((SELECT payload->'pairs' FROM public.question_keys WHERE question_id=v_new))) <> 4
  THEN
    RAISE EXCEPTION 'TASK303 constructed Y2 draft failed structural QA';
  END IF;
END
$task303$;

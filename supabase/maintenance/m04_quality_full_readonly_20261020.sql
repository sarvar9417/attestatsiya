-- M04 2026-10-20: read-only source-style technical quality gate.
-- This does not replace independent semantic review of each answer.
WITH q AS (
 SELECT q.*,k.payload,k.explanation_md FROM public.questions q
 LEFT JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.group_code='S3.LOGIC' AND q.status='published'
), x AS (
 SELECT q.id,q.format,q.source_reference,q.stem_md,q.payload,q.explanation_md,
  (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id) nopts,
  (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a') na,
  (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b') nb,
  (SELECT count(DISTINCT o.content_md) FROM public.question_options o WHERE o.question_id=q.id) unique_opts,
  EXISTS(SELECT 1 FROM public.lessons l WHERE l.id=q.source_lesson_id AND l.module_id=(SELECT m.id FROM public.modules m WHERE m.code='M04') AND l.status='published') canonical_lesson,
  EXISTS(SELECT 1 FROM public.constructs c WHERE c.id=q.construct_id AND c.group_code='S3.LOGIC' AND c.is_active) construct_valid,
  CASE
   WHEN q.format='Y1' THEN EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=q.payload->>'correct_option_id')
   WHEN q.format='Y2' THEN jsonb_typeof(q.payload->'pairs')='object'
     AND NOT EXISTS(SELECT 1 FROM jsonb_each_text(q.payload->'pairs') p WHERE
       NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=p.key AND o.side='a')
       OR NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=p.value AND o.side='b'))
   WHEN q.format='Y3' THEN jsonb_typeof(q.payload->'order')='array'
     AND NOT EXISTS(SELECT 1 FROM jsonb_array_elements_text(q.payload->'order') a WHERE
       NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=a.value))
   ELSE false END key_valid
 FROM q
)
SELECT
 count(*) published_total,
 count(*) FILTER(WHERE format='Y1') y1,
 count(*) FILTER(WHERE format='Y2') y2,
 count(*) FILTER(WHERE format='Y3') y3,
 count(*) FILTER(WHERE payload IS NULL OR NOT key_valid) bad_key_payload,
 count(*) FILTER(WHERE length(trim(coalesce(explanation_md,'')))<15) inadequate_explanation,
 count(*) FILTER(WHERE nopts<>unique_opts) identical_options,
 count(*) FILTER(WHERE NOT canonical_lesson) wrong_lesson,
 count(*) FILTER(WHERE NOT construct_valid) wrong_construct,
 count(*) FILTER(WHERE format='Y1' AND (na<>4 OR nb<>0)) bad_y1_shape,
 count(*) FILTER(WHERE format='Y2' AND (na<2 OR nb<2)) bad_y2_shape,
 count(*) FILTER(WHERE format='Y3' AND (nb>0 OR na<3)) bad_y3_shape,
 count(*) FILTER(WHERE stem_md ~* '(atamasiga mos ta.rif|bu vaziyatni qaysi atama|nima deyiladi|deyiladi\?)') definition_style_for_review,
 count(*) FILTER(WHERE format IN('Y2','Y3') AND length(trim(stem_md))<60) short_interactive_for_review
FROM x;

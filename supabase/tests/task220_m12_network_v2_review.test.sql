-- TASK-220: M12 network V2 review-only import contract.
-- Execute after migration; no production rows are changed by this test.
BEGIN;
DO $check$
DECLARE n integer;
BEGIN
  SELECT count(*) INTO n FROM public.lessons l JOIN public.modules m ON m.id=l.module_id
  WHERE m.code='M12' AND l.slug LIKE 'tarmoq-v2-bob-%'
    AND l.status='draft'::public.content_status AND length(coalesce(l.body_mdx,''))>500;
  IF n<>10 THEN RAISE EXCEPTION 'TASK220: expected 10 draft source-backed chapters, got %',n; END IF;
  SELECT count(*) INTO n FROM public.questions
    WHERE source_reference LIKE 'network-v2-20261018:%'
      AND status='review'::public.content_status AND group_code='S6.NET'
      AND format='Y1'::public.question_format;
  IF n<>300 THEN RAISE EXCEPTION 'TASK220: expected 300 review Y1-choice items, got %',n; END IF;
  SELECT count(*) INTO n FROM (
    SELECT q.id
    FROM public.questions q JOIN public.question_options o ON o.question_id=q.id AND o.side='a'
    WHERE q.source_reference LIKE 'network-v2-20261018:%'
    GROUP BY q.id HAVING count(o.id)<>4 OR count(DISTINCT o.order_idx)<>4
  ) bad;
  IF n<>0 THEN RAISE EXCEPTION 'TASK220: bad options for % question(s)',n; END IF;
  SELECT count(*) INTO n FROM public.questions q
  LEFT JOIN public.question_keys k ON k.question_id=q.id
  LEFT JOIN public.question_options o ON o.id=(k.payload->>'correct_option_id')::uuid
  WHERE q.source_reference LIKE 'network-v2-20261018:%'
    AND (k.question_id IS NULL OR o.question_id IS DISTINCT FROM q.id);
  IF n<>0 THEN RAISE EXCEPTION 'TASK220: bad/missing protected answer keys: %',n; END IF;
  SELECT count(*) INTO n FROM public.questions q
    JOIN public.lessons l ON l.id=q.source_lesson_id
    JOIN public.modules m ON m.id=l.module_id
    JOIN public.lesson_constructs lc ON lc.lesson_id=l.id AND lc.construct_id=q.construct_id
    WHERE q.source_reference LIKE 'network-v2-20261018:%' AND m.code='M12';
  IF n<>300 THEN RAISE EXCEPTION 'TASK220: source lesson/construct links % != 300',n; END IF;
  SELECT count(*) INTO n FROM public.lessons l JOIN public.modules m ON m.id=l.module_id
  WHERE m.code='M12' AND l.slug IN
    ('tarmoqlar-va-qurilmalar','arxitektura-va-topologiyalar',
     'ip-manzil-va-tarmoq-maskasi','internetdan-xavfsiz-va-maqsadli-foydalanish',
     'brauzer-qidiruv-dns')
    AND l.status='published'::public.content_status;
  IF n<>5 THEN RAISE EXCEPTION 'TASK220: previous five published M12 lessons must remain published, got %',n; END IF;
END $check$;
ROLLBACK;

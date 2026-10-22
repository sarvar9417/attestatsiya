-- TASK-531: exact source-backed PM.MET native Y2 structure and release state.
DO $task531_test$
DECLARE
  total_count int;
  published_count int;
  bad int;
BEGIN
  SELECT count(*),count(*) FILTER(WHERE status='published'::public.content_status)
  INTO total_count,published_count
  FROM public.questions
  WHERE source_reference LIKE 'source-verified:task531:%';

  IF total_count<>2 OR published_count NOT IN (0,2) THEN
    RAISE EXCEPTION 'TASK531_TEST: expected two atomic review/published items, total %, published %',
      total_count,published_count;
  END IF;

  SELECT count(*) INTO bad
  FROM public.questions q
  JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.source_reference LIKE 'source-verified:task531:%'
    AND (q.group_code<>'PM.MET' OR q.format<>'Y2'::public.question_format
      OR q.cognitive<>'qollash'::public.cognitive_level OR q.difficulty<>4
      OR q.source_lesson_id IS NULL OR length(trim(k.explanation_md))<100
      OR jsonb_typeof(k.payload->'pairs')<>'object'
      OR (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs'))<>4
      OR (SELECT count(distinct pair.value) FROM jsonb_each_text(k.payload->'pairs') pair)<>4
      OR (SELECT count(*) FROM public.question_options o
          WHERE o.question_id=q.id AND o.side='a')<>4
      OR (SELECT count(*) FROM public.question_options o
          WHERE o.question_id=q.id AND o.side='b')<>4
      OR EXISTS (
        SELECT 1 FROM jsonb_each_text(k.payload->'pairs') pair
        WHERE NOT EXISTS (
          SELECT 1 FROM public.question_options a
          WHERE a.question_id=q.id AND a.side='a' AND a.id::text=pair.key
        ) OR NOT EXISTS (
          SELECT 1 FROM public.question_options b
          WHERE b.question_id=q.id AND b.side='b' AND b.id::text=pair.value
        )
      ));
  IF bad<>0 THEN RAISE EXCEPTION 'TASK531_TEST: structural failures %',bad; END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.questions q
    JOIN public.question_keys k ON k.question_id=q.id
    JOIN LATERAL jsonb_each_text(k.payload->'pairs') pair ON true
    JOIN public.question_options a ON a.question_id=q.id AND a.id::text=pair.key
    JOIN public.question_options b ON b.question_id=q.id AND b.id::text=pair.value
    WHERE q.source_reference LIKE '%:pp66-70:PM.MET.02:Y2:001'
      AND a.content_md='O‘quvchi o‘qituvchi bergan muammoli savollarga javobni o‘zi izlab topadi'
      AND b.content_md='Evristik suhbat'
  ) THEN RAISE EXCEPTION 'TASK531_TEST: evristik pair drift'; END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.questions q
    JOIN public.question_keys k ON k.question_id=q.id
    JOIN LATERAL jsonb_each_text(k.payload->'pairs') pair ON true
    JOIN public.question_options a ON a.question_id=q.id AND a.id::text=pair.key
    JOIN public.question_options b ON b.question_id=q.id AND b.id::text=pair.value
    WHERE q.source_reference LIKE '%:pp253-255:PM.MET.01:Y2:001'
      AND a.content_md='Tanlangan metodni amalga oshirish uchun moddiy obyektlardan foydalanadi'
      AND b.content_md='O‘quv vositalari'
  ) THEN RAISE EXCEPTION 'TASK531_TEST: methodological-system pair drift'; END IF;

  IF published_count=2 THEN
    IF (SELECT count(*) FROM public.questions q
        WHERE q.source_reference LIKE 'source-verified:task531:%'
          AND public.question_source_evidence_eligible(q.id))<>2
    THEN RAISE EXCEPTION 'TASK531_TEST: published source-backed item excluded'; END IF;

    IF NOT EXISTS (
      SELECT 1 FROM public.questions q
      JOIN public.question_bank_revisions r ON r.source_question_id=q.id
      JOIN public.questions replacement ON replacement.id=r.revision_question_id
      WHERE q.source_reference='authored:pedagogy-examstyle:20261020:PM.MET.02:Y2:01'
        AND q.status='archived'::public.content_status
        AND replacement.source_reference LIKE '%:pp66-70:PM.MET.02:Y2:001'
        AND replacement.status='published'::public.content_status
        AND r.revision_kind='task531_source_verified_pmmet_y2'
    ) THEN RAISE EXCEPTION 'TASK531_TEST: immutable replacement ledger missing'; END IF;
  ELSIF EXISTS (
    SELECT 1 FROM public.questions
    WHERE source_reference LIKE 'source-verified:task531:%'
      AND status<>'review'::public.content_status
  ) THEN
    RAISE EXCEPTION 'TASK531_TEST: clean fixture did not retain review state';
  END IF;

  RAISE NOTICE 'TASK531 PASS: two exact source-backed PM.MET Y2 items; atomic release state %',published_count;
END;
$task531_test$;

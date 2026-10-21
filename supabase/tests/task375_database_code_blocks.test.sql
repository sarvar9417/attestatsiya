-- TASK-375: 59 formatting-only code-block revisions preserve every answer.
BEGIN;

DO $task375_test$
DECLARE
  v_count integer;
  v_bad integer;
  v_python text;
  v_javascript text;
BEGIN
  SELECT count(*) INTO v_count
  FROM public.question_bank_revisions r
  JOIN public.questions source_q ON source_q.id=r.source_question_id
  JOIN public.questions revision_q ON revision_q.id=r.revision_question_id
  WHERE r.revision_kind='code_block_presentation_normalization'
    AND source_q.status='archived'::public.content_status
    AND revision_q.status='published'::public.content_status;
  IF v_count=0 THEN
    RAISE NOTICE 'TASK-375 complete release-shaped sources absent; SQL test skipped';
    RETURN;
  ELSIF v_count>59 THEN
    RAISE EXCEPTION 'TASK-375 expected at most 59 released revisions, found %',v_count;
  END IF;

  SELECT count(*) INTO v_bad
  FROM public.question_bank_revisions r
  JOIN public.questions source_q ON source_q.id=r.source_question_id
  JOIN public.questions revision_q ON revision_q.id=r.revision_question_id
  JOIN public.question_keys source_k ON source_k.question_id=source_q.id
  JOIN public.question_keys revision_k ON revision_k.question_id=revision_q.id
  WHERE r.revision_kind='code_block_presentation_normalization'
    AND (
      revision_q.format<>'Y1'::public.question_format
      OR position('```' in revision_q.stem_md)=0
      OR revision_q.stem_md !~ E'```[^\n]+\n[^\n]+\n'
      OR source_k.explanation_md IS DISTINCT FROM revision_k.explanation_md
      OR (source_k.payload-'correct_option_id')<>(revision_k.payload-'correct_option_id')
      OR (SELECT array_agg((o.side,o.order_idx,o.content_md) ORDER BY o.side,o.order_idx)
          FROM public.question_options o WHERE o.question_id=source_q.id)
         IS DISTINCT FROM
         (SELECT array_agg((o.side,o.order_idx,o.content_md) ORDER BY o.side,o.order_idx)
          FROM public.question_options o WHERE o.question_id=revision_q.id)
      OR (SELECT o.content_md FROM public.question_options o
          WHERE o.id::text=source_k.payload->>'correct_option_id')
         IS DISTINCT FROM
         (SELECT o.content_md FROM public.question_options o
          WHERE o.id::text=revision_k.payload->>'correct_option_id')
      OR NOT EXISTS (
        SELECT 1 FROM public.question_quality_published_revisions p
        WHERE p.question_id=revision_q.id
          AND p.content_fingerprint=public.professional_question_fingerprint(revision_q.id)
          AND p.release_scope LIKE 'TASK-375%'
      )
    );
  IF v_bad<>0 THEN
    RAISE EXCEPTION 'TASK-375 found % non-equivalent revisions',v_bad;
  END IF;

  IF (SELECT count(*)
      FROM public.question_bank_revisions r
      JOIN public.question_quality_findings f ON f.question_id=r.source_question_id
      WHERE r.revision_kind='code_block_presentation_normalization'
        AND f.resolved_at IS NULL) <>
     (SELECT count(*)
         FROM public.question_bank_revisions r
         JOIN public.question_quality_findings f ON f.question_id=r.revision_question_id
         WHERE r.revision_kind='code_block_presentation_normalization'
           AND f.resolved_at IS NULL)
     OR (v_count=59 AND (SELECT count(*) FROM public.question_bank_revisions r
         WHERE r.revision_kind='code_block_presentation_normalization'
           AND public.is_question_official_mock_eligible(r.revision_question_id))<>45) THEN
    RAISE EXCEPTION 'TASK-375 successor lost source quality blockers';
  END IF;

  SELECT revision_q.stem_md INTO v_python
  FROM public.question_bank_revisions r
  JOIN public.questions source_q ON source_q.id=r.source_question_id
  JOIN public.questions revision_q ON revision_q.id=r.revision_question_id
  WHERE source_q.source_reference='reserve-2026:T060-R3C-CODE-Q06';
  IF v_python IS NOT NULL AND (
     v_python NOT LIKE E'%```python\nfor i in range(3):\n    print(i, end=" ")\n```%'
     OR v_python LIKE '%`for i in range(3): print%') THEN
    RAISE EXCEPTION 'TASK-375 Python loop was not split into a readable block';
  END IF;

  SELECT revision_q.stem_md INTO v_javascript
  FROM public.question_bank_revisions r
  JOIN public.questions source_q ON source_q.id=r.source_question_id
  JOIN public.questions revision_q ON revision_q.id=r.revision_question_id
  WHERE source_q.source_reference='reserve-2026:T060-R3C-CODE-M14';
  IF v_javascript IS NOT NULL AND (
     v_javascript NOT LIKE E'%```javascript\nfor (let i = 0; i < a.length; i++)\n  sum += a[i];\n```%'
     OR v_javascript NOT LIKE '%`i<a.length`%'
     OR v_javascript LIKE '%`for(let i=0;i<a.length;i++)%') THEN
    RAISE EXCEPTION 'TASK-375 JavaScript loop/prompt formatting drift';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.questions q
    WHERE q.status='published'::public.content_status
      AND q.source_reference LIKE 'revision:TASK-375:code-block:%'
      AND position('```' in q.stem_md)=0
  ) THEN
    RAISE EXCEPTION 'TASK-375 published revision without a fenced block';
  END IF;
END
$task375_test$;

SELECT 'task375_database_code_blocks_ok' AS result;
ROLLBACK;

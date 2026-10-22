-- TASK-429 regression: semantic answer cues are caught before publication.
-- This test creates a temporary question inside a transaction and ROLLBACKs all data.
BEGIN;
DO $task429$
DECLARE
  source_row public.questions%rowtype;
  candidate uuid := gen_random_uuid();
  correct_option uuid := gen_random_uuid();
  error_message text;
BEGIN
  IF has_function_privilege('anon','public.pedagogy_semantic_quality_signals(uuid)','EXECUTE')
     OR has_function_privilege('authenticated','public.pedagogy_semantic_quality_signals(uuid)','EXECUTE')
     OR has_function_privilege('anon','public.guard_pedagogy_semantic_quality_publish()','EXECUTE')
     OR has_function_privilege('authenticated','public.guard_pedagogy_semantic_quality_publish()','EXECUTE')
  THEN RAISE EXCEPTION 'TASK429: private answer-key routines are exposed'; END IF;

  IF (SELECT count(*) FROM pg_trigger
      WHERE tgrelid='public.questions'::regclass
        AND tgname IN ('pedagogy_semantic_quality_publish_guard',
                       'pedagogy_semantic_review_findings') AND tgenabled='O')<>2
  THEN RAISE EXCEPTION 'TASK429: triggers missing or disabled'; END IF;

  SELECT * INTO source_row FROM public.questions
   WHERE status='published'::public.content_status AND format='Y1'::public.question_format
     AND group_code IN ('KS','PM.GEN','PM.MET')
   LIMIT 1;
  IF source_row.id IS NULL THEN
    RAISE NOTICE 'TASK429: database has no seeded published pedagogy sample; privilege and trigger assertions passed';
    RETURN;
  END IF;
  INSERT INTO public.questions(
      id,subject_id,construct_id,group_code,format,cognitive,difficulty,
      stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
  VALUES (
      candidate,source_row.subject_id,source_row.construct_id,source_row.group_code,
      'Y1',source_row.cognitive,source_row.difficulty,
      'Test savoli: qaysi pedagogik harakat maqsadga muvofiq?',
      source_row.assets,true,'draft',source_row.author_id,
      'test:task429:rollback',source_row.source_lesson_id);
  INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
  VALUES
      (correct_option,candidate,'a',0,'Natijani tekshirib, keyingi o‘qitish rejasini moslashtirish'),
      (gen_random_uuid(),candidate,'a',1,'Faqat o‘quvchilarning javob tezligini hisobga olish'),
      (gen_random_uuid(),candidate,'a',2,'Hech qanday tekshiruvsiz avvalgi reja bilan davom etish'),
      (gen_random_uuid(),candidate,'a',3,'Natijalarni sinf umumiy jadvalida muntazam qayd etish');
  INSERT INTO public.question_keys(question_id,payload,explanation_md)
  VALUES (candidate,jsonb_build_object('correct_option_id',correct_option::text),
          'Keyingi pedagogik qarorni tanlashda o‘quvchi natijalari va ehtiyojlari hisobga olinadi.');

  UPDATE public.questions SET status='review' WHERE id=candidate;
  IF NOT EXISTS (
      SELECT 1 FROM public.question_quality_findings
      WHERE question_id=candidate AND finding_code='distractor_absolute_pair'
        AND severity='high' AND resolved_at IS NULL
    ) THEN RAISE EXCEPTION 'TASK429: automatic editorial finding absent'; END IF;
  BEGIN
    UPDATE public.questions SET status='published' WHERE id=candidate;
    RAISE EXCEPTION 'TASK429: unsafe publication succeeded';
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS error_message=MESSAGE_TEXT;
    IF position('PEDAGOGY_SEMANTIC_CUE_REVIEW_REQUIRED' IN error_message)=0 THEN
      RAISE EXCEPTION 'TASK429: wrong publication rejection: %',error_message;
    END IF;
  END;
  IF NOT EXISTS (SELECT 1 FROM public.questions WHERE id=candidate AND status='review')
  THEN RAISE EXCEPTION 'TASK429: review question was not preserved'; END IF;
  RAISE NOTICE 'TASK429: PASS — review finding recorded and unsafe publication blocked';
END $task429$;
ROLLBACK;

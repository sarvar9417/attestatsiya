-- TASK-338 narrow owner-AI release does not replace the existing human editorial gate.
DO $test$
DECLARE n int; bad int;
BEGIN
 IF NOT EXISTS (
  SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
  WHERE n.nspname='public' AND c.relname='m10_owner_ai_release_waivers' AND c.relrowsecurity
 ) THEN RAISE EXCEPTION 'TASK-338: owner AI waiver ledger must have RLS'; END IF;
 IF has_table_privilege('anon','public.m10_owner_ai_release_waivers','SELECT')
    OR has_table_privilege('authenticated','public.m10_owner_ai_release_waivers','SELECT') THEN
   RAISE EXCEPTION 'TASK-338: user/anonymous roles must not see owner waiver ledger';
 END IF;
 IF NOT EXISTS (
  SELECT 1 FROM pg_trigger WHERE tgrelid='public.questions'::regclass
  AND tgname='trg_graphics_web_v2_publication' AND NOT tgisinternal
 ) THEN RAISE EXCEPTION 'TASK-338: GV2 independent editorial trigger missing'; END IF;
 SELECT count(*) INTO n FROM public.m10_owner_ai_release_waivers;
 IF n NOT IN (0,8) THEN RAISE EXCEPTION 'TASK-338: partial owner release %',n; END IF;
 SELECT count(*) INTO bad
 FROM public.m10_owner_ai_release_waivers w
 LEFT JOIN public.questions q ON q.id=w.question_id
 LEFT JOIN public.lessons l ON l.id=q.source_lesson_id
 LEFT JOIN public.profiles p ON p.id=w.owner_account_id
 WHERE w.reviewer_kind<>'ai' OR w.waiver_scope<>'TASK-338:M10-ED-8:OWNER-AI-20261020'
    OR q.status IS DISTINCT FROM 'published'::public.content_status
    OR l.status IS DISTINCT FROM 'published'::public.content_status
    OR q.source_lesson_id IS DISTINCT FROM 'a1000000-0000-4000-8000-000000000003'::uuid
    OR q.construct_id IS DISTINCT FROM '929f91b1-7828-489a-b3b4-b79105b4eddf'::uuid
    OR p.role IS DISTINCT FROM 'admin'
    OR w.item_fingerprint IS DISTINCT FROM public.professional_question_fingerprint(q.id);
 IF bad<>0 THEN RAISE EXCEPTION 'TASK-338: % bad published waiver/content records',bad; END IF;
 SELECT count(*) INTO bad FROM public.questions q
 WHERE q.status='published'::public.content_status AND q.group_code='S5.WEB'
 AND (q.source_reference LIKE 'GV2:%' OR q.source_reference LIKE 'Grafika va veb-texnologiyalar V2,%')
 AND NOT EXISTS (
   SELECT 1 FROM public.question_editorial_checks e WHERE e.question_id=q.id
    AND e.answer_verified AND e.reference_verified AND e.wording_verified
    AND e.original_authorship_verified
    AND e.content_fingerprint=public.professional_question_fingerprint(q.id)
 )
 AND NOT EXISTS (
   SELECT 1 FROM public.m10_owner_ai_release_waivers w
    WHERE w.question_id=q.id
      AND w.item_fingerprint=public.professional_question_fingerprint(q.id)
 );
 IF bad<>0 THEN RAISE EXCEPTION 'TASK-338: % unauthorized GV2 publication records',bad; END IF;
END $test$;

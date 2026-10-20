-- TASK-211: one-time owner-authorized AI release, never human signature.
DO $$
DECLARE n integer; q_id uuid; refused boolean:=false; r record;
BEGIN
 SELECT count(*) INTO n FROM public.questions
 WHERE source_reference LIKE 'MSACCESS-DEMO-STYLE-2026/%';
 IF n=0 THEN
   RAISE NOTICE 'TASK-211 clean CI database has no private review fixtures; staged release assertion skipped';
   RETURN;
 END IF;
 IF n<>8 THEN RAISE EXCEPTION 'TASK-211: wrong staged total %',n; END IF;
 IF (SELECT count(*) FROM public.questions q JOIN public.m09_owner_ai_release_waivers w ON w.question_id=q.id
  JOIN public.lessons l ON l.id=q.source_lesson_id
  WHERE q.status='published' AND l.status='published' AND w.reviewer_kind='ai'
    AND w.waiver_scope='TASK-211:DBS-Q01-Q08:OWNER-AI-20261020'
    AND w.item_fingerprint=public.m09_ai_release_fingerprint(q.id))<>8
 THEN RAISE EXCEPTION 'TASK-211: incomplete release/AI owner provenance or fingerprint mismatch'; END IF;
 IF (SELECT count(*) FROM public.question_editorial_checks ec
  JOIN public.m09_owner_ai_release_waivers w ON w.question_id=ec.question_id)<>0
 THEN RAISE EXCEPTION 'TASK-211: owner AI release must not impersonate independent human editorial signoff'; END IF;
 IF (SELECT count(*) FROM public.questions q
  WHERE q.status='review' AND
  (q.source_reference LIKE 'MSACCESS-V2/%' OR q.source_reference LIKE 'MSACCESS-V2-NATIVE/%'))<>288
 THEN RAISE EXCEPTION 'TASK-211: remaining 288 questions were modified unexpectedly'; END IF;
 IF (SELECT count(*) FROM public.questions q JOIN public.m09_owner_ai_release_waivers w ON w.question_id=q.id
  JOIN public.question_keys k ON k.question_id=q.id WHERE q.format='Y1'
  AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
  AND EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=q.id
     AND o.id::text=k.payload->>'correct_option_id'))<>8
 THEN RAISE EXCEPTION 'TASK-211: Y1 question format and correct option invalid'; END IF;
 SELECT question_id INTO q_id FROM public.m09_owner_ai_release_waivers ORDER BY question_id LIMIT 1;
 BEGIN
   UPDATE public.questions SET stem_md=stem_md||' UNSAFE MUTATION' WHERE id=q_id;
   RAISE EXCEPTION 'TASK-211 published immutability guard failed';
 EXCEPTION WHEN check_violation THEN refused:=true;
 END;
 IF NOT refused THEN RAISE EXCEPTION 'TASK-211 immutable question not blocked'; END IF;
 IF (SELECT relrowsecurity FROM pg_class WHERE oid='public.m09_owner_ai_release_waivers'::regclass) IS DISTINCT FROM TRUE
 THEN RAISE EXCEPTION 'TASK-211 release ledger RLS must be enabled'; END IF;
 RAISE NOTICE 'TASK-211 8/8 AI-owner released, other 288 review, immutable, RLS and genuine reviewer provenance protected';
END $$;

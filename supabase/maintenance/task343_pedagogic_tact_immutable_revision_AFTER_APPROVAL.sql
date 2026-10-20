-- TASK-343: one explicitly authored educational explanation for the user's example.
-- Privileged OPERATOR script. Run against a copy / ROLLBACK dry-run first.
-- Only after owner authorization for this production content correction.
-- Does not change the original published row, its key or the historical exam snapshots.
-- Uses existing owner-approved pedagogy revision gate, not human-review impersonation.
BEGIN;
SET LOCAL lock_timeout='15s';
SET LOCAL statement_timeout='90s';

DO $task343$
DECLARE
  v_source uuid := '55e95e8e-57d2-4f9d-afd4-b4ebd3bf904c';
  v_actor uuid;
  v_new uuid;
  v_count int;
  v_explanation text := 'Pedagogik takt — o‘qituvchining har bir o‘quvchiga hurmat bilan, vaziyatga mos va pedagogik odob doirasida munosabat bildirish mahoratidir. Xato qilgan o‘quvchini kamsitmasdan, uning sha’nini asragan holda xatosini muloyim va konstruktiv tarzda tuzatish aynan shu sifatni ko‘rsatadi. Emotsional holatni tiklash psixologik qo‘llab-quvvatlashga, noodatiy usullar metodik mahoratga, mimika va imo-ishoralar esa pedagogik texnikaga ko‘proq taalluqlidir.';
BEGIN
  SELECT count(*) INTO v_count FROM public.profiles
    WHERE role='admin' AND NOT coalesce(is_blocked,false);
  IF v_count<>1 THEN RAISE EXCEPTION 'TASK343_ACTIVE_ADMIN_COUNT_%',v_count; END IF;
  SELECT id INTO STRICT v_actor FROM public.profiles
    WHERE role='admin' AND NOT coalesce(is_blocked,false);

  SELECT count(*) INTO v_count
  FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.id=v_source AND q.source_reference='telegram:@PedMahoratGuli:14305'
    AND q.status='published' AND q.format='Y1' AND q.group_code='PM.GEN'
    AND public.question_explanation_is_source_only(k.explanation_md)
    AND NOT EXISTS (SELECT 1 FROM public.pedagogy_revision_queue r WHERE r.source_question_id=q.id);
  IF v_count<>1 THEN RAISE EXCEPTION 'TASK343_SOURCE_DRIFT_OR_ALREADY_REVISED'; END IF;

  INSERT INTO public.pedagogy_revision_queue(source_question_id,reason)
    VALUES (v_source,'TASK-343: replace source-only answer justification with an educational explanation');
  v_new := public.stage_pedagogy_revision(v_source,v_actor);
  UPDATE public.question_keys
    SET explanation_md=v_explanation,updated_at=now()
    WHERE question_id=v_new;
  GET DIAGNOSTICS v_count=ROW_COUNT;
  IF v_count<>1 THEN RAISE EXCEPTION 'TASK343_NEW_KEY_MISSING'; END IF;

  -- Existing compatible owner waiver is an explicit owner release, NOT independent human sign-off.
  INSERT INTO public.pedagogy_owner_release_waivers(
    question_id,authorized_by,content_fingerprint,authority,provenance,source_question_id
  ) VALUES (
    v_new,v_actor,public.professional_question_fingerprint(v_new),
    'owner_explicit_no_external_expert_20261018',
    'TASK-343, owner instruction 2026-10-20: educational rationale replaces a Telegram checkmark. AI-authored didactic correction; no external human review claimed.',
    v_source
  );

  PERFORM public.publish_pedagogy_revision(v_new,v_actor);
  IF NOT EXISTS(
    SELECT 1 FROM public.questions n
    JOIN public.question_keys k ON k.question_id=n.id
    WHERE n.id=v_new AND n.status='published'
      AND k.explanation_md=v_explanation
  ) OR NOT EXISTS(
    SELECT 1 FROM public.questions old WHERE old.id=v_source AND old.status='archived'
  ) THEN RAISE EXCEPTION 'TASK343_REVISION_SWAP_NOT_VERIFIED'; END IF;
END $task343$;
COMMIT;

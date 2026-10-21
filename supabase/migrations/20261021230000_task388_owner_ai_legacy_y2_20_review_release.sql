-- TASK-388: 2026-10-21 owner-delegated AI editorial review for exact
-- historical Y2 native-side repairs only. This is explicitly NOT human signoff.
-- Preserve verified per-question fingerprints and all historical attempts.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='120s';

-- New authority is limited to already staged legacy_y2_native_sides revisions.
ALTER TABLE public.pedagogy_owner_release_waivers
 DROP CONSTRAINT pedagogy_owner_release_waivers_authority_check;
ALTER TABLE public.pedagogy_owner_release_waivers
 ADD CONSTRAINT pedagogy_owner_release_waivers_authority_check
 CHECK (authority IN ('owner_explicit_no_external_expert_20261018',
                     'owner_delegated_ai_y2_20261021'));

DO $policy$
DECLARE
  old_func text;
  new_func text;
  needle text := 'w.authority=''owner_explicit_no_external_expert_20261018''';
  replacement text := '(w.authority=''owner_explicit_no_external_expert_20261018'' OR
       (w.authority=''owner_delegated_ai_y2_20261021'' AND
        EXISTS (
          SELECT 1 FROM public.question_bank_revisions br
          WHERE br.revision_question_id=w.question_id
            AND br.revision_kind=''legacy_y2_native_sides''
        )))';
BEGIN
 SELECT pg_get_functiondef('public.guard_pedguli_question_publish()'::regprocedure)
 INTO old_func;
 IF position(needle IN old_func)=0
    OR position('owner_delegated_ai_y2_20261021' IN old_func)>0
 THEN RAISE EXCEPTION 'TASK-388 publication-guard source drift'; END IF;
 new_func:=replace(old_func,needle,replacement);
 EXECUTE new_func;
END
$policy$;

DO $release$
DECLARE
  v_count int;
  v_bad int;
  v_owner uuid;
BEGIN
 CREATE TEMP TABLE task388_batch ON COMMIT DROP AS
 SELECT oldq.id old_id, rev.id new_id, oldq.source_reference original_ref,
        oldq.group_code, oldq.subject_id
 FROM public.question_quality_findings f
 JOIN public.questions oldq ON oldq.id=f.question_id
 JOIN public.questions rev ON rev.id=(f.details->>'replacement_question_id')::uuid
 JOIN public.question_bank_revisions link
   ON link.source_question_id=oldq.id
  AND link.revision_question_id=rev.id
  AND link.revision_kind='legacy_y2_native_sides'
 WHERE f.finding_code='legacy_y2_all_options_side_a'
   AND f.resolved_at IS NULL
   AND oldq.status='published'::public.content_status;

 SELECT count(*) INTO v_count FROM task388_batch;
 IF v_count<>20 OR (SELECT count(distinct old_id) FROM task388_batch)<>20
     OR (SELECT count(distinct new_id) FROM task388_batch)<>20
 THEN RAISE EXCEPTION 'TASK-388 expected 20 distinct legacy Y2 revisions, got %',v_count; END IF;

 SELECT count(*) INTO v_bad
 FROM task388_batch batch
 JOIN public.questions src ON src.id=batch.old_id
 JOIN public.questions r ON r.id=batch.new_id
 JOIN public.question_keys sk ON sk.question_id=src.id
 JOIN public.question_keys rk ON rk.question_id=r.id
 WHERE src.format<>'Y2'::public.question_format
   OR r.format<>'Y2'::public.question_format
   OR r.status<>'review'::public.content_status
   OR src.status<>'published'::public.content_status
   OR src.group_code IS DISTINCT FROM r.group_code
   OR src.subject_id IS DISTINCT FROM r.subject_id
   OR src.construct_id IS DISTINCT FROM r.construct_id
   OR src.source_lesson_id IS DISTINCT FROM r.source_lesson_id
   OR sk.explanation_md IS DISTINCT FROM rk.explanation_md
   OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=src.id AND o.side='a')<>8
   OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=src.id AND o.side='b')<>0
   OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=r.id AND o.side='a')<>4
   OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=r.id AND o.side='b')<>4
   OR jsonb_typeof(rk.payload->'pairs')<>'object'
   OR (SELECT count(*) FROM jsonb_each_text(rk.payload->'pairs'))<>4
   OR (SELECT count(distinct kv.value) FROM jsonb_each_text(rk.payload->'pairs') kv)<>4
   OR EXISTS(
     SELECT 1 FROM jsonb_each_text(rk.payload->'pairs') kv WHERE
      NOT EXISTS(SELECT 1 FROM public.question_options a
                 WHERE a.question_id=r.id AND a.side='a' AND a.id::text=kv.key)
      OR NOT EXISTS(SELECT 1 FROM public.question_options b
                 WHERE b.question_id=r.id AND b.side='b' AND b.id::text=kv.value)
   )
   OR EXISTS(
      SELECT 1 FROM jsonb_each_text(sk.payload->'pairs') oldpair
      JOIN public.question_options oa ON oa.id::text=oldpair.key AND oa.question_id=src.id
      JOIN public.question_options ob ON ob.id::text=oldpair.value AND ob.question_id=src.id
      WHERE NOT EXISTS(
       SELECT 1 FROM jsonb_each_text(rk.payload->'pairs') newpair
       JOIN public.question_options na ON na.id::text=newpair.key AND na.question_id=r.id
       JOIN public.question_options nb ON nb.id::text=newpair.value AND nb.question_id=r.id
       WHERE na.content_md=oa.content_md AND nb.content_md=ob.content_md
      )
   );
 IF v_bad<>0 THEN RAISE EXCEPTION 'TASK-388 source/key/semantics mismatch count=%',v_bad; END IF;

 UPDATE public.questions q
 SET stem_md='Algoritmlashga oid tushunchalarni ularning ta’riflari bilan moslashtiring.',
     updated_at=now()
 FROM task388_batch b
 WHERE q.id=b.new_id AND b.original_ref='formatbank-2026:T063-Y2-011'
   AND q.status='review'::public.content_status
   AND q.stem_md='Algoritmik tuzilmalarni mos tavsif bilan juftlang.';
 IF NOT FOUND THEN RAISE EXCEPTION 'TASK-388 original review wording changed'; END IF;

 SELECT id INTO v_owner FROM public.profiles
 WHERE role='admin' AND coalesce(is_blocked,false)=false;
 IF v_owner IS NULL OR
    (SELECT count(*) FROM public.profiles WHERE role='admin' AND coalesce(is_blocked,false)=false)<>1
 THEN RAISE EXCEPTION 'TASK-388 owner account not unambiguous'; END IF;

 INSERT INTO public.pedagogy_owner_release_waivers
   (question_id,authorized_by,content_fingerprint,authority,provenance,source_question_id)
 SELECT b.new_id,v_owner,public.professional_question_fingerprint(b.new_id),
     'owner_delegated_ai_y2_20261021',
     'Owner 2026-10-21 explicitly delegated question review to AI without further external expert confirmation. Four a/b option pairs and original key semantics reviewed. NO independent human expert certification.',
     b.old_id
 FROM task388_batch b
 WHERE b.group_code IN ('KS','PM.GEN','PM.MET');
 GET DIAGNOSTICS v_count=ROW_COUNT;
 IF v_count<>2 THEN RAISE EXCEPTION 'TASK-388 expected 2 honest owner-delegated AI waiver records, got %',v_count; END IF;

 UPDATE public.questions q
 SET status='published'::public.content_status,updated_at=now()
 FROM task388_batch b WHERE q.id=b.new_id AND q.status='review'::public.content_status;
 GET DIAGNOSTICS v_count=ROW_COUNT;
 IF v_count<>20 THEN RAISE EXCEPTION 'TASK-388 replacement published only %/20',v_count; END IF;

 UPDATE public.questions q
 SET status='archived'::public.content_status,updated_at=now()
 FROM task388_batch b WHERE q.id=b.old_id AND q.status='published'::public.content_status;
 GET DIAGNOSTICS v_count=ROW_COUNT;
 IF v_count<>20 THEN RAISE EXCEPTION 'TASK-388 old question archived %/20',v_count; END IF;

 UPDATE public.question_quality_published_revisions stamp
 SET release_scope='TASK-388 explicit owner delegated AI review; 80 verified semantic Y2 pairings; no independent human endorsement'
 FROM task388_batch b WHERE stamp.question_id=b.new_id;

 UPDATE public.question_quality_findings f
 SET resolved_at=now(),details=f.details||jsonb_build_object(
   'task','TASK-388','replacement_question_id',b.new_id,
   'semantic_pairs_reviewed_by_ai',4,'external_expert_review',false)
 FROM task388_batch b WHERE f.question_id=b.old_id
   AND f.finding_code IN ('legacy_y2_all_options_side_a','invalid_matching_option_sides');

 SELECT count(*) INTO v_bad FROM task388_batch b
 JOIN public.questions oldq ON oldq.id=b.old_id
 JOIN public.questions newq ON newq.id=b.new_id
 LEFT JOIN public.question_quality_published_revisions snap ON snap.question_id=newq.id
 WHERE oldq.status<>'archived'::public.content_status
 OR newq.status<>'published'::public.content_status
 OR snap.content_fingerprint IS DISTINCT FROM public.professional_question_fingerprint(newq.id)
 OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=newq.id AND o.side='a')<>4
 OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=newq.id AND o.side='b')<>4;
 IF v_bad<>0 THEN RAISE EXCEPTION 'TASK-388 postflight integrity failures %',v_bad; END IF;

 IF EXISTS(
  SELECT 1 FROM public.question_quality_findings f JOIN public.questions q ON q.id=f.question_id
  WHERE f.finding_code='legacy_y2_all_options_side_a'
    AND f.resolved_at IS NULL AND q.status='published'::public.content_status
 ) THEN RAISE EXCEPTION 'TASK-388 invalid published Y2 remains'; END IF;
END
$release$;
COMMIT;
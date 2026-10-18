-- TASK-212 · one-time, explicitly OWNER-AUTHORIZED PEDAGOGY RELEASE.
--
-- Basis: owner in the conversation, 2026-10-18:
-- "ekpert tekshiruvi kerka emas qo'shib chiqarvoraver.
-- Testlarda haliyan tog'ri javob eng uzuni bo'lganlari juda ko'p ..."
-- This is not independent professional expert signoff, never represent as such.
-- Caller: privileged migration/operator only. DO NOT run until the separate
-- 25-option repair above has passed and been committed or concatenated ahead.
-- Use a full ROLLBACK dry-run before final COMMIT. Previous attempts stay intact.
-- This script: 26 M14 review --> published; 118 published legacy Y1 -->
-- archived after atomic release of 118 new balanced Y1 revisions (new UUID).
--
BEGIN;
SET LOCAL lock_timeout = '25s';
SET LOCAL statement_timeout = '180s';

DO $baseline$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
 IF n<>1 THEN RAISE EXCEPTION 'TASK212_ABORT_AMBIGUOUS_ACTIVE_OWNER_ADMIN_%',n; END IF;
 SELECT count(*) INTO n FROM public.questions WHERE group_code='KS' AND status='review'
  AND source_reference LIKE 'authored:ai-assisted:m14-closed-20261018:kasb-standarti:%';
 IF n<>26 THEN RAISE EXCEPTION 'TASK212_ABORT_EXPECTED_26_KS_REVIEW_GOT_%',n; END IF;
 SELECT count(*) INTO n FROM public.pedagogy_revision_queue r
  JOIN public.questions q ON q.id=r.source_question_id
  JOIN public.pedagogy_rewrite_proposals p ON p.source_question_id=q.id
  WHERE r.revision_question_id IS NULL AND q.status='published'
   AND q.format='Y1' AND p.proposal_status='draft'
   AND q.group_code IN ('KS','PM.GEN','PM.MET');
 IF n<>118 THEN RAISE EXCEPTION 'TASK212_ABORT_EXPECTED_118_REVISION_DRAFTS_GOT_%',n; END IF;
END $baseline$;

CREATE TABLE IF NOT EXISTS public.pedagogy_owner_release_waivers (
 question_id uuid PRIMARY KEY REFERENCES public.questions(id) ON DELETE RESTRICT,
 authorized_by uuid NOT NULL REFERENCES public.profiles(id),
 content_fingerprint text NOT NULL,
 authority text NOT NULL CHECK(authority='owner_explicit_no_external_expert_20261018'),
 provenance text NOT NULL DEFAULT 'AI-assisted; original answer preserved for revisions; independent expert not performed',
 source_question_id uuid REFERENCES public.questions(id) ON DELETE RESTRICT,
 authorized_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT task212_waiver_not_same CHECK (source_question_id IS NULL OR question_id<>source_question_id)
);
ALTER TABLE public.pedagogy_owner_release_waivers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.pedagogy_owner_release_waivers FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT ON public.pedagogy_owner_release_waivers TO service_role;

-- Tailored alternative to old editor checklist, preserving all structural,
-- taxonomy, length, snapshot, transactional and server-side scoring gates.
-- Fail-closed if active function source does not match audited SHA patterns.
DO $patch_publish_guard$
DECLARE src text; oldtext text; newtext text; n int;
BEGIN
 SELECT pg_get_functiondef('public.guard_pedguli_question_publish()'::regprocedure) INTO src;
 oldtext := E' if not exists (\n   select 1 from public.question_editorial_checks e where e.question_id=new.id\n   and e.answer_verified and e.reference_verified and e.wording_verified\n   and e.original_authorship_verified\n   and length(trim(e.reviewer_notes))>=20\n   and e.content_fingerprint=public.professional_question_fingerprint(new.id)\n ) then';
 newtext := E' if not exists (\n   select 1 from public.question_editorial_checks e where e.question_id=new.id\n   and e.answer_verified and e.reference_verified and e.wording_verified\n   and e.original_authorship_verified\n   and length(trim(e.reviewer_notes))>=20\n   and e.content_fingerprint=public.professional_question_fingerprint(new.id)\n ) and not exists (\n   select 1 from public.pedagogy_owner_release_waivers w\n   join public.profiles p on p.id=w.authorized_by\n   where w.question_id=new.id\n     and w.authority=''owner_explicit_no_external_expert_20261018''\n     and p.role=''admin'' and coalesce(p.is_blocked,false)=false\n     and w.content_fingerprint=public.professional_question_fingerprint(new.id)\n ) then';
 IF strpos(src,oldtext)=0 OR strpos(src,newtext)<>0 THEN
   RAISE EXCEPTION 'TASK212_ABORT_PUBLISH_GUARD_DRIFT';
 END IF;
 EXECUTE replace(src,oldtext,newtext);
END $patch_publish_guard$;

-- Keep atomic archiving but allow owner-authorized replacement created by
-- the SAME admin. This prevents lying that an independent reviewer signed.
DO $patch_revision_publish$
DECLARE src text; oldtext text; newtext text;
BEGIN
 SELECT pg_get_functiondef('public.publish_pedagogy_revision(uuid,uuid)'::regprocedure) INTO src;
 oldtext := '    or v_author is null or v_author=p_actor_id then';
 newtext := E'    or ((v_author is null or v_author=p_actor_id)\n      and not exists (\n       select 1 from public.pedagogy_owner_release_waivers w\n       where w.question_id=p_revision_question_id\n         and w.authorized_by=p_actor_id\n         and w.authority=''owner_explicit_no_external_expert_20261018''\n         and w.content_fingerprint=public.professional_question_fingerprint(p_revision_question_id)\n      )) then';
 IF strpos(src,oldtext)=0 OR strpos(src,newtext)<>0 THEN
   RAISE EXCEPTION 'TASK212_ABORT_REVISION_GATE_DRIFT';
 END IF;
 EXECUTE replace(src,oldtext,newtext);
END $patch_revision_publish$;

-- Final mechanical safeguards apply AFTER revision staging and never use
-- correctly-marked option length as evidence that a distractor is semantically
-- valid. Provenance marks owner waiver, not an expert signature.
DO $owner_release$
DECLARE actor uuid; q record; candidate uuid; n int; bad int;
BEGIN
 SELECT id INTO STRICT actor FROM public.profiles
  WHERE role='admin' AND NOT coalesce(is_blocked,false);

 -- stage 118 immutable-revision replacements, source correct text retained.
 FOR q IN
   SELECT r.source_question_id
   FROM public.pedagogy_revision_queue r
   JOIN public.questions p ON p.id=r.source_question_id
   WHERE r.revision_question_id IS NULL AND p.status='published'
   ORDER BY r.source_question_id
 LOOP
   candidate := public.stage_pedagogy_revision(q.source_question_id,actor);
   INSERT INTO public.pedagogy_owner_release_waivers(
      question_id,authorized_by,content_fingerprint,authority,provenance,source_question_id
   ) VALUES(candidate,actor,public.professional_question_fingerprint(candidate),
      'owner_explicit_no_external_expert_20261018',
      'Owner 2026-10-18 authorized AI-assisted distractor correction without separate expert; marked correct-answer text copied unchanged; editor review not falsely signed.',
      q.source_question_id);
 END LOOP;
 SELECT count(*) INTO n FROM public.pedagogy_owner_release_waivers
  WHERE source_question_id IS NOT NULL
    AND authority='owner_explicit_no_external_expert_20261018';
 IF n<>118 THEN RAISE EXCEPTION 'TASK212_ABORT_STAGED_REVISION_COUNT_%',n; END IF;

 -- Sign actual owner authorization for 26 sourced REVIEW questions; avoids
 -- using the independent four-boolean editorial table.
 INSERT INTO public.pedagogy_owner_release_waivers (
    question_id,authorized_by,content_fingerprint,authority,provenance
 )
 SELECT q.id,actor,public.professional_question_fingerprint(q.id),
   'owner_explicit_no_external_expert_20261018',
   'Owner 2026-10-18 waived separate external expert; AI-assisted KS exercise based on 13-page secondary methodology PDF, source-key not certified official.'
 FROM public.questions q
 WHERE q.group_code='KS' AND q.status='review'
   AND q.source_reference LIKE 'authored:ai-assisted:m14-closed-20261018:kasb-standarti:%';
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>26 THEN RAISE EXCEPTION 'TASK212_ABORT_OWNER_AUTH_KS_COUNT_%',n; END IF;

 -- Every new item has an immutable answer key, correct construct source,
 -- exact 4 distinct answers, balanced word counts, no option collisions.
 WITH m AS (
   SELECT w.question_id,q.format,
     count(o.id) n,
     count(DISTINCT lower(btrim(o.content_md))) nd,
     min(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) minw,
     max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) maxw,
     max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
       FILTER (WHERE o.id::text=k.payload->>'correct_option_id') cw,
     max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
       FILTER (WHERE o.id::text<>k.payload->>'correct_option_id') maxwrong
   FROM public.pedagogy_owner_release_waivers w
   JOIN public.questions q ON q.id=w.question_id
   JOIN public.question_keys k ON k.question_id=q.id
   JOIN public.question_options o ON o.question_id=q.id AND trim(o.side)='a'
   WHERE w.authority='owner_explicit_no_external_expert_20261018'
   GROUP BY w.question_id,q.format
 ) SELECT count(*) INTO bad FROM m
   WHERE format<>'Y1' OR n<>4 OR nd<>4 OR minw<1
      OR maxw>minw*1.8 OR cw>maxwrong*1.25;
 IF bad<>0 THEN RAISE EXCEPTION 'TASK212_ABORT_PREPARED_ITEM_QUALITY_%',bad; END IF;

 -- Publish 26 active M14 lessons, preserving option UUID and answer key.
 UPDATE public.questions q SET status='published',updated_at=now()
 WHERE q.group_code='KS' AND q.status='review'
   AND q.source_reference LIKE 'authored:ai-assisted:m14-closed-20261018:kasb-standarti:%'
   AND EXISTS(SELECT 1 FROM public.pedagogy_owner_release_waivers w
     WHERE w.question_id=q.id AND w.content_fingerprint=public.professional_question_fingerprint(q.id));
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>26 THEN RAISE EXCEPTION 'TASK212_ABORT_PUBLISH_KS_COUNT_%',n; END IF;

 -- Atomic published-new / archived-old revision swap.
 FOR q IN
   SELECT w.question_id,w.source_question_id
   FROM public.pedagogy_owner_release_waivers w
   WHERE w.source_question_id IS NOT NULL AND w.authority='owner_explicit_no_external_expert_20261018'
   ORDER BY w.source_question_id
 LOOP
   PERFORM public.publish_pedagogy_revision(q.question_id,actor);
 END LOOP;

 -- Check exact scope, original snapshots remain in history, and no
 -- correct-answer-length cues at the published Y1 threshold.
 SELECT count(*) INTO n FROM public.pedagogy_owner_release_waivers w
 JOIN public.questions q ON q.id=w.question_id
 WHERE w.authority='owner_explicit_no_external_expert_20261018'
   AND q.status='published';
 IF n<>144 THEN RAISE EXCEPTION 'TASK212_ABORT_PUBLISHED_TOTAL_%',n; END IF;

 SELECT count(*) INTO n FROM public.pedagogy_owner_release_waivers w
 JOIN public.questions old ON old.id=w.source_question_id
 WHERE w.source_question_id IS NOT NULL AND old.status='archived';
 IF n<>118 THEN RAISE EXCEPTION 'TASK212_ABORT_ARCHIVED_OLD_TOTAL_%',n; END IF;

 WITH words AS (
  SELECT q.id,
    max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
      FILTER (WHERE o.id::text=k.payload->>'correct_option_id') AS cw,
    max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
      FILTER (WHERE o.id::text<>k.payload->>'correct_option_id') AS mw
  FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
  JOIN public.question_options o ON o.question_id=q.id AND trim(o.side)='a'
  WHERE q.status='published' AND q.group_code IN ('KS','PM.GEN','PM.MET')
    AND q.format='Y1' GROUP BY q.id
 ) SELECT count(*) INTO n FROM words WHERE cw>mw*1.3;
 IF n<>0 THEN RAISE EXCEPTION 'TASK212_ABORT_REMAINING_PUBLISHED_LENGTH_BIAS_%',n; END IF;

 SELECT count(*) INTO n FROM public.modules m JOIN public.lessons l ON l.module_id=m.id
 WHERE m.code='M14' AND l.status='published' AND l.order_idx BETWEEN 1 AND 7
 AND (SELECT count(*) FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
      WHERE q.source_lesson_id=l.id AND q.status='published') >= l.topic_test_question_count;
 IF n<>7 THEN RAISE EXCEPTION 'TASK212_ABORT_M14_20_QUESTION_TOPIC_COUNT_%',n; END IF;
END $owner_release$;

COMMIT;

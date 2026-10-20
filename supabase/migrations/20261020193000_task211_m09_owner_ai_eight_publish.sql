-- TASK-211. Owner-EXPLICIT AI-reviewed M09 one-off publication, not human signoff.
-- Scope is EXACTLY DBS-Q01..Q08. No private questions/answers are committed.
-- No global relaxation of editorial gates. Source evidence: TASK-208/209/210.
BEGIN;
SET LOCAL lock_timeout = '12s';
SET LOCAL statement_timeout = '180s';

CREATE TABLE IF NOT EXISTS public.m09_owner_ai_release_waivers (
 question_id uuid PRIMARY KEY REFERENCES public.questions(id) ON DELETE RESTRICT,
 owner_account_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
 original_source_lesson_id uuid NOT NULL REFERENCES public.lessons(id),
 item_fingerprint text NOT NULL CHECK (length(item_fingerprint)=64),
 waiver_scope text NOT NULL CHECK (waiver_scope='TASK-211:DBS-Q01-Q08:OWNER-AI-20261020'),
 reviewer_kind text NOT NULL DEFAULT 'ai' CHECK (reviewer_kind='ai'),
 source_evidence text NOT NULL CHECK (length(source_evidence)>=45),
 owner_instruction text NOT NULL CHECK (length(owner_instruction)>=40),
 created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.m09_owner_ai_release_waivers IS
 'Owner-authorized one-time AI-only publishing provenance; DOES NOT certify independent human expert review.';
ALTER TABLE public.m09_owner_ai_release_waivers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.m09_owner_ai_release_waivers FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON public.m09_owner_ai_release_waivers TO service_role;

CREATE OR REPLACE FUNCTION public.m09_ai_release_fingerprint(p_question_id uuid)
RETURNS text LANGUAGE sql STABLE SET search_path=public AS $fingerprint$
 SELECT encode(extensions.digest(
 jsonb_build_object(
  'question_id',q.id,'stem',q.stem_md,'format',q.format,'cognitive',q.cognitive,
  'difficulty',q.difficulty,'construct',q.construct_id,'source_lesson',q.source_lesson_id,
  'group',q.group_code,'source',q.source_reference,'assets',q.assets,
  'options',COALESCE((SELECT jsonb_agg(jsonb_build_object('id',o.id,'side',o.side,'idx',o.order_idx,'text',o.content_md)
              ORDER BY o.side,o.order_idx) FROM public.question_options o WHERE o.question_id=q.id),'[]'::jsonb),
  'answer_key',k.payload,'explanation',k.explanation_md
 )::text, 'sha256'), 'hex')
 FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.id=p_question_id;
$fingerprint$;
REVOKE ALL ON FUNCTION public.m09_ai_release_fingerprint(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.m09_ai_release_fingerprint(uuid) TO service_role;

-- The FIRST published transition is still guarded by all existing answer, source and key checks.
-- This is not a fake question_editorial_checks record and affects only eight exact IDs.
CREATE OR REPLACE FUNCTION public.guard_m09_demo_style_publish()
RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $guard$
DECLARE option_total int; unique_total int; correct_id uuid;
BEGIN
 IF NEW.status IS DISTINCT FROM 'published'::public.content_status OR
    COALESCE(NEW.source_reference,'') NOT LIKE 'MSACCESS-DEMO-STYLE-2026/%' THEN
   RETURN NEW;
 END IF;
 IF NEW.format<>'Y1'::public.question_format OR NEW.source_lesson_id IS NULL OR
    NEW.construct_id IS NULL THEN
   RAISE EXCEPTION 'TASK-211: source, construct and Y1 format required' USING ERRCODE='23514';
 END IF;
 SELECT count(*),count(DISTINCT lower(trim(content_md)))
 INTO option_total,unique_total FROM public.question_options WHERE question_id=NEW.id AND side='a';
 SELECT (payload->>'correct_option_id')::uuid INTO correct_id
 FROM public.question_keys WHERE question_id=NEW.id;
 IF option_total<>4 OR unique_total<>4 OR correct_id IS NULL OR NOT EXISTS (
   SELECT 1 FROM public.question_options o WHERE o.question_id=NEW.id AND o.side='a' AND o.id=correct_id
 ) THEN
   RAISE EXCEPTION 'TASK-211: invalid Y1 four unique options or answer key' USING ERRCODE='23514';
 END IF;
 IF NOT EXISTS (
   SELECT 1 FROM public.lesson_constructs lc JOIN public.lessons l ON l.id=lc.lesson_id
   JOIN public.constructs c ON c.id=lc.construct_id
   WHERE l.id=NEW.source_lesson_id AND l.status='published'
     AND lc.construct_id=NEW.construct_id AND c.is_active AND c.group_code=NEW.group_code
 ) THEN
   RAISE EXCEPTION 'TASK-211: question must belong to published mapped source lesson' USING ERRCODE='23514';
 END IF;
 IF NOT EXISTS (
   SELECT 1 FROM public.question_editorial_checks ec
   WHERE ec.question_id=NEW.id AND ec.answer_verified AND ec.reference_verified
    AND ec.wording_verified AND ec.original_authorship_verified
    AND length(trim(ec.reviewer_notes))>=20
 ) AND NOT (
   split_part(NEW.source_reference,' | ',1) ~ '^MSACCESS-DEMO-STYLE-2026/DBS-Q0[1-8]$'
   AND EXISTS (
    SELECT 1 FROM public.m09_owner_ai_release_waivers w
    JOIN public.profiles p ON p.id=w.owner_account_id
    WHERE w.question_id=NEW.id
      AND w.waiver_scope='TASK-211:DBS-Q01-Q08:OWNER-AI-20261020'
      AND w.reviewer_kind='ai'
      AND p.role='admin' AND NOT COALESCE(p.is_blocked,false)
      AND w.item_fingerprint=public.m09_ai_release_fingerprint(NEW.id)
   )
 ) THEN
   RAISE EXCEPTION 'TASK-211: independent human review OR exact owner AI waiver required'
     USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END $guard$;

-- Independent immutable lock for newly released AI-tagged rows, options and keys.
CREATE OR REPLACE FUNCTION public.guard_m09_ai_published_immutable()
RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $immutable$
DECLARE v_id uuid;
BEGIN
 IF TG_TABLE_NAME='questions' THEN
   IF TG_OP='DELETE' THEN
     IF OLD.status='published' AND EXISTS
       (SELECT 1 FROM public.m09_owner_ai_release_waivers w WHERE w.question_id=OLD.id)
     THEN RAISE EXCEPTION 'TASK-211: published AI-reviewed question is immutable' USING ERRCODE='23514'; END IF;
     RETURN OLD;
   END IF;
   IF OLD.status='published' AND EXISTS
      (SELECT 1 FROM public.m09_owner_ai_release_waivers w WHERE w.question_id=OLD.id)
   THEN
     IF NEW.status IN ('published'::public.content_status,'archived'::public.content_status)
       AND (to_jsonb(NEW)-'status'-'updated_at')=(to_jsonb(OLD)-'status'-'updated_at')
     THEN RETURN NEW; END IF;
     RAISE EXCEPTION 'TASK-211: new revision required to change published question' USING ERRCODE='23514';
   END IF;
   RETURN NEW;
 END IF;
 v_id:=CASE WHEN TG_OP='DELETE' THEN OLD.question_id ELSE NEW.question_id END;
 IF EXISTS (
    SELECT 1 FROM public.questions q JOIN public.m09_owner_ai_release_waivers w ON w.question_id=q.id
    WHERE q.id=v_id AND q.status='published'
 ) THEN RAISE EXCEPTION 'TASK-211: published question option/key is immutable' USING ERRCODE='23514'; END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END $immutable$;
DROP TRIGGER IF EXISTS trg_m09_ai_published_question_immutable ON public.questions;
CREATE TRIGGER trg_m09_ai_published_question_immutable
BEFORE UPDATE OR DELETE ON public.questions FOR EACH ROW
EXECUTE FUNCTION public.guard_m09_ai_published_immutable();
DROP TRIGGER IF EXISTS trg_m09_ai_published_option_immutable ON public.question_options;
CREATE TRIGGER trg_m09_ai_published_option_immutable
BEFORE INSERT OR UPDATE OR DELETE ON public.question_options FOR EACH ROW
EXECUTE FUNCTION public.guard_m09_ai_published_immutable();
DROP TRIGGER IF EXISTS trg_m09_ai_published_key_immutable ON public.question_keys;
CREATE TRIGGER trg_m09_ai_published_key_immutable
BEFORE INSERT OR UPDATE OR DELETE ON public.question_keys FOR EACH ROW
EXECUTE FUNCTION public.guard_m09_ai_published_immutable();

DO $release$
DECLARE n int; v_owner uuid; r record; v_canonical uuid; bad int; v_old uuid;
BEGIN
 SELECT count(*) INTO n FROM public.questions q
  WHERE q.source_reference LIKE 'MSACCESS-DEMO-STYLE-2026/%';
 IF n=0 THEN
   RAISE NOTICE 'TASK-211: private review bank absent in clean CI database; no candidate publication in seed-only database.';
   RETURN;
 END IF;
 IF n<>8 THEN RAISE EXCEPTION 'TASK-211: expected exactly 8 demo-source candidates, found %',n; END IF;
 SELECT id INTO v_owner FROM public.profiles WHERE role='admin' AND NOT COALESCE(is_blocked,false);
 IF (SELECT count(*) FROM public.profiles WHERE role='admin' AND NOT COALESCE(is_blocked,false))<>1 THEN
   RAISE EXCEPTION 'TASK-211: owner account ambiguous, fail closed';
 END IF;
 IF EXISTS(SELECT 1 FROM public.m09_owner_ai_release_waivers) THEN
   IF (SELECT count(*) FROM public.m09_owner_ai_release_waivers)=8
     AND (SELECT count(*) FROM public.questions q JOIN public.m09_owner_ai_release_waivers w ON w.question_id=q.id WHERE q.status='published')=8
   THEN RETURN;
   ELSE RAISE EXCEPTION 'TASK-211: partial/foreign owner release ledger'; END IF;
 END IF;
 SELECT count(*) INTO bad
 FROM public.questions q JOIN public.lessons l ON l.id=q.source_lesson_id
 JOIN public.constructs c ON c.id=q.construct_id JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'MSACCESS-DEMO-STYLE-2026/%' AND
 (split_part(q.source_reference,' | ',1) !~ '^MSACCESS-DEMO-STYLE-2026/DBS-Q0[1-8]$'
  OR q.status<>'review' OR q.format<>'Y1'
  OR q.group_code<>'S4.DB' OR NOT c.is_active OR c.group_code<>q.group_code
  OR l.slug NOT LIKE 'm09-v2-%'
  OR jsonb_array_length(q.assets)<>0
  OR length(trim(q.stem_md))<70 OR length(trim(k.explanation_md))<75
  OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4
  OR (SELECT count(DISTINCT lower(trim(o.content_md))) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4
  OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')<>1
  OR NOT EXISTS(SELECT 1 FROM public.lesson_constructs lc WHERE lc.lesson_id=q.source_lesson_id AND lc.construct_id=q.construct_id));
 IF bad<>0 THEN RAISE EXCEPTION 'TASK-211: % candidates fail factual/format preflight',bad; END IF;
 FOR r IN
   SELECT q.id,q.source_lesson_id,c.code,l.slug,split_part(q.source_reference,' | ',1) item
   FROM public.questions q JOIN public.constructs c ON c.id=q.construct_id
   JOIN public.lessons l ON l.id=q.source_lesson_id
   WHERE q.source_reference LIKE 'MSACCESS-DEMO-STYLE-2026/%'
   ORDER BY q.source_reference FOR UPDATE OF q
 LOOP
   v_old:=r.source_lesson_id;
   SELECT id INTO STRICT v_canonical FROM public.lessons l
    WHERE l.slug=CASE r.code
      WHEN 'S4.DB.02' THEN 'access-jadval-va-malumot-kiritish'
      WHEN 'S4.DB.03' THEN 'kalitlar-va-jadvallarni-boglash'
      WHEN 'S4.DB.04' THEN 'sorovlar-yaratish'
      WHEN 'S4.DB.05' THEN 'murakkab-sorovlar-va-natijani-tahlil-qilish'
      ELSE 'invalid_construct_for_this_eight_batch' END
      AND l.status='published'::public.content_status
      AND EXISTS (SELECT 1 FROM public.lesson_constructs lc
        WHERE lc.lesson_id=l.id AND lc.construct_id=
          (SELECT construct_id FROM public.questions WHERE id=r.id));
   IF v_canonical IS NULL THEN RAISE EXCEPTION 'TASK-211: published canonical lesson not found'; END IF;
   UPDATE public.questions SET source_lesson_id=v_canonical,updated_at=now()
     WHERE id=r.id AND status='review'::public.content_status;
   INSERT INTO public.m09_owner_ai_release_waivers
     (question_id,owner_account_id,original_source_lesson_id,item_fingerprint,waiver_scope,source_evidence,owner_instruction)
   VALUES
     (r.id,v_owner,v_old,public.m09_ai_release_fingerprint(r.id),
     'TASK-211:DBS-Q01-Q08:OWNER-AI-20261020',
     'TASK-208/209/210: 2026 exam specification + Uzbek ICT11/Access manual; eight item-wise reviewed keys; six synthetic SQL results match; no independent human editorial review.',
     'Owner in ChatGPT 2026-10-20 explicitly authorized AI specialist to review and publish eligible M09 questions without independent human expert signoff; not a human reviewer signature.');
 END LOOP;
 IF (SELECT count(*) FROM public.m09_owner_ai_release_waivers)<>8 THEN
   RAISE EXCEPTION 'TASK-211: scope ledger incomplete'; END IF;

 UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
 WHERE q.status='review'::public.content_status AND
  q.id IN(SELECT question_id FROM public.m09_owner_ai_release_waivers
    WHERE waiver_scope='TASK-211:DBS-Q01-Q08:OWNER-AI-20261020');
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>8 THEN RAISE EXCEPTION 'TASK-211: expected publishing eight but got %',n; END IF;
 IF (SELECT count(*) FROM public.questions q
    JOIN public.m09_owner_ai_release_waivers w ON w.question_id=q.id
    JOIN public.lessons l ON l.id=q.source_lesson_id
    WHERE q.status='published' AND l.status='published'
       AND w.item_fingerprint=public.m09_ai_release_fingerprint(q.id))<>8 THEN
   RAISE EXCEPTION 'TASK-211: post-publish fingerprints or lesson mapping mismatch';
 END IF;
 IF EXISTS(SELECT 1 FROM public.questions q
   WHERE q.status='published' AND
    (q.source_reference LIKE 'MSACCESS-V2/%' OR q.source_reference LIKE 'MSACCESS-V2-NATIVE/%'))
 THEN RAISE EXCEPTION 'TASK-211: unauthorized publication of remaining V2 bank'; END IF;
END $release$;
COMMIT;

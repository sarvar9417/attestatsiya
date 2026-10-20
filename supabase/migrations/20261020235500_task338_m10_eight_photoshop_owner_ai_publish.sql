-- TASK-338: STRICTLY scoped, owner-authorized AI-researched M10 Photoshop questions.
-- Eight exact review revisions: four Y2 + four Y3, no human reviewer impersonation.
-- Does not publish other GV2 draft/review questions or any images.
-- Executed on fresh CI where live random review revision IDs are absent: schema
-- guard only; no publication. Production may release only the exact live eight.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='180s';

CREATE TABLE IF NOT EXISTS public.m10_owner_ai_release_waivers (
  question_id uuid PRIMARY KEY REFERENCES public.questions(id) ON DELETE RESTRICT,
  owner_account_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  original_source_lesson_id uuid NOT NULL REFERENCES public.lessons(id),
  item_fingerprint text NOT NULL CHECK (length(item_fingerprint)=32),
  waiver_scope text NOT NULL CHECK (waiver_scope='TASK-338:M10-ED-8:OWNER-AI-20261020'),
  reviewer_kind text NOT NULL DEFAULT 'ai' CHECK (reviewer_kind='ai'),
  source_evidence text NOT NULL CHECK (length(source_evidence)>=60),
  owner_instruction text NOT NULL CHECK (length(owner_instruction)>=60),
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.m10_owner_ai_release_waivers IS
 'Eight specifically reviewed M10 Photoshop Y2/Y3 owner-approved AI releases; not independent human review. Exact content fingerprint mandatory.';
ALTER TABLE public.m10_owner_ai_release_waivers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.m10_owner_ai_release_waivers FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT ON public.m10_owner_ai_release_waivers TO service_role;

-- Keep the original independent editorial gate, changing only the OR branch
-- for matching, signed-off-through-owner-exception eight revisions.
CREATE OR REPLACE FUNCTION public.guard_graphics_web_v2_publication()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $guard$
BEGIN
  IF new.status='published'::public.content_status
     AND (tg_op='INSERT' OR (tg_op='UPDATE' AND old.status IS DISTINCT FROM 'published'::public.content_status))
     AND new.group_code='S5.WEB'
     AND (new.source_reference LIKE 'GV2:%'
          OR new.source_reference LIKE 'Grafika va veb-texnologiyalar V2,%')
  THEN
    IF tg_op='INSERT' THEN
      RAISE EXCEPTION USING errcode='23514',
        message='GV2_PUBLICATION_BLOCKED: create the complete review revision before publication';
    END IF;
    IF (to_jsonb(new)-'status'-'updated_at')<>(to_jsonb(old)-'status'-'updated_at') THEN
      RAISE EXCEPTION USING errcode='23514',
        message='GV2_PUBLICATION_BLOCKED: edit and publish must be separate operations';
    END IF;
    IF new.source_lesson_id IS NULL OR NOT EXISTS (
      SELECT 1 FROM public.lessons l
      JOIN public.lesson_constructs lc ON lc.lesson_id=l.id
      WHERE l.id=new.source_lesson_id AND l.status='published'::public.content_status
        AND lc.construct_id=new.construct_id
    ) THEN
      RAISE EXCEPTION USING errcode='23514',
        message='GV2_PUBLICATION_BLOCKED: published source lesson and construct link required';
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM public.question_editorial_checks e
      WHERE e.question_id=new.id AND e.answer_verified AND e.reference_verified
        AND e.wording_verified AND e.original_authorship_verified
        AND length(btrim(e.reviewer_notes))>=20
        AND e.content_fingerprint=public.professional_question_fingerprint(new.id)
    ) AND NOT EXISTS (
      SELECT 1 FROM public.m10_owner_ai_release_waivers w
      JOIN public.profiles p ON p.id=w.owner_account_id
      WHERE w.question_id=new.id
        AND w.waiver_scope='TASK-338:M10-ED-8:OWNER-AI-20261020'
        AND w.reviewer_kind='ai' AND p.role='admin'
        AND NOT coalesce(p.is_blocked,false)
        AND w.item_fingerprint=public.professional_question_fingerprint(new.id)
        AND new.source_lesson_id='a1000000-0000-4000-8000-000000000003'::uuid
        AND new.construct_id='929f91b1-7828-489a-b3b4-b79105b4eddf'::uuid
    ) THEN
      RAISE EXCEPTION USING errcode='23514',
        message='GV2_PUBLICATION_BLOCKED: current expert editorial evidence or exact owner-AI waiver required';
    END IF;
  END IF;
  RETURN new;
END
$guard$;
REVOKE ALL ON FUNCTION public.guard_graphics_web_v2_publication() FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.guard_m10_ai_published_immutable()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $immutable$
DECLARE v_id uuid;
BEGIN
  IF TG_TABLE_NAME='questions' THEN
    IF TG_OP='DELETE' THEN
      IF OLD.status='published'::public.content_status
         AND EXISTS(SELECT 1 FROM public.m10_owner_ai_release_waivers WHERE question_id=OLD.id) THEN
        RAISE EXCEPTION 'TASK-338: published Photoshop question is immutable' USING ERRCODE='23514';
      END IF;
      RETURN OLD;
    END IF;
    IF OLD.status='published'::public.content_status
       AND EXISTS(SELECT 1 FROM public.m10_owner_ai_release_waivers WHERE question_id=OLD.id) THEN
      IF NEW.status IN ('published'::public.content_status,'archived'::public.content_status)
         AND (to_jsonb(NEW)-'status'-'updated_at')=(to_jsonb(OLD)-'status'-'updated_at') THEN
        RETURN NEW;
      END IF;
      RAISE EXCEPTION 'TASK-338: create new revision to edit published Photoshop question' USING ERRCODE='23514';
    END IF;
    RETURN NEW;
  END IF;
  v_id:=CASE WHEN TG_OP='DELETE' THEN OLD.question_id ELSE NEW.question_id END;
  IF EXISTS(
    SELECT 1 FROM public.questions q JOIN public.m10_owner_ai_release_waivers w ON w.question_id=q.id
    WHERE q.id=v_id AND q.status='published'::public.content_status
  ) THEN
    RAISE EXCEPTION 'TASK-338: published Photoshop answer/option is immutable' USING ERRCODE='23514';
  END IF;
  IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END
$immutable$;
REVOKE ALL ON FUNCTION public.guard_m10_ai_published_immutable() FROM PUBLIC,anon,authenticated;
DROP TRIGGER IF EXISTS trg_m10_ai_question_immutable ON public.questions;
CREATE TRIGGER trg_m10_ai_question_immutable BEFORE UPDATE OR DELETE ON public.questions
FOR EACH ROW EXECUTE FUNCTION public.guard_m10_ai_published_immutable();
DROP TRIGGER IF EXISTS trg_m10_ai_option_immutable ON public.question_options;
CREATE TRIGGER trg_m10_ai_option_immutable BEFORE INSERT OR UPDATE OR DELETE ON public.question_options
FOR EACH ROW EXECUTE FUNCTION public.guard_m10_ai_published_immutable();
DROP TRIGGER IF EXISTS trg_m10_ai_key_immutable ON public.question_keys;
CREATE TRIGGER trg_m10_ai_key_immutable BEFORE INSERT OR UPDATE OR DELETE ON public.question_keys
FOR EACH ROW EXECUTE FUNCTION public.guard_m10_ai_published_immutable();

DO $release$
DECLARE
 v_owner uuid;
 v_n int;
 v_bad int;
 v_status int;
 r record;
 v_id uuid;
BEGIN
 CREATE TEMP TABLE task338_expected(question_id uuid PRIMARY KEY, source_tag text NOT NULL UNIQUE, format public.question_format NOT NULL) ON COMMIT DROP;
 INSERT INTO task338_expected VALUES
    ('005f436e-25a9-4335-b836-988657d2eec9'::uuid,'GV2-EXT-ED-Y3-04'::text,'Y3'::public.question_format),
    ('13f94a6a-afe3-433f-87f8-4ce5c7cc76f8'::uuid,'GV2-EXT-ED-Y2-03'::text,'Y2'::public.question_format),
    ('1cf03d19-cfbd-4b43-8359-dc15517f0a8d'::uuid,'GV2-EXT-ED-Y2-05'::text,'Y2'::public.question_format),
    ('4a1d83cd-75ab-4f84-aed7-3b501c909b77'::uuid,'GV2-EXT-ED-Y3-06'::text,'Y3'::public.question_format),
    ('7e4b62cd-9142-4088-a149-e38d6ac5ea46'::uuid,'GV2-EXT-ED-Y3-07'::text,'Y3'::public.question_format),
    ('8ebe0aac-b866-4a4a-9286-1ecb59105ed5'::uuid,'GV2-EXT-ED-Y2-06'::text,'Y2'::public.question_format),
    ('ab17deb0-0f57-46cf-9a2f-5f8e8ab65085'::uuid,'GV2-EXT-ED-Y3-05'::text,'Y3'::public.question_format),
    ('f911c8ee-98cd-4b08-ac69-b02a8c143640'::uuid,'GV2-EXT-ED-Y2-07'::text,'Y2'::public.question_format);
 SELECT count(*) INTO v_n FROM public.questions q JOIN task338_expected x ON x.question_id=q.id;
 IF v_n=0 THEN
   RAISE NOTICE 'TASK-338 live-only random revision IDs absent in clean DB; release skipped, guard installed';
   RETURN;
 END IF;
 IF v_n<>8 THEN RAISE EXCEPTION 'TASK-338 partial cohort %/8; fail closed',v_n; END IF;
 SELECT count(*) INTO v_bad FROM public.questions q JOIN task338_expected x ON x.question_id=q.id
 JOIN public.question_keys k ON k.question_id=q.id
 JOIN public.lessons l ON l.id=q.source_lesson_id
 WHERE q.status<>'review'::public.content_status
  OR l.slug<>'paint-photoshop-v2-review'
  OR q.construct_id<>'929f91b1-7828-489a-b3b4-b79105b4eddf'::uuid
  OR q.group_code<>'S5.WEB' OR q.format<>x.format
  OR q.source_reference NOT LIKE '%'||x.source_tag||'%'
  OR q.is_generated IS DISTINCT FROM true
  OR coalesce(jsonb_array_length(q.assets),-1)<>0
  OR length(btrim(q.stem_md))<35
  OR length(btrim(k.explanation_md))<55
  OR EXISTS (SELECT 1 FROM public.question_editorial_checks e WHERE e.question_id=q.id)
  OR (SELECT count(DISTINCT lower(btrim(o.content_md))) FROM public.question_options o WHERE o.question_id=q.id)
     <> (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id)
  OR CASE WHEN q.format='Y2' THEN
      NOT (jsonb_typeof(k.payload->'pairs')='object'
        AND (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs'))=4
        AND (SELECT count(distinct p.value) FROM jsonb_each_text(k.payload->'pairs') p)=4
        AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
        AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b')=4
        AND NOT EXISTS (SELECT 1 FROM jsonb_each_text(k.payload->'pairs') p
          WHERE NOT EXISTS (SELECT 1 FROM public.question_options o
            WHERE o.id::text=p.key AND o.question_id=q.id AND o.side='a')
             OR NOT EXISTS (SELECT 1 FROM public.question_options o
            WHERE o.id::text=p.value AND o.question_id=q.id AND o.side='b')))
     WHEN q.format='Y3' THEN
      NOT (jsonb_typeof(k.payload->'order')='array'
        AND jsonb_array_length(k.payload->'order')=4
        AND (SELECT count(distinct p.value) FROM jsonb_array_elements_text(k.payload->'order') p)=4
        AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
        AND NOT EXISTS (SELECT 1 FROM jsonb_array_elements_text(k.payload->'order') p
          WHERE NOT EXISTS (SELECT 1 FROM public.question_options o
            WHERE o.id::text=p.value AND o.question_id=q.id AND o.side='a')))
      ELSE true END;
 IF v_bad<>0 THEN RAISE EXCEPTION 'TASK-338 % rows failed semantic/source/answer-shape preflight',v_bad; END IF;
 SELECT count(*) INTO v_bad FROM task338_expected x LEFT JOIN public.questions q ON q.id=x.question_id
 LEFT JOIN public.question_keys k ON k.question_id=q.id WHERE k.question_id IS NULL;
 IF v_bad<>0 THEN RAISE EXCEPTION 'TASK-338 missing key for % candidates',v_bad; END IF;
 SELECT count(*) INTO v_bad FROM public.questions q JOIN task338_expected x ON x.question_id=q.id
 WHERE EXISTS (SELECT 1 FROM public.questions other WHERE other.status='published'
     AND other.id<>q.id AND lower(regexp_replace(trim(other.stem_md),'\\s+',' ','g'))
         =lower(regexp_replace(trim(q.stem_md),'\\s+',' ','g')));
 IF v_bad<>0 THEN RAISE EXCEPTION 'TASK-338 % exact published-question duplicates',v_bad; END IF;
 SELECT id INTO v_owner FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
 IF (SELECT count(*) FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false))<>1 THEN
   RAISE EXCEPTION 'TASK-338 owner account ambiguous; abort';
 END IF;
 IF EXISTS(SELECT 1 FROM public.m10_owner_ai_release_waivers) THEN
   IF (SELECT count(*) FROM public.m10_owner_ai_release_waivers)=8
      AND (SELECT count(*) FROM public.questions q JOIN public.m10_owner_ai_release_waivers w ON w.question_id=q.id
           WHERE q.status='published')=8 THEN RETURN;
   ELSE RAISE EXCEPTION 'TASK-338 partial/foreign waivers'; END IF;
 END IF;
 IF NOT EXISTS (SELECT 1 FROM public.lessons l JOIN public.lesson_constructs lc ON lc.lesson_id=l.id
   WHERE l.id='a1000000-0000-4000-8000-000000000003'::uuid
     AND l.status='published' AND lc.construct_id='929f91b1-7828-489a-b3b4-b79105b4eddf'::uuid)
 THEN RAISE EXCEPTION 'TASK-338 canonical Paint/Photoshop lesson unavailable'; END IF;
 FOR r IN SELECT q.id,q.source_lesson_id
   FROM public.questions q JOIN task338_expected x ON x.question_id=q.id
   ORDER BY q.id FOR UPDATE OF q
 LOOP
   UPDATE public.questions SET source_lesson_id='a1000000-0000-4000-8000-000000000003'::uuid,
     updated_at=now() WHERE id=r.id AND status='review';
   INSERT INTO public.m10_owner_ai_release_waivers
      (question_id,owner_account_id,original_source_lesson_id,item_fingerprint,waiver_scope,source_evidence,owner_instruction)
   VALUES (r.id,v_owner,r.source_lesson_id,public.professional_question_fingerprint(r.id),
     'TASK-338:M10-ED-8:OWNER-AI-20261020',
     '2026 Informatika spetsifikatsiyasi 27–31 and ICT7 2021 pages 50–79; source-aligned Y2/Y3 semantics, ordered pairs, distinct distractors and key validation by AI; no human editorial review or 1:1 textbook visual assertion.',
     'User specifically requested on 2026-10-20: complete remaining Photoshop lesson QA, merge changes and publish reviewed questions. Owner allows AI specialist review, not a human reviewer signature.');
 END LOOP;
 IF (SELECT count(*) FROM public.m10_owner_ai_release_waivers)<>8 THEN RAISE EXCEPTION 'TASK-338 waiver count mismatch'; END IF;
 UPDATE public.questions SET status='published'::public.content_status,updated_at=now()
 WHERE id IN(SELECT question_id FROM task338_expected) AND status='review'::public.content_status;
 GET DIAGNOSTICS v_status=ROW_COUNT;
 IF v_status<>8 THEN RAISE EXCEPTION 'TASK-338 published % rather than 8',v_status; END IF;
 IF (SELECT count(*) FROM public.questions q JOIN task338_expected x ON x.question_id=q.id
   JOIN public.m10_owner_ai_release_waivers w ON w.question_id=q.id
   JOIN public.lessons l ON l.id=q.source_lesson_id
   WHERE q.status='published' AND l.status='published'
     AND w.item_fingerprint=public.professional_question_fingerprint(q.id))<>8
 THEN RAISE EXCEPTION 'TASK-338 post-publish immutable fingerprints or source mismatch'; END IF;
END $release$;
COMMIT;

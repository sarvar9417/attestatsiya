-- TASK-204 corrective forward migration: RFC-4122 UUIDs for pre-publish V2.
-- Old md5(...)::uuid identifiers are valid PostgreSQL UUID but most violate
-- frontend Zod .uuid() RFC version/variant rules. Never re-key published data.
BEGIN;
SELECT pg_advisory_xact_lock(hashtext('TASK204_UUID_REKEY'));
CREATE TEMP TABLE _al2_lmap(old uuid PRIMARY KEY, new uuid NOT NULL UNIQUE,slug text NOT NULL) ON COMMIT DROP;
CREATE TEMP TABLE _al2_qmap(old uuid PRIMARY KEY,new uuid NOT NULL UNIQUE) ON COMMIT DROP;
CREATE TEMP TABLE _al2_omap(old uuid PRIMARY KEY,new uuid NOT NULL UNIQUE) ON COMMIT DROP;
INSERT INTO _al2_lmap SELECT id,gen_random_uuid(),slug FROM public.lessons
 WHERE slug LIKE 'algoritmlash-v2-%';
INSERT INTO _al2_qmap SELECT id,gen_random_uuid() FROM public.questions
 WHERE source_reference LIKE 'algoritmlash-v2:ALG-%';
INSERT INTO _al2_omap SELECT o.id,gen_random_uuid() FROM public.question_options o
 JOIN _al2_qmap m ON o.question_id=m.old;
DO $$
BEGIN
 IF (SELECT count(*) FROM _al2_lmap)<>11 OR (SELECT count(*) FROM _al2_qmap)<>240
    OR (SELECT count(*) FROM _al2_omap)<>977
 THEN RAISE EXCEPTION 'V2 dataset size changed; aborting rekey'; END IF;
 IF EXISTS(SELECT 1 FROM public.lessons l JOIN _al2_lmap m ON l.id=m.old WHERE l.status <> 'review')
 OR EXISTS(SELECT 1 FROM public.questions q JOIN _al2_qmap m ON q.id=m.old
          WHERE q.status NOT IN ('draft','review'))
 THEN RAISE EXCEPTION 'Content already published; rekey forbidden'; END IF;
 IF EXISTS(SELECT 1 FROM public.exams e JOIN _al2_lmap m ON e.lesson_id=m.old)
 OR EXISTS(SELECT 1 FROM public.topic_test_attempts e JOIN _al2_lmap m ON e.lesson_id=m.old)
 OR EXISTS(SELECT 1 FROM public.user_lesson_progress e JOIN _al2_lmap m ON e.lesson_id=m.old)
 OR EXISTS(SELECT 1 FROM public.exam_items e JOIN _al2_qmap m ON e.question_id=m.old)
 OR EXISTS(SELECT 1 FROM public.mastery_evidence e JOIN _al2_qmap m ON e.question_id=m.old)
 OR EXISTS(SELECT 1 FROM public.question_editorial_checks e JOIN _al2_qmap m ON e.question_id=m.old)
 OR EXISTS(SELECT 1 FROM public.question_reports e JOIN _al2_qmap m ON e.question_id=m.old)
 OR EXISTS(SELECT 1 FROM public.question_stats e JOIN _al2_qmap m ON e.question_id=m.old)
 THEN RAISE EXCEPTION 'External user/reviewer FK references exist, abort'; END IF;
END $$;

-- Temporarily free unique slugs/locators while keeping original rows until copied.
UPDATE public.lessons l SET slug='rekey-old-algo-v2-'||replace(l.id::text,'-','')
 FROM _al2_lmap m WHERE l.id=m.old;
INSERT INTO public.lessons
 (id,module_id,order_idx,slug,title_uz,summary_uz,body_mdx,blocks,blocks_kind,est_minutes,topic_test_question_count,status,created_at,updated_at)
 SELECT m.new,l.module_id,l.order_idx,m.slug,l.title_uz,NULL,l.body_mdx,l.blocks,l.blocks_kind,l.est_minutes,l.topic_test_question_count,l.status,l.created_at,l.updated_at
 FROM public.lessons l JOIN _al2_lmap m ON m.old=l.id;

INSERT INTO public.lesson_constructs(lesson_id,construct_id,is_required,is_critical,min_questions)
SELECT m.new,lc.construct_id,lc.is_required,lc.is_critical,lc.min_questions
 FROM public.lesson_constructs lc JOIN _al2_lmap m ON m.old=lc.lesson_id;

UPDATE public.questions q SET source_reference='rekey-old:'||q.source_reference
 FROM _al2_qmap m WHERE q.id=m.old;
INSERT INTO public.questions
 (id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,assets,is_generated,status,author_id,created_at,updated_at,source_reference,source_lesson_id)
 SELECT qm.new,q.subject_id,q.construct_id,q.group_code,q.format,q.cognitive,q.difficulty,q.stem_md,q.assets,q.is_generated,q.status,q.author_id,q.created_at,q.updated_at,
 substring(q.source_reference FROM length('rekey-old:')+1),lm.new
 FROM public.questions q JOIN _al2_qmap qm ON qm.old=q.id
 JOIN _al2_lmap lm ON lm.old=q.source_lesson_id;
INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
 SELECT om.new,qm.new,o.side,o.order_idx,o.content_md
 FROM public.question_options o JOIN _al2_omap om ON om.old=o.id
 JOIN _al2_qmap qm ON qm.old=o.question_id;

INSERT INTO public.question_keys(question_id,payload,explanation_md,updated_at)
SELECT qm.new,
CASE q.format
 WHEN 'Y1' THEN
  jsonb_build_object('correct_option_id',
     (SELECT om.new::text FROM _al2_omap om
      WHERE om.old::text=k.payload->>'correct_option_id'))
 WHEN 'Y2' THEN
  jsonb_build_object('pairs',(
    SELECT jsonb_object_agg(l.new::text,r.new::text)
    FROM jsonb_each_text(k.payload->'pairs') p
    JOIN _al2_omap l ON l.old::text=p.key
    JOIN _al2_omap r ON r.old::text=p.value
  ))
 WHEN 'Y3' THEN
  jsonb_build_object('order',(
    SELECT jsonb_agg(om.new::text ORDER BY x.ordinality)
    FROM jsonb_array_elements_text(k.payload->'order') WITH ORDINALITY x
    JOIN _al2_omap om ON om.old::text=x.value
  ))
END,k.explanation_md,k.updated_at
FROM public.question_keys k JOIN _al2_qmap qm ON qm.old=k.question_id
JOIN public.questions q ON q.id=qm.old;

DELETE FROM public.question_keys k USING _al2_qmap m WHERE k.question_id=m.old;
DELETE FROM public.question_options o USING _al2_omap m WHERE o.id=m.old;
DELETE FROM public.questions q USING _al2_qmap m WHERE q.id=m.old;
DELETE FROM public.lesson_constructs lc USING _al2_lmap m WHERE lc.lesson_id=m.old;
DELETE FROM public.lessons l USING _al2_lmap m WHERE l.id=m.old;

DO $$
DECLARE invalid int;
BEGIN
 SELECT count(*) INTO invalid FROM (
 SELECT id::text v FROM public.lessons WHERE slug LIKE 'algoritmlash-v2-%'
 UNION ALL
 SELECT id::text FROM public.questions WHERE source_reference LIKE 'algoritmlash-v2:ALG-%'
 UNION ALL
 SELECT o.id::text FROM public.question_options o JOIN public.questions q ON q.id=o.question_id
 WHERE q.source_reference LIKE 'algoritmlash-v2:ALG-%'
 ) s WHERE v !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
 IF invalid<>0 THEN RAISE EXCEPTION '% invalid RFC UUIDs remain',invalid; END IF;
 IF (SELECT count(*) FROM public.lessons WHERE slug LIKE 'algoritmlash-v2-%')<>11 OR
    (SELECT count(*) FROM public.questions WHERE source_reference LIKE 'algoritmlash-v2:ALG-%')<>240
 THEN RAISE EXCEPTION 'Re-key quantity mismatch'; END IF;
 IF EXISTS(SELECT 1 FROM public.questions q LEFT JOIN public.question_keys k ON k.question_id=q.id
    WHERE q.source_reference LIKE 'algoritmlash-v2:ALG-%' AND k.question_id IS NULL)
 THEN RAISE EXCEPTION 'Missing key after re-key'; END IF;
END $$;
COMMIT;
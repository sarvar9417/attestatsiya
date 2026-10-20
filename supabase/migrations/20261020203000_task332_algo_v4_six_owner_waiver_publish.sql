-- TASK-332 | owner-approved, AI-reviewed graphic questions; never mislabel as independent expert-signed.
-- User explicitly authorized AI review/publication on 2026-10-20.
-- PRODUCTION PREREQUISITE: all three local SVG files already deployed and verified reachable.
BEGIN;
CREATE TEMP TABLE _task332_candidates(ref text PRIMARY KEY,src text NOT NULL) ON COMMIT DROP;
INSERT INTO _task332_candidates VALUES ('algoritmlash-v4:ALG-V4-001','/algoritmlash-v4/flow_product_3_9.svg'),
('algoritmlash-v4:ALG-V4-002','/algoritmlash-v4/flow_product_3_9.svg'),
('algoritmlash-v4:ALG-V4-003','/algoritmlash-v4/flow_until_negative.svg'),
('algoritmlash-v4:ALG-V4-004','/algoritmlash-v4/flow_until_negative.svg'),
('algoritmlash-v4:ALG-V4-005','/algoritmlash-v4/dag_paths_a_j.svg'),
('algoritmlash-v4:ALG-V4-006','/algoritmlash-v4/dag_paths_a_j.svg');
DO $guard$ DECLARE n integer;
BEGIN
IF (SELECT count(*) FROM _task332_candidates)<>6 THEN RAISE EXCEPTION 'wrong candidate count'; END IF;
SELECT count(*) INTO n FROM _task332_candidates e
 JOIN public.questions q ON q.source_reference=e.ref
 JOIN public.question_keys k ON k.question_id=q.id
 JOIN public.lessons l ON l.id=q.source_lesson_id
 JOIN public.constructs c ON c.id=q.construct_id
 WHERE q.group_code='S3.ALGO' AND q.format='Y1'
 AND q.status IN ('review','published') AND l.status='published'
 AND q.is_generated=true AND c.code IN('S3.ALGO.03','S3.ALGO.04')
 AND jsonb_array_length(q.assets)=1
 AND q.assets->0->>'src'=e.src AND q.assets->0->>'kind'='image'
 AND length(k.explanation_md)>55
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')=1
 AND NOT EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND btrim(coalesce(o.content_md,''))='');
IF n<>6 THEN RAISE EXCEPTION 'QA gate failed: % of 6',n; END IF;
IF (SELECT count(*) FROM public.algoritmlash_style_audit a JOIN _task332_candidates e ON a.source_reference=e.ref)<>6
 THEN RAISE EXCEPTION 'audit not complete'; END IF;
END $guard$;
UPDATE public.algoritmlash_style_audit a
 SET source_evidence=a.source_evidence||jsonb_build_object(
   'owner_waiver','explicit owner authorization, 2026-10-20',
   'verification_type','AI semantic review, not independent human editorial certification',
   'independent_human_editorial_signoff',false,
   'graphic_verified_in_repository',true,
   'release_scope','TASK-332 M06 V4 six graphic questions'),
 audited_at=now()
FROM _task332_candidates e WHERE a.source_reference=e.ref;
UPDATE public.questions q SET status='published',updated_at=now()
FROM _task332_candidates e WHERE q.source_reference=e.ref AND q.status='review';
INSERT INTO public.question_quality_published_revisions(question_id,content_fingerprint,release_scope)
SELECT q.id,md5(q.stem_md||q.assets::text||k.payload::text||k.explanation_md||
 COALESCE((SELECT string_agg(o.content_md,'|' ORDER BY o.side,o.order_idx) FROM public.question_options o WHERE o.question_id=q.id),'')
),'TASK-332 owner waiver + AI source/semantic QA, no independent expert signature'
FROM _task332_candidates e
JOIN public.questions q ON q.source_reference=e.ref
JOIN public.question_keys k ON k.question_id=q.id
ON CONFLICT(question_id) DO NOTHING;
DO $post$ BEGIN
 IF (SELECT count(*) FROM _task332_candidates e JOIN public.questions q ON q.source_reference=e.ref WHERE q.status='published')<>6 THEN RAISE EXCEPTION 'Release postcondition failed'; END IF;
 IF (SELECT count(*) FROM _task332_candidates e JOIN public.questions q ON q.source_reference=e.ref JOIN public.question_quality_published_revisions r ON r.question_id=q.id)<>6 THEN RAISE EXCEPTION 'Snapshot postcondition failed'; END IF;
END $post$;
COMMIT;
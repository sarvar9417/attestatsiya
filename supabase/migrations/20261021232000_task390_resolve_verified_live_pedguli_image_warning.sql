-- TASK-390: resolve the obsolete missing-image warning only after production GET/200 and repository asset verification.
-- Do not claim visual-semantic review; this is an asset-availability check.
BEGIN;
DO $audit$
DECLARE q_id uuid; n integer;
BEGIN
 SELECT q.id INTO q_id FROM public.questions q
 WHERE q.source_reference='telegram:@PedMahoratGuli:4842'
 AND q.status='published'::public.content_status
 AND q.assets @> '[{"kind":"image","src":"/pedguli-source/pedguli-4842-classroom-game.jpg"}]'::jsonb;
 IF q_id IS NULL THEN RAISE EXCEPTION 'TASK-390 image linkage missing'; END IF;
 UPDATE public.question_quality_findings f
 SET resolved_at=now(),details=f.details||jsonb_build_object(
  'task','TASK-390',
  'correction','File exists in GitHub public/pedguli-source and production returns HTTP 200/jpeg',
  'verified_path','/pedguli-source/pedguli-4842-classroom-game.jpg',
  'production_status',200,
  'visual_semantics_verified',false,
  'historical_attempts_changed',false
 )
 WHERE f.question_id=q_id AND f.finding_code='missing_required_image' AND f.resolved_at IS NULL;
 GET DIAGNOSTICS n=ROW_COUNT;
 IF n<>1 THEN RAISE EXCEPTION 'TASK-390 expected one stale image warning, got %',n; END IF;
END
$audit$;
COMMIT;
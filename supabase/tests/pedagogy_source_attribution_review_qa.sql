-- Read-only / rollback-safe assertions for published source-dependent pedagogy questions.
-- If no source data is loaded (fresh skeletal fixture), this is a no-op.
BEGIN;
DO $audit$
DECLARE total integer; linked integer; bad integer;
BEGIN
 WITH suspects AS (
 SELECT q.id,r.revision_question_id,rr.status,rr.stem_md
 FROM public.questions q
 LEFT JOIN public.pedagogy_revision_queue r ON r.source_question_id=q.id
 LEFT JOIN public.questions rr ON rr.id=r.revision_question_id
 WHERE q.status='published'::public.content_status
   AND q.group_code IN ('KS','PM.GEN','PM.MET')
   AND q.stem_md ~* '(^[[:space:]]*#|asl[[:space:]]+(pdf|manba|to.plam)|manbadagi|(^|[[:space:]])manbada[[:space:]]|manbaga[[:space:]]+ko.ra|manba[[:space:]]+qaysi|manba[[:space:]]+to.plam|pdfda|pedmahorat[[:space:]]*[|])'
 )
 SELECT count(*),count(*) FILTER(WHERE revision_question_id IS NOT NULL AND status='review'::public.content_status),
 count(*) FILTER(WHERE revision_question_id IS NOT NULL
    AND stem_md ~* '(^[[:space:]]*#|asl[[:space:]]+(pdf|manba|to.plam)|manbadagi|(^|[[:space:]])manbada[[:space:]]|manbaga[[:space:]]+ko.ra|manba[[:space:]]+qaysi|manba[[:space:]]+to.plam|pdfda|pedmahorat[[:space:]]*[|])')
 INTO total,linked,bad FROM suspects;
 IF linked<>total OR bad<>0 THEN
   RAISE EXCEPTION 'source-label revisions incomplete: total %, linked %, bad %',total,linked,bad;
 END IF;
 SELECT count(*) INTO bad FROM public.pedagogy_revision_queue r
 JOIN public.questions src ON src.id=r.source_question_id
 JOIN public.questions rev ON rev.id=r.revision_question_id
 WHERE src.status='published'::public.content_status
 AND src.group_code IN ('KS','PM.GEN','PM.MET')
 AND src.stem_md ~* '(^[[:space:]]*#|asl[[:space:]]+(pdf|manba|to.plam)|manbadagi|(^|[[:space:]])manbada[[:space:]]|manbaga[[:space:]]+ko.ra|manba[[:space:]]+qaysi|manba[[:space:]]+to.plam|pdfda|pedmahorat[[:space:]]*[|])'
 AND (
 (SELECT count(*) FROM public.question_options o WHERE o.question_id=rev.id)<>4 OR
 (SELECT count(DISTINCT btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=rev.id)<>4 OR
 NOT EXISTS(SELECT 1 FROM public.question_keys k
   JOIN public.question_options o ON o.question_id=k.question_id
     AND o.id=(k.payload->>'correct_option_id')::uuid
   WHERE k.question_id=rev.id)
 );
 IF bad>0 THEN RAISE EXCEPTION 'Invalid reviewed options/keys: %',bad;END IF;
 RAISE NOTICE 'source-attribution review coverage: %/% reviewed; unique 4 options and key OK',linked,total;
END
$audit$;
ROLLBACK;

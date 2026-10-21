-- Read-only test: Telegram source attributions must not appear in learner-facing
-- pedagogy answer variants. Archived historical snapshots are preserved.
BEGIN;
DO $assert$
DECLARE bad_count integer;
BEGIN
 SELECT count(*) INTO bad_count
 FROM public.question_options o
 JOIN public.questions q ON q.id=o.question_id
 WHERE q.group_code IN ('KS','PM.GEN','PM.MET')
   AND q.status IN ('review'::public.content_status,'published'::public.content_status)
   AND (o.content_md ~* '(@PedMahoratGuli|@Guli_Eshnazarova|#attestatsiya|#tushgan|◀)'
        OR o.content_md ~* 't[.]me/PedMahoratGuli');
 IF bad_count<>0 THEN
   RAISE EXCEPTION 'Pedagogy option provenance leak: % active options',bad_count;
 END IF;
 RAISE NOTICE 'Pedagogy active option provenance QA PASS';
END
$assert$;
ROLLBACK;
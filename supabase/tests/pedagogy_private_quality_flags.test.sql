-- P0 option quality flags remain private and do not mutate/publish questions.
BEGIN;
DO $verify$
DECLARE v_n integer; v_length integer; v_wrongcue integer; v_review integer;
BEGIN
 SELECT count(*),count(*) FILTER(WHERE answer_length_signal),count(*) FILTER(WHERE absolute_word_cue)
 INTO v_n,v_length,v_wrongcue
 FROM public.pedagogy_option_quality_flags WHERE status='published';
 IF v_n<160 OR v_length<100 OR v_wrongcue<100 THEN
   RAISE EXCEPTION 'Published pedagogy option risk snapshot drift: total %, length %, cue %',
     v_n,v_length,v_wrongcue;
 END IF;
 SELECT count(*) INTO v_review
 FROM public.pedagogy_option_quality_flags WHERE status='review';
 IF v_review<200 THEN RAISE EXCEPTION 'Review quality inventory unexpectedly empty: %',v_review; END IF;
 IF has_table_privilege('anon','public.pedagogy_option_quality_flags','SELECT')
   OR has_table_privilege('authenticated','public.pedagogy_option_quality_flags','SELECT') THEN
   RAISE EXCEPTION 'Key-derived editorial quality view must be inaccessible to learners';
 END IF;
 IF EXISTS(SELECT 1 FROM public.questions q
   WHERE q.source_reference LIKE 'authored:m15-topictest-20261018:%' AND q.status='published') THEN
   RAISE EXCEPTION 'Unapproved AI-assisted M15 questions appeared as published';
 END IF;
END
$verify$;
SELECT 'private_pedagogy_option_quality_flags_ok' AS result;
ROLLBACK;

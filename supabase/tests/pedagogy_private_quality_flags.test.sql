-- P0 option quality flags remain private and do not mutate/publish questions.
BEGIN;
DO $verify$
DECLARE v_n integer; v_invalid integer; v_review integer;
BEGIN
 -- A heuristic cue is NOT a broken schema: a reviewed production bank may have
 -- zero length-signals even when CI synthetic fixtures have >100.
 -- Structural errors and missing published baseline ARE release regressions.
 SELECT count(*),count(*) FILTER(WHERE invalid_y1_contract)
 INTO v_n,v_invalid
 FROM public.pedagogy_option_quality_flags WHERE status='published';
 IF v_n<160 OR v_invalid<>0 THEN
   RAISE EXCEPTION 'Published pedagogy Y1 contract invalid: total %, broken %',
     v_n,v_invalid;
 END IF;
 SELECT count(*) INTO v_review
 FROM public.pedagogy_option_quality_flags WHERE status='review';
 -- CI still has review drafts; the owner-approved production bank may have zero.
 IF v_review<200 AND
   (SELECT count(*) FROM public.questions
     WHERE group_code IN ('KS','PM.GEN','PM.MET') AND status='published')<360 THEN
   RAISE EXCEPTION 'Neither draft inventory nor published owner-approved bank is present';
 END IF;
 IF NOT EXISTS (
   SELECT 1 FROM pg_class c
   WHERE c.oid='public.pedagogy_option_quality_flags'::regclass
     AND 'security_invoker=true'=ANY(c.reloptions)
 ) THEN
   RAISE EXCEPTION 'Private quality view must be security_invoker';
 END IF;
 IF has_table_privilege('anon','public.pedagogy_option_quality_flags','SELECT')
   OR has_table_privilege('authenticated','public.pedagogy_option_quality_flags','SELECT') THEN
   RAISE EXCEPTION 'Key-derived editorial quality view must be inaccessible to learners';
 END IF;
 -- Previously user-reported pedagogik takt regression: channel badge is not
 -- an explanation. Published revision must explain the pedagogic distinction.
 IF EXISTS (
   SELECT 1 FROM public.questions q
   JOIN public.question_keys k ON k.question_id=q.id
   WHERE q.status='published' AND q.stem_md ILIKE '%pedagogik taktga xos%'
     AND (k.explanation_md NOT ILIKE '%xatoni%' OR k.explanation_md NOT ILIKE '%hurmat%')
 ) THEN
   RAISE EXCEPTION 'Pedagogik takt published explanation lost its reasoning';
 END IF;
 -- An approved owner batch can legitimately publish these draft identifiers,
 -- but an item must have an actual four-part editorial approval record.
 IF EXISTS(
   SELECT 1 FROM public.questions q
   WHERE q.source_reference LIKE 'authored:m15-topictest-20261018:%'
     AND q.status='published'
     AND NOT EXISTS (
       SELECT 1 FROM public.question_editorial_checks ec
       WHERE ec.question_id=q.id
         AND ec.answer_verified AND ec.reference_verified
         AND ec.wording_verified AND ec.original_authorship_verified
     )
 ) THEN
   RAISE EXCEPTION 'M15 item published without recorded editorial approval';
 END IF;
END
$verify$;
SELECT 'private_pedagogy_option_quality_flags_ok' AS result;
ROLLBACK;

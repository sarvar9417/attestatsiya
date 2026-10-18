-- TASK-205 targeted correction on unpublished V3-B009; non-destructive old history.
BEGIN;
DO $fix$
DECLARE qid uuid; c uuid; stem text;
BEGIN
SELECT q.id,q.stem_md INTO qid,stem FROM public.questions q
WHERE q.source_reference='algoritmlash-v3:ALG-V3-B009' FOR UPDATE;
IF qid IS NULL THEN RAISE EXCEPTION 'Missing V3-B009'; END IF;
IF NOT EXISTS(SELECT 1 FROM public.questions WHERE id=qid AND status='review') THEN RAISE EXCEPTION 'Published/locked question cannot be edited'; END IF;
IF stem NOT IN('S:=0; FOR i:=1..4 DO IF i mod 2=0 THEN S:=S+i. S?',
'S:=0; FOR i:=1..5 DO IF i mod 2<>0 THEN S:=S+i*i. S?') THEN
 RAISE EXCEPTION 'Unexpected V3-B009 stem'; END IF;
UPDATE public.questions SET stem_md='S:=0; FOR i:=1..5 DO IF i mod 2<>0 THEN S:=S+i*i. S?',updated_at=now()
WHERE id=qid;
UPDATE public.question_options SET content_md=
CASE order_idx WHEN 0 THEN '25' WHEN 1 THEN '35' WHEN 2 THEN '45' WHEN 3 THEN '55' ELSE content_md END
WHERE question_id=qid AND side='a';
IF (SELECT count(*) FROM public.question_options WHERE question_id=qid AND side='a')<>4 THEN RAISE EXCEPTION 'Unexpected option count'; END IF;
SELECT id INTO c FROM public.question_options WHERE question_id=qid AND side='a' AND order_idx=1;
UPDATE public.question_keys SET payload=jsonb_build_object('correct_option_id',c::text),
explanation_md='Toq qiymatlar 1,3,5: 1²+3²+5²=35. Manba: 9-sinf ICT PDF 41–45; savol original izma-iz ijro mashqi.',updated_at=now() WHERE question_id=qid;
IF NOT FOUND THEN RAISE EXCEPTION 'Missing key'; END IF;
END $fix$;
COMMIT;
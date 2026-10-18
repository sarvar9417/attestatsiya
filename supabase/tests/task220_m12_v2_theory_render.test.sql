-- TASK-220 network V2 reader fidelity and unpublished-content invariants.
BEGIN;
DO $t$
DECLARE v_lessons int; v_tables int; v_diagrams int; v_math int; v_bad int;
BEGIN
 SELECT count(*),
   sum((length(l.body_mdx)-length(replace(l.body_mdx,'| ---','')))/5),
   sum((length(l.body_mdx)-length(replace(l.body_mdx,'[[NETFIG:','')))/9),
   sum((length(l.body_mdx)-length(replace(l.body_mdx,chr(92)||'[','')))/2)
 INTO v_lessons,v_tables,v_diagrams,v_math
 FROM public.lessons l JOIN public.modules m ON m.id=l.module_id
 WHERE m.code='M12' AND l.slug ~ '^tarmoq-v2-bob-(0[1-9]|10)$'
   AND l.status='draft'::public.content_status;
 IF v_lessons<>10 OR v_tables<>20 OR v_diagrams<>3 OR v_math<7 THEN
   RAISE EXCEPTION 'TASK220 reader blocks failed lessons %, tables %, figures %, display math %',
      v_lessons,v_tables,v_diagrams,v_math;
 END IF;
 SELECT count(*) INTO v_bad FROM public.lessons l JOIN public.modules m ON m.id=l.module_id
 WHERE m.code='M12' AND l.slug ~ '^tarmoq-v2-bob-(0[1-9]|10)$'
   AND (position(chr(92)||'begin{tabularx}' in l.body_mdx)>0
        OR position(chr(92)||'begin{goal}' in l.body_mdx)>0
        OR length(trim(l.body_mdx))<1800);
 IF v_bad>0 THEN RAISE EXCEPTION 'TASK220 unconverted TeX or truncated lessons: %',v_bad; END IF;
 SELECT count(*) INTO v_bad FROM public.lessons l JOIN public.modules m ON m.id=l.module_id
 WHERE m.code='M12' AND l.slug IN
 ('tarmoqlar-va-qurilmalar','arxitektura-va-topologiyalar','ip-manzil-va-tarmoq-maskasi',
  'internetdan-xavfsiz-va-maqsadli-foydalanish','brauzer-qidiruv-dns')
 AND l.status='published'::public.content_status;
 IF v_bad<>5 THEN RAISE EXCEPTION 'TASK220 published legacy lessons changed: %',v_bad; END IF;
END $t$;
ROLLBACK;

-- TASK-220: exact server-side native Y2/Y3 key-option membership and uniqueness.
-- Uses source_ref prefix to scope checks to M12 V2 only; rollback ensures no mutations.
BEGIN;
DO $audit$
DECLARE bad int;
BEGIN
 SELECT count(*) INTO bad FROM public.questions q
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'network-v2-20261018:%'
   AND (
     (q.format='Y2' AND
       ((SELECT count(*) FROM jsonb_each_text(k.payload->'pairs'))<>3
        OR EXISTS(SELECT 1 FROM jsonb_each_text(k.payload->'pairs') p
          WHERE NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.side='a' AND o.id::text=p.key)
             OR NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.side='b' AND o.id::text=p.value))
        OR (SELECT count(DISTINCT value) FROM jsonb_each_text(k.payload->'pairs'))<>3))
     OR
     (q.format='Y3' AND
       (jsonb_array_length(k.payload->'order') <> (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')
        OR EXISTS(SELECT 1 FROM jsonb_array_elements_text(k.payload->'order') ord
           WHERE NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.id::text=ord.value AND o.question_id=q.id AND o.side='a'))
        OR (SELECT count(DISTINCT value) FROM jsonb_array_elements_text(k.payload->'order'))<>(SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')))
   );
 IF bad<>0 THEN RAISE EXCEPTION 'M12 native Y2/Y3 key membership errors: %',bad;END IF;
END $audit$;
ROLLBACK;

-- Supabase M04 review-only audit. No updates or keys exposed.
WITH canonical AS (
 SELECT l.id,l.order_idx,l.slug,l.status,length(coalesce(l.body_mdx,'')) theory_chars
 FROM public.lessons l JOIN public.modules m ON m.id=l.module_id
 WHERE m.code='M04' AND l.status='published'::public.content_status
), bank AS (
 SELECT q.id,q.format,q.status,q.source_lesson_id,q.stem_md,k.payload
 FROM public.questions q LEFT JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'm04-sourceaudit-20261018-v1:%'
), checks AS (
 SELECT b.id,b.format,b.status,
   EXISTS(SELECT 1 FROM canonical c WHERE c.id=b.source_lesson_id) linked,
   (SELECT count(*) FROM public.question_options o WHERE o.question_id=b.id) options_total,
   CASE WHEN b.format='Y1' THEN EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=b.id AND o.id::text=b.payload->>'correct_option_id')
        WHEN b.format='Y2' THEN jsonb_typeof(b.payload->'pairs')='object'
          AND NOT EXISTS(SELECT 1 FROM jsonb_each_text(b.payload->'pairs') p WHERE NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=b.id AND o.id::text=p.key AND o.side='a') OR NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=b.id AND o.id::text=p.value AND o.side='b'))
        WHEN b.format='Y3' THEN jsonb_typeof(b.payload->'order')='array' AND jsonb_array_length(b.payload->'order')=(SELECT count(*) FROM public.question_options o WHERE o.question_id=b.id)
          AND NOT EXISTS(SELECT 1 FROM jsonb_array_elements_text(b.payload->'order') t(v) WHERE NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=b.id AND o.id::text=t.v))
        ELSE false END as key_valid
 FROM bank b
)
SELECT jsonb_build_object(
 'canonical_published_lessons',(SELECT count(*) FROM canonical),
 'theory_m04_05_added',(SELECT count(*) FROM canonical c JOIN public.lessons l ON l.id=c.id WHERE c.order_idx=5 AND position('M04-SOURCEAUDIT-20261018-01' in l.body_mdx)>0),
 'theory_m04_06_added',(SELECT count(*) FROM canonical c JOIN public.lessons l ON l.id=c.id WHERE c.order_idx=6 AND position('M04-SOURCEAUDIT-20261018-01' in l.body_mdx)>0),
 'review_bank_rows',(SELECT count(*) FROM checks),
 'correctly_linked',(SELECT count(*) FROM checks WHERE linked),
 'key_valid',(SELECT count(*) FROM checks WHERE key_valid),
 'formats',(SELECT jsonb_agg(to_jsonb(t)) FROM (SELECT format,status,count(*) as n FROM checks GROUP BY format,status ORDER BY format)t),
 'archived_old_duplicates',(SELECT count(*) FROM public.questions WHERE source_reference IN (
   'm04-latex2026-v2:MAN-02-020','m04-latex2026-v2:MAN-02-022','m04-latex2026-v2:MAN-02-024',
   'm04-latex2026-v2:MAN-03-021','m04-latex2026-v2:MAN-06-024',
   'm04-latex2026-v2:MAN-06-029','m04-latex2026-v2:MAN-06-030') AND status='archived')
) AS audit;
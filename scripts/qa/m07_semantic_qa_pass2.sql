-- M07 expert pass 2: zero-write QA after publication
WITH questions AS (
 SELECT q.* FROM public.questions q JOIN public.lessons l ON l.id=q.source_lesson_id
 JOIN public.modules m ON m.id=l.module_id
 WHERE m.code='M07' AND l.order_idx BETWEEN 1 AND 12
)
SELECT jsonb_build_object(
 'published',(SELECT count(*) FROM questions WHERE status='published'),
 'review',(SELECT count(*) FROM questions WHERE status='review'),
 'old_answer_leaks',(SELECT count(*) FROM questions WHERE status='published' AND stem_md LIKE '%**Shakl tasviri:**%'),
 'misleading_drawing_move',(SELECT count(*) FROM questions WHERE status='published' AND stem_md LIKE 'Chizmani chapga 40 birlikka iz qoldirmasdan ko‘chirib%'),
 'pen_semantics_fixed',(SELECT count(*) FROM questions WHERE status='published' AND source_reference LIKE 'Scratch-LOGO-2026-v3.1:SL3-Y3-05-02;%' AND stem_md LIKE '%eski chizilgan chiziqlar joyida qoladi%'),
 'logo_cards_fixed',(SELECT count(*) FROM questions WHERE status='published' AND source_reference LIKE 'Scratch-LOGO-2026-v3.1:SL3-Y3-06-02;%' AND stem_md LIKE '%bitta kartochkada%'),
 'if_else_pseudocode_fixed',(SELECT count(*) FROM questions WHERE status='published' AND source_reference LIKE 'Scratch-LOGO-2026-v3.1:SL3-Y3-04-02;%' AND stem_md LIKE '%mustaqil%else%blok%'),
 'repeat_until_stem_fixed',(SELECT count(*) FROM questions WHERE status='published' AND source_reference LIKE 'Scratch-LOGO-2026-v2:SL2-02-027;%' AND stem_md LIKE '%score > 5%'),
 'missing_key',(SELECT count(*) FROM questions q WHERE q.status='published' AND
   (SELECT count(*) FROM public.question_keys k WHERE k.question_id=q.id)<>1)
) AS m07_semantic_qa;

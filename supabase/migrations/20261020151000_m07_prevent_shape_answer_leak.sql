-- Prevent answer leakage: eleven M07 legacy question stems inadvertently embed
-- **Shakl tasviri:** followed by the CORRECT resulting shape.
-- The response options/key and attempt references remain unchanged.
UPDATE public.questions q
SET stem_md=split_part(stem_md,E'\n\n**Shakl tasviri:**',1),updated_at=now()
WHERE q.source_reference LIKE 'Scratch-LOGO-2026-v2:SL2-%'
 AND q.status='published'::content_status
 AND position(E'\n\n**Shakl tasviri:**' in q.stem_md)>0;

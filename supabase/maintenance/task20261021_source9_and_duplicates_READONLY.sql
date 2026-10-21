-- READ ONLY: validate nine source-reference remedies in LOCAL database.
-- No private stems, choices, answer-key values or publication decisions are returned.
-- This also works on a production snapshot as SELECTs only; DO NOT apply patch there.

-- A) Each source alias has ONE current review candidate; archived editions are history.
WITH expected(source_alias) AS (VALUES
 ('GV2:GV-ED-027'),
 ('GV2:GV-ED-039'),
 ('GV2:GV-ED-040'),
 ('GV2:GV-ED-046'),
 ('GV2:GV-HT-024'),
 ('GV2:GV-RV-006'),
 ('GV2:GV-RV-019'),
 ('GV2:GV-RV-020'),
 ('GV2:GV-RV-021')
)
SELECT q.status::text AS status,count(*) AS found,
       count(DISTINCT e.source_alias) AS distinct_aliases,
       count(*) FILTER (
         WHERE q.source_reference LIKE '%QA-SUPPLEMENT-20261021%'
       ) AS with_supplemental_evidence
FROM expected e JOIN public.questions q
 ON split_part(q.source_reference,';',1)=e.source_alias
GROUP BY q.status ORDER BY q.status;

-- B) Y1 keys remain structurally present but never expose correct option IDs.
WITH expected(source_alias) AS (VALUES
 ('GV2:GV-ED-027'),
 ('GV2:GV-ED-039'),
 ('GV2:GV-ED-040'),
 ('GV2:GV-ED-046'),
 ('GV2:GV-HT-024'),
 ('GV2:GV-RV-006'),
 ('GV2:GV-RV-019'),
 ('GV2:GV-RV-020'),
 ('GV2:GV-RV-021')
), review_pool AS (
 SELECT q.id,q.format::text AS format,q.source_reference,q.stem_md,k.payload,
        count(o.id) AS nopts,
        count(o.id) FILTER (
          WHERE o.id::text=k.payload->>'correct_option_id'
        ) AS key_hits
 FROM expected e JOIN public.questions q
  ON split_part(q.source_reference,';',1)=e.source_alias
  AND q.status='review'
 LEFT JOIN public.question_keys k ON k.question_id=q.id
 LEFT JOIN public.question_options o ON o.question_id=q.id
 GROUP BY q.id,q.format,q.source_reference,q.stem_md,k.payload
)
SELECT count(*) AS review_questions,
       count(*) FILTER (WHERE format<>'Y1' OR payload IS NULL OR nopts<>4 OR key_hits<>1)
         AS broken_y1_structure,
       count(*) FILTER (WHERE source_reference LIKE '%QA-SUPPLEMENT-20261021%')
         AS citation_patched,
       count(*) FILTER (WHERE source_reference LIKE '%expert review required%')
         AS release_gate_preserved,
       count(*) FILTER (
         WHERE split_part(source_reference,';',1)='GV2:GV-ED-027'
           AND stem_md LIKE 'Paint.NET dasturidagi %'
       ) AS corrected_ambiguous_paint_stem
FROM review_pool;

-- C) Manual follow-up: the previous 59-review evidence matrix includes
-- 29 *possible* same-concept repetitions across 10 clusters.
-- These do not warrant deletion; selection/diversity gates need separate QA.
WITH risk(source_alias, cluster_code) AS (VALUES
('GV2:GV-CS-039','box_model'),
('GV2:GV-CS-040','box_model'),
('GV2:GV-CS-041','box_model'),
('GV2:GV-CS-042','box_model'),
('GV2:GV-CS-043','box_model'),
('GV2:GV-CS-051','box_model'),
('GV2:GV-CS-052','box_model'),
('GV2:GV-ED-006','lasso'),
('GV2:GV-ED-028','lasso'),
('GV2:GV-ED-008','mask_use'),
('GV2:GV-ED-020','mask_use'),
('GV2:GV-ED-009','psd'),
('GV2:GV-ED-014','psd'),
('GV2:GV-ED-034','psd'),
('GV2:GV-ED-039','mask_colors'),
('GV2:GV-ED-040','mask_colors'),
('GV2:GV-GFX-034','palette_bits'),
('GV2:GV-GFX-043','palette_bits'),
('GV2:GV-GFX-037','pixel_count'),
('GV2:GV-GFX-038','pixel_count'),
('GV2:GV-GFX-039','pixel_count'),
('GV2:GV-GFX-041','pixel_count'),
('GV2:GV-GFX-042','pixel_count'),
('GV2:GV-GFX-049','raw_bytes'),
('GV2:GV-RV-016','raw_bytes'),
('GV2:GV-RV-005','bit_depth'),
('GV2:GV-RV-006','bit_depth'),
('GV2:GV-RV-019','vector_boolean'),
('GV2:GV-RV-020','vector_boolean')
)
SELECT r.cluster_code,count(*) AS candidate_review_items,
       count(q.id) AS matched_current_review_items
FROM risk r LEFT JOIN public.questions q
 ON split_part(q.source_reference,';',1)=r.source_alias
 AND q.status='review'
GROUP BY r.cluster_code ORDER BY candidate_review_items DESC,r.cluster_code;

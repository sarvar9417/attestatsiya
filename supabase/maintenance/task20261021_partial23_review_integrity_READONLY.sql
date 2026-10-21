-- TASK-20261021: Remaining 23 partial-evidence REVIEW items. READ ONLY.
-- Checks structural integrity and legacy archived editions without exposing
-- answer text, correct option IDs, or private exam keys.
WITH expected(alias) AS (VALUES
    ('GV2:GV-CS-039'),
    ('GV2:GV-CS-040'),
    ('GV2:GV-CS-041'),
    ('GV2:GV-CS-042'),
    ('GV2:GV-CS-043'),
    ('GV2:GV-CS-051'),
    ('GV2:GV-CS-052'),
    ('GV2:GV-ED-020'),
    ('GV2:GV-ED-037'),
    ('GV2:GV-ED-040'),
    ('GV2:GV-ED-041'),
    ('GV2:GV-GFX-008'),
    ('GV2:GV-GFX-034'),
    ('GV2:GV-GFX-037'),
    ('GV2:GV-GFX-038'),
    ('GV2:GV-GFX-039'),
    ('GV2:GV-GFX-041'),
    ('GV2:GV-GFX-042'),
    ('GV2:GV-GFX-043'),
    ('GV2:GV-GFX-049'),
    ('GV2:GV-HT-014'),
    ('GV2:GV-HT-019'),
    ('GV2:GV-RV-016')
),
cohort AS (
 SELECT e.alias,q.id,q.status::text AS status,q.format::text AS format,
        k.payload,count(o.id) AS option_count,
        count(o.id) FILTER (WHERE o.id::text=k.payload->>'correct_option_id') AS key_hits
 FROM expected e LEFT JOIN public.questions q
 ON split_part(q.source_reference,';',1)=e.alias
 LEFT JOIN public.question_keys k ON k.question_id=q.id
 LEFT JOIN public.question_options o ON o.question_id=q.id
 GROUP BY e.alias,q.id,q.status,q.format,k.payload
)
SELECT status,count(*) AS records,count(DISTINCT alias) AS aliases,
       count(*) FILTER(WHERE status='review' AND (format<>'Y1' OR payload IS NULL OR option_count<>4 OR key_hits<>1)) AS invalid_current_y1_structure
FROM cohort GROUP BY status ORDER BY status;

-- Read-only per-topic counts (no actual answers or stems).
WITH expected(alias) AS (VALUES
    ('GV2:GV-CS-039'),
    ('GV2:GV-CS-040'),
    ('GV2:GV-CS-041'),
    ('GV2:GV-CS-042'),
    ('GV2:GV-CS-043'),
    ('GV2:GV-CS-051'),
    ('GV2:GV-CS-052'),
    ('GV2:GV-ED-020'),
    ('GV2:GV-ED-037'),
    ('GV2:GV-ED-040'),
    ('GV2:GV-ED-041'),
    ('GV2:GV-GFX-008'),
    ('GV2:GV-GFX-034'),
    ('GV2:GV-GFX-037'),
    ('GV2:GV-GFX-038'),
    ('GV2:GV-GFX-039'),
    ('GV2:GV-GFX-041'),
    ('GV2:GV-GFX-042'),
    ('GV2:GV-GFX-043'),
    ('GV2:GV-GFX-049'),
    ('GV2:GV-HT-014'),
    ('GV2:GV-HT-019'),
    ('GV2:GV-RV-016')
)
SELECT split_part(e.alias,'-',2) AS family,
       count(*) AS expected_count,
       count(q.id) FILTER(WHERE q.status='review') AS current_review_count
FROM expected e LEFT JOIN public.questions q
  ON split_part(q.source_reference,';',1)=e.alias
GROUP BY 1 ORDER BY 1;

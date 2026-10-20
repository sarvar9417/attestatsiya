-- 2026-10-20 M07: amend twelve memorization/application questions mistakenly labeled 5/5 mulohaza.
-- Only exact immutable SL3 source ids and previous synthetic 5/5 labels are affected.
WITH revised(source_id,difficulty,cognitive) AS (VALUES
  ('SL3-01-005',1,'bilish'),
  ('SL3-01-010',2,'bilish'),
  ('SL3-02-005',1,'bilish'),
  ('SL3-02-010',1,'bilish'),
  ('SL3-03-005',2,'qollash'),
  ('SL3-03-010',3,'qollash'),
  ('SL3-04-005',1,'bilish'),
  ('SL3-04-010',3,'qollash'),
  ('SL3-05-005',2,'qollash'),
  ('SL3-05-010',1,'bilish'),
  ('SL3-06-005',3,'qollash'),
  ('SL3-06-010',3,'qollash')
)
UPDATE public.questions q SET difficulty=revised.difficulty, cognitive=revised.cognitive::cognitive_level,updated_at=now()
FROM revised
WHERE q.source_reference LIKE ('Scratch-LOGO-2026-v3:'||revised.source_id||';%')
 AND q.difficulty=5 AND q.cognitive='mulohaza'::cognitive_level;

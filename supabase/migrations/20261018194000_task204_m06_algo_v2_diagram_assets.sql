-- TASK-204: attach first-party vector diagrams to 12 not-yet-published questions.
-- No question status escalation; all diagram questions remain draft until editorial approval.
BEGIN;
CREATE TEMP TABLE _algo_diagrams(code text,diagram text,alt text) ON COMMIT DROP;
INSERT INTO _algo_diagrams VALUES ('ALG-02-020','flow_sum','A, B yig‘indisini topish blok-sxemasi'),
('ALG-02-025','flow_abs','Son modulini hisoblash blok-sxemasi'),
('ALG-03-027','flow_div','3 ga bo‘linish sharti bilan tarmoqlanish sxemasi'),
('ALG-04-025','flow_even','Juft sonlar yig‘indisi sikl sxemasi'),
('ALG-04-029','flow_loop','1 dan n gacha yig‘indi sikli'),
('ALG-05-019','flow_grade','Baholarni sanashning aralash algoritmi'),
('ALG-05-029','flow_even','Juft sonlar yig‘indisi algoritmi'),
('ALG-05-030','flow_euclid','Ayirish asosidagi Yevklid algoritmi'),
('ALG-06-026','flow_sign','Kiritilgan son ishorasini aniqlash sxemasi'),
('ALG-06-028','flow_max','Ikki sonning kattasini topish sxemasi'),
('ALG-07-025','graph_paths','A, B, C, D, E tugunlaridagi yo‘naltirilgan graf'),
('ALG-08-028','algo_compare','A(n)=3n va B(n)=n²+3 algoritmlarini solishtirish');
DO $$ BEGIN
IF (SELECT count(*) FROM _algo_diagrams)<>12 THEN RAISE EXCEPTION 'Missing mapping'; END IF;
IF (SELECT count(*) FROM public.questions q JOIN _algo_diagrams d ON q.source_reference='algoritmlash-v2:'||d.code WHERE q.status='draft')<>12
THEN RAISE EXCEPTION 'Unexpected diagram records: fail-closed'; END IF;
END $$;
UPDATE public.questions q SET
 assets=jsonb_build_array(jsonb_build_object(
   'kind','image','diagram_id',d.diagram,'src','/algoritmlash-v2/'||d.diagram||'.svg','alt',d.alt)),
 stem_md=regexp_replace(q.stem_md, E'\\n\\n\\*\\*Chizma talab qilinadi:\\*\\*[^\\n]*$', '', 'g'),
 updated_at=now()
FROM _algo_diagrams d WHERE q.source_reference='algoritmlash-v2:'||d.code AND q.status='draft';
DO $$ BEGIN
IF (SELECT count(*) FROM public.questions q JOIN _algo_diagrams d
ON q.source_reference='algoritmlash-v2:'||d.code
WHERE q.status='draft' AND jsonb_array_length(q.assets)=1
AND q.assets->0->>'src'='/algoritmlash-v2/'||d.diagram||'.svg')<>12
THEN RAISE EXCEPTION 'Diagram assets mismatch'; END IF;
END $$;
COMMIT;
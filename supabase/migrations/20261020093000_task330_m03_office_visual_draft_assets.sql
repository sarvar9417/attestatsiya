-- TASK-330: attach 7 original Office V2 visuals without promoting unreviewed questions.
-- Draft stays draft; published questions, answer keys, lessons and attempt snapshots are immutable.
BEGIN;
DO $task330$
DECLARE v record; n integer; found integer; before_text text; expected_src text;
BEGIN
  SELECT count(*) INTO found FROM public.questions q
    WHERE q.source_reference LIKE 'Office_2026_v2|OFF-%';
  IF found=0 THEN RAISE NOTICE 'Office V2 bank absent on fresh bootstrap; skipping visual draft migration'; RETURN; END IF;
  FOR v IN SELECT * FROM (VALUES
    ('OFF-E04-006','off_bar','bar.png','A, B va C sinflari: 18, 24, 12 nafar'),
    ('OFF-E04-012','off_line','line.png','Sentabr 40, oktabr 50, noyabr 45 topshiriq'),
    ('OFF-E04-018','off_pie','pie.png','Word 20%, Excel 30%, PowerPoint 50%'),
    ('OFF-E04-024','off_table','table.png','Ballar: 85, 68, 74, 59'),
    ('OFF-P01-018','off_slides','slides.png','Slayd sarlavha, matn va rasm joy ajratgichlari'),
    ('OFF-P02-018','off_timeline','timeline.png','On Click, With Previous, After Previous'),
    ('OFF-W03-018','off_wordtable','wordtable.png','5-A 28/26; 5-B 30/27 sinf jadvali')
  ) AS t(qcode,diagram,old_name,alt) LOOP
    expected_src := 'Office_2026_v2|'||v.qcode||'|%';
    SELECT count(*) INTO n FROM public.questions q WHERE q.source_reference LIKE expected_src;
    IF n<>1 THEN RAISE EXCEPTION 'Office visual code must occur exactly once: %, n=%',v.qcode,n; END IF;
    before_text:='[Rasm ilovasi hali biriktirilmagan: assets/'||v.old_name||'] ';
    UPDATE public.questions q SET
      stem_md = substr(q.stem_md,length(before_text)+1),
      assets = jsonb_build_array(jsonb_build_object('kind','image','diagram_id',v.diagram,
            'src','/office-v2/'||v.diagram||'.svg','alt',v.alt))
    WHERE q.source_reference LIKE expected_src
      AND q.status='draft'::public.content_status
      AND q.assets='[]'::jsonb
      AND left(q.stem_md,length(before_text))=before_text;
    GET DIAGNOSTICS n=ROW_COUNT;
    IF n=0 AND NOT EXISTS (
      SELECT 1 FROM public.questions q
      WHERE q.source_reference LIKE expected_src
        AND q.status='draft'::public.content_status
        AND q.assets @> jsonb_build_array(jsonb_build_object('diagram_id',v.diagram))
        AND q.stem_md NOT LIKE '[Rasm ilovasi hali biriktirilmagan:%'
    ) THEN RAISE EXCEPTION 'Unexpected state for visual draft %; no publish or overwrite attempted',v.qcode; END IF;
  END LOOP;
END
$task330$;
COMMIT;

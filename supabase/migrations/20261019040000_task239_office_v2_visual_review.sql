-- TASK-239. Idempotent, review-only Office V2 visual attachments.
-- Published content and prior attempts remain immutable.
BEGIN;
DO $office_visual$
DECLARE v record; found_count int; updated_count int;
BEGIN
  FOR v IN SELECT * FROM (VALUES
    ('OFF-E04-006','off_bar','A sinf 18, B sinf 24, C sinf 12 nafar'),
    ('OFF-E04-012','off_line','Sentabr 40, oktabr 50, noyabr 45 topshiriq'),
    ('OFF-E04-018','off_pie','Word 20%, Excel 30%, PowerPoint 50%'),
    ('OFF-E04-024','off_table','Aziza 85, Bekzod 68, Diyor 74, Dilnoza 59'),
    ('OFF-P01-018','off_slides','Slayd sarlavha, matn va rasm joy ajratgichlari'),
    ('OFF-P02-018','off_timeline','On Click, With Previous, After Previous'),
    ('OFF-W03-018','off_wordtable','5-A: jami 28, kelgan 26; 5-B: jami 30, kelgan 27')
  ) AS x(qcode,diagram,description) LOOP
    SELECT count(*) INTO found_count
      FROM public.questions q
      JOIN public.lessons l ON l.id=q.source_lesson_id
      WHERE l.slug LIKE 'office-v2-%'
      AND q.source_reference LIKE ('Office_2026_v2|'||v.qcode||'|%');
    IF found_count > 1 THEN
      RAISE EXCEPTION 'Duplicate Office V2 code: %',v.qcode;
    END IF;
    IF found_count = 1 THEN
      UPDATE public.questions q
      SET assets = jsonb_build_array(jsonb_build_object(
        'kind','image','diagram_id',v.diagram,
        'src','/office-v2/'||v.diagram||'.svg','alt',v.description)),
      stem_md = replace(q.stem_md,
        '[Rasm ilovasi hali biriktirilmagan: assets/'||
        substring(v.diagram from 5)||'.png] ', ''),
      status = 'review'::public.content_status
      WHERE q.source_reference LIKE ('Office_2026_v2|'||v.qcode||'|%')
        AND q.status = 'draft'::public.content_status
        AND q.stem_md LIKE '[Rasm ilovasi hali biriktirilmagan:%';
      GET DIAGNOSTICS updated_count = ROW_COUNT;
      IF updated_count=0 AND NOT EXISTS(
        SELECT 1 FROM public.questions q
        WHERE q.source_reference LIKE ('Office_2026_v2|'||v.qcode||'|%')
        AND q.status='review'::public.content_status
        AND q.assets @> jsonb_build_array(jsonb_build_object('diagram_id',v.diagram))
      ) THEN
        RAISE EXCEPTION 'Unexpected Office V2 question state: %',v.qcode;
      END IF;
    END IF;
  END LOOP;
END
$office_visual$;
COMMIT;

-- TASK-205: replace six original V2 diagram placeholders by local SVGs in review lessons.
-- No published history touched. One V3 diagram is also attached to new source lesson.
BEGIN;
DO $fix$
DECLARE
 needle text := '[Blok-sxemaning asl chizmasi V2 PDF qo‘llanmasida mavjud; veb uchun grafik qayta tayyorlanishi kerak.]';
 rec record; original text; changed text; p integer; n integer;
BEGIN
 FOR rec IN
 SELECT * FROM (VALUES
  ('algoritmlash-v2-02',1,'![Yig‘indi algoritmining blok-sxemasi](/algoritmlash-v2/flow_sum.svg)'),
  ('algoritmlash-v2-02',2,'![Ikki sondan maksimumni tanlash blok-sxemasi](/algoritmlash-v2/flow_max.svg)'),
  ('algoritmlash-v2-04',1,'![Bir dan n gacha yig‘indi blok-sxemasi](/algoritmlash-v2/flow_sum.svg)'),
  ('algoritmlash-v2-05',1,'![Besh baholar sonini hisoblash blok-sxemasi](/algoritmlash-v2/flow_grade.svg)'),
  ('algoritmlash-v2-05',2,'![Ayirishli Yevklid algoritmining blok-sxemasi](/algoritmlash-v2/flow_euclid.svg)'),
  ('algoritmlash-v2-07',1,'![Qoldiqli Yevklid algoritmining blok-sxemasi](/algoritmlash-v3/flow_euclid_mod.svg)')
 ) x(slug,seq,image) ORDER BY slug,seq
 LOOP
  SELECT body_mdx INTO original FROM public.lessons WHERE slug=rec.slug AND status='review' FOR UPDATE;
  -- Fresh bootstrap runs this migration before TASK-204 V2 migrations;
  -- defer V2-only diagram replacement to the late forward migration.
  IF original IS NULL THEN CONTINUE; END IF;
  p:=strpos(original,needle);
  IF p=0 THEN
    IF strpos(original,rec.image)>0 THEN CONTINUE; END IF;
    RAISE EXCEPTION 'Missing placeholder without expected image: % / %',rec.slug,rec.seq;
  END IF;
  changed:=overlay(original placing rec.image from p for char_length(needle));
  IF rec.slug='algoritmlash-v2-05' THEN
   changed:=replace(changed,'\resizebox{.88\textwidth}{!}{','');
   changed:=replace(changed,'\resizebox{.80\textwidth}{!}{','');
   changed:=replace(changed,rec.image||'}',rec.image);
  END IF;
  UPDATE public.lessons SET body_mdx=changed,updated_at=now() WHERE slug=rec.slug;
 END LOOP;
 SELECT body_mdx INTO original FROM public.lessons WHERE slug='algoritmlash-v3-shart-keyin-sikl' AND status='review' FOR UPDATE;
 IF original IS NULL OR strpos(original,'## 9.2.')=0 THEN RAISE EXCEPTION 'V3 base absent'; END IF;
 IF strpos(original,'(/algoritmlash-v3/loop_until.svg)')=0 THEN
  changed:=replace(original,'## 9.2.','![GACHA siklida avval tana bajarilib keyin chiqish sharti tekshiriladi](/algoritmlash-v3/loop_until.svg)'||E'\n\n'||'## 9.2.');
  UPDATE public.lessons SET body_mdx=changed,updated_at=now() WHERE slug='algoritmlash-v3-shart-keyin-sikl';
 END IF;
 FOR rec IN SELECT id,body_mdx FROM public.lessons
 WHERE slug IN('algoritmlash-v2-02','algoritmlash-v2-04','algoritmlash-v2-05','algoritmlash-v2-07','algoritmlash-v3-shart-keyin-sikl') AND status='review'
 LOOP
  UPDATE public.lessons SET blocks=jsonb_set(blocks,'{1,content}',to_jsonb(rec.body_mdx),false) WHERE id=rec.id;
 END LOOP;
 SELECT count(*) INTO n FROM public.lessons WHERE slug LIKE 'algoritmlash-v2-%'
   AND body_mdx LIKE '%'||needle||'%';
 -- On a clean seed before TASK-204, the V2 lessons are not yet installed.
 IF (SELECT count(*) FROM public.lessons WHERE slug LIKE 'algoritmlash-v2-%')>0 AND n<>0 THEN
  RAISE EXCEPTION 'Remaining V2 diagram placeholders: %',n;
 END IF;
END $fix$;
COMMIT;
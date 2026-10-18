-- TASK-212 strict-correct-longest correction batch B (10 KS questions)
-- WARNING: PRIVILEGED OPERATOR ONLY. Requires explicit 2026-10-18 owner waiver.
-- Full original correct answer, key and explanation preserved, only one semantically
-- rewritten distractor per source. Immutable new revision; original is ARCHIVED.
-- Execute with final COMMIT replaced by ROLLBACK for complete rehearsal first.
-- The SQL must not be deployed as automatic Supabase migration.
BEGIN;
SET LOCAL lock_timeout='20s';
SET LOCAL statement_timeout='180s';
CREATE TEMP TABLE task212_first10(ref text PRIMARY KEY,ord integer,old_text text,new_text text) ON COMMIT DROP;
INSERT INTO task212_first10 VALUES
('authored:pedagogy-pdf-corpus:v1:KS.02:001',1,'Guruhli ishni butunlay bekor qilib ma’ruza o‘tish','Guruhli ishni bekor qilib, topshiriqni faqat ma’ruza orqali tushuntirish'),
('authored:pedagogy-pdf-corpus:v1:KS.03:001',1,'Faqat noto‘g‘ri ekanini aytib bahoni yozish','Noto‘g‘ri ekanini aytib, aniq izohsiz bahoni jurnalga yozish'),
('authored:pedagogy-pdf-corpus:v1:KS.04:002',1,'Barcha qarorlarni o‘qituvchi yolg‘iz qabul qilishi','Tadbirga doir barcha qarorlarni faqat o‘qituvchining yolg‘iz o‘zi belgilashi'),
('authored:pedagogy-pdf-corpus:v1:KS.07:002',1,'O‘quvchi haqidagi barcha ma’lumotni cheklovsiz tarqatish','O‘quvchi haqidagi barcha kuzatuvlarni cheklovsiz har bir hamkasbga tarqatish'),
('authored:pedguli-html-concepts:v3:KS.07:204',2,'Sinfning barcha shaxsiy qaydlarini misol sifatida batafsil muhokama qilish','Sinfning barcha shaxsiy qaydlarini boshqa bolalar bilan birgalikda batafsil muhokama qilish'),
('authored:pedguli-topic-audit:v4:KS.02:320',1,'Dars davomida vaqtni o‘lchamasdan, barcha materialni avvalgidek davom ettirish','Dars davomida vaqtni umuman o‘lchamasdan, barcha materialni avvalgidek davom ettirish'),
('revision:pedagogy:4208f80b-9301-4e93-8a9e-a866415bd13f',1,'Chunki umumiy jazo uchun barcha o‘quvchilarning oldindan yozma roziligi olinishi majburiy','Chunki umumiy jazo uchun barcha o‘quvchilarning oldindan yozma roziligi hamda bir xil bahosi olinishi majburiy'),
('revision:pedagogy:75000000-0000-4000-8000-000000000006',1,'Xato joyini ko‘rsatmasdan dasturini butunlay qayta yozishni aytish','Xato joyini ko‘rsatmasdan o‘quvchiga butun dasturini boshidan qayta yozishni talab qilish'),
('revision:pedagogy:75000000-0000-4000-8000-000000000010',1,'Holatni muhokama qilish uchun xabar nusxasini sinf guruhiga yuborish','Holatni umumiy muhokama qilish uchun haqoratli xabar nusxasini sinf guruhiga yuborish'),
('revision:pedagogy:fb854e85-12e5-4c45-bd26-556a70463eda',1,'Sinf o‘rtachasi bilan bir marta solishtirib, vaziyatga qo‘shimcha aralashmasdan kutish','Sinf o‘rtachasi bilan bir martagina solishtirib, qo‘shimcha aralashuvsiz yana bir necha oy kutish');
DO $task$
DECLARE actor uuid; n int; rec record; rev uuid;
BEGIN
  SELECT count(*) INTO n FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
  IF n<>1 THEN RAISE EXCEPTION 'TASK212_ABORT_OWNER_COUNT_%',n; END IF;
  SELECT id INTO actor FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
  SELECT count(*) INTO n FROM task212_first10 e
    JOIN public.questions q ON q.source_reference=e.ref AND q.status='published' AND q.format='Y1'
    JOIN public.question_options o ON o.question_id=q.id AND o.order_idx=e.ord AND trim(o.side)='a' AND o.content_md=e.old_text
    JOIN public.question_keys k ON k.question_id=q.id AND o.id::text <> k.payload->>'correct_option_id'
    LEFT JOIN public.pedagogy_revision_queue r ON r.source_question_id=q.id
    WHERE q.group_code IN ('KS','PM.GEN','PM.MET') AND r.source_question_id IS NULL;
  IF n<>10 THEN RAISE EXCEPTION 'TASK212_ABORT_DRIFT_EXPECTED10_GOT_%',n; END IF;
  -- Use the original wrong-option order to construct EXACT three-proposal array.
  FOR rec IN
    SELECT q.id source_id, e.ref, array_agg(
       CASE WHEN o.order_idx=e.ord THEN e.new_text ELSE o.content_md END
       ORDER BY o.order_idx,o.id
    ) FILTER (WHERE o.id::text<>(k.payload->>'correct_option_id')) AS wrong_texts
    FROM task212_first10 e JOIN public.questions q ON q.source_reference=e.ref AND q.status='published'
    JOIN public.question_options o ON o.question_id=q.id AND trim(o.side)='a'
    JOIN public.question_keys k ON k.question_id=q.id
    GROUP BY q.id,e.ref
  LOOP
    IF coalesce(array_length(rec.wrong_texts,1),0)<>3 THEN RAISE EXCEPTION 'TASK212_ABORT_DISTRACTOR_COUNT_%',rec.ref; END IF;
    INSERT INTO public.pedagogy_revision_queue(source_question_id,reason)
      VALUES (rec.source_id,'OWNER strict-longest correct-option correction; new immutable revision, 2026-10-18');
    INSERT INTO public.pedagogy_rewrite_proposals(source_question_id,proposed_distractors,provenance,proposal_status)
      VALUES(rec.source_id,rec.wrong_texts,'AI-assisted semantically rewritten KS distractor; explicit owner waived independent expert; source and correct key retained.','draft');
    rev:=public.stage_pedagogy_revision(rec.source_id,actor);
    INSERT INTO public.pedagogy_owner_release_waivers(question_id,authorized_by,content_fingerprint,authority,provenance,source_question_id)
      VALUES(rev,actor,public.professional_question_fingerprint(rev),
      'owner_explicit_no_external_expert_20261018',
      'Owner authorized strict-longest Y1 correction. Old question archived, correct answer and explanation unchanged, no external expert signoff claimed.',rec.source_id);
    PERFORM public.publish_pedagogy_revision(rev,actor);
  END LOOP;
  SELECT count(*) INTO n FROM task212_first10 e
   JOIN public.questions q ON q.source_reference=e.ref
   WHERE q.status='archived';
  IF n<>10 THEN RAISE EXCEPTION 'TASK212_ABORT_NOT_ARCHIVED_%',n; END IF;
  WITH lengths AS (
    SELECT w.question_id,
      max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) FILTER (WHERE o.id::text=k.payload->>'correct_option_id') cw,
      max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) FILTER (WHERE o.id::text<>k.payload->>'correct_option_id') mw,
      min(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) mn,
      max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) mx,
      count(DISTINCT lower(trim(o.content_md))) distinct_options
    FROM public.pedagogy_owner_release_waivers w
    JOIN public.questions q ON q.id=w.question_id AND q.status='published'
    JOIN public.question_keys k ON k.question_id=q.id
    JOIN public.question_options o ON o.question_id=q.id AND trim(o.side)='a'
    WHERE w.provenance LIKE 'Owner authorized strict-longest Y1 correction.%'
    GROUP BY w.question_id
  ) SELECT count(*) INTO n FROM lengths WHERE cw>mw OR mx>mn*1.8 OR distinct_options<>4;
  IF n<>0 THEN RAISE EXCEPTION 'TASK212_ABORT_QUALITY_FAILED_%',n; END IF;
END $task$;
COMMIT;

-- TASK-212 strict-correct-longest correction batch A (15 general pedagogy questions)
-- WARNING: PRIVILEGED OPERATOR ONLY. Requires explicit 2026-10-18 owner waiver.
-- Full original correct answer, key and explanation preserved, only one semantically
-- rewritten distractor per source. Immutable new revision; original is ARCHIVED.
-- Execute with final COMMIT replaced by ROLLBACK for complete rehearsal first.
-- The SQL must not be deployed as automatic Supabase migration.
BEGIN;
SET LOCAL lock_timeout='20s';
SET LOCAL statement_timeout='180s';
CREATE TEMP TABLE task212_pmgen_first15(ref text PRIMARY KEY,ord integer,old_text text,new_text text) ON COMMIT DROP;
INSERT INTO task212_pmgen_first15 VALUES
('authored:m15-topictest-20261018:2:12',2,'Mustahkamlik — faqat javobni yodda saqlash','Mustahkamlik — mazmunni tahlil qilmasdan javobni yodlab qaytarish'),
('authored:m15-topictest-20261018:2:3',2,'Induksiyaga asoslangan va barcha sharoitda qat’iy isbot','Induksiya — ikki namunadan barcha sharoitlar uchun qat’iy qonun chiqarish'),
('authored:m15-topictest-20261018:2:8',2,'Ko‘rgazmalilik — faqat tasvirlar sonini ko‘paytirish','Ko‘rgazmalilik — mazmunni tahlil qilmay tasvirlar sonini oshirish'),
('authored:m15-topictest-20261018:3:12',2,'Rag‘batlantirish — foydali harakatni munosib e’tirof etish','Rag‘batlantirish — foydali xatti-harakatni mukofot orqali mustahkamlash usulini tanlash'),
('authored:m15-topictest-20261018:3:3',2,'Aqliy tarbiya — mantiqiy xulosalarni taqqoslash','Aqliy tarbiya — musiqa o‘rniga mantiqiy xulosalarni asosli taqqoslash'),
('authored:m15-topictest-20261018:3:5',2,'Iqtisodiy tarbiya — moliyaviy resurslardan foydalanish','Iqtisodiy tarbiya — mablag‘ va moddiy resurslarni oqilona rejalash'),
('authored:m15-topictest-20261018:4:1',2,'Mustahkamlash darsi — o‘tgan bilimni takrorlash','Mustahkamlash darsi — avval o‘zlashtirilgan tushunchani turli mashqlarda qayta ishlash'),
('authored:m15-topictest-20261018:4:7',2,'Uslubiy tahlil — ko‘rgazmali vositani tanlash','Uslubiy tahlil — vizual vosita va metod tanlovining asoslanganligini tekshirish'),
('authored:m15-topictest-20261018:4:8',2,'Nazoratni butunlay bekor qilib, sababni tekshirmaslik','Nazoratni bekor qilib, rejalashdagi xatoni umuman tekshirmaslik'),
('authored:m15-topictest-20261018:5:1',2,'Darhol barcha fanlardan qo‘shimcha nazorat belgilash','Darhol barcha fanlardan qo‘shimcha nazorat belgilab, sababni suhbatda aniqlamaslik'),
('authored:m15-topictest-20261018:5:11',2,'Tomonlardan birini dalilsiz aybdor deb e’lon qilish','Tomonlardan birini dalilsiz aybdor deb e’lon qilib, boshqasini tinglamaslik'),
('authored:m15-topictest-20261018:5:4',2,'Uni birdan murakkab jamoaviy vazifaning boshlig‘i qilish','Uni birdan murakkab jamoaviy vazifaning boshlig‘i qilib, tayyorgarligini baholamaslik'),
('authored:m15-topictest-20261018:6:6',2,'Didaktik reja — mavzu bosqichlarini oldindan belgilash','Didaktik reja — mavzu bosqichlarini oldindan qat’iy ketma-ketlikda belgilash'),
('authored:m15-topictest-20261018:6:7',2,'Nutqning balandligi — tinglovchiga ovozni kuchaytirish','Nutqning balandligi — tushunchaning aniqligidan qat’i nazar ovozni kuchaytirish'),
('authored:m15-topictest-20261018:7:3',2,'Kommunikativ qobiliyat — o‘quvchilar bilan aloqa o‘rnatish','Kommunikativ qobiliyat — o‘quvchilar bilan doimiy shaxslararo aloqa o‘rnatish');
DO $task$
DECLARE actor uuid; n int; rec record; rev uuid;
BEGIN
  SELECT count(*) INTO n FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
  IF n<>1 THEN RAISE EXCEPTION 'TASK212_ABORT_OWNER_COUNT_%',n; END IF;
  SELECT id INTO actor FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
  SELECT count(*) INTO n FROM task212_pmgen_first15 e
    JOIN public.questions q ON q.source_reference=e.ref AND q.status='published' AND q.format='Y1'
    JOIN public.question_options o ON o.question_id=q.id AND o.order_idx=e.ord AND trim(o.side)='a' AND o.content_md=e.old_text
    JOIN public.question_keys k ON k.question_id=q.id AND o.id::text <> k.payload->>'correct_option_id'
    LEFT JOIN public.pedagogy_revision_queue r ON r.source_question_id=q.id
    WHERE q.group_code IN ('KS','PM.GEN','PM.MET') AND r.source_question_id IS NULL;
  IF n<>15 THEN RAISE EXCEPTION 'TASK212_ABORT_DRIFT_EXPECTED15_GOT_%',n; END IF;
  -- Use the original wrong-option order to construct EXACT three-proposal array.
  FOR rec IN
    SELECT q.id source_id, e.ref, array_agg(
       CASE WHEN o.order_idx=e.ord THEN e.new_text ELSE o.content_md END
       ORDER BY o.order_idx,o.id
    ) FILTER (WHERE o.id::text<>(k.payload->>'correct_option_id')) AS wrong_texts
    FROM task212_pmgen_first15 e JOIN public.questions q ON q.source_reference=e.ref AND q.status='published'
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
  SELECT count(*) INTO n FROM task212_pmgen_first15 e
   JOIN public.questions q ON q.source_reference=e.ref
   WHERE q.status='archived';
  IF n<>15 THEN RAISE EXCEPTION 'TASK212_ABORT_NOT_ARCHIVED_%',n; END IF;
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

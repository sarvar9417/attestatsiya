-- TASK-212 strict-correct-longest correction batch A (10 KS questions)
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
('authored:pedguli-html-concepts:v3:KS.03:202',2,'Topshiriqni keyingi bo‘limga o‘tkazib, avvalgi ko‘nikmani qayta tekshirmaslik','Topshiriqni keyingi bo‘limga ko‘chirib, mavjud ko‘nikmalarni faqat yakuniy nazoratda qayta tekshirish'),
('authored:pedguli-topic-audit:v4:KS.04:321',1,'Boshqalarning tayyor mahsulotidan foydalanishni muhokamasiz davom ettirishga imkon berish','Tayyor mahsulotlardan foydalanishga ruxsat berib, mualliflik mas’uliyatini faqat loyiha yakunida tushuntirish'),
('authored:pedguli-topic-audit:v4:KS.06:323',2,'Yangi usulning nomini rejasiga yozib, natijani tahlil qilmaslik','Yangi metodni ish rejasiga kiritib, o‘quvchilar natijasini tekshirmasdan uni samarali deb hisoblash'),
('authored:pedguli-topic-audit:v4:KS.07:326',1,'Bolaning xatolarini sinfdoshlar natijalari bilan taqqoslab, oldida tanbeh berish','Suhbatni boshqa bolalarning baholari bilan qiyoslashdan boshlab, farzandining xatolarini tanbeh tarzida sanash'),
('authored:pedguli-topic-study:v2:KS.05:105',1,'Shaxsiy ma’lumot tarqalganini sinf oldida yana bir bor aytib tushuntirish','Shaxsiy ma’lumotni sinf oldida qayta muhokama qilib, vaziyatni barcha o‘quvchilarga ochiq aytish'),
('revision:pedagogy:00f6512b-e8c1-4647-a1b1-9a7238f3b638',1,'Ota-onaga sinf reytingini tushuntirib, boshqa bolalarning individual baholarini qiyoslash','Ota-onaga sinf reytingidagi farqlarni ko‘rsatib, boshqa o‘quvchilarning individual baholarini misol sifatida muhokama qilish'),
('revision:pedagogy:646ab703-158b-4f86-8937-25d33465bca3',1,'Onlayn zo‘ravonlik xabarini sinf chatiga chiqarib, jamoatchilik fikrini olish yetarli','Onlayn zo‘ravonlik haqidagi shikoyatni sinfning umumiy chatida e’lon qilib, jamoaviy fikr bilan muammoni hal qilish'),
('authored:ai-assisted:m14-closed-20261018:kasb-standarti:page-13:topic-7:question-2',1,'Tegishli boshqa sinflarning umumiy bahosini tanlashga tayanish','Tegishli boshqa sinflarning umumiy baholarini solishtirib, yakka o‘quvchi ehtiyojini shu asosda belgilash'),
('authored:ai-assisted:m14-closed-20261018:kasb-standarti:page-8:topic-4:question-2',1,'Barcha bolalardan bir madaniy tajribani birday talab qilish','Bolalardan madaniy farqlarni hisobga olmasdan aynan bir xil ishtirokni talab qilish'),
('authored:ai-assisted:m14-closed-20261018:kasb-standarti:page-9:topic-4:question-5',1,'Tashrif haqida umumiy sinf o‘rtacha reytingini','Tashrif uchun sinfning oldingi reyting jadvalini tekshirish');
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

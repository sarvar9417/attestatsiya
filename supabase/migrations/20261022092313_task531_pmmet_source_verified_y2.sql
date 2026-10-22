-- TASK-531: replace the only source-unverified PM.MET Y2 item with two
-- independently authored, source-verified native matching questions.
--
-- Evidence reviewed directly:
-- M.E. Mamarajabov, D.E. Toshtemirov, O‘.A. Yuldashev,
-- “Informatika o‘qitish metodikasi”, Bookmany Print, 2023.
-- Drive file id: 1Ogu9CB2_W9OJDZlyNxZ81qw4G0faz5Vu.
-- Printed pages 66–70: oral, heuristic-conversation, visual/demonstration
-- and practical teaching methods.
-- Printed pages 253–255: components of a methodological teaching system.
--
-- The migration stages REVIEW first. Production has one active owner, so the
-- existing, explicitly owner-authorized no-external-expert waiver can record
-- the AI-assisted source check honestly before publication. A clean CI schema
-- has no owner profile; there the same two items remain REVIEW for structural
-- verification and no learner-visible state is changed.

BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='120s';

DO $task531$
DECLARE
  item jsonb;
  v_subject uuid;
  v_construct uuid;
  v_lesson uuid;
  v_question uuid;
  v_option uuid;
  v_ids uuid[];
  v_pairs jsonb;
  v_owner uuid;
  v_owner_count int;
  v_old uuid;
  v_replacement uuid;
  v_count int;
  i int;
  j int;
BEGIN
  SELECT id INTO STRICT v_subject
  FROM public.subjects WHERE code='informatika';

  SELECT count(*) INTO v_owner_count
  FROM public.profiles
  WHERE role='admin' AND NOT coalesce(is_blocked,false);

  FOR item IN
    SELECT value FROM jsonb_array_elements($bank$[
      {
        "construct":"PM.MET.01",
        "reference":"source-verified:task531:drive-1Ogu9CB2_W9OJDZlyNxZ81qw4G0faz5Vu:pp253-255:PM.MET.01:Y2:001",
        "pages":"253-255",
        "stem":"Informatika o‘qitish metodik tizimidagi to‘rtta vazifani ularning tarkibiy qismi bilan moslang.",
        "left":[
          "Dars erishadigan yakuniy natija va rivojlanish yo‘nalishini belgilaydi",
          "O‘rganiladigan materialni belgilangan maqsadga mos tanlaydi",
          "Ishtirokchilar faoliyati va o‘zaro munosabatini tartibga soladi",
          "Tanlangan metodni amalga oshirish uchun moddiy obyektlardan foydalanadi"
        ],
        "right":[
          "O‘quv vositalari",
          "O‘qitish mazmuni",
          "O‘quv maqsadlari",
          "O‘qitishning tashkiliy shakllari"
        ],
        "pairs":[2,1,3,0],
        "explanation":"Metodik tizimda maqsad kutiladigan natijani, mazmun o‘rganiladigan materialni, tashkiliy shakl ishtirokchilar faoliyatini, vosita esa metodni amalga oshiruvchi moddiy obyektlarni bildiradi. Manba: Mamarajabov va boshq., 2023, 253–255-betlar."
      },
      {
        "construct":"PM.MET.02",
        "reference":"source-verified:task531:drive-1Ogu9CB2_W9OJDZlyNxZ81qw4G0faz5Vu:pp66-70:PM.MET.02:Y2:001",
        "pages":"66-70",
        "stem":"Informatika darsidagi har bir faoliyatni darslikda tavsiflangan yetakchi o‘qitish metodi bilan moslang.",
        "left":[
          "O‘qituvchi notanish mavzuni butun mashg‘ulot davomida izchil og‘zaki bayon qiladi",
          "O‘quvchi o‘qituvchi bergan muammoli savollarga javobni o‘zi izlab topadi",
          "O‘qituvchi dasturning ishlashini ekranda bevosita ko‘rsatadi",
          "O‘quvchi dastur tuzib, uni turli qiymatlarda ishga tushiradi"
        ],
        "right":[
          "Amaliy ishlar metodi",
          "Namoyish etish",
          "Maktab ma’ruzasi",
          "Evristik suhbat"
        ],
        "pairs":[2,3,1,0],
        "explanation":"Ma’ruza — davomli og‘zaki bayon; evristik suhbat — muammoli savollarga javobni o‘quvchining izlab topishi; namoyish — obyekt yoki jarayonni ko‘rsatish; amaliy metod — dastur tuzish, mashq va boshqa amaliy harakatlar. Manba: Mamarajabov va boshq., 2023, 66–70-betlar."
      }
    ]$bank$::jsonb)
  LOOP
    IF EXISTS (
      SELECT 1 FROM public.questions
      WHERE source_reference=item->>'reference'
    ) THEN
      RAISE EXCEPTION 'TASK531_DUPLICATE_SOURCE_REFERENCE: %',item->>'reference';
    END IF;

    SELECT id INTO STRICT v_construct
    FROM public.constructs
    WHERE code=item->>'construct' AND group_code='PM.MET' AND is_active;

    SELECT l.id INTO STRICT v_lesson
    FROM public.lessons l
    JOIN public.lesson_constructs lc ON lc.lesson_id=l.id
    WHERE lc.construct_id=v_construct
      AND l.status='published'::public.content_status
    ORDER BY l.created_at,l.id LIMIT 1;

    v_question:=gen_random_uuid();
    INSERT INTO public.questions(
      id,subject_id,construct_id,group_code,format,cognitive,difficulty,
      stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id
    ) VALUES (
      v_question,v_subject,v_construct,'PM.MET','Y2'::public.question_format,
      'qollash'::public.cognitive_level,4,item->>'stem','[]'::jsonb,false,
      'review'::public.content_status,NULL,item->>'reference',v_lesson
    );

    v_ids:=ARRAY[]::uuid[];
    FOR i IN 0..3 LOOP
      v_option:=gen_random_uuid();
      v_ids:=array_append(v_ids,v_option);
      INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
      VALUES(v_option,v_question,'a',i+1,item->'left'->>i);
    END LOOP;
    FOR i IN 0..3 LOOP
      v_option:=gen_random_uuid();
      v_ids:=array_append(v_ids,v_option);
      INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
      VALUES(v_option,v_question,'b',i+1,item->'right'->>i);
    END LOOP;

    v_pairs:='{}'::jsonb;
    FOR i IN 0..3 LOOP
      j:=(item->'pairs'->>i)::int;
      v_pairs:=v_pairs||jsonb_build_object(v_ids[i+1]::text,v_ids[j+5]::text);
    END LOOP;
    INSERT INTO public.question_keys(question_id,payload,explanation_md)
    VALUES(v_question,jsonb_build_object('pairs',v_pairs),item->>'explanation');

    IF item->>'construct'='PM.MET.02' THEN
      v_replacement:=v_question;
    END IF;
  END LOOP;

  SELECT count(*) INTO v_count
  FROM public.questions q
  JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.source_reference LIKE 'source-verified:task531:%'
    AND q.status='review'::public.content_status
    AND q.group_code='PM.MET' AND q.format='Y2'::public.question_format
    AND jsonb_typeof(k.payload->'pairs')='object'
    AND (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs'))=4
    AND (SELECT count(*) FROM public.question_options o
         WHERE o.question_id=q.id AND o.side='a')=4
    AND (SELECT count(*) FROM public.question_options o
         WHERE o.question_id=q.id AND o.side='b')=4;
  IF v_count<>2 THEN
    RAISE EXCEPTION 'TASK531_STAGE_INTEGRITY_%_OF_2',v_count;
  END IF;

  -- CI has no owner identity and therefore cannot honestly create a waiver.
  -- Keeping the fully structured questions in REVIEW exercises the data path
  -- without weakening the publication gate.
  IF v_owner_count=0 THEN
    RAISE NOTICE 'TASK531: no active admin in clean fixture; two source-backed Y2 items remain REVIEW';
    RETURN;
  ELSIF v_owner_count<>1 THEN
    RAISE EXCEPTION 'TASK531_OWNER_NOT_UNIQUE_%',v_owner_count;
  END IF;
  SELECT id INTO STRICT v_owner
  FROM public.profiles
  WHERE role='admin' AND NOT coalesce(is_blocked,false);

  INSERT INTO public.pedagogy_owner_release_waivers(
    question_id,authorized_by,content_fingerprint,authority,provenance,source_question_id
  )
  SELECT q.id,v_owner,public.professional_question_fingerprint(q.id),
    'owner_explicit_no_external_expert_20261018',
    'TASK-531; owner delegated expert review to AI in the current work thread; answer pairs, wording and source were checked directly against Mamarajabov–Toshtemirov–Yuldashev 2023 Drive file 1Ogu9CB2_W9OJDZlyNxZ81qw4G0faz5Vu, printed pages 66–70 and 253–255; no independent external human expert endorsement claimed',
    CASE WHEN q.id=v_replacement THEN (
      SELECT oldq.id FROM public.questions oldq
      WHERE oldq.source_reference='authored:pedagogy-examstyle:20261020:PM.MET.02:Y2:01'
    ) ELSE NULL END
  FROM public.questions q
  WHERE q.source_reference LIKE 'source-verified:task531:%'
    AND q.status='review'::public.content_status;
  GET DIAGNOSTICS v_count=ROW_COUNT;
  IF v_count<>2 THEN RAISE EXCEPTION 'TASK531_WAIVER_%_OF_2',v_count; END IF;

  UPDATE public.questions
  SET status='published'::public.content_status,updated_at=now()
  WHERE source_reference LIKE 'source-verified:task531:%'
    AND status='review'::public.content_status;
  GET DIAGNOSTICS v_count=ROW_COUNT;
  IF v_count<>2 THEN RAISE EXCEPTION 'TASK531_PUBLISHED_%_OF_2',v_count; END IF;

  SELECT id INTO STRICT v_old
  FROM public.questions
  WHERE source_reference='authored:pedagogy-examstyle:20261020:PM.MET.02:Y2:01';

  INSERT INTO public.question_bank_revisions(
    source_question_id,revision_question_id,revision_kind,evidence
  ) VALUES (
    v_old,v_replacement,'task531_source_verified_pmmet_y2',
    jsonb_build_object(
      'date','2026-10-22','owner_authorized',true,'external_human_expert_claim',false,
      'source_file_id','1Ogu9CB2_W9OJDZlyNxZ81qw4G0faz5Vu',
      'source_title','Informatika o‘qitish metodikasi',
      'source_printed_pages','66-70',
      'reason','Original fourth label tahliliy taqqoslash was not explicitly evidenced; replacement uses four directly defined methods'
    )
  );

  UPDATE public.questions
  SET status='archived'::public.content_status,updated_at=now()
  WHERE id=v_old AND status='published'::public.content_status;
  IF NOT FOUND THEN RAISE EXCEPTION 'TASK531_OLD_SOURCE_NOT_ARCHIVED'; END IF;

  UPDATE public.question_quality_findings
  SET details=details||jsonb_build_object(
      'task','TASK-531','replacement_question_id',v_replacement,
      'historical_source_archived',true,
      'assessment','Three pairs supported; tahliliy taqqoslash label not explicit in reviewed source'
    )
  WHERE question_id=v_old
    AND finding_code='editorial_evidence_missing'
    AND resolved_at IS NULL;

  SELECT count(*) INTO v_count
  FROM public.questions q
  JOIN public.pedagogy_published_revisions p ON p.question_id=q.id
  JOIN public.pedagogy_owner_release_waivers w ON w.question_id=q.id
  WHERE q.source_reference LIKE 'source-verified:task531:%'
    AND q.status='published'::public.content_status
    AND public.question_source_evidence_eligible(q.id)
    AND p.content_fingerprint=public.professional_question_fingerprint(q.id)
    AND w.content_fingerprint=public.professional_question_fingerprint(q.id);
  IF v_count<>2 THEN RAISE EXCEPTION 'TASK531_POSTFLIGHT_%_OF_2',v_count; END IF;
END;
$task531$;

COMMIT;

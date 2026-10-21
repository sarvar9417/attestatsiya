-- TASK-396: non-destructive second immutable revisions for two
-- pedagogical questions published by another workflow without source-key
-- clarity or official eligibility. No historical attempt is rewritten.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='120s';
CREATE TEMP TABLE task396_manifest (
 old_reference text PRIMARY KEY, prior_stem text NOT NULL,
 clear_stem text NOT NULL, expected_answer text NOT NULL,
 clear_explanation text NOT NULL
) ON COMMIT DROP;
INSERT INTO task396_manifest VALUES
('revision:pedagogy:79000000-0000-4000-8000-000000000117','O‘qituvchi noto‘g‘ri javob bergan o‘quvchini avval ruhiy qo‘llab, keyin xatosini hurmat bilan muhokama qildi. Qaysi kasbiy sifat yetakchi?','O‘quvchi noto‘g‘ri javob bergach, o‘qituvchi uning xijolat bo‘lganini sezdi. So‘ng uni sinf oldida kamsitmasdan, xatoni muloyim so‘zlar bilan muhokama qildi va sha’nini asradi. Savol aynan muomala uslubida odob-me’yorni saqlash haqida: bu qaysi pedagogik sifat?','Pedagogik takt — vaziyatda odob va me’yorni saqlash','Perseptiv qobiliyat hissiy holatni payqashga taalluqli. Bu vaziyatda hisni sezish ham bor, ammo savolda aynan hurmatli muomala uslubini tanlash so‘ralgan; buni pedagogik takt ifodalaydi.'),
('revision:pedagogy:eb8876f3-3327-47de-922f-2c72f47dee23','Tarbiyaviy tadbirda bir nechta o‘quvchi tartibni buzdi. O‘qituvchi sabablarni tekshirmay butun sinfni bir xil jazolamoqchi. Nima uchun bu zaif qaror?','Tarbiyaviy tadbirda bir nechta o‘quvchi tartibni buzdi. O‘qituvchi kim nima qilganini aniqlamasdan, ishtirok etgan barcha o‘quvchiga bir xil jazo bermoqchi. Ushbu qarorning aynan adolat va tarbiyaviy samaradorlik jihatidan asosiy kamchiligi nimada?','Individual sabab va mas’uliyatni ajratmay, adolat hamda tarbiyaviy ta’sirni pasaytirishi mumkin','Barcha o‘quvchining mas’uliyati va sabablarini tekshirmasdan bir xil jazo belgilash adolatli baholash imkonini kamaytiradi. Shaxsiy sabab va individual mas’uliyatga asoslangan tarbiyaviy choralar aniqroq bo‘ladi.');

DO $task396$
DECLARE v record; prev public.questions%rowtype; old_key public.question_keys%rowtype;
 v_owner uuid; new_id uuid; answer_id uuid; n int:=0; wc_min int;wc_max int;correct_wc int;wrong_wc int;opt_count int;
 response jsonb;
BEGIN
 IF (SELECT count(*) FROM task396_manifest)<>2 THEN RAISE EXCEPTION 'TASK-396 manifest changed';END IF;
 SELECT id INTO v_owner FROM public.profiles WHERE role='admin' AND coalesce(is_blocked,false)=false;
 IF v_owner IS NULL OR (SELECT count(*) FROM public.profiles WHERE role='admin'
   AND coalesce(is_blocked,false)=false)<>1
 THEN RAISE EXCEPTION 'TASK-396 admin not unambiguous';END IF;
 FOR v IN SELECT * FROM task396_manifest ORDER BY old_reference LOOP
   SELECT * INTO prev FROM public.questions q WHERE q.source_reference=v.old_reference FOR UPDATE;
   IF NOT FOUND OR prev.status<>'published'::public.content_status
      OR prev.format<>'Y1'::public.question_format
      OR prev.stem_md IS DISTINCT FROM v.prior_stem
      OR EXISTS(SELECT 1 FROM public.question_bank_revisions br WHERE br.source_question_id=prev.id)
      OR EXISTS(SELECT 1 FROM public.pedagogy_revision_queue pq WHERE pq.source_question_id=prev.id)
      OR NOT EXISTS(SELECT 1 FROM public.question_quality_published_revisions snap
          WHERE snap.question_id=prev.id AND snap.content_fingerprint=public.professional_question_fingerprint(prev.id))
      OR NOT EXISTS(SELECT 1 FROM public.question_quality_findings finding
          WHERE finding.question_id=prev.id AND finding.resolved_at IS NULL
           AND finding.finding_code='independent_editorial_review_required')
   THEN RAISE EXCEPTION 'TASK-396 previous revision drift: %',v.old_reference;END IF;

   SELECT * INTO old_key FROM public.question_keys WHERE question_id=prev.id;
   IF old_key.question_id IS NULL OR
      NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=prev.id
         AND o.id::text=old_key.payload->>'correct_option_id'
         AND o.content_md=v.expected_answer)
   THEN RAISE EXCEPTION 'TASK-396 expected keyed response changed: %',v.old_reference;END IF;

   new_id:=gen_random_uuid();
   INSERT INTO public.questions(
      id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
      assets,is_generated,status,author_id,source_reference,source_lesson_id
   ) VALUES(
      new_id,prev.subject_id,prev.construct_id,prev.group_code,prev.format,prev.cognitive,
      prev.difficulty,v.clear_stem,prev.assets,true,'review'::public.content_status,
      prev.author_id,
      'revision:TASK-396:AI-editorial-context:'||prev.id::text||' | AI authored, not verbatim source',
      prev.source_lesson_id
   );

   INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
    SELECT gen_random_uuid(),new_id,side,order_idx,content_md
    FROM public.question_options WHERE question_id=prev.id;

   SELECT new_o.id INTO answer_id FROM public.question_options new_o
   JOIN public.question_options old_o ON old_o.question_id=prev.id AND
      old_o.side=new_o.side AND old_o.order_idx=new_o.order_idx
      AND old_o.content_md=new_o.content_md
   WHERE new_o.question_id=new_id AND old_o.id::text=old_key.payload->>'correct_option_id';
   IF answer_id IS NULL THEN RAISE EXCEPTION 'TASK-396 remapping failed';END IF;
   INSERT INTO public.question_keys(question_id,payload,explanation_md)
    VALUES(new_id,
      jsonb_set(old_key.payload,'{correct_option_id}',to_jsonb(answer_id::text),false),
      v.clear_explanation);
   SELECT count(*),min(wc),max(wc),max(wc) FILTER (WHERE yes),
     max(wc) FILTER (WHERE NOT yes)
   INTO opt_count,wc_min,wc_max,correct_wc,wrong_wc
   FROM (SELECT array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1) wc,
      o.id::text=k.payload->>'correct_option_id' yes
    FROM public.question_options o JOIN public.question_keys k ON k.question_id=o.question_id
    WHERE o.question_id=new_id AND o.side='a') z;
   IF opt_count<>4 OR wc_min<1 OR wc_max>1.8*wc_min OR correct_wc>1.25*wrong_wc
      OR (SELECT count(distinct btrim(content_md)) FROM public.question_options WHERE question_id=new_id)<>4
      OR (SELECT count(*) FROM public.question_options WHERE question_id=new_id)<>4
      OR (SELECT count(*) FROM public.question_options WHERE question_id=prev.id)<>4
   THEN RAISE EXCEPTION 'TASK-396 cloned candidate option constraints failed: %',v.old_reference;END IF;

   INSERT INTO public.question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
   VALUES(prev.id,new_id,'owner_ai_pedagogy_second_clarity_revision',
     jsonb_build_object('task','TASK-396','owner_delegated_AI_20261021',true,
     'second_clarity_revision',true,'correct_answer_text_unchanged',true,
     'old_historical_attempts_untouched',true,'AI_original_authored',true,
     'independent_human_certified',false));
   INSERT INTO public.pedagogy_revision_queue(source_question_id,revision_question_id,reason)
   VALUES(prev.id,new_id,'TASK-396 owner-delegated AI clarification; current published stem ambiguously signals two pedagogical concepts');
   INSERT INTO public.pedagogy_owner_release_waivers(
       question_id,authorized_by,content_fingerprint,authority,provenance,source_question_id)
   VALUES(new_id,v_owner,public.professional_question_fingerprint(new_id),
       'owner_explicit_no_external_expert_20261018',
       'TASK-396 user 2026-10-21 delegated AI review, no additional expert confirmation. Legacy authority enum used for secure atomic publisher compatibility; not a human expert signature. Rewritten distinct pedagogical scenario and explanation.',
       prev.id);

   SELECT public.publish_pedagogy_revision(new_id,v_owner) INTO response;
   IF response->>'status'<>'published'
     OR (response->>'archived_source_question_id')::uuid IS DISTINCT FROM prev.id
   THEN RAISE EXCEPTION 'TASK-396 atomic publish failed: %',v.old_reference;END IF;

   UPDATE public.question_quality_published_revisions s SET release_scope=
     'TASK-396 owner-delegated AI contextual disambiguation; historical published source archived; not independently human certified'
     WHERE s.question_id=new_id;
   IF NOT public.is_question_official_mock_eligible(new_id)
      OR NOT public.group_mock_eligible(new_id)
      OR (SELECT status FROM public.questions WHERE id=prev.id)<>'archived'::public.content_status
      OR NOT EXISTS(SELECT 1 FROM public.question_quality_published_revisions s
           WHERE s.question_id=new_id AND s.content_fingerprint=public.professional_question_fingerprint(new_id))
   THEN RAISE EXCEPTION 'TASK-396 postflight failed: %',v.old_reference;END IF;
   n:=n+1;
 END LOOP;
 IF n<>2 THEN RAISE EXCEPTION 'TASK-396 expected 2 immutable new versions';END IF;
END
$task396$;
COMMIT;
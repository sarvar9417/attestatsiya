-- Pedagogika: one review-only replacement per published legacy question
-- beginning with #attestatsiya_YEAR. Original published snapshots and options
-- remain byte-for-byte unchanged. Editorial signoff is NOT fabricated.
BEGIN;
DO $tagclean$
DECLARE r record; o record; v_new uuid; v_key uuid; v_old_key uuid; v_new_key uuid; v_stem text; v_old public.questions%rowtype; v_c integer;
BEGIN
 FOR r IN
   SELECT id FROM public.questions
   WHERE status='published'::public.content_status
   AND group_code IN ('KS','PM.GEN','PM.MET')
   AND format='Y1'::public.question_format
   AND stem_md ~* '^#attestatsiya_[0-9]{4}'
   ORDER BY id
 LOOP
   SELECT * INTO v_old FROM public.questions WHERE id=r.id FOR UPDATE;
   IF EXISTS(SELECT 1 FROM public.pedagogy_revision_queue
             WHERE source_question_id=r.id AND revision_question_id IS NOT NULL)
      OR EXISTS(SELECT 1 FROM public.question_bank_revisions
             WHERE source_question_id=r.id)
   THEN CONTINUE; END IF;
   SELECT (payload->>'correct_option_id')::uuid INTO v_old_key
   FROM public.question_keys WHERE question_id=r.id;
   SELECT count(*) INTO v_c FROM public.question_options WHERE question_id=r.id AND side='a';
   IF v_old_key IS NULL OR v_c<>4 THEN
      RAISE EXCEPTION 'Invalid original Y1: %',r.id;
   END IF;
   v_stem:=regexp_replace(v_old.stem_md,E'^#attestatsiya_[0-9]{4}([[:space:]]|\\\\n)*','','i');
   v_stem:=btrim(replace(replace(v_stem,chr(92)||'n',chr(10)),chr(92)||'"','"'));
   IF length(v_stem)<20 OR v_stem ~* '^#attestatsiya_' THEN
     RAISE EXCEPTION 'Tag normalization failed %',r.id;
   END IF;
   v_new:=gen_random_uuid();v_new_key:=NULL;
   INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,
       stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
   VALUES(v_new,v_old.subject_id,v_old.construct_id,v_old.group_code,v_old.format,
          v_old.cognitive,v_old.difficulty,v_stem,v_old.assets,false,
          'review'::public.content_status,NULL,
          'revision:pedagogy:'||r.id::text,v_old.source_lesson_id);
   FOR o IN SELECT id,side,order_idx,content_md FROM public.question_options
            WHERE question_id=r.id ORDER BY side,order_idx
   LOOP
     v_key:=gen_random_uuid();
     INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
        VALUES(v_key,v_new,o.side,o.order_idx,o.content_md);
     IF o.id=v_old_key THEN v_new_key:=v_key;END IF;
   END LOOP;
   IF v_new_key IS NULL THEN RAISE EXCEPTION 'Old key cannot map %',r.id;END IF;
   INSERT INTO public.question_keys(question_id,payload,explanation_md)
       SELECT v_new,jsonb_build_object('correct_option_id',v_new_key),explanation_md
       FROM public.question_keys WHERE question_id=r.id;
   INSERT INTO public.question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
      VALUES(r.id,v_new,'telegram_hashtag_clean_review',
             jsonb_build_object('editorial_state','AI mechanical tag cleanup; independent review pending',
               'original_source_reference',v_old.source_reference,
               'original_snapshot_preserved',true));
   INSERT INTO public.pedagogy_revision_queue(source_question_id,revision_question_id,reason)
      VALUES(r.id,v_new,'Imported Telegram hashtag in learner stem; review before release')
      ON CONFLICT(source_question_id) DO UPDATE SET
        revision_question_id=excluded.revision_question_id,
        reason=excluded.reason
      WHERE public.pedagogy_revision_queue.revision_question_id IS NULL;
   INSERT INTO public.question_quality_findings(question_id,finding_code,severity,details)
      VALUES(r.id,'imported_telegram_hashtag_in_stem','medium',
        jsonb_build_object('proposed_revision_id',v_new,'state','review pending'))
      ON CONFLICT(question_id,finding_code) DO NOTHING;
 END LOOP;
END
$tagclean$;
COMMIT;

-- Eliminate duplicate learner-facing question prompts without altering published
-- originals, options, answer keys, attempts, or source provenance.
-- Each cloned answer key uses remapped option UUIDs; no synthetic approval.
BEGIN;
DO $deduplicate$
DECLARE
 r record; orig public.questions%rowtype; opt record; pair record;
 original_payload jsonb; original_explanation text;
 fresh_id uuid; fresh_option uuid; option_map jsonb; new_key jsonb; new_pairs jsonb;
BEGIN
 FOR r IN SELECT * FROM (VALUES
   ('ba93d70b-92d3-4d4f-b662-797d637cc322'::uuid,
    'Pedagogika bo‘yicha ishchi guruh maktabdagi o‘qitish jarayonini tashkil etish va o‘quvchilarda ijtimoiy-axloqiy fazilatlarni rivojlantirishni ikkita nazariy yo‘nalishda tahlil qilmoqda. Ushbu yo‘nalishlar pedagogika fanining qaysi asosiy tarkibiy qismlariga mos?',
    'c1d60c4e-6a98-47a2-8f7b-3c3572258c0b'::uuid),
   ('f35ce286-3064-4b17-8ac2-a2bdc2a2d6e6'::uuid,
    'Darsda o‘qituvchi mashg‘ulot boshlanishidagi holatni aniqlash, jarayonda o‘qitishni moslash, yakuniy natijani umumlashtirish va o‘quvchiga keyingi qadamni ko‘rsatishni rejalashtirdi. Diagnostik, formativ, summativ baholash va qayta aloqani mos vazifalar bilan juftlang.',
    'ec14ac32-302b-4464-9e7c-1a1b922a7589'::uuid)
 ) AS input(source_id,revised_stem,duplicate_peer_id)
 LOOP
   SELECT * INTO orig FROM public.questions
     WHERE id=r.source_id AND status='published'::public.content_status FOR UPDATE;
   IF NOT FOUND THEN CONTINUE; END IF;
   IF NOT EXISTS (SELECT 1 FROM public.questions peer WHERE peer.id=r.duplicate_peer_id
      AND peer.status='published'::public.content_status AND peer.group_code=orig.group_code)
   THEN RAISE EXCEPTION 'Duplicate peer changed for %',r.source_id; END IF;
   IF EXISTS (SELECT 1 FROM public.question_bank_revisions WHERE source_question_id=r.source_id)
      OR EXISTS (SELECT 1 FROM public.pedagogy_revision_queue
        WHERE source_question_id=r.source_id AND revision_question_id IS NOT NULL)
   THEN CONTINUE; END IF;
   IF orig.format NOT IN ('Y1'::public.question_format,'Y2'::public.question_format)
   THEN RAISE EXCEPTION 'Unexpected original format %',r.source_id; END IF;

   SELECT payload,explanation_md INTO STRICT original_payload,original_explanation
   FROM public.question_keys WHERE question_id=r.source_id;
   fresh_id:=gen_random_uuid();option_map:='{}'::jsonb;
   INSERT INTO public.questions(
      id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
      assets,is_generated,status,author_id,source_reference,source_lesson_id)
   VALUES(fresh_id,orig.subject_id,orig.construct_id,orig.group_code,orig.format,
     orig.cognitive,orig.difficulty,r.revised_stem,orig.assets,false,
     'review'::public.content_status,NULL,'revision:pedagogy:'||orig.id::text,
     orig.source_lesson_id);
   FOR opt IN SELECT id,side,order_idx,content_md FROM public.question_options
              WHERE question_id=orig.id ORDER BY side,order_idx
   LOOP
     fresh_option:=gen_random_uuid();
     INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
       VALUES(fresh_option,fresh_id,opt.side,opt.order_idx,opt.content_md);
     option_map:=option_map||jsonb_build_object(opt.id::text,fresh_option::text);
   END LOOP;
   IF orig.format='Y1'::public.question_format THEN
      IF option_map->>(original_payload->>'correct_option_id') IS NULL
      THEN RAISE EXCEPTION 'Correct choice is unlinked: %',orig.id; END IF;
      new_key:=jsonb_build_object('correct_option_id',
        option_map->>(original_payload->>'correct_option_id'));
   ELSE
      new_pairs:='{}'::jsonb;
      FOR pair IN SELECT key,value FROM jsonb_each_text(original_payload->'pairs')
      LOOP
        IF option_map->>pair.key IS NULL OR option_map->>pair.value IS NULL
        THEN RAISE EXCEPTION 'Y2 pair unlinked: %',orig.id; END IF;
        new_pairs:=new_pairs||jsonb_build_object(option_map->>pair.key,option_map->>pair.value);
      END LOOP;
      IF (SELECT count(*) FROM jsonb_each_text(new_pairs))<>4
      THEN RAISE EXCEPTION 'Y2 must contain four pairings: %',orig.id; END IF;
      new_key:=jsonb_build_object('pairs',new_pairs);
   END IF;
   INSERT INTO public.question_keys(question_id,payload,explanation_md)
      VALUES(fresh_id,new_key,original_explanation);
   INSERT INTO public.question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
      VALUES(orig.id,fresh_id,'pedagogy_duplicate_stem_specificity',
        jsonb_build_object('reason','Distinct question content needs distinct prompt',
         'other_published_id',r.duplicate_peer_id,'key_mapped_not_rewritten',true,
         'editorial_state','AI textual correction; no fabricated reviewer identity'));
   INSERT INTO public.pedagogy_revision_queue(source_question_id,revision_question_id,reason)
      VALUES(orig.id,fresh_id,'Repeated learner-facing prompt; make tested construct precise')
      ON CONFLICT (source_question_id) DO UPDATE
      SET revision_question_id=excluded.revision_question_id,reason=excluded.reason
      WHERE public.pedagogy_revision_queue.revision_question_id IS NULL;
   INSERT INTO public.question_quality_findings(question_id,finding_code,severity,details)
      VALUES(orig.id,'duplicate_published_stem','medium',
       jsonb_build_object('same_as',r.duplicate_peer_id,'staged_revision',fresh_id,
         'outstanding','atomic release of corrected prompt'))
      ON CONFLICT (question_id,finding_code) DO NOTHING;
 END LOOP;
END
$deduplicate$;
COMMIT;
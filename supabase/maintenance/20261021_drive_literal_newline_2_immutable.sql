-- One-off manual owner-delegated AI QA: fix literal \n Markdown separators.
-- Immutable successors preserve exam_items linking historical published questions.
-- No independent human editorial signoff is represented.
BEGIN;
SET LOCAL lock_timeout='10s';
SET LOCAL statement_timeout='90s';
DO $fix$
DECLARE c record; oldq public.questions%rowtype; oldk public.question_keys%rowtype;
  new_id uuid; new_key uuid; original_correct text; new_stem text; new_source text;
BEGIN
 FOR c IN SELECT * FROM (VALUES
 ('JS-P7-Q16','075c3b96-ce83-1961-db27-59c96422e93e'::uuid,'S4.CODE','PDF-p.7|Q16',13,'10','javascript'),
 ('EXCEL-P10-Q23','4a65e71a-56b7-cdc4-ab89-bb668062e676'::uuid,'S2.OFFICE','PDF-p.10|Q23',7,'qizil / qizil','table')
 ) z(code,id,grp,marker,newline_count,answer,markup) ORDER BY code LOOP
   SELECT * INTO STRICT oldq FROM public.questions q WHERE q.id=c.id FOR UPDATE;
   SELECT * INTO STRICT oldk FROM public.question_keys k WHERE k.question_id=c.id;
   IF oldq.status <> 'published'::public.content_status OR oldq.format <> 'Y1'::public.question_format
     OR oldq.group_code <> c.grp OR oldq.source_reference NOT LIKE 'Drive:Attestatsiya/darsliklar/20000 LIK informatika.pdf|%'
     OR position(c.marker IN oldq.source_reference)=0
     OR (length(oldq.stem_md)-length(replace(oldq.stem_md,chr(92)||'n','')))/2<>c.newline_count
     OR position(chr(10) IN oldq.stem_md)<>0
     OR EXISTS(SELECT 1 FROM public.question_bank_revisions br WHERE br.source_question_id=c.id)
     OR EXISTS(SELECT 1 FROM public.question_quality_quarantines qq WHERE qq.source_question_id=c.id)
     OR (SELECT count(*) FROM public.exam_items e WHERE e.question_id=c.id)<>1
   THEN RAISE EXCEPTION 'Original drift or existing revision %',c.code; END IF;
   IF (c.markup='javascript' AND
     (position(repeat(chr(96),3)||'javascript'||chr(92)||'n' IN oldq.stem_md)=0
      OR position('console.log(s);'||chr(92)||'n'||repeat(chr(96),3) IN oldq.stem_md)=0))
     OR (c.markup='table' AND
     (position('| Qator | Meva |' IN oldq.stem_md)=0
      OR position('G2:G3 uchun shartli formatlash' IN oldq.stem_md)=0))
   THEN RAISE EXCEPTION 'Expected markup context changed %',c.code; END IF;
   IF jsonb_typeof(oldk.payload->'correct_option_id') IS DISTINCT FROM 'string'
     OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=c.id AND o.side='a')<>4
     OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=c.id AND o.side='b')<>0
     OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=c.id AND o.content_md=c.answer)<>1
   THEN RAISE EXCEPTION 'Original options/key invalid %',c.code; END IF;
   SELECT o.content_md INTO original_correct FROM public.question_options o
     WHERE o.question_id=c.id AND o.id::text=oldk.payload->>'correct_option_id';
   IF original_correct IS DISTINCT FROM c.answer
   THEN RAISE EXCEPTION 'Original correct answer changed %',c.code; END IF;

   new_stem:=replace(oldq.stem_md,chr(92)||'n',chr(10));
   IF position(chr(92)||'n' IN new_stem)<>0
      OR position(chr(10) IN new_stem)=0
      OR replace(new_stem,chr(10),chr(92)||'n') IS DISTINCT FROM oldq.stem_md
   THEN RAISE EXCEPTION 'Unsafe display normalization %',c.code; END IF;
   new_source:='revision:owner-ai-qa:literal-newline:'||c.code||':'||c.id::text||' | '||oldq.source_reference;
   IF EXISTS(SELECT 1 FROM public.questions WHERE source_reference=new_source)
   THEN RAISE EXCEPTION 'Already revised %',c.code; END IF;

   new_id:=gen_random_uuid();
   INSERT INTO public.questions(
     id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
     assets,is_generated,status,author_id,created_at,updated_at,source_reference,source_lesson_id
   ) VALUES(new_id,oldq.subject_id,oldq.construct_id,oldq.group_code,oldq.format,
     oldq.cognitive,oldq.difficulty,new_stem,oldq.assets,oldq.is_generated,
     'review'::public.content_status,oldq.author_id,now(),now(),new_source,oldq.source_lesson_id);
   INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
   SELECT gen_random_uuid(),new_id,side,order_idx,content_md FROM public.question_options WHERE question_id=c.id;
   SELECT o.id INTO STRICT new_key FROM public.question_options o WHERE o.question_id=new_id AND o.content_md=c.answer AND o.side='a';
   INSERT INTO public.question_keys(question_id,payload,explanation_md,updated_at)
   VALUES(new_id,jsonb_set(oldk.payload,'{correct_option_id}',to_jsonb(new_key::text),false),
     oldk.explanation_md,now());

   INSERT INTO public.question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
   VALUES(c.id,new_id,'drive_escaped_newline_display_normalization',
    jsonb_build_object('source_code',c.code,'reviewer_type','AI','owner_delegated_approval',true,
      'independent_human_editorial_signoff',false,'literal_markers_replaced',c.newline_count,
      'answer_key_semantics_changed',false,'verified_correct_answer',c.answer,
      'historical_exam_item_refs_preserved',1,'publication_status','owner_delegated_ai_verified_published'));
   INSERT INTO public.question_quality_quarantines(source_question_id,replacement_question_id,reason,evidence)
   VALUES(c.id,new_id,'literal_escaped_markdown_newlines',
     jsonb_build_object('original_archived',true,'successor_published',true,'answer_key_semantics_changed',false));
   INSERT INTO public.question_quality_findings(question_id,finding_code,severity,details)
   VALUES(new_id,'independent_editorial_review_required','medium',
     jsonb_build_object('reviewer_type','AI','owner_delegated',true,'independent_human_editorial_signoff',false))
   ON CONFLICT(question_id,finding_code) DO NOTHING;

   UPDATE public.questions SET status='published'::public.content_status,updated_at=now()
     WHERE id=new_id AND status='review'::public.content_status;
   IF NOT FOUND THEN RAISE EXCEPTION 'Successor not published %',c.code; END IF;
   UPDATE public.questions SET status='archived'::public.content_status,updated_at=now()
     WHERE id=c.id AND status='published'::public.content_status;
   IF NOT FOUND THEN RAISE EXCEPTION 'Original not archived %',c.code; END IF;
   UPDATE public.question_quality_published_revisions
     SET release_scope='Owner-delegated AI display QA: genuine Markdown line breaks; unchanged answer key; one historical exam item preserved; no independent human signoff'
     WHERE question_id=new_id;
   INSERT INTO public.audit_log(actor_id,action,entity,entity_id,diff)
   VALUES(NULL,'owner_delegated_ai_markdown_newline_revision','question',c.id,
     jsonb_build_object('source_code',c.code,'successor_question_id',new_id,'old_status','archived','new_status','published',
       'replaced_markers',c.newline_count,'answer_key_semantics_changed',false,
       'original_exam_items_preserved',1,'reviewer_type','AI','independent_human_editorial_signoff',false));
   IF NOT EXISTS(SELECT 1 FROM public.question_quality_published_revisions fp
     WHERE fp.question_id=new_id AND fp.content_fingerprint=public.professional_question_fingerprint(new_id))
     OR (SELECT status FROM public.questions WHERE id=c.id)<>'archived'::public.content_status
     OR (SELECT status FROM public.questions WHERE id=new_id)<>'published'::public.content_status
     OR (SELECT count(*) FROM public.question_options WHERE question_id=new_id)<>4
     OR (SELECT count(*) FROM public.exam_items WHERE question_id=c.id)<>1
   THEN RAISE EXCEPTION 'QA postflight mismatch %',c.code; END IF;
 END LOOP;
END
$fix$;
COMMIT;

-- Stage two expert-rewritten Y1 questions with balanced alternative responses.
-- Original published rows and attempts never mutate; only linked review clones.
BEGIN;
DO $remedy$
DECLARE r record; src public.questions%rowtype; o record; rev uuid; option_new uuid;
answer_old uuid; answer_new uuid; source_correct_idx integer; i integer;
BEGIN
FOR r IN SELECT * FROM (VALUES
('596b3d99-fb4e-4c12-9593-d813ca4e0a06'::uuid,2,'Rasmdagi davra stolida qatnashchilar mavzu yuzasidan erkin fikr almashadi: taraflar oldindan ikki raqib jamoaga ajratilmagan, hakamlar bahsni baholamaydi. Ushbu ta’lim metodi qaysi?','["Debrifing — faoliyatdan keyingi natijalarni birgalikda tahlil qilish","Debat — qarama-qarshi pozitsiyalarni qoidali bahsda himoya qilish","Diskussiya — erkin muhokamada turli fikrlarni solishtirish","Demonstratsiya — muayyan amal yoki hodisani namoyish etish"]'::jsonb,'Diskussiya mavzu yuzasidan fikrlarni erkin muhokama qilish, dalillarni tinglash va solishtirishga asoslanadi. Debatda esa qarama-qarshi pozitsiyalar belgilangan qoidalar asosida himoya qilinadi. Rasmga oid kontekst va farqlovchi belgi savolning o‘zida ham berildi.'),
('35c29429-543f-4f65-8754-677b8ad01e93'::uuid,3,'O‘qituvchi suvning bug‘lanib bulutga aylanishi va yog‘in bo‘lib yerga qaytishini sabab-oqibat bog‘lanishi bilan og‘zaki izohladi, shu jarayonning sxemasini doskada chizdi. Qaysi metod mazmunni tushunishda yetakchi?','["Tasvir — hodisaning tashqi belgilarini so‘z bilan ifodalash","Hikoya — voqealarni izchil ketma-ketlikda bayon qilish","Ma’ruza — keng hajmdagi mazmunni tizimli monologda yoritish","Tushuntirish — hodisaning sabab-oqibat bog‘lanishini izohlash"]'::jsonb,'O‘qituvchi faqat sxema ko‘rsatmay, bug‘lanish, kondensatsiya va yog‘inning qanday bog‘lanishini sabab-oqibat orqali ochmoqda. Asosiy metod tushuntirish; doskadagi sxema esa uni qo‘llovchi ko‘rgazmali vositadir.')
) AS d(source_id,correct_zero_based,revised_stem,revised_options,explanation)
LOOP
 SELECT * INTO src FROM public.questions
 WHERE id=r.source_id AND status='published'::public.content_status FOR UPDATE;
 IF NOT FOUND THEN CONTINUE; END IF;
 IF EXISTS(SELECT 1 FROM public.question_bank_revisions WHERE source_question_id=src.id)
  OR EXISTS(SELECT 1 FROM public.pedagogy_revision_queue WHERE source_question_id=src.id AND revision_question_id IS NOT NULL)
 THEN CONTINUE; END IF;
 IF src.format<>'Y1'::public.question_format
 OR jsonb_array_length(r.revised_options)<>4
 OR (SELECT COUNT(DISTINCT value) FROM jsonb_array_elements_text(r.revised_options) vals(value))<>4
 OR (SELECT COUNT(*) FROM public.question_options WHERE question_id=src.id AND side='a')<>4
 THEN RAISE EXCEPTION 'Question format invalid: %',src.id; END IF;
 SELECT (k.payload->>'correct_option_id')::uuid INTO answer_old
 FROM public.question_keys k WHERE k.question_id=src.id;
 IF answer_old IS NULL THEN RAISE EXCEPTION 'Missing original key %',src.id; END IF;
 SELECT position-1 INTO source_correct_idx FROM (
 SELECT id,ROW_NUMBER() OVER(ORDER BY order_idx,id) AS position
 FROM public.question_options WHERE question_id=src.id AND side='a'
 ) x WHERE id=answer_old;
 IF source_correct_idx IS DISTINCT FROM r.correct_zero_based THEN
 RAISE EXCEPTION 'Source key position mismatch %',src.id;
 END IF;
 rev:=gen_random_uuid(); answer_new:=NULL;
 INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,
   stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
 VALUES(rev,src.subject_id,src.construct_id,src.group_code,src.format,src.cognitive,
 src.difficulty,r.revised_stem,src.assets,false,'review'::public.content_status,NULL,
 'revision:pedagogy:'||src.id::text,src.source_lesson_id);
 i:=0;
 FOR o IN SELECT id,side,order_idx FROM public.question_options WHERE question_id=src.id AND side='a' ORDER BY order_idx,id
 LOOP
 option_new:=gen_random_uuid();
 INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
 VALUES(option_new,rev,'a',o.order_idx,r.revised_options->>i);
 IF o.id=answer_old THEN answer_new:=option_new;END IF;
 i:=i+1;
 END LOOP;
 IF answer_new IS NULL THEN RAISE EXCEPTION 'Key not mapped %',src.id; END IF;
 INSERT INTO public.question_keys(question_id,payload,explanation_md)
 VALUES(rev,jsonb_build_object('correct_option_id',answer_new),r.explanation);
 INSERT INTO public.question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
 VALUES(src.id,rev,'pedagogy_high_cue_balanced_rescue',
 jsonb_build_object('original_published_preserved',true,'original_key_position_preserved',true,
 'editorial_state','AI semantic rewrite per owner authorization; no independent expert signature'));
 INSERT INTO public.pedagogy_revision_queue(source_question_id,revision_question_id,reason)
 VALUES(src.id,rev,'Repair answer-length cue and improve educational construct specificity')
 ON CONFLICT (source_question_id) DO UPDATE SET revision_question_id=excluded.revision_question_id,
 reason=excluded.reason WHERE public.pedagogy_revision_queue.revision_question_id IS NULL;
END LOOP;
END $remedy$;
COMMIT;
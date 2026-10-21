-- Stage four expert-rewritten Y1 questions with balanced alternative responses.
-- Original published rows and attempts never mutate; only linked review clones.
BEGIN;
DO $remedy$
DECLARE r record; src public.questions%rowtype; o record; rev uuid; option_new uuid;
answer_old uuid; answer_new uuid; source_correct_idx integer; i integer;
BEGIN
FOR r IN SELECT * FROM (VALUES
('111b69f5-ad72-4db3-9066-c2860f90fe8f'::uuid,1,'O‘quvchi ingliz tilida «I have two childrens» deb aytdi. «Child → children» istisno ko‘plik shakli bo‘lsa-da, u odatdagi -s qo‘shimchasini qo‘shdi. Bu qaysi xato mexanizmiga misol?','["Fossilization — uzoq vaqt davomida saqlanib qolgan xato","Overgeneralization — umumiy qoidani istisnoga ham qo‘llash","L1 transfer — ona tili grammatik qolipini ko‘chirish","Slip — bir martalik tasodifiy nutq adashishi"]'::jsonb,'O‘quvchi ko‘plik yasashning odatiy -s qoidasini allaqachon ko‘plik bildiruvchi irregular «children» shakliga ham qo‘llagan. Bu istisnoga nisbatan umumiy qoidani ortiqcha qo‘llash — overgeneralization.'),
('c8e660dd-5422-42ef-aff2-aeb53b5a37e9'::uuid,0,'Maktabdagi raqamli xavfsizlik bilan bog‘liq haqiqiy hodisaning tavsifi berildi. O‘quvchilar dalillarni ajratib, sabablarni tahlil qildi, muqobil yechimlarning oqibatini solishtirib, qarorini asoslab berdi. Yetakchi metod qaysi?','["Keys-stadi — vaziyat va muqobil yechimlarni tahlil qilish","Debat — qarama-qarshi pozitsiyalarni dalillar bilan himoya qilish","Jigsaw — mavzuni ekspert guruhlarida qismlarga ajratib o‘rganish","Akvarium — kichik guruh muhokamasini tashqaridan kuzatish"]'::jsonb,'Keys-stadi aniq hayotiy holat dalillarini o‘rganish, muammo sabablarini ochish, muqobil yechimlarni baholash va asosli qaror qabul qilishga tayanadi. Debat, Jigsaw va Akvariumda tashkil etish usuli boshqacha.'),
('5d5bbed8-cd54-46ec-a29d-6d89acc58fc2'::uuid,2,'Sinf soatida o‘quvchilar yaqin kishiga yordam berish haqidagi vaziyatni tahlil qilib, ishtirokchilarning hislarini muhokama qildi va o‘z hayotidan minnatdorlikka misollar keltirdi. Mashg‘ulotning ustuvor tarbiyaviy maqsadi qaysi?','["Tarbiyaviy qoidalarni yodda saqlash ko‘nikmasini tekshirish","Yaqinlar bilan bog‘liq mahalliy tarixiy faktlarni tizimlash","Hamdardlik va minnatdorlikka oid qadriyatli munosabatni rivojlantirish","Ota-onalarga o‘quvchilarning baholash natijasini tushuntirish"]'::jsonb,'Vaziyatdan boshqa insonning hissiy holatini tushunish, minnatdorlik va hamdardlik haqida shaxsiy xulosa chiqarish emotsional-qadriyat sohasini rivojlantirishga xizmat qiladi. Bu yodlash, tarixiy fakt yig‘ish yoki bahoni xabar qilishdan farq qiladi.'),
('99a49e79-53ca-4373-bab4-1231dc0bc9d9'::uuid,0,'O‘qituvchi sinfdagi nizoda o‘quvchini ko‘pchilik oldida jazolamadi: tomonlarni xolis tingladi, qoidabuzarlik oqibatini tushuntirdi va vaziyatni tuzatish rejasini birga tuzdi. Ushbu yondashuvning asosiy tarbiyaviy maqsadi nima?','["Mas’uliyatni anglatib, o‘quvchini jamoaga sog‘lom qayta moslashtirish","Muammo chuqurlashmagan deb hisoblab, kelishmovchilikni e’tiborsiz qoldirish","Tomonlarni tinglamasdan, jazoni faqat tashqi tartib orqali belgilash","Xatoni tushuntirish o‘rniga, jazo qo‘rquvi orqali itoatga erishish"]'::jsonb,'O‘qituvchi nizoning oqibatini tushuntirib, javobgarlikni tan olish va vaziyatni tuzatish imkonini yaratmoqda. Bu tiklovchi-pedagogik yondashuvga mos; nizoni inkor qilish, biryoqlama jazolash yoki qo‘rqitishga emas.')
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
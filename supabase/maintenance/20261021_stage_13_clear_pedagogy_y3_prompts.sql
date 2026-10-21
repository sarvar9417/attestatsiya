-- Clarify 13 published pedagogy Y3 ordering prompts without modifying active snapshots.
-- The original Y3 option order and 4-key array are preserved through UUID remapping.
BEGIN;
DO $sequence$
DECLARE r record; src public.questions%rowtype; old_key jsonb; old_item record;
        fresh uuid; fresh_option uuid; keymap jsonb; fresh_order jsonb; old_id text; new_id text;
BEGIN
 FOR r IN SELECT * FROM (VALUES
('7e67a6e0-bbbf-48e1-aaf9-bb1853b138e9'::uuid,'Darsni rejalashtirishda fan dasturi, o‘quvchi ehtiyoji va tekshiriladigan natijalar o‘zaro bog‘lanadi. Quyidagi to‘rtta amalni o‘qituvchining ishni bajarish tartibi bo‘yicha birinchi qadamdan yakuniy qadamgacha joylashtiring.'),
('c5cb6ccb-dafc-4b63-9379-96af966104a4'::uuid,'O‘qituvchi keyingi dars uchun o‘quv jarayonini rejalashtirmoqda. Quyidagi to‘rtta amalni eng avval bajarilishi kerak bo‘lganidan oxirgi rejalash qadamigacha tartiblang.'),
('3941af5a-95cd-421b-a6d8-d58fe7fd5877'::uuid,'Pedagog berilgan vaziyatda yetakchi tarbiya turini aniqlamoqchi. To‘rtta tahliliy amalni dastlab maqsadni tushunishdan yakuniy tasnifni tanlashgacha bo‘lgan bajarilish tartibida joylashtiring.'),
('671be50e-8bfb-475c-b1e2-3b4a56a4639c'::uuid,'Pedagog vaziyatda qaysi kasbiy qobiliyat namoyon bo‘lganini tahlil qilmoqda. Quyidagi amallarni vaziyatni anglashdan qobiliyatni asosli tanlashgacha bajarilish tartibida joylashtiring.'),
('80ffa6ee-f09d-4106-a547-2875a019d1a7'::uuid,'Darsdagi vaziyatga mos ta’lim texnologiyasini tanlash uchun to‘rtta rejalash amalini birinchi tahliliy qadamdan yakuniy nazorat mezonigacha izchil joylashtiring.'),
('8ccbd40e-f934-4ef2-b4b1-ceb3738922f9'::uuid,'O‘qituvchi yangi darsni maqsadga mos rejalashtirmoqda. Quyidagi to‘rtta amalni rejalash jarayonida dastlab bajariladiganidan oxirgi bosqichgacha tartiblang.'),
('98e4ebdd-ad4a-4b09-9139-7df035575c99'::uuid,'Amaliy ko‘nikmani o‘rgatish darsining to‘rtta bosqichini o‘qituvchi ishining boshlanishidan natijani tekshirish va keyingi qadamni belgilashgacha ketma-ket joylashtiring.'),
('bb897df8-2c9f-4990-9a79-04c856d59564'::uuid,'Sinf rahbari ikki o‘quvchi o‘rtasidagi nizoni bartaraf etmoqda. Berilgan amallarni dastlab xavfsizlikni ta’minlashdan kelishuv va keyingi kuzatuvgacha bajarilish tartibida joylashtiring.'),
('f6052b28-c3f8-4872-808f-3f27f021e8cc'::uuid,'O‘qituvchi xato qilgan o‘quvchiga pedagogik nazokat bilan munosabat bildirmoqchi. Berilgan amallarni dastlab vaziyatni kuzatishdan keyingi o‘zgarishni kuzatishgacha tartiblang.'),
('5d673373-3a8e-442e-8b29-8cfc184f40cd'::uuid,'Informatika darsi uchun metodik tizim ishlab chiqilmoqda. Quyidagi amallarni loyihalash jarayonida bajarilishining mantiqiy tartibi bo‘yicha eng avvalidan yakuniy tekshiruv rejasigacha joylashtiring.'),
('7582c63d-69c6-4cb3-aa1f-db4280dcd7b0'::uuid,'Informatika darsida yangi metod kutilgan natijani barcha o‘quvchilar uchun bermadi. O‘qituvchi metodni dalillar bilan baholamoqchi. Quyidagi to‘rtta amalni tekshiruvni rejalashdan takomillashtirish natijasini qayta kuzatishgacha tartiblang.'),
('b00d6c90-e6b3-4f02-9172-6c2af208f35f'::uuid,'Pedagog ta’limiy vaziyatda biror metodik qarorni dalillar bilan asoslamoqchi. Berilgan amallarni dastlabki maqsadni aniqlashdan qaror natijasini qayta tekshirishgacha bajarilish tartibida joylashtiring.'),
('b3a67927-4bb2-4b1b-8221-ef5189440acb'::uuid,'Informatika darsida o‘qitish metodini tanlash jarayonidagi amallarni eng avvalgi maqsadni belgilashdan yakuniy vosita va natijani tekshirish rejasigacha mantiqiy tartibda joylashtiring.')
 ) AS draft(source_id,clarified_stem)
 LOOP
   SELECT * INTO src FROM public.questions
     WHERE id=r.source_id AND status='published'::public.content_status FOR UPDATE;
   IF NOT FOUND THEN CONTINUE; END IF;
   IF src.format<>'Y3'::public.question_format THEN RAISE EXCEPTION 'Not Y3 %',r.source_id; END IF;
   IF EXISTS (SELECT 1 FROM public.question_bank_revisions WHERE source_question_id=src.id)
     OR EXISTS (SELECT 1 FROM public.pedagogy_revision_queue WHERE source_question_id=src.id AND revision_question_id IS NOT NULL)
   THEN CONTINUE; END IF;
   SELECT k.payload INTO old_key FROM public.question_keys k WHERE k.question_id=src.id;
   IF jsonb_typeof(old_key->'order')<>'array'
      OR (SELECT count(*) FROM jsonb_array_elements_text(old_key->'order'))<>4
      OR (SELECT count(*) FROM public.question_options WHERE question_id=src.id)<>4
   THEN RAISE EXCEPTION 'Original sequence invalid %',src.id; END IF;

   fresh:=gen_random_uuid(); keymap:='{}'::jsonb; fresh_order:='[]'::jsonb;
   INSERT INTO public.questions
      (id,subject_id,construct_id,group_code,format,cognitive,difficulty,
       stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
   VALUES(fresh,src.subject_id,src.construct_id,src.group_code,src.format,src.cognitive,
      src.difficulty,r.clarified_stem,src.assets,false,'review'::public.content_status,
      NULL,'revision:pedagogy:'||src.id::text,src.source_lesson_id);
   FOR old_item IN SELECT id,side,order_idx,content_md FROM public.question_options
                   WHERE question_id=src.id ORDER BY side,order_idx
   LOOP
     fresh_option:=gen_random_uuid();
     INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
     VALUES(fresh_option,fresh,old_item.side,old_item.order_idx,old_item.content_md);
     keymap:=keymap||jsonb_build_object(old_item.id::text,fresh_option::text);
   END LOOP;
   FOR old_id IN SELECT value FROM jsonb_array_elements_text(old_key->'order')
   LOOP
     new_id:=keymap->>old_id;
     IF new_id IS NULL THEN RAISE EXCEPTION 'Cannot map Y3 key %',src.id; END IF;
     fresh_order:=fresh_order||to_jsonb(new_id);
   END LOOP;
   INSERT INTO public.question_keys(question_id,payload,explanation_md)
     SELECT fresh,jsonb_build_object('order',fresh_order),explanation_md
     FROM public.question_keys WHERE question_id=src.id;
   INSERT INTO public.question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
   VALUES(src.id,fresh,'pedagogy_y3_workflow_prompt_clarity',
      jsonb_build_object('reason','Specify start/end of practical sequence; original source immutable',
       'answer_order_unchanged',true,'editorial_state','AI semantic wording correction'));
   INSERT INTO public.pedagogy_revision_queue(source_question_id,revision_question_id,reason)
   VALUES(src.id,fresh,'Specify start and end of Y3 ordering criterion')
   ON CONFLICT(source_question_id) DO UPDATE SET revision_question_id=excluded.revision_question_id,reason=excluded.reason
   WHERE public.pedagogy_revision_queue.revision_question_id IS NULL;
 END LOOP;
END
$sequence$;
COMMIT;
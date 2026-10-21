-- Stage NEW second-generation review revisions. First-generation items were published
-- concurrently while the editorial work was being prepared; do not mutate published rows.
-- Original PDF source correspondence verified, independent human publication not claimed.
BEGIN;
DO $stage$
DECLARE rec record; orig public.questions%rowtype; fresh uuid; opt uuid; key_id uuid; idx integer; existing_idx integer;
BEGIN
 FOR rec IN SELECT * FROM (VALUES
('631b17ec-1ab7-45cc-b51f-655e0efa6cf1'::uuid,1,'Pedagog mavzuni tushuntirayotganda fikrni uzmasdan bayon etadi, tabiiy temp va ritmni saqlab, ifodali so‘zlaydi. Bunda nutqning qaysi sifati ustuvor?','["Mantiqiylik — xulosalarni dalil va sabablar bilan bog‘lash","Ravonlik — fikr oqimini uzluksiz va mos tempda ifodalash","Aniqlik — atama va tushunchalarni bir ma’noda ishlatish","Moslik — bayonni tinglovchining tayyorgarligiga moslash"]'::jsonb,'Fikrning uzluksiz oqimi, ifodalilik hamda temp va ritmning to‘g‘riligi nutq ravonligiga tegishli. Asl 2025-yil kuzgi (3) PDF manbasidagi 1, 2 va 4-bandga mos.'),
('22c094b2-6a85-47ac-b639-a2394b6a5861'::uuid,2,'O‘qituvchi darsdagi xulosalarni ketma-ket asoslab, hodisalar o‘rtasidagi sabab-oqibat aloqalarini ochib beradi. Bu nutqning qaysi sifatini ko‘rsatadi?','["Moslik — bayonni auditoriya ehtiyojiga qarab o‘zgartirish","Ta’sirchanlik — emotsional urg‘u bilan diqqatni jalb qilish","Mantiqiylik — fikrlarni izchil va dalilli bog‘lash","Ravonlik — so‘zlarni uzluksiz va tabiiy tempda aytish"]'::jsonb,'Nutq mantiqiyligida izchillik, sabab-oqibat aloqasi, ta’kidlash va dalilli izoh muhim. Original 2025-yil kuzgi (3) PDF 32-savolda 2, 3, 4, 5-bandlar berilgan.'),
('7ce2655a-0fc8-4446-97f1-0f26240b2a03'::uuid,1,'Darsda o‘qituvchi muhim fikrlarni urg‘u bilan ajratadi, o‘rinli pauza qiladi va ovoz tembri hamda intonatsiyani boshqaradi. Bu nutqning qaysi jihati?','["Mantiqiy tuzilish — xulosalarning izchil va asosli bog‘lanishi","Ritmika — urg‘u, pauza, tembr va intonatsiya uyg‘unligi","Aniqlik — tushunchalarni bir ma’noli va konkret ifodalash","Mazmun to‘liqligi — mavzudagi asosiy fikrlarni qamrab olish"]'::jsonb,'Nutq ritmikasida tembr, intonatsiya, urg‘u va pauza muhim. Asl 2025-yil kuzgi (3) PDF savolida 1, 2, 3, 4 javobi berilgan.')
 ) AS revisions(source_id,correct_idx,stem,options,explanation)
 LOOP
   SELECT * INTO orig FROM public.questions WHERE id=rec.source_id FOR UPDATE;
   IF NOT FOUND OR orig.status<>'published'::public.content_status THEN CONTINUE; END IF;
   IF EXISTS (SELECT 1 FROM public.question_bank_revisions WHERE source_question_id=rec.source_id)
      OR EXISTS (SELECT 1 FROM public.pedagogy_revision_queue WHERE source_question_id=rec.source_id AND revision_question_id IS NOT NULL)
   THEN CONTINUE; END IF;
   SELECT o.order_idx INTO existing_idx
   FROM public.question_keys k JOIN public.question_options o
      ON o.question_id=k.question_id AND o.id=(k.payload->>'correct_option_id')::uuid
   WHERE k.question_id=rec.source_id;
   IF existing_idx IS DISTINCT FROM rec.correct_idx OR orig.format<>'Y1'::public.question_format
      OR (SELECT count(*) FROM public.question_options WHERE question_id=rec.source_id)<>4
      OR jsonb_array_length(rec.options)<>4
   THEN RAISE EXCEPTION 'Published original key/format mismatch %',rec.source_id; END IF;
   fresh:=gen_random_uuid();key_id:=NULL;
   INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
   VALUES(fresh,orig.subject_id,orig.construct_id,orig.group_code,orig.format,orig.cognitive,orig.difficulty,rec.stem,
     orig.assets,false,'review'::public.content_status,NULL,'revision:pedagogy:'||orig.id::text,orig.source_lesson_id);
   FOR idx IN 0..3 LOOP
      opt:=gen_random_uuid();
      INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
      VALUES(opt,fresh,'a',idx,rec.options->>idx);
      IF idx=rec.correct_idx THEN key_id:=opt; END IF;
   END LOOP;
   INSERT INTO public.question_keys(question_id,payload,explanation_md)
     VALUES(fresh,jsonb_build_object('correct_option_id',key_id),rec.explanation);
   INSERT INTO public.question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
     VALUES(orig.id,fresh,'pedagogy_source_verified_case_distractor_v2',
       jsonb_build_object('status','AI editorial proposal, human review pending',
        'old_source_immutable',true,'reference_pdf','Pedmahorat to''plam 2025 kuzgi (3).pdf'));
   INSERT INTO public.pedagogy_revision_queue(source_question_id,revision_question_id,reason)
     VALUES(orig.id,fresh,'Case-based quality upgrade; independent editorial approval required')
     ON CONFLICT (source_question_id) DO UPDATE SET revision_question_id=excluded.revision_question_id
     WHERE public.pedagogy_revision_queue.revision_question_id IS NULL;
 END LOOP;
END
$stage$;
COMMIT;
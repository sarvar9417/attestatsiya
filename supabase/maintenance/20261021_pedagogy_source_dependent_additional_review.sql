-- Manbaga havola qiluvchi stemlar uchun yangi REVIEW nusxalar.
-- Original published savollar va tarixiy attemptlar buzilmaydi.
BEGIN;
DO $remediate$
DECLARE r record; src public.questions%rowtype; o record; v_new uuid; old_answer uuid; new_answer uuid; opt uuid; c integer;
BEGIN
 FOR r IN SELECT * FROM (VALUES
('24916d08-008f-43df-90e6-720f58982678'::uuid,'Pedagog nutqining ravonligiga xos belgilarni aniqlang: 1) Fikr uzluksizligi. 2) Ifodalilik. 3) Adolatlilik. 4) To‘g‘ri temp va ritm. 5) Insonparvarlik. Qaysilari bevosita nutq ravonligiga tegishli?'),
('3c7a7353-968d-4c85-a7f5-c12a6bc9ed4c'::uuid,'Klassik Blum taksonomiyasining kognitiv bosqichlari qaysi ketma-ketlikda joylashtiriladi?'),
('44c4a015-c096-411c-ac80-2131dd73584a'::uuid,'Pedagog yangi g‘oyalarni ilgari suradi, noodatiy metod ishlab chiqadi va muammoga samarali yangi yechim taklif qiladi. Ushbu vaziyatda qaysi kasbiy sifat namoyon bo‘ladi?'),
('53e55b2d-544b-4393-abeb-3d102a3f7bc8'::uuid,'Darsda nazariya qisqacha mustahkamlanib, o‘quvchilar amaliy topshiriqlarni bajaradi, natijalar baholanadi va uy vazifasi beriladi. Bu qaysi dars turiga xos?'),
('588d5d9c-b227-4b6f-a9af-06f6a8573548'::uuid,'Pedagog nutqining mantiqiyligini ifodalaydigan belgilarni aniqlang: 1) Tinglovchiga moslashish. 2) Izchillik. 3) Sabab-oqibat aloqasi. 4) Ta’kidlash. 5) Izoh va asos.'),
('60ee4c08-c961-4600-89a0-72610bf85ff6'::uuid,'Pedagog nutqining ritm va ohang bilan bog‘liq belgilarini aniqlang: 1) Tembr. 2) Intonatsiya. 3) Urg‘u. 4) Pauza. 5) Konkretlik. Qaysilari bevosita tegishli?'),
('713ffdb4-1c6a-46b5-b6ef-7718f8e93ace'::uuid,'Pedagog o‘quvchilarga hissiyotlarini ijodiy ifodalash va estetik tafakkurni rivojlantirish imkonini yaratdi. Pedagogik faoliyatning qaysi jihati namoyon bo‘ldi?'),
('89a424e0-0af1-4aa4-9431-2f4c548b497b'::uuid,'O‘qituvchi Yer qatlamlarini tushuntirishda xarita, atlas, slayd va diagrammalardan foydalanib, har bir tasvirga sharh berdi. Qaysi ko‘rgazmali ta’lim metodi qo‘llandi?'),
('aa0ebddf-5b9a-40d9-8c47-136c444f7086'::uuid,'Dars tashkiliy qismdan keyin yangi mavzuni bayon qilish bilan davom etadi, so‘ng material mustahkamlanib, uy vazifasi beriladi. Bu qaysi dars turiga xos?'),
('cfdfc860-3fe1-4046-9f61-96f08c164e90'::uuid,'Pedagog o‘z faoliyatini ijtimoiy talablar, huquqiy me’yorlar va ta’lim standartlari asosida rejalashtirib, ishini shu talablarga muvofiq olib boradi. Bu qaysi kasbiy sifat?'),
('d721b649-e3d3-456c-b554-8323e48c7a0e'::uuid,'Pedagogik refleksiya atamasidagi lotincha «reflexio» so‘zining asosiy ma’nosi nima?')
,
('0ac69f96-1a20-44d5-8a92-f1fb3038107b'::uuid,'O‘qituvchi o‘tgan darsning samarali va sust jihatlarini tahlil qilib, keyingi darsiga o‘zgartirishlar kiritdi. Bu kreativlikning qaysi jihatini ko‘rsatadi?'),
('220929cc-5635-4080-b20f-59576833fd50'::uuid,'O‘qituvchi guruhda yoki mustaqil ishlashni o‘quvchilar tanloviga qoldirib, jarayonga deyarli aralashmadi. Qaysi boshqaruv uslubi namoyon bo‘lmoqda?'),
('389f3699-02e1-4126-9037-253b775928a3'::uuid,'O‘qituvchi o‘quvchining boshqa fanga bo‘lgan qiziqishini inkor etib, uni matematika olimpiadasiga majburan yo‘naltirdi. Bu qaysi pedagogik tamoyilga zid?'),
('549298ca-ea79-40cd-89ff-1f7f1adc9257'::uuid,'Xavfsiz va rivojlantiruvchi ta’lim muhitini ta’minlashda pedagogning qanday huquqiy bilimga ega bo‘lishi muhim?'),
('7763dd85-4cc4-4996-a9d0-d87eb544da63'::uuid,'O‘quvchilar tarixga oid alohida dalillarni tahlil qilib, ulardan umumiy xulosa chiqardi. Bunday fikrlash qaysi metodga asoslanadi?'),
('9148e2cb-13ba-4490-85ea-7ba843911c77'::uuid,'Maktab o‘qituvchilari bir-birini qo‘llab-quvvatlab, kasbiy faoliyatini o‘zaro hamkorlikda olib bormoqda. Refleksiyaning qaysi turi namoyon bo‘ladi?'),
('9662ad36-1aff-4a77-9fd3-ac6a4579d5b3'::uuid,'Ikki o‘quvchi o‘rtasida nizo yuzaga keldi. O‘qituvchi har ikki tomonni tinglab, adolatli xulosa chiqardi. Qaysi nizoni hal etish usuli qo‘llandi?'),
('9c3250d6-ab53-4548-a8cd-5467bbad5a4f'::uuid,'O‘qituvchi mavzuga oid rasmlarni doskaga ilib, shu tasvirlarga tayangan holda mavzuni tushuntirdi. Qaysi an’anaviy ta’lim metodi qo‘llandi?'),
('a3768e0f-c8b2-45ac-89ca-575fa39d8a06'::uuid,'O‘qituvchi sinfni kichik guruhlarga bo‘ldi. Har bir guruh qisqa vaqtda muammo bo‘yicha fikr aytib, eng maqbul taklifni tanladi. Qaysi interfaol metodga misol?'),
('c02b2968-30ad-494c-b2a8-70decca36dbc'::uuid,'Ikki o‘quvchi o‘rtasidagi nizoda o‘qituvchi tomonlarga dalillar va mantiqiy asoslarni ko‘rsatib, ularni kelishtirdi. Qaysi pedagogik ta’sir usuli qo‘llandi?'),
('d7585fb9-68ed-46cd-b13f-2420ce813553'::uuid,'Pedagog o‘quvchining ovozi, yuz ifodasi va tana harakatlarini kuzatib, uning hissiy holatini angladi. Qaysi pedagogik qobiliyat namoyon bo‘ldi?'),
('fe3791fb-259f-4a29-b1ef-3014bd7a115a'::uuid,'Pedagog o‘z fikrini o‘quvchiga aniq va ta’sirchan yetkazishi uchun qaysi nutqiy sifatga tayanadi?')
 ) AS proposed(source_id,stem)
 LOOP
  SELECT * INTO STRICT src FROM public.questions
   WHERE id=r.source_id AND status='published'::public.content_status FOR UPDATE;
  IF EXISTS (SELECT 1 FROM public.pedagogy_revision_queue WHERE source_question_id=r.source_id AND revision_question_id IS NOT NULL)
   OR EXISTS (SELECT 1 FROM public.question_bank_revisions WHERE source_question_id=r.source_id)
   THEN CONTINUE; END IF;
  IF src.format<>'Y1'::public.question_format THEN RAISE EXCEPTION 'Expected Y1 for %',r.source_id;END IF;
  SELECT (payload->>'correct_option_id')::uuid INTO old_answer FROM public.question_keys WHERE question_id=r.source_id;
  SELECT count(*) INTO c FROM public.question_options WHERE question_id=r.source_id AND side='a';
  IF old_answer IS NULL OR c<>4 OR length(r.stem)<25 THEN RAISE EXCEPTION 'Incomplete input %',r.source_id;END IF;
  v_new:=gen_random_uuid(); new_answer:=NULL;
  INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,
    stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
   VALUES(v_new,src.subject_id,src.construct_id,src.group_code,src.format,src.cognitive,
    src.difficulty,r.stem,src.assets,false,'review'::public.content_status,NULL,
    'revision:pedagogy:'||src.id::text,src.source_lesson_id);
  FOR o IN SELECT id,side,order_idx,content_md FROM public.question_options WHERE question_id=src.id ORDER BY side,order_idx LOOP
    opt:=gen_random_uuid();
    INSERT INTO public.question_options(id,question_id,side,order_idx,content_md) VALUES(opt,v_new,o.side,o.order_idx,o.content_md);
    IF o.id=old_answer THEN new_answer:=opt;END IF;
  END LOOP;
  IF new_answer IS NULL THEN RAISE EXCEPTION 'Unmapped answer %',r.source_id;END IF;
  INSERT INTO public.question_keys(question_id,payload,explanation_md)
   SELECT v_new,jsonb_build_object('correct_option_id',new_answer),explanation_md
   FROM public.question_keys WHERE question_id=src.id;
  INSERT INTO public.question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
   VALUES(src.id,v_new,'source_dependent_pedagogy_stem_review',
    jsonb_build_object('editorial_state','AI wording draft, original key copied; independent subject review required',
     'original_source_reference',src.source_reference,'original_snapshot_preserved',true));
  INSERT INTO public.pedagogy_revision_queue(source_question_id,revision_question_id,reason)
   VALUES(src.id,v_new,'Source-dependent wording; editorial check required before publication')
   ON CONFLICT(source_question_id) DO UPDATE SET revision_question_id=excluded.revision_question_id,reason=excluded.reason
   WHERE public.pedagogy_revision_queue.revision_question_id IS NULL;
  INSERT INTO public.question_quality_findings(question_id,finding_code,severity,details)
   VALUES(src.id,'source_dependent_stem_review_required','high',
    jsonb_build_object('draft_revision_id',v_new,'source_label_in_stem',true,'human_approval','pending'))
   ON CONFLICT (question_id,finding_code) DO NOTHING;
 END LOOP;
END
$remediate$;
COMMIT;

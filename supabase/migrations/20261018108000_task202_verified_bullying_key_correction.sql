-- TASK-202: independent check found a reversed key in 2026 spring PDF Q144.
-- Source answer "2,4" marks constructive acts as prohibited. Instead 1,3
-- (ignore bullying; threaten pupils with punishment) are inappropriate.
-- https://www.stopbullying.gov/prevention/on-the-spot
-- https://www.unesco.org/en/articles/qa-role-teachers-preventing-and-addressing-school-violence
-- Raw private source remains conflict/rejected. Original practice is REVIEW only.
begin;
do $q144$
declare v_q uuid;v_c record;v_l uuid;v_o uuid;i int;
 v_opts text[]:=array['2 va 4','3 va 5','1 va 3','1 va 5'];
begin
 if exists(select 1 from public.questions
   where source_reference='authored:pedagogy-key-correction:2026:spring:p30:q144')
 then return;end if;
 select id,subject_id,group_code into strict v_c from public.constructs
  where code='KS.05' and is_active;
 select l.id into strict v_l from public.lessons l
 join public.lesson_constructs lc on lc.lesson_id=l.id
 where lc.construct_id=v_c.id and l.status='published'::public.content_status
 order by l.id limit 1;
 v_q:=gen_random_uuid();
 insert into public.questions(id,subject_id,construct_id,group_code,format,
 cognitive,difficulty,stem_md,status,is_generated,source_reference,source_lesson_id)
 values(v_q,v_c.subject_id,v_c.id,v_c.group_code,'Y1'::public.question_format,
 'qollash'::public.cognitive_level,3,
 'Bir o‘quvchi sinfdoshlari tomonidan muntazam masxara qilinmoqda. Quyidagilardan qaysi ikkisini o‘qituvchi qilmasligi kerak? 1) Holatni e’tiborsiz qoldirish. 2) Muammoni xavfsiz muhokama qilish. 3) Bolalarni jazo bilan qo‘rqitish. 4) Jabrlanuvchini qo‘llab-quvvatlash. 5) Zarur bo‘lsa psixolog yordamiga murojaat qilish.',
 'review'::public.content_status,false,
 'authored:pedagogy-key-correction:2026:spring:p30:q144',v_l);
 for i in 1..4 loop
  v_o:=gen_random_uuid();
  insert into public.question_options(id,question_id,side,order_idx,content_md)
   values(v_o,v_q,'a',i-1,v_opts[i]);
  if i=3 then
   insert into public.question_keys(question_id,payload,explanation_md)
   values(v_q,jsonb_build_object('correct_option_id',v_o),
    'Masxaralashni e’tiborsiz qoldirish yoki jazo bilan qo‘rqitish to‘g‘ri pedagogik javob emas. Muhokama, himoya va ehtiyojga mos psixologik yordam ma’qul. UNESCO va StopBullying.gov ko‘rsatmalari bilan solishtirildi.');
  end if;
 end loop;
end $q144$;
commit;
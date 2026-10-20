-- TASK-202: independent textbook review found a wrong key in private 2026 spring PDF.
-- Source compilation q14 says "Sintetik usul"; goal->givens is ANALITIK.
-- Do not overwrite the historical source or mark its erroneous key verified.
-- Evidence: M.E. Jumayev / Z.G'. Tadjiyeva, Boshlang'ich sinflarda
-- matematika o'qitish metodikasi (2004), source:
-- https://turan-edu.uz/media/books/2026/01/27/Jumayev_mom_20041_2.pdf
begin;
do $corrected$
declare v_q uuid;v_c record;v_lesson uuid;v_o uuid;i int;
  v_opts text[]:=array[
    'Sintetik usul','Induktiv usul','Analitik usul','Analitik-sintetik usul'
  ];
begin
 if exists(select 1 from public.questions
  where source_reference='authored:pedagogy-key-correction:2026:spring:p3:q14')
 then return;end if;
 select id,subject_id,group_code into strict v_c
 from public.constructs where code='PM.GEN.08' and is_active;
 select l.id into strict v_lesson
 from public.lessons l join public.lesson_constructs lc on lc.lesson_id=l.id
 where lc.construct_id=v_c.id and l.status='published'::public.content_status
 order by l.id limit 1;
 v_q:=gen_random_uuid();
 insert into public.questions(
 id,subject_id,construct_id,group_code,format,cognitive,difficulty,
 stem_md,status,is_generated,source_reference,source_lesson_id)
 values(
 v_q,v_c.subject_id,v_c.id,v_c.group_code,'Y1'::public.question_format,
 'qollash'::public.cognitive_level,3,
 'Masalani yechishda o‘qituvchi avval izlanayotgan kattalikni aniqlaydi. Uni topish uchun zarur bog‘lanishlarni ketma-ket tahlil qilib, berilgan ma’lumotlar tomon orqaga qarab boradi. Bu qanday usul?',
 'review'::public.content_status,false,
 'authored:pedagogy-key-correction:2026:spring:p3:q14',v_lesson);
 for i in 1..4 loop
   v_o:=gen_random_uuid();
   insert into public.question_options(id,question_id,side,order_idx,content_md)
   values(v_o,v_q,'a',i-1,v_opts[i]);
   if i=3 then
     insert into public.question_keys(question_id,payload,explanation_md)
     values(v_q,jsonb_build_object('correct_option_id',v_o),
     'Analitik usul masala savoli yoki izlanayotgan kattalikdan boshlanib, berilgan ma’lumotlarga tomon yuradi. Sintetik usul esa berilganlardan boshlanadi. M.E. Jumayev va Z.G‘. Tadjiyeva (2004) metodika darsligi bilan solishtirildi.');
   end if;
 end loop;
end $corrected$;
commit;
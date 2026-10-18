-- TASK-202 PDF original authoring: private verified source -> review only.
-- All fixtures rolled back, never authenticates a real historic exam claim.
begin;
insert into auth.users(id,email)
values('92800000-0000-4000-8000-000000000031','pdf-author-fixture@example.test');
update public.profiles set role='editor',is_blocked=false
where id='92800000-0000-4000-8000-000000000031';

insert into public.pedagogy_pdf_source_candidates(
 id,source_file_name,source_year,source_sitting,page_no,source_question_no,
 raw_question_private,raw_answer_private,text_sha256
) values (
 '92800000-0000-4000-8000-000000000032',
 'task202-source-fixture.pdf',2025,'diagnostic',1,1,
 'Faqat sinov uchun ishlatiladigan shaxsiy pedagogik savol manbasi?',
 'Rasmiy kalit emas, tekshirilgan deb faraz qilingan test qiymati.',
 encode(digest('task202-private-fixture','sha256'),'hex')
);
update public.pedagogy_pdf_source_candidates
set editorial_status='verified',answer_key_status='independently_verified',
    mapped_construct_id=(select id from public.constructs
                          where code='KS.01' and is_active limit 1),
    mapping_confidence='high',
    verification_basis='Synthetic fixture for revision tests; not a real document',
    reviewed_at=now()
where id='92800000-0000-4000-8000-000000000032';

do $task202$
declare v_id uuid;v_again uuid;v_denied boolean;v_qid uuid;
begin
 v_qid:='92800000-0000-4000-8000-000000000032';
 v_denied:=false;
 begin
  perform public.stage_verified_pdf_pedagogy_question(
   v_qid,'92800000-0000-4000-8000-000000000031',
   'O‘quv jarayonida natijani qanday belgilash kerak?',
   array['Aniq kuzatiladigan kompetensiyani mezon bilan belgilash',
         'Faqat mavzu nomini dars boshida yozish',
         'Faqat slayd miqdorini oldindan rejalashtirish',
         'Kundalik tartibning ko‘rinishini bir xil saqlash']::text[],
   0,'O‘lchanadigan natija kuzatish va baholash mezoni bilan bog‘liq');
 exception when check_violation then v_denied:=true; end;
 if v_denied then raise exception 'TASK202: valid verified source failed initial stage';end if;

 select linked_question_id into strict v_id from public.pedagogy_pdf_source_candidates
 where id=v_qid;
 if v_id is null then raise exception 'TASK202: source link absent';end if;
 v_again:=public.stage_verified_pdf_pedagogy_question(
   v_qid,'92800000-0000-4000-8000-000000000031',
   'O‘quv jarayonida natijani qanday belgilash kerak?',
   array['Aniq kuzatiladigan kompetensiyani mezon bilan belgilash',
         'Faqat mavzu nomini dars boshida yozish',
         'Faqat slayd miqdorini oldindan rejalashtirish',
         'Kundalik tartibning ko‘rinishini bir xil saqlash']::text[],
   0,'O‘lchanadigan natija kuzatish va baholash mezoni bilan bog‘liq');
 if v_again<>v_id then raise exception 'TASK202: duplicate question on retry';end if;
 if not exists(select 1 from public.questions q where q.id=v_id
    and q.status='review'::public.content_status
    and q.group_code='KS' and q.author_id='92800000-0000-4000-8000-000000000031')
 or (select count(*) from public.question_options o
      where o.question_id=v_id and o.side='a')<>4
 or not exists(select 1 from public.question_options o
     join public.question_keys k on k.question_id=o.question_id
     where o.question_id=v_id and o.id::text=k.payload->>'correct_option_id') then
   raise exception 'TASK202: source review item shape/answer key invalid';
 end if;
 if has_function_privilege('authenticated',
     'public.stage_verified_pdf_pedagogy_question(uuid,uuid,text,text[],integer,text)','EXECUTE')
 then raise exception 'TASK202: learner can stage private sources';end if;

 insert into public.pedagogy_pdf_source_candidates(
   id,source_file_name,source_year,source_sitting,page_no,source_question_no,
   raw_question_private,raw_answer_private,text_sha256
 ) values (
   '92800000-0000-4000-8000-000000000033','task202-source-fixture.pdf',
   2025,'diagnostic',1,2,
   'Another private source candidate with no independently checked answer',
   'Unverified answer',encode(digest('task202-private-fixture2','sha256'),'hex')
 );
 v_denied:=false;
 begin
   perform public.stage_verified_pdf_pedagogy_question(
     '92800000-0000-4000-8000-000000000033',
     '92800000-0000-4000-8000-000000000031',
     'O‘quv jarayonida natijani qanday belgilash kerak?',
     array['Aniq kuzatiladigan kompetensiyani mezon bilan belgilash',
           'Faqat mavzu nomini dars boshida yozish',
           'Faqat slayd miqdorini oldindan rejalashtirish',
           'Kundalik tartibning ko‘rinishini bir xil saqlash'],
     0,'O‘lchanadigan natija kuzatish va baholash mezoni bilan bog‘liq');
 exception when check_violation then v_denied:=true;end;
 if not v_denied then raise exception 'TASK202: unverified source stage accepted';end if;
end
$task202$;
rollback;

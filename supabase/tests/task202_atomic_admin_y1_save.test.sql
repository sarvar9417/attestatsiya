-- TASK-202: atomic create/edit; all modifications rolled back.
begin;
insert into auth.users(id,email)
values ('92900000-0000-4000-8000-000000000011','task202-atomic-editor@example.test');
update public.profiles set role='admin',is_blocked=false
where id='92900000-0000-4000-8000-000000000011';
do $qa$
declare
 actor uuid:='92900000-0000-4000-8000-000000000011';
 construct uuid; item uuid; n int; before_key uuid; after_key uuid;
 saved_text text; failed boolean;
begin
 select id into strict construct from public.constructs
 where code='KS.01' and is_active;
 if has_function_privilege('authenticated',
   'public.save_admin_y1_question(uuid,uuid,uuid,text,public.cognitive_level,integer,text[],integer,text)','EXECUTE')
 then raise exception 'TASK202 learner may call save RPC';end if;
 item:=public.save_admin_y1_question(actor,null,construct,
 'Formativ baholashdan keyin qaysi amaliy qadam asosli?',
 'qollash',3,
 array['Natijani taxmin qilmasdan tekshirish','Aniq dalil asosida qayta rejalashtirish',
       'Baholarni o‘zgartirmasdan davom etish','Faqat reyting jadvalini yangilash'],
 1,'Rejalashtirish tahlil va o‘quvchi ehtiyojiga asoslanishi kerak.');
 if (select count(*) from public.question_options where question_id=item and side='a')<>4
 then raise exception 'TASK202 create did not store 4 options';end if;
 select (payload->>'correct_option_id')::uuid into strict before_key
 from public.question_keys where question_id=item;
 if (select order_idx from public.question_options where id=before_key)<>1
 then raise exception 'TASK202 wrong correct option';end if;
 select stem_md into saved_text from public.questions where id=item;
 failed:=false;
 begin
  perform public.save_admin_y1_question(actor,item,construct,
    'This edit must roll back','qollash',3,
    array['Takror','Takror','Alohida uchinchi javob','Alohida to‘rtinchi javob'],
    0,'This key and option transaction must roll back.');
 exception when check_violation then failed:=true;end;
 if not failed then raise exception 'TASK202 duplicate edit was not rejected';end if;
 if (select stem_md from public.questions where id=item)<>saved_text then
   raise exception 'TASK202 partial draft changed on invalid save';end if;
 if (select (payload->>'correct_option_id')::uuid
   from public.question_keys where question_id=item)<>before_key
 then raise exception 'TASK202 failed save changed answer key';end if;
 perform public.save_admin_y1_question(actor,item,construct,
  'Yangi muvaffaqiyatli savol qaysi?','bilish',2,
  array['Ma’lumotni qayta tartiblash','Ilmiy dalil bilan natijani solishtirish',
        'Boshqa mezondan foydalanish','Faoliyatni umumiy baholash'],
   2,'Yangi javobni qayta yozganda key va variantlar atomik saqlanadi.');
 select (payload->>'correct_option_id')::uuid into strict after_key
 from public.question_keys where question_id=item;
 if after_key=before_key or
  (select order_idx from public.question_options where id=after_key)<>2
  or (select count(*) from public.question_options where question_id=item)<>4
 then raise exception 'TASK202 save options and keys not reconciled';end if;
 if (select status from public.questions where id=item)<>'draft'::public.content_status
 then raise exception 'TASK202 authoring mistakenly published draft';end if;
end $qa$;
rollback;
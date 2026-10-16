-- Human source-candidate reviews are quarantined and cannot release exam items.
begin;
do $pedguli_review_test$
declare
 v_reviewer uuid:='79800000-0000-4000-8000-000000000001';
 v_id uuid;
 v_question_count int;
 v_failed boolean;
begin
 select count(*) into v_question_count from public.questions;
 insert into auth.users(id,email)
 values (v_reviewer,'pedguli-private-review-local@example.test');
 insert into public.pedguli_source_candidates(
  source_message_id,source_url,source_html,text_sha256,raw_text_private,suggested_constructs
 ) values (
  888002,'https://t.me/PedMahoratGuli/888002','messages4.html',
  repeat('c',64),'Test savolining asl Telegram matni mualliflik huquqi va javob tekshiruvida.',
  array['PM.GEN.07']
 ) returning id into v_id;

 v_failed:=false;
 begin
   update public.pedguli_source_candidates set raw_text_private='Changed source message' where id=v_id;
 exception when check_violation then v_failed:=true;end;
 if not v_failed then raise exception 'Source text mutation was accepted';end if;

 v_failed:=false;
 begin
   update public.pedguli_source_candidates
   set editorial_status='verified',
       reviewer_id=v_reviewer, reviewed_at=now(),
       review_notes='Savol matni aniq, lekin dalilli javob va qayta foydalanish ruxsati yo‘q.'
   where id=v_id;
 exception when check_violation then v_failed:=true;end;
 if not v_failed then raise exception 'Unverified key/license was allowed as verified';end if;

 update public.pedguli_source_candidates
 set editorial_status='needs_rights',
     reviewer_id=v_reviewer,reviewed_at=now(),
     review_notes='Javob hali tasdiqlanmagan; mualliflikdan foydalanish ruxsati ham noma’lum.'
 where id=v_id;
 if (select editorial_status from public.pedguli_source_candidates where id=v_id)<>'needs_rights'
 then raise exception 'Human review notes were not saved';end if;

 update public.pedguli_source_candidates
 set editorial_status='verified',
     answer_key_status='independently_verified',
     rights_status='permission_granted',
     historical_exam_claim_status='not_claimed',
     reviewer_id=v_reviewer,reviewed_at=now(),
     review_notes='Fikr va javob mustaqil pedagogika qo‘llanmasi bilan tekshirildi, huquq dalili alohida ko‘rildi.'
 where id=v_id;
 if (select editorial_status from public.pedguli_source_candidates where id=v_id)<>'verified'
 then raise exception 'Complete reviewer documentation was not stored';end if;
 if (select count(*) from public.questions)<>v_question_count
 then raise exception 'A private source review unexpectedly published learner questions';end if;
end
$pedguli_review_test$;
rollback;
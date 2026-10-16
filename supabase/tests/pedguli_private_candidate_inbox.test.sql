-- The candidate inbox is separate from public.questions and untrusted.
-- All changes occur inside rollback-only test transaction in CI.
begin;
do $pedguli_private_inbox_test$
declare
 v_q_before bigint;
 v_bad boolean;
begin
 select count(*) into v_q_before from public.questions;
 if has_table_privilege('anon','public.pedguli_source_candidates','SELECT')
  or has_table_privilege('authenticated','public.pedguli_source_candidates','SELECT')
  or has_table_privilege('anon','public.pedguli_source_candidates','INSERT')
  or has_table_privilege('authenticated','public.pedguli_source_candidates','INSERT')
 then raise exception 'Telegram private source table exposed to untrusted client roles';end if;
 if not (select relrowsecurity from pg_class where oid='public.pedguli_source_candidates'::regclass)
 then raise exception 'Telegram private source RLS must be enabled';end if;

 insert into public.pedguli_source_candidates(
  source_message_id,source_url,source_html,date_local,
  text_sha256,raw_text_private,suggested_constructs,key_marker_unverified
 )values(
  116,'https://t.me/PedMahoratGuli/116','messages.html',
  '12.02.2025 10:01:05 UTC+05:00',
  repeat('a',64),'Test nomzodi: to‘rtta javob varianti mavjud, lekin kalit noma’lum.',
  array['PM.GEN.01','PM.GEN.02'],true
 );
 if (select editorial_status from public.pedguli_source_candidates
     where source_message_id=116)<>'needs_review' then
    raise exception 'Imported source candidate was automatically approved';end if;
 if (select count(*) from public.questions)<>v_q_before then
   raise exception 'Candidate import unexpectedly changed learner question bank';end if;

 v_bad:=false;
 begin
  insert into public.pedguli_source_candidates(
   source_message_id,source_url,source_html,text_sha256,raw_text_private,
   editorial_status
  ) values(
   117,'https://t.me/PedMahoratGuli/117','messages.html',
   repeat('b',64),'Original Telegram post does not have a verified answer.',
   'verified'
  );
 exception when check_violation then v_bad:=true;end;
 if not v_bad then raise exception 'Auto-verified candidate insert was accepted';end if;

 v_bad:=false;
 begin
  insert into public.pedguli_source_candidates(
   source_message_id,source_url,source_html,text_sha256,raw_text_private
  ) values(
   118,'https://t.me/PedMahoratGuli/119','messages.html',
   repeat('c',64),'The Telegram source ID is inconsistent with its link.'
  );
 exception when check_violation then v_bad:=true;end;
 if not v_bad then raise exception 'Source ID mismatch was accepted';end if;

 v_bad:=false;
 begin
  insert into public.pedguli_source_candidates(
   source_message_id,source_url,source_html,text_sha256,raw_text_private
  ) values(
   119,'https://t.me/PedMahoratGuli/119','messages.html',
   repeat('a',64),'Second copy of the same text fingerprint for a different message.'
  );
 exception when unique_violation then v_bad:=true;end;
 if not v_bad then raise exception 'Fingerprint de-duplication constraint not enforced';end if;

 if (select count(*) from public.questions)<>v_q_before then
   raise exception 'Untrusted source archive polluted learner question bank';end if;
end
$pedguli_private_inbox_test$;
rollback;
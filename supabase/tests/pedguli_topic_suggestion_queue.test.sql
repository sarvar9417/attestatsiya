-- Topic suggestions are private annotations, never accepted as verified
-- mappings or answer keys. This test runs in a rollback-only transaction.
begin;
do $suggest$
declare
 v_id uuid; v_questions bigint; v_answer_keys bigint;
begin
 select count(*) into v_questions from public.questions;
 select count(*) into v_answer_keys from public.question_keys;
 insert into public.pedguli_source_candidates (
  source_message_id,source_url,source_html,text_sha256,raw_text_private,
  proposed_constructs,topic_suggestion_state,topic_suggestion_evidence
 )values(
  794321,'https://t.me/PedMahoratGuli/794321','messages2.html',
  repeat('d',64),'Pedagogik mavzu va metodika uchun original manba nomzodi.',
  array['PM.GEN.08']::text[],'strong_keyword',
  array['pedagogik texnologiya']::text[]
 )returning id into v_id;

 if (select editorial_status from public.pedguli_source_candidates where id=v_id)<>'needs_review'
   or (select answer_key_status from public.pedguli_source_candidates where id=v_id)<>'unverified'
   or (select cardinality(suggested_constructs) from public.pedguli_source_candidates where id=v_id)<>0
 then raise exception 'Suggestion incorrectly bypassed manual review';end if;
 if (select count(*) from public.questions)<>v_questions
    or (select count(*) from public.question_keys)<>v_answer_keys
 then raise exception 'Suggesting a topic changed public exam content';end if;
end
$suggest$;
rollback;
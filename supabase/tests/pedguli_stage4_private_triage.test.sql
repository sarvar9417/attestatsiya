-- Private pedagogical research annotations cannot become exam questions.
begin;
do $stage4_test$
declare before_questions integer; before_keys integer; candidate uuid;
begin
 select count(*) into before_questions from public.questions;
 select count(*) into before_keys from public.question_keys;
 if has_table_privilege('anon','public.pedguli_candidate_stage4_reviews','SELECT')
    or has_table_privilege('authenticated','public.pedguli_answer_source_comparisons','SELECT')
 then raise exception 'Private review evidence is visible to untrusted role';end if;
 insert into public.pedguli_source_candidates(
  source_message_id,source_url,source_html,text_sha256,raw_text_private
 )values(971394,'https://t.me/PedMahoratGuli/971394','messages19.html',
   repeat('e',64),'Pedagogik mahorat manbasidan pedagogik atamaga oid savol matni mavjud.')
 returning id into candidate;

 insert into public.pedguli_candidate_stage4_reviews(
  candidate_id,proposed_construct,alternate_construct,model_margin,
  review_bucket,review_warning
 )values(candidate,'PM.GEN.01','KS.03',0.61,'model_high_margin',
 'Machine suggestion is unverified and requires editorial review.');

 insert into public.pedguli_answer_source_comparisons(
  candidate_id,proposed_option,compared_concept,proposed_construct,
  source_title,source_url,evidence_summary
 )values(candidate,'C','Ta’lim','PM.GEN.01',
  'Umumiy pedagogika','https://lib.bimm.uz/items/download/10389',
  'Educational definition matched by researcher, still awaiting human expert and permission.');

 if exists(select 1 from public.pedguli_candidate_stage4_reviews
  where candidate_id=candidate and (expert_approved or rights_cleared or answer_verified))
 then raise exception 'Model suggestion silently approved';end if;

 if exists(select 1 from public.pedguli_answer_source_comparisons
  where candidate_id=candidate and (expert_approved or rights_cleared or transferable_answer_key))
 then raise exception 'Source-correspondence answer silently became publishable';end if;

 if (select count(*) from public.questions)<>before_questions or
 (select count(*) from public.question_keys)<>before_keys
 then raise exception 'Stage4 source analysis polluted exam bank';end if;

 if not exists(select 1 from public.pedguli_source_candidates
  where id=candidate and editorial_status='needs_review' and rights_status='not_cleared'
  and answer_key_status='unverified')
 then raise exception 'Source review and rights gate unexpectedly changed';end if;

end
$stage4_test$;
rollback;
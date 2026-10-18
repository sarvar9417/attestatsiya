-- Assistant proposals are not editorial signoffs. Validate length and privacy only.
begin;
do $qa$
declare count_good int;
begin
 with c as (
  select p.source_question_id,p.proposed_distractors,
   max(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+')))
      filter(where o.id::text=k.payload->>'correct_option_id') cw
  from public.pedagogy_rewrite_proposals p
  join public.questions q on q.id=p.source_question_id
  join public.question_keys k on k.question_id=q.id
  join public.question_options o on o.question_id=q.id and o.side='a'
  where q.status='published'::public.content_status and q.format='Y1'::public.question_format
  group by p.source_question_id,p.proposed_distractors
 ), audit as (
 select c.*, (select min(cardinality(regexp_split_to_array(btrim(w),'[[:space:]]+')))
  from unnest(c.proposed_distractors) w) min_wrong,
 (select max(cardinality(regexp_split_to_array(btrim(w),'[[:space:]]+')))
  from unnest(c.proposed_distractors) w) max_wrong,
 (select count(distinct lower(btrim(w))) from unnest(c.proposed_distractors) w) unique_wrong
 from c)
 select count(*) into count_good from audit
 where unique_wrong=3 and min_wrong>=2
  and greatest(cw,max_wrong)<=least(cw,min_wrong)*1.8
  and cw<=max_wrong*1.25;
 if count_good<>(select count(*) from public.pedagogy_rewrite_proposals)
 or count_good<>30 then
   raise exception 'TASK202 draft distractor word-length QA failed: %',count_good;
 end if;
 if has_table_privilege('authenticated','public.pedagogy_rewrite_proposals','SELECT')
 then raise exception 'TASK202 editorial drafts accessible by learner';end if;
end $qa$;
rollback;
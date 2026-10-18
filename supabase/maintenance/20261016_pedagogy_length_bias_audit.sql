-- TASK-200 editorial audit (service-role/admin-only): never expose correct_answer or options to learner API.
-- Source of truth is server-side question_keys. No production data mutation.
with opt as (
  select q.id as question_id,q.status,q.group_code,q.source_reference,
         o.id as option_id,
         array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1) as word_count,
         (o.id::text=k.payload->>'correct_option_id') as is_correct
  from public.questions q
  join public.question_keys k on k.question_id=q.id
  join public.question_options o on o.question_id=q.id
  where q.format='Y1' and q.group_code in ('KS','PM.GEN','PM.MET')
), by_question as (
  select question_id, status,group_code,source_reference,
    count(*) as option_count,
    count(*) filter(where is_correct) as correct_count,
    min(word_count) as min_words,
    max(word_count) as max_words,
    max(word_count) filter(where is_correct) as correct_words,
    max(word_count) filter(where not is_correct) as longest_distractor_words
  from opt group by question_id,status,group_code,source_reference
)
select status,group_code,count(*) as total_y1,
  count(*) filter(where option_count<>4 or correct_count<>1) as broken_shape,
  count(*) filter(where correct_words>longest_distractor_words*1.3) as correct_distinctly_longest,
  count(*) filter(where max_words>min_words*1.8) as unbalanced_lengths,
  count(*) filter(where source_reference like 'authored:pedagogy-pdf-corpus:v3:%') as task200_items
from by_question group by status,group_code
order by group_code,status;

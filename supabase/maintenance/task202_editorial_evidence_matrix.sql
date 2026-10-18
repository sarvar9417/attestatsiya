-- TASK-202: read-only evidence matrix for editorial content QA.
-- Execute as a privileged reviewer only: this may reveal metadata about answer keys.
-- Never expose to learner clients; no marks or approvals are written by this audit.
with option_audit as (
 select q.id, q.status, q.group_code, q.source_reference, q.format,
        count(o.id) option_count,
        count(o.id) filter(where o.id::text=k.payload->>'correct_option_id') valid_answer_count,
        min(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'))) min_words,
        max(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'))) max_words,
        max(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+')))
          filter(where o.id::text=k.payload->>'correct_option_id') correct_words,
        max(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+')))
          filter(where o.id::text<>k.payload->>'correct_option_id') longest_wrong_words
 from public.questions q
 join public.question_keys k on k.question_id=q.id
 join public.question_options o on o.question_id=q.id
 where q.group_code in ('KS','PM.GEN','PM.MET') and q.format='Y1'
 group by q.id,q.status,q.group_code,q.source_reference,q.format
)
select status, group_code, count(*) total_y1,
 count(*) filter(where option_count<>4 or valid_answer_count<>1) broken_option_keys,
 count(*) filter(where correct_words>longest_wrong_words*1.3) right_answer_longer_by_30pct,
 count(*) filter(where max_words>min_words*1.8) over_1_8_length_ratio,
 count(*) filter(where source_reference like 'authored:pedagogy-pdf-corpus:%') pdf_originals
from option_audit group by status,group_code order by status,group_code;

-- A second query lets editorial reviewers plan source classification without
-- assuming "accepted_general" or third-party reported answer = official key.
select source_year,source_sitting,editorial_status,answer_key_status,
 count(*) candidate_count,
 count(*) filter(where linked_question_id is not null) linked
from public.pedagogy_pdf_source_candidates
group by 1,2,3,4 order by source_year,source_sitting,editorial_status,answer_key_status;

-- Known provenance contradictions should never be re-enabled simply because
-- a historical PDF asserts a key. Two independently checked examples:
select source_year,source_sitting,page_no,source_question_no,
 editorial_status,answer_key_status,linked_question_id
from public.pedagogy_pdf_source_candidates
where source_year=2026 and source_sitting='spring' and source_question_no in (14,144)
order by source_question_no;

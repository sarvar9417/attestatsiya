-- TASK-322 completed 2026-10-20: READ ONLY audit; safe to rerun.
-- Source PDF exam-style examples are historical, not certified official answer keys.
WITH rev AS (
 SELECT r.source_question_id source_id,r.revision_question_id rev_id,
        oldq.status old_status,newq.status new_status,
        oldq.source_lesson_id old_lesson,newq.source_lesson_id new_lesson,
        ok.explanation_md old_exp,nk.explanation_md new_exp,
        old_correct.content_md old_key,new_correct.content_md new_key,
        (SELECT count(*) FROM public.question_options o WHERE o.question_id=newq.id AND o.side='a') nopts,
        (SELECT count(distinct lower(trim(o.content_md))) FROM public.question_options o WHERE o.question_id=newq.id AND o.side='a') distinctopts
 FROM public.pedagogy_revision_queue r
 JOIN public.questions oldq ON oldq.id=r.source_question_id
 JOIN public.questions newq ON newq.id=r.revision_question_id
 JOIN public.question_keys ok ON ok.question_id=oldq.id
 JOIN public.question_keys nk ON nk.question_id=newq.id
 JOIN public.question_options old_correct ON old_correct.id::text=ok.payload->>'correct_option_id'
 JOIN public.question_options new_correct ON new_correct.id::text=nk.payload->>'correct_option_id'
 WHERE r.reason LIKE '2026-10-20%'
)
SELECT count(*) revision_count,
 count(*) FILTER (WHERE old_status='archived' AND new_status='published') safely_swapped,
 count(*) FILTER (WHERE old_key<>new_key) changed_correct_answers,
 count(*) FILTER (WHERE old_exp<>new_exp) changed_explanations,
 count(*) FILTER (WHERE old_lesson<>new_lesson) changed_source_lessons,
 count(*) FILTER (WHERE nopts<>4 OR distinctopts<>4) bad_four_option_count
FROM rev;

WITH y1 AS (
 SELECT q.id,q.group_code,length(q.stem_md) stem_length,
 max(array_length(regexp_split_to_array(trim(o.content_md),'[[:space:]]+'),1))
   FILTER(WHERE o.id::text=k.payload->>'correct_option_id') correct_words,
 max(array_length(regexp_split_to_array(trim(o.content_md),'[[:space:]]+'),1))
   FILTER(WHERE o.id::text<>k.payload->>'correct_option_id') wrong_max_words,
 min(array_length(regexp_split_to_array(trim(o.content_md),'[[:space:]]+'),1)) min_words,
 max(array_length(regexp_split_to_array(trim(o.content_md),'[[:space:]]+'),1)) max_words,
 count(o.id) nopts,count(distinct lower(trim(o.content_md))) different_options
 FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 JOIN public.question_options o ON o.question_id=q.id AND o.side='a'
 WHERE q.group_code IN ('KS','PM.GEN','PM.MET')
 AND q.status='published' AND q.format='Y1'
 GROUP BY q.id,q.group_code,k.payload
)
SELECT group_code,count(*) published_y1,
 count(*) FILTER(WHERE stem_length<70) short_stems,
 count(*) FILTER(WHERE stem_length<45) ultra_short_stems,
 count(*) FILTER(WHERE stem_length>=180) contextual_stems,
 count(*) FILTER(WHERE correct_words>wrong_max_words) uniquely_longest_correct,
 count(*) FILTER(WHERE max_words>1.8*min_words) length_outliers,
 count(*) FILTER(WHERE nopts<>4 OR different_options<>4) invalid_option_set
FROM y1 GROUP BY group_code ORDER BY group_code;

SELECT group_code,format,status,count(*) item_count
FROM public.questions
WHERE group_code IN('KS','PM.GEN','PM.MET') AND status IN ('published','review')
GROUP BY 1,2,3 ORDER BY 1,2,3;

SELECT count(*) historic_exam_items_still_linked_to_archived_sources
FROM public.exam_items ei JOIN public.pedagogy_revision_queue r
 ON r.source_question_id=ei.question_id WHERE r.reason LIKE '2026-10-20%';

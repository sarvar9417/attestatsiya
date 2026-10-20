-- 2026-10-20: read-only pedagogika exam-format quality dashboard.
-- Mechanical heuristics are review priorities, not proof of semantic invalidity.
WITH y1 AS (
 SELECT q.id,q.group_code,length(q.stem_md) stem_chars,
 count(o.id) n_opts,count(DISTINCT lower(trim(o.content_md))) n_distinct,
 count(*) FILTER (WHERE o.id::text=(k.payload->>'correct_option_id')) valid_key_count,
 max(array_length(regexp_split_to_array(trim(o.content_md),'\\s+'),1))
    FILTER (WHERE o.id::text=(k.payload->>'correct_option_id')) correct_words,
 max(array_length(regexp_split_to_array(trim(o.content_md),'\\s+'),1))
    FILTER (WHERE o.id::text<>(k.payload->>'correct_option_id')) max_wrong_words
 FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 JOIN public.question_options o ON o.question_id=q.id AND o.side='a'
 WHERE q.status='published' AND q.group_code IN ('KS','PM.GEN','PM.MET') AND q.format='Y1'
 GROUP BY q.id,q.group_code,k.payload
)
SELECT group_code,count(*) published_y1,
 count(*) FILTER (WHERE stem_chars<70) short_stem_review_candidates,
 count(*) FILTER (WHERE stem_chars>=180) longer_context_stems,
 count(*) FILTER (WHERE n_opts<>4 OR n_distinct<>4 OR valid_key_count<>1) mechanical_structure_fails,
 count(*) FILTER (WHERE correct_words>max_wrong_words) uniquely_longest_correct
FROM y1 GROUP BY group_code ORDER BY group_code;
SELECT group_code,format,status,count(*) n FROM public.questions
 WHERE group_code IN('KS','PM.GEN','PM.MET')
 GROUP BY group_code,format,status ORDER BY 1,2,3;

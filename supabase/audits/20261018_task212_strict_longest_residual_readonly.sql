-- TASK-212: strict "correct answer is longest" audit, 2026-10-18.
-- READ ONLY: 30% imbalance criterion is not sufficient for user acceptance.
-- Never extract correct option text or answer keys into public issue/PR output.
BEGIN TRANSACTION READ ONLY;
WITH words AS (
 SELECT q.id,q.group_code,q.status,q.format,
 max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
 FILTER (WHERE o.id::text=k.payload->>'correct_option_id') AS correct_words,
 max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
 FILTER (WHERE o.id::text<>k.payload->>'correct_option_id') AS max_wrong_words,
 min(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
 AS min_option_words
 FROM public.questions q
 JOIN public.question_keys k ON k.question_id=q.id
 JOIN public.question_options o ON o.question_id=q.id AND btrim(o.side)='a'
 WHERE q.status='published'
   AND q.group_code IN ('KS','PM.GEN','PM.MET')
   AND q.format='Y1'
 GROUP BY q.id,q.group_code,q.status,q.format
)
SELECT group_code,count(*) AS published_y1,
 count(*) FILTER(WHERE correct_words>max_wrong_words) AS strictly_longest_correct,
 count(*) FILTER(WHERE correct_words>max_wrong_words*1.3) AS over_30_percent,
 count(*) FILTER(WHERE correct_words=max_wrong_words) AS equal_longest,
 count(*) FILTER(WHERE correct_words<max_wrong_words) AS wrong_longest,
 count(*) FILTER(WHERE max_wrong_words>min_option_words*1.8) AS extreme_option_spread
FROM words GROUP BY group_code ORDER BY group_code;
COMMIT;
-- Release acceptance is STRICTLY_LONGEST=0, not just OVER_30_PERCENT=0.
-- Semantic plausibility, balanced difficulty and original keys remain required.
-- Published items must be replaced by immutable revision+archive, never
-- modified in place. Human-independent AI review must not be mislabeled.

-- TASK-212: AFTER RELEASE, read-only immutable revision + quota verification.
-- Never dump answer texts/keys or PII. It assumes the two manual scripts were
-- run atomically (8 option repairs, then owner-waived publication).
BEGIN TRANSACTION READ ONLY;
SELECT
  (SELECT count(*) FROM public.pedagogy_owner_release_waivers WHERE authority='owner_explicit_no_external_expert_20261018') AS owner_authorized_total,
  (SELECT count(*) FROM public.pedagogy_owner_release_waivers w JOIN public.questions q ON q.id=w.question_id WHERE q.status='published') AS new_published,
  (SELECT count(*) FROM public.pedagogy_owner_release_waivers w JOIN public.questions q ON q.id=w.source_question_id WHERE w.source_question_id IS NOT NULL AND q.status='archived') AS archived_original,
  (SELECT count(*) FROM public.pedagogy_owner_release_waivers w
   JOIN public.pedagogy_published_revisions r ON r.question_id=w.question_id
   WHERE r.content_fingerprint=public.professional_question_fingerprint(w.question_id)) AS immutable_new_fingerprints,
  (SELECT count(*) FROM public.questions WHERE group_code IN('KS','PM.GEN','PM.MET') AND status='published') AS published_pedagogy_total,
  (SELECT count(*) FROM public.questions WHERE group_code='KS' AND status='review' AND source_reference LIKE 'authored:ai-assisted:m14-closed-20261018:kasb-standarti:%') AS pending_m14_owner_batch;

WITH words AS (
 SELECT q.id,q.group_code,
  max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
    FILTER (WHERE o.id::text=k.payload->>'correct_option_id') AS correct_words,
  max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
    FILTER (WHERE o.id::text<>k.payload->>'correct_option_id') AS wrong_max_words
 FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 JOIN public.question_options o ON o.question_id=q.id AND trim(o.side)='a'
 WHERE q.status='published' AND q.group_code IN('KS','PM.GEN','PM.MET') AND q.format='Y1'
 GROUP BY q.id,q.group_code
)
SELECT group_code,count(*) published_y1,
count(*) FILTER(WHERE correct_words>wrong_max_words*1.3) AS remaining_longest_correct_cues
FROM words GROUP BY group_code ORDER BY group_code;

SELECT m.code AS module,l.order_idx AS topic,l.topic_test_question_count AS required,
 count(DISTINCT q.id) FILTER(WHERE q.status='published' AND k.question_id IS NOT NULL) AS published_keyed
FROM public.modules m JOIN public.lessons l ON l.module_id=m.id
LEFT JOIN public.questions q ON q.source_lesson_id=l.id
LEFT JOIN public.question_keys k ON k.question_id=q.id
WHERE m.code='M14' AND l.status='published' AND l.order_idx BETWEEN 1 AND 7
GROUP BY m.code,l.id,l.order_idx,l.topic_test_question_count
ORDER BY l.order_idx;
COMMIT;

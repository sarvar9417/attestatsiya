-- KTD-540 bank: read-only post-import verification.
-- Never inserts, updates, publishes, or deletes any question.
-- Run manually on the target database after review import, NEVER as a migration.
-- All 540 source IDs must be either present or among the 12 explicitly excluded semantic duplicates.
DO $verify$
DECLARE
  questions_total integer;
  review_total integer;
  published_total integer;
  options_total integer;
  valid_options_total integer;
  keys_total integer;
  valid_keys_total integer;
  duplicate_source_total integer;
  previous_held_total integer;
  excluded_present_total integer;
  missing_unexpected_total integer;
BEGIN
  SELECT
    count(*),
    count(*) FILTER (WHERE status='review'),
    count(*) FILTER (WHERE status='published'),
    count(*) - count(DISTINCT source_reference)
  INTO questions_total, review_total, published_total, duplicate_source_total
  FROM public.questions
  WHERE source_reference LIKE 'ktd-540-2026:%';

  WITH imported AS (
    SELECT id FROM public.questions WHERE source_reference LIKE 'ktd-540-2026:%'
  ), option_counts AS (
    SELECT o.question_id,count(*) AS cnt,count(DISTINCT o.content_md) AS distinct_cnt
    FROM public.question_options o JOIN imported i ON i.id=o.question_id
    GROUP BY o.question_id
  )
  SELECT COALESCE(sum(cnt),0),
         count(*) FILTER (WHERE cnt=4 AND distinct_cnt=4)
  INTO options_total, valid_options_total
  FROM option_counts;

  WITH imported AS (
    SELECT id FROM public.questions WHERE source_reference LIKE 'ktd-540-2026:%'
  ), keyed AS (
    SELECT i.id,k.payload->>'correct_option_id' AS option_id
    FROM imported i LEFT JOIN public.question_keys k ON k.question_id=i.id
  )
  SELECT count(*) FILTER (WHERE option_id IS NOT NULL),
         count(*) FILTER (WHERE EXISTS (
           SELECT 1 FROM public.question_options o
           WHERE o.question_id=k.id AND o.id::text=k.option_id
         ))
  INTO keys_total,valid_keys_total
  FROM keyed k;

  SELECT count(*) INTO previous_held_total
  FROM kt_bank_review.candidates
  WHERE bank_code='KT-HW-2026' AND review_state='held';

  WITH excluded(id) AS (VALUES
    ('KTD-01-007'),('KTD-03-007'),('KTD-03-012'),('KTD-04-007'),
    ('KTD-05-002'),('KTD-05-007'),('KTD-06-002'),('KTD-06-012'),
    ('KTD-06-017'),('KTD-06-029'),('KTD-12-002'),('KTD-12-007')
  ), expected AS (
    SELECT 'KTD-'||lpad(ch::text,2,'0')||'-'||lpad(n::text,3,'0') AS id
    FROM generate_series(1,18) ch CROSS JOIN generate_series(1,30) n
  )
  SELECT
    count(*) FILTER (WHERE x.id IS NOT NULL AND q.id IS NOT NULL),
    count(*) FILTER (WHERE x.id IS NULL AND q.id IS NULL)
  INTO excluded_present_total,missing_unexpected_total
  FROM expected e
  LEFT JOIN excluded x ON e.id=x.id
  LEFT JOIN public.questions q ON q.source_reference='ktd-540-2026:'||e.id;

  IF questions_total <> 528 OR review_total <> 528 OR published_total <> 0
     OR options_total <> 2112 OR valid_options_total <> 528
     OR keys_total <> 528 OR valid_keys_total <> 528
     OR duplicate_source_total <> 0
     OR previous_held_total <> 387
     OR excluded_present_total <> 0
     OR missing_unexpected_total <> 0
  THEN
    RAISE EXCEPTION
      'KTD import verification failed: questions %, review %, published %, options %, unique option sets %, keys %, linked keys %, source duplicates %, prior held %, excluded present %, unexpected missing %',
      questions_total,review_total,published_total,options_total,valid_options_total,
      keys_total,valid_keys_total,duplicate_source_total,previous_held_total,
      excluded_present_total,missing_unexpected_total;
  END IF;
  RAISE NOTICE 'KTD import review gate verified: 528/528 review, 2112 options, 528 matching answer keys; 12 excluded semantic duplicates; 387 old candidates held; 0 published';
END
$verify$;

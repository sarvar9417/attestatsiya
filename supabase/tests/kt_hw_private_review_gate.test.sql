-- Review gate must not expose unpublished bank content to learners.
BEGIN;
DO $qa$
BEGIN
 IF has_schema_privilege('anon','kt_bank_review','USAGE') OR
    has_schema_privilege('authenticated','kt_bank_review','USAGE') THEN
   RAISE EXCEPTION 'private review schema is publicly accessible';
 END IF;
 IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid='kt_bank_review.candidates'::regclass) THEN
   RAISE EXCEPTION 'private review RLS absent';
 END IF;
 BEGIN
   INSERT INTO kt_bank_review.candidates
    (external_id,chapter_no,difficulty,construct_codes,stem_md,
     options_json,correct_letter,explanation_md,source_locator,review_state)
   VALUES ('KT-01-001',1,'A','S2.HW.01',
           'Synthetic non-real validation fixture?',
           '["A","B","C","D"]','A','Synthetic answer notes','fixture',
           'approved_for_import');
   RAISE EXCEPTION 'unverified item was approved';
 EXCEPTION WHEN check_violation THEN NULL;
 END;
 INSERT INTO kt_bank_review.candidates
  (external_id,chapter_no,difficulty,construct_codes,stem_md,
   options_json,correct_letter,explanation_md,source_locator)
 VALUES ('KT-01-001',1,'A','S2.HW.01',
         'Synthetic non-real validation fixture?',
         '["A","B","C","D"]','A','Synthetic answer notes','fixture');
 IF (SELECT review_state FROM kt_bank_review.candidates WHERE external_id='KT-01-001') <> 'held' THEN
   RAISE EXCEPTION 'candidate was not held by default';
 END IF;
 -- Even three booleans are not enough without exact source evidence.
 BEGIN
   UPDATE kt_bank_review.candidates
   SET source_verified=true,expert_verified=true,editor_approved=true,
       approved_at=now(),review_state='approved_for_import'
   WHERE external_id='KT-01-001';
   RAISE EXCEPTION 'citation-free item passed the triple approval gate';
 EXCEPTION WHEN check_violation THEN NULL;
 END;
 IF (SELECT review_state FROM kt_bank_review.candidates WHERE external_id='KT-01-001') <> 'held' THEN
   RAISE EXCEPTION 'failed approval must remain HOLD';
 END IF;
END $qa$;
ROLLBACK;

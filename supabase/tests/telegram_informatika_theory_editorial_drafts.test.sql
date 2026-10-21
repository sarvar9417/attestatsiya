-- TASK-346: private selected theory cases and original M03/M08/M11 drafts.
BEGIN;
DO $$
BEGIN
 IF EXISTS (
   SELECT 1 FROM attest_ingest.telegram_informatika_theory_editorial_cases
   WHERE human_approved OR publish_ready OR length(reason_uz)<30
 ) THEN RAISE EXCEPTION 'Unapproved theory became releasable'; END IF;
 IF EXISTS (
   SELECT 1 FROM attest_ingest.telegram_informatika_theory_lesson_drafts d
   JOIN attest_ingest.telegram_informatika_theory_editorial_cases c USING(source_message_id)
   WHERE d.human_approved OR d.published OR d.editorial_state<>'draft_private_review'
   OR c.review_disposition<>'possible_lesson_example'
   OR length(d.original_explanation_uz)<200
 ) THEN RAISE EXCEPTION 'Theory draft bypassed editorial gate'; END IF;

 IF EXISTS (
   SELECT 1 FROM attest_ingest.telegram_informatika_theory_lesson_drafts
   WHERE source_message_id IN(43909,43985,50413) AND module_hint NOT IN('M03','M08','M11')
 ) THEN RAISE EXCEPTION 'Source lesson linked to unsupported module'; END IF;
 IF has_table_privilege('anon','attest_ingest.telegram_informatika_theory_editorial_cases','SELECT')
 OR has_table_privilege('authenticated','attest_ingest.telegram_informatika_theory_editorial_cases','SELECT')
 OR has_table_privilege('anon','attest_ingest.telegram_informatika_theory_lesson_drafts','SELECT')
 OR has_table_privilege('authenticated','attest_ingest.telegram_informatika_theory_lesson_drafts','SELECT')
 THEN RAISE EXCEPTION 'Unapproved lesson source exposed'; END IF;
END $$;
ROLLBACK;
-- TASK-346 QA6: conflicting annotated solutions do not become answer keys.
CREATE TABLE IF NOT EXISTS attest_ingest.telegram_informatika_source_answer_conflicts (
 source_file_id text NOT NULL,
 source_question_no integer NOT NULL CHECK(source_question_no>0),
 annotated_file_id text NOT NULL REFERENCES attest_ingest.telegram_informatika_drive_pdf_inventory(source_file_id),
 annotated_pdf_page integer NOT NULL CHECK(annotated_pdf_page>0),
 annotated_option_index integer NOT NULL CHECK(annotated_option_index BETWEEN 0 AND 3),
 discrepancy_code text NOT NULL CHECK(discrepancy_code IN ('incorrect_annotation','unverifiable_annotation')),
 independent_derivation_uz text NOT NULL CHECK(length(independent_derivation_uz)>100),
 resolution_state text NOT NULL DEFAULT 'blocked_source_reconciliation'
 CHECK(resolution_state='blocked_source_reconciliation'),
 human_approved boolean NOT NULL DEFAULT false CHECK(human_approved=false),
 learner_publish_ready boolean NOT NULL DEFAULT false CHECK(learner_publish_ready=false),
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(source_file_id,source_question_no,annotated_file_id),
 FOREIGN KEY(source_file_id,source_question_no)
 REFERENCES attest_ingest.telegram_informatika_pdf_question_candidates(source_file_id,source_question_no)
);
ALTER TABLE attest_ingest.telegram_informatika_source_answer_conflicts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON attest_ingest.telegram_informatika_source_answer_conflicts FROM PUBLIC,anon,authenticated;

WITH r AS (
 SELECT '1TfX6fDckcXuaqvwuvonzm44elwUgmk8A'::text source_file_id,
 4::integer source_question_no,
 '158cWGiTBv6_dvSjeuiGDY4zs4VD7y3AN'::text annotated_file_id,
 4::integer annotated_pdf_page,1::integer annotated_option_index,
 'incorrect_annotation'::text discrepancy_code,
 'Tahlil PDF 4-betida B (29) qo‘lda aylana bilan belgilangan. Ammo A∧(A∨B∨C) ≡ A (absorbsiya qonuni). A,B,C 000 dan 111 gacha rostlik jadvalida F = 00001111, ya’ni rost holatlari 4 ta; ikkilik ketma-ketlik qiymati 15, rost satr indekslari yig‘indisi 4+5+6+7=22. 29 ushbu talqinlardan kelib chiqmaydi. Manbada so‘ralgan agregatsiya aniqlashtirilmaguncha savol nashrga yaroqsiz.'::text independent_derivation_uz
)
INSERT INTO attest_ingest.telegram_informatika_source_answer_conflicts
(source_file_id,source_question_no,annotated_file_id,annotated_pdf_page,annotated_option_index,discrepancy_code,independent_derivation_uz)
SELECT r.* FROM r JOIN attest_ingest.telegram_informatika_pdf_question_candidates q
 ON q.source_file_id=r.source_file_id AND q.source_question_no=r.source_question_no
 JOIN attest_ingest.telegram_informatika_drive_pdf_inventory inv
 ON inv.source_file_id=r.annotated_file_id
ON CONFLICT(source_file_id,source_question_no,annotated_file_id) DO NOTHING;
COMMENT ON TABLE attest_ingest.telegram_informatika_source_answer_conflicts IS
'Original PDF tahlil handwritten answer conflicts with independent derivation. Student release blocked until corrected question plus human editorial approval.';
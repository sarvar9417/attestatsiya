-- TASK-346: source-defect flags from the original nine-page MS Access PDF.
-- Never edits the learner question bank or supplies a guessed answer.
CREATE TABLE IF NOT EXISTS attest_ingest.telegram_informatika_pdf_source_issues (
 source_file_id text NOT NULL,
 source_question_no integer NOT NULL,
 issue_code text NOT NULL CHECK(issue_code IN (
   'access_limit_not_supported',
   'field_missing_from_supplied_table',
   'missing_sql_comparison_operator',
   'access_field_name_requires_brackets'
 )),
 observed_issue_uz text NOT NULL CHECK (length(btrim(observed_issue_uz))>=20),
 original_pdf_page integer NOT NULL CHECK (original_pdf_page>=1),
 source_review_state text NOT NULL DEFAULT 'expert_editorial_review_required'
 CHECK (source_review_state='expert_editorial_review_required'),
 learner_publish_blocked boolean NOT NULL DEFAULT true CHECK(learner_publish_blocked),
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(source_file_id,source_question_no,issue_code),
 FOREIGN KEY(source_file_id,source_question_no)
   REFERENCES attest_ingest.telegram_informatika_pdf_question_candidates(source_file_id,source_question_no)
);
ALTER TABLE attest_ingest.telegram_informatika_pdf_source_issues ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON attest_ingest.telegram_informatika_pdf_source_issues FROM PUBLIC,anon,authenticated;

-- Only source rows present in the current database may be linked. A fresh CI
-- database has the schema but deliberately contains no private Google Drive import.
WITH reported(source_file_id,source_question_no,issue_code,observed_issue_uz,original_pdf_page) AS (
 VALUES
('130SJl3LEn14uvVajDGbhCody_cOuwwbN',1,'field_missing_from_supplied_table','SQLdagi toliq_ism maydoni rasmning ustozlar jadvalida yo‘q, ustunda FISH yozilgan.',1),
('130SJl3LEn14uvVajDGbhCody_cOuwwbN',1,'access_limit_not_supported','PDF MS Access deb nomlangan, lekin LIMIT 2 Access SELECT sintaksisida emas, TOP 2 ishlatiladi.',1),
('130SJl3LEn14uvVajDGbhCody_cOuwwbN',3,'missing_sql_comparison_operator','WHERE ichida OR toifasi “ikkinchi” qismida taqqoslash operatori berilmagan.',1),
('130SJl3LEn14uvVajDGbhCody_cOuwwbN',4,'access_limit_not_supported','PDFdagi LIMIT 3 MS Access sintaksisiga mos emas; SELECT TOP 3 kerak bo‘ladi.',2),
('130SJl3LEn14uvVajDGbhCody_cOuwwbN',5,'access_limit_not_supported','PDFdagi LIMIT 3 MS Access sintaksisiga mos emas; SELECT TOP 3 kerak bo‘ladi.',2),
('130SJl3LEn14uvVajDGbhCody_cOuwwbN',7,'field_missing_from_supplied_table','SQL category deb murojaat qiladi, rasmda esa ustozlar jadvalining tegishli ustuni toifasi deb nomlangan.',3),
('130SJl3LEn14uvVajDGbhCody_cOuwwbN',13,'access_field_name_requires_brackets','1 kg narxi kabi bo‘shliq saqlagan Access maydon nomini SQLda [1 kg narxi] tarzida qavsga olish kerak.',5)
)
INSERT INTO attest_ingest.telegram_informatika_pdf_source_issues
(source_file_id,source_question_no,issue_code,observed_issue_uz,original_pdf_page)
SELECT r.source_file_id,r.source_question_no,r.issue_code,r.observed_issue_uz,r.original_pdf_page
FROM reported r
JOIN attest_ingest.telegram_informatika_pdf_question_candidates candidate
 ON candidate.source_file_id=r.source_file_id
AND candidate.source_question_no=r.source_question_no
ON CONFLICT(source_file_id,source_question_no,issue_code) DO NOTHING;
COMMENT ON TABLE attest_ingest.telegram_informatika_pdf_source_issues IS
 'Private AI source QA findings, grounded in original visual PDF and Access SQL syntax. No source corrections silently applied, no answer keys published.';
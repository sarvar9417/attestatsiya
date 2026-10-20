-- TASK-346 follow-up: source-format/logic defects that block learner publication.
-- CI fresh databases have no private Google Drive source rows: seed via guarded parent JOIN.
CREATE TABLE IF NOT EXISTS attest_ingest.telegram_informatika_pdf_release_blockers (
 source_file_id text NOT NULL,
 source_question_no integer NOT NULL CHECK(source_question_no>0),
 issue_code text NOT NULL CHECK(issue_code IN
 ('insufficient_problem_data','ambiguous_or_nonunique_answer',
  'unspecified_unit_or_encoding','no_correct_choice')),
 evidence_uz text NOT NULL CHECK(length(btrim(evidence_uz))>=40),
 review_state text NOT NULL DEFAULT 'requires_editorial_source_fix'
 CHECK(review_state='requires_editorial_source_fix'),
 learner_publish_blocked boolean NOT NULL DEFAULT true CHECK(learner_publish_blocked=true),
 human_approved boolean NOT NULL DEFAULT false CHECK(human_approved=false),
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(source_file_id,source_question_no,issue_code),
 FOREIGN KEY(source_file_id,source_question_no)
 REFERENCES attest_ingest.telegram_informatika_pdf_question_candidates(source_file_id,source_question_no)
 ON DELETE RESTRICT
);
ALTER TABLE attest_ingest.telegram_informatika_pdf_release_blockers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON attest_ingest.telegram_informatika_pdf_release_blockers FROM PUBLIC,anon,authenticated;
COMMENT ON TABLE attest_ingest.telegram_informatika_pdf_release_blockers IS
'Private editorial source errors. Non-destructive and mandatory release blockers; no automatic answer key or learner publication.';

WITH identified(source_file_id,source_question_no,issue_code,evidence_uz) AS (
 VALUES
 ('1BSYuhT9RRFpgHpDas-OjLmztqrYjuerB',10,'insufficient_problem_data',
 'Otasi va bolasi yoshi yig‘indisi 31, bobosi va bolasi yoshi yig‘indisi 88. Bolaning ayni yoshi berilmaganligi sabab bobosining bola 10 ga yetgandagi yoshi yagona aniqlanmaydi.'),
 ('1BSYuhT9RRFpgHpDas-OjLmztqrYjuerB',14,'ambiguous_or_nonunique_answer',
 'Faqat bittasi rost shartida bajarish davomiyligi 9 minutdan katta va 10 minutdan oshmagan istalgan qiymat bo‘lishi mumkin; aniqlik yoki butun minut sharti yo‘q.'),
 ('1BSYuhT9RRFpgHpDas-OjLmztqrYjuerB',20,'unspecified_unit_or_encoding',
 '160 so‘z/minut va 6 belgi/so‘z ma’lum, lekin belgi nechta baytda saqlanishi aniqlanmagan; 225 KiB faqat 1 belgi=1 bayt va 1 KiB=1024 bayt farazida chiqadi.'),
 ('1TfX6fDckcXuaqvwuvonzm44elwUgmk8A',4,'ambiguous_or_nonunique_answer',
 'A&(A∨B∨C) mantiqiy ifodasi A ga teng; savolda rost qiymatlar yig‘indisi nimani anglatishi belgilab berilmagan va 31/29/41/33 variantlarini dalillash uchun hisoblash qoidasini aniqlashtirish zarur.'),
 ('1KtjkObI0SzqThC0Rqf3U0FbDAY9p40au',4,'no_correct_choice',
 'Asl PDFdagi 4×625³ − 25⁵ + 2×5¹¹ − 7 sonini beshlikda yozganda 9 ta 4 raqami bor; taklif qilingan 8/20/10/15 variantlarining hech biri mos emas.'),
 ('1KtjkObI0SzqThC0Rqf3U0FbDAY9p40au',10,'unspecified_unit_or_encoding',
 'Telefon 400 KB ni 20 minutda qabul qilganda 2731 atrofidagi natija bit/s birligida chiqadi; masala tezlik birligini ko‘rsatmaydi, KB va kibibayt talqini ham ajratilmagan.')
)
INSERT INTO attest_ingest.telegram_informatika_pdf_release_blockers
 (source_file_id,source_question_no,issue_code,evidence_uz)
SELECT i.source_file_id,i.source_question_no,i.issue_code,i.evidence_uz
FROM identified i
JOIN attest_ingest.telegram_informatika_pdf_question_candidates c
 USING(source_file_id,source_question_no)
ON CONFLICT(source_file_id,source_question_no,issue_code) DO NOTHING;

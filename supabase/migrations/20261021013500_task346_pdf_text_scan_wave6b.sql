-- TASK-346 QA6b: metadata-only source text presence detection; does not imply review, source key or approval.
WITH inspected(source_file_id,extracted_chars,numbered_line_count,mc_option_marker_count,scan_state) AS (
VALUES ('1eAUFOiTsLJPc-c81ogastkJQvGqNn8rJ',3399,13,43,'text_available'),
('1dNcrK2WXRSpe79V3v67zsq_iy7vj7tFA',2669,8,41,'text_available'),
('1-8uUjjsjDmRq8phUzPNgacol_5aPq-hy',16866,33,11,'text_available'),
('1ENseanhvZY4JrPIDTrPxoSyeo3Oqf0t1',4334,11,0,'text_available'),
('1GYcLyonZqs7aCGkZZKvn0oNZqAKriWeJ',4751,22,0,'text_available'),
('14EOOY6_P5WPYqlIySLBZbDBqNCPI6wDZ',5266,10,12,'text_available'),
('1ML08CRh4nm0rCWHM7qUEQwx_omYqwGOq',4405,27,0,'text_available'),
('17cv5u2dqDNCkAKnkaGeK6g83IGgnASrH',7950,24,8,'text_available'),
('1saMuxQznIvcRdaODpz0c8ZnmrK97oHhA',9493,29,8,'text_available'),
('1WftiVZwI8bfTWCP99isLeKb00aJ81atW',8271,8,8,'text_available'),
('1882t8CKv9J7-RotlqOE_XYODu7MYO7Bc',4368,2,12,'text_available'),
('1ylfut09QOTs2mFOx4zow2u2rdKs-Pr_Q',5032,12,0,'text_available')
)
INSERT INTO attest_ingest.telegram_informatika_pdf_scan_audit
(source_file_id,extracted_chars,numbered_line_count,mc_option_marker_count,scan_state,source_contents_reviewed,answer_keys_verified)
SELECT i.source_file_id,s.extracted_chars,s.numbered_line_count,s.mc_option_marker_count,s.scan_state,false,false
FROM inspected s JOIN attest_ingest.telegram_informatika_drive_pdf_inventory i USING(source_file_id)
ON CONFLICT(source_file_id) DO NOTHING;
-- TASK-346 QA6c: metadata-only, not PDF page review.
WITH inspected(source_file_id,extracted_chars,numbered_line_count,mc_option_marker_count,scan_state) AS (
VALUES ('1QiqRt1THGPr86C4MraFDpJrSLbjF0K-s',992,52,0,'text_available'),
('1PEx1IJ4cpMyfhBcUiwP5D_iVadACjUYU',1249,40,0,'text_available'),
('1KtjkObI0SzqThC0Rqf3U0FbDAY9p40au',1943,10,40,'text_available'),
('1jZSoxWUnVp5j9bEoa8-O-QXVJlznnTjm',3286,15,0,'text_available'),
('1ERGugYRo0zZIiZkwIDOdwq4IFTXdgL6f',3286,15,0,'text_available'),
('1EDScDu_s61Hxgt0Y1XpA6AnUTbAkFV_S',6059,20,1,'text_available'),
('1DOj-Rp9mSy-ZuYG00zepIG62mnJbHeN9',4289,19,0,'text_available'),
('1yysj1sxMKcec6QsHr9HS5zVvdmHT5sT3',4289,19,0,'text_available'),
('1fJ1jP1AT3vTrItYhi_tKtGBIkvwq6zGW',3368,13,60,'text_available'),
('1BSYuhT9RRFpgHpDas-OjLmztqrYjuerB',3616,19,2,'text_available'),
('1OFhG3DA2OsQbcq3RDaclFg8t-HIOkwMh',9493,29,8,'text_available'),
('1oRf92XSVz0NxOz5yXbLKdyUIfDgStLEB',3406,0,0,'text_available')
)
INSERT INTO attest_ingest.telegram_informatika_pdf_scan_audit
(source_file_id,extracted_chars,numbered_line_count,mc_option_marker_count,scan_state,source_contents_reviewed,answer_keys_verified)
SELECT i.source_file_id,s.extracted_chars,s.numbered_line_count,s.mc_option_marker_count,s.scan_state,false,false
FROM inspected s JOIN attest_ingest.telegram_informatika_drive_pdf_inventory i USING(source_file_id)
ON CONFLICT(source_file_id) DO NOTHING;
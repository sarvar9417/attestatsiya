-- TASK-346 QA6a: metadata-only PDF text scan; never claims content or answer-key verification.
WITH observed(source_file_id,extracted_chars,numbered_line_count,mc_option_marker_count,scan_state) AS (
VALUES ('1qquiQBLYeO1yp96f8R62N9fQszKGFybA',3275,9,0,'text_available'),
('1V4CJwfBGtwjtLzDaZj5ZPCZyeR44I6vn',4282,15,0,'text_available'),
('1mxyzeO2SWNTvX7E1lyMVODk6cuGNP5KU',2918,5,38,'text_available'),
('158cWGiTBv6_dvSjeuiGDY4zs4VD7y3AN',2210,1,40,'text_available'),
('1RlVa1yBjSx0NzMx2rTAfsKqc-lBVk6o8',3959,28,44,'text_available'),
('113zqtWddY0chdYcsHUeeHy7cU7LTr0e8',3449,20,44,'text_available'),
('1KItWF_x_aZY6yA3fYIr_iI5GAzBB2I1Z',1663,5,8,'text_available'),
('1qzVjBNf8Ds0sctelYf6O7TMgkD6dGRSc',3444,13,40,'text_available'),
('1rbgYWqYbW3nZDPdYy9FPUmn-Jy_cdWEu',3213,13,40,'text_available'),
('18XmkoMcjuI8tSyvBtmyc24O7--Td-wBe',3573,14,40,'text_available'),
('1VMW4YabkO9U3HaMnSMP8UDsET7JcK9Fz',2697,15,40,'text_available'),
('18UvPPztQY21WrOflYBsqlky-3QnEO9r1',3795,7,24,'text_available')
)
INSERT INTO attest_ingest.telegram_informatika_pdf_scan_audit
(source_file_id,extracted_chars,numbered_line_count,mc_option_marker_count,scan_state,source_contents_reviewed,answer_keys_verified)
SELECT s.source_file_id,s.extracted_chars,s.numbered_line_count,s.mc_option_marker_count,s.scan_state,false,false
FROM observed s JOIN attest_ingest.telegram_informatika_drive_pdf_inventory i ON i.source_file_id=s.source_file_id
ON CONFLICT(source_file_id) DO NOTHING;
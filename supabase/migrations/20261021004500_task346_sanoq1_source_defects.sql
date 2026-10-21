-- TASK-346 wave5: additional source errors found by checking individual pages of the 21-page numeral-system PDF.
-- Guarded inserts deliberately do nothing on a fresh CI database without imported private PDF source records.
WITH findings(source_file_id,source_question_no,issue_code,evidence_uz) AS (
 VALUES
 ('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',4,'no_correct_choice',
 'Asl PDF 4-betda 1A40b soni 9 asosli deb berilgan. A belgisi 10 ga teng, to‘qqizlikda ruxsat etilgan 0..8 raqamlar orasida yo‘q, shu bois tenglik berilgan ko‘rinishda yaroqsiz.'),
 ('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',6,'no_correct_choice',
 '215 sakkizlikda 141, 93 o‘n oltilikda 147. Oraliqdagi juft 142,144,146 ning ikkilik yozuvlarida ketma-ket 00 mavjud; barchasi o‘chiriladi, qolganlar yig‘indisi 0. 63/54/72/65 variantlarda 0 yo‘q.'),
 ('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',8,'no_correct_choice',
 'Asl 8-betda xy to‘qqizlikda 47 sakkizlikka teng. 47 sakkizlik 39 o‘nlik, shundan x=4,y=3 va xy ko‘paytma 12 o‘nlik =1100 ikkilik. Taklif variantlari 10010/10101/10100/11010, mos javob mavjud emas.'),
 ('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',9,'no_correct_choice',
 'Asl 9-betdagi 36^10+6^15−18 soni 6 asosli yozuvda 100000555555555555530 bo‘ladi, 0 raqami 6 marta uchraydi; 15/14/16/17 javoblarining hech biri mos emas.')
)
INSERT INTO attest_ingest.telegram_informatika_pdf_release_blockers
(source_file_id,source_question_no,issue_code,evidence_uz)
SELECT f.source_file_id,f.source_question_no,f.issue_code,f.evidence_uz
FROM findings f JOIN attest_ingest.telegram_informatika_pdf_question_candidates p
USING(source_file_id,source_question_no)
ON CONFLICT(source_file_id,source_question_no,issue_code) DO NOTHING;

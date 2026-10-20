-- TASK-346 QA6: private, visually inspected one-page worksheet; full source remains non-public DB.
-- In GitHub only short mathematical expression samples; no uploaded page images, passwords or book chapters.
WITH source_data(question_no,original_text,computed_result,explanation_uz,review_state) AS (
VALUES (1,'=AVERAGE(7;6;4;2;8)','5.4','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =AVERAGE funksiyasining natijasi 5.4. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(2,'=AVERAGE(6;4;8;2;16;97)','133/6 ≈ 22.1666666667','AVERAGE natijasi (6+4+8+2+16+97)/6=133/6. To‘liq aniq qiymat oddiy kasr; o‘nli ko‘rinish taxminiy.','computed_review_only'),
(3,'=AVERAGE(17;31;24;19;45;21)','157/6 ≈ 26.1666666667','AVERAGE natijasi (17+31+24+19+45+21)/6=157/6. Cheksiz o‘nli yozuv taxminiy keltirildi.','computed_review_only'),
(4,'=AVERAGE(25;24;26;27;28)','26','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =AVERAGE funksiyasining natijasi 26. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(5,'=AVERAGE(12.4;5.2;6.7;7.3;9.8)','8.28','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =AVERAGE funksiyasining natijasi 8.28. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(6,'=FACT(4)','24','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =FACT funksiyasining natijasi 24. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(7,'=FACT(5)','120','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =FACT funksiyasining natijasi 120. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(8,'=FACT(7)','5040','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =FACT funksiyasining natijasi 5040. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(9,'=FACT(8)','40320','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =FACT funksiyasining natijasi 40320. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(10,'=FACT(3)','6','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =FACT funksiyasining natijasi 6. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(11,'=MAX(87;45;-124;-1000;0)','87','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =MAX funksiyasining natijasi 87. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(12,'=MAX(17;64;-102;0)','64','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =MAX funksiyasining natijasi 64. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(13,'=MIN(-98;-12;0;-32)','-98','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =MIN funksiyasining natijasi -98. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(14,'=MIN(-1000;0;47;98)','-1000','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =MIN funksiyasining natijasi -1000. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(15,'=COUNT(8;6;5;7)','4','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =COUNT funksiyasining natijasi 4. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(16,'=COUNT(47;A;B;R;6)',NULL,'COUNT funksiyasida A, B va R qo‘shtirnoqsiz identifikatorlar. Ular uchun nomlangan diapazon ta’rifi berilmaganligi sabab ifoda #NAME? xatosi keltirishi yoki tashqi workbook ta’riflariga bog‘liq bo‘lishi mumkin. Avval manba to‘ldirilsin.','invalid_source_formula'),
(17,'A1=8; A2=9; A3=14; B1=6; 
B2=13; B3=21.
=COUNTIF(A1:B3; “>=13”)','3','COUNTIF(A1:B3;>=13): uchta qiymat A3=14, B2=13 va B3=21 mezonga mos keladi.','computed_review_only'),
(18,'A1=MAKTAB; B6=ONA; 
B4=VATAN; A5=KITOB A4=ONA 
=COUNTIF(A1:B6; “ONA”)','2','COUNTIF(A1:B6;ONA) A4 va B6 kataklarida ONA so‘zini sanaydi, jami ikki katak.','computed_review_only'),
(19,'A1=MAKTAB; B6=ONA; 
B4=VATAN; A5=KITOB A4=ONA
=COUNTIF(A1:B4; “KITOB”)','0','COUNTIF(A1:B4;KITOB) oralig‘ida A5 katagi yo‘q; KITOB A5 da bo‘lsa ham natija 0.','computed_review_only'),
(20,'A1=8; A2=9; A3=14; B1=6; 
B2=13; B3=21
=COUNTIF(A1:B2; “>14”)','0','COUNTIF(A1:B2;>14) tanlangan A1=8,A2=9,B1=6,B2=13 qiymatlari ichida 14 dan kattasi yo‘q.','computed_review_only'),
(21,'=LEN(“O`ZBEKISTON”)','11','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =LEN funksiyasining natijasi 11. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(22,'=LEN(6457)','4','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =LEN funksiyasining natijasi 4. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(23,'=LEN(3.2478)','6','LEN(3.2478) sonni matnga aylantirib uzunligini sanaydi; berilgan 3.2478 yozuvida 6 belgi bor.','computed_review_only'),
(24,'=LEN(“ATTESTATSIYA”)','12','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =LEN funksiyasining natijasi 12. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(25,'=LEN(“BUGUN”)','5','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =LEN funksiyasining natijasi 5. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(26,'=LEFT(“ATTESTATSIYA”;8)','ATTESTAT','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =LEFT funksiyasining natijasi ATTESTAT. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(27,'=LEFT(“KINOLAR”;4)','KINO','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =LEFT funksiyasining natijasi KINO. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(28,'=LEFT(O`QITUVCHI”;4)',NULL,'LEFT(O`QITUVCHI”;4) asl manbada matnni ochuvchi qo‘shtirnoq mavjud emas. Faqat yopuvchi qo‘shtirnoq bilan yozilgan formula berilganicha sintaktik jihatdan xato.','invalid_source_formula'),
(29,'=LEFT(“GULNOZA”;3)','GUL','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =LEFT funksiyasining natijasi GUL. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(30,'=LEFT(-54789;1)','-','LEFT(-54789;1) manfiy sonni satrga aylantiradi va dastlabki ''-'' belgisini ajratadi.','computed_review_only'),
(31,'=RIGHT(“QASHQADARYO”;5)','DARYO','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =RIGHT funksiyasining natijasi DARYO. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(32,'=RIGHT(“TOSHKENT”;4)','KENT','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =RIGHT funksiyasining natijasi KENT. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(33,'=RIGHT(“REGISTRATSIYA”;7)','RATSIYA','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =RIGHT funksiyasining natijasi RATSIYA. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(34,'=RIGHT(“HAMMAGAOMAD”;4)','OMAD','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =RIGHT funksiyasining natijasi OMAD. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(35,'=REPLACE(“INFORMATIKA";5;
7 “TEACH”)',NULL,'REPLACE matn;start;count;replacement to‘rtta argument oladi. Asl PDFda 7 sonidan keyin TEACH matni oldidan nuqtali vergul qo‘yilmagan; avval manba formulasi tuzatilishi kerak.','invalid_source_formula'),
(36,'=REPLACE(“GULISTON”;4;5; 
“TOJIXO`ROZ”)','GULTOJIXO`ROZ','REPLACE GULISTON ning 4-pozitsiyasidan boshlab ISTON ni TOJIXO`ROZ ga almashtiradi; GUL qismi saqlanadi.','computed_review_only'),
(37,'=MID(“MAMLAKAT”;5;3)','AKA','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =MID funksiyasining natijasi AKA. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(38,'=MID(“TEXNOLOGIYA”;4;3)','NOL','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =MID funksiyasining natijasi NOL. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(39,'=MID(“MICROSOFT”;6;3)','SOF','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =MID funksiyasining natijasi SOF. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(40,'=MID(“MUHAMMAD”;3;5)','HAMMA','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =MID funksiyasining natijasi HAMMA. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only')
)
INSERT INTO attest_ingest.telegram_informatika_pdf_question_candidates
(source_file_id,source_file_name,source_question_no,source_pdf_url,extracted_question_text,extracted_answer_options,module_hint,quality_flags,review_state,answer_key,source_page_number,source_visually_checked)
SELECT i.source_file_id,'Excelda Matematik va Mantiqiy funksiyalarga oid savollar.pdf',d.question_no,'https://drive.google.com/file/d/1PEx1IJ4cpMyfhBcUiwP5D_iVadACjUYU/view',d.original_text,'[]'::jsonb,'M03',
 CASE WHEN d.review_state='invalid_source_formula'
  THEN ARRAY['excel_source_formula_invalid_or_undefined','no_official_answer_key','free_response']::text[]
  WHEN d.question_no IN(17,18,19,20)
  THEN ARRAY['excel_source_cell_context_required','no_official_answer_key','free_response']::text[]
  ELSE ARRAY['no_official_answer_key','free_response']::text[] END,
 'needs_answer_and_visual_review',NULL,1,true
FROM source_data d
JOIN attest_ingest.telegram_informatika_drive_pdf_inventory i ON i.source_file_id='1PEx1IJ4cpMyfhBcUiwP5D_iVadACjUYU'
ON CONFLICT(source_file_id,source_question_no) DO NOTHING;

WITH source_data(question_no,original_text,computed_result,explanation_uz,review_state) AS (
VALUES (1,'=AVERAGE(7;6;4;2;8)','5.4','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =AVERAGE funksiyasining natijasi 5.4. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(2,'=AVERAGE(6;4;8;2;16;97)','133/6 ≈ 22.1666666667','AVERAGE natijasi (6+4+8+2+16+97)/6=133/6. To‘liq aniq qiymat oddiy kasr; o‘nli ko‘rinish taxminiy.','computed_review_only'),
(3,'=AVERAGE(17;31;24;19;45;21)','157/6 ≈ 26.1666666667','AVERAGE natijasi (17+31+24+19+45+21)/6=157/6. Cheksiz o‘nli yozuv taxminiy keltirildi.','computed_review_only'),
(4,'=AVERAGE(25;24;26;27;28)','26','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =AVERAGE funksiyasining natijasi 26. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(5,'=AVERAGE(12.4;5.2;6.7;7.3;9.8)','8.28','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =AVERAGE funksiyasining natijasi 8.28. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(6,'=FACT(4)','24','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =FACT funksiyasining natijasi 24. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(7,'=FACT(5)','120','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =FACT funksiyasining natijasi 120. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(8,'=FACT(7)','5040','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =FACT funksiyasining natijasi 5040. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(9,'=FACT(8)','40320','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =FACT funksiyasining natijasi 40320. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(10,'=FACT(3)','6','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =FACT funksiyasining natijasi 6. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(11,'=MAX(87;45;-124;-1000;0)','87','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =MAX funksiyasining natijasi 87. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(12,'=MAX(17;64;-102;0)','64','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =MAX funksiyasining natijasi 64. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(13,'=MIN(-98;-12;0;-32)','-98','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =MIN funksiyasining natijasi -98. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(14,'=MIN(-1000;0;47;98)','-1000','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =MIN funksiyasining natijasi -1000. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(15,'=COUNT(8;6;5;7)','4','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =COUNT funksiyasining natijasi 4. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(16,'=COUNT(47;A;B;R;6)',NULL,'COUNT funksiyasida A, B va R qo‘shtirnoqsiz identifikatorlar. Ular uchun nomlangan diapazon ta’rifi berilmaganligi sabab ifoda #NAME? xatosi keltirishi yoki tashqi workbook ta’riflariga bog‘liq bo‘lishi mumkin. Avval manba to‘ldirilsin.','invalid_source_formula'),
(17,'A1=8; A2=9; A3=14; B1=6; 
B2=13; B3=21.
=COUNTIF(A1:B3; “>=13”)','3','COUNTIF(A1:B3;>=13): uchta qiymat A3=14, B2=13 va B3=21 mezonga mos keladi.','computed_review_only'),
(18,'A1=MAKTAB; B6=ONA; 
B4=VATAN; A5=KITOB A4=ONA 
=COUNTIF(A1:B6; “ONA”)','2','COUNTIF(A1:B6;ONA) A4 va B6 kataklarida ONA so‘zini sanaydi, jami ikki katak.','computed_review_only'),
(19,'A1=MAKTAB; B6=ONA; 
B4=VATAN; A5=KITOB A4=ONA
=COUNTIF(A1:B4; “KITOB”)','0','COUNTIF(A1:B4;KITOB) oralig‘ida A5 katagi yo‘q; KITOB A5 da bo‘lsa ham natija 0.','computed_review_only'),
(20,'A1=8; A2=9; A3=14; B1=6; 
B2=13; B3=21
=COUNTIF(A1:B2; “>14”)','0','COUNTIF(A1:B2;>14) tanlangan A1=8,A2=9,B1=6,B2=13 qiymatlari ichida 14 dan kattasi yo‘q.','computed_review_only'),
(21,'=LEN(“O`ZBEKISTON”)','11','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =LEN funksiyasining natijasi 11. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(22,'=LEN(6457)','4','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =LEN funksiyasining natijasi 4. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(23,'=LEN(3.2478)','6','LEN(3.2478) sonni matnga aylantirib uzunligini sanaydi; berilgan 3.2478 yozuvida 6 belgi bor.','computed_review_only'),
(24,'=LEN(“ATTESTATSIYA”)','12','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =LEN funksiyasining natijasi 12. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(25,'=LEN(“BUGUN”)','5','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =LEN funksiyasining natijasi 5. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(26,'=LEFT(“ATTESTATSIYA”;8)','ATTESTAT','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =LEFT funksiyasining natijasi ATTESTAT. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(27,'=LEFT(“KINOLAR”;4)','KINO','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =LEFT funksiyasining natijasi KINO. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(28,'=LEFT(O`QITUVCHI”;4)',NULL,'LEFT(O`QITUVCHI”;4) asl manbada matnni ochuvchi qo‘shtirnoq mavjud emas. Faqat yopuvchi qo‘shtirnoq bilan yozilgan formula berilganicha sintaktik jihatdan xato.','invalid_source_formula'),
(29,'=LEFT(“GULNOZA”;3)','GUL','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =LEFT funksiyasining natijasi GUL. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(30,'=LEFT(-54789;1)','-','LEFT(-54789;1) manfiy sonni satrga aylantiradi va dastlabki ''-'' belgisini ajratadi.','computed_review_only'),
(31,'=RIGHT(“QASHQADARYO”;5)','DARYO','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =RIGHT funksiyasining natijasi DARYO. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(32,'=RIGHT(“TOSHKENT”;4)','KENT','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =RIGHT funksiyasining natijasi KENT. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(33,'=RIGHT(“REGISTRATSIYA”;7)','RATSIYA','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =RIGHT funksiyasining natijasi RATSIYA. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(34,'=RIGHT(“HAMMAGAOMAD”;4)','OMAD','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =RIGHT funksiyasining natijasi OMAD. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(35,'=REPLACE(“INFORMATIKA";5;
7 “TEACH”)',NULL,'REPLACE matn;start;count;replacement to‘rtta argument oladi. Asl PDFda 7 sonidan keyin TEACH matni oldidan nuqtali vergul qo‘yilmagan; avval manba formulasi tuzatilishi kerak.','invalid_source_formula'),
(36,'=REPLACE(“GULISTON”;4;5; 
“TOJIXO`ROZ”)','GULTOJIXO`ROZ','REPLACE GULISTON ning 4-pozitsiyasidan boshlab ISTON ni TOJIXO`ROZ ga almashtiradi; GUL qismi saqlanadi.','computed_review_only'),
(37,'=MID(“MAMLAKAT”;5;3)','AKA','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =MID funksiyasining natijasi AKA. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(38,'=MID(“TEXNOLOGIYA”;4;3)','NOL','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =MID funksiyasining natijasi NOL. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(39,'=MID(“MICROSOFT”;6;3)','SOF','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =MID funksiyasining natijasi SOF. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only'),
(40,'=MID(“MUHAMMAD”;3;5)','HAMMA','Mustaqil Excel semantik hisobida manbadagi qiymatlar bilan bajarilgan =MID funksiyasining natijasi HAMMA. Asl PDFda tasdiqlangan javob kaliti yo‘q, natija faqat tahririy tekshiruv uchun.','computed_review_only')
)
INSERT INTO attest_ingest.telegram_informatika_pdf_formula_worked_qa
(source_file_id,source_question_no,formula_text,computed_result,explanation_uz,review_state)
SELECT c.source_file_id,c.source_question_no,d.original_text,d.computed_result,d.explanation_uz,d.review_state
FROM source_data d
JOIN attest_ingest.telegram_informatika_pdf_question_candidates c
 ON c.source_file_id='1PEx1IJ4cpMyfhBcUiwP5D_iVadACjUYU' AND c.source_question_no=d.question_no
 AND c.answer_key IS NULL AND c.extracted_question_text=d.original_text AND jsonb_array_length(c.extracted_answer_options)=0
ON CONFLICT(source_file_id,source_question_no) DO NOTHING;

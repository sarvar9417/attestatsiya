-- TASK-346 QA7: expert-paraphrased source-based MC exercises, not a copyrighted test PDF transcription.
-- Original Drive file remains external and original source answers are unavailable.
-- All source texts and AI proposals are in a PRIVATE schema and never learner-publishable.
WITH original_review(question_no,source_page,paraphrased_stem,choices,module_hint,needs_figure) AS (
VALUES (1,1,'Robot labirintdagi bo‘sh yo‘nalishlarga navbat bilan o‘ng, past, chap, yuqori yuradi. Boshlang‘ich katak va asl chizma hisobga olinib, nechta yo‘l robotni dastlabki katakka qaytaradi?','["4","3","2","1"]'::jsonb,'M04',true),
(2,1,'IPv4 manzil 192.168.25.6/22 berilgan. Ushbu prefiksning o‘nlik nuqtali tarmoq maskasi qaysi?','["255.255.252.0","255.192.0.0","192.168.0.0","192.168.25.28"]'::jsonb,'M12',false),
(3,1,'Qidiruvda M∩I =330 ming, M∩F =270 ming, M∩(I∪F)=520 ming sahifa topilgan. M∩I∩F nechta ming sahifa?','["80","140","75","225"]'::jsonb,'M04',false),
(4,2,'Uch raqamli sonning 1- va 2-, 2- va 3-raqamlari yig‘indisi kamayish tartibida ketma-ket yoziladi. Natija 116 chiqishi uchun 429,247,338,156 variantlaridan eng kichigini toping.','["429","247","338","156"]'::jsonb,'M04',false),
(5,2,'HTML jadvalda rowspan=2 bo‘lgan 160 va colspan=2 bo‘lgan 80 birlashtirilgan; boshqa yakka kataklar 160,80,-160,85. Birlashtirilmagan katak sonlari yig‘indisini shu kataklar soniga ko‘paytiring.','["660","990","750","800"]'::jsonb,'M11',false),
(6,2,'320×400 piksel tasvir 16000 bayt (siqilmasdan) egallasa, har bir piksel rangini tasvirlash uchun eng ko‘pi bilan nechta rangdan foydalanish mumkin?','["1","2","4","8"]'::jsonb,'M05',false),
(7,2,'Excel jadvalida A1:A8 qiymatlari yig‘indisi 400. A9 katakka =СРЗНАЧ(A1:A8)-2 yozilgan bo‘lsa, hisoblanadigan natija qaysi?','["24","48","398","400"]'::jsonb,'M03',false),
(8,3,'Scratch skriptida yoshingiz so‘raladi va 8 < yosh < 17 sharti bajarilsa ''yosh ekansiz'' deyiladi. Javob 11 bo‘lganda chiqadigan matn qaysi?','["yosh ekansiz","ancha yosh ekansiz","11","dastur xatolik chiqaradi"]'::jsonb,'M07',true),
(9,3,'JavaScript: var a=25; var b=15; a--; a+=b; a--; console.log(a); Ekranga qaysi son chiqadi?','["38","39","37","40"]'::jsonb,'M09',false),
(10,4,'Prefiks kod: A=00, B=01, C=1011, D=1100, E=1101, F=1110, G=1111. 10111111110011111110001101 bitlar ketma-ketligidagi xabarni toping.','["GCDGFAE","CGDGFAE","EAFGDGC","CGDGFEA"]'::jsonb,'M05',false)
)
INSERT INTO attest_ingest.telegram_informatika_pdf_question_candidates
(source_file_id,source_file_name,source_question_no,source_pdf_url,extracted_question_text,extracted_answer_options,module_hint,quality_flags,review_state,answer_key,source_page_number,source_visually_checked)
SELECT i.source_file_id,'Attestatsiya test №3.pdf',s.question_no,
 'https://drive.google.com/file/d/1RUY2J0G_A5oYzca03MRtQr1lU_vpkaqC/view',s.paraphrased_stem,s.choices,s.module_hint,
 CASE WHEN s.needs_figure
 THEN ARRAY['source_original_visual_required','paraphrased_expert_staging','no_original_key','independent_editorial_review_needed']::text[]
 ELSE ARRAY['paraphrased_expert_staging','no_original_key','independent_editorial_review_needed']::text[] END,
 'needs_answer_and_visual_review',NULL,s.source_page,true
FROM original_review s JOIN attest_ingest.telegram_informatika_drive_pdf_inventory i ON i.source_file_id='1RUY2J0G_A5oYzca03MRtQr1lU_vpkaqC'
ON CONFLICT(source_file_id,source_question_no) DO NOTHING;

WITH proposed(question_no,answer_index,original_explanation_uz) AS (
VALUES (2,0,'/22 prefiks 22 birlik bit va 10 nol bilan ifodalanadi: 255.255.252.0. 192.168.25.6 host manzil bo‘lib, maska boshqa kattalik.'),
(3,0,'To‘plamlar qo‘shish-ayirish qonuniga ko‘ra |M∩(I∪F)|=|M∩I|+|M∩F|−|M∩I∩F|. 520=330+270−x, demak x=80 ming.'),
(4,3,'Barcha to‘rtta variantda qo‘shni raqamlar yig‘indilari 6 va 11 bo‘lib kamayish tartibida 116 ni beradi. Variantlar orasida eng kichik uch xonali son 156 (D), chunki 156<247<338<429.'),
(5,0,'Birlashtirilgan rowspan/colspan kataklardagi 160 va 80 hisobga olinmaydi. Oddiy kataklar qiymatlari 160+80−160+85=165, kataklar soni 4, javob 165×4=660.'),
(6,1,'16000 bayt ×8=128000 bit; 320×400=128000 piksel. Har pikselga 1 bit to‘g‘ri keladi, rang holatlari 2¹=2 ta.'),
(7,1,'СРЗНАЧ Excelning AVERAGE funksiyasi: 400/8=50, keyin −2 amalini bajaramiz: 48.'),
(8,0,'Scratch blokida shart (yosh>8) VA (yosh<17). yosh=11 uchun ikkala qism rost; birinchi say bloki ''yosh ekansiz'' yozuvini chiqaradi. Asl Scratch rasmi o‘quvchi assetiga ulanmagan.'),
(9,0,'Dastlab a=25. Birinchi a-- dan keyin a=24; a+=15 dan keyin a=39; ikkinchi a-- dan keyin a=38. console.log 38 chiqaradi.'),
(10,1,'Kod prefikslarini chapdan o‘ngga tanlaymiz: 1011=C, 1111=G, 1100=D, 1111=G, 1110=F, 00=A, 1101=E. Natija CGDGFAE.')
)
INSERT INTO attest_ingest.telegram_informatika_pdf_independent_qa
(source_file_id,source_question_no,suggested_option_index,explanation_uz)
SELECT c.source_file_id,c.source_question_no,p.answer_index,p.original_explanation_uz
FROM proposed p JOIN attest_ingest.telegram_informatika_pdf_question_candidates c
 ON c.source_file_id='1RUY2J0G_A5oYzca03MRtQr1lU_vpkaqC' AND c.source_question_no=p.question_no
 AND c.answer_key IS NULL AND jsonb_array_length(c.extracted_answer_options)=4
ON CONFLICT(source_file_id,source_question_no) DO NOTHING;

WITH visual_items(question_no) AS (VALUES (1),(8))
INSERT INTO attest_ingest.telegram_informatika_pdf_visual_index
(source_file_id,source_question_no,source_page_number,source_format_hint,asset_review_state,content_publish_ready)
SELECT c.source_file_id,c.source_question_no,c.source_page_number,'text_plus_figure',
 'pdf_figure_not_exported_to_platform',false
FROM visual_items v JOIN attest_ingest.telegram_informatika_pdf_question_candidates c
 ON c.source_file_id='1RUY2J0G_A5oYzca03MRtQr1lU_vpkaqC' AND c.source_question_no=v.question_no
ON CONFLICT(source_file_id,source_question_no) DO NOTHING;

WITH finding AS (
 SELECT '1RUY2J0G_A5oYzca03MRtQr1lU_vpkaqC'::text source_file_id,1::integer source_question_no,
 'insufficient_problem_data'::text issue_code,
 'Labirint savolida robotning boshlang‘ich katagi asl PDFda aniq belgilab berilmagan; diagramma o‘quvchiga ulanmagan. Harakat qoidalaridan yakka javobni manbasiz taxmin qilish mumkin emas. Savol tahririy aniqlashtirish talab qiladi.'::text evidence_uz
)
INSERT INTO attest_ingest.telegram_informatika_pdf_release_blockers
(source_file_id,source_question_no,issue_code,evidence_uz)
SELECT f.* FROM finding f JOIN attest_ingest.telegram_informatika_pdf_question_candidates c
 USING(source_file_id,source_question_no)
ON CONFLICT(source_file_id,source_question_no,issue_code) DO NOTHING;
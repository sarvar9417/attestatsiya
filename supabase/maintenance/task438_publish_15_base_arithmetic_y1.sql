-- TASK-438 first corrected Informatika PDF Y1 release — 15 independently solved number system source rewrites (NOT source-original keys).
-- User directed publication and merge on 2026-10-22. AI-assisted, NOT independent human approval.
-- Trusted controlled SQL migration, no existing questions/exam items updated.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='100s';
CREATE TEMP TABLE task438_release (
 source_id text, source_no int, construct_code text, lesson_id uuid, cognitive text,
 stem text, opts text[], correct_idx int, explanation text, question_id uuid default gen_random_uuid(),
 PRIMARY KEY(source_id,source_no),UNIQUE(question_id)
) ON COMMIT DROP;
INSERT INTO task438_release(source_id,source_no,construct_code,lesson_id,cognitive,stem,opts,correct_idx,explanation) VALUES
('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',1,'S3.NUM.03','95000000-0000-4000-8000-000000000003'::uuid,'qollash','24₈, C₁₆ va 22₇ uzunliklari to‘g‘ri burchakli uchburchakning uch tomonini tashkil qiladi. Uchburchak yuzini o‘nlikda hisoblang.',ARRAY['48','64','96','128']::text[],2,'24₈=20₁₀; C₁₆=12₁₀; 22₇=16₁₀. 12²+16²=20², demak 12 va 16 katetlar. Yuz S=(12×16)/2=96.'),
('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',2,'S3.NUM.03','95000000-0000-4000-8000-000000000003'::uuid,'qollash','Uchburchak asosi A₁₅, balandligi 6₇ birlik. Ularning o‘nlik qiymatlari bilan yuzani toping.',ARRAY['24','30','48','52']::text[],1,'A₁₅=10, 6₇=6. Uchburchak yuzi (10×6)/2=30.'),
('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',3,'S3.NUM.03','95000000-0000-4000-8000-000000000003'::uuid,'qollash','x asosli sanoq sistemasida 3607ₓ + 25676ₓ = 31505ₓ tenglik berilgan. Barcha raqamlar to‘g‘ri bo‘lishi uchun x≥8. Tenglikni qanoatlantiradigan asosni toping.',ARRAY['7','8','9','10']::text[],1,'Barcha raqamlar 0…7 oralig‘ida, demak x≥8. x=8 da 3607₈=1927, 25676₈=11198, yig‘indi 13125; 31505₈ ham 13125. Tenglamaning asosga bog‘liq polinomini tekshirganda yagona mumkinli asos 8.'),
('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',5,'S3.NUM.03','95000000-0000-4000-8000-000000000003'::uuid,'qollash','A nuqta (32₅;24₅), B nuqta (13₆;12₆) koordinatalarga ega. Evklid masofasini avval o‘nlikda, so‘ng ikkilikda hisoblang. Ikkilik qiymatni tanlang.',ARRAY['1000₂','1001₂','1010₂','1100₂']::text[],2,'32₅=17,24₅=14; 13₆=9,12₆=8. Farqlar 8 va 6; masofa sqrt(8²+6²)=10₁₀=1010₂.'),
('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',7,'S3.NUM.03','95000000-0000-4000-8000-000000000003'::uuid,'qollash','1) 11101011₂; 2) 345₈; 3) 224₁₀; 4) DD₁₅ (D=13). Qaysi ikkita sonning yig‘indisi eng kichik?',ARRAY['1 va 2','1 va 4','2 va 3','3 va 4']::text[],3,'11101011₂=235; 345₈=229; 224₁₀=224; DD₁₅=13×15+13=208. Eng kichik ikkita son 208 va 224, ya’ni 3 hamda 4.'),
('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',11,'S3.NUM.03','95000000-0000-4000-8000-000000000003'::uuid,'qollash','3¹² sonining beshlik sanoq sistemasidagi yozuvida oxirgi raqam qaysi?',ARRAY['1','2','3','4']::text[],0,'Sonning beshlik yozuvidagi oxirgi raqam 3¹² mod 5 ga teng. 3⁴≡1(mod 5), demak 3¹²=(3⁴)³≡1. Oxirgi raqam 1.'),
('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',12,'S3.NUM.03','95000000-0000-4000-8000-000000000003'::uuid,'qollash','204ₓ + 321₄ = 237₈ tenglama o‘rinli bo‘lishi uchun x asosi nechaga teng? Topilgan asosni ikkilik sanoq sistemasida ifodalang.',ARRAY['101₂','110₂','111₂','1000₂']::text[],2,'321₄=3×16+2×4+1=57,237₈=2×64+3×8+7=159. Shundan 204ₓ=102, ya’ni 2x²+4=102 ⇒ x²=49 ⇒ x=7. 7₁₀=111₂.'),
('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',13,'S3.NUM.03','95000000-0000-4000-8000-000000000003'::uuid,'qollash','7²⁷ soni sakkizlik sanoq sistemasida yozilganda oxirgi raqam qanday bo‘ladi?',ARRAY['1','3','5','7']::text[],3,'7≡−1(mod 8), 7²⁷≡(−1)²⁷≡−1≡7(mod 8). Sakkizlik sonning oxirgi raqami aynan 8 ga bo‘lgandagi qoldiq, demak 7.'),
('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',14,'S3.NUM.02','95000000-0000-4000-8000-000000000002'::uuid,'qollash','22,65₁₀ sonini oltilik sanoq sistemasiga o‘tkazing. Davriy qismni qavs ichida ko‘rsating.',ARRAY['34,3(52)₆','34,35(2)₆','34,352₆','34,3(5)₆']::text[],1,'22₁₀=34₆. Kasr qismi: 0,65×6=3,9 ⇒ 3; 0,9×6=5,4 ⇒ 5; 0,4×6=2,4 ⇒ 2 qayta takrorlanadi. Natija 34,35(2)₆.'),
('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',15,'S3.NUM.01','95000000-0000-4000-8000-000000000001'::uuid,'qollash','24₁₀ = 18ₓ tenglikdagi noma’lum x sanoq sistemasi asosini toping.',ARRAY['10','14','16','18']::text[],2,'18ₓ=1×x+8. x+8=24 ⇒ x=16. 8 raqami ishlatilishi uchun x>8 sharti ham bajariladi.'),
('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',16,'S3.NUM.03','95000000-0000-4000-8000-000000000003'::uuid,'qollash','A nuqta (46₈;44₈), B nuqta (22₁₂;27₁₂) bo‘lsa, ular orasidagi Evklid masofasini 5 asosli sanoq sistemasida toping.',ARRAY['22₅','23₅','24₅','31₅']::text[],1,'A: (38,36); B: (26,31). Farqlar 12 va 5, masofa sqrt(12²+5²)=13₁₀. 13₁₀=2×5+3=23₅.'),
('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',17,'S3.NUM.03','95000000-0000-4000-8000-000000000003'::uuid,'qollash','To‘g‘ri burchakli uchburchak katetlari 36₇ va 2A₁₃ (A=10). Gipotenuza uzunligi 9 asosli sanoq sistemasida qanday yoziladi?',ARRAY['48₉','50₉','52₉','45₉']::text[],1,'36₇=3×7+6=27, 2A₁₃=2×13+10=36. Gipotenuza sqrt(27²+36²)=45₁₀. 45₁₀=5×9=50₉.'),
('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',18,'S3.NUM.03','95000000-0000-4000-8000-000000000003'::uuid,'qollash','3021₁₀ sonining to‘rtlik sanoq sistemasidagi yozuvida JUFT RAQAMLAR yig‘indisidan TOQ RAQAMLAR yig‘indisini ayiring. Natija qancha?',ARRAY['−8','−7','0','8']::text[],0,'3021₁₀=233031₄. Juft raqamlar faqat 2 bo‘lib yig‘indisi 2; toq raqamlar 3+3+0? 0 juft, 3+3+3+1=10. Farq 2−10=−8.'),
('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',19,'S3.NUM.03','95000000-0000-4000-8000-000000000003'::uuid,'qollash','224, 352 va A0A sonlari tarkibidagi eng katta raqam A=10 bo‘lgani uchun ularni yozish mumkin bo‘lgan ENG KICHIK asos 11. Shu asosdagi uch sonning arifmetik o‘rtachasini 11 likda toping.',ARRAY['450₁₁','528₁₁','529₁₁','636₁₁']::text[],2,'224₁₁=268,352₁₁=420,A0A₁₁=1220. O‘rtacha (268+420+1220)/3=636₁₀. 636₁₀=5×11²+2×11+9=529₁₁.'),
('1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP',20,'S3.NUM.03','95000000-0000-4000-8000-000000000003'::uuid,'qollash','x=3212₅, y=1202₃, z=2541₇. O‘nlikka o‘tkazganda 6 ga KARRALI BO‘LMAGAN sonlarni qo‘shing va yig‘indini 7 asosli yozing.',ARRAY['65₇','66₇','67₇','97₇']::text[],0,'x=432 (6 ga bo‘linadi), y=47 (6 ga bo‘linmaydi), z=960 (6 ga bo‘linadi). Faqat 47 olinadi va 47₁₀=6×7+5=65₇.');
DO $guard$
DECLARE n int;
BEGIN
 IF (SELECT count(*) FROM task438_release)<>15 THEN RAISE EXCEPTION 'TASK438_SCOPE_NOT_FIFTEEN'; END IF;
 IF EXISTS (SELECT 1 FROM task438_release m WHERE array_length(m.opts,1)<>4 OR
    (SELECT count(distinct btrim(t)) FROM unnest(m.opts) t)<>4 OR
    m.correct_idx NOT BETWEEN 0 AND 3 OR length(btrim(m.explanation))<75 OR length(m.stem)<55)
 THEN RAISE EXCEPTION 'TASK438_BAD_OPTIONS_OR_EXPLANATION'; END IF;
 SELECT count(*) INTO n FROM task438_release m
 JOIN attest_ingest.telegram_informatika_pdf_question_candidates s ON s.source_file_id=m.source_id AND s.source_question_no=m.source_no
 JOIN public.constructs c ON c.code=m.construct_code AND c.is_active AND c.group_code IN ('S3.NUM')
 JOIN public.lesson_constructs lc ON lc.construct_id=c.id AND lc.lesson_id=m.lesson_id
 JOIN public.lessons l ON l.id=m.lesson_id AND l.status='published'::public.content_status
 WHERE s.source_page_number IS NOT NULL AND s.source_visually_checked AND s.answer_key IS NULL;
 IF n<>15 THEN RAISE EXCEPTION 'TASK438_SOURCE_LESSON_DRIFT_%',n; END IF;
 IF EXISTS(SELECT 1 FROM task438_release m JOIN public.questions q ON q.source_reference=
    'task438:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text)
 THEN RAISE EXCEPTION 'TASK438_ALREADY_EXISTS'; END IF;
 IF EXISTS(SELECT 1 FROM task438_release m JOIN public.questions q ON lower(regexp_replace(q.stem_md,'[[:space:]]+','','g'))=lower(regexp_replace(m.stem,'[[:space:]]+','','g')) AND q.status IN('review','published'))
 THEN RAISE EXCEPTION 'TASK438_DUPLICATE_STEM'; END IF;
END $guard$;
INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT m.question_id,c.subject_id,c.id,c.group_code,'Y1'::public.question_format,m.cognitive::public.cognitive_level,3,m.stem,'[]'::jsonb,true,'review'::public.content_status,NULL,
 'task438:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text,m.lesson_id
FROM task438_release m JOIN public.constructs c ON c.code=m.construct_code;
INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),m.question_id,'a',ord-1,m.opts[ord]
FROM task438_release m CROSS JOIN LATERAL generate_subscripts(m.opts,1) ord;
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT m.question_id,jsonb_build_object('correct_option_id',o.id::text),m.explanation
FROM task438_release m JOIN public.question_options o ON o.question_id=m.question_id AND o.order_idx=m.correct_idx;
DO $quality$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task438_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='review' AND q.is_generated=true AND q.format='Y1'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
 AND (SELECT count(DISTINCT btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=q.id)=4
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')=1
 AND NOT EXISTS (SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=q.id AND f.resolved_at IS NULL AND f.severity IN ('high','critical'));
 IF n<>15 THEN RAISE EXCEPTION 'TASK438_RELEASE_QA_FAILED_%',n; END IF;
END $quality$;
-- Owner-delegated AI editorial publication, no fabricated human editorial signature.
UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
FROM task438_release m WHERE q.id=m.question_id AND q.status='review'::public.content_status;
UPDATE public.question_quality_published_revisions r SET
 release_scope='TASK-438 (2026-10-22): user-authorized AI-assisted PDF-derived NEW Y1 questions; independently evaluated options; no human expert signature'
FROM task438_release m WHERE r.question_id=m.question_id;
DO $post$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task438_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_quality_published_revisions r ON r.question_id=q.id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='published' AND q.is_generated=true AND q.source_lesson_id=m.lesson_id
 AND r.content_fingerprint=public.professional_question_fingerprint(q.id)
 AND r.release_scope LIKE 'TASK-438%'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id)=4;
 IF n<>15 THEN RAISE EXCEPTION 'TASK438_POSTFLIGHT_%_OF_15',n; END IF;
 IF EXISTS (SELECT 1 FROM task438_release m JOIN public.question_editorial_checks e ON e.question_id=m.question_id)
 THEN RAISE EXCEPTION 'TASK438_FALSE_HUMAN_ATTESTATION'; END IF;
END $post$;
COMMIT;

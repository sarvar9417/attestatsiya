-- TASK-432 first corrected Informatika PDF Y1 release — 6 newly authored PowerPoint conceptual questions (NOT source-original keys).
-- User directed publication and merge on 2026-10-22. AI-assisted, NOT independent human approval.
-- Trusted controlled SQL migration, no existing questions/exam items updated.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='100s';
CREATE TEMP TABLE task432_release (
 source_id text, source_no int, construct_code text, lesson_id uuid, cognitive text,
 stem text, opts text[], correct_idx int, explanation text, question_id uuid default gen_random_uuid(),
 PRIMARY KEY(source_id,source_no),UNIQUE(question_id)
) ON COMMIT DROP;
INSERT INTO task432_release(source_id,source_no,construct_code,lesson_id,cognitive,stem,opts,correct_idx,explanation) VALUES
('1LEZo28L9u6DQXGvHU5himMvBl8_Bi0xi',3,'S2.OFFICE.04','1d4800f2-e5f8-d27d-30fe-3b8d48b1de3d'::uuid,'qollash','PowerPoint taqdimotida bir slayd ikkinchisiga Fade bilan almashadi, yangi slayddagi rasm esa Fly In bilan paydo bo‘ladi. Qaysi izoh ikkala effektni to‘g‘ri farqlaydi?',ARRAY['Fade obyektning Exit animatsiyasi, Fly In esa slaydning Transition effekti','Fade slaydlararo Transition, Fly In esa slayd ichidagi obyekt Animation effekti','Fade faqat ovoz parametrini boshqaradi, Fly In esa slaydning vaqtini belgilaydi','Fade va Fly In bir xil turdagi slaydlararo o‘tish animatsiyalaridir']::text[],1,'PowerPointda Transition (masalan, slaydlararo Fade) to‘liq slaydni almashtirishga qo‘llanadi. Animation (masalan, Fly In) slayd ichidagi alohida obyektning paydo bo‘lishini belgilaydi. Ikkalasini bir xil menyu darajasi deb adashtirmaslik kerak.'),
('1LEZo28L9u6DQXGvHU5himMvBl8_Bi0xi',4,'S2.OFFICE.04','1d4800f2-e5f8-d27d-30fe-3b8d48b1de3d'::uuid,'qollash','PowerPoint ish stolida taqdimot ochiq. Slayd namoyishini **birinchi slayddan** klaviatura orqali boshlash uchun qaysi tugma ishlatiladi?',ARRAY['F5','Shift+F5','F7','Ctrl+S']::text[],0,'F5 namoyishni boshidan boshlaydi. Shift+F5 joriy slayddan boshlaydi, F7 odatda spelling tekshiruvini, Ctrl+S esa faylni saqlashni chaqiradi. Bu turli vazifalarni farqlash muhim.'),
('1LEZo28L9u6DQXGvHU5himMvBl8_Bi0xi',5,'S2.OFFICE.04','1d4800f2-e5f8-d27d-30fe-3b8d48b1de3d'::uuid,'mulohaza','PowerPoint slaydida matn, diagramma va rasm mavjud. O‘qituvchi ularning har birini alohida kirish animatsiyasi bilan ko‘rsatmoqchi. Qaysi mulohaza to‘g‘ri?',ARRAY['Faqat matn maydoniga Entrance animatsiya berilishi mumkin','Faqat rasm va shakllarga animatsiya berish mumkin, diagrammaga emas','Bunday holatda faqat Transition ishlaydi, obyekt Animation ishlamaydi','Matn, rasm va diagrammalarga alohida animatsiya qo‘llash mumkin']::text[],3,'PowerPoint matn maydonlari, rasmlar, shakllar va diagramma kabi turli obyektlarga Animation effekti bera oladi. Transition slaydlar orasidagi o‘tish uchun, obyektlarning individual paydo bo‘lishi uchun emas.'),
('1LEZo28L9u6DQXGvHU5himMvBl8_Bi0xi',6,'S2.OFFICE.04','1d4800f2-e5f8-d27d-30fe-3b8d48b1de3d'::uuid,'qollash','Slaydda ko‘rinib turgan shakl ma’lum lahzada ekrandan chiqib ketishi kerak. PowerPointdagi qaysi animatsiya guruhi tanlanadi?',ARRAY['Entrance — obyektni paydo qiladi','Emphasis — obyektni ta’kidlaydi','Exit — obyektni ekrandan chiqaradi','Motion Path — obyektni belgilangan yo‘l bo‘ylab suradi']::text[],2,'Exit animatsiyalari slaydda ko‘rinib turgan obyektning chiqib ketishi yoki yashirilishi uchun xizmat qiladi. Entrance kirishni, Emphasis urg‘u berishni, Motion Path esa obyekt harakat trayektoriyasini boshqaradi.'),
('1LEZo28L9u6DQXGvHU5himMvBl8_Bi0xi',7,'S2.OFFICE.04','1d4800f2-e5f8-d27d-30fe-3b8d48b1de3d'::uuid,'mulohaza','Slaydda 5 ta animatsiya qo‘llangan. Ularning ishga tushish navbati va har bir effektning boshlanish vaqti boshqariladigan oynani tanlang.',ARRAY['Slide Sorter — slaydlar umumiy tartibini ko‘rsatadi','Selection Pane — obyektlarni tanlash va qatlamlarda ko‘rishga yordam beradi','Animation Pane — effektlarning navbati va vaqtini boshqaradi','Transitions — slaydlararo almashish effektlarini o‘rnatadi']::text[],2,'Animation Pane slayd ichidagi Animation effektlarini ko‘rish, qayta tartiblash, boshlanish shartlari va vaqt sozlamalarini tekshirish imkonini beradi. Slide Sorter slaydlarning o‘z tartibini boshqaradi; Transitions esa slaydlararo effektlar uchun.'),
('1LEZo28L9u6DQXGvHU5himMvBl8_Bi0xi',8,'S2.OFFICE.04','1d4800f2-e5f8-d27d-30fe-3b8d48b1de3d'::uuid,'qollash','PowerPointdagi bitta obyekt animatsiyasi uchun **Delay** va **Duration** belgilandi. Qaysi izoh to‘g‘ri?',ARRAY['Delay animatsiya qancha davom etishini, Duration esa boshlanishigacha kutishni bildiradi','Delay ishga tushgandan keyingi kutish vaqtini, Duration effekt bajarilish vaqtini bildiradi','Delay effekt boshlanishidan oldingi kutish, Duration effektning davom etish vaqtini bildiradi','Delay va Duration ikkalasi ham slayd almashishining avtomatik vaqtini beradi']::text[],2,'Delay — animatsiya ishga tushishi oldidan kechikish; Duration — effektning o‘zi bajariladigan davomiylik. Ular alohida boshqariladi; slaydlararo Transitionning After parametri bilan ham aralashtirilmaydi.');
DO $guard$
DECLARE n int;
BEGIN
 IF (SELECT count(*) FROM task432_release)<>6 THEN RAISE EXCEPTION 'TASK432_SCOPE_NOT_SIX'; END IF;
 IF EXISTS (SELECT 1 FROM task432_release m WHERE array_length(m.opts,1)<>4 OR
    (SELECT count(distinct btrim(t)) FROM unnest(m.opts) t)<>4 OR
    m.correct_idx NOT BETWEEN 0 AND 3 OR length(btrim(m.explanation))<75 OR length(m.stem)<55)
 THEN RAISE EXCEPTION 'TASK432_BAD_OPTIONS_OR_EXPLANATION'; END IF;
 SELECT count(*) INTO n FROM task432_release m
 JOIN attest_ingest.telegram_informatika_pdf_question_candidates s ON s.source_file_id=m.source_id AND s.source_question_no=m.source_no
 JOIN public.constructs c ON c.code=m.construct_code AND c.is_active AND c.group_code IN ('S2.OFFICE')
 JOIN public.lesson_constructs lc ON lc.construct_id=c.id AND lc.lesson_id=m.lesson_id
 JOIN public.lessons l ON l.id=m.lesson_id AND l.status='published'::public.content_status
 WHERE s.source_page_number IS NOT NULL AND s.source_visually_checked AND s.answer_key IS NULL;
 IF n<>6 THEN RAISE EXCEPTION 'TASK432_SOURCE_LESSON_DRIFT_%',n; END IF;
 IF EXISTS(SELECT 1 FROM task432_release m JOIN public.questions q ON q.source_reference=
    'task432:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text)
 THEN RAISE EXCEPTION 'TASK432_ALREADY_EXISTS'; END IF;
 IF EXISTS(SELECT 1 FROM task432_release m JOIN public.questions q ON lower(regexp_replace(q.stem_md,'[[:space:]]+','','g'))=lower(regexp_replace(m.stem,'[[:space:]]+','','g')) AND q.status IN('review','published'))
 THEN RAISE EXCEPTION 'TASK432_DUPLICATE_STEM'; END IF;
END $guard$;
INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT m.question_id,c.subject_id,c.id,c.group_code,'Y1'::public.question_format,m.cognitive::public.cognitive_level,3,m.stem,'[]'::jsonb,true,'review'::public.content_status,NULL,
 'task432:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text,m.lesson_id
FROM task432_release m JOIN public.constructs c ON c.code=m.construct_code;
INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),m.question_id,'a',ord-1,m.opts[ord]
FROM task432_release m CROSS JOIN LATERAL generate_subscripts(m.opts,1) ord;
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT m.question_id,jsonb_build_object('correct_option_id',o.id::text),m.explanation
FROM task432_release m JOIN public.question_options o ON o.question_id=m.question_id AND o.order_idx=m.correct_idx;
DO $quality$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task432_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='review' AND q.is_generated=true AND q.format='Y1'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
 AND (SELECT count(DISTINCT btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=q.id)=4
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')=1
 AND NOT EXISTS (SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=q.id AND f.resolved_at IS NULL AND f.severity IN ('high','critical'));
 IF n<>6 THEN RAISE EXCEPTION 'TASK432_RELEASE_QA_FAILED_%',n; END IF;
END $quality$;
-- Owner-delegated AI editorial publication, no fabricated human editorial signature.
UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
FROM task432_release m WHERE q.id=m.question_id AND q.status='review'::public.content_status;
UPDATE public.question_quality_published_revisions r SET
 release_scope='TASK-432 (2026-10-22): user-authorized AI-assisted PDF-derived NEW Y1 questions; independently evaluated options; no human expert signature'
FROM task432_release m WHERE r.question_id=m.question_id;
DO $post$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task432_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_quality_published_revisions r ON r.question_id=q.id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='published' AND q.is_generated=true AND q.source_lesson_id=m.lesson_id
 AND r.content_fingerprint=public.professional_question_fingerprint(q.id)
 AND r.release_scope LIKE 'TASK-432%'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id)=4;
 IF n<>6 THEN RAISE EXCEPTION 'TASK432_POSTFLIGHT_%_OF_6',n; END IF;
 IF EXISTS (SELECT 1 FROM task432_release m JOIN public.question_editorial_checks e ON e.question_id=m.question_id)
 THEN RAISE EXCEPTION 'TASK432_FALSE_HUMAN_ATTESTATION'; END IF;
END $post$;
COMMIT;

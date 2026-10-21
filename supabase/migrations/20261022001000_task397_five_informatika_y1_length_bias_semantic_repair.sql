-- TASK-397 source-preserving five Y1 Informatika quality revisions.
BEGIN;
SET LOCAL lock_timeout='12s'; SET LOCAL statement_timeout='120s';
CREATE TEMP TABLE manifest397 (ref text PRIMARY KEY, stem text, a text,b text,c text,d text, correct_idx integer, explanation text) ON COMMIT DROP;
INSERT INTO manifest397 VALUES ('ARS-01-023','Sensordan olingan ma’lumot ikkilik kodda saqlanib, dastur orqali qayta ishlanadi. Ushbu ishlash usuli qaysi texnologiya turiga xos?','Analog texnologiya','Mexanik texnologiya','Raqamli texnologiya','Gibrid texnologiya',2,'Raqamli texnologiyalar diskret sonli kodda axborotni ifodalaydi va qayta ishlaydi. Analog usulda signal uzluksiz, gibrid tizimda esa ikkala texnologiya aralash kelishi mumkin.'),
('ARS-01-027','Harorat datchigi sonli qiymat yubordi; o‘lchov me’yor bilan solishtirib talqin qilindi; yakunda sovitish bo‘yicha asosli qaror ishlab chiqildi. Xom qiymatdan bilimga o‘tish qaysi tartibda kechdi?','Bilim → ma’lumot → axborot zanjiri','Axborot → ma’lumot → bilim zanjiri','Ma’lumot → axborot → bilim zanjiri','Ma’lumot → bilim → axborot zanjiri',2,'Xom qiymat ma’lumot hisoblanadi. U vaziyatga bog‘lab talqin qilinganda axborot, undan asoslangan qaror va umumlashgan tushuncha olinganda bilim shakllanadi.'),
('ARS-01-028','Ekspert tizimida soha faktlari va «agar … unda …» qoidalari xulosa chiqarishda ishlatilishi uchun tartibli saqlanadi. Tizimning bu tarkibiy qismi nima deb ataladi?','Ma’lumotlar bazasi','Xulosalash mexanizmi','Foydalanuvchi interfeysi','Bilimlar bazasi',3,'Bilimlar bazasi — ekspert tizimidagi fakt va qoidalar to‘plami. Xulosalash mexanizmi esa mavjud bilimlar asosida xulosa chiqaradi; interfeys foydalanuvchi bilan ishlashni ta’minlaydi.'),
('ARS-01-035','Do‘kon terminali shtrix-kodni o‘qidi, dastur mahsulot narxini hisoblab chiqdi va ekran natijani ko‘rsatdi. Kompyuter faoliyatining qaysi umumiy modeli aks etgan?','Saqlash–qidirish–tiklash ish modeli','Kiritish–kodlash–saqlash ish modeli','Kiritish–qayta ishlash–chiqarish modeli','Uzatish–qabul qilish–tasdiqlash ish modeli',2,'Shtrix-kodni o‘qish — kiritish, narxni hisoblash — qayta ishlash, ekranda natijani ko‘rsatish — chiqarish. Demak, kiritish–qayta ishlash–chiqarish modeli.'),
('ARS-01-039','Mikrofon qabul qilgan tovush uzluksiz signal, kompyuter xotirasidagi shu tovushning namunalari esa diskret qiymatlardir. Bu taqqoslash axborotning qaysi ikki ifodalanish turiga oid?','Matnli va grafikli axborot','Ovozli va tasvirli axborot','Analog va raqamli axborot','Ochiq va maxfiy axborot',2,'Uzluksiz signal analog axborotni, raqamli qurilmadagi diskret namunalar esa raqamli axborotni ifodalaydi.');
CREATE TEMP TABLE selected397 ON COMMIT DROP AS
 SELECT q.id old_id, gen_random_uuid() new_id, manifest397.*
 FROM public.questions q JOIN manifest397 ON manifest397.ref=q.source_reference
 WHERE q.status='published'::public.content_status
   AND q.format='Y1'::public.question_format AND q.group_code='S1.INFO'
   AND EXISTS(SELECT 1 FROM public.question_quality_published_revisions s WHERE s.question_id=q.id
     AND s.content_fingerprint=public.professional_question_fingerprint(q.id))
   AND EXISTS(SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=q.id
     AND f.finding_code='y1_answer_length_high_risk' AND f.resolved_at IS NULL)
   AND NOT EXISTS(SELECT 1 FROM public.question_bank_revisions b WHERE b.source_question_id=q.id);
SELECT q.id FROM public.questions q JOIN selected397 m ON m.old_id=q.id FOR UPDATE OF q;
DO $check$ DECLARE cnt integer; bad integer; BEGIN
 SELECT count(*) INTO cnt FROM selected397;
 IF cnt<>5 THEN RAISE EXCEPTION 'TASK-397 source drift: %/5',cnt;END IF;
 SELECT count(*) INTO bad FROM selected397 m
 JOIN public.question_keys k ON k.question_id=m.old_id
 JOIN public.question_options o ON o.question_id=m.old_id AND o.id::text=k.payload->>'correct_option_id'
 WHERE o.order_idx<>m.correct_idx OR o.content_md IS DISTINCT FROM
  CASE m.correct_idx WHEN 0 THEN m.a WHEN 1 THEN m.b WHEN 2 THEN m.c WHEN 3 THEN m.d END;
 IF bad<>0 THEN RAISE EXCEPTION 'TASK-397 original answer text mismatch: %',bad;END IF;
END; $check$;

INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,
 stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT m.new_id,q.subject_id,q.construct_id,q.group_code,q.format,q.cognitive,q.difficulty,
 m.stem,q.assets,true,'review'::public.content_status,q.author_id,
 'revision:TASK-397:AI-informatika:'||q.id::text||' | source:'||m.ref,
 q.source_lesson_id
FROM selected397 m JOIN public.questions q ON q.id=m.old_id;

INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),m.new_id,'a',p.i,p.body
FROM selected397 m CROSS JOIN LATERAL
 (VALUES(0,m.a),(1,m.b),(2,m.c),(3,m.d)) p(i,body);

INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT m.new_id,
 jsonb_set(k.payload,'{correct_option_id}',to_jsonb(new_correct.id::text),false),
 m.explanation
FROM selected397 m JOIN public.question_keys k ON k.question_id=m.old_id
 JOIN public.question_options new_correct ON new_correct.question_id=m.new_id
  AND new_correct.order_idx=m.correct_idx AND new_correct.side='a';

DO $check$ DECLARE invalid integer;BEGIN
 SELECT count(*) INTO invalid FROM selected397 m
 JOIN public.question_keys k ON k.question_id=m.new_id
 WHERE
   (SELECT count(*) FROM question_options o WHERE o.question_id=m.new_id)<>4
   OR (SELECT count(distinct btrim(o.content_md)) FROM question_options o WHERE o.question_id=m.new_id)<>4
   OR NOT EXISTS(SELECT 1 FROM question_options o WHERE o.question_id=m.new_id
     AND o.id::text=k.payload->>'correct_option_id')
   OR (SELECT max(w) FROM (SELECT array_length(regexp_split_to_array(btrim(content_md),'[[:space:]]+'),1) w
       FROM question_options WHERE question_id=m.new_id) v)>
       1.8*(SELECT min(w) FROM(SELECT array_length(regexp_split_to_array(btrim(content_md),'[[:space:]]+'),1) w
        FROM question_options WHERE question_id=m.new_id) vv);
 IF invalid<>0 THEN RAISE EXCEPTION 'TASK-397 balanced option preflight failed: %',invalid;END IF;
END; $check$;

INSERT INTO public.question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
SELECT m.old_id,m.new_id,'owner_ai_info_y1_answer_length_repair',
 jsonb_build_object('task','TASK-397','AI_authored_new_stem_options',true,
  'original_key_text_preserved',true,'owner_AI_authorization_20261021',true,
  'historical_exam_answers_unchanged',true,'independent_human_certified',false,
  'source',m.ref)
FROM selected397 m;
UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
FROM selected397 m WHERE q.id=m.new_id AND q.status='review'::public.content_status;
UPDATE public.questions q SET status='archived'::public.content_status,updated_at=now()
FROM selected397 m WHERE q.id=m.old_id AND q.status='published'::public.content_status;
UPDATE public.question_quality_published_revisions s
SET release_scope='TASK-397 five AI-reviewed Informatika Y1 balance repairs; not human certified'
FROM selected397 m WHERE s.question_id=m.new_id;
UPDATE public.question_quality_findings f SET resolved_at=now(),
 details=f.details||jsonb_build_object('task','TASK-397','new_id',m.new_id,
  'answer_text_unchanged',true,'AI_distractor_reviewed',true)
FROM selected397 m WHERE f.question_id=m.old_id AND
 f.finding_code IN ('y1_answer_length_high_risk','y1_correct_answer_strictly_longest');

DO $check$ DECLARE invalid integer;BEGIN
 SELECT count(*) INTO invalid FROM selected397 m
 JOIN public.questions q ON q.id=m.new_id JOIN public.questions oldq ON oldq.id=m.old_id
 LEFT JOIN public.question_quality_published_revisions s ON s.question_id=q.id
 WHERE q.status<>'published'::public.content_status
   OR oldq.status<>'archived'::public.content_status
   OR s.content_fingerprint IS DISTINCT FROM public.professional_question_fingerprint(q.id)
   OR NOT public.is_question_official_mock_eligible(q.id)
   OR NOT public.group_mock_eligible(q.id);
 IF invalid<>0 THEN RAISE EXCEPTION 'TASK-397 postflight failed on % items',invalid;END IF;
END; $check$;
COMMIT;
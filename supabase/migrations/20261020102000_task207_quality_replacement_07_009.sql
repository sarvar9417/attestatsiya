-- TASK-207: replace wording-defective published ALG-07-009 with a new independently computable draft candidate.
-- No UPDATE to published stem/options or answer key. Original attempts remain valid.
BEGIN;
DO $$
DECLARE qid uuid;sid uuid;cid uuid;lid uuid;opt uuid;idx int;txt text;items text[]:=ARRAY[
 '(0, 4)','(1, 3)','(1, 4)','(0, 3)'
];
BEGIN
IF NOT EXISTS(SELECT 1 FROM public.questions WHERE source_reference='algoritmlash-v4:ALG-V4-025') THEN
SELECT id INTO sid FROM public.subjects WHERE code='informatika';
SELECT id INTO cid FROM public.constructs WHERE code='S3.ALGO.03';
SELECT id INTO lid FROM public.lessons WHERE slug='algoritmlash-v2-07';
IF sid IS NULL OR cid IS NULL OR lid IS NULL THEN RAISE EXCEPTION 'Missing construct/lesson'; END IF;
qid:=gen_random_uuid();
INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,assets,is_generated,status,source_reference,source_lesson_id)
VALUES(qid,sid,cid,'S3.ALGO','Y1','qollash',4,
'Quyidagi algoritm har bir kiritilgan manfiy bo‘lmagan butun N sonining o‘nlik raqamlari sonini hisoblaydi: K:=0; REPEAT K:=K+1; N:=N DIV 10 UNTIL N=0; CHIQAR K. N=0 va N=1000 uchun chiqarilgan K qiymatlari qaysi juftlik?',
'[]'::jsonb,true,'review','algoritmlash-v4:ALG-V4-025',lid);
FOR idx IN 1..4 LOOP
txt:=items[idx];opt:=gen_random_uuid();
INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)VALUES(opt,qid,'a',idx-1,txt);
IF idx=3 THEN
 INSERT INTO public.question_keys(question_id,payload,explanation_md)
 VALUES(qid,jsonb_build_object('correct_option_id',opt::text),
 'REPEAT–UNTIL sharti tanadan so‘ng tekshiriladi. N=0 da K bir marta oshib 1 bo‘ladi; N=1000 uchun 1000→100→10→1→0, jami 4 takrorlash. Manba: 9-sinf ICT sikl mavzusi, PDF 41–45; Test.pdf PDF 53–63 dagi dastur izi savollari uslubi. Original topshiriq.');
END IF;
END LOOP;
INSERT INTO public.algoritmlash_style_audit(question_id,source_reference,content_fingerprint,status_at_audit,format_at_audit,style_category,priority,findings,source_evidence)
VALUES(qid,'algoritmlash-v4:ALG-V4-025',md5('algoritmlash-v4:ALG-V4-025|1,4'),'review','Y1','repeat_until_trace','routine','[]'::jsonb,
jsonb_build_object('replaces_source_style','algoritmlash-v2:ALG-07-009','improvement','Ning raqamlar -> explicit 0 and 1000 trace','source','9-sinf PDF41–45; Test.pdf PDF53–63'));
END IF;
END $$;
UPDATE public.algoritmlash_style_audit
SET source_evidence=source_evidence||jsonb_build_object('recommended_reviewed_replacement','algoritmlash-v4:ALG-V4-025')
WHERE source_reference='algoritmlash-v2:ALG-07-009' AND priority='high';
DO $$ BEGIN IF (SELECT count(*) FROM public.questions WHERE source_reference LIKE 'algoritmlash-v4:ALG-V4-%')<>25
THEN RAISE EXCEPTION '25 questions expected'; END IF; END $$;
COMMIT;
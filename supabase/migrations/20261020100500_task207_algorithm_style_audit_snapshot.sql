-- TASK-207: immutable audit snapshot of pre-existing V2+V3 questions; no published row mutation.
BEGIN;
CREATE TABLE IF NOT EXISTS public.algoritmlash_style_audit (
  question_id uuid PRIMARY KEY REFERENCES public.questions(id) ON DELETE CASCADE,
  source_reference text NOT NULL UNIQUE,
  audit_version text NOT NULL DEFAULT 'TASK-207-2026-10',
  content_fingerprint text NOT NULL,
  status_at_audit text NOT NULL,
  format_at_audit text NOT NULL,
  style_category text NOT NULL,
  priority text NOT NULL,
  findings jsonb NOT NULL DEFAULT '[]'::jsonb,
  source_evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  audited_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.algoritmlash_style_audit ENABLE ROW LEVEL SECURITY;
WITH scanned AS (
 SELECT q.id, q.source_reference,q.status,q.format,q.stem_md,q.construct_id,
 k.payload,k.explanation_md,
 (SELECT string_agg(o.content_md,' | ' ORDER BY o.side,o.order_idx) FROM public.question_options o WHERE o.question_id=q.id) AS all_options,
 (SELECT count(*) FILTER (WHERE o.content_md ~* '(doimo|har doim|albatta|faqat|mutlaqo|avtomatik)') FROM public.question_options o WHERE o.question_id=q.id) AS absolute_decoys
 FROM public.questions q LEFT JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'algoritmlash-v2:%' OR q.source_reference LIKE 'algoritmlash-v3:%'
), enriched AS (
 SELECT s.*,
 CASE
 WHEN EXISTS(SELECT 1 FROM public.questions z WHERE z.id<>s.id AND z.group_code='S3.ALGO' AND z.format='Y1'
   AND s.format='Y1' AND lower(btrim(z.stem_md))=lower(btrim(s.stem_md))) THEN true ELSE false END AS exact_duplicate,
 CASE WHEN s.stem_md ~* '^(Ning raqamlar|Moslang\\.?$)' THEN true ELSE false END AS wording_candidate,
 CASE WHEN s.stem_md ~* '(Qaysi|nimani|nima\\?|qanday)' AND length(s.stem_md)<105
   AND s.stem_md !~* '[0-9][[:space:]]*([:=+*/]|mod)' THEN true ELSE false END AS recall_candidate
 FROM scanned s
)
INSERT INTO public.algoritmlash_style_audit(question_id,source_reference,content_fingerprint,status_at_audit,format_at_audit,style_category,priority,findings,source_evidence)
SELECT id,source_reference,md5(coalesce(stem_md,'')||coalesce(all_options,'')||coalesce(payload::text,'')||coalesce(explanation_md,'')),
 status::text,format::text,
 CASE
   WHEN format='Y2' THEN 'moslashtirish'
   WHEN format='Y3' THEN 'ketma-ketlik'
   WHEN stem_md ~* '(FOR |WHILE |REPEAT | UNTIL |mod |EKUB|:=|\\[[0-9, ]+\\])' THEN 'algoritm_ijro_izi'
   WHEN stem_md ~* '(blok-sxema|sxema|graf|chizma)' THEN 'grafik_sxema'
   WHEN recall_candidate THEN 'ta_rif_farqlash'
   ELSE 'mantiqiy_vaziyat' END,
 CASE WHEN exact_duplicate OR stem_md LIKE 'Ning raqamlar%' THEN 'high'
      WHEN recall_candidate OR absolute_decoys>=2 OR wording_candidate THEN 'medium'
      ELSE 'routine' END,
 to_jsonb(array_remove(ARRAY[
 CASE WHEN exact_duplicate THEN 'takroriy_y1_stem_tekshirish' END,
 CASE WHEN stem_md LIKE 'Ning raqamlar%' THEN 'noaniq_boshlanish' END,
 CASE WHEN format='Y2' AND btrim(stem_md)='Moslang.' THEN 'moslik_matnini_ko_rsatuvchi_ui_tekshirish' END,
 CASE WHEN recall_candidate THEN 'oddiy_ta_rif_savolini_scenariyga_yaqinlashtirish' END,
 CASE WHEN absolute_decoys>=2 THEN 'sun_iy_inkor_variantlarini_tahrirga_olish' END,
 CASE WHEN status='draft' THEN 'grafik_bilan_nashr_qilinishini_tekshirish' END
 ]::text[],NULL)),
 jsonb_build_object('spec','Informatika Testlar spesifikatsiyasi.pdf PDF 4: 4 kompetensiya, 3 savol',
 'style_sources',jsonb_build_array('Demo 2026 test 10 000 so‘mlik.pdf PDF 6 Q12','20000 LIK informatika.pdf PDF 6 Q13-Q14','Informatika Demo testi .pdf PDF 18 Q35'),
 'method','Dasturiy strukturaviy audit va manba uslublari solishtiruvi. Har bir savolning matematik kaliti mustaqil ekspertdan o‘tdi degani emas.'),
 now()
FROM enriched
ON CONFLICT(question_id) DO NOTHING;
DO $$ BEGIN
 IF (SELECT count(*) FROM public.algoritmlash_style_audit a WHERE a.source_reference LIKE 'algoritmlash-v2:%' OR a.source_reference LIKE 'algoritmlash-v3:%')<>288
 THEN RAISE EXCEPTION 'TASK-207 expected 288 historic V2/V3 audits'; END IF;
 IF EXISTS(SELECT 1 FROM public.algoritmlash_style_audit a JOIN public.questions q ON q.id=a.question_id WHERE a.status_at_audit='published' AND q.status<>'published')
 THEN RAISE EXCEPTION 'A published item changed status while auditing'; END IF;
END $$;
COMMIT;
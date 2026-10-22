-- TASK-429 (2026-10-22): pedagogika Y1 savollarida javobni ko‘rsatib qo‘yadigan signallarni aniqlash.
-- Applied to remote production as migration version 20261022032353.
-- Existing published questions/keys/attempts are immutable and untouched.
-- This is a *heuristic* AI-assisted gate, not independent human editorial approval.
-- Reports: answer_definition_only, answer_stem_echo_strong,
-- distractor_absolute_pair (hard block), answer_stem_echo_imbalance (review flag).
-- Do NOT grant access to the checker: it reads private question_keys.

CREATE OR REPLACE FUNCTION public.pedagogy_semantic_quality_signals(p_question_id uuid)
 RETURNS TABLE(finding_code text, severity text, details jsonb)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
WITH per_option AS (
 SELECT q.id,
        (o.id::text = k.payload->>'correct_option_id') AS is_correct,
        (o.content_md ~ '[[:space:]][—–][[:space:]]') AS has_spaced_definition,
        (o.content_md ~* '(^|[^[:alpha:]])(faqat|hech|doimo|mutlaqo|butunlay|hamisha|aslo)([^[:alpha:]]|$)') AS is_absolute,
        (SELECT count(DISTINCT word)::int
          FROM pg_catalog.regexp_split_to_table(pg_catalog.lower(o.content_md),'[^[:alnum:]]+') AS word
          WHERE pg_catalog.length(word)>=5
            AND word NOT IN ('uchun','bilan','hamda','orqali','qaysi','oquvchi','oqituvchi','pedagog','javob','darsda','darsning','sinfda','faqat','asosida','berish','qilish','mazkur','tanlash','bolgan','tarbiya','metodi','oquvchilar','natijani','usulini')
            AND pg_catalog.strpos(pg_catalog.lower(q.stem_md),word)>0
        ) AS important_overlap
 FROM public.questions q
 JOIN public.question_keys k ON k.question_id=q.id
 JOIN public.question_options o ON o.question_id=q.id AND o.side='a'
 WHERE q.id=p_question_id AND q.format='Y1'::public.question_format
   AND q.group_code IN ('KS','PM.GEN','PM.MET')
), measures AS (
 SELECT count(*)::int AS option_count,
        count(*) FILTER(WHERE is_correct)::int AS correct_count,
        count(*) FILTER(WHERE is_correct AND has_spaced_definition)::int AS correct_definition,
        count(*) FILTER(WHERE NOT is_correct AND has_spaced_definition)::int AS wrong_definition,
        count(*) FILTER(WHERE NOT is_correct AND is_absolute)::int AS wrong_absolute,
        count(*) FILTER(WHERE is_correct AND is_absolute)::int AS correct_absolute,
        coalesce(max(important_overlap) FILTER(WHERE is_correct),0)::int AS correct_overlap,
        coalesce(max(important_overlap) FILTER(WHERE NOT is_correct),0)::int AS wrong_max_overlap
 FROM per_option
), qualified AS (
 SELECT m.*,public.professional_question_fingerprint(p_question_id) AS fingerprint
 FROM measures m WHERE m.option_count=4 AND m.correct_count=1
)
SELECT 'answer_definition_only'::text, 'high'::text,
       jsonb_build_object('method','heuristic','fingerprint',fingerprint,'reviewed_by_human',false)
FROM qualified WHERE correct_definition=1 AND wrong_definition=0
UNION ALL
SELECT 'answer_stem_echo_strong', 'high',
       jsonb_build_object('method','heuristic','correct_overlap',correct_overlap,'wrong_max_overlap',wrong_max_overlap,'fingerprint',fingerprint,'reviewed_by_human',false)
FROM qualified WHERE correct_overlap>=3 AND wrong_max_overlap=0
UNION ALL
SELECT 'distractor_absolute_pair', 'high',
       jsonb_build_object('method','heuristic','wrong_absolute',wrong_absolute,'correct_absolute',correct_absolute,'fingerprint',fingerprint,'reviewed_by_human',false)
FROM qualified WHERE wrong_absolute>=2 AND correct_absolute=0
UNION ALL
SELECT 'answer_stem_echo_imbalance', 'medium',
       jsonb_build_object('method','heuristic','correct_overlap',correct_overlap,'wrong_max_overlap',wrong_max_overlap,'fingerprint',fingerprint,'reviewed_by_human',false)
FROM qualified WHERE correct_overlap>=2 AND correct_overlap-wrong_max_overlap>=2
AND NOT (correct_overlap>=3 AND wrong_max_overlap=0);
$function$;


CREATE OR REPLACE FUNCTION public.guard_pedagogy_semantic_quality_publish()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE v_code text;
BEGIN
 IF NEW.status <> 'published'::public.content_status
    OR NEW.format <> 'Y1'::public.question_format
    OR NEW.group_code NOT IN ('KS','PM.GEN','PM.MET')
 THEN RETURN NEW; END IF;
 IF TG_OP='UPDATE' AND OLD.status='published'::public.content_status
 THEN RETURN NEW; END IF;

 SELECT s.finding_code INTO v_code
 FROM public.pedagogy_semantic_quality_signals(NEW.id) AS s
 WHERE s.severity='high'
 ORDER BY s.finding_code LIMIT 1;

 IF v_code IS NOT NULL THEN
  RAISE EXCEPTION USING ERRCODE='23514',
   MESSAGE='PEDAGOGY_SEMANTIC_CUE_REVIEW_REQUIRED: '||v_code,
   DETAIL='Edit draft/review option wording; an owner waiver alone does not bypass the semantic cue gate.';
 END IF;
 RETURN NEW;
END;
$function$;


CREATE OR REPLACE FUNCTION public.record_pedagogy_semantic_quality_review()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
 IF NEW.status IN ('review'::public.content_status,'published'::public.content_status)
    AND (TG_OP='INSERT' OR OLD.status IS DISTINCT FROM NEW.status)
    AND NEW.format='Y1'::public.question_format
    AND NEW.group_code IN ('KS','PM.GEN','PM.MET')
 THEN
  INSERT INTO public.question_quality_findings(question_id,finding_code,severity,details,detected_at)
  SELECT NEW.id,s.finding_code,s.severity,s.details,now()
  FROM public.pedagogy_semantic_quality_signals(NEW.id) AS s
  ON CONFLICT (question_id,finding_code) DO NOTHING;
 END IF;
 RETURN NEW;
END;
$function$;


REVOKE ALL ON FUNCTION public.pedagogy_semantic_quality_signals(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.guard_pedagogy_semantic_quality_publish() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_pedagogy_semantic_quality_review() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS pedagogy_semantic_quality_publish_guard ON public.questions;
CREATE TRIGGER pedagogy_semantic_quality_publish_guard
BEFORE INSERT OR UPDATE OF status ON public.questions
FOR EACH ROW EXECUTE FUNCTION public.guard_pedagogy_semantic_quality_publish();

DROP TRIGGER IF EXISTS pedagogy_semantic_review_findings ON public.questions;
CREATE TRIGGER pedagogy_semantic_review_findings
AFTER INSERT OR UPDATE OF status ON public.questions
FOR EACH ROW EXECUTE FUNCTION public.record_pedagogy_semantic_quality_review();

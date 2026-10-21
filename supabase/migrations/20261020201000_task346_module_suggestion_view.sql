-- TASK-346 continuation: source-stem-only, single-hit module triage.
-- Does not alter canonical module_hint or any learner question.
CREATE OR REPLACE VIEW attest_ingest.telegram_informatika_module_suggestions
WITH (security_invoker = true) AS
WITH review AS (
 SELECT candidate_id, source_message_id,
        regexp_replace(question_text,'https?://[^[:space:]]+','','g') AS q
 FROM attest_ingest.telegram_informatika_polls
 WHERE module_hint='REVIEW' AND length(question_text)>=15
), hit AS (
 SELECT r.candidate_id,r.source_message_id,x.mod
 FROM review r CROSS JOIN LATERAL (VALUES
 ('M01', r.q ~* '(^|[^[:alpha:]])(informatika|axborot|bayt|bit|kodlash)([^[:alpha:]]|$)'),
 ('M02', r.q ~* '(kernel|bios|protsessor|hardware|software|fayl nomi|operatsion sistem|operatsion tizim)'),
 ('M03', r.q ~* '(taqdimot|slayd|hujjat bosh|hujjat oxir|shrift|katakcha|diapazon|excel|power.point|ms.word)'),
 ('M04', r.q ~* '(mantiq|implikatsiya|kon.yunksiya|diz.yunksiya|(^|[^[:alpha:]])ROST([^[:alpha:]]|$)|(^|[^[:alpha:]])YOLG.ON([^[:alpha:]]|$))'),
 ('M05', r.q ~* '(sanoq sistem|ikkilik sanoq|o.nlik sanoq|asosli sanoq|[0-9]+ likdagi)'),
 ('M06', r.q ~* '(algoritm|psevdokod|blok.sxema)'),
 ('M07', r.q ~* '(sprayt|scratch|toshbaqa grafik)'),
 ('M08', r.q ~* '(print\s*\(|python|javascript|console.log)'),
 ('M09', r.q ~* '(ma.lumotlar ombori|ma.lumotlar bazasi|relatsion|ms access)'),
 ('M10', r.q ~* '(piksel|rastr|vektor|photoshop|fotoshop|rgb|cmyk|3d panorama)'),
 ('M11', r.q ~* '(html|css|veb.sahifa|veb-sayt|gipermurojaat|giperhavola|veb.hujjat|teglar)'),
 ('M12', r.q ~* '(domen|dns|ip.manzil|subnet|tarmoq topolog|router|wifi|wi.fi|tcp/ip|mac.manzil|protokol)'),
 ('M13', r.q ~* '(antivirus|phishing|xavfsizlik|xaker|shifrlash)'),
 ('M14', r.q ~* '(kasbiy standart|kasb standart)'),
 ('M15', r.q ~* '(pedagog|didaktika|tarbiya|o.quvchi|o.qituvchi)'),
 ('M16', r.q ~* '(o.qitish metodikasi)')
 ) x(mod,matches)
 WHERE x.matches
)
SELECT candidate_id,source_message_id,max(mod) AS suggested_module_code,
       'exclusive_stem_pattern_review_only'::text AS evidence_method,
       false::boolean AS human_approved
FROM hit GROUP BY candidate_id,source_message_id HAVING count(*)=1;
REVOKE ALL ON attest_ingest.telegram_informatika_module_suggestions FROM PUBLIC, anon, authenticated;
COMMENT ON VIEW attest_ingest.telegram_informatika_module_suggestions IS
 'Read-only triage suggestion; exact-one keyword family. Must be independently reviewed before canonical mapping.';
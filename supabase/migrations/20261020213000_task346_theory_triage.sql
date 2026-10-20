-- TASK-346: classify the prior 580 "theory" candidates without changing or publishing their source text.
-- This is a private, read-only QA view, not an editorial approval process.
CREATE OR REPLACE VIEW attest_ingest.telegram_informatika_theory_triage
WITH (security_invoker = true) AS
WITH normalized AS (
 SELECT source_message_id,module_hint,review_priority,
        md5(lower(regexp_replace(btrim(source_text), '[[:space:]]+', ' ', 'g'))) AS content_fingerprint,
        source_text
 FROM attest_ingest.telegram_informatika_theory_candidates
), classified AS (
 SELECT *,
    CASE
      WHEN source_text ~* '^[[:space:]]*🎲'
         OR source_text ~* 'get ready for the quiz'
         OR source_text ~* 'testiga tayyorlaning'
         OR source_text ~* 'test kamida 2 kishi'
      THEN 'quiz_announcement'
      WHEN source_text ~* '^[[:space:]]*🏁'
         OR source_text ~* 'has finished'
         OR source_text ~* 'testi yakunlandi'
         OR source_text ~* 'quiz.*finished'
      THEN 'quiz_leaderboard'
      WHEN source_text ~* 'kompyuter va it sohasiga doir testlar bilan'
         OR source_text ~* 'dars ishlanmalari.*bor'
         OR source_text ~* 'murojaat uchun|kursimizga|buyurtma ber|sotiladi|reklama|obuna bo.ling'
      THEN 'promotional_or_organizational'
      WHEN (source_text ~* '(https?://|t\.me/|@[[:alnum:]_]{4,})')
           AND (source_text ~* '(kanal|guruh|o.ting|dars|video)')
           AND length(source_text)<480
      THEN 'link_or_channel_notice'
      WHEN position('?' in source_text)>0
           AND source_text !~* '(ta.riflan|anglatadi|tushuniladi|hisoblanadi)'
      THEN 'possible_question_not_theory'
      WHEN length(btrim(source_text))>=160
           AND source_text ~* '(algoritm|protsessor|operatsion|bit|bayt|ma.lumot|python|scratch|excel|internet|tarmoq|pedagog|o.quvchi|o.qituvchi|xavfsiz|mantiq|dastur|sanoq|axborot|kompyuter|metod|didaktik|grafik|html|sql|kodlash)'
      THEN 'substantive_candidate_manual_review'
      ELSE 'general_discussion_or_other'
    END AS classification
 FROM normalized
), numbered AS (
 SELECT *,
 row_number() OVER(PARTITION BY content_fingerprint ORDER BY source_message_id) AS duplicate_occurrence,
 min(source_message_id) OVER(PARTITION BY content_fingerprint) AS first_occurrence_source_message_id
 FROM classified
)
SELECT source_message_id,module_hint,review_priority,classification,
       content_fingerprint,duplicate_occurrence,
       first_occurrence_source_message_id,
       false::boolean AS editorial_approved,
       false::boolean AS learner_publish_ready
FROM numbered;
REVOKE ALL ON attest_ingest.telegram_informatika_theory_triage FROM PUBLIC,anon,authenticated;
COMMENT ON VIEW attest_ingest.telegram_informatika_theory_triage IS
'Heuristic non-destructive 580-item Telegram message triage + exact normalized content repeats. Substantive is only a drafting candidate and never a published lesson.';
-- TASK 2026-10-21: READ ONLY production migration history fingerprint inventory.
-- This is NOT a migration. Never run as supabase db push.
-- Does not access question answer keys, overwrite migration history, or infer human approvals.
-- Run in the production project through an authenticated SQL console.

SELECT
  count(*) AS live_history_rows,
  count(DISTINCT version) AS distinct_versions,
  count(*) FILTER (WHERE statements IS NULL OR cardinality(statements)=0) AS no_saved_statements,
  count(*) FILTER (WHERE cardinality(statements)=1) AS single_saved_statement,
  count(*) FILTER (WHERE cardinality(statements)>1) AS multi_statement_history,
  count(*) FILTER (
    WHERE CASE WHEN length(version) = 14 AND translate(version, '0123456789', '') = '' THEN
      (substring(version,9,2)::int > 23
       OR substring(version,11,2)::int > 59
       OR substring(version,13,2)::int > 59)
    ELSE true END
  ) AS malformed_timestamp_like_versions
FROM supabase_migrations.schema_migrations;

-- Export the following metadata to a PRIVATE audit workspace; join it
-- to the GitHub migration manifest on (version,name) and Git blob SHA.
-- The digest is calculated over Git's exact "blob <octet-length>\0<raw SQL>".
-- A final newline variation is surfaced explicitly; never assume equivalence
-- for history rows with zero or multiple saved statements.
SELECT
    version,
    name,
    cardinality(statements) AS statement_count,
    CASE WHEN cardinality(statements) = 1 THEN
      encode(extensions.digest(
        convert_to('blob ' || octet_length(statements[1])::text, 'UTF8')
        || decode('00', 'hex')
        || convert_to(statements[1], 'UTF8'),
        'sha1'
      ), 'hex')
    END AS git_blob_sha1_of_stored_sql,
    CASE WHEN cardinality(statements) = 1 AND right(statements[1],1)=E'\n' THEN
      encode(extensions.digest(
        convert_to('blob ' || (octet_length(statements[1]) - 1)::text, 'UTF8')
        || decode('00', 'hex')
        || convert_to(left(statements[1], length(statements[1]) - 1), 'UTF8'),
        'sha1'
      ), 'hex')
    END AS git_blob_sha1_without_last_newline
FROM supabase_migrations.schema_migrations
ORDER BY version;

-- Collision inspection only. These are not instructions to update rows.
SELECT version, name, cardinality(statements) AS statement_count
FROM supabase_migrations.schema_migrations
WHERE name IN (
  'restore_m02_m05_source_lessons',
  'task200_balanced_pedagogy_review_batch',
  'task204_m06_algo_v2_rfc_uuid_rekey',
  'task240_graphics_web_v2_quarantine',
  'task207_algorithm_style_audit_snapshot',
  'task207_original_attest_style_examples',
  'task346_numeric_qa_staging',
  'task332_algo_v4_six_owner_waiver_publish',
  'task346_access_source_defects'
)
ORDER BY name;
 THEN
      (substring(version,9,2)::int > 23
       OR substring(version,11,2)::int > 59
       OR substring(version,13,2)::int > 59)
    ELSE true END
  ) AS malformed_timestamp_like_versions
FROM supabase_migrations.schema_migrations;

-- Export the following metadata to a PRIVATE audit workspace; join it
-- to the GitHub migration manifest on (version,name) and Git blob SHA.
-- The digest is calculated over Git's exact "blob <octet-length>\0<raw SQL>".
-- A final newline variation is surfaced explicitly; never assume equivalence
-- for history rows with zero or multiple saved statements.
SELECT
    version,
    name,
    cardinality(statements) AS statement_count,
    CASE WHEN cardinality(statements) = 1 THEN
      encode(extensions.digest(
        convert_to('blob ' || octet_length(statements[1])::text, 'UTF8')
        || decode('00', 'hex')
        || convert_to(statements[1], 'UTF8'),
        'sha1'
      ), 'hex')
    END AS git_blob_sha1_of_stored_sql,
    CASE WHEN cardinality(statements) = 1 AND right(statements[1],1)=E'\n' THEN
      encode(extensions.digest(
        convert_to('blob ' || (octet_length(statements[1]) - 1)::text, 'UTF8')
        || decode('00', 'hex')
        || convert_to(left(statements[1], length(statements[1]) - 1), 'UTF8'),
        'sha1'
      ), 'hex')
    END AS git_blob_sha1_without_last_newline
FROM supabase_migrations.schema_migrations
ORDER BY version;

-- Collision inspection only. These are not instructions to update rows.
SELECT version, name, cardinality(statements) AS statement_count
FROM supabase_migrations.schema_migrations
WHERE name IN (
  'restore_m02_m05_source_lessons',
  'task200_balanced_pedagogy_review_batch',
  'task204_m06_algo_v2_rfc_uuid_rekey',
  'task240_graphics_web_v2_quarantine',
  'task207_algorithm_style_audit_snapshot',
  'task207_original_attest_style_examples',
  'task346_numeric_qa_staging',
  'task332_algo_v4_six_owner_waiver_publish',
  'task346_access_source_defects'
)
ORDER BY name;

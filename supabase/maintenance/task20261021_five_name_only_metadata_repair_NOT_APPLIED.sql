-- 2026-10-21: GUARDED MIGRATION HISTORY NAME-ONLY REPAIR (NOT APPLIED)
-- IMPORTANT: This file is stored under supabase/maintenance, NOT supabase/migrations.
-- NEVER run via unrestricted "supabase db push".
-- The owner requested GitHub merge ONLY and NO production deploy at this stage.
-- Run later ONLY after authorized maintenance window, fresh backup, and SELECT preflight.
-- NO application DDL/DML, question changes, keys, statuses or user data alterations.
-- The five live statements have been independently verified to be byte-for-byte
-- identical to the corresponding GitHub migration files, including git blob SHA-1.

BEGIN;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '30s';

DO $guard$
DECLARE
  item record;
  n integer;
  corrected integer := 0;
  actual_git_sha text;
BEGIN
  FOR item IN
    SELECT * FROM (VALUES
      ('20261018131001','ktd_independent_publication_gate_20261018','ktd_independent_publication_gate','8976fd2b446c9cffe4fd1daa882a2a8822b0616b'),
      ('20261019020001','task212_m13_axr_owner_publication_20261019','task212_m13_axr_owner_publication','c1a3723b380a9132e78a97fd2dc0ac6e4869ea37'),
      ('20261019030000','task213_m13_native_y2_y3_140_20261019','task213_m13_native_y2_y3_140','5404ca115cd25890f96c6bec57dcc638950bb448'),
      ('20261019220000','official_mock_v3_diversity_task306_prereq','official_mock_v3_diversity','8a4843924351f4e2adb5b638aae0972fc4c42f17'),
      ('20261020093000','task306_m13_seven_native_y2_4x5_review_20261020','task306_m13_native_y2_4x5_review','2b5e70c5975bfd5af3402e00b1a0446c91cc1e03')
    ) AS v(version, old_name, new_name, expected_git_blob_sha)
  LOOP
    IF EXISTS (
      SELECT 1 FROM supabase_migrations.schema_migrations m
      WHERE m.name = item.new_name AND m.version <> item.version
    ) THEN
      RAISE EXCEPTION 'migration target name collision: %', item.new_name;
    END IF;

    SELECT count(*),
           max(encode(extensions.digest(
             convert_to('blob ' || octet_length(m.statements[1])::text, 'UTF8')
             || decode('00','hex')
             || convert_to(m.statements[1], 'UTF8'), 'sha1'), 'hex'))
      INTO n, actual_git_sha
    FROM supabase_migrations.schema_migrations m
    WHERE m.version = item.version
      AND m.name = item.old_name
      AND cardinality(m.statements) = 1;

    IF n <> 1 OR actual_git_sha IS DISTINCT FROM item.expected_git_blob_sha THEN
      RAISE EXCEPTION 'history drift; refusing metadata update for % / %, count=%',
        item.version, item.old_name, n;
    END IF;

    UPDATE supabase_migrations.schema_migrations AS m
       SET name = item.new_name
     WHERE m.version = item.version AND m.name = item.old_name;
    GET DIAGNOSTICS n = ROW_COUNT;
    IF n <> 1 THEN
      RAISE EXCEPTION 'expected exactly one metadata row for %', item.version;
    END IF;
    corrected := corrected + n;
  END LOOP;

  IF corrected <> 5 THEN
    RAISE EXCEPTION 'expected 5 history-name-only repairs, got %', corrected;
  END IF;
END
$guard$;

-- Verify exactly five canonical names before transaction commit.
DO $verify$
DECLARE n integer;
BEGIN
 SELECT count(*) INTO n FROM supabase_migrations.schema_migrations
 WHERE (version,name) IN (
   ('20261018131001','ktd_independent_publication_gate'),
   ('20261019020001','task212_m13_axr_owner_publication'),
   ('20261019030000','task213_m13_native_y2_y3_140'),
   ('20261019220000','official_mock_v3_diversity'),
   ('20261020093000','task306_m13_native_y2_4x5_review')
 );
 IF n <> 5 THEN RAISE EXCEPTION 'postflight failed: canonical name count=%',n; END IF;
END
$verify$;

COMMIT;

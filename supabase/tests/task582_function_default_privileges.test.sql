-- TASK-582: future functions are default-deny for client roles; explicit app
-- RPC grants already present in production remain available.
DO $task582_test$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_default_acl d
    JOIN pg_roles owner_role ON owner_role.oid = d.defaclrole
    LEFT JOIN pg_namespace n ON n.oid = d.defaclnamespace
    CROSS JOIN LATERAL aclexplode(d.defaclacl) a
    LEFT JOIN pg_roles grantee_role ON grantee_role.oid = a.grantee
    WHERE owner_role.rolname = 'postgres'
      AND d.defaclobjtype = 'f'
      AND (d.defaclnamespace = 0 OR n.nspname = 'public')
      AND a.privilege_type = 'EXECUTE'
      AND (a.grantee = 0 OR grantee_role.rolname IN ('anon', 'authenticated'))
  ) THEN
    RAISE EXCEPTION 'TASK582_TEST: client EXECUTE remains in function defaults';
  END IF;

  IF NOT has_function_privilege(
    'authenticated',
    'public.start_exam(public.exam_kind,uuid)',
    'EXECUTE'
  ) OR has_function_privilege(
    'anon',
    'public.start_exam(public.exam_kind,uuid)',
    'EXECUTE'
  ) THEN
    RAISE EXCEPTION 'TASK582_TEST: existing authenticated RPC contract drifted';
  END IF;

  RAISE NOTICE 'TASK582 PASS: future function client EXECUTE is explicit opt-in';
END;
$task582_test$;

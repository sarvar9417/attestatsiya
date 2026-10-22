-- TASK-582: prevent future PostgreSQL functions from inheriting accidental
-- client EXECUTE privileges. Existing app RPC grants are intentionally left
-- unchanged; future RPCs must grant their intended caller role explicitly.

BEGIN;
SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '30s';

-- PostgreSQL's built-in default grants EXECUTE to PUBLIC in every schema.
-- Remove that global default for functions created by the migration owner.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Supabase also configured explicit anon/authenticated defaults in public.
-- Keep the service_role default intact while making client access opt-in.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon, authenticated;

DO $postflight$
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
    RAISE EXCEPTION 'TASK582_POSTFLIGHT: client EXECUTE remains in function defaults';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_default_acl d
    JOIN pg_roles owner_role ON owner_role.oid = d.defaclrole
    JOIN pg_namespace n ON n.oid = d.defaclnamespace
    CROSS JOIN LATERAL aclexplode(d.defaclacl) a
    JOIN pg_roles grantee_role ON grantee_role.oid = a.grantee
    WHERE owner_role.rolname = 'postgres'
      AND n.nspname = 'public'
      AND d.defaclobjtype = 'f'
      AND grantee_role.rolname = 'service_role'
      AND a.privilege_type = 'EXECUTE'
  ) THEN
    RAISE EXCEPTION 'TASK582_POSTFLIGHT: service_role default EXECUTE was unexpectedly removed';
  END IF;

  -- Existing authenticated application RPC contracts must remain unchanged.
  IF NOT has_function_privilege(
    'authenticated',
    'public.start_exam(public.exam_kind,uuid)',
    'EXECUTE'
  ) OR has_function_privilege(
    'anon',
    'public.start_exam(public.exam_kind,uuid)',
    'EXECUTE'
  ) THEN
    RAISE EXCEPTION 'TASK582_POSTFLIGHT: existing start_exam caller contract changed';
  END IF;
END;
$postflight$;

COMMIT;

-- READ ONLY inventory of public SECURITY DEFINER RPC authorization surface.
-- Security audit heuristics are not proof of a vulnerability. Reviewing a
-- function's body/ownership predicates and running cross-user tests is required.
--
-- 1: effective EXECUTE roles and hardening signals; no raw function bodies.
SELECT
  p.oid::regprocedure::text AS function_signature,
  pg_get_userbyid(p.proowner) AS owner_role,
  has_function_privilege('anon',p.oid,'EXECUTE') AS anonymous_can_execute,
  has_function_privilege('authenticated',p.oid,'EXECUTE') AS authenticated_can_execute,
  EXISTS (
    SELECT 1 FROM aclexplode(coalesce(p.proacl,acldefault('f',p.proowner))) a
    WHERE a.grantee=0 AND a.privilege_type='EXECUTE'
  ) AS explicitly_granted_to_public,
  coalesce(array_to_string(p.proconfig,','),'') AS function_settings,
  coalesce(array_to_string(p.proconfig,','),'') LIKE '%search_path=%' AS has_fixed_search_path,
  position('auth.uid()' in pg_get_functiondef(p.oid))>0 AS references_auth_uid,
  position('auth_role()' in pg_get_functiondef(p.oid))>0 AS references_auth_role,
  p.provolatile::text AS volatility,
  p.proleakproof AS leakproof
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.prosecdef
ORDER BY
  anonymous_can_execute DESC,
  has_fixed_search_path ASC,
  references_auth_uid ASC,
  function_signature;

-- 2: count independent effective grants and static warning signals.
WITH inventory AS (
  SELECT p.oid,
    has_function_privilege('anon',p.oid,'EXECUTE') AS anon_exec,
    has_function_privilege('authenticated',p.oid,'EXECUTE') AS auth_exec,
    coalesce(array_to_string(p.proconfig,','),'') LIKE '%search_path=%' AS fixed_path,
    position('auth.uid()' in pg_get_functiondef(p.oid))>0 AS uid_mentioned
  FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
  WHERE n.nspname='public' AND p.prosecdef
)
SELECT count(*) AS security_definer_count,
  count(*) FILTER (WHERE anon_exec) AS anon_callable,
  count(*) FILTER (WHERE auth_exec) AS authenticated_callable,
  count(*) FILTER (WHERE NOT fixed_path) AS missing_fixed_search_path,
  count(*) FILTER (WHERE auth_exec AND NOT uid_mentioned) AS auth_without_uid_literal
FROM inventory;

-- 3: all public-schema RLS policy definitions are reviewed separately; a
-- heuristic above cannot validate a cross-user IDOR without role-based tests.

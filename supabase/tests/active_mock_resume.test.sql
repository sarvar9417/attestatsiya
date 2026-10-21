-- The active-mock endpoint is a read-only, owner-scoped RPC.
DO $$
DECLARE v_ddl text;
BEGIN
 IF to_regprocedure('public.get_active_mock_exam()') IS NULL THEN
   RAISE EXCEPTION 'ACTIVE_MOCK_RESUME_FUNCTION_MISSING';
 END IF;
 IF has_function_privilege('anon','public.get_active_mock_exam()','EXECUTE') THEN
   RAISE EXCEPTION 'ACTIVE_MOCK_RESUME_EXPOSED_TO_ANON';
 END IF;
 IF NOT has_function_privilege('authenticated','public.get_active_mock_exam()','EXECUTE') THEN
   RAISE EXCEPTION 'ACTIVE_MOCK_RESUME_UNAVAILABLE_TO_USER';
 END IF;
 SELECT pg_get_functiondef('public.get_active_mock_exam()'::regprocedure) INTO v_ddl;
 IF position('auth.uid()' IN v_ddl)=0
    OR position('user_id = v_user' IN v_ddl)=0
    OR position('finished_at is null' IN lower(v_ddl))=0
    OR position('answered_question_ids' IN v_ddl)=0
    OR position('saved_answers' IN v_ddl)=0
    OR position('question_keys' IN v_ddl)<>0
 THEN RAISE EXCEPTION 'ACTIVE_MOCK_RESUME_AUTH_OR_KEYLESS_CONTRACT_CHANGED'; END IF;
END $$;
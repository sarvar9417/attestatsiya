-- Stable regression: every assessment kind can resume only through a
-- keyless, owner-filtered function. No new exam starts during this lookup.
DO $$
DECLARE v_definition text;
BEGIN
 IF to_regprocedure('public.get_active_exam(public.exam_kind,uuid,uuid,integer,integer)') IS NULL THEN
   RAISE EXCEPTION 'ALL_EXAM_RESUME_FUNCTION_MISSING';
 END IF;
 IF has_function_privilege('anon','public.get_active_exam(public.exam_kind,uuid,uuid,integer,integer)','EXECUTE')
    OR NOT has_function_privilege('authenticated','public.get_active_exam(public.exam_kind,uuid,uuid,integer,integer)','EXECUTE')
 THEN RAISE EXCEPTION 'ALL_EXAM_RESUME_EXECUTE_PRIVILEGE_BROKEN'; END IF;
 SELECT lower(pg_get_functiondef('public.get_active_exam(public.exam_kind,uuid,uuid,integer,integer)'::regprocedure))
 INTO v_definition;
 IF position('auth.uid()' IN v_definition)=0
    OR position('user_id = v_user' IN v_definition)=0
    OR position('e.kind = p_kind' IN v_definition)=0
    OR position('e.finished_at is null' IN v_definition)=0
    OR position('e.module_id = p_module_id' IN v_definition)=0
    OR position('e.lesson_id = p_lesson_id' IN v_definition)=0
    OR position('chapter_no' IN v_definition)=0
    OR position('requested_count' IN v_definition)=0
    OR position('saved_answers' IN v_definition)=0
    OR position('answered_question_ids' IN v_definition)=0
    OR position('question_keys' IN v_definition)<>0
 THEN RAISE EXCEPTION 'ALL_EXAM_RESUME_SCOPE_OR_KEYLESS_CONTRACT_CHANGED'; END IF;
END $$;
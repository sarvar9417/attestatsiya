-- TASK-P0-02: side-effect-free topic-test preflight; never exposes keys, IDs or private drafts.
-- Mirrors the strict objective-complete topic generator's eligibility predicates.
-- Source of truth remains generate_topic_test: a preflight is a snapshot, not a reservation.
BEGIN;

CREATE OR REPLACE FUNCTION public.topic_test_preflight(p_lesson_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lesson public.lessons%ROWTYPE;
  v_required_slots integer := 0;
  v_required_count integer := 0;
  v_total integer := 0;
  v_missing jsonb := '[]'::jsonb;
  v_coverage jsonb := '[]'::jsonb;
  v_row record;
  v_available integer := 0;
  v_ready boolean;
  v_reason text;
BEGIN
  SELECT * INTO v_lesson FROM public.lessons
   WHERE id=p_lesson_id AND status='published'::public.content_status;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ready',false,'required',0,'available',0,
      'duration_sec',0,'reason','lesson_unavailable','coverage','[]'::jsonb,
      'critical_objective_gaps','[]'::jsonb);
  END IF;
  SELECT count(*),coalesce(sum(lc.min_questions) FILTER (WHERE lc.is_required),0)
    INTO v_required_count,v_required_slots
    FROM public.lesson_constructs lc
    WHERE lc.lesson_id=p_lesson_id;

  -- Candidate count uses the same active taxonomy + status + answer-key constraints.
  SELECT count(DISTINCT q.id) INTO v_total
    FROM public.questions q
    JOIN public.lesson_constructs lc ON lc.construct_id=q.construct_id
      AND lc.lesson_id=p_lesson_id
    JOIN public.constructs c ON c.id=q.construct_id
      AND c.is_active AND c.group_code=q.group_code
   WHERE q.status='published'::public.content_status
     AND EXISTS (SELECT 1 FROM public.question_keys k WHERE k.question_id=q.id);

  FOR v_row IN
    SELECT lc.construct_id,lc.min_questions,lc.is_required,lc.is_critical,
      c.code,c.group_code,c.is_active
    FROM public.lesson_constructs lc
    LEFT JOIN public.constructs c ON c.id=lc.construct_id
    WHERE lc.lesson_id=p_lesson_id
    ORDER BY lc.is_critical DESC,c.code
  LOOP
    SELECT count(DISTINCT q.id) INTO v_available
      FROM public.questions q
      WHERE q.construct_id=v_row.construct_id
        AND q.status='published'::public.content_status
        AND q.group_code=v_row.group_code AND v_row.is_active
        AND EXISTS (SELECT 1 FROM public.question_keys k WHERE k.question_id=q.id);
    v_coverage := v_coverage || jsonb_build_array(jsonb_build_object(
      'objective',coalesce(v_row.code,'unknown'),
      'required',v_row.is_required,
      'critical',v_row.is_critical,
      'minimum',v_row.min_questions,
      'available',v_available
    ));
    IF v_row.is_required AND v_available < v_row.min_questions THEN
      v_missing := v_missing || jsonb_build_array(coalesce(v_row.code,'unknown'));
    END IF;
  END LOOP;

  v_reason := CASE
    WHEN v_required_count=0 THEN 'blueprint_missing'
    WHEN v_required_slots>v_lesson.topic_test_question_count THEN 'blueprint_invalid'
    WHEN jsonb_array_length(v_missing)>0 THEN 'objective_gap'
    WHEN v_total<v_lesson.topic_test_question_count THEN 'pool_insufficient'
    ELSE 'ready'
  END;
  v_ready := v_reason='ready';
  RETURN jsonb_build_object(
    'ready',v_ready,
    'required',v_lesson.topic_test_question_count,
    'available',v_total,
    'duration_sec',v_lesson.topic_test_question_count*120,
    'reason',v_reason,
    'coverage',v_coverage,
    'critical_objective_gaps',v_missing
  );
END;
$$;

REVOKE ALL ON FUNCTION public.topic_test_preflight(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.topic_test_preflight(uuid) TO service_role;
COMMIT;

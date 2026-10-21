-- Completes the new-answer policy across the other learning signals:
-- both SM-2 state and evidence/cognitive counts must reflect the final choice.
BEGIN;
CREATE OR REPLACE FUNCTION public.capture_mastery_evidence()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_exam public.exams%rowtype;
  v_question public.questions%rowtype;
  v_kind public.mastery_evidence_kind;
  v_inserted boolean := false;
begin
  if old.answered_at is not null or new.answered_at is null then
    return new;
  end if;

  select * into v_exam
  from public.exams
  where id = new.exam_id;

  -- New mutable attempts defer learning evidence until the final answer.
  -- Keep pre-migration attempts' historical first-answer semantics unchanged.
  if v_exam.selection_meta ->> 'sm2_commit_policy' = 'on_finish_v1' then
    return new;
  end if;

  select * into v_question
  from public.questions
  where id = new.question_id;

  if v_exam.id is null or v_question.id is null or new.is_correct is null then
    return new;
  end if;

  v_kind := case
    when v_exam.kind = 'mashq'::public.exam_kind
      then 'guided'::public.mastery_evidence_kind
    else 'independent'::public.mastery_evidence_kind
  end;

  insert into public.mastery_evidence (
    user_id,
    construct_id,
    question_id,
    exam_id,
    exam_item_id,
    cognitive,
    evidence_kind,
    is_correct,
    observed_at
  )
  values (
    v_exam.user_id,
    new.construct_id,
    new.question_id,
    new.exam_id,
    new.id,
    v_question.cognitive,
    v_kind,
    new.is_correct,
    coalesce(new.answered_at, now())
  )
  on conflict (exam_item_id) do nothing
  returning true into v_inserted;

  if not coalesce(v_inserted, false) then
    return new;
  end if;

  insert into public.user_construct_stats (user_id, construct_id)
  values (v_exam.user_id, new.construct_id)
  on conflict (user_id, construct_id) do nothing;

  update public.user_construct_stats
  set
    independent_attempts = independent_attempts
      + case when v_kind = 'independent'::public.mastery_evidence_kind then 1 else 0 end,
    guided_attempts = guided_attempts
      + case when v_kind = 'guided'::public.mastery_evidence_kind then 1 else 0 end,
    bilish_attempts = bilish_attempts
      + case when v_question.cognitive = 'bilish'::public.cognitive_level then 1 else 0 end,
    bilish_correct = bilish_correct
      + case when v_question.cognitive = 'bilish'::public.cognitive_level and new.is_correct then 1 else 0 end,
    qollash_attempts = qollash_attempts
      + case when v_question.cognitive = 'qollash'::public.cognitive_level then 1 else 0 end,
    qollash_correct = qollash_correct
      + case when v_question.cognitive = 'qollash'::public.cognitive_level and new.is_correct then 1 else 0 end,
    mulohaza_attempts = mulohaza_attempts
      + case when v_question.cognitive = 'mulohaza'::public.cognitive_level then 1 else 0 end,
    mulohaza_correct = mulohaza_correct
      + case when v_question.cognitive = 'mulohaza'::public.cognitive_level and new.is_correct then 1 else 0 end
  where user_id = v_exam.user_id
    and construct_id = new.construct_id;

  return new;
end
$function$;


CREATE OR REPLACE FUNCTION public.capture_final_exam_mastery_evidence()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $evidence$
DECLARE
  v_item record;
  v_inserted boolean;
BEGIN
  -- Never replay history, and do not change unaffected legacy exams.
  IF old.finished_at IS NOT NULL OR new.finished_at IS NULL
     OR new.selection_meta ->> 'sm2_commit_policy' IS DISTINCT FROM 'on_finish_v1' THEN
    RETURN new;
  END IF;

  FOR v_item IN
    SELECT ei.id, ei.question_id, ei.construct_id, ei.is_correct, ei.answered_at,
           q.cognitive
    FROM public.exam_items ei
    JOIN public.questions q ON q.id=ei.question_id
    WHERE ei.exam_id=new.id
      AND ei.answered_at IS NOT NULL
      AND ei.is_correct IS NOT NULL
    ORDER BY ei.order_idx, ei.id
  LOOP
    v_inserted := false;
    INSERT INTO public.mastery_evidence (
      user_id, construct_id, question_id, exam_id, exam_item_id,
      cognitive, evidence_kind, is_correct, observed_at
    ) VALUES (
      new.user_id, v_item.construct_id, v_item.question_id, new.id, v_item.id,
      v_item.cognitive, 'independent'::public.mastery_evidence_kind,
      v_item.is_correct, coalesce(v_item.answered_at, now())
    ) ON CONFLICT (exam_item_id) DO NOTHING
    RETURNING true INTO v_inserted;

    IF NOT coalesce(v_inserted, false) THEN CONTINUE; END IF;
    INSERT INTO public.user_construct_stats (user_id, construct_id)
    VALUES (new.user_id, v_item.construct_id)
    ON CONFLICT (user_id, construct_id) DO NOTHING;

    UPDATE public.user_construct_stats SET
      independent_attempts = independent_attempts + 1,
      bilish_attempts = bilish_attempts
        + case when v_item.cognitive = 'bilish'::public.cognitive_level then 1 else 0 end,
      bilish_correct = bilish_correct
        + case when v_item.cognitive = 'bilish'::public.cognitive_level and v_item.is_correct then 1 else 0 end,
      qollash_attempts = qollash_attempts
        + case when v_item.cognitive = 'qollash'::public.cognitive_level then 1 else 0 end,
      qollash_correct = qollash_correct
        + case when v_item.cognitive = 'qollash'::public.cognitive_level and v_item.is_correct then 1 else 0 end,
      mulohaza_attempts = mulohaza_attempts
        + case when v_item.cognitive = 'mulohaza'::public.cognitive_level then 1 else 0 end,
      mulohaza_correct = mulohaza_correct
        + case when v_item.cognitive = 'mulohaza'::public.cognitive_level and v_item.is_correct then 1 else 0 end
    WHERE user_id=new.user_id AND construct_id=v_item.construct_id;
  END LOOP;
  RETURN new;
END;
$evidence$;
REVOKE ALL ON FUNCTION public.capture_final_exam_mastery_evidence() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS trg_final_exam_mastery_evidence ON public.exams;
CREATE TRIGGER trg_final_exam_mastery_evidence
  AFTER UPDATE OF finished_at ON public.exams
  FOR EACH ROW
  WHEN (old.finished_at IS NULL AND new.finished_at IS NOT NULL)
  EXECUTE FUNCTION public.capture_final_exam_mastery_evidence();
COMMIT;

-- AXB 19 PDF chapters: secured reader catalog and source-locked session assembly.
-- DRAFT: release requires explicit approval. No import, publish, or existing question edits.
ALTER TYPE public.exam_kind ADD VALUE IF NOT EXISTS 'axb_bob';

CREATE OR REPLACE FUNCTION public.axb_chapter_catalog()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $axb$
WITH eligible AS (
  SELECT
    substring(q.source_reference FROM '^m01-professional-bank:AXB-([0-9]{2})-[0-9]{3}$')::int chapter_no,
    q.status,
    (q.status = 'published'::public.content_status
     AND q.format = 'Y1'::public.question_format
     AND c.is_active AND q.group_code=c.group_code
     AND l.status = 'published'::public.content_status AND lc.lesson_id IS NOT NULL
     AND k.question_id IS NOT NULL
     AND (SELECT count(*) FROM public.question_options o
          WHERE o.question_id=q.id AND o.side='a')=4
     AND EXISTS(SELECT 1 FROM public.question_options o
                WHERE o.question_id=q.id
                  AND o.id::text=k.payload->>'correct_option_id')) AS selectable
  FROM public.questions q
  JOIN public.constructs c ON c.id=q.construct_id
  JOIN public.lessons l ON l.id=q.source_lesson_id
  LEFT JOIN public.lesson_constructs lc ON lc.lesson_id=q.source_lesson_id AND lc.construct_id=q.construct_id
  LEFT JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.source_reference ~ '^m01-professional-bank:AXB-(0[1-9]|1[0-9])-[0-9]{3}$'
)
SELECT jsonb_agg(jsonb_build_object(
 'chapter_no', gs.n,
 'total_pdf', 30,
 'published_count', (SELECT count(*) FROM eligible WHERE chapter_no=gs.n AND selectable),
 'review_count', (SELECT count(*) FROM eligible WHERE chapter_no=gs.n AND status='review'::public.content_status)
 ) ORDER BY gs.n)
FROM generate_series(1,19) gs(n)
WHERE auth.uid() IS NOT NULL
$axb$;

REVOKE ALL ON FUNCTION public.axb_chapter_catalog() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.axb_chapter_catalog() TO authenticated;

CREATE OR REPLACE FUNCTION public.generate_axb_chapter_practice(p_chapter_no int, p_count int)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $axb$
DECLARE
  v_user uuid := auth.uid();
  v_blueprint public.blueprints%ROWTYPE;
  v_exam uuid;
  v_ids uuid[];
  v_available int;
  v_prefix text;
  v_meta jsonb;
  v_duration int;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'auth_required'; END IF;
  IF p_chapter_no IS NULL OR p_chapter_no NOT BETWEEN 1 AND 19
    OR p_count IS NULL OR p_count NOT BETWEEN 1 AND 30 THEN
    RAISE EXCEPTION 'axb_chapter_request_invalid';
  END IF;
  v_prefix := 'm01-professional-bank:AXB-'||lpad(p_chapter_no::text,2,'0')||'-%';
  SELECT * INTO v_blueprint FROM public.blueprints WHERE is_active
   ORDER BY version DESC LIMIT 1;
  IF NOT FOUND THEN RAISE EXCEPTION 'blueprint_topilmadi'; END IF;

  -- Exactly the same eligibility predicate drives preflight and selection.
  WITH available AS (
    SELECT q.id,
      (SELECT count(*) FROM public.exam_items ei JOIN public.exams e ON e.id=ei.exam_id
        WHERE ei.question_id=q.id AND e.user_id=v_user) exposure,
      (SELECT max(e.started_at) FROM public.exam_items ei JOIN public.exams e ON e.id=ei.exam_id
        WHERE ei.question_id=q.id AND e.user_id=v_user) last_seen
    FROM public.questions q
    JOIN public.constructs c ON c.id=q.construct_id AND c.is_active AND q.group_code=c.group_code
    JOIN public.lessons l ON l.id=q.source_lesson_id AND l.status='published'::public.content_status
    JOIN public.lesson_constructs lc ON lc.lesson_id=l.id AND lc.construct_id=c.id
    JOIN public.question_keys k ON k.question_id=q.id
    WHERE q.source_reference LIKE v_prefix
      AND q.source_reference ~ '^m01-professional-bank:AXB-(0[1-9]|1[0-9])-[0-9]{3}$'
      AND q.status='published'::public.content_status
      AND q.format='Y1'::public.question_format
      AND (SELECT count(*) FROM public.question_options o
           WHERE o.question_id=q.id AND o.side='a')=4
      AND EXISTS (SELECT 1 FROM public.question_options o
        WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')
  )
  SELECT (SELECT count(*) FROM available),
    (SELECT coalesce(array_agg(id ORDER BY exposure,last_seen NULLS FIRST,random()),'{}'::uuid[])
       FROM (SELECT id,exposure,last_seen FROM available
             ORDER BY exposure,last_seen NULLS FIRST,random() LIMIT p_count) picked)
  INTO v_available, v_ids;
  IF v_available < p_count OR cardinality(v_ids) <> p_count THEN
    RAISE EXCEPTION 'axb_chapter_pool_insufficient: chapter=% required=% available=%',
      p_chapter_no,p_count,v_available;
  END IF;
  IF (SELECT count(DISTINCT id) FROM unnest(v_ids) t(id)) <> p_count THEN
    RAISE EXCEPTION 'axb_chapter_duplicate_selection';
  END IF;

  v_duration := p_count*120;
  v_meta := jsonb_build_object(
    'selector_version','axb-chapter-v1',
    'bank','m01-professional-bank',
    'chapter_no',p_chapter_no,
    'requested_count',p_count,
    'actual_count',cardinality(v_ids),
    'practice_duration_sec',v_duration,
    'specification','2026',
    'note','AXB practice (not official 50-question mock)');
  INSERT INTO public.exams (user_id,kind,blueprint_id,duration_sec,selection_meta)
    VALUES(v_user,'axb_bob'::public.exam_kind,v_blueprint.id,v_duration,v_meta)
    RETURNING id INTO v_exam;
  PERFORM public.attach_questions(v_exam,v_ids);
  UPDATE public.exam_items ei SET option_order=(
    SELECT array_agg(o.id ORDER BY random())
    FROM public.question_options o WHERE o.question_id=ei.question_id
  ) WHERE ei.exam_id=v_exam;

  RETURN jsonb_build_object(
    'exam_id',v_exam,'kind','axb_bob','duration_sec',v_duration,
    'started_at',(SELECT started_at FROM public.exams WHERE id=v_exam),
    'items',public.exam_payload(v_exam),'selection_meta',v_meta);
END
$axb$;

REVOKE ALL ON FUNCTION public.generate_axb_chapter_practice(int,int) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.generate_axb_chapter_practice(int,int) TO authenticated;

-- Preserve the first-answer lock, timer and scoring. AXB acts as a protected
-- test until finish_exam; retries never leak answer feedback.
CREATE OR REPLACE FUNCTION public.submit_answer(p_exam_id uuid, p_question_id uuid, p_answer jsonb, p_time_spent integer DEFAULT NULL::integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_user    uuid := auth.uid();
  v_exam    public.exams%rowtype;
  v_item    public.exam_items%rowtype;
  v_q       public.questions%rowtype;
  v_key     public.question_keys%rowtype;
  v_correct boolean;
  v_pts     int;
begin
  if v_user is null then
    raise exception 'auth_required';
  end if;

  if p_time_spent is not null and p_time_spent < 0 then
    raise exception 'time_spent_invalid';
  end if;

  -- finish_exam locks this same row first. That shared lock order prevents an
  -- answer from racing with exam finalization.
  select *
    into v_exam
    from public.exams
   where id = p_exam_id
     and user_id = v_user
   for update;

  if not found then
    raise exception 'sinov_topilmadi';
  end if;

  -- Membership is checked before question_keys is touched. Locking the item
  -- makes the first accepted answer immutable under concurrent retries.
  select *
    into v_item
    from public.exam_items
   where exam_id = p_exam_id
     and question_id = p_question_id
   for update;

  if not found then
    raise exception 'savol_sinovga_tegisli_emas';
  end if;

  if v_item.answered_at is not null then
    if v_exam.kind in ('mock', 'bolim', 'axb_bob') then
      return jsonb_build_object(
        'saved', true,
        'already_answered', true
      );
    end if;

    select *
      into v_key
      from public.question_keys
     where question_id = v_item.question_id;

    if not found then
      raise exception 'kalit_topilmadi';
    end if;

    return jsonb_build_object(
      'saved', true,
      'already_answered', true,
      'correct', v_item.is_correct,
      'explanation_md', v_key.explanation_md
    );
  end if;

  if v_exam.finished_at is not null then
    return jsonb_build_object('error', 'sinov_tugagan');
  end if;

  if v_exam.duration_sec is not null
     and now() > v_exam.started_at + make_interval(secs => v_exam.duration_sec) then
    return jsonb_build_object('error', 'vaqt_tugadi');
  end if;

  select *
    into v_q
    from public.questions
   where id = v_item.question_id;

  if not found then
    raise exception 'savol_topilmadi';
  end if;

  select *
    into v_key
    from public.question_keys
   where question_id = v_item.question_id;

  if not found then
    raise exception 'kalit_topilmadi';
  end if;

  v_correct := public.check_answer(v_q.format, v_key.payload, p_answer);
  v_pts := case when v_correct then 2 else 0 end;

  update public.exam_items
     set user_answer = p_answer,
         is_correct = v_correct,
         score = v_pts,
         time_spent_sec = coalesce(p_time_spent, time_spent_sec),
         client_answered_at = coalesce(client_answered_at, now()),
         answered_at = now()
   where id = v_item.id
     and answered_at is null;

  if v_exam.kind in ('mavzu', 'bolim', 'mock', 'takrorlash', 'zaif', 'diagnostika', 'axb_bob') then
    perform public.apply_sm2(v_user, v_item.construct_id, v_correct);
  end if;

  if v_exam.kind in ('mock', 'bolim', 'axb_bob') then
    return jsonb_build_object('saved', true);
  end if;

  return jsonb_build_object(
    'saved', true,
    'correct', v_correct,
    'explanation_md', v_key.explanation_md
  );
end
$function$

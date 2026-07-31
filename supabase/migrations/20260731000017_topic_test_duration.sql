-- ============================================================================
-- 20260731000017_topic_test_duration.sql
--
-- Mavzu testi (kind='mavzu') uchun umumiy vaqt:
--   duration_sec = savollar_soni × 120 (har bir savolga 2 daqiqa).
--
-- 20 ta savol → 2400 soniya (40 daqiqa). Vaqt UMUMIY hisoblanadi — bitta
-- savolga alohida cheklov yo'q; `submit_answer` deadline'dan keyin
-- `vaqt_tugadi` qaytaradi, frontend esa timer 0 ga yetganda avtomatik
-- finish_exam chaqiradi (server-authoritative).
--
-- Darsda 20 dan kam savol bo'lsa — faqat o'sha darsdagi savollar beriladi
-- va vaqt ham haqiqiy savollar soniga mos hisoblanadi.
--
-- Rollback yo'li: create or replace bilan qayta e'lon qilish; eski
-- xatti-harakat (duration_sec = null) kerak bo'lsa 000016 dagi funksiya
-- qayta qo'llaniladi. Faqat yangi boshlangan exam'larga ta'sir qiladi.
-- ============================================================================

-- ─── generate_topic_test: 20 random, shuffle + umumiy vaqt ────────────────
create or replace function public.generate_topic_test(p_lesson_id uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user  uuid := auth.uid();
  v_exam  uuid;
  v_pool  uuid[] := '{}';
  v_extra uuid[];
  v_ids   uuid[];
  v_dur   int;
begin
  if v_user is null then raise exception 'auth_required'; end if;

  -- 1) darsga bevosita bog'langan savollar (source_lesson_id)
  select coalesce(array_agg(id), '{}') into v_pool
  from (
    select q.id
    from public.questions q
    where q.source_lesson_id = p_lesson_id
      and q.status = 'published'
    order by random()
    limit 20
  ) s;

  -- 2) yetmay qolsa — dars konstruktlari orqali to'ldirish
  if array_length(v_pool, 1) < 20 then
    select coalesce(array_agg(id), '{}') into v_extra
    from (
      select q.id
      from public.questions q
      join public.lesson_constructs lc on lc.construct_id = q.construct_id
      where lc.lesson_id = p_lesson_id
        and q.status = 'published'
        and not (q.id = any(v_pool))
      order by random()
      limit greatest(0, 20 - array_length(v_pool, 1))
    ) s;
    v_pool := v_pool || v_extra;
  end if;

  if array_length(v_pool, 1) is null or array_length(v_pool, 1) = 0 then
    raise exception 'savol_yoq: mavzuga savol biriktirilmagan';
  end if;

  -- 3) random 20 ta (darsda 20 dan kam bo'lsa — borlari)
  select coalesce(array_agg(t.id), '{}') into v_ids
  from (
    select t.id
    from unnest(v_pool) as t(id)
    order by random()
    limit 20
  ) t;

  -- 4) umumiy vaqt: har bir savol uchun 2 daqiqa
  v_dur := array_length(v_ids, 1) * 120;

  insert into public.exams (user_id, kind, lesson_id, module_id, duration_sec)
  select v_user, 'mavzu'::public.exam_kind, p_lesson_id, l.module_id, v_dur
  from public.lessons l where l.id = p_lesson_id
  returning id into v_exam;

  perform public.attach_questions(v_exam, v_ids);

  -- 5) har bir savol variantlarini aralashtiramiz (side guruhi ichida)
  update public.exam_items ei
  set option_order = (
    select array_agg(o.id order by o.side nulls first, random())
    from public.question_options o
    where o.question_id = ei.question_id
  )
  where ei.exam_id = v_exam;

  return jsonb_build_object(
    'exam_id', v_exam, 'kind', 'mavzu',
    'duration_sec', v_dur, 'started_at', now(),
    'items', public.exam_payload(v_exam)
  );
end $$;

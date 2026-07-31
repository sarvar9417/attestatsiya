-- ============================================================================
-- 20260731000016_lesson_test_pool_20.sql
--
-- Dars oxiridagi test (kind='mavzu') oqimini yangilash:
--   1. `exam_items.option_order` — har urinish uchun aralashtirilgan variant
--      tartibi (javoblar aralashgan holda ko'rsatiladi; to'g'rilik option id
--      orqali tekshiriladi, shuning uchun tartib saqlanadi).
--   2. `generate_topic_test` — 20 ta random savol: birinchi navbatda
--      `questions.source_lesson_id` bo'yicha to'g'ridan-to'g'ri bog'langan
--      savollar, yetmay qolsa dars konstruktlari orqali to'ldiriladi.
--      Darsda 20 dan kam savol bo'lsa — borlari olinadi.
--   3. `exam_payload` — option_order mavjud bo'lsa shu tartibda, aks holda
--      eski tartib (side, order_idx). Qo'shimcha: item tartibi integer
--      bo'yicha (text emas) — 10+ savollarda noto'g'ri ketma-ketlik xatosi
--      tuzatildi.
--
-- Rollback yo'li: bu fayl create or replace bilan oldingi funksiyalarni
-- yangilaydi; kolonnani o'chirish: alter table exam_items drop column option_order.
-- Eski exam'lar (option_order null) eski tartibda ko'rsatilishda davom etadi.
-- ============================================================================

alter table public.exam_items add column option_order uuid[];

create index on public.exams (kind, lesson_id, started_at desc);

-- ─── exam_payload: aralashtirilgan tartibni hisobga olish ─────────────────
create or replace function public.exam_payload(p_exam_id uuid)
returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_agg(item order by (item->>'order_idx')::int)
  from (
    select jsonb_build_object(
      'item_id',   ei.id,
      'order_idx', ei.order_idx,
      'question_id', q.id,
      'format',    q.format,
      'stem_md',   q.stem_md,
      'assets',    q.assets,
      'options',   (
        select coalesce(jsonb_agg(jsonb_build_object(
                 'id', o.id, 'side', o.side, 'content_md', o.content_md
               ) order by o.side nulls first,
                 case
                   when ei.option_order is not null
                     then array_position(ei.option_order, o.id)
                   else o.order_idx
                 end), '[]'::jsonb)
        from public.question_options o
        where o.question_id = q.id
          and (ei.option_order is null or o.id = any(ei.option_order))
      )
    ) as item
    from public.exam_items ei
    join public.questions q on q.id = ei.question_id
    where ei.exam_id = p_exam_id
  ) s;
$$;

-- ─── generate_topic_test: 20 random, aralashtirilgan variantlar ───────────
create or replace function public.generate_topic_test(p_lesson_id uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user  uuid := auth.uid();
  v_exam  uuid;
  v_pool  uuid[] := '{}';
  v_extra uuid[];
  v_ids   uuid[];
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

  insert into public.exams (user_id, kind, lesson_id, module_id)
  select v_user, 'mavzu'::public.exam_kind, p_lesson_id, l.module_id
  from public.lessons l where l.id = p_lesson_id
  returning id into v_exam;

  perform public.attach_questions(v_exam, v_ids);

  -- 4) har bir savol variantlarini aralashtiramiz (side guruhi ichida)
  update public.exam_items ei
  set option_order = (
    select array_agg(o.id order by o.side nulls first, random())
    from public.question_options o
    where o.question_id = ei.question_id
  )
  where ei.exam_id = v_exam;

  return jsonb_build_object(
    'exam_id', v_exam, 'kind', 'mavzu',
    'duration_sec', null, 'started_at', now(),
    'items', public.exam_payload(v_exam)
  );
end $$;

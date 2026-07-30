# 03 — RPC funksiyalari

Barcha funksiya `security definer`. Bu ularga RLS'ni chetlab o'tish huquqini
beradi — shuning uchun **har birida `auth.uid()` tekshiruvi majburiy**.

Fayl: `supabase/migrations/007_functions.sql`

---

## Yordamchi funksiyalar

### Javobni tekshirish

```sql
create or replace function check_answer(
  p_format      question_format,
  p_key         jsonb,
  p_user_answer jsonb
) returns boolean
language plpgsql immutable set search_path = public as $$
begin
  if p_user_answer is null then return false; end if;

  case p_format
    when 'Y1' then
      return (p_user_answer ->> 'option_id') is not null
         and (p_user_answer ->> 'option_id') = (p_key ->> 'correct_option_id');
    when 'Y2' then
      -- jsonb obyekt taqqoslash kalitlar tartibiga bog'liq emas
      return (p_user_answer -> 'pairs') = (p_key -> 'pairs');
    when 'Y3' then
      -- jsonb massiv taqqoslash tartibni hisobga oladi
      return (p_user_answer -> 'order') = (p_key -> 'order');
  end case;
  return false;
end $$;
```

Qisman ball **yo'q**. Spetsifikatsiya: to'g'ri javob 2 ball, noto'g'ri 0 ball.

### SM-2 yangilash

```sql
create or replace function apply_sm2(
  p_user uuid,
  p_construct uuid,
  p_correct boolean
) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_row    user_construct_stats;
  v_q      int;
  v_ease   numeric(4,2);
  v_streak int;
  v_int    int;
begin
  insert into user_construct_stats (user_id, construct_id)
  values (p_user, p_construct)
  on conflict (user_id, construct_id) do nothing;

  select * into v_row from user_construct_stats
  where user_id = p_user and construct_id = p_construct for update;

  v_q := case when p_correct then 4 else 2 end;
  v_ease := greatest(1.30,
    v_row.ease + (0.1 - (5 - v_q) * (0.08 + (5 - v_q) * 0.02)));

  if p_correct then
    v_streak := v_row.streak + 1;
    v_int := case
      when v_streak = 1 then 1
      when v_streak = 2 then 3
      else greatest(1, round(v_row.interval_days * v_ease)::int)
    end;
  else
    v_streak := 0;
    v_int := 0;                              -- ertaga qaytadi
  end if;

  update user_construct_stats set
    attempts      = v_row.attempts + 1,
    correct       = v_row.correct + (case when p_correct then 1 else 0 end),
    streak        = v_streak,
    ease          = v_ease,
    interval_days = v_int,
    due_at        = now() + make_interval(days => greatest(v_int, 1)),
    last_seen_at  = now()
  where user_id = p_user and construct_id = p_construct;
end $$;
```

### Savollarni sinovga yozish

```sql
create or replace function attach_questions(p_exam_id uuid, p_ids uuid[])
returns void
language sql security definer set search_path = public as $$
  insert into exam_items (exam_id, question_id, construct_id, order_idx)
  select p_exam_id, q.id, q.construct_id, ord
  from unnest(p_ids) with ordinality as t(qid, ord)
  join questions q on q.id = t.qid;
$$;
```

### Sinov savollarini kalitsiz qaytarish

```sql
create or replace function exam_payload(p_exam_id uuid)
returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_agg(item order by item->>'order_idx')
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
               ) order by o.side, o.order_idx), '[]'::jsonb)
        from question_options o where o.question_id = q.id
      )
    ) as item
    from exam_items ei
    join questions q on q.id = ei.question_id
    where ei.exam_id = p_exam_id
  ) s;
$$;
```

`question_keys` bu yerda **umuman tilga olinmaydi**. Bu funksiyani o'zgartirishda
shu qoidani buzmang.

---

## `start_exam`

```sql
create or replace function start_exam(
  p_kind      exam_kind,
  p_module_id uuid default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user  uuid := auth.uid();
  v_bp    blueprints%rowtype;
  v_exam  uuid;
  v_ids   uuid[] := '{}';
  v_dur   int;
  q       record;
begin
  if v_user is null then raise exception 'auth_required'; end if;

  select * into v_bp from blueprints where is_active limit 1;
  if not found then raise exception 'blueprint_topilmadi'; end if;

  if p_kind = 'mock' then
    v_dur := v_bp.duration_min * 60;

    -- Har guruh, har kognitiv daraja bo'yicha kvota
    for q in
      select group_code, n_bilish, n_qollash, n_mulohaza
      from blueprint_quotas where blueprint_id = v_bp.id order by order_idx
    loop
      v_ids := v_ids || pick_questions(q.group_code, 'bilish',   q.n_bilish,   v_ids);
      v_ids := v_ids || pick_questions(q.group_code, 'qollash',  q.n_qollash,  v_ids);
      v_ids := v_ids || pick_questions(q.group_code, 'mulohaza', q.n_mulohaza, v_ids);
    end loop;

    if array_length(v_ids, 1) <> v_bp.total_questions then
      raise exception 'savol_yetarli_emas: % / %',
        coalesce(array_length(v_ids, 1), 0), v_bp.total_questions;
    end if;

  elsif p_kind = 'diagnostika' then
    v_dur := null;
    for q in
      select group_code from blueprint_quotas
      where blueprint_id = v_bp.id order by order_idx
    loop
      v_ids := v_ids || pick_questions(q.group_code, null, 2, v_ids);
    end loop;

  elsif p_kind = 'bolim' then
    if p_module_id is null then raise exception 'module_id_kerak'; end if;
    v_dur := 1800;
    v_ids := pick_module_questions(p_module_id, 15, v_ids);

  elsif p_kind = 'takrorlash' then
    v_dur := null;
    v_ids := pick_due_questions(v_user, 15);

  elsif p_kind = 'zaif' then
    v_dur := null;
    v_ids := pick_weak_questions(v_user, 10);

  else
    raise exception 'qollab_quvvatlanmaydi: %', p_kind;
  end if;

  insert into exams (user_id, kind, blueprint_id, module_id, duration_sec)
  values (v_user, p_kind, v_bp.id, p_module_id, v_dur)
  returning id into v_exam;

  perform attach_questions(v_exam, v_ids);

  return jsonb_build_object(
    'exam_id',      v_exam,
    'kind',         p_kind,
    'duration_sec', v_dur,
    'started_at',   now(),
    'items',        exam_payload(v_exam)
  );
end $$;
```

### Tanlash yordamchilari

```sql
-- Guruh + kognitiv daraja bo'yicha, takrorlanmasdan
create or replace function pick_questions(
  p_group text,
  p_cog   cognitive_level,
  p_n     int,
  p_exclude uuid[]
) returns uuid[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(id), '{}')
  from (
    select id from questions
    where group_code = p_group
      and status = 'published'
      and (p_cog is null or cognitive = p_cog)
      and not (id = any(p_exclude))
    order by random() limit p_n
  ) s;
$$;

-- Bo'limga tegishli barcha guruhdan proporsional
create or replace function pick_module_questions(
  p_module uuid, p_n int, p_exclude uuid[]
) returns uuid[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(id), '{}')
  from (
    select q.id from questions q
    where q.status = 'published'
      and q.construct_id in (
        select lc.construct_id from lesson_constructs lc
        join lessons l on l.id = lc.lesson_id
        where l.module_id = p_module
      )
      and not (q.id = any(p_exclude))
    order by random() limit p_n
  ) s;
$$;

-- SM-2 navbati: muddati kelgan konstruktlardan
create or replace function pick_due_questions(p_user uuid, p_n int)
returns uuid[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(id), '{}')
  from (
    select distinct on (q.construct_id) q.id
    from user_construct_stats ucs
    join questions q on q.construct_id = ucs.construct_id
    where ucs.user_id = p_user
      and ucs.due_at <= now()
      and q.status = 'published'
    order by q.construct_id, random()
    limit p_n
  ) s;
$$;

-- Eng past o'zlashtirish foizi bo'lgan konstruktlar
create or replace function pick_weak_questions(p_user uuid, p_n int)
returns uuid[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(id), '{}')
  from (
    select q.id
    from user_construct_stats ucs
    join questions q on q.construct_id = ucs.construct_id
    where ucs.user_id = p_user
      and ucs.attempts >= 3
      and q.status = 'published'
    order by (ucs.correct::numeric / nullif(ucs.attempts, 0)) asc, random()
    limit p_n
  ) s;
$$;
```

---

## `generate_topic_test`

Mavzu testining o'zagi: **har konstrukt kamida bir marta qamraladi**.

```sql
create or replace function generate_topic_test(p_lesson_id uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_exam uuid;
  v_ids  uuid[] := '{}';
  v_one  uuid;
  c      record;
  v_need int;
begin
  if v_user is null then raise exception 'auth_required'; end if;

  -- 1. Har konstruktdan majburiy bitta
  for c in
    select construct_id from lesson_constructs where lesson_id = p_lesson_id
  loop
    select q.id into v_one
    from questions q
    where q.construct_id = c.construct_id
      and q.status = 'published'
      and not (q.id = any(v_ids))
      -- oldingi urinishlarda uchramaganini afzal ko'radi
    order by (
      select count(*) from exam_items ei
      join exams e on e.id = ei.exam_id
      where ei.question_id = q.id and e.user_id = v_user
    ) asc, random()
    limit 1;

    if v_one is not null then v_ids := v_ids || v_one; end if;
  end loop;

  if array_length(v_ids, 1) is null then
    raise exception 'savol_yoq: mavzuga savol biriktirilmagan';
  end if;

  -- 2. Qolgan slotlarni zaif konstruktlar bilan to'ldirish (jami ~10)
  v_need := greatest(0, 10 - array_length(v_ids, 1));
  if v_need > 0 then
    v_ids := v_ids || pick_lesson_extra(v_user, p_lesson_id, v_need, v_ids);
  end if;

  insert into exams (user_id, kind, lesson_id, module_id)
  select v_user, 'mavzu', p_lesson_id, l.module_id from lessons l where l.id = p_lesson_id
  returning id into v_exam;

  perform attach_questions(v_exam, v_ids);

  return jsonb_build_object(
    'exam_id', v_exam, 'kind', 'mavzu',
    'duration_sec', null, 'started_at', now(),
    'items', exam_payload(v_exam)
  );
end $$;

create or replace function pick_lesson_extra(
  p_user uuid, p_lesson uuid, p_n int, p_exclude uuid[]
) returns uuid[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(id), '{}')
  from (
    select q.id
    from questions q
    join lesson_constructs lc on lc.construct_id = q.construct_id
    left join user_construct_stats ucs
      on ucs.construct_id = q.construct_id and ucs.user_id = p_user
    where lc.lesson_id = p_lesson
      and q.status = 'published'
      and not (q.id = any(p_exclude))
    order by coalesce(ucs.correct::numeric / nullif(ucs.attempts, 0), 0) asc,
             random()
    limit p_n
  ) s;
$$;
```

---

## `submit_answer`

```sql
create or replace function submit_answer(
  p_exam_id     uuid,
  p_question_id uuid,
  p_answer      jsonb,
  p_time_spent  int default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user    uuid := auth.uid();
  v_exam    exams%rowtype;
  v_q       questions%rowtype;
  v_key     question_keys%rowtype;
  v_correct boolean;
  v_pts     int;
begin
  if v_user is null then raise exception 'auth_required'; end if;

  select * into v_exam from exams where id = p_exam_id and user_id = v_user;
  if not found then raise exception 'sinov_topilmadi'; end if;
  if v_exam.finished_at is not null then
    return jsonb_build_object('error', 'sinov_tugagan');
  end if;

  -- Server vaqti bo'yicha tekshiruv
  if v_exam.duration_sec is not null
     and now() > v_exam.started_at + make_interval(secs => v_exam.duration_sec) then
    return jsonb_build_object('error', 'vaqt_tugadi');
  end if;

  select * into v_q   from questions     where id = p_question_id;
  select * into v_key from question_keys where question_id = p_question_id;
  if not found then raise exception 'kalit_topilmadi'; end if;

  v_correct := check_answer(v_q.format, v_key.payload, p_answer);
  v_pts := case when v_correct then 2 else 0 end;

  update exam_items set
    user_answer = p_answer,
    is_correct  = v_correct,
    score       = v_pts,
    time_spent_sec = coalesce(p_time_spent, time_spent_sec),
    client_answered_at = coalesce(client_answered_at, now()),
    answered_at = now()
  where exam_id = p_exam_id and question_id = p_question_id;

  -- SM-2 faqat ball hisoblanadigan rejimlarda
  if v_exam.kind in ('mavzu','bolim','mock','takrorlash','zaif','diagnostika') then
    perform apply_sm2(v_user, v_q.construct_id, v_correct);
  end if;

  -- Mock va bo'lim imtihonida tushuntirish BERILMAYDI
  if v_exam.kind in ('mock', 'bolim') then
    return jsonb_build_object('saved', true);
  end if;

  return jsonb_build_object(
    'saved', true,
    'correct', v_correct,
    'explanation_md', v_key.explanation_md
  );
end $$;
```

---

## `finish_exam`

Idempotent: ikkinchi chaqiruv bir xil natijani qaytaradi.

```sql
create or replace function finish_exam(p_exam_id uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user  uuid := auth.uid();
  v_exam  exams%rowtype;
  v_total int; v_max int; v_pct numeric;
  v_break jsonb;
  v_all_constructs boolean;
begin
  if v_user is null then raise exception 'auth_required'; end if;

  select * into v_exam from exams where id = p_exam_id and user_id = v_user for update;
  if not found then raise exception 'sinov_topilmadi'; end if;

  -- Idempotentlik
  if v_exam.finished_at is not null then
    return jsonb_build_object(
      'exam_id', v_exam.id, 'total_score', v_exam.total_score,
      'max_score', v_exam.max_score, 'passed', v_exam.passed,
      'breakdown', v_exam.breakdown, 'already_finished', true
    );
  end if;

  select coalesce(sum(score), 0), count(*) * 2
    into v_total, v_max
  from exam_items where exam_id = p_exam_id;

  -- Guruh kesimi
  select jsonb_agg(x) into v_break from (
    select q.group_code,
           count(*)                        as jami,
           count(*) filter (where ei.is_correct) as togri
    from exam_items ei join questions q on q.id = ei.question_id
    where ei.exam_id = p_exam_id
    group by q.group_code order by q.group_code
  ) x;

  update exams set
    finished_at = now(), total_score = v_total,
    max_score = v_max, breakdown = v_break
  where id = p_exam_id;

  -- Mavzu testi: o'zlashtirish sharti
  if v_exam.kind = 'mavzu' and v_exam.lesson_id is not null then
    v_pct := case when v_max > 0 then v_total::numeric / v_max else 0 end;

    -- Har konstruktda kamida bitta to'g'ri javob bormi?
    select bool_and(has_correct) into v_all_constructs from (
      select bool_or(coalesce(is_correct, false)) as has_correct
      from exam_items where exam_id = p_exam_id group by construct_id
    ) c;

    insert into user_lesson_progress (user_id, lesson_id, attempts, best_score)
    values (v_user, v_exam.lesson_id, 1, v_total)
    on conflict (user_id, lesson_id) do update set
      attempts   = user_lesson_progress.attempts + 1,
      best_score = greatest(coalesce(user_lesson_progress.best_score, 0), v_total);

    if v_pct >= 0.75 and coalesce(v_all_constructs, false) then
      update user_lesson_progress set mastered_at = coalesce(mastered_at, now())
      where user_id = v_user and lesson_id = v_exam.lesson_id;
      update exams set passed = true where id = p_exam_id;
    else
      update exams set passed = false where id = p_exam_id;
    end if;
  end if;

  if v_exam.kind = 'bolim' and v_exam.module_id is not null then
    insert into user_module_progress (user_id, module_id, exam_best_score)
    values (v_user, v_exam.module_id, v_total)
    on conflict (user_id, module_id) do update set
      exam_best_score = greatest(
        coalesce(user_module_progress.exam_best_score, 0), v_total);
  end if;

  select * into v_exam from exams where id = p_exam_id;
  return jsonb_build_object(
    'exam_id', v_exam.id, 'total_score', v_exam.total_score,
    'max_score', v_exam.max_score, 'passed', v_exam.passed,
    'breakdown', v_exam.breakdown, 'already_finished', false
  );
end $$;
```

---

## `get_review`

Kalit va tushuntirish **faqat shu yerda** ochiladi, faqat tugagan sinov uchun.

```sql
create or replace function get_review(p_exam_id uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_ok   boolean;
begin
  if v_user is null then raise exception 'auth_required'; end if;

  select finished_at is not null into v_ok
  from exams where id = p_exam_id and user_id = v_user;

  if v_ok is null then raise exception 'sinov_topilmadi'; end if;
  if not v_ok  then raise exception 'sinov_tugamagan'; end if;

  return (
    select jsonb_agg(jsonb_build_object(
      'order_idx',   ei.order_idx,
      'stem_md',     q.stem_md,
      'format',      q.format,
      'construct',   c.title_uz,
      'construct_slug', c.slug,
      'user_answer', ei.user_answer,
      'is_correct',  ei.is_correct,
      'key',         k.payload,
      'explanation_md', k.explanation_md
    ) order by ei.order_idx)
    from exam_items ei
    join questions q on q.id = ei.question_id
    join constructs c on c.id = ei.construct_id
    join question_keys k on k.question_id = q.id
    where ei.exam_id = p_exam_id
  );
end $$;
```

---

## Qolgan funksiyalar

```sql
create or replace function mark_lesson_read(p_lesson_id uuid)
returns void
language sql security definer set search_path = public as $$
  insert into user_lesson_progress (user_id, lesson_id, read_at)
  values (auth.uid(), p_lesson_id, now())
  on conflict (user_id, lesson_id) do update
    set read_at = coalesce(user_lesson_progress.read_at, now());
$$;

create or replace function get_due_reviews()
returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'construct_id', c.id, 'title_uz', c.title_uz,
    'group_code', c.group_code, 'due_at', ucs.due_at,
    'accuracy', round(ucs.correct::numeric / nullif(ucs.attempts, 0), 2)
  ) order by ucs.due_at), '[]'::jsonb)
  from user_construct_stats ucs
  join constructs c on c.id = ucs.construct_id
  where ucs.user_id = auth.uid() and ucs.due_at <= now();
$$;
```

---

## Ruxsatlar

```sql
revoke all on function start_exam, generate_topic_test, submit_answer,
  finish_exam, get_review, get_due_reviews, mark_lesson_read from public;

grant execute on function start_exam(exam_kind, uuid)          to anon, authenticated;
grant execute on function generate_topic_test(uuid)            to anon, authenticated;
grant execute on function submit_answer(uuid, uuid, jsonb, int) to anon, authenticated;
grant execute on function finish_exam(uuid)                    to anon, authenticated;
grant execute on function get_review(uuid)                     to anon, authenticated;
grant execute on function get_due_reviews()                    to anon, authenticated;
grant execute on function mark_lesson_read(uuid)               to anon, authenticated;

-- Ichki yordamchilar tashqaridan chaqirilmaydi
revoke all on function pick_questions, pick_module_questions, pick_due_questions,
  pick_weak_questions, pick_lesson_extra, attach_questions, exam_payload,
  apply_sm2, check_answer from public, anon, authenticated;
```

---

## Test stsenariylari

Agent quyidagilarni tekshirishi shart:

1. `anon` roli bilan `select * from question_keys` → 0 qator
2. `exam_payload` natijasida `explanation` yoki `correct` so'zi yo'q
3. `submit_answer` mock rejimida faqat `{saved: true}` qaytaradi
4. `get_review` tugamagan sinovda `sinov_tugamagan` xatosini beradi
5. `finish_exam` ikki marta chaqirilsa — ikkinchisida `already_finished: true`
6. Vaqt tugagandan keyin `submit_answer` → `{error: 'vaqt_tugadi'}`
7. Boshqa foydalanuvchining `exam_id` si bilan → `sinov_topilmadi`
8. Mock uchun savol yetmasa → `savol_yetarli_emas` aniq xato

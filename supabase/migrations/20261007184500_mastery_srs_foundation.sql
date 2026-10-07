-- T-034: versioned mastery evidence + fixed 1/3/7/14/30 review foundation.
--
-- Goals:
-- - preserve the existing user_construct_stats API surface;
-- - add append-only first-attempt evidence and cognitive counters;
-- - make review intervals deterministic (1, 3, 7, 14, 30 days);
-- - expose explicit learning/provisional/stable/regressed states;
-- - keep learner writes server-authoritative through submit_answer.

begin;

do $$
begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'mastery_status'
  ) then
    create type public.mastery_status as enum (
      'learning',
      'provisional',
      'stable',
      'regressed'
    );
  end if;

  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'mastery_evidence_kind'
  ) then
    create type public.mastery_evidence_kind as enum (
      'independent',
      'guided',
      'retry',
      'invalid'
    );
  end if;
end
$$;

alter table public.user_construct_stats
  add column if not exists mastery_status public.mastery_status not null default 'learning',
  add column if not exists review_stage smallint not null default 0,
  add column if not exists independent_attempts int not null default 0,
  add column if not exists guided_attempts int not null default 0,
  add column if not exists retry_attempts int not null default 0,
  add column if not exists bilish_attempts int not null default 0,
  add column if not exists bilish_correct int not null default 0,
  add column if not exists qollash_attempts int not null default 0,
  add column if not exists qollash_correct int not null default 0,
  add column if not exists mulohaza_attempts int not null default 0,
  add column if not exists mulohaza_correct int not null default 0,
  add constraint user_construct_stats_review_stage_check
    check (review_stage between 0 and 5),
  add constraint user_construct_stats_evidence_counts_check
    check (
      independent_attempts >= 0
      and guided_attempts >= 0
      and retry_attempts >= 0
      and bilish_attempts >= bilish_correct
      and qollash_attempts >= qollash_correct
      and mulohaza_attempts >= mulohaza_correct
      and bilish_correct >= 0
      and qollash_correct >= 0
      and mulohaza_correct >= 0
    );

update public.user_construct_stats
set
  review_stage = least(greatest(streak, 0), 5),
  mastery_status = case
    when streak >= 5 then 'stable'::public.mastery_status
    when streak >= 2 then 'provisional'::public.mastery_status
    else 'learning'::public.mastery_status
  end
where attempts > 0;

create table if not exists public.mastery_evidence (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  construct_id   uuid not null references public.constructs(id) on delete cascade,
  question_id    uuid not null references public.questions(id) on delete restrict,
  exam_id        uuid not null references public.exams(id) on delete cascade,
  exam_item_id   uuid not null references public.exam_items(id) on delete cascade,
  cognitive      public.cognitive_level not null,
  evidence_kind  public.mastery_evidence_kind not null,
  is_correct     boolean not null,
  observed_at    timestamptz not null default now(),
  unique (exam_item_id)
);

create index if not exists mastery_evidence_user_construct_idx
  on public.mastery_evidence (user_id, construct_id, observed_at desc);

alter table public.mastery_evidence enable row level security;

drop policy if exists "mastery_evidence_self_read" on public.mastery_evidence;
create policy "mastery_evidence_self_read"
  on public.mastery_evidence
  for select
  to authenticated
  using (user_id = auth.uid() or public.auth_role() = 'admin');

grant select on public.mastery_evidence to authenticated;
revoke insert, update, delete on public.mastery_evidence from authenticated, anon;

create or replace function public.capture_mastery_evidence()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
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
$$;

drop trigger if exists capture_mastery_evidence on public.exam_items;
create trigger capture_mastery_evidence
  after update of answered_at, is_correct on public.exam_items
  for each row
  when (old.answered_at is null and new.answered_at is not null)
  execute function public.capture_mastery_evidence();

-- Backward-compatible name retained because submit_answer already calls apply_sm2.
-- The scheduler is now deterministic and version-1 mastery states are explicit:
--   stage 1 => learning, due +1 day
--   stage 2..4 => provisional, due +3/+7/+14 days
--   stage 5 => stable, due +30 days
-- A wrong answer after provisional/stable becomes regressed and is due next day.
create or replace function public.apply_sm2(
  p_user uuid,
  p_construct uuid,
  p_correct boolean
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_row public.user_construct_stats;
  v_stage int;
  v_interval int;
  v_status public.mastery_status;
begin
  insert into public.user_construct_stats (user_id, construct_id)
  values (p_user, p_construct)
  on conflict (user_id, construct_id) do nothing;

  select * into v_row
  from public.user_construct_stats
  where user_id = p_user and construct_id = p_construct
  for update;

  if p_correct then
    v_stage := least(v_row.review_stage + 1, 5);
    v_interval := case v_stage
      when 1 then 1
      when 2 then 3
      when 3 then 7
      when 4 then 14
      else 30
    end;
    v_status := case
      when v_stage = 5 then 'stable'::public.mastery_status
      when v_stage >= 2 then 'provisional'::public.mastery_status
      else 'learning'::public.mastery_status
    end;
  else
    v_stage := 0;
    v_interval := 1;
    v_status := case
      when v_row.mastery_status in (
        'provisional'::public.mastery_status,
        'stable'::public.mastery_status
      ) then 'regressed'::public.mastery_status
      else 'learning'::public.mastery_status
    end;
  end if;

  update public.user_construct_stats
  set
    attempts = v_row.attempts + 1,
    correct = v_row.correct + case when p_correct then 1 else 0 end,
    streak = case when p_correct then v_row.streak + 1 else 0 end,
    review_stage = v_stage,
    interval_days = v_interval,
    due_at = now() + make_interval(days => v_interval),
    last_seen_at = now(),
    mastery_status = v_status
  where user_id = p_user
    and construct_id = p_construct;
end
$$;

commit;

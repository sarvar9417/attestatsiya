-- Learner curriculum and official assessment are separate taxonomy axes.
-- Existing remote rows remain addressable; the official seed reconciles them
-- by subject/order and then makes module codes mandatory.

do $$
begin
  create type public.exam_section as enum (
    'specialty',
    'professional_standard',
    'pedagogy',
    'methodology'
  );
exception
  when duplicate_object then null;
end
$$;

alter table public.modules
  add column if not exists code text,
  add column if not exists exam_section public.exam_section,
  add column if not exists exam_question_count int;

alter table public.modules
  drop constraint if exists modules_exam_question_count_check;

alter table public.modules
  add constraint modules_exam_question_count_check
  check (exam_question_count is null or exam_question_count between 0 and 50);

create unique index if not exists modules_subject_code_unique
  on public.modules (subject_id, code)
  where code is not null;

alter table public.constructs
  add column if not exists is_active boolean not null default true;

create index if not exists constructs_active_group_idx
  on public.constructs (subject_id, group_code)
  where is_active;

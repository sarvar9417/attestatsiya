-- Review pipeline metadata for private pedagogy PDF candidates.
-- Raw source text remains service-role-only.

begin;

alter table public.pedagogy_pdf_source_candidates
  add column if not exists mapped_construct_id uuid references public.constructs(id) on delete set null,
  add column if not exists mapping_confidence text not null default 'untriaged'
    check(mapping_confidence in ('untriaged','high','medium','low','ambiguous')),
  add column if not exists duplicate_of_candidate_id uuid references public.pedagogy_pdf_source_candidates(id) on delete set null,
  add column if not exists near_duplicate_of_candidate_id uuid references public.pedagogy_pdf_source_candidates(id) on delete set null,
  add column if not exists verification_basis text not null default ''
    check(length(verification_basis)<=4000),
  add column if not exists source_quality_flags text[] not null default '{}'::text[];

do $triage_constraints$
begin
  if not exists (
    select 1 from pg_constraint
    where conname='pedagogy_pdf_candidate_no_self_exact_duplicate'
      and conrelid='public.pedagogy_pdf_source_candidates'::regclass
  ) then
    alter table public.pedagogy_pdf_source_candidates
      add constraint pedagogy_pdf_candidate_no_self_exact_duplicate
      check(duplicate_of_candidate_id is null or duplicate_of_candidate_id<>id);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname='pedagogy_pdf_candidate_no_self_near_duplicate'
      and conrelid='public.pedagogy_pdf_source_candidates'::regclass
  ) then
    alter table public.pedagogy_pdf_source_candidates
      add constraint pedagogy_pdf_candidate_no_self_near_duplicate
      check(near_duplicate_of_candidate_id is null or near_duplicate_of_candidate_id<>id);
  end if;
end
$triage_constraints$;

create index if not exists idx_pedagogy_pdf_candidate_mapped_construct
  on public.pedagogy_pdf_source_candidates(mapped_construct_id, mapping_confidence);

create index if not exists idx_pedagogy_pdf_candidate_duplicate
  on public.pedagogy_pdf_source_candidates(duplicate_of_candidate_id);

create index if not exists idx_pedagogy_pdf_candidate_near_duplicate
  on public.pedagogy_pdf_source_candidates(near_duplicate_of_candidate_id);

do $$
begin
  if exists(
    select 1
    from public.pedagogy_pdf_source_candidates c
    where c.duplicate_of_candidate_id=c.id
       or c.near_duplicate_of_candidate_id=c.id
  ) then
    raise exception 'PEDAGOGY_PDF self duplicate reference detected';
  end if;
end
$$;

commit;

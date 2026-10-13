-- General pedagogy attestation bucket for source candidates that belong to
-- pedagogical-attestation preparation but do not safely map to a single official construct.
-- This preserves official construct integrity while honoring general/challenging attestation items.

begin;

alter table public.pedagogy_pdf_source_candidates
  add column if not exists attestation_bucket text not null default 'official_construct';

alter table public.pedagogy_pdf_source_candidates
  drop constraint if exists pedagogy_pdf_source_candidates_attestation_bucket_check;

alter table public.pedagogy_pdf_source_candidates
  add constraint pedagogy_pdf_source_candidates_attestation_bucket_check
  check(attestation_bucket in (
    'official_construct',
    'general_pedagogy',
    'general_professional_standard',
    'cross_construct',
    'quarantine'
  ));

alter table public.pedagogy_pdf_source_candidates
  drop constraint if exists pedagogy_pdf_source_candidates_editorial_status_check;

alter table public.pedagogy_pdf_source_candidates
  add constraint pedagogy_pdf_source_candidates_editorial_status_check
  check(editorial_status in ('needs_review','verified','accepted_general','rejected'));

-- Snapshot exactly the rows eligible for general-pedagogy acceptance in this run.
create temporary table _general_pedagogy_target(id uuid primary key) on commit drop;

insert into _general_pedagogy_target(id)
select id
from public.pedagogy_pdf_source_candidates
where editorial_status='rejected'
  and source_quality_flags @> array['editorial_reject_no_safe_mapping']
  and answer_key_status='source_marker_unverified'
  and duplicate_of_candidate_id is null
  and near_duplicate_of_candidate_id is null
  and not (source_quality_flags @> array['answer_parse_bleed'])
  and not (source_quality_flags @> array['known_source_key_conflict']);

-- Existing rows with a safe construct remain official-construct records.
update public.pedagogy_pdf_source_candidates
   set attestation_bucket='official_construct'
 where mapped_construct_id is not null
   and editorial_status in ('verified','needs_review');

-- The 335 previously quarantined only because a single safe official construct could
-- not be assigned are valid general pedagogy attestation source material.
-- Do NOT invent a construct and do NOT verify the historical answer automatically.
update public.pedagogy_pdf_source_candidates
   set editorial_status='accepted_general',
       attestation_bucket='general_pedagogy',
       mapped_construct_id=null,
       mapping_confidence='ambiguous',
       reviewed_at=coalesce(reviewed_at,now()),
       source_quality_flags=(
         select coalesce(array_agg(distinct x order by x),'{}'::text[])
         from unnest(
           array_remove(pedagogy_pdf_source_candidates.source_quality_flags,'editorial_reject_no_safe_mapping')
           || array['general_pedagogy_attestation']
         ) x
       ),
       review_notes=case
         when review_notes like '%Final disposition: REJECTED — no safe official construct mapping.%'
           then replace(
             review_notes,
             'Final disposition: REJECTED — no safe official construct mapping. Source retained privately; no construct was invented.',
             'Final disposition revised by user instruction: ACCEPTED as general pedagogy attestation material. No single official construct is invented; historical answer remains unverified until separately checked.'
           )
         when review_notes not like '%ACCEPTED as general pedagogy attestation material%'
           then trim(both E'\n' from review_notes || E'\nFinal disposition revised by user instruction: ACCEPTED as general pedagogy attestation material. No single official construct is invented; historical answer remains unverified until separately checked.')
         else review_notes
       end
 where id in (select id from _general_pedagogy_target);

-- Other rejected/quarantined provenance rows remain quarantine.
update public.pedagogy_pdf_source_candidates
   set attestation_bucket='quarantine'
 where editorial_status='rejected'
   and attestation_bucket='official_construct';

do $assert$
declare
  v_target int;
  v_general int;
begin
  select count(*) into v_target from _general_pedagogy_target;

  select count(*) into v_general
  from public.pedagogy_pdf_source_candidates p
  join _general_pedagogy_target t on t.id=p.id
  where p.editorial_status='accepted_general'
    and p.attestation_bucket='general_pedagogy';

  if v_general<>v_target then
    raise exception 'general-pedagogy acceptance mismatch: target %, accepted %',v_target,v_general;
  end if;

  if exists(
    select 1
    from public.pedagogy_pdf_source_candidates
    where editorial_status='accepted_general'
      and (
        attestation_bucket<>'general_pedagogy'
        or mapped_construct_id is not null
        or answer_key_status<>'source_marker_unverified'
        or duplicate_of_candidate_id is not null
        or near_duplicate_of_candidate_id is not null
        or source_quality_flags @> array['answer_parse_bleed']
        or source_quality_flags @> array['known_source_key_conflict']
      )
  ) then
    raise exception 'accepted_general safety invariant failed';
  end if;
end
$assert$;

commit;

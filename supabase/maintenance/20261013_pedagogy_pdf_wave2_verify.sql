-- Wave 2: independently verify a conservative set of private PDF source candidates.
-- This does NOT publish learner questions. It only upgrades source-candidate provenance
-- when the historical answer is explicitly supported by the canonical M14/M15/M16 lesson.

begin;

create temporary table _ped_wave2_verify(
  candidate_id uuid primary key,
  construct_code text not null,
  basis text not null
) on commit drop;

insert into _ped_wave2_verify(candidate_id,construct_code,basis) values
('02778030-c9f2-4c5b-8397-05a7be9b37e4','KS.01','Canonical KS.01 lesson explicitly requires clear measurable outcomes, timed tasks and planning aligned to learner needs.'),
('899eedc0-0e18-410e-aa82-6c03718432cf','KS.02','Canonical KS.02 lesson explicitly includes rational management of lesson time and purposeful use of demonstration/distribution materials.'),
('699557f3-1844-485b-9b37-e824c906a845','KS.03','Canonical KS.03 lesson defines diagnostic assessment as checking the learner starting state before a new learning cycle.'),
('a00bb116-a47f-4184-a4a0-9d170da84fa9','KS.04','Canonical KS.04 lesson explicitly supports learner self-governance, initiative, civic participation and structured extracurricular activity.'),
('129994d7-9201-4ba2-acf6-101b5a907772','KS.05','Canonical KS.05 lesson defines a safe developing environment through equal participation, anti-discrimination and support for diverse educational needs.'),
('2db4abf0-ac81-4ad1-9a8f-7fe67dacbdb3','KS.06','Canonical KS.06 lesson defines professional reflection as evidence-based self-analysis followed by a concrete improvement step.'),
('4699a03d-44ba-49a5-94d4-7e5daa63d6de','KS.07','Canonical KS.07 lesson requires solution-focused cooperation with parents and other relevant participants around learner development.'),
('1e1ecf50-d2ce-4451-b94c-b8becdb5cec4','PM.GEN.01','Canonical PM.GEN.01 theory defines pedagogical observation as purposeful, systematic and continuous evidence collection in the educational process.'),
('4c02e22d-ae53-4dc1-af37-a87ce051104f','PM.GEN.05','Canonical PM.GEN.05 lesson lists clubs, optional sessions, teacher consultation, excursions and learner conferences as auxiliary forms that may support learners.'),
('1759c2fc-cf61-4129-89f0-745309eb8de4','PM.GEN.06','Canonical PM.GEN.06 lesson defines pedagogical tact as ethical principles and respectful professional conduct applied in a concrete communication situation.'),
('2f1459cf-a26f-433b-a401-1be75e799ef4','PM.GEN.07','Canonical PM.GEN.07 lesson explicitly identifies pedagogical imagination/foresight as anticipating likely learner states, reactions and difficulties.'),
('f2bd1f89-af2d-47f9-9f02-c6518c2aaca0','PM.GEN.08','Canonical PM.GEN.08 lesson defines differentiated learning as adapting task, support, pace or complexity to learner readiness and need.'),
('37e40107-87f7-4ea6-9122-e1ecd00764b1','PM.MET.02','Canonical PM.MET.02 lesson treats identifying central ideas, comparing, generalising and systematising as a legitimate method-selection pattern.');

do $wave2$
declare
  bad_count int;
begin
  select count(*) into bad_count
  from _ped_wave2_verify v
  left join public.pedagogy_pdf_source_candidates p on p.id=v.candidate_id
  where p.id is null
     or p.duplicate_of_candidate_id is not null
     or p.near_duplicate_of_candidate_id is not null
     or p.answer_key_status='conflict'
     or p.source_quality_flags @> array['answer_parse_bleed'];

  if bad_count<>0 then
    raise exception 'wave2 verification contains missing/duplicate/conflict/parse-bleed candidate(s): %',bad_count;
  end if;

  if exists(
    select 1 from _ped_wave2_verify v
    left join public.constructs c on c.code=v.construct_code and c.is_active
    where c.id is null
  ) then
    raise exception 'wave2 verification construct missing';
  end if;
end
$wave2$;

update public.pedagogy_pdf_source_candidates p
   set mapped_construct_id=c.id,
       mapping_confidence='high',
       suggested_constructs=array[v.construct_code],
       answer_key_status='independently_verified',
       editorial_status='verified',
       verification_basis=v.basis,
       reviewed_at=coalesce(p.reviewed_at,now()),
       review_notes=case
         when p.review_notes='' then 'Wave 2 independent source-to-canonical-theory verification completed.'
         when p.review_notes not like '%Wave 2 independent source-to-canonical-theory verification completed.%'
           then p.review_notes || E'\nWave 2 independent source-to-canonical-theory verification completed.'
         else p.review_notes
       end
  from _ped_wave2_verify v
  join public.constructs c on c.code=v.construct_code and c.is_active
 where p.id=v.candidate_id;

do $wave2_assert$
begin
  if (
    select count(*)
    from public.pedagogy_pdf_source_candidates p
    join _ped_wave2_verify v on v.candidate_id=p.id
    where p.editorial_status='verified'
      and p.answer_key_status='independently_verified'
      and p.mapping_confidence='high'
      and p.mapped_construct_id is not null
  ) <> 13 then
    raise exception 'wave2 expected 13 independently verified source candidates';
  end if;
end
$wave2_assert$;

commit;

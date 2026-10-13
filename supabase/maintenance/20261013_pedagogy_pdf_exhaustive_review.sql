-- Exhaustive editorial disposition for the current private pedagogy PDF review queue.
-- Goal: every candidate that is currently needs_review receives a final, auditable disposition.
-- SAFE RULE:
--   * VERIFIED only when the historical source marker is uniquely supported by an explicit
--     canonical M14/M15/M16 concept rule.
--   * everything else is retained privately but REJECTED for learner-bank derivation.
-- Nothing is deleted. No learner question is auto-published.

begin;

create temporary table _ped_exhaustive_target(
  id uuid primary key
) on commit drop;

insert into _ped_exhaustive_target(id)
select id
from public.pedagogy_pdf_source_candidates
where editorial_status='needs_review';

create temporary table _ped_exhaustive_rule(
  construct_code text not null,
  answer_pattern text not null,
  question_required_pattern text not null default ''
) on commit drop;

insert into _ped_exhaustive_rule(construct_code,answer_pattern,question_required_pattern) values
('KS.01','(o.?quv jarayonini rejalashtirish|o.?quv jarayonini rejatashtirish|o.?quv dasturini moslashtirish|aniq va o.?lchanadigan natijalar|fanlararo kompetens|davlat ta.?lim standartlari.*o.?quv rejalarini ishlab chiqish|dars vaqtini oqilona rejalashtirish.*maqsad.*shakl.*usul)',''),
('KS.02','(ta.?lim samaradorligini ta.?minlash|dars vaqtini oqilona boshqarish|dars vaqtidan oqilona tashkillashtirish|darsga qiziqtirishda turli usullardan foydalanish|jamoaviy.*loyiha|metakognitiv|dars maqsadlari asosida.*erishimli.*vazifa|dars mavzusiga mos.*namoyish.*tarqatma|har bir o.?quvchiga.*g.?oyalari.*ifoda etish|har bir o.?quvchiga aniq rol.*guruh ishini)',''),
('KS.03','(diagnostik|formativ|summativ)','(baholash|nazorat|bilim)'),
('KS.03','(qayta aloqa|baholash natijalar|ta.?lim natijalarini baholash|dars rejasi va usullarini moslashtirishda tahlil natijalaridan foydalanish|maqsadga qay darajada erishganligini ko.?rsatish)',''),
('KS.04','(tarbiyaviy faoliyatni tashkil etish|o.?zini o.?zi boshqar|fuqarolik kompetens|tashabbuskorlik.*fuqarolik)',''),
('KS.05','(xavfsiz.*ta.?lim muhiti|xavfsiz.*qo.?llab.quvvatlovchi|teng.*sharoit|kamsitish.*yo.?l qo.?ymas|bola huquqlari to.?g.?risidagi.*konvens)',''),
('KS.06','(refleksiya|kasbiy refleksiya|o.?z faoliyatini tahlil|kasbiy rivojlanish ehtiyoj|malaka oshirish|fanga oid adabiyot.*amaliyot|o.?z.?o.?zini rivojlantirish va kasbiy o.?sish)',''),
('KS.07','(ota.?onalar.*hamkorlik|ota.?onalar.*ta.?lim jarayoniga jalb|mutaxassislar.*hamkorlik|hamkasblar.*hamkorlik)',''),

('PM.GEN.01','(pedagogik kuzatish metodi?|anketa metodi?|intervyu metodi?|test metodi?|pedagogik tajriba.*metodi?|matematik.?statistik metod|didaktik tahlil|psixologik tahlil|metodologik tahlil|bolalar ijodini o.?rganish metodi)',''),
('PM.GEN.01','^(bilish|tushunish|qo.?llash|tahlil|baholash|yaratish)$','(blum|bloom|taksonom)'),
('PM.GEN.01','^(deduksiya|deduksiya metodi|induksiya|induktiv metod|analogiya)$',''),
('PM.GEN.01','(gumanistik paradigma|noinstitutsional paradigma|ratsionalistik paradigma)',''),

('PM.GEN.02','(onglilik.*faollik|ko.?rgazmalilik|tizimlilik.*muntazam|ilmiylik|tushunarlilik|nazariya.*amaliyot.*birligi|tarbiyaviylik).*tamoyil',''),
('PM.GEN.03','(aqliy|axloqiy|jismoniy|mehnat|estetik|ekologik|huquqiy|iqtisodiy|fuqarolik|vatanparvarlik) tarbiya',''),

('PM.GEN.04','(aralash dars|amaliy dars|laboratoriya dars|labaratoriya dars|ekskursiya dars|konferensiya dars|yangi bilim.*dars|mustahkamlash dars|umumlashtirish.*dars|nazorat dars|sinov.*dars|tekshiruv.*dars)',''),
('PM.GEN.04','^(demokratik|demokratik uslub|demokratik tamoyil|avtoritar|avtoritar uslub|liberal|liberal uslub)$',''),

('PM.GEN.05','(fan to.?garak|fakultativ mashg.?ulot|o.?qituvchi maslahati|o.?quv ekskursiya|o.?quv konferensiya)','(sinf rahbar|ta.?limni tashkil|yordam)'),

('PM.GEN.06','(pedagogik takt|pedagogik nazokat|pedagogik etika|pedagogik texnika)',''),
('PM.GEN.06','^(mimika|pantomimika|monolog|dialog|polilog|tembr|ritmika|artikulyatsiya|diksiya|diapazon)$',''),
('PM.GEN.06','(kommunikativ muloqot|interaktiv muloqot|perseptiv muloqot)',''),

('PM.GEN.07','(akademik|bilish|didaktik|kommunikativ|perseptiv|empatik|hamdardlik|tashkilotchilik|konstruktiv|mantiqiy|avtoritar).*qob',''),
('PM.GEN.07','(voqealarni oldindan ko.?ra olish qobiliyat|pedagogik xayol)',''),

('PM.GEN.08','(muammoli ta.?lim|interfaol ta.?lim|interaktiv mashg.?ulot|loyiha.*ta.?lim|differensial|integratsion ta.?lim|masofaviy ta.?lim|modulli ta.?lim|individual ta.?lim|individual yondashuv|o.?yinli ta.?lim|inklyuziv ta.?lim|akvarium|asalari galasi|ajurli arra|jigsaw|keys.?stadi)',''),
('PM.GEN.08','^(umumpedagogik|xususiy.metodik|lokal) daraja$',''),

('PM.MET.01','(o.?zining ta.?lim faoliyatini tahlil.*modifikasiy|informatika.*metodik)','(informatika|algoritm|dasturlash)'),
('PM.MET.02','^(muammoli bayon|evristik|evristik metod|suhbat metodi|amaliy metod|bosh g.?oyani ajratish metodi|klassifikatsiyalash metodi|abstraksiyalash metodi|illyustratsiya metodi|didaktik o.?yin)$',''),
('PM.MET.03','(pedagogik va psixologik bilimlardan foydalan.*pedagogik vaziyat.*tahlil)','');

create temporary table _ped_exhaustive_hit on commit drop as
select p.id,r.construct_code
from public.pedagogy_pdf_source_candidates p
join _ped_exhaustive_target t on t.id=p.id
join _ped_exhaustive_rule r
  on lower(regexp_replace(coalesce(p.raw_answer_private,''),'[[:space:]]+',' ','g')) ~* r.answer_pattern
 and (
   r.question_required_pattern=''
   or lower(regexp_replace(coalesce(p.raw_question_private,''),'[[:space:]]+',' ','g')) ~* r.question_required_pattern
 );

create temporary table _ped_exhaustive_safe on commit drop as
select h.id,min(h.construct_code) as construct_code
from _ped_exhaustive_hit h
join public.pedagogy_pdf_source_candidates p on p.id=h.id
where p.answer_key_status<>'conflict'
  and p.duplicate_of_candidate_id is null
  and p.near_duplicate_of_candidate_id is null
  and not (p.source_quality_flags @> array['answer_parse_bleed'])
group by h.id
having count(distinct h.construct_code)=1;

do $guard$
begin
  if exists(
    select 1
    from _ped_exhaustive_safe s
    left join public.constructs c
      on c.code=s.construct_code and c.is_active
    where c.id is null
  ) then
    raise exception 'exhaustive review rule points to missing/inactive construct';
  end if;
end
$guard$;

-- 1) Canonically verifiable source markers.
update public.pedagogy_pdf_source_candidates p
   set mapped_construct_id=c.id,
       mapping_confidence='high',
       suggested_constructs=array[s.construct_code],
       answer_key_status='independently_verified',
       editorial_status='verified',
       verification_basis=
         'Exhaustive review 2026-10-13: historical answer marker independently reconciled to an explicit canonical M14/M15/M16 concept rule.',
       reviewed_at=now(),
       source_quality_flags=(
         select coalesce(array_agg(distinct x order by x),'{}'::text[])
         from unnest(p.source_quality_flags || array['canonical_rule_verified']) x
       ),
       review_notes=case
         when p.review_notes='' then
           'Final disposition: VERIFIED against canonical theory. This does not auto-publish a learner question.'
         when p.review_notes not like '%Final disposition: VERIFIED against canonical theory.%' then
           p.review_notes || E'\nFinal disposition: VERIFIED against canonical theory. This does not auto-publish a learner question.'
         else p.review_notes
       end
  from _ped_exhaustive_safe s
  join public.constructs c on c.code=s.construct_code and c.is_active
  join _ped_exhaustive_target t on t.id=s.id
 where p.id=s.id
   and p.answer_key_status<>'conflict'
   and p.duplicate_of_candidate_id is null
   and p.near_duplicate_of_candidate_id is null
   and not (p.source_quality_flags @> array['answer_parse_bleed']);

-- 2) Known answer/terminology conflicts: retain raw provenance, reject learner derivation.
update public.pedagogy_pdf_source_candidates p
   set editorial_status='rejected',
       reviewed_at=now(),
       source_quality_flags=(
         select coalesce(array_agg(distinct x order by x),'{}'::text[])
         from unnest(p.source_quality_flags || array['editorial_reject_source_conflict']) x
       ),
       review_notes=case
         when p.review_notes not like '%Final disposition: REJECTED — source answer/terminology conflict.%'
           then trim(both E'\n' from p.review_notes || E'\nFinal disposition: REJECTED — source answer/terminology conflict. Raw source retained privately.')
         else p.review_notes
       end
  from _ped_exhaustive_target t
 where p.id=t.id
   and p.editorial_status='needs_review'
   and p.answer_key_status='conflict';

-- 3) Exact duplicate provenance rows.
update public.pedagogy_pdf_source_candidates p
   set editorial_status='rejected',
       reviewed_at=now(),
       source_quality_flags=(
         select coalesce(array_agg(distinct x order by x),'{}'::text[])
         from unnest(p.source_quality_flags || array['editorial_reject_exact_duplicate']) x
       ),
       review_notes=case
         when p.review_notes not like '%Final disposition: REJECTED — exact duplicate provenance row.%'
           then trim(both E'\n' from p.review_notes || E'\nFinal disposition: REJECTED — exact duplicate provenance row. Representative source is retained separately.')
         else p.review_notes
       end
  from _ped_exhaustive_target t
 where p.id=t.id
   and p.editorial_status='needs_review'
   and p.duplicate_of_candidate_id is not null;

-- 4) Conservative near-duplicate provenance rows.
update public.pedagogy_pdf_source_candidates p
   set editorial_status='rejected',
       reviewed_at=now(),
       source_quality_flags=(
         select coalesce(array_agg(distinct x order by x),'{}'::text[])
         from unnest(p.source_quality_flags || array['editorial_reject_near_duplicate']) x
       ),
       review_notes=case
         when p.review_notes not like '%Final disposition: REJECTED — near-duplicate provenance row.%'
           then trim(both E'\n' from p.review_notes || E'\nFinal disposition: REJECTED — near-duplicate provenance row. Raw source remains available for provenance.')
         else p.review_notes
       end
  from _ped_exhaustive_target t
 where p.id=t.id
   and p.editorial_status='needs_review'
   and p.near_duplicate_of_candidate_id is not null;

-- 5) Parser bleed: source extraction is not atomic enough for a reliable learner item.
update public.pedagogy_pdf_source_candidates p
   set editorial_status='rejected',
       extraction_confidence='needs_manual_parse',
       reviewed_at=now(),
       source_quality_flags=(
         select coalesce(array_agg(distinct x order by x),'{}'::text[])
         from unnest(p.source_quality_flags || array['editorial_reject_parse_bleed']) x
       ),
       review_notes=case
         when p.review_notes not like '%Final disposition: REJECTED — parser bleed/non-atomic extraction.%'
           then trim(both E'\n' from p.review_notes || E'\nFinal disposition: REJECTED — parser bleed/non-atomic extraction. Raw text retained privately; do not derive a learner key from this row.')
         else p.review_notes
       end
  from _ped_exhaustive_target t
 where p.id=t.id
   and p.editorial_status='needs_review'
   and p.source_quality_flags @> array['answer_parse_bleed'];

-- 6) Remaining candidates with no safe official mapping.
update public.pedagogy_pdf_source_candidates p
   set editorial_status='rejected',
       reviewed_at=now(),
       source_quality_flags=(
         select coalesce(array_agg(distinct x order by x),'{}'::text[])
         from unnest(p.source_quality_flags || array['editorial_reject_no_safe_mapping']) x
       ),
       review_notes=case
         when p.review_notes not like '%Final disposition: REJECTED — no safe official construct mapping.%'
           then trim(both E'\n' from p.review_notes || E'\nFinal disposition: REJECTED — no safe official construct mapping. Source retained privately; no construct was invented.')
         else p.review_notes
       end
  from _ped_exhaustive_target t
 where p.id=t.id
   and p.editorial_status='needs_review'
   and (
     p.mapped_construct_id is null
     or p.mapping_confidence in ('low','ambiguous')
   );

-- 7) A construct is known, but the historical answer marker was not independently
-- supported by the canonical rule set. Do not turn it into a learner key.
update public.pedagogy_pdf_source_candidates p
   set editorial_status='rejected',
       reviewed_at=now(),
       source_quality_flags=(
         select coalesce(array_agg(distinct x order by x),'{}'::text[])
         from unnest(p.source_quality_flags || array['editorial_reject_unverified_answer']) x
       ),
       review_notes=case
         when p.review_notes not like '%Final disposition: REJECTED — historical answer not independently verified.%'
           then trim(both E'\n' from p.review_notes || E'\nFinal disposition: REJECTED — historical answer not independently verified against canonical theory. Construct signal retained for provenance only.')
         else p.review_notes
       end
  from _ped_exhaustive_target t
 where p.id=t.id
   and p.editorial_status='needs_review';

do $assert$
declare
  v_target int;
  v_remaining int;
  v_verified int;
  v_rejected int;
begin
  select count(*) into v_target from _ped_exhaustive_target;

  select count(*) into v_remaining
  from public.pedagogy_pdf_source_candidates p
  join _ped_exhaustive_target t on t.id=p.id
  where p.editorial_status='needs_review';

  select count(*) into v_verified
  from public.pedagogy_pdf_source_candidates p
  join _ped_exhaustive_target t on t.id=p.id
  where p.editorial_status='verified';

  select count(*) into v_rejected
  from public.pedagogy_pdf_source_candidates p
  join _ped_exhaustive_target t on t.id=p.id
  where p.editorial_status='rejected';

  if v_remaining<>0 then
    raise exception 'exhaustive review incomplete: % target row(s) still needs_review',v_remaining;
  end if;

  if v_verified+v_rejected<>v_target then
    raise exception 'exhaustive review accounting mismatch: target %, verified %, rejected %',
      v_target,v_verified,v_rejected;
  end if;

  if exists(
    select 1
    from public.pedagogy_pdf_source_candidates p
    join _ped_exhaustive_target t on t.id=p.id
    where p.editorial_status='verified'
      and (
        p.answer_key_status<>'independently_verified'
        or p.mapped_construct_id is null
        or p.mapping_confidence<>'high'
      )
  ) then
    raise exception 'verified source candidate invariant failed';
  end if;
end
$assert$;

commit;

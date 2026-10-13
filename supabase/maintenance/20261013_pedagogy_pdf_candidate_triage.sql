-- Deterministic triage for private pedagogy PDF candidates.
-- High-confidence mappings only are promoted to mapped_construct_id.
-- Medium/ambiguous matches remain suggestions for editorial review.
-- Historical answer markers are NEVER auto-verified here.

begin;

-- 1) Exact duplicate provenance. Prefer the newest source-year, then lower question number.
with ranked as (
  select id,
         first_value(id) over (
           partition by text_sha256
           order by source_year desc, source_file_name, source_question_no, id
         ) as representative_id,
         row_number() over (
           partition by text_sha256
           order by source_year desc, source_file_name, source_question_no, id
         ) as rn
  from public.pedagogy_pdf_source_candidates
),
dups as (
  select id, representative_id
  from ranked
  where rn>1
)
update public.pedagogy_pdf_source_candidates c
   set duplicate_of_candidate_id=d.representative_id,
       source_quality_flags=(
         select array_agg(distinct x order by x)
         from unnest(c.source_quality_flags || array['exact_duplicate']) x
       ),
       review_notes=case
         when c.review_notes='' then 'Exact-text duplicate source candidate; retain for provenance, do not author a second learner item automatically.'
         when c.review_notes not like '%Exact-text duplicate source candidate%' then c.review_notes || E'\nExact-text duplicate source candidate; retain for provenance, do not author a second learner item automatically.'
         else c.review_notes
       end
  from dups d
 where c.id=d.id;

-- 2) Parser/source quality flags.
update public.pedagogy_pdf_source_candidates c
   set source_quality_flags=(
     select coalesce(array_agg(distinct f order by f),'{}'::text[])
     from unnest(
       c.source_quality_flags
       || case when nullif(btrim(c.raw_answer_private),'') is null then array['answer_missing'] else '{}'::text[] end
       || case when length(btrim(c.raw_question_private))<35 then array['question_very_short'] else '{}'::text[] end
       || case when coalesce(c.raw_answer_private,'') ~ E'(^|\\n)[[:space:]]*[0-9]{1,3}[.)]' then array['answer_parse_bleed'] else '{}'::text[] end
       || case when lower(c.raw_question_private) like '%mumkin emas%' or lower(c.raw_question_private) like '%noto''g''ri%' or lower(c.raw_question_private) like '%noto‘g‘ri%' then array['negative_wording_review'] else '{}'::text[] end
     ) f
   );

-- Known source issues identified during source audit.
update public.pedagogy_pdf_source_candidates
   set source_quality_flags=(
         select array_agg(distinct x order by x)
         from unnest(source_quality_flags || array['known_source_key_conflict']) x
       ),
       answer_key_status='conflict',
       verification_basis='Historical source marker conflicts with the wording: the source marks 2,4 as actions that MUST NOT be done although the scenario itself makes 1,3 the prohibited actions. Requires manual editorial resolution.',
       review_notes=case when review_notes=''
         then 'Known key conflict from 2026 source question 144; do not derive a learner key automatically.'
         else review_notes || E'\nKnown key conflict from 2026 source question 144; do not derive a learner key automatically.' end
 where source_year=2026
   and source_question_no=144
   and source_file_name like 'PedKasb tushgan testlar%';

update public.pedagogy_pdf_source_candidates
   set source_quality_flags=(
         select array_agg(distinct x order by x)
         from unnest(source_quality_flags || array['terminology_conflict_review']) x
       ),
       answer_key_status='conflict',
       verification_basis='Historical source labels backward reasoning from the required quantity toward givens as “Sintetik usul”; terminology is not accepted as canonical until independently reconciled.',
       review_notes=case when review_notes=''
         then 'Analitik/sintetik terminology requires independent source reconciliation.'
         else review_notes || E'\nAnalitik/sintetik terminology requires independent source reconciliation.' end
 where source_year=2026
   and source_question_no=14
   and source_file_name like 'PedKasb tushgan testlar%';

-- 3) Weighted construct rules. These are topic signals, not answer verification.
create temporary table _ped_rule(
  construct_code text not null,
  pattern text not null,
  weight integer not null
) on commit drop;

insert into _ped_rule(construct_code,pattern,weight) values
('KS.01','o.?quv jarayonini rejalashtirish',14),
('KS.01','dars reja',6),
('KS.01','aniq va o.?lchan',7),
('KS.01','fanlararo',5),
('KS.01','o.?quv dasturini mos',6),
('KS.01','dars maqsad',4),
('KS.01','rejalashtirish vazif',6),

('KS.02','ta.?lim samaradorligini ta.?minlash',14),
('KS.02','ta.?lim samaradorligi',7),
('KS.02','dars vaqtini oqilona',7),
('KS.02','jamoaviy va loyihaviy',6),
('KS.02','metakognitiv',7),
('KS.02','hayotiy ko.?nikma',5),
('KS.02','motivats',3),

('KS.03','o.?zlashtirishni baholash',14),
('KS.03','qayta aloqa',9),
('KS.03','diagnostik',7),
('KS.03','formativ',8),
('KS.03','summativ',8),
('KS.03','baholash natija',5),
('KS.03','baholash usul',4),
('KS.03','monitoring',4),

('KS.04','tarbiyaviy faoliyatni tashkil',14),
('KS.04','tarbiyaviy faoliyat',8),
('KS.04','emotsional.?qadriyat',7),
('KS.04','fuqarolik kompetens',6),
('KS.04','o.?zini o.?zi boshqar',6),
('KS.04','tarbiyaviy vaziyat',6),

('KS.05','xavfsiz.*rivojlantiruvchi',14),
('KS.05','bola huquqlari',8),
('KS.05','teng imkoniyat',7),
('KS.05','alohida ehtiyoj',7),
('KS.05','maxsus ta.?limiy ehtiyoj',8),
('KS.05','favqulodda',6),
('KS.05','texnika xavfsiz',6),
('KS.05','kamsit',6),

('KS.06','o.?z.?o.?zini rivojlantirish',14),
('KS.06','kasbiy o.?sish',12),
('KS.06','malaka oshirish',7),
('KS.06','ochiq dars',5),
('KS.06','o.?z faoliyatini tahlil',7),
('KS.06','kasbiy rivojlanish ehtiyoj',7),
('KS.06','refleksiya',4),

('KS.07','ota.?onalar bilan hamkorlik',13),
('KS.07','hamkasblar.*ota.?onalar',13),
('KS.07','ota.?onalarni ta.?lim',8),
('KS.07','ota.?onalarini ta.?lim',8),
('KS.07','mutaxassislar bilan hamkor',7),
('KS.07','mahalla',4),

('PM.GEN.01','pedagogik tadqiqot',10),
('PM.GEN.01','pedagogik kuzatish',8),
('PM.GEN.01','anketa metodi',8),
('PM.GEN.01','intervyu metodi',8),
('PM.GEN.01','test metodi',6),
('PM.GEN.01','pedagogik tajriba',8),
('PM.GEN.01','matematik.?statistik',8),
('PM.GEN.01','ta.?lim paradig',8),
('PM.GEN.01','gumanistik paradigma',9),
('PM.GEN.01','noinstitutsional paradigma',9),
('PM.GEN.01','ratsionalistik paradigma',9),
('PM.GEN.01','didaktik tahlil',8),
('PM.GEN.01','psixologik tahlil',8),
('PM.GEN.01','metodologik tahlil',8),
('PM.GEN.01','blum',6),
('PM.GEN.01','bloom',6),
('PM.GEN.01','taksonomi',6),
('PM.GEN.01','deduksiya',5),

('PM.GEN.02','ta.?limning qaysi tamoyil',13),
('PM.GEN.02','onglilik va faollik',10),
('PM.GEN.02','ko.?rgazmalilik',10),
('PM.GEN.02','tizimlilik',8),
('PM.GEN.02','ilmiylik',8),
('PM.GEN.02','tushunarlilik',8),
('PM.GEN.02','nazariya va amaliyot',8),
('PM.GEN.02','tarbiyaviylik tamoyil',8),

('PM.GEN.03','tarbiyaning qaysi turi',14),
('PM.GEN.03','estetik tarbiya',10),
('PM.GEN.03','aqliy tarbiya',10),
('PM.GEN.03','axloqiy tarbiya',10),
('PM.GEN.03','mehnat tarbiyasi',10),
('PM.GEN.03','ekologik tarbiya',10),
('PM.GEN.03','jismoniy tarbiya',10),
('PM.GEN.03','huquqiy tarbiya',10),
('PM.GEN.03','ishontirish usuli',7),

('PM.GEN.04','dars turi',10),
('PM.GEN.04','qaysi dars',7),
('PM.GEN.04','aralash dars',10),
('PM.GEN.04','sinov.*tekshiruv.*darsi',10),
('PM.GEN.04','mustahkamlash darsi',9),
('PM.GEN.04','yangi mavzuni.*darsi',9),
('PM.GEN.04','sinfni boshqarish.*uslub',13),
('PM.GEN.04','avtoritar uslub',10),
('PM.GEN.04','demokratik uslub',10),
('PM.GEN.04','liberal uslub',10),
('PM.GEN.04','demokratik',6),

('PM.GEN.05','sinf rahbar',13),
('PM.GEN.05','sinf jamoas',7),
('PM.GEN.05','fakultativ',6),
('PM.GEN.05','fan to.?garak',6),

('PM.GEN.06','pedagogik texnika',13),
('PM.GEN.06','pedagogik takt',13),
('PM.GEN.06','pedagogik nazokat',13),
('PM.GEN.06','nutq madaniyati',9),
('PM.GEN.06','nutqning asosiy',8),
('PM.GEN.06','monolog',7),
('PM.GEN.06','dialog',5),
('PM.GEN.06','mimika',9),
('PM.GEN.06','pantomimika',9),
('PM.GEN.06','muloqot turlari',8),
('PM.GEN.06','pedagogik etika',10),

('PM.GEN.07','pedagogik qobiliyat',13),
('PM.GEN.07','qaysi qobiliyat',9),
('PM.GEN.07','qobilyat',7),
('PM.GEN.07','qobiliyat',7),
('PM.GEN.07','kommunikativ qobiliyat',10),
('PM.GEN.07','perseptiv qobiliyat',10),
('PM.GEN.07','didaktik qobiliyat',10),
('PM.GEN.07','tashkilotchilik qobiliyat',10),
('PM.GEN.07','konstruktiv qobiliyat',10),
('PM.GEN.07','empatik qobiliyat',10),
('PM.GEN.07','kinestetik',8),
('PM.GEN.07','shaxsning ichki qobiliyat',9),

('PM.GEN.08','ta.?lim texnolog',11),
('PM.GEN.08','pedagogik texnolog',11),
('PM.GEN.08','modulli ta.?lim',9),
('PM.GEN.08','integratsion ta.?lim',9),
('PM.GEN.08','masofaviy ta.?lim',9),
('PM.GEN.08','muammoli ta.?lim',8),
('PM.GEN.08','loyiha asosida',8),
('PM.GEN.08','akvarium',8),
('PM.GEN.08','asalari galasi',8),
('PM.GEN.08','ajurli arra',8),
('PM.GEN.08','jigsaw',8),
('PM.GEN.08','keys.?stadi',8),
('PM.GEN.08','aqliy hujum',7),
('PM.GEN.08','differensial',7),
('PM.GEN.08','individual.*ta.?lim',5),
('PM.GEN.08','makro',6),
('PM.GEN.08','mezo',6),
('PM.GEN.08','mikro',6),

('PM.MET.01','informatika o.?qit',15),
('PM.MET.01','informatika dars',12),
('PM.MET.01','algoritmlash mavzus',10),
('PM.MET.01','dasturlashni o.?qit',10),

('PM.MET.02','qaysi ta.?lim metod',8),
('PM.MET.02','qaysi metoddan',7),
('PM.MET.02','muammoli bayon',10),
('PM.MET.02','evristik',8),
('PM.MET.02','suhbat metodi',8),
('PM.MET.02','amaliy metod',8),
('PM.MET.02','sintetik usul',7),
('PM.MET.02','analitik usul',7),
('PM.MET.02','bosh g.?oyani ajratish',8),

('PM.MET.03','pedagogik vaziyat',9),
('PM.MET.03','qaysi yondashuv eng samarali',8),
('PM.MET.03','eng to.?g.?ri harakat',7),
('PM.MET.03','qanday yo.?l tutish',7),
('PM.MET.03','qaror qabul',5),
('PM.MET.03','muammoga yechim',5);

create temporary table _ped_score on commit drop as
with src as (
  select c.id,
         lower(coalesce(c.raw_question_private,'') || E'\n' || coalesce(c.raw_answer_private,'')) as txt
  from public.pedagogy_pdf_source_candidates c
  where c.editorial_status='needs_review'
),
s as (
  select src.id,r.construct_code,sum(r.weight)::int score
  from src
  join _ped_rule r on src.txt ~* r.pattern
  group by src.id,r.construct_code
)
select * from s;

with ranked as (
  select s.*,
         row_number() over(partition by s.id order by s.score desc,s.construct_code) rn,
         lead(s.score) over(partition by s.id order by s.score desc,s.construct_code) second_score
  from _ped_score s
),
summary as (
  select r.id,
         max(r.construct_code) filter(where r.rn=1) top_code,
         max(r.score) filter(where r.rn=1) top_score,
         max(r.second_score) filter(where r.rn=1) second_score,
         array(
           select x.construct_code
           from _ped_score x
           where x.id=r.id
             and x.score>=4
           order by x.score desc,x.construct_code
           limit 3
         ) suggestions
  from ranked r
  group by r.id
),
classified as (
  select s.*,
         case
           when s.top_score>=10 and (s.second_score is null or s.top_score-s.second_score>=4) then 'high'
           when s.top_score>=7 and (s.second_score is null or s.top_score-s.second_score>=3) then 'medium'
           when s.top_score>=5 then 'ambiguous'
           else 'low'
         end confidence
  from summary s
)
update public.pedagogy_pdf_source_candidates c
   set suggested_constructs=classified.suggestions,
       mapping_confidence=classified.confidence,
       mapped_construct_id=case when classified.confidence='high' then (
         select id from public.constructs where code=classified.top_code and is_active limit 1
       ) else null end,
       review_notes=case
         when classified.confidence='high' and c.review_notes=''
           then 'Deterministic high-confidence construct triage. Answer key remains unverified.'
         when classified.confidence='high' and c.review_notes not like '%Deterministic high-confidence construct triage%'
           then c.review_notes || E'\nDeterministic high-confidence construct triage. Answer key remains unverified.'
         else c.review_notes
       end
  from classified
 where c.id=classified.id
   and c.editorial_status='needs_review';

-- 4) Hard-safe mapping gate.
-- Weighted scoring proposes topics, but mapped_construct_id is only retained when
-- the source wording/answer contains a uniquely identifying construct signal.
with src as (
  select c.id,
         lower(coalesce(c.raw_question_private,'')) q,
         lower(coalesce(c.raw_answer_private,'')) a,
         c.answer_key_status
  from public.pedagogy_pdf_source_candidates c
),
title_hits as (
  select s.*,
         ((q ~* 'o.?quv jarayonini rejalashtirish')::int
         +(q ~* 'ta.?lim samaradorligini ta.?minlash')::int
         +(q ~* 'o.?zlashtirishni baholash.*qayta aloqa')::int
         +(q ~* 'tarbiyaviy faoliyatni tashkil')::int
         +(q ~* 'xavfsiz.*rivojlantiruvchi.*muhit')::int
         +(q ~* 'o.?z.?o.?zini rivojlantirish.*kasbiy o.?sish')::int
         +(q ~* 'hamkasb.*ota.?ona.*hamkorlik')::int) as ks_title_count
  from src s
),
safe as (
  select t.id,
         case
           when t.answer_key_status='conflict' then null
           when a ~* 'o.?quv jarayonini rejalashtirish' then 'KS.01'
           when a ~* 'ta.?lim samaradorligini ta.?minlash' then 'KS.02'
           when a ~* 'o.?zlashtirishni baholash.*qayta aloqa' then 'KS.03'
           when a ~* 'tarbiyaviy faoliyatni tashkil' then 'KS.04'
           when a ~* 'xavfsiz.*rivojlantiruvchi.*muhit' then 'KS.05'
           when a ~* 'o.?z.?o.?zini rivojlantirish.*kasbiy o.?sish' then 'KS.06'
           when a ~* 'hamkasb.*ota.?ona.*hamkorlik' then 'KS.07'
           when ks_title_count=1 and q ~* 'o.?quv jarayonini rejalashtirish' then 'KS.01'
           when ks_title_count=1 and q ~* 'ta.?lim samaradorligini ta.?minlash' then 'KS.02'
           when ks_title_count=1 and q ~* 'o.?zlashtirishni baholash.*qayta aloqa' then 'KS.03'
           when ks_title_count=1 and q ~* 'tarbiyaviy faoliyatni tashkil' then 'KS.04'
           when ks_title_count=1 and q ~* 'xavfsiz.*rivojlantiruvchi.*muhit' then 'KS.05'
           when ks_title_count=1 and q ~* 'o.?z.?o.?zini rivojlantirish.*kasbiy o.?sish' then 'KS.06'
           when ks_title_count=1 and q ~* 'hamkasb.*ota.?ona.*hamkorlik' then 'KS.07'
           when a ~* 'ota.?onalar(ini)? .*ta.?lim jarayoniga jalb' then 'KS.07'
           when a ~* '(aralash|ekskursiya|konferensiya|sinov|tekshiruv|mustahkamlash).*dars'
             or a ~* '^(avtoritar|demokratik|liberal)( uslub)?' then 'PM.GEN.04'
           when a ~* 'pedagogik (etika|takt|texnika|nazokat)' then 'PM.GEN.06'
           when a ~* '(akademik|didaktik|kommunikativ|perseptiv|empatik|tashkilotchilik|konstruktiv|kinestetik|avtoritar).*qob' then 'PM.GEN.07'
           when a ~* '(estetik|aqliy|axloqiy|jismoniy|ekologik|huquqiy|iqtisodiy|fuqarolik|gigiyenik).*tarbiya' then 'PM.GEN.03'
           when a ~* '(onglilik.*faollik|ko.?rgazmalilik|tizimlilik|ilmiylik|tushunarlilik|nazariya.*amaliyot).*tamoyil' then 'PM.GEN.02'
           when a ~* '(gumanistik|noinstitutsional|ratsionalistik).*paradigma'
             or a ~* '(didaktik|psixologik|metodologik) tahlil'
             or a ~* '(pedagogik kuzatish|anketa|intervyu|test|pedagogik tajriba|matematik.?statistik) metodi?' then 'PM.GEN.01'
           when a ~* '(muammoli|interfaol|modulli|integratsion|masofaviy|evristik).*ta.?lim'
             or a ~* 'loyiha.*ta.?lim' then 'PM.GEN.08'
           when a ~* '(bosh g.?oyani ajratish|amaliy metod|muammoli bayon|suhbat metodi|evristik metod|sintetik usul|analitik usul)' then 'PM.MET.02'
           when q ~* 'sinf rahbar' and q ~* '(vazifa|majburiyat|yordamchi shakl)' then 'PM.GEN.05'
           else null
         end safe_code
  from title_hits t
)
update public.pedagogy_pdf_source_candidates c
   set mapped_construct_id=case when s.safe_code is null then null else (
         select id from public.constructs where code=s.safe_code and is_active limit 1
       ) end,
       mapping_confidence=case
         when s.safe_code is not null then 'high'
         when c.mapping_confidence='high' then 'medium'
         else c.mapping_confidence
       end,
       verification_basis=case
         when s.safe_code is not null then
           'Hard-safe construct mapping from explicit source wording/answer; historical answer key is still not independently verified.'
         else c.verification_basis
       end
  from safe s
 where c.id=s.id
   and c.editorial_status='needs_review';

-- Any still-unscored record remains explicitly low/unmapped, not silently assigned.
update public.pedagogy_pdf_source_candidates c
   set mapping_confidence='low',
       suggested_constructs='{}'::text[],
       mapped_construct_id=null
 where c.editorial_status='needs_review'
   and not exists(select 1 from _ped_score s where s.id=c.id)
   and c.mapping_confidence='untriaged';

commit;

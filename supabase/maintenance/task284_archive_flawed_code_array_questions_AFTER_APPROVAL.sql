
-- TASK-284: OPTIONAL MANUAL RELEASE, NEVER EXECUTED BY CI OR MERGE.
-- Archives 13 flawed Y1/mulohaza array-output items ONLY when each has
-- a PUBLISHED, structurally verified, source-mapped replacement.
-- It refuses to change content if any old item was used in an exam.
-- This file does NOT publish replacement questions.
-- Generated candidates are in production review queue with prefix:
-- expert-audit:20261019:code-array-review:<old-question-id>|<official-reference>
begin;
do $task284$
declare
 v_original_id uuid;
 v_original public.questions%rowtype;
 v_replacement uuid;
 v_target int;
 v_eligible_after int;
 v_option_count int;
 v_distinct_count int;
 v_correct_count int;
 v_count int:=0;
begin
 for v_original_id in select unnest(array[
   '16113dc0-7faf-d28b-da18-0c567840445b'::uuid,
   '26b80403-ab21-6d78-50c4-8f6d81861b78'::uuid,
   '51d67227-7ac9-925a-89f3-75558fc3fb25'::uuid,
   '56082819-4006-3041-d03f-6d9180545f67'::uuid,
   '807b7e6d-013d-6dea-ae20-f56e59f36cc2'::uuid,
   '888d53eb-392e-da1d-cd6e-59de26e630e3'::uuid,
   '944c39ba-9188-7c9e-6b58-2ec8ff143581'::uuid,
   'abd90b5c-ce93-40b9-b0ff-715cf0bdcd41'::uuid,
   'baee58a7-87cc-0a7b-b60d-5e7e299d8c6f'::uuid,
   'c08cb5d5-a2be-8ac2-1b88-12bd5169aec4'::uuid,
   'cd33cc48-c7c2-db1f-a0a6-ac246aecc6d1'::uuid,
   'dd8ae276-fbd4-fd13-8771-9fec4311eaa2'::uuid,
   'fcb07bde-9b88-4e0e-2ac7-297c534dcbcb'::uuid
 ]) loop
   select * into strict v_original from public.questions where id=v_original_id for update;

   -- Idempotent re-run is safe; do not weaken any check on a still-published row.
   if v_original.status='archived'::public.content_status then continue; end if;
   if v_original.status<>'published'::public.content_status
      or v_original.group_code<>'S4.CODE'
      or v_original.cognitive<>'mulohaza'::public.cognitive_level
      or v_original.format<>'Y1'::public.question_format
      or not v_original.is_generated
   then
     raise exception 'TASK284_UNEXPECTED_ORIGINAL_STATUS_OR_SCOPE %',v_original_id;
   end if;

   if exists(select 1 from public.exam_items ei where ei.question_id=v_original_id) then
     raise exception 'TASK284_ORIGINAL_HAS_HISTORIC_EXAM_REFERENCES %',v_original_id;
   end if;

   select count(*),min(q.id::text)::uuid into v_count,v_replacement
   from public.questions q
   where q.source_reference like
         'expert-audit:20261019:code-array-review:'||v_original_id::text||'|%'
     and q.status='published'::public.content_status
     and q.group_code=v_original.group_code
     and q.construct_id=v_original.construct_id
     and q.cognitive=v_original.cognitive
     and q.format=v_original.format
     and q.source_lesson_id=v_original.source_lesson_id
     and exists(select 1 from public.lesson_constructs lc
       where lc.lesson_id=q.source_lesson_id and lc.construct_id=q.construct_id);
   if v_count<>1 then
     raise exception 'TASK284_REPLACEMENT_NOT_APPROVED_AND_PUBLISHED % found=%',
       v_original_id,v_count;
   end if;

   select count(*),count(distinct regexp_replace(lower(btrim(o.content_md)),'[[:space:]]+','','g')),
          count(*) filter(where o.id::text=k.payload->>'correct_option_id')
     into v_option_count,v_distinct_count,v_correct_count
   from public.question_options o
   join public.question_keys k on k.question_id=o.question_id
   where o.question_id=v_replacement;
   if v_option_count<>4 or v_distinct_count<>4 or v_correct_count<>1
     or exists(select 1 from public.question_options o
               where o.question_id=v_replacement and (
                 left(o.content_md,2) in ('],','[,')
                 or (o.content_md like '[%' and right(o.content_md,3)='],0')
               ))
   then
     raise exception 'TASK284_REPLACEMENT_DISTRACTOR_CHECK_FAILED %',v_replacement;
   end if;

   update public.questions
   set status='archived'::public.content_status,updated_at=now()
   where id=v_original_id and status='published'::public.content_status;
 end loop;

 -- Never inadvertently starve the ONE official mulohaza slot in S4.CODE.
 select coalesce(max(bq.n_mulohaza),0) into v_target
 from public.blueprints bp
 join public.blueprint_quotas bq on bq.blueprint_id=bp.id
 where bp.is_active and bq.group_code='S4.CODE';

 select count(*) into v_eligible_after
 from public.questions q
 join public.constructs c on c.id=q.construct_id
 where q.group_code='S4.CODE'
   and q.cognitive='mulohaza'::public.cognitive_level
   and q.status='published'::public.content_status
   and c.is_active and c.group_code=q.group_code
   and exists(select 1 from public.question_keys k where k.question_id=q.id);

 if v_target<>1 or v_eligible_after<20 then
   raise exception 'TASK284_QUOTA_OR_RESERVE_GUARD actual=% required=%',
     v_eligible_after,v_target;
 end if;
end;
$task284$;
commit;

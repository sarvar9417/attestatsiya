-- TASK-306/TASK-305 fresh-chain reconciliation.
--
-- TASK-306 runs before TASK-305 by timestamp and therefore creates a generic
-- native REVIEW successor for T063-Y2-022. TASK-305 later releases its own
-- independently guarded native successor for that exact item. Retire only the
-- now-redundant REVIEW row; never modify either published row in place.

begin;

do $task306_task305_reconcile$
declare
  v_task306_revision uuid;
  v_task305_published uuid;
begin
  select r.revision_question_id
    into v_task306_revision
  from public.questions source_q
  join public.question_bank_revisions r
    on r.source_question_id=source_q.id
   and r.revision_kind='legacy_y2_native_sides'
  join public.questions revision_q on revision_q.id=r.revision_question_id
  where source_q.source_reference='formatbank-2026:T063-Y2-022'
    and revision_q.status='review'::public.content_status;

  select q.id into v_task305_published
  from public.questions q
  where q.source_reference='m13-qa-fix:v2:T063-Y2-022'
    and q.status='published'::public.content_status
    and q.format='Y2'::public.question_format
    and (select count(*) from public.question_options o
         where o.question_id=q.id and o.side='a')=4
    and (select count(*) from public.question_options o
         where o.question_id=q.id and o.side='b')=4;

  if v_task306_revision is null or v_task305_published is null then
    return;
  end if;

  update public.questions
  set status='archived'::public.content_status,updated_at=now()
  where id=v_task306_revision
    and status='review'::public.content_status;

  update public.question_quality_findings
  set resolved_at=coalesce(resolved_at,now()),
      details=details || jsonb_build_object(
        'superseded_by_question_id',v_task305_published,
        'superseded_by_task','TASK-305'
      )
  where question_id=v_task306_revision
    and finding_code='independent_editorial_review_required';

  if (select status from public.questions where id=v_task306_revision)
     <>'archived'::public.content_status then
    raise exception 'TASK-306/TASK-305 redundant review reconciliation failed';
  end if;
end
$task306_task305_reconcile$;

commit;

-- TASK-240 regression: Graphics/Web V2 remains review-only until a current
-- expert checklist and a published source lesson both exist.

do $test$
declare
  v_question uuid;
  v_count integer;
begin
  select count(*) into v_count
  from public.questions q
  where q.status='published'::public.content_status
    and q.group_code='S5.WEB'
    and q.is_generated
    and (
      q.source_reference like 'GV2:%'
      or q.source_reference like 'Grafika va veb-texnologiyalar V2,%'
    );
  if v_count<>0 then
    raise exception 'TASK-240 found % learner-visible unreviewed GV2 rows',v_count;
  end if;

  select count(*) into v_count
  from public.questions q
  join public.question_keys k on k.question_id=q.id
  where q.status='review'::public.content_status
    and q.group_code='S5.WEB'
    and q.is_generated
    and (
      q.source_reference like 'GV2:%'
      or q.source_reference like 'Grafika va veb-texnologiyalar V2,%'
    );
  if v_count<>380 then
    raise exception 'TASK-240 expected 380 keyed GV2 review revisions, found %',v_count;
  end if;

  if (select count(*) from public.questions
      where status='published'::public.content_status and group_code='S5.WEB')<>53 then
    raise exception 'TASK-240 expected the 53 pre-existing published S5.WEB questions';
  end if;

  if exists (
    select 1
    from public.question_quality_quarantines x
    join public.questions old_q on old_q.id=x.source_question_id
    join public.questions new_q on new_q.id=x.replacement_question_id
    where old_q.status<>'archived'::public.content_status
       or new_q.status<>'review'::public.content_status
  ) then
    raise exception 'TASK-240 quarantine lineage has an invalid status pair';
  end if;

  select q.id into strict v_question
  from public.questions q
  where q.status='review'::public.content_status
    and q.group_code='S5.WEB'
    and q.is_generated
    and (
      q.source_reference like 'GV2:%'
      or q.source_reference like 'Grafika va veb-texnologiyalar V2,%'
    )
  order by q.id
  limit 1;

  begin
    update public.questions
    set status='published'::public.content_status
    where id=v_question;
    raise exception 'TASK-240 publication guard allowed an unreviewed GV2 row';
  exception
    when check_violation then
      if sqlerrm not like 'GV2_PUBLICATION_BLOCKED:%' then
        raise;
      end if;
  end;

  if exists (
    select 1 from public.question_quality_published_revisions
    where release_scope='TASK-240/GV2'
      and content_fingerprint is distinct from public.professional_question_fingerprint(question_id)
  ) then
    raise exception 'TASK-240 published-revision fingerprint drift detected';
  end if;
end
$test$;

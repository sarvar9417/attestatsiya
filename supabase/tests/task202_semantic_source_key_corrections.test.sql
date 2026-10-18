-- TASK-202 semantic regressions: original source keys remain flagged,
-- independently corroborated practice answers are staged REVIEW only.
begin;
do $semantic$
declare v_q uuid;v_status public.content_status;v_answer text;v_options int;
begin
 select q.id,q.status,o.content_md into strict v_q,v_status,v_answer
 from public.questions q
 join public.question_keys k on k.question_id=q.id
 join public.question_options o on o.id::text=k.payload->>'correct_option_id'
 where q.source_reference='authored:pedagogy-key-correction:2026:spring:p3:q14';
 if v_status<>'review'::public.content_status or v_answer<>'Analitik usul'
 then raise exception '2026 q14 must be analitik and stay in review';end if;
 select count(*) into v_options from public.question_options
 where question_id=v_q and side='a';
 if v_options<>4 then raise exception '2026 q14 invalid option count';end if;
 select q.id,q.status,o.content_md into strict v_q,v_status,v_answer
 from public.questions q
 join public.question_keys k on k.question_id=q.id
 join public.question_options o on o.id::text=k.payload->>'correct_option_id'
 where q.source_reference='authored:pedagogy-key-correction:2026:spring:p30:q144';
 if v_status<>'review'::public.content_status or v_answer<>'1 va 3'
 then raise exception '2026 q144 must reject ignoring and threats';end if;
 select count(*) into v_options from public.question_options
 where question_id=v_q and side='a';
 if v_options<>4 then raise exception '2026 q144 invalid option count';end if;
end $semantic$;
rollback;
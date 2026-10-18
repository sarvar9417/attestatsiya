-- Mock Y2 repair: derive the missing right-column side ONLY in the learner payload.
-- A 2026-10-12 content import omitted question_options.side; its default ('a')
-- made all eight options appear on the left for 24 published Y2 questions.
-- Do not update immutable published question/options/key rows or reveal answer keys.
-- Recover only when all 4 key/value pairs refer to eight distinct option UUIDs.
-- Existing valid Y2, Y1 and Y3 payloads are unaffected.
begin;

create or replace function public.exam_payload(p_exam_id uuid)
returns jsonb
language sql stable security definer set search_path = public
as $function$
  select jsonb_agg(item order by (item->>'order_idx')::int)
  from (
    select jsonb_build_object(
      'item_id', ei.id,
      'order_idx', ei.order_idx,
      'question_id', q.id,
      'format', q.format,
      'stem_md', q.stem_md,
      'assets', q.assets,
      'options', (
        select coalesce(
          jsonb_agg(
            jsonb_build_object(
              'id', opt.id,
              'side', opt.resolved_side,
              'content_md', opt.content_md
            )
            order by opt.resolved_side nulls first, opt.sort_position
          ),
          '[]'::jsonb
        )
        from (
          select
            o.id,
            o.content_md,
            case
              when k.is_recoverable
                   and exists (
                     select 1 from jsonb_each_text(k.pairs) pair
                     where pair.value = o.id::text
                   )
              then 'b'::char(1)
              else o.side
            end as resolved_side,
            case
              when ei.option_order is not null
                then array_position(ei.option_order, o.id)
              else o.order_idx
            end as sort_position
          from public.question_options o
          left join lateral (
            select
              key.payload->'pairs' as pairs,
              (
                q.format = 'Y2'::public.question_format
                and jsonb_typeof(key.payload->'pairs') = 'object'
                and (select count(*) from public.question_options x where x.question_id=q.id) = 8
                and (select count(*) from public.question_options x where x.question_id=q.id and x.side='a') = 8
                and (select count(*) from jsonb_each_text(key.payload->'pairs')) = 4
                and (select count(distinct pair.value) from jsonb_each_text(key.payload->'pairs') pair) = 4
                and (
                  select count(*)
                  from jsonb_each_text(key.payload->'pairs') pair
                  join public.question_options x on x.question_id=q.id and x.id::text=pair.key
                ) = 4
                and (
                  select count(*)
                  from jsonb_each_text(key.payload->'pairs') pair
                  join public.question_options x on x.question_id=q.id and x.id::text=pair.value
                ) = 4
                and not exists (
                  select 1
                  from jsonb_each_text(key.payload->'pairs') pair
                  where pair.key=pair.value
                     or exists (
                       select 1 from jsonb_each_text(key.payload->'pairs') p2
                       where p2.key=pair.value
                     )
                )
              ) as is_recoverable
            from public.question_keys key
            where key.question_id=q.id
              and q.format='Y2'::public.question_format
          ) k on true
          where o.question_id=q.id
            and (ei.option_order is null or o.id=any(ei.option_order))
        ) opt
      )
    ) as item
    from public.exam_items ei
    join public.questions q on q.id=ei.question_id
    where ei.exam_id=p_exam_id
  ) s;
$function$;

-- Keep the original RPC privilege contract unchanged: do not grant new roles.
commit;

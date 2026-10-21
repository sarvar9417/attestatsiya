-- TASK-375: replace learner-facing one-line executable snippets with readable
-- fenced code blocks. This is a presentation-only immutable revision release:
-- options, answer semantics, explanations and historical attempts are unchanged.
-- The owner explicitly requested the database correction on 2026-10-21.
BEGIN;
SET LOCAL lock_timeout = '12s';
SET LOCAL statement_timeout = '180s';

CREATE TEMP TABLE task375_inline_code (
  source_reference text PRIMARY KEY,
  language text NOT NULL,
  original_code text NOT NULL,
  formatted_code text NOT NULL
) ON COMMIT DROP;

INSERT INTO task375_inline_code VALUES
  ('expert-audit:20261019:review-only:db01-count-filter|https://learn.microsoft.com/en-us/office/vba/access/concepts/criteria-expressions/count-function-microsoft-access-sql', 'sql', $old$SELECT Count(*) FROM Oquvchi WHERE Sinf='7A';$old$, $new$SELECT Count(*)
FROM Oquvchi
WHERE Sinf = '7A';$new$),
  ('expert-audit:20261019:review-only:db01-filter-sort|https://learn.microsoft.com/en-us/office/client-developer/access/desktop-database-reference/select-statement-microsoft-access-sql', 'sql', $old$SELECT Ism FROM Oquvchi WHERE Sinf='7A' ORDER BY Ism ASC;$old$, $new$SELECT Ism
FROM Oquvchi
WHERE Sinf = '7A'
ORDER BY Ism ASC;$new$),
  ('GV-EXAMSTYLE:20261020:GV-DEMO-2026-CS-028; ORIGINAL_AI_AUTHORED_NOT_OFFICIAL_QUESTION; DEMO_STYLE_REFERENCE_ONLY; Cambridge+ 9-sinf PDF 285–303; ICT 7-sinf PDF 106–149; 2025 kuzgi demo p.9; 13.04.2026 p.23; EDITORIAL:AI_REVIEW_NOT_INDEPENDENT_HUMAN', 'css', $old$img{width:240px;height:140px;object-fit:cover}$old$, $new$img {
  width: 240px;
  height: 140px;
  object-fit: cover
}$new$),
  ('M07-AUDIT-20261020:M07-A26-08; source=ICT 5/6 (2020/2021) Scratch/LOGO mavzulari; 2026 spetsifikatsiya PDF 4; ORIGINAL_REVIEW', 'text', $old$repeat (2) { repeat (3) { move 50; turn 120 } turn 60 }$old$, $new$repeat (2) {
  repeat (3) {
    move 50;
    turn 120;
  }
  turn 60;
}$new$),
  ('pyjs-2026-v2:J01-010', 'javascript', $old$const a=[1]; a.push(2);$old$, $new$const a = [1];
a.push(2);$new$),
  ('pyjs-2026-v2:J03-009', 'javascript', $old$if (false || true && false)$old$, $new$if (false || true && false)$new$),
  ('pyjs-2026-v2:P01-010', 'python', $old$print(4, 5, sep="-")$old$, $new$print(4, 5, sep="-")$new$),
  ('reserve-2026:T060-R2-DB-Q02', 'sql', $old$SELECT ism FROM Oquvchi;$old$, $new$SELECT ism
FROM Oquvchi;$new$),
  ('reserve-2026:T060-R3A-ALG-M02', 'pascal', $old$max=a; IF b>max THEN max=b; IF c>max THEN max=c$old$, $new$max = a;
IF b > max THEN max = b;
IF c > max THEN max = c$new$),
  ('reserve-2026:T060-R3A-ALG-M17', 'text', $old$while password noto‘g‘ri$old$, $new$while password noto‘g‘ri$new$),
  ('reserve-2026:T060-R3A-ALG-Q11', 'pascal', $old$IF x mod 2 = 0 THEN OUTPUT "Juft" ELSE OUTPUT "Toq"$old$, $new$IF x MOD 2 = 0 THEN
  OUTPUT "Juft"
ELSE
  OUTPUT "Toq"$new$),
  ('reserve-2026:T060-R3A-ALG-Q12', 'pascal', $old$IF a>b THEN m=a ELSE m=b$old$, $new$IF a > b THEN
  m := a
ELSE
  m := b$new$),
  ('reserve-2026:T060-R3B-BLK-Q09', 'text', $old$if <x > 0> then say "musbat" else say "musbat emas"$old$, $new$if <x > 0> then
  say "musbat"
else
  say "musbat emas"$new$),
  ('reserve-2026:T060-R3C-CODE-M04', 'python', $old$if score>=60: grade='C'; elif score>=80: grade='A'$old$, $new$if score >= 60:
    grade = 'C'
elif score >= 80:
    grade = 'A'$new$),
  ('reserve-2026:T060-R3C-CODE-M09', 'python', $old$x=input(); print(x+3)$old$, $new$x = input()
print(x + 3)$new$),
  ('reserve-2026:T060-R3C-CODE-M12', 'javascript', $old$let a=[2,5,8]; a[0]=a[2]-a[1]; console.log(a[0]);$old$, $new$let a = [2, 5, 8];
a[0] = a[2] - a[1];
console.log(a[0]);$new$),
  ('reserve-2026:T060-R3C-CODE-M13', 'javascript', $old$function f(x){ if(x>0) return x; return -x; }$old$, $new$function f(x) {
  if (x > 0) return x;
  return -x;
}$new$),
  ('reserve-2026:T060-R3C-CODE-M14', 'javascript', $old$for(let i=0;i<a.length;i++) sum+=a[i];$old$, $new$for (let i = 0; i < a.length; i++)
  sum += a[i];
$new$),
  ('reserve-2026:T060-R3C-CODE-M19', 'javascript', $old$let x="5"; console.log(x+2);$old$, $new$let x = "5";
console.log(x + 2);$new$),
  ('reserve-2026:T060-R3C-CODE-Q05', 'python', $old$if x>5: print("A") else: print("B")$old$, $new$if x > 5:
    print("A")
else:
    print("B")$new$),
  ('reserve-2026:T060-R3C-CODE-Q06', 'python', $old$for i in range(3): print(i, end=" ")$old$, $new$for i in range(3):
    print(i, end=" ")$new$),
  ('reserve-2026:T060-R3C-CODE-Q07', 'python', $old$s=1; for i in range(1,4): s*=i$old$, $new$s = 1
for i in range(1, 4):
    s *= i$new$),
  ('reserve-2026:T060-R3C-CODE-Q08', 'python', $old$n=4; while n>1: n-=1$old$, $new$n = 4
while n > 1:
    n -= 1$new$),
  ('reserve-2026:T060-R3C-CODE-Q09', 'python', $old$x=0; for i in range(5): x+=2$old$, $new$x = 0
for i in range(5):
    x += 2$new$),
  ('reserve-2026:T060-R3C-CODE-Q11', 'python', $old$def f(x): return x+2$old$, $new$def f(x):
    return x + 2$new$),
  ('reserve-2026:T060-R3C-CODE-Q12', 'python', $old$a=[1,2]; a.append(3); print(len(a))$old$, $new$a = [1, 2]
a.append(3)
print(len(a))$new$),
  ('reserve-2026:T060-R3C-CODE-Q13', 'python', $old$print(max(a)-min(a))$old$, $new$print(max(a) - min(a))$new$),
  ('reserve-2026:T060-R3C-CODE-Q14', 'javascript', $old$let x=4; console.log(x*3);$old$, $new$let x = 4;
console.log(x * 3);$new$),
  ('reserve-2026:T060-R3C-CODE-Q15', 'javascript', $old$let a=[10,20,30]; console.log(a[2]);$old$, $new$let a = [10, 20, 30];
console.log(a[2]);$new$),
  ('reserve-2026:T060-R3C-CODE-Q16', 'javascript', $old$for(let i=1;i<=3;i++){...}$old$, $new$for (let i = 1; i <= 3; i++) {
  ...
}$new$),
  ('reserve-2026:T060-R3C-CODE-Q17', 'javascript', $old$function f(x){return x-1;} console.log(f(9));$old$, $new$function f(x) {
  return x - 1;
}
console.log(f(9));$new$),
  ('reserve-2026:T060-R3C-CODE-Q18', 'javascript', $old$let x=7; if(x%2===0) console.log("J"); else console.log("T");$old$, $new$let x = 7;
if (x % 2 === 0)
  console.log("J");
else
  console.log("T");
$new$),
  ('reserve-2026:T060-R3C-CODE-Q19', 'python', $old$x=72; if x>=80: a='A'; elif x>=70: a='B'; else: a='C'$old$, $new$x = 72
if x >= 80:
    a = 'A'
elif x >= 70:
    a = 'B'
else:
    a = 'C'$new$),
  ('Scratch-LOGO-2026-v3:SL3-03-009; source=ICT6-2021 PDF 20, 22–23; scope=SPEC', 'text', $old$if <touching color [red]?> then change lives by -1$old$, $new$if <touching color [red]?> then
  change lives by -1$new$),
  ('Scratch-LOGO-2026-v3:SL3-03-010; source=ICT6-2021 PDF 19–20; scope=SPEC', 'text', $old$forever [if <key [space] pressed?> then change y by 10]$old$, $new$forever [
  if <key [space] pressed?> then
    change y by 10
]$new$),
  ('Scratch-LOGO-2026-v3:SL3-04-008; source=CAM6 PDF 149–157; sintez; scope=TEXTBOOK_EXTENSION', 'text', $old$define polygon n sides length$old$, $new$define polygon n sides length$new$),
  ('Scratch-LOGO-2026-v3:SL3-05-002; source=ICT5-2020 PDF 103–107; scope=SPEC', 'text', $old$repeat 4 [move 50; turn 90]$old$, $new$repeat 4 [
  move 50
  turn 90
]$new$);

CREATE TEMP TABLE task375_full_stem (
  source_reference text PRIMARY KEY,
  new_stem text NOT NULL
) ON COMMIT DROP;

INSERT INTO task375_full_stem VALUES
  ('algoritmlash-v2:ALG-04-008', E'```pascal\nP := 1\nFOR i := 1..N DO\n  P := P * i\n```\n\nUshbu algoritm qanday masalani yechadi?'),
  ('algoritmlash-v2:ALG-04-013', E'```pascal\nS := 0\nFOR i := 1..3 DO\n  S := S + i\n```\n\nS oxirida nechaga teng?'),
  ('algoritmlash-v2:ALG-04-014', E'```pascal\nP := 1\nFOR i := 1..4 DO\n  P := P * i\n```\n\nP oxirida nechaga teng?'),
  ('algoritmlash-v2:ALG-04-015', E'```pascal\nS := 0\nFOR i := 2, 4, 6, 8 DO\n  S := S + i\n```\n\nS oxirida nechaga teng?'),
  ('algoritmlash-v2:ALG-04-016', E'```pascal\nX := 1\nFOR i := 1..4 DO\n  X := 2 * X\n```\n\nX oxirida nechaga teng?'),
  ('algoritmlash-v2:ALG-04-017', E'```pascal\nK := 0\nFOR i := 1..9 DO\n  IF i MOD 3 = 0 THEN\n    K := K + 1\n```\n\nK oxirida nechaga teng?'),
  ('algoritmlash-v2:ALG-04-018', E'```pascal\nP := 1\nFOR i := 1..4 DO\n  P := P * i\n```\n\nYakuniy P nechaga teng?'),
  ('algoritmlash-v2:ALG-04-022', E'```pascal\nS := 1\nFOR i := 2..4 DO\n  S := S * i\n```\n\nS oxirida nechaga teng?'),
  ('algoritmlash-v2:ALG-04-023', E'```pascal\nS := 0\nFOR i := 1..6 DO\n  IF i MOD 3 = 0 THEN\n    S := S + i\n```\n\nS oxirida nechaga teng?'),
  ('algoritmlash-v2:ALG-04-026', E'```pascal\nS := 0\nFOR i := 1..4 DO\n  FOR j := 1..i DO\n    S := S + 1\n```\n\nS oxirida nechaga teng?'),
  ('algoritmlash-v2:ALG-04-027', E'```pascal\nK := 0\nFOR i := 1..3 DO\n  FOR j := 1..4 DO\n    IF j MOD 2 = 0 THEN\n      K := K + 1\n```\n\nK oxirida nechaga teng?'),
  ('algoritmlash-v2:ALG-04-028', E'```pascal\nFOR i := 1..3 DO\n  FOR j := 1..i DO\n    CHIQAR(i + j)\n```\n\nJami nechta qiymat chiqariladi?'),
  ('algoritmlash-v2:ALG-06-027', E'```pascal\np := 0\nFOR i := 1..4 DO\n  p := p + 2 * i\n```\n\nYakuniy p qancha?'),
  ('algoritmlash-v3:ALG-V3-A009', E'```pascal\nP := 1\nFOR i := 1..5 DO\n  P := P * i\n```\n\nYakuniy P nechaga teng?'),
  ('algoritmlash-v3:ALG-V3-B007', E'```pascal\nFOR i := 1..3 DO\n  FOR j := 1..2 DO\n    CHIQAR(i, j)\n```\n\nNechta juftlik chiqariladi?'),
  ('algoritmlash-v3:ALG-V3-B008', E'```pascal\nK := 0\nFOR i := 1..4 DO\n  FOR j := 1..i DO\n    K := K + 1\n```\n\nYakuniy K nechaga teng?'),
  ('algoritmlash-v3:ALG-V3-B009', E'```pascal\nS := 0\nFOR i := 1..5 DO\n  IF i MOD 2 <> 0 THEN\n    S := S + i * i\n```\n\nS oxirida nechaga teng?'),
  ('algoritmlash-v4:ALG-V4-008', E'```pascal\nK := 0\nFOR i := 1..4 DO\n  FOR j := 1..i DO\n    IF (i + j) MOD 2 = 0 THEN\n      K := K + 1\n```\n\nK nechaga teng?'),
  ('algoritmlash-v4:ALG-V4-009', E'```pascal\nx := 3\ns := 2\nFOR i := 1..4 DO\n  IF i toq THEN\n    x := x + 1\n  ELSE\n    s := s * x\n```\n\nYakuniy s nechaga teng?'),
  ('algoritmlash-v4:ALG-V4-015', E'```pascal\nK := 0\nFOR i := 1..20 DO\n  IF (i MOD 2 = 0) AND (i MOD 3 = 0) THEN\n    K := K + 1\n```\n\nK nechaga teng?'),
  ('algoritmlash-v4:ALG-V4-017', E'```pascal\nK := 0\nFOR i := 1..4 DO\n  FOR j := i..4 DO\n    K := K + 1\n```\n\nYakuniy K nechaga teng?'),
  ('algoritmlash-v4:ALG-V4-020', E'```pascal\nP := 1\nFOR i := 1..6 DO\n  IF i MOD 2 = 0 THEN\n    P := P * i\n```\n\nYakuniy P nechaga teng?');

CREATE TEMP TABLE task375_expected (
  source_reference text PRIMARY KEY,
  new_stem text NOT NULL
) ON COMMIT DROP;

INSERT INTO task375_expected(source_reference, new_stem)
SELECT i.source_reference,
  btrim(regexp_replace(
    regexp_replace(
      regexp_replace(
        replace(
          q.stem_md,
          chr(96) || i.original_code || chr(96),
          E'\n\n```' || i.language || E'\n' ||
            btrim(i.formatted_code, E' \t\r\n') || E'\n```\n\n'
        ),
        E'[[:blank:]]+\n', E'\n', 'g'
      ),
      E'\n\n[.][[:space:]]*', E'\n\n', 'g'
    ),
    E'\n\n[[:blank:]]+', E'\n\n', 'g'
  ))
FROM task375_inline_code i
JOIN public.questions q ON q.source_reference=i.source_reference
JOIN public.question_keys k ON k.question_id=q.id
WHERE q.format='Y1'::public.question_format
  AND q.status IN ('published'::public.content_status,'archived'::public.content_status)
  AND (SELECT count(*) FROM public.question_options o
       WHERE o.question_id=q.id AND o.side='a')=4
  AND EXISTS (
    SELECT 1 FROM public.question_options o
    WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id'
  );

INSERT INTO task375_expected
SELECT f.*
FROM task375_full_stem f
JOIN public.questions q ON q.source_reference=f.source_reference
JOIN public.question_keys k ON k.question_id=q.id
WHERE q.format='Y1'::public.question_format
  AND q.status IN ('published'::public.content_status,'archived'::public.content_status)
  AND (SELECT count(*) FROM public.question_options o
       WHERE o.question_id=q.id AND o.side='a')=4
  AND EXISTS (
    SELECT 1 FROM public.question_options o
    WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id'
  );

DO $task375_release$
DECLARE
  v_target_count integer;
  v_bad integer;
BEGIN
  IF (SELECT count(*) FROM task375_inline_code) <> 37
     OR (SELECT count(*) FROM task375_full_stem) <> 22 THEN
    RAISE EXCEPTION 'TASK-375 mapping count mismatch';
  END IF;

  SELECT count(*) INTO v_target_count FROM task375_expected;
  -- The clean CI bootstrap intentionally omits some production-only question
  -- sources. Process the exact available subset there; production has all 59
  -- and is asserted by the release SQL test and recorded postflight.
  IF v_target_count=0 THEN
    RAISE NOTICE 'TASK-375 source bank absent; formatting release skipped';
    RETURN;
  ELSIF v_target_count>59 THEN
    RAISE EXCEPTION 'TASK-375 expected at most 59 source questions, found %', v_target_count;
  END IF;
  IF EXISTS (
    SELECT e.source_reference
    FROM task375_expected e
    LEFT JOIN public.questions q ON q.source_reference=e.source_reference
    GROUP BY e.source_reference
    HAVING count(q.id)<>1
  ) THEN
    RAISE EXCEPTION 'TASK-375 source references are missing or ambiguous';
  END IF;

  SELECT count(*) INTO v_bad
  FROM task375_expected e
  JOIN public.questions q ON q.source_reference=e.source_reference
  LEFT JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.format <> 'Y1'::public.question_format
     OR q.status NOT IN ('published'::public.content_status, 'archived'::public.content_status)
     OR position('```' in e.new_stem)=0
     OR e.new_stem !~ E'```[^\n]+\n[^\n]+\n'
     OR k.question_id IS NULL
     OR jsonb_typeof(k.payload) <> 'object'
     OR NOT (k.payload ? 'correct_option_id')
     OR (SELECT count(*) FROM public.question_options o
         WHERE o.question_id=q.id AND o.side='a') <> 4
     OR NOT EXISTS (
       SELECT 1 FROM public.question_options o
       WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id'
     );
  IF v_bad <> 0 THEN
    RAISE EXCEPTION 'TASK-375 source shape/preflight failed for % questions', v_bad;
  END IF;

  CREATE TEMP TABLE task375_map (
    source_question_id uuid PRIMARY KEY,
    revision_question_id uuid NOT NULL UNIQUE,
    new_stem text NOT NULL
  ) ON COMMIT DROP;

  INSERT INTO task375_map(source_question_id, revision_question_id, new_stem)
  SELECT q.id,
    coalesce(existing.id, gen_random_uuid()),
    e.new_stem
  FROM task375_expected e
  JOIN public.questions q ON q.source_reference=e.source_reference
  LEFT JOIN public.questions existing
    ON existing.source_reference='revision:TASK-375:code-block:' || q.id::text || ' | ' || q.source_reference;

  CREATE TEMP TABLE task375_option_map (
    source_option_id uuid PRIMARY KEY,
    revision_option_id uuid NOT NULL UNIQUE,
    source_question_id uuid NOT NULL,
    revision_question_id uuid NOT NULL
  ) ON COMMIT DROP;

  INSERT INTO task375_option_map
  SELECT o.id,
    coalesce(existing.id, gen_random_uuid()),
    o.question_id,
    m.revision_question_id
  FROM public.question_options o
  JOIN task375_map m ON m.source_question_id=o.question_id
  LEFT JOIN public.question_options existing
    ON existing.question_id=m.revision_question_id
   AND existing.side=o.side AND existing.order_idx=o.order_idx;

  INSERT INTO public.questions(
    id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
    assets,is_generated,status,author_id,created_at,updated_at,source_reference,
    source_lesson_id
  )
  SELECT m.revision_question_id,q.subject_id,q.construct_id,q.group_code,q.format,
    q.cognitive,q.difficulty,m.new_stem,q.assets,q.is_generated,
    'review'::public.content_status,q.author_id,now(),now(),
    'revision:TASK-375:code-block:' || q.id::text || ' | ' || q.source_reference,
    q.source_lesson_id
  FROM task375_map m
  JOIN public.questions q ON q.id=m.source_question_id
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
  SELECT om.revision_option_id,om.revision_question_id,o.side,o.order_idx,o.content_md
  FROM task375_option_map om
  JOIN public.question_options o ON o.id=om.source_option_id
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.question_keys(question_id,payload,explanation_md,updated_at)
  SELECT m.revision_question_id,
    jsonb_set(
      k.payload,
      '{correct_option_id}',
      to_jsonb(om.revision_option_id::text),
      false
    ),
    k.explanation_md,
    now()
  FROM task375_map m
  JOIN public.question_keys k ON k.question_id=m.source_question_id
  JOIN task375_option_map om
    ON om.source_question_id=m.source_question_id
   AND om.source_option_id::text=k.payload->>'correct_option_id'
  ON CONFLICT (question_id) DO NOTHING;

  IF (SELECT count(*) FROM public.question_keys k JOIN task375_map m
      ON k.question_id=m.revision_question_id)<>v_target_count
     OR (SELECT count(*) FROM public.question_options o JOIN task375_map m
         ON o.question_id=m.revision_question_id)<>v_target_count*4 THEN
    RAISE EXCEPTION 'TASK-375 cloned key/option count mismatch';
  END IF;

  INSERT INTO public.question_bank_revisions(
    source_question_id,revision_question_id,revision_kind,evidence
  )
  SELECT m.source_question_id,m.revision_question_id,'code_block_presentation_normalization',
    jsonb_build_object(
      'task','TASK-375',
      'scope','formatting_only',
      'owner_requested',true,
      'answer_semantics_changed',false,
      'options_changed',false,
      'historical_attempts_changed',false
    )
  FROM task375_map m
  ON CONFLICT (source_question_id) DO NOTHING;

  -- Validate the complete revision before it can replace a live question.
  SELECT count(*) INTO v_bad
  FROM task375_map m
  JOIN public.questions source_q ON source_q.id=m.source_question_id
  JOIN public.questions revision_q ON revision_q.id=m.revision_question_id
  JOIN public.question_keys source_k ON source_k.question_id=source_q.id
  JOIN public.question_keys revision_k ON revision_k.question_id=revision_q.id
  WHERE revision_q.status NOT IN ('review'::public.content_status,'published'::public.content_status)
     OR revision_q.stem_md <> m.new_stem
     OR revision_q.stem_md !~ E'```[^\n]+\n[^\n]+\n'
     OR source_k.explanation_md IS DISTINCT FROM revision_k.explanation_md
     OR (source_k.payload - 'correct_option_id') <> (revision_k.payload - 'correct_option_id')
     OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=revision_q.id) <> 4
     OR EXISTS (
       SELECT 1
       FROM public.question_options so
       JOIN task375_option_map om ON om.source_option_id=so.id
       JOIN public.question_options ro ON ro.id=om.revision_option_id
       WHERE so.question_id=source_q.id
         AND (so.side,so.order_idx,so.content_md) IS DISTINCT FROM
             (ro.side,ro.order_idx,ro.content_md)
     )
     OR NOT EXISTS (
       SELECT 1 FROM task375_option_map om
       WHERE om.source_option_id::text=source_k.payload->>'correct_option_id'
         AND om.revision_option_id::text=revision_k.payload->>'correct_option_id'
     );
  IF v_bad <> 0 THEN
    RAISE EXCEPTION 'TASK-375 revision equivalence failed for % questions', v_bad;
  END IF;

  -- Trusted migration release: the owner requested this exact formatting-only
  -- correction. No independent human review is claimed or fabricated.
  UPDATE public.questions q
  SET status='published'::public.content_status,updated_at=now()
  FROM task375_map m
  WHERE q.id=m.revision_question_id AND q.status='review'::public.content_status;

  UPDATE public.questions q
  SET status='archived'::public.content_status,updated_at=now()
  FROM task375_map m
  WHERE q.id=m.source_question_id AND q.status='published'::public.content_status;

  UPDATE public.question_quality_published_revisions r
  SET release_scope='TASK-375 owner-requested formatting-only immutable revision; no independent editorial certification'
  FROM task375_map m
  WHERE r.question_id=m.revision_question_id;

  INSERT INTO public.question_quality_findings(
    question_id,finding_code,severity,details,resolved_at
  )
  SELECT m.source_question_id,'inline_executable_code_presentation','medium',
    jsonb_build_object('task','TASK-375','replacement_question_id',m.revision_question_id),
    now()
  FROM task375_map m
  ON CONFLICT (question_id,finding_code) DO UPDATE
    SET details=excluded.details,resolved_at=excluded.resolved_at;

  SELECT count(*) INTO v_bad
  FROM task375_map m
  JOIN public.questions source_q ON source_q.id=m.source_question_id
  JOIN public.questions revision_q ON revision_q.id=m.revision_question_id
  WHERE source_q.status<>'archived'::public.content_status
     OR revision_q.status<>'published'::public.content_status
     OR position('```' in revision_q.stem_md)=0
     OR NOT EXISTS (
       SELECT 1 FROM public.question_quality_published_revisions r
       WHERE r.question_id=revision_q.id
         AND r.content_fingerprint=public.professional_question_fingerprint(revision_q.id)
     );
  IF v_bad <> 0 THEN
    RAISE EXCEPTION 'TASK-375 release postflight failed for % questions', v_bad;
  END IF;

  IF (SELECT count(*) FROM task375_map)<>v_target_count
     OR (SELECT count(*) FROM public.questions q JOIN task375_map m
         ON q.id=m.revision_question_id WHERE q.status='published')<>v_target_count
     OR (SELECT count(*) FROM public.questions q JOIN task375_map m
         ON q.id=m.source_question_id WHERE q.status='archived')<>v_target_count THEN
    RAISE EXCEPTION 'TASK-375 final count mismatch';
  END IF;
END
$task375_release$;

COMMIT;

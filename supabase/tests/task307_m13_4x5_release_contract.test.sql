-- TASK-307 post-release: exactly seven better native 4x5 candidates
-- replace their original 4x4 versions. Keep old IDs for attempts.
DO $test307$
DECLARE v int;
BEGIN
 SELECT count(*) INTO v FROM public.questions q
 WHERE q.group_code='S7.SEC' AND q.format='Y2'::public.question_format
   AND q.status='published'::public.content_status;
 IF v<>71 THEN RAISE EXCEPTION 'TASK-307 71 active Y2 required, got %',v; END IF;

 SELECT count(*) INTO v FROM public.questions q
 WHERE q.group_code='S7.SEC' AND q.status='published'::public.content_status;
 IF v<350 THEN RAISE EXCEPTION 'TASK-307 M13 published baseline unexpectedly small: %',v; END IF;
 -- Production snapshot is 414, but CI fresh seed intentionally omits some
 -- live source-linked legacy items. Exact production total is audited post-import.

 SELECT count(*) INTO v FROM (
  SELECT oldq.id FROM public.questions oldq
  JOIN public.questions newq
    ON newq.source_reference = replace(oldq.source_reference,'m13-axr-native-v1:','m13-qc-v2:')
  WHERE oldq.source_reference IN (
    'm13-axr-native-v1:Y2:AXRN-01-Y2-01',
    'm13-axr-native-v1:Y2:AXRN-02-Y2-01',
    'm13-axr-native-v1:Y2:AXRN-03-Y2-01',
    'm13-axr-native-v1:Y2:AXRN-04-Y2-01',
    'm13-axr-native-v1:Y2:AXRN-05-Y2-01',
    'm13-axr-native-v1:Y2:AXRN-06-Y2-01',
    'm13-axr-native-v1:Y2:AXRN-07-Y2-01'
  )
  AND oldq.status='archived'::public.content_status
  AND newq.status='published'::public.content_status
  AND oldq.source_lesson_id=newq.source_lesson_id
  AND oldq.construct_id=newq.construct_id
  AND oldq.stem_md=newq.stem_md
  AND (SELECT count(*) FROM public.question_options o
      WHERE o.question_id=newq.id AND o.side='a')=4
  AND (SELECT count(*) FROM public.question_options o
      WHERE o.question_id=newq.id AND o.side='b')=5
 ) AS verified;
 IF v<>7 THEN RAISE EXCEPTION 'TASK-307 old/new revision parity failed: %',v; END IF;
END
$test307$;

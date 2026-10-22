-- TASK-459/460 immutable CSS/HTML display and answer key release regression.
-- Fresh CI database has no owner-specific source items: skip after asserting task records absent.
DO $css_release$
DECLARE n int;bad int;key_changes int;
BEGIN
 SELECT count(*) INTO n FROM public.question_bank_revisions
 WHERE evidence->>'task' IN ('TASK-459','TASK-460');
 IF n=0 THEN
   RAISE NOTICE 'TASK-459/460 absent on empty CI fixture; production source assertions skipped';
   RETURN;
 END IF;
 IF n<>3 THEN RAISE EXCEPTION 'Expected three published CSS/HTML revisions, found %',n;END IF;
 SELECT count(*) INTO bad FROM public.question_bank_revisions br
 JOIN public.questions src ON src.id=br.source_question_id
 JOIN public.questions dest ON dest.id=br.revision_question_id
 LEFT JOIN public.question_quality_published_revisions snap ON snap.question_id=dest.id
 WHERE br.evidence->>'task' IN ('TASK-459','TASK-460')
 AND (
   src.status<>'archived'::public.content_status
   OR dest.status<>'published'::public.content_status
   OR dest.group_code<>'S5.WEB'
   OR snap.content_fingerprint IS DISTINCT FROM public.professional_question_fingerprint(dest.id)
   OR NOT public.is_question_official_mock_eligible(dest.id)
   OR NOT public.group_mock_eligible(dest.id)
   OR (SELECT count(*) FROM public.question_options opt WHERE opt.question_id=dest.id)<>4
   OR NOT (dest.stem_md LIKE '%'||chr(96)||chr(96)||chr(96)||'html%')
   OR (br.evidence->>'task'='TASK-459' AND
      (dest.stem_md NOT LIKE '%'||chr(96)||chr(96)||chr(96)||'css%'
      OR dest.stem_md NOT LIKE '%<h2>Sarlavha</h2>%'))
 );
 IF bad<>0 THEN RAISE EXCEPTION 'CSS release history, markup, mock or snapshot invalid: %',bad;END IF;

 SELECT count(*) INTO key_changes FROM public.question_bank_revisions br
 JOIN public.question_keys oldk ON oldk.question_id=br.source_question_id
 JOIN public.question_options oldopt ON oldopt.question_id=br.source_question_id AND oldopt.id::text=oldk.payload->>'correct_option_id'
 JOIN public.question_keys newk ON newk.question_id=br.revision_question_id
 JOIN public.question_options newopt ON newopt.question_id=br.revision_question_id AND newopt.id::text=newk.payload->>'correct_option_id'
 WHERE br.evidence->>'task' IN ('TASK-459','TASK-460')
 AND oldopt.content_md IS DISTINCT FROM newopt.content_md;
 IF key_changes<>1 THEN RAISE EXCEPTION 'Expected exactly one CSS color key correction, got %',key_changes;END IF;
 IF NOT EXISTS(
 SELECT 1 FROM public.question_bank_revisions br
 JOIN public.question_keys newk ON newk.question_id=br.revision_question_id
 JOIN public.question_options newopt ON newopt.question_id=br.revision_question_id AND newopt.id::text=newk.payload->>'correct_option_id'
 WHERE br.evidence->>'task'='TASK-459'
 AND newopt.content_md LIKE 'Sarlavha purple va qalin%'
 AND br.evidence->>'human_independent_editor'='false'
 ) THEN RAISE EXCEPTION 'CSS universal-selector/inheritance answer correction missing';END IF;
 RAISE NOTICE 'TASK-459/460 PASS: three immutable readable questions, one corrected key, two preserved keys, mocks ready';
END;
$css_release$;
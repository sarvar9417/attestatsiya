-- LOCAL ONLY | NOT A MIGRATION | NEVER RUN ON PRODUCTION.
-- This opt-in patch changes no answer keys, option choices, exam histories,
-- archived questions, question status or human editorial review records.
-- It strengthens source_reference on exactly nine current REVIEW questions.
-- No public GitHub source contains actual question bodies/answer keys.
--
-- Use ONLY on locally seeded Supabase with explicit acknowledgement:
--   PGOPTIONS="-c attest.qa.review_source_patch_20261021=LOCAL_ONLY" \
--     psql "$LOCAL_DATABASE_URL" -v ON_ERROR_STOP=1 \
--       -f supabase/maintenance/task20261021_nine_review_source_metadata_LOCAL_ONLY.sql
-- Back up local test data before use. This file MUST NOT be moved into migrations.

BEGIN;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '20s';
DO $guard$
DECLARE
  item record;
  target_id uuid;
  matched int;
  altered int := 0;
  old_stem text;
BEGIN
  IF current_setting('attest.qa.review_source_patch_20261021',true)
       IS DISTINCT FROM 'LOCAL_ONLY' THEN
    RAISE EXCEPTION 'LOCAL ONLY: opt-in session flag is not set; no changes applied';
  END IF;
  FOR item IN SELECT * FROM (VALUES
        ('GV2:GV-ED-027','ICT5 (2020) physical PDF pp.77-78: Paint.NET rectangular selection and crop; replaces vague ''Paint'''),
        ('GV2:GV-ED-039','SUPPLEMENT Adobe Photoshop: https://helpx.adobe.com/photoshop/using/editing-layer-masks.html'),
        ('GV2:GV-ED-040','SUPPLEMENT Adobe Photoshop: https://helpx.adobe.com/photoshop/using/editing-layer-masks.html'),
        ('GV2:GV-ED-046','SUPPLEMENT Adobe Photoshop Gaussian Blur FILTER (not Blur Tool): https://helpx.adobe.com/photoshop/desktop/effects-filters/blur-sharpen-filters/filter-effects-reference.html'),
        ('GV2:GV-HT-024','SUPPLEMENT MDN disabled https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled ; required https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/required'),
        ('GV2:GV-RV-006','SUPPLEMENT Microsoft 32bppRGBA https://learn.microsoft.com/is-is/windows/win32/wic/-wic-codec-native-pixel-formats'),
        ('GV2:GV-RV-019','SUPPLEMENT Inkscape union https://inkscape.org/my/doc/keys.html'),
        ('GV2:GV-RV-020','SUPPLEMENT Inkscape intersection https://inkscape.org/my/doc/keys.html'),
        ('GV2:GV-RV-021','SUPPLEMENT Inkscape z-order raise-to-top https://inkscape.org/my/doc/keys.html')
  ) AS s(source_alias,supplement) LOOP
    SELECT count(*), (array_agg(q.id ORDER BY q.id))[1], min(q.stem_md)
      INTO matched,target_id,old_stem
      FROM public.questions q
     WHERE q.status='review'
       AND split_part(q.source_reference,';',1)=item.source_alias
       AND q.source_reference LIKE '%expert review required%'
       AND q.source_reference NOT LIKE '%QA-SUPPLEMENT-20261021%';
    IF matched<>1 THEN
      RAISE EXCEPTION 'Expected one unpatched REVIEW edition for %, found %',item.source_alias,matched;
    END IF;

    IF item.source_alias='GV2:GV-ED-027'
       AND old_stem NOT LIKE 'Paintdagi %' THEN
      RAISE EXCEPTION 'Ambiguous Paint question has changed; do not overwrite it';
    END IF;

    UPDATE public.questions q
       SET source_reference=q.source_reference
           || ' | QA-SUPPLEMENT-20261021 (independent evidence; no release approval): '
           || item.supplement,
           stem_md=CASE
             WHEN item.source_alias='GV2:GV-ED-027'
              THEN regexp_replace(q.stem_md, '^Paintdagi ', 'Paint.NET dasturidagi ')
             ELSE q.stem_md END
     WHERE q.id=target_id
       AND q.status='review'
       AND split_part(q.source_reference,';',1)=item.source_alias;
    GET DIAGNOSTICS matched=ROW_COUNT;
    IF matched<>1 THEN
      RAISE EXCEPTION 'Failed exact guarded metadata patch on %',item.source_alias;
    END IF;
    altered:=altered+1;
  END LOOP;
  IF altered<>9 THEN RAISE EXCEPTION 'Expected nine changes, got %',altered; END IF;
END
$guard$;
COMMIT;

-- Read-only postflight: expects 9 review annotated, zero archived annotated.
WITH aliases(source_alias) AS (VALUES
  ('GV2:GV-ED-027'),
  ('GV2:GV-ED-039'),
  ('GV2:GV-ED-040'),
  ('GV2:GV-ED-046'),
  ('GV2:GV-HT-024'),
  ('GV2:GV-RV-006'),
  ('GV2:GV-RV-019'),
  ('GV2:GV-RV-020'),
  ('GV2:GV-RV-021')
)
SELECT q.status::text,count(*) AS editions,
       count(*) FILTER(WHERE q.source_reference LIKE '%QA-SUPPLEMENT-20261021%') AS patched
FROM aliases a JOIN public.questions q
  ON split_part(q.source_reference,';',1)=a.source_alias
GROUP BY q.status
ORDER BY q.status;

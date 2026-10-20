-- TASK-346: media-dependent questions cannot be newly published with
-- a missing/untrusted picture. A conservative cue: actual image asked about,
-- not merely a question discussing images or using textual diagrams.
-- Original published/archived revisions, attempts and answer keys stay intact.
BEGIN;

CREATE OR REPLACE FUNCTION public.task346_requires_source_visual(p_stem text)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = ''
AS $fn$
  SELECT coalesce(p_stem,'') ~* '(ushbu[[:space:]]+(surat|rasm|tasvir)da[[:space:]]+qaysi|quyidagi[[:space:]]+(surat|rasm|tasvir)da[[:space:]]+qaysi|rasmda[[:space:]]+ko.rsatilgan[[:space:]].{0,70}qaysi)';
$fn$;

CREATE OR REPLACE FUNCTION public.task346_has_usable_source_visual(p_assets jsonb, p_stem text)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = ''
AS $fn$
  SELECT CASE WHEN jsonb_typeof(p_assets)<>'array' THEN false ELSE
    EXISTS (
      SELECT 1 FROM jsonb_array_elements(p_assets) AS x(asset)
      WHERE
        (x.asset->>'kind'='image'
         AND (x.asset->>'src') ~ '^/[a-z0-9-]+/[a-zA-Z0-9_-]+[.](svg|jpg|jpeg|png)$'
         AND NOT (x.asset->>'src') ~ '[.][.]'
        )
        OR (x.asset->>'kind'='logic_circuit'
         AND (x.asset->>'diagram_id') ~ '^G[0-9]{3}$'
         AND position('[[FIG:' || (x.asset->>'diagram_id') || ']]' in coalesce(p_stem,''))>0
        )
    ) END;
$fn$;

CREATE OR REPLACE FUNCTION public.task346_guard_visual_publication()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path=''
AS $fn$
BEGIN
  IF NEW.status='published'::public.content_status
    AND OLD.status IS DISTINCT FROM 'published'::public.content_status
    AND (
      public.task346_requires_source_visual(NEW.stem_md)
      OR EXISTS (
        SELECT 1 FROM jsonb_array_elements(NEW.assets) AS x(asset)
        WHERE (x.asset->>'kind')='source_screenshot'
           OR (x.asset->>'type')='source_visual_review_required'
      )
    )
    AND NOT public.task346_has_usable_source_visual(NEW.assets, NEW.stem_md)
  THEN
    RAISE EXCEPTION USING ERRCODE='23514',
      MESSAGE='QUESTION_REQUIRED_SOURCE_VISUAL_MISSING',
      DETAIL='Attach the exact first-party source image or keep the question in review.';
  END IF;
  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS trg_task346_visual_publication ON public.questions;
CREATE TRIGGER trg_task346_visual_publication
BEFORE UPDATE OF status ON public.questions
FOR EACH ROW EXECUTE FUNCTION public.task346_guard_visual_publication();

-- Telegram message #4842 was imported as REVIEW with an empty asset list.
-- Safe to fix the mutable review revision; the historically published #4843
-- is permanently immutable and is restored at the UI layer by its exact ID.
UPDATE public.questions q
SET assets = jsonb_build_array(jsonb_build_object(
  'kind','image',
  'diagram_id','pedguli-4842-classroom-game',
  'src','/pedguli-source/pedguli-4842-classroom-game.jpg',
  'alt','Ta’limiy o‘yin orqali o‘rganish metodining asl Telegram surati'
)), updated_at=now()
WHERE q.id='05d53eb9-56de-454c-9440-e207668dd2c4'::uuid
 AND q.source_reference='telegram:@PedMahoratGuli:4842'
 AND q.status='review'::public.content_status
 AND q.assets='[]'::jsonb;

REVOKE ALL ON FUNCTION public.task346_guard_visual_publication() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.task346_requires_source_visual(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.task346_has_usable_source_visual(jsonb,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.task346_requires_source_visual(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.task346_has_usable_source_visual(jsonb,text) TO service_role;

COMMIT;

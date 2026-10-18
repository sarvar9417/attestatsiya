-- TASK-206: textbook-only Form/Report/Import items are not official S4.DB pool
-- until independently remapped to a valid specification construct.
CREATE OR REPLACE FUNCTION public.guard_m09_native_supplemental_release()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.status = 'published' AND NEW.source_reference LIKE 'MSACCESS-V2-NATIVE/%'
     AND EXISTS (
       SELECT 1 FROM jsonb_array_elements(COALESCE(NEW.assets,'[]'::jsonb)) asset
       WHERE asset->>'type'='supplemental_textbook_only'
     ) THEN
    RAISE EXCEPTION 'TASK-206: textbook-only supplementary item requires specification coverage review'
      USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_m09_native_supplemental_release ON public.questions;
CREATE TRIGGER trg_m09_native_supplemental_release
BEFORE INSERT OR UPDATE ON public.questions
FOR EACH ROW EXECUTE FUNCTION public.guard_m09_native_supplemental_release();

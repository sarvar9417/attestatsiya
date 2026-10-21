-- PROPOSED FOR SINGLE COORDINATED FINAL RELEASE ONLY. NOT APPLIED.
-- Before release, create a formal migration via `supabase migration new`,
-- paste this SQL into that file, and run final required CI.
-- NOT VALID preserves legacy published rows until atomic reviewed replacement,
-- while new bad published rows are rejected by PostgreSQL.
ALTER TABLE public.questions
ADD CONSTRAINT pedagogy_published_no_source_label_chk
CHECK (
  status <> 'published'::public.content_status OR
  group_code NOT IN ('KS','PM.GEN','PM.MET') OR
  stem_md !~* '(^[[:space:]]*#|asl[[:space:]]+(pdf|manba|to.plam)|manbadagi|(^|[[:space:]])manbada[[:space:]]|manbaga[[:space:]]+ko.ra|manba[[:space:]]+qaysi|manba[[:space:]]+to.plam|pdfda|pedmahorat[[:space:]]*[|])'
) NOT VALID;

-- Run in a LATER maintenance window, only AFTER every offending published
-- original has been atomically replaced/archived:
-- ALTER TABLE public.questions VALIDATE CONSTRAINT pedagogy_published_no_source_label_chk;

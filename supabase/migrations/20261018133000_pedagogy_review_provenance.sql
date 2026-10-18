-- P0-06: trace AI-assisted/imported questions without forging staff authorship.
-- No fabricated authors, editorial signatures or publication status changes.
BEGIN;
CREATE TABLE IF NOT EXISTS public.pedagogy_question_provenance (
 question_id uuid PRIMARY KEY REFERENCES public.questions(id) ON DELETE RESTRICT,
 origin_kind text NOT NULL CHECK(origin_kind IN(
   'ai_assisted_draft','pdf_source_rewrite','pedguli_import','other_import_unverified'
 )),
 origin_reference text NOT NULL,
 authored_by uuid NULL REFERENCES auth.users(id),
 human_reviewed_by uuid NULL REFERENCES auth.users(id),
 final_approved_by uuid NULL REFERENCES auth.users(id),
 source_document text NULL,
 source_page integer NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 reviewed_at timestamptz NULL,
 approved_at timestamptz NULL,
 CONSTRAINT pedigree_review_actor_distinct CHECK
  (authored_by IS NULL OR human_reviewed_by IS NULL OR authored_by<>human_reviewed_by),
 CONSTRAINT pedigree_approver_distinct CHECK
  (authored_by IS NULL OR final_approved_by IS NULL OR authored_by<>final_approved_by),
 CONSTRAINT pedigree_approval_has_human_signoffs CHECK
  (final_approved_by IS NULL OR (human_reviewed_by IS NOT NULL AND
    approved_at IS NOT NULL AND reviewed_at IS NOT NULL))
);
ALTER TABLE public.pedagogy_question_provenance ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.pedagogy_question_provenance FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.pedagogy_question_provenance TO service_role;

INSERT INTO public.pedagogy_question_provenance (
 question_id,origin_kind,origin_reference,authored_by
)
SELECT q.id,
 CASE
   WHEN q.source_reference LIKE 'authored:m15-topictest-20261018:%'
      THEN 'ai_assisted_draft'
   WHEN q.source_reference LIKE 'authored:pedagogy-pdf-corpus:%'
      THEN 'pdf_source_rewrite'
   WHEN q.source_reference LIKE 'authored:pedguli-%'
      THEN 'pedguli_import'
   ELSE 'other_import_unverified'
 END, coalesce(q.source_reference,'unknown'), q.author_id
FROM public.questions q
WHERE q.status='review'::public.content_status
 AND q.group_code IN('KS','PM.GEN','PM.MET')
ON CONFLICT(question_id) DO NOTHING;

DO $verify$
DECLARE v_missing integer;
BEGIN
 SELECT count(*) INTO v_missing FROM public.questions q
 WHERE q.status='review'::public.content_status
 AND q.group_code IN('KS','PM.GEN','PM.MET')
 AND NOT EXISTS(SELECT 1 FROM public.pedagogy_question_provenance p
   WHERE p.question_id=q.id);
 IF v_missing>0 THEN RAISE EXCEPTION 'Missing provenance for % review questions',v_missing; END IF;
 IF EXISTS(SELECT 1 FROM public.pedagogy_question_provenance
 WHERE human_reviewed_by IS NOT NULL OR final_approved_by IS NOT NULL) THEN
 RAISE EXCEPTION 'Never generate fictitious human editorial signatures';
 END IF;
END
$verify$;
COMMIT;

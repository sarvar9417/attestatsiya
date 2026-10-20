-- TASK-343: pure validator positive/negative/boundary regression.
-- Transaction rollback guarantees the test does not alter live question data.
BEGIN;
DO $test$
BEGIN
  IF NOT public.question_explanation_is_source_only(
    'Pedmahorat|Guli Telegram kanalida ekspert tomonidan ✅/✔ belgisi bilan ko‘rsatilgan javob: Pedagogik takt.'
  ) THEN RAISE EXCEPTION 'CHECKMARK_SOURCE_ONLY_NOT_FLAGGED'; END IF;

  IF NOT public.question_explanation_is_source_only(
    'Pedmahorat|Guli Telegram kanalida ekspert tomonidan ✅/✔ bilan belgilangan javob: A.'
  ) THEN RAISE EXCEPTION 'ALTERNATE_SOURCE_ONLY_NOT_FLAGGED'; END IF;

  IF NOT public.question_explanation_is_source_only(NULL)
     OR NOT public.question_explanation_is_source_only('  ')
  THEN RAISE EXCEPTION 'MISSING_EXPLANATION_NOT_FLAGGED'; END IF;

  IF public.question_explanation_is_source_only(
    'Pedagogik takt — o‘quvchining sha’ni va qadr-qimmatini asragan holda, xatosini vaziyatga mos, muloyim va konstruktiv tuzatish mahorati. Bu yondashuv ham talabchanlikni, ham hurmatni saqlaydi.'
  ) THEN RAISE EXCEPTION 'REAL_DIDACTIC_RATIONALE_REJECTED'; END IF;

  IF public.question_explanation_is_source_only(
    'Birinchi amal 2²=4, undan keyin 4+3=7; amallar tartibiga rioya qilish kerak. Manba: informatika darsligi.'
  ) THEN RAISE EXCEPTION 'SOURCE_CITATION_WITH_TEACHING_INCORRECTLY_REJECTED'; END IF;
END $test$;
ROLLBACK;

# TASK-431: Mantiq 2-dars same-stem option consistency

Private Supabase audit identifies two same-PDF identical-stem groups with **different options**:
- №51 and №53 have the same normalized stem, different four-option sets.
- №55 and №59 have the same normalized stem, different four-option sets.

All four source rows have private `qa20261022_same_pdf_identical_stem_but_different_options` flags. Q55 source option B `(A→B)∧(B→A)` and D `(A∨¬B)∧(¬A∨B)` are logically identical (XNOR), so a dedicated `ambiguous_or_nonunique_answer` release blocker was added. Q59 earlier had two correct choices; its *separate* new corrected question revision has already been released under TASK-428. Original source options and historical learner data are unchanged. Both source provenance and new independent authoring are required for a legitimate replacement.

# TASK-346 QA16 — Original MS PowerPoint source questions, figure-dependent release gates

**2026-10-21 · Source-grounded private review · No production deployment or learner publication.**

Original source: [MS PowerPoint testlar.pdf](https://drive.google.com/file/d/1LEZo28L9u6DQXGvHU5himMvBl8_Bi0xi/view), **nine physical PDF pages**. The previous extractor stored only external question numbers 1,4,5,6,7,9,14 and erroneously appended several neighboring questions. The original PDF actually contains **15 independent numbered tasks**.

## Source recovery completed in private Supabase staging

- Split four contaminated candidate boundaries: #1 previously also carried #2–3 and unrelated Q3 choices; #7 appended Q8 and had eight choices; #9 appended Q10–13; #14 appended Q15. Kept source wording/identity, removed wrongly attached options.
- Restored **8 authentic missing candidates**: Q2 (physical page 2), Q3 (page 3), Q8 (page 4), Q10 (page 5), Q11 (page 6), Q12 (page 7), Q13 (page 8) and Q15 (page 9). All eight are private, original-key NULL and source-page inspected.
- Reconstructed a separate original figure-index entry for each of 15 tasks. **9 require the owner's original figures**: Q1,2,9,10,11,12,13,14,15. In staging these remain `text_plus_figure` / `pdf_figure_not_exported_to_platform` and `content_publish_ready=false`. Original animation panels and coordinate paths cannot be safely replaced with guesses.
- **6 text-only tasks** Q3–8 need no screenshot to understand the complete question. Independent solution proposals, with Uzbek explanations, were added in `telegram_informatika_pdf_independent_qa` for Q3=B (Transition/Animation), Q4=B (F5), Q5=D (all objects), Q6=B (Exit), Q7=B (Animation Pane), Q8=B (Duration). `confirmed_by_human=false` and original `answer_key=NULL` throughout.

## Reproducible checks

`scripts/tests/test_telegram_informatika_powerpoint_qa16.py` has six offline regression tests: all 15 physical-page provenance mappings, authentic missing questions and source extraction boundaries, explicit nine visual-release requirements, independent six proposal indices, and no automatic publication. Python standard library only; it neither accesses source media nor changes any public table.

## Post-batch private staging counts

| Current state | Count |
| --- | ---: |
| Private PDF candidate questions | **592** |
| Physical original source pages inspected | **592** |
| Independently derived multiple-choice proposals | **182** |
| Independently derived free responses | **107** |
| Source defect blockers | **63** |
| Next action: fix source defect | **67** |
| Next action: restore original figures | **29** |
| Next action: independent solution | **153** |
| Next action: human editorial review | **343** |
| Official source author answer keys | **0** |
| Learner-ready candidate questions | **0** |

The four next-action queue buckets sum to 592 source candidates. Source PDF snippets and third-party original diagram images stay private and are **not** part of GitHub commits. Copyright/media rights, actual original diagram-to-question association, editorial approval and question completeness remain gates. This change does not ship a Supabase migration, production release or a change to public.questions / public.lessons.

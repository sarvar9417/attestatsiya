# 2026-10-21: All-assessment resume + independent semantic question QA

## Scope of account-scoped recovery

The single-user assessment runner is shared by **mock, section/bolim, topic/mavzu,
adaptive practice/mashq, diagnostic, spaced review/takrorlash, weak-topic/zaif,
pedagogik_15, AXB chapter, and custom**. A new read-only RPC enforces auth.uid(),
kind, and, when relevant, module UUID, lesson UUID, AXB chapter and requested count.
The server returns the original timestamp and owner answers, without answer keys.
The client restores them and the last question index, and fails closed if lookup
fails. A custom exam can be restored after the browser loses React Router state.

Group mock is **not** an ordinary `exams` attempt. It already restores by
`group_mock_state` and `group_mock_my_rooms` (membership filtered). This change
also reopens the last still-active, server-confirmed room when navigating back
without a room ID or invite code.

The existing offline answer queue is retained, including first-submission
semantics outside the revisable official mock.

## Production question bank snapshot (read-only audit)

- Published total **5,439**: Y1 **4,439**, Y2 **506**, Y3 **494**.
- Published Y1 KS/PM.GEN/PM.MET: **794**.
- Automatic cue screen: **359** Y1 items in which at least two incorrect
  distractors use absolute expressions such as `faqat`, `umuman`,
  `hech qachon`, `doimo`, with no such expression in the correct option.
  **111** of the 359 are KS/PM.GEN/PM.MET. These are **screening candidates**,
  not validated incorrect questions or permission to edit published content.
- Existing open quality findings at audit time include **131**
  `implausible_distractors` and **405** `y1_answer_length_high_risk`.
  A heuristic may overlap with these categories and is not an independent
  human judgment or a claim of confirmed error.
- Exact identical answer-option text: **0** published Y1/Y2/Y3 questions.
  Case-insensitive comparison suggested 19 Y1 duplicates, but all 19 are
  programming output examples where `True` vs `true` and similar casing
  differences can be meaningful. No automatic quarantine is justified.
- A structural screen of native Y2 options flagged 20 legacy all-side-a
  objects; these already have separate legacy remediation and need review
  against the source/side-mapping contract before publication.

## Seven manually inspected KS items (wording + keyed answer + all choices)

Each source is `published` and immutable. Each linked successor stays `review`,
with four unique alternatives and the **original correct answer text** preserved.
Wrong options were rewritten as reasonable but distinguishable professional
competencies, not absurd/improper behaviors. This work is **AI-assisted,
owner-requested editorial drafting** and does **not** represent independent
human validation, source authentication or permission to publish.

| Source ID prefix | Tested competency | Original issue | Corrective distinction |
|---|---|---|---|
| 00667b8d | Professional growth by peer learning | Discipline and scorekeeping unrelated to CPD | Training/lesson planning vs self-development |
| 00ebd044 | Classroom relationship and upbringing | Test-only and reading-only straw men | Formative assessment, design, CPD vs educational climate |
| 03804c6d | Start of pedagogical planning | Three choices used `faqat` | Learning outcome vs assessment evidence, tasks and aids |
| 0840199b | Reflective CPD and digital teaching | Uniformly negative distractors | Monitoring vs teaching design vs personal growth |
| 0df54c53 | Parent/student feedback | Admin timetable and unrelated discipline | Assessment, differentiation, parent partnership vs feedback |
| 137858f7 | Diagnostic tool design | Schedule/discipline distractors | Monitoring, activity planning, visuals vs diagnostic design |
| 15c2ef53 | Career relevance for disengaged pupil | Threats, blanket memorization, punishment | Readiness, prior knowledge, group format vs career relevance |

DB postflight: **7** archived? NO — original published: **7**;
review successors: **7**; answer-key text preserved: **7**;
new option count = 4: **7**. No release approval was inserted.
Twelve older Y2/Y3 clarity revisions likewise remain `review`.

## Remaining genuine work

The **359 cue candidates** need item-by-item semantic triage, including source,
key, plausible incorrect alternatives, near-correct second answers and
length distribution. Do not publish automated rewrites. Release each successor
only through the existing independent expert/owner-approved workflow,
and preserve historical attempts and source provenance.

Production rollout is separate: GitHub merge does not mean the new backend
is live; previous Vercel backend attempts were BLOCKED.

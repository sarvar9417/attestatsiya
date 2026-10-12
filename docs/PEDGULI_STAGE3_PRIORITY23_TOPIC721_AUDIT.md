# @PedMahoratGuli — 23 priority messages and 721 topic-gaps: stage 3

**Release status:** DRAFT PR #97. **DO NOT DEPLOY, MERGE, OR APPLY THESE MIGRATIONS TO PRODUCTION** without the user's separate final authorization.

## Actual source basis

User-supplied 20 Telegram Desktop HTML files; 1,394 distinct candidate source messages plus 1,014 duplicate message occurrences. The original copyrighted text and private audit remain outside the public Git repository.

This report contains **source message IDs and editorial interpretation**, not copied original texts, answer keys, attachments, or historical-exam authenticity statements.

### Quality audit of 23 high-priority messages

| Editorial triage result | Count | Telegram source ID examples |
|---|---:|---|
| Deliberately close-looking but distinct answer choices; requires reference confirmation | 11 | 118, 125, 291, 13100 |
| Strongly overlapping source-question stems; possible semantic reuse | 3 | 1282 ↔ 118; 3181 ↔ 158; 13749 ↔ 13012 |
| Clearly repeated answer choices | 2 | 4558, 15339 |
| Answer choices repeated AND original image/question context absent | 2 | 5636, 5640 |
| Language/definition needs independent disambiguation | 2 | 13014, 13753 |
| Existing source topic was wrongly matched to KS.03 | 2 | 16752, 16754 → proposed PM.GEN.08 |
| Parser may falsely flag a numeric-choice answer grouping | 1 | 847 |
| **Total** | **23** | |

**Crucial:** Editorial diagnosis does not establish which option is correct. No original answer key is verified, and reuse permission for original channel wording has not been granted.

### Private stage-3 reclassification of 721 originally untagged candidates

| Result | Count |
|---|---:|
| Proposed construct from inspection of high-priority original source texts | 14 |
| Proposed from precise stem-only keywords | 34 |
| Two or more plausible constructs detected; hold | 2 |
| Missing-media high-priority sources with no topic assigned | 2 |
| Remaining without adequately reliable topic evidence | 669 |
| **Total originally unclassified** | **721** |

Thus **48** new provisional topic suggestions; **673** still without single proposed topic. Only one clear lexical construct triggers a keyword proposal. A question with multiple possible constructs is not forcibly categorized.

The local private database includes `candidate_topic_reclassification` (1,394 records), `priority23_editorial_triage` (23 records), and `candidate_semantic_duplicate_hints` (3 pairs) with verified/human-review flags all false. Original 1,394 candidate content and prior audit were preserved; no keys or licensing states were changed.

### Platform integration

- `backend/src/services/pedguli-topic-suggestions.service.ts`: only reads question STEM; does not borrow keywords from distractor options. Outputs proposal, confidence state and lexical evidence, no correct-answer decision.
- `backend/src/services/pedguli-high-priority-topic-proposals.ts`: 21 source-ID topic *proposals*, including 2 suspected previous KS.03 mapping errors. The 2 image-dependent IDs have no topic.
- `pedguli_source_candidates.proposed_constructs`, `topic_suggestion_state`, `topic_suggestion_evidence` live separately from initial `suggested_constructs` and do not assert editorial status.
- Admin private inbox indicates provisional proposed topics as **unverified**.
- SQL, backend, frontend and test changes must pass CI before review.

### Important limitations

1. This local SQLite reclassification does not mean the 1,394 source records have been imported into remote PostgreSQL staging. The separate staging connection is still required.
2. The platform's lexical heuristics may differ slightly from Python's private offline screening. The 48 figure is the observed **offline audit**, not a claim about an unseen remote database.
3. No answer can be marked independently verified without identifying an authoritative reference, edition and applicable explanation.
4. Original text/media redistribution requires appropriate use rights; source research and independently authored educational practice are distinct.
5. The user explicitly withheld production deployment permission; these changes remain in a Draft branch only.

# Pedagogika — 2026-10-21: balanced-answer semantic repair, six items

## Completed production corrections

In production Supabase project `plyqezulrfowyblsfpzy`, six formerly published Y1 questions were independently rewritten as safer learner-facing Y1 revisions; all six new questions are now **published** and all six old immutable originals are **archived**. Original option UUIDs and past exam attempts were never modified.

| Original | New published | Focus |
|---|---|---|
| `111b69f5-ad72-4db3-9066-c2860f90fe8f` | `d0e1d90a-5b95-451b-a55c-f9fd0a762daa` | «two childrens»: linguistic overgeneralization vs L1 transfer |
| `c8e660dd-5422-42ef-aff2-aeb53b5a37e9` | `790ed146-2a90-4eee-ae36-9e48284fa775` | Keys-stadi vs debat/Jigsaw/Akvarium |
| `5d5bbed8-cd54-46ec-a29d-6d89acc58fc2` | `a91d61f5-8167-44f9-af78-bb54735b8125` | Hamdardlik va minnatdorlik tarbiyasi |
| `99a49e79-53ca-4373-bab4-1231dc0bc9d9` | `63ac5c05-5983-4d2d-a7e5-c134d50552f9` | Tiklovchi pedagogik yondashuv; avoids absolute «never punish» claims |
| `596b3d99-fb4e-4c12-9593-d813ca4e0a06` | `e6d77cd2-6939-446f-a378-ad7568afdc30` | Source image discussion vs rule-bound debate, question self-contained |
| `35c29429-543f-4f65-8754-677b8ad01e93` | `72d27d53-82a8-4098-985e-ca08ed82674b` | Water cycle explanation vs diagram as supporting visual |

## Exact postflight facts

On production:
- All six revisions reported `published` and all six source snapshots `archived`.
- Six out of six have exactly four distinct options, correct mapped response UUID, unique keys, verified content-fingerprint owner authorization and official practice-selection eligibility.
- Word balance invariant holds: longest option <= 1.8 × shortest, and correct <= 1.25 × longest distractor.
- Before this batch there were **31** published Y1 with character-length imbalance above 1.8× and **6** published Y1 where the keyed response was longer than 1.8× the shortest. After the six safe replacements: **25** imbalanced and **0** unusually long keyed responses.
- Exactly repeated published question stems across pedagogy groups remain **0**.

SQL:
- `supabase/maintenance/20261021_stage_four_high_cue_y1_revisions.sql`
- `supabase/maintenance/20261021_stage_two_longest_answer_y1_revisions.sql`
- `supabase/tests/pedagogy_six_balanced_replacements_qa.sql`

## Publication authority & safeguards

Owner requested publication of ready questions and delegated AI-led pedagogical editing in the active 2026-10-21 conversation. The existing owner release-waiver mechanism was used per published content fingerprint, and `publish_pedagogy_revision` performed the atomic replacements. **This is an owner-authorized AI review, not an independent human reviewer signature, certification of official exam key, or verified original authorship.** Taxonomy mapping, option balance and stored-key conceptual coherence were checked.

The remaining 25 character-length imbalances are *heuristic suspects*, not necessarily incorrect answers. Continue source-specific conceptual checks before replacement. Avoid automatic truncation or mass overwrites.

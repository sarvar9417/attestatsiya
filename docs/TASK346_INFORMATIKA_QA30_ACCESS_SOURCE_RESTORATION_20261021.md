# TASK-346 QA30 — Restore 15 MS Access source exercises (2026-10-21)

Source: [Access takrorlash savollari.pdf](https://drive.google.com/file/d/1sH3-BRvavsci_OfwB2Eu5Y3DIYeSpWJP/view), exactly **10 physical PDF pages**, SHA-256 `ebc196d70da487e603d4d1b5706d15d2cbd6133a546fc77e7888854ddd653f63`. The original pages were inspected with rendered page images and their source-native extracted text.

## Private database changes (completed and independently read back)

The previous private staging contained only **six candidates**, IDs `1,5,6,11,12,15`; multiple other original numbered tasks had been glued to candidates 1, 6, and 12. Source-native numbering is actually **1 through 15** with physical page mapping:

| Physical page | Original source questions |
| ---: | --- |
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |
| 4 | 4, 5, 6 |
| 5 | 7 |
| 6 | 8 |
| 7 | 9 |
| 8 | 10, 11, 12 |
| 9 | 13 |
| 10 | 14, 15 |

Inserted the **nine missing original question IDs** `2,3,4,7,8,9,10,13,14` and replaced the six merged stems with the corresponding independently delimited source text; each retains its original physical page. All 15 have `source_visually_checked=true`, `answer_key=NULL`, and no learner-release authorization.

Page 4's PDF text extractor had appended the *country-name list* from original question **4** onto the *school-subject list* of question **6** because its text reading order differs from the page's visual layout. Independent original visual review correctly associates:
- Q4 `Like '*e*i*'` with **Argentina, Meksiko, Kanada, Tailand, Singapur, Finlandiya, Shvetsiya, Braziliya, Mangoliya**.
- Q5 `Like '*ra*'` with **Kurash, Futbol, Karate, Taekvondo, Xokkey, Regbi, Teniss, Basketbol, Sambo**.
- Q6 `Like '*a'` with **Matematika, Fizika, Musiqa, Kimyo, Biologiya, Informatika, Chizmachilik, Tariz, Texnologiya**.

Relevant table provenance is explicitly identified in the reworded private candidate records. Remaining **12** questions dependent on original tables, diagrams, query grid screenshots, or relation tables were entered into the private `visual_index` with `content_publish_ready=false`; no original media was pushed into public Git or learner Storage.

## Expert-only unapproved free-response proposals

| Source question | Independently calculated, unapproved result |
| ---: | --- |
| 1 | **72 kg, 421 000 so‘m** — Abubakr roziy deliveries |
| 2 | **90 kg, 320 000 so‘m** — Beruniy deliveries |
| 3 | **67 kg, 361 000 so‘m** — Mahtumquli deliveries |
| 4 | **3** — `Like '*e*i*'` (Argentina, Meksiko, Shvetsiya) |
| 5 | **2** — `Like '*ra*'` (Kurash, Karate) |
| 6 | **6** — `Like '*a'` (six subject names ending in a) |
| 10 | **7** rows — `NOT(Jinsi='A' AND Matematika<Ingliz tili)` |
| 11 | **1** row — exact matching `FISH IN(...)` and gender=A (Azizova) |

Delivery calculations treat the provided `Vazni, kg` as each **complete order's listed weight** and exclude the ground floor from stair charges, exactly as explained in the source context. Each proposed value has source-specific explanation; proposals remain `human_approved=false` and `publish_ready=false`, never populated as official keys.

## Source safety findings

- Original **Q9** on physical page 7 has an invalid MS Access SQL expression: the `LIKE` pattern has no tested field/preceding `WHERE`, and the quoted pattern is not closed. Added `invalid_source_formula` blocker; no fabricated SQL repair or official output.
- Original **Q15** on physical page 10 describes *xola* as a sister of one's mother **or father**, whereas the usual Uzbek kinship distinction uses *xola* for a maternal aunt and *amma* for a paternal aunt. Marked `ambiguous_or_nonunique_answer` awaiting editorial clarification rather than inventing a relational-ID answer.
- Source tasks 7–9 and 12–15 still need complete original tables/screenshots and human review. Source content was not silently replaced with generic examples.

At post-write verification: **657** private PDF candidates overall; **245** independent MC proposals, **164** independent free proposals, **113** blocker records; source author answer keys **0**. The 15 Access questions are reviewed only in private staging.

Regressions: `scripts/tests/test_informatika_access_source_qa30.py` (12 Python standard-library unit tests) checks physical mapping, three independent delivery calculations, three Access LIKE filters, original Boolean predicates, invalid SQL and source terminology release gates. No original source files committed; no public learner writes, migration, official key promotion or production deployment.

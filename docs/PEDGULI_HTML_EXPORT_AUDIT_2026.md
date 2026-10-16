# @PedMahoratGuli Telegram Desktop HTML export — source audit

**Status:** PRIVATE SOURCE REVIEW / code-staging only — **DO NOT DEPLOY**, merge, import or alter production without explicit final user authorization.

## Scope

User-supplied Telegram Desktop HTML export: **20 files**, `messages.html` through `messages20.html`. Local parsing as of 2026-10-11. Historical coverage in available files: **2025-02-03 to 2026-08-10**; no October 2026 posts present. Export channel heading: `Pedmahorat|Guli`.

| Measured item | Count | Interpretation |
|---|---:|---|
| Default channel message records | 19,536 | Unique Telegram record IDs across 20 HTML pages |
| Text-bearing messages | 15,433 | Not a count of distinct pedagogical resources |
| Messages containing an A/B/C/D option pattern | **2,408** | **Candidates**; not yet validated question bank |
| Distinct candidate text after case/whitespace normalization | **1,394** | 1,014 messages had exact normalized text duplicates |
| Answer-marker-like messages among question candidates | **107** | `✅` or answer-language hints, **NOT** a verified correct key |
| Telegram polls | **1,783** | Export poll often has generic `A/B/C/D` and little context |
| Messages with media metadata | **5,150** | Not equivalent to included image/video/audio bytes |
| Media without extractable message text | **2,322** | Content may exist only in excluded image/audio/PDF |

Media breakdown by HTML labels: 4,327 photo; 351 audio file; 211 document file; 179 voice message; 82 video. HTML commonly reports **“Not included, change data exporting settings to download.”** This is metadata, not the media file itself. The missing assets must not be treated as analyzed.

## Mapped examination categories (heuristic, multi-label)

Numbers below count matching candidate **posts**, not unique validated questions; a post may match several constructs. Misspellings and Cyrillic/transliteration may cause misses.

| Construct candidate | Matched post candidates |
|---|---:|
| KS.01 (planning) | 175 |
| KS.03 (assessment) | 475 |
| KS.05 (safe environment) | 20 |
| PM.GEN.01 (general pedagogy) | 15 |
| PM.GEN.02 (didactic principles) | 269 |
| PM.GEN.03 (upbringing) | 16 |
| PM.GEN.04 (lesson types, classroom organization) | 66 |
| PM.GEN.05 (class leadership) | 70 |
| PM.GEN.06 (pedagogical tact, speech, technique) | 173 |
| PM.GEN.07 (pedagogical abilities) | 289 |
| PM.GEN.08 (teaching technologies, methods, Bloom) | 140 |
| PM.MET.02 (informatics method specifically) | 1 |

**Substantive signal:** pedagogical skills and general teaching predominate. Cross-disciplinary subject examples must not be mistaken for Informatics methodology. The isolated PM.MET hit does not imply that the original content teaches Informatics-specific didactics comprehensively. Informatics-specific pedagogy must continue to be built from the 2026 subject specification and M16 methodology sources.

## Observed editorial issues requiring review

1. The export has many repetitive promotional/feedback and outcome testimonials. Testimonials are **not questions or independently verified 2025/2026 exam results**.
2. A large portion of questions refer to a neighboring poll or accompanying photo. A single HTML entry can lack the complete question or key; do **not** attach arbitrary neighboring polls as authoritative keys.
3. `#tushgan`, `#attestatsiya_2025`, or similar channel claims are **source claims only**, not confirmation from the testing authority.
4. Answers need textbook/official standard verification. Emoji or a highlighted letter is insufficient for publication.
5. Names, forwarded author details, photo/audio attachments and personal testimonials should not be copied into the public repository.
6. A raw, private review queue is generated locally with original text, post URL, inferred construct labels, deduplication and review flags. It is deliberately **not** committed to GitHub.

## Publication policy and staged work

- User explicitly prohibited production before a later specific approval; this applies to **both Vercel and production Supabase migrations** for new work.
- Original channel content may be **studied and indexed privately**; copyrighted wording, bundled teaching materials, images and recordings must **not be republished** on the public platform without appropriate permission/license.
- Use pedagogical topics to write **independently authored** questions with exact four answers, independently checked correct key, explanation, `source_reference` and `source_lesson_id`. Mark source attribution accurately: `author_written/topic_inspiration`; **not** genuine historical questions.
- Maintain 2026 official quota KS 5 + PM.GEN 7 + PM.MET 3 with a distinct-construct selection test.
- Full source review requires media re-export with Photos/Files/Voice/Audio enabled; JSON is optional because HTML text is parseable.

## Current safe next steps

- Expand the *internal* original practice bank for KS + general pedagogy using high-frequency, verified constructs.
- Review objective mapping and correct keys; keep uncertain source candidates in `review` state, never `published`.
- Do not run SQL against Supabase production or merge the Draft PR without user request.

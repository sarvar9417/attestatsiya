# QA28 — Axborot kodlash PDF: source precision and safety gates

Source: [Axborot kodlash test.pdf](https://drive.google.com/file/d/1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5/view), original physical source pages **2** and **10** reviewed directly, not guessed from duplicate staging text.

## Question 2 — unspecified bits per symbol

Original states 128 pages, 32 lines per page, 60 characters per line, transmission speed 512 bits/sec. **It does not state the number of bits per character**. The total is 245,760 characters.

- If 8-bit characters are **added as an external assumption**, duration = 245760×8/512 = 3840 seconds = **64 minutes (D)**.
- If 7-bit characters are assumed, duration = **56 minutes**, not one of the original choices.
- If 16-bit characters are assumed, duration = **128 minutes**.

The 8-bit assumption is not contained in the original PDF. Consequently, the stored *independent, unapproved* D suggestion is explicitly conditional; it is **not** a verified source answer key. The source candidate has an `unspecified_unit_or_encoding` learner-publication blocker.

## Question 10 — ambiguous source algorithm

The original source string is `B27A4C15B92`, but the password instructions do not explicitly define whether the adjacent digits are individual digits or groups (27, 4, 15, 92), how to handle consecutive digits with no directly preceding letter, or whether removing identical characters means dropping all repeated copies or retaining one. No choice should be promoted without editorially resolving these independent interpretation issues. Candidate #10 is blocked with `ambiguous_or_nonunique_answer`.

## Verified changes

The two source candidate pages and their A–D options were rechecked against the original PDF; only stale unverified-extraction flags were removed, and the precise source defect notes were appended. Source text and answer options remain unchanged. Two distinct `attest_ingest.telegram_informatika_pdf_release_blockers` entries were added with `learner_publish_blocked=true` and `human_approved=false`.

Six offline regression tests in `scripts/tests/test_axborot_kodlash_source_qa28.py` check bit arithmetic for three encodings, the conditional D calculation, differing cipher tokenization and safety isolation. No original image bytes, official answer key publication, learner DB writes, migrations or manual production deployment.

At QA28 readback: **620** private candidates, **0** authored answer keys, **98** source blockers, **238** independent MC proposals and **155** independent free-response proposals (each proposed solution requires human approval).

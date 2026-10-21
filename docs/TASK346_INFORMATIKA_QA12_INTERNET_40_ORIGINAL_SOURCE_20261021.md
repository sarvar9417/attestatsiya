# TASK-346 QA12 — 40 Internet/WWW PDF source questions

**2026-10-21 · Independent expert review; no publication or production deployment.**

## Actual source and scope

The 3-page owner-provided [Internet test.pdf](https://drive.google.com/file/d/1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX/view) was inspected in original page renders. Question numbers 1–14 appear on physical page 1, numbers 15–28 on page 2, and 29–40 on page 3. All 40 pre-existing private staging rows were checked and assigned exact physical-page provenance, without changing official answer keys or marking any learner content publishable.

## Resolved source extraction faults

- Original question **14** (WWW HTTP/HTTPS protocol) had question 15 appended to answer choice D in the old extracted text, producing eight options. Restored its exact four original choices: FTP, SMTP, HTTP va HTTPS, TCP. Marked its question boundaries.
- Original question **28** (definition of search engine) included question 29 appended to D, producing eight options. Restored its original four choices: Brauzer turi, Internetga ulanish dasturi, Axborot qidirish dasturi, Antivirus.

Both source candidates now have exactly four options. Q15 and Q29 remain separate original questions; there are no invented extra candidates.

## Expert review and source limitations

**35 source-numbered independent multiple-choice proposals** were stored with subject-specific Uzbek explanations. They remain `needs_editorial_review`, `confirmed_by_human=false` and `answer_key=NULL`. See the zero-based option indices and page provenance in `scripts/tests/test_telegram_informatika_internet_qa12.py`.

Five source questions were explicitly blocked rather than given unjustified unique keys:

| Original question | Source issue |
| ---: | --- |
| 9 | “URL ning nechta asosiy qismi?” lacks a stated definition of what counts as a component (scheme, authority, path, query, fragment). |
| 11 | “Domen nomi qaysi qism?” has no complete example URL; `www.google` is an incomplete domain, and `.uz` is a TLD. |
| 20 | “WEB 3.0 nimaga asoslangan?” treats AI as the unique definition; semantic Web and decentralized Web usage differ. |
| 21 | “WEB 3.0 ning asosiy farqi” treats personalization as exclusive, though it is common in Web 2.0 too. |
| 39 | “Web 3.0 da kontent ...” equates AI recommendations with Web 3.0, although neither uniquely defines the other. |

These are editorial curriculum/terminology ambiguities, not grounds to silently rewrite the owner's source or auto-publish new answer keys.

## Verified private counts, after QA11 + QA12 writes

| Metric | Count |
| --- | ---: |
| Total PDF question candidates | **582** |
| Visually inspected candidates | **318** |
| Independent MCQ proposals | **143** |
| Independent free-answer proposals | **89** |
| Source defect blocker records | **55** |
| Queue: source defect repair | **59** |
| Queue: original figure needed | **20** |
| Queue: original page inspection | **262** |
| Queue: editorial approval | **241** |
| Candidate original answer keys | **0** |
| Learner-publish-ready | **0** |

The four next-action queue buckets partition the 582 private candidates. Blocker record totals and priority queue sizes are **different measures**. All original source PDF/image files and original attachments remain private. No public question or lesson writes, no production DB migration, no deployment.

## Regression gate

`scripts/tests/test_telegram_informatika_internet_qa12.py` covers all 40 source numbers and page locators, all 35 expert-choice proposals, all five unapproved source blockers, the Q14/Q28 merged-OCR boundary fixes, and nonpublication invariants. Standard Python library only.

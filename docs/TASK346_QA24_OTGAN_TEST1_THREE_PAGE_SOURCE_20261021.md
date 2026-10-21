# QA24 — O'TGAN MAVZULARDAN TEST (1): independent source-grounded review

Original connected Drive file `1z9ZUfv7HQVVL0K5w5SVYkYpPHmAwizhE`, title `O`TGAN MAVZULARDAN TEST (1).pdf`, **3 physical pages, 15 multiple-choice questions**. All 15 original page locators, four choices each, and arithmetic/code semantics were visually rechecked. This source has an existing **potential duplicate-PDF fingerprint review** flag; it was deliberately preserved for later editorial deduplication.

## Thirteen independent proposed choices

| Original Q | Proposed choice | Evidence |
| ---: | --- | --- |
| 1 | A | Eight unique letters in CHEVROLET; sorted 3-bit R=101 |
| 2 | C | A=(38,36), B=(26,31), distance 13 decimal =23 base five |
| 4 | D | 33 base seven times 3 =72 decimal =110 base eight |
| 5 | C | 2^10−999=25 unused binary codes |
| 6 | C | LCM(8,9,13)=936 |
| 7 | C | 20-to-15 bits/pixel saves 1 MB; original size 4 MB |
| 8 | A | 3^6 is first count of signals >=575 |
| 9 | D | b+8=24, base b=16 |
| 10 | C | binary 1111 minus binary 10 =13 years |
| 11 | D | Software/Hardware/Brainware |
| 12 | A | 421.232 base five =111.536 decimal |
| 13 | B | 21..43 base five has 13 omitted numbers |
| 14 | A | 101 values need 7 bits; 80 readings use 560 bits |

All 13 are private expert-only proposed answer indexes with original-source Uzbek explanations, `needs_editorial_review`, `confirmed_by_human=false`, and source keys null. No learner publishing.

## Two release-blocked source ambiguities

**Q3:** Original phrase information length in bits does not specify a character encoding or fixed bits per character. Eight-bit-per-character and UTF-8/Unicode representations can differ, especially with typographic apostrophes. The conditional '1F0 hex' result is **not** author-verified.

**Q15:** 160 words/min ×6 letters/word ×240 min=230400 characters; 225 KiB requires two unstated conventions: one byte per character and 1024 bytes per Kbyte. Decimal kB and variable-length encoding produce different results.

Both have `unspecified_unit_or_encoding` blockers, learner publish blocked=true, human approved=false, with explicit source evidence. Original duplicate-source review flags remain.

## Technical verification

`scripts/tests/test_informatika_otgan_pdf_qa24.py` performs 16 independent offline regressions: alphabet codes, base arithmetic, Pythagorean distance, color-depth ratio, encoding convention ambiguity, humidity bit packing and source dedup/release gates. No source original PDF bytes are included, no public learner data is changed, and no production migration or deploy occurs.

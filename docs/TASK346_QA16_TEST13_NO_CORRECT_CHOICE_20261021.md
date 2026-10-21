# QA16 source defect — no valid answer option in question 6

Original source: `Attestatsiya test 6.pdf`, titled `Attestatsiya test №13`, physical PDF **page 6**.

The source's digitwise-sum concatenation algorithm gives the following required numeral bases:

| Printed input and screen output | Mathematically required base |
| --- | ---: |
| 28, 64 → 812 | 10 |
| 49, 93 → 1011 | 12 |
| 55, 86 → 1012 | 11 |
| 57, 43 → 1112 | **8** |

For pair 4, hundreds-position-style first digit sum is `5+4=9` decimal and second `7+3=10` decimal. In base eight, these print `11` and `12`, concatenated `1112`. In base nine, the output would be `1011`, not `1112`.

The source provides only a=11, b=9, c=12, d=10. **No offered A–D mapping can be correct**, because base 8 is not offered. The correct editorial action is to fix the *original source* or offer a revised question with a clear provenance note; choosing one of the original options is not acceptable.

A private Supabase `attest_ingest.telegram_informatika_pdf_release_blockers` entry has been added for source question 6 with `issue_code=no_correct_choice`, `learner_publish_blocked=true`, `human_approved=false`. Original answer keys remain null. The independent test `scripts/tests/test_informatika_test13_no_correct_choice_qa16.py` verifies all four source calculations and proves that none of the four offered bases supports pair 4.

No original source image is checked into Git, and this documentation does not authorize publication or a production deploy.

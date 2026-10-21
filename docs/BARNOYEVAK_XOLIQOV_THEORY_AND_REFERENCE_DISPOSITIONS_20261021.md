# Barnoyevak Pedagogika — Xoliqov I bob theory staging and extra source classification

Sana: 2026-10-21. Owner Drive: `barnoyevak@gmail.com`, `pedagogika/files`.

## Xoliqovning I bobidan haqiqiy nazariya importi

**Source:** `Xoliqov Pedagogik mahorat I bob.pdf`, Drive ID `1lPKtFtuZOhS_3zpQvVFPHMAWX5gLtzUj`. Authenticated PDF text directly checked.

The source distinguishes four connected components of a teacher's professional mastery: humanistic orientation, subject/professional knowledge, pedagogical ability, and pedagogical technique. Existing published `pedagogik-etika-nutq-texnika-va-takt` and `pedagogik-qobiliyat-va-uning-turlari` lessons cover some parts, but literal sampled text did not present the four together; source-level semantic reconciliation remains required.

A **new paraphrased review-only theory lesson** was added to `public.lessons`:
- slug `pedagogik-mahorat-tort-komponent-va-kasbiy-rivojlanish`
- UUID `fb252321-7156-4502-8d9c-797daa9ca4f9`
- module `umumiy-pedagogika`; `order_idx=113`
- **status `review`**, 2,897 saved characters; readback checked
- `topic_test_question_count=20` means the platform's desired question target, **not** 20 created test records.
- Review exercise distinguishes ability, technique, methodological knowledge and humanistic responsibility using a classroom scenario.

Full textbook content was **not** copied to the user-facing lesson. Terminology, topic taxonomy, actual source alignment, near-duplicate teaching and question quality must pass editorial review before publishing.

## Three more Drive files classified without careless data ingestion

- `Xodiyev Academy Turbo Marafon- 2026.pdf` (Drive `1dAS363HqLbCDUsDRK2Fzo2TyJwI4Pbct`): course enrollment, coaching platform and marketing outline. **Out of scope for extracting exam questions**; not a confirmed attestatsiya test source.
- `Repetitsion test 2025.pdf` (Drive `1_M_rzDJhI_QctjGicWbV3pilXs-IPGvc`): primarily answer-only explanations linked to named textbook sources, with missing full original stems and options. **Reference only pending source reconciliation**; these answer markers are *not* transferable to other questions without direct matching.
- `Pedmahorat to'plam 2025 kuzgi.pdf` (Drive `1PoFyrtpidhZ2Scex1REb8pcJE0xkkXKK`): already **36** PDF source candidates in Supabase: 20 `accepted_general` with unverified markers, 10 `rejected`, 4 `verified` and publicly linked with independently verified keys, **2 `needs_review`** with independently checked keys but near duplicates. Do not import these 36 again.

## Two previously open near-duplicate crosslinks fixed (metadata only)

`Pedmahorat to'plam 2025 kuzgi.pdf` Q22 and Q37 were previously `needs_review` with `answer_key_status='independently_verified'`, but carried near-duplicate flags and extensive prior comparison notes. They have been explicitly linked using `near_duplicate_of_candidate_id` to Q22/Q37 respectively in `Pedmahorat to'plam 2025 kuzgi (3).pdf`. Both answers and editorial statuses were preserved without publication. Q37's cross-referenced source is linked to a public question: do not create a second scored version.

## Full task remains open

All 64 sources should receive an accurate disposition, **not** just a filename. The CSV source manifest has now been reconciled for 21 previously pending source entries during this branch (two test PDFs, supplementary Word/theory/standard sources, demo visual blockers, three source classification decisions and Xoliqov chapter). Several lengthy textbooks and source collections still require staged theory or question reconciliation.

No manual deployment or scoring-table mutation.

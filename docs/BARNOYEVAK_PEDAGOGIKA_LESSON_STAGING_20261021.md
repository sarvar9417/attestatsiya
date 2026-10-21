# Barnoyevak pedagogika — nazariya import ledger (2026-10-21)

Source folder: https://drive.google.com/drive/folders/1XryoV_toq5QDVfLBxhKnsa-jwbcmk-KS (nested files, 64 total). Target Supabase project: `plyqezulrfowyblsfpzy`.

## Two genuinely staged theory lessons

| Source file | DB lesson slug | UUID | State | Checked |
|---|---|---|---|---|
| `Mirzayeva Pedagogika nazriyasi qollanma 2-mavzu.pdf` | `pedagogika-fan-sifatida-tadqiqot-metodlari` | `61142167-61ff-4a2d-aa91-195dddb1c0a6` | `review` | 1718 body characters; unique slug |
| `4-Inklyuziv-talim-nazariya-va-metodika.pdf` | `inklyuziv-talim-asoslari-va-moslashtirish` | `b963b71c-0a9a-4520-bf42-590ea64a8661` | `review` | 1744 body characters; unique slug |

The source texts were read using authenticated barnoyevak Drive access. Original sources were condensed into independent teaching notes; no wholesale textbook copying. Both lessons were added directly to the live `lessons` table under `umumiy-pedagogika`, with stable unique slugs and `review` status. Post-write database readback confirmed one record for each slug, nonempty text, and `review` status. **Not published** and not equivalent to pedagogical expert sign-off.

The schema enforces `topic_test_question_count` 10–50; lesson drafts use the default target of 20 as configuration, **not** an assertion that 20 accompanying question-bank entries have been authored.

## Remaining acceptance steps

- Review each text for exact terminology and correctness against relevant specification / current teacher professional standard.
- Map each section to pedagogika constructs and verify overlap with previously published lessons.
- Attach source provenance through the established editorial workflow; do not invent verified keys.
- Draft, independently solve and validate related lesson questions; publish only after all editorial gates pass.
- Continue all other source files in the Drive folder, updating per-file ingestion dispositions.

Scope: live draft insertion already performed; this document is a reproducible audit note, **not** a migration, additional live mutation, publication or manual production deploy.

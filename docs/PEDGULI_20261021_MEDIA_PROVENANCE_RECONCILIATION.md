# Pedmahorat|Guli original media provenance reconciliation — 2026-10-21

## Yutuq: manba fayllari uchun xususiy lokatorlar tiklandi
Private original Google Drive bilan `result.json` Telegram eksportidagi `attest_ingest.telegram_pedagogy_archive_items` yozuvlari **fayl nomi bo‘yicha to‘liq moslashtirildi**. Published question/attempt yoki ro‘yxatdan o‘tgan foydalanuvchi ma’lumotlari o‘zgarmadi. Bu audit xususiy Google Drive fayllarining IDlarini **public GitHub’ga chiqarmaydi**.

| Eksport katalogi | Archive media records | Drive source locators in private source_metadata | Original unique files used |
|---|---:|---:|---:|
| `photos/` | 4,509 | **4,509** | 3,191 original Google Drive image IDs |
| `voice_messages/` | 167 | **167** | 152 original Drive `.ogg` files |
| `files/` | 215 | **215** | 67 distinct Drive source IDs |
| `(File exceeds maximum size...)` | 447 | **0** | No original path in export |
| `(File not included...)` | 150 | **0** | No original path in export |
| **Total** | **5,488** | **4,891** | **597 records cannot yet be linked from this export** |

## Exact locator method
- The owner-provided Drive folder `photos` was paginated through all **3,195** listed entries. All **4,509** Telegram `photos/` record paths matched a Drive `photo_N@date.jpg` name. 4 extra Drive files were not referenced by those source paths.
- The owner-provided Drive `voice_messages` folder had **152 OGG** files, mapping to **167** archive records that reuse files in some messages.
- The original `files` folder had **104 stored items**, of which **67 unique file IDs** map to 215 archive records; includes PDFs, DOCs, previews and occasional `record.ogg`.
- Private row metadata augmented (not replaced): `drive_image_id/name/size`, `drive_audio_id/name/size`, `drive_document_id/name/size`, timestamp audit flags. Original `source_media_path`, original Telegram caption, original `media_file_not_uploaded` remain unchanged.
- No media bytes uploaded to Supabase public storage, no new `assets` created for learner questions. `image_content_reviewed=true` was **not** set for unreviewed images.
- The remaining 597 lack an original filename/path (447 exceeds size and 150 not included); require an explicit Telegram export with media or independent source location. Do not infer filenames.
- 152 audio files being locatable does not mean they were transcribed. Original OGG bytes should be privately retrieved and independently checked before publishing summaries.
- No source correct key was inferred from a photo's file name or Telegram caption alone.

## Editorial next steps
1. From the 4,509 linked image messages, prioritize those with pedagogical test captions and explicit ✔ answer, retrieve source bytes, inspect each visual against its caption, and write unique source-backed explanations. Preserve images' original context and don't publish until the image can be delivered by a verified static or private asset in the application.
2. Privately retrieve OGG sources and transcribe Uzbek/Russian audio with source-message and timestamp trace; validate difficult pedagogic claims against textbooks. Never mark transcription complete without checking audio.
3. Request re-export of missing 597 media files; do not treat their placeholder metadata as usable images.
4. 2025 PDF `Pedagogik mahorat to'plam 2025 (6).pdf`: after first-wave 11 original-keyed questions, another **5** printed questions (№88,93,101,105,117) were independently source-checked, adapted to balanced four-choice MCQ, and linked/published in private production. The first audit in PR #361 is a snapshot.
5. See related `docs/PEDGULI_SOURCE_RELEASE_QA_20261021.md` and `docs/PEDGULI_VOICE_DRIVE_LOCATOR_AUDIT_20261021.md` on main.

**QA:** read-only query in `scripts/pedguli_20261021_media_locator_preflight.sql` validates counts and index invariants. No migration, no API exposure, no deploy, no auth change.

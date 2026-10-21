# PedGuli voice-message Drive locator audit — 2026-10-21

## Original sources
- Telegram export `result.json`: 21,085 messages in original archive.
- The export references **417 audio_file**, **183 voice_message**, **75 video_file**, **16 video_message** — **691** audio/video records.
- In the local extraction, 415 audio_file + 16 voice_message + 75 video_file + 16 video_message = **522** record placeholders (media not included / exceeds export maximum). The other **169** records contain relative file names but not their original bytes in the local workspace. No audio transcript may be invented from the captions or file names.

## Found connected Google Drive source
- Drive owner: original source-file account attached to project.
- Folder `voice_messages`: `https://drive.google.com/drive/folders/1TZZyVFVzJtIJNv1Ho4RdB92WdHQp-Smp`.
- Live folder enumeration via Drive `list_folder(top_k=300)`: **152 OGG files**.
- Cross-reference Drive exact file names to private archive `attest_ingest.telegram_pedagogy_archive_items.source_media_path`:
  - **167 message records** now have `source_metadata.drive_audio_id`, `drive_audio_name`, `drive_audio_size_bytes`, and `source_audio_transcription_status='source_bytes_on_drive_not_transcribed'`.
  - The mapping count is larger than the 152 distinct files because some original Telegram records refer to the same file path more than once.
  - Only metadata was updated; no audio bytes were published, no private file contents copied to GitHub, no transcript/fabricated lesson.
- Original `source_media_path` and `media_file_not_uploaded` statuses are retained to distinguish **Drive-known** from **stored locally/available to frontend**.

## Next required step before theory/test release from audio
1. For each original Drive ID, download or stream the raw OGG **privately** into an authorized speech-recognition environment.
2. Transcribe Uzbek/Russian speech, preserve message id and exact audio timestamp.
3. Review transcriptions against source audio; distinguish trainer’s factual statements, uncertain opinions, source-question text, and channel promotion.
4. Test any proposed answers against textbooks/specification and preserve editorial review. Only publish verified items under existing owner gate.
5. Do not claim audio has been listened to or transcribed until confirmed.

**Safety:** Private audio content is never committed to a public repository. All 167 DB rows are pointers, not transcripts. No change to production exam answers.

## Related work
See `docs/PEDGULI_SOURCE_RELEASE_QA_20261021.md` and `scripts/pedguli_20261021_source_release_preflight.sql` in this PR for PDF and visual QA.

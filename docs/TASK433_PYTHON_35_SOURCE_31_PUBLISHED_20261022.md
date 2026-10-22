# TASK-433 — Python operatorlari PDF: 35 / 35 manba tahlili, 31 yangi versiya release

2026-10-22. Manba: [Python dasturlash tilida Operatorlar.pdf](https://drive.google.com/file/d/1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z/view). Python 3 dasturlash tili.

## Auditoriya uchun QA jarayoni

Asl manbaning №1–35 raqamli kodlari Python interpreterda ishga tushirildi. **31** misolning haqiqiy stdout natijalari va alohida yaratilgan Y1 4 javob variantlari `docs/qa/task433-python31-executable-manifest.json`ga qo‘shildi. `node --test scripts/task433-python31.test.mjs` har bir kodni `python3 -I -c` bilan mustaqil qayta bajaradi; ajratilgan yangi yagona key bilan solishtiradi.

### Asl xatolar — SOURCE as-is nashr qilinmasin

| № | Asl xato |
|---|---|
| 17 | `print("2" in str(123) and 2 in)` sintaktik xato; ikkinchi `in` o‘ng operandsiz |
| 21 | `"py"+"thon" is "python"` satr interning/constant-folding muhitga bog‘liq |
| 22 | `300 is 300` literal identity optimizatsiyaga bog‘liq; `==` rostligi bilan almashtirmang |
| 30 | `print((16 >> 2) bit_length())` nuqta yo‘q, `SyntaxError`; yaroqli kod `(16 >> 2).bit_length()` qayta yozishni talab |

№17, 21, 22, 30 avval `attest_ingest.telegram_informatika_pdf_release_blockers`da bloklangan, ularning bloklari saqlandi va AI ularni o‘zicha «source approved» deb belgilamadi.

## Release sinovlari

- `supabase/maintenance/task433_publish_31_python_operator_questions.sql` production `BEGIN…ROLLBACK` rehearsal **PASS**, `COMMIT` **PASS**.
- Live postflight: **31/31 published**, **124/124 4 variant**, **31/31 keys**, **31/31 official_mock_eligible**, **31/31 immutable revision snapshot**, **0 human signature claims**.
- `is_generated=true`, author/source provenance: `task433:pdf-editorial:20261022:<source_file_id>:q<original_number>`.
- Old source candidate records/answer keys, student attempts and `exam_items` histories were never changed. 35 source questions remain separately in `attest_ingest` and are not source approved.
- Code correction does not claim Python implementation-invariant behavior for source №21/22. No frontend deployment.

## Follow-up

The 695 PDF source staging candidates remain separate from published Y1 rewritten successors; source defects and image restoration continue. Previously TASK-431 released 24 Internet questions, TASK-432 6 PowerPoint questions, TASK-428/429 15 logic/system questions.

---
title: Lesson Package and Session Report
version: 0.1
decision_date: 2026-07-22
status: confirmed flow; schema draft
---

# 1. Asosiy ma’lumot almashish qarori

MVP v1’da ChatGPT va sayt pullik API orqali emas, **structured package** orqali ishlaydi.

Primary channel:

- clipboard copy/import.

Backup channel:

- JSON file import/export.

# 2. Dars boshidagi oqim

1. ChatGPT roadmap + oldingi evidence asosida `Lesson Package` yaratadi.
2. Sarvar package’ni copy qiladi yoki `lesson.json` oladi.
3. Site `Import from ChatGPT` orqali validate qiladi.
4. Valid package yangi lesson/session yaratadi.
5. Tasks bir vaqtda bittadan ko‘rsatiladi.

# 3. Dars oxiridagi oqim

1. Site task completion, answers, attempts, time, errors, scores, SRS va audio metadata yig‘adi.
2. `Session Report` yaratadi.
3. Sarvar copy qiladi yoki `session-report.json` export qiladi.
4. ChatGPT report’ni tahlil qiladi.
5. Feedback, roadmap update va next package beradi.

# 4. Confirmed Lesson Package fields

- package/schema version;
- lesson ID;
- roadmap/unit/week identifiers;
- title;
- clear objective;
- success criteria;
- Green 90 / Yellow 45 / Red 10 variants;
- explanation/content blocks;
- visual resources;
- ordered tasks;
- assessment rules;
- vocabulary/SRS cards;
- Error Bank targets;
- audio/speaking/microteaching task;
- spiral review dates;
- required evidence;
- source metadata where applicable.

# 5. Confirmed Session Report fields

- report/schema version;
- lesson/session identifiers;
- completed/skipped tasks;
- mode and total time;
- learner answers and attempts;
- support used;
- accuracy metrics;
- pause/response-latency metrics where available;
- vocabulary recall;
- listening/reading metrics;
- new/returned/improved errors;
- SRS status changes;
- audio metadata/portfolio reference;
- energy, difficulty, interest;
- recommended next targets;
- export timestamp.

# 6. Validation requirements

- incompatible version rejected safely;
- missing required field clear error beradi;
- invalid package existing data’ni overwrite qilmaydi;
- import preview;
- duplicate detection;
- stable IDs;
- backup before risky migration;
- raw learner response preserved;
- generated feedback/model separate.

# 7. Conceptual Lesson Package v0 draft

```json
{
  "schema": "ema.lesson-package",
  "version": "0.1",
  "lesson": {
    "id": "CA-W01-D01",
    "unit_id": "CA-W01",
    "title": "Sentence Engine for Data Representation",
    "objective": "Explain bit and byte using complete sentences.",
    "success_criteria": [
      "Use an explicit subject and correct verb",
      "Use bit/bits and byte/bytes accurately",
      "Record a 60–90 second unsupported explanation"
    ]
  },
  "modes": {
    "green": {"minutes": 90, "task_ids": []},
    "yellow": {"minutes": 45, "task_ids": []},
    "red": {"minutes": 10, "task_ids": []}
  },
  "tasks": [],
  "vocabulary": [],
  "error_targets": [],
  "evidence_required": [],
  "reviews": []
}
```

# 8. Conceptual Session Report v0 draft

```json
{
  "schema": "ema.session-report",
  "version": "0.1",
  "session": {
    "lesson_id": "CA-W01-D01",
    "mode": "green",
    "started_at": "",
    "completed_at": "",
    "active_minutes": 0
  },
  "task_results": [],
  "metrics": {
    "target_accuracy": null,
    "first_listening_percent": null,
    "second_listening_percent": null,
    "speaking_seconds": null,
    "long_pauses": null,
    "active_recall_count": null
  },
  "errors": {
    "new": [],
    "returned": [],
    "improved": []
  },
  "srs_updates": [],
  "audio": [],
  "reflection": {
    "energy_1_to_5": null,
    "difficulty_1_to_5": null,
    "interest_1_to_5": null
  },
  "next_target_candidates": []
}
```

# 9. Schema status

Yuqoridagi JSON — **confirmed fieldlardan tuzilgan v0 conceptual draft**, final implementation schema emas.

Final schema keyingi bosqichda:

1. pages;
2. entities;
3. relationships;
4. import/export use cases;
5. validation;
6. migrations;
7. acceptance tests

bilan birga tasdiqlanadi.

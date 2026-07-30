# DATABASE_SCHEMA.md

## 1. Umumiy qoidalar

- Primary key: `uuid default gen_random_uuid()`.
- Vaqt: `timestamptz`, UTC.
- User-facing stable code: `text unique`.
- Soft archive: `archived_at`; critical tarix hard-delete qilinmaydi.
- Har jadvalda kerak bo‘lsa `created_at`, `updated_at`.
- `updated_at` trigger bilan.
- Enum qiymatlar migratsiya bilan boshqariladi.
- Learner protected jadvallari RLS bilan.
- Published revisionlar immutable trigger bilan himoyalanadi.

## 2. Enumlar

```text
app_role:
  learner | author | reviewer | publisher | admin

publication_status:
  draft | in_review | changes_requested | approved | published | archived

specification_status:
  draft | active | retired

exam_section:
  specialty | professional_standard | pedagogy | methodology

cognitive_level:
  knowledge | application | reasoning

question_type:
  single_choice | matching | ordering

session_type:
  diagnostic | practice | checkpoint | review | mock_exam

session_status:
  created | active | submitted | expired | cancelled | invalid

mastery_status:
  not_started | learning | provisional | stable | regressed

review_outcome:
  pending | passed | failed | missed
```

## 3. Identity va audit

### `profiles`

| Ustun | Tip | Qoida |
|---|---|---|
| `id` | uuid | PK, FK `auth.users.id` |
| `display_name` | text | 2–100 |
| `timezone` | text | default `Asia/Tashkent` |
| `locale` | text | default `uz-Latn` |
| `exam_date` | date | nullable |
| `daily_goal_minutes` | smallint | 5–240 |
| `onboarding_completed_at` | timestamptz | nullable |
| `created_at`, `updated_at` | timestamptz | required |

RLS: user own row read/update; admin all. Role user tomonidan tahrirlanmaydi.

### `user_roles`

| Ustun | Tip | Qoida |
|---|---|---|
| `user_id` | uuid | FK profile |
| `role` | app_role | required |
| `granted_by` | uuid | admin FK |
| `granted_at` | timestamptz | required |

PK `(user_id, role)`. RLS: own roles read; admin write.

### `audit_logs`

`id`, `actor_user_id`, `action`, `entity_type`, `entity_id`, `before_json`, `after_json`, `request_id`, `ip_hash`, `created_at`.

Append-only. Learner access yo‘q; admin read.

### `idempotency_keys`

`user_id`, `key`, `route`, `request_hash`, `response_status`, `response_body`, `expires_at`, `created_at`.

Unique `(user_id, key, route)`.

## 4. Spetsifikatsiya va curriculum

### `specification_versions`

| Ustun | Tip |
|---|---|
| `id` | uuid PK |
| `code` | text unique |
| `title` | text |
| `valid_from`, `valid_to` | date |
| `status` | specification_status |
| `duration_minutes` | smallint default 120 |
| `total_questions` | smallint default 50 |
| `points_per_question` | smallint default 2 |
| `source_id` | uuid nullable |
| `created_by` | uuid |
| timestamps | timestamptz |

Constraint: active validity range bir-biriga overlap qilmasligi product policy bilan tekshiriladi.

### `modules`

`id`, `code unique` (`M01`), `title`, `exam_section`, `sort_order`, `description`, `archived_at`.

### `specification_module_rules`

`id`, `specification_id`, `module_id`, `question_count`, `question_number_from`, `question_number_to`.

Unique `(specification_id, module_id)`. Count va range uzunligi mos constraint.

### `specification_cognitive_rules`

`specification_id`, `cognitive_level`, `question_count`.

PK `(specification_id, cognitive_level)`.

### `specification_type_rules`

Optional/configurable: `specification_id`, `question_type`, `min_count`, `max_count`.

2026 versiyada official aniq count yo‘q bo‘lsa nullable/soft constraint.

### `curriculum_nodes`

| Ustun | Tip | Qoida |
|---|---|---|
| `id` | uuid | PK |
| `module_id` | uuid | FK |
| `parent_id` | uuid | self FK nullable |
| `code` | text | unique, masalan `M08.03` |
| `title` | text | required |
| `node_type` | text | `topic` yoki `microtopic` |
| `sort_order` | smallint | required |
| `summary` | text | nullable |
| `is_active` | boolean | default true |

Constraint: parent bir xil module ichida.

### `curriculum_prerequisites`

`node_id`, `prerequisite_node_id`, `requirement` (`recommended|required`).

PK composite; self-cycle database function/service validation bilan bloklanadi.

### `learning_objectives`

`id`, `curriculum_node_id`, `code unique`, `statement`, `is_critical`, `sort_order`, `archived_at`.

### `mastery_configs`

One active config per microtopic:

`id`, `curriculum_node_id`, `version`, `min_distinct_questions`, `min_higher_order_questions`, `overall_threshold`, `higher_order_threshold`, `remediation_required_correct`, `knowledge_weight`, `application_weight`, `reasoning_weight`, `review_intervals integer[]`, `active_from`.

Thresholdlar `numeric(5,4)`.

## 5. Sources va kontent

### `sources`

`id`, `code unique`, `title`, `source_type`, `family`, `grade`, `authors`, `publisher`, `publication_year`, `official_url`, `private_storage_path`, `checksum`, `copyright_note`, `is_official`, `created_at`.

### `source_locators`

`id`, `source_id`, `pdf_page_from`, `pdf_page_to`, `printed_page_from`, `printed_page_to`, `chapter_title`, `lesson_title`, `locator_note`.

Page qiymatlar positive va `from <= to`.

### `lessons`

`id`, `code unique`, `curriculum_node_id`, `title`, `current_published_revision_id nullable`, `archived_at`, timestamps.

### `lesson_revisions`

| Ustun | Tip |
|---|---|
| `id` | uuid PK |
| `lesson_id` | uuid FK |
| `revision_number` | integer |
| `status` | publication_status |
| `title` | text |
| `objectives_snapshot` | jsonb |
| `blocks` | jsonb |
| `content_hash` | text |
| `created_by`, `reviewed_by`, `published_by` | uuid nullable |
| `reviewed_at`, `published_at` | timestamptz nullable |
| timestamps | timestamptz |

Unique `(lesson_id, revision_number)`. Published row update/delete trigger bilan taqiqlanadi.

### `lesson_revision_sources`

`lesson_revision_id`, `source_locator_id`, `is_primary`, `note`.

PK composite.

### `stimuli`

`id`, `code unique`, `current_published_revision_id`, `archived_at`.

### `stimulus_revisions`

`id`, `stimulus_id`, `revision_number`, `status`, `content jsonb`, `created_by`, review/publish fields, timestamps.

### `questions`

`id`, `code unique`, `curriculum_node_id`, `primary_objective_id`, `current_published_revision_id`, `archived_at`, timestamps.

### `question_revisions`

| Ustun | Tip | Qoida |
|---|---|---|
| `id` | uuid | PK |
| `question_id` | uuid | FK |
| `revision_number` | integer | > 0 |
| `status` | publication_status | required |
| `question_type` | question_type | required |
| `cognitive_level` | cognitive_level | required |
| `difficulty` | smallint | 1–5 |
| `estimated_seconds` | smallint | 10–600 |
| `stimulus_revision_id` | uuid | nullable |
| `payload` | jsonb | correct answer bilan, private |
| `explanation` | jsonb | required before review |
| `technology_version` | text | nullable |
| `content_hash` | text | required |
| creator/reviewer/publisher | uuid | nullable |
| review/publish times | timestamptz | nullable |
| timestamps | timestamptz | required |

Unique `(question_id, revision_number)`. `payload` discriminated schema server va database function bilan validate qilinadi.

### `question_revision_objectives`

`question_revision_id`, `learning_objective_id`, `weight`, `is_primary`.

Kamida bitta primary. Weight sum service’da 1.0.

### `question_revision_sources`

`question_revision_id`, `source_locator_id`, `is_primary`, `note`.

Published bo‘lishidan oldin kamida bitta.

### `question_revision_specifications`

`question_revision_id`, `specification_id`, `module_id`, `eligible`, `review_note`.

### `tags`

`id`, `code unique`, `label`, `category` (`misconception|skill|content|review_flag`).

### `question_revision_tags`

PK `(question_revision_id, tag_id)`.

### `review_requests`

`id`, exactly one of `lesson_revision_id`, `question_revision_id`, `stimulus_revision_id`; `requested_by`, `assigned_to`, `status`, `created_at`, `resolved_at`.

### `review_comments`

`id`, `review_request_id`, `author_id`, `body`, `field_path`, `is_resolved`, timestamps.

### `content_workflow_events`

Append-only: revision reference, `from_status`, `to_status`, actor, reason, created_at.

## 6. Learning va assessment

### `lesson_progress`

`user_id`, `lesson_id`, `first_opened_at`, `last_opened_at`, `completed_at`, `last_revision_id`.

PK `(user_id, lesson_id)`.

### `assessment_sessions`

| Ustun | Tip |
|---|---|
| `id` | uuid |
| `user_id` | uuid |
| `session_type` | session_type |
| `specification_id` | uuid nullable |
| `curriculum_node_id` | uuid nullable |
| `status` | session_status |
| `assembly_seed` | text nullable |
| `assembly_audit` | jsonb |
| `started_at`, `expires_at`, `submitted_at` | timestamptz |
| `score_points`, `max_points` | integer nullable |
| `created_at`, `updated_at` | timestamptz |

Constraint:

- mock exam: specification required, duration spec’dan;
- practice/checkpoint/review: node optional use-case bo‘yicha;
- finalized session qayta active bo‘lmaydi.

### `assessment_session_questions`

`id`, `session_id`, `question_revision_id`, `position`, `module_id`, `cognitive_level`, `question_type`, `presentation_snapshot jsonb`, `presentation_order jsonb`, `points_possible`, `feedback_revealed_at`.

Unique `(session_id, position)` va `(session_id, question_revision_id)`.

`presentation_snapshot` correct answer’siz rendering data; full key private question revisionda.

### `session_question_responses`

`session_question_id`, `user_id`, `response jsonb`, `revision integer`, `saved_at`, `finalized_at`, `is_correct nullable`, `points_awarded nullable`.

PK `session_question_id`. Update optimistic revision bilan. Learner direct DB write yo‘q.

### `practice_submissions`

`id`, `session_question_id`, `user_id`, `submission_number`, `response jsonb`, `is_correct`, `is_independent`, `feedback_was_available`, `submitted_at`, `duration_ms`.

Unique `(session_question_id, submission_number)`. Append-only.

### `question_exposures`

`user_id`, `question_revision_id`, `first_seen_at`, `first_answered_at`, `answer_revealed_at`, `times_seen`.

PK `(user_id, question_revision_id)`.

### `mastery_evidence`

Append-only normalized evidence:

`id`, `user_id`, `curriculum_node_id`, `learning_objective_id`, `question_revision_id`, `session_id`, `cognitive_level`, `is_correct`, `is_independent_first_attempt`, `occurred_at`, `evidence_weight`, `source_kind`.

Unique logical source `(session_id, question_revision_id, source_kind)`.

### `mastery_records`

`user_id`, `curriculum_node_id`, `mastery_config_id`, `status`, `knowledge_score`, `application_score`, `reasoning_score`, `overall_score`, `distinct_evidence_count`, `provisional_at`, `stable_at`, `regressed_at`, `last_calculated_at`, `calculation_version`.

PK `(user_id, curriculum_node_id)`.

### `mastery_events`

Append-only: old/new status, score snapshot, reason, calculation version, created_at.

### `review_schedules`

`id`, `user_id`, `curriculum_node_id`, `interval_index`, `due_at`, `outcome`, `assessment_session_id`, `completed_at`.

Unique active pending review `(user_id, curriculum_node_id, interval_index)`.

### `error_notebook_entries`

`user_id`, `learning_objective_id`, `misconception_tag_id`, `first_error_at`, `last_error_at`, `error_count`, `resolved_at`, `last_evidence_id`.

Unique `(user_id, learning_objective_id, misconception_tag_id)`.

## 7. Jobs va analytics

### `job_runs`

`id`, `job_name`, `scheduled_for`, `started_at`, `finished_at`, `status`, `attempt`, `error_code`, `summary jsonb`.

### `item_statistics_daily`

`date`, `question_revision_id`, `independent_attempts`, `correct_count`, `avg_duration_ms`, `option_counts jsonb`, `discrimination_proxy`.

PK `(date, question_revision_id)`.

### `learner_daily_statistics`

`date`, `user_id`, `questions_answered`, `independent_correct`, `minutes_active`, `reviews_due`, `reviews_completed`.

## 8. Muhim indexlar

- `curriculum_nodes(module_id, sort_order)`.
- `learning_objectives(curriculum_node_id, sort_order)`.
- published revision partial index by status.
- `question_revisions(cognitive_level, question_type, difficulty)` where published.
- `question_revision_specifications(specification_id, module_id, eligible)`.
- `assessment_sessions(user_id, created_at desc)`.
- `assessment_sessions(status, expires_at)` for timeout job.
- `mastery_evidence(user_id, curriculum_node_id, occurred_at desc)`.
- `review_schedules(user_id, due_at)` where pending.
- `question_exposures(user_id, first_seen_at)`.
- GIN only on JSONB fields with measured query need; payload ichidan blueprint filter qilinmaydi.

## 9. RLS matritsasi

| Data | Learner | Author | Reviewer | Admin |
|---|---|---|---|---|
| Own profile/progress | own | own | own | all |
| Published lesson sanitized view | read | read | read | read |
| Question answer payload | no | assigned/editor | assigned | all |
| Own sessions/responses | own via API/read view | own | own | all |
| Other user progress | no | no | no | admin limited |
| Draft content | no | authored/assigned | assigned | all |
| Role/audit | own roles only/no audit | own | own | all |

Protected mutationlar service API orqali. RLS defense-in-depth bo‘lib qoladi.

## 10. Database functionlar

Quyidagilar transaction va permission uchun SQL function bo‘lishi mumkin:

- `publish_lesson_revision`
- `publish_question_revision`
- `create_assessment_session`
- `save_session_response`
- `finalize_assessment_session`
- `record_practice_submission`
- `recalculate_mastery`

Har function `security definer` bo‘lsa, fixed `search_path`, explicit authorization va pgTAP test talab qilinadi.

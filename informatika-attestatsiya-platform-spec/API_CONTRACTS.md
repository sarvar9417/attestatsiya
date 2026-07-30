# API_CONTRACTS.md

## 1. Umumiy

- Base: `/api/v1`
- Content type: `application/json`
- Auth: Supabase session cookie
- Mutation: `Idempotency-Key` header required
- Time: ISO 8601 UTC
- API correct-answer payloadni assessment finalization’dan oldin qaytarmaydi.

## 2. Response envelope

Success:

```json
{
  "data": {},
  "meta": {
    "requestId": "uuid"
  }
}
```

Error:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Kiritilgan ma’lumotni tekshiring.",
    "fieldErrors": {
      "examDate": ["Sana o‘tmishda bo‘lishi mumkin emas."]
    },
    "requestId": "uuid"
  }
}
```

## 3. HTTP mapping

| Code | HTTP |
|---|---:|
| `AUTH_REQUIRED` | 401 |
| `FORBIDDEN` | 403 |
| `RESOURCE_NOT_FOUND` | 404 |
| `VALIDATION_FAILED` | 422 |
| `REVISION_CONFLICT` | 409 |
| `SESSION_EXPIRED` | 409 |
| `SESSION_FINALIZED` | 409 |
| `BLUEPRINT_POOL_INSUFFICIENT` | 422 |
| `IDEMPOTENCY_CONFLICT` | 409 |
| `RATE_LIMITED` | 429 |
| `INTERNAL_ERROR` | 500 |

## 4. Learner endpointlari

### `GET /me`

Profile, role va onboarding holati.

### `PATCH /me`

```json
{
  "displayName": "Sarvar",
  "examDate": "2026-10-15",
  "dailyGoalMinutes": 30,
  "timezone": "Asia/Tashkent"
}
```

Role qabul qilinmaydi.

### `GET /me/dashboard`

```json
{
  "data": {
    "activeSpecification": {"code": "uz-informatics-attestation-2026-h1"},
    "today": {
      "dueReviews": 3,
      "recommendedNode": {"code": "M05.02", "title": "..."},
      "estimatedMinutes": 25
    },
    "readiness": {
      "value": 0.68,
      "confidence": "medium",
      "evidenceCount": 214,
      "updatedAt": "..."
    },
    "modules": []
  }
}
```

### `GET /curriculum?specificationCode=...`

Published curriculum tree, lock state, progress va source coverage status.

### `GET /lessons/{lessonCode}`

Learnerga sanitized current published revision.

### `POST /lessons/{lessonCode}/progress`

Action: `opened|completed`. Completed lesson mastery bermaydi.

### `GET /me/reviews`

Due/overdue/upcoming review queue.

### `GET /me/errors`

Filter: module, objective, unresolved.

## 5. Assessment endpointlari

### `POST /assessments`

Request:

```json
{
  "type": "practice",
  "specificationCode": "uz-informatics-attestation-2026-h1",
  "curriculumNodeCode": "M05.02",
  "questionCount": 10
}
```

Mock examda `questionCount` clientdan olinmaydi.

Response:

```json
{
  "data": {
    "id": "uuid",
    "type": "practice",
    "status": "active",
    "startedAt": "...",
    "expiresAt": null,
    "questionCount": 10,
    "currentPosition": 1
  }
}
```

### `GET /assessments/{id}`

Session metadata va learner ko‘rishi mumkin bo‘lgan savollar. Mock uchun pagination/position mumkin.

Sanitized question:

```json
{
  "sessionQuestionId": "uuid",
  "position": 1,
  "type": "single_choice",
  "cognitiveLevel": "application",
  "prompt": [],
  "options": [],
  "response": null,
  "responseRevision": 0,
  "feedbackState": "hidden"
}
```

`correctOptionId`, `correctPairs`, `correctOrder`, explanation yo‘q.

### `PUT /assessments/{id}/questions/{sessionQuestionId}/response`

Autosave:

```json
{
  "response": {"selectedOptionId": "b"},
  "expectedRevision": 3
}
```

Response:

```json
{
  "data": {
    "saved": true,
    "revision": 4,
    "savedAt": "..."
  }
}
```

Stale revision → `REVISION_CONFLICT`, current server response qaytariladi.

### `POST /assessments/{id}/questions/{sessionQuestionId}/submit`

Faqat practice item submit.

```json
{
  "responseRevision": 4
}
```

Response:

```json
{
  "data": {
    "isCorrect": false,
    "points": 0,
    "feedback": {
      "summary": "...",
      "steps": [],
      "optionFeedback": {}
    },
    "nextAction": "continue"
  }
}
```

### `POST /assessments/{id}/submit`

Checkpoint/review/mock final submit.

Request:

```json
{
  "confirm": true
}
```

Response:

```json
{
  "data": {
    "id": "uuid",
    "status": "submitted",
    "scorePoints": 84,
    "maxPoints": 100,
    "correctCount": 42,
    "submittedAt": "..."
  }
}
```

### `GET /assessments/{id}/result`

Finalized session uchun overall, section, module, cognitive, time va error summary.

## 6. Content/admin endpointlari

Barcha endpoint role guard va audit talab qiladi.

### Sources

- `GET /admin/sources`
- `POST /admin/sources`
- `GET /admin/sources/{id}`
- `PATCH /admin/sources/{id}`
- `POST /admin/sources/{id}/locators`

### Curriculum

- `GET /admin/specifications`
- `POST /admin/specifications`
- `POST /admin/specifications/{id}/activate`
- `GET /admin/curriculum`
- `POST /admin/curriculum/nodes`
- `PATCH /admin/curriculum/nodes/{id}`
- `POST /admin/curriculum/nodes/{id}/objectives`

### Lessons

- `GET /admin/lessons`
- `POST /admin/lessons`
- `POST /admin/lessons/{id}/revisions`
- `PATCH /admin/lesson-revisions/{revisionId}`
- `POST /admin/lesson-revisions/{revisionId}/submit-review`
- `POST /admin/lesson-revisions/{revisionId}/publish`

Published revision `PATCH` qilinmaydi.

### Questions

- `GET /admin/questions`
- `POST /admin/questions`
- `POST /admin/questions/{id}/revisions`
- `GET /admin/question-revisions/{id}`
- `PATCH /admin/question-revisions/{id}`
- `POST /admin/question-revisions/{id}/validate`
- `POST /admin/question-revisions/{id}/submit-review`
- `POST /admin/question-revisions/{id}/publish`
- `POST /admin/questions/import/dry-run`
- `POST /admin/questions/import/commit`

### Review

- `GET /admin/reviews?assignedTo=me&status=open`
- `POST /admin/reviews/{id}/comments`
- `POST /admin/reviews/{id}/request-changes`
- `POST /admin/reviews/{id}/approve`

### Analytics

- `GET /admin/analytics/content-coverage`
- `GET /admin/analytics/items`
- `GET /admin/analytics/items/{revisionId}`
- `GET /admin/analytics/assembly-readiness`

## 7. Admin update concurrency

PATCH request:

```json
{
  "expectedUpdatedAt": "2026-07-29T10:00:00Z",
  "patch": {}
}
```

Stale bo‘lsa 409. UI foydalanuvchiga server va local farqni ko‘rsatadi; silent overwrite yo‘q.

## 8. Import dry-run response

```json
{
  "data": {
    "importToken": "short-lived-token",
    "validCount": 97,
    "invalidCount": 3,
    "warnings": 12,
    "rows": [
      {
        "index": 4,
        "status": "invalid",
        "errors": [{"path": "payload.options", "message": "Kamida 3 variant."}]
      }
    ]
  }
}
```

Commit dry-run hash va tokenni talab qiladi. Upload o‘zgargan bo‘lsa commit rad etiladi.

## 9. Pagination

Admin listlar cursor-based:

```json
{
  "data": {"items": []},
  "meta": {
    "nextCursor": "opaque-or-null",
    "requestId": "uuid"
  }
}
```

Cursor opaque; client uni tahrirlamaydi.

## 10. Rate limiting minimum

- auth-sensitive endpoint: IP/user bo‘yicha;
- assessment create: learnerga bir vaqtda cheklangan active session;
- autosave: burst’ga ruxsat, abuse limit;
- admin import: qat’iy size/count;
- public endpoint: standard per-IP.

Rate-limit qiymatlari environment config, testlarda deterministik adapter bilan.

# ADMIN_CMS.md

## 1. Route xaritasi

```text
/admin
/admin/specifications
/admin/curriculum
/admin/sources
/admin/lessons
/admin/questions
/admin/reviews
/admin/imports
/admin/analytics/content
/admin/analytics/items
/admin/users
/admin/audit
```

## 2. Admin dashboard

Kartalar:

- published question count;
- review queue;
- source’siz draft;
- invalid content;
- module coverage;
- mock assembly readiness;
- critical item flags.

Coverage modul savol sonini emas, cognitive va objective kesimini ham ko‘rsatadi.

## 3. Specification builder

Form:

- code/title;
- validity;
- duration/points;
- module counts;
- cognitive counts;
- optional type ranges;
- source.

Activation oldidan validator:

- total module count = total questions;
- cognitive total = total;
- question ranges overlap yo‘q;
- active candidate pool feasible;
- source mavjud.

Active specification joyida o‘zgarmaydi; clone/new version.

## 4. Curriculum editor

Tree:

- module;
- topic;
- microtopic;
- objective.

Operations:

- add;
- edit draft metadata;
- reorder;
- prerequisite;
- mastery config;
- deactivate.

Stable code rename default taqiqlangan. Display title o‘zgarishi mumkin.

Cycle prerequisite save’dan oldin tekshiriladi.

## 5. Source registry

Source fields `DATABASE_SCHEMA.md`ga mos.

Locator editor:

- PDF page;
- printed page;
- chapter;
- lesson;
- note.

PDF private bo‘lsa preview role bilan cheklanadi. Learner faqat bibliographic reference ko‘radi.

## 6. Lesson editor

Features:

- block editor;
- objective selection;
- source locator;
- preview desktop/mobile;
- revision diff;
- validation;
- autosave draft;
- submit review.

Validation:

- title;
- kamida bitta objective;
- required blocklar;
- source;
- unsafe HTML yo‘q;
- broken media yo‘q.

## 7. Question bank

Filter:

- spec;
- module/microtopic/objective;
- type;
- cognitive;
- difficulty;
- status;
- author/reviewer;
- source;
- misconception;
- content flag;
- exposure/item statistics.

Column:

- stable code;
- short prompt;
- status;
- type/cognitive/difficulty;
- source;
- revision;
- usage;
- last review.

Correct answer faqat authorized editor/reviewer ko‘radi.

## 8. Question editor

Sections:

1. Classification.
2. Stimulus.
3. Prompt va type-specific payload.
4. Correct answer.
5. Explanation/distractor feedback.
6. Source.
7. Preview/randomization.
8. Validation.
9. Workflow.

Live validator:

- Y1 exactly one correct;
- option ID unique;
- Y2 every left matched once;
- Y3 correctOrder exact item set;
- objective/source mavjud;
- estimated time range;
- prohibited phrase/style warning;
- content hash similarity.

## 9. Review queue

Reviewer:

- source page va revisionni yonma-yon ko‘radi;
- checklistni majburiy to‘ldiradi;
- field-level comment beradi;
- changes yoki approve.

Approve tugmasi:

- author != reviewer;
- barcha critical checklist true;
- unresolved comment yo‘q;
- server validation passed

bo‘lgandagina active.

## 10. Publish

Publisher:

- approved revision summary;
- diff;
- source;
- target specification;
- effective time

ni ko‘radi.

Publish atomic:

- revision `published`;
- parent current revision yangilanadi;
- audit event;
- cache invalidation.

Old revision o‘chirilmaydi.

## 11. Duplicate detection

Bosqichlar:

1. exact normalized content hash;
2. same objective + high lexical similarity;
3. same code/stimulus structure;
4. reviewer manual decision.

Similarity warning publishni avtomatik bloklamaydi, exact duplicate bloklaydi. Override admin reason bilan audit qilinadi.

## 12. Bulk import

Limit configurable, default 500 question/file.

Dry-run report:

- valid;
- invalid;
- warning;
- unknown reference;
- duplicate;
- source missing.

Commit:

- dry-run hash mos;
- itemlar `draft`;
- partial commit yo‘q: transaction yoki batch-level explicit result;
- audit.

## 13. Content coverage

Matrix:

```text
module → microtopic → objective → cognitive → type → difficulty
```

Holatlar:

- red: hard minimumdan past;
- amber: production targetdan past;
- green: target bajarilgan.

Assembly readiness alohida hard feasibility testni real generator bilan ishlatadi.

## 14. Item analysis

Faqat minimal sample size’dan keyin:

- independent attempt count;
- p-value/difficulty;
- average duration;
- distractor distribution;
- blank rate;
- high/low performer discrimination proxy;
- reported issue.

Flag:

- >95% yoki <10% correct;
- bir distractor hech tanlanmagan;
- yuqori performerlar ko‘proq xato qilgan;
- duration outlier;
- ko‘p user report.

Flag avtomatik arxivlamaydi; review task yaratadi.

## 15. User va role

- Search minimal PII.
- Role grant/revoke faqat admin.
- Admin o‘zining oxirgi admin rolini olib tashlay olmaydi.
- Impersonation MVP’da yo‘q.
- User progress edit yo‘q; evidence correction maxsus audited operation.

## 16. Audit UI

Filter:

- actor;
- action;
- entity;
- date;
- request ID.

Before/after diff secret yoki correct answerni unauthorized rolda ko‘rsatmaydi.

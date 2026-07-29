---
title: Current Status and Next Build Step
version: 1.0
snapshot_date: 2026-07-22
status: current handoff
---

# 1. Completed conceptual work

Quyidagilar tasdiqlangan:

- learner profile and goals;
- updated diagnostic;
- six-week classroom activation;
- 2026–2027 roadmap;
- curriculum architecture;
- G1–G10 grammar engine;
- vocabulary/chunk/SRS;
- Error Bank;
- notebook protocol;
- listening, reading, writing, speaking, pronunciation protocols;
- feedback and retry;
- Green 90 / Yellow 45 / Red 10;
- assessment/mastery;
- progress dashboard;
- accountability;
- MVP product roles;
- no-paid-API v1 boundary;
- Lesson Package / Session Report flow.

# 2. Current exact continuation point

Next section:

> **MVP website final pages, information architecture, data model and build order.**

Old diagnostic yoki pedagogik decisionsni boshidan muhokama qilish kerak emas.

# 3. Recommended next deliverables

## Step A — Information architecture

Har page uchun:

- purpose;
- primary user action;
- displayed evidence;
- empty/loading/error states;
- desktop/mobile layout;
- cross-page navigation.

Pages:

1. Today
2. Roadmap
3. Vocabulary/SRS
4. Error Bank
5. Voice/Audio Portfolio
6. Progress Dashboard
7. Import/Export/Backup

## Step B — Core entity model

At least:

- LearnerProfile
- Roadmap
- Phase
- Week
- Lesson
- Task
- Attempt
- Skill
- SkillEvidence
- VocabularyItem
- ReviewEvent
- ErrorEntry
- AudioRecord
- Assessment
- DailySummary
- WeeklySummary
- LessonPackageImport
- SessionReportExport
- DecisionLog
- BackupSnapshot

## Step C — Relationships and state machines

- lesson → tasks;
- task → attempts;
- attempt → assessment/evidence/errors;
- vocabulary/error → review schedule;
- audio → task/attempt/portfolio;
- weekly summary → next target decision;
- import/export → version/history.

## Step D — MVP build phases

1. static shell + navigation;
2. local data layer;
3. Today task runner;
4. import Lesson Package;
5. save attempts;
6. SRS + Error Bank;
7. audio recording/metadata;
8. dashboard;
9. Session Report export;
10. backup/restore;
11. responsive/accessibility QA;
12. three-week pilot.

# 4. Decisions still required during next stage

- exact frontend stack;
- exact local storage;
- audio storage limits;
- single profile vs login;
- deployment;
- schema validation library;
- backup format;
- offline behaviour;
- MVP visual design tokens;
- acceptance criteria per page.

# 5. Anti-scope-creep rule

Next design must not add:

- paid AI API;
- full LMS;
- multi-user roles;
- complex admin CMS;
- deep pronunciation grading;
- all A0–C1 lessons;
- gamification;
- unnecessary social features.

# 6. Definition of ready for coding

Coding starts after:

- page map confirmed;
- entity model confirmed;
- Lesson Package and Session Report schema v1 confirmed;
- storage/export approach confirmed;
- MVP acceptance criteria confirmed;
- build order confirmed.

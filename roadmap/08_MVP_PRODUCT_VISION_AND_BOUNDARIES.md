---
title: MVP Product Vision and Boundaries
version: 1.0
decision_date: 2026-07-22
status: confirmed current product direction
---

# 1. Asosiy mahsulot qarori

> **MVP web-sayt + ChatGPT o‘qituvchi**

Maqsad: barcha learning evidence’ni saqlaydigan, visual va tartibli learner workspace yaratish; pedagogik reasoning va adaptation’ni ChatGPT bajaradi.

# 2. Rollar taqsimoti

## MVP web-app

- roadmap, month/week/today ko‘rsatish;
- one meaningful task at a time;
- vocabulary/SRS saqlash;
- Error Bank saqlash;
- image/audio/sentence/visual activities ko‘rsatish;
- attempts, answers, time va results saqlash;
- voice/audio portfolio;
- progress dashboard;
- phone va laptop responsive;
- import/export/backup.

## ChatGPT teacher

- roadmap asosida weekly/daily task yaratish;
- professional explanation;
- feedback + one retry;
- AI student / partner / examiner;
- SRS va Error Bank itemlarini belgilash;
- Session Report tahlili;
- next Lesson Package yaratish;
- 3-week/monthly/stage decisionsni evidence bilan update qilish.

# 3. MVP v1 qat’iy chegarasi

- pullik OpenAI API yo‘q;
- site ichidagi full AI grading yo‘q;
- complex backend majburiy emas;
- direct ChatGPT integration yo‘q;
- barcha A0–C1 contentni oldindan qurish yo‘q;
- gamification, multi-user LMS, deep acoustic analysis yo‘q;
- product building English practice’ni siqib chiqarmasligi kerak.

# 4. V1 pages

1. **Today**
2. **Roadmap**
3. **Vocabulary / SRS**
4. **Error Bank**
5. **Voice & Audio Portfolio**
6. **Progress Dashboard**
7. **Import / Export / Backup**

# 5. UX principles

- one task in focus;
- clear next action;
- visual hierarchy;
- low cognitive load;
- resume/pause;
- mobile + desktop;
- no decorative clutter;
- learner evidence easy to find;
- honest progress;
- confirmation before destructive action;
- malformed import existing data’ni buzmasligi.

# 6. Data principles

- versioned packages;
- schema validation;
- durable local evidence;
- exportable data;
- backup/restore;
- stable internal model, so future API can be added without replacing lesson/result concepts;
- original attempt va corrected/model answer alohida;
- decisions tarix bilan saqlanadi.

# 7. Post-pilot expansion rule

Uch haftalik pilotdan keyin:

- faqat foydasi evidence bilan ko‘rsatilgan interaction qo‘shiladi;
- xavfsiz backend yoki direct AI integration alohida phase;
- feature ko‘pligi emas, learning outcome ustun.

# 8. Earlier full-platform blueprint holati

Oldingi `Adaptive English Academy` blueprint’da:

- central Assessment API;
- database-published content;
- AI semantic grading;
- secure login;
- queue/retry;
- speech-to-text;
- full backend;
- GitHub production workflow

rejalashtirilgan edi.

**Current status:** bu uzoq muddatli reference sifatida foydali, lekin hozirgi MVP v1 qarorini almashtirmaydi. MVP v1 uchun **API-siz, kichik, tez ishga tushadigan model** ustun.

# 9. Hali yakunlanmagan texnik qarorlar

Quyidagilar keyingi bosqichda final qilinadi:

- exact frontend stack;
- exact storage technology;
- deployment platform;
- authentication kerakmi yoki single-device/local profile yetarlimi;
- audio file storage strategy;
- backup frequency;
- final entity/data model;
- JSON schema versions;
- build phases va acceptance tests.

# DOMAIN_RULES.md

Ushbu fayldagi qoidalar UI’dan mustaqil. Ular sof TypeScript domain function va database transactionlar orqali bajariladi.

## 1. Evidence turlari

### Independent first attempt

Quyidagilarning barchasi true bo‘lsa:

- learner shu `question_revision_id`ning correct answer yoki explanation’ini oldin ko‘rmagan;
- ayni session question uchun birinchi submitted response;
- guided hint correct answerni oshkor qilmagan;
- session `invalid` emas.

Faqat shu evidence mastery’ni oshiradi.

### Guided production

Hint, qadam yoki o‘qituvchi yo‘naltirishi bilan berilgan javob. Practice feedback uchun saqlanadi, mastery hisobiga kirmaydi.

### Corrected retry

Xato javob va explanation’dan keyingi urinish. Remediation bajarilganini ko‘rsatadi, ammo yangi mustaqil evidence o‘rnini bosmaydi.

## 2. Scoring

### Y1

Selected option ID correct option ID bilan teng:

- true → 2 ball;
- false yoki blank → 0.

### Y2

Normalized pair set correct pair setga to‘liq teng:

- to‘liq teng → 2;
- aks holda → 0.

Practice feedback nechta pair xato ekanini ko‘rsatishi mumkin.

### Y3

Submitted ID array correct orderga to‘liq teng:

- to‘liq teng → 2;
- aks holda → 0.

### Umumiy

- Negative marking yo‘q.
- Mock examda partial credit yo‘q.
- Score faqat serverda.
- Blank answer noto‘g‘ri, lekin “unanswered” analitikasi alohida.

## 3. Mastery hisoblash

### Evidence window

Default:

- eng so‘nggi 90 kun;
- har cognitive level uchun eng so‘nggi 20 ta distinct independent question revision;
- bir revisiondan faqat birinchi independent evidence.

### Level score

```text
level_score = correct_distinct / attempted_distinct
```

Evidence yo‘q bo‘lsa `null`, 0 emas.

### Overall score

Default weight:

```text
knowledge   = 0.20
application = 0.50
reasoning   = 0.30
```

Mikro-mavzuda bir level qo‘llanmasa, reviewer tasdiqlagan mastery config qolgan weightlarni 1.0 ga normalizatsiya qiladi.

```text
overall = Σ(level_score × configured_weight)
```

### Provisional mastery default sharti

Hammasi bajarilishi kerak:

1. kamida 15 distinct independent savol;
2. kamida 8 application/reasoning savoli;
3. overall score ≥ 0.90;
4. application+reasoning aggregate ≥ 0.80;
5. har critical objective kamida 2 marta to‘g‘ri tekshirilgan;
6. har active misconception uchun explanation’dan keyin boshqa revisionlarda ketma-ket 3 ta to‘g‘ri remediation;
7. oxirgi checkpoint passed.

Provisional mastery keyingi mikro-mavzuni ochadi.

### Stable mastery

Provisional’dan keyin 1, 3, 7, 14 va 30-kun reviewlar passed bo‘lsa `stable`.

Review due vaqtiga tolerance:

- 1 kunlik review: +1 kun;
- qolganlari: intervalning 50%igacha kechikish mumkin.

Kechikkan review bajariladi, avtomatik fail emas; retention analytics’da `late` belgilanadi.

### Review pass

- 8 distinct savol;
- kamida 4 higher-order;
- overall accuracy ≥ 0.80;
- critical objective savoli xato bo‘lmasligi yoki darhol yangi 2 ta critical savol bilan remediation.

### Regression

Quyidagilardan biri:

- ketma-ket 2 review fail;
- so‘nggi 10 independent evidence accuracy < 0.70;
- critical objective bo‘yicha 2 ta ketma-ket yangi xato.

`stable/provisional → regressed`, due remediation plan yaratiladi.

## 4. Unlock

- Default kurs tartibi curriculum `sort_order`.
- `required` prerequisite provisional bo‘lmasa node locked.
- `recommended` prerequisite faqat warning beradi.
- Diagnostika node’ni avtomatik stable qilmaydi.
- Diagnostika provisional checkpoint’ga tez o‘tish huquqini beradi.
- Admin manual mastery bermaydi; faqat evidence correction audit bilan mumkin.

## 5. Practice session

### Default 10 savollik selector

Target:

- 50% — ayni mikro-mavzudagi zaif objective;
- 25% — due review;
- 15% — yangi yoki kam exposure qilingan savol;
- 10% — ilgari kuchli bo‘lgan objective nazorati.

Rounding deterministic; eng katta qoldiq usuli.

### Selection qoidalari

- Published va active specification’ga eligible.
- Bir sessionda revision takrorlanmaydi.
- Unseen savol ustun.
- Oxirgi 7 kunda ko‘rilgan savolga penalty.
- Xato savolning aynan o‘zi immediate retry sifatida berilmaydi.
- Shu misconception’ni tekshiruvchi boshqa savol kamida 2 boshqa itemdan keyin beriladi.
- Pool yetishmasa nisbat yumshatiladi, lekin session metadata’da fallback yoziladi.

## 6. Feedback

### Practice

Birinchi submitdan keyin:

- correct/incorrect;
- qisqa explanation;
- variant feedback;
- source title va locator;
- retry yoki next action.

### Checkpoint/review

Session tugamaguncha item-level correct javob ko‘rsatilmaydi.

### Mock exam

Submit/timeoutgacha:

- correct holat;
- explanation;
- score

ko‘rsatilmaydi.

## 7. Mock exam blueprint

### Module count

| Modul | Savol |
|---|---:|
| M01 | 3 |
| M02 | 2 |
| M03 | 5 |
| M04 | 3 |
| M05 | 2 |
| M06 | 3 |
| M07 | 3 |
| M08 | 3 |
| M09 | 2 |
| M10 | 2 |
| M11 | 3 |
| M12 | 2 |
| M13 | 2 |
| M14 | 5 |
| M15 | 7 |
| M16 | 3 |
| **Jami** | **50** |

### Cognitive count

- knowledge: 8;
- application: 35;
- reasoning: 7.

### Hard invariantlar

- total aynan 50;
- har module count aynan jadvaldagidek;
- cognitive count aynan 8/35/7;
- har question revision published va specification eligible;
- duplicate revision yo‘q;
- archived question yo‘q;
- points 2 × 50;
- correct answer client payload’da yo‘q.

### Soft targetlar

- difficulty: 20% easy (1–2), 60% medium (3), 20% hard (4–5);
- question type diversity;
- user uchun unseen revision;
- bir xil stimulusdan ko‘pi bilan 1 item;
- bir objective haddan tashqari takrorlanmasligi.

Soft target hard invariantni buzmaydi.

## 8. Exam assembly algoritmi

Greedy random tanlov taqiqlanadi; u cognitive/module kesishmasida dead-end beradi.

Algoritm:

1. Candidate poolni module × cognitive × type kesimida hisoblash.
2. Hard-rule feasibility precheck.
3. Modullarni eng kam candidate flexibility bo‘yicha saralash.
4. Seeded deterministic backtracking/constraint assignment bilan har module uchun cognitive count ajratish.
5. Har bucketdan exposure penalty va difficulty soft cost bo‘yicha revision tanlash.
6. Yakuniy invariant validator.
7. Sessionni transaction’da saqlash.
8. Assembly audit’ga seed, pool count, fallback va validator result yozish.

Pseudocode:

```text
assemble(spec, user, seed):
  rules = loadBlueprint(spec)
  pool = loadEligiblePublishedQuestions(spec)
  assertFeasible(pool, rules)
  slots = expandModuleSlots(rules)
  assignment = solveCognitiveConstraints(slots, globalCognitiveCounts, pool, seed)
  selected = chooseQuestionPerSlot(assignment, exposureCost, difficultyCost, seed)
  validateHardInvariants(selected, rules)
  persistAtomically(selected, audit)
```

`BLUEPRINT_POOL_INSUFFICIENT` xatosi module/cognitive bo‘yicha deficit report qaytaradi. Noto‘g‘ri blueprint’li exam yaratishdan ko‘ra yaratmaslik kerak.

## 9. Timer

- `started_at` va `expires_at` serverda.
- UI har 30 soniyada server time drift’ni tekshiradi.
- Browser timer faqat display.
- `now >= expires_at` bo‘lsa mutation auto-finalize qiladi.
- Safety job expired active sessionlarni final qiladi.
- Network uzilganda local response queue saqlanadi; expires_at’dan keyingi javob qabul qilinmaydi.

## 10. Autosave va submit

- Debounce target 500–1000 ms.
- Har save `response_revision` bilan optimistic.
- Bir xil idempotency key bir xil response qaytaradi.
- Final submit transaction:
  1. session lock;
  2. status tekshirish;
  3. current response’larni freeze;
  4. 50 item score;
  5. result va evidence;
  6. status submitted/expired;
  7. commit.

Double submit ikkinchi score yaratmaydi.

## 11. Readiness estimate

Readiness kafolat emas.

Har module:

```text
module_readiness =
  0.60 × unseen_checkpoint_accuracy +
  0.25 × retention_review_accuracy +
  0.15 × coverage_ratio
```

Global:

```text
readiness = Σ(module_readiness × module_question_count) / 50
```

Evidence yetarli bo‘lmagan modulda confidence `low`. UI score bilan birga:

- evidence count;
- oxirgi yangilanish;
- confidence;
- “taxminiy” belgisi

ko‘rsatadi.

## 12. Content workflow

Ruxsat etilgan transition:

```text
draft → in_review
in_review → changes_requested
changes_requested → draft
in_review → approved
approved → published
published → archived
```

Author o‘z kontentini yakuniy approve qila olmaydi. Reviewer va author ayni revisionda boshqa user bo‘lishi kerak. Publisher approve bo‘lmagan revisionni publish qila olmaydi.

# UX_SPEC.md — learner interfeysi

## 1. UX tamoyillari

- Bir ekranda bitta asosiy vazifa.
- Mobile-first, desktop’da kengaytirilgan.
- Progress aniq, ammo yolg‘on mastery yo‘q.
- Practice va mock exam vizual jihatdan aniq farqlanadi.
- Correct answer exam tugamasdan oshkor qilinmaydi.
- Drag-and-drop hech qachon yagona interaction bo‘lmaydi.
- Xato jazolash emas, keyingi o‘rganish actioniga aylantiriladi.

## 2. Route xaritasi

```text
/
/login
/register
/forgot-password
/onboarding
/dashboard
/curriculum
/modules/[moduleCode]
/learn/[lessonCode]
/practice/[sessionId]
/reviews
/errors
/exams
/exams/[sessionId]
/results/[sessionId]
/profile
```

## 3. Global navigation

Mobile bottom navigation:

- Bosh sahifa;
- Kurs;
- Takrorlash;
- Sinov;
- Profil.

Desktop sidebar shu elementlar va readiness summary’ni ko‘rsatadi.

Exam route’da global navigation yashiriladi; faqat imtihon controls qoladi.

## 4. Onboarding

### Majburiy

1. Ism.
2. Imtihon sanasi — “hali noma’lum” mumkin.
3. Kunlik vaqt: 10/20/30/45/60 daqiqa.
4. Diagnostika taklifi.

Diagnostika skip mumkin, ammo dashboard “boshlang‘ich daraja noma’lum” deydi.

Completion:

- profile saqlangan;
- active specification tanlangan;
- daily plan yaratilgan.

## 5. Dashboard

Yuqoridan pastga:

1. Bugungi asosiy action.
2. Due review soni.
3. Taxminiy readiness va confidence.
4. 16 modul progress.
5. So‘nggi mock natija.
6. Streak optional; mastery’dan ustun ko‘rsatilmaydi.

Readiness matni:

> Taxminiy tayyorgarlik: 68%. Ishonchlilik: o‘rta. 214 ta mustaqil javob asosida.

“50/50 kafolat” yozilmaydi.

## 6. Curriculum ekran

Har modul:

- code va nom;
- imtihondagi savol soni;
- status;
- mastery progress;
- due review;
- lock sababi;
- keyingi mikro-mavzu.

Status rang bilan birga text/icon bilan:

- Boshlanmagan;
- O‘rganilmoqda;
- Vaqtincha o‘zlashtirilgan;
- Barqaror;
- Qayta mustahkamlash kerak.

## 7. Lesson ekran

Header:

- breadcrumb;
- lesson title;
- objective;
- taxminiy vaqt.

Body:

- structured content block;
- code scroll container;
- accessible table;
- worked example;
- common error callout.

Footer:

- “Tushundim” emas, “Tekshirishni boshlash”.
- Lesson completed faqat barcha required block ko‘rilganda va quick check topshirilganda.

## 8. Question shell

Har savolda:

- progress: `3/10`;
- cognitive/difficulty learnerga default ko‘rsatilmaydi;
- prompt;
- stimulus;
- response control;
- save holati;
- primary action.

Save states:

- `Saqlanmoqda…`
- `Saqlandi`
- `Ulanish yo‘q — qurilmada vaqtincha saqlandi`
- `Saqlashda xato — qayta urinish`

## 9. Y1 interaction

- Option butun row clickable.
- Native radio semantics.
- A/B/C/D visual label, contentdan alohida.
- Practice’da submitgacha option o‘zgartiriladi.
- Submitdan keyin first response immutable; retry alohida.

## 10. Y2 interaction

Desktop:

- chap element;
- har biri uchun right select yoki pairing control.

Mobile:

- har chap item ostida dropdown/listbox.

Drag variant qo‘shimcha bo‘lishi mumkin, lekin select fallback majburiy.

Screen reader har matchni: “1-element uchun javob tanlang” deb e’lon qiladi.

## 11. Y3 interaction

Asosiy accessible usul:

- itemlar ro‘yxati;
- “yuqoriga/pastga” tugmalari;
- position select.

Drag optional.

Har harakatdan keyin live region yangi positionni e’lon qiladi.

## 12. Practice feedback

Xato:

1. “Javob noto‘g‘ri.”
2. Qisqa sabab.
3. Zarur qadamlar.
4. Tanlangan variant nima sababli noto‘g‘ri.
5. Manba nomi/locator.
6. “Yangi o‘xshash savolda tekshirish” action.

Correct:

- qisqa tasdiq;
- ortiqcha animatsiya bilan vaqt yo‘qotmaslik;
- kerak bo‘lsa bir jumla explanation.

## 13. Mock exam ekran

Desktop:

- savol;
- question navigator grid;
- timer;
- answered/unanswered/flagged;
- submit.

Mobile:

- sticky top timer;
- current question;
- next/previous;
- navigator drawer.

Timer:

- 30 daqiqada neutral;
- 10 daqiqa qolganda warning;
- 1 daqiqada urgent, lekin har soniyada bezovta announcement yo‘q.

Submit dialog:

- answered;
- unanswered;
- flagged;
- qolgan vaqt.

Timeout server tomonidan final qilinadi va result route’ga olib o‘tadi.

## 14. Result

Ko‘rsatish tartibi:

1. `84/100`, `42/50`.
2. 120 daqiqadan foydalanilgan vaqt.
3. 4 section natijasi.
4. 16 module kesimi.
5. Cognitive natija.
6. Eng kuchsiz 3 objective.
7. Tavsiya etilgan next action.
8. Item review.

Item review correct answer va explanationni faqat finalized sessionda ko‘rsatadi.

## 15. Errors notebook

Group:

- module;
- learning objective;
- misconception;
- resolved/unresolved.

Original savolni yodlatish uchun cheksiz qaytarmaydi. “Qayta tekshirish” yangi revisionlardan session yaratadi.

## 16. Empty/loading/error

Har sahifa uchun:

- skeleton loading;
- meaningful empty state;
- retryable error;
- permission error;
- offline state.

Generic “Nimadir xato ketdi” yagona matn bo‘lmaydi; request ID support uchun ko‘rsatiladi.

## 17. Accessibility

- WCAG 2.2 AA.
- Semantic headings.
- Visible focus.
- Contrast ≥ 4.5:1 normal text.
- Zoom 200%da horizontal page scroll yo‘q; code/table container istisno.
- Keyboard trap yo‘q.
- Motion `prefers-reduced-motion`.
- Color-only status yo‘q.
- Timer announcement intervali screen readerni to‘smasligi.
- Formula uchun text alternative.
- Image uchun alt; dekorativ image empty alt.

## 18. Responsive breakpoint emas, behavior

UI konkret device nomiga bog‘lanmaydi:

- narrow: one-column, bottom nav;
- medium: one-column + side panels drawer;
- wide: sidebar + content + optional context panel.

Question matni optimal o‘qish kengligi bilan cheklanadi.

## 19. PWA/offline

MVP:

- app shell installable;
- published lessonlar read cache mumkin;
- active exam savollari local encrypted emas, browser storage’da sanitized holda;
- answer queue offline vaqtincha;
- server time limit ustun;
- yangi exam to‘liq offline boshlanmaydi.

## 20. Telemetry eventlari

PII’siz:

- onboarding_completed;
- lesson_started/completed;
- assessment_started/submitted;
- answer_saved_failed;
- review_completed;
- mastery_status_changed;
- content_error_reported.

Correct answer yoki full prompt analytics payload’ga yuborilmaydi.

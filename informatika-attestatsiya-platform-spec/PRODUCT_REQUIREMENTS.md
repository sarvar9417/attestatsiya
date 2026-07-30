# PRODUCT_REQUIREMENTS.md

## 1. Muammo

Informatika attestatsiya mavzulari 5–11-sinf va Cambridge+ darsliklari bo‘ylab tarqalgan. Oddiy test sayt:

- mavzuni izchil o‘rgatmaydi;
- qayta yodlangan savolni bilim deb hisoblaydi;
- rasmiy blueprint’ni kafolatlamaydi;
- xatolarni tizimli takrorlatmaydi;
- savolning manbasini tekshirish imkonini bermaydi.

Mahsulot bu muammolarni vertikal kontent daraxti, mustaqil evidence, adaptiv review va versiyalangan imtihon generatori bilan hal qiladi.

## 2. Maqsadli foydalanuvchilar

### Learner

Attestatsiyaga tayyorlanayotgan informatika o‘qituvchisi. Asosiy ehtiyojlari:

- nimadan boshlashni bilish;
- qisqa nazariya;
- ko‘p, sifatli va tushuntirilgan test;
- zaif mavzularni topish;
- real imtihonni mashq qilish.

### Author

Dars va savol tayyorlaydigan mutaxassis. Asosiy ehtiyojlari:

- darslik sahifasiga bog‘lash;
- variant, javob va izoh kiritish;
- draft/review workflow;
- takroriy savolni aniqlash.

### Reviewer

Fakt, metodika, javob va manbani tekshiradigan ekspert.

### Admin

Spetsifikatsiya, rollar, nashr, import va umumiy tizimni boshqaradi.

## 3. Success metrics

### Mahsulot

- Published kontentning 100%ida source reference.
- Mock examlarning 100%i blueprint invariantlarini bajaradi.
- Learner attemptlarining 99.9%ida javob yo‘qolmasligi.
- Published savollarda aniqlangan kritik javob xatosi < 0.2%.
- Core flow E2E testlarining 100% passing holati.

### O‘rganish

- First diagnostic va keyingi unseen checkpoint o‘rtasida modul aniqligi oshishi.
- 30-kun review’ida provisional mastery olgan mavzularning kamida 80% saqlanishi.
- O‘quvchi xatolarining learning objective bo‘yicha kamayishi.

“50/50 kafolat” marketing yoki UI’da berilmaydi. Readiness — taxminiy ko‘rsatkich.

## 4. Asosiy user journeys

### J-01 — Onboarding va diagnostika

1. Foydalanuvchi ro‘yxatdan o‘tadi.
2. Imtihon sanasi va kunlik vaqtini belgilaydi.
3. 35 informatika savollik yoki qisqa modul diagnostikasini tanlaydi.
4. Tizim boshlang‘ich mastery va o‘quv reja yaratadi.

### J-02 — Mikro-mavzuni o‘rganish

1. Dashboard bugungi taskni ko‘rsatadi.
2. Learner qisqa darsni o‘qiydi.
3. Simple check bajaradi.
4. Application va reasoning savollariga o‘tadi.
5. Natijaga qarab yangi savol yoki remediation oladi.
6. Provisional mastery sharti bajarilsa keyingi mavzu ochiladi.

### J-03 — Xatolar daftari

1. Learner xato savollarni objective va sabab bo‘yicha ko‘radi.
2. Tushuntirishni o‘qiydi.
3. Shu savolni emas, yangi kontekstdagi savolni ishlaydi.
4. Keyingi due review navbatga qo‘shiladi.

### J-04 — Mock exam

1. Learner amaldagi spetsifikatsiyani tanlaydi.
2. Server aynan 50 savol yaratadi.
3. 120 daqiqalik timer boshlanadi.
4. Javoblar autosave qilinadi.
5. Submit yoki vaqt tugashi bilan server hisoblaydi.
6. Natija 100 ball, section va module kesimida ko‘rsatiladi.

### J-05 — Kontent yaratish

1. Author mikro-mavzu tanlaydi.
2. Dars yoki savol draft yaratadi.
3. Source va sahifani biriktiradi.
4. Preview va validation’dan o‘tkazadi.
5. Review’ga yuboradi.
6. Reviewer approve yoki changes requested qiladi.
7. Admin/publisher nashr qiladi.

## 5. Funksional talablar

### FR-AUTH

- FR-AUTH-01: Email/password ro‘yxatdan o‘tish va login.
- FR-AUTH-02: Email verification.
- FR-AUTH-03: Password reset.
- FR-AUTH-04: Learner default role; boshqa rollar faqat admin tomonidan.
- FR-AUTH-05: Session logout va expired session handling.

### FR-CURRICULUM

- FR-CUR-01: Spetsifikatsiya versiyalangan.
- FR-CUR-02: 16 modul, hierarchical topic va mikro-mavzu.
- FR-CUR-03: Prerequisite va unlock tartibi.
- FR-CUR-04: Har mikro-mavzuda learning objective va mastery config.
- FR-CUR-05: Kontent eski spetsifikatsiya bilan tarixiy saqlanadi.

### FR-LESSON

- FR-LES-01: Structured rich-content blocklar.
- FR-LES-02: Text, callout, formula, code, table va image block.
- FR-LES-03: Source reference.
- FR-LES-04: Draft/review/publish revision.
- FR-LES-05: Learner lesson progress.

### FR-QUESTION

- FR-Q-01: Y1 single choice.
- FR-Q-02: Y2 one-to-one matching.
- FR-Q-03: Y3 ordering.
- FR-Q-04: Text/code/table/image stimulus.
- FR-Q-05: Cognitive level, difficulty, objective va misconception tags.
- FR-Q-06: Correct answer va har muhim distractor izohi.
- FR-Q-07: Source reference va immutable published revision.
- FR-Q-08: Duplicate/similarity review flag.

### FR-PRACTICE

- FR-PR-01: Practice session serverda yaratiladi.
- FR-PR-02: Bir savolda birinchi submitdan keyin feedback.
- FR-PR-03: Retry guided/corrected evidence sifatida alohida yoziladi.
- FR-PR-04: Adaptiv selector zaif, due va yangi kontentni aralashtiradi.
- FR-PR-05: Bir session ichida bir revision takrorlanmaydi.

### FR-MASTERY

- FR-MAS-01: Independent first attempts alohida.
- FR-MAS-02: `not_started`, `learning`, `provisional`, `stable`, `regressed`.
- FR-MAS-03: Bilish/application/reasoning natijalari alohida.
- FR-MAS-04: 1/3/7/14/30 kunlik review.
- FR-MAS-05: Configurable threshold va minimum evidence.
- FR-MAS-06: Mastery qayta hisoblanadigan va audit qilinadigan.

### FR-EXAM

- FR-EX-01: 50 savol, 120 daqiqa, 2/0 ball.
- FR-EX-02: 35 specialty, 5 professional standard, 7 pedagogy, 3 methodology.
- FR-EX-03: 8 knowledge, 35 application, 7 reasoning.
- FR-EX-04: Module question countlari blueprint’ga mos.
- FR-EX-05: Server-authoritative timer va autosave.
- FR-EX-06: Timeout auto-submit.
- FR-EX-07: Deterministic assembly seed va audit log.
- FR-EX-08: Yetarli savol bo‘lmasa invalid exam yaratmaslik.

### FR-ANALYTICS

- FR-AN-01: Learner dashboard.
- FR-AN-02: Module va objective accuracy.
- FR-AN-03: Time per question.
- FR-AN-04: Error notebook.
- FR-AN-05: Blueprint-weighted readiness estimate.
- FR-AN-06: Admin item analysis — difficulty va distractor selection.

### FR-ADMIN

- FR-ADM-01: Source registry.
- FR-ADM-02: Curriculum tree editor.
- FR-ADM-03: Lesson/question editor.
- FR-ADM-04: Review queue va comments.
- FR-ADM-05: Specification builder.
- FR-ADM-06: JSON import dry-run va validation report.
- FR-ADM-07: Publish/rollback-to-prior-current-revision.
- FR-ADM-08: Role management va audit log.

## 6. Nofunksional talablar

- NFR-01: Mobile-first responsive, 360px ekranidan boshlab.
- NFR-02: Keyboard-only navigation.
- NFR-03: Y2/Y3 drag-and-drop’siz ham ishlashi.
- NFR-04: WCAG 2.2 AA maqsadi.
- NFR-05: Typical authenticated page p75 LCP ≤ 2.5 s production’da.
- NFR-06: Submit endpoint idempotent.
- NFR-07: Exam answer muvaffaqiyatli save bo‘lgani UI’da ko‘rinadi.
- NFR-08: Barcha domain mutation audit qilinadi.
- NFR-09: UTC storage, Asia/Tashkent display.
- NFR-10: No secrets in repository/client.
- NFR-11: Database restore amaliyoti hujjatlashtirilgan va sinovdan o‘tgan.
- NFR-12: Uzbek apostrof variantlari qidiruvda normalizatsiya qilinadi.

## 7. MVP release sharti

MVP faqat `ACCEPTANCE_CRITERIA.md`dagi barcha `MVP-BLOCKER` bandlar yopilganda release qilinadi. Kontent soni yetarli bo‘lmasa texnik funksiya mavjudligi release uchun yetarli emas.

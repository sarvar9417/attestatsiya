# AGENTS.md — AI coderlar uchun majburiy qoidalar

## 1. Ish boshlash protokoli

Har bir task boshida:

1. `README.md`dagi o‘qish tartibiga amal qiling.
2. `PROJECT_STATE.md`da task holatini tekshiring.
3. Task band bo‘lmasa, egasi va boshlanish vaqtini kiriting.
4. Dependency tasklar `DONE` bo‘lmasa, kod yozmang.
5. Tegishli schema, API va biznes qoidalarini aniqlang.
6. Ish scope’ini task chegarasidan kengaytirmang.

## 2. Asosiy taqiqlar

- Hujjatdagi biznes qoidasini o‘zboshimchalik bilan o‘zgartirmang.
- Production bazasini qo‘lda tahrirlamang; faqat migratsiya ishlating.
- Service-role key yoki boshqa secret’ni browser bundle’ga kiritmang.
- Savol javobini learner API orqali oldindan yubormang.
- Published dars yoki savol versiyasini joyida o‘zgartirmang.
- Arbitrary Python/JavaScript kodini serverda bajarmang.
- UI’da vaqtni yagona haqiqat deb hisoblamang; exam timer serverga tayanadi.
- RLS’siz foydalanuvchi ma’lumotlari jadvalini merge qilmang.
- Test yozmasdan taskni `DONE` qilmang.
- “Keyin qilinadi” mazmunidagi yashirin TODO bilan acceptance mezonini yopmang.
- Darslikning katta qismini so‘zma-so‘z ko‘chirmang.

## 3. Kod standartlari

- TypeScript `strict: true`.
- `any` taqiqlanadi; zarur bo‘lsa aniq izoh va lokal scope talab qilinadi.
- Har bir tashqi input Zod yoki bazadagi constraint bilan tekshiriladi.
- Domain qoidalari React komponentlarida yozilmaydi.
- UI komponenti bevosita service-role client ishlatmaydi.
- Barcha sana/vaqt bazada UTC; UI’da `Asia/Tashkent`.
- Barcha identifikator UUID; foydalanuvchiga ko‘rinadigan kontentda barqaror `code`.
- Pul yoki ball hisobida floating point ishlatilmaydi.
- User-facing matn o‘zbek lotin yozuvida bo‘ladi.
- Error response’lar `API_CONTRACTS.md` formatiga mos bo‘ladi.

## 4. Modul chegaralari

```text
src/
├── components/       UI komponentlar (domain qoidalarsiz)
│   ├── admin/        Admin panel
│   ├── layout/       Header, sidebar, bottom nav
│   ├── learning/     Mavzu, test, imtihon
│   │   └── questions/Y1, Y2, Y3
│   └── ui/           Umumiy UI primitivlar
├── data/             Static kontent (contentTree, topicContent)
├── hooks/            Custom React hooks (useAuth, useOnlineStatus)
├── lib/              Utility funksiyalar (monitoring, performance)
├── pages/            Route sahifalari
├── store/            Zustand store (progress)
├── supabase/         Migrations (append-only SQL)
├── tests/            Integration/E2E fixture va testlar
```

`domain/` browser yoki Supabase client’ga bog‘lanmasligi kerak.

## 5. Database o‘zgarishi

Schema taskida:

1. Yangi timestamped migratsiya yarating.
2. Constraint, index va RLS policy’ni birga yozing.
3. Rollback yo‘li yoki forward-fix strategiyasini PR izohida ko‘rsating.
4. Lokal bazani noldan tiklab tekshiring.
5. TypeScript database type’larini qayta generatsiya qiling.
6. pgTAP yoki integration test qo‘shing.
7. `DATABASE_SCHEMA.md` o‘zgargan bo‘lsa uni ham yangilang.

Oldingi committed migratsiyani o‘zgartirish taqiqlanadi.

## 6. Published kontent

- Published revision immutable.
- Tahrir yangi revision yaratadi.
- Learner session savol revision snapshot’iga bog‘lanadi.
- Savolni arxivlash avvalgi attempt tarixini o‘chirmaydi.
- AI yaratgan kontent `draft`dan yuqoriga inson eksperti tasdig‘isiz o‘tmaydi.

## 7. Test talabi

Har task uchun kamida:

- happy path;
- permission yoki validation failure;
- chegaraviy holat;
- regressiya ehtimoli bo‘lgan qoidaga test

yoziladi.

Exam generator uchun property/invariant testlar, RLS uchun rolga asoslangan database testlar majburiy.

## 8. Task tugatish protokoli

Taskni tugatganda:

1. Format, lint, typecheck va tegishli testlarni ishga tushiring.
2. `TASKS.md` acceptance bandlarini tekshiring.
3. `PROJECT_STATE.md`ni yangilang.
4. Agar qaror o‘zgargan bo‘lsa `DECISIONS.md`ga ADR qo‘shing.
5. Quyidagi handoff’ni yozing:

```text
Task:
Natija:
O‘zgargan fayllar:
Migratsiyalar:
Ishga tushirilgan testlar:
Qolgan xavf yoki blocker:
Keyingi ochilgan tasklar:
```

## 9. Konflikt protokoli

Agar ikki hujjat yoki kod va hujjat qarama-qarshi bo‘lsa:

1. `README.md` ustuvorlik tartibini qo‘llang.
2. Yechim aniq bo‘lmasa kod yozishni to‘xtating.
3. `PROJECT_STATE.md`ga blocker yozing.
4. Yangi ADR talab qiling.

Taxmin qilib davom etish taqiqlanadi.

## 10. Git protokoli

- Bitta branch — bitta task yoki bir-biridan ajralmaydigan kichik tasklar.
- Branch: `task/TASK-###-short-name`.
- Commit: `TASK-###: imperative summary`.
- Unrelated refactor kiritmang.
- Migration va unga mos generated type bir commit/PR ichida bo‘lsin.
- Merge oldidan branch main bilan yangilanadi va quality gate qayta ishlatiladi.

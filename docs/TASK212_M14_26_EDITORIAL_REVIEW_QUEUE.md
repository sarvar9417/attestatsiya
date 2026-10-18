# TASK-212 · M14 bo‘yicha 26 ta REVIEW savolni tekshirish varaqasi

**Holat:** 2026-10-18 read-only Supabase snapshoti. Barcha 26 savol `review`, `published` emas. Ushbu varaq kimningdir tekshiruvdan o‘tkazgani yoki tasdiqlagani haqida da’vo qilmaydi.

**Manba lokatori:** bazadagi `source_reference` satrida `authored:ai-assisted:m14-closed-20261018:kasb-standarti:page-N:topic-N:question-N`. Bu **AI yordamida yaratilgan qoralama** va lokator ekanini bildiradi; sahifa manba PDFga haqiqatan mosligini inson mustaqil tekshirishi kerak. Bu faylda savol matni, maxfiy javob kaliti yoki shaxsiy ma’lumot joylashtirilmaydi.

## Har bir savol uchun majburiy qabul protokoli

- [ ] Keltirilgan source PDFning aynan o‘sha beti va qoidasi ochib tekshirildi.
- [ ] Savol bayoni mazmunan aniq; yakka to‘g‘ri javob isbotlangan; to‘g‘ri variant manba bilan mos.
- [ ] Uch noto‘g‘ri variant bir xil mavzu va mantiqiy darajada, lekin to‘g‘ri javobga aylanmaydi; kalitni ochib beradigan uzunlik/grammatika alomati yo‘q.
- [ ] Savol allaqachon published bankdagi yoki boshqa REVIEW savoldagi semantik dublikat emas; mavzu va kognitiv talab to‘g‘ri.
- [ ] Reviewer/approver va manba-bet tekshiruvi auditda real identifikator/vaqt bilan qayd etilgan (soxta signoff yo‘q).
- [ ] Muallif/reviewer mustaqilligi, immutable revision, archive/history, security/RLS va server preflight saqlangan.

## Tekshiruv reyestri (boshlang‘ich hammasi PENDING)

| Mavzu | Bazadagi AI-assisted source locator | Manba-bet | Key/distractor | Ekspert | Holat |
|---|---|---|---|---|---|
| M14.01 | kasb-standarti:page-2:topic-1:question-1 | ☐ | ☐ | ☐ | PENDING |
| M14.01 | kasb-standarti:page-2:topic-1:question-2 | ☐ | ☐ | ☐ | PENDING |
| M14.01 | kasb-standarti:page-2:topic-1:question-3 | ☐ | ☐ | ☐ | PENDING |
| M14.02 | kasb-standarti:page-4:topic-2:question-1 | ☐ | ☐ | ☐ | PENDING |
| M14.02 | kasb-standarti:page-4:topic-2:question-2 | ☐ | ☐ | ☐ | PENDING |
| M14.02 | kasb-standarti:page-5:topic-2:question-3 | ☐ | ☐ | ☐ | PENDING |
| M14.03 | kasb-standarti:page-6:topic-3:question-1 | ☐ | ☐ | ☐ | PENDING |
| M14.03 | kasb-standarti:page-7:topic-3:question-2 | ☐ | ☐ | ☐ | PENDING |
| M14.04 | kasb-standarti:page-8:topic-4:question-1 | ☐ | ☐ | ☐ | PENDING |
| M14.04 | kasb-standarti:page-8:topic-4:question-2 | ☐ | ☐ | ☐ | PENDING |
| M14.04 | kasb-standarti:page-8:topic-4:question-3 | ☐ | ☐ | ☐ | PENDING |
| M14.04 | kasb-standarti:page-8:topic-4:question-6 | ☐ | ☐ | ☐ | PENDING |
| M14.04 | kasb-standarti:page-9:topic-4:question-4 | ☐ | ☐ | ☐ | PENDING |
| M14.04 | kasb-standarti:page-9:topic-4:question-5 | ☐ | ☐ | ☐ | PENDING |
| M14.05 | kasb-standarti:page-10:topic-5:question-1 | ☐ | ☐ | ☐ | PENDING |
| M14.05 | kasb-standarti:page-10:topic-5:question-2 | ☐ | ☐ | ☐ | PENDING |
| M14.05 | kasb-standarti:page-10:topic-5:question-3 | ☐ | ☐ | ☐ | PENDING |
| M14.05 | kasb-standarti:page-10:topic-5:question-4 | ☐ | ☐ | ☐ | PENDING |
| M14.06 | kasb-standarti:page-12:topic-6:question-1 | ☐ | ☐ | ☐ | PENDING |
| M14.06 | kasb-standarti:page-12:topic-6:question-2 | ☐ | ☐ | ☐ | PENDING |
| M14.06 | kasb-standarti:page-12:topic-6:question-3 | ☐ | ☐ | ☐ | PENDING |
| M14.06 | kasb-standarti:page-12:topic-6:question-4 | ☐ | ☐ | ☐ | PENDING |
| M14.07 | kasb-standarti:page-13:topic-7:question-1 | ☐ | ☐ | ☐ | PENDING |
| M14.07 | kasb-standarti:page-13:topic-7:question-2 | ☐ | ☐ | ☐ | PENDING |
| M14.07 | kasb-standarti:page-13:topic-7:question-3 | ☐ | ☐ | ☐ | PENDING |
| M14.07 | kasb-standarti:page-13:topic-7:question-4 | ☐ | ☐ | ☐ | PENDING |

**Hisob:** 26 ta review, 0 ta ekspert tasdig‘i ushbu varaq doirasida qayd qilindi. `PENDING` savol generatoriga kiritilmaydi.

## Releasedan oldingi shart

M14ning 7/7 mavzusida 20 ta `published + keyed + canonical active` savolga yetish, barcha 26 savol bo‘yicha haqiqiy ekspert imzosi va no-mutating test preflight PASS, dedicated 15 va official 50 mock kvota/format/guruh/regressiya, exact Git SHA / production DB parity, foydalanuvchining yangi aniq release tasdig‘i. **Bular bajarilmaguncha `main`ga merge ham, production deploy yoki publish ham taqiqlanadi.**

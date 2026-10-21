# TASK-371 — M15 Pedagogika darslari: 56 qisqa javob izohini chuqurlashtirish

## Foydalanuvchi release cheklovi

**Faqat GitHub `main`ga merge. Foydalanuvchi alohida aytmaguncha productionga deploy, Supabase'ga SQL yozish, migration apply, publish/waiver taqiqlanadi.** Repo `vercel.json` faylida `git.deploymentEnabled: false` saqlangan.

## Sifat nazorati manbasi va topilma

2026-10-21 read-only Supabase tekshiruvining bir lahzalik holati: 8 363 ta savol, 5 415 ta published, shular ichida 1 945 published izoh 70 belgidan qisqa. Barcha qisqa izohlarni avtomatik ravishda xato deb hisoblamaslik kerak. Pedagogika M15dagi `authored:m15-topictest-20261018:*` manbali **56 ta published Y1 savolda** 80 belgidan qisqa izohlar mavjud va hali `pedagogy_revision_queue` da emas edi. Bu to‘plam 8 ta mavzu bo‘limini qamrab oladi.

## Tayyorlangan ish

- `supabase/maintenance/task371_m15_56_explanation_revisions_ROLLBACK_ONLY.sql`: **56 ta savol uchun alohida, sabab-oqibatga tayangan izoh** (har biri kamida 155 belgi, aslida eng qisqasi 267 belgi). Javob kalitlari va variantlar keyinchalik mustaqil REVIEW vorisga ko‘chirilishi mumkin, lekin original published yozuv hech qachon joyida o‘zgartirilmaydi.
- Skript `BEGIN` bilan boshlanib, **majburiy `ROLLBACK`** bilan tugaydi. U **migration emas**, hech qachon production bazada bajarilmagan va `publish_pedagogy_revision`ni chaqirmaydi.
- `src/tests/task371M15PedagogyDraft.test.ts` 56 ta noyob source-reference, 8 mavzu, batafsil izoh uzunligi, server tarixining immutable saqlanishi va hech qachon publish/commit yo‘qligini nazorat qiladi.
- `supabase/maintenance/task371_m15_short_explanation_audit_READONLY.sql` faqat status/count manba bo‘yicha qayta audit uchun.

## Ekspertiza prinsiplariga mos kelishi

Tushuntirish savolga shunchaki to‘g‘ri variant matnini takrorlash emas. Dars turi/tahlil, yoshga moslash, perseptiv qobiliyat, pedagogik takt, hamkorlik, mustahkamlik, differensial va inklyuziv ta’lim kabi tushunchalarning **nega aynan shu javobga olib kelishi** va unga yaqin atamalardan farqi yoritilgan. Qisqa javoblar xatoligiga dalilsiz da’vo qilinmagan.

## Hozirgi status

**56 explanation draft — ready in Git; zero production mutation.** Hozir foydalanuvchilar original izohlarni ko‘radi, chunki staging va publikatsiya egalik qiluvchi shaxsning yangi, alohida ruxsatisiz bajarilmaydi. Hech bir foydalanuvchining imtihon natijasi, javob kaliti yoki shaxsiy ma’lumotiga tegilmagan.

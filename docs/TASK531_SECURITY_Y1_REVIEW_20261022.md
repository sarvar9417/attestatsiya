# TASK-531 — Axborot xavfsizligi Y1 distractor sifat auditining 8 ta REVIEW nusxasi

## Qamrov va maqsad
Foydalanuvchi barcha informatika attestatsiya savollarini tekshirish va bosqichli tuzatishlarga ruxsat bergan. TASK-531 faqat `S7.SEC` guruhidagi **8 ta published Y1 original savol**ning yangi `review` variantlarini taklif qiladi. Barcha yangi tahrirlar AI yordamida ishlab chiqilgan; inson eksperti tasdig‘i mavjud deb ko‘rsatilmaydi. Learning API, exam scoring yoki published savol matnini o‘zgartirmaydi.

## Tanlangan savollar
| Original ID | O‘rganiladigan vaziyat |
|---|---|
| `89a482ca-2e7c-8647-bead-ff8cd740f8a6` | Ommaviy kompyuterda hisob sessiyasi ochiq qolishi |
| `d54a5662-ee02-b536-c957-9ca6b98f6894` | Fishing va zararli dastur tushunchalarini ajratish |
| `71845faf-3b46-3a41-35c2-52da8c4acd19` | OTP va shoshiltirish orqali ijtimoiy muhandislik |
| `fb232e6b-f65b-0789-d190-3b53d05c4bef` | Elektron raqamli imzo va hujjat yaxlitligi |
| `b5f87ccc-69c3-b63d-a1a9-cf5c43301728` | Reklama orqali ko‘rsatilgan portal manzilini tekshirish |
| `0806ae3f-cdb7-0982-9f9d-bafdef612a85` | Elektr uzilishida zaxira ta’minot/tiklash |
| `a48f6a23-4f48-4e28-8be4-d588c626eff4` | Bank nomidan kelgan shubhali xabar |
| `2e07d764-150c-b661-778c-d8014e14042e` | Ilovalar uchun minimal zarur ruxsat |

## Origin evidence va cheklov
Original `stem_md`, `source_reference`, har bir `question_keys` correct-option ID/text va `explanation_md` live Supabase'dan 2026-10-22 kuni olindi. Sakkizala original `published`, format Y1, guruh S7.SEC, hech biri avvalgi `question_bank_revisions` successoriga ega emas.

Bu savollarning `m13-axr-v1` va `reserve-2026` source kodlari bazada mavjud. **Tegishli PDF sahifalari bu partiyada mustaqil tasdiqlanmadi**; xavfsizlikka oid umumiy tushunchalarni asl savollar bilan izchil qayta yozish tekshirilgan darslik sahifasini almashtirmaydi. Noto‘g‘ri variantlarda boshqa yaqin xavfsizlik tushunchalari bilan chalkashishlar tanlandi; har bir to‘g‘ri javob matni byte-for-byte saqlandi.

## Fail-closed staging
- Exactly 8 original UUID, `published`+Y1+S7.SEC, source text/answer, lesson and fingerprint QA.
- 3 yangilangan distractor + eski aynan to‘g‘ri javob, 4 case-sensitive distinct option, correct answer maximal wrong length <=1.25×, max/min <=1.8×.
- AI provenance `is_generated=true`; `review` status; `human_editorial_approval=false`; independent signoff berilmaydi.
- Originalga `medium` pending-finding, shu bois rasmiy mock eligibility sun’iy o‘zgarmaydi.
- **Live production BEGIN … ROLLBACK preflight:** 8 yangi review, 32 options, 8 keyed answers PASS; old mock-eligible original count oldin/ichida **1**; old historical exam-item count **2**.
- SQL: `supabase/maintenance/task531_security_eight_review_stage.sql`; regression test: `src/tests/task531SecurityReview.test.ts`.

## Nashr qilishga ruxsat
Ushbu PR faqat manbaga asoslangan REVIEW takliflarini tayyorlaydi. GitHub CI + merge, keyin bir martalik REVIEW staging uchun qo‘shimcha postflight kerak. O‘quvchilarga chiqarish masalasi alohida mustaqil tahririy tasdiq va nashr shartlari bajarilgandan keyin ko‘riladi. Oldingi 8 original savol, correct key va tarixiy imtihon natijalari o‘zgartirilmaydi.

**Handoff:** Task TASK-531; natija: 8 source-key-pin REVIEW proposals, ROLLBACK PASS; keyingi ish: GitHub CI, owner/editorial source verification va issue #469dagi qolgan savollar.

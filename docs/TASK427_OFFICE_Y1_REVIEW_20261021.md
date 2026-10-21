# TASK-427 — Office Y1 savollarini sifatli REVIEW partiyasi (2026-10-21)

## Owner ruxsati va chegarasi
User butun attestatsiya savollar bazasini audit qilish va sifatli tuzatishlarni bosqichma-bosqich ishlab chiqarishga oldin ruxsat berdi; bu turn'da «davom et» dedi. Ushbu task faqat **8 ta published S2.OFFICE Y1 savoli** uchun yangi REVIEW versiyalarini tayyorlaydi va eski nashr versiyalariga tegmaydi.

## Mavzular / manbaga bog‘lanish
| ID | Berilgan savol tushunchasi | Production'dagi manba identifikatori |
|---|---|---|
| cd772e39-d561-8aab-7986-a6f200445980 | Excel Conditional Formatting <50 | OFF-E04-020, CAM7 va CAM10–11 |
| 813fb43d-17bf-7f9c-7368-8d1fe26287d9 | Word Mail Merge, 40 ta sertifikat | OFF-W03-025, ICT5/ICT6/CAM7/CAM10–11 |
| dd8d8ed0-9187-5f44-2c54-a1dbb3b6d803 | Word Section Break, bitta landscape bet | M03-S26-W02-01, ICT5/CAM9 |
| a88f3eab-5d91-ee34-6121-30231555b187 | PowerPoint Entrance va Fade Transition | M03-S26-P02-01, ICT6/CAM9 |
| 15599f0c-323d-b28a-ae69-2c6ad4ea9896 | Word Enter va Shift+Enter | OFF-W02-008, ICT5/ICT6/CAM7 |
| 5672ac57-35ea-f504-94cd-e5d4f321c22b | PowerPoint 15 soniyada avtomatik o‘tish | M03-S26-P02-03, ICT6/CAM9 |
| 939fc993-7f18-1dd8-17ca-35882f0f5692 | Excel SUM va COUNTIF | OFF-E03-009, CAM6/CAM10–11 |
| d53d3cfc-f971-a72c-8c98-90cd2084dbdb | Excel `#####` chiqishi | OFF-E01-019, CAM6/CAM7/CAM10–11 |

**Evidence chegarasi:** Manba kodlari production savollarining `source_reference` metama’lumotidan olingan; PowerPointning ikki savoli (Entrance/Transition va 15 soniyalik avtomatik o‘tish) uchun foydalanuvchi yuklagan **ICT 6 (2021), PDF 151–152-sahifalar** matni va 152-sahifa vizual tekshirildi: o‘tish effekti, 5-bandda slayd almashinish vaqtini belgilash va obyekt animatsiyasi aniq ajratilgan. Qolgan **6 Office savoli uchun aniq PDF sahifasi bu bosqichda mustaqil tasdiqlanmagan**. Aniq eski to‘g‘ri javob matni va savol konteksti production `question_keys` / `question_options` bo‘yicha tekshirildi. Yangi noto‘g‘ri variantlar va kengaytirilgan izohlar AI-assisted didaktik tahrirdir; manbadan so‘zma-so‘z olingan degan da’vo qilinmaydi. Mustaqil inson ekspertizasi bajarilgan deb qayd etilmaydi.

## Sifat va saqlash invarianti
- Yangi har bir savolda 3 ta mavzuga yaqin noto‘g‘ri javob, aynan saqlangan to‘g‘ri javob va tushuntirish mavjud.
- Case-sensitive 4 ta turli variant; word-count max/min ≤1.8; correct/max_wrong ≤1.25.
- `is_generated=true`, `status=review`, `human_editorial_approval=false`, `release_performed=false` ko‘rsatilgan.
- Old published savol versiyasi, eski answer key, old exam attempt va 4 ta tarixiy exam item bog‘lanishi o‘zgarmas.
- Manba/variant kaliti/fingerprint/drift, source lesson, Y1 tuzilmasi va oldingi revision mavjud emasligi barcha 8 uchun qat’iy tekshiriladi.

## Production'dagi qaytariladigan sinov
`supabase/maintenance/task427_office_eight_review_stage.sql` **BEGIN → INSERT → postflight → ROLLBACK** sinovida: `stage_count=8, option_count=32, review_count=8`. Hech qanday doimiy yozuv yo‘q. GitHub PR/test gate'dan keyin faqat REVIEW-staging (bir martalik Supabase migration runner), postflight; keyingi alohida verified release mumkin.

## Kelgusi task
Manbaga mosligini ko‘rib chiqish, qolgan Office va security length/lexical candidate'larni 5,531+ active savol kontekstida sinflarga ajratish; GitHub #469. Audit heuristikasi semantik xato degani emas.

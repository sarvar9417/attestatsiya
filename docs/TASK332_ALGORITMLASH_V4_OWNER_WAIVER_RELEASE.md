# TASK-332 — Algoritmlash V4: owner-waiver bilan oltita grafik savolni nashr qilish

**Ruxsat:** 2026-10-20 foydalanuvchi/loyiha egasi mavjud `review` savollarini AI orqali sifat tekshiruvidan o‘tkazib, nashr etishga aniq ruxsat berdi. Oldingi muloqotda mustaqil ekspert/E2E talabini ixtiyoriy deb belgilagan.

**Shart:** Bu **AI tekshiruvi + loyiha egasining release ruxsati**, mustaqil inson ekspertining har savolga imzosi **emas**. `question_editorial_checks`ga imzo yoki soxta reviewer ID yozilmaydi.

## Oltita savolni mazmuniy tekshiruv

| Savol | Diagram | Mustaqil hisob tekshiruvi | Qaror |
|---|---|---|---|
| ALG-V4-001 | flow_product_3_9.svg | P=1 dan i=3,6,9 ko‘paytirish: 3×6×9=162 | Matn/kalit/izoh mos |
| ALG-V4-002 | flow_product_3_9.svg | Ikkinchi amaldan keyin P=3×6=18 | Matn/kalit/izoh mos |
| ALG-V4-003 | flow_until_negative.svg | 6,8 qo‘shiladi; −2 chiqish belgisi; 3 o‘qilmaydi: S=14 | Matn/kalit/izoh mos |
| ALG-V4-004 | flow_until_negative.svg | Birinchi kiritish −4: S=0 | Matn/kalit/izoh mos |
| ALG-V4-005 | dag_paths_a_j.svg | Dinamik yo‘l sanog‘i: E=2,F=3,G=1,H=5,I=3,J=8 | Matn/kalit/izoh mos |
| ALG-V4-006 | dag_paths_a_j.svg | E→I qirrasi olib tashlansa J=6 | Matn/kalit/izoh mos |

## Release-gate va xavfsizlik

1. Uchta original SVG fayl **GitHub main**ga merge qilinadi; production Vercel uchun birinchi-party URLga GET/200 bilan ko‘rinishi tekshiriladi.
2. OLTI itemning hammasi bitta transaksiyada: source_reference, current status, published lesson, local diagram URI, Y1/4-variant, haqiqiy option ID, izoh, konstrukt tekshiriladi.
3. Owner-waiver auditda mustaqil inson ekspert imzosi `false` saqlanadi; `question_editorial_checks`ga yozilmaydi.
4. Status `review → published`; boshqalarga tegilmaydi; yangi fingerprint `question_quality_published_revisions`da muzlatiladi.
5. 12 ta avvalgi V2 `draft` grafik savollar o‘zgartirilmaydi.
6. `supabase/tests/task332_algo_owner_six_release_contract.sql` va `task207_algorithm_style_quality.test.sql` regressiyalari bilan nazorat qilinadi.

**Bu hujjat yoki CI natijasi haqiqiy imtihonda aynan shu savollar tushishini yoki inson mutaxassisning shaxsiy tasdig‘ini bildirmaydi.**

## Handoff

TASK-332 migration: `20261020203000_task332_algo_v4_six_owner_waiver_publish.sql`. CI fresh schema deploy ketma-ketligi va production asset testi mos bo‘lgandan keyin Supabase'ga qo‘llash mumkin.

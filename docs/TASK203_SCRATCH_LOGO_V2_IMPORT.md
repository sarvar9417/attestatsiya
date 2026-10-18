# TASK-203 Scratch/LOGO 2.0 — platforma integratsiyasi

- Maqsad: M07 ga 6 ta draft nazariya bobini va 180 ta draft savolni qo‘shish.
- Oldingi 5 ta published dars yoki mavjud savollar tahrirlanmaydi.
- Foydalanuvchi natijalari, imtihonlar, attempt tarixiga tegilmaydi.
- 2026 spetsifikatsiyasining S4.BLOCK.01–05 konstruktlariga bog‘langan.
- 168 Y1, 6 native Y2, 6 native Y3.
- Chizmalari (SVG): 7 tur. Public URL: /scratch-logo-v2/*.svg.
- Migration: 20261018135500_task203_scratch_logo_v2_draft_bank.sql; status: draft; human review required.
- Migratsiyani productionga qo‘llash / merge / deploy: foydalanuvchining alohida ruxsatisiz bajarilmaydi (PEDAGOGY_RELEASE_FREEZE.md).
- Markdown nazariya Pandoc orqali 2.0 LaTeX qo‘llanmasidan chiqarildi, sarlavhalar manbalarga mos.
- Y2 / Y3 asl ko‘rsatilgan variant-kombinatsiyalar o‘rniga platformaning native UUID key shaklida o‘tkazildi.
- Rasmli savollar uchun diagrammalar GitHub public asset sifatida qo‘shilishi kerak.

**Bajarish:** clean Supabase migration chain -> SQL -> SQL regression -> frontend smoke -> human editorial review -> alohida ruxsat bilan release.
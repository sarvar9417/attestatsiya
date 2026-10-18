# TASK-239 — Office V2 grafik savollarini review uchun tayyorlash

- Maqsad: M03 Office V2 dagi 7 ta yetishmayotgan rasmni xavfsiz, birinchi-tomon SVG fayli bilan ta'minlash.
- Fayllar: `public/office-v2/off_*.svg`; quiz frontend allowlist; idempotent data migration.
- Rasmlar mavjud PDF to'plamdagi original 7 ta diagramma qiymatlari asosida vektor shaklida qayta chizildi.
- Diagrammalar: bar (18,24,12), line (40,50,45), pie (20,30,50), Excel 85/68/74/59, PowerPoint placeholders, animation order, Word 28/26 va 30/27.
- Oldingi published kontent, exam attempt yoki kalitlar tahrirlanmaydi. Yetti draft savol `review` holatiga o'tadi, **`published`ga emas**.
- AI kontentini nashr qilish uchun inson-ekspert har bir savol, grafik, format, javob kaliti va nazariyani tekshirishi shart.
- DB yangilash: `supabase/migrations/20261019040000_task239_office_v2_visual_review.sql` ni qo'llash; qayta qo'llanganda idempotent.
- Frontend unit test: `src/tests/officeV2VisualAssets.test.tsx`.
- Production checklist: asset URLs 200; savol rasm ko'rinishini mobile/desktop tekshirish; SQL DB 270/9; draft/review counts; expert approval; keyingina alohida publication revision.
- Rollback: content review holati saqlanishi mumkin, vizual assets va client allowlist commit revert qilinadi; eski published kontentga ta'siri yo'q.

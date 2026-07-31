-- Questions ni bevosita darsga (lesson) bog'lash.
--
-- Nima uchun: savollar construct_id orqali bog'langan, lekin bitta construct
-- bir nechta darsda ishlatiladi (masalan S1.INFO.03 — M01.05 va M01.06 da).
-- Dars bo'yicha aniq savol ro'yxati uchun to'g'ridan-to'g'ri havola kerak.
--
-- source_lesson_id: manba m01.ts dagi savol egasi bo'lgan subtopic darsi.
-- Savol bir nechta darsda ishlatilsa ham egasi bitta — source_lesson_id
-- o'zgarmaydi (published revision invariant).
--
-- Backfill 000015 da (generator bug'i tufayli bu faylda bo'sh qolgan edi).

begin;

alter table public.questions
  add column if not exists source_lesson_id uuid references public.lessons(id) on delete set null;

create index if not exists idx_questions_source_lesson
  on public.questions (source_lesson_id)
  where source_lesson_id is not null;

commit;

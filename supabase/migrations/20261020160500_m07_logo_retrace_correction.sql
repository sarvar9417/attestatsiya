-- M07 expert pass 2: correct LOGO turtle tracing misconception (one keyed answer).
-- REPEAT 4 [FD 30 RT 90] returns to the original position and heading.
-- The last FD 30 retraces the FIRST side of the existing square.
-- Reuse original option ID and question ID; no attempt grading or key mutation.
UPDATE public.questions SET
 stem_md='Qalam tushirilgan holatda LOGO `REPEAT 4 [FD 30 RT 90] FD 30` bajariladi. Oxirgi `FD 30` chizmaga qanday ta’sir qiladi?',
 updated_at=now()
WHERE id='9766b2d1-260c-5265-89cf-9230d20775d9'::uuid
 AND status='published'::content_status
 AND stem_md='LOGO `REPEAT 4 [FD 30 RT 90] FD 30` natijasini qanday tushunish kerak?';
UPDATE public.question_options SET
 content_md='Kvadratning birinchi tomoni yana chiziladi; yangi alohida chiziq paydo bo‘lmaydi'
WHERE id='23b3ed1a-870c-5ec3-b360-98cb14f37a27'::uuid
 AND question_id='9766b2d1-260c-5265-89cf-9230d20775d9'::uuid
 AND content_md='Kvadrat tugagach qo‘shimcha 30 birlik oldinga chiziq';
UPDATE public.question_keys SET
 explanation_md='REPEAT 4 [FD 30 RT 90] to‘liq kvadratni yopadi va toshbaqa boshlang‘ich koordinata hamda yo‘nalishga qaytadi. Tashqaridagi FD 30 kvadratning BIRINCHI tomonining ustidan qayta yuradi. Shu sabab alohida yangi kontur yoki yangi tomon hosil bo‘lmaydi. Manba: Terrapin Logo turtle tutorial; ICT 5/6 turtle grafikasi va 2026 attestatsiya masalalari uslubi.'
WHERE question_id='9766b2d1-260c-5265-89cf-9230d20775d9'::uuid
 AND explanation_md LIKE 'Ichki repeat kvadratni yopadi, tashqaridagi FD yana bitta chiziq chizadi.%';

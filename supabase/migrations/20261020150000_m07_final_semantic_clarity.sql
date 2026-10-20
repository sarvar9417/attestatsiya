-- M07 final QA: clarify nine ambiguous Y3 instructions without changing UUIDs, options or keys.
-- Tests and existing attempts remain valid; fresh CI schemas lacking items are no-ops.
WITH edits(source_id, old_stem, new_stem) AS (VALUES
  ('SL3-Y3-03-02', 'Yashil bayroq bosilganda tovush chalib, keyin sprayt harakatlanishi uchun bloklarni tartiblang.', 'Yashil bayroq bosilgach, sprayt avval (0,0) nuqtaga qaytsin, so‘ng `pop` tovushi tugaguncha ijro etilsin va shundan keyin 50 qadam yursin. Bloklarni tartiblang.'),
  ('SL3-Y3-05-01', 'Scratch Pen bilan kvadrat chizishning umumiy buyruq ketma-ketligini tartiblang.', 'Avval sahnadagi eski qalam izlarini tozalang, keyin qalamni tushiring, kvadrat chizing va yakunda qalamni ko‘taring. Scratch Pen bloklarini tartiblang.'),
  ('SL3-Y3-06-01', 'Klassik LOGOda toshbaqa kvadrat chizib, keyin qalamni ko‘tarishi uchun buyruqlarni joylashtiring.', 'Klassik LOGOda avval ekranni tozalab toshbaqani boshlang‘ich holatga qaytaring; so‘ng qalamni tushirib kvadrat chizing, oxirida qalamni ko‘taring. Buyruqlarni tartiblang.'),
  ('SL3-Y3-07-01', 'Klon hosil qilinib, u paydo bo‘lgan zahoti harakatlanishi uchun sabab-oqibat tartibini aniqlang.', 'Ikki mustaqil Scratch skriptidagi hodisalarning sabab-oqibat tartibini aniqlang: yashil bayroq bosiladi, klon yaratiladi, `when I start as a clone` alohida klon skriptini ishga tushiradi va klon 30 qadam yuradi. Bular bitta ulangan skript emas.'),
  ('SL3-Y3-08-01', 'Spraytga yangi kostyum chizib, uni namoyish etish ishini tartiblang.', 'Avval `Costumes` yorlig‘ini oching, yangi kostyumni chizing, so‘ng uning nomini belgilang, oxirida skriptda shu kostyumni ko‘rsating. Bosqichlarni tartiblang.'),
  ('SL3-Y3-09-02', 'Space tugmasi bosilganda sprayt 20 qadam yurishi uchun skriptni tartiblang.', 'Space tugmasi bosilishini kutgach, sprayt 20 qadam yursin va faqat harakat tugagach `Bajarildi` deb aytsin. Scratch bloklarini tartiblang.'),
  ('SL3-Y3-11-01', 'Bir nuqtada ikkita kvadrat naqshini izma-iz chizish jarayonini tartiblang.', 'Avval sahnadagi eski qalam izlarini tozalang, so‘ng qalamni tushiring va birinchi kvadratni chizing; undan keyin 45° burilib ikkinchi kvadratni chizing. Scratch Pen bloklarini tartiblang.'),
  ('SL3-Y3-11-02', 'Scratch Pen bilan qalam qalinligini o‘zgartirib, keyin chiziq chizish tartibini aniqlang.', 'Avval sahnadagi eski chiziqlarni tozalang, keyin qalam qalinligini 6 ga o‘rnating, qalamni tushiring va 80 qadam chizing. Bloklarni tartiblang.'),
  ('SL3-Y3-12-01', 'LOGOda 4 ta ichki kvadratdan iborat burchakli naqshning bajarilish tartibini aniqlang.', 'LOGOda avval ekranni tozalab toshbaqani boshlang‘ich joyga qaytaring; qalamni tushiring, to‘rtta ichki kvadratli naqshni chizing va yakunda qalamni ko‘taring. Buyruqlarni tartiblang.')
)
UPDATE public.questions q SET stem_md=e.new_stem, updated_at=now()
FROM edits e
WHERE q.source_reference LIKE ('Scratch-LOGO-2026-v3.1:' || e.source_id || ';%')
  AND q.status='published'::content_status
  AND q.stem_md=e.old_stem;

-- A26-14 uses four DRAGGABLE CARDS, the last contains two LOGO commands.
UPDATE public.questions SET stem_md='LOGOda qalam izisiz oldinga 20 birlik o‘tib, so‘ng chapga yo‘nalib 40 birlik chiziq chizish uchun quyidagi to‘rtta kartochkani tartiblang. Oxirgi kartochkada `PD` va `FD 40` ketma-ket yozilgan. Qalam dastlab tushirilgan (PD) deb oling.',updated_at=now()
WHERE id='8b74787a-ea14-5f35-85d2-df3aaeccc2af'::uuid
 AND status='review'::content_status
 AND stem_md='LOGOda qalam izisiz oldinga 20 birlik o‘tib, so‘ng chapga yo‘nalib 40 birlik chiziq chizish uchun quyidagi to‘rtta buyruqni tartiblang. Qalam dastlab pastda (PD) deb oling.';

-- This nested-REPEAT code follows the actual April 13 2026 exam item, not an independently new script.
UPDATE public.questions SET source_reference=replace(replace(source_reference,'(FAKAT USLUB); kod va rasm — mustaqil mualliflik varianti','(Q10 KODI MOSLASHTIRILGAN); A–D grafik variantlar qayta chizilgan'),'ORIGINAL_REVIEW','ADAPTED_PAST_EXAM'),updated_at=now()
WHERE id='a279bed1-465c-5652-ac9d-221e51081eb3'::uuid;
-- M07 expert pass 2 (2026-10-20): correct factual semantics and unambiguous wording.
-- Reuses all existing question/option/key UUIDs; only published stem_md updates.
-- Old exact stems and stable source prefixes make migration idempotent.
WITH fixes(source_prefix,old_stem,new_stem) AS (VALUES
  ('Scratch-LOGO-2026-v3.1:SL3-Y3-05-02;','Chizmani chapga 40 birlikka iz qoldirmasdan ko‘chirib, keyin yangi chiziq chizish bosqichlarini tartiblang.','Scratch Pen’da eski chizilgan chiziqlar joyida qoladi. Spraytni chapga 40 birlik iz qoldirmasdan siljiting, so‘ng joriy yo‘nalishda 50 qadam yangi chiziq chizing. Bloklarning bajarilish tartibini aniqlang.'),
  ('Scratch-LOGO-2026-v3.1:SL3-Y3-06-02;','Klassik LOGOda qalam izisiz oldinga 30 birlik o‘tib, keyin o‘ngga chiziq chizish bosqichlarini tartiblang.','Klassik LOGOda qalamni ko‘tarib 30 birlik oldinga izsiz yuring; undan keyin qalamni tushiring, 90° o‘ngga burilib 40 birlik chiziq chizing. `RT 90 FD 40` bitta kartochkada berilgan. Kartochkalar tartibini aniqlang.'),
  ('Scratch-LOGO-2026-v3.1:SL3-Y3-04-02;','Parol tekshirilgandan keyin tarmoqlanish natijasini ko‘rsatish jarayonini tartiblang.','Parol tekshirish algoritmining to‘rtta mantiqiy bo‘lagini tartiblang: avval javobni so‘rash, so‘ng 1234 bilan taqqoslash, keyin rost va yolg‘on tarmoqlaridagi xabarlarni belgilash. Bu bo‘laklar haqiqiy Scratch `if–else` blokining ichki mantiqini ifodalaydi, mustaqil `else` bloki emas.'),
  ('Scratch-LOGO-2026-v2:SL2-02-027;','score o‘zgaruvchisi 0 dan 5 gacha har safar +2 bo‘lsa, qaysi qiymatlar ketma-ketligi olinadi?','Quyidagi Scratch dasturida `score` dastlab 0. Har aylanishda 2 ga oshiriladi va sikl faqat `score > 5` bo‘lganda tugaydi. Boshlang‘ich qiymatdan to‘xtaguncha `score` qaysi qiymatlarni oladi?')
)
UPDATE public.questions q SET stem_md=replace(q.stem_md,f.old_stem,f.new_stem),updated_at=now()
FROM fixes f
WHERE q.source_reference LIKE (f.source_prefix||'%')
  AND q.status='published'::content_status
  AND q.stem_md LIKE (f.old_stem||'%');

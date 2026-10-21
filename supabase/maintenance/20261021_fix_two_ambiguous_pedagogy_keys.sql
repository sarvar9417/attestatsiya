-- Pedagogika: two high-risk Y1 question key ambiguity repairs.
-- Preserve existing option IDs, answer keys, source_reference and historical attempts.
-- Only review-state questions are changed; SQL throws on unexpected publication.
BEGIN;
DO $fix$
DECLARE
  m uuid := '7782afd8-62e4-4acc-bbf5-2e9e2946f649';
  h uuid := 'b3296a52-f20d-4f56-93f9-0b3f6cd18da9';
  n int;
BEGIN
  SELECT count(*) INTO n FROM public.questions
  WHERE id IN (m,h) AND status='review'::public.content_status;
  IF n<>2 THEN RAISE EXCEPTION 'Unexpected status; two editable questions required'; END IF;
  SELECT count(*) INTO n FROM public.question_keys k
  JOIN public.question_options o ON o.id=(k.payload->>'correct_option_id')::uuid
  WHERE (k.question_id=m AND o.question_id=m AND o.order_idx=3)
     OR (k.question_id=h AND o.question_id=h AND o.order_idx=1);
  IF n<>2 THEN RAISE EXCEPTION 'Original keys changed; refuse editorial update'; END IF;

  UPDATE public.questions SET stem_md=
    'Musiqa o‘qituvchisi «Notadagi xatoni top» bellashuvini tashkil etdi. Ikki jamoa navbat bilan doskaga yozilgan do–mi–sol notalarini tinglangan sol–mi–do ijrosi bilan solishtiradi. Xatoni birinchi topib, asoslagan jamoaga ball beriladi. Qaysi metod yetakchi?',
    updated_at=now() WHERE id=m AND status='review'::public.content_status;
  UPDATE public.question_keys SET explanation_md=
    'Vaziyatda jamoalarning navbat bilan qatnashishi, xatoni aniqlash qoidasi va ball berish ko‘zda tutilgan. Mazkur belgilar ijrodagi xatoni topish faoliyatini didaktik o‘yinga aylantiradi.',
    updated_at=now() WHERE question_id=m;

  UPDATE public.questions SET stem_md=
    'O‘qituvchi ikki shaklda dars rejaladi: 1) evristik mashg‘ulotda o‘quvchilar ochiq muammo uchun turli yechimlar izlab, ularni muhokama qiladi; 2) masofaviy sinxron dars videomuloqot orqali o‘tiladi. Shu sharoitlarda har bir shaklga xos tashkiliy cheklov qaysi juftlikda aniq ko‘rsatilgan?',
    updated_at=now() WHERE id=h AND status='review'::public.content_status;
  UPDATE public.question_options SET content_md=CASE order_idx
   WHEN 0 THEN '1 — internet barqarorligi; 2 — muammoli yechimlarni solishtirishga vaqt'
   WHEN 1 THEN '1 — yechimlarni izlash va muhokamaga ko‘proq vaqt; 2 — internet va qurilmalarga bog‘liqlik'
   WHEN 2 THEN '1 — videokonferensiya uzilishlari; 2 — sinfxonadagi vositalarning cheklanganligi'
   WHEN 3 THEN '1 — raqamli qurilmalarni sozlash; 2 — individual farazlarni tekshirishga vaqt'
  END WHERE question_id=h AND side='a';
  UPDATE public.question_keys SET explanation_md=
    'Evristik mashg‘ulotda o‘quvchilar muammoga turli yechimlar ishlab chiqadi va ularni muhokama qiladi; bunga yetarli vaqt ajratilishi kerak. Jonli masofaviy darsda esa bog‘lanish sifati, internet va qurilma mavjudligi tashkiliy omillardir. Bu holat ikkala texnologiyani umumiy ravishda salbiy deb baholash emas, ayni shartlarga xos cheklovlarni farqlashdir.',
    updated_at=now() WHERE question_id=h;

  IF (SELECT count(*) FROM public.question_options WHERE question_id=h AND side='a')<>4
     OR (SELECT count(DISTINCT btrim(content_md)) FROM public.question_options WHERE question_id=h AND side='a')<>4
  THEN RAISE EXCEPTION 'Edited options are invalid'; END IF;
END
$fix$;
COMMIT;
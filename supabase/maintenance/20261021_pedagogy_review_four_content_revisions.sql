-- Review-only substantive rehabilitation of four pedagogy Y1 distractor sets.
-- Three source keys verified against original Google Drive PDF:
-- Pedmahorat to'plam 2025 kuzgi (3).pdf; no independent human approval inferred.
-- Published source versions and historical result UUIDs MUST remain unchanged.
BEGIN;
DO $quality$
DECLARE r record; idx integer; answer_idx integer;
BEGIN
 FOR r IN SELECT * FROM (VALUES
('24916d08-008f-43df-90e6-720f58982678'::uuid,'631b17ec-1ab7-45cc-b51f-655e0efa6cf1'::uuid,1,'Pedagog mavzuni tushuntirayotganda fikrni uzmasdan bayon etadi, tabiiy temp va ritmni saqlab, ifodali so‘zlaydi. Bunda nutqning qaysi sifati ustuvor?','["Mantiqiylik — xulosalarni dalil va sabablar bilan bog‘lash","Ravonlik — fikr oqimini uzluksiz va mos tempda ifodalash","Aniqlik — atama va tushunchalarni bir ma’noda ishlatish","Moslik — bayonni tinglovchining tayyorgarligiga moslash"]'::jsonb,'Fikrning uzluksiz oqimi, ifodalilik hamda temp va ritmning to‘g‘riligi nutq ravonligiga tegishli. Asl to‘plamning 2025-yil kuzgi (3) nusxasidagi savolda 1,2,4 deb berilgan. Bu yerda shu belgilarning ma’nosi vaziyat orqali baholanadi.'),
('588d5d9c-b227-4b6f-a9af-06f6a8573548'::uuid,'22c094b2-6a85-47ac-b639-a2394b6a5861'::uuid,2,'O‘qituvchi darsdagi xulosalarni ketma-ket asoslab, hodisalar o‘rtasidagi sabab-oqibat aloqalarini ochib beradi. Bu nutqning qaysi sifatini ko‘rsatadi?','["Moslik — bayonni auditoriya ehtiyojiga qarab o‘zgartirish","Ta’sirchanlik — emotsional urg‘u bilan diqqatni jalb qilish","Mantiqiylik — fikrlarni izchil va dalilli bog‘lash","Ravonlik — so‘zlarni uzluksiz va tabiiy tempda aytish"]'::jsonb,'Nutq mantiqiyligida izchillik, sabab-oqibat aloqasi, ta’kidlash, izoh va asos muhim. Asl kuzgi (3) to‘plamning 32-savolida 2,3,4,5 javobi ko‘rsatilgan; mazkur tahrir sanash o‘rniga xususiyatni vaziyatdan tanishni tekshiradi.'),
('60ee4c08-c961-4600-89a0-72610bf85ff6'::uuid,'7ce2655a-0fc8-4446-97f1-0f26240b2a03'::uuid,1,'Darsda o‘qituvchi muhim fikrlarni urg‘u bilan ajratadi, o‘rinli pauza qiladi va ovoz tembri hamda intonatsiyani boshqaradi. Bu nutqning qaysi jihati?','["Mantiqiy tuzilish — xulosalarning izchil va asosli bog‘lanishi","Ritmika — urg‘u, pauza, tembr va intonatsiya uyg‘unligi","Aniqlik — tushunchalarni bir ma’noli va konkret ifodalash","Mazmun to‘liqligi — mavzudagi asosiy fikrlarni qamrab olish"]'::jsonb,'Tembr, intonatsiya, urg‘u va pauza nutq ritmikasi bilan bevosita bog‘liq. Asl kuzgi (3) to‘plam savolida 1,2,3,4 javobi keltirilgan; konkretlik mazmunning aniqligiga yaqin tushuncha.'),
('d3105252-4dec-4a50-8227-d58a7a0e6b6c'::uuid,'7d066980-5c61-4c71-8f78-92496524fc93'::uuid,1,'Pedagog murakkab suhbatdan so‘ng o‘z muomala uslubini tahlil qilib, keyingi vaziyatda uni o‘quvchining ehtiyojiga moslashtirdi. Bu pedagogik nazokatning qaysi xususiyatini ko‘rsatadi?','["Muomalani shaxsiy xushfe’llik asosida davom ettirishni","Nazokatni tajriba va refleksiya bilan takomillashtirishni","Nutqning tashqi ko‘rinishiga e’tibor qaratishni","Barcha vaziyatlarga bir xil muomala qolipini tanlashni"]'::jsonb,'Pedagogik nazokat doimiy kasbiy rivojlanishni, vaziyatni hisobga olgan xushmuomalalikni va refleksiyani talab qiladi; bir xil qolip barcha munosabatlarga mos kelmaydi.')
 ) AS x(original_id, revision_id,correct_index,revised_stem,revised_choices,revised_explanation)
 LOOP
  IF NOT EXISTS (
    SELECT 1 FROM public.pedagogy_revision_queue j
      JOIN public.questions old ON old.id=j.source_question_id
      JOIN public.questions new ON new.id=j.revision_question_id
      WHERE j.source_question_id=r.original_id AND j.revision_question_id=r.revision_id
        AND old.status='published'::public.content_status
        AND new.status='review'::public.content_status
        AND new.format='Y1'::public.question_format
  ) THEN RAISE EXCEPTION 'Review source/version not eligible: %',r.original_id;END IF;
  IF (SELECT count(*) FROM public.question_options WHERE question_id=r.revision_id AND side='a')<>4
    OR jsonb_array_length(r.revised_choices)<>4
    OR (SELECT count(DISTINCT v.value) FROM jsonb_array_elements_text(r.revised_choices) AS v(value))<>4
  THEN RAISE EXCEPTION 'Option uniqueness/count invalid %',r.original_id;END IF;
  SELECT opt.order_idx INTO answer_idx FROM public.question_keys k
    JOIN public.question_options opt
      ON opt.id=(k.payload->>'correct_option_id')::uuid AND opt.question_id=k.question_id
    WHERE k.question_id=r.revision_id;
  IF answer_idx IS DISTINCT FROM r.correct_index THEN RAISE EXCEPTION 'Key mismatch %',r.original_id; END IF;
  UPDATE public.questions SET stem_md=r.revised_stem, updated_at=now()
    WHERE id=r.revision_id AND status='review'::public.content_status;
  FOR idx IN 0..3 LOOP
    UPDATE public.question_options SET content_md=r.revised_choices->>idx
      WHERE question_id=r.revision_id AND side='a' AND order_idx=idx;
    IF NOT FOUND THEN RAISE EXCEPTION 'Missing option index %: %',idx,r.revision_id;END IF;
  END LOOP;
  UPDATE public.question_keys SET explanation_md=r.revised_explanation,updated_at=now()
     WHERE question_id=r.revision_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Missing answer explanation %',r.revision_id;END IF;
  INSERT INTO public.question_quality_findings(question_id,finding_code,severity,details)
  VALUES(r.original_id,'review_distractors_rebalanced_20261021','medium',
   jsonb_build_object('revision_id',r.revision_id,'state','AI editorial draft requires independent content review',
     'details','Original content unchanged, four revised options, preserved answer index'))
  ON CONFLICT (question_id,finding_code) DO NOTHING;
 END LOOP;
END
$quality$;
COMMIT;
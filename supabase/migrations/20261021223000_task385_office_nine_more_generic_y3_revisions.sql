-- TASK-385: clarify nine further generic Y3 Office stems found by broader audit.
-- Immutable source answers/attempt records are preserved. One revised
-- formula-copy task now checks its final absolute reference as a last step.
-- AI review only; no independent human editorial certification is claimed.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='120s';
CREATE TEMP TABLE task385_cases(
 code text PRIMARY KEY,stem text NOT NULL,replacements jsonb NOT NULL,
 ordered_indices integer[] NOT NULL,explanation text NOT NULL
) ON COMMIT DROP;
INSERT INTO task385_cases VALUES ('OFF-E01-030','MS Excelda yangi ma’lumotlar jadvalini tayyorlashda ustunlarga mos sarlavha berish, ma’lumotlarni kiritish, formatni tekshirish va ish kitobini saqlash bosqichlarini tartiblang.','{}'::jsonb,ARRAY[3,4,1,2]::integer[],'Jadval tuzilishi uchun avval sarlavhalar yoziladi, so‘ng qiymatlar kiritiladi, turi va formati tekshiriladi, oxirida ish kitobi saqlanadi. Tartib: 3 → 4 → 1 → 2.'),
('OFF-E02-030','MS Excelda C3 katakdagi =A1+$B$2 formulani D5 katakka nusxalash kerak. Nisbiy havola A1 dan B3 ga siljishi, mutlaq $B$2 esa saqlanishi lozim. Ko‘chirish va yakuniy formulani tekshirish amallarini tartiblang.','{"0":"Yakuniy nusxa formulasidagi mutlaq koordinatalar o‘zgarmaganini tekshirish"}'::jsonb,ARRAY[2,3,4,1]::integer[],'Avval asl formula katagi C3 aniqlanadi, D5 ga siljish (+1 ustun, +2 satr) hisoblanadi. Nisbiy havola B3 ga siljitilib =B3+$B$2 yoziladi, so‘ng mutlaq $B$2 o‘zgarmagani tekshiriladi. Tartib: 2 → 3 → 4 → 1.'),
('OFF-E03-030','MS Excelda B2:B18 kataklardagi o‘quvchilar ballarining o‘rtacha qiymatini hisoblab, natijani qo‘lda tekshirish kerak. AVERAGE formulasini tuzish amallarini tartiblang.','{"1":"Ballar joylashgan B2:B18 diapazonini belgilash","3":"Belgilangan ballar diapazoni uchun AVERAGE funksiyasini tanlash"}'::jsonb,ARRAY[2,4,1,3]::integer[],'Avval B2:B18 diapazoni belgilanadi, unga tegishli AVERAGE funksiyasi tanlanadi, argumentlari kiritiladi va natija tekshiriladi. Tartib: 2 → 4 → 1 → 3.'),
('OFF-E04-030','MS Excelda sarlavhali jadvaldan faqat muayyan mezonga mos qatorlarni ko‘rsatish uchun Filter buyrug‘ini ishlatish kerak. Jadvalni tayyorlash, filtrlash va natijani tahlil qilish amallarini tartiblang.','{}'::jsonb,ARRAY[2,1,3,4]::integer[],'Avval sarlavha va ma’lumotlar tekshiriladi, keyin jadvalda Filter yoqiladi, mezon tanlanadi va qolgan qatorlar tahlil qilinadi. Tartib: 2 → 1 → 3 → 4.'),
('OFF-P01-030','PowerPointda muayyan auditoriya uchun mavzuli taqdimot ishlab chiqishda maqsadni aniqlashdan slaydlar rejasini tuzish, Theme/Layout tanlash va namoyishni tekshirishgacha amallarni tartiblang.','{}'::jsonb,ARRAY[1,4,2,3]::integer[],'Auditoriya va taqdimot maqsadi aniqlanadi, slaydlar rejasi tuziladi, mos dizayn tanlanadi, obyektlar joylashtirilib natija namoyishda tekshiriladi. Tartib: 1 → 4 → 2 → 3.'),
('OFF-P02-030','PowerPoint slaydidagi bitta obyekt uchun animatsiya effektini belgilash, Start/Duration/Delay parametrlarini sozlash va Animation Pane orqali tekshirish kerak. Amallarni tartiblang.','{}'::jsonb,ARRAY[2,4,3,1]::integer[],'Avval obyekt belgilanadi, Animations orqali effekt qo‘shiladi, uning vaqt parametrlari sozlanadi va Animation Pane hamda namoyishda tekshiriladi. Tartib: 2 → 4 → 3 → 1.'),
('OFF-W01-030','MS Wordda mavjud hujjatni ochib, matn xatolarini tuzatish, tahrir natijasini tekshirish va hujjatning yangi nomli nusxasini Save As bilan saqlash kerak. Amallarni tartiblang.','{}'::jsonb,ARRAY[3,2,1,4]::integer[],'Oldin mavjud hujjat ochiladi, xatolar tuzatiladi, hujjat tekshiriladi va yangi nusxasi Save As bilan saqlanadi. Tartib: 3 → 2 → 1 → 4.'),
('OFF-W02-030','MS Word hujjatidagi sarlavhalardan avtomatik mundarija yaratildi. Keyin sarlavhalardan biri tahrirlandi. Hujjatda Heading uslubini qo‘llashdan yangilangan mundarijani chiqarishgacha amallarni tartiblang.','{}'::jsonb,ARRAY[1,2,3,4]::integer[],'Sarlavhalarga Heading uslubi beriladi, avtomatik mundarija yaratiladi, sarlavha o‘zgartiriladi va mundarija Update Table bilan yangilanadi. Tartib: 1 → 2 → 3 → 4.'),
('OFF-W03-030','MS Wordda ma’lumotlar manbasi hali tayyorlanmagan, ammo qabul qiluvchilar uchun umumiy xat yaratish rejalashtirilgan. Ro‘yxatni tayyorlash, unga bog‘langan xat shablonini yaratish va Merge Fieldlar natijasini tekshirish tartibini belgilang.','{"3":"Tayyor ma’lumotlar manbasiga bog‘langan xat shablonini yaratish"}'::jsonb,ARRAY[2,4,3,1]::integer[],'Ma’lumotlar manbasi avval tayyorlanadi, keyin unga bog‘langan shablon yaratiladi. So‘ng Merge Field maydonlari kiritilib, Preview Results bilan tekshiriladi. Tartib: 2 → 4 → 3 → 1.');
DO $task385$
DECLARE
 c record;
 src public.questions%rowtype;
 rev_id uuid;
 new_ref text;
 src_payload jsonb;
 new_order jsonb;
 count_done integer:=0;
BEGIN
 IF (SELECT count(*) FROM task385_cases)<>9 THEN RAISE EXCEPTION 'TASK-385 expected 9 cases'; END IF;
 FOR c IN SELECT * FROM task385_cases ORDER BY code LOOP
  SELECT * INTO src FROM public.questions q
   WHERE q.group_code='S2.OFFICE' AND q.format='Y3'::public.question_format
    AND q.source_reference LIKE 'Office_2026_v2|%'
    AND split_part(q.source_reference,'|',2)=c.code FOR UPDATE;
  IF NOT FOUND OR src.stem_md NOT LIKE 'Amallarni to‘g‘ri ketma-ketlikda joylang.%'
    OR src.status NOT IN ('published'::public.content_status,'archived'::public.content_status)
    OR (SELECT count(*) FROM public.questions q WHERE q.source_reference LIKE 'Office_2026_v2|%' AND split_part(q.source_reference,'|',2)=c.code)<>1
  THEN RAISE EXCEPTION 'TASK-385 source drift %',c.code; END IF;
  new_ref:='revision:TASK-385:explicit-task-goal:'||src.id::text||' | '||src.source_reference;
  SELECT id INTO rev_id FROM public.questions WHERE source_reference=new_ref;
  IF rev_id IS NULL THEN
    SELECT k.payload INTO src_payload FROM public.question_keys k WHERE k.question_id=src.id;
    IF src.status<>'published'::public.content_status
      OR jsonb_typeof(src_payload->'order')<>'array'
      OR jsonb_array_length(src_payload->'order')<>4
      OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=src.id AND o.side='a')<>4
      OR array_length(c.ordered_indices,1)<>4
      OR (SELECT count(distinct x.val) FROM unnest(c.ordered_indices) x(val))<>4
      OR EXISTS (SELECT 1 FROM unnest(c.ordered_indices) x(val) WHERE x.val<1 OR x.val>4)
    THEN RAISE EXCEPTION 'TASK-385 Y3 key preflight failed %',c.code; END IF;
    rev_id:=gen_random_uuid();
    INSERT INTO public.questions(
      id,subject_id,construct_id,group_code,format,cognitive,difficulty,
      stem_md,assets,is_generated,status,author_id,created_at,updated_at,
      source_reference,source_lesson_id
    ) VALUES (
      rev_id,src.subject_id,src.construct_id,src.group_code,src.format,src.cognitive,
      src.difficulty,c.stem,src.assets,src.is_generated,'review'::public.content_status,
      src.author_id,now(),now(),new_ref,src.source_lesson_id
    );
    INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
    SELECT gen_random_uuid(),rev_id,o.side,o.order_idx,
       coalesce(c.replacements->>(o.order_idx::text),o.content_md)
    FROM public.question_options o WHERE o.question_id=src.id;
    SELECT jsonb_agg(to_jsonb(no.id::text) ORDER BY x.ord)
    INTO new_order FROM unnest(c.ordered_indices) WITH ORDINALITY x(pos,ord)
    JOIN public.question_options no ON no.question_id=rev_id AND no.side='a' AND no.order_idx=x.pos-1;
    IF jsonb_array_length(new_order)<>4
       OR (SELECT count(distinct z.value) FROM jsonb_array_elements_text(new_order) z)<>4
    THEN RAISE EXCEPTION 'TASK-385 remapping failed %',c.code; END IF;
    INSERT INTO public.question_keys(question_id,payload,explanation_md,updated_at)
    SELECT rev_id,jsonb_set(src_payload,'{order}',new_order,false),c.explanation,now()
    FROM public.question_keys k WHERE k.question_id=src.id;
    INSERT INTO public.question_bank_revisions(
       source_question_id,revision_question_id,revision_kind,evidence
    ) VALUES (
       src.id,rev_id,'clarify_generic_y3_task_goal',
       jsonb_build_object(
          'task','TASK-385','source_code',c.code,'owner_requested',true,
          'independent_human_review',false,'historical_attempts_changed',false,
          'option_contents_rewritten',c.replacements<>'{}'::jsonb,
          'answer_key_adjusted',c.code='OFF-E02-030'
       )
    );
    UPDATE public.questions SET status='published'::public.content_status,updated_at=now()
    WHERE id=rev_id AND status='review'::public.content_status;
    UPDATE public.questions SET status='archived'::public.content_status,updated_at=now()
    WHERE id=src.id AND status='published'::public.content_status;
  END IF;
  IF (SELECT q.status FROM public.questions q WHERE q.id=src.id)<>'archived'::public.content_status
     OR (SELECT q.status FROM public.questions q WHERE q.id=rev_id)<>'published'::public.content_status
     OR (SELECT q.stem_md FROM public.questions q WHERE q.id=rev_id)<>c.stem
     OR NOT EXISTS(
       SELECT 1 FROM public.question_quality_published_revisions pr
       WHERE pr.question_id=rev_id
         AND pr.content_fingerprint=public.professional_question_fingerprint(rev_id)
     )
  THEN RAISE EXCEPTION 'TASK-385 postflight failed %',c.code; END IF;
  UPDATE public.question_quality_published_revisions
    SET release_scope='TASK-385 owner-requested Y3 goal clarification; AI reviewed, not independently human certified'
    WHERE question_id=rev_id;
  INSERT INTO public.question_quality_findings(
    question_id,finding_code,severity,details,resolved_at
  ) VALUES (
    src.id,'generic_sequence_goal_review','medium',
    jsonb_build_object('task','TASK-385','replacement_question_id',rev_id,'screening_only',false),now()
  ) ON CONFLICT (question_id,finding_code) DO UPDATE
     SET resolved_at=excluded.resolved_at,details=excluded.details;
  count_done:=count_done+1;
 END LOOP;
 IF count_done<>9
   OR (SELECT count(*) FROM public.questions q WHERE q.group_code='S2.OFFICE'
       AND q.format='Y3' AND q.status='published'
       AND (q.stem_md LIKE 'Berilgan vazifani%' OR q.stem_md LIKE 'Amallarni to‘g‘ri ketma-ketlikda joylang.%'))<>0
 THEN RAISE EXCEPTION 'TASK-385 remaining generic Office Y3 stems'; END IF;
END
$task385$;
COMMIT;
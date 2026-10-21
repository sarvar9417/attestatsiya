-- TASK-383: owner-requested semantic remediation of final six Office Y3
-- items. Rewritten scenarios + dependent steps, with two objectively wrong
-- legacy keyed orders corrected. Original attempted question versions are archived.
-- AI checked; no independent human reviewer is claimed.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='120s';
CREATE TEMP TABLE task383_cases(
  code text PRIMARY KEY, stem text NOT NULL,
  replacements jsonb NOT NULL, ordered_indices integer[] NOT NULL,
  explanation text NOT NULL
) ON COMMIT DROP;
INSERT INTO task383_cases VALUES
('OFF-E01-017','MS Excelda B2 katagiga 0.25 qiymatini kiritib, uni foiz formatida 25% ko‘rinishida chiqarish kerak. Katakni tanlashdan yakuniy natijani tekshirishgacha amallarni tartiblang.','{}'::jsonb,ARRAY[3,4,2,1]::integer[],'Birinchi navbatda B2 katagi tanlanadi, unga 0.25 qiymati kiritiladi, Percentage formatiga o‘tkaziladi va natija 25% ekanligi tekshiriladi. To‘g‘ri tartib: 3 → 4 → 2 → 1. Avvalgi 4 → 3 ketma-ketligi xato edi.'),
('OFF-E02-005','MS Excelda C3 katakka =A1+$B$2 formula yozilib, u D5 katakka ko‘chiriladi. Nisbiy A1 havolasi B3 ga o‘tishi, mutlaq $B$2 havolasi esa o‘zgarmasligi kerak. Ko‘chirilgan formulani =B3+$B$2 tarzida olish uchun amallarni tartiblang.','{"1":"$B$2 mutlaq havolasi o‘zgarmaganini tekshirib, yakuniy formulani yozish","2":"Nisbiy A1 havolasini B3 ga o‘zgartirish","3":"C3 dan D5 gacha siljish (+1 ustun, +2 satr) ekanini aniqlash"}'::jsonb,ARRAY[1,4,3,2]::integer[],'Avval C3 dagi boshlang‘ich formula yoziladi. C3 dan D5 ga ko‘chish +1 ustun va +2 satr siljishdir. Shu sabab A1 nisbiy havolasi B3 ga o‘tadi, $B$2 esa mutlaq bo‘lgani uchun saqlanadi. Natija: =B3+$B$2. Tartib: 1 → 4 → 3 → 2.'),
('OFF-P02-028','PowerPoint slaydiga video joylashtirildi. Video faqat kerakli qismi ijro etilishi uchun Playback menyusidagi Trim Video oynasida boshi va oxiri qisqartirilishi, so‘ng Slide Showda tekshirilishi kerak. Amallarni tartiblang.','{"1":"Playback bo‘limidan Trim Video oynasini ochish","3":"Videoning keraksiz qismlarini Trim Video oynasida qisqartirish"}'::jsonb,ARRAY[3,2,4,1]::integer[],'Avval video slaydga joylashtiriladi, so‘ng Playback bo‘limidan Trim Video oynasi ochiladi. Unda ijro etiladigan segment chegaralari belgilanib, namoyishda tekshiriladi. Tartib: 3 → 2 → 4 → 1.'),
('OFF-W01-028','MS Word hujjatida Track Changes orqali ko‘rsatilgan tahrirlar mavjud. Yakuniy hujjatni PDF shaklida tarqatishdan oldin o‘zgarishlarni qabul qilish, hujjatni tekshirish va eksport qilish kerak. Amallarni tartiblang.','{}'::jsonb,ARRAY[2,3,1,4]::integer[],'Yakuniy nusxa uchun avval kerakli tahrirlar qabul qilinadi, keyin hujjat tekshiriladi. Shundan so‘ng PDFga eksport qilinadi va tayyor PDFdagi sahifalar tekshiriladi. Tartib: 2 → 3 → 1 → 4. Eski 3 → 2 ketma-ketligi xato edi.'),
('OFF-W02-011','MS Word hujjatidagi bitta abzasni o‘ngga tekislab, qator oralig‘ini 1,5 ga o‘rnatish kerak. Abzasni belgilash, Paragraph boshqaruvini ochish, sozlash va tekshirish amallarini tartiblang.','{"2":"Abzasni o‘ngga tekislab, qatorlar oralig‘ini 1,5 ga o‘rnatish","3":"Home menyusida Paragraph sozlamalarini ochish"}'::jsonb,ARRAY[2,4,3,1]::integer[],'Avval abzas belgilanadi, Home menyusidan Paragraph sozlamalari ochiladi, kerakli o‘ngga tekislash va 1,5 qator oralig‘i o‘rnatiladi, so‘ng ko‘rinish tekshiriladi. Tartib: 2 → 4 → 3 → 1.'),
('OFF-W03-023','MS Wordda asosiy xat matni oldindan tayyorlangan, lekin qabul qiluvchilar ro‘yxati hali yo‘q. Mail Merge orqali har bir kishining ma’lumotlari kiritiladigan xatlarni tayyorlash uchun ro‘yxatni yaratish, shablonga ulash, maydonlarni joylashtirish va ko‘rib chiqish amallarini tartiblang.','{"2":"Yaratilgan qabul qiluvchilar ro‘yxatini tayyor xat shabloniga ulash"}'::jsonb,ARRAY[4,3,1,2]::integer[],'Oldin qabul qiluvchilar ro‘yxati yaratiladi, u tayyor asosiy xat shabloniga ulanadi, Merge Field maydonlari kiritiladi va Preview Results orqali shaxsiylashtirish tekshiriladi. Tartib: 4 → 3 → 1 → 2.');

DO $t383$
DECLARE
  item record;
  src public.questions%rowtype;
  rev_id uuid;
  ref text;
  new_order jsonb;
  source_key jsonb;
  v_total int:=0;
BEGIN
  IF (SELECT count(*) FROM task383_cases)<>6 THEN
    RAISE EXCEPTION 'TASK-383 mappings must contain 6 items'; END IF;

  FOR item IN SELECT * FROM task383_cases ORDER BY code LOOP
    SELECT * INTO src FROM questions q
    WHERE q.group_code='S2.OFFICE'
      AND q.format='Y3'::public.question_format
      AND q.source_reference LIKE 'Office_2026_v2|%'
      AND split_part(q.source_reference,'|',2)=item.code
    FOR UPDATE;
    IF NOT FOUND
       OR src.stem_md NOT LIKE 'Berilgan vazifani to‘g‘ri bajarish%'
       OR src.status NOT IN ('published'::public.content_status,'archived'::public.content_status)
       OR (SELECT count(*) FROM questions q
           WHERE q.source_reference LIKE 'Office_2026_v2|%'
             AND split_part(q.source_reference,'|',2)=item.code)<>1
    THEN RAISE EXCEPTION 'TASK-383 original source missing or drifted: %',item.code; END IF;

    ref := 'revision:TASK-383:y3-semantic-repair:' || src.id::text || ' | ' || src.source_reference;
    SELECT id INTO rev_id FROM questions WHERE source_reference=ref;

    IF rev_id IS NULL THEN
      IF src.status<>'published'::public.content_status
         OR (SELECT count(*) FROM question_options WHERE question_id=src.id AND side='a')<>4
         OR array_length(item.ordered_indices,1)<>4
         OR (SELECT count(distinct n) FROM unnest(item.ordered_indices) AS x(n))<>4
         OR EXISTS(SELECT 1 FROM unnest(item.ordered_indices) AS x(n) WHERE n<1 OR n>4)
      THEN RAISE EXCEPTION 'TASK-383 invalid key or status %',item.code; END IF;
      SELECT k.payload INTO source_key FROM question_keys k WHERE k.question_id=src.id;
      IF jsonb_typeof(source_key->'order')<>'array'
         OR jsonb_array_length(source_key->'order')<>4
      THEN RAISE EXCEPTION 'TASK-383 source key invalid %',item.code; END IF;

      rev_id:=gen_random_uuid();
      INSERT INTO questions(
        id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
        assets,is_generated,status,author_id,created_at,updated_at,
        source_reference,source_lesson_id
      ) VALUES (
        rev_id,src.subject_id,src.construct_id,src.group_code,src.format,
        src.cognitive,src.difficulty,item.stem,src.assets,src.is_generated,
        'review'::public.content_status,src.author_id,now(),now(),ref,src.source_lesson_id
      );
      INSERT INTO question_options(id,question_id,side,order_idx,content_md)
      SELECT gen_random_uuid(),rev_id,o.side,o.order_idx,
        coalesce(item.replacements->>(o.order_idx::text),o.content_md)
      FROM question_options o WHERE o.question_id=src.id;
      SELECT jsonb_agg(to_jsonb(no.id::text) ORDER BY x.ord)
      INTO new_order
      FROM unnest(item.ordered_indices) WITH ORDINALITY AS x(pos,ord)
      JOIN question_options no ON no.question_id=rev_id
        AND no.side='a' AND no.order_idx=(x.pos-1);
      IF new_order IS NULL OR jsonb_array_length(new_order)<>4
         OR (SELECT count(distinct y.value) FROM jsonb_array_elements_text(new_order) y)<>4
      THEN RAISE EXCEPTION 'TASK-383 Y3 answer-key mapping failed %',item.code; END IF;
      INSERT INTO question_keys(question_id,payload,explanation_md,updated_at)
      SELECT rev_id,jsonb_set(source_key,'{order}',new_order,false),item.explanation,now()
      FROM question_keys k WHERE k.question_id=src.id;
      INSERT INTO question_bank_revisions(
        source_question_id,revision_question_id,revision_kind,evidence
      ) VALUES (
        src.id,rev_id,'correct_y3_task_and_chronology',
        jsonb_build_object(
          'task','TASK-383','source_code',item.code,
          'owner_requested',true,'independent_human_review',false,
          'key_corrected',item.code IN ('OFF-E01-017','OFF-W01-028'),
          'options_rewritten',item.replacements<>'{}'::jsonb,
          'old_attempts_preserved',true
        )
      );
      UPDATE questions SET status='published'::public.content_status,updated_at=now()
        WHERE id=rev_id AND status='review'::public.content_status;
      UPDATE questions SET status='archived'::public.content_status,updated_at=now()
        WHERE id=src.id AND status='published'::public.content_status;
    END IF;
    IF (SELECT status FROM questions WHERE id=src.id)<>'archived'::public.content_status
       OR (SELECT status FROM questions WHERE id=rev_id)<>'published'::public.content_status
       OR (SELECT stem_md FROM questions WHERE id=rev_id)<>item.stem
       OR (SELECT explanation_md FROM question_keys WHERE question_id=rev_id)<>item.explanation
       OR NOT EXISTS (
         SELECT 1 FROM question_quality_published_revisions snap
         WHERE snap.question_id=rev_id
           AND snap.content_fingerprint=public.professional_question_fingerprint(rev_id)
       )
    THEN RAISE EXCEPTION 'TASK-383 release validation failed %',item.code; END IF;
    UPDATE question_quality_published_revisions
      SET release_scope='TASK-383 owner-requested Y3 semantic repair; AI reviewed, not independently human certified'
    WHERE question_id=rev_id;
    UPDATE question_quality_findings
      SET resolved_at=now(),
          details=details||jsonb_build_object(
            'task','TASK-383','replacement_question_id',rev_id,
            'key_corrected',item.code IN ('OFF-E01-017','OFF-W01-028')
          )
    WHERE question_id=src.id AND finding_code='generic_sequence_goal_review';
    v_total:=v_total+1;
  END LOOP;
  IF v_total<>6
     OR (SELECT count(*) FROM questions q
         WHERE q.group_code='S2.OFFICE' AND q.format='Y3'
           AND q.status='published' AND q.stem_md LIKE 'Berilgan vazifani%')<>0
     OR (SELECT count(*) FROM question_quality_findings f
         WHERE f.finding_code='generic_sequence_goal_review' AND f.resolved_at IS NULL)<>0
  THEN RAISE EXCEPTION 'TASK-383 expected 0 remaining Office Y3 generic stems'; END IF;
END
$t383$;
COMMIT;
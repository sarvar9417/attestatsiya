-- TASK-382: restore 38 explicit Y3 task contexts in immutable revisions.
-- Owner requested language quality fixes; original question IDs and historical
-- exam records remain intact. No independent expert signoff is claimed.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='180s';
CREATE TEMP TABLE task382_stems(
  code text PRIMARY KEY, new_stem text NOT NULL
) ON COMMIT DROP;
INSERT INTO task382_stems(code,new_stem) VALUES
('OFF-E01-005','MS Excelda yangi ish kitobini yaratib, ustun sarlavhalari va qiymatlarni kiritish hamda faylni XLSX formatida saqlash uchun amallarni tartiblang.'),
('OFF-E01-011','MS Excelda jadvalning birinchi katagidan oxirgi katagigacha bo‘lgan diapazonga yagona chegara formati qo‘llash kerak. Diapazonni aniqlash, belgilash va formatlash amallarini tartiblang.'),
('OFF-E01-023','MS Excel jadvalidagi sarlavha satri pastga aylantirganda ham ko‘rinib turishi kerak. Freeze Panes yordamida sozlash va natijani tekshirish amallarini tartiblang.'),
('OFF-E01-028','Excel ish kitobidagi Sheet1 varag‘i nomini “Natijalar” deb o‘zgartirib, muvaffaqiyatli bajarilganini tasdiqlash amallarini tartiblang.'),
('OFF-E02-011','MS Excel katagiga hisoblash formulasi kiritildi. Qavslar va arifmetik amallar ustuvorligiga rioya qilib hisob natijasini topish va tekshirish jarayonini tartiblang.'),
('OFF-E02-017','MS Excel formulasi xatolik kodini qaytardi. Xatoning sababini havola yoki bo‘luvchidan qidirib, formulani tuzatish va natijani qayta tekshirish bosqichlarini tartiblang.'),
('OFF-E02-023','Excel jadvalidagi narxlarga bitta katakda saqlangan soliq stavkasi qo‘llanadi. Stavkani mutlaq havola orqali barcha satrlarga qo‘llash ishlarini tartiblang.'),
('OFF-E02-028','MS Excel jadvalidagi birinchi satr formulasini Fill Handle bilan pastga ko‘chirib, barcha natijalarni tekshirish uchun amallarni tartiblang.'),
('OFF-E03-005','O‘quvchilarning ballari yozilgan Excel diapazoni uchun AVERAGE funksiyasida o‘rtacha qiymatni hisoblash va tekshirish amallarini tartiblang.'),
('OFF-E03-011','Excelda ballga ko‘ra shart rost bo‘lganda bitta, yolg‘on bo‘lganda boshqa natija chiqaruvchi IF formulasini tuzib, ikki xil qiymatda sinash amallarini tartiblang.'),
('OFF-E03-017','Excel jadvalidagi belgilangan ustunda berilgan mezonga mos kataklar sonini COUNTIF bilan hisoblab, natijani tekshirish bosqichlarini tartiblang.'),
('OFF-E03-023','MS Excelda matn yozilgan katakdagi belgilarning boshidan kerakli miqdorini LEFT funksiyasi bilan ajratib olish va tekshirish amallarini tartiblang.'),
('OFF-E03-028','MS Excelda mahsulot kodi bo‘yicha jadvaldan narxni faqat aniq moslik asosida qaytaruvchi VLOOKUP formulasining argumentlarini mantiqiy ketma-ketlikda tuzing.'),
('OFF-E04-005','MS Excel jadvalidagi faqat belgilangan mezonga mos satrlarni ko‘rsatish uchun Data Filter qo‘llash va ko‘rinib qolgan satrlarni tekshirish amallarini tartiblang.'),
('OFF-E04-011','MS Excelda bir necha davrdagi ko‘rsatkichlarning o‘zgarishini chiziqli diagrammada aks ettirib, o‘qlar va sarlavhani nomlash amallarini tartiblang.'),
('OFF-E04-017','MS Excelda ball kiritiladigan kataklarga 0 dan 100 gacha qiymatlarni qabul qiluvchi Data Validation cheklovi qo‘yish va uni sinash amallarini tartiblang.'),
('OFF-E04-023','MS Excelda ma’lumotlar jadvalini tanlangan ustun bo‘yicha o‘sish tartibida saralab, barcha ustunlar bir qatorda qolganini tekshirish amallarini tartiblang.'),
('OFF-E04-028','Excel formulasining to‘g‘riligini tekshirish uchun modelga sinov qiymatlarini kiritib, qo‘lda hisoblangan natija bilan solishtirish va zarur bo‘lsa tuzatish amallarini tartiblang.'),
('OFF-P01-005','Muayyan auditoriyaga mo‘ljallangan PowerPoint taqdimotini ishlab chiqishda auditoriya, mazmun rejasi, slayd maketlari va obyektlarni joylashtirish ishlarini tartiblang.'),
('OFF-P01-011','PowerPoint taqdimotidagi barcha slaydlarda bir xil logotip ko‘rinishi uchun uni Slide Master orqali kiritish va natijani tekshirish amallarini tartiblang.'),
('OFF-P01-017','PowerPoint slaydiga rasm qo‘shib, uning o‘lchamini moslash, Align orqali tekislash va namoyishda tekshirish jarayonini tartiblang.'),
('OFF-P01-023','PowerPoint taqdimotidagi menyu obyektidan ma’lum slaydga o‘tuvchi ichki gipermurojaat yaratish va uni namoyishda tekshirish amallarini tartiblang.'),
('OFF-P01-028','PowerPoint taqdimotiga videofayl joylashtirib, Playback boshlanish sozlamasini tanlash va boshqa kompyuterda ishlashini tekshirish amallarini tartiblang.'),
('OFF-P02-005','PowerPoint slaydidagi obyektga Entrance animatsiyasi qo‘shib, Preview orqali natijani ko‘rish uchun bajariladigan amallarni tartiblang.'),
('OFF-P02-011','PowerPoint slaydiga almashinish (Transition) effektini berib, Duration vaqtini sozlash va almashinishni tekshirish amallarini tartiblang.'),
('OFF-P02-017','PowerPoint taqdimotidagi ikkita obyekt animatsiyasining boshlanish usuli va ketma-ketligini Animation Pane yordamida sozlab, namoyishda tekshirish tartibini belgilang.'),
('OFF-P02-023','PowerPoint taqdimotidagi slaydlar belgilangan vaqt oralig‘ida avtomatik almashishi kerak. Shu vaqtni barcha slaydlarga tatbiq qilib, Slide Showda tekshirish amallarini tartiblang.'),
('OFF-W01-005','MS Wordda yangi matnli hujjat yaratib, matn kiritish va uni DOCX formatida saqlash uchun amallarni tartiblang.'),
('OFF-W01-011','MS Word hujjatida takrorlangan iborani boshqa ibora bilan almashtirishdan oldin kerakli matnni topish va tekshirish, so‘ng Replace bajarish amallarini tartiblang.'),
('OFF-W01-017','MS Word hujjatidagi oxirgi tahrir xato bajarilgan. Uni Ctrl+Z bilan bekor qilib, natijani tekshirish va to‘g‘ri nusxasini saqlash amallarini tartiblang.'),
('OFF-W01-023','MS Wordda asl hujjatni saqlab qolib, alohida nusxa ustida tahrir qilish va natijani tekshirish amallarini tartiblang.'),
('OFF-W02-005','MS Word hujjatida bo‘lim sarlavhalari asosida avtomatik mundarija yaratish kerak. Matnni tayyorlash, sarlavhaga uslub qo‘llash va mundarija hosil qilish amallarini tartiblang.'),
('OFF-W02-017','MS Word hujjatining faqat o‘rtadagi jadval joylashgan bo‘limi Landscape, boshqa sahifalari Portrait bo‘lishi kerak. Section Break orqali ushbu bo‘limni ajratish va orientatsiyasini o‘zgartirish amallarini tartiblang.'),
('OFF-W02-023','MS Word hujjatining birinchi sahifasida kolontitul boshqacha bo‘lishi, qolgan sahifalarda esa sahifa raqamlari to‘g‘ri ko‘rinishi kerak. Different First Page rejimini sozlash va tekshirish amallarini tartiblang.'),
('OFF-W02-028','MS Word hujjatida avtomatik mundarija mavjud. Bo‘lim sarlavhasi o‘zgarganidan keyin mundarijada yangilangan nom ko‘rinishi uchun amallarni tartiblang.'),
('OFF-W03-005','MS Wordda jadval hosil qilib, kataklarga matn kiritilganidan keyin sarlavha uchun tegishli kataklarni birlashtirish kerak. Shu ishning amallarini ketma-ket joylashtiring.'),
('OFF-W03-011','MS Word hujjatiga rasm qo‘shib, Wrap Text rejimi yordamida matnga nisbatan joylashuvini sozlash, rasmni ko‘chirish va natijani tekshirish amallarini tartiblang.'),
('OFF-W03-017','MS Word hujjatining kerakli joyiga Insert Equation yordamida matematik ifoda kiritib, natijani tekshirish uchun amallarni tartiblang.');
DO $t382$
DECLARE
  r record;
  src public.questions%rowtype;
  revision_id uuid;
  new_reference text;
  old_payload jsonb;
  new_order jsonb;
  v_count integer:=0;
BEGIN
  -- Full Office_2026_v2 corpus is a live import, not a fresh-CI bootstrap seed.
  -- Skip only if the whole source bank is absent. Partial/imported drift fails closed.
  IF NOT EXISTS (SELECT 1 FROM public.questions q
                 WHERE q.source_reference LIKE 'Office_2026_v2|%') THEN
    RAISE NOTICE 'TASK-382 Office_2026_v2 source bank absent: defer 38 revisions';
    RETURN;
  END IF;
  IF (SELECT count(*) FROM task382_stems)<>38 THEN
    RAISE EXCEPTION 'TASK-382 expected exactly 38 case-reviewed goal rewrites';
  END IF;
  FOR r IN SELECT * FROM task382_stems ORDER BY code LOOP
    SELECT * INTO src FROM public.questions q
    WHERE q.group_code='S2.OFFICE'
      AND q.format='Y3'::public.question_format
      AND q.source_reference LIKE 'Office_2026_v2|%'
      AND split_part(q.source_reference,'|',2)=r.code
    FOR UPDATE;
    IF NOT FOUND
       OR src.stem_md NOT LIKE 'Berilgan vazifani to‘g‘ri bajarish%'
       OR src.status NOT IN ('published'::public.content_status,'archived'::public.content_status)
       OR (SELECT count(*) FROM public.questions q
           WHERE q.source_reference LIKE 'Office_2026_v2|%'
             AND split_part(q.source_reference,'|',2)=r.code)<>1
    THEN
      RAISE EXCEPTION 'TASK-382 source drift for %',r.code;
    END IF;
    new_reference:='revision:TASK-382:explicit-y3-goal:' || src.id::text || ' | ' || src.source_reference;
    SELECT id INTO revision_id FROM public.questions WHERE source_reference=new_reference;
    IF revision_id IS NULL THEN
      IF src.status<>'published'::public.content_status THEN
        RAISE EXCEPTION 'TASK-382 source already archived without its revision: %',r.code;
      END IF;
      SELECT k.payload INTO old_payload FROM public.question_keys k WHERE k.question_id=src.id;
      IF jsonb_typeof(old_payload->'order')<>'array'
         OR jsonb_array_length(old_payload->'order')<>4
         OR (SELECT count(*) FROM question_options o
             WHERE o.question_id=src.id AND o.side='a')<>4
         OR EXISTS(
           SELECT 1 FROM jsonb_array_elements_text(old_payload->'order') v
           WHERE NOT EXISTS(SELECT 1 FROM question_options o
             WHERE o.question_id=src.id AND o.id::text=v.value)
         )
         OR (SELECT count(distinct e.value) FROM jsonb_array_elements_text(old_payload->'order') e)<>4
      THEN RAISE EXCEPTION 'TASK-382 invalid existing Y3 key/options: %',r.code; END IF;
      revision_id:=gen_random_uuid();
      INSERT INTO public.questions(
        id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
        assets,is_generated,status,author_id,created_at,updated_at,source_reference,source_lesson_id
      ) VALUES (
        revision_id,src.subject_id,src.construct_id,src.group_code,src.format,
        src.cognitive,src.difficulty,r.new_stem,src.assets,src.is_generated,
        'review'::public.content_status,src.author_id,now(),now(),new_reference,src.source_lesson_id
      );
      INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
      SELECT gen_random_uuid(),revision_id,o.side,o.order_idx,o.content_md
      FROM public.question_options o WHERE o.question_id=src.id;
      SELECT jsonb_agg(to_jsonb(no.id::text) ORDER BY x.ordinality)
      INTO new_order
      FROM jsonb_array_elements_text(old_payload->'order') WITH ORDINALITY x(old_id,ordinality)
      JOIN public.question_options oo ON oo.id::text=x.old_id AND oo.question_id=src.id
      JOIN public.question_options no ON no.question_id=revision_id
        AND no.side=oo.side AND no.order_idx=oo.order_idx AND no.content_md=oo.content_md;
      IF new_order IS NULL OR jsonb_array_length(new_order)<>4
         OR (SELECT count(distinct y.value) FROM jsonb_array_elements_text(new_order) y)<>4
      THEN RAISE EXCEPTION 'TASK-382 cloned Y3 order failed for %',r.code; END IF;
      INSERT INTO public.question_keys(question_id,payload,explanation_md,updated_at)
      SELECT revision_id,jsonb_set(old_payload,'{order}',new_order,false),k.explanation_md,now()
      FROM public.question_keys k WHERE k.question_id=src.id;
      INSERT INTO public.question_bank_revisions(
        source_question_id,revision_question_id,revision_kind,evidence
      ) VALUES (
        src.id,revision_id,'clarify_generic_y3_task_goal',
        jsonb_build_object(
          'task','TASK-382','source_code',r.code,'owner_requested',true,
          'independent_human_review',false,
          'answer_semantics_changed',false,'option_contents_changed',false,
          'historical_attempts_changed',false
        )
      );
      UPDATE public.questions
        SET status='published'::public.content_status,updated_at=now()
      WHERE id=revision_id AND status='review'::public.content_status;
      UPDATE public.questions
        SET status='archived'::public.content_status,updated_at=now()
      WHERE id=src.id AND status='published'::public.content_status;
    END IF;
    IF (SELECT q.stem_md FROM public.questions q WHERE q.id=revision_id)<>r.new_stem
       OR (SELECT q.status FROM public.questions q WHERE q.id=revision_id)<>'published'::public.content_status
       OR (SELECT q.status FROM public.questions q WHERE q.id=src.id)<>'archived'::public.content_status
       OR NOT EXISTS(
         SELECT 1 FROM public.question_quality_published_revisions snap
         WHERE snap.question_id=revision_id
           AND snap.content_fingerprint=public.professional_question_fingerprint(revision_id)
       )
    THEN RAISE EXCEPTION 'TASK-382 published immutable revision validation failed for %',r.code; END IF;
    UPDATE public.question_quality_published_revisions
      SET release_scope='TASK-382 owner-requested Y3 explicit goal clarification; AI reviewed, not independently human certified'
    WHERE question_id=revision_id;
    UPDATE public.question_quality_findings
      SET resolved_at=now(),
          details=details||jsonb_build_object('replacement_question_id',revision_id,'task','TASK-382')
    WHERE question_id=src.id AND finding_code='generic_sequence_goal_review';
    v_count:=v_count+1;
  END LOOP;
  IF v_count<>38
     OR (SELECT count(*) FROM public.questions q
           WHERE q.group_code='S2.OFFICE' AND q.format='Y3'
             AND q.status='published' AND q.stem_md LIKE 'Berilgan vazifani%')<>6
  THEN RAISE EXCEPTION 'TASK-382 final QA release count inconsistent'; END IF;
END
$t382$;
COMMIT;
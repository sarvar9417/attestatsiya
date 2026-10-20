-- TASK-306: seven source-grounded four-by-five Y2 candidate revisions.
-- All candidate items stay REVIEW; published questions, attempts and scoring
-- stay untouched. Original private pair payload is mapped inside PostgreSQL;
-- no pre-exam correct mapping or UUID answer keys are committed to Git.
BEGIN;
DO $task306$
DECLARE
  item jsonb;
  v_old public.questions%ROWTYPE;
  v_old_key public.question_keys%ROWTYPE;
  v_new_id uuid;
  v_old_opt record;
  v_new_opt uuid;
  v_map jsonb;
  v_new_pairs jsonb;
  v_pos int;
  v_ch int;
  v_source text;
  v_revision text;
  v_bad int;
  v_count int;
BEGIN
  FOR item IN SELECT value FROM jsonb_array_elements($payload$[{"chapter":1,"ref":"AXRN-01-Y2-01","slug":"m13-axr-01","extra":"Foydalanuvchi o‘z shaxsini ikkinchi omil bilan tasdiqlaydi","basis":"11-sinf ICT 2021, axborot xavfsizligi: CIA/maxfiylik-yaxlitlik-mavjudlik, PDF pp.257-260; 2026 spec 7. mavzu"},{"chapter":2,"ref":"AXRN-02-Y2-01","slug":"m13-axr-02","extra":"Fayllarni shifrlab, ochib berish uchun to‘lov talab qilishi mumkin","basis":"11-sinf ICT 2021, zararli dasturlar va antivirus; 2026 spec 7. mavzu"},{"chapter":3,"ref":"AXRN-03-Y2-01","slug":"m13-axr-03","extra":"Zararli kod signaturalari bazasini eng so‘nggi versiyaga yangilash","basis":"Cambridge+ 8-sinf, tarmoq xavfsizligi va zararli dasturlarga qarshi vositalar, PDF pp.104-106; 2026 spec 7. mavzu"},{"chapter":4,"ref":"AXRN-04-Y2-01","slug":"m13-axr-04","extra":"Elektron hujjat muallifining raqamli imzosini tekshirish","basis":"11-sinf ICT 2021, elektron hukumat 65-dars, PDF p.311 et seq; 2026 spec 7. mavzu"},{"chapter":5,"ref":"AXRN-05-Y2-01","slug":"m13-axr-05","extra":"Mijozlar bilan munosabatlar va savdo bitimlarini boshqarish tizimi","basis":"2026 spec CMS/LMS/MOOC/SMM; UNESCO online learning glossary LMS/MOOC"},{"chapter":6,"ref":"AXRN-06-Y2-01","slug":"m13-axr-06","extra":"Materialning mualliflik huquqi va foydalanish litsenziyasini belgilash","basis":"2026 spec kontent va auditoriya; 8-sinf raqamli texnologiyalar kontent mavzulari"},{"chapter":7,"ref":"AXRN-07-Y2-01","slug":"m13-axr-07","extra":"Buyurtmachi mablag‘ini shart bajarilguncha vositachida saqlash","basis":"2026 spec web-freelance; 8-sinf informatika freelance mavzusi"}]$payload$::jsonb)
  LOOP
    v_ch:=(item->>'chapter')::int;
    v_source:='m13-axr-native-v1:Y2:' || (item->>'ref');
    v_revision:='m13-qc-v2:Y2:' || (item->>'ref');
    IF v_ch NOT BETWEEN 1 AND 7 OR
      (item->>'ref') NOT LIKE ('AXRN-'||lpad(v_ch::text,2,'0')||'-Y2-01')
    THEN RAISE EXCEPTION 'TASK-306 inconsistent chapter/ID'; END IF;

    SELECT q.* INTO STRICT v_old FROM public.questions q
       JOIN public.lessons l ON l.id=q.source_lesson_id
       JOIN public.modules m ON m.id=l.module_id
       WHERE q.source_reference=v_source
         AND q.format='Y2'::public.question_format
         AND q.status='published'::public.content_status
         AND m.code='M13' AND l.slug=item->>'slug';

    SELECT k.* INTO STRICT v_old_key FROM public.question_keys k
       WHERE k.question_id=v_old.id;

    IF (SELECT count(*) FROM public.question_options o
      WHERE o.question_id=v_old.id AND o.side='a') <>4 OR
       (SELECT count(*) FROM public.question_options o
      WHERE o.question_id=v_old.id AND o.side='b')<>4 OR
       jsonb_typeof(v_old_key.payload->'pairs')<>'object' OR
       (SELECT count(*) FROM jsonb_each_text(v_old_key.payload->'pairs'))<>4
    THEN RAISE EXCEPTION 'TASK-306 old Y2 contract changed for %',v_source; END IF;

    SELECT count(*) INTO v_bad FROM public.question_options o
      WHERE o.question_id=v_old.id
      AND lower(btrim(o.content_md))=lower(btrim(item->>'extra'));
    IF v_bad<>0 THEN RAISE EXCEPTION 'TASK-306 extra option duplicates existing text: %',v_source; END IF;

    SELECT q.id INTO v_new_id FROM public.questions q
      WHERE q.source_reference=v_revision;
    IF v_new_id IS NULL THEN
      v_new_id:=gen_random_uuid();
      INSERT INTO public.questions(
        id,subject_id,construct_id,group_code,format,cognitive,difficulty,
        stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id
      ) SELECT v_new_id,subject_id,construct_id,group_code,format,cognitive,
        least(5,greatest(difficulty,3)),stem_md,assets,is_generated,
        'review'::public.content_status,author_id,v_revision,source_lesson_id
      FROM public.questions WHERE id=v_old.id;

      v_map:='{}'::jsonb;
      v_pos:=5+((v_ch-1)%5);
      FOR v_old_opt IN SELECT o.id,o.side,o.content_md,o.order_idx
        FROM public.question_options o
        WHERE o.question_id=v_old.id ORDER BY o.order_idx
      LOOP
        v_new_opt:=gen_random_uuid();
        v_map:=v_map||jsonb_build_object(v_old_opt.id::text,v_new_opt::text);
        INSERT INTO public.question_options (id,question_id,side,content_md,order_idx)
        VALUES(v_new_opt,v_new_id,v_old_opt.side,v_old_opt.content_md,
            CASE WHEN v_old_opt.side='b' AND v_old_opt.order_idx>=v_pos
                 THEN v_old_opt.order_idx+1 ELSE v_old_opt.order_idx END);
      END LOOP;
      INSERT INTO public.question_options (id,question_id,side,content_md,order_idx)
      VALUES (gen_random_uuid(),v_new_id,'b',item->>'extra',v_pos);

      SELECT jsonb_object_agg(v_map->>kv.key,v_map->>kv.value) INTO v_new_pairs
      FROM jsonb_each_text(v_old_key.payload->'pairs') kv;
      IF v_new_pairs IS NULL OR
        (SELECT count(*) FROM jsonb_each_text(v_new_pairs))<>4
      THEN RAISE EXCEPTION 'TASK-306 new private mapping missing'; END IF;
      INSERT INTO public.question_keys (question_id,payload,explanation_md)
      VALUES (v_new_id,jsonb_build_object('pairs',v_new_pairs),v_old_key.explanation_md);
    END IF;

    IF NOT EXISTS(
      SELECT 1 FROM public.questions n
      JOIN public.question_keys k ON k.question_id=n.id
      WHERE n.id=v_new_id
        AND n.status='review'::public.content_status
        AND n.source_lesson_id=v_old.source_lesson_id
        AND n.construct_id=v_old.construct_id
        AND n.format='Y2'::public.question_format
        AND (SELECT count(*) FROM public.question_options o
             WHERE o.question_id=n.id AND o.side='a')=4
        AND (SELECT count(*) FROM public.question_options o
             WHERE o.question_id=n.id AND o.side='b')=5
        AND jsonb_typeof(k.payload->'pairs')='object'
        AND (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs'))=4
        AND NOT EXISTS(
            SELECT 1 FROM jsonb_each_text(k.payload->'pairs') kv
            WHERE NOT EXISTS(SELECT 1 FROM public.question_options o
                 WHERE o.question_id=n.id AND o.id::text=kv.key AND o.side='a')
               OR NOT EXISTS(SELECT 1 FROM public.question_options o
                 WHERE o.question_id=n.id AND o.id::text=kv.value AND o.side='b')
        )
    ) THEN RAISE EXCEPTION 'TASK-306 revision shape/keys failure %',v_revision; END IF;
  END LOOP;

  SELECT count(*) INTO v_count FROM public.questions q
    WHERE q.source_reference~'^m13-qc-v2:Y2:AXRN-0[1-7]-Y2-01$'
      AND q.status='review'::public.content_status;
  IF v_count<>7 THEN RAISE EXCEPTION 'TASK-306 expected seven review Y2, got %',v_count; END IF;
  IF EXISTS(SELECT 1 FROM public.questions
      WHERE source_reference~'^m13-qc-v2:Y2:AXRN-0[1-7]-Y2-01$'
       AND status='published'::public.content_status)
  THEN RAISE EXCEPTION 'TASK-306 unauthorized publication'; END IF;
END
$task306$;
COMMIT;

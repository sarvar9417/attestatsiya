-- TASK-308: seven source-reviewed Y1 improvements (balanced stem and
-- plausible near-domain distractors), review-only versions.
-- Correct choices remain protected in question_keys. This migration reads the
-- source correct key INSIDE PostgreSQL; no answer index is embedded in Git.
-- Original published question snapshots / attempted scores remain immutable.
BEGIN;
DO $task308$
DECLARE
 item jsonb;
 oldq public.questions%ROWTYPE;
 oldkey public.question_keys%ROWTYPE;
 new_id uuid;
 old_opt record;
 new_opt uuid;
 new_key_id uuid;
 wrong_at integer;
 wrong_text text;
 ref_old text;
 ref_new text;
 n int;
 i int;
BEGIN
 FOR item IN SELECT value FROM jsonb_array_elements($data$[{"chapter":1,"id":"AXR-01-001","slug":"m13-axr-01","stem":"Maktab elektron jurnalida maxfiylik, yaxlitlik va mavjudlik uchun bir vaqtda choralar ko‘rilmoqda. Ushbu uch choraning umumiy maqsadi qaysi?","wrong":["Ma’lumotni faqat vakolatli foydalanuvchilar ko‘rishini ta’minlash","Hujjatdagi ruxsatsiz o‘zgarishlarni aniqlash va cheklash","Axborot xizmatidan zarur vaqtda foydalanishni ta’minlash"],"basis":"11-sinf ICT 2021, PDF pp.257–260: CIA triadasi; NIST information security glossary"},{"chapter":2,"id":"AXR-02-002","slug":"m13-axr-02","stem":"Shubhali kod boshqa bajariladigan faylga birikib ko‘paymoqda. Uni aynan kompyuter virusi sifatida ajratib turadigan xossa qaysi?","wrong":["Tarmoqdagi zaif xostlarga mustaqil ko‘chib o‘zini tarqatishi","Foydali dastur niqobi ostida yashirin zararli amal bajarishi","Foydalanuvchi faoliyatini kuzatib maxfiy ma’lumot yig‘ishi"],"basis":"11-sinf ICT 2021, zararli dasturlar; CISA malware classifications"},{"chapter":3,"id":"AXR-03-003","slug":"m13-axr-03","stem":"Antivirus dasturi shubhali faylni karantinga joylashtirdi. Bu amalning asosiy vazifasi nimadan iborat?","wrong":["Faylga oid zararli kodni signatura bazasi bilan taqqoslash","Aniqlangan faylni tekshiruvsiz darhol butunlay o‘chirib tashlash","Faylning oldingi versiyalarini zaxira omborida saqlab qo‘yish"],"basis":"8-sinf Cambridge+, PDF pp.103–106: antivirus va zararli dasturlar; 11-sinf ICT 2021 himoya vositalari"},{"chapter":4,"id":"AXR-04-001","slug":"m13-axr-04","stem":"Fuqarolar onlayn ariza topshiradi, natijani elektron shaklda oladi va davlat axborotidan foydalanadi. Bu imkoniyatlarning umumiy tizimi qanday tushuniladi?","wrong":["Davlat idoralarida ichki elektron hujjat almashuvini tashkil etish","Davlat ma’lumotlarini faqat ochiq ma’lumotlar portalida e’lon qilish","Davlat muassasalarining axborot texnikasini yagona ro‘yxatda yuritish"],"basis":"11-sinf ICT 2021, 65-dars Elektron hukumat, PDF pp.311–324; 2026 spec 7-mavzu"},{"chapter":5,"id":"AXR-05-011","slug":"m13-axr-05","stem":"Tashkilot saytdagi yangiliklarni boshqaradi, maktab esa kurs topshiriqlari va baholarini yuritadi. CMS va LMS funksiyalari qaysi javobda to‘g‘ri ajratilgan?","wrong":["CMS o‘quvchilarning bahosini, LMS esa sayt yangiliklarini boshqaradi","CMS ham, LMS ham faqat kurs natijalarini tekshirish uchun yaratilgan","CMS ham, LMS ham asosan bir xil, faqat sahifa dizayni bilan farqlanadi"],"basis":"2026 spec 7-mavzu CMS/LMS; UNESCO digital education glossary LMS"},{"chapter":6,"id":"AXR-06-001","slug":"m13-axr-06","stem":"Ta’lim markazi darsga oid video, infografika, audio va matnlarni onlayn platformaga joyladi. Joylangan materiallar umumiy qanday ataladi?","wrong":["Foydalanuvchilarning qiziqishi va demografiyasini ifodalovchi ko‘rsatkichlar","Materialni ko‘rsatish uchun tanlangan sayt va ijtimoiy tarmoqlar majmuasi","Material samaradorligini o‘lchovchi ko‘rish, bosish va konversiya natijalari"],"basis":"8-sinf informatika darsligi kontent mavzulari; 2026 spec 7-mavzu kontent-auditoriya"},{"chapter":7,"id":"AXR-07-001","slug":"m13-axr-07","stem":"Dizayner turli buyurtmachilardan mustaqil loyiha olib, kelishilgan xizmat natijasini topshiradi. Uni qaysi mutaxassis ta’rifi eng aniq ifodalaydi?","wrong":["Bitta tashkilot shtatiga bog‘lanib doimiy vazifa bajaruvchi mutaxassis","Loyihalarni e’lon qilib faqat ijrochilarni ro‘yxatdan o‘tkazuvchi administrator","Buyurtmachi nomidan boshqa ijrochilarni jalb etib boshqaruvchi vositachi"],"basis":"8-sinf informatika freelance mavzusi; 2026 spec 7-mavzu web-freelance"}]$data$::jsonb)
 LOOP
   ref_old:='m13-axr-v1:Y1:'||(item->>'id');
   ref_new:='m13-y1-qa-v2:Y1:'||(item->>'id');
   SELECT q.* INTO STRICT oldq FROM public.questions q
     JOIN public.lessons l ON l.id=q.source_lesson_id
     JOIN public.modules m ON m.id=l.module_id
     WHERE q.source_reference=ref_old AND q.format='Y1'::public.question_format
       AND q.status='published'::public.content_status
       AND m.code='M13' AND l.slug=item->>'slug';
   SELECT * INTO STRICT oldkey FROM public.question_keys
     WHERE question_id=oldq.id;
   IF (SELECT count(*) FROM public.question_options o WHERE o.question_id=oldq.id)<>4
     OR jsonb_array_length(item->'wrong')<>3
     OR length(btrim(item->>'stem'))<40
     OR NOT EXISTS(SELECT 1 FROM public.question_options o
       WHERE o.question_id=oldq.id AND o.id::text=oldkey.payload->>'correct_option_id')
   THEN RAISE EXCEPTION 'TASK-308 old Y1 or review candidate mismatch %',ref_old; END IF;
   SELECT id INTO new_id FROM public.questions WHERE source_reference=ref_new;
   IF new_id IS NULL THEN
     new_id:=gen_random_uuid();
     INSERT INTO public.questions(
       id,subject_id,construct_id,group_code,format,cognitive,difficulty,
       stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id
     ) SELECT new_id,subject_id,construct_id,group_code,format,
         'qollash'::public.cognitive_level,3,item->>'stem',assets,
         is_generated,'review'::public.content_status,author_id,ref_new,source_lesson_id
       FROM public.questions WHERE id=oldq.id;
     wrong_at:=0;
     new_key_id:=NULL;
     FOR old_opt IN SELECT id,content_md,order_idx FROM public.question_options
       WHERE question_id=oldq.id ORDER BY order_idx
     LOOP
       new_opt:=gen_random_uuid();
       IF old_opt.id::text=oldkey.payload->>'correct_option_id' THEN
         wrong_text:=old_opt.content_md;
         new_key_id:=new_opt;
       ELSE
         wrong_text:=item->'wrong'->>wrong_at;
         wrong_at:=wrong_at+1;
       END IF;
       INSERT INTO public.question_options(
         id,question_id,side,content_md,order_idx
       ) VALUES(new_opt,new_id,'a',wrong_text,old_opt.order_idx);
     END LOOP;
     IF wrong_at<>3 OR new_key_id IS NULL THEN
       RAISE EXCEPTION 'TASK-308 protected correct-option remap failed %',ref_old;
     END IF;
     INSERT INTO public.question_keys(question_id,payload,explanation_md)
      VALUES (new_id,jsonb_build_object('correct_option_id',new_key_id),oldkey.explanation_md);
   END IF;
   SELECT count(*) INTO n FROM public.question_options o
     JOIN public.question_keys k ON k.question_id=o.question_id
     WHERE o.question_id=new_id AND o.id::text=k.payload->>'correct_option_id';
   IF n<>1 OR (SELECT count(*) FROM public.question_options o
     WHERE o.question_id=new_id)<>4
      OR NOT EXISTS(SELECT 1 FROM public.questions
       WHERE id=new_id AND status='review'::public.content_status
         AND source_lesson_id=oldq.source_lesson_id AND construct_id=oldq.construct_id)
   THEN RAISE EXCEPTION 'TASK-308 candidate validation failed %',ref_new; END IF;
 END LOOP;
 SELECT count(*) INTO n FROM public.questions q
   WHERE q.source_reference LIKE 'm13-y1-qa-v2:Y1:AXR-%'
     AND q.status='review'::public.content_status;
 IF n<>7 THEN RAISE EXCEPTION 'TASK-308 expected seven review Y1, got %',n; END IF;
END
$task308$;
COMMIT;

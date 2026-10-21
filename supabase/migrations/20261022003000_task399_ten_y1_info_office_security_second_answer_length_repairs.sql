-- TASK-399 owner-authorized AI review: 10 high-risk Y1 answer-length fixes
-- Informatics fundamentals (3), Office (3), cybersecurity (4).
-- AI-adapted scenario is not a verbatim textbook/past-paper question.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='120s';
CREATE TEMP TABLE task399_manifest (
 ref text PRIMARY KEY,grp text NOT NULL,stem text NOT NULL,
 opt0 text NOT NULL,opt1 text NOT NULL,opt2 text NOT NULL,opt3 text NOT NULL,
 key_idx integer NOT NULL,explanation text NOT NULL
) ON COMMIT DROP;
INSERT INTO task399_manifest VALUES
('ARS-02-059','S1.INFO','Voqeani shaxsan kuzatgan guvoh intervyu berdi. Intervyuning birlamchi manba ekani uning ishonchliligi haqida qanday xulosaga olib keladi?','To‘g‘ri: bevosita olingan har qanday axborotni tekshirish shart emas','To‘g‘ri: guvoh bergan ma’lumotlar doimo tarafkashlikdan xoli bo‘ladi','Noto‘g‘ri: birlamchi manba faqat boshqa manbalardan yig‘ilgan sharhdir','Noto‘g‘ri: asl manbada ham xato yoki tarafkashlik bo‘lishi mumkin',3,'Birlamchi manba ma’lumotni bevosita kuzatgan yoki qayd qilgan shaxs yoki yozuv bo‘lishi mumkin. Biroq xotira xatosi, noto‘liq tasvir yoki tarafkashlik bo‘lishi mumkinligi sabab uni ham tekshirish zarur.'),
('ARS-02-060','S1.INFO','Maktab sport zalidagi harorat xavfsizmi-yo‘qmi, degan qarorni qabul qilish kerak. Qaysi axborot xabari qarorga eng ishonchli asos bo‘ladi?','Manbasi, sanasi, o‘lchov usuli va to‘liq natijalari ko‘rsatilgan xabar','Muallif va sana berilgan, biroq o‘lchov usuli ko‘rsatilmagan xabar','Natijalar chiroyli diagrammada, ammo o‘lchangan kun sanasi noma’lum xabar','Bir nechta odam fikri keltirilgan, lekin manbasi tekshirilmagan xabar',0,'Qaror uchun o‘lchovning kim tomonidan, qachon va qanday usulda o‘tkazilgani hamda to‘liq natijalari muhim. Faqat chiroyli tasvir yoki guvohlarning shaxsiy fikri aniqlik va tekshiriluvchanlikni ta’minlamaydi.'),
('ARS-05-008','S1.INFO','Raqamli ovoz yozib olishda namunalash chastotasi 44,1 kHz deb ko‘rsatilgan. Bu miqdor fizik jihatdan nimaning sonini bildiradi?','Bir soniyada uzatiladigan audio paketlar soni','Bitta namunani saqlash uchun ajratilgan bitlar soni','Bir soniyada ijro etiladigan video kadrlar soni','Bir soniyada olingan audio namunalar soni',3,'Namunalash chastotasi bir soniyada analog tovush signalidan olingan namunalar sonini bildiradi. 44,1 kHz qiymati soniyasiga 44 100 namuna demakdir; audio bit chuqurligi esa boshqa o‘lchamdir.'),
('Office_2026_v2|OFF-E01-009|CAM6, 48–61-bet; CAM7, 63–81-bet; CAM10–11, 103–115-bet','S2.OFFICE','Excelda katakka `=A1+B1` formulasi kiritildi. Odatdagi ko‘rinishda Formula Bar bilan natija ko‘rsatilgan katak orasidagi farq qaysi javobda to‘g‘ri?','Formula Bar katakning rangini, katak esa shrift turini ko‘rsatadi','Formula Bar ifodani, katak hisoblangan natijani ko‘rsatishi mumkin','Formula Bar katak manzilini, katak esa faqat funksiyalar ro‘yxatini ko‘rsatadi','Formula Bar natijani yashiradi, katak esa formulalarni faqat matn ko‘rinishida chiqaradi',1,'Excelda Formula Bar tanlangan katakdagi formula ifodasini ko‘rsatishi, jadval katagi esa shu formula hisoblangan natijasini aks ettirishi mumkin. Formula ko‘rinishini maxsus sozlama bilan ham o‘zgartirish mumkin.'),
('Office_2026_v2|OFF-E01-012|CAM6, 48–61-bet; CAM7, 63–81-bet; CAM10–11, 103–115-bet','S2.OFFICE','Excel katagida sonli 0,25 qiymati bor. Percentage formati berilgach u 25% bo‘lib ko‘rindi. Odatda katakning ichki qiymatiga nima bo‘ladi?','Odatda saqlangan qiymatni emas, ko‘rsatilishini o‘zgartiradi','Format qiymatni har doim 100 baravar oshirib qayta saqlaydi','Format qiymatni matnga aylantirib, hisoblashlarni avtomatik to‘xtatadi','Format foiz yozuvini faqat qo‘lda kiritilgan matnga o‘tkazadi',0,'Percentage formati sonning ko‘rinishini 100 ga ko‘paytirilgan foiz shaklida ko‘rsatadi; 0,25 ning saqlangan sonli qiymati odatda o‘zgarmaydi. Faqat ko‘rinish va formatlash boshqacha bo‘ladi.'),
('Office_2026_v2|OFF-E02-012|CAM6, 59–70-bet; CAM7, 63–90-bet; CAM10–11, 103–125-bet; TUS2026, 3-bet','S2.OFFICE','Excelda `A1`, `A$1` va `$A1` havolalari formula nusxalanganda turlicha o‘zgaradi. Nisbiy va aralash havolani farqlashning asosiy mezoni qaysi?','Ustun harflari alifbo bo‘yicha qanday tartibda yozilgani','Katakning matn yoki raqam formatida saqlangani','Formuladagi havolaning bir nechta varaqda takrorlanishi','Qaysi koordinata oldida $ borligi',3,'Dollar belgisi satr yoki ustun koordinatasini nusxalashda mahkamlaydi. A1 nisbiy, A$1 satri mahkamlangan, $A1 esa ustuni mahkamlangan aralash havoladir.'),
('m13-axr-v1:Y1:AXR-01-016','S7.SEC','O‘qituvchiga hisobingiz darhol bloklanadi degan shubhali elektron xat keldi. Unda login havolasi va tasdiqlash kodi so‘ralmoqda. Dastlab eng xavfsiz harakat qaysi?','Havolani ochmay rasmiy kanal orqali hisob holatini tekshirish','Xabarning yuboruvchi nomini ko‘rib, unga javobda shaxsiy kod yuborish','Email ichidagi havolani ochib, login sahifasida parol kiritish','Xabarni tanish odamlarga yuborib, kim tasdiqlashini kutib turish',0,'Shubhali xabardagi havola, login va koddan foydalanmasdan xizmatning oldindan ma’lum rasmiy manzili yoki kanali orqali hisob holati tekshiriladi. Yuboruvchining ko‘rinadigan nomiga ishonib bo‘lmaydi.'),
('m13-axr-v1:Y1:AXR-01-023','S7.SEC','Maktab yangi elektron jurnal xizmatini ishga tushirdi. Xavfsizlik bo‘yicha dastlabki xavf tahlilini amalga oshirishning mantiqiy ketma-ketligi qanday?','Avval himoya dasturini tanlab, keyin muhim resurslarni ro‘yxatlash','Tahdidlarni sanamasdan, barcha foydalanuvchiga bir xil ruxsat berish','Aktivlarni aniqlash, tahdid va zaifliklarni baholash, chora tanlash','Bir hodisadan so‘nggina aktivlarni aniqlab, yangi parollarni o‘rnatish',2,'Avval himoyalanadigan aktivlar aniqlanadi, ularga taalluqli tahdid va zaifliklar baholanadi, so‘ng xavf darajasiga mos qarshi choralar tanlanadi.'),
('m13-axr-v1:Y1:AXR-02-005','S7.SEC','Foydalanuvchi kompyuterida fayllar shifrlanib, ularni ochish uchun pul talab qilingan xabar paydo bo‘ldi. Bu ransomware turidagi zararli dastur uchun qaysi maqsadga mos?','Shaxsiy ma’lumotlarni yashirin yig‘ib, tashqi serverga jo‘natish','Hisoblarni ko‘paytirib, tizimdan boshqalarga ruxsat olish','Ko‘rsatiladigan reklamalarni foydalanuvchi roziligisiz ko‘paytirib yuborish','Ma’lumotdan foydalanishni cheklab to‘lov talab qilish',3,'Ransomware ma’lumotni shifrlash yoki undan foydalanishni to‘xtatish orqali pul talab qilishga qaratiladi. Foydalanuvchi to‘lov qilsa ham tiklash kafolatlanmaydi.'),
('m13-axr-v1:Y1:AXR-02-013','S7.SEC','Bank logotipiga o‘xshash belgili elektron xat hisob ma’lumotlarini yuborishni so‘radi. Jo‘natuvchining haqiqiyligi noma’lum. Eng xavfsiz tekshiruv qanday?','Faqat logotip va xat dizayniga qarab ishongan holda javob berish','Xabardagi havoladan kirib, hisob egasini tasdiqlash kodini yozish','Xabar ichidagi havolani ochmay tashkilotni mustaqil kanalda tekshirish','Tanish hamkasbdan havolani ochib tekshirib ko‘rishini so‘rash',2,'Logo va ko‘rinadigan jo‘natuvchi manzili soxtalashtirilishi mumkin. Elektron xatdagi havolani bosmasdan tashkilot bilan mustaqil, oldindan ma’lum rasmiy kanal orqali bog‘lanish xavfsizroq.');
CREATE TEMP TABLE task399_selection ON COMMIT DROP AS
 SELECT q.id original_id,gen_random_uuid() revision_id,m.*
 FROM task399_manifest m JOIN public.questions q ON q.source_reference=m.ref AND q.group_code=m.grp
 WHERE q.status='published'::public.content_status AND q.format='Y1'::public.question_format
   AND EXISTS(SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=q.id
      AND f.finding_code='y1_answer_length_high_risk' AND f.resolved_at IS NULL)
   AND EXISTS(SELECT 1 FROM public.question_quality_published_revisions snap
      WHERE snap.question_id=q.id AND snap.content_fingerprint=public.professional_question_fingerprint(q.id))
   AND NOT EXISTS(SELECT 1 FROM public.question_bank_revisions oldlink WHERE oldlink.source_question_id=q.id);
SELECT q.id FROM public.questions q JOIN task399_selection s ON q.id=s.original_id FOR UPDATE OF q;
DO $pre399$
DECLARE c int;wrong int;
BEGIN
 SELECT count(*) INTO c FROM task399_selection;
 IF c<>10 THEN RAISE EXCEPTION 'TASK-399 unmodified eligible original selection changed: %/10',c;END IF;
 SELECT count(*) INTO wrong
 FROM task399_selection s JOIN public.question_keys k ON k.question_id=s.original_id
 WHERE NOT EXISTS(
   SELECT 1 FROM public.question_options oldopt WHERE oldopt.question_id=s.original_id
    AND oldopt.id::text=k.payload->>'correct_option_id'
    AND oldopt.order_idx=s.key_idx
    AND oldopt.content_md IS NOT DISTINCT FROM
      CASE s.key_idx WHEN 0 THEN s.opt0 WHEN 1 THEN s.opt1 WHEN 2 THEN s.opt2 WHEN 3 THEN s.opt3 END
 )
 OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=s.original_id)<>4;
 IF wrong<>0 THEN RAISE EXCEPTION 'TASK-399 old key identity/content changed %',wrong;END IF;
END;
$pre399$;
INSERT INTO public.questions(
 id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
 assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT s.revision_id,q.subject_id,q.construct_id,q.group_code,q.format,q.cognitive,q.difficulty,
 s.stem,q.assets,true,'review'::public.content_status,q.author_id,
 'revision:TASK-399:AI-edited:'||q.id::text||' | source:'||s.ref,
 q.source_lesson_id FROM task399_selection s JOIN public.questions q ON q.id=s.original_id;

INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),s.revision_id,'a',v.ordinal,v.txt
FROM task399_selection s CROSS JOIN LATERAL
 (VALUES(0,s.opt0),(1,s.opt1),(2,s.opt2),(3,s.opt3)) v(ordinal,txt);
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT s.revision_id,
 jsonb_set(k.payload,'{correct_option_id}',to_jsonb(opt.id::text),false),
 s.explanation FROM task399_selection s
 JOIN public.question_keys k ON k.question_id=s.original_id
 JOIN public.question_options opt ON opt.question_id=s.revision_id
   AND opt.order_idx=s.key_idx AND opt.side='a';

DO $opt399$
DECLARE invalid_count int;
BEGIN
 SELECT count(*) INTO invalid_count FROM task399_selection s
 JOIN public.question_keys k ON k.question_id=s.revision_id
 WHERE (SELECT count(*) FROM public.question_options o WHERE o.question_id=s.revision_id)<>4
  OR (SELECT count(distinct btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=s.revision_id)<>4
  OR NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=s.revision_id
          AND o.id::text=k.payload->>'correct_option_id')
  OR (SELECT max(w) FROM (SELECT array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1) w
                FROM public.question_options o WHERE o.question_id=s.revision_id) t)
     >1.6*(SELECT min(w) FROM (SELECT array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1) w
                FROM public.question_options o WHERE o.question_id=s.revision_id) t)
  OR (SELECT array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)
           FROM public.question_options o WHERE o.question_id=s.revision_id AND o.id::text=k.payload->>'correct_option_id')
     >(SELECT max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
       FROM public.question_options o WHERE o.question_id=s.revision_id AND o.id::text<>k.payload->>'correct_option_id');
 IF invalid_count<>0 THEN RAISE EXCEPTION 'TASK-399 answer-length balance or key failed: %',invalid_count;END IF;
END;
$opt399$;

INSERT INTO public.question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
SELECT s.original_id,s.revision_id,'owner_ai_y1_option_length_semantic_repair',
 jsonb_build_object(
 'task','TASK-399','delegated_AI_editorial_20261021',true,
 'original_key_text_exact',true,'new_stem_AI_authored',true,'reviewed_distractors_and_reason',true,
 'human_independent_editor',false,'exam_attempts_modified',false,'group',s.grp,'original_source_reference',s.ref)
FROM task399_selection s;
UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
FROM task399_selection s WHERE q.id=s.revision_id AND q.status='review'::public.content_status;
UPDATE public.questions q SET status='archived'::public.content_status,updated_at=now()
FROM task399_selection s WHERE q.id=s.original_id AND q.status='published'::public.content_status;
UPDATE public.question_quality_published_revisions snap SET release_scope=
 'TASK-399 AI-reviewed 10 length-balanced Y1 items; original correct concept preserved; not independent human certified'
FROM task399_selection s WHERE snap.question_id=s.revision_id;
UPDATE public.question_quality_findings f SET resolved_at=now(),
 details=f.details||jsonb_build_object('task','TASK-399','replacement_revision_id',s.revision_id,
  'owner_authorized_AI_review',true,'human_editorial_signature',false)
FROM task399_selection s
WHERE f.question_id=s.original_id AND f.finding_code IN
  ('y1_answer_length_high_risk','y1_correct_answer_strictly_longest');

DO $post399$
DECLARE bad_count int;
BEGIN
 SELECT count(*) INTO bad_count FROM task399_selection s
 JOIN public.questions oldq ON oldq.id=s.original_id
 JOIN public.questions newq ON newq.id=s.revision_id
 LEFT JOIN public.question_quality_published_revisions snap ON snap.question_id=newq.id
 WHERE oldq.status<>'archived'::public.content_status
   OR newq.status<>'published'::public.content_status
   OR snap.content_fingerprint IS DISTINCT FROM public.professional_question_fingerprint(newq.id)
   OR NOT public.is_question_official_mock_eligible(newq.id)
   OR NOT public.group_mock_eligible(newq.id)
   OR EXISTS(SELECT 1 FROM public.question_quality_findings f
          WHERE f.question_id=newq.id AND f.resolved_at IS NULL AND f.severity IN ('high','critical'));
 IF bad_count<>0 THEN RAISE EXCEPTION 'TASK-399 archive, fingerprint, or mock eligibility failed: %',bad_count;END IF;
END;
$post399$;
COMMIT;
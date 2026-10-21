-- TASK-400 owner-authorized AI review: 10 high-risk Y1 answer-length fixes
-- Informatics fundamentals (3), Office (3), cybersecurity (4).
-- AI-adapted scenario is not a verbatim textbook/past-paper question.
BEGIN;
SET LOCAL lock_timeout='12s';
SET LOCAL statement_timeout='120s';
CREATE TEMP TABLE task400_manifest (
 ref text PRIMARY KEY,grp text NOT NULL,stem text NOT NULL,
 opt0 text NOT NULL,opt1 text NOT NULL,opt2 text NOT NULL,opt3 text NOT NULL,
 key_idx integer NOT NULL,explanation text NOT NULL
) ON COMMIT DROP;
INSERT INTO task400_manifest VALUES
('reserve-2026:T060-R1-HW-B01','S2.HW','Kompyuterda dastur buyruqlari bajarilib, sonlar ustida arifmetik va mantiqiy amallar amalga oshiriladi. Ushbu ishni bajaradigan asosiy komponentning vazifasi qaysi?','Buyruqlarni bajarish va ma’lumotni qayta ishlash','Fayllarni elektr o‘chganida ham uzoq muddat saqlash','Ekranga uzatiladigan tasvir signalini ranglarga aylantirish','Tarmoq orqali uzatiladigan paketlarni manziliga qarab yo‘naltirish',0,'CPU dastur buyruqlarini bajaradi va ma’lumotni qayta ishlaydi. Doimiy saqlash SSD/HDD vazifasi; grafik tasvir bilan GPU va tarmoq marshrutlash bilan router shug‘ullanadi.'),
('reserve-2026:T060-R1-HW-B02','S2.HW','Kompyuterda bir vaqtning o‘zida bir nechta dastur ishlayapti. Elektr ta’minoti uzilganda odatda tarkibini yo‘qotadigan tezkor xotira nimaga xizmat qiladi?','Ishlayotgan dastur va ma’lumotni vaqtincha saqlaydi','Operatsion tizim yuklovchisini tok o‘chganda ham saqlaydi','Foydalanuvchi fayllarini uzoq muddat diskda saqlaydi','Kompyuterning tarmoq manzilini avtomatik ravishda taqsimlaydi',0,'RAM ishlayotgan dasturlar va foydalanilayotgan ma’lumotlarni vaqtincha saqlaydi. Odatdagi RAM energiyaga bog‘liq; uzoq muddatli saqlash uchun SSD/HDD kabi qurilmalar ishlatiladi.'),
('reserve-2026:T060-R1-HW-B05','S2.HW','CPU, RAM, videokarta va boshqa modullar elektr hamda ma’lumot uzatish yo‘llari orqali bir tizimga ulanadi. Asosiy plataning bosh vazifasi qaysi?','Asosiy komponentlarni o‘zaro bog‘lash','Doimiy fayl xotirasini kengaytirish','Monitor ekranida grafikani hisoblash','Tarmoq paketlarini serverlarga marshrutlash',0,'Asosiy plata protsessor, tezkor xotira va boshqa komponentlar o‘rtasidagi fizik hamda elektr aloqani tashkil qiladi. Grafikani GPU, paketlarni yo‘naltirishni router bajaradi.'),
('reserve-2026:T060-R1-HW-B16','S2.HW','Printer yangi kompyuterga ulandi, ammo operatsion tizim uni boshqarish uchun mos dasturiy interfeysga ega emas. Bunday vaziyatda drayverning vazifasi qaysi?','Operatsion tizimning muayyan apparat qurilmasi bilan ishlashiga yordam beradi','Kompyuterdagi barcha fayllarni avtomatik ravishda diskdan diskka ko‘chiradi','Kompyuterning barcha tarmoq paketlarini tashqi serverlar bo‘ylab yo‘naltiradi','Matn faylidagi imlo xatolarini avtomatik topib o‘rniga to‘g‘risini yozadi',0,'Qurilma drayveri operatsion tizim bilan muayyan apparat qurilmasi o‘rtasida ishlash interfeysini ta’minlaydi. Drayver alohida imlo tekshiruvchi yoki router emas.'),
('network-v2-20261018:TAR-02-017:original-Y1','S6.NET','Maktab tarmog‘ida kiruvchi va chiquvchi ulanishlarning bir qismi xavfsizlik qoidalariga ko‘ra ruxsat etiladi, boshqalari rad qilinadi. Firewallning asosiy vazifasi qaysi?','Kiruvchi paketlarning manzilini doim o‘zgartirib uzatish','Trafikni belgilangan qoidalar asosida filtrlash','Veb-sahifalarni mavzu va kalit so‘z bo‘yicha indekslash','Har bir tarmoq qurilmasiga avtomatik IP manzil tarqatish',1,'Firewall tarmoq oqimini oldindan belgilangan xavfsizlik siyosati asosida ruxsat etish yoki bloklash uchun filtrlaydi. NAT, qidiruv indekslash va DHCP boshqa vazifalardir.'),
('network-v2-20261018:TAR-04-006:original-Y1','S6.NET','Kompyuterdan tashqi serverning IP manziliga ulanish ishlaydi, ammo aynan shu serverga domen nomi orqali kirish muvaffaqiyatsiz. Eng asosli dastlabki tashxis nima?','Nomni IPga moslashtirishda muammo bo''lishi mumkin','Internetga chiqish yo‘li to‘liq uzilgan bo‘lishi kerak','Ushbu serverning tarmoq kartasi o‘chirilgani albatta aniq','Router barcha IP paketlarni so‘zsiz bloklagan bo‘lishi kerak',0,'IP bo‘yicha ulanish muvaffaqiyatli bo‘lgani uchun umumiy tarmoq aloqasi mavjud. Domen ishlamasligi DNS orqali nomni IPga moslashtirish muammosini ko‘rsatishi mumkin; bu ehtimol, qat’iy hukm emas.'),
('network-v2-20261018:TAR-05-008:original-Y1','S6.NET','IPv4 tarmoq niqobining oxirgi okteti 160 (ikkilikda 10100000) bo‘lsa, 255.255.255.160 ni standart uzluksiz CIDR niqobi sifatida qabul qilish mumkinmi?','Ha, 160 qiymati /25 prefiksni bildiradi va mos keladi','Ha, 160 qiymati /26 prefiksni bildiradi va mos keladi','Ha, 160 qiymati /27 prefiksni bildiradi va mos keladi','Yo''q, 160 ning ikkilik bitlari uzluksiz birlar emas',3,'IPv4 CIDR niqobi ikkilik yozuvda avval ketma-ket birliklardan, so‘ng faqat nollardan iborat bo‘lishi kerak. 160=10100000 ketma-ketlikni buzadi, shuning uchun 255.255.255.160 yaroqsiz niqobdir.'),
('network-v2-20261018:TAR-07-025:original-Y1','S6.NET','IPv6 tarmog‘ida bitta paketni o‘sha tarmoqdagi hamma qurilmaga IPv4dagi broadcast manzili orqali jo‘natish mumkinmi? Eng aniq izohni tanlang.','Ha, ::1 manzili IPv6 uchun umumiy broadcast hisoblanadi','Ha, har bir /64 prefiksning oxiri broadcast sifatida ishlatiladi','Yo‘q, IPv6 multicast va boshqa mexanizmlardan foydalanadi','Ha, IPv4 255.255.255.255 manzili IPv6ga to‘g‘ridan-to‘g‘ri ko‘chadi',2,'IPv6 protokolida IPv4dagidek broadcast manzillar mavjud emas; guruhga yuborish uchun multicast, bir nechta manzildan biriga yuborish uchun anycast kabi mexanizmlar ishlatiladi.'),
('network-v2-20261018:TAR-08-007:original-Y1','S6.NET','Foydalanuvchi brauzerda kalit so‘z kiritdi va tegishli sahifalar ro‘yxati qaytdi. Qidiruv tizimining shu jarayondagi asosiy vazifasi qaysi?','Yangi IP manzillarni DHCP server orqali tarqatish','So''rovga mos axborotni indeksdan qidirish','Yuborilgan elektron xatlarni SMTP server orqali yetkazish','Internet paketlarini routerlar orasida manzilga qarab uzatish',1,'Qidiruv tizimi ilgari yig‘ilgan veb-sahifalar indeksidan so‘rovga mos ma’lumotlarni topadi va odatda dolzarbligiga ko‘ra tartiblaydi. DHCP, SMTP va marshrutlash boshqa tarmoq xizmatlaridir.'),
('network-v2-20261018:TAR-09-012:original-Y1','S6.NET','Qidiruv tizimining roboti sayt havolalaridan biridan boshqasiga o‘tib, yangi sahifalarni avtomatik topmoqda. Bu qaysi faoliyatga eng aniq mos?','Veb sahifalarni ekrandan printerga chiqarish','Topilgan natijalarni foydalanuvchi bahosiga ko‘ra tartiblash','Internet manzillarini DNS orqali boshqa domenga almashtirish','Veb sahifalarni avtomatik ko''rib chiqish',3,'Crawler veb-sahifalardagi havolalarni kuzatib, yangi resurslarni avtomatik ko‘rib chiqadi. Ranking topilgan natijalarni saralaydi, DNS esa domen nomlarini manzilga moslaydi.');
CREATE TEMP TABLE task400_selection ON COMMIT DROP AS
 SELECT q.id original_id,gen_random_uuid() revision_id,m.*
 FROM task400_manifest m JOIN public.questions q ON q.source_reference=m.ref AND q.group_code=m.grp
 WHERE q.status='published'::public.content_status AND q.format='Y1'::public.question_format
   AND EXISTS(SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=q.id
      AND f.finding_code='y1_answer_length_high_risk' AND f.resolved_at IS NULL)
   AND EXISTS(SELECT 1 FROM public.question_quality_published_revisions snap
      WHERE snap.question_id=q.id AND snap.content_fingerprint=public.professional_question_fingerprint(q.id))
   AND NOT EXISTS(SELECT 1 FROM public.question_bank_revisions oldlink WHERE oldlink.source_question_id=q.id);
SELECT q.id FROM public.questions q JOIN task400_selection s ON q.id=s.original_id FOR UPDATE OF q;
DO $pre400$
DECLARE c int;wrong int;
BEGIN
 SELECT count(*) INTO c FROM task400_selection;
 IF c<>10 THEN RAISE EXCEPTION 'TASK-400 unmodified eligible original selection changed: %/10',c;END IF;
 SELECT count(*) INTO wrong
 FROM task400_selection s JOIN public.question_keys k ON k.question_id=s.original_id
 WHERE NOT EXISTS(
   SELECT 1 FROM public.question_options oldopt WHERE oldopt.question_id=s.original_id
    AND oldopt.id::text=k.payload->>'correct_option_id'
    AND oldopt.order_idx=s.key_idx + CASE WHEN s.grp='S6.NET' THEN 1 ELSE 0 END
    AND oldopt.content_md IS NOT DISTINCT FROM
      CASE s.key_idx WHEN 0 THEN s.opt0 WHEN 1 THEN s.opt1 WHEN 2 THEN s.opt2 WHEN 3 THEN s.opt3 END
 )
 OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=s.original_id)<>4;
 IF wrong<>0 THEN RAISE EXCEPTION 'TASK-400 old key identity/content changed %',wrong;END IF;
END;
$pre400$;
INSERT INTO public.questions(
 id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
 assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT s.revision_id,q.subject_id,q.construct_id,q.group_code,q.format,q.cognitive,q.difficulty,
 s.stem,q.assets,true,'review'::public.content_status,q.author_id,
 'revision:TASK-400:AI-edited:'||q.id::text||' | source:'||s.ref,
 q.source_lesson_id FROM task400_selection s JOIN public.questions q ON q.id=s.original_id;

INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),s.revision_id,'a',v.ordinal,v.txt
FROM task400_selection s CROSS JOIN LATERAL
 (VALUES(0,s.opt0),(1,s.opt1),(2,s.opt2),(3,s.opt3)) v(ordinal,txt);
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT s.revision_id,
 jsonb_set(k.payload,'{correct_option_id}',to_jsonb(opt.id::text),false),
 s.explanation FROM task400_selection s
 JOIN public.question_keys k ON k.question_id=s.original_id
 JOIN public.question_options opt ON opt.question_id=s.revision_id
   AND opt.order_idx=s.key_idx AND opt.side='a';

DO $opt400$
DECLARE invalid_count int;
BEGIN
 SELECT count(*) INTO invalid_count FROM task400_selection s
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
 IF invalid_count<>0 THEN RAISE EXCEPTION 'TASK-400 answer-length balance or key failed: %',invalid_count;END IF;
END;
$opt400$;

INSERT INTO public.question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
SELECT s.original_id,s.revision_id,'owner_ai_y1_option_length_semantic_repair',
 jsonb_build_object(
 'task','TASK-400','delegated_AI_editorial_20261021',true,
 'original_key_text_exact',true,'new_stem_AI_authored',true,'reviewed_distractors_and_reason',true,
 'human_independent_editor',false,'exam_attempts_modified',false,'group',s.grp,'original_source_reference',s.ref)
FROM task400_selection s;
UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
FROM task400_selection s WHERE q.id=s.revision_id AND q.status='review'::public.content_status;
UPDATE public.questions q SET status='archived'::public.content_status,updated_at=now()
FROM task400_selection s WHERE q.id=s.original_id AND q.status='published'::public.content_status;
UPDATE public.question_quality_published_revisions snap SET release_scope=
 'TASK-400 AI-reviewed 10 length-balanced Y1 items; original correct concept preserved; not independent human certified'
FROM task400_selection s WHERE snap.question_id=s.revision_id;
UPDATE public.question_quality_findings f SET resolved_at=now(),
 details=f.details||jsonb_build_object('task','TASK-400','replacement_revision_id',s.revision_id,
  'owner_authorized_AI_review',true,'human_editorial_signature',false)
FROM task400_selection s
WHERE f.question_id=s.original_id AND f.finding_code IN
  ('y1_answer_length_high_risk','y1_correct_answer_strictly_longest');

DO $post400$
DECLARE bad_count int;
BEGIN
 SELECT count(*) INTO bad_count FROM task400_selection s
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
 IF bad_count<>0 THEN RAISE EXCEPTION 'TASK-400 archive, fingerprint, or mock eligibility failed: %',bad_count;END IF;
END;
$post400$;
COMMIT;
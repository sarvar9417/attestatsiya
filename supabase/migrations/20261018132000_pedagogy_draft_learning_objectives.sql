-- P0-03 draft learning-objective map; never asserts lesson mastery or official certification.
-- Derived ONLY from the user's approved critical audit section 8, not individually
-- page-verified from each official teaching/reference PDF. All records stay review.
BEGIN;
CREATE TABLE IF NOT EXISTS public.pedagogy_lesson_objectives (
 code text PRIMARY KEY,
 lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE RESTRICT,
 objective_uz text NOT NULL,
 source_type text NOT NULL DEFAULT 'audit_draft',
 source_note text NOT NULL,
 source_document text NULL,
 source_page integer NULL,
 status text NOT NULL DEFAULT 'review' CHECK(status IN ('review','verified','archived')),
 reviewed_by uuid NULL REFERENCES auth.users(id),
 reviewed_at timestamptz NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT pedagogy_objective_verified_with_reviewer
   CHECK (status <> 'verified' OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL AND source_document IS NOT NULL AND source_page IS NOT NULL))
);
CREATE TABLE IF NOT EXISTS public.pedagogy_question_objectives (
 question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE RESTRICT,
 objective_code text NOT NULL REFERENCES public.pedagogy_lesson_objectives(code) ON DELETE RESTRICT,
 linked_by uuid NOT NULL REFERENCES auth.users(id),
 verified_at timestamptz NULL,
 PRIMARY KEY(question_id,objective_code)
);
ALTER TABLE public.pedagogy_lesson_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedagogy_question_objectives ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.pedagogy_lesson_objectives,public.pedagogy_question_objectives FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.pedagogy_lesson_objectives,public.pedagogy_question_objectives TO service_role;

INSERT INTO public.pedagogy_lesson_objectives(code,lesson_id,objective_uz,source_type,source_note,status)
SELECT v.code,l.id,v.objective_uz,'audit_draft','2026-10-18 critic audit, section 8 — requires source/page editorial verification','review'
FROM (VALUES
('M14.01.OBJ01','M14',1,'Ta’lim dasturi va standart talablarini rejalashtirish'),
('M14.01.OBJ02','M14',1,'Dars uchun aniq o‘quv natijasi va maqsad yozish'),
('M14.01.OBJ03','M14',1,'Vaqt hamda faoliyatlar ketma-ketligini rejalash'),
('M14.01.OBJ04','M14',1,'Reja va baholash mezonini moslashtirish'),
('M14.02.OBJ01','M14',2,'Ta’lim strategiyasini ehtiyojga mos tanlash'),
('M14.02.OBJ02','M14',2,'O‘quv resursi va vositasini maqsadga mos tanlash'),
('M14.02.OBJ03','M14',2,'Turli o‘quvchilarga mos differensial vazifalar tuzish'),
('M14.02.OBJ04','M14',2,'Dars samaradorligini dalil bilan kuzatish'),
('M14.03.OBJ01','M14',3,'Boshlang‘ich diagnostik baholashni farqlash'),
('M14.03.OBJ02','M14',3,'Formativ baholash va qayta aloqani farqlash'),
('M14.03.OBJ03','M14',3,'Summativ baholash natijasini izohlash'),
('M14.03.OBJ04','M14',3,'Xato asosida keyingi o‘qitishni moslashtirish'),
('M14.04.OBJ01','M14',4,'Tarbiyaviy faoliyatni rejalash'),
('M14.04.OBJ02','M14',4,'Xulq-atvor holatida inson qadrini saqlash'),
('M14.04.OBJ03','M14',4,'Pedagogik etikaga muvofiq muammo yechish'),
('M14.04.OBJ04','M14',4,'Tarbiyaviy natijani kuzatish va qayd qilish'),
('M14.05.OBJ01','M14',5,'Zo‘ravonlik va kamsitish xavfini aniqlash'),
('M14.05.OBJ02','M14',5,'Inklyuziv va individual ehtiyojlar uchun sharoit yaratish'),
('M14.05.OBJ03','M14',5,'Xavfsiz sinfdagi pedagogik muloqotni saqlash'),
('M14.05.OBJ04','M14',5,'Hodisa haqida maxfiylik va xavfsizlik qoidalariga rioya qilish'),
('M14.06.OBJ01','M14',6,'Kasbiy refleksiya orqali o‘z darsini tahlil qilish'),
('M14.06.OBJ02','M14',6,'Rivojlanish ehtiyojini dalil asosida aniqlash'),
('M14.06.OBJ03','M14',6,'Kasbiy o‘sish rejasini tuzish'),
('M14.06.OBJ04','M14',6,'Hamkasb tajribasidan xulosa chiqara olish'),
('M14.07.OBJ01','M14',7,'Hamkasblar bilan pedagogik hamkorlik qilish'),
('M14.07.OBJ02','M14',7,'Ota-ona bilan xolis va hurmatli suhbat yuritish'),
('M14.07.OBJ03','M14',7,'Nizoda kelishilgan yechim izlash'),
('M14.07.OBJ04','M14',7,'O‘quvchining shaxsiy ma’lumotlarini himoyalash'),
('M15.01.OBJ01','M15',1,'Pedagogika, didaktika va tarbiya mazmunini farqlash'),
('M15.01.OBJ02','M15',1,'Bilim, ko‘nikma va malaka farqini aniqlash'),
('M15.01.OBJ03','M15',1,'Yosh psixologiyasi va rivojlanish talabini qo‘llash'),
('M15.01.OBJ04','M15',1,'O‘quvchining tayyorgarligi asosida yondashuv tanlash'),
('M15.02.OBJ01','M15',2,'Onglilik, faollik va ko‘rgazmalilik tamoyillarini farqlash'),
('M15.02.OBJ02','M15',2,'Tizimlilik, muntazamlik va mustahkamlikni ajratish'),
('M15.02.OBJ03','M15',2,'Ilmiylik hamda nazariya–amaliyot uyg‘unligini ta’minlash'),
('M15.02.OBJ04','M15',2,'Tushunarlilik va individuallashtirishni tanlash'),
('M15.02.OBJ05','M15',2,'Induksiya, deduksiya va analogiyani farqlash'),
('M15.03.OBJ01','M15',3,'Tarbiyaning axloqiy, huquqiy va iqtisodiy yo‘nalishlarini farqlash'),
('M15.03.OBJ02','M15',3,'Ekologik, estetik va mehnat tarbiyasini ajratish'),
('M15.03.OBJ03','M15',3,'Ishontirish, rag‘bat va namuna metodlarini farqlash'),
('M15.03.OBJ04','M15',3,'Vaziyatga mos tarbiya metodini asoslash'),
('M15.04.OBJ01','M15',4,'Yangi bilim, mustahkamlash, umumlashtirish va nazorat darslarini farqlash'),
('M15.04.OBJ02','M15',4,'Aralash darsdagi didaktik bosqichlarni aniqlash'),
('M15.04.OBJ03','M15',4,'Dars maqsadi va vaqtni rejalash'),
('M15.04.OBJ04','M15',4,'Sinfdagi faol ishtirokni tashkil etish'),
('M15.04.OBJ05','M15',4,'Didaktik, uslubiy va psixologik dars tahlilini farqlash'),
('M15.05.OBJ01','M15',5,'Sinf rahbarining asosiy mehnat vazifalarini farqlash'),
('M15.05.OBJ02','M15',5,'Sinf hujjatlari va tarbiyaviy reja vazifasini aniqlash'),
('M15.05.OBJ03','M15',5,'Sinf jamoasida xavfsiz hamkorlik tashkil etish'),
('M15.05.OBJ04','M15',5,'Ota-ona bilan muloqotni natijaga yo‘naltirish'),
('M15.05.OBJ05','M15',5,'O‘quvchining shaxsiy holati va ma’lumotini himoyalash'),
('M15.06.OBJ01','M15',6,'Pedagogik etika, nazokat va taktni farqlash'),
('M15.06.OBJ02','M15',6,'Pedagogik nutqning aniqligi, mantiqiyligi va ifodaliligini aniqlash'),
('M15.06.OBJ03','M15',6,'Ovoz, imo-ishora, mimika va texnikani maqsadli qo‘llash'),
('M15.06.OBJ04','M15',6,'Kasbiy refleksiya va o‘zini baholashni ajratish'),
('M15.06.OBJ05','M15',6,'Ijodkorlik, kreativlik va kompetentlikni kontekstda farqlash'),
('M15.07.OBJ01','M15',7,'Didaktik va akademik qobiliyatlarni ajratish'),
('M15.07.OBJ02','M15',7,'Perseptiv va kommunikativ qobiliyatlarni farqlash'),
('M15.07.OBJ03','M15',7,'Tashkilotchilik va nutq qobiliyatini aniqlash'),
('M15.07.OBJ04','M15',7,'Diqqatni taqsimlash va pedagogik tasavvurni farqlash'),
('M15.07.OBJ05','M15',7,'Pedagogik qobiliyatlarning muallifga xos tasniflarini tekshirish'),
('M15.08.OBJ01','M15',8,'Muammoli va loyihaviy ta’limni farqlash'),
('M15.08.OBJ02','M15',8,'Hamkorlik, evristik va interfaol yondashuvni ajratish'),
('M15.08.OBJ03','M15',8,'Shaxsga yo‘naltirilgan, differensial va individual yondashuvni farqlash'),
('M15.08.OBJ04','M15',8,'Integratsiyalashgan, o‘yinli va texnologik ta’limni ajratish'),
('M15.08.OBJ05','M15',8,'Inklyuziv ta’lim va moslashtirilgan topshiriqni qo‘llash'),
('M16.01.OBJ01','M16',1,'Informatika metodikasining fanni o‘qitishdan farqini aniqlash'),
('M16.01.OBJ02','M16',1,'Informatika o‘quv maqsadini kompetensiyaga aylantirish'),
('M16.01.OBJ03','M16',1,'Raqamli vosita va pedagogik texnologiya mosligini tanlash'),
('M16.01.OBJ04','M16',1,'Fan metodikasiga mos faol ta’limni loyihalash'),
('M16.02.OBJ01','M16',2,'Tushuntirish, ko‘rsatish va mashq metodlarini farqlash'),
('M16.02.OBJ02','M16',2,'Amaliy topshiriqda xatoni aniqlashga yordam berish'),
('M16.02.OBJ03','M16',2,'Juftlik va guruh bilan ishlash metodini mos tanlash'),
('M16.02.OBJ04','M16',2,'Algoritm, dasturlash va axborot mavzulariga mos usulni asoslash'),
('M16.03.OBJ01','M16',3,'Ta’limiy vaziyat sababini dalil asosida tahlil qilish'),
('M16.03.OBJ02','M16',3,'O‘quvchi xatosi uchun mos qayta aloqa berish'),
('M16.03.OBJ03','M16',3,'Pedagogik qarorning oqibatini baholash'),
('M16.03.OBJ04','M16',3,'Tuzatishdan keyin natijani qayta tekshirish')
) AS v(code,module_code,lesson_order,objective_uz)
JOIN public.modules m ON m.code=v.module_code
JOIN public.lessons l ON l.module_id=m.id AND l.order_idx=v.lesson_order
 AND l.status='published'::public.content_status
ON CONFLICT(code) DO NOTHING;

DO $verify$
DECLARE v_expected integer := 78;v_count integer;v_lessons integer;
BEGIN
 SELECT COUNT(*),COUNT(DISTINCT lesson_id) INTO v_count,v_lessons
 FROM public.pedagogy_lesson_objectives WHERE source_type='audit_draft';
 IF v_count<>v_expected OR v_lessons<>18 THEN
   RAISE EXCEPTION 'Pedagogy draft map mismatch: objectives %/% lessons %/18',v_count,v_expected,v_lessons;
 END IF;
 IF EXISTS(SELECT 1 FROM public.pedagogy_lesson_objectives WHERE source_type='audit_draft' AND status<>'review') THEN
   RAISE EXCEPTION 'Unreviewed objectives were certified unexpectedly';
 END IF;
END
$verify$;
COMMIT;

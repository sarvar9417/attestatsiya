-- TASK-436 first corrected Informatika PDF Y1 release — 8 independently reviewed mixed Attestatsiya Test 6 corrections (NOT source-original keys).
-- User directed publication and merge on 2026-10-22. AI-assisted, NOT independent human approval.
-- Trusted controlled SQL migration, no existing questions/exam items updated.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='100s';
CREATE TEMP TABLE task436_release (
 source_id text, source_no int, construct_code text, lesson_id uuid, cognitive text,
 stem text, opts text[], correct_idx int, explanation text, question_id uuid default gen_random_uuid(),
 PRIMARY KEY(source_id,source_no),UNIQUE(question_id)
) ON COMMIT DROP;
INSERT INTO task436_release(source_id,source_no,construct_code,lesson_id,cognitive,stem,opts,correct_idx,explanation) VALUES
('1QNeDPscVBVUDYwQTsme3EgQbE-UJMf3I',1,'S4.CODE.05','5a78dc98-efe0-3b3a-386b-b9e649e9f1a1'::uuid,'qollash','JavaScriptda quyidagi kod qanday sonni chiqaradi?

```js
let a = [2, 4, 6];
a.push(a[1]);
a.pop();
a[0] = a[0] + 3;
let s = 0;
for (let i = 0; i < a.length; i++) {
  if (a[i] % 2 === 0) s += a[i];
  else s -= a[i];
}
console.log(s);
```',ARRAY['-5','-1','5','7']::text[],2,'push(a[1]) massiv oxiriga 4 qo‘shadi, pop() oxiridagi aynan 4 ni olib tashlaydi. a[0] 2 dan 5 ga aylanadi: massiv [5,4,6]. Siklda toq 5 ayiriladi, juft 4 va 6 qo‘shiladi: -5+4+6=5.'),
('1QNeDPscVBVUDYwQTsme3EgQbE-UJMf3I',4,'S6.NET.04','c1200000-0000-4000-8000-000000000004'::uuid,'qollash','Foydalanuvchiga bank nomidan xat kelib, undagi soxta veb-havola orqali login va parolni kiritish so‘raldi. Bu hujum qaysi turga eng aniq mos?',ARRAY['Phishing — soxta xat va sayt bilan maxfiy ma’lumotni olish','Pharming — DNS yo‘naltirish bilan trafikni boshqa saytga burish','Smishing — aynan SMS xabar orqali aldash','Vishing — telefon ovozli qo‘ng‘irog‘ida aldash']::text[],0,'Bu holatda aldov xabar bank nomidan email orqali kelgan va soxta saytda maxfiy login/parol terishni so‘ragan. Bu phishing. Smishing SMS, vishing telefon ovozi, pharming esa DNS/xost yo‘naltirish kabi boshqa mexanizmlardir.'),
('1QNeDPscVBVUDYwQTsme3EgQbE-UJMf3I',5,'S5.WEB.06','b1100000-0000-4000-8000-000000000003'::uuid,'qollash','Quyidagi ikkita bo‘sh `div` normal blok oqimida bir-birining darhol ketidan keladi; ularda border, padding, flex/grid konteksti yo‘q. CSS berilgan:

```css
div { margin-top: 25px; margin-bottom: 25px; }
```

Ikkala qo‘shni vertikal margin orasidagi haqiqiy masofa qancha?',ARRAY['0 px','25 px','50 px','75 px']::text[],1,'Normal block formatting contextda qo‘shni vertikal marginlar collapse bo‘ladi, ya’ni 25px+25px emas, kattasiga teng 25px vertikal oralig‘ hosil bo‘ladi. Border, padding, flex yoki grid holatlari natijani o‘zgartirishi mumkin; shart bularni chiqarib tashladi.'),
('1QNeDPscVBVUDYwQTsme3EgQbE-UJMf3I',8,'S4.CODE.02','98000000-0000-4000-8000-000000000002'::uuid,'qollash','Python 3 kodining natijasini aniqlang:

```python
s = 190
n = 0
while s - n > 0:
    s = s - 5
    n = n + 15
print(s)
```',ARRAY['130','140','150','160']::text[],1,'k iteratsiyadan keyin s=190−5k, n=15k, davom etish sharti 190−20k>0. k=9 da 10>0, yana bir marta bajariladi. k=10 da s=140, n=150 va shart −10>0 yolg‘on; print(140) bo‘ladi.'),
('1QNeDPscVBVUDYwQTsme3EgQbE-UJMf3I',9,'S1.INFO.03','9fd23df7-58b4-4054-aec8-431415263498'::uuid,'qollash','250×300 pikselli har bir tasvir uchun 40 KiB dan oshmaydigan xotira ajratilgan. Rasm siqilmagan, barcha pikselga bir xil butun bit uzunligi ishlatiladi va xizmat baytlari yo‘q. Eng ko‘pi bilan nechta rang kodlash mumkin?',ARRAY['8 ta','16 ta','32 ta','64 ta']::text[],1,'Piksel soni 250×300=75000. Xotira 40×1024×8=327680 bit; bitta pikselga ko‘pi bilan floor(327680/75000)=4 bit ajratish mumkin. 4 bit 2⁴=16 rang beradi; 5 bit/piksel 375000 bit bo‘lib limitdan oshadi.'),
('1QNeDPscVBVUDYwQTsme3EgQbE-UJMf3I',14,'S3.LOGIC.03','94000000-0000-4000-8000-000000000003'::uuid,'qollash','Komil, Davron va Navruz 1-, 2-, 3-o‘rinlarni takrorlanmasdan egalladi. Quyidagi uch gapdan AYNAN BITTASI rost: «Komil 3-o‘rinda», «Davron 2-o‘rinda», «Navruz 2-o‘rinda emas». Kim qaysi o‘rinni egallagan?',ARRAY['Komil 1, Davron 2, Navruz 3','Komil 3, Davron 2, Navruz 1','Komil 1, Davron 3, Navruz 2','Komil 2, Davron 1, Navruz 3']::text[],3,'D variantida Komil 3-da emas (yolg‘on), Davron 2-da emas (yolg‘on), Navruz 2-da emas (rost). A variantida ikkitasi rost, B da uchtasi rost, C da nol rost. Shuning uchun faqat D talabga mos.'),
('1QNeDPscVBVUDYwQTsme3EgQbE-UJMf3I',16,'S5.WEB.01','a1000000-0000-4000-8000-000000000001'::uuid,'qollash','Grafik muharrirda chizish uchun varaqsimon ish maydoni, egri chiziq chizish buyrug‘i va palitradan tashqari rangni tanlash oynasi so‘raldi. Mos atamalar ketma-ketligini tanlang.',ARRAY['Canvas — Curve — Edit Colors','Menu — Line — Colors','Selection — Pencil — Layers','List — Bezier — Texture']::text[],0,'Chizish uchun varaqsimon ish maydoni Canvas (kanvas), standart egri chiziq asbobi Curve, palitrada yo‘q rangni tanlash Edit Colors oynasi bilan bog‘liq. Qolgan variantlar vazifalarni boshqa turdagi menyu yoki asbob bilan almashtiradi.'),
('1QNeDPscVBVUDYwQTsme3EgQbE-UJMf3I',20,'S2.OFFICE.01','0e4c7269-f3a9-d497-6049-a230809aefed'::uuid,'qollash','Word’da foydalanuvchi harflar tugmalarini bosganda Shiftni ushlab turmay, «kompyuter» o‘rniga «KOMPYUTER» yozildi. Sababini eng to‘g‘ri tushuntiradigan klaviatura holatini tanlang.',ARRAY['Caps Lock o‘chiq, Shift ushlab turilmagan','Caps Lock yoqilgan, Shift ushlab turilmagan','Num Lock o‘chirilgan, Shift ushlab turilmagan','Insert rejimi yoqilgan, Shift ushlab turilmagan']::text[],1,'Caps Lock yoqilganda Shift ushlab turilmasdan bosilgan lotin harf tugmalari katta harf hosil qiladi. Num Lock raqam klaviaturasiga, Insert esa kiritish/ustidan yozish rejimiga tegishli. Shart Shift bosilmaganini aniq belgilaydi.');
DO $guard$
DECLARE n int;
BEGIN
 IF (SELECT count(*) FROM task436_release)<>8 THEN RAISE EXCEPTION 'TASK436_SCOPE_NOT_EIGHT'; END IF;
 IF EXISTS (SELECT 1 FROM task436_release m WHERE array_length(m.opts,1)<>4 OR
    (SELECT count(distinct btrim(t)) FROM unnest(m.opts) t)<>4 OR
    m.correct_idx NOT BETWEEN 0 AND 3 OR length(btrim(m.explanation))<75 OR length(m.stem)<55)
 THEN RAISE EXCEPTION 'TASK436_BAD_OPTIONS_OR_EXPLANATION'; END IF;
 SELECT count(*) INTO n FROM task436_release m
 JOIN attest_ingest.telegram_informatika_pdf_question_candidates s ON s.source_file_id=m.source_id AND s.source_question_no=m.source_no
 JOIN public.constructs c ON c.code=m.construct_code AND c.is_active AND c.group_code IN ('S3.LOGIC','S1.INFO','S4.CODE','S5.WEB','S6.NET','S2.OFFICE')
 JOIN public.lesson_constructs lc ON lc.construct_id=c.id AND lc.lesson_id=m.lesson_id
 JOIN public.lessons l ON l.id=m.lesson_id AND l.status='published'::public.content_status
 WHERE s.source_page_number IS NOT NULL AND s.source_visually_checked AND s.answer_key IS NULL;
 IF n<>8 THEN RAISE EXCEPTION 'TASK436_SOURCE_LESSON_DRIFT_%',n; END IF;
 IF EXISTS(SELECT 1 FROM task436_release m JOIN public.questions q ON q.source_reference=
    'task436:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text)
 THEN RAISE EXCEPTION 'TASK436_ALREADY_EXISTS'; END IF;
 IF EXISTS(SELECT 1 FROM task436_release m JOIN public.questions q ON lower(regexp_replace(q.stem_md,'[[:space:]]+','','g'))=lower(regexp_replace(m.stem,'[[:space:]]+','','g')) AND q.status IN('review','published'))
 THEN RAISE EXCEPTION 'TASK436_DUPLICATE_STEM'; END IF;
END $guard$;
INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT m.question_id,c.subject_id,c.id,c.group_code,'Y1'::public.question_format,m.cognitive::public.cognitive_level,3,m.stem,'[]'::jsonb,true,'review'::public.content_status,NULL,
 'task436:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text,m.lesson_id
FROM task436_release m JOIN public.constructs c ON c.code=m.construct_code;
INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),m.question_id,'a',ord-1,m.opts[ord]
FROM task436_release m CROSS JOIN LATERAL generate_subscripts(m.opts,1) ord;
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT m.question_id,jsonb_build_object('correct_option_id',o.id::text),m.explanation
FROM task436_release m JOIN public.question_options o ON o.question_id=m.question_id AND o.order_idx=m.correct_idx;
DO $quality$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task436_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='review' AND q.is_generated=true AND q.format='Y1'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
 AND (SELECT count(DISTINCT btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=q.id)=4
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')=1
 AND NOT EXISTS (SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=q.id AND f.resolved_at IS NULL AND f.severity IN ('high','critical'));
 IF n<>8 THEN RAISE EXCEPTION 'TASK436_RELEASE_QA_FAILED_%',n; END IF;
END $quality$;
-- Owner-delegated AI editorial publication, no fabricated human editorial signature.
UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
FROM task436_release m WHERE q.id=m.question_id AND q.status='review'::public.content_status;
UPDATE public.question_quality_published_revisions r SET
 release_scope='TASK-436 (2026-10-22): user-authorized AI-assisted PDF-derived NEW Y1 questions; independently evaluated options; no human expert signature'
FROM task436_release m WHERE r.question_id=m.question_id;
DO $post$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task436_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_quality_published_revisions r ON r.question_id=q.id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='published' AND q.is_generated=true AND q.source_lesson_id=m.lesson_id
 AND r.content_fingerprint=public.professional_question_fingerprint(q.id)
 AND r.release_scope LIKE 'TASK-436%'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id)=4;
 IF n<>8 THEN RAISE EXCEPTION 'TASK436_POSTFLIGHT_%_OF_8',n; END IF;
 IF EXISTS (SELECT 1 FROM task436_release m JOIN public.question_editorial_checks e ON e.question_id=m.question_id)
 THEN RAISE EXCEPTION 'TASK436_FALSE_HUMAN_ATTESTATION'; END IF;
END $post$;
COMMIT;

-- TASK-433 first corrected Informatika PDF Y1 release — 31 Python source-backed, locally executed questions (NOT source-original keys).
-- User directed publication and merge on 2026-10-22. AI-assisted, NOT independent human approval.
-- Trusted controlled SQL migration, no existing questions/exam items updated.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='100s';
CREATE TEMP TABLE task433_release (
 source_id text, source_no int, construct_code text, lesson_id uuid, cognitive text,
 stem text, opts text[], correct_idx int, explanation text, question_id uuid default gen_random_uuid(),
 PRIMARY KEY(source_id,source_no),UNIQUE(question_id)
) ON COMMIT DROP;
INSERT INTO task433_release(source_id,source_no,construct_code,lesson_id,cognitive,stem,opts,correct_idx,explanation) VALUES
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',1,'S4.CODE.01','1ffe4d97-417a-68f1-617b-73d27cdfeea2'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
x = 10
x *= 2 + 3
print(x)
```',ARRAY['23','20','50','SyntaxError']::text[],2,'Murakkab *= operatori avval o‘ng tomondagi 2+3=5 ni hisoblaydi, so‘ng x=10·5=50 bo‘ladi. x*=2+3 ifodasi x=x*(2+3) bilan teng kuchli.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',2,'S4.CODE.01','1ffe4d97-417a-68f1-617b-73d27cdfeea2'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
a = 20
b = 10
a //= b - 5
print(a)
```',ARRAY['2','4','15','0']::text[],1,'b−5=5. Butunli bo‘lish (//) natijasi a=20//5=4; bu a//=(b−5) bilan teng kuchli. // operatorining ustuvorligi tayinlashdan yuqori.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',3,'S4.CODE.01','1ffe4d97-417a-68f1-617b-73d27cdfeea2'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
res = 5
res **= 3 // 2
print(res)
```',ARRAY['5','25','125','1']::text[],0,'3//2 butunli bo‘lishi 1 ni beradi. res**=1 amali res=5**1=5 qiladi. Darajaga oshirishdan oldin o‘ng tarafdagi ifoda hisoblanadi.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',4,'S4.CODE.01','1ffe4d97-417a-68f1-617b-73d27cdfeea2'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
x, y = 5, 10
x, y = y, x + y
print(x, y)
```',ARRAY['5 15','10 5','15 10','10 15']::text[],3,'Parallel tayinlashda o‘ng tarafdagi y=10 va x+y=15 eski qiymatlar bilan hisoblanadi, keyin chapdagi x,y ga yoziladi. Natija 10 15.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',5,'S4.CODE.01','1ffe4d97-417a-68f1-617b-73d27cdfeea2'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
a = 16
a %= 5 * 2
print(a)
```',ARRAY['1','2','6','0']::text[],2,'Avval 5*2=10 topiladi, keyin 16%10 qoldig‘i 6 bo‘ladi. %= murakkab tayinlash qoldiqni o‘zgaruvchiga qayta yozadi.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',6,'S4.CODE.02','6a5981a6-9cd9-ffc9-43f3-ed52345a43ab'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print((5 > 3) == (10 <= 10.0))
```',ARRAY['False','True','1','TypeError']::text[],1,'5>3 rost, 10<=10.0 ham rost (butun va float raqamlar qiymati solishtiriladi). Ikkita True qiymati == bilan teng, shuning uchun print(True) chiqaradi.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',7,'S4.CODE.01','1ffe4d97-417a-68f1-617b-73d27cdfeea2'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print("Python" < "python")
```',ARRAY['True','False','None','TypeError']::text[],0,'Python satrlarni Unicode kod nuqtalari bo‘yicha leksik tartibda solishtiradi. Birinchi farqli ''P'' (U+0050) ''p'' (U+0070) dan kichik, shu bois True.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',8,'S4.CODE.02','6a5981a6-9cd9-ffc9-43f3-ed52345a43ab'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print(3 < 5 != 4 > 2)
```',ARRAY['False','0','TypeError','True']::text[],3,'Pythonda zanjirli solishtirish 3<5, 5!=4 va 4>2 shartlarini AND tarzida tekshiradi. Uchalasi rost, umumiy natija True.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',9,'S4.CODE.02','6a5981a6-9cd9-ffc9-43f3-ed52345a43ab'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print(len("olma") == (2 * 2))
```',ARRAY['False','4','True','0']::text[],2,'«olma» satrining uzunligi 4, 2*2 ham 4; tenglik operatori qiymatlarni solishtirib True qaytaradi, son 4 ni emas.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',10,'S4.CODE.02','6a5981a6-9cd9-ffc9-43f3-ed52345a43ab'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print("5" == 5 or 5.0 == 5)
```',ARRAY['False','True','False True','TypeError']::text[],1,'Satr ''5'' va son 5 teng emas, ammo float 5.0 va int 5 qiymat jihatdan teng. False or True ifodasi True beradi, turli son turlarining tengligi bilan satrni farqlash zarur.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',11,'S4.CODE.02','6a5981a6-9cd9-ffc9-43f3-ed52345a43ab'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print(True or False and not True)
```',ARRAY['True','False','None','TypeError']::text[],0,'Ustuvorlik not > and > or. not True=False, False and False=False; so‘ng True or False=True. ORdagi birinchi True qisqa tutashuvga ham sabab bo‘lishi mumkin.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',12,'S4.CODE.02','6a5981a6-9cd9-ffc9-43f3-ed52345a43ab'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print(0 or 5 and 12)
```',ARRAY['0','5','True','12']::text[],3,'and operatori or’dan ustun: 5 and 12 oxirgi rost operand 12 ni qaytaradi. 0 or 12 esa 12 qaytaradi. Python and/or doim bool emas, operand qiymatini qaytarishi mumkin.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',13,'S4.CODE.02','6a5981a6-9cd9-ffc9-43f3-ed52345a43ab'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print(not (5 > 2 or 3 < 1 and 4 == 4))
```',ARRAY['True','None','False','1']::text[],2,'Qavs ichida 5>2 darhol True, or natijasi True. not True esa False. and va or ustuvorlik qoidalari ham ayni natijaga olib keladi.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',14,'S4.CODE.02','6a5981a6-9cd9-ffc9-43f3-ed52345a43ab'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print("" or "Dasturchi")
```',ARRAY['False','Dasturchi','Bo‘sh satr','True']::text[],1,'Bo‘sh satr mantiqiy kontekstda falsy bo‘ladi. Python or operatori birinchi rost operandni qaytaradi, shuning uchun bo‘sh satr o‘rniga «Dasturchi» chop etiladi.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',15,'S4.CODE.02','6a5981a6-9cd9-ffc9-43f3-ed52345a43ab'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print(5 > 3 and "A" and 7.5)
```',ARRAY['7.5','True','A','False']::text[],0,'5>3 True; bo‘sh bo‘lmagan ''A'' ham rost, so‘ng 7.5 ham rost. and oxirgi baholangan operand 7.5 ni qaytaradi; natija True bo‘lishi shart emas.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',16,'S4.CODE.02','6a5981a6-9cd9-ffc9-43f3-ed52345a43ab'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print("At" in "Atestatsiya" and "test" not in "Atestatsiya")
```',ARRAY['True','None','TypeError','False']::text[],3,'«At» boshida mavjud; «test» esa Atestatsiya satrining ichida (2-5 pozitsiyalar) mavjud. Shuning uchun «test» not in ... False; True and False = False.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',18,'S4.CODE.02','6a5981a6-9cd9-ffc9-43f3-ed52345a43ab'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print("" in "Python")
```',ARRAY['False','True','None','TypeError']::text[],1,'Python satr a’zoligida bo‘sh satr har qanday satrning substringi hisoblanadi. Shuning uchun '''' in ''Python'' True, hatto bo‘sh satr ham bo‘sh satr ichida mavjud.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',19,'S4.CODE.02','6a5981a6-9cd9-ffc9-43f3-ed52345a43ab'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print("a" not in "olma" == False)
```',ARRAY['False','True','None','TypeError']::text[],0,'Python zanjirli solishtirishni (''a'' not in ''olma'') and (''olma'' == False) sifatida baholaydi. ''a'' satrda bor, birinchi qism False; umumiy natija False.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',20,'S4.CODE.02','6a5981a6-9cd9-ffc9-43f3-ed52345a43ab'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print("info" in "Informatika".lower())
```',ARRAY['False','info','TypeError','True']::text[],3,'lower() «Informatika» ni «informatika» ga aylantiradi va unda boshidagi «info» substringi mavjud. Natija True bo‘ladi; lower operatori case-sensitive tekshiruvdan oldin ishlaydi.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',23,'S4.CODE.01','1ffe4d97-417a-68f1-617b-73d27cdfeea2'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
flag = True
number = 1
print(flag is number, flag == number)
```',ARRAY['False True','True True','False False','True False']::text[],0,'bool True va int 1 bir xil obyekt emas, shu sabab is False. Ammo Python tenglik solishtirishida True==1 True, chunki bool int kichik turidir. Identiklik va qiymat tengligi turli amallar.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',24,'S4.CODE.03','7d748ba9-18eb-cfff-4d5a-ea9313a1a52f'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
a = [1, 2]
b = [1, 2]
print(a is not b and a == b)
```',ARRAY['False','None','TypeError','True']::text[],3,'Har ikkala ro‘yxat bir xil qiymatlar bilan alohida yaratilgani uchun a is not b True. Elementlar tengligi a==b ham True. Ikkalasi and bilan bog‘langani uchun True.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',25,'S4.CODE.03','7d748ba9-18eb-cfff-4d5a-ea9313a1a52f'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
p = [5, 10]
q = p
print(p is q)
```',ARRAY['False','[5, 10]','True','TypeError']::text[],2,'q=p alohida ro‘yxat nusxasini emas, p murojaat qilayotgan bir xil ro‘yxat obyektiga ikkinchi havolani yaratadi. Obyekt identifikatori bir xil, p is q=True.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',26,'S4.CODE.01','1ffe4d97-417a-68f1-617b-73d27cdfeea2'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print(6 & 3 + 1)
```',ARRAY['0','4','7','2']::text[],1,'Python operator ustuvorligida qo‘shish & bitli ANDdan oldin hisoblanadi: 3+1=4. Keyin 6 (110₂) & 4 (100₂) = 4 (100₂).'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',27,'S4.CODE.01','1ffe4d97-417a-68f1-617b-73d27cdfeea2'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print(~10)
```',ARRAY['-11','-10','9','-9']::text[],0,'Python bitli NOT uchun ~n = -n-1. n=10 bo‘lganda -11 hosil bo‘ladi; bu cheksiz ishorali ikkilik ta’rifiga mos.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',28,'S4.CODE.01','1ffe4d97-417a-68f1-617b-73d27cdfeea2'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print(12 ^ 5)
```',ARRAY['17','7','8','9']::text[],3,'12=1100₂, 5=0101₂. XOR amali faqat bittasi 1 bo‘lgan bitlarni yoqadi: 1001₂=9₁₀. ^ operatori Python’da daraja emas, XOR.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',29,'S4.CODE.01','1ffe4d97-417a-68f1-617b-73d27cdfeea2'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print(3 << 3)
```',ARRAY['9','12','24','27']::text[],2,'Chapga 3 bit surish musbat 3 sonini 2³=8 ga ko‘paytirishga teng. 3×8=24; 3 ning ikkilik 11 ko‘rinishi 11000 ga aylanadi.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',31,'S4.CODE.01','1ffe4d97-417a-68f1-617b-73d27cdfeea2'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print(2 ** 3 ** 2 * 2)
```',ARRAY['1024','128','512','4096']::text[],0,'Darajaga oshirish o‘ngdan chapga birlashadi: 3**2=9, 2**9=512. So‘ng *2 bilan 1024 chiqadi. (2**3)**2 deb hisoblash xato.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',32,'S4.CODE.01','1ffe4d97-417a-68f1-617b-73d27cdfeea2'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print(19.0 // 4 + 2)
```',ARRAY['6','6.75','4.0','6.0']::text[],3,'19.0//4 floor division = 4.0 float qaytaradi; 4.0+2 = 6.0 float. Qiymat 6 ga teng bo‘lsa ham print natijasida o‘nlik nuqta chiqadi.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',33,'S4.CODE.01','1ffe4d97-417a-68f1-617b-73d27cdfeea2'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print(-13 % 4)
```',ARRAY['-1','1','3','-3']::text[],2,'Python qoldiq uchun -13 = (-4)·4 + 3. Bo‘luvchi 4 musbat bo‘lgani uchun qoldiq 0..3 oralig‘ida, natija 3.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',34,'S4.CODE.01','1ffe4d97-417a-68f1-617b-73d27cdfeea2'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print((True + True) ** 3 - False)
```',ARRAY['6','8','7','9']::text[],1,'Python bool arifmetik kontekstda 1 va 0 kabi qatnashadi. True+True=2, 2**3=8, False=0; yakuniy son 8.'),
('1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z',35,'S4.CODE.01','1ffe4d97-417a-68f1-617b-73d27cdfeea2'::uuid,'qollash','Python 3 dasturining quyidagi kodida `print` qanday natija chiqaradi? Kiritish talab qilinmaydi.

```python
print(-11 // 3)
```',ARRAY['-4','-3','-3.66','3']::text[],0,'Python butunli bo‘lish // matematik floor, ya’ni natijani pastga — minus cheksizlik tomonga yaxlitlaydi. -11/3≈-3.67; floor -4.');
DO $guard$
DECLARE n int;
BEGIN
 IF (SELECT count(*) FROM task433_release)<>31 THEN RAISE EXCEPTION 'TASK433_SCOPE_NOT_THIRTY_ONE'; END IF;
 IF EXISTS (SELECT 1 FROM task433_release m WHERE array_length(m.opts,1)<>4 OR
    (SELECT count(distinct btrim(t)) FROM unnest(m.opts) t)<>4 OR
    m.correct_idx NOT BETWEEN 0 AND 3 OR length(btrim(m.explanation))<75 OR length(m.stem)<55)
 THEN RAISE EXCEPTION 'TASK433_BAD_OPTIONS_OR_EXPLANATION'; END IF;
 SELECT count(*) INTO n FROM task433_release m
 JOIN attest_ingest.telegram_informatika_pdf_question_candidates s ON s.source_file_id=m.source_id AND s.source_question_no=m.source_no
 JOIN public.constructs c ON c.code=m.construct_code AND c.is_active AND c.group_code IN ('S4.CODE')
 JOIN public.lesson_constructs lc ON lc.construct_id=c.id AND lc.lesson_id=m.lesson_id
 JOIN public.lessons l ON l.id=m.lesson_id AND l.status='published'::public.content_status
 WHERE s.source_page_number IS NOT NULL AND s.source_visually_checked AND s.answer_key IS NULL;
 IF n<>31 THEN RAISE EXCEPTION 'TASK433_SOURCE_LESSON_DRIFT_%',n; END IF;
 IF EXISTS(SELECT 1 FROM task433_release m JOIN public.questions q ON q.source_reference=
    'task433:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text)
 THEN RAISE EXCEPTION 'TASK433_ALREADY_EXISTS'; END IF;
 IF EXISTS(SELECT 1 FROM task433_release m JOIN public.questions q ON lower(regexp_replace(q.stem_md,'[[:space:]]+','','g'))=lower(regexp_replace(m.stem,'[[:space:]]+','','g')) AND q.status IN('review','published'))
 THEN RAISE EXCEPTION 'TASK433_DUPLICATE_STEM'; END IF;
END $guard$;
INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT m.question_id,c.subject_id,c.id,c.group_code,'Y1'::public.question_format,m.cognitive::public.cognitive_level,3,m.stem,'[]'::jsonb,true,'review'::public.content_status,NULL,
 'task433:pdf-editorial:20261022:'||m.source_id||':q'||m.source_no::text,m.lesson_id
FROM task433_release m JOIN public.constructs c ON c.code=m.construct_code;
INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),m.question_id,'a',ord-1,m.opts[ord]
FROM task433_release m CROSS JOIN LATERAL generate_subscripts(m.opts,1) ord;
INSERT INTO public.question_keys(question_id,payload,explanation_md)
SELECT m.question_id,jsonb_build_object('correct_option_id',o.id::text),m.explanation
FROM task433_release m JOIN public.question_options o ON o.question_id=m.question_id AND o.order_idx=m.correct_idx;
DO $quality$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task433_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='review' AND q.is_generated=true AND q.format='Y1'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
 AND (SELECT count(DISTINCT btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=q.id)=4
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')=1
 AND NOT EXISTS (SELECT 1 FROM public.question_quality_findings f WHERE f.question_id=q.id AND f.resolved_at IS NULL AND f.severity IN ('high','critical'));
 IF n<>31 THEN RAISE EXCEPTION 'TASK433_RELEASE_QA_FAILED_%',n; END IF;
END $quality$;
-- Owner-delegated AI editorial publication, no fabricated human editorial signature.
UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
FROM task433_release m WHERE q.id=m.question_id AND q.status='review'::public.content_status;
UPDATE public.question_quality_published_revisions r SET
 release_scope='TASK-433 (2026-10-22): user-authorized AI-assisted PDF-derived NEW Y1 questions; independently evaluated options; no human expert signature'
FROM task433_release m WHERE r.question_id=m.question_id;
DO $post$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM task433_release m JOIN public.questions q ON q.id=m.question_id
 JOIN public.question_quality_published_revisions r ON r.question_id=q.id
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='published' AND q.is_generated=true AND q.source_lesson_id=m.lesson_id
 AND r.content_fingerprint=public.professional_question_fingerprint(q.id)
 AND r.release_scope LIKE 'TASK-433%'
 AND public.is_question_official_mock_eligible(q.id)
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id)=4;
 IF n<>31 THEN RAISE EXCEPTION 'TASK433_POSTFLIGHT_%_OF_31',n; END IF;
 IF EXISTS (SELECT 1 FROM task433_release m JOIN public.question_editorial_checks e ON e.question_id=m.question_id)
 THEN RAISE EXCEPTION 'TASK433_FALSE_HUMAN_ATTESTATION'; END IF;
END $post$;
COMMIT;

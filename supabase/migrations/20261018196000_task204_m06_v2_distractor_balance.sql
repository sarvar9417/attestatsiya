-- TASK-204: editorial QA balancing on *nonpublished review* Y1 options only.
-- Correct answers and question semantics remain unchanged; reviewers must still approve.
BEGIN;
CREATE TEMP TABLE _algo_option_polish(code text,old_text text,new_text text) ON COMMIT DROP;
INSERT INTO _algo_option_polish VALUES
('ALG-01-024','Barcha natijalarni doimo manfiy qilish','Masaladagi barcha natijalarni belgilashdan oldin manfiy qilish'),
('ALG-01-024','Shartlar sonini har doim nolga tushirish','Algoritmning barcha tarmoqlanish shartlarini oldindan olib tashlash'),
('ALG-01-024','Diagrammadagi har bir blokni tenglashtirish','Diagrammaning barcha bloklarini bir xil o‘lchamda joylashtirish'),
('ALG-01-028','Har qanday istisno avtomatik musbat son','Nolga bo‘lish natijasini avtomatik ravishda musbat son deb olish'),
('ALG-01-028','Dastur xatosi masala shartidan mustaqil','Masala shartidagi son talabi bu holatga umuman taalluqli emas'),
('ALG-01-028','Barcha talablar mutlaqo bajarilgan','Maxsus xabar son bo‘lmasa ham barcha talablar to‘liq bajarilgan'),
('ALG-04-012','Shart matn ko‘rinishida yozilishi','Sikl shartining oddiy so‘zli ifoda ko‘rinishida aniq berilishi'),
('ALG-04-012','Chiqarish amali sikldan keyin kelishi','Natijani ekranga chiqarish amali sikl tugagandan keyin kelishi'),
('ALG-04-012','Jamlagich nol bilan boshlanishi','Jamlagichga birinchi hisoblashdan oldin boshlang‘ich nol berilishi'),
('ALG-05-004','Albatta uchta ichma-ich sikl','Kamida uchta alohida takrorlash tuzilmasi ketma-ket bajarilishi'),
('ALG-05-004','Albatta ikki xil dasturlash tili','Bir masalaning kamida ikkita turli dasturlash tilida yozilishi'),
('ALG-05-004','Faqat bitta arifmetik formula','Barcha bajariladigan amallar faqat bitta arifmetik formula bo‘lishi'),
('ALG-05-007','Faqat a+b ni bir marta hisoblash','Berilgan ikki sonning yig‘indisini faqat bir marta hisoblab chiqarish'),
('ALG-05-007','Bitta sonni ekranga chiqarish','Kiritilgan bitta sonni hech qanday shartsiz ekranga chiqarish'),
('ALG-05-007','Faqat qiymatlarni o‘qib tugatish','Bir nechta kirish qiymatlarini olib, qo‘shimcha amal bajarmay tugatish'),
('ALG-06-030','Eng oddiy normal holatni tekshirish','Ruxsat etilgan oraliqdagi eng oddiy normal holatni sinab ko‘rish'),
('ALG-06-030','Tasodifiy hisoblashni tezlashtirish','Tasodifiy hisoblashlarning bajarilish tezligini oshirishni tekshirish'),
('ALG-06-030','Algoritmga yangi sintaksis qo‘shish','Algoritmdagi siklga yangi dasturlash tili sintaksisini qo‘shish'),
('ALG-07-006','Har qanday holda nol','Maxsus tanlangan nol qiymati'),
('ALG-07-006','Har qanday holda 1000','Oldindan belgilangan 1000 soni'),
('ALG-07-006','Har qanday holda 1','Har doim birdan boshlanadi'),
('ALG-07-010','Faqat EKUB hisoblanib qoladi','Maksimal qiymat o‘rniga EKUB hisoblab qo‘yiladi'),
('ALG-07-010','Har doim to‘g‘ri maksimal topiladi','Algoritm baribir barcha manfiy sonlar ichidan maksimumni topadi'),
('ALG-07-010','Har doim saralash bajariladi','Massiv avval avtomatik tartiblab chiqiladi, keyin maksimum olinadi'),
('ALG-08-001','Faqat o‘zgaruvchi nomlari','Dasturdagi o‘zgaruvchilar nomi va ularning yozilish uslubi'),
('ALG-08-001','Matn rangi va shrift turi','Dastur kodi matnining rangi, shrifti va ekrandagi joylashuvi'),
('ALG-08-001','Faqat fayl kengaytmasi','Ishlatilgan dastur faylining nomi va fayl kengaytmasi');
DO $$
DECLARE matched int;
BEGIN
 IF (SELECT count(*) FROM _algo_option_polish)<>27 THEN RAISE EXCEPTION 'Expected 27 proposed revisions'; END IF;
 SELECT count(*) INTO matched FROM _algo_option_polish f
 JOIN public.questions q ON q.source_reference='algoritmlash-v2:'||f.code AND q.status='review'
 JOIN public.question_options o ON o.question_id=q.id AND o.content_md=f.old_text
 JOIN public.question_keys k ON k.question_id=q.id AND o.id::text<>k.payload->>'correct_option_id';
 IF matched<>27 THEN RAISE EXCEPTION 'Expected 27 unchanged review distractors but found %',matched; END IF;
END $$;
UPDATE public.question_options o
SET content_md=f.new_text
FROM public.questions q JOIN _algo_option_polish f ON q.source_reference='algoritmlash-v2:'||f.code
WHERE o.question_id=q.id AND q.status='review' AND o.content_md=f.old_text;
DO $$
DECLARE inconsistent int;
BEGIN
 SELECT count(*) INTO inconsistent FROM _algo_option_polish f
 JOIN public.questions q ON q.source_reference='algoritmlash-v2:'||f.code
 JOIN public.question_options o ON o.question_id=q.id AND o.content_md=f.new_text;
 IF inconsistent<>27 THEN RAISE EXCEPTION 'Updated distractor count mismatch: %',inconsistent; END IF;
END $$;
COMMIT;
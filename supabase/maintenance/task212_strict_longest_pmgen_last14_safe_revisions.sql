-- TASK212 owner-waived fourteen PM.GEN immutable revisions, reviewed option changes.
-- Privileged manual maintenance only; rehearse replacing final COMMIT with ROLLBACK.
BEGIN;
SET LOCAL lock_timeout='20s';SET LOCAL statement_timeout='180s';
CREATE TEMP TABLE pmgen14(ref text,ord integer,old_text text,new_text text,PRIMARY KEY(ref,ord)) ON COMMIT DROP;
INSERT INTO pmgen14 VALUES ('authored:m15-topictest-20261018:7:4',2,'Akademik qobiliyat — ilmiy ma’lumotni chuqur o‘zlashtirish','Akademik qobiliyat — ilmiy ma’lumotni mustaqil o‘rganib, chuqur o‘zlashtirish'),
('authored:m15-topictest-20261018:7:5',2,'Perseptiv qobiliyat — o‘quvchining hissiy holatini anglash','Perseptiv qobiliyat — o‘quvchining hissiy holatini tana harakatidan anglash'),
('authored:m15-topictest-20261018:7:8',2,'Tashkilotchilik qobiliyati — sinf ishini rejalashtirish','Tashkilotchilik qobiliyati — sinf ishini rejalab, vazifalarni muvofiqlashtirish'),
('authored:m15-topictest-20261018:8:5',2,'Differensial ta’lim — faqat sinfni qobiliyat bo‘yicha ajratish','Differensial ta’lim — sinfni faqat qobiliyat darajasiga qarab doimiy guruhlarga ajratish'),
('authored:pedagogy-pdf-corpus:v1:PM.GEN.01:001',1,'Faqat maktab binosining texnik holatini','Faqat maktab binosi va jihozlarining texnik holatini o‘rganishni'),
('authored:pedagogy-pdf-corpus:v1:PM.GEN.01:001',2,'Faqat o‘quvchining tibbiy tashxislarini','Faqat o‘quvchining tibbiy tashxislarini ro‘yxatga olishni'),
('authored:pedguli-html-concepts:v3:PM.GEN.05:211',1,'Yig‘ilishdan keyin topshiriladigan hisobot shakli va hajmini oldindan belgilash','Yig‘ilishdan keyin topshiriladigan hisobotning shakli, hajmi va rasmiylashtirish muddatini belgilash'),
('authored:pedguli-topic-study:v2:PM.GEN.08:121',1,'Har bir a’zo barcha bo‘limni uyda mustaqil o‘rganib keladi','Har bir a’zo barcha bo‘limni uyda mustaqil o‘rganib, so‘ng guruh oldida yakka hisobot beradi'),
('reserve-2026:T060-R5-PMGEN-M05',1,'Har doim mehnat tarbiyasini','Barcha holatda faqat mehnat tarbiyasini'),
('reserve-2026:T060-R5-PMGEN-M05',2,'Har doim estetik tarbiyani','Har safar estetik tarbiyani ustun qo‘yish'),
('reserve-2026:T060-R5-PMGEN-M05',3,'Tasodifiy bittasini','Mazmunga qaramay tasodifiy bittasini tanlash'),
('reserve-2026:T060-R5-PMGEN-M06',1,'Tarbiya maqsadini yo‘q qiladi','Tarbiya maqsadini butunlay yo‘q qiladi'),
('reserve-2026:T060-R5-PMGEN-M06',2,'Har qanday qoida bekor bo‘ladi','Har qanday o‘rnatilgan qoida bekor bo‘ladi'),
('reserve-2026:T060-R5-PMGEN-M06',3,'Faqat vaqt yo‘qotadi','Faqat vaqt sarflaydi, natijaga ta’sir etmaydi'),
('reserve-2026:T060-R5-PMGEN-M07',1,'Nazariya qancha ko‘p bo‘lsa shuncha yaxshi','Nazariyaga ko‘proq vaqt ajratish amaliy maqsadning doimiy talabidir'),
('reserve-2026:T060-R5-PMGEN-M07',2,'Amaliyot maqsadga aloqasiz','Amaliy mashg‘ulot o‘qitish natijasiga deyarli ta’sir qilmaydi'),
('reserve-2026:T060-R5-PMGEN-M07',3,'Dars turi hech qachon maqsadga bog‘liq emas','Dars turi va vaqt taqsimoti o‘quv maqsadiga umuman bog‘lanmaydi'),
('reserve-2026:T060-R5-PMGEN-Q10',1,'Darhol bir tomonning gapiga ishonib jazo berish','Darhol bir tomonning gapiga asoslanib boshqasini tinglamay jazo berish'),
('reserve-2026:T060-R5-PMGEN-Q10',2,'Muammoni e’tiborsiz qoldirish','Muammoni kuchaymagunicha butunlay e’tiborsiz qoldirib, taraflar bilan suhbatlashmaslik'),
('reserve-2026:T060-R5-PMGEN-Q10',3,'Sinf chatiga barcha tafsilotni yozish','Sinf chatiga mojarodagi barcha shaxsiy tafsilotlarni biryoqlama tarzda yozish'),
('revision:pedagogy:75000000-0000-4000-8000-000000000022',1,'Chalg‘igan o‘quvchilarni barcha faoliyatdan chetlatib, darsni davom ettirish','Chalg‘igan o‘quvchilarni barcha faoliyatdan chetlatib, butun dars davomida kuzatuvchi bo‘lib qoldirish'),
('revision:pedagogy:da2c892a-0780-4aca-aa90-768eb8128e81',1,'Asosan o‘quvchining baholari va nazorat ishlaridagi umumiy reytingini hisobga olishni','Asosan o‘quvchining baholari va nazorat ishlaridagi reytingini hisobga olib, darsni shunga moslashtirishni'),
('revision:pedagogy:ec65cd57-a734-4ce2-a0fb-8007de80b5b0',1,'Mazmunni o‘quvchining yoshini hisobga olmasdan faqat og‘zaki bayon etish','Mazmunni o‘quvchining yoshini va ehtiyojini hisobga olmasdan faqat og‘zaki bayon etish');
DO $task$
DECLARE actor uuid;n int;rec record;rev uuid;
BEGIN
 SELECT count(*) INTO n FROM profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
 IF n<>1 THEN RAISE EXCEPTION 'PMGEN14_ADMIN_%',n; END IF;
 SELECT id INTO actor FROM profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
 SELECT count(*) INTO n FROM pmgen14 e JOIN questions q ON q.source_reference=e.ref AND q.status='published' AND q.group_code='PM.GEN' AND q.format='Y1' JOIN question_options o ON o.question_id=q.id AND o.order_idx=e.ord AND o.content_md=e.old_text AND trim(o.side)='a' JOIN question_keys k ON k.question_id=q.id WHERE o.id::text<>k.payload->>'correct_option_id';
 IF n<>23 THEN RAISE EXCEPTION 'PMGEN14_DRIFT_%',n; END IF;
 SELECT count(*) INTO n FROM (SELECT ref,count(*) c FROM pmgen14 GROUP BY ref) m WHERE c>=1;
 IF n<>14 THEN RAISE EXCEPTION 'PMGEN14_GROUPS_%',n; END IF;
 FOR rec IN
  SELECT q.id source_id,q.source_reference ref,array_agg(coalesce(e.new_text,o.content_md) ORDER BY o.order_idx,o.id) FILTER(WHERE o.id::text<>(k.payload->>'correct_option_id')) wrong_texts
  FROM questions q JOIN (SELECT DISTINCT ref FROM pmgen14) f ON f.ref=q.source_reference JOIN question_options o ON o.question_id=q.id AND trim(o.side)='a'
  JOIN question_keys k ON k.question_id=q.id LEFT JOIN pmgen14 e ON e.ref=q.source_reference AND e.ord=o.order_idx
  WHERE q.status='published' GROUP BY q.id,q.source_reference
 LOOP
   IF array_length(rec.wrong_texts,1)<>3 THEN RAISE EXCEPTION 'PMGEN14_WRONG_OPTION_%',rec.ref;END IF;
   INSERT INTO pedagogy_revision_queue(source_question_id,reason) VALUES(rec.source_id,'Owner strict-longest KS 14/14 semantic balanced revision 2026-10-18');
   INSERT INTO pedagogy_rewrite_proposals(source_question_id,proposed_distractors,provenance,proposal_status) VALUES(rec.source_id,rec.wrong_texts,'Owner-authorized AI semantic distractor balancing; no external expert claimed','draft');
   rev:=stage_pedagogy_revision(rec.source_id,actor);
   INSERT INTO pedagogy_owner_release_waivers(question_id,authorized_by,content_fingerprint,authority,provenance,source_question_id) VALUES(rev,actor,professional_question_fingerprint(rev),'owner_explicit_no_external_expert_20261018','Owner authorized strict-longest Y1 correction. Old question archived, correct answer and explanation unchanged, no external expert signoff claimed.',rec.source_id);
   PERFORM publish_pedagogy_revision(rev,actor);
 END LOOP;
 SELECT count(*) INTO n FROM pedagogy_owner_release_waivers w JOIN questions q ON q.id=w.question_id JOIN questions old ON old.id=w.source_question_id WHERE w.provenance LIKE 'Owner authorized strict-longest Y1 correction.%' AND q.status='published' AND old.status='archived';
 IF n<>55 THEN RAISE EXCEPTION 'PMGEN14_REVISIONS_26_EXPECTED_GOT_%',n;END IF;
 WITH x AS(SELECT q.id,max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) FILTER(WHERE o.id::text=k.payload->>'correct_option_id') cw,max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) FILTER(WHERE o.id::text<>k.payload->>'correct_option_id') mw,min(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) mn,max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) mx,count(DISTINCT lower(trim(o.content_md))) distinct_opts FROM questions q JOIN question_keys k ON k.question_id=q.id JOIN question_options o ON o.question_id=q.id AND trim(o.side)='a' WHERE q.group_code='PM.GEN' AND q.status='published' AND q.format='Y1' GROUP BY q.id) SELECT count(*) INTO n FROM x WHERE cw>mw;
 IF n<>0 THEN RAISE EXCEPTION 'PMGEN14_REMAINING_STRICT_LONGEST_%',n;END IF;
END $task$;
COMMIT;

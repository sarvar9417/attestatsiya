-- TASK212 owner-waived fourteen PM.GEN immutable revisions, reviewed option changes.
-- Privileged manual maintenance only; rehearse replacing final COMMIT with ROLLBACK.
BEGIN;
SET LOCAL lock_timeout='20s';SET LOCAL statement_timeout='180s';
CREATE TEMP TABLE pmmet10(ref text,ord integer,old_text text,new_text text,PRIMARY KEY(ref,ord)) ON COMMIT DROP;
INSERT INTO pmmet10 VALUES ('authored:pedagogy-pdf-corpus:v1:PM.MET.03:001',1,'Darhol barcha metod va materiallarni almashtirish','Barcha metod va materiallarni sababni tekshirmasdan birdaniga almashtirish'),
('authored:pedguli-html-concepts:v3:PM.MET.03:224',1,'O‘quvchi o‘rniga to‘g‘ri kodni qayta yozib, natijani ko‘rsatib berish','O‘quvchi o‘rniga to‘g‘ri kodni qayta yozib, uning xato topish jarayonini tashlab natijani ko‘rsatish'),
('authored:pedguli-topic-audit:v4:PM.MET.02:307',2,'Javobni to‘liq aytib berish','Javobni darhol tayyor holda aytib berish'),
('authored:pedguli-topic-audit:v4:PM.MET.02:307',3,'Natijani baholashni bekor qilish','Bosqichlarni tekshirmasdan natijani baholashni bekor qilish'),
('authored:pedguli-topic-audit:v4:PM.MET.02:307',4,'Masalani mavzudan uzib tashlash','Masalani asosiy mavzudan butunlay uzib tashlash'),
('authored:pedguli-topic-audit:v4:PM.MET.02:308',1,'Harakat va shart bloklarining ta’riflarini ketma-ket ko‘chirib, kodni sinamaslik','Harakat va shart bloklarining ta’riflarini ketma-ket ko‘chirib, skriptni umuman amalda sinamaslik'),
('authored:pedguli-topic-audit:v4:PM.MET.02:309',1,'Har bir ekspert guruhida o‘rganilgan javobni faqat o‘zlari uchun saqlash','Har bir ekspert guruhida o‘rganilgan misol va javoblarni qolgan asosiy guruhdan yashirib saqlash'),
('authored:pedguli-topic-audit:v4:PM.MET.02:311',2,'Xabar sarlavhasini muallif va sanaga qaramasdan qayta yozib olish','Xabar sarlavhasini muallifi, e’lon qilingan sanasi va manba dalillarini tekshirmasdan qayta yozib olish'),
('authored:pedguli-topic-audit:v4:PM.MET.02:312',1,'Sinfda qo‘l ko‘targanlarning umumiy soniga qarab hamma tushungan deb bilish','Sinfda qo‘l ko‘targanlarning umumiy soniga qarab, alohida natijalarni tekshirmay hamma tushungan deb bilish'),
('authored:pedguli-topic-audit:v4:PM.MET.03:314',1,'Bir necha qatorni birdan almashtirib, keyingi natijani faqat oxirida ko‘rish','Bir necha qatorni birdan almashtirib, o‘zgarishlarni qayd etmasdan keyingi natijani faqat oxirida ko‘rish'),
('authored:pedguli-topic-audit:v4:PM.MET.03:315',2,'Kodlash muammosini tekshirmasdan, faylni boshqa nomda saqlatib ko‘rish','Kodlash muammosini tekshirmasdan, faylni yana boshqa nomda saqlab, belgilar avvalgi holga qaytishini kutish'),
('authored:pedguli-topic-audit:v4:PM.MET.03:317',1,'Natija tartibini qayta ko‘rdingmi, jadval ranglarini tekshirib chiqqanmisan?','Natija tartibini va jadval ranglarini qayta ko‘rib, tanlash shartini tekshirmasdan xulosa qildingmi?');
DO $task$
DECLARE actor uuid;n int;rec record;rev uuid;
BEGIN
 SELECT count(*) INTO n FROM profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
 IF n<>1 THEN RAISE EXCEPTION 'PMMET10_ADMIN_%',n; END IF;
 SELECT id INTO actor FROM profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
 SELECT count(*) INTO n FROM pmmet10 e JOIN questions q ON q.source_reference=e.ref AND q.status='published' AND q.group_code='PM.MET' AND q.format='Y1' JOIN question_options o ON o.question_id=q.id AND o.order_idx=e.ord AND o.content_md=e.old_text AND trim(o.side)='a' JOIN question_keys k ON k.question_id=q.id WHERE o.id::text<>k.payload->>'correct_option_id';
 IF n<>12 THEN RAISE EXCEPTION 'PMMET10_DRIFT_%',n; END IF;
 SELECT count(*) INTO n FROM (SELECT ref,count(*) c FROM pmmet10 GROUP BY ref) m WHERE c>=1;
 IF n<>10 THEN RAISE EXCEPTION 'PMMET10_GROUPS_%',n; END IF;
 FOR rec IN
  SELECT q.id source_id,q.source_reference ref,array_agg(coalesce(e.new_text,o.content_md) ORDER BY o.order_idx,o.id) FILTER(WHERE o.id::text<>(k.payload->>'correct_option_id')) wrong_texts
  FROM questions q JOIN (SELECT DISTINCT ref FROM pmmet10) f ON f.ref=q.source_reference JOIN question_options o ON o.question_id=q.id AND trim(o.side)='a'
  JOIN question_keys k ON k.question_id=q.id LEFT JOIN pmmet10 e ON e.ref=q.source_reference AND e.ord=o.order_idx
  WHERE q.status='published' GROUP BY q.id,q.source_reference
 LOOP
   IF array_length(rec.wrong_texts,1)<>3 THEN RAISE EXCEPTION 'PMMET10_WRONG_OPTION_%',rec.ref;END IF;
   INSERT INTO pedagogy_revision_queue(source_question_id,reason) VALUES(rec.source_id,'Owner strict-longest KS 10/10 semantic balanced revision 2026-10-18');
   INSERT INTO pedagogy_rewrite_proposals(source_question_id,proposed_distractors,provenance,proposal_status) VALUES(rec.source_id,rec.wrong_texts,'Owner-authorized AI semantic distractor balancing; no external expert claimed','draft');
   rev:=stage_pedagogy_revision(rec.source_id,actor);
   INSERT INTO pedagogy_owner_release_waivers(question_id,authorized_by,content_fingerprint,authority,provenance,source_question_id) VALUES(rev,actor,professional_question_fingerprint(rev),'owner_explicit_no_external_expert_20261018','Owner authorized strict-longest Y1 correction. Old question archived, correct answer and explanation unchanged, no external expert signoff claimed.',rec.source_id);
   PERFORM publish_pedagogy_revision(rev,actor);
 END LOOP;
 SELECT count(*) INTO n FROM pedagogy_owner_release_waivers w JOIN questions q ON q.id=w.question_id JOIN questions old ON old.id=w.source_question_id WHERE w.provenance LIKE 'Owner authorized strict-longest Y1 correction.%' AND q.status='published' AND old.status='archived';
 IF n<>65 THEN RAISE EXCEPTION 'PMMET10_REVISIONS_26_EXPECTED_GOT_%',n;END IF;
 WITH x AS(SELECT q.id,max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) FILTER(WHERE o.id::text=k.payload->>'correct_option_id') cw,max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) FILTER(WHERE o.id::text<>k.payload->>'correct_option_id') mw,min(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) mn,max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) mx,count(DISTINCT lower(trim(o.content_md))) distinct_opts FROM questions q JOIN question_keys k ON k.question_id=q.id JOIN question_options o ON o.question_id=q.id AND trim(o.side)='a' WHERE q.group_code='PM.MET' AND q.status='published' AND q.format='Y1' GROUP BY q.id) SELECT count(*) INTO n FROM x WHERE cw>mw;
 IF n<>0 THEN RAISE EXCEPTION 'PMMET10_REMAINING_STRICT_LONGEST_%',n;END IF;
END $task$;
COMMIT;

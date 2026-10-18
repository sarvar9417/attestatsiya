-- TASK212 owner-waived six KS immutable revisions, reviewed option changes.
-- Privileged manual maintenance only; rehearse replacing final COMMIT with ROLLBACK.
BEGIN;
SET LOCAL lock_timeout='20s';SET LOCAL statement_timeout='180s';
CREATE TEMP TABLE ks6(ref text,ord integer,old_text text,new_text text,PRIMARY KEY(ref,ord)) ON COMMIT DROP;
INSERT INTO ks6 VALUES ('authored:pedguli-topic-study:v2:KS.05:106',1,'Barcha raqamli mashg‘ulotlarni bekor qilish','Barcha raqamli mashg‘ulotlarni shu o‘quvchi uchun butunlay bekor qilish'),
('authored:pedguli-topic-study:v2:KS.05:106',2,'Bu o‘quvchi alohida maqsadsiz topshiriq olishi kerak','Bu o‘quvchiga umumiy dars maqsadidan uzilgan oddiyroq topshiriq berish'),
('authored:pedguli-topic-study:v2:KS.05:106',4,'Faqat doskada juda kichik shrift ishlatish','Matnni juda kichik shrift bilan doskada ko‘rsatishda davom etish'),
('authored:professional-15:v1:KS.04:7',1,'Xatoni butun sinf oldida masxara qilish','O‘quvchining xatosini butun sinf oldida masxara qilib ko‘rsatish'),
('authored:professional-15:v1:KS.04:7',2,'Faqat bir guruhni tinglash','Faqat faol o‘quvchilar guruhining fikrini muntazam tinglash'),
('authored:professional-15:v1:KS.04:7',4,'O‘quvchilar fikrini taqiqlash','O‘quvchilar fikrini cheklab, o‘qituvchi qarorini yakka belgilash'),
('authored:professional-15:v1:KS.05:9',2,'Nam qo‘l bilan elektr jihoziga tegish','Nam qo‘l bilan elektr jihoziga tekshirmasdan tegish'),
('authored:professional-15:v1:KS.05:9',3,'Rozetkalarni ochiq qoldirish','Rozetkalarni himoya qopqog‘isiz ochiq holda qoldirish'),
('authored:professional-15:v1:KS.05:9',4,'Qurilmalarni nazoratsiz ta’mirlash','Qurilmalarni o‘quvchilar tomonidan nazoratsiz mustaqil ta’mirlashga berish'),
('reserve-2026:T060-R4-KS-B05',1,'Faqat yakuniy ball qo‘yish','Yakuniy baholarni hisoblash bilan cheklanish'),
('reserve-2026:T060-R4-KS-B05',2,'Faqat davomatni yozish','O‘quvchilarning kundalik davomatini qayd qilib borish'),
('reserve-2026:T060-R4-KS-B05',3,'Faqat reja tuzish','Keyingi dars mashg‘ulotlarini taqvimga joylashtirish'),
('reserve-2026:T060-R4-KS-B06',1,'Bir martalik tasodifiy kuzatuv','Bir martalik kuzatuvni yakuniy xulosa qilish'),
('reserve-2026:T060-R4-KS-B06',2,'Faqat yakuniy imtihon','Faqat bitta yakuniy imtihon o‘tkazish'),
('reserve-2026:T060-R4-KS-B06',3,'Faqat dars jadvali','Dars jadvalini muntazam yangilab borish'),
('reserve-2026:T060-R4-KS-M05',1,'Ha, foiz bir xil bo‘lsa feedback ham bir xil','Ha, foiz bir xil bo‘lsa, ikkala o‘quvchiga ham bir xil tavsiya yetarli'),
('reserve-2026:T060-R4-KS-M05',2,'Faqat ikkalasiga tanbeh','Ikkala o‘quvchiga umumiy tanbeh berib, xatolarining turli sabablarini alohida tekshirmaslik'),
('reserve-2026:T060-R4-KS-M05',3,'Faqat ballni oshirish','Har ikkala o‘quvchining ballini oshirib, tushuncha va hisobdagi kamchiliklarni e’tiborsiz qoldirish');
DO $task$
DECLARE actor uuid;n int;rec record;rev uuid;
BEGIN
 SELECT count(*) INTO n FROM profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
 IF n<>1 THEN RAISE EXCEPTION 'KS6_ADMIN_%',n; END IF;
 SELECT id INTO actor FROM profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
 SELECT count(*) INTO n FROM ks6 e JOIN questions q ON q.source_reference=e.ref AND q.status='published' AND q.group_code='KS' AND q.format='Y1' JOIN question_options o ON o.question_id=q.id AND o.order_idx=e.ord AND o.content_md=e.old_text AND trim(o.side)='a' JOIN question_keys k ON k.question_id=q.id WHERE o.id::text<>k.payload->>'correct_option_id';
 IF n<>18 THEN RAISE EXCEPTION 'KS6_DRIFT_%',n; END IF;
 SELECT count(*) INTO n FROM (SELECT ref,count(*) c FROM ks6 GROUP BY ref) m WHERE c=3;
 IF n<>6 THEN RAISE EXCEPTION 'KS6_GROUPS_%',n; END IF;
 FOR rec IN
  SELECT q.id source_id,q.source_reference ref,array_agg(coalesce(e.new_text,o.content_md) ORDER BY o.order_idx,o.id) FILTER(WHERE o.id::text<>(k.payload->>'correct_option_id')) wrong_texts
  FROM questions q JOIN ks6 f ON f.ref=q.source_reference JOIN question_options o ON o.question_id=q.id AND trim(o.side)='a'
  JOIN question_keys k ON k.question_id=q.id LEFT JOIN ks6 e ON e.ref=q.source_reference AND e.ord=o.order_idx
  WHERE q.status='published' GROUP BY q.id,q.source_reference
 LOOP
   IF array_length(rec.wrong_texts,1)<>3 THEN RAISE EXCEPTION 'KS6_WRONG_OPTION_%',rec.ref;END IF;
   INSERT INTO pedagogy_revision_queue(source_question_id,reason) VALUES(rec.source_id,'Owner strict-longest KS 6/6 semantic balanced revision 2026-10-18');
   INSERT INTO pedagogy_rewrite_proposals(source_question_id,proposed_distractors,provenance,proposal_status) VALUES(rec.source_id,rec.wrong_texts,'Owner-authorized AI semantic distractor balancing; no external expert claimed','draft');
   rev:=stage_pedagogy_revision(rec.source_id,actor);
   INSERT INTO pedagogy_owner_release_waivers(question_id,authorized_by,content_fingerprint,authority,provenance,source_question_id) VALUES(rev,actor,professional_question_fingerprint(rev),'owner_explicit_no_external_expert_20261018','Owner authorized strict-longest Y1 correction. Old question archived, correct answer and explanation unchanged, no external expert signoff claimed.',rec.source_id);
   PERFORM publish_pedagogy_revision(rev,actor);
 END LOOP;
 SELECT count(*) INTO n FROM pedagogy_owner_release_waivers w JOIN questions q ON q.id=w.question_id JOIN questions old ON old.id=w.source_question_id WHERE w.provenance LIKE 'Owner authorized strict-longest Y1 correction.%' AND q.status='published' AND old.status='archived';
 IF n<>26 THEN RAISE EXCEPTION 'KS6_REVISIONS_26_EXPECTED_GOT_%',n;END IF;
 WITH x AS(SELECT q.id,max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) FILTER(WHERE o.id::text=k.payload->>'correct_option_id') cw,max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) FILTER(WHERE o.id::text<>k.payload->>'correct_option_id') mw,min(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) mn,max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) mx,count(DISTINCT lower(trim(o.content_md))) distinct_opts FROM questions q JOIN question_keys k ON k.question_id=q.id JOIN question_options o ON o.question_id=q.id AND trim(o.side)='a' WHERE q.group_code='KS' AND q.status='published' AND q.format='Y1' GROUP BY q.id) SELECT count(*) INTO n FROM x WHERE cw>mw;
 IF n<>0 THEN RAISE EXCEPTION 'KS6_REMAINING_STRICT_LONGEST_%',n;END IF;
END $task$;
COMMIT;

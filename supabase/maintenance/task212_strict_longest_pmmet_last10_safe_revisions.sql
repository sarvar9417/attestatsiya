-- TASK212 owner-waived fourteen PM.GEN immutable revisions, reviewed option changes.
-- Privileged manual maintenance only; rehearse replacing final COMMIT with ROLLBACK.
BEGIN;
SET LOCAL lock_timeout='20s';SET LOCAL statement_timeout='180s';
CREATE TEMP TABLE pmmet_last10(ref text,ord integer,old_text text,new_text text,PRIMARY KEY(ref,ord)) ON COMMIT DROP;
INSERT INTO pmmet_last10 VALUES ('authored:pedguli-topic-study:v2:PM.MET.01:128',2,'Har xil blok-sxemalarning tashqi ko‘rinishini baholab, kod yozishni keyinga qoldirish','Har xil blok-sxemalarning tashqi ko‘rinishini baholab, kodning mazmunini tekshirishni keyingi mashg‘ulotga qoldirish'),
('authored:pedguli-topic-study:v2:PM.MET.02:129',1,'Hamma guruhga faqat bir mavzuni berib, muloqotni taqiqlash','Barcha ekspert guruhlarga bir xil mavzu berib, keyingi o‘zaro muloqotni cheklash'),
('authored:pedguli-topic-study:v2:PM.MET.02:129',2,'Har guruh faqat o‘qituvchini tinglaydi','Har bir guruh faqat o‘qituvchini tinglab, boshqa guruhlarga mazmunni qayta tushuntirmasligi'),
('authored:pedguli-topic-study:v2:PM.MET.02:129',4,'Faqat yakuniy baholarni e’lon qilish','Faqat yakuniy baholarni e’lon qilib, ekspert guruhidagi muhokama bosqichini tashlab o‘tish'),
('reserve-2026:T060-R6-PMMET-B14',1,'Faqat davomatni aniqlashga','Faqat o‘quvchilarning kundalik davomatini aniqlashga'),
('reserve-2026:T060-R6-PMMET-B14',2,'Faqat jihozni tekshirishga','Faqat sinfdagi kompyuter jihozlarini tekshirishga'),
('reserve-2026:T060-R6-PMMET-B14',3,'Faqat uy vazifasini yozishga','Faqat uyga vazifa matnini yozishga'),
('reserve-2026:T060-R6-PMMET-M05',1,'Mazmun bo‘lsa qolganlari shart emas','Mazmun tanlangan bo‘lsa, boshqa shartlar kerak emas'),
('reserve-2026:T060-R6-PMMET-M05',2,'Faqat baholash yetarli','Faqat yakuniy nazorat bahosi mavjudligi yetarli'),
('reserve-2026:T060-R6-PMMET-M05',3,'Kompyuter hech qachon kerak emas','Kompyuterli amaliyot darsda hech qachon talab qilinmaydi'),
('reserve-2026:T060-R6-PMMET-M07',1,'Namoyish har doim ko‘nikmani to‘liq shakllantiradi','Namoyish har qanday holatda amaliy ko‘nikmani to‘liq shakllantiradi'),
('reserve-2026:T060-R6-PMMET-M07',2,'Kompyuterda ishlash shart emas','Kompyuterda mustaqil mashq qilishning umuman ahamiyati yo‘q'),
('reserve-2026:T060-R6-PMMET-M07',3,'Faqat test yetarli','Faqat nazariy test topshirish amaliy ko‘nikma uchun yetarli'),
('reserve-2026:T060-R6-PMMET-M12',1,'Ha, faqat bitta metod bo‘lishi shart','Ha, har bir darsda faqat yagona metoddan foydalanish shart'),
('reserve-2026:T060-R6-PMMET-M12',2,'Amaliy mashq bilan tushuntirish birga bo‘lmaydi','Amaliy mashq va og‘zaki tushuntirishni bir darsga birlashtirib bo‘lmaydi'),
('reserve-2026:T060-R6-PMMET-M12',3,'Namoyish metod emas','Namoyish o‘qitish metodi bo‘lmagani uchun foydalanishga yaramaydi'),
('reserve-2026:T060-R6-PMMET-M17',1,'Umumiy o‘rtacha oshgan bo‘lsa boshqa dalil kerak emas','Umumiy o‘rtacha oshgan bo‘lsa, boshqa guruhlarning individual natijalarini solishtirish shart emas'),
('reserve-2026:T060-R6-PMMET-M17',2,'Zaif o‘quvchilarni hisobga olmaslik','Zaif o‘quvchilarning natijasini umumiy sinf xulosasiga kiritmaslik'),
('reserve-2026:T060-R6-PMMET-M17',3,'Metodni har doim o‘zgartirmaslik','Metodning samarasi hamma guruhda bir xil deb, keyingi yondashuvni umuman o‘zgartirmaslik'),
('reserve-2026:T060-R6-PMMET-M18',1,'Ha, maqsad yozilgani yetarli','Ha, dars maqsadi yozilgani yetarli'),
('reserve-2026:T060-R6-PMMET-M18',2,'Ha, o‘qituvchi ko‘p gapirgan','Ha, o‘qituvchi ko‘p gapirgani yetarli'),
('reserve-2026:T060-R6-PMMET-M18',3,'Faqat darslik yetarli','Faqat darslikdagi mavzu yakuni yetarli'),
('revision:pedagogy:75000000-0000-4000-8000-000000000031',1,'Qachon va qancha dars o‘tilishini tashkiliy hisoblashni','Qachon va qancha dars o‘tilishini faqat tashkiliy hujjatlarda hisoblab berishni'),
('revision:pedagogy:75000000-0000-4000-8000-000000000036',1,'Xatolik xabarini e’tiborsiz qoldirib, dastur matnini butunlay qayta yozish','Xatolik xabarini e’tiborsiz qoldirib, dastur matnini bosqichma-bosqich tekshirmasdan butunlay qayta yozish');
DO $task$
DECLARE actor uuid;n int;rec record;rev uuid;
BEGIN
 SELECT count(*) INTO n FROM profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
 IF n<>1 THEN RAISE EXCEPTION 'PMMET_LAST10_ADMIN_%',n; END IF;
 SELECT id INTO actor FROM profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
 SELECT count(*) INTO n FROM pmmet_last10 e JOIN questions q ON q.source_reference=e.ref AND q.status='published' AND q.group_code='PM.MET' AND q.format='Y1' JOIN question_options o ON o.question_id=q.id AND o.order_idx=e.ord AND o.content_md=e.old_text AND trim(o.side)='a' JOIN question_keys k ON k.question_id=q.id WHERE o.id::text<>k.payload->>'correct_option_id';
 IF n<>24 THEN RAISE EXCEPTION 'PMMET_LAST10_DRIFT_%',n; END IF;
 SELECT count(*) INTO n FROM (SELECT ref,count(*) c FROM pmmet_last10 GROUP BY ref) m WHERE c>=1;
 IF n<>10 THEN RAISE EXCEPTION 'PMMET_LAST10_GROUPS_%',n; END IF;
 FOR rec IN
  SELECT q.id source_id,q.source_reference ref,array_agg(coalesce(e.new_text,o.content_md) ORDER BY o.order_idx,o.id) FILTER(WHERE o.id::text<>(k.payload->>'correct_option_id')) wrong_texts
  FROM questions q JOIN (SELECT DISTINCT ref FROM pmmet_last10) f ON f.ref=q.source_reference JOIN question_options o ON o.question_id=q.id AND trim(o.side)='a'
  JOIN question_keys k ON k.question_id=q.id LEFT JOIN pmmet_last10 e ON e.ref=q.source_reference AND e.ord=o.order_idx
  WHERE q.status='published' GROUP BY q.id,q.source_reference
 LOOP
   IF array_length(rec.wrong_texts,1)<>3 THEN RAISE EXCEPTION 'PMMET_LAST10_WRONG_OPTION_%',rec.ref;END IF;
   INSERT INTO pedagogy_revision_queue(source_question_id,reason) VALUES(rec.source_id,'Owner strict-longest KS 10/10 semantic balanced revision 2026-10-18');
   INSERT INTO pedagogy_rewrite_proposals(source_question_id,proposed_distractors,provenance,proposal_status) VALUES(rec.source_id,rec.wrong_texts,'Owner-authorized AI semantic distractor balancing; no external expert claimed','draft');
   rev:=stage_pedagogy_revision(rec.source_id,actor);
   INSERT INTO pedagogy_owner_release_waivers(question_id,authorized_by,content_fingerprint,authority,provenance,source_question_id) VALUES(rev,actor,professional_question_fingerprint(rev),'owner_explicit_no_external_expert_20261018','Owner authorized strict-longest Y1 correction. Old question archived, correct answer and explanation unchanged, no external expert signoff claimed.',rec.source_id);
   PERFORM publish_pedagogy_revision(rev,actor);
 END LOOP;
 SELECT count(*) INTO n FROM pedagogy_owner_release_waivers w JOIN questions q ON q.id=w.question_id JOIN questions old ON old.id=w.source_question_id WHERE w.provenance LIKE 'Owner authorized strict-longest Y1 correction.%' AND q.status='published' AND old.status='archived';
 IF n<>75 THEN RAISE EXCEPTION 'PMMET_LAST10_REVISIONS_26_EXPECTED_GOT_%',n;END IF;
 WITH x AS(SELECT q.id,max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) FILTER(WHERE o.id::text=k.payload->>'correct_option_id') cw,max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) FILTER(WHERE o.id::text<>k.payload->>'correct_option_id') mw,min(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) mn,max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) mx,count(DISTINCT lower(trim(o.content_md))) distinct_opts FROM questions q JOIN question_keys k ON k.question_id=q.id JOIN question_options o ON o.question_id=q.id AND trim(o.side)='a' WHERE q.group_code='PM.MET' AND q.status='published' AND q.format='Y1' GROUP BY q.id) SELECT count(*) INTO n FROM x WHERE cw>mw;
 IF n<>0 THEN RAISE EXCEPTION 'PMMET_LAST10_REMAINING_STRICT_LONGEST_%',n;END IF;
END $task$;
COMMIT;

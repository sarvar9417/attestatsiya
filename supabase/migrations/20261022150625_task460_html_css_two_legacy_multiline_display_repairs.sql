BEGIN;
SET LOCAL lock_timeout='12s';
CREATE TEMP TABLE task460_manifest (oldid uuid PRIMARY KEY,stem text NOT NULL,explanation text NOT NULL) ON COMMIT DROP;
INSERT INTO task460_manifest VALUES ('a80ee792-39fb-5090-858e-ec077f35c9e8','Quyidagi HTML fragmentining natijasini tekshiring:

```html
<body>
  <h2 style="color: red; text-align: right; font-size: 40px;">
    Welcome to Web Design
  </h2>
  <img
    src="web.png"
    width="150"
    height="100"
    style="float: right;"
    alt="web image"
  >
  <p>Oddiy abzats matni.</p>
</body>
```

Qaysi fikr to‘g‘ri?','`h2` inline uslubi sarlavhani qizil, o‘ngga tekislangan va 40px qiladi. `float:right` rasmni tegishli konteynerning o‘ng qismiga joylaydi. Keyingi oddiy `p` sarlavha uslubini meros qilib olmaydi. Rasm resursi topilmasa muqobil matn ko‘rinishi mumkin.'),
('e360fb3a-8e38-5aef-a198-30001cdb4e79','Quyidagi CSS va HTML fragmentlarining natijasini aniqlang:

```css
body {
  font-family: "Times New Roman";
  color: black;
}
h2 {
  text-align: right;
  color: red;
}
p {
  font-size: 16px;
  margin: 5px;
}
.t1 {
  color: green;
  font-weight: bold;
}
```

```html
<body>
  <h2>HTML</h2>
  <p>HTML — bu belgilash tili.</p>
  <p class="t1">HTML web sahifa tuzish uchun ishlatiladi.</p>
</body>
```

Qaysi tavsif to‘g‘ri?','`h2` o‘ngga tekislanadi va qizil. Birinchi `p` bodydan qora rangni meros qilib oladi, 16px bo‘ladi. Ikkinchi `p.t1` esa yashil va qalin. Har bir `p` 5px margin oladi; oddiy oqimda qo‘shni vertikal marginlar collapse bo‘lishi mumkin.');
CREATE TEMP TABLE task460_sel ON COMMIT DROP AS SELECT m.oldid,gen_random_uuid() new_id,m.stem,m.explanation
 FROM task460_manifest m JOIN questions q ON q.id=m.oldid AND q.status='published' AND q.group_code='S5.WEB' AND q.format='Y1'
 WHERE NOT EXISTS(SELECT 1 FROM question_bank_revisions b WHERE b.source_question_id=q.id);
DO $p$ BEGIN IF (SELECT count(*) FROM task460_sel)<>2 THEN RAISE EXCEPTION 'TASK460 originals modified';END IF;END;$p$;
SELECT q.id FROM questions q JOIN task460_sel s ON s.oldid=q.id FOR UPDATE OF q;
INSERT INTO questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT s.new_id,q.subject_id,q.construct_id,q.group_code,q.format,q.cognitive,q.difficulty,s.stem,
q.assets,true,'review'::content_status,q.author_id,
'revision:TASK-460:html-css-readable:'||q.id,q.source_lesson_id
FROM task460_sel s JOIN questions q ON q.id=s.oldid;
INSERT INTO question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),s.new_id,o.side,o.order_idx,o.content_md
FROM task460_sel s JOIN question_options o ON o.question_id=s.oldid;
INSERT INTO question_keys(question_id,payload,explanation_md)
SELECT s.new_id,jsonb_set(k.payload,'{correct_option_id}',to_jsonb(newopt.id::text),false),s.explanation
FROM task460_sel s JOIN question_keys k ON k.question_id=s.oldid
JOIN question_options oldopt ON oldopt.question_id=s.oldid AND oldopt.id::text=k.payload->>'correct_option_id'
JOIN question_options newopt ON newopt.question_id=s.new_id AND newopt.order_idx=oldopt.order_idx AND newopt.content_md=oldopt.content_md;
INSERT INTO question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
SELECT oldid,new_id,'owner_ai_html_css_multiline_readability',
jsonb_build_object('task','TASK-460','human_independent_editor',false,'only_stem_explanation_format_changed',true,'correct_answer_text_unchanged',true,'historical_attempts_modified',false) FROM task460_sel;
UPDATE questions q SET status='published'::content_status,updated_at=now() FROM task460_sel s WHERE q.id=s.new_id;
UPDATE questions q SET status='archived'::content_status,updated_at=now() FROM task460_sel s WHERE q.id=s.oldid;
DO $v$ BEGIN IF EXISTS(SELECT 1 FROM task460_sel s JOIN questions newq ON newq.id=s.new_id
 LEFT JOIN question_quality_published_revisions sn ON sn.question_id=newq.id
 WHERE newq.status<>'published'::content_status OR sn.content_fingerprint IS DISTINCT FROM professional_question_fingerprint(newq.id)
 OR NOT group_mock_eligible(newq.id) OR NOT is_question_official_mock_eligible(newq.id)
 OR (SELECT count(*) FROM question_options o WHERE o.question_id=s.new_id)<>4)
 THEN RAISE EXCEPTION 'TASK460 release check failed'; END IF; END;$v$;
COMMIT;
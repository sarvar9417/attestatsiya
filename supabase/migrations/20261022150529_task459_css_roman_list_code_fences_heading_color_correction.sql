BEGIN;
SET LOCAL lock_timeout='12s';
CREATE TEMP TABLE cssfix ON COMMIT DROP AS SELECT q.id old_id,gen_random_uuid() new_id FROM questions q
WHERE q.id='8c31bcb8-7397-596d-be13-67352fe40700'::uuid AND q.status='published' AND q.format='Y1'
AND NOT EXISTS(SELECT 1 FROM question_bank_revisions br WHERE br.source_question_id=q.id);
DO $p$ BEGIN IF (SELECT count(*) FROM cssfix)<>1 THEN RAISE EXCEPTION 'CSS original unavailable';END IF;END;$p$;
SELECT q.id FROM questions q JOIN cssfix s ON s.old_id=q.id FOR UPDATE OF q;
INSERT INTO questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
SELECT s.new_id,q.subject_id,q.construct_id,q.group_code,q.format,q.cognitive,q.difficulty,'Quyidagi CSS va HTML kodlari berilgan. Boshqa muallif qoidalari va `!important` yo‘q.

```css
* {
  color: purple;
  font-weight: bold;
}
body {
  color: orange;
}
ol {
  list-style-type: upper-roman;
  color: orange;
}
li {
  color: brown;
  font-weight: normal;
}
p {
  color: teal;
  font-style: italic;
}
.p2 {
  color: black;
}
#id3 {
  color: darkred;
}
```

```html
<body>
  <h2>Sarlavha</h2>
  <ol>
    <li class="p2">Birinchi band</li>
    <li class="p2" id="id3">
      <p>Ikkinchi band</p>
    </li>
    <li>Uchinchi band</li>
  </ol>
</body>
```

Sarlavha va I–III ro‘yxat bandlarining rangi, markerlari hamda shrift ko‘rinishini aniqlang.',
q.assets,true,'review'::content_status,q.author_id,'revision:TASK-459:css-readable-verified:'||q.id,q.source_lesson_id
FROM cssfix s JOIN questions q ON q.id=s.old_id;
INSERT INTO question_options(id,question_id,side,order_idx,content_md)
SELECT gen_random_uuid(),s.new_id,'a',v.ord,v.content FROM cssfix s CROSS JOIN LATERAL
(VALUES (0,'Sarlavha purple va qalin; I qora va oddiy; II markeri to‘q qizil, ichki p teal, kursiv va qalin; III jigarrang va oddiy.'),(1,'Sarlavha orange va qalin; I qora va oddiy; II markeri to‘q qizil, ichki p teal, kursiv va qalin; III jigarrang va oddiy.'),(2,'Sarlavha purple va qalin; I jigarrang va oddiy; II markeri qora, ichki p to‘q qizil, kursiv va oddiy; III jigarrang va oddiy.'),(3,'Sarlavha purple va oddiy; I qora va qalin; II markeri to‘q qizil, ichki p jigarrang, kursiv va oddiy; III jigarrang va qalin.')) v(ord,content);
INSERT INTO question_keys(question_id,payload,explanation_md)
SELECT s.new_id,jsonb_set(k.payload,'{correct_option_id}',to_jsonb(o.id::text),false),'Universal `*` selektori barcha elementlarga rangni bevosita beradi, shuning uchun `h2` bodydan orange rangni meros olmaydi: sarlavha purple va qalin. `li` uchun qalinlik normal; `.p2` birinchi bandni black, `#id3` ikkinchi bandni darkred qiladi. `ol` markerlar yuqori Rim raqamlari. II marker to‘q qizil, ichki `p` esa teal, italic va universal qoida sabab bold. III li brown va normal.'
FROM cssfix s JOIN question_keys k ON k.question_id=s.old_id
JOIN question_options o ON o.question_id=s.new_id AND o.order_idx=0;
INSERT INTO question_bank_revisions(source_question_id,revision_question_id,revision_kind,evidence)
SELECT old_id,new_id,'owner_ai_css_readability_and_correct_answer_repair',
jsonb_build_object('task','TASK-459','human_independent_editor',false,'prior_heading_color_wrong','orange','correct_heading_color','purple','code_format','css+html-fenced','historical_attempts_modified',false) FROM cssfix;
UPDATE questions q SET status='published'::content_status,updated_at=now() FROM cssfix s WHERE q.id=s.new_id;
UPDATE questions q SET status='archived'::content_status,updated_at=now() FROM cssfix s WHERE q.id=s.old_id;
DO $v$ BEGIN IF EXISTS(SELECT 1 FROM cssfix s JOIN questions q ON q.id=s.new_id
 LEFT JOIN question_quality_published_revisions sn ON sn.question_id=q.id
 WHERE q.status<>'published'::content_status OR sn.content_fingerprint IS DISTINCT FROM professional_question_fingerprint(q.id)
 OR NOT is_question_official_mock_eligible(q.id) OR NOT group_mock_eligible(q.id))
 THEN RAISE EXCEPTION 'CSS revision release invalid';END IF;END;$v$;
COMMIT;
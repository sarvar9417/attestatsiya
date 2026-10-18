-- TASK-202: 4 REVIEW-only Y1 questions with more realistic distractors.
-- Preserves the correct option ID, key, provenance and all published attempt history.
-- Never run on published or editorially signed items.
begin;
do $task202$
declare r jsonb; v_id uuid; opt record; v_n int;
begin
 for r in select * from jsonb_array_elements($items$[{"ref":"authored:pedagogy-pdf-corpus:v1:PM.MET.03:002","old":["Natijani faqat eng tez yozgan o‘quvchi nomiga rasmiylashtirish","Qolgan o‘quvchilarni faqat kuzatuvchi sifatida qoldirish","Guruh vazifasini maqsadsiz ravishda uzunroq qilish"],"rewrite":["Yakuniy kodning murakkabligiga qarab butun guruhga bir xil baho qo‘yish","Vazifalarni imkoniyatiga qarab bo‘lib, faqat umumiy natijani baholash","Har bir a’zoga bir xil kod bo‘lagini mustaqil qayta yozdirish"]},{"ref":"authored:pedagogy-pdf-corpus:v1:KS.04:001","old":["Faqat loyiha mahsulotining texnik sifatini baholash","Nizoni e’tiborsiz qoldirib ishni tezroq tugatish","Barcha vazifani faqat eng kuchli o‘quvchiga berish"],"rewrite":["Loyiha mahsulotini baholab, muloqotdagi muammoni keyingi darsga qoldirish","Nizolashayotgan juftliklarni ajratib, alohida kichik guruhlarga taqsimlash","Har bir o‘quvchiga yakka vazifa berib, umumiy muhokamani qisqartirish"]},{"ref":"authored:pedagogy-pdf-corpus:v1:PM.MET.01:002","old":["Har bir xatoga tayyor to‘g‘ri kodni darhol berish","Faqat sintaksis ta’riflarini ko‘chirtirish","Natijani tekshirmasdan kod yozishni tugatish"],"rewrite":["Ishlaydigan kod namunasini ko‘rsatib, uni mustaqil qayta terdirish","Sintaksis qoidalarini takrorlatib, tayyor misollarni navbat bilan yechdirish","Kodni ishga tushirib, faqat yakuniy natijalarni solishtirish"]},{"ref":"authored:pedagogy-pdf-corpus:v3:2024:spring:p6:q29","old":["Eng yangi texnik qurilma bilan ishlaydigan namoyish vositalarini tanlash","Sinfdagi barcha vositalardan navbat bilan foydalanishga imkon beradiganlarini tanlash","Dars davomiyligini eng ko‘p to‘ldiradigan namoyish vositalarini tanlash"],"rewrite":["O‘quvchilarga ko‘proq qiziqarli bo‘lgan raqamli namoyish vositalarini tanlash","Oldingi darslarda samarali ko‘ringan ko‘rgazmali materiallarni ustuvor tanlash","Mavjud barcha vositalardan foydalanib, ko‘rgazmalar sonini imkon qadar ko‘paytirish"]}]$items$::jsonb) loop
  select q.id into v_id from public.questions q where q.source_reference=r->>'ref' and q.status='review'::public.content_status;
  if v_id is null then raise notice 'TASK202 source not present on clean bootstrap: %',r->>'ref';continue;end if;
  if exists(select 1 from public.question_editorial_checks where question_id=v_id) then raise exception 'TASK202 signed question cannot be modified: %',r->>'ref';end if;
  v_n:=0;
  for opt in select o.id,o.content_md,(row_number() over(order by o.order_idx)-1)::int as pos from public.question_options o join public.question_keys k on k.question_id=o.question_id where o.question_id=v_id and o.side='a' and o.id::text<>(k.payload->>'correct_option_id') order by o.order_idx loop
    if opt.content_md<>(r->'old'->>opt.pos) then raise exception 'TASK202 unexpected previous distractor for % pos %',r->>'ref',opt.pos;end if;
    update public.question_options set content_md=r->'rewrite'->>opt.pos where id=opt.id;
    v_n:=v_n+1;
  end loop;
  if v_n<>3 then raise exception 'TASK202 expected 3 distractors for %, got %',r->>'ref',v_n;end if;
 end loop;
end $task202$;
commit;

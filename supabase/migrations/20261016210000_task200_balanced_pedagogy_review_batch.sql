-- TASK-200. Review ONLY: 15 original Y1 questions from four user PDFs.
-- Correct-answer length is balanced with three plausible distractors.
-- Do not publish automatically. Source answer marks were independently reconciled.
begin;
do $task200$
declare
 item jsonb; c record; v_lesson uuid; v_question uuid; v_option uuid;
 i int; v_correct int; v_basis uuid;
 lengths int[]; maxlen int; minlen int; maxwrong int;
begin
 for item in select * from jsonb_array_elements($items$[{"year":2024,"sitting":"spring","page":5,"qno":20,"basis":"c21d5197-8b67-4d0c-9d4c-547c7bef40ac","construct":"PM.GEN.07","cognitive":"bilish","difficulty":2,"stem":"Pedagogning o‘z fanini chuqur bilishi va boshqa fanlar bilan ilmiy bog‘lanishlarni tushuntira olishi qaysi qobiliyatga tegishli?","options":["Perseptiv pedagogik qobiliyat","Akademik pedagogik qobiliyat","Kommunikativ pedagogik qobiliyat","Didaktik pedagogik qobiliyat"],"correct":1,"exp":"Akademik qobiliyat o‘z fani bo‘yicha chuqur bilim va ilmiy tafakkurga asoslanadi.","ref":"authored:pedagogy-pdf-corpus:v3:2024:spring:p5:q20"},{"year":2024,"sitting":"spring","page":6,"qno":27,"basis":"f0668384-6339-431d-8d2e-0446f0e7f90d","construct":"PM.GEN.04","cognitive":"qollash","difficulty":3,"stem":"Sinf tadbirining rejasi o‘quvchilar bilan muhokama qilindi. Ular rollarni o‘zlari tanladi, pedagog esa kelishilgan qoidalarni saqladi. Qaysi uslub ko‘rinmoqda?","options":["Avtoritar boshqaruv uslubi","Liberal boshqaruv uslubi","Demokratik boshqaruv uslubi","Direktiv boshqaruv uslubi"],"correct":2,"exp":"Demokratik uslubda o‘quvchilar fikri va tashabbusi qaror qabul qilishda hisobga olinadi.","ref":"authored:pedagogy-pdf-corpus:v3:2024:spring:p6:q27"},{"year":2024,"sitting":"spring","page":6,"qno":29,"basis":"fece753c-4b2e-4b1b-ae1f-cf61046168c4","construct":"KS.02","cognitive":"qollash","difficulty":3,"stem":"O‘qituvchi bir mavzu uchun ko‘plab ko‘rgazmali vositalar orasidan tanlov qilmoqda. Qaysi yondashuv asosli?","options":["Dars maqsadi va o‘quvchilar ehtiyojiga mos namoyish vositalarini tanlash","Eng yangi texnik qurilma bilan ishlaydigan namoyish vositalarini tanlash","Sinfdagi barcha vositalardan navbat bilan foydalanishga imkon beradiganlarini tanlash","Dars davomiyligini eng ko‘p to‘ldiradigan namoyish vositalarini tanlash"],"correct":0,"exp":"Ko‘rgazmali materiallar dars maqsadi, mazmuni va o‘quvchi ehtiyojiga mos tanlanishi lozim.","ref":"authored:pedagogy-pdf-corpus:v3:2024:spring:p6:q29"},{"year":2024,"sitting":"spring","page":8,"qno":35,"basis":"00416fb4-b333-4cec-8660-3a61b864a406","construct":"PM.GEN.01","cognitive":"qollash","difficulty":3,"stem":"Kuzatuvchi mavzu mazmunining ilmiyligini, tushunchalar izchilligini va oddiydan murakkabga o‘tishni tekshirdi. Qaysi tahlil yo‘nalishi?","options":["Psixologik dars tahlili","Tarbiyaviy dars tahlili","Metodik dars tahlili","Didaktik dars tahlili"],"correct":3,"exp":"Didaktik tahlil ta’lim mazmuni, o‘qitish tamoyillari va mantiqiy izchillikni baholaydi.","ref":"authored:pedagogy-pdf-corpus:v3:2024:spring:p8:q35"},{"year":2025,"sitting":"spring","page":2,"qno":3,"basis":"b84b8579-dcd2-4193-9ca5-d99be54a1a5c","construct":"KS.02","cognitive":"bilish","difficulty":2,"stem":"Dars maqsadiga mos namoyish va tarqatma materiallardan foydalanish kasbiy standartning qaysi mehnat vazifasiga tegishli?","options":["O‘quv jarayonini rejalashtirish mehnat vazifasi","Tarbiyaviy faoliyatni tashkil etish mehnat vazifasi","Ta’lim samaradorligini ta’minlash mehnat vazifasi","Kasbiy rivojlanishni tashkil etish mehnat vazifasi"],"correct":2,"exp":"Ko‘rgazma va tarqatmalardan maqsadga muvofiq foydalanish ta’lim samaradorligini ta’minlash vazifasiga kiradi.","ref":"authored:pedagogy-pdf-corpus:v3:2025:spring:p2:q3"},{"year":2025,"sitting":"spring","page":2,"qno":4,"basis":"9b105e5a-30b7-42db-adf1-34f7d39cb045","construct":"KS.06","cognitive":"qollash","difficulty":3,"stem":"Bir fan o‘qituvchilari o‘zaro hamkorlikni tahlil qilib, pedagogik yondashuvlarini birgalikda takomillashtirmoqda. Qaysi refleksiya turi ustuvor?","options":["Kooperativ refleksiya","Shaxsiy refleksiya","Intellektual refleksiya","Kommunikativ refleksiya"],"correct":0,"exp":"Kooperativ refleksiya hamkorlikdagi faoliyat va o‘zaro ta’sirni tahlil qilishga yo‘naltiriladi.","ref":"authored:pedagogy-pdf-corpus:v3:2025:spring:p2:q4"},{"year":2025,"sitting":"spring","page":4,"qno":14,"basis":"c5008801-0faa-4d7c-8432-397d214593a5","construct":"KS.01","cognitive":"bilish","difficulty":2,"stem":"DTS va o‘quv dasturi maqsadlariga mos ravishda o‘quv rejalarini ishlab chiqish qaysi kasbiy vazifaga kiradi?","options":["Ta’lim samaradorligini ta’minlash mehnat vazifasi","O‘quv jarayonini rejalashtirish mehnat vazifasi","Tarbiyaviy faoliyatni tashkil etish mehnat vazifasi","O‘zlashtirish natijalarini baholash mehnat vazifasi"],"correct":1,"exp":"DTS va dasturga mos rejalarni tuzish o‘quv jarayonini rejalashtirish vazifasidir.","ref":"authored:pedagogy-pdf-corpus:v3:2025:spring:p4:q14"},{"year":2025,"sitting":"spring","page":7,"qno":30,"basis":"e4f78ef6-3f83-4a21-95f6-2d64de7c858c","construct":"PM.GEN.03","cognitive":"bilish","difficulty":2,"stem":"Go‘zallikni his qilish, badiiy did va san’atga qiziqishni rivojlantirish qaysi tarbiya turining maqsadi?","options":["Aqliy tarbiya","Axloqiy tarbiya","Mehnat tarbiyasi","Estetik tarbiya"],"correct":3,"exp":"Estetik tarbiya badiiy did va go‘zallikni anglash ko‘nikmalarini rivojlantiradi.","ref":"authored:pedagogy-pdf-corpus:v3:2025:spring:p7:q30"},{"year":2025,"sitting":"autumn","page":7,"qno":21,"basis":"ed8c430c-f6c6-4cbb-90ef-028a5d2e5aca","construct":"KS.06","cognitive":"qollash","difficulty":3,"stem":"Pedagog o‘tgan darsdagi muvaffaqiyat va qiyinchilik sabablarini aniqlab, keyingi mashg‘ulotga o‘zgartirish kiritdi. Qaysi qobiliyat namoyon bo‘ldi?","options":["Didaktik tushuntirish qobiliyati","Refleksiv tahlil qilish qobiliyati","Perseptiv idrok etish qobiliyati","Kommunikativ muloqot yuritish qobiliyati"],"correct":1,"exp":"Refleksiv qobiliyat o‘z faoliyatini dalil asosida tahlil qilish va yaxshilashdir.","ref":"authored:pedagogy-pdf-corpus:v3:2025:autumn:p7:q21"},{"year":2025,"sitting":"autumn","page":8,"qno":25,"basis":"e15c302f-0fae-43f1-9aad-556ee5a52baa","construct":"PM.GEN.07","cognitive":"qollash","difficulty":3,"stem":"Murakkab mavzuni o‘quvchi yoshiga mos, ravshan va mantiqiy ketma-ketlikda bayon qilish, sxema bilan tushuntirish qaysi qobiliyatga xos?","options":["Didaktik pedagogik qobiliyat","Akademik pedagogik qobiliyat","Perseptiv pedagogik qobiliyat","Tashkilotchilik pedagogik qobiliyati"],"correct":0,"exp":"Didaktik qobiliyat bilimni o‘quvchi uchun tushunarli shaklda bayon qilishdir.","ref":"authored:pedagogy-pdf-corpus:v3:2025:autumn:p8:q25"},{"year":2025,"sitting":"autumn","page":9,"qno":29,"basis":"10619e98-88c6-4640-a4f5-87812eb13041","construct":"KS.07","cognitive":"qollash","difficulty":3,"stem":"Pedagog oilalar bilan hamkorlikda ota-onalarga rivojlanish haqida axborot berib, ularni o‘quv tadbirlariga jalb qiladi. Qaysi mehnat harakati ustuvor?","options":["O‘quvchilar o‘rtasida o‘zaro baholashni tizimli tashkil etish","Fanlararo loyihalar uchun metodik materiallarni mustaqil ishlab chiqish","Ota-onalarning ta’lim jarayonidagi faol ishtirokini tashkil etish","Dars davomida o‘quv natijalarini individual nazorat qilish"],"correct":2,"exp":"Hamkorlik yo‘nalishida ota-onalarni ta’lim jarayoniga jalb qilish mehnat harakati bajarilmoqda.","ref":"authored:pedagogy-pdf-corpus:v3:2025:autumn:p9:q29"},{"year":2026,"sitting":"spring","page":1,"qno":1,"basis":"f7f3e445-f86b-4039-85c7-dcd08117db80","construct":"KS.01","cognitive":"qollash","difficulty":3,"stem":"Sinfning qiziqishlari va tayyorgarlik darajasi turlicha. Kasbiy standartga mos rejalashtirish harakati qaysi?","options":["Oldingi yillik dars rejasini aynan o‘zgarishsiz qo‘llash","Barcha o‘quvchilarga bir xil qo‘shimcha topshiriq hajmini belgilash","Zarur hollarda o‘quv dasturini ehtiyoj va qiziqishga moslashtirish","O‘qitish maqsadlarini faqat mavjud texnik jihozga bog‘lash"],"correct":2,"exp":"O‘quv dasturi ehtiyoj va qiziqishlarga qarab zaruratda moslashtiriladi.","ref":"authored:pedagogy-pdf-corpus:v3:2026:spring:p1:q1"},{"year":2026,"sitting":"spring","page":2,"qno":6,"basis":"e116752d-e4ed-4b42-89d0-a5c5c2f6e073","construct":"PM.GEN.02","cognitive":"qollash","difficulty":3,"stem":"O‘qituvchi mavzuni izchil bayon qildi, lekin topshiriqlar o‘quvchilarning yoshi va tayyorgarligiga mos kelmadi. Qaysi tamoyil buzilgan?","options":["Ilmiylik ta’lim tamoyili","Izchillik ta’lim tamoyili","Ko‘rgazmalilik ta’lim tamoyili","Tushunarlilik ta’lim tamoyili"],"correct":3,"exp":"Tushunarlilik tamoyili mazmun va vazifani o‘quvchi yoshi hamda imkoniyatiga moslashtirishni talab qiladi.","ref":"authored:pedagogy-pdf-corpus:v3:2026:spring:p2:q6"},{"year":2026,"sitting":"spring","page":3,"qno":13,"basis":"214b06a0-b479-426d-91b6-9c7d5422f8a0","construct":"PM.GEN.08","cognitive":"bilish","difficulty":2,"stem":"Mashg‘ulotda o‘qituvchi va o‘quvchilar munozara hamda vazifa orqali ikki tomonlama faol hamkorlik qiladi. Qaysi shakl mos?","options":["Interaktiv mashg‘ulot","Ma’ruzaviy mashg‘ulot","Nazorat mashg‘uloti","Individual mashg‘ulot"],"correct":0,"exp":"Interaktiv mashg‘ulotda pedagog va o‘quvchi o‘zaro faol hamkorlikda ishtirok etadi.","ref":"authored:pedagogy-pdf-corpus:v3:2026:spring:p3:q13"},{"year":2026,"sitting":"spring","page":5,"qno":22,"basis":"1708a321-0842-40a5-9441-a07d9c42c069","construct":"PM.GEN.04","cognitive":"qollash","difficulty":3,"stem":"O‘quvchilar bog‘da o‘simliklarni bevosita kuzatishdi, qaydlar olishdi va natijalarni muhokama qilishdi. Yetakchi dars turi?","options":["Laboratoriya darsi","Ekskursiya darsi","Mustahkamlash darsi","Nazorat darsi"],"correct":1,"exp":"Tabiiy muhitdagi obyektni joyiga borib kuzatish ekskursiya darsiga xos.","ref":"authored:pedagogy-pdf-corpus:v3:2026:spring:p5:q22"}]$items$::jsonb) loop
  if exists(select 1 from public.questions where source_reference=item->>'ref') then continue; end if;
  select id,subject_id,group_code into c from public.constructs
   where code=item->>'construct' and is_active=true;
  if c.id is null then raise exception 'TASK-200 construct missing %',item->>'construct'; end if;
  v_basis:=(item->>'basis')::uuid;
  if not exists(select 1 from public.pedagogy_pdf_source_candidates p
    where p.id=v_basis and p.mapped_construct_id=c.id and p.editorial_status='verified'
     and p.answer_key_status='independently_verified'
     and p.linked_question_id is null and p.duplicate_of_candidate_id is null
     and p.near_duplicate_of_candidate_id is null) then
    raise exception 'TASK-200 source candidate not ready %',v_basis;
  end if;
  select l.id into v_lesson from public.lesson_constructs lc
    join public.lessons l on l.id=lc.lesson_id
   where lc.construct_id=c.id and l.status='published'::public.content_status
   order by l.created_at asc limit 1;
  if v_lesson is null then raise exception 'TASK-200 lesson missing %',item->>'construct'; end if;
  if jsonb_array_length(item->'options')<>4 or (item->>'correct')::int not between 0 and 3 then
    raise exception 'TASK-200 option shape invalid %',item->>'ref';
  end if;
  select array_agg(array_length(regexp_split_to_array(btrim(value),'[[:space:]]+'),1) order by ordinality)
    into lengths from jsonb_array_elements_text(item->'options') with ordinality t(value,ordinality);
  select max(v),min(v) into maxlen,minlen from unnest(lengths) as v;
  v_correct:=(item->>'correct')::int;
  select max(val) into maxwrong from unnest(lengths) with ordinality x(val,n)
    where n<>v_correct+1;
  if minlen<2 or maxlen>minlen*1.8 or lengths[v_correct+1]>maxwrong*1.25 then
    raise exception 'TASK-200 unbalanced option lengths % / %',item->>'ref',lengths;
  end if;
  v_question:=gen_random_uuid();
  insert into public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,
    stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
  values(v_question,c.subject_id,c.id,c.group_code,'Y1'::public.question_format,
    (item->>'cognitive')::public.cognitive_level,(item->>'difficulty')::int,
    item->>'stem','[]'::jsonb,false,'review'::public.content_status,null,
    item->>'ref',v_lesson);
  for i in 0..3 loop
    v_option:=gen_random_uuid();
    insert into public.question_options(id,question_id,content_md,order_idx)
    values(v_option,v_question,item->'options'->>i,i);
    if i=v_correct then
      insert into public.question_keys(question_id,payload,explanation_md)
      values(v_question,jsonb_build_object('correct_option_id',v_option),item->>'exp');
    end if;
  end loop;
  update public.pedagogy_pdf_source_candidates
  set linked_question_id=v_question,reviewed_at=coalesce(reviewed_at,now())
  where id=v_basis and linked_question_id is null;
 end loop;
 if (select count(*) from public.questions where source_reference like 'authored:pedagogy-pdf-corpus:v3:%')<>15 then
   raise exception 'TASK-200 expected 15 review questions';
 end if;
 if exists(select 1 from public.questions q
   where q.source_reference like 'authored:pedagogy-pdf-corpus:v3:%'
   and (q.status<>'review'::public.content_status
     or q.source_lesson_id is null
     or not exists(select 1 from public.question_keys k where k.question_id=q.id)
     or (select count(*) from public.question_options o where o.question_id=q.id)<>4)) then
   raise exception 'TASK-200 bank invariant failed';
 end if;
end $task200$;
commit;

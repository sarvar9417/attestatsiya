-- Pedagogy PDF corpus review bank v2.
-- 18 original review-only questions with format diversity:
-- 9 Y2 matching + 9 Y3 ordering, one item for each official KS/PM construct.
-- Raw historical PDF wording is not copied.

begin;

do $bank$
declare
  item jsonb;
  v_subject uuid;
  v_construct uuid;
  v_group text;
  v_lesson uuid;
  v_question uuid;
  v_option uuid;
  v_i int;
  v_j int;
  v_logical int;
  v_left_ids uuid[];
  v_right_ids uuid[];
  v_step_ids uuid[];
  v_pairs jsonb;
  v_perm int[] := array[3,1,4,2];
  v_basis uuid;
begin
  -- Y2 matching: KS.01..KS.07 + PM.GEN.01..PM.GEN.02
  for item in
    select * from jsonb_array_elements($json$
[
{"ref":"authored:pedagogy-pdf-corpus:v2:KS.01:Y2:001","construct":"KS.01","cognitive":"qollash","difficulty":3,"basis":"02778030-c9f2-4c5b-8397-05a7be9b37e4","stem":"Darsni rejalashtirish elementlarini ularning vazifasi bilan moslang.","pairs":[{"l":"Kutiladigan natija","r":"O‘quvchi dars oxirida nima bajara olishini aniq belgilaydi"},{"l":"Boshlang‘ich holat","r":"Avvalgi bilim va ehtiyojlarni aniqlaydi"},{"l":"Metod va vosita","r":"Natijaga olib boradigan faoliyat va resursni tanlaydi"},{"l":"Baholash dalili","r":"Natijaga erishilganini qanday tekshirishni belgilaydi"}],"exp":"Rejalashtirish natija → boshlang‘ich holat → faoliyat/vosita → tekshirish dalili o‘rtasidagi uyg‘unlikni talab qiladi."},
{"ref":"authored:pedagogy-pdf-corpus:v2:KS.02:Y2:001","construct":"KS.02","cognitive":"qollash","difficulty":3,"basis":"899eedc0-0e18-410e-aa82-6c03718432cf","stem":"Ta’lim samaradorligini oshiruvchi harakatni uning maqsadi bilan moslang.","pairs":[{"l":"Vaqtni oqilona boshqarish","r":"Dars bosqichlariga yetarli vaqt ajratish"},{"l":"Metakognitiv savol","r":"O‘quvchining qanday o‘rganganini anglashiga yordam berish"},{"l":"Differensial yordam","r":"Ehtiyojga mos ko‘mak yoki murakkablik berish"},{"l":"Jamoaviy rol","r":"Har bir o‘quvchining faol va tekshiriladigan ishtirokini tashkil etish"}],"exp":"Samaradorlik metod nomiga emas, maqsad, faoliyat, vaqt va o‘quvchi ehtiyojining mosligiga bog‘liq."},
{"ref":"authored:pedagogy-pdf-corpus:v2:KS.03:Y2:001","construct":"KS.03","cognitive":"qollash","difficulty":3,"basis":"699557f3-1844-485b-9b37-e824c906a845","stem":"Baholash va qayta aloqa tushunchalarini mos vazifa bilan juftlang.","pairs":[{"l":"Diagnostik baholash","r":"O‘qitish boshida boshlang‘ich holatni aniqlash"},{"l":"Formativ baholash","r":"Jarayon davomida keyingi o‘qitish qarorini yaxshilash"},{"l":"Summativ baholash","r":"Sikl yakunidagi erishilgan natijani qayd etish"},{"l":"Qayta aloqa","r":"Hozirgi natija va keyingi yaxshilash qadamini tushuntirish"}],"exp":"Diagnostik, formativ va summativ baholashning vaqti va vazifasi farq qiladi; qayta aloqa esa keyingi qadamni aniq qiladi."},
{"ref":"authored:pedagogy-pdf-corpus:v2:KS.04:Y2:001","construct":"KS.04","cognitive":"qollash","difficulty":3,"basis":"a00bb116-a47f-4184-a4a0-9d170da84fa9","stem":"Tarbiyaviy faoliyat yo‘nalishini mos misol bilan juftlang.","pairs":[{"l":"O‘zini o‘zi boshqarish","r":"O‘quvchilar tadbir rollari va vazifalarini mas’uliyat bilan taqsimlaydi"},{"l":"Fuqarolik pozitsiyasi","r":"Jamoa manfaatiga daxldor masalada asoslangan tashabbus bildiradi"},{"l":"Nizoni konstruktiv hal qilish","r":"Tomonlar hurmatli muloqot orqali kelishuv izlaydi"},{"l":"Sinfdan tashqari faoliyat","r":"To‘garak yoki loyiha aniq tarbiyaviy maqsad bilan tashkil etiladi"}],"exp":"KS.04 markazida qadriyat, xulq, mas’uliyat va ijtimoiy rivojlanishni maqsadli tashkil etish turadi."},
{"ref":"authored:pedagogy-pdf-corpus:v2:KS.05:Y2:001","construct":"KS.05","cognitive":"qollash","difficulty":3,"basis":"129994d7-9201-4ba2-acf6-101b5a907772","stem":"Xavfsiz rivojlantiruvchi muhitdagi vaziyatni mos choraga juftlang.","pairs":[{"l":"Kamsituvchi masxara","r":"Darhol to‘xtatish va hurmatli teng ishtirokni tiklash"},{"l":"Maxsus ta’limiy ehtiyoj","r":"Maqsadni saqlagan holda ehtiyojga moslashtirish kiritish"},{"l":"Favqulodda vaziyat","r":"Oldindan o‘rgatilgan xavfsiz harakat tartibiga amal qilish"},{"l":"Shubhali raqamli kontent","r":"Media xavfsizligi va manba ishonchliligini tekshirish"}],"exp":"KS.05 jismoniy, psixologik, ijtimoiy va raqamli xavfsizlik hamda teng ishtirokni qamrab oladi."},
{"ref":"authored:pedagogy-pdf-corpus:v2:KS.06:Y2:001","construct":"KS.06","cognitive":"qollash","difficulty":3,"basis":"2db4abf0-ac81-4ad1-9a8f-7fe67dacbdb3","stem":"Kasbiy rivojlanish faoliyatini uning natijasi bilan moslang.","pairs":[{"l":"Refleksiya","r":"Dars dalillari asosida kuchli va zaif tomonlarni aniqlash"},{"l":"Rivojlanish ehtiyojini belgilash","r":"Qaysi ko‘nikmani keyingi bosqichda yaxshilash kerakligini tanlash"},{"l":"Hamkasb darsini kuzatish","r":"Boshqa tajribani tahlil qilib o‘z amaliyoti uchun xulosa olish"},{"l":"Yangi usulni sinash","r":"O‘rganilgan yangilikni amaliyotga kiritib natijasini qayta baholash"}],"exp":"Kasbiy o‘sish bir martalik tadbir emas, refleksiya va amaliy sinov bilan davom etadigan sikldir."},
{"ref":"authored:pedagogy-pdf-corpus:v2:KS.07:Y2:001","construct":"KS.07","cognitive":"qollash","difficulty":3,"basis":"4699a03d-44ba-49a5-94d4-7e5daa63d6de","stem":"Hamkorlik vaziyatini eng mos professional harakat bilan juftlang.","pairs":[{"l":"Uy vazifasi muntazam bajarilmayapti","r":"Ota-ona bilan dalil va yordam rejasini kelishish"},{"l":"Bir necha fan bo‘yicha bir xil qiyinchilik","r":"Hamkasblar bilan kuzatuv va yordam choralarini muvofiqlashtirish"},{"l":"Maxsus ehtiyoj bo‘yicha maslahat kerak","r":"Tegishli mutaxassis bilan zarur ma’lumot doirasida hamkorlik qilish"},{"l":"Shaxsiy ma’lumot almashish zarur","r":"Faqat vazifaga kerakli ma’lumotni maxfiylikni saqlab ulashish"}],"exp":"Hamkorlik o‘quvchi manfaatiga xizmat qiladigan kelishilgan harakat, vazifa taqsimoti va maxfiylikni talab qiladi."},
{"ref":"authored:pedagogy-pdf-corpus:v2:PM.GEN.01:Y2:001","construct":"PM.GEN.01","cognitive":"bilish","difficulty":3,"basis":"1e1ecf50-d2ce-4451-b94c-b8becdb5cec4","stem":"Pedagogik tushuncha yoki tadqiqot metodini mos ta’rif bilan juftlang.","pairs":[{"l":"Didaktika","r":"O‘qitish maqsadi, mazmuni, tamoyili va metodlarini o‘rganadi"},{"l":"Pedagogik kuzatish","r":"Jarayonni aniq maqsad bilan izchil va tizimli kuzatadi"},{"l":"Anketa","r":"Tizimlangan savollar orqali ko‘pincha yozma ma’lumot yig‘adi"},{"l":"Intervyu","r":"Turkum savollar orqali respondent munosabatini aniqlaydi"}],"exp":"Pedagogika nazariyasi va tadqiqot metodlari vazifasi bilan farqlanadi; metod nomidan ko‘ra dalil yig‘ish usuli muhim."},
{"ref":"authored:pedagogy-pdf-corpus:v2:PM.GEN.02:Y2:001","construct":"PM.GEN.02","cognitive":"qollash","difficulty":3,"stem":"Ta’lim tamoyilini vaziyatdagi asosiy belgi bilan moslang.","pairs":[{"l":"Onglilik va faollik","r":"O‘quvchi mazmunni anglab fikr bildiradi va faol bajaradi"},{"l":"Ko‘rgazmalilik","r":"Model, sxema yoki tajriba mazmunni aniqroq tushunishga yordam beradi"},{"l":"Tizimlilik va muntazamlilik","r":"Yangi bilim oldingi bilim bilan izchil bog‘lanadi"},{"l":"Nazariya va amaliyot birligi","r":"O‘rganilgan tushuncha real vazifada qo‘llanadi"}],"exp":"Tamoyilni tanlashda vaziyatning asosiy urg‘usi aniqlanadi; bir holatda bir nechta tamoyil bo‘lishi mumkin."}
]
$json$::jsonb)
  loop
    if exists(select 1 from public.questions where source_reference=item->>'ref') then
      continue;
    end if;

    select c.id,c.subject_id,c.group_code
      into v_construct,v_subject,v_group
      from public.constructs c
     where c.code=item->>'construct' and c.is_active;

    select l.id into v_lesson
      from public.lesson_constructs lc
      join public.lessons l on l.id=lc.lesson_id
     where lc.construct_id=v_construct
       and l.status='published'::public.content_status
       and l.slug=case item->>'construct'
         when 'KS.01' then 'oquv-jarayonini-rejalashtirish'
         when 'KS.02' then 'talim-samaradorligini-taminlash'
         when 'KS.03' then 'ozlashtirishni-baholash-va-qayta-aloqa'
         when 'KS.04' then 'tarbiyaviy-faoliyatni-tashkil-etish'
         when 'KS.05' then 'xavfsiz-rivojlantiruvchi-talim-muhiti'
         when 'KS.06' then 'oz-ozini-rivojlantirish-va-kasbiy-osish'
         when 'KS.07' then 'hamkasblar-va-ota-onalar-bilan-hamkorlik'
         when 'PM.GEN.01' then 'pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi'
         when 'PM.GEN.02' then 'pedagogikaning-asosiy-tamoyillari'
       end;

    if v_construct is null or v_lesson is null then
      raise exception 'pedagogy v2 Y2 source mapping failed: %',item->>'construct';
    end if;

    v_question:=gen_random_uuid();
    insert into public.questions(
      id,subject_id,construct_id,group_code,format,cognitive,difficulty,
      stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id
    ) values(
      v_question,v_subject,v_construct,v_group,'Y2'::public.question_format,
      (item->>'cognitive')::public.cognitive_level,(item->>'difficulty')::int,
      item->>'stem','[]'::jsonb,false,'review'::public.content_status,null,
      item->>'ref',v_lesson
    );

    v_left_ids:=array_fill(null::uuid,array[4]);
    v_right_ids:=array_fill(null::uuid,array[4]);

    for v_i in 1..4 loop
      v_option:=gen_random_uuid();
      v_left_ids[v_i]:=v_option;
      insert into public.question_options(id,question_id,content_md,order_idx)
      values(v_option,v_question,item->'pairs'->(v_i-1)->>'l',v_i);
    end loop;

    for v_j in 1..4 loop
      v_logical:=v_perm[v_j];
      v_option:=gen_random_uuid();
      v_right_ids[v_logical]:=v_option;
      insert into public.question_options(id,question_id,content_md,order_idx)
      values(v_option,v_question,item->'pairs'->(v_logical-1)->>'r',4+v_j);
    end loop;

    v_pairs:='{}'::jsonb;
    for v_i in 1..4 loop
      v_pairs:=v_pairs || jsonb_build_object(v_left_ids[v_i]::text,v_right_ids[v_i]::text);
    end loop;

    insert into public.question_keys(question_id,payload,explanation_md)
    values(v_question,jsonb_build_object('pairs',v_pairs),item->>'exp');

    if coalesce(item->>'basis','')<>'' then
      v_basis:=(item->>'basis')::uuid;
      update public.pedagogy_pdf_source_candidates
         set linked_question_id=coalesce(linked_question_id,v_question),
             reviewed_at=coalesce(reviewed_at,now())
       where id=v_basis
         and answer_key_status='independently_verified'
         and editorial_status='verified'
         and duplicate_of_candidate_id is null;
    end if;
  end loop;

  -- Y3 ordering: PM.GEN.03..PM.GEN.08 + PM.MET.01..PM.MET.03
  for item in
    select * from jsonb_array_elements($json$
[
{"ref":"authored:pedagogy-pdf-corpus:v2:PM.GEN.03:Y3:001","construct":"PM.GEN.03","cognitive":"qollash","difficulty":3,"stem":"Vaziyatdagi yetakchi tarbiya turini aniqlash bosqichlarini tartiblang.","steps":["Faoliyatning asosiy tarbiyaviy maqsadini aniqlash","Qaysi qadriyat, xulq yoki sifat rivojlantirilayotganini ajratish","Belgilarni tarbiya turlari bilan taqqoslash","Eng bevosita maqsadga mos yetakchi tarbiya turini tanlash"],"exp":"Bir faoliyat bir necha tarbiya turiga xizmat qilishi mumkin; testda eng bevosita tarbiyaviy maqsad tanlanadi."},
{"ref":"authored:pedagogy-pdf-corpus:v2:PM.GEN.04:Y3:001","construct":"PM.GEN.04","cognitive":"qollash","difficulty":3,"stem":"Darsni maqsadga muvofiq rejalashtirish ketma-ketligini tartiblang.","steps":["Kutiladigan natijani belgilash","O‘quvchilarning avvalgi bilimini aniqlash","Mazmun, faoliyat, metod va vaqt ketma-ketligini tuzish","Natijani tekshiradigan baholash dalilini belgilash"],"exp":"Dars turi va boshqaruv qarorlari yetakchi didaktik maqsad va tekshiriladigan natijadan kelib chiqadi."},
{"ref":"authored:pedagogy-pdf-corpus:v2:PM.GEN.05:Y3:001","construct":"PM.GEN.05","cognitive":"mulohaza","difficulty":4,"basis":"4c02e22d-ae53-4dc1-af37-a87ce051104f","stem":"Sinf rahbari o‘quvchilar o‘rtasidagi nizoni hal qilish jarayonini tartiblang.","steps":["Avvalo xavfsizlik va vaziyatni nazoratga olish","Tomonlarni xolis tinglab faktlarni aniqlash","Nizo sababi va ehtiyojlarni tahlil qilish","Kelishilgan tiklovchi yechim va keyingi kuzatuvni belgilash"],"exp":"Sinf rahbari bir tomonni darhol ayblamaydi; xavfsizlik, xolis tinglash, sababni tushunish va kelishilgan yechim ketma-ketligi muhim."},
{"ref":"authored:pedagogy-pdf-corpus:v2:PM.GEN.06:Y3:001","construct":"PM.GEN.06","cognitive":"qollash","difficulty":3,"basis":"1759c2fc-cf61-4129-89f0-745309eb8de4","stem":"O‘quvchiga pedagogik takt bilan tuzatish berish jarayonini tartiblang.","steps":["Vaziyatni va o‘quvchining holatini kuzatish","Shaxsni emas, konkret xatti-harakat yoki xatoni ajratish","Hurmatli va tushunarli tarzda keyingi to‘g‘ri qadamni aytish","O‘quvchining javobi va keyingi holatini kuzatish"],"exp":"Pedagogik takt talabchanlikni hurmat bilan uyg‘unlashtiradi va o‘quvchi qadr-qimmatini saqlaydi."},
{"ref":"authored:pedagogy-pdf-corpus:v2:PM.GEN.07:Y3:001","construct":"PM.GEN.07","cognitive":"qollash","difficulty":3,"basis":"2f1459cf-a26f-433b-a401-1be75e799ef4","stem":"Pedagogik qobiliyatga oid vaziyatni tahlil qilish bosqichlarini tartiblang.","steps":["Vaziyatda o‘qituvchidan qanday pedagogik harakat talab qilinishini aniqlash","Qaysi harakat yoki sezgirlik yetishmayotganini topish","Belgini mos pedagogik qobiliyat bilan bog‘lash","Yaqin tushunchalar bilan solishtirib eng aniq qobiliyatni tanlash"],"exp":"Qobiliyat nomi vaziyatdagi yetakchi pedagogik harakatga qarab tanlanadi: sezish — perseptiv, tushuntirish — didaktik, fan bilimi — akademik va hokazo."},
{"ref":"authored:pedagogy-pdf-corpus:v2:PM.GEN.08:Y3:001","construct":"PM.GEN.08","cognitive":"qollash","difficulty":3,"basis":"f2bd1f89-af2d-47f9-9f02-c6518c2aaca0","stem":"Ta’lim texnologiyasini vaziyatga mos tanlash bosqichlarini tartiblang.","steps":["Kutiladigan o‘quv natijasini aniqlash","Vazifa turi va o‘quvchining ehtiyojini tahlil qilish","Ishtirokchi roli va faoliyatiga mos texnologiyani tanlash","Natijani ko‘rsatadigan baholash dalilini belgilash"],"exp":"Texnologiya zamonaviy ko‘ringani uchun emas, maqsad, vazifa va o‘quvchi faoliyatiga mosligi uchun tanlanadi."},
{"ref":"authored:pedagogy-pdf-corpus:v2:PM.MET.01:Y3:001","construct":"PM.MET.01","cognitive":"qollash","difficulty":3,"stem":"Informatika darsi uchun metodik tizimni loyihalash ketma-ketligini tartiblang.","steps":["O‘quvchi erishishi kerak bo‘lgan natijani aniqlash","Natijaga mos informatika mazmunini tanlash","O‘quvchi bajaradigan faoliyat, metod va vositalarni belgilash","Natijani amaliy dalil bilan tekshirish usulini tanlash"],"exp":"Informatika metodikasi nima uchun, nima va qanday o‘qitish savollarini o‘zaro bog‘langan tizim sifatida ko‘radi."},
{"ref":"authored:pedagogy-pdf-corpus:v2:PM.MET.02:Y3:001","construct":"PM.MET.02","cognitive":"qollash","difficulty":3,"basis":"37e40107-87f7-4ea6-9122-e1ecd00764b1","stem":"Informatika darsida o‘qitish metodini tanlash jarayonini tartiblang.","steps":["O‘quv maqsadini aniq belgilash","O‘quvchi bajarishi kerak bo‘lgan fikrlash yoki amaliy harakatni aniqlash","Shu faoliyatga mos metodni tanlash","Vosita va tekshiriladigan natija dalilini metodga moslashtirish"],"exp":"Vosita metodning o‘zi emas; metod o‘quv maqsadi va o‘quvchi faoliyatidan kelib chiqib tanlanadi."},
{"ref":"authored:pedagogy-pdf-corpus:v2:PM.MET.03:Y3:001","construct":"PM.MET.03","cognitive":"mulohaza","difficulty":4,"stem":"Ta’limiy vaziyatdagi pedagogik qarorni asoslash bosqichlarini tartiblang.","steps":["Maqsad va kuzatiladigan natija dalilini aniqlash","Muammoning asosiy sababini ajratish","Sababga mos eng kichik maqsadli o‘zgarishni tanlash","O‘zgarishdan keyingi natijani qayta tekshirish"],"exp":"Asoslangan pedagogik qaror dalilga tayangan tashxis, maqsadli o‘zgarish va qayta tekshiruvdan iborat."}
]
$json$::jsonb)
  loop
    if exists(select 1 from public.questions where source_reference=item->>'ref') then
      continue;
    end if;

    select c.id,c.subject_id,c.group_code
      into v_construct,v_subject,v_group
      from public.constructs c
     where c.code=item->>'construct' and c.is_active;

    select l.id into v_lesson
      from public.lesson_constructs lc
      join public.lessons l on l.id=lc.lesson_id
     where lc.construct_id=v_construct
       and l.status='published'::public.content_status
       and l.slug=case item->>'construct'
         when 'PM.GEN.03' then 'tarbiya-va-uning-turlari'
         when 'PM.GEN.04' then 'dars-turlari-rejalashtirish-va-sinfni-boshqarish'
         when 'PM.GEN.05' then 'sinf-rahbari-hujjatlar-jamoa-va-ota-ona'
         when 'PM.GEN.06' then 'pedagogik-etika-nutq-texnika-va-takt'
         when 'PM.GEN.07' then 'pedagogik-qobiliyat-va-uning-turlari'
         when 'PM.GEN.08' then 'talim-texnologiyalari-va-vaziyatga-mos-tanlov'
         when 'PM.MET.01' then 'informatika-oqitish-yondashuvlari-va-metodikasi'
         when 'PM.MET.02' then 'oqitish-usullari-va-metodlarini-farqlash'
         when 'PM.MET.03' then 'talimiy-vaziyat-va-pedagogik-qarorni-baholash'
       end;

    if v_construct is null or v_lesson is null then
      raise exception 'pedagogy v2 Y3 source mapping failed: %',item->>'construct';
    end if;

    v_question:=gen_random_uuid();
    insert into public.questions(
      id,subject_id,construct_id,group_code,format,cognitive,difficulty,
      stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id
    ) values(
      v_question,v_subject,v_construct,v_group,'Y3'::public.question_format,
      (item->>'cognitive')::public.cognitive_level,(item->>'difficulty')::int,
      item->>'stem','[]'::jsonb,false,'review'::public.content_status,null,
      item->>'ref',v_lesson
    );

    v_step_ids:=array_fill(null::uuid,array[4]);
    for v_j in 1..4 loop
      v_logical:=v_perm[v_j];
      v_option:=gen_random_uuid();
      v_step_ids[v_logical]:=v_option;
      insert into public.question_options(id,question_id,content_md,order_idx)
      values(v_option,v_question,item->'steps'->>(v_logical-1),v_j);
    end loop;

    insert into public.question_keys(question_id,payload,explanation_md)
    values(v_question,jsonb_build_object('order',to_jsonb(v_step_ids)),item->>'exp');

    if coalesce(item->>'basis','')<>'' then
      v_basis:=(item->>'basis')::uuid;
      update public.pedagogy_pdf_source_candidates
         set linked_question_id=coalesce(linked_question_id,v_question),
             reviewed_at=coalesce(reviewed_at,now())
       where id=v_basis
         and answer_key_status='independently_verified'
         and editorial_status='verified'
         and duplicate_of_candidate_id is null;
    end if;
  end loop;

  if (select count(*) from public.questions where source_reference like 'authored:pedagogy-pdf-corpus:v2:%')<>18 then
    raise exception 'pedagogy corpus v2 expected 18 review items';
  end if;

  if exists(
    select 1
    from public.questions q
    where q.source_reference like 'authored:pedagogy-pdf-corpus:v2:%'
      and (
        q.status<>'review'::public.content_status
        or q.source_lesson_id is null
        or not exists(select 1 from public.question_keys k where k.question_id=q.id)
        or not exists(
          select 1 from public.lesson_constructs lc
          where lc.lesson_id=q.source_lesson_id and lc.construct_id=q.construct_id
        )
        or (q.format='Y2'::public.question_format and (select count(*) from public.question_options o where o.question_id=q.id)<>8)
        or (q.format='Y3'::public.question_format and (select count(*) from public.question_options o where o.question_id=q.id)<>4)
      )
  ) then
    raise exception 'pedagogy corpus v2 invariant failed';
  end if;
end
$bank$;

commit;

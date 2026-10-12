-- Specification gap closure review bank (2026-10-12).
--
-- 36 original source-backed questions for six official constructs that had
-- zero published questions in the 2026-10-12 production integrity audit:
--   S3.LOGIC.01, S3.LOGIC.03, S3.ALGO.03, S4.CODE.04, S6.NET.02, S6.NET.04
--
-- Format mix: 24 Y1 + 6 Y2 + 6 Y3.
-- Safety: every item is inserted as REVIEW, never auto-published. Source
-- lessons are resolved through the active construct mapping at migration time.
-- Idempotent by source_reference.

begin;

do $$
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
  v_correct int;
  v_logical int;
  v_left_ids uuid[];
  v_right_ids uuid[];
  v_step_ids uuid[];
  v_pairs jsonb;
  v_perm int[] := array[3,1,4,2];
begin
  -- Y1 single-answer review items.
  for item in
    select * from jsonb_array_elements($json$
[{"ref":"specgap-2026:ZC-L01-Y1-001","construct":"S3.LOGIC.01","cognitive":"bilish","difficulty":1,"stem":"Qaysi gap mantiqiy mulohaza hisoblanadi?","options":["12 soni 3 ga bo‘linadi.","Eshikni yoping.","Soat nechchi?","Qanday ajoyib kun!"],"correct":0,"exp":"Mantiqiy mulohazaga rost yoki yolg‘on qiymat berish mumkin. “12 soni 3 ga bo‘linadi” darak gap va rost hukmdir."},{"ref":"specgap-2026:ZC-L01-Y1-002","construct":"S3.LOGIC.01","cognitive":"bilish","difficulty":2,"stem":"Qaysi variant murakkab mantiqiy mulohaza?","options":["8 juft son.","8 soni 5 dan katta.","8 juft son VA 8 soni 5 dan katta.","8 sonini yozing."],"correct":2,"exp":"Ikki sodda mulohaza mantiqiy bog‘lovchi bilan birlashtirilsa murakkab mulohaza hosil bo‘ladi."},{"ref":"specgap-2026:ZC-L01-Y1-003","construct":"S3.LOGIC.01","cognitive":"qollash","difficulty":2,"stem":"A: “15 > 10”, B: “15 juft son”. A va B ning rostlik qiymatlari qaysi?","options":["A — rost, B — rost","A — rost, B — yolg‘on","A — yolg‘on, B — rost","A — yolg‘on, B — yolg‘on"],"correct":1,"exp":"15 > 10 rost; 15 juft son emas, demak B yolg‘on."},{"ref":"specgap-2026:ZC-L01-Y1-004","construct":"S3.LOGIC.01","cognitive":"qollash","difficulty":2,"stem":"Qaysi gap yolg‘on bo‘lsa ham mantiqiy mulohaza hisoblanadi?","options":["9 tub son.","9 ni yozing.","9 nechaga teng?","Voy, 9 juda katta!"],"correct":0,"exp":"Mulohaza rost bo‘lishi shart emas; unga aniq rost yoki yolg‘on qiymat berish mumkin bo‘lishi kifoya. “9 tub son” yolg‘on mulohaza."},{"ref":"specgap-2026:ZC-L03-Y1-001","construct":"S3.LOGIC.03","cognitive":"qollash","difficulty":3,"stem":"Tizimga kirish uchun foydalanuvchi tasdiqlangan BO‘LISHI VA parol to‘g‘ri bo‘lishi kerak. Foydalanuvchi tasdiqlangan, lekin parol noto‘g‘ri. Qanday xulosa chiqadi?","options":["Kirishga ruxsat beriladi.","Kirishga ruxsat berilmaydi.","Parol tekshirilmaydi.","Faqat foydalanuvchi nomi tekshiriladi."],"correct":1,"exp":"VA shartida ikkala shart bir vaqtda rost bo‘lishi kerak. Parol noto‘g‘ri bo‘lgani uchun kirish rad etiladi."},{"ref":"specgap-2026:ZC-L03-Y1-002","construct":"S3.LOGIC.03","cognitive":"qollash","difficulty":3,"stem":"Qidiruv natijasiga yozuv “Yil = 2026 YOKI Muallif = Ali” sharti bilan olinadi. Yili 2025, muallifi Ali bo‘lgan yozuv haqida qaysi xulosa to‘g‘ri?","options":["Natijaga kirmaydi.","Natijaga kiradi.","Faqat yil 2026 bo‘lsa kiradi.","Shartni tekshirib bo‘lmaydi."],"correct":1,"exp":"YOKI modelida kamida bitta shart rost bo‘lsa yetarli. Muallif = Ali rost, shuning uchun yozuv tanlanadi."},{"ref":"specgap-2026:ZC-L03-Y1-003","construct":"S3.LOGIC.03","cognitive":"mulohaza","difficulty":4,"stem":"Berilgan: “Barcha ro‘yxatdan o‘tgan foydalanuvchilarda ID mavjud.” Dilshod ro‘yxatdan o‘tgan. Qaysi xulosa shartlardan kelib chiqadi?","options":["Dilshodda ID mavjud.","Dilshod administrator.","Dilshodda parol yo‘q.","Dilshod tizimdan chiqqan."],"correct":0,"exp":"Umumiy qoida va Dilshodning shu toifaga kirishi bevosita “Dilshodda ID mavjud” xulosasini beradi. Qolgan ma’lumotlar shartda yo‘q."},{"ref":"specgap-2026:ZC-L03-Y1-004","construct":"S3.LOGIC.03","cognitive":"mulohaza","difficulty":4,"stem":"“A yoki B dan kamida bittasi rost” sharti berilgan. A yolg‘on ekani aniq. Qanday xulosa zarur?","options":["B ham yolg‘on.","B rost.","A rost bo‘lishi kerak.","B haqida hech narsa aytib bo‘lmaydi."],"correct":1,"exp":"Kamida bittasi rost bo‘lishi kerak. A yolg‘on bo‘lsa, shart bajarilishi uchun B rost bo‘lishi zarur."},{"ref":"specgap-2026:ZC-A03-Y1-001","construct":"S3.ALGO.03","cognitive":"qollash","difficulty":2,"stem":"To‘g‘ri to‘rtburchak perimetrini hisoblash masalasida qaysi juftlik kirish va chiqish ma’lumotlarini to‘g‘ri ko‘rsatadi?","options":["Kirish: a, b; chiqish: P","Kirish: P; chiqish: a, b","Kirish: faqat a; chiqish: b","Kirish: P va a; chiqish: b"],"correct":0,"exp":"Perimetrni hisoblash uchun tomonlar a va b kirish bo‘ladi; P = 2(a+b) natija sifatida chiqariladi."},{"ref":"specgap-2026:ZC-A03-Y1-002","construct":"S3.ALGO.03","cognitive":"qollash","difficulty":3,"stem":"Ikki sonning kattasini topish algoritmida qaysi boshqaruv tuzilmasi zarur?","options":["Faqat chiziqli ketma-ketlik","Shartli tarmoqlanish","Majburiy cheksiz takrorlash","Faqat fayl bilan ishlash"],"correct":1,"exp":"Qaysi son katta ekanini aniqlash uchun taqqoslash va natijaga qarab yo‘l tanlash kerak, ya’ni tarmoqlanish zarur."},{"ref":"specgap-2026:ZC-A03-Y1-003","construct":"S3.ALGO.03","cognitive":"qollash","difficulty":3,"stem":"1 dan n gacha bo‘lgan sonlar yig‘indisini ketma-ket qo‘shish usulida hisoblash algoritmida qaysi tuzilma eng tabiiy?","options":["Takrorlash","Faqat bitta shart bloki","Faqat kiritish bloki","Hech qanday hisoblashsiz chiqarish"],"correct":0,"exp":"1 dan n gacha bir xil qo‘shish amali ko‘p marta bajariladi, shuning uchun takrorlash tuzilmasi mos keladi."},{"ref":"specgap-2026:ZC-A03-Y1-004","construct":"S3.ALGO.03","cognitive":"mulohaza","difficulty":4,"stem":"Masala: uchta sonning o‘rtachasini topish. Qaysi algoritmik reja to‘g‘ri?","options":["a,b,c ni kiritish → s=a+b+c → o=s/3 → o ni chiqarish","o ni chiqarish → a,b,c ni kiritish → s=a+b+c","a ni kiritish → o=a/3 → tugatish","s=3 → a,b,c ni chiqarish → o=s"],"correct":0,"exp":"Avval barcha kirish qiymatlari olinadi, keyin yig‘indi va o‘rtacha hisoblanadi, so‘ng natija chiqariladi."},{"ref":"specgap-2026:ZC-JS04-Y1-001","construct":"S4.CODE.04","cognitive":"bilish","difficulty":1,"stem":"JavaScript’da o‘zgaruvchini e’lon qilish uchun darslik misollarida qaysi kalit so‘z ishlatilgan?","options":["var","def","int","echo"],"correct":0,"exp":"Manba darslikdagi JavaScript misollarida o‘zgaruvchi `var` kalit so‘zi bilan e’lon qilinadi."},{"ref":"specgap-2026:ZC-JS04-Y1-002","construct":"S4.CODE.04","cognitive":"bilish","difficulty":2,"stem":"Qaysi satr JavaScript sintaksisida x o‘zgaruvchisiga 10 qiymatini beradi?","options":["var x = 10;","x := 10;","int x = 10;","x == 10;"],"correct":0,"exp":"Manba darslikdagi JavaScript sintaksisida o‘zgaruvchi `var x = 10;` ko‘rinishida e’lon qilinib qiymat beriladi."},{"ref":"specgap-2026:ZC-JS04-Y1-003","construct":"S4.CODE.04","cognitive":"qollash","difficulty":2,"stem":"Qaysi JavaScript buyrug‘i matnni brauzer konsoliga chiqaradi?","options":["console.log(\"Salom\");","print(\"Salom\")","System.out.println(\"Salom\");","echo \"Salom\";"],"correct":0,"exp":"JavaScript’da `console.log(...)` konsolga qiymat chiqarishning asosiy usullaridan biridir."},{"ref":"specgap-2026:ZC-JS04-Y1-004","construct":"S4.CODE.04","cognitive":"qollash","difficulty":3,"stem":"Kod bajarilganda nima chiqadi?\n```javascript\nvar x = 4;\nconsole.log(x + 1);\n```","options":["4","5","41","x + 1"],"correct":1,"exp":"`x` son sifatida 4 qiymatiga ega; 4 + 1 = 5, `console.log` 5 ni chiqaradi."},{"ref":"specgap-2026:ZC-N02-Y1-001","construct":"S6.NET.02","cognitive":"bilish","difficulty":2,"stem":"Qaysi tavsif client/server tarmoq arxitekturasiga mos?","options":["Markaziy server xizmat yoki resurs taqdim etadi, clientlar undan foydalanadi.","Har bir qurilma faqat mustaqil ishlaydi va tarmoq yo‘q.","Barcha qurilmalar faqat bir xil IP manzil ishlatadi.","Markaziy qurilma bo‘lmasligi majburiy."],"correct":0,"exp":"Client/server modelida xizmatlar yoki resurslar markaziy server orqali boshqarilishi va clientlarga taqdim etilishi mumkin."},{"ref":"specgap-2026:ZC-N02-Y1-002","construct":"S6.NET.02","cognitive":"bilish","difficulty":2,"stem":"Peer-to-peer arxitekturasining asosiy belgisi qaysi?","options":["Qurilmalar teng huquqli tarzda resurs almashishi mumkin.","Faqat bitta client bo‘lishi mumkin.","Har bir xizmat majburiy markaziy serverda bo‘ladi.","Tarmoq faqat WAN bo‘lishi kerak."],"correct":0,"exp":"Peer-to-peer modelida qurilmalar alohida markaziy serverga majburiy bog‘lanmasdan o‘zaro resurs almashishi mumkin."},{"ref":"specgap-2026:ZC-N02-Y1-003","construct":"S6.NET.02","cognitive":"qollash","difficulty":3,"stem":"Yulduz topologiyasida markaziy switch ishlamay qolsa, eng ehtimoliy oqibat qaysi?","options":["Markazga bog‘langan tugunlar o‘zaro aloqa qila olmay qoladi.","Faqat bitta tasodifiy tugun uziladi.","Tarmoq avtomatik halqa topologiyasiga aylanadi.","IP manzillar o‘z-o‘zidan o‘zgaradi."],"correct":0,"exp":"Yulduz topologiyasida markaziy qurilma umumiy bog‘lanish nuqtasi bo‘lgani uchun uning ishdan chiqishi butun segmentga ta’sir qilishi mumkin."},{"ref":"specgap-2026:ZC-N02-Y1-004","construct":"S6.NET.02","cognitive":"mulohaza","difficulty":4,"stem":"Shina topologiyasida asosiy umumiy kabel uzildi. Qaysi xulosa eng asosli?","options":["Ko‘p tugunlar o‘rtasidagi aloqa buzilishi mumkin.","Faqat serverning paroli o‘zgaradi.","Faqat bitta printer siyohi tugaydi.","Topologiya avtomatik peer-to-peer bo‘ladi."],"correct":0,"exp":"Shina topologiyasida umumiy asosiy aloqa yo‘li kritik nuqta bo‘lishi mumkin; uning uzilishi ko‘p tugun aloqasiga ta’sir etadi."},{"ref":"specgap-2026:ZC-N04-Y1-001","construct":"S6.NET.04","cognitive":"qollash","difficulty":2,"stem":"Umumiy kompyuterda elektron pochtadan foydalangandan keyin qaysi amal eng xavfsiz?","options":["Akkauntdan chiqish va brauzerda parolni saqlamaslik","Brauzerni ochiq qoldirish","Parolni matn faylida ish stoliga yozish","Akkauntni boshqa foydalanuvchiga berish"],"correct":0,"exp":"Umumiy qurilmada sessiyani yopish va parolni saqlamaslik boshqa foydalanuvchining akkauntga kirish xavfini kamaytiradi."},{"ref":"specgap-2026:ZC-N04-Y1-002","construct":"S6.NET.04","cognitive":"qollash","difficulty":3,"stem":"Kutilmagan xatda “darhol oching” degan havola va fayl bor. Eng to‘g‘ri birinchi harakat qaysi?","options":["Yuboruvchi va xabar haqiqiyligini tekshirish, havola/faylni shoshilmay ochmaslik","Darhol faylni ishga tushirish","Parolni javob xatida yuborish","Xabarni barcha kontaktlarga yo‘naltirish"],"correct":0,"exp":"Kutilmagan havola yoki fayl phishing yoki zararli kontent bo‘lishi mumkin; avval yuboruvchi va mazmunni tekshirish kerak."},{"ref":"specgap-2026:ZC-N04-Y1-003","construct":"S6.NET.04","cognitive":"mulohaza","difficulty":4,"stem":"Sayt shaxsiy ma’lumot so‘rayapti. Ma’lumotni kiritishdan oldin nimani baholash eng muhim?","options":["Saytning haqiqiyligi va bu ma’lumot nima uchun kerakligini","Faqat sahifa rangini","Faqat logotip kattaligini","Faqat reklama sonini"],"correct":0,"exp":"Shaxsiy ma’lumot berishdan oldin xizmatning haqiqiyligi, maqsadi va ma’lumot zarurligini tekshirish xavfni kamaytiradi."},{"ref":"specgap-2026:ZC-N04-Y1-004","construct":"S6.NET.04","cognitive":"qollash","difficulty":3,"stem":"Internetdan topilgan ma’lumotdan vazifada foydalanishdan oldin qaysi yondashuv maqsadli va xavfsiz foydalanishga mos?","options":["Manba, sana va mazmun mosligini tekshirish","Birinchi chiqqan natijani tekshirmasdan ko‘chirish","Muallifi noma’lum faylni darhol yuklab ishga tushirish","Har qanday saytda bir xil paroldan foydalanish"],"correct":0,"exp":"Maqsadli foydalanish topilgan axborotning vazifaga mosligi va manbaning ishonchliligini baholashni talab qiladi."}]
$json$::jsonb)
  loop
    if exists (
      select 1 from public.questions
      where source_reference = item->>'ref'
    ) then
      continue;
    end if;

    select c.id, c.subject_id, c.group_code
      into v_construct, v_subject, v_group
      from public.constructs c
     where c.code = item->>'construct'
       and c.is_active;

    if v_construct is null then
      raise exception 'spec-gap construct not found: %', item->>'construct';
    end if;

    select l.id
      into v_lesson
      from public.lesson_constructs lc
      join public.lessons l on l.id = lc.lesson_id
     where lc.construct_id = v_construct
       and l.status = 'published'::public.content_status
     order by case when length(coalesce(l.body_mdx,'')) > 0 then 0 else 1 end,
              l.order_idx, l.id
     limit 1;

    if v_lesson is null then
      raise exception 'spec-gap published source lesson not found: %', item->>'construct';
    end if;

    v_question := gen_random_uuid();
    insert into public.questions(
      id, subject_id, construct_id, group_code, format, cognitive, difficulty,
      stem_md, assets, is_generated, status, author_id, source_reference, source_lesson_id
    ) values (
      v_question, v_subject, v_construct, v_group,
      'Y1'::public.question_format,
      (item->>'cognitive')::public.cognitive_level,
      (item->>'difficulty')::int,
      item->>'stem',
      '[]'::jsonb,
      false,
      'review'::public.content_status,
      null,
      item->>'ref',
      v_lesson
    );

    v_correct := (item->>'correct')::int;
    for v_i in 0..3 loop
      v_option := gen_random_uuid();
      insert into public.question_options(id, question_id, content_md, order_idx)
      values(v_option, v_question, item->'options'->>v_i, v_i);

      if v_i = v_correct then
        insert into public.question_keys(question_id, payload, explanation_md)
        values(
          v_question,
          jsonb_build_object('correct_option_id', v_option),
          item->>'exp'
        );
      end if;
    end loop;
  end loop;

  -- Y2 matching review items.
  for item in
    select * from jsonb_array_elements($json$
[{"ref":"specgap-2026:ZC-L01-Y2-001","construct":"S3.LOGIC.01","cognitive":"qollash","difficulty":3,"stem":"Gaplarni ularning mantiqiy turiga moslang.","pairs":[{"l":"“10 juft son.”","r":"Rost mantiqiy mulohaza"},{"l":"“10 tub son.”","r":"Yolg‘on mantiqiy mulohaza"},{"l":"“10 ni yozing.”","r":"Buyruq gap — mulohaza emas"},{"l":"“10 nechaga bo‘linadi?”","r":"Savol gap — mulohaza emas"}],"exp":"Mulohaza — rost/yolg‘on qiymat berish mumkin bo‘lgan darak gap; buyruq va savol gaplar bu mezonga mos emas."},{"ref":"specgap-2026:ZC-L03-Y2-001","construct":"S3.LOGIC.03","cognitive":"qollash","difficulty":3,"stem":"Matndagi shart ifodasini mos mantiqiy model bilan juftlang.","pairs":[{"l":"“Ikkala shart ham bajarilsin”","r":"A AND B"},{"l":"“Kamida bittasi bajarilsin”","r":"A OR B"},{"l":"“A bajarilmasin”","r":"NOT A"},{"l":"“A ham, B ham bajarilmasin”","r":"NOT (A OR B)"}],"exp":"Matndagi “ikkala”, “kamida bittasi”, “emas”, “hech biri” kabi iboralar mos mantiqiy tuzilmani tanlashga yordam beradi."},{"ref":"specgap-2026:ZC-A03-Y2-001","construct":"S3.ALGO.03","cognitive":"qollash","difficulty":3,"stem":"Algoritm tuzish elementlarini ularning vazifasi bilan juftlang.","pairs":[{"l":"Kirish ma’lumoti","r":"Masalani yechish uchun olinadigan boshlang‘ich qiymat"},{"l":"Hisoblash/formula","r":"Kirish qiymatlaridan natijaga o‘tish amali"},{"l":"Shart","r":"Natijaga qarab bajarilish yo‘lini tanlash mezoni"},{"l":"Chiqish","r":"Algoritm yakunida foydalanuvchiga beriladigan natija"}],"exp":"Masala algoritmi kirish, hisoblash/shart va chiqish rolini aniq ajratganda tekshirish osonlashadi."},{"ref":"specgap-2026:ZC-JS04-Y2-001","construct":"S4.CODE.04","cognitive":"qollash","difficulty":3,"stem":"JavaScript elementlarini ularning asosiy vazifasi bilan juftlang.","pairs":[{"l":"var","r":"O‘zgaruvchini e’lon qilish"},{"l":"console.log()","r":"Qiymatni brauzer konsoliga chiqarish"},{"l":"==","r":"Qiymatlarning tengligini taqqoslash"},{"l":"===","r":"Qiymat va ma’lumot turi tengligini qat’iy taqqoslash"}],"exp":"Manba darslikda `var`, `console.log()`, `==` va `===` JavaScript misollari bilan berilgan; ularning vazifalari bir-biridan farq qiladi."},{"ref":"specgap-2026:ZC-N02-Y2-001","construct":"S6.NET.02","cognitive":"qollash","difficulty":3,"stem":"Tarmoq arxitekturasi/topologiya atamalarini mos tavsif bilan juftlang.","pairs":[{"l":"Client/server","r":"Markaziy server xizmat taqdim etadi, clientlar undan foydalanadi"},{"l":"Peer-to-peer","r":"Qurilmalar teng huquqli tarzda resurs almashishi mumkin"},{"l":"Yulduz","r":"Tugunlar markaziy qurilmaga ulanadi"},{"l":"Shina","r":"Tugunlar umumiy asosiy aloqa yo‘lidan foydalanadi"}],"exp":"Arxitektura resurs/xizmat boshqaruv modelini, topologiya esa qurilmalar bog‘lanish tuzilishini ifodalaydi."},{"ref":"specgap-2026:ZC-N04-Y2-001","construct":"S6.NET.04","cognitive":"qollash","difficulty":3,"stem":"Internetdan foydalanishdagi vaziyatni eng mos xavfsizlik chorasi bilan juftlang.","pairs":[{"l":"Kutilmagan login havolasi","r":"Yuboruvchi va domenni tekshirib, shubhali havoladan login qilmaslik"},{"l":"Umumiy kompyuterdagi akkaunt","r":"Ish tugagach sessiyadan chiqish"},{"l":"Yangilanish mavjud dastur","r":"Tasdiqlangan yangilanishni o‘rnatib zaifliklarni kamaytirish"},{"l":"Sayt shaxsiy ma’lumot so‘raydi","r":"Sayt haqiqiyligi va ma’lumot zarurligini tekshirish"}],"exp":"Xavfsizlik chorasi vaziyatdagi aniq xavfga mos tanlanadi; bitta chora barcha xavflarni yopmaydi."}]
$json$::jsonb)
  loop
    if exists (
      select 1 from public.questions
      where source_reference = item->>'ref'
    ) then
      continue;
    end if;

    select c.id, c.subject_id, c.group_code
      into v_construct, v_subject, v_group
      from public.constructs c
     where c.code = item->>'construct'
       and c.is_active;

    if v_construct is null then
      raise exception 'spec-gap Y2 construct not found: %', item->>'construct';
    end if;

    select l.id
      into v_lesson
      from public.lesson_constructs lc
      join public.lessons l on l.id = lc.lesson_id
     where lc.construct_id = v_construct
       and l.status = 'published'::public.content_status
     order by case when length(coalesce(l.body_mdx,'')) > 0 then 0 else 1 end,
              l.order_idx, l.id
     limit 1;

    if v_lesson is null then
      raise exception 'spec-gap Y2 source lesson not found: %', item->>'construct';
    end if;

    v_question := gen_random_uuid();
    insert into public.questions(
      id, subject_id, construct_id, group_code, format, cognitive, difficulty,
      stem_md, assets, is_generated, status, author_id, source_reference, source_lesson_id
    ) values (
      v_question, v_subject, v_construct, v_group,
      'Y2'::public.question_format,
      (item->>'cognitive')::public.cognitive_level,
      (item->>'difficulty')::int,
      item->>'stem',
      '[]'::jsonb,
      false,
      'review'::public.content_status,
      null,
      item->>'ref',
      v_lesson
    );

    v_left_ids := array_fill(null::uuid, array[4]);
    v_right_ids := array_fill(null::uuid, array[4]);

    for v_i in 1..4 loop
      v_option := gen_random_uuid();
      v_left_ids[v_i] := v_option;
      insert into public.question_options(id, question_id, content_md, order_idx)
      values(v_option, v_question, item->'pairs'->(v_i-1)->>'l', v_i);
    end loop;

    for v_j in 1..4 loop
      v_logical := v_perm[v_j];
      v_option := gen_random_uuid();
      v_right_ids[v_logical] := v_option;
      insert into public.question_options(id, question_id, content_md, order_idx)
      values(v_option, v_question, item->'pairs'->(v_logical-1)->>'r', 4 + v_j);
    end loop;

    v_pairs := '{}'::jsonb;
    for v_i in 1..4 loop
      v_pairs := v_pairs || jsonb_build_object(
        v_left_ids[v_i]::text,
        v_right_ids[v_i]::text
      );
    end loop;

    insert into public.question_keys(question_id, payload, explanation_md)
    values(
      v_question,
      jsonb_build_object('pairs', v_pairs),
      item->>'exp'
    );
  end loop;

  -- Y3 ordering review items.
  for item in
    select * from jsonb_array_elements($json$
[{"ref":"specgap-2026:ZC-L01-Y3-001","construct":"S3.LOGIC.01","cognitive":"qollash","difficulty":3,"stem":"Gapni mantiqiy mulohaza sifatida tahlil qilish bosqichlarini tartiblang.","steps":["Gap mazmunini diqqat bilan o‘qish","Gapga aniq rost yoki yolg‘on qiymat berish mumkinligini tekshirish","Mulohaza bo‘lsa uning sodda yoki murakkabligini aniqlash","Zarur bo‘lsa tarkibiy sodda mulohazalarni A, B kabi belgilash"],"exp":"Avval gapning mulohaza ekanligi tekshiriladi; shundan keyin tuzilishi va tarkibiy qismlari tahlil qilinadi."},{"ref":"specgap-2026:ZC-L03-Y3-001","construct":"S3.LOGIC.03","cognitive":"qollash","difficulty":3,"stem":"Matnli mantiqiy masaladan asosli xulosa chiqarish bosqichlarini tartiblang.","steps":["Berilgan fakt va shartlarni ajratish","Muhim hukmlarni A, B, C kabi mulohazalar bilan ifodalash","Ular orasidagi VA/YOKI/EMAS munosabatlarini aniqlash","Faqat berilgan shartlardan kelib chiqadigan xulosani tanlash"],"exp":"Mantiqiy masalada taxmin qo‘shmasdan, fakt → model → munosabat → xulosa ketma-ketligi ishonchli yechim beradi."},{"ref":"specgap-2026:ZC-A03-Y3-001","construct":"S3.ALGO.03","cognitive":"qollash","difficulty":3,"stem":"Masaladan algoritm tuzish jarayonini tartiblang.","steps":["Masala maqsadi, kirish va kutilgan chiqishni aniqlash","Kirish va chiqish orasidagi formula/shart modelini belgilash","Amallarni chiziqli, tarmoqlanuvchi yoki takrorlanuvchi ketma-ketlikda yozish","Oddiy test ma’lumot bilan algoritmni qo‘lda tekshirish"],"exp":"Yaxshi algoritm muammoni tushunishdan boshlanadi, keyin model va qadamlar tuziladi, oxirida test bilan tekshiriladi."},{"ref":"specgap-2026:ZC-JS04-Y3-001","construct":"S4.CODE.04","cognitive":"qollash","difficulty":3,"stem":"Oddiy JavaScript hisoblash skriptini tuzish va tekshirish qadamlarini tartiblang.","steps":["`var a = 5;` bilan boshlang‘ich qiymatni e’lon qilish","`var b = a + 2;` bilan yangi qiymatni hisoblash","`console.log(b);` bilan natijani konsolga chiqarish","Skriptni ishga tushirib konsolda 7 chiqqanini tekshirish"],"exp":"Oddiy skript deklaratsiya → hisoblash → chiqarish → tekshirish ketma-ketligida tuziladi; bu buyruqlar manba darslikdagi JavaScript sintaksisiga mos."},{"ref":"specgap-2026:ZC-N02-Y3-001","construct":"S6.NET.02","cognitive":"mulohaza","difficulty":4,"stem":"Berilgan vaziyat uchun tarmoq arxitekturasi va topologiyasini tanlash jarayonini tartiblang.","steps":["Foydalanuvchi, qurilma va resurs talablari aniqlanadi","Markazlashgan xizmat kerakmi yoki peer-to-peer yetarlimi baholanadi","Talablarga mos topologiya tanlanadi","Markaziy qurilma yoki asosiy kabel kabi nosozlik nuqtalari tahlil qilinadi"],"exp":"Tanlov avval talabdan boshlanadi; so‘ng arxitektura va topologiya belgilanib, nosozlik oqibatlari tekshiriladi."},{"ref":"specgap-2026:ZC-N04-Y3-001","construct":"S6.NET.04","cognitive":"qollash","difficulty":3,"stem":"Internetdan vazifa uchun axborotni xavfsiz va maqsadli ishlatish bosqichlarini tartiblang.","steps":["Kerakli axborot maqsadi va qidiruv so‘rovini aniqlash","Mos natijalarni topish","Manba, sana, muallif/tashkilot va mazmun ishonchliligini baholash","Tekshirilgan axborotdan vazifaga mos foydalanish va shubhali fayl/havolalardan saqlanish"],"exp":"Maqsadli qidiruv, manbani baholash va xavfsiz foydalanish birgalikda internetdan oqilona foydalanishni ta’minlaydi."}]
$json$::jsonb)
  loop
    if exists (
      select 1 from public.questions
      where source_reference = item->>'ref'
    ) then
      continue;
    end if;

    select c.id, c.subject_id, c.group_code
      into v_construct, v_subject, v_group
      from public.constructs c
     where c.code = item->>'construct'
       and c.is_active;

    if v_construct is null then
      raise exception 'spec-gap Y3 construct not found: %', item->>'construct';
    end if;

    select l.id
      into v_lesson
      from public.lesson_constructs lc
      join public.lessons l on l.id = lc.lesson_id
     where lc.construct_id = v_construct
       and l.status = 'published'::public.content_status
     order by case when length(coalesce(l.body_mdx,'')) > 0 then 0 else 1 end,
              l.order_idx, l.id
     limit 1;

    if v_lesson is null then
      raise exception 'spec-gap Y3 source lesson not found: %', item->>'construct';
    end if;

    v_question := gen_random_uuid();
    insert into public.questions(
      id, subject_id, construct_id, group_code, format, cognitive, difficulty,
      stem_md, assets, is_generated, status, author_id, source_reference, source_lesson_id
    ) values (
      v_question, v_subject, v_construct, v_group,
      'Y3'::public.question_format,
      (item->>'cognitive')::public.cognitive_level,
      (item->>'difficulty')::int,
      item->>'stem',
      '[]'::jsonb,
      false,
      'review'::public.content_status,
      null,
      item->>'ref',
      v_lesson
    );

    v_step_ids := array_fill(null::uuid, array[4]);
    for v_j in 1..4 loop
      v_logical := v_perm[v_j];
      v_option := gen_random_uuid();
      v_step_ids[v_logical] := v_option;
      insert into public.question_options(id, question_id, content_md, order_idx)
      values(v_option, v_question, item->'steps'->>(v_logical-1), v_j);
    end loop;

    insert into public.question_keys(question_id, payload, explanation_md)
    values(
      v_question,
      jsonb_build_object('order', to_jsonb(v_step_ids)),
      item->>'exp'
    );
  end loop;
end
$$;

commit;

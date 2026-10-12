-- TASK-060: close exact 2026 blueprint group×cognitive feasibility gaps.
--
-- These 17 Y1 questions are source-backed, original synthesis items. They are
-- safe for the public repository; the private AXB 570-item payload remains
-- outside Git. Source lessons are resolved by construct at migration time so
-- this migration works across fresh/source-backed and production lesson IDs.
--
-- Production was reconciled first through the admin/audit workflow. This
-- migration is idempotent by source_reference and records that state in the
-- normal migration history.

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
  v_correct int;
begin
  for item in select * from jsonb_array_elements('[{"exp":"Hisoblashdan oldin kirish qiymatlari olinadi, so‘ng formula bajarilib natija chiqariladi.","ref":"gapfill-2026:T060-ALG-001","stem":"To‘g‘ri to‘rtburchakning a va b tomonlari kiritilib, S=a*b hisoblanadi va natija chiqariladi. Algoritmning to‘g‘ri ketma-ketligini toping.","correct":1,"options":["Boshlash → S=a*b → a,b ni kiritish → S ni chiqarish → Tugatish","Boshlash → a,b ni kiritish → S=a*b → S ni chiqarish → Tugatish","Boshlash → S ni chiqarish → a,b ni kiritish → S=a*b → Tugatish","a,b ni kiritish → Tugatish → S=a*b → S ni chiqarish"],"cognitive":"qollash","construct":"S3.ALGO.02","difficulty":3},{"exp":"Takrorlanishlar soni oldindan ma’lum bo‘lsa, sanaladigan sikl kodni ixcham va boshqariladigan qiladi.","ref":"gapfill-2026:T060-ALG-002","stem":"Bir xil buyruqlar aynan 20 marta bajarilishi kerak va takrorlanishlar soni oldindan ma’lum. Qaysi algoritmik tuzilma eng mos?","correct":1,"options":["Faqat bitta IF sharti","Oldindan sanaladigan takrorlash (FOR/repeat 20)","Shartsiz cheksiz sikl","Faqat ketma-ket 20 marta qo‘lda yozish"],"cognitive":"qollash","construct":"S3.ALGO.01","difficulty":3},{"exp":"Natija va sharoitlar bir xil bo‘lsa, kamroq asosiy amal bajaradigan yechim odatda samaraliroq hisoblanadi.","ref":"gapfill-2026:T060-ALG-003","stem":"Ikki algoritm bir xil kirishlar uchun doimo bir xil to‘g‘ri natijani beradi. A algoritm 4 ta asosiy amal, B algoritm esa 7 ta asosiy amal bajaradi. Boshqa sharoitlar teng bo‘lsa, qaysi xulosa asosli?","correct":1,"options":["B har doim tezroq, chunki qadami ko‘p","A samaraliroq bo‘lishi mumkin, chunki kamroq asosiy amal bajaradi","Ikkalasi noto‘g‘ri, chunki natijalari bir xil","Faqat B algoritm hisoblanadi"],"cognitive":"mulohaza","construct":"S3.ALGO.04","difficulty":4},{"exp":"To‘rtta teng tomon va har safar 90° burilish kvadrat hosil qiladi.","ref":"gapfill-2026:T060-BLK-001","stem":"Scratch’da `repeat 4` ichida `move 100 steps` va `turn 90 degrees` buyruqlari bajariladi. Sprayt qanday shakl chizadi?","correct":1,"options":["Uchburchak","Kvadrat","Beshburchak","Aylana"],"cognitive":"qollash","construct":"S4.BLOCK.03","difficulty":3},{"exp":"Takrorlash qachon tugashi shartga bog‘liq bo‘lsa va urinishlar soni noma’lum bo‘lsa, repeat until mos keladi.","ref":"gapfill-2026:T060-BLK-002","stem":"Scratch viktorinasida savol o‘quvchi to‘g‘ri javob berguncha qayta so‘ralishi kerak. Urinishlar soni oldindan noma’lum. Qaysi blok eng mos?","correct":1,"options":["repeat 10","repeat until <javob = to‘g‘ri javob>","forever, hech qanday chiqishsiz","if blokini bir marta ishlatish"],"cognitive":"qollash","construct":"S4.BLOCK.03","difficulty":3},{"exp":"Teng tomonli uchburchakning tashqi burilish burchagi 120°; 3 marta 120° burilish 360° ni tashkil qiladi.","ref":"gapfill-2026:T060-BLK-003","stem":"Scratch Pen bilan teng tomonli uchburchak chizish uchun `repeat 3` ichida `move 80 steps` dan keyin qanday burilish berish kerak?","correct":2,"options":["60°","90°","120°","180°"],"cognitive":"qollash","construct":"S4.BLOCK.04","difficulty":3},{"exp":"range(1,4) qiymatlari 1, 2, 3. Ularning yig‘indisi 6.","ref":"gapfill-2026:T060-CODE-001","stem":"Quyidagi Python kodi nimani chiqaradi?\n```python\ns = 0\nfor i in range(1, 4):\n    s += i\nprint(s)\n```","correct":1,"options":["3","6","10","0"],"cognitive":"qollash","construct":"S4.CODE.02","difficulty":3},{"exp":"Sikl 3 dan boshlanadi va har aylanishda n birga kamayadi; 3, 2, 1 chiqarilgach n=0 bo‘lib sikl to‘xtaydi.","ref":"gapfill-2026:T060-CODE-002","stem":"Quyidagi Python kodi qanday ketma-ketlikni chiqaradi?\n```python\nn = 3\nwhile n > 0:\n    print(n, end=\" \")\n    n -= 1\n```","correct":1,"options":["1 2 3","3 2 1","3 3 3","2 1 0"],"cognitive":"qollash","construct":"S4.CODE.02","difficulty":3},{"exp":"JavaScript massiv indekslari 0 dan boshlanadi, shuning uchun a[1]=3. f(3)=3*3=9.","ref":"gapfill-2026:T060-CODE-003","stem":"Quyidagi JavaScript kodi qanday natija chiqaradi?\n```javascript\nfunction f(x) { return x * x; }\nlet a = [2, 3, 4];\nconsole.log(f(a[1]));\n```","correct":2,"options":["4","6","9","16"],"cognitive":"mulohaza","construct":"S4.CODE.05","difficulty":4},{"exp":"Telefon raqami raqamlardan iborat bo‘lsa ham hisoblash uchun son emas; matn turi formatni, jumladan boshidagi + yoki 0 ni saqlashga mos.","ref":"gapfill-2026:T060-DB-001","stem":"MS Access jadvalida telefon raqami saqlanadi. Ustida arifmetik amal bajarilmaydi va boshidagi `+` yoki `0` belgisi saqlanishi kerak. Qaysi ma’lumot turi eng mos?","correct":1,"options":["Number","Short Text (qisqa matn)","Currency","Yes/No"],"cognitive":"qollash","construct":"S4.DB.02","difficulty":3},{"exp":"Natijaga qaysi yozuvlar kirishini mezonlar belgilaydi. Bu vaziyatda ikkala shart bir vaqtda bajarilishi kerak.","ref":"gapfill-2026:T060-DB-002","stem":"Ma’lumotlar bazasidan faqat `Shahar = Navoiy` VA `Yil = 2026` bo‘lgan yozuvlarni chiqarish kerak. Eng to‘g‘ri yondashuv qaysi?","correct":1,"options":["Faqat Shahar ustunini A-Z saralash","So‘rovda ikkala maydonga ham mos mezon qo‘yish","Jadvaldagi barcha yozuvlarni o‘chirish","Faqat Yil ustunini kamayish tartibida saralash"],"cognitive":"qollash","construct":"S4.DB.04","difficulty":3},{"exp":"A2 nisbiy murojaat bo‘lgani uchun bir qator pastga ko‘chishda A3 ga o‘zgaradi. $F$1 mutlaq murojaat bo‘lgani uchun o‘zgarmaydi.","ref":"gapfill-2026:T060-OFF-001","stem":"MS Excel’da B2 katakda `=A2*$F$1` formula bor. Formula B3 katakka nusxalansa, qaysi ko‘rinishga keladi?","correct":1,"options":["`=A2*$F$1`","`=A3*$F$1`","`=A3*$F$2`","`=$A$3*F1`"],"cognitive":"qollash","construct":"S2.OFFICE.02","difficulty":3},{"exp":"Filtrlash berilgan shartga mos satrlarni ajratib ko‘rsatadi; saralash esa yozuvlarning tartibini o‘zgartiradi.","ref":"gapfill-2026:T060-OFF-002","stem":"Excel jadvalida faqat bali 80 va undan yuqori bo‘lgan o‘quvchilar satrlarini ko‘rsatish kerak. Qaysi amal eng mos?","correct":1,"options":["Saralash (Sort)","Filtrlash (Filter)","Diagramma yaratish","Kataklarni birlashtirish"],"cognitive":"qollash","construct":"S2.OFFICE.03","difficulty":3},{"exp":"75 soni 80 dan kichik, ammo 70 dan katta yoki teng. Shuning uchun ichki IF `B` natijasini qaytaradi.","ref":"gapfill-2026:T060-OFF-003","stem":"M2 katakdagi qiymat 75. Formula `=IF(M2>=80,\"A\",IF(M2>=70,\"B\",\"C\"))` qanday natija qaytaradi?","correct":1,"options":["A","B","C","FALSE"],"cognitive":"qollash","construct":"S2.OFFICE.02","difficulty":3},{"exp":"Muayyan obyekt bosilganda aniq bir slaydga o‘tish uchun giperhavola yoki action ishlatiladi.","ref":"gapfill-2026:T060-OFF-004","stem":"PowerPoint’da 2-slayddagi shakl bosilganda to‘g‘ridan-to‘g‘ri 7-slaydga o‘tishi kerak. Eng mos yechim qaysi?","correct":1,"options":["Shakl rangini o‘zgartirish","Shaklga 7-slaydga olib boruvchi giperhavola yoki action berish","Faqat Transition effektini tanlash","Slaydga audio qo‘shish"],"cognitive":"qollash","construct":"S2.OFFICE.04","difficulty":3},{"exp":"Heading uslublari hujjat ierarxiyasini belgilaydi: asosiy sarlavha uchun Heading 1, uning ostidagi bo‘lim uchun Heading 2 mos keladi.","ref":"gapfill-2026:T060-OFF-005","stem":"Word hujjatida asosiy sarlavha va uning ostidagi bo‘lim sarlavhasini tuzilma sifatida aniq ko‘rsatish kerak. Qaysi yondashuv to‘g‘ri?","correct":1,"options":["Ikkalasini ham oddiy matn qilib qalin yozish","Asosiy sarlavhaga Heading 1, bo‘lim sarlavhasiga Heading 2 uslubini berish","Har bir sarlavhani alohida matn qutisiga joylash","Faqat shrift rangini o‘zgartirish"],"cognitive":"qollash","construct":"S2.OFFICE.01","difficulty":3},{"exp":"Asl qatlamdan nusxa olib nusxa ustida ishlash qaytish imkonini saqlaydi va asl tasvirni himoya qiladi.","ref":"gapfill-2026:T060-WEB-001","stem":"Adobe Photoshop’da asl rasm qatlamini saqlab qolgan holda tajriba tariqasida tahrir qilish kerak. Eng xavfsiz birinchi qadam qaysi?","correct":1,"options":["Asl qatlamni darhol o‘chirish","Asl qatlamdan nusxa olib, nusxa ustida ishlash","Barcha qatlamlarni birlashtirish","Rasmni faqat JPEG formatida saqlash"],"cognitive":"qollash","construct":"S5.WEB.03","difficulty":3}]'::jsonb)
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
      raise exception 'TASK-060 construct not found: %', item->>'construct';
    end if;

    select l.id
      into v_lesson
      from public.lesson_constructs lc
      join public.lessons l on l.id = lc.lesson_id
     where lc.construct_id = v_construct
       and l.status = 'published'::public.content_status
     order by l.order_idx, l.id
     limit 1;

    if v_lesson is null then
      raise exception 'TASK-060 published source lesson not found: %', item->>'construct';
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
      'published'::public.content_status,
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
end
$$;

commit;

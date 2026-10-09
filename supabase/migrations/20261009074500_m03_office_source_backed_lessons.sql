-- TASK-052: M03 source-backed Microsoft Office lessons.
--
-- Sources summarized in original wording:
--   * ICT 5-sinf (2020), MS Word lessons, especially document formatting.
--   * 10-11-sinf Informatika va axborot texnologiyalari (Cambridge+),
--     chapter 8 "Elektron jadvallar".
--   * ICT 6-sinf (2021), PowerPoint presentation lessons.
--
-- One published lesson is added per active S2.OFFICE construct.

begin;

do $$
declare
  v_module uuid;
begin
  select id into strict v_module
  from public.modules
  where code = 'M03';

  insert into public.lessons (
    id, module_id, order_idx, slug, title_uz, body_mdx, est_minutes, status
  )
  values
  (
    '93000000-0000-4000-8000-000000000001',
    v_module, 1,
    'word-hujjat-formatlash-va-tuzilma',
    'MS Word: hujjat formatlash va tuzilma',
    $md$
## Maqsad

MS Wordda matnni tahrirlash va formatlashni farqlash, hujjatning o‘qilishi va tuzilishini boshqaradigan asosiy vositalarni to‘g‘ri tanlash.

## Tahrirlash va formatlash

**Tahrirlash** hujjat mazmuniga o‘zgartirish kiritadi: matn qo‘shish, o‘chirish, ko‘chirish, nusxalash yoki almashtirish. **Formatlash** esa mazmunni o‘zgartirmasdan uning tashqi ko‘rinishi va joylashuvini boshqaradi.

Belgilar darajasida shrift turi, o‘lchami, qalin/kursiv/chizilgan ko‘rinish va rang sozlanadi. Abzas darajasida tekislash, satr oralig‘i, chekinish va ro‘yxatlar boshqariladi. Sahifa darajasida oriyentatsiya, chegaralar va o‘lcham tanlanadi.

## Hujjat tuzilishi

Sarlavha va asosiy matn uchun izchil stillardan foydalanish katta hujjatda bir xil dizaynni saqlashga yordam beradi. Jadval, rasm va boshqa obyektlar matnni to‘ldirishi kerak; ular mazmunni o‘qishni qiyinlashtirmasligi lozim.

Shablon tayyor dizayn va formatlash parametrlarini tez qo‘llash imkonini beradi. Ammo shablon matn mazmunini avtomatik ravishda to‘g‘ri qilmaydi.

## Attestatsiya uchun farqlash

- matnni o‘chirish — tahrirlash;
- shrift o‘lchamini o‘zgartirish — formatlash;
- chap/markaz/o‘ng tekislash — abzas formatlash;
- sahifani portrait/landscape qilish — sahifa sozlamasi;
- Find/Replace katta hujjatda takroriy matnni topish va almashtirishni tezlashtiradi.

> **Manba izi:** ICT 5-sinf (2020), MS Word bo‘limi, PDF 48–66; xususan “Hujjatlarni formatlash uskunalari”, PDF 51–54.
$md$,
    18, 'published'::public.content_status
  ),
  (
    '93000000-0000-4000-8000-000000000002',
    v_module, 2,
    'excel-formulalar-va-funksiyalar',
    'MS Excel: formulalar va funksiyalar',
    $md$
## Maqsad

Elektron jadval formulasini tuzish, katak manzillaridan foydalanish va funksiyalar yordamida hisoblashni tahlil qilish.

## Formula va katak manzili

Excel formulasida hisoblash odatda **=** belgisi bilan boshlanadi. Formula sonlardan tashqari katak manzillariga murojaat qilishi mumkin. Bu jadvaldagi qiymatlar o‘zgarganda natijaning avtomatik qayta hisoblanishiga imkon beradi.

Nisbiy murojaat formula nusxalanganda yangi joylashuvga mos ravishda o‘zgaradi. Absolyut murojaatda satr, ustun yoki ikkalasi `$` belgisi bilan mahkamlanadi. Aralash murojaat faqat satr yoki ustunni mahkamlaydi.

## Funksiyalar

Funksiya tayyor hisoblash qoidasi. Masalan, **SUM** diapazondagi qiymatlarni yig‘adi. IF kabi mantiqiy funksiya shart natijasiga qarab turli qiymat qaytarishi mumkin. Funksiyani ishlatishda argumentlar qaysi katak yoki diapazonlardan olinayotganini diqqat bilan tekshiring.

## Formula nusxalash strategiyasi

1. boshlang‘ich formuladagi har bir murojaat turini aniqlang;
2. formula nechta ustun va satrga ko‘chirilganini toping;
3. faqat nisbiy qismlarni siljiting;
4. absolyut qismlarni o‘zgartirmang;
5. yakuniy formulani hisoblashdan oldin manzillarni tekshiring.

Attestatsiya savollarida ko‘pincha natijadan ko‘ra formula nusxalangandan keyingi **murojaat** so‘raladi.

> **Manba izi:** Cambridge+ 10–11-sinf, 8-bob “Elektron jadvallar”, PDF 103–142; elektron jadval formulalari, funksiyalar va katak murojaatlari bo‘limlari.
$md$,
    20, 'published'::public.content_status
  ),
  (
    '93000000-0000-4000-8000-000000000003',
    v_module, 3,
    'excel-filtr-saralash-diagramma',
    'MS Excel: filtr, saralash va diagramma tahlili',
    $md$
## Maqsad

Saralash, filtrlash va diagramma yaratish amallarini farqlash hamda jadvaldagi ma’lumotni to‘g‘ri tahlil qilish.

## Saralash va filtrlash

**Saralash** ma’lumotlarni tanlangan maydon bo‘yicha ma’lum tartibga keltiradi. Masalan, sonlarni kichikdan kattaga yoki matnni alifbo tartibida joylashtirish mumkin. Saralash odatda yozuvlarni yo‘q qilmaydi — ularning tartibini o‘zgartiradi.

**Filtrlash** esa shartga mos yozuvlarni ko‘rsatib, qolganlarini vaqtincha yashiradi. Filtr manba ma’lumotni o‘chirib yubormaydi. Bir nechta mezon qo‘llansa, har bir shart qaysi ustunga tegishli ekanini tekshirish kerak.

## Diagramma tanlash

Diagramma jadvaldagi munosabatni ko‘rishga yordam beradi. Ustunli diagramma kategoriyalarni taqqoslashda, chiziqli grafik vaqt bo‘yicha o‘zgarishni ko‘rsatishda, doiraviy diagramma esa bir butunning ulushlarini tasvirlashda qulay bo‘lishi mumkin.

Diagramma yaratishda:
- to‘g‘ri ma’lumot diapazonini tanlang;
- sarlavha va o‘qlar ma’noli bo‘lsin;
- turini vazifaga mos tanlang;
- vizual ko‘rinish ma’lumotni chalg‘itmasin.

## Attestatsiya tuzog‘i

“Faqat shartga mos satrlarni ko‘rsatish” — filtr. “Barcha satrlarni qiymati bo‘yicha tartiblash” — saralash. Diagramma esa ma’lumotni o‘zgartirmaydi, uni boshqa ko‘rinishda taqdim etadi.

> **Manba izi:** Cambridge+ 10–11-sinf, 8-bob “Elektron jadvallar”, PDF 103–142; saralash, filtr va grafik/diagramma bo‘limlari.
$md$,
    18, 'published'::public.content_status
  ),
  (
    '93000000-0000-4000-8000-000000000004',
    v_module, 4,
    'powerpoint-taqdimot-animatsiya-otish',
    'MS PowerPoint: taqdimot, animatsiya va o‘tish effektlari',
    $md$
## Maqsad

PowerPoint taqdimotining tuzilishi, dizayn mavzusi, animatsiya va slayd o‘tish effektlarini vazifasi bo‘yicha farqlash.

## Slayd va dizayn

Taqdimot bir mavzuga oid slaydlar ketma-ketligidan tashkil topadi. Har bir slayd axborotni aniq va o‘qilishi oson ko‘rinishda berishi kerak. Dizayn mavzusi shrift, rang, fon va maket kabi elementlarni izchil boshqarishga yordam beradi.

Yangi slayd uchun maket tanlash matn va obyektlar joylashuvini tartibga soladi. Rasm, jadval, diagramma, audio yoki video mazmunni qo‘llab-quvvatlashi kerak.

## O‘tish va animatsiya

**O‘tish effekti (transition)** bir slayddan keyingisiga almashish jarayoniga qo‘llanadi. Uning davomiyligi va ishga tushish usuli sozlanishi mumkin.

**Animatsiya** esa slayd ichidagi alohida obyektga qo‘llanadi. Obyektning kirishi, ajratib ko‘rsatilishi, chiqishi yoki harakat yo‘li boshqarilishi mumkin.

## Attestatsiya uchun farqlash

- butun slayd almashishi → transition;
- slayddagi matn yoki rasm harakati → animation;
- Theme → umumiy dizayn ko‘rinishi;
- Layout → slayddagi joy tutuvchilar tuzilishi.

Ko‘p effekt qo‘llash har doim yaxshi taqdimot degani emas. Effekt mazmun va auditoriyaga xizmat qilishi kerak.

> **Manba izi:** ICT 6-sinf (2021), PowerPoint bo‘limi, PDF 129–155; “Taqdimot dizayni”, PDF 134–138 va animatsiya/o‘tish effektlari, PDF 151–155.
$md$,
    18, 'published'::public.content_status
  )
  on conflict (module_id, slug) do update
  set order_idx = excluded.order_idx,
      title_uz = excluded.title_uz,
      body_mdx = excluded.body_mdx,
      est_minutes = excluded.est_minutes,
      status = excluded.status,
      updated_at = now();

  delete from public.lesson_constructs lc
  using public.lessons l
  where lc.lesson_id = l.id
    and l.module_id = v_module
    and l.slug in (
      'word-hujjat-formatlash-va-tuzilma',
      'excel-formulalar-va-funksiyalar',
      'excel-filtr-saralash-diagramma',
      'powerpoint-taqdimot-animatsiya-otish'
    );

  insert into public.lesson_constructs (lesson_id, construct_id)
  select l.id, c.id
  from (
    values
      ('word-hujjat-formatlash-va-tuzilma', 'S2.OFFICE.01'),
      ('excel-formulalar-va-funksiyalar', 'S2.OFFICE.02'),
      ('excel-filtr-saralash-diagramma', 'S2.OFFICE.03'),
      ('powerpoint-taqdimot-animatsiya-otish', 'S2.OFFICE.04')
  ) as mapping(slug, construct_code)
  join public.lessons l on l.module_id = v_module and l.slug = mapping.slug
  join public.constructs c on c.code = mapping.construct_code and c.is_active
  on conflict do nothing;
end
$$;

commit;

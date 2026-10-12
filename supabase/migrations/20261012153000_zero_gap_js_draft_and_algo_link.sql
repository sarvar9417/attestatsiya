-- Review-only original JavaScript lesson and missing algorithm lesson-objective link.
-- Source: user-provided ICT 9-sinf 2020 and Cambridge+ 10–11 Chapter 19.
-- Do not apply to production absent user's separate final authorization.
begin;
do $lesson_stage$
declare m08 uuid;algo_construct uuid;algo_lesson uuid;js_construct uuid;js_lesson uuid;
begin
 select id into strict m08 from public.modules where code='M08';
 select id into strict algo_construct from public.constructs
   where code='S3.ALGO.03' and is_active;
 select id into strict js_construct from public.constructs
   where code='S4.CODE.04' and is_active;

 select l.id into strict algo_lesson
 from public.lessons l join public.modules m on m.id=l.module_id
 where m.code='M06' and l.slug='m06-03'
   and l.status='published'::public.content_status;
 insert into public.lesson_constructs(lesson_id,construct_id)
 values(algo_lesson,algo_construct)
 on conflict do nothing;

 insert into public.lessons (
   id,module_id,order_idx,slug,title_uz,body_mdx,est_minutes,status
 )values(
   'a1000000-2026-4000-8000-000000000411'::uuid,
   m08,11,'javascript-sintaksisi-m08-11-draft',
   'JavaScript sintaksisi: script, o‘zgaruvchi va chiqarish',
   $md$
## O‘quv maqsadi
JavaScript kodini HTML hujjatga ulash, console.log va document.write natijalarini farqlash, o‘zgaruvchi va qiymat tayinlashni amalda qo‘llash.

## JavaScript qanday ishlaydi?
JavaScript veb-sahifaga interaktiv xatti-harakat qo‘shadi. HTML hujjat ichidagi script tegi JavaScript kodini joylashtirishga imkon beradi. HTML tuzilmani tasvirlaydi, JavaScript esa hisoblash va hodisaga javob beradi.

## Natijani ko‘rsatish
- console.log("Salom") qiymatni brauzerning developer console qismida ko‘rsatadi. Bu sahifa mazmuniga yozilmaydi.
- document.write("Salom") HTML hujjatga matn yozadi; sahifa yuklangandan keyin ehtiyotsiz ishlatilsa avvalgi mazmunni almashtirishi mumkin.
- alert("Salom") foydalanuvchi ko‘radigan xabar oynasini ochadi.

## O‘zgaruvchi va ifoda
O‘zgaruvchi ma’lumotni saqlash uchun nomlangan joydir. Masalan:

    let a = 5;
    let b = 2;
    console.log(a + b * 3); // 11

Ko‘paytirish qo‘shishdan oldin bajariladi. a = a + 2 qiymatni yangilaydi; = bu yerda matematik tenglik emas, tayinlash. Matn qiymatlari qo‘shtirnoqqa olinadi, sonlar esa odatda qo‘shtirnoqsiz ishlatiladi.

## Mustaqil ishlash
1. let n = 6; n += 4; console.log(n); natijasini izohlang.
2. Brauzer konsoliga chiqarish va sahifa ichiga chiqarish o‘rtasidagi farqni ayting.
3. HTML fayldagi script tegining vazifasini tushuntiring.
4. Matn qiymati bilan son qiymatini farqlaydigan misol yozing.

> **Manba izi:** 10–11-sinf Informatika va axborot texnologiyalari (Cambridge+), 19-bob, 19.01 JavaScript, kitobning 307–310-betlari. Dars original qayta yozilgan; ekspert tasdig‘igacha Review holatida qoladi.
$md$,
   22,'review'::public.content_status
 )
 on conflict (module_id,slug) do update set
   title_uz=excluded.title_uz,body_mdx=excluded.body_mdx,
   est_minutes=excluded.est_minutes,status=excluded.status,
   updated_at=now();

 select id into strict js_lesson from public.lessons
 where module_id=m08 and slug='javascript-sintaksisi-m08-11-draft';
 insert into public.lesson_constructs(lesson_id,construct_id)
 values(js_lesson,js_construct)
 on conflict do nothing;
end
$lesson_stage$;
commit;
-- TASK-205: source-based missing loop and trace competencies; 2 new review lessons.
BEGIN;
CREATE TEMP TABLE _task205_new_lessons(slug text,title text,construct text,ord int,body text) ON COMMIT DROP;
INSERT INTO _task205_new_lessons VALUES ('algoritmlash-v3-shart-keyin-sikl','Shart keyin tekshiriladigan sikl: gacha, REPEAT–UNTIL','S3.ALGO.02',16,'# 9-bob. Uch xil takrorlash va «gacha» siklining ijro izi

**Maqsad:** shart oldin tekshiriladigan, shart keyin tekshiriladigan va parametrli takrorlashlarni farqlash; siklni qadamma-qadam bajarish va chegaraviy holatlarni aniqlash.

> Manba: ICT 9_sinf-2020, PDF 41–45 (22–23-darslar). Darslik «toki», «gacha» va «parametr A dan B gacha» atamalarini ishlatadi. REPEAT–UNTIL yozuvi «gacha» mantiqining tilga bog‘lanmagan psevdokod ifodasidir.

## 9.1. Uch xil takrorlashning farqi

| Tuzilma | Shartning o‘rni | Tana eng kam | To‘xtash/davom etish |
|---|---|---|---|
| TOKI / WHILE | Tanadan oldin | 0 marta | Shart rost bo‘lsa davom etadi |
| TAKRORLA ... GACHA / REPEAT ... UNTIL | Tanadan keyin | 1 marta | Chiqish sharti rost bo‘lsa to‘xtaydi |
| PARAMETR A DAN B GACHA / FOR | Parametr qiymati bo‘yicha | Chegaraga bog‘liq | Belgilangan qiymatlar tugaganda |

**Nozik farq:** WHILE sharti rost bo‘lsa sikl davom etadi, UNTIL sharti rost bo‘lsa sikl to‘xtaydi. Ikki yozuvdagi bir xil mantiqiy shartni bir xil ma’noda qabul qilib bo‘lmaydi.

## 9.2. Shart oxirida tekshiriluvchi siklni bajarish

Psevdokod: **x:=1; TAKRORLA x:=x+2; GACHA x>=7; CHIQAR x.**

| Qadam | Tanadan keyingi x | x>=7 rostmi? | Harakat |
|---|---:|---|---|
| 1 | 3 | Yo‘q | Takrorla |
| 2 | 5 | Yo‘q | Takrorla |
| 3 | 7 | Ha | To‘xta |

**Javob:** x=7; tana 3 marta bajarildi.

## 9.3. Boshlang‘ich shart rost bo‘lsa ham bir marta

**x:=10; TAKRORLA x:=x+1; GACHA x>5; CHIQAR x** natijasi **11**. Shart hali tekshirilmagani uchun tana bir marta ishlaydi. Qarama-qarshi misol: **x:=10; TOKI x<=5 bo‘lsa x:=x+1** — tana 0 marta ishlaydi.

## 9.4. Birinchi manfiy songacha yig‘ish

9-sinf darsligi PDF 42 da birinchi manfiy qiymatgacha kiritilgan sonlarni yig‘ish misoli bor. Manfiy son **tugatish belgisi**, yig‘indining o‘zi emas.

Psevdokod: **S:=0; TAKRORLA A ni kirit; AGAR A>=0 BO‘LSA S:=S+A; GACHA A<0; CHIQAR S.**

Kirish **4, 2, 7, −1, 5** bo‘lsa natija **13**: manfiy −1 qo‘shilmaydi, undan keyingi 5 o‘qilmaydi.

Chekka holatlar: birinchi qiymat manfiy bo‘lsa 0; nol kiritilsa yig‘indi o‘zgarmaydi; oxirgi manfiy qiymat yig‘indiga qo‘shilmaydi.

## 9.5. Parametrli sikl va chegaralar

Darslik PDF 43 da **5, 7, 9, ..., 49** toq sonlar ko‘paytmasi berilgan. Qadam 2; hadlar soni **(49−5)/2+1=23**. Ko‘paytmaga boshlang‘ich P=1, yig‘indiga S=0 tanlanadi.

PDF 44–45 da 1·2·3·4·5=120 ko‘paytma **uch xil** sikl orqali tekshirilgan. Natija bir xil bo‘lishi, ammo shartning joyi turlicha bo‘lishi kerak.

## 9.6. Chegaraviy xatolar

- WHILE boshida shart yolg‘on bo‘lsa tana 0 marta ishlaydi.
- UNTIL boshlang‘ich sharti rost bo‘lsa ham tana kamida 1 marta ishlaydi.
- Shartni rostga aylantiruvchi yangilanish bo‘lmasa sikl tugamasligi mumkin.
- i<=n va i<n bir xil emas; birinchi yozuv n qiymatni ham qamrab oladi.
- Natija va takrorlashlar soni ikki xil savol; bitta miqdorni ikkinchisi deb bermang.

## 9.7. Manba va yangi mashq chegarasi

Atamalar va sikllarning uch turi **9-sinf darsligi**dan olingan. Yuqoridagi 1,3,7,10 kabi o‘zgartirilgan sonlar bilan misollar va chek-chegaralarni izohlash esa o‘rganish uchun **yangi mualliflik mashqi**dir.'),
('algoritmlash-v3-ijro-iz-va-test-uslubi','Attestatsiya uslubida algoritmni izma-iz tekshirish va maqbullik','S3.ALGO.03',17,'# 10-bob. Ijro izi, blok-sxema, xatolik va maqbul algoritm

**Maqsad:** oldingi attestatsiya uslubidagi qisqa topshiriqlarda algoritm yakuniy natijasi, takrorlanishlar soni, shart tarmoqlari, xatolik va eng maqbul usulni aniqlash.

> Manbalar: ICT 9_sinf-2020, PDF 28–46; Ma’ruza (Tayyor), PDF 46–55; Test.pdf, PDF 53–63. Test.pdfning o‘zida ayrim savol yoki kalitlarda xato bo‘lishi mumkinligi aytilgan. Bu yerdagi barcha misollar mustaqil qayta hisoblangan, avvalgi testlarning aynan nusxasi emas.

## 10.1. Algoritmni izma-iz bajarish tartibi

1. Dastlabki qiymatlarni yozib oling.
2. Shart tana boshida yoki oxirida ekanini aniqlang.
3. Har bajarilgan amal natijasini jadvalda yangilang.
4. Qaysi tarmoq bajarilganini yozing.
5. **Necha marta ishladi?** va **nima chiqarildi?** degan savollarni aralashtirmang.

**Masala:** S:=0; FOR i:=1..4 DO AGAR i mod 2=0 BO‘LSA S:=S+i; CHIQAR S.

| i | Juftmi? | S |
|---|---|---|
| 1 | Yo‘q | 0 |
| 2 | Ha | 2 |
| 3 | Yo‘q | 2 |
| 4 | Ha | 6 |

**Javob:** 6. Sikl 4 marta bajarilgan; S ning qiymati 2 marta yangilangan.

## 10.2. Ichma-ich sikl

FOR i:=1..3 DO FOR j:=1..2 DO CHIQAR(i,j) holatida **6 ta** juftlik chiqariladi. Ichki sikl chegarasi tashqi sanagichga bog‘liq bo‘lsa, masalan FOR i:=1..4 DO FOR j:=1..i, jami **1+2+3+4=10** takrorlash bo‘ladi.

## 10.3. Manfiy sonlarda maksimum

Faqat manfiy sonlar -7, -2, -9 uchun max:=0 boshlanishi **noto‘g‘ri**: ro‘yxatda nol yo‘q. max ni birinchi element (-7) bilan boshlash va qolganlar bilan solishtirish kerak. Natija -2.

## 10.4. Blok-sxema standartlari

| Belgi | Vazifa |
|---|---|
| Oval | Boshlash / tugatish |
| Parallelogramm | Kiritish / chiqarish |
| To‘g‘ri to‘rtburchak | Hisoblash / qiymat o‘zgartirish |
| Romb | Shart / tarmoqlanish |

Shart **rost** bo‘lganda qaysi yo‘nalish tanlanishi uchun HA/YO‘Q yozuvlari muhim. Sikldagi orqaga yo‘nalgan strelka qayta tekshirish/bajarishni ko‘rsatadi.

## 10.5. Eng ko‘p uchraydigan xatolar

- S yig‘indisini 0 dan, P ko‘paytmasini 1 dan boshlamaslik.
- Sanagichni o‘zgartirmay cheksiz siklga kirish.
- Shart x>0 yoki x<0 bo‘lganda x=0 ni alohida tekshirmaslik.
- Manfiy tugatish belgisini yig‘indiga qo‘shib yuborish.
- Siklda joriy qiymatni yangilashdan oldin yoki keyin tekshirishni chalkashtirish.
- n=0 yoki boshqa chegaraviy kirishlar uchun noto‘g‘ri natija.

## 10.6. Eng maqbul algoritm

2026-yil spetsifikatsiyasida masala uchun eng maqbul algoritmni tanlash talab etiladi. To‘g‘rilik, kirish cheklovi, bajarilish vaqti, xotira hamda soddalikni birga baholang.

| Masala | Usul | Izoh |
|---|---|---|
| 1..n sonlar yig‘indisi | n(n+1)/2 formula | To‘g‘ri kirish sharti tekshirilgach |
| Tartiblanmagan ro‘yxatdan izlash | Chiziqli qidiruv | Oldindan saralash kerak emas |
| Tartiblangan ro‘yxatdan izlash | Ikkilik qidiruv | Faqat saralangan ro‘yxatda |
| Ikki natural son EKUBi | Yevklid algoritmi | Ketma-ket tekshirishdan odatda tejamkor |

**Ogohlantirish:** Big-O yoki ikkilik qidiruv nomi 2026-yil Algoritmlash spetsifikatsiyasida alohida majburiy atama sifatida yozilmagan. Bu usullar maqbullik ko‘nikmasini rivojlantiradigan qo‘shimchalardir.

## 10.7. Manba test uslublarini ajratish

- Ta’rif va tushunchalarni farqlash (ijrochi, model, algoritm xossalari).
- Qisqa psevdokod yoki dastur lavhasining oxirgi qiymatini topish.
- Ikkita ichma-ich sikldagi takrorlanishlar sonini aniqlash.
- Shartli yo‘nalishli blok-sxemadan chiqish qiymatini topish.
- Noto‘g‘ri boshlang‘ichlashni yoki chekka holatdagi xatoni aniqlash.
- Ikkita yechim orasidan shartga mos va maqbul variantni tanlash.

**Chegara:** Scratch/LOGO bloklari va Python/JavaScript sintaksisi spetsifikatsiyada alohida bo‘limlarda turadi; bu bob asosiy algoritmik fikrlashga qaratilgan. Algoritmlash uchun 3 ta rasmiy test ko‘zda tutilgan, ko‘p mashqlar shu uch topshiriqqa tayyorgarlik uchun tuzilgan.');
DO $$ BEGIN
IF (SELECT count(*) FROM public.modules WHERE code='M06')<>1 THEN RAISE EXCEPTION 'M06 absent'; END IF;
IF EXISTS (SELECT 1 FROM public.lessons WHERE slug IN(SELECT slug FROM _task205_new_lessons) AND status='published') THEN RAISE EXCEPTION 'Do not mutate published'; END IF;
IF EXISTS (SELECT 1 FROM public.lessons l JOIN public.modules m ON m.id=l.module_id WHERE m.code='M06' AND l.order_idx IN(16,17) AND l.slug NOT LIKE 'algoritmlash-v3-%') THEN RAISE EXCEPTION 'Order collision'; END IF;
END $$;
INSERT INTO public.lessons(module_id,order_idx,slug,title_uz,body_mdx,blocks,blocks_kind,est_minutes,topic_test_question_count,status)
SELECT m.id,n.ord,n.slug,n.title,n.body,
jsonb_build_array(jsonb_build_object('type','heading','content',n.title),jsonb_build_object('type','text','content',n.body)),
'chapter',40,20,'review'::content_status FROM _task205_new_lessons n CROSS JOIN public.modules m
WHERE m.code='M06' AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.slug=n.slug);
INSERT INTO public.lesson_constructs(lesson_id,construct_id,is_required,is_critical,min_questions)
SELECT l.id,c.id,true,false,5 FROM _task205_new_lessons n JOIN public.lessons l ON l.slug=n.slug JOIN public.constructs c ON c.code=n.construct
ON CONFLICT(lesson_id,construct_id) DO NOTHING;
DO $$ BEGIN
IF (SELECT count(*) FROM public.lessons WHERE slug IN(SELECT slug FROM _task205_new_lessons) AND status='review')<>2 THEN RAISE EXCEPTION 'V3 lesson count'; END IF;
END $$;
COMMIT;
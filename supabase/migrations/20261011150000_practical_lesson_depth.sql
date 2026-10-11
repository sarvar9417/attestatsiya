-- TASK-061: practical depth upgrade for high-weight applied constructs.
--
-- The 76/76 lesson invariant proves structural coverage, not that an applied
-- construct contains worked evidence. This migration enriches the weakest
-- practical lessons identified in the post-coverage audit:
--   * S5.WEB.03 Paint/Photoshop workflow
--   * S5.WEB.04 HTML text/image/list code
--   * S5.WEB.05 HTML table/form code
--   * S5.WEB.06 CSS selector/declaration/application code
--   * S6.NET.03 IP + subnet-mask network-address calculation
--   * S7.SEC.02 security scenario discrimination
--   * S7.SEC.06 Web-Freelance workflow
--
-- Content is original synthesis. Existing source traces remain in each lesson.

begin;

update public.lessons l
set body_mdx = l.body_mdx || $md$

## Amaliy mustahkamlash — TASK-061

### Paint/Photoshop ish oqimi

Vaziyat: fotosuratning keraksiz chetini olib tashlash, sarlavha qo‘shish va sarlavhani keyin alohida tahrirlash kerak.

1. Rasmni oching va kerakli hududni **selection** bilan aniqlang.
2. Keraksiz chetni olib tashlash kerak bo‘lsa **crop** ishlating. Rasmning umumiy piksel o‘lchamini o‘zgartirish kerak bo‘lsa **resize** ishlatiladi — bu ikki amal bir xil emas.
3. Sarlavhani alohida **layer**ga joylashtiring. Shunda matnni rasm pikseliga bevosita qo‘shib yubormasdan ko‘chirish, yashirish yoki formatlash mumkin.
4. Obyektni kattalashtirish/aylantirish kerak bo‘lsa transform amali maqsadga mos keladi.
5. Keyinroq qatlamlarni saqlab tahrirlash zarur bo‘lsa qatlamlarni qo‘llovchi ishchi formatni saqlang; yakuniy tarqatish nusxasi alohida eksport qilinishi mumkin.

### Vaziyatli tekshiruv

- Faqat tashqi chetni olib tashlash → **crop**.
- 2400×1600 tasvirni 1200×800 qilish → **resize**.
- Matnni fon rasmini buzmasdan alohida boshqarish → **layer**.
- Tanlangan obyektning joyi/o‘lchami/burchagini o‘zgartirish → **transform**.

**Ko‘p uchraydigan xato:** “crop” va “resize”ni, “layer” va “file format”ni sinonim deb qabul qilish.
$md$,
    updated_at = now()
from public.modules m
where l.module_id = m.id
  and m.code = 'M10'
  and l.slug = 'paint-va-photoshop-asoslari'
  and l.body_mdx not like '%## Amaliy mustahkamlash — TASK-061%';

update public.lessons l
set body_mdx = l.body_mdx || $md$

## Amaliy mustahkamlash — TASK-061

### Ishlangan HTML misoli

Quyidagi kod sarlavha, xatboshi, rasm va tartiblanmagan ro‘yxatni bir sahifada birlashtiradi:

```html
<h2>Maktab klubi</h2>
<p>Robototexnika klubiga xush kelibsiz.</p>
<img src="images/robot.jpg" alt="Robot modeli" width="240">
<ul>
  <li>Dushanba</li>
  <li>Chorshanba</li>
</ul>
```

**Tahlil:**
- `h2` — sarlavha;
- `p` — xatboshi;
- `src` — rasm manbasi;
- `alt` — rasm ko‘rinmaganda mazmunni ifodalovchi alternativ matn;
- `ul` + `li` — tartiblanmagan ro‘yxat.

### Mustaqil mashq

1. Rasm kengligini 320 qilib o‘zgartiring.
2. Ro‘yxatni ketma-ket bosqichlarga aylantirish uchun `ul` o‘rniga qaysi element kerakligini aniqlang.
3. `alt` atributini olib tashlash nima uchun accessibilityni yomonlashtirishini tushuntiring.
4. Noto‘g‘ri yopilgan teg berilsa, ichma-ich tuzilishni to‘g‘ri tartibda qayta yozing.
$md$,
    updated_at = now()
from public.modules m
where l.module_id = m.id
  and m.code = 'M11'
  and l.slug = 'html-matn-rasm-royxat'
  and l.body_mdx not like '%## Amaliy mustahkamlash — TASK-061%';

update public.lessons l
set body_mdx = l.body_mdx || $md$

## Amaliy mustahkamlash — TASK-061

### HTML jadval: kodni o‘qing

```html
<table>
  <tr>
    <th>Fan</th>
    <th>Ball</th>
  </tr>
  <tr>
    <td>Informatika</td>
    <td>92</td>
  </tr>
</table>
```

Bu yerda 2 ta qator bor. Birinchi qatordagi `th` kataklari sarlavha, ikkinchi qatordagi `td` kataklari ma’lumot kataklaridir.

### Forma: boshqaruv turini maqsadga mos tanlang

```html
<form>
  <label for="email">Email:</label>
  <input id="email" name="email" type="email">

  <p>Dars vaqti:</p>
  <label><input type="radio" name="time" value="am"> Ertalab</label>
  <label><input type="radio" name="time" value="pm"> Kechqurun</label>

  <label>
    <input type="checkbox" name="news">
    Yangiliklarni olish
  </label>

  <button type="submit">Yuborish</button>
</form>
```

**Farq:** bir xil `name="time"` bilan radio tugmalar bitta guruhdan bitta tanlovni ifodalaydi; checkbox esa mustaqil ha/yo‘q tanloviga mos.

### Attestatsiya topshirig‘i

“A va B dan faqat bittasini tanlash” talabi uchun radio, “bir nechta qiziqish yo‘nalishini tanlash” talabi uchun checkbox mos keladi. Element nomini yodlashdan oldin tanlov semantikasini aniqlang.
$md$,
    updated_at = now()
from public.modules m
where l.module_id = m.id
  and m.code = 'M11'
  and l.slug = 'html-jadval-va-forma'
  and l.body_mdx not like '%## Amaliy mustahkamlash — TASK-061%';

update public.lessons l
set body_mdx = l.body_mdx || $md$

## Amaliy mustahkamlash — TASK-061

### CSS qoidani tahlil qilish

```css
p {
  color: red;
  font-size: 14px;
  text-align: left;
}
```

- `p` — **selector**;
- `color`, `font-size`, `text-align` — **property**;
- `red`, `14px`, `left` — **value**.

Bu qoida mos keluvchi `p` elementlarining matnini qizil, 14 px va chapga tekislangan ko‘rinishda chiqaradi.

### Tashqi CSS ulash

```html
<head>
  <link rel="stylesheet" href="styles.css">
</head>
```

Agar bir nechta sahifa shu faylga ulanib tursa, `styles.css`dagi bitta qoida o‘zgartirilishi barcha shu sahifalarga tatbiq etilishi mumkin.

### O‘zgartirib natijani bashorat qiling

```css
h1 {
  color: blue;
  text-align: center;
}
```

1. `blue` qiymatini `green`ga almashtirsangiz nima o‘zgaradi?
2. `h1` selectorini `h2`ga almashtirsangiz qaysi elementlar ta’sirlanadi?
3. Bir saytning ko‘p sahifasida bir xil dizayn bo‘lsa, inline emas external CSS tanlashning sababini tushuntiring.

**Tekshiruv tartibi:** selector → property → value → qaysi HTML element → ko‘rinishdagi natija.
$md$,
    updated_at = now()
from public.modules m
where l.module_id = m.id
  and m.code = 'M11'
  and l.slug = 'css-stillarini-qollash'
  and l.body_mdx not like '%## Amaliy mustahkamlash — TASK-061%';

update public.lessons l
set body_mdx = l.body_mdx || $md$

## Amaliy mustahkamlash — TASK-061

### Tarmoq manzilini bosqichma-bosqich hisoblash

Tarmoq manzili IPv4 manzil bilan subnet maskaning bitma-bit **AND** amali orqali topiladi.

**Misol:** IP = `192.168.10.77`, maska = `255.255.255.192` (`/26`).

Birinchi uch oktet maskada 255 bo‘lgani uchun o‘zgarmaydi. Oxirgi oktetni ikkilikka o‘tkazamiz:

```text
IP:     77  = 01001101
Maska: 192  = 11000000
AND          01000000 = 64
```

Demak, tarmoq manzili:

```text
192.168.10.64
```

### Nega 64?

`/26` maskada oxirgi oktetning dastlabki 2 biti tarmoq qismiga tegishli. Blok o‘lchami `256 - 192 = 64`, shuning uchun tarmoq chegaralari 0, 64, 128 va 192 dan boshlanadi. 77 soni 64–127 oralig‘ida, demak tarmoq 64 dan boshlanadi.

### Mustaqil masalalar

1. `10.20.30.45` va `255.255.255.0` uchun tarmoq manzilini toping.
2. `172.16.5.150` va `255.255.255.128` uchun tarmoq manzilini toping.
3. Nima uchun IP manzil, subnet maska va MAC manzilni bir-biriga almashtirib bo‘lmaydi?

**Javoblar:** 1) `10.20.30.0`; 2) `172.16.5.128`.
$md$,
    updated_at = now()
from public.modules m
where l.module_id = m.id
  and m.code = 'M12'
  and l.slug = 'ip-manzil-va-tarmoq-maskasi'
  and l.body_mdx not like '%## Amaliy mustahkamlash — TASK-061%';

update public.lessons l
set body_mdx = l.body_mdx || $md$

## Amaliy mustahkamlash — TASK-061

### Tahdidni nomiga emas, mexanizmiga qarab aniqlang

| Vaziyat | Asosiy xavf | Eng bevosita choralar |
|---|---|---|
| Bank nomidan kelgan xat soxta sahifaga kirib parol yozishni so‘radi | phishing | domen/yuboruvchini tekshirish, havola orqali login qilmaslik |
| Noma’lum dastur fayllarni shifrlab, pul talab qildi | zararli dastur/ransomware | ishga tushirmaslik, yangilanish, himoya vositalari, zaxira nusxa |
| Brauzer faoliyati yashirin kuzatilib, ma’lumot tashqariga yuborildi | spyware | zararli dasturga qarshi tekshiruv, ruxsat va dasturlarni nazorat qilish |
| Bitta sayt uchun ishlatilgan parol boshqa saytda ham buzildi | credential reuse xavfi | har xizmatga alohida kuchli parol, MFA imkon bo‘lsa yoqish |

### Attestatsiya tahlili

Savolda “virus”, “phishing” yoki “antivirus” so‘zi ko‘rinishi bilan javobni tanlamang. Avval:
1. hujumchi foydalanuvchini **aldab ma’lumot oldimi**;
2. **zararli kod** ishga tushdimi;
3. ma’lumot yo‘qolishi yoki ruxsatsiz kirishning qaysi turi yuz berdi;
4. qaysi chora aynan shu mexanizmni eng bevosita kamaytirishini aniqlang.

**Nozik farq:** antivirus phishing xatining soxta mazmunini har doim aniqlab bermaydi; phishingga qarshi foydalanuvchining manba va domenni tekshirishi ham zarur.
$md$,
    updated_at = now()
from public.modules m
where l.module_id = m.id
  and m.code = 'M13'
  and l.slug = 'zararli-dastur-va-phishing'
  and l.body_mdx not like '%## Amaliy mustahkamlash — TASK-061%';

update public.lessons l
set body_mdx = l.body_mdx || $md$

## Amaliy mustahkamlash — TASK-061

### Web-Freelance ish oqimi

Darslikdagi amaliy ko‘nikmalarni ish jarayoni sifatida bog‘lang:

1. **Yo‘nalish tanlash:** masalan, veb-sayt yaratish, grafik dizayn yoki dasturlash.
2. **Profil yaratish:** xizmat, tajriba va aloqa usulini tushunarli ifodalash.
3. **Portfolio:** avvalgi ish namunalarini buyurtmachi ko‘ra oladigan tarzda joylashtirish.
4. **Buyurtma/taklif:** vazifa hajmi, natija, muddat va tuzatish shartlarini aniqlashtirish.
5. **Platforma ichida muloqot:** kelishuv va fayl almashuvini imkon qadar platformaning himoyalangan oqimida olib borish.
6. **Natijani topshirish:** kelishilgan format va mezon bo‘yicha.
7. **Portfolio yangilash:** ruxsat etilgan ishlarni tajriba namunasi sifatida qo‘shish.

### Vaziyatli topshiriq

Buyurtmachi “Telegramga o‘ting, platformadan tashqarida to‘lov qilamiz va avval pasport/karta ma’lumotini yuboring” dedi. Eng to‘g‘ri yondashuv — vazifani bajarishga shoshilmasdan platforma qoidalarini tekshirish, nozik ma’lumotni bermaslik va shubhali tashqi havola/to‘lov talabidan ehtiyot bo‘lish.

### Tanlash mezoni

Freelance platformani baholashda faqat “mashhurligi”ga emas, loyiha yo‘nalishi, portfolio formati, aloqa va xavfsizlik qoidalari, komissiya/to‘lov shartlari hamda buyurtmachi bilan kelishuv mexanizmlariga qarang.
$md$,
    updated_at = now()
from public.modules m
where l.module_id = m.id
  and m.code = 'M13'
  and l.slug = 'web-freelance-asoslari'
  and l.body_mdx not like '%## Amaliy mustahkamlash — TASK-061%';

commit;

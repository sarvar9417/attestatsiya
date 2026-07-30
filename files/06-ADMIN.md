# 06 — Admin panel

Yagona kirish nuqtasi: `/admin`. Rol tekshiruvi `app/admin/layout.tsx` da,
server tomonda.

| Rol | Huquq |
|---|---|
| `user` | Kirmaydi (404) |
| `editor` | Kontent, savol, hisobot. Foydalanuvchi va blueprint yo'q. |
| `admin` | Hammasi |

404 qaytaring, 403 emas — admin panel mavjudligini oshkor qilmang.

---

## A. Dashboard `/admin`

Bir ekranda: jami savol (status kesimida), publikatsiyaga tayyor emas savollar,
ochiq hisobotlar, bugungi faol foydalanuvchi, mavsumiy grafik.

Eng muhim vidjet — **bayroqli savollar soni**. Bu psixometrika muammosini
ko'rsatadi va u kechiktirilmasligi kerak.

---

## B. Kontent `/admin/kontent/*`

### Bo'limlar va mavzular
CRUD, `order_idx` bilan tartiblash (drag yoki ↑↓), status o'zgartirish.
Mavzu o'chirilganda unga bog'langan savollar **o'chmaydi** — `constructs`
saqlanadi, faqat `lesson_constructs` bog'lami uziladi.

### Dars muharriri
MDX matn maydoni + jonli preview. Yon panelda shu mavzuga biriktirilgan
konstruktlar ro'yxati va har biriga nechta savol borligi.

**Nashr blokirovkasi:** mavzuni `published` qilishga urinishda, agar biror
konstruktda **4 tadan kam** savol bo'lsa — ogohlantirish. Mavzu testi har
konstruktdan majburiy savol oladi, savol yetmasa test buziladi.

### Konstruktlar
Faqat `code`, `title_uz`, `description_uz`, `slug` tahriri. `group_code` ni
o'zgartirish taqiqlansin — u blueprint kvotasiga bog'langan.

---

## C. Savollar `/admin/savollar`

### Ro'yxat
Filtrlar: konstrukt, guruh, format, kognitiv daraja, status, bayroq holati.
Ustunlar: `stem` (qisqartirilgan), konstrukt kodi, format, `p_value`,
`discrimination`, urinishlar, status.

Bayroqli savollar tepada, `--qizil` belgi bilan.

### Muharrir `/admin/savollar/[id]`

```
┌─ Savol ────────────────────┬─ Preview ──────────┐
│ stem_md (markdown)         │  Foydalanuvchi     │
│ konstrukt   [select]       │  ko'radigan holat  │
│ format      Y1 / Y2 / Y3   │                    │
│ kognitiv    [select]       │                    │
│ qiyinlik    1—5            │                    │
├────────────────────────────┤                    │
│ Variantlar (formatga qarab)│                    │
│ Javob kaliti               │                    │
│ Tushuntirish (majburiy)    │                    │
└────────────────────────────┴────────────────────┘
        [ Qoralama ] [ Ko'rikka ] [ Nashr etish ]
```

**Nashr etish shartlari** (server tomonda tekshiring, klientga ishonmang):

- `stem_md` bo'sh emas
- `Y1`: kamida 4 variant, aynan bitta to'g'ri
- `Y2`: `a` va `b` tomonda kamida 3 tadan element, har `a` uchun juftlik bor
- `Y3`: kamida 4 element, tartib to'liq
- `explanation_md` bo'sh emas va kamida 80 belgi
- `construct_id` biriktirilgan

Tushuntirishsiz savol nashr etilmasin. Tushuntirish — platformaning asosiy
qiymati, savolning o'zi emas.

### Bulk import
CSV yoki JSON. Import **har doim `draft` statusda** tushadi. Import
natijasida hisobot: nechta qo'shildi, nechta rad etildi va sababi.

Generator natijalari ham shu yo'l bilan kiradi, lekin `is_generated = true`
bilan va ular avtomatik `published` bo'lishi mumkin — chunki formula bilan
tekshirilgan.

---

## D. Sifat `/admin/sifat`

Bu modul saytni raqobatchilardan ajratadi. Yengil olmang.

### Ko'rsatkichlar

| Ko'rsatkich | Formula |
|---|---|
| `p_value` | `correct / attempts` |
| `discrimination` | yuqori 27% guruh `p` − quyi 27% guruh `p` |
| `option_dist` | har variant tanlanish ulushi |
| `avg_time_sec` | o'rtacha sarflangan vaqt |

Guruhlar shu **savol ishtirok etgan sinovlardagi umumiy ball** bo'yicha
ajratiladi, savolning o'zi bo'yicha emas.

### Bayroqlar

| Shart | Belgi | Ma'nosi |
|---|---|---|
| `discrimination < 0` | 🔴 kritik | Deyarli har doim javob kaliti xato |
| `discrimination < 0.1` | 🟠 | Savol kuchli va zaifni ajratmaydi |
| `p_value < 0.25` | 🟠 | Juda qiyin yoki noaniq ifodalangan |
| `p_value > 0.90` | 🟡 | Juda oson, ma'lumot bermaydi |
| biror variant 0% | 🟡 | O'lik distraktor, almashtirish kerak |

Barcha ko'rsatkich `attempts >= 30` bo'lgandagina hisoblanadi. Undan past
bo'lsa `null` va "ma'lumot yetarli emas" deb ko'rsating.

### Qayta hisoblash
`app/api/cron/stats/route.ts`, Vercel Cron, kuniga bir marta.
`CRON_SECRET` bilan himoyalangan.

---

## E. Hisobotlar `/admin/hisobotlar`

Foydalanuvchi xato xabarlari navbati.

```
yangi → korilmoqda → tuzatildi | rad
```

Har yozuvda: savol, sabab, izoh, savolning joriy psixometrikasi. Bir savolga
bir nechta hisobot bo'lsa — guruhlansin.

**Tuzatildi** bosilganda foydalanuvchiga xabar bermang (anonim bo'lishi mumkin),
lekin `audit_log` ga yozing.

Xato tasdiqlansa va savol allaqachon sinovlarda ishlatilgan bo'lsa — o'sha
savolni `archived` qiling va **tegishli `exam_items` da ball qayta hisoblanmasin**.
O'tgan natijalarni o'zgartirish ishonchni buzadi. Faqat kelajakdagi sinovlarda
ishlatilmaydi.

---

## F. Foydalanuvchilar `/admin/foydalanuvchilar`

Faqat `admin`. Ro'yxat, rol o'zgartirish, bloklash.

**Yig'ilmaydigan ma'lumot:** telefon raqami, ish joyi, to'liq IP tarixi,
qurilma barmoq izi. Bepul loyihada bu ortiqcha huquqiy yuk va foydasi yo'q.

Foydalanuvchiga `/kabinet` da o'z ma'lumotini yuklab olish va hisobini o'chirish
imkonini bering. Bu bir kunlik ish, lekin ishonch beradi.

---

## G. Analitika `/admin/analitika`

Qaror qabul qilishga yordam beradigan narsalarnigina ko'rsating:

1. **Voronka:** kirdi → 1-mavzuni ochdi → 1-testni tugatdi → 1-mockni tugatdi
2. **Chiqib ketish nuqtalari:** qaysi mavzuda tashlab ketishadi → kontent muammosi
3. **Konstrukt bo'yicha respublika kesimi:** o'rtacha o'zlashtirish foizi
4. **Mavsumiylik:** kunlik faol foydalanuvchi (fevral–aprel cho'qqisi)

3-punkt ikki tomonlama foydali: sizga kontent prioritetini beradi va ommaviy
statistika sifatida e'lon qilinishi mumkin — bu tarqalishga yordam beradi.

---

## Audit

Har o'zgarish `audit_log` ga yoziladi:

```ts
await logAudit({
  action: 'question.publish',
  entity: 'questions',
  entityId: id,
  diff: { status: ['draft', 'published'] },
})
```

Yoziladigan harakatlar: savol nashr/arxiv, kalit o'zgarishi, rol o'zgarishi,
blueprint o'zgarishi, hisobot yechimi.

Kalit o'zgarishi (`question_keys.payload`) — eng muhim audit yozuvi. Agar
diskriminatsiya manfiy bo'lib, keyin kalit o'zgartirilsa, bu tarix kerak bo'ladi.

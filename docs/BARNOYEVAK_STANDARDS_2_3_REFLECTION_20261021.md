# Barnoyevak pedagogika — kasbiy standart sohalari 2–3 va refleksiya importi

Sana: 2026-10-21. Drive `pedagogika/files` manbalariga asoslangan tekshiruv.

## Asl PDF manbalar

- `Kasb standarti 2-soha.pdf` (Drive `1fMDPU5vpIU7PDODu-0RXyI-btyNC5wSK`): ta'lim samaradorligi, AKT, dars boshqaruvi, o'quvchi motivatsiyasi, metakognitiv strategiyalar va differensial ko'mak.
- `Kasb standarti 3-soha.pdf` (Drive `1fOWs9LWgrzchy3OGb_mnWmv2fbNonlAP`): o'zlashtirishni baholash, diagnostik/formativ/summativ yondashuvlar, natijani tahlil qilish va qayta aloqa.
- `Pedagogik mahorat spetsifikatsiyasi-2025.pdf` (Drive `1Ly5nIDP1e4gxnengoKdrDMEdc4XEFmel`): pedagogik refleksiya va kasbiy tashxis mavzusi; uning 2025 ko'rsatkichlarini 2026ga avtomatik ko'chirmang.

## Baza bilan solishtirish

- Mavjud nashrdagi `talim-samaradorligini-taminlash` darsida `metakognitiv` va `differensial` atamalari mavjud.
- Mavjud nashrdagi `ozlashtirishni-baholash-va-qayta-aloqa` darsida `diagnostik`, `formativ`, `summativ` atamalari mavjud.
- Shuning uchun mazkur sohalarni to'liq ko'chirib takroriy dars sifatida yaratish o'rniga, aniq mavzu bo'shliqlariga e'tibor qaratildi. So'z mosligi barcha mazmunning mukammalligini isbotlamaydi.

## Haqiqiy baza yozuvi

Supabase `public.lessons` ga yangi dars qo'shildi:

- UUID: `f13160e4-4353-4aeb-8757-4a9cc8db570a`
- Slug: `pedagogik-refleksiya-va-kasbiy-tashxis`
- Modul: `umumiy-pedagogika`
- Holati: `review` (foydalanuvchi uchun nashr qilinmagan)
- Saqlangan matn: 706 belgi. Insertdan keyin SELECT bilan tekshirildi.
- `topic_test_question_count=20` — platforma konfiguratsiyasi, **tayyor 20 ta test** degani emas.

Keyingi qadam: darsni muharrirlikdan o'tkazish, refleksiya nazariyasini kengaytirish, mos konstruktlar va alohida tekshirilgan savollarni biriktirish. Bu commit ishlab chiqarish bazasiga o'zgartirish kiritmaydi; yuqoridagi baza kiritilishi allaqachon alohida bajarildi. Test kalitlari hamda imtihon natijalari o'zgarmadi. Qo'lda production deploy yo'q.

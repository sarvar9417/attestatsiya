# TASK-531 — PM.MET Y2 manba dalili va bank tiklanishi

**Sana:** 2026-10-22. **Muhit:** Supabase `plyqezulrfowyblsfpzy`.

## Muammo

TASK-433 barcha yangi test poollaridan ochiq manba-dalil topilmasi bor savollarni chiqarib tashladi. Natijada PM.MET Y2 formatida learner-eligible savol soni 0 bo‘ldi. Tarixiy yagona savolning uch juftligi manbaga mos edi, ammo `tahliliy taqqoslash` atamasi tekshirilgan darslikda shu shaklda aniq tasdiqlanmadi. Findingni dalilsiz yopish mumkin emas.

## Tekshirilgan manba

M.E. Mamarajabov, D.E. Toshtemirov, O‘.A. Yuldashev, **“Informatika o‘qitish metodikasi”**, Bookmany Print, Toshkent, 2023, 460 bet. Google Drive fayl ID: `1Ogu9CB2_W9OJDZlyNxZ81qw4G0faz5Vu`.

- bosma 66–70-betlar: ma’ruza, evristik suhbat, namoyish va amaliy ishlar metodlarining ta’rifi;
- bosma 253–255-betlar: metodik tizimning maqsad, mazmun, tashkiliy shakl va vosita komponentlari.

## Yechim

- `PM.MET.01` va `PM.MET.02` uchun 2 ta original, haqiqiy 4×4 Y2 moslashtirish savoli yaratildi;
- har bir juftlik darslikdagi aniq ta’rifga bog‘landi, javoblar tartibi chap taraf tartibidan farqli qilindi;
- savollar avval `review` holatida to‘liq option/key bilan yaratiladi;
- productiondagi yagona owner profili mavjud bo‘lsa, ownerning avvalgi “tashqi ekspert shart emas” vakolati halol provenance bilan qayd etilib, savollar atomik ravishda `published` qilinadi;
- eski, manbasi to‘liq tasdiqlanmagan Y2 o‘chirilmadi: immutable tarix saqlanib `archived` qilinadi va yangi PM.MET.02 savoliga revision ledger orqali bog‘lanadi;
- mustaqil tashqi inson ekspert xulosasi mavjud deb da’vo qilinmaydi.

## Sifat nazorati

`task531_pmmet_source_verified_y2.test.sql` quyidagilarni tekshiradi: 2 ta aniq source reference; 4 ta chap va 4 ta o‘ng variant; bijektiv 4 juft; key-option UUID a’zoligi; muhim semantik juftliklar; atomik `review`/`published` holati; productionda source-evidence eligibility va immutable replacement ledger.

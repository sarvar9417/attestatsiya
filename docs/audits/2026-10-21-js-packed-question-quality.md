# Bir qatorli JavaScript savollari — sifat nazorati (2026-10-21)

## Qamrov va manba
Supabase `public.questions.stem_md` dagi ```javascript` bloklari bo‘yicha o‘tkazilgan o‘qish (read-only) auditida 186 ta JavaScript blokli savol topildi. Ulardan 102 tasi bir satrli va nuqtali vergul qatnashgan. **102 — xato savollar soni emas, tekshirish uchun nomzodlar soni.**

2026-10-21 SQL toifalash sanog‘i:
- 102 ta nomzod;
- 27 tasida sikl/funksiya/switch kabi boshqaruv oqimi;
- 21 tasida asosan yakka `console.log` ifodasi;
- 1 tasida `/\\d/` regular expression;
- 2 tasida `{length:...}` obyekt literali;
- 8 tasida `if(...)` sharti.
Toifalar o‘zaro kesishadi va yig‘indisi 102 bo‘lishi kutilmaydi.

## Tasdiqlangan tuzatishlar
- Formatlash faqat UI ko‘rinishida; nashr etilgan savollar, javob kalitlari va evidence fingerprintlarga yozilmaydi.
- `function f(x){if(x%2===0)return x/2;return 3*x+1;}console.log(f(6));` misolida `if` va `return` ajratiladi.
- Regressiya sinovlari `for` sarlavhasidagi nuqtali vergullarni, quoted stringlarni va mavjud satr formatini tekshiradi.
- Regex literal, template literal va commentli kodlarda formatlagich ehtiyotkorlik bilan asl matnni saqlaydi.
- Murakkab looplar, rekursiya, `switch`, `do..while`, array metodlari va arrow funksiyalar uchun qo‘shimcha 22 ta namunaviy test kiritildi. Ushbu testlar kompilyator hosil qilgan kodning tokenlar tartibini taqqoslaydi, ammo dasturlarni bajarmaydi.

## Qolgan xavflar va yakuniy mezon
- 102 kodning barchasi har biriga alohida avtomatlashtirilgan test bilan qamrab olingani **tasdiqlanmagan**.
- Har qanday kodni faqat satrlarga ajratish hamma JavaScript sintaksisi uchun xavfsiz emas: object literal, regex, `switch`, arrow function va no-brace control flow uchun AST-parser asosidagi formatter uzoq muddatli yechim.
- Savollar matnini bazada o‘zgartirishga nashr etilgan versiyaning immutability guard’i yo‘l qo‘ymaydi; tahrir qilish uchun yangi editorial revision kerak.
- Testlarni muvaffaqiyatli o‘tkazish kodning ta’limiy to‘g‘riligi yoki javob kalitining to‘g‘riligini avtomatik isbotlamaydi.

**Release holati:** foydalanuvchi ko‘rsatmasi bo‘yicha `main`ga merge qilinishi mumkin, ammo production deploy qilinmaydi. Git merge commitida `[no-prod-deploy]` belgisi ishlatiladi.

# Attestatsiya 7-test.pdf — №3 original ikki kalitli xato

Asl PDFdagi Python kodi `n` sonining 2 dan `floor(sqrt(n))` gacha bo‘luvchilari borligini tekshiradi; bo‘luvchi topilsa `N`, topilmasa `Y` chiqaradi. Musbat `n>=2` qiymatlar uchun tub son `Y`, murakkab son `N` bo‘ladi.

Original B = `(17,35,41)` ham, C = `(23,27,29)` ham `Y,N,Y` beradi; yagona javob mavjud emas. A=`(15,36,45)` → `N,N,N`, D=`(16,29,36)` → `N,Y,N`.

**Alohida tahrir taklifi:** faqat yangi variant C ning `29` raqamini `28` ga almashtirish, asl PDFga tegmaslik: A=`(15,36,45)`→`NNN`; B=`(17,35,41)`→`YNY` (yagona mos); C=`(23,27,28)`→`YNN`; D=`(16,29,36)`→`NYN`. Maxsus regressiya sinovi keyingi release gatingda bajarilsin. Supabase private free-response QA draft saqlandi, `human_approved=false`, `publish_ready=false`. Asl nashr bloki saqlangan.

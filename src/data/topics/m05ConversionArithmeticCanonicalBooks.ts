/** TASK-292: source-guided original lessons on positional conversion and computer arithmetic. */
import type { TheoryBlock } from '../topicContent'
export const M05_02_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "Butun va chekli kasr sonni 2, 8, 10, 16 sistemalar orasida bosqichma-bosqich o‘tkazish; qoldiq usuli, razryadni yoyish, bitlarni 3/4 xonadan guruhlash va natijani qayta tekshirish; kasr yozuvi ba’zan cheksiz davom etishini tushuntirish."
  },
  {
    "type": "intro",
    "content": "Konversiyaning mohiyati — yozuvni o‘zgartirib, son qiymatini saqlash. Bir xil miqdor `45₁₀=101101₂=55₈=2D₁₆` bo‘lishi mumkin. Javobni tekshirish uchun uni manba asosga qayta o‘tkazing."
  },
  {
    "type": "heading",
    "content": "1. Usulni qanday tanlash kerak?"
  },
  {
    "type": "table",
    "content": "| Boshlang‘ich va maqsad asos | Tezkor usul | Tekshiruv |\n|---|---|---|\n| 2/8/16 → 10 | Razryadni asosning darajasiga ko‘paytirish | Yig‘indi |\n| 10 → 2/8/16 | Butunni asosga ketma-ket bo‘lish | Qoldiqlar teskari |\n| 2 ↔ 8 | 3 bitli guruh | Har uchlik 0–7 |\n| 2 ↔ 16 | 4 bitli guruh | Har to‘rtlik 0–F |\n| 8 ↔ 16 | 2 orqali oraliq yozuv | Ikkilik yozuv saqlangan |"
  },
  {
    "type": "trap",
    "content": "O‘nlik kasrni asosga ko‘paytirish qoidasi **kasr qismi** uchun, butun qism uchun esa qoldiqli bo‘lish qo‘llanadi. Ikki usulni aralashtirmang."
  },
  {
    "type": "heading",
    "content": "2. Ikkilikdan o‘nlikka razryadlar"
  },
  {
    "type": "definition",
    "content": "`(aₙ…a₁a₀)₂=Σaᵢ×2ⁱ`: o‘ngdan 2⁰=1 bilan boshlang. Har bir 1 mos darajani qo‘shadi, 0 hech narsa qo‘shmaydi."
  },
  {
    "type": "solved",
    "content": "**Misol.** `110101₂ = 1×32 + 1×16 + 0×8 + 1×4 + 0×2 + 1×1 = 53₁₀`. Keltirilgan 6 bit 32,16,8,4,2,1 vaznlariga mos."
  },
  {
    "type": "table",
    "content": "| Bit | 1 | 1 | 0 | 1 | 0 | 1 |\n|---|---:|---:|---:|---:|---:|---:|\n| Vazn | 32 | 16 | 8 | 4 | 2 | 1 |\n| Hissa | 32 | 16 | 0 | 4 | 0 | 1 |"
  },
  {
    "type": "heading",
    "content": "3. O‘nlikdan ikkilikka qoldiqli bo‘lish"
  },
  {
    "type": "definition",
    "content": "Musbat butun N ni 2 ga bo‘lib, qoldiq (0 yoki 1) yoziladi; bo‘linma 0 bo‘lguncha takrorlanadi. Qoldiqlar **pastdan yuqoriga**, ya’ni oxirgidan birinchiga qarab o‘qiladi."
  },
  {
    "type": "table",
    "content": "| Bo‘lish | Butun bo‘linma | Qoldiq |\n|---|---:|---:|\n| 45 ÷ 2 | 22 | 1 |\n| 22 ÷ 2 | 11 | 0 |\n| 11 ÷ 2 | 5 | 1 |\n| 5 ÷ 2 | 2 | 1 |\n| 2 ÷ 2 | 1 | 0 |\n| 1 ÷ 2 | 0 | 1 |"
  },
  {
    "type": "solved",
    "content": "**Natija.** Qoldiqlarni jadvalning oxiridan yuqoriga o‘qing: `45₁₀=101101₂`. Tekshiruv: 32+8+4+1=45."
  },
  {
    "type": "trap",
    "content": "45 ning qoldiqlarini yuqoridan pastga `101101` deb tasodifan to‘g‘ri o‘qib qolish qoida emas; boshqa sonlarda bunday o‘qish xato natija beradi. Har doim bo‘linma tugaganidan keyin qoldiqlarni teskari yozing."
  },
  {
    "type": "heading",
    "content": "4. O‘nlikdan sakkizlik va o‘n oltilikka"
  },
  {
    "type": "solved",
    "content": "**Sakkizlik.** 83÷8=10 qoldiq 3; 10÷8=1 qoldiq 2; 1÷8=0 qoldiq 1. Teskari o‘qish `123₈`; tekshirish `1×64+2×8+3=83`."
  },
  {
    "type": "solved",
    "content": "**O‘n oltilik.** 255÷16=15 qoldiq 15 (F); 15÷16=0 qoldiq 15 (F). Demak `255₁₀=FF₁₆`. Qoldiq 10–15 bo‘lsa, A–F dan foydalaning."
  },
  {
    "type": "heading",
    "content": "5. Ikkilikdan sakkizlikka uchliklar"
  },
  {
    "type": "definition",
    "content": "`8=2³`. Ikkilik butun sonini o‘ngdan chapga **uch bitli** guruhlarga ajrating, yetishmagan chap guruhni 0 bilan to‘ldiring. Har guruhni 0–7 raqamiga almashtiring."
  },
  {
    "type": "solved",
    "content": "**Misol.** `101101₂` → `101 101` → `5 5` → `55₈`. Tekshiruv `5×8+5=45`."
  },
  {
    "type": "table",
    "content": "| Ikkilik uchlik | Sakkizlik | Ikkilik uchlik | Sakkizlik |\n|---|---:|---|---:|\n| 000 | 0 | 100 | 4 |\n| 001 | 1 | 101 | 5 |\n| 010 | 2 | 110 | 6 |\n| 011 | 3 | 111 | 7 |"
  },
  {
    "type": "trap",
    "content": "Ikkilik uchlik ichidagi `101` ni o‘nlik 101 deb olmang: u ikkilikdagi 5. Butun son guruhlari **o‘ng chetdan** boshlanadi."
  },
  {
    "type": "heading",
    "content": "6. Ikkilikdan o‘n oltilikka to‘rtliklar"
  },
  {
    "type": "definition",
    "content": "`16=2⁴`. Ikkilik raqamlarni o‘ngdan chapga **to‘rt bitli** guruhlarga ajrating; har birini 0–15 qiymatli 16 lik raqamga o‘tkazing."
  },
  {
    "type": "solved",
    "content": "**Misol.** `11010111₂` → `1101 0111` → D7₁₆; D=13, 7=7; o‘nlik tekshiruv `13×16+7=215`."
  },
  {
    "type": "table",
    "content": "| To‘rtlik | 16 lik | To‘rtlik | 16 lik |\n|---|---|---|---|\n| 1000 | 8 | 1100 | C |\n| 1001 | 9 | 1101 | D |\n| 1010 | A | 1110 | E |\n| 1011 | B | 1111 | F |"
  },
  {
    "type": "heading",
    "content": "7. Sakkizlik va o‘n oltilik orasida"
  },
  {
    "type": "solved",
    "content": "**Misol.** `73₈`: 7→111, 3→011, ya’ni `111011₂`. To‘rtlik bilan `0011 1011₂` → `3B₁₆`. Tekshiruv `7×8+3=59`, `3×16+11=59`."
  },
  {
    "type": "trap",
    "content": "8 likdan 16 likka o‘tganda raqamlarni bevosita harfga almashtirib bo‘lmaydi. Oraliq ikkilik yozuv yoki o‘nlik qiymat hisobidan foydalaning."
  },
  {
    "type": "heading",
    "content": "8. Kasr qismining razryad qiymati"
  },
  {
    "type": "definition",
    "content": "Verguldan o‘ng tomondagi razryadlar b⁻¹, b⁻², b⁻³ ... vazniga ega. Masalan `0.101₂ = 1/2 + 0/4 + 1/8 = 0.625₁₀`."
  },
  {
    "type": "table",
    "content": "| Ikkilik razryad | b⁻¹ | b⁻² | b⁻³ | b⁻⁴ |\n|---|---:|---:|---:|---:|\n| Qiymat | 0.5 | 0.25 | 0.125 | 0.0625 |"
  },
  {
    "type": "heading",
    "content": "9. O‘nlik kasrni ikkilikka ko‘paytirish"
  },
  {
    "type": "solved",
    "content": "**Misol.** `0.625×2=1.25` — birinchi bit 1, kasr qismi 0.25. `0.25×2=0.5` — ikkinchi bit 0. `0.5×2=1.0` — uchinchi bit 1. Natija `0.625₁₀=0.101₂`."
  },
  {
    "type": "case",
    "content": "**Cheklov.** `0.1₁₀` ning ikkilik yozuvi chekli bo‘lmaydi; kompyuter ma’lum bit uzunligida taxminiy qiymatni saqlashi mumkin. Shuning uchun ayrim o‘nlik kasrlarni to‘g‘ridan-to‘g‘ri tenglashtirishda yaxlitlash xatolari yuz beradi."
  },
  {
    "type": "heading",
    "content": "10. Python bilan mustaqil tekshirish"
  },
  {
    "type": "code",
    "content": "int('101101', 2)  # 45\nbin(45)             # '0b101101'\noct(45)             # '0o55'\nhex(45)             # '0x2d'\nint('3B', 16)       # 59"
  },
  {
    "type": "text",
    "content": "Python yordamchi tekshiruv vositasi: `0b`, `0o`, `0x` prefikslari asosni bildiradi. Imtihonda qo‘lda ishlash sababini tushunish uchun dastur natijasini razryad usulida qayta tekshiring."
  },
  {
    "type": "heading",
    "content": "11. Xatolar diagnostikasi"
  },
  {
    "type": "table",
    "content": "| Xato | Nega xato? | To‘g‘risi |\n|---|---|---|\n| 110₂=110₁₀ | Raqamlarni o‘nlik deb olish | 6₁₀ |\n| 2F₁₆=2×16+16 | F qiymati 15 | 47₁₀ |\n| 1011₂→12₈ | Uchlik noto‘g‘ri ajralgan | 13₈ |\n| 0.101₂=5₁₀ | Kasr darajalari e’tiborsiz | 0.625₁₀ |"
  },
  {
    "type": "task",
    "content": "1) `101010₂`ni o‘nlik va sakkizlikka aylantiring."
  },
  {
    "type": "task",
    "content": "2) `100₁₀`ni ikkilikka qoldiqli bo‘lish bilan o‘tkazing; natijani tekshiring."
  },
  {
    "type": "task",
    "content": "3) `7F₁₆`ni o‘nlik va ikkilikda yozing."
  },
  {
    "type": "task",
    "content": "4) `111101₂`ni to‘rtliklar orqali 16 likka o‘tkazing."
  },
  {
    "type": "task",
    "content": "5) `0.375₁₀` ning uch xonali ikkilik kasr yozuvini toping."
  },
  {
    "type": "answers",
    "content": "**Javoblar.** 1) `42₁₀=52₈`. 2) `1100100₂` (64+32+4=100). 3) `127₁₀=01111111₂` (yetakchi 0 ixtiyoriy). 4) `0011 1101₂=3D₁₆`. 5) `0.011₂=1/4+1/8=0.375`."
  },
  {
    "type": "summary",
    "content": "Butun son uchun qoldiqli bo‘lish va razryadlarni yoyish, 2/8/16 orasida guruhlash, kasr uchun manfiy darajalar va ko‘paytirish — konversiyaning asosiy usullari. Har doim qiymatni teskari tekshiring."
  },
  {
    "type": "source",
    "content": "**Manba izi:** Cambridge+ «Informatika va axborot texnologiyalari» 9-sinf (2021), 1-bobdagi «Ikkilik sanoq tizimi», bit/bayt tushunchalari — https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view . 8/16 lik konversiyalar, davriy ikkilik kasr va matematik mashqlar standart pozitsion sonlar nazariyasiga asoslangan mustaqil ishlanmalar. Sahifama-sahifa to‘liq nusxa emas."
  }
]
export const M05_03_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "2, 8 va 16 asosli sonlarni to‘g‘ri qo‘shish, ayirish, ko‘paytirish; ko‘chirish (carry) va qarz olishni bazaga bog‘lash; ikkilik ALU, bitli amallar, to‘ldiruvchi kod, to‘liq va cheklangan uzunlikdagi natija farqini tushunish."
  },
  {
    "type": "intro",
    "content": "Ikkilikda ham odatiy ustunlab hisoblash ishlaydi: farq – «o‘nlikdan o‘tish» emas, **asos 2 ga yetganda** keyingi razryadga bir birlik ko‘chishidir. `1₂+1₂=10₂`. Har bir javobni o‘nlikka tekshirish noto‘g‘ri carrylarni topishga yordam beradi."
  },
  {
    "type": "heading",
    "content": "1. Arifmetika umumiy tamoyili"
  },
  {
    "type": "definition",
    "content": "Har qanday b asosli pozitsion sistemada razryaddagi yig‘indi b ga yetsa, chapdagi xonaga ko‘chirish hosil bo‘ladi. Ayirishda kichik razryaddan qarz olinganda qiymat shu asos b ga teng."
  },
  {
    "type": "table",
    "content": "| Asos | Oddiy yig‘indi | Natijadagi ko‘chirish |\n|---|---|---|\n| 2 | 1+1=2₁₀ | 10₂: 0 va carry 1 |\n| 8 | 7+1=8₁₀ | 10₈: 0 va carry 1 |\n| 16 | F+1=16₁₀ | 10₁₆: 0 va carry 1 |"
  },
  {
    "type": "heading",
    "content": "2. Ikkilik qo‘shish jadvali"
  },
  {
    "type": "table",
    "content": "| A | B | Carry-in | Yig‘indi bit | Carry-out |\n|---|---|---|---|---|\n| 0 | 0 | 0 | 0 | 0 |\n| 0 | 1 | 0 | 1 | 0 |\n| 1 | 0 | 0 | 1 | 0 |\n| 1 | 1 | 0 | 0 | 1 |\n| 1 | 1 | 1 | 1 | 1 |"
  },
  {
    "type": "solved",
    "content": "**Misol.** `1011₂+1101₂`: o‘nlikda 11+13=24; ikkilikda `11000₂`. O‘ngdagi ikki 1 yig‘ilsa 0 va carry 1; keyingi razryadlarda ham carryni unutmang."
  },
  {
    "type": "trap",
    "content": "`1+1=0` deb qoldirish to‘liq javob emas; navbatdagi razryadga 1 ko‘chishi shart. Bir razryadda 1+1+1=11₂, ya’ni natija biti 1, carry 1."
  },
  {
    "type": "heading",
    "content": "3. Ikkilik ayirish va qarz olish"
  },
  {
    "type": "table",
    "content": "| A−B | Natija | Qarz |\n|---|---|---|\n| 0−0 | 0 | Yo‘q |\n| 1−0 | 1 | Yo‘q |\n| 1−1 | 0 | Yo‘q |\n| 0−1 | 1 | Chapdagi razryaddan 1 (2 qiymat) |"
  },
  {
    "type": "solved",
    "content": "**Misol.** `10000₂−00001₂=01111₂` (16−1=15). Nollardan zanjir bo‘ylab qarz olinadi: eng o‘ng 0−1 uchun chapdagi 1 qarzga keltiriladi."
  },
  {
    "type": "trap",
    "content": "Qarzga olingan 1 bit qiymat jihatdan shu razryadda 2 ga teng. Uni odatiy o‘nlik sanoqdagi 10 deb hisoblamang."
  },
  {
    "type": "heading",
    "content": "4. Ikkilik ko‘paytirish"
  },
  {
    "type": "definition",
    "content": "Ikkilik ko‘paytirishda 0×x=0, 1×x=x. Har keyingi qator mos razryadga **chapga bir o‘rin suriladi**. Bu o‘nlikdagi ko‘paytirishning o‘xshash usuli."
  },
  {
    "type": "solved",
    "content": "**Misol.** `1011₂ × 11₂`: 1011 (birlar xonasi) va 10110 (ikkilar xonasi) yig‘iladi → `100001₂` (33₁₀); 11×3=33 bilan tekshiring."
  },
  {
    "type": "heading",
    "content": "5. Sakkizlik va o‘n oltilikda amallar"
  },
  {
    "type": "solved",
    "content": "**Sakkizlik.** `7₈+5₈`: o‘nlik 7+5=12; `12₁₀=14₈`, demak `7₈+5₈=14₈`. 8 lik razryadga 1 ko‘chadi."
  },
  {
    "type": "solved",
    "content": "**O‘n oltilik.** `A₁₆+B₁₆` → 10+11=21₁₀ = `15₁₆`. Bu natijada 1 carry va pastki raqam 5."
  },
  {
    "type": "table",
    "content": "| Amal | Baza 2 | Baza 8 | Baza 16 |\n|---|---|---|---|\n| Qo‘shish | 101+11=1000₂ | 7+5=14₈ | A+B=15₁₆ |\n| Ayirish | 101−11=10₂ | 12−5=5₈ | 1A−F=B₁₆ |\n| Ko‘paytirish | 101×11=1111₂ | 3×4=14₈ | A×2=14₁₆ |"
  },
  {
    "type": "trap",
    "content": "16 lik hisobda A+B natijasi `15₁₆`, `AB₁₆` emas. Yozuvlarni qo‘shib qo‘yish arifmetik qo‘shish bo‘lmaydi."
  },
  {
    "type": "heading",
    "content": "6. Chapga/o‘ngga bit siljitish"
  },
  {
    "type": "definition",
    "content": "Belgilanmagan, musbat butun ikkilik sonni chapga 1 bit surish (ortiqcha bit yo‘qolmasa) ikki baravarga ko‘paytiradi; o‘ngga 1 surish 2 ga butun bo‘lishga mos. Ammo bit soni cheklangan registr va belgili sonlarda talqin murakkablashadi."
  },
  {
    "type": "solved",
    "content": "**Misol.** `1011₂` (11) ni chapga 2 bit surish → `101100₂` (44); 4 ga ko‘paydi. Cheklangan 4 bitli registrda natija 6 bit sig‘masligi sabab overflow yuz beradi."
  },
  {
    "type": "case",
    "content": "**Vaziyat.** 8 bitli maydonga 255+1 qo‘shilmoqda. Matematik natija 256, uning to‘liq ikkilik yozuvi 9 bit: `1 00000000₂`. Faqat pastki 8 bit saqlansa natija 0 bo‘lib qolishi mumkin; carry/overflow holati alohida qayd etiladi."
  },
  {
    "type": "heading",
    "content": "7. Belgili va belgisiz sonlar"
  },
  {
    "type": "definition",
    "content": "==Unsigned== n bit uchun 0…(2ⁿ−1) oraliq. ==Two’s complement== (ikkilik qo‘shimcha kod) n bitda odatda −2ⁿ⁻¹…(2ⁿ⁻¹−1) oraliqni tasvirlaydi. Xuddi bir xil bitlar ketma-ketligi har xil talqin qilinishi mumkin."
  },
  {
    "type": "table",
    "content": "| 8 bit | Unsigned | Two’s complement |\n|---|---:|---:|\n| 00000001 | 1 | 1 |\n| 01111111 | 127 | 127 |\n| 10000000 | 128 | −128 |\n| 11111111 | 255 | −1 |"
  },
  {
    "type": "solved",
    "content": "**Misol.** 8 bitli `00000101` (5) ning manfiy nusxasi uchun bitlarni inkor qiling: `11111010`, keyin +1 → `11111011` (−5 two’s complement). Tekshiruv: 5 + (−5) = 0 modulo 256."
  },
  {
    "type": "trap",
    "content": "Eng chap bitni «ishora biti» deb atash yetarli emas: sign-magnitude va two’s complement boshqa kodlashlar. Qaysi kodlash ishlatilayotganini aniqlash lozim."
  },
  {
    "type": "heading",
    "content": "8. Bitli mantiqiy amallar bilan farq"
  },
  {
    "type": "table",
    "content": "| Amal | 1010 va 1100 uchun | Natija |\n|---|---|---|\n| AND | 1010 & 1100 | 1000 |\n| OR | 1010 \\\\| 1100 | 1110 |\n| XOR | 1010 xor 1100 | 0110 |\n| NOT (4-bit) | ~1010 | 0101 |"
  },
  {
    "type": "text",
    "content": "Bitli AND, OR, XOR va NOT arifmetik qo‘shishdan farqli amal. NOT natijasi bit uzunligiga bog‘liq; Python’da cheklanmagan butun `~x` ni oddiy 4-bit NOT bilan bir xil deb ko‘rmang."
  },
  {
    "type": "heading",
    "content": "9. Dastur bilan hisobni tekshirish"
  },
  {
    "type": "code",
    "content": "a = 0b1011\nb = 0b1101\nprint(bin(a + b))  # 0b11000\nprint(bin(a * 3))  # 0b100001\nprint(hex(0xA + 0xB))  # 0x15\nprint((255 + 1) & 0xFF)  # 0, pastki 8 bit"
  },
  {
    "type": "example",
    "content": "Koddan avval hisobni qog‘ozda chiqaring, keyin prefiksli qiymatlar bilan solishtiring. Har ikkala natija mos bo‘lmasa, carry/borrow va son bazasini ko‘rib chiqing."
  },
  {
    "type": "heading",
    "content": "10. Attestatsiya uchun xato tahlili"
  },
  {
    "type": "table",
    "content": "| Noto‘g‘ri qarash | Nega? | To‘g‘risi |\n|---|---|---|\n| 1+1=0₂ | Carry tashlangan | 10₂ |\n| 1111₂=1111₁₀ | Bazalar adashgan | 15₁₀ |\n| A+B=AB₁₆ | Yozuv birikishi | 15₁₆ |\n| 8-bit unsigned 255+1=256 saqlanadi | Sig‘im yetmaydi | Modulo 256 natija 0 |\n| Barcha bit siljishlar xavfsiz | Overflow va ishora bo‘lishi mumkin | Kontekstni tekshirish |"
  },
  {
    "type": "task",
    "content": "1) `1101₂+1011₂` ni ustunlab qo‘shing va o‘nlik bilan tekshiring."
  },
  {
    "type": "task",
    "content": "2) `10000₂−00101₂` natijasini toping."
  },
  {
    "type": "task",
    "content": "3) `111₂×101₂` ko‘paytmasi nimaga teng?"
  },
  {
    "type": "task",
    "content": "4) `F₁₆+1₁₆` va `17₈+1₈` natijalarini o‘z asoslarida yozing."
  },
  {
    "type": "task",
    "content": "5) `11111111₂`ni 8 bitli unsigned hamda two’s complement sifatida talqin qiling."
  },
  {
    "type": "task",
    "content": "6) 8 bitli unsigned 250+10 hisoblanganda matematik va modulo-256 natijalarini ajrating."
  },
  {
    "type": "answers",
    "content": "**Javoblar.** 1) 13+11=24=`11000₂`. 2) 16−5=11=`1011₂`. 3) 7×5=35=`100011₂`. 4) `10₁₆` va `20₈`. 5) 255 yoki −1. 6) Matematik 260, pastki 8 bit (260 mod 256)=4."
  },
  {
    "type": "summary",
    "content": "Har bir asosda arifmetika o‘sha bazaga mos ko‘chirish/qarz bilan bajariladi. Bitlar soni va signed/unsigned talqini aniq bo‘lmasa, kompyuter natijasini cheksiz aniqlikdagi matematik natija bilan adashtirish mumkin."
  },
  {
    "type": "source",
    "content": "**Manba izi:** Cambridge+ 9-sinf «Informatika va axborot texnologiyalari», kompyuterning ikkilik signallari, bit va bayt konsepsiyasi (1-bob, bosma 3–4-betlar atrofida), https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view . Ikkilik arifmetika, cheklangan registr, two’s complement va mashqlar mustaqil matematik/informatik izoh; manbadan sahifama-sahifa ko‘chirma emas."
  }
]

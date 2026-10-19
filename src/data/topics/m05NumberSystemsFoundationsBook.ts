/** TASK-292: M05.01 deep positional-number-system chapter; source-traced, original examples. */
import type { TheoryBlock } from '../topicContent'
export const M05_01_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "Pozitsion va nopozitsion sanoq tizimlarini farqlash; 2, 8, 10, 16 asoslarning ruxsat etilgan raqamlari va razryad qiymatini topish; bir xil miqdorning har xil yozilishini tushuntirish; bit, bayt, ikkilik kod va rang kodlarining bog‘lanishini anglash."
  },
  {
    "type": "intro",
    "content": "Bitta miqdor turli raqamlar bilan ifodalanishi mumkin: 10₁₀, 1010₂, 12₈ va A₁₆ aynan o‘nlikdagi o‘n sonini bildiradi. Sanoq sistemasini bilish raqamlar qanday o‘rin qiymatiga ega ekanini tushunishdir — kompyuterning faqat «0 va 1 ishlatishi»ni yodlash emas."
  },
  {
    "type": "heading",
    "content": "1. Sanoq sistemasi nima?"
  },
  {
    "type": "definition",
    "content": "==Sanoq sistemasi== — sonlarni yozish va nomlashda qo‘llanadigan belgilar hamda qoidalar majmui. Pozitsion sistemada raqamning qiymati egallagan o‘rniga ham bog‘liq; nopozitsion sistemada odatda bunday razryad bo‘yicha ko‘payish qoidasi qo‘llanmaydi."
  },
  {
    "type": "table",
    "content": "| Tur | Misol | Asosiy xususiyat |\n|---|---|---|\n| Pozitsion | 245₁₀, 1011₂ | O‘rin qiymati asosning darajasi bilan o‘zgaradi |\n| Nopozitsion | Rim raqamlari (XIV) | Belgining qiymati odatda alohida qoidaga tayanadi |\n| O‘nlik | 245₁₀ | Har razryad 10 marta kattalashadi |\n| Ikkilik | 1011₂ | Har razryad 2 marta kattalashadi |"
  },
  {
    "type": "trap",
    "content": "Rim raqamlarida ham belgilar tartibi muhim bo‘lishi mumkin, lekin u odatdagi 10, 2, 16 darajalari bilan hisoblanadigan pozitsion yozuvning aynan o‘zi emas."
  },
  {
    "type": "heading",
    "content": "2. Asos va ruxsat etilgan belgilar"
  },
  {
    "type": "definition",
    "content": "==Asos (baza)== — pozitsion sistemada ishlatiladigan raqamlar soni. Baza b bo‘lsa, ruxsat etilgan oddiy raqam qiymatlari 0 dan b−1 gacha. 16 likda 10–15 qiymatlari A–F harflari bilan belgilanadi."
  },
  {
    "type": "table",
    "content": "| Sanoq asosi | Belgilar | Bir xil qiymat – 26₁₀ |\n|---|---|---|\n| 2 | 0,1 | 11010₂ |\n| 8 | 0–7 | 32₈ |\n| 10 | 0–9 | 26₁₀ |\n| 16 | 0–9, A–F | 1A₁₆ |"
  },
  {
    "type": "solved",
    "content": "**Tekshiruv.** `102₂` noto‘g‘ri: ikkilikda 2 raqami mavjud emas. `78₈` noto‘g‘ri: sakkizlikda 8 raqami yo‘q. `1A₁₆` to‘g‘ri, chunki A=10. Har qanday konversiyadan oldin raqamlarning bazaga mosligini tekshiring."
  },
  {
    "type": "heading",
    "content": "3. Razryad qiymatlari"
  },
  {
    "type": "definition",
    "content": "Pozitsion son uchun umumiy qoida: `N=(aₙ…a₁a₀)ᵦ = Σ aᵢ × bⁱ`. Eng o‘ngdagi butun son raqami b⁰, undan chapga b¹, b² va hokazoga ko‘paytiriladi."
  },
  {
    "type": "table",
    "content": "| Razryad | O‘nlikda | Ikkilikda | O‘n oltilikda |\n|---|---:|---:|---:|\n| 0 | 1 | 1 | 1 |\n| 1 | 10 | 2 | 16 |\n| 2 | 100 | 4 | 256 |\n| 3 | 1000 | 8 | 4096 |"
  },
  {
    "type": "solved",
    "content": "**Ishlangan misol.** `1011₂ = 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8+0+2+1 = 11₁₀`. Har bir ko‘paytuvchini jadvaldagi mos razryadga qo‘ying."
  },
  {
    "type": "solved",
    "content": "**Ishlangan misol.** `2F₁₆ = 2×16 + 15 = 47₁₀`. F belgisini «16» deb olish xato; F=15."
  },
  {
    "type": "heading",
    "content": "4. Bir xil sonning bir nechta yozuvi"
  },
  {
    "type": "table",
    "content": "| O‘nlik | Ikkilik | Sakkizlik | O‘n oltilik |\n|---:|---|---|---|\n| 0 | 0₂ | 0₈ | 0₁₆ |\n| 7 | 111₂ | 7₈ | 7₁₆ |\n| 8 | 1000₂ | 10₈ | 8₁₆ |\n| 10 | 1010₂ | 12₈ | A₁₆ |\n| 15 | 1111₂ | 17₈ | F₁₆ |\n| 16 | 10000₂ | 20₈ | 10₁₆ |\n| 255 | 11111111₂ | 377₈ | FF₁₆ |"
  },
  {
    "type": "trap",
    "content": "`10₂`, `10₈`, `10₁₀`, `10₁₆` yozuvlari bir xil **belgilar**dan tuzilgan, lekin mos ravishda 2, 8, 10, 16 miqdorlarni bildiradi."
  },
  {
    "type": "heading",
    "content": "5. Nol, yetakchi nol va aniqlik"
  },
  {
    "type": "text",
    "content": "Butun son oldidagi yetakchi nol qiymatni o‘zgartirmaydi: `00101₂ = 101₂`. Ammo 8 bitli kompyuter baytini ko‘rsatganda yetakchi nollar uzunlik talabi uchun muhim bo‘lishi mumkin."
  },
  {
    "type": "case",
    "content": "**Vaziyat.** Qurilma 8 bitli port holatini `00001010` deb ko‘rsatadi. Matematik qiymati 10 bo‘lsa-da, sakkizta signalning o‘rni ko‘rinishi uchun `0000` qismi tashlab yuborilmaydi."
  },
  {
    "type": "heading",
    "content": "6. Bit va bayt"
  },
  {
    "type": "definition",
    "content": "==Bit== (binary digit) – 0 yoki 1 qiymatini ifodalovchi axborot birligi. ==Bayt== odatiy arxitekturalarda 8 bit. 8 bit 2⁸=256 xil kombinatsiyani bera oladi; bu 0–255 oralig‘idagi **belgisiz** sonlar uchun ishlatilishi mumkin."
  },
  {
    "type": "table",
    "content": "| Uzunlik | Kombinatsiyalar soni | Belgisiz ifodalanadigan qiymatlar |\n|---|---:|---|\n| 1 bit | 2 | 0–1 |\n| 2 bit | 4 | 0–3 |\n| 4 bit | 16 | 0–15 |\n| 8 bit | 256 | 0–255 |\n| 16 bit | 65 536 | 0–65 535 |"
  },
  {
    "type": "trap",
    "content": "«8 bit doimo 0 dan 255 gacha son degani» noto‘g‘ri: shu bitlarni belgili son, matn kodi, rang komponenti yoki boshqa ma’lumot sifatida talqin qilish mumkin."
  },
  {
    "type": "heading",
    "content": "7. O‘n oltilik yozuv nima uchun qulay?"
  },
  {
    "type": "text",
    "content": "16 likning har bir raqami aniq to‘rt ikkilik bitga mos keladi. Uzoq bit ketma-ketligini ixcham va o‘qilishi qulay tarzda ifodalash mumkin. Masalan `1111 1111₂ = FF₁₆`."
  },
  {
    "type": "example",
    "content": "Veb ranglari ko‘pincha `#RRGGBB` ko‘rinishida beriladi: har ikki hex raqam 0–255 oraliqdagi qizil, yashil yoki ko‘k komponentni anglatishi mumkin. `#FF0000` — R=255, G=0, B=0."
  },
  {
    "type": "heading",
    "content": "8. Amaliy informatika: signal va kod"
  },
  {
    "type": "text",
    "content": "Kompyuterlar ikki holatli elektron tizimlardan foydalanishi mumkin; ular haqida o‘qishda yoniq/o‘chiq analogiyasi tushunarli, ammo haqiqiy qurilmada vaqt, kuchlanish va kodlash qoidalari ham muhim. Belgilar ekvivalent ikkilik kombinatsiya bilan kodlanadi."
  },
  {
    "type": "case",
    "content": "**Vaziyat.** O‘quvchi har qanday 8 bit aynan bitta lotin harfi deb o‘ylaydi. Aslida UTF-8 kabi kodlashlarda bitta belgi bir yoki bir nechta baytdan tuzilishi mumkin; tanlangan kodlashning qoidalari ahamiyatli."
  },
  {
    "type": "heading",
    "content": "9. Attestatsiya uslubidagi farqlashlar"
  },
  {
    "type": "table",
    "content": "| Savol turi | Asosiy usul | Qochiladigan xato |\n|---|---|---|\n| Belgilar mosligi | Har raqam < baza | `2`ni ikkilikka qo‘yish |\n| Pozitsion qiymat | Raqam × baza darajasi | O‘ngdan b⁰ o‘rniga b¹ boshlash |\n| Hex harf qiymati | A=10 … F=15 | F=16 deb olish |\n| Bayt kombinatsiyasi | 2ⁿ | `n²` bilan adashtirish |"
  },
  {
    "type": "task",
    "content": "1) `201₂` va `2B₁₆` yozuvlaridan qaysi biri ruxsat etilgan? Sababini tushuntiring."
  },
  {
    "type": "task",
    "content": "2) `12₈` va `12₁₀` ni o‘nlikda hisoblang. Ular tengmi?"
  },
  {
    "type": "task",
    "content": "3) `1111₂`, `F₁₆` va `15₁₀` ni qiymat bo‘yicha solishtiring."
  },
  {
    "type": "task",
    "content": "4) `00110010₂` ni 8 bitli ko‘rinishda nima uchun oldingi nollar bilan yozish mumkinligini izohlang."
  },
  {
    "type": "task",
    "content": "5) 5 bit nechta turli kombinatsiyani bera oladi? Belgisiz oraliqni yozing."
  },
  {
    "type": "answers",
    "content": "**Javoblar:** 1) `201₂` noto‘g‘ri (2 raqami bor), `2B₁₆` to‘g‘ri. 2) `12₈=10₁₀`, `12₁₀=12₁₀` – teng emas. 3) Uchtasi ham 15. 4) Baytning barcha razryad o‘rni saqlansin. 5) 2⁵=32 kombinatsiya, belgisiz 0–31."
  },
  {
    "type": "summary",
    "content": "Bazani, ruxsat etilgan raqamlarni va razryad qiymatini aniqlasangiz, konversiyadagi ko‘p xatolar yo‘qoladi. **Qaysi sanoq tizimi ekanini indeks bilan ko‘rsatish** – bir xil yozuvlar turli qiymatga ega bo‘lishi mumkinligi sababli muhim."
  },
  {
    "type": "source",
    "content": "**Manba izi:** Cambridge+ «Informatika va axborot texnologiyalari», 9-sinf (2021), 1-bob «Kompyuter tizimlarining turlari va komponentlari», bosma 3–4-betlar atrofida ikkilik qiymatlar, bit va bayt tushunchasi — https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view . Pozitsion sanoq sistemalarini hisoblash, 8/16 lik misollar, mashqlar va rang kodlash izohlari mustaqil fan asoslari bo‘yicha yozilgan. Sahifama-sahifa to‘liq darslik ko‘chirmasi emas."
  }
]

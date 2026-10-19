# Pedagogika: M14.03 va M15.01–07 manba-audit va tuzatishlar (2026-10-19)

**Holat:** review-only, source-grounded static fallback theory. **Qat'iy chegaralar:** prod DB, API answer keys, immutable published revisions, exam runner, migrations va deployment o‘zgartirilmagan. Ushbu hujjat hech qanday savol kalitini ekspert tasdiqladi degani emas.

## Tekshirilgan manbalar

1. **Komil Jalilov**, *Baholash nazariyasi asoslari* (Akademnashr, Toshkent, 2020, 256 b.), [Drive PDF](https://drive.google.com/file/d/1-l4tFRqNEBuDEtvIavoh8yYB2pYp1JFN/view). Matn extract orqali «domen», «konstrukt», 1.2-bobdagi shakllantiruvchi/xulosalovchi maqsad, normaga/mezon/ipsativ qiyoslash, 2.1-bobdagi validlik tushunchasi ko‘rildi. PDF text extraction 329 398 belgi.
2. [*Kasb-standarti.pdf*](https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view) va [*Kasb standarti 3-soha.pdf*](https://drive.google.com/file/d/1fOWs9LWgrzchy3OGb_mnWmv2fbNonlAP/view): 3-mehnat vazifasi va diagnostik/formativ/summativ tasnifi, tizimli kuzatish, asoslangan qayta aloqa, o‘qitish rejasini moslashtirish. Huquqiy kuch va fizik betlar mustaqil tekshirilmagan.
3. [*Mirzayeva Pedagogika nazriyasi qollanma 2-mavzu.pdf*](https://drive.google.com/file/d/1woZMas8dNbzk6yephzNH_XdmT19ess-l/view): «Pedagogika fanining asosiy kategoriyalari» ro‘yxati, obyekt/predmet, didaktika, tarbiya turlari. Ikkilamchi darslik konspekti sifatida ko‘rildi; pedagogik kategoriyalarning butun ilmiy tarixini aks ettiruvchi universal standart emas.
4. [Xoliqov *Pedagogik mahorat.pdf*](https://drive.google.com/file/d/1urZe1IJjLVco-KysxtIvg46Ej89XreuK/view): mahorat komponentlari va pedagogik qobiliyatlar; ma'lum mualliflar tasnifidagi «avtoritar» atamasi zo‘ravonlikni oqlamaydi.
5. [N. Mahmudov, *O‘qituvchi nutqi madaniyati* (2007)](https://drive.google.com/file/d/1MUrT_uKKg-0jWwV16j97AzkcbU6LGpHL/view): kitobning kirish/bibliografik tavsifida «to‘g‘rilik, aniqlik, mantiqiylik, soflik, boylik, jo‘yalilik, ifodalilik» sanalgan. **PDFda kuchli OCR buzilishlari bor; fizik sahifa tasvirlari hali tekshirilmagan**, aynan bu nomlarning semantik izohi muharrirning amaliy misollaridir.
6. [Muslimov va boshqalar, *Pedagogik kompetentlik va kreativlik asoslari* (2015)](https://drive.google.com/file/d/1M0vGhTnSMehXfyEHo3dlHXUgeA_DTbfN/view): kasbiy kompetentlik, kreativlik va amaliy refleksiya mazmuniga aloqador o‘quv-metodik qo‘llanma; bu bosqichda yangi savol kalitlari uchun dalil qilinmagan.

## Mavzu bo‘yicha diff va tekshiruv chegarasi

| Mavzu | Yangilanish | Dalil statusi va ochiq ish |
|---|---|---|
| M14.03 | Domen/konstrukt/validlik; norma, mezon, ipsativ tasnifini diagnostik/formativ/summativdan farqlash; Python misoli | Jalilov + 3-soha mazmuni ko‘rildi; fizik bet/kalit QA ochiq |
| M15.01 | Shaxs, ta’lim, tarbiya, rivojlanish, bilim, ko‘nikma, malaka, kompetensiya, ma’lumot; obyekt/predmet | Mirzayeva mavzu konspekti bilan tekshirildi; fizik sahifa ochiq |
| M15.02 | Oldingi Bloom 1956/2001 manbali izohlar saqlandi; bu PR’da yangi matn yo‘q | Sahifa-by-sahifa va test keys ochiq |
| M15.03 | Fuqarolik tarbiyasi qayta kiritildi, yo‘nalish/metod/shakl farqlari va zo‘ravonlikni tavsiya qilmaslik | Mirzayeva tarbiya turlari; metod misoli muharrir yozuvi; key QA ochiq |
| M15.04 | Oldingi dars turi/tahlil turining manbali farqi saqlandi; bu PR’da yangi matn yo‘q | Qo‘llanmalar bo‘yicha mavjud oldingi testlardan tashqari tekshirilmagan |
| M15.05 | Kundalik/elektron xizmatlar va hujjatlarning namunaviy xarakteri ochiq belgilandi | Amaldagi normativ reestri/hujjat majburiyatlari hali tekshirilmagan |
| M15.06 | Mahmudovdagi nutqning yetti kommunikativ sifati va informatika misoli | Matn extract; OCR notekis; fizik sahifani tekshirish ochiq |
| M15.07 | Didaktik qobiliyat yagona mutlaq ustun tur deb berilmaydi; «avtoritar» atamasi tarixiy kontekstga qo‘yildi | Xoliqov o‘quv konspekti; turli muallif qobiliyat tasniflarini ajratish ochiq |

**Muhim tasnif tafovuti:** Jalilov 1.2-bo‘limda baholashning ikki maqsadini (shakllantiruvchi/xulosalovchi), 3-soha qo‘llanmasi esa diagnostik/formativ/summativni alohida ko‘rsatadi; biri ikkinchisini to‘liq almashtiruvchi **bir xil ro‘yxat** sifatida berilmaydi.

## QA va ishlab chiqarish xavfsizligi

- `src/data/topicContent.ts`: M14.03, M15.01, M15.03, M15.05, M15.06, M15.07 static theory tuzatildi.
- `src/tests/PedagogyAssessmentSource20261019.test.ts`: 9 ta yangi Vitest regression testi: tasnif, dalil izi, kategoriyalar, etik cheklovlar, nutq sifati va empty static M14–M15 question bank.
- M15.02, M15.04 existing notes/tests o‘zgarmadi.
- **Open:** CI on exact PR SHA; head/main diff; published-vs-review inventory from live DB; each current question's source and answer-key review; 2026 specs and physical book pages; browser/mobile/accessible reading QA.
- **No merge/deploy** before successful CI and review; no production write in this batch.

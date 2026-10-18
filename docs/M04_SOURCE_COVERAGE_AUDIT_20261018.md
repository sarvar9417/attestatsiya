# M04 — «Mantiqiy mulohazalar va modellar» manba asosidagi tuzatishlar auditi

**Sana:** 2026-10-18  
**Baza:** Supabase `attestatsiya100%`, mavjud `M04` moduli.  
**Holat:** mazmuniy tuzatishlar va 60 savolning `review` importi bajarilgan; **to‘liq nashr va foydalanuvchi end-to-end tasdig‘i hali bajarilmagan**.

## Qat’iy manba iyerarxiyasi

1. **Asosiy manba:** M. R. Fayziyeva, D. M. Sayfurov, N. S. Xaytullayeva. *Informatika va axborot texnologiyalari*, 9-sinf (2020), I bob bosma 4–16, II bob bosma 17–26-betlar.
2. **Qamrov va shakl:** *Informatika va axborot texnologiyalari fanidan malaka sinovi test spetsifikatsiyasi (2026)*, PDF 4-betdagi «Mantiqiy mulohazalar va modellar» konstruktlari, 3 ta savol. Spec PDF 2-betida Y1, Y2, Y3 test turlari aniqlangan.
3. **Savol uslubi va murakkabligi:** `Test.pdf` (2019), PDF 41–45-betlar; `20000 LIK informatika.pdf`, PDF 3–4-betlar; `13.04.2026 Attetasiya Tushgan savollar.pdf`, PDF 5–6-betlar; `Informatika Demo testi .pdf`, PDF 12-bet. Bu testlarda berilgan eski kalitlar avtomatik ko‘chirilmagan.
4. **Qo‘shimcha darslik:** Cambridge+ 9-sinfning 6.05 va 10–11-sinfning 8.03–8.04 bo‘limlaridan modellashtirish va what-if tushunchalari. Tegishli qism *qo‘shimcha* deb belgilangan.

Google Drive darslik/test katalogi hamda loyiha «Source files» papkasi ko‘rildi. «Source files»dagi asosiy arxivlar **axborot va raqamli savodxonlik** bo‘limiga tegishli; ular M04 uchun ishonchli mustaqil mantiq savol manbasi sifatida ko‘rsatilmagan.

## Spetsifikatsiya → M04 matritsasi

| Konstruktdagi talab | Asosiy darslik sahifalari | Platformadagi dars | Tekshirish formati |
| --- | --- | --- | --- |
| Sodda/murakkab mulohazalar | 4–6 | M04.01 | Y1 tushuncha va Y2 jumlalarni moslash |
| Mantiqiy amallar | 6–10 | M04.02 | Y1 formulalar va Y2 amallar, Y3 amallar tartibi |
| Rostlik jadvali va sxemalar | 10–16 | M04.03–M04.04 | Y1 truth-table, Y2 vektor, Y3 sxema ketma-ketligi, avvalgi 52 grafik `review` |
| Xulosa chiqarish va masala yechish | 4–12, 17–19 | M04.05 | Y1 vaziyatli masalalar, Y2/Y3 bosqichlar |
| Model turlari (darslik qamrovi) | 20–26; Cambridge qo‘shimcha | M04.06 | Y1 formula/model tasnifi, Y2 tasnif mezoni, Y3 what-if |

**Chegara:** bosma 17–19-betdagi «kompyuterda masala yechishning olti bosqichi» darslik qamrovini to‘ldirish uchun kiritilgan, ammo 2026-yil M04 konstruktlarida u alohida majburiy savol sifatida sanalmagan. Barcha 13 darslikning har bir sahifasi to‘liq ekspertiza qilingan deb da’vo qilinmaydi.

## Production Supabase’da bajarilgan mazmuniy ishlar

- M04.05 darsiga bosma 17–19-betlar asosida **olti bosqich**, uchta darslik masalasi (150 g va 100 N, 12×9 cm uchburchak, 46×40×67 belgi) va testlashdagi keng tarqalgan xatolar to‘g‘risidagi qo‘shimcha nazariya kiritildi.
- M04.06 noto‘g‘ri boshqa mavzu bilan boshlangani aniqlandi; kirish matni olib tashlanib, **«8-bob. Modellar va mantiqiy modellashtirish»** bilan boshlanadigan holatga keltirildi.
- M04.06 ga obyekt/xossa, model ta’rifi, vaqt, taqdim etish va maqsad mezonlari, verbal/belgili modellar, bosma 26-betdagi teskari model va qo‘shimcha Cambridge what-if tahlili kiritildi.
- Darslikdagi «statik/dinamik» ayrim misollarining matni talqinli; savollarda mutlaq mezon sifatida **darslikning ta’rifi** ishlatildi, nizo izoh bilan ochiq qayd etildi.
- Oldingi 295 savolli bankdan, test urinishlari bo‘lmagan **7 ta takroriy savol** o‘chirilmasdan `archived` holatiga o‘tkazildi. Shu bankning `published` savollari orasida aynan bir xil matnli takror qolmadi.

## Yangi savollar va texnik audit

- `source_reference` prefiksi: `m04-sourceaudit-20261018-v1:` — deterministik UUID va qayta importda ko‘paymaslik.
- **60 ta original savol**: **48 × Y1**, **6 × Y2 (haqiqiy juftlash)**, **6 × Y3 (haqiqiy tartiblash)**; har bir savolning bob/dars ID, konstrukt, darslik sahifasi, javob izohi va tayyorlik holati saqlangan.
- 12 ta to‘rt o‘zgaruvchili rostlik masalasi ikki alohida parser bilan 16 ta satrni to‘liq sanash orqali qayta hisoblandi.
- Y2 juftlar xaritasi va Y3 tartiblarining bog‘langan option UUIDlariga mosligi SQL tekshiruvida **60/60** tasdiqlandi. Y1ning barcha kalitlari ham mavjud javob variantiga bog‘langan.
- Avvalgi `MAN-*` bankidagi algoritmik talqin qilinadigan **44 ta** formula/rostlik vektori kaliti tekshirildi, shu to‘plamda xato topilmadi. Bu bankdagi barcha 295 savol inson ekspertizasidan o‘tdi degani emas.
- **60 yangi savol `review` holatida.** Ularning avtomatik auditdan o‘tishi ruxsat etilgan mutaxassisning mustaqil tahririy signoff’i o‘rnini bosmaydi.

## Javob kalitlari va xavfsizlik

Repository **public**. Shu sababli yangi Y1/Y2/Y3 javob kalitlari yoki ularni oshkor qiluvchi to‘liq import SQL fayli bu yerga joylashtirilmaydi. Xavfsiz reproduktiv qamrov tekshiruvlari va muammolar reyestri public repoda; to‘liq manba JSON/SQL shaxsiy material sifatida saqlanadi. Review savollari, ularning kaliti va variantlari o‘quvchi API'si orqali ochilmasligi shart.

## Ishni yopishga to‘sqinlik qiladigan shartlar

1. Darsliklardan olingan har bir tegishli rasm/topshiriq uchun mustaqil ekspert qamrovini to‘ldirish.
2. Avvalgi **52 ta sxemali savolni** actual production brauzerida (desktop/mobile) savol ↔ rasm ↔ kalit bo‘yicha tekshirish va faqat so‘ng nashr qilish.
3. Yangi Y2/Y3 moslashtirish va tartiblashning haqiqiy foydalanuvchi sessiyasida ishlashi, baholanishi, natija/progress tarixini saqlashi bo‘yicha E2E.
4. 60 yangi savol uchun inson tahririy ekspertizasini bajarish va kanonik tasdiq/nashr ish oqimini qo‘llash.
5. 2026 spetsifikatsiyasining umumiy 50 talik mock-test balansini muvofiqligini tekshirish (M04 ulushi 3 ta; butun imtihon nisbatlarini M04ning o‘ziga majburan qo‘llamaslik).

**Qaror:** M04 bazasiga so‘ralgan tuzatishlar va yangi materiallar **kiritildi**, lekin «100% barcha talablar bajarildi» yoki «hammasi productionda tekshirildi» degan sertifikat hozircha berilmaydi.
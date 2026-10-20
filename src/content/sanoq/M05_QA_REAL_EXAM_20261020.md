# M05 — Sanoq sistemalari: haqiqiy attestatsiya uslubi va sifat auditi
**Sana:** 2026-10-20  
**Chegara:** faqat M05.01 / M05.02 / M05.03. Nazariya, boshqa modullar, foydalanuvchi javoblari va boshqa test banklari o‘zgartirilmadi.

## 1. Tekshirilgan manbalar va real uslub

| Manba | Aniq dalil | M05 uchun model |
| --- | --- | --- |
| `13.04.2026 Attetasiya Tushgan savollar.pdf` PDF 7-sahifa, 14-savol | 4 xil asosdagi son orasidan yig'indisi eng katta ikkitasini tanlash | Oraliq yechim sifatida barcha qiymatlarni solishtirish, Y1 juftlik tanlash |
| Shu PDF, 8-sahifa, 15-savol | Jami va o‘g‘il bola soni 16-likda; qizlar sonini o‘nlikda topish. Originalda indekslar (masalan, 25₁₆) kichik ko‘rinishda | Hikoyali vaziyat, ikki sonni o‘tkazish + ayirma, Y1 |
| `2025 kuzgi demo @Informatika_fani_ustozlari.pdf` PDF 13-sahifa, 4-savol | `a=A4₁₆, b=246₈` orasidagi ikkilik `c` qiymatini aniqlash | Tengsizlik va turli asosdagi qiymatlarni solishtirish, Y1 va Y2 |
| `Demo 2026 test 10 000 so\`mlik.pdf` PDF 2-sahifa, 4-savol | `10011100₂, 9F₁₆, 222₈` sonlarni o‘sish tartibiga keltirish | Aralash asosli tartiblash, Y3 |
| `Test.pdf`, PDF 34–40 | Sanoq sistemalari bo‘limi; aralash asosli amallar, eng kichik asos va boshqa shakllar. **Manbada javoblarda xatolik bo‘lishi mumkinligi qayd etilgan** | Faqat uslubni qiyoslash uchun; kalitlari ko‘r-ko‘rona ko‘chirilmagan |
| `Informatika Testlar spesifikatsiyasi.pdf`, PDF 3–4 | Sanoq sistemalari: asoslarni bilish, o‘tkazish, arifmetika; Y1, Y2, Y3; rasmiy mutaxassislik testida mavzu uchun 2 savol | Konstrukt/format va kompetensiya nazorati |
| `ICT 7_sinf-2021(1).pdf`, PDF 9–20 | Ta’riflar, alifbo/asos, o‘tkazish, arifmetika | Matematik to‘g‘rilik uchun asosiy darslik |

**Farq:** asl imtihon va demo sahifasidagi berilgan savol **manbaviy nusxa**; yangi 30 ta savol uning **uslubiga asoslangan mustaqil mualliflik savoli**. Asl matn to‘liq ko‘chirilmagan.

## 2. Boshlang‘ich holat va o‘zgarishlar

Oldingi sessiyada sanalgan M05 bank **389** edi. Keyinroq, 2026-10-19 kunida, yana **11 ta Drive-manbali Y1** savol import qilingan; ushbu audit boshlanganda **400 ta published** savol mavjud edi.

| Format | Audit boshi | Qo‘shildi | Foydalanilmagan takrorlarni arxivlash | Hozir published |
| --- | ---: | ---: | ---: | ---: |
| Y1 | 300 | +12 | −6 | **306** |
| Y2 | 50 | +6 | 0 | **56** |
| Y3 | 50 | +12 | −12 | **50** |
| **Jami** | **400** | **+30** | **−18** | **412** |

**18 ta savol arxivlangan, o‘chirilmagan.** Bu savollar mutlaqo `exam_items` jadvalidagi oldingi sinovlarda ishlatilmagan. Oldin sinovlarga biriktirilgan 3 ta Y3 va 6 ta juda o‘xshash Y1 saqlangan (ayrimlarida foydalanuvchi hali javob bermagan bo‘lishi mumkin).

Tarkibiy tuzatish:
- Y3 15 ta bir xil matndagi, faqat ikkilik sonlar o‘zgargan savoldan 12 tasi xavfsiz arxivlandi; qolgan 3 tasiga oldingi exam_items orqali bog‘lanishlar bor.
- Y1 da bir xil «ikkilik uzun yozuv uchun eng kichik asos» savollaridan 6 ta foydalanilmagani arxivlandi.
- Yangilangan savollar 2025/2026 demo uslubiga yaqin, ko‘p bosqichli yechimni talab qiladi.

## 3. 30 ta yangi attestatsiyaga yaqin savol

- **12 Y1:** 4 eng katta yig‘indili juftlik, 4 kundalik vaziyatda farq, 4 ikki asos orasidagi ikkilik son.
- **6 Y2:** to‘rtta oraliqni to‘rtta mos ikkilik yechim bilan moslashtirish.
- **12 Y3:** 6 aralash asosli sonlarni tartiblash, 3 aralash asosli ifodalar yig‘indisini tartiblash, 3 hayotiy masalani yechish ketma-ketligi.

Manba/stil izlari `metadata`, `source`, `source_reference`, `question_keys.explanation_md` orqali kuzatiladi.

### To‘g‘ridan to‘g‘ri savol tekshiruvlari
- Yangi 30/30 savolda to‘g‘ri javob, natijaviy asos, turli javob variantlari, Y2 permutatsiyasi va Y3 tartibi algoritmik tekshirildi — **0 xato**.
- Oldingi 75 parametrik Y1 savolning 75/75 tasida eng kichik asos / butun sonni o‘tkazish / qo‘shish qayta hisoblandi — **0 xato**.
- Avvalgi 180 savollik 2026 LaTeX to‘plamining 100 ta C–E hisoblashli topshirig‘i va B turidagi 26 ta hisoblanuvchi topshirig‘i tekshirildi — **0 aniqlangan xato**. Qolgan tushuncha va qog‘oz Y2/Y3 ko‘rinishidagi topshiriqlarga bu hisoblash statistikasi tatbiq etilmaydi; shuning uchun barcha 180 savol mustaqil ekspert ko‘rigidan o‘tgan deb da’vo qilinmaydi.
- Oldingi 74 ta Y2/Y3 qo‘shimcha savol oldingi bosqichda hisoblash, moslashtirish va ketma-ketlik tekshiruvlaridan o‘tgan.

## 4. Yakuniy live Supabase strukturaviy tekshiruv

`M05.01: 129`, `M05.02: 176`, `M05.03: 107` = **412 published** savol.

| M05 darsi | Y1 | Y2 | Y3 | Jami |
| --- | ---: | ---: | ---: | ---: |
| M05.01 | 114 | 11 | 4 | 129 |
| M05.02 | 120 | 33 | 23 | 176 |
| M05.03 | 72 | 12 | 23 | 107 |
| **Jami** | **306** | **56** | **50** | **412** |

- `missing_keys=0`; `bad_y1=0`; `bad_y2=0`; `bad_y3=0` — **barcha 412 published** savolda strukturaviy javob kaliti va variant IDlari to‘g‘ri.
- Takrorlanadigan variant matni (bir savolning optionlari ichida): **0**.
- Har bir M05 darsida `topic_test_preview` `reason=null`, `question_count=20`, `duration_sec=2400`.
- Asl nusxalar, 11 ta avvalgi Drive import, foydalanuvchi exam_items, javob/ballar o‘zgarmadi.

## 5. Muhim cheklovlar

1. Avtomatik tekshiruv **412/412 ta savolning matematik mazmunini birma-bir mutaxassis tasdiqlaganini anglatmaydi**. Strukturaviy audit to‘liq; hisoblashli topshiriqlarning katta qismi esa mustaqil qayta hisoblangan. Qolgan noaniq, tushunchaviy yoki tasvirga bog‘liq savollar alohida ekspert review talab qilishi mumkin.
2. Ba’zi avvalgi savollar tarixiy exam_items sabab xavfsiz saqlangan. Ularning yuqori o‘xshashligi ishlanmagan savollarning arxivlanishi bilan kamaytirildi.
3. 2019-yil `Test.pdf` o‘zi javoblarda xatolik ehtimolini ko‘rsatadi; ushbu manba rasmiy 2026 attestatsiya spetsifikatsiyasiga tenglashtirilmagan.
4. `published` baza holati haqiqiy production sayt versiyasi bilan bir xil emas: Vercel yangi commitni deploy qilmaguncha authenticated end-to-end `start → answer → finish → result` zanjirini mutlaq tasdiqlash mumkin emas.
5. 20-savollik mavzu testi hozirda Y2/Y3 bo‘yicha qat’iy foizli taqsimot kafolatiga ega ekanligi alohida tekshirilmagan. «Bankda 56 Y2/50 Y3» bilan «har bir testda shuncha» bir xil tushuncha emas.

## 6. Tiklash va takror ishlab chiqarish

- `src/content/sanoq/M05_EXAM_STYLE_30_20261020.json` — 30 savol, misollar, manba izlari va javoblar.
- `supabase/maintenance/m05_exam_style_quality_20261020.sql` — 30 savolni atomic insert, faqat ishlatilmagan 12 Y3 ni arxivlovchi, 400→418 published release.
- `supabase/maintenance/m05_unused_min_base_dedup_20261020.sql` — faqat ishlatilmagan 6 Y1 ni arxivlovchi release, 418→412 published.

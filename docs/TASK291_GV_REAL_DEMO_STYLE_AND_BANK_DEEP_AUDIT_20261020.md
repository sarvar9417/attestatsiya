# TASK-291 — Grafika va veb-texnologiyalar: demo/real uslubiy va sifat auditi

**Sana:** 2026-10-20. **Holat:** IN_PROGRESS — individual risk triage + 30 yangi authorial REVIEW nomzod, **mustaqil ekspert tasdiqlashi va production reliz yo‘q**.

## Ishlatilgan real manbalar

1. [2025-yil kuzgi demo yechimlari — PDF, Drive](https://drive.google.com/file/d/11fCXWHUJ3j7IHz619Ja84wqbcRaraept/view): PDF **9-bet**: HTML `style` kodi bo‘yicha *noto‘g‘ri tasdiqni* topish; `rowspan`, `colspan`, `width` bo‘yicha hisoblash va jadval ko‘rinishi; **14-bet**: HTML kod bo‘yicha 4 ta *brauzer ko‘rinishi* javobidan mosini tanlash. Bu manba “demo yechimlari” to‘plami sifatida identifikatsiya qilingan, mustaqil rasmiy original ekanligi tasdiqlanmagan.
2. [13.04.2026 tushgan savollar to‘plami — PDF, Drive](https://drive.google.com/file/d/1hGQibtomuvzXZZnuAY4OulteH67nRtEn/view): **14-bet**: ichma-ich HTML ro‘yxati; **22-bet**: forma va `input` kodining ko‘rinishi; **23-bet**: `table`, `th`, `tr`, `td` uchun CSS qoidasidan matn rangini aniqlash. Bu foydalanuvchi yuborgan to‘plam, mustaqil rasmiy provenance tasdiqlanmagan.
3. Drive `Attestatsiya` papkasidagi ayrim qo‘shimcha kesmalar (Photoshop tasvirni montajlash namunasi; CSS sahifa preview; HTML `rowspan`/jadval kodi). Kesma manba savolining barcha kalit/variantlarini ko‘rsatmasligi mumkin; shuning uchun to‘liq tasdiq sifatida ishlatilmaydi.
4. **Nazariy mazmunni tekshirish:** 2026 informatika spetsifikatsiyasi (27–31), ICT 7-sinf PDF 40–80 va 106–149, Cambridge+ 5-sinf PDF 27–44, Cambridge+ 8/9 veb boblari. *Uslub uchun namuna* va *savol mazmunini isbotlaydigan darslik* alohida yoziladi.

## Demo bilan taqqoslashdan chiqadigan majburiy mezonlar

- **Y1**: `kod → brauzer natijasi`, `shart/variantdagi xatoni aniqlash`, jadval geometriyasi/hisoblash, ikki yoki undan ortiq CSS selektorlar kaskadi, rasm amali natijasini hisoblash. Javob variantlari kodga mazmunan yaqin, savol bitta aniq javobli bo‘lsin.
- **Y2**: faqat nom-ta’rif mosligi bilan cheklanmaslik; berilgan HTML/CSS parchasi ↔ sahifa natijasi, grafik amal ↔ natija, vaziyat ↔ to‘g‘ri vosita juftligi. Har savolda 4 ta `a` + 4 ta `b` variant, 4 ta haqiqiy one-to-one UUID mapping.
- **Y3**: texnik operatsiyaning **yagona zarur** 4 bosqichli tartibi. Oddiy tahrir qilsa ham bo‘ladigan 4 ta amalni majburiy tartib kabi bermang. Ko‘rsatiladigan tartib aralash, javoblar serverda saqlanadi.
- **Grafika/Photoshop**: rasm yoki qatlam preview, aniq ko‘rinish natijasi, RGBA/rastr hajmi, masks/crop/resize va real ish vaziyatlari. Rasmlar original yoki tekshirilgan; boshqa manbadan deyarli ko‘chirilgan screenshot sifatida emas.
- **Izoh**: to‘g‘ri javob nega to‘g‘ri, chalg‘ituvchilardan eng yaqin ikkitasining xatosi nimada, aniq kitob sahifasi/qoida, hisobda bosqichlar.

## Production holati: avvalgi raqamlardan farq bor!

**2026-10-20 o‘qish vaqti, `attestatsiya100%` Supabase, S5.WEB:**

| Holat | Y1 | Y2 | Y3 | Jami |
|---|---:|---:|---:|---:|
| **published** | 60 | 2 | 2 | **64** |
| **review** | 280 | 50 | 50 | **380** |
| **archived** | 340 | 50 | 50 | **440** |
| **Jami (tarixiy reviziyalar bilan)** | 680 | 102 | 102 | **884** |

TASK-240 allaqachon 380 ta oldin published bo‘lgan V2 ni **archived** qilib, 380 ta **review** reviziya yaratgan; buni ortga qaytarmang. Mavjud 6 ta V2 nazariya darsi `review` bo‘lib turibdi. Foydalanuvchining oldingi 433 ta published holati endi joriy emas.

### DB’dagi 444 faol savol bo‘yicha takrorlanadigan birinchi risk skaneri

`docs/audits/TASK291_GV_CURRENT_QUESTION_RISK_FLAGS_20261020.csv` — **444 ta individual ID**, faqat metadata / uzunlik / indikatorlar; original matn va server kalitlari repo ichida emas.

- **276** tasida izoh **60 belgidan qisqa**;
- **145** tasida savol sharti **55 belgidan qisqa**;
- **119** ta HTML/CSS konstruktiga tegishli savolda kodli shart aniqlanmadi (regex indikator, xatolik hukmi emas);
- **432** tasida `assets=[]` (vizual yo‘qligi har bir savolda xato degani emas);
- **2 ta published Y2** (`2e897364-69dc-440f-961d-c2f3dd1aa6c3`, `3013b58c-9456-4aa6-9185-3a8a1c32385d`) bazada **8 ta `side='a'` va 0 ta `side='b'`** saqlagan; `pairs` 4 ta. Native matching `a/b` shartiga mos kelmaydi. Legacy UI `a`ni 4+4 bo‘lib ajrata oladimi — frontend/backend oqimida aniqlang; qo‘shimcha tekshiruvsiz “foydalanuvchi uchun mutlaqo ishlamaydi” deb hukm qilmang.
- 444 ta faol savolning ID/stem hash bo‘yicha ichki takrori ushbu snapshotda **0**; 380 review va 380 archived avvalgi savollar tarixiy reviziyalardir, ular bir-biriga tabiiy o‘xshaydi.

**Original 300 V2** avtomatik triage: 229 izoh 55 belgidan qisqa; 117 shart 55 belgidan qisqa; HT/CS uchun kodli shartsiz 71; 53 “javob uzunligi” signali; 10 Y2 faqat 3 juft, 10 Y3 faqat 3 bosqich; 300 savolning source ko‘rsatishi sahifalar **oraliq** darajasida, yakka aniq betga isbot yetarli emas. Shaxsiy 300-qatorli jadval [Drive’dagi audit](https://docs.google.com/spreadsheets/d/1qklN-9EEcZJAs83aF1tm472y75KJN3dKzNeSlg-2wI8/edit?usp=drivesdk) ichida; original stem va izoh Git’ga chiqarilmagan.

**Ogohlantirish:** bu *sifatli avtomatik screening*, 444 testning 444 tasi odam tomonidan yechib isbotlangan degani emas.

## Yangi savollar: foydalanuvchining Drive papkasida

[**30 ta demo-uslubidagi original REVIEW topshiriq**](https://docs.google.com/document/d/1VoZ4aZjONJgwTRDjQ22dOvFtn2zqWxhuoIj6mozZsPk/edit?usp=drivesdk) — 5 yo‘nalish × (4 Y1 + 1 Y2 + 1 Y3), jami **20 Y1 / 5 Y2 / 5 Y3**. Y1 kalitlari A/B/C/D harflariga 5 tadan muvozanatlangan; 30 ta savolning sintaktik/variant avtomatik testi 0 xatolik.

- Y1: 4 ta real tanlov + batafsil izoh; murakkab kod, piksel/matn natijasi, kerak bo‘lsa hisob.
- Y2: 4 ta to‘liq one-to-one juftlik; import vaqtida o‘ng tomon alohida aralashtiriladi.
- Y3: 4 ta izchil qadam; import vaqtida ko‘rsatiladigan tartib aralashtiriladi.
- Har topshiriqda `ORIGINAL_DEMO_STYLE_NOT_VERBATIM`, manbalar va `REVIEW_REQUIRED` qaydi bor.
- **Shakl mualliflik; ko‘chirilgan “rasmiy savol” deb belgilab yoki odam imzosiz nashr qilinmaydi.**
- **Vizual demo qo‘shimchasi:** [A–D HTML ro‘yxat ko‘rinishlari](https://drive.google.com/file/d/175xaPbYWFwp9ea-s7meAPHqlzS6OB_Bs/view?usp=drivesdk), haqiqiy Chromium renderer bilan yaratilgan va [30 savolli Google Doc](https://docs.google.com/document/d/1VoZ4aZjONJgwTRDjQ22dOvFtn2zqWxhuoIj6mozZsPk/edit?usp=drivesdk) oxiriga rasm sifatida kiritilgan; `GV-DEMO-2026-HT-022` uchun B variant.

## Tahririy navbat va reliz shartlari

1. Published Y2 ikkita eski `a/b` muvofiqligi: frontend/API kontrakti bilan real E2E, kerak bo‘lsa toza UUIDli yangi reviziya + eskisini xavfsiz arxivlash, attempt tarixini saqlash.
2. Original 300dan qisqa izohli 229 / qisqa stemli 117 savollarni manba sahifasi bilan ketma-ket mutaxassis ko‘rigi; faqat strukturaviy risk signaliga qarab ko‘r-ko‘rona archive qilmang.
3. Arxivlangan V2 bilan review revisiyalarni qat’iy dedupe; review nusxalarni qaerdan kelgani aniq. 80 kengaytirilgan savol ham mustaqil semantik ko‘rikdan o‘tsin.
4. Demo uslubida yetishmayotgan **HTML render preview** va **jadval/HTML screenshot variantli** savollar uchun original SVG/render kartochkalar qo‘shilsin.
5. 30 nomzodni darslikning **aniq** beti, javob, Y2 va Y3 yagona mapping, ikki chalg‘ituvchi sabab, test-render va mobil E2E bo‘yicha inson tasdiqlagachgina review bankka import qilish mumkin.
6. 50 savollik rasmiy mock blueprint (27–31 mazmuni) nisbatini o‘zgartirmang; 30 yangi topshiriq **mashq** bankiga tegishli.

### Hozir bajarilmagan ishlar (yopiq deb ko‘rsatilmaydi)

- 444 jonli testni qo‘lda individual, chuqur mazmuniy yechib chiqish va har bir aniq sahifa ko‘rsatish.
- 30 nomzodni mustaqil inson tomonidan tasdiqlash va platforma `review` bazasiga import.
- O‘quvchilar uchun yangi vizual A–D HTML rendering rasmlari va real authenticated E2E.
- Y2 2 ta legacy anomalni UI’da tasdiqlash; eski production kontentga bevosita tahrir qilish taqiqlangan.

**GitHub branch:** `task/TASK-291-gv-attestation-question-audit`. Production savollar, user attempt tarixi va loyiha qoidalariga mutatsiya kiritilmadi.

# TASK-244 — M01 savollar manbasi inventari va Y2 moslashtirish quality gate

**Sana:** 2026-10-19  
**Ishchi branch:** `task/TASK-244-y2-matching-quality`  
**Holat:** IN_PROGRESS — faqat texnik/statik QA, ekspert manba tekshiruvi va release alohida.

## Tekshirilgan kirish manbalari

- Google Drive `Attestatsiya/darsliklar`: 30 nomdagi PDF, jumladan 5–11-sinf ICT/Cambridge+ darsliklari, rasmiy Informatika spetsifikatsiyasi va demo/real testlar. Bu inventar fayllarni hali **har bir savol bilan satrma-satr solishtirish** natijasi emas.
- Google Drive `Attestatsiya/Source files`: 6 obyekt, shu jumladan I qismning qayta ishlangan LaTeX/PDF matni, 56 qatorli qamrov reyestri va qoralamalar.
- Gitdagi `Axborot_va_axborot_jarayonlari_LaTeX/Axborot_va_raqamli_savodxonlik_400_TEST.json`: jami 400 savol, 5 bob.
- Gitdagi `src/data/topics/m01.ts`: ushbu 400 savol quyidagi *mavjud* mavzularga allaqachon biriktirilgan:

| Manbadagi bob | Platformadagi mavzu | Savollar | ID-moslik |
|---|---|---:|---|
| 1 | `M01.02` | 60 | 60/60 |
| 2 | `M01.03` | 60 | 60/60 |
| 3 | `M01.04` | 70 | 70/70 |
| 4 | `M01.05` | 100 | 100/100 |
| 5 | `M01.06` | 110 | 110/110 |
| **Jami** | | **400** | **400/400** |

**Statik invariant natijasi:** 400/400 unique ID, 400/400 unique matn, 400/400 to‘rtta to‘ldirilgan va savol ichida takrorlanmagan variant, to‘g‘ri indeks/harf mosligi, mavjud izoh va umumiy source maydoni. `M01.02`–`M01.06`da savol IDlarining tartibi manba banki bilan 1:1 mos.

**Chegara:** 400 savoldagi `source` qiymatlari atigi beshta **bob-darajasidagi** manba satridan iborat; darslikning aniq PDF sahifasiga asoslangan har bir savol uchun individual dalil hali tasdiqlanmadi. Avtomatik invariantdan o'tishi **javob semantik jihatdan to‘g‘ri**, `source locator` yetarli yoki **Drive'dagi barcha boshqa testlar kiritilgan** degani emas.

Bundan tashqari, `docs/AXBOROT_BANK_IMPORT_AUDIT.md` bo‘yicha **alohida xususiy** 570 savollik AXB banki productionda avvaldan reconcile qilingan: 540 published, 30 spetsifikatsiya noaniqligi sabab review. 400 ta statik ARS savolni bu 570 ta xususiy AXB savol bilan bitta bank deb talqin qilish va avtomatik qayta import qilish mumkin emas. 2026-10-18 sanali TASK-240 hisobotida 5 966 aktiv savolning strukturaviy QA va ekspert release qarzlari alohida yuritilgan.

## Ushbu branchdagi tuzatishlar

1. Y2 pairing tanlovini bo‘sh, takrorlangan, eski/ortiqcha left ID yoki mavjud bo‘lmagan right ID holatida **yakunlangan** deb qabul qilmaslik.
2. `TopicView` ichidagi legacy Y2 pairing interfeýsida bir o‘ng variantni takroran tanlashga yo‘l qo‘ymaslik; klaviatura/o‘qish vositalari uchun aniq nomli select.
3. Haqiqiy server-authoritative imtihonning `src/features/exam/contracts.ts` `isAnswerComplete` funksiyasida stale/extra mappingni rad etish.
4. Yuqoridagi cheklovlar uchun Y2 birlik testlari va 400 ta M01 manba IDlarini tegishli mavzuda saqlash regressiyasi.

`TopicView`ning eski `phase='test'` render bo‘limi hozirgi rasmiy testni boshlash yo‘li emas: zamonaviy flow `/exam/mavzu/...` orqali `src/features/exam/ExamRunner.tsx`ga o‘tadi. Shu sabab real flow himoyasi alohida `contracts.ts`ga ham qo‘shildi.

## Testologik ko‘rsatkichlar — ekspert ko‘rigi uchun signal

400 itemlik mavjud ARS bankida quyidagi heuristikalar hisoblandi:

| Tekshiruv | Natija | Talqin |
|---|---:|---|
| Aynan bir xil normalizatsiyalangan savol matnlari | 0 | Exact stem duplicate aniqlanmadi; semantik duplicate alohida tekshiriladi |
| Aynan bir xil **variantlar to‘plami** ishlatilgan juftlar | 69 juft / 138 savol | Bu avtomatik xato emas, lekin mavzu ichidagi test xilma-xilligini predmet/testolog eksperti ko‘rishi kerak |
| To‘g‘ri javob **yagona eng uzun** variant | 86/400 | Variant uzunligidan javobni topish xavfi bo‘yicha ko‘rish uchun signal |
| To‘g‘ri javob **yagona eng qisqa** variant | 73/400 | Bir qarashda xato emas; masala keng kontekstda baholanadi |
| Bir xil «eng aniq ta’rifini toping» andozasi | 58 savol | Kognitiv va dizayn xilma-xilligini oshirish uchun takrorlanuvchi konstruktsiya |
| To‘g‘ri javob A/B/C/D indekslari | 100/100/100/100 | Pozitsiyalar teng taqsimlangan, lekin learner real imtihonda variantlar shuffle qilinadi |

Bu raqamlar javob kaliti yoki pedagogik xato **hukmi emas**. 69 juft variantlar to‘plamidan maqsadli ishlatilganlari saqlanadi, lekin semantik takror va distractor kontrasti bo‘yicha tekshiruvga olinadi. Published savollar avtomatik qayta yozilmaydi.

## Keyingi sifat nazorati va release cheklovi

- Barcha Drive testlarini alohida inventarizatsiya qilib external ID, manba/sahifa, rasm/kod/jadval, daraja, rasmiy construct, dars mavzusi, javob va tushuntirish bilan 1:1 reyestr yaratish.
- Existing questionlar bilan semantik dublikatlarni ajratish; faqat yetishmaydigan yoki tuzatishga muhtoj savollarni `review` statusida tayyorlash.
- Javob va distractorlarni darslik sahifasi hamda rasmiy attestatsiya talabi bilan predmet eksperti tasdiqlamaguncha publish qilmaslik.
- `S3.ALGO.03`, `S4.CODE.04`, `S6.NET.02`, `S6.NET.04` published coverage bo‘shliqlarini alohida review rejasiga kiritish.
- GitHub CI `lint`/`typecheck`/`unit`/`build`/`E2E` va DB kontraktini tekshirish. Ular o‘tmaguncha task `DONE` emas.
- **Hech qanday merge, Vercel deploy, production DB write, migratsiya yoki ekspert tasdig‘isiz publish yo‘q.**

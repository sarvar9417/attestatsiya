# TASK-426 — Informatika PDF: HTML browser QA va mantiq testlarini tahririy tiklash

**Holat:** private/editorial review, nashr emas. **Sana:** 2026-10-21.  
**Manbalar:** 
- [Html savollar2.pdf](https://drive.google.com/file/d/18wdWXfRiBWRJsoa9T49E7Q4e-LVOGSfd/view) — 9 sahifa, №1–21.
- [Mantiq 2-dars.pdf](https://drive.google.com/file/d/1yuU9acP2-wHX68H1q5yH0f_O1_GDaWoa/view) — №2,3,4,8,9,13,14 qayta tahrir.

## 1. Asl PDFga moslik

`Html savollar2.pdf` bo‘yicha Supabase `attest_ingest.telegram_informatika_pdf_question_candidates`da **21 ta alohida savol**, 21/21 manba sahifa, 21/21 `source_visually_checked` mavjud; ishlab chiqilgan 21 ta tushuntirish `attest_ingest.telegram_informatika_pdf_free_response_qa`da `needs_editorial_review`, `human_approved=false`, `publish_ready=false` sifatida saqlangan.

Sahifa mappingi asl PDF bilan to‘g‘ri mos: №1–4: 1-bet; №5–6: 2-bet; №7–8: 3-bet; №9–10: 4-bet; №11–12: 5-bet; №13–14: 6-bet; №15–16: 7-bet; №17–18: 8-bet; №19–21: 9-bet. Yangi sahifa yozilishi talab etilmadi.

Avval №4,6,8,10,12,14,16,18 uchun blocker izohida «boshqa savollar birlashtirilgan» degan **eskirgan** tavsif saqlangan edi. Bu 8 ta izoh asl kod qayta ajratilganidan so‘ng dolzarb qolgan muammoga almashtirildi:
- №4,6,8,10,12: manbada Y1/A–D tanlovlari mavjud emas.
- №14: asl `type=”square”` va ichki `<ul type>` sintaksisi buzilgan; `invalid_source_formula` alohida blok saqlangan.
- №16 va №18: faqat HTML fragment, baholanadigan aniq savol yo‘q.
- Asl extract, original savol raqamlari va tarixiy kalitlar **o‘zgarmadi**.

## 2. Haqiqiy Chromium renderi

Asl HTML kodlari, shu jumladan **xatoli** CSS/HTML, tuzatilmasdan Chromium headless browserda tekshirildi. Tezkor nazorat natijalari:

| № | Chromium ko‘rsatgan holat |
|---|---|
| 1 | `font-\nsize` CSS noto‘g‘ri: H1 **32px**, ko‘k, markazda; `html.jpeg` tashqi resurs manbada yo‘q |
| 2 | H1 qizil, o‘ngda, 16px; `info.png` taqdim qilinmagan; tipografik `style` ishlamaydi |
| 3 | CSS xatoli: paragraf odatiy 16px qora, Garamond/18pt/darkblue qo‘llanmaydi |
| 4 | `<del>` matni ustidan chizadi, `<h6>` paragrafni ajratadi |
| 5 | `<b>` qalin, `<em>` kursiv, `<small>` kichik matn |
| 6 | `<ul type=circle>` 4 bo‘sh doira marker |
| 7 | `<ul type=square>` 4 kvadrat marker |
| 8 | `<ol type=A>` A/B/C/D marker |
| 9 | `<ul type=disc>` 4 to‘liq dumaloq marker |
| 10 | `<ul type=circle>` 4 bo‘sh doira marker |
| 11 | `<ol start=3 type=A>` C/D/E/F marker |
| 12 | `<ol start=4 type=i>` iv/v/vi/vii marker |
| 13 | `<ol start=1 type=a>` a/b/c/d marker |
| 14 | Buzilgan `type=”square”` amalda tashqi **disc**, ichki **circle** marker beradi |
| 15 | Ichma-ich UL: tashqi disc, ichki circle |
| 16 | Ichma-ich OL: tashqi 1/2/3, ichki 1/2/3 |
| 17 | Tashqi a/b, ichki 1/2/3 |
| 18 | Tashqi 3/4/5, ichki 5/6/7 |
| 19 | Markazdagi `About Germany` linki **ko‘k**; ota p darkblue bo‘lsa ham |
| 20 | O‘ngdagi `Warning` linki **ko‘k**; ota p red bo‘lsa ham |
| 21 | `My City` linki aniq inline `color:green` sabab **yashil** |

Rasm tashqi resurslarining (№1–2) o‘zi PDF ichida yo‘q. Ularning real mavjud bo‘lgan saytdagi tasvirini taxmin qilib kalit qo‘yilmaydi. Brauzer ko‘rgan `naturalWidth=0` bu faqat mustaqil test muhitida tashqi fayl yo‘qligini ko‘rsatadi.

## 3. Mantiq 2-dars: 7 ta nashrga yaroqli tahrir taklifi (hali RELEASE EMAS)

Quyidagi variantlar **asl PDF matni emas**, yechimni yagona qiluvchi yangi tahrir draftlari. Ular `attest_ingest.telegram_informatika_pdf_release_blockers.evidence_uz` maydonida, asl nuqson dalilidan keyin `YANGI TAHRIR TAKLIFI` sifatida qayd etildi. Mustaqil izohlar `telegram_informatika_pdf_free_response_qa`ga qo‘shildi.

| Asl savol | Tuzatish usuli | Yagona to‘g‘ri tahririy javob |
|---|---|---|
| №2 | `x ∈ ℤ` cheklovi | −3 |
| №3 | «eng katta yolg‘on qiymat» → «yolg‘on to‘plam» | `x ≥ 7` |
| №4 | `x ∈ ℤ` cheklovi | 1 |
| №8 | `x ∈ ℤ` cheklovi | 16 |
| №9 | «eng katta» → «yolg‘on to‘plam» | `x ≤ 1 yoki x ≥ 9` |
| №13 | «eng kichik» → «yolg‘on to‘plam» | `x < −2 yoki x > 5` |
| №14 | «eng katta» → «rost to‘plam» | `x < 0 yoki x ≥ 20` |

Manbadagi xatolar manba/provenance uchun saqlangan, nashr blockerlar bekor qilinmagan. 4 variantli takliflar sonni tanlash yoki interval chegara operatorlarini chalg‘ituvchi sifatida ishlatadi. Originaldan mustaqil tahririy yangilanishlarni keyinchalik immutable version bilan nashr qilish kerak.

## 4. Avtomatik regressiya

`scripts/task426-pdf-logic.test.mjs` — 7 original predikat, har bir tuzatilgan yagona javob, interval chekkalari va `-100..100` (butun/yarim qadam) qiymatlari bilan tekshiradi. `.github/workflows/task426-pdf-source-qa.yml` PR triggerida `node --test` ishga tushiradi. HTML natijalari avval haqiqiy local Chromium bilan qayta hisoblandi; GitHub workflowdagi Node testi **Chromium'ni ishga tushirmaydi**, buni brower parity gate PASS deb da’vo qilish mumkin emas.

## 5. Release himoyasi

- Original imported PDF candidate `answer_key` o‘zgartirilmagan.
- 21 HTML va 7 mantiq taklifining `human_approved=false` hamda `publish_ready=false` holati saqlangan.
- Y1 uchun tushuntirish bilan birga haqiqiy 4 ta mustaqil variant, kalit, semantic distractor sifati va original graphic mapping tekshiruvi talab.
- AI yozgan mazmun mustaqil inson eksperti ko‘rib chiqqan deb ko‘rsatilmasin.
- Bu task production ma’lumotlariga, e’lon qilingan immutable revisionlarga, scoring yoki exam tarixiga tegmaydi.
- GitHub PR dokumentatsiya va QA testlarini nashr qilishi mumkin, **Vercel deploy va learner bank publish** bu task scope’iga kirmaydi.

# TASK-305 — M13 attestatsiya uslubiga moslash va kontent sifat nazorati
**Sana:** 2026-10-20. **Holat:** SOURCE_BENCHMARK + MACHINE_QA + NEW_REVIEW_CANDIDATES. **Production ma'lumotlari o'zgarmaydi.**

## 1. Manba ishonchlilik darajalari va tekshirilgan o'rinlar

| Source | Locator | Kuzatilgan uslub | Ishonchlilik |
|---|---|---|---|
| `Informatika Testlar spesifikatsiyasi.pdf` | fizik 6-bet, 7-mazmun sohasi (34–35) | Axborot tahdidlari, phishing/malware, antivirus, elektron hukumat, SMM/CMS/LMS/MOOC, kontent/auditoriya, freelance | **Rasmiy spetsifikatsiya**: mavzu qamroviga dalil; ayni test savollariga emas |
| `Demo 2026 test 10 000 so`mlik.pdf` | fizik 18-bet, 33-savol | LMS va ijtimoiy platformalar: 4 band, 5 javob, kombinatsiyali Y1 tanlov | **Tijoriy demo**: imtihon uslubi namunasi, rasmiy savol deb bo'lmaydi |
| Shu PDF | fizik 18-bet, 34-savol | Hosting atamasini unga yaqin `plagin/forum/domen` bilan solishtirish | Tijoriy demo |
| `13.04.2026 Attetasiya Tushgan savollar.pdf` | fizik 21-bet | Virus faoliyatidagi tushirib qoldirilgan bosqichni topish | **Foydalanuvchi taqdim etgan "tushgan" to'plam**: rasmiy autentiqlik tasdiqlanmagan |
| Shu PDF | fizik 27-bet | CMS sayt turlari va tizimlar: 6 band + 6 nom, kombinatsion Y1 format | Xuddi shu cheklov |
| Shu PDF | fizik 28-bet | Ijtimoiy tarmoq haqidagi 4 mulohazaning rost/yolg'onligini taqqoslash | Xuddi shu cheklov |
| `Informatika Demo testi .pdf` | 27 sahifa kontakt-varaq va fizik 18-bet | Informatika fanining turli bo'limlari, grafik/kod/algoritm va vaziyat savollari | Uchinchi tomon demo; 34–35 savollar M13 emas, raqamga tayangan holda ko'chirib bo'lmaydi |
| Drive `Informatika Kuzgi demo testlari.docx` | Google Drive ID `13VVttASqpDVP4R1fsVtt3YARHs4uHnB8` | Oldingi M13ga bog'langan `q07` va `q10` DB provenance mavjud | Google Drive fetch matni qaytmadi; maqbul manba bilan birma-bir verifikatsiya OPEN |
| Drive `2025 kuzgi demo @Informatika_fani_ustozlari.pdf` | Google Drive ID `11fCXWHUJ3j7IHz619Ja84wqbcRaraept` | Tahlilga mo'ljallangan | Google Drive fetch matni qaytmadi; betlar alohida tekshirilishi OPEN |

**Eslatma:** Testdagi ko'rsatilgan belgilangan variantlar muallifning tanlovi bo'lishi mumkin. Ularni ekspert tekshirilgan answer key deb qabul qilmang. Tarixiy savol bankda nashrga tayyorligiga avtomatik dalil emas.

## 2. Production bazaning 2026-10-20 holati
- Published: **414** (`Y1=271`, `Y2=71`, `Y3=72`); `review=1` Y1; `archived=15` Y1. Avvalgi 410 ta raqam eskirgan.
- Doimiy AXR-210 bank: 210 published Y1 (manba 196 MCQ va 14 kombinatsion qog'oz moslashtirish/tartiblash nomi bilan belgilangan bo'lsa ham, **real platforma formatida Y1**).
- Native AXR-140 bank: 70 Y2, 70 Y3 published.
- 2026-10-20 read-only SQL inventory: barcha 414 published S7.SEC savolda javob kaliti bor; 0 ta option-count mismatch yoki manbasiz savol aniqlandi; faqat option uzunlik mezoni Y1da 24 ta flag chiqardi.
- 210 bankdagi `Y1` ni aslda Y2/Y3 deb noto'g'ri reklama qilish mumkin emas.

## 3. 350 ta yangi AXR savoli bo'yicha avtomatik QA (Git manba JSON)

| Tekshiruv | Natija | Talqin |
|---|---:|---|
| AXR original bank Y1 (native import) | 210 | Dastlabki 196 MCQ + 14 paper-combination Y1 |
| Native Y2 | 70 | Har bobda 10; 4×4, chalg'ituvchi ortiqcha o'ng variant **yo'q** |
| Native Y3 | 70 | Har bobda 10; 4 bosqichli, pedagogik noyob tartib ekspert tekshirishi kerak |
| 196 original Y1 variantlarida ikki yoki undan ortiq juda oson chalg'ituvchi ibora (`faqat/hech qachon/har doim/barcha/tasodifiy/albatta`) | **49** | **P1** wording-review flag, xatolik hukmi emas |
| 196 original Y1 savolida to'g'ri variant qolganlarga nisbatan uzunligi bilan ajralib turishi | **24** | **P1**, javobni taxmin qilish signali |
| Aniq normalizatsiya qilingan stem duplicate (350 ta source) | **0** | Shu mezonda; ma'no jihatidan yaqin savollarni avtomatik chiqarib tashlamaydi |
| 196 original Y1 javob indekslari | 48/48/50/50 | Pozitsion balans yetarli; distraktor sifati yetarli degani emas |
| Source JSON `kind='Y2/Y3'` (14 ta) va platformadagi real `format='Y1'` | **14** | Format metadata chalkashligi; faqat native deb ko'rsatish mumkin emas |
| Original 350 bankning so'z indikatorida `vaziyat/quyidagi/holatda` | **7** | Juda konservativ matn filtri; case savollarini to'liq qamramaydi |

**E'tibor:** Heuristic flag dalil emas. Har bir P1/P0 savolning ilmiy, didaktik, axloqiy va manba kontekstidagi bahosi alohida tahririyat reestriga kiritiladi.

## 4. Qat'iy sifat mezonlari (kompakt rubrika)

Har savolga: `BASIS` (manba sahifasi + topic), `ACCURACY` (bir to'g'ri yechim), `ASSESSMENT` (mantiqiy mahorat), `DISTRACTORS` (uchga yaqin dalilli alternativ), `LANGUAGE` (aniqlik), `KEY` (private server scorer), `UNIQUENESS` (shablon/dublikat) va `REVISION` (immutability) yoziladi.

- **P0 / bloklovchi:** 2 ta mantiqan to'g'ri variant, factually incorrect key, noto'g'ri matching/ordering, oshkor bo'lgan kalit, tasdiqlanmagan mualliflik yoki chala rasm/jadval; testni darhol ko'rib chiqish va versiyali tuzatish.
- **P1 / majburiy tahrir:** juda oson distractor, uzunlik/so'z signali, noaniq shart, mantiqan ikkita amal bir-birining o'rnini bosa oladigan Y3, Y2 4×4 juda oson.
- **P2 / stilistik:** imlo, uzunlik, ortiqcha instruktsiya.
- **PASS:** ilmiy asos + sifatli chalg'ituvchi + bitta asosli kalit + aniq izoh + test generatorida ishlash.

## 5. Tahrir uchun aniqlangan boshlang'ich prioritetlar

1. `AXR-01-001`: `Faqat kompyuter tezligini oshirish`, `Faqat yangi kompyuter sotib olish` singari javoblar oson rad etiladi. Xavfsizlikning maxfiylik/yaxlitlik/mavjudlik konseptlarini bir-biriga yaqin distractor sifatida ishlatish kerak.
2. `AXR-01-014`, `AXR-01-016`, `AXR-02-005`, `AXR-02-019`, `AXR-02-024`, `AXR-02-029`, `AXR-04-001`, `AXR-04-014`: to'g'ri variantning uzunligi sezilarli signal berishi mumkin. Har birini ma'no va hajmni muvozanatlashtirib **yangi revision** bilan almashtirish.
3. `m13-axr-native-v1:Y2:...`: 70 ta Y2 uchun 4×4 bir-biriga mos tushish (process of elimination) xavfi. Manbadagi 4×5 yoki 6×6 kombinatsiya uslubidan **to'g'ridan-to'g'ri nusxa olmasdan** qiyinroq 4×5 variantli native yangi bank qurish.
4. Native Y3: to'rtta umumiy tavsiya bir nechta to'g'ri amaliy tartibga ega bo'lishi mumkin. Topshiriq matnida oldingi amal keyingisini *majburiy* belgilasin; aks holda Y3ga emas, situational Y1ga o'tkazilsin.
5. `drive:1hGQibtomuvzXZZnuAY4OulteH67nRtEn:q27` CMS: DBda **review**, unda WordPress/Drupal kabi vositalar bir necha sayt turiga mos kelishi mumkin. Oldingi to'plamdagi bir kalitni mustaqil tekshirmasdan publish qilish mumkin emas.
6. Source trace: PDF savollarining sahifasi, nashri, muallifi va ruxsat ma'lumotini aniq ajratish; pullik demo/historic usersourced material official savol deb atalmasin.

## 6. Remediation yo'li

- **Wave A (ushbu PR):** source benchmark va qayta ishlatiladigan avtomatik auditor, 7 bobga bo'lingan 21 ta *review-only* imtihon uslubidagi original nomzod (7 Y1 rost/yolg'on mulohaza, 7 Y2 4×5, 7 Y3 dependent-order) va SQL regression. Mavjud published snapshot/kalitga tahrir yo'q.
- **Wave B:** 414 nashrdagi savollarning har biri bo'yicha manba sahifasi, yechim va mazmuniy verdict bilan muharrirlik; P0/P1 savollarga replacement revision + `published` eski itemni arxivga o'tkazish faqat qat'iy tasdiqdan keyin.
- **Wave C:** server scoring va learner topic-test mobil E2E; yuridik/source trace va exam-style coverage; yakuniy production publication.
- **Release gate:** foydalanuvchining tekshiruvni boshlashga tasdig'i `review` bankni ekspert tasdiqsiz avtomatik nashr qilish huquqiga teng emas. Oldingi `TASK-212` owner override faqat avvalgi aniq AXR bankiga cheklangan.

**Database snapshot audit:** `2026-10-20`; real-time bazada parallel tasklar yozayotgan bo'lsa sonlar yangilanishi mumkin.

## 7. Live 414-item native key contract inspection — P0 technical defect
Read-only Supabase SQL validates **all 414 published** M13 rows:
- `missing_or_multiple_key=0`;
- `bad_y1_contract=0`;
- `bad_y3_contract=0`;
- `missing_m13_construct_mapping=0`;
- **`bad_y2_contract=1`**: source `formatbank-2026:T063-Y2-022` has **8 left (`side=a`) options and 0 right (`side=b`) options** despite a 4-pair key. The legacy migration populated `order_idx=1..8` but did not assign the option side correctly.
- The four private key pairs are internally consistent with option slots 1..4 and 5..8. No answer text/key meaning needs changing.
- Proposed `20261020090000_task305_legacy_m13_y2_side_revision.sql`: derive a new question revision from private DB rows, copy original stem/options, relink pair UUIDs *inside the database*, publish structurally correct new revision, and archive the previous ID. No hardcoded answer keys are published in Git.
- Regression `supabase/tests/task305_m13_y2_revision_contract.test.sql` checks 4+4 sides, original option text and pair semantic fidelity, exactly one published version, and no other malformed published Y2. Existing historical TASK-063 test now counts the **logical** 24th published item via its corrected revision.
- **Status:** pending green CI, PR merge, controlled production migration; do not assert the defect is fixed until post-apply SQL audit returns zero.

## 8. Other production balancing facts
Official active S7.SEC constructs and published counts: `S7.SEC.01=93`, `.02=59`, `.03=52`, `.04=53`, `.05=106`, `.06=51`. `.01` includes **39 reuse-source questions from the M01 professional bank**, so a large number of easy definitions concentrate in security fundamentals. The new 350 AXR questions are deliberately 7×50, but the combined old+new blueprint is uneven.

## 9. Key confidentiality finding and mitigation scope
`sarvar9417/attestatsiya` is **public**, while earlier `docs/content/m13_axr_2026_questions.json` contains an `answer` value for paper MCQs and `docs/content/M13_AXR_native_Y2_Y3_140.json` contains unshuffled matching/ordering sequences. Public SQL migrations contain historic question material/key construction. Hiding answer keys in the API does not remove Git-source disclosure. Removing source files from HEAD alone does not remove prior Git history. **Critical:** follow a separately approved remediation plan using private/editor-only content storage and genuinely new revisioned questions. This PR only adds **keyless** new candidate descriptions and a CI guard, no new plaintext keys in HEAD.

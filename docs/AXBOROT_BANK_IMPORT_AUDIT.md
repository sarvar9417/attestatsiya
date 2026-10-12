# Axborot banki — specification mapping va private import auditi

Sana: 2026-10-12

## Maqsad

Oldingi Attestatsiya ishida tayyorlangan 19 bob × 30 = 570 savollik xususiy
`axborot_question_bank.json` bankini public Git tarixiga joylamasdan, 2026-yil
Informatika attestatsiya spetsifikatsiyasidagi baholash konstruktlariga qayta
mapping qilib production Supabase'ga xavfsiz staging qilish.

## Rasmiy kontrakt

- 50 savol, 120 daqiqa.
- 35 mutaxassislik + 5 kasb standarti + 10 pedagogik mahorat.
- Y1, Y2, Y3 yopiq formatlari.
- Global kognitiv taqsimot: 8 bilish + 35 qo‘llash + 7 mulohaza.
- A1 `S1.INFO`: 1–3-savollar, jami 3 ta.
- A1 doirasida “axborotni saralash va xulosa chiqarish” alohida baholanadi.

## Taxonomy reconciliation

Repo va production katalogida rasmiy “axborotni saralash va xulosa chiqarish”
bandi alohida konstrukt sifatida yo‘q edi. `S1.INFO.07` esa raqamli axloq va
mualliflik huquqiga bag‘ishlangan.

Shuning uchun yangi active konstrukt qo‘shildi:

- `S1.INFO.08 — Axborotni saralash va xulosa chiqarish`

U mavjud source-backed M01 darsiga bog‘landi. Blueprint guruh kvotasi
o‘zgarmaydi: `S1.INFO` baribir rasmiy 3 savolni beradi. Faqat ichki
konstrukt katalogi 76 dan 77 taga to‘g‘rilanadi.

## Private bank avtomatik auditi

- Manba savollar: 570.
- External ID: 570/570 unique.
- Har savolda: 4 ta variant.
- Variantlar bir savol ichida unique.
- `answer_index` barcha savollarda 0..3 oralig‘ida.
- Javob harfi va indeks mosligi: 570/570.
- Majburiy stem/explanation/source/concept/level/type maydonlari mavjud.

Bu tekshiruv semantik javob to‘g‘riligini manba PDF bilan avtomatik isbotlamaydi;
shu sabab bank to‘g‘ridan-to‘g‘ri `published` qilinmadi.

## Mapping natijasi

- Specification constructiga ishonchli mapping: **494**.
- Mapping qilinmagan / quarantine: **76**.
- Import holati: **494/494 `review`**.
- Published: **0**.
- Source lesson bilan: **488**.
- Source lesson hali yo‘q: **6** (`S2.HW.04` — 3, `S3.NUM.02` — 3).

Kognitiv staging:

- bilish: 298
- qo‘llash: 118
- mulohaza: 78

Bu bankning o‘zi rasmiy 8/35/7 nisbatni ifodalamaydi. Rasmiy mock assembler
faqat blueprint kvotalari va published pool orqali 8/35/7 kontraktni saqlashi
kerak. Shu sabab review bank ommaviy publish qilinmaydi.

## Quarantine — 76 savol

Asosiy sabab: savol mazmuni foydali bo‘lsa-da, amaldagi 2026 baholanadigan
konstrukt matniga bir qiymatli mapping berib bo‘lmaydi.

Boblar kesimi:

- 16-bob — Validatsiya/verifikatsiya/xatolarni aniqlash: 27
- 3-bob — Axborot jarayonlarining umumiy tushunchalari: 15
- 1-bob — insoniy ta’minot/obyekt/xabar/signal: 12
- 2-bob — aniqlik/ishonchlilik/to‘liqlik xossalari: 9
- 4-bob — umumiy axborot texnologiyasi/raqamli jamiyat tushunchalari: 9
- 19-bob — validatsiya/verifikatsiya farqi: 3
- 6-bob — two’s-complement diapazoni: 1

Quarantine savollariga sun’iy construct berilmadi.

## Production import invariantlari

Private bank public repoga commit qilinmadi. Import mavjud admin-only
`import_question_bank_batch` RPC orqali bajarildi. Har import:

- `source_reference = m01-professional-bank:<external_id>`
- Y1 format
- 4 variant
- answer key
- audit log
- `review` status

bilan saqlandi. Idempotency `source_reference` orqali ta’minlanadi.

## Keyingi quality gate

1. 6 ta source-lesson bo‘shligini yopish.
2. 494 review savolni source locator va javob bo‘yicha source-verificationdan
   bosqichma-bosqich o‘tkazish.
3. Dublikat/semantik o‘xshashlik va distractor sifatini audit qilish.
4. Construct × cognitive deficit bo‘yicha kerakli qismini publish qilish.
5. Y1 bilan cheklanmay, rasmiy Y2/Y3 banklarini ham alohida yaratish.
6. Har publish batchidan keyin official 50-question feasibility auditini qayta
   ishga tushirish.

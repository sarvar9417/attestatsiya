# Axborot banki — specification mapping va private import auditi

Sana: 2026-10-12

## Maqsad

Oldingi Attestatsiya ishida tayyorlangan 19 bob × 30 = 570 savollik xususiy
`axborot_question_bank.json` bankini public Git tarixiga joylamasdan, 2026-yil
Informatika attestatsiya spetsifikatsiyasidagi baholash konstruktlariga qayta
mapping qilib production Supabase'ga xavfsiz kiritish.

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
o‘zgarmaydi: `S1.INFO` baribir rasmiy 3 savolni beradi. Ichki active
konstrukt katalogi 77 ta.

## Private bank avtomatik auditi

- Manba savollar: 570.
- External ID: 570/570 unique.
- 19 bobning har birida aniq 30 tadan savol.
- Har savolda 4 ta variant.
- Variantlar bir savol ichida unique.
- `answer_index` barcha savollarda 0..3 oralig‘ida.
- Javob harfi va indeks mosligi: 570/570.
- Majburiy stem/explanation/source/concept/level/type maydonlari mavjud.

2026-10-12 kuni biriktirilgan o‘qituvchi PDF nusxasi ham mustaqil tekshirildi:
`AXB-01-001` dan `AXB-19-030` gacha 570 ta unique ID va 19 × 30 taqsimot
tasdiqlandi.

## Production reconciliation — joriy holat

Private bank qayta import qilinmaydi. Production reconciliation natijasi:

- **570/570** AXB savol productionda.
- **540** savol `published`.
- **30** savol `review` quarantine.
- Published AXB savollar active construct, answer key, 4 option va
  source-lesson/construct mosligi bo‘yicha tekshirilgan.
- 30 quarantine savol official mock pooliga kirmaydi.

Quarantine siyosati:

- 21 ta validation/verifikatsiya/data-entry savoli source-backed bo‘lsa ham
  2026 spetsifikatsiyada alohida baholanadigan band sifatida aniq berilmagan;
- 9 ta parity/checksum/CRC savoli tarmoq prinsiplariga yaqin, ammo 2026 scope’da
  nomma-nom ko‘rsatilmagan.

Shuning uchun ularga sun’iy construct berib publish qilish taqiqlanadi.

## Multi-format va blueprint holati

AXB bankning o‘zi Y1 formatda. Spetsifikatsiya Y1/Y2/Y3 formatlarini talab
qilgani sabab alohida source-backed multi-format bank kengaytirilgan:

- production published Y2: 31;
- production published Y3: 39.

Official 50-savollik assembler production eligibility qoidalari bilan
50/50 unique savol, 15/15 quota group va exact group × cognitive deficit = 0
holatiga keltirilgan. Release reserve ham required group × cognitive kataklarida
kamida 20 candidate talabini qanoatlantiradi.

## Import va xavfsizlik invariantlari

Private AXB savol matni va answer key public Git tarixiga kiritilmaydi.
Import/reconcile faqat authenticated admin backend va service-role boundary
orqali bajariladi.

Private bank identifikatsiyasi:

- `source_reference = m01-professional-bank:<external_id>`
- Y1
- 4 option
- answer key
- audit log
- idempotency: `source_reference`

Bir xil private bankni qayta import qilib duplicate yaratish taqiqlanadi.

## Keyingi quality gate

1. 540 published AXB savollarni bosqichma-bosqich semantik source-verification
   bilan qayta audit qilish.
2. Dublikat/semantik o‘xshashlik va distractor sifatini periodik tekshirish.
3. 30 quarantine savolni faqat spetsifikatsiya yoki rasmiy manba aniq asos
   bergandagina qayta ko‘rib chiqish.
4. Har yangi savol banki uchun construct + cognitive + source + format mapping
   publishdan oldin majburiy bo‘lishi.
5. Har publish batchidan keyin official 50-question feasibility va release
   reserve auditini qayta ishga tushirish.
6. Barcha keyingi bo‘limlarda `docs/QUESTION_BANK_SPEC_POLICY.md` dagi
   specification-first workflow majburiy qo‘llanadi.

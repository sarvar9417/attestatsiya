# CONTENT_AUTHORING_STANDARD.md

## 1. Maqsad

Har bir dars va savol:

- spetsifikatsiyadagi konstruktni tekshirishi;
- manbaga tayanishi;
- mustaqil fikrlashni o‘lchashi;
- javob va distractor izohiga ega bo‘lishi;
- boshqa muallif yozgan kontent bilan bir xil formatda ishlashi

kerak.

## 2. Learning objective

Har mikro-mavzuda objective:

```text
Learner + kuzatiladigan amal + kontent + shart/kontekst.
```

Yaxshi:

> Berilgan IP manzil va maskadan tarmoq manzilini hisoblay oladi.

Yomon:

> IP manzilni tushunadi.

Objective kodlari mikro-mavzu ostida ketma-ket:

`M12.05.LO01`, `M12.05.LO02`.

## 3. Dars formati

Har lesson revision quyidagi bloklardan tuziladi:

1. Maqsad — 1–3 objective.
2. Oldingi bilim — zarur prerequisite.
3. Qisqa tushuntirish.
4. Atama yoki qoida.
5. Tushuntirilgan misol.
6. “Ko‘p uchraydigan xato”.
7. 3–5 savollik quick check.
8. Keyingi action.

Nazariya testga zarur mazmundan oshmasin. Katta amaliy loyiha majburiy emas.

## 4. Rich content blocklari

Ruxsat etilgan blocklar:

- `paragraph`
- `heading`
- `bullet_list`
- `ordered_list`
- `callout`
- `formula`
- `code`
- `table`
- `image`
- `worked_example`
- `common_error`

Raw HTML saqlanmaydi. Har block serverda schema validation’dan o‘tadi.

## 5. Savol umumiy standarti

Har savol revisionida:

- bitta aniq primary objective;
- kerak bo‘lsa secondary objective;
- `knowledge`, `application` yoki `reasoning`;
- 1–5 difficulty;
- Y1/Y2/Y3 type;
- taxminiy vaqt;
- source;
- to‘g‘ri javob;
- explanation;
- misconception tag

bo‘lishi shart.

Savol mustaqil tushunarli bo‘lsin yoki aniq stimulus’ga bog‘lansin.

## 6. Y1 — single choice

- 4 ta variant default; 3–5 oralig‘ida ruxsat.
- Aynan bitta to‘g‘ri javob.
- Variantlar grammatik va uzunlik jihatdan o‘xshash.
- “Barchasi to‘g‘ri” va “yuqoridagilarning hech biri” ishlatilmaydi.
- To‘g‘ri javob joylashuvi bank bo‘yicha muvozanatlangan.
- Distractor real xato tushunchadan kelib chiqadi.

Payload namunasi:

```json
{
  "type": "single_choice",
  "prompt": [{"type": "paragraph", "text": "Savol matni"}],
  "options": [
    {"id": "a", "content": [{"type": "paragraph", "text": "Variant A"}]},
    {"id": "b", "content": [{"type": "paragraph", "text": "Variant B"}]}
  ],
  "correctOptionId": "b"
}
```

## 7. Y2 — matching

- MVP’da one-to-one matching.
- 3–6 ta chap element.
- O‘ng elementlar soni chapga teng yoki ko‘pi bilan 2 ta ortiq.
- UI tartibi attempt uchun randomize qilinadi; source payload o‘zgarmaydi.
- Har chap element uchun bitta correct right.

```json
{
  "type": "matching",
  "prompt": [],
  "leftItems": [{"id": "l1", "content": []}],
  "rightItems": [{"id": "r1", "content": []}],
  "correctPairs": [{"leftId": "l1", "rightId": "r1"}]
}
```

## 8. Y3 — ordering

- 3–8 ta element.
- Yagona to‘g‘ri tartib bo‘lishi kerak.
- Bir xil ma’noli ikki qadam bo‘lmasin.
- UI’da keyboard va select-position alternativasi bo‘ladi.

```json
{
  "type": "ordering",
  "prompt": [],
  "items": [{"id": "i1", "content": []}],
  "correctOrder": ["i1", "i2", "i3"]
}
```

## 9. Kognitiv daraja

### Knowledge

Atama, vazifa, qoida yoki bevosita farqni tanish. Faqat yodlash emas, mazmunini tushunish ham mumkin.

### Application

Yangi kod, jadval, sxema, holat yoki sonli ma’lumotda bilimni qo‘llash.

### Reasoning

Bir necha dalilni taqqoslash, xato sababini topish, optimal yechimni tanlash yoki xulosa chiqarish.

Savol matnining uzunligi darajani belgilamaydi.

## 10. Kodli savollar

- Kod fence’da til aniq: `python`, `javascript`, `html`, `css`, `sql`.
- Darslikdagi versiya farqi ta’sir qilsa `technology_version` yoziladi.
- Undefined behavior yoki muhitga bog‘liq natija ishlatilmaydi.
- Syntax va indentation copy/paste testdan o‘tkaziladi.
- MVP’da kod serverda bajarilmaydi; expected answer ekspert tomonidan verifikatsiya qilinadi.

## 11. Hisoblash savollari

- Intermediate qiymatlar reviewer worksheet’da ko‘rsatiladi.
- Unit va rounding qoidasi promptda aniq.
- Variantlar tipik hisob xatolaridan tuziladi.
- Generatorli variant bo‘lsa seed va formula alohida test qilinadi.

## 12. Explanation

Minimal structure:

```json
{
  "summary": "To‘g‘ri javobning qisqa sababi.",
  "steps": ["1-qadam", "2-qadam"],
  "optionFeedback": {
    "a": "Nega noto‘g‘ri.",
    "b": "Nega to‘g‘ri."
  },
  "sourceNote": "Manba bilan bog‘lanish izohi."
}
```

Mock exam davomida explanation ko‘rsatilmaydi. Practice’da birinchi submitdan keyin ko‘rsatiladi.

## 13. Source talabi

Har lesson/question revision:

- source ID;
- PDF/page from;
- PDF/page to;
- bob/dars nomi;
- qisqa locator note

bilan bog‘lanadi.

Darslik matnini katta hajmda ko‘chirish taqiqlanadi. Kontent muallifning qayta izohi bo‘ladi.

## 14. Review checklist

Reviewer quyidagilarni alohida belgilaydi:

- [ ] objective mos;
- [ ] spetsifikatsiyaga mos;
- [ ] fakt to‘g‘ri;
- [ ] javob yagona/to‘liq;
- [ ] distractorlar asosli;
- [ ] kognitiv daraja to‘g‘ri;
- [ ] difficulty asosli;
- [ ] matn va imlo to‘g‘ri;
- [ ] source sahifa tekshirildi;
- [ ] explanation yetarli;
- [ ] duplicate yoki juda o‘xshash savol emas;
- [ ] mualliflik huquqi talabiga mos.

## 15. Import

Bulk import canonical JSON orqali amalga oshiriladi:

```json
{
  "schemaVersion": 1,
  "questions": []
}
```

Import ketma-ketligi:

1. upload;
2. schema validation;
3. reference resolution;
4. duplicate scan;
5. dry-run report;
6. admin confirm;
7. barcha itemlar `draft` sifatida yaratish.

Import hech qachon avtomatik publish qilmaydi.

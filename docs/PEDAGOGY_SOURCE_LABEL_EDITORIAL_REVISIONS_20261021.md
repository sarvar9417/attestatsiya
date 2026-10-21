# TASK — Pedagogika manba yorliqlari va mazmuniy tahrir

Sana: 2026-10-21. Holat: **review talab qiladi; published nusxalar o‘zgartirilmagan**.

## Aniqlangan real savollar

| ID | Muammo | Taklif etilgan **faqat stem** | Xavf |
|---|---|---|---|
| `1a8b48ea-7a89-4c32-a45a-5c10ea3b4968` | `Pedmahorat|Guli` manba nomi savol matniga tushgan; «qaysi to‘plam» noaniq | `Nizolar davomiyligi va kechish xususiyatiga ko‘ra quyidagi turlardan qaysilariga ajratiladi? 1) Tez yakunlanadigan. 2) Uzoq davom etadigan. 3) Sust kechadigan. 4) Kuchli va tez kechadigan.` | Tarkibiy tasnif manbadan mustaqil tekshirilishi, javob variantlari va kalit qayta ko‘rib chiqilishi kerak |
| `cca58439-2ff7-449f-adf4-8787ed079b3e` | `Pedmahorat|Guli manbasidagi` ifodasi tashqi atributsiyaga bog‘langan | `Pedagogika fani nimalarni o‘rganadi?` | Variantlardagi «Faqat» signallari bir qarashda javobni sezdirishi mumkin; to‘rt variantning ham didaktik ishonarliligi qayta yozilsin |

**Muhim:** bu stemlar productionga bevosita qo‘llash uchun emas. Variantlar, kalit, izoh, source, dars/construct, uniqueness, tarixiy attempt-link va review fingerprints qayta tekshirilmaguncha `published`ga o‘tkazmang.

## Ish tartibi

1. Original PDF (2025 bahor, 5-bet) va Telegram post 118 bilan mazmun hamda tasnifni tekshirish. Telegram yoki PDFdagi aniqlanmagan javobni taxmin bilan kiritmaslik.
2. Mustaqil tahrirlangan **review** revisiya yarating, mavjud published UUID va eski variantlari/kalitini o‘zgartirmang.
3. Variantlar to‘rtta, mazmunan ishonarli, bir-biridan farqli va bittagina asosli kalitli bo‘lishi shart. Javobni uzunlik, «faqat», «barchasi» yordamida oshkor qilmang.
4. `question_quality_findings`dagi `source_label_embedded_in_stem` ogohlantirishini originalda yopmang; yangi revisiyani ham editorial tekshiruvsiz nashr qilmang.
5. Natijalarni tekshirish: source_reference metama'lumotda qoladi, stemda yo‘q; variantlar va key bog‘lanishlari mos; yangi savol sinov attemptlarini buzmaydi.
6. `PEDAGOGY_RELEASE_FREEZE.md` shartlariga ko‘ra barcha pedagogika ishlari to‘liq tugamaguncha alohida merge/deploy yo‘q.

## SQL auditor hisoboti

`supabase/maintenance/audit_pedagogy_source_labels_readonly.sql` — zarar yetkazmaydigan, faqat o‘qish tekshiruvi. 2026-10-21 tekshiruviga ko‘ra yuqoridagi ikki published savol mos tushgan, har birida 4 noyob variant bor. Bu mazmunan to‘g‘rilik dalili emas.

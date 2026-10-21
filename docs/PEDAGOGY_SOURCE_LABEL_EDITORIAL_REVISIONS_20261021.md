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

## 2026-10-21 — Original PDF bilan tekshirilgan natija

Google Drive: `Pedagogik mahorat to'plam 2025 (6).pdf` (`1-FZJINTG7krHsG227tJ16MBAyEqq8cvP`), **5-savol**. Source snippet:

- `Pedagogik nizolarning turlarini aniqlang`;
- **5 ta** ta’rif: 1) tez yakun topuvchi; 2) uzoq muddat davom etuvchi; 3) kuchsiz, sust kechadigan; 4) kuchli, tez kechadigan; **5) kuchsiz, tez kechadigan**;
- Manbadagi javob: **1, 2, 3, 4**.

Live published savolda **5-variant butunlay tushib qolgan**, shu sabab qolgan to‘rttaning barchasini tanlashga undovchi kamchilik bor. Bu javobni fahmlashni osonlashtiradi va asl savoldagi mazmunni buzadi. Source-key tekshiruvi _asl PDFning o‘z javobi_ ekanini anglatadi, mustaqil nazariy tasdiq yoki rasmiy kalit emas.

Taklif etiladigan **review-only** variant: 

> Pedagogik nizolarning kechish muddati va jadalligiga oid ushbu to‘plamda qaysi belgilar nizo turlari sifatida keltirilgan? 1) Tez yakun topuvchi; 2) Uzoq muddat davom etuvchi; 3) Kuchsiz, sust kechadigan; 4) Kuchli, tez kechadigan; 5) Kuchsiz, tez kechadigan.

To‘g‘ri javob (faqat source-key): **1, 2, 3, 4**. Bu nashrga tayyor variant emas: tasnifning nazariy asosini mustaqil tekshirish, 5-band nega kiritilmaganini aniq izohlash va chalg‘ituvchi variantlarni qayta yaratish kerak. Original savoldagi 5-bandning mazmun jihatidan mantiqan mumkinligi alohida xavf. Agar bu farq nazariy manbadan isbotlanmasa, savolni bekor qilish yoki boshqa formatda qayta yozish to‘g‘riroq.

## 2026-10-21 — Batched production editorial staging QA

Additional read-only scans identified **52 active published** pedagogy question stems bearing Telegram hashtags, explicit PDF/source-dependent wording or Pedmahorat|Guli attribution. This includes both original questions above, newly recognized PDF/"Manbadagi" cases, and imported `#attestatsiya_2025` tags.

Production `plyqezulrfowyblsfpzy` now records **52/52 linked `review` revisions**, each with **4 nonempty distinct options** and an option UUID matching its keyed answer. **0 staged revised stems** still match the source-label detector. 52/52 says the **mechanical integrity checks pass**, not that all answer keys are pedagogically independently validated.

Source scripts:
- `supabase/maintenance/20261021_pedagogy_source_label_review_drafts.sql` — six corrected original concepts and wording with proposed rebalanced options; source PDF answer for nizo question verified in original.
- `supabase/maintenance/20261021_pedagogy_telegram_hashtag_review_drafts.sql` — clone Y1 originals with source hashtag removed and text escapes normalized. Idempotently skips already linked revisions.
- `supabase/maintenance/20261021_pedagogy_source_dependent_additional_review.sql` — eleven other source-dependent, PDF-centric prompts converted into self-contained review versions while retaining old option/key mapping.
- `supabase/maintenance/audit_pedagogy_source_labels_readonly.sql` — inventory.
- `supabase/tests/pedagogy_source_attribution_review_qa.sql` — read-only checks.

All original published question content and historical attempts remain unchanged. No editor approval, production publication, merge, or deploy was fabricated or performed. Legacy published rows can still surface outside selectors enforcing high-severity findings until a coordinated final release atomically publishes each vetted revision and archives its predecessor via the existing `publish_pedagogy_revision` RPC. The `pedagogy_published_no_source_label_chk` constraint in the proposed release-guard SQL is **NOT applied**: it needs formal migration generation, final regression checks and release coordination under `PEDAGOGY_RELEASE_FREEZE.md`.

Do **not** represent the 52 review drafts as 52 fixed learner-visible questions. Review each answer, ambiguity, plausible distractor and original content provenance before promotion; simple keyword cleanup does not verify pedagogical truth. Related informatika matches found by the same broad regex use "PDF" or "asl manba" in the *subject matter* rather than to reference an inaccessible questionnaire, so they are intentionally excluded.

## Expanded source-label sweep and concurrent publication status

A broader production audit added imported `#tushgan`, `#tushgan_test` and `Manbada …` wording to the previously identified PDF and Pedmahorat|Guli patterns. The one legitimate topic use of `manbadan` (independently comparing two information sources) is intentionally **not flagged**.

The batch SQL was re-run idempotently to cover newly inserted imported questions. The production validation at audit time confirms:

- The user's exact old conflict question `1a8b48ea-7a89-4c32-a45a-5c10ea3b4968`: **archived**, corrected version `64eb4143-f505-42a3-a4da-d16eddce40ff`: **published**.
- Old pedagogy-definition source `cca58439-2ff7-449f-adf4-8787ed079b3e`: **archived**, corrected version `2e4ee93a-7781-482f-aa07-52cc8f8c2d38`: **published**.
- For the expanded detector, at the last postflight **70 active originals remain published** with **70 clean review revisions**, each linked and with a valid key-to-option reference. No matching pending revised stem carries a source label; **zero** of these 70 revisions had completed editorial checklist records.
- An additional **34** earlier source-labeled originals have been archived with a published replacement, alongside **4 archived-to-archived** lineages and **3 archived with no current linked revision**; some database states changed concurrently during the audit. This addendum reports observed remote state, **not a claim that every concurrent publication was performed by this PR**.

The proposed source-label publication constraint is only a future release proposal, not active production protection. Existing published question content continues to be immutable; a signed review plus atomic release is necessary for the remaining 70 live replacements.

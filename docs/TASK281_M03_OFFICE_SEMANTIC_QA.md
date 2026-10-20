# TASK-281 — Office M03 mustaqil manbalar bilan semantik QA

**Manbalar:** 2026 informatika attestatsiya spetsifikatsiyasi, 5–11-sinf milliy va Cambridge darsliklari, Drive 2025 kuzgi demo, 2026 demo, 13.04.2026 test to‘plami (provenance holati TASK-280 da). Mustaqil Microsoft qoidalari:
- https://support.microsoft.com/en-us/excel/switch-between-relative-absolute-and-mixed-references
- https://support.microsoft.com/en-us/excel/how-to-correct-a-n-a-error
- https://support.microsoft.com/en-us/word/use-section-breaks-to-change-the-layout-or-formatting-in-one-section-of-your-word-document
- https://support.microsoft.com/en-us/powerpoint/set-the-start-time-and-speed-of-an-animation-effect
- https://support.microsoft.com/en-gb/powerpoint/edit-and-re-apply-a-slide-layout

**QA ishi:** 36 original review kandidati individual qayta tekshirildi, ulardan 19 tasi tahrirlandi. 4 ta Y3 tartiblashdagi mustaqil qadamlarning tartib noaniqligi kamaytirildi; 3 ta Y1 vaziyatli murakkablashtirildi; 12 ta qayta baholash amalga oshirildi (7 asosiy tahrir tarkibida ayrim qiyinlik tahrirlari ham bor). Ko‘rik jadvali `supabase/audits/20261020_task281_m03_review_results.csv`.

**Xavfsizlik:** Only existing `M03_STYLE_QA_2026` review savollar. Published savol, oldingi 270 savol, lesson yoki attempts o‘zgartirilmaydi. SQL statusni tekshiradi, concurrent stem o‘zgarishi bo‘lsa rad qiladi, idempotent; oldingi matnlar TASK-280/QA manbasida mavjud. Fresh bazada yangi review savollar bo‘lmasa NOTICE va skip.

**Release siyosati:** Ushbu yordamchi QA modelga asoslangan, inson ekspertining mustaqil tasdig‘i emas. 36 kandidat review holatida qoladi. To‘liq 270 savol uchun source-by-source tekshiruvdan qolgan ishlar: 24 suspekt daraja, 54 Y2 ma’no va 54 Y3 tartib va 92 qisqa izoh, ularning kesishmalari bo‘lishi mumkin. Inson eksperti approval va learner smoke bo‘lmaguncha published emas. Rollback: TASK-280 oldingi snapshotdan yangi forward migration bilan tiklash.

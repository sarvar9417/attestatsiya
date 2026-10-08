# PHASE2_MASTER_PLAN.md

## 1. Boshlang‘ich nuqta

Phase 2 `main@8ad536b` holatidan boshlanadi. Foundation, auth, learner flow,
server-authoritative assessment, production Supabase, onboarding, mastery/SRS,
readiness, natijalar tarixi va single-Vercel deployment ishlaydi.

Endi asosiy risk UI emas — kontent qamrovi, objective-level assessment,
adaptive practice va production mock feasibility.

## 2. Ish tartibi

1. **T-039 — Adaptive practice selector**
   - 10 savol: 50% weak, 25% due, 15% new/low exposure, 10% strong control.
   - immediate exact retry yo‘q;
   - revision duplicate yo‘q;
   - low-exposure revision ustun;
   - pool yetishmasa fallback metadata saqlanadi;
   - `mashq` guided evidence bo‘lib, independent mastery’ni sun’iy oshirmaydi.

2. **T-040 — Question ↔ objective coverage audit**
   - har published savol `group → construct/objective → cognitive → difficulty → source`;
   - orphan/mis-tagged item report;
   - M01 uchun coverage matrix.

3. **T-041 — Objective-complete topic-test assembler**
   - random 20 o‘rniga required/critical objective qamrovi;
   - insufficient pool session yaratmaydi;
   - unseen/recent-exposure preference;
   - pass/remediation coverage bilan bog‘lanadi.

4. **T-042 — M01 professional bank import/audit**
   - mavjud 570 savolni source-backed strukturalash;
   - duplicate/key/explanation/type audit;
   - objective mapping;
   - approved-only production pool.

5. **T-043 — M01 50-question section mock**
   - har topic va critical objective qamrovi;
   - deterministic feasibility;
   - 45/50 + critical floor;
   - unseen 50/50 perfected;
   - kamida 20 audited assemblies.

6. **T-044+ — M02–M13 specialty expansion**
   - HW/OS, Office, Logic, Number systems, Algorithm, Scratch/LOGO,
     Python/JavaScript, DB/SQL, Graphics/HTML/CSS, Network/IP, Security/services.

7. **Professional/pedagogy lane**
   - Kasb standarti 5 savol;
   - umumiy pedagogika 7 savol;
   - informatika metodikasi 3 savol;
   - faqat rasmiy/tavsiya qilingan source locator bilan publish.

8. **Release lane**
   - full 50/120/8–35–7 constraint generator;
   - ≥3 000 approved questions;
   - per-slot candidate pool va feasibility dashboard;
   - 1 000+ invariant runs;
   - security/accessibility/performance/backup;
   - closed beta → full beta → production activation.

## 3. Phase 2 quality gates

- Correct answer exam submitdan oldin clientga chiqmaydi.
- Guided practice independent mastery hisobiga kirmaydi.
- Har published savol source/objective bilan traceable.
- Topic test required/critical objective’ni tashlab ketmaydi.
- Full mock aynan 50 savol, 120 daqiqa, 8/35/7.
- Impossible blueprint hech qachon invalid session yaratmaydi.
- Production release faqat audited content va green CI bilan.

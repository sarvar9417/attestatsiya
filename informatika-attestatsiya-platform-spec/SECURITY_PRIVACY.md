# SECURITY_PRIVACY.md

## 1. Himoya qilinadigan aktivlar

- foydalanuvchi account va progress;
- correct answer banki;
- draft/published kontent;
- private source fayllar;
- role va audit;
- exam session integrity;
- service-role va deployment secretlari.

## 2. Asosiy tahdidlar

- learner correct answerni API/client bundle’dan olish;
- boshqa user progressini ko‘rish;
- role escalation;
- answer/session IDOR;
- XSS rich content orqali;
- malicious file upload;
- SQL injection;
- double submit/double score;
- client clock manipulation;
- credential stuffing/rate abuse;
- service secret leak;
- AI/import orqali zararli payload;
- copyright source faylini public qilish.

## 3. Authentication

- Supabase Auth.
- Email verification production’da.
- Password reset one-time flow.
- Admin/reviewer uchun MFA production target; MVP release’dan oldin admin MFA majburiyligi provider capability bilan yoqiladi.
- Session cookie `httpOnly`, `secure`, `sameSite`.
- Auth error account existence’ni ortiqcha oshkor qilmaydi.

## 4. Authorization

Permission faqat UI hide bilan emas:

1. route/server role check;
2. service-level permission;
3. database RLS/policy.

Role matrix `DATABASE_SCHEMA.md`da.

Service role:

- faqat server;
- client env prefix bilan berilmaydi;
- log qilinmaydi;
- preview va production secret alohida.

## 5. RLS talabi

Har `public` schema table uchun:

- RLS enabled;
- explicit policy;
- anon default deny;
- authenticated default deny unless allowed;
- pgTAP policy test.

Yangi jadval RLS qarorisiz merge qilinmaydi.

`security definer` function:

- fixed `search_path`;
- input validation;
- explicit actor check;
- least privilege owner;
- direct execute grantlar audit.

## 6. Correct answer leakage

- Full `question_revisions.payload` learner uchun SELECT qilinmaydi.
- Learner DTO correct keyni olib tashlaydi.
- Server component serialized prop’da correct answer yo‘q.
- Source map/browser devtools’da answer yo‘q.
- Cache key va error body’da answer yo‘q.
- Exam final bo‘lmaguncha explanation yo‘q.
- E2E test network response’larda answer field yo‘qligini tekshiradi.

## 7. Input va output

- Zod validation.
- SQL parameterized/Supabase query API.
- Raw HTML qabul qilinmaydi.
- Rich content allowlisted JSON block.
- Markdown bo‘lsa server sanitizer.
- Code block text sifatida render; execute/eval yo‘q.
- Formula parser unsafe command allowlist bilan.

## 8. File upload

Allowlist:

- image/png;
- image/jpeg;
- image/webp;
- image/svg+xml faqat sanitize qilinsa, aks holda MVP’da taqiqlash;
- private PDF admin source uchun.

Tekshiruv:

- extension emas, MIME va magic bytes;
- size limit;
- image dimension limit;
- random storage name;
- executable content yo‘q;
- malware scanning capability bo‘lsa;
- private bucket default.

## 9. CSRF, CORS va headers

- same-site cookie va CSRF protection mutationlarda.
- CORS faqat known origin.
- CSP default denyga yaqin, zarur origin allowlist.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy`.
- clickjacking protection.
- HSTS production.
- Permissions-Policy’da keraksiz camera/microphone/geolocation disabled.

## 10. Rate limit

Account:

- login/reset;
- email verification resend.

Assessment:

- session creation;
- answer save burst;
- submit.

Admin:

- import;
- media upload;
- search.

Limit distributed storage adapter orqali; fail mode critical endpointda fail-closed yoki conservative.

## 11. Exam integrity

- server seed;
- server timestamps;
- answer autosave with ownership check;
- submit lock;
- immutable session question list;
- assembly audit;
- question answer only server-side.

Bu proctoring emas; maqsad practice integrity.

## 12. Privacy

Minimal data:

- email;
- display name;
- optional exam date;
- progress/answers;
- security/audit metadata.

Saqlanmaydi:

- pasport;
- biometrika;
- microphone/camera;
- aniq location;
- keraksiz maktab ma’lumoti.

Analytics eventlarda raw email/name yo‘q. User ID pseudonymous.

## 13. Retention

Default policy product owner/legal reviewgacha:

- active account progress — account davomida;
- deleted account — 30 kun ichida anonymize/delete, qonuniy/audit istisno;
- auth/security logs — 90 kun;
- content audit — uzoq muddat;
- raw import file — 30 kun yoki muvaffaqiyatdan keyin oldinroq;
- database backup — 30 kun.

Final legal policy launchdan oldin tasdiqlanadi.

## 14. Account deletion

- re-auth talab;
- cooling period optional;
- auth user delete;
- PII anonymize;
- aggregate learning statistics de-identified qolishi mumkin;
- audit’da actor ID pseudonymized.

## 15. Secret management

- `.env.example` faqat nomlar.
- `.env*` gitignore.
- preview/prod secret alohida.
- rotation hujjati.
- secret scanner CI.
- log/screenshot/task handoff’da secret yozilmaydi.

## 16. Dependency va supply chain

- exact lockfile;
- install CI’da frozen lockfile;
- automated vulnerability scan;
- dependency upgrade alohida PR;
- lifecycle script va yangi package review;
- abandoned package o‘rniga platform primitive afzal.

## 17. Backup va incident

- automated database backup;
- restore rehearsal;
- content media backup/retention;
- incident severity;
- correct-answer leak bo‘lsa affected revisions archive/rotate;
- session/auth leak bo‘lsa revoke;
- audit log preserve.

## 18. Security release checklist

- [ ] RLS barcha jadvallarda.
- [ ] Cross-user IDOR test.
- [ ] Role escalation test.
- [ ] Correct answer leakage test.
- [ ] XSS payload test.
- [ ] Upload validation test.
- [ ] Double-submit/idempotency test.
- [ ] Secret scan.
- [ ] Dependency audit.
- [ ] Backup restore isboti.
- [ ] Admin MFA.
- [ ] CSP va security headers.

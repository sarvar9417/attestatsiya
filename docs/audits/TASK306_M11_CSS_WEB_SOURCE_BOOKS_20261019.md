# TASK-306 — M11.04–M11.07: HTML media, CSS va vebsayt loyihalash

**Sana:** 2026-10-19. **Maqom:** source-first offline BookReader material; authenticated server reader va PDF 1:1 sahifa qamrovi verified emas. **Deploy OFF.**

## Muammo va yechim

M11.04–M11.07 oldingi statik nazariyada bir necha ta’rif, 1–2 CSS/HTML kod namunalari va TASK-273 manbaviy 5 blokli ilovalar bilan cheklangan edi. CSS cascade/specificity, Box Model hisoblari, iframe privacy va subtitr, ruxsatli release/test kabi mavzular mustaqil dars o‘qish ketma-ketligisiz qolgan.

| Mavzu | Yangi asosiy bloklar | Asosiy bo‘limlar | Muhim bilim va amaliyot |
|---|---:|---:|---|
| M11.04 Havola/iframe/audio/video | 74 | 12 | Aniq href va target, noopener, iframe title/sandbox, audio/video controls, source va track/captions |
| M11.05 CSS asoslari va rang | 76 | 12 | CSS declarations, selectors, specificity/cascade, HEX/RGB/HSL, WCAG kontrast, custom properties, dark mode |
| M11.06 CSS matn, blok, forma | 77 | 12 | Box Model, box-sizing content/border hisob, rem, list/table/form, Flex/Grid, media query/overflow |
| M11.07 Veb-sayt loyihalash va QA | 71 | 12 | Auditoriya/sitemap/wireframe, semantics/a11y, HTML/CSS validators, browser test, security/privacy va regression |
| **Jami** | **298** | **48** | Har bo‘limda original definition, worked example, trap, independent task va umumiy answers |

Eski M11_WEB_TEXTBOOK_ADDITIONS ilovalarining hammasi bob oxirida saqlanadi. Eski 3–5 blokli seed ikkinchi mustaqil dars sifatida ekranga qayta qo‘yilmaydi; kind: chapter orqali yagona BookReader oqimi. 9 original statik savolning ID, correctIndex va Y1/Y2 darajasi saqlangan.

## Faktik aniqlashtirish
- M11.04-q1: target=_blank yangi browsing context; **brauzer tab yoki oyna sifatida** ko‘rsatishi mumkin. «Har doim aynan yangi oynada» degan eski ta’rifdan voz kechildi, javob indeksi 1 o‘zgarmadi.
- M11.05 CSS kaskadida «oxirgi yozilgan qoidaning o‘zi har doim g‘olib» xato: cascade layer, specificity, origin va importance ta’sir qiladi.
- M11.06 content-box 200px + 10px ikki padding + 2px ikki border = 224px; border-box 300px - 20px ikki padding - 2px ikki border = 256px. Margin hisobda tashqarida.
- M11.07 W3C Nu HTML Checker va CSS Validatorni xavfsizlik auditi yoki Lighthouse balliga tenglashtirmaydi. Production release alohida ruxsat talab qiladi.

## Manba doirasi
- [Cambridge+ 8-sinf vebsayt va media](https://drive.google.com/file/d/1hZyLM5n0OUtuJI3M3dFeAz8kyv9Sr6Ng/view).
- [Cambridge+ 9-sinf 21-bob «Veb-sayt yaratish»](https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view).
- [Cambridge+ 10–11-sinf veb dasturlash](https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view).
- [MDN HTML iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe), [video](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video) va [track](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track).
- [MDN Cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Cascade), [MDN Box Model](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model).
- [W3C Nu Checker](https://validator.w3.org/nu/), [CSS Validator](https://jigsaw.w3.org/css-validator/), [WCAG 2.2 contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Misollar va izohlar original o‘zbekcha mualliflik qayta bayoni. M01.02 fizik darslik sahifalari bilan aynan 1:1 tenglik, foydalanuvchining autentifikatsiyali real o‘qish interfeysi va mobilda UX yakuniy ekspertizasi bajarilgani da’vo qilinmaydi.

## Regressiya va boshqaruv
- TASK306M11CssWebCanonicalBooks testi: 12 bo‘limdan, 70+ blokdan, manba, appendixning saqlanishi, oldingi 9 savolning ID/kalit/Y turi va semantika, hisob, security/validator regressiyalari.
- Oldingi TASK-273 M11WebTextbookDepth testi bilan mos. M11.01–03 TASK-305 PR **alohida**; agar u oldin merge qilinsa, TASK-306 ularni ortga qaytarmaydigan tarzda current main bilan konfliktni yechish zarur.
- PR #304 va #305 workflowlari GitHub Actionsda queued holatida; TASK-306 ham barcha required frontend lint/typecheck/unit/build/Playwright, backend, database, quality tekshiruvlari yashil bo‘lgach merge qilinadi.
- Supabase DB, server-published savollar, hidden keys, deploy va host konfiguratsiyasi o‘zgarmaydi.

## Keyingi qolgan ishlar
M04–M13 bo‘yicha offline va published depthni alohida o‘lchash, tashqi haqiqiy darslikning sahifa/rasmlarini expert tekshirish, authenticated mobile/desktop reader smoke. Deploy faqat foydalanuvchi alohida buyursa.

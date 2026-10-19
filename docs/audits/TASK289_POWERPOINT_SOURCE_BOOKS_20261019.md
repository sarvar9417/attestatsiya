# TASK-289 — M03.08–M03.10 manbaga tayanadigan PowerPoint nazariya boblari

**Sana:** 2026-10-19. **Holat:** PR/CI sifat nazorati; deploy yo‘q.

## Muammo
M03.08–10 dastlab beshga yaqin qisqa statik nazariya bloklari va qo‘shimcha Office manba qaydlaridan iborat edi. Yagona BookReader dizayni mavjudligi bu boblarni batafsil o‘quv materialiga aylantirmaydi. Foydalanuvchi barcha darslarning M01.02 kabi *o‘qish ketma-ketligi, mazmuniy zichligi va manba shaffofligiga* yaqinlashishini talab qilgan.

## Yangilangan darslar

| Mavzu | Yangi asosiy blok | Tabiiy bo‘lim | Amaliy yo‘nalish |
|---|---:|---:|---|
| M03.08 PowerPoint interfeysi va dizayni | 66 | 12 | Auditoriya, maket, theme/master, o‘qilish, slayd tartibi, format va sinov |
| M03.09 PowerPoint obyektlari va multimedia | 66 | 12 | Qatlam, rasm, SmartArt/Chart, audio/video, kodek, havola, ruxsat va muqobil |
| M03.10 Animatsiya va o‘tish effektlari | 66 | 12 | Transition vs animation, kirish/urg‘u/chiqish, Pane, timing, trigger va QA |
| **Jami** | **198** | **36** | Har bobda 12 topshiriq va tekshirish yo‘nalishi |

Birinchi sahifada maqsad va kirish, undan keyin mualliflik bo‘limlari keladi. Yangi nazariya boshida, avvalgi tekshirilgan `M03_OFFICE_TEXTBOOK_ADDITIONS` ilovalari oxirida saqlanadi. Avvalgi 5-bloklik statik asosiy konspekt tushuntirilgan mavzularda alohida ikkinchi nusxa sifatida takrorlanmaydi. Original savollar IDsi, tanlovlari, `correctIndex` qiymati, publication va backend baholash o‘zgarmaydi.

## Asosiy manbalar
1. [Cambridge+ 9-sinf, «Informatika va axborot texnologiyalari», 2021, 19-bob «Taqdimot», bosma 240–250-betlar](https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view): obyektni joylash, master-slayd, dizayn, slayd tuzilishi, ovoz va multimedia. Darslikning manbadagi muhim joylari ko‘rib chiqilgan.
2. [Cambridge+ 7-sinf multimedia taqdimoti](https://drive.google.com/file/d/1RhIRuHi8i7i18mkrd3eQQt2lJrbnfCkS/view): multimedia taqdimotini rejalash, auditoriya, PowerPoint slayd almashishi va resurslardan odobli foydalanish.
3. PowerPointning Animation Pane, Start, Delay, Duration, Trigger kabi tushunchalari versiyaga bog‘liq amaliy interfeys qoidalari sifatida mustaqil pedagogik tushuntirilgan; *darslikdagi aniq har bir matn jumlasiga birma-bir muvofiqlik da’vo qilinmaydi*.

## Sifat va cheklov
- Nazariya manbaga asoslangan **original qayta bayon**; darslikni so‘zma-so‘z ko‘chirish emas.
- Rasm/jadvalning fizik PDF sahifasidan 1:1 ko‘chirilishi yoki barcha sahifani individual vizual tekshirish bajarildi degan da’vo yo‘q.
- Regressiya: `src/tests/TASK289PowerPointCanonicalBooks.test.ts` 12 bo‘lim, 66 blok, asosiy/qo‘shimcha tartib, asl 4 savol, javob indekslari va muhim terminlarni tekshiradi.
- Lint, TypeScript, unit va build, frontend E2E, backend, DB, quality CI barcha required tekshiruvlari muvaffaqiyatli bo‘lsagina merge qilinsin.
- Published savolga tegilmasin, production bazaga yozilmasin, **deploy qilinmasin**.

## Hali ochiq
1. Butun Cambridge+ 7 va 9-sinfning PowerPointga tegishli rasmlarini bosma/PDF fizik sahifalar bo‘yicha ekspert solishtiruvi.
2. Authenticated learner qurilmasida (desktop/mobil) yakuniy BookReader va media UX smoke.
3. Qolgan qisqa M15.07–M15.08, M04–M13 darslari manba-auditi va boblarni kengaytirish.

**Handoff:** TASK-289; source-guided three PowerPoint books; changed `topicContent.ts`, 3 new books, 1 regression suite, this audit. Migration yo‘q. Qolgan xavf: source page fidelity va production UX.

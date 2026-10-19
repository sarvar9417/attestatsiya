# TASK-244 — Cambridge+ 9-sinf: M01 nazariyasi sahifalar bilan qiyosi

**Kitob:** 12/13. **Sana:** 2026-10-19. **Drive original:** `9-sinf informatika (Cambridge +)_compressed.pdf`, ID `10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm`. **316 PDF sahifa**, **8 296 826 bayt**, SHA256 `f72562a73534de5931ef7061a6c768840da572afc0519105738907a65a8926d9`. Ushbu IGCSE ICT o‘zbekcha nashrida tegishli boblarda **PDF = bosma sahifa + 7**.

## Qamrov va boshqa modullar chegarasi

316 sahifaning mundarijasi va bo‘limlari xaritalandi. M01 uchun **PDF 62–70, 112–127, 129–145, 146–152, 163–166, 192–198, 202–210** bo‘limlari o‘qildi; rasm/jadvalli tanlangan sahifalar vizual ham tekshirildi. **Barcha 316 sahifani alohida vizual ko‘rganmiz deb hisoblanmaydi.**

| Sahifa PDF | Asl kitobdagi bo‘lim | Qiyoslash natijasi |
|---:|---|---|
| 8–61 | 1–4-bob: kompyuter, qurilma, xotira, tarmoq | M02 va M12; M01ga takror ko‘chirilmadi |
| 62–70 | 5-bob: AKTning bandlik, ish va salomatlikka taʼsiri | M01.02: avtomatlashtirish, deskilling/reskilling, masofaviy ish |
| 71–111 | 6–7-bob: AKT ilovalari, tizim hayot sikli | M02/M04/M09/M13; protseduralar M01ga emas |
| 112–127 | 8-bob: e-safety, shaxsiy axborot, fishing/farming/vishing, parol | M01.04: xavf turlari, shubhali xabarni tekshirish; chuqur xavfsizlik M13 |
| 129–136 | 9-bob: auditoriya, axloq, madaniy ehtiyoj | M01.04: xabarning auditoriya va maqsadga mosligi |
| 137–145 | 10-bob: e-mail, netiket, resursni baholash | M01.04: muallif, sana, dalil, domen, elektron xat |
| 146–152 | 11-bob: fayl kengaytmasi, import/eksport, yo‘qotishli siqish | M01.06: CSV/XML/JPEG/ZIP taqqosi |
| 153–166 | 12-bob: tasvirni tahrirlash, piksellarni kamaytirish | M01.06: rasm hajmi, sifat/siqish; muharrir M10 |
| 167–191 | 13–14-bob: dizayn, uslublar | M03/M11 |
| 192–198 | 15-bob: proofreading, maʼlumotni to‘g‘rilash usullari | M01.04: **validation ≠ verification** |
| 202–210 | 16-bob: diagramma, grafik, trend | M01.04: auditoriya, diagramma turi va to‘g‘ri taqdim |
| 211–316 | 17–21-bob: hujjat, MB, taqdimot, tahlil, veb | M03/M09/M11, M01ga umumiy dublikat olib kelinmadi |

## Manbaga asoslangan oltita original qo‘shimcha

1. `M01.02`: PDF 62–70 — AKT va ish o‘rinlari, masofaviy ish, sog‘liq. Kitobdagi «80% ish AKTga tegishli» daʼvosi bugungi universal statistika deb olinmagan.
2. `M01.04`: PDF 112–127 — phishing/farming/vishing va shaxsiy maʼlumot; muntazam parol almashtirish kitobdagi tarixiy tavsiya bo‘lib, zamonaviy qoida sifatida universallashtirilmagan.
3. `M01.04`: PDF 129–136 va 202–210 — foydalanuvchi ehtiyojiga mos taqdimot, ustunli/chiziqli/doiraviy diagramma, o‘q shkalasi, trend ≠ sababiyat.
4. `M01.04`: PDF 137–145 — e-mail netiketi, mustaqil manba, mualliflik va ishonchlilik.
5. `M01.06`: PDF 146–152, 163–166 — CSV/XML, JPEG yo‘qotishli, ZIP odatda yo‘qotishsiz; fayl kengaytmasini o‘zgartirish ≠ haqiqiy konvertatsiya.
6. `M01.04`: PDF 192–198 — **validation** qiymatning formati, tipi, diapazoni to‘g‘riligini tekshiradi; **verification** asl manbaga mosligini solishtiradi; **spell check** so‘z imlosini ko‘radi, dalil rostligini emas. Masalan, xato «4» baho 1–5 diapazonidan o‘tishi mumkin, ammo asl daftar bilan qiyosda xato aniqlanadi. Zamonaviy termin izohi manbadan alohida.

**Kod:** `src/data/topics/m01TextbookAuditCambridge9.ts`, test `src/tests/M01Cambridge9BookAudit.test.tsx`. **12/13 kitob, jami 52 original manbali qo‘shimcha**. Merge, deploy, production DB yozuvi yo‘q. **Next: Cambridge+ 10–11-sinf birlashgan PDF**.

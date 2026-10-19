# TASK-244 — Cambridge+ 6-sinf, sahifama-sahifa M01 qiyosi

**Kitob 9/13.** 2026-10-19. Google Drive: `6-sinf informatika (Cambridge +)_compressed.pdf`, ID `1sdG2X5bgWXdKDPTCb9zY03SeaJuGxO4l`. **244 PDF sahifa**, 4 475 322 bayt. SHA256: `7e48fb481eafac3f2102da6e229fb9bea1b4a7af3d9ce7c53b7e2767407a94cc`.

Kitob Cambridge ICT Starters «Next Steps» o‘zbekcha (2021) nashri. **PDF raqami = bosma raqam + 3**. M01ga daxldor **PDF 162–205**, 44 sahifaning har biri matn bo‘yicha o‘qildi va nazariya bilan taqqoslandi. Rasm/jadvalli p162–170,174,180–183,186,194–200,203 grafik ko‘rinishda ham tekshirildi. Barcha 244 sahifa grafik ekspertizadan o‘tgan degan da’vo yo‘q.

## Kitob boblarini modullarga ajratish

- PDF 9–30: Word hujjati, **M03**; 31–50: tasvir, **M10**; 51–86: jadval, **M03**; 87–124: ma’lumotlar bazasi, **M09**; 125–161: Scratch, **M06/M07**.
- **PDF 162–180:** internetda qidirish, **M01.04** (texnik M12ga tegishli).
- **PDF 181–205:** elektron pochta, **M01.04** (texnik M12ga tegishli).
- PDF 206–229: multimedia hujjati, **M03/M10**; 230–244: glossariy/nashr.

## Ketma-ket sahifalarni tekshirish reyestri

| PDF sahifalari | O‘qilgan asosiy mazmun | Platformadagi qaror |
|---|---|---|
| 162–166 | Internet, WWW, URL, qidiruv indeksi, reyting va filtr | M01.04: indeks bilan brauzer tarixini farqlash |
| 167–170 | Britannica, Wikipedia, fakt, muqobil qidiruv va filtr | M01.04: dalilni mustaqil tekshirish |
| 171–175 | Veb-sahifani chop etish, bookmark, URL, nusxalash | M01.04: havola va litsenziya |
| 176–180 | Quyosh va Quyosh tizimi tadqiqoti, FAQ va yakuniy savollar | M01.04: savol/fakt/dalil |
| 181–185 | Email moduli, kirish, offline/online, Drafts va Reply | M01.04: email odobi |
| 186–190 | Reply All, format, imlo, fayl qo‘shish, manzillar kitobi | M01.04: auditoriya va xat |
| 191–195 | Kontakt, guruh, CC/BCC va Forward; yuboruvchining roziligi | M01.04: rozilik va maxfiylik |
| 196–199 | Xat zanjiri, attachment, noto‘g‘ri ilova xavfi va fayl limiti | M01.04: virus/MB va Mb farqi |
| 200–205 | Papkalar, labels, URL manba, tartiblash va guruh loyihasi | M01.04: saqlash va izlash |

PDF **162–205** to‘liq, uzluksiz qamrab olingan; har bir sahifa yuqoridagi mos interval ichida. Texnik/ilova interfeysining o‘zgaruvchan ko‘rsatmalari universal deb ko‘chirilmagan.

## Koddagi original manbali qo‘shimchalar

1. `M01.04`, PDF 162–166: URL, domen, indeks va reyting; indeksni shaxsiy qidiruv tarixidan farqlash; `.uz` domenining joylashuv yoki haqiqat kafolati emasligi.
2. `M01.04`, PDF 167–180: ikki manba, o‘lchov birligi, bukmark, URL, iqtibos/litsenziya; Wikipedia/Britannica ishonchliligini universal, tekshirilmagan hukmga aylantirmaslik.
3. `M01.04`, PDF 181–196: Reply, Reply All, Forward, CC, BCC; yuboruvchi roziligi; BCC shifrlash emas.
4. `M01.04`, PDF 196–205: attachment, provayder limiti, papka/label; darslikdagi 25Mb yozuvi servis/historiy kontekstga tegishli; **Mb ≠ MB**.

Kod `src/data/topics/m01TextbookAuditCambridge6.ts`, test `src/tests/M01Cambridge6BookAudit.test.tsx`. Jami **40 source-backed insert**, **9/13 darslik**. Keyingi Cambridge+7. CI/reader QA tugamaguncha yakuniy tasdiq yo‘q. Merge/deploy/production DB yozuvi yo‘q.

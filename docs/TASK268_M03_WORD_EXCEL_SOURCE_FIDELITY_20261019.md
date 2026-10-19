# TASK-268 — M03 Word va Excel statik darslarida manba xatolari (2026-10-19)

**Holat: real nazariya tuzatildi, 3 avtomatik regressiya mavjud; published lesson va savol banki tekshiruvi alohida OPEN.**

## Asl manba va mustaqil tekshiruv
- Sarvar Drive: *6-sinf informatika (Cambridge+)*, 2021, Google Drive fayl ID `1sdG2X5bgWXdKDPTCb9zY03SeaJuGxO4l`, *Elektron jadvalga qayta ishlov berish*, **bosma 62–64-betlar**: formula ko‘chirilganda nisbiy katak havolalari siljishi, formulaning o‘rniga **AutoSum** tugmasidan foydalanish. Mazmun matni tekshirildi, rasmdagi fizik tugma glifi bevosita raster bilan mustaqil tasdiqlanmagan.
- Microsoft Support: **COUNTA** haqidagi rasmiy sahifa https://support.microsoft.com/en-us/excel/functions/counta-function — bo‘sh bo‘lmagan kataklarni, shu jumladan matn, mantiqiy qiymat yoki xato qiymati bo‘lgan kataklarni sanaydi; **COUNT** esa sonli qiymatli kataklarga xos. `COUNTA`ni “barcha qiymatlarni sanash” deyish noaniq.
- Microsoft Support: Word **Design > Page Borders** https://support.microsoft.com/en-gb/word/training/add-a-border-to-a-page va **Layout > Margins** https://support.microsoft.com/en-us/word/training/change-margins — eski `Design | Sahifa chetlari` ta’rifi ikkita buyruqni adashtirgan.
- AutoSum yig‘indi funktsiyasining belgisi **Σ**. Eski `AutoSum (S)` iborasi vizual jihatdan noto‘g‘ri edi.

## Kiritilgan to‘rtta aniq tuzatish
1. `M03.01` — Design mavzular/ranglar/sahifa chegara bezagi; sahifa maydonlari Layout ostida.
2. `M03.05` — COUNT kataklardagi **sonli** ma’lumotlarni sanaydi.
3. `M03.05` — COUNTA bo‘sh bo‘lmagan kataklarni sanaydi.
4. `M03.05` — AutoSum (Σ) yig‘indini tez hisoblash vazifasiga aniq bog‘landi.

## Release cheklovlari
- O‘zgarishlar **statik fallback nazariyasi** uchun; 20 tadan test talab qilinadigan **M03 production 4 mavzusida 52 ta yetishmayotgan published-keyed slot** o‘zgarmaydi.
- Published Office darsi, Word/Excel versiyasi, original darslikdagi barcha rasmlar va test bankidagi shaxsiy javob kalitlari mustaqil ekspert hamda autentifikatsiyalangan UI tekshiruviga muhtoj.
- Hech qanday production ma’lumotlari yoki savollar nashri/deploy bajarilmaydi.

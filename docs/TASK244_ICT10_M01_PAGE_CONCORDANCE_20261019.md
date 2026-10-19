# TASK-244 — ICT 10-sinf (2021): M01 sahifa/manba concordance

**Sana:** 2026-10-19. **Kitob:** 6/13.
**Drive original:** `ICT 10_sinf-2021_compressed.pdf`, id `1KNBa9-8wlk-CV8cZPUzEqYgMsvBdZb_3`.  
**Korpus:** **257 PDF sahifa**, **6 810 436 bayt**, SHA-256 `eee52925957b9ab8266002f51d87b72fd04ff407e9fbb9d48324e3dc6acd9cbc`.
**Sahifalar:** bu originalda tegishli boblardagi PDF raqamlar bosma raqamlar bilan mos, masalan PDF 28/bosma 28, PDF 204/bosma 204.

## Chegarani to‘g‘ri belgilash

Darslikning 257 sahifasi matn chiqishi va bob tuzilishi bo‘yicha inventarlandi. M01ga bevosita daxldor **PDF 28–34** hamda **PDF 204** bittalab o‘qildi, rasm/jadvalga boy sahifalar grafik ko‘rinishda ham tekshirildi. Qo‘shimcha **PDF 12, 64, 77, 205** bilan chegaradosh mavzular solishtirildi. Bu 257 sahifaning hammasi rasm darajasida ko‘rildi degani emas.

Bo‘limlar: PDF 4–34 (kompyuter tarixi/qurilma/xizmatlar, M02 bilan M01.06 kesishmasi), PDF 35–63 (Excel, **M03**), PDF 64–76 (videotahrir, **M10.07**), PDF 77–105 (3D grafika, **M10.05**), PDF 106–189 (Pygame/dasturlash, **M08**), PDF 190–255 (CSS va veb-sayt dizayni, **M11**), PDF 256–257 (nashr hujjatlari). Kitobning sahifalarida ayrim bob headerlari boshqa bob nomi bilan chiqqani uchun mavzular **matn va mundarija bo‘yicha** ajratildi.

## M01ga daxldor sahifalar va boshqa modullarga o'tish

| PDF-bet | Kitobdagi tushuncha | Manzil | Qaror |
|---:|---|---|---|
| 4 | Hisoblash texnikasi tarixi | M02.01 | M01ning mustaqil konstruktiga mos emas |
| 8 | Tashqi qurilmalar | M02.01 | Kompyuter tizimlari |
| 12 | RAM/ROM va saqlash qurilmalari | M02.01 | Xotira birliklari M01da allaqachon bor, qurilma turlari M02da |
| 16 | Ichki qurilmalar | M02.01 | Kompyuter tizimlari |
| 24 | Operatsion tizim | M02.02 | OS amallari M02da |
| 28 | Xizmat ko‘rsatish dasturi, arxivator va siqish | M01.06/M02.04 | Arxivator vs. siqish turi izohlandi |
| 29 | WinRAR/7-Zip, audio/video kodek va siqish | M01.06/M02.04 | Yo‘qotishsiz arxiv vs. media yo‘qotishli kodlash izohlandi |
| 30 | Kodeklar ro‘yxati, konvertor va multimedia formati | M01.06 | AVI konteyner, H.264 kodek; nomuvofiqlik izohi |
| 31 | Audio/video konvertor va kodek/formatni o‘zgartirish | M01.06/M10.07 | Konvertor, remux/transcode farqi; interfeys M10 |
| 32 | Hujjat konvertori va amaliy interfeys | M01.06/M02.04 | DOCX → PDF formati; ilovaga xos tugmalar boshqada |
| 33 | Arxiv/video/hujjat amaliy mashqlari | M01.06 | Asosiy maqsadni ajratish, UI qadamlari ko‘chirilmagan |
| 34 | MP3→FLAC→MP3 uyga vazifa | M01.06 | Yo‘qotilgan axborot tiklanmasligi bo‘yicha original tushuntirish |
| 64 | Videomontaj, video konvertor va videomuharrir | M10.07/M01.06 | Asosiy media ta’rif M01 bilan tekshirildi, amaliy detal M10 |
| 65 | Videomuharrir imkoniyatlari | M10.07 | Amaliy vosita boshqa modulga |
| 66 | Videofayl kengaytmalari va muharrir mashqlari | M10.07/M01.06 | MP4 vs PNG/PSD/MP3 ayrimi boshqada |
| 77 | 3D grafik va 3D skaner/printer | M10.05 | M01ga ko‘chirilmaydi |
| 78 | 3D teksturalash, animatsiya va rendering | M10.05 | M01ga ko‘chirilmaydi |
| 190 | Veb-sayt prototipi | M11.07 | Veb dizayni M11ga |
| 191 | Past/yuqori aniqlik prototiplari va dizayn | M11.07 | M11ga |
| 192 | Frontend/backend farqi | M11.01 | M11ga |
| 204 | Matn/fon kontrasti, CSS opacity va RGBA | M01.04/M11.05 | M01ga o‘qilish qulayligi; CSS kodi M11ga |
| 205 | HSL/HSLA rang modeli va lightness qiymatlari | M11.05/M01.06 | Mavzudagi lightness tavsifi nomuvofiqligi M11 auditi uchun belgilandi |

## M01 nazariyasidagi aniq o‘zgarishlar

1. **PDF 28–32**. Arxivator (ZIP/7z), codec (H.264/AAC), konteyner (MP4/MKV/AVI) va konvertorni (DOCX→PDF, WAV→MP3) bir-biridan ajratuvchi **4 qatorli original jadval** va umumiy xatolar `M01.06`ga kiritildi. Darslik kodek ro‘yxatida format/konteyner va kodlash turlarini birga keltiradi; foydalanuvchi shuni noto‘g‘ri universal tasnif sifatida o‘rganmasligi uchun **manba yozuvi bilan sharh** berildi.
2. **PDF 34**. Darslikning MP3→FLAC→MP3 tajribasini yo‘qotishli/yo‘qotishsiz siqish nuqtai nazaridan yechadigan original vaziyatli tushuntirish `M01.06`ga kiritildi. FLACga o‘tkazish avval yo‘qolgan audio tafsilotlarini tiklamaydi.
3. **PDF 204**. Past/o‘rta/yuqori kontrast misollari yordamida matn–fon rangini tanlashning **o‘qilish qulayligi** ta’siri `M01.04`ning accessibility bo‘limiga kiritildi. Aniq CSS sintaksisi `M11`ga tegishli.

## Source errata yoki qo‘shimcha tekshiruvni talab qiluvchi daʼvolar

- **PDF 30**da aralash «kodeklar» qatorida AVI ham tilga olingan; AVI **konteyner**, H.264 **video kodek**, AAC **audio kodek**. Kitobdagi tarixiy paket/dastur mosligi sifat bahosi bugungi xavfsizlik yoki ishlash kafolati emas.
- **PDF 205**da HSL «lightness» ekstremumlarining so‘zli tavsifida yorug‘/to‘q tushunchalari teskari yozilgandek ko‘rinadi; **M11.05**dagi kelgusi sahifali auditda ushbu joydagi formulasini va rasmini alohida tekshirish kerak. Bu aytilmagan manba tuzatishini M01ga o‘z-o‘zidan ko‘chirib yuborish emas.
- **PDF 204**dagi «o‘rta kontrast» tasviri hamma foydalanuvchi uchun qatʼiy, o‘zgarmas accessible dizayn qoidasi emas. Ko‘rish holatiga mos tekshiruv kerak; M01ga sharti bilan o‘tdi.
- **PDF 12–15**dagi RAM/ROM, HDD/SSD, optik saqlash qurilmalari, **PDF 77–105**dagi 3D grafik, **PDF 190–255**dagi CSS darslari M01ga to‘liq ko‘chirilmaydi — modulda ortiqcha takrorni oldini olish uchun.

**Kod:** `src/data/topics/m01TextbookAuditICT10.ts`; uch original manbali qo‘shimcha. `src/data/topics/m01TextbookAudit.ts`: 6 + 4 + 7 + 4 + 3 + 3 = **27 ta** sahifali insert; `src/tests/M01ICT10BookAudit.test.tsx` regressiyalari. Generated `m01.ts` o‘zgarmagan.

**Sifat va xavfsizlik:** CI, visual/mobile authenticated learner QA va 7 qolgan darsliklar tugamaguncha M01 to‘liq tasdiqlangan emas. **Merge, deploy, production DB write — yo‘q.** Keyingi darslik **ICT 11-sinf (2021)**.

# TASK-245 — M02: ICT 5-sinf (2020) 1/13 darslik

**Original:** `ICT 5_sinf-2020_compressed.pdf`, Google Drive ID `1KPjag_YqjgQbtd4HFEcEkQviJiwaduC9`. PDF: **113 sahifa**, 11 909 775 bayt, SHA256 `c9ecf47a8a72159244964635aae635f846f516394dbe73aa9f0e9c678047aac9`. PDF = bosma +1.

2026 attestatsiya spetsifikatsiyasining **3-betida** M02 qurilma/OT/fayl/dasturlar uchun **2 savol**, ofis vositalari uchun alohida **5 savol** (M03) belgilangan. Kitobning **PDF 25–48 (24 bet)** birin-ketin o‘qildi; diagramma va jadvalli 25–27, 33–34, 39–41, 43–45, 47–48 betlar grafik tasvirda ham qiyoslandi.

| PDF bet | Darslikdagi asosiy mazmun | M02ga nisbati |
|---|---|---|
| 25–28 | Kompyuter tuzilishi, monitor, CPU va klaviatura | M02.01; qurilmani vazifaga ko‘ra farqlash |
| 29–32 | Printer, skaner, plotter, proyektor va 3D printer | M02.01; 4 qatorli taqqoslash |
| 33–36 | Klaviatura guruhlari, Esc/Enter/Shift/Ctrl | M02.02; Esc va Undo farqi |
| 37–38 | Klaviatura trenajyori va matn terish mashqlari | M02 asosiy qurilma; amaliy matn M03 |
| 39–42 | Dastur, operatsion tizim va Windows boshqaruvi | M02.02/M02.04; tarixiy menyu va ikonka |
| 43–46 | Fayl, papka, yorliq, kengaytma, amallar | M02.03; yorliq asl fayl emas |
| 47–48 | Papka yaratish va to‘liq disk yo‘li mashqi | M02.03; vazifa saqlanadi, eski UI normaga aylantirilmaydi |

**1-tuzatish:** PDF 34dagi Esc izohi «oxirgi amalni bekor qilish» deb haddan tashqari umumiy. Esc joriy menyu/dialogdan chiqishi mumkin, **Undo (Ctrl+Z)** esa oldingi tahrirni qaytaradi. Vazifasi ilovaga bog‘liq.

**2-tuzatish:** PDF 44da fayl yorliq ko‘rinishida saqlanishi haqidagi ifoda bor. **Fayl** va unga ishora qiluvchi **shortcut** bir xil emas. Yorliqni o‘chirish odatda asl faylni o‘chirmaydi.

**3-tuzatish:** PDF 27da CRT/plazma/LCD misollari, PDF 40–41da Internet Explorer va Windows menyulari tarixiy kontekstda qoladi. Texnologiyalarni zamonaviy barcha tizim uchun qat’iy ro‘yxat sifatida bermadik.

**4-tuzatish:** M02.04ga OT — tizimli, matn muharriri — amaliy, arxivator/antivirus — utilita farqi vazifaga asoslanib kiritildi; bu chuqurlashtirilgan tasnifdir.

**Kod:** `src/data/topics/m02TextbookAuditICT5.ts`, M02 kanonik 4 mavzuga ulanish: `m02Canonical.ts`. **Regressiya:** `src/tests/M02ICT5BookAudit.test.tsx`. Barcha original 9 eski topic bo‘yicha nazariya va savollar saqlanishi tekshiriladi. **M02 navbatdagi 12 kitob hali qolgan. Merge va deploy yo‘q.**

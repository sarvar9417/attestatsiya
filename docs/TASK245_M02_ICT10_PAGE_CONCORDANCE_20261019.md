# TASK-245 — M02 6/13: ICT 10-sinf (2021), original sahifali nazariya auditi

**Manba:** Google Drive `ICT 10_sinf-2021_compressed.pdf`, ID `1KNBa9-8wlk-CV8cZPUzEqYgMsvBdZb_3`. **257 PDF sahifa**, 6 810 436 bayt; SHA256 `eee52925957b9ab8266002f51d87b72fd04ff407e9fbb9d48324e3dc6acd9cbc`.

PDF 1–40 sahifa matni chiqarildi; M02ning birinchi bobga mos **4–34 PDF sahifalari** ketma-ket ko‘rib chiqildi. Jumladan, PDF 5–6, 8, 12–14, 16–18, 24–32 betlar grafik ko‘rinishda qiyoslandi. Qolgan boblar (elektron jadvallar va h.k.) M03 va boshqa modullar mazmuni; 257 sahifaning barcha tasvirlari alohida tekshirilgan degani emas.

| Original PDF sahifa | Darslik mavzusi | Qiyoslash va M02 joyi |
|---|---|---|
| 4–7 | Kompyuter tarixidagi avlodlar, Fon Neyman sxemasi | M02.01. **PDF 6: EHM 3-avlod jadvalida 1946–1955/elektron lampa takrorlangan; rasmda integral sxema ko‘rsatilgan.** Bosma nomuvofiqlik izohlandi |
| 8–11 | Tashqi qurilmalar va printer, skaner, proyektor | M02.01 — funksiyaga ko‘ra tasnif |
| 12–15 | Birlamchi xotira, HDD/SSD, optik saqlash | M02.01 — RAM va doimiy saqlashning vazifasi farqlandi |
| 16–20 | Ichki qurilmalar, CPU va konfiguratsiya | M02.01 — ALU/CU va samaradorlik mezoni |
| 21–24 | Mobil qurilmalar texnik tavsiflari | M02.01/M02.02 — qurilma/OT ajratildi |
| 25–28 | Windows/Linux/macOS, Android/iOS; fayl tizimlari, GUI/CLI | M02.02–03. **PDF 27da “GIU” bosma xato (GUI); fayl namunasida “settings.ru”** yozilgan; Django amalda odatda `settings.py` bilan ishlaydi |
| 28–34 | Arxivlash, media ijro etish, kodek va konvertatsiya | M02.04 — 4 qatorli funksional taqqoslash, tarixiy versiya/shartlar ehtiyotkorlik bilan talqin qilindi |

**Tuzatish usuli:** kitobning bosma xatosi yashirilmadi — asl ko‘rinishi va texnik to‘g‘ri tushuncha alohida berildi. III avlod integral sxema, birinchi avlod lampa, ikkinchi avlod tranzistor bilan bog‘lanadi. Django `settings.ru` nomi Python modulining umumiy sintaksis meʼyori emas. Fayl kengaytmasini almashtirish konvertatsiya qilmaydi.

**Kod:** `src/data/topics/m02TextbookAuditICT10.ts` 4 ta manbali paket; `m02Canonical.ts` ularni 4 mavzuga bog‘laydi. **Test:** `src/tests/M02ICT10BookAudit.test.tsx`, eski M02 savol IDlari saqlanishi va jadvalning to‘g‘ri tuzilmasi tekshiriladi.

**Holat:** M02 manba auditi **6/13** darslikka yetdi; keyingisi ICT 11-sinf (2021), so‘ng Cambridge+ 5–11. Keyingi CI va autentifikatsiyali UI tekshiruvi muvaffaqiyatli bo‘lmaguncha yakuniy release holati deb qaralmaydi. Ushbu ishchi branch `main`ga hali merge qilinmagan.

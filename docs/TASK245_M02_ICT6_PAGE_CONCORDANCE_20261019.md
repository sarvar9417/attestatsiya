# M02 2/13 — ICT 6-sinf (2021): asl darslik bo‘yicha qamrov va aniqlashtirish

**Asl manba:** `ICT 6_sinf-2021_compressed.pdf`, Google Drive ID `1e7ogcVQypNmSVdnqSZqI5ZqhWLP964vq`. **160 PDF bet**, 3 970 090 bayt; SHA-256 `f0db8899cefcb88a10a91cc9aa46e8672644a789b2a8a2daece7058ea50c2c21`. PDF sahifa raqami bu nashrda ko‘rsatilgan bosma raqamga teng.

Mundarija va 160 betning kompyuter/OT/fayl/dastur iboralari tekshirildi. M02 bilan tutashgan **PDF 49–75 va 114–126** sahifalari ketma-ket o‘rganildi; **PDF 49, 62, 70–72, 74–75, 117, 119–120** sahifalari vizual sahifa tuzilmasida ham qiyoslandi. Bu har bir sahifadagi har bir rasm ekspert ko‘rigidan o‘tdi degani emas.

| Original sahifa | Asosiy mazmun | Kanonik xarita |
|---|---|---|
| 1–48 | Scratch obyektlari va algoritmlar | M06/M07, M02ga ko‘chirilmaydi |
| 49–69 | MS Word, kolontitul, shakl, jadval, matn | M03; PDF 62da OT–Office ilovasi farqi uchun M02.04 |
| 70–71 | Hujjatni himoyalash, printer tanlash va sahifalar | M03/M13; qurilma va chop oynasi farqi M02.01 |
| 71–72 | Gipermurojaat: tashqi fayl, veb, hujjat ichidagi joy, email | M03; mahalliy fayl yo‘liga bog‘liqlik M02.03 |
| 73–75 | Word mashqlari va faylni saqlash, parol | M03/M13; M02.03 fayl manzili bilan bog‘lanadi |
| 76–113 | Internet, qidiruv, email, ijtimoiy tarmoqlar | M01/M12/M13, M02ga to‘liq ko‘chirilmaydi |
| 114–118 | Audio/video formatlari va dastur asboblari | M01.06/M10, M02ga faqat dastur sinfi bog‘lanadi |
| 119–120 | Windows 7 ovoz yozgichi, Media Player | M02.02 va M02.04, **OT ≠ media ilova** |
| 121–127 | Media kodek va format konvertatsiyasi | M01.06/M10, M02ning o‘rnini bosmaydi |
| 128–160 | PowerPoint, taqdimot, amaliy topshiriqlar | M03, M02ga to‘liq ko‘chirilmaydi |

**4 sahifali aniqlashtirish** `src/data/topics/m02TextbookAuditICT6.ts` ga kiritildi, `m02Canonical.ts` orqali to‘rtta mavzuga ulandi. Saqlangan tarixiy 2016-yil Office statistikasi bugungi raqam sifatida ishlatilmaydi. Windows 7 menyulari tarixiy namuna; dastur va OT farqi, havola bilan asl fayl farqi, fizik printer bilan Print muloqot oynasi farqlari ajratildi.

**Test:** `src/tests/M02ICT6BookAudit.test.tsx`. **Audit 2/13**, keyingi manba **ICT 7-sinf (2021)**. Spetsifikatsiya bilan mos M02 fan qismida **2 savol**, ofis dasturlari bo‘yicha qolgan **5 savol** alohida M03 doirasida. **Yangi branchda; merge yoki deploy tasdiqsiz bajarilmaydi** (foydalanuvchining ushbu sessiyadagi merge roziligi oldingi tayyor branchlarga taalluqli).

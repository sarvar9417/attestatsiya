# TASK-244 Cambridge+ 7-sinf: M01 manba auditi

**Kitob:** 10/13. **Sana:** 2026-10-19. **Google Drive:** `7-sinf informatika (Cambridge +)_compressed.pdf`, ID `1RhIRuHi8i7i18mkrd3eQQt2lJrbnfCkS`. **147 PDF bet, 2 269 916 bayt**, SHA256 `90b5081bc8a10c92fd07e84a89bf88e944f7102efbfbb2d3bee813dad3ffcb77`. Cambridge ICT Starters «On Track Stage 1» asosidagi 2021 o‘zbek nashri. PDF raqami = bosma bet + 3.

## Bir kitobdan modullarga aniqlik bilan ajratish

Mundarija va 147 sahifaning matni inventarlandi. Asosiy boblar: PDF 9–38 **matnli hujjat** (M03), 39–65 **multimedia taqdimot** (M03/M10), 66–101 **elektron jadval** (M03), 102–139 **maʼlumotlar bazasi** (M09); so‘ng glossariy. **M01 konstruktiga bevosita daxldor PDF 9–10, 36–41, 61–64, 117–118** mazmuni qiyoslandi, tanlangan rasm/jadvallar vizual ham tekshirildi. Barcha 147 bet alohida rasm ekspertizasidan o‘tdi deyilmaydi.

| PDF sahifa | Asl darslikdagi dalil | M01 va boshqa modullarning chegarasi |
|---:|---|---|
| 9–10 | Hujjatni auditoriyaga mos qilish | M01.04 axborot taqdimoti, amaliy Word M03 |
| 36–38 | Ota-onalar uchun internetdan xavfsiz foydalanish qo‘llanmasi | M01.04 auditoriya/maqsad, formatlash M03 |
| 39–41 | Multimedia maqsadi, manba tanlash va rejalar | M01.04, multimedia muallifligi, dastur interfeysi M03 |
| 42–60 | PowerPoint slayd/animatsiya amallari | M03, M01ga to‘liq ko‘chirilmagan |
| 61–64 | Internetdan tasvir va axborotdan foydalanish, havola | M01.04 mualliflik/litsenziya |
| 65–101 | Excel formulalari, modellash va format | M03 |
| 102–116 | Access/maʼlumotlar bazasi va testlash | M09 |
| 117–118 | Raqamli iz, maʼlumot xavfsizligi, read-only/write va view-scope | M01.04 tamoyil, konkret DB rollari M09 |
| 119–147 | Import/eksport, Access va glossariy | M09/M03 va terminlar |

## Kiritilgan 3 ta original sahifali nazariya paketi

1. M01.04 — **PDF 9–10 va 36–41**: maqsad, auditoriya, kontent va o‘qilish qulayligi; ota-onalar qo‘llanmasi misolida.
2. M01.04 — **PDF 39–41, 61–64**: manba havolasi, ruxsat, litsenziya va mualliflik; ochiq rasmni har doim nusxalash mumkin emas.
3. M01.04 — **PDF 117–118**: **Read only** faqat tahrirni, **view scope** esa maydon/yozuvning ko‘rinish doirasini cheklaydi; har ikkalasi mustaqil.

**Kod:** `src/data/topics/m01TextbookAuditCambridge7.ts`, test `src/tests/M01Cambridge7BookAudit.test.tsx`; barcha M01 additions **43 ta** (32 ICT + 4 Cambridge5 + 4 Cambridge6 + 3 Cambridge7). Generated M01 asl bloklari va savollar saqlanadi.

**Next:** Cambridge+8. Yakuniy CI va authenticated mobile/desktop learner QA hali zarur. **Merge, production deploy va production DB yozuvi qilinmadi.**

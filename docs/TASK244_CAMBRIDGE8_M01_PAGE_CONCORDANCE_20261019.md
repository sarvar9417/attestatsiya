# TASK-244 — Cambridge+ 8-sinf: M01 manba-sahifa qiyosi

**Tartib:** 11/13 kitob. **Sana:** 2026-10-19. Original Google Drive PDF `8-sinf informatika (Cambridge +)_compressed.pdf`, ID `1hZyLM5n0OUtuJI3M3dFeAz8kyv9Sr6Ng`. **153 sahifa, 2 767 802 bayt**, SHA256 `8fed0f2cd0accdb23c8908171f3d840adab6c270aa646b017c59786fb064ceab`. Cambridge ICT Starters «On Track Stage 2» 2021-yilgi o‘zbek nashri; tegishli sahifalar bo‘yicha PDF = bosma +3.

## Kitobning M01dan tashqaridagi modullari

153 PDF sahifaning mundarija/bo‘lim va matn xaritasi tuzildi. PDF 9–56 **Scratch dasturlash** (M06/M07), 57–90 **HTML va veb-sayt dizayni** (M11), 91–113 **kompyuter tarmoqlari** (asosan M12/M13), 114–144 **animatsiya/video** (M10), qolgan sahifalar glossariy/nashr. M01ga faqat umumiy **axborotli aloqa**, **raqamli xavfsizlik** va **rastr/video/tovush modeli** tegishli. Tegishli bo‘limlar sahifalab o‘qildi, tanlangan sxema/rasmlar grafik shaklda ham solishtirildi; barcha 153 sahifaning vizual ekspertizasini daʼvo qilmaymiz.

| PDF sahifalari | Asl kitobda nimaga bag‘ishlangan? | M01ga kiritilgan yoki chiqarilgan qism |
|---|---|---|
| 57–70 | Veb-kontent, HTML, rastr va piksel, rasmlar o‘lchami | Piksel/rang M01.06da mavjud; HTML va dizayn M11 |
| 71–90 | Matn rangi, veb-sahifa, havola va ro‘yxatlar | Accessibility M01.04da mavjud; CSS M11 |
| **91–95** | **Tarmoq, PAN/LAN/WAN, Internet/WWW** | M01.04da 5 qatorli jadval; texnik infrastruktura M12 |
| 96–105 | Hub, switch, router, server, kabel va tarmoq loyihasi | M12; umumiy aloqa modeli M01da mavjud |
| **106–113** | **Kirish huquqi, boshqaruv, malware, firewall** | M01.04da xavfsizlik qatlamlari uchun 4 qatorli jadval; texnik boshqaruv M12/M13 |
| **114–117** | **Storyboard, video, animatsiya maqsad va auditoriyasi** | M01.06da rejalash/kadr/timeline farqi |
| **124** | **Rastr piksel, animatsiyada qatlam** | M01.06 media modeli |
| **134–142** | **Kadr tartibi, soundtrack, mualliflik, ovoz qo‘shish va auditoriya** | M01.06da mualliflik va 4 qatorli taqqoslash; konkret Pencil2D/Audacity UI M10 |
| 143–153 | Media mashqlar, glossariy | Media misollari M10ga tegishli |

## Uch original sahifa-manzilli o‘zgarish

1. `M01.04` **PDF 91–95**: Internet ≠ WWW; PAN/LAN/WAN geografik/doiraviy farqi va email/web infratuzilmasi.
2. `M01.04` **PDF 106–113**: malware, firewall, kirish huquqlari va dastur yangilashning o‘zaro to‘ldiruvchi himoyasi; bitta vosita mutlaq himoya emas.
3. `M01.06` **PDF 114–117, 124, 134–142**: storyboard, kadr, timeline, soundtrack va mualliflik ruxsati; tarixiy ilova UI amallarini universal bilim deb ko‘chirmadik. Darslikdagi «10–30 minutlik reklama» loyihasi doimiy sifat standartiga aylantirilmagan.

**Kod:** `src/data/topics/m01TextbookAuditCambridge8.ts`. **Test:** `src/tests/M01Cambridge8BookAudit.test.tsx`. **11/13 kitob, jami 46 source-backed qo‘shimcha**. Original M01 content va savollar saqlanadi. **Next Cambridge+ 9-sinf.** Merge/deploy/prod database write yo‘q. Yakuniy CI va real learner UI QA talab etiladi.

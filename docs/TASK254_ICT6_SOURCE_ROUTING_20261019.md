# TASK-254 — 6-sinf ICT/Cambridge+ darsliklarini modulga to‘g‘ri yo‘naltirish

**Sana:** 2026-10-19. **Status:** REVIEW / boshlang‘ich manba xaritasi; bu hujjat **to‘liq sahifama-sahifa audit, test savollari ekspertizasi yoki publication approval emas**.

## Tekshirilgan asl manbalar

1. **Fayziyeva va boshq., Informatika va axborot texnologiyalari, 6-sinf, Toshkent, 2021 (160 bet)** — Google Drive ID: `1e7ogcVQypNmSVdnqSZqI5ZqhWLP964vq`. Mundarija va 1-darsning boshlang‘ich materiallari matn ko‘rinishida tekshirildi. Kitobning boblari: I Scratch/dasturlash (bosma 5–47); II matn protsessori (50–74); III internet va pochta (77–107); IV audio/video (115–126); V taqdimot (129–155).
2. **Ellis, Lawrey, Dickinson, Informatika va axborot texnologiyalari, 6-sinf, Cambridge moslashtirilgan nashr, 2021** — Google Drive ID: `1sdG2X5bgWXdKDPTCb9zY03SeaJuGxO4l`. Mundarija va birinchi modul kirishi o‘qildi: hujjatlar (bosma 6), tasvirlar (28), elektron jadvallar (48), MB (84), dasturlash (122), internet (159), email (178), multimedia (206).

## Darslik → attestatsiya moduli xaritasi

| Darslik va bosma betlar | Mavzu | Kanonik modul | Chegara |
|---|---|---|---|
| ICT 6, 5–47 | Scratch chiziqli/tarmoqlanuvchi/takrorlanuvchi dasturlar, sprayt va animatsiya | **M07** (asosiy), M06 (algoritm tushunchasi) | M02 apparat/OT mavzusiga qo‘shilmasin |
| ICT 6, 50–74 | Matn protsessori, kolontitul, havola, formula | **M03** | Fayl-amallar tushunchasi M02.03 bilan faqat tushuncha darajasida tutashadi |
| ICT 6, 77–107 | Internet qidiruvi, pochta, mualliflik va xavfsizlik | **M12**, **M13** | M01 raqamli madaniyat bilan kesishish aniq belgilansin |
| ICT 6, 115–126 | Audio/video va format o‘zgarishi | **M10** | Fayl kengaytmasi M02.03da umumiy izoh sifatida qolishi mumkin |
| ICT 6, 129–155 | Taqdimot, dizayn, media, animatsiya | **M03** | M10 bilan multimediaga oid chegaralar saqlansin |
| Cambridge+ 6, 6–27 | Hujjatga qayta ishlov, auditoriyaga moslash | **M03** | Asl matnni formatlash bilan fayl tizimini bir xil tushuncha qilmang |
| Cambridge+ 6, 28–47 | Tasvirga qayta ishlov | **M10** | |
| Cambridge+ 6, 48–83 | Elektron jadval | **M03** | |
| Cambridge+ 6, 84–121 | Ma’lumotlar bazasi | **M09** | |
| Cambridge+ 6, 122–158 | Dasturlash | **M06/M07** | Muayyan dasturlash muhitini sahifa bo‘yicha aniqlash lozim |
| Cambridge+ 6, 159–177 | Internet | **M12/M13** | |
| Cambridge+ 6, 178–205 | Elektron pochta | **M12/M13** | |
| Cambridge+ 6, 206–226 | Multimedia | **M10** | |

**Sahifalar** — darslikda bosilgan sahifa raqamlari va mundarija ko‘rsatkichlari; **PDF indekslari sifatida talqin qilinmasin**.

## Bitta manbali fakt tekshiruvi (ICT 6, bosma 5–8)

- Chiziqli algoritm: amallar shartsiz, ketma-ket bajariladi.
- O‘zgaruvchi dastur bajarilishida qiymati o‘zgarishi mumkin bo‘lgan kattalik, o‘zgarmas esa o‘z qiymatini o‘zgartirmaydi.
- Scratch `Variables` → `Make a Variable`: `For all sprites` va `For this sprite only` ko‘lamlari farqlanadi.
- Kvadrat misolida, tomon `a` bo‘lsa, yuzasi `a*a`, perimetri `4*a` (Scratch ko‘paytirish bloki); qiymatni so‘rash va o‘zgaruvchiga o‘tkazish bosqichlari darslikdagi vizual skript bilan keyingi grafik auditda qiyoslanishi shart.
- 2-amaliy mashqda samolyotning ikki segment vaqti `t1=s1/v1`, `t2=s2/v2`, umumiy vaqt `t=t1+t2` ma’nosi tekshiriladi; masala sharti `s1=1440 km`, `v1=800 km/soat`, `s2=510 km`, `v2=850 km/soat`. Hisob: `t=1440/800+510/850=2.4 soat`. M07/M06 manbasiga mos amaliy misol, M02ga tegishli emas.

## Keyingi qat’iy tekshiruv darvozalari

1. Ikki PDFning barcha **tegishli** sahifalarini bittalab o‘qish, rasm/blok/diagrammani ham qiyoslash; o‘qilmagan sahifaga audit statusini bermaslik.
2. Har tushunchaga `book_id`, **bosma bet**, **PDF bet**, modul, topic ID va material turi (`theory/test`) biriktirish.
3. M02 kanonik 4 mavzu bilan haqiqiy o‘xshash qismlarnigina ko‘rib chiqish; boshqa modullarni shu yo‘nalishga majburan ko‘chirmaslik.
4. M03/M06/M07/M09/M10/M12/M13 uchun mavjud nazariya, 2026 spetsifikatsiyasi, test savoli/javob/distraktorlar va UI renderini alohida tekshirish.
5. O‘zgarishlarni CI, source-trace, savollar yaxlitligi, desktop/mobile vizual tekshiruvlardan o‘tkazmasdan release-ready deb belgilamaslik.
6. **Bu ish faqat repo hujjati; na production data publication, na deploy ruxsat etilgan.**

## Manba havolalari

- [ICT 6-sinf, 2021](https://drive.google.com/file/d/1e7ogcVQypNmSVdnqSZqI5ZqhWLP964vq/view)
- [Cambridge+ 6-sinf, 2021](https://drive.google.com/file/d/1sdG2X5bgWXdKDPTCb9zY03SeaJuGxO4l/view)

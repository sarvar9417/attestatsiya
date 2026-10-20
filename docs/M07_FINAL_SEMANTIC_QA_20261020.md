# M07 Scratch va LOGO — yakuniy sifat nazorati (2026-10-20)

## Audit chegarasi

Baza snapshotida 317 ta nashr qilingan, 14 ta review va 1 ta arxivlangan savol mavjud: 180 v2, 60 v3, 48 v3.1, 29 ta oldingi demo/rezerv savol. Tekshiruv 2026-yil spetsifikatsiyasidagi 5 Scratch/LOGO kompetensiyasi, 13.04.2026 dagi kodli LOGO namunasi, 2025-yil kuzgi demo hamda ICT/Cambridge darsliklari bilan taqqoslandi.

## Tuzatilgan xatolar

1. **2 ta Y2 ustun xatosi:** oldingi auditda 8 ta o‘ng variant `side=b` qilib to‘g‘rilangan; ID va kalitlar saqlangan.
2. **1 ta haqiqiy mazmuniy xato:** Drive’dan olingan Scratch blok ranglari savolida `b) ovoz` o‘rniga `b) harakat` yozildi. Ko‘k — Motion; ovoz — pushti. Kalit `1–b,2–d,3–c,4–a,5–e` endi to‘g‘ri va UUID o‘zgarmadi.
3. **11 ta javobni ochib beradigan savol:** `**Shakl tasviri:** ...` satrlarida to‘g‘ri geometrik shakl yozib qo‘yilgan edi. Ushbu 11 ta satr savol shartidan olib tashlandi. Shakl natijasini ko‘rsatmaydigan **11 ta kodli SVG** yaratildi; ular aynan buyruqlarni ifodalaydi, javobni emas. Ular original Scratch bloki ekran skrinshoti emas, soddalashtirilgan kod vizualizatsiyalari.
4. **9 ta Y3 sharti:** ko‘p tartib to‘g‘ri bo‘lib qolmasligi uchun bosqichlar aniqlashtirildi. Klon haqidagi ikkita `hat` blokning alohida skriptga tegishliligi ko‘rsatildi. Kalit/option IDlari o‘zgarmadi.
5. **Yangi Y3 kartochka xatosi:** `M07-A26-14`da “to‘rtta buyruq” o‘rniga “to‘rtta kartochka” deyiladi, chunki bittasida 2 ta LOGO buyrug‘i yozilgan.
6. **12 ta murakkablik darajasi:** avvalgi bosqichda oddiy eslab qolish savollarining sun’iy 5/5 murakkabligi pasaytirilgan.
7. **Mazmunan yaqin 7 juftlik:** lokal metadata 240 savol ichida matni juda o‘xshash savollar bor; aynan bir xil stem yoki buzilgan kalit bo‘lmagani uchun tarixiy natijalar bilan bog‘langan savollar arxivlanmagan.

## Yangi 14 ta savol

12 Y1, 1 Y2, 1 Y3 savolning variantlari va to‘g‘ri kalitlari alohida hisoblash bilan qayta tekshirildi. Matematik misollar: koordinata (5;−5), yig‘indi 9, ichma-ich sikl 25, shart boshida rost bo‘lsa 0 aylanish, murakkab sikl 8, yig‘indi x=18/y=7, Pen kvadrat boshlang‘ich joyga qaytishi, 6 kesma, PU/PD 4 kesma, beshburchak 72°, broadcast-and-wait, nested LOGO rasmida B. Y2 natijalar [6,12,5,8]; Y3 qat'iy PU→FD20→LT90→[PD;FD40].

**Manba aniqligi:** `M07-A26-12` kodi 13.04.2026 attestatsiya №10 bilan bir xil konstruktsiyadan olingan. U **mustaqil original kod emas**, grafik variantlar qayta chizilgan **moslashtirma**; source_reference `ADAPTED_PAST_EXAM` qilib to‘g‘rilangan. Qolgan 13 savol mustaqil mashqlar.

## Nashr xavfsizlik shartlari

- 317 ta avvalgi nashr savollari: variantlar, javob kalitlari, izoh va manba mavjudligi hamda bir xil variantlar takrorlanmasligi SQL bilan tekshirildi; format xatolari 0.
- 14 ta yangi savol: 4 optionli Y1, to‘rt juftlikli Y2, to‘rt bosqichli Y3 va adapter qilingan manba belgisi SQL guard bilan tekshiriladi.
- Github source: 11 SVG, qat’iy allowlist, frontend unit testi; Vercel production `READY` bo‘lgach `scripts/releases/m07_20261020_attach_answer_safe_images.sql` bajariladi; undan keyin `scripts/releases/m07_20261020_publish_after_deploy.sql` bajariladi.
- Hech qaysi avvalgi attempt o‘chirilmaydi, question va option UUIDlar o‘zgarmaydi.

## Muhim cheklov

Bu har bir savolni real Scratch 3 yoki barcha klassik LOGO dialektlarida ishlatib ko‘rilgan, mustaqil inson ekspertining imzosi olingan degani emas. Demo va o'tgan attestatsiya namunalari rasmiy kelgusi testning hamma shaklini to‘liq belgilamaydi. Production real foydalanuvchi sessiyasi bilan UI smoke-test alohida tasdiqlanmaguncha bu cheklovni saqlash kerak.
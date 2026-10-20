# TASK-220 — 2025 kuzgi informatika demo, M12 uchun tasdiqlangan namuna

## Manba
- Google Drive: [2025 kuzgi demo @Informatika_fani_ustozlari.pdf](https://drive.google.com/file/d/11fCXWHUJ3j7IHz619Ja84wqbcRaraept/view)
- Fayl: 14 sahifa, skanerlangan va sahifaga tahlil izohlari joylashtirilgan; metadata `2025-11-02`.
- **11-PDF sahifa, 25-savol**, birinchi rasmdagi savol: 192.168.10.32/27 host/tarmoq manzilidan subnet maskasini aniqlash.
- Ko‘rsatilgan to‘g‘ri variant: **255.255.255.224**. Bu RFC/CIDR bit hisobiga mos.
- Fayl jamlanmasi hamjamiyat tomonidan tarqatilgan; **ruxsat beruvchi tashkilotning rasmiy imtihon savoli yoki javob kaliti ekanligi mustaqil tasdiqlanmagan**. Faqat imtihonshakl namunasiga dalil sifatida ishlatilsin.

## Matematik tekshirish
- `/27`: 27 tarmoq biti, qolgan 5 host biti.
- Maska: `11111111.11111111.11111111.11100000` = **255.255.255.224**.
- Blok hajmi: `2^5 = 32` ta jami manzil.
- 192.168.10.32/27 tarmog‘ida network **192.168.10.32**, broadcast **192.168.10.63**.
- Oddiy unicast hostlar: **192.168.10.33–192.168.10.62**, **30** ta usable.
- Demo izohidagi `32 ta` blok hajmi bilan `30 usable host` farqlansin. Ularning birini ikkinchisi bilan tenglashtiradigan savollar yoki izohlar noto‘g‘ri bo‘ladi.

## Style and format mapping
- Bir manzilli **CIDR/maska hisoblash** formatidagi Y1 savol, 4 javob.
- Chalg‘ituvchilar boshqa CIDR maskalari yoki noto‘g‘ri/uzluksiz bo‘lmagan niqoblar bo‘lishi mumkin, lekin savolning bitta aniq javobi bo‘lsin.
- M12 V2 source bankida CIDR mavzusiga mos tekshiruvlar: TAR-05-004, TAR-05-014, TAR-06-003; oldingi variantlar mavzuga aloqasiz kombinatsiya kabi chalg‘ituvchilar bo‘lsa, sifat reyestrida flagged.
- Y2 matchingda maska↔prefiks↔host hajmi tushunchalari aralashtirilmasin; Y3 uchun subnet hisoblash qadamlarining yagona mantiqiy ketma-ketligi tanlansin.
- Regression: `src/tests/m12Network2025DemoCIDR.test.ts`.

## Chegaralar
Bu audit **2025 kuzgi demo uchun M12 ga oid bitta aniq savolni** qo‘lda vizual tekshirganini tasdiqlaydi; barcha 14 sahifa, qolgan 2025 savollar yoki boshqa Drive demo jamlanmalarining 100% ko‘rilganini da'vo qilmaydi.

# TASK-252 — M01 savollaridagi qaytarilgan distractor to‘plamlari: editorial audit

Sana: 2026-10-19. Ish rejimi: **REVIEW ONLY**. Manba: `Axborot_va_axborot_jarayonlari_LaTeX/Axborot_va_raqamli_savodxonlik_400_TEST.json` (400 ta original Y1 savol), M01.02–M01.06. Production bank (570) va published revisionga yozilmagan.

## Audit metodikasi

To‘rtta variant normalizatsiya qilindi, tartibi saralandi va savollar orasida aynan bir xil distractor majmuasi borligi solishtirildi. Bu **savollarning aynan bir xil matnli dublikati** degani emas. Chiqishdagi juftliklar ekspert tahriri uchun navbatdir; joriy bankdagi savollar javobi o‘zgartirilmaydi.

## Aniqlangan editorial xavflar

- **69 juft** savolda javob variantlarining bir xil *to‘plami* bor (tartibining farqi hisobga olinmaydi). 67 juftning to‘g‘ri javob *matni* ham bir xil, 2 juftda javob boshqacha; bu avtomatik xatolik emas.
- **58 juft** `farqlash → vaziyat` shaklida: bilim darajasi o‘zgargan bo‘lsa-da, avvalgi savolning A–D variantlari qayta ishlatilgan. Xotirlab yechish va takroriy testlarda tanishib olish ta'siri bor. Test tanlov algoritmida bir imtihon sessiyasiga bunday juftliklarning har ikkalasini qo‘shmaslik yoki tahririy qayta yozish kerak; bu o‘zgarish uchun alohida coverage/sampling testi talab qilinadi.
- **11 qolgan juft** asosan sonli bir-biriga o‘xshash misollar; ayrimlarida bir xil sonli javob to‘g‘ri chiqadi, lekin shart va formula mustaqil.

### O‘xshashlik guruhlari

| Yuzaga kelgan juftlik | Soni |
|---|---:|
| `farqlash → vaziyat` | 58 |
| `Xartli → Xartli` | 1 |
| `uzatish hisoblari → uzatish hisoblari` | 1 |
| `xabar hajmi → matn hajmi` | 2 |
| `minimal kod → minimal rang chuqurligi` | 4 |
| `video bitrate hajmi → video bitrate hajmi` | 2 |
| `audio proporsiya → audio proporsiya` | 1 |
| **Jami** | **69** |

**Alohida masalalar:**
- `ARS-01-021` va `ARS-01-041`: informatika atamasi — ta'rif va vaziyat uchun to‘rttala variant bir xil.
- `ARS-04-038` va `ARS-05-027`: 4096 belgi, 1 B/belgi, to‘g‘ri javob 4 KiB; ikki turdagi savolda bir xil hisob.
- `ARS-04-041` va `ARS-04-042`: shart va birliklar boshqa, ammo ikkala hisob 32 sekund natija beradi; bir xil javob to‘plami.
- `ARS-05-075` va `ARS-05-076`: turli bitrate/davomiylik — 450 MB.
- `ARS-05-096` va `ARS-05-098`: bir xil variantlar, **har xil** to‘g‘ri javob. Bunday holatni avtomatik duplicate-deletion qilish xato bo‘ladi.
- `ARS-04-032` va `ARS-04-033`: Xartli savollarida 1 bit va 2 bit — bir xil variantlar, **har xil** to‘g‘ri javob.

## Tavsiya etilayotgan xavfsiz nazorat

1. Test algoritmida bir xil variantlar majmuasiga ega **bir mavzu** savollari bir imtihonga tushishini kuzatuvchi review-only coverage hisobot qo‘shish.
2. **Aynan bir xil stem/answer** takrori, bir xil distractor seti va o‘xshash formula namunalarini alohida kategoriyada sanash. `69` ni avtomatik `69 ta xato` deb atamaslik.
3. Savolning yangi revisioni uchun darslik/bet, spetsifikatsiya konstrukti, aniq javob, va distractor sifati ekspert tomonidan tekshiriladi. AI bankini avtomatik `published` qilish mumkin emas.
4. Hozirgi 81 + 84 = **165** mustaqil arifmetik test tekshiruvi javoblarning sanog‘i bo‘yicha QA; qolgan 235 savolning to‘liq semantik/evidence sign-offi emas.

### Source caveat

5–11 sinf ICT/Cambridge+ darsliklarining mavzu-bet xaritalari `docs/TASK244_GRADE*_AUDIT.md` va M01 teoriya materialida mavjud. Mazkur audit **item-level human approval** deb qabul qilinmaydi.

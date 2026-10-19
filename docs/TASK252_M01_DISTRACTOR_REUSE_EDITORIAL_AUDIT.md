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


## 58 item-level review register

`docs/audits/TASK252_M01_58_ITEM_SOURCE_REVIEW.tsv` lists **all 58** definition/application pairs by both IDs, exact target concept, unchanged keyed labels, candidate book, printed-page window, evidence strength and editorial note. Candidate book distribution after original-PDF spot verification: ICT5 **8**, ICT6 **8**, ICT7 **22**, ICT9 **1**, Cambridge+9 **3**, Cambridge+10–11 **12**, **four** with no precise page verified. At most **54/58** have a candidate topic/page; this is not item-level answer verification.

- **TOPIC_OBSERVED**: the textbook topic was observed; the *individual answer* has **not** been expert-approved.
- **RELATED_ONLY**: thematic connection, not an exact proof for this answer.
- **OPEN**: no exact textbook page verified, do not cite it as evidence.
- **HIGH**: five stems (`ARS-01-042`, `ARS-01-043`, `ARS-01-049`, `ARS-02-037`, `ARS-03-047`) need special disambiguation before any new published revision.

`src/tests/M01ItemSourceReviewRegistry.test.ts` validates the register against the authoring bank, including source page candidates and review flags. `src/tests/M01DistractorReuseEditorialGate.test.ts` now sets **upper limits** rather than demanding exactly 69/58 reused distractors: a future approved editorial correction that *reduces* repetition must not fail the regression gate. The register itself must be updated whenever a new approved revision changes a pair.

**Gating:** none of the 58 entries has `expert_approved` status. No change to the original question bank, private KTD, learner API, published keys, or production database.


## 2026-10-19 — original darslikning HIGH item evidence refinement

- `ARS-01-049`: **ICT9, bosma 20–22-bet**. Original 9-sinf darsligi, “Model va uning turlari” (20-bet) obyektni o‘rganilayotgan narsa yoki jarayon sifatida **bevosita ta’riflaydi**. Oldingi `NONE_VERIFIED / OPEN` yozuvi `ICT9 / TOPIC_OBSERVED`ga o‘zgartirildi. Bu “maktab kutubxonasi” jumlasida yagona to‘g‘ri javob mavjudligini isbotlamaydi; savolni qayta yozish hanuz HIGH. Spetsifikatsiyaning S1 axborot tushunchalari ro‘yxatida “obyekt” alohida ko‘rsatilmagan; S1 mosligi **bilvosita**, prioritetni ekspert belgilaydi.
- `ARS-01-043`: **ICT7, bosma 4–8 va 29–33-bet**. 6-betda diskret/raqamli axborot va qurilmalar, 29–33-betlarda rastr/RGB tushunchalari mavjud; elektron imzo bilan skanerlash AKTga ham taalluqli, shuning uchun hozirgi distractor bilan one-best-answer tasdiqlanmagan.
- `ARS-03-047`: **ICT7, bosma 4-bet** axborotni yaratish, yig‘ish va qayta ishlashni alohida jarayonlar sifatida sanaydi; `RELATED_ONLY` → `TOPIC_OBSERVED` manba darajasi yangilandi. Hisobot yozish amalda qayta ishlash ham bo‘lishi mumkin, savol kalitini human expert tasdiqlashi shart.
- `ARS-01-042`: Cambridge+10–11 kirishida AKTga oid ko‘nikmalar aytiladi, lekin AKTni raqamli texnologiyadan **bittagina to‘g‘ri javob bilan farqlatadigan aynan ta’rif** aniqlanmadi.
- `ARS-02-037`: ICT7 26–38-betlarda media shakllari ko‘rsatiladi, lekin “kombinatsiyalashgan axborot”ning aynan o‘sha nomli ta’rifi topilmadi. Cambridge+10–11 dagi “statik/dinamik ma’lumot” esa ko‘proq sahifa mazmunining manba o‘zgarishiga qarab yangilanishini ifodalaydi; “ovoz dinamik” bilan bir ma’noda ishlatib bo‘lmaydi. **Termin dalili / distractor ambiguity OPEN**.

**Asl PDF manbalari:** [ICT7](https://drive.google.com/file/d/1QMT7y-6nJLQ-f1-4SySBV8y8JrRpp4q-/view), [ICT9](https://drive.google.com/file/d/1scsbz-Lgfy6_xAUrO_YVCfNE5KmV1qMe/view), [Cambridge+10–11](https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view), [2026 specs](https://drive.google.com/file/d/1jJstcqgFXwTJKuH9bkRIpvATEsjM2UnQ/view).

`TOPIC_OBSERVED` only attests the discussed **concept** exists in a source page; the wording, keyed answer, official blueprint fit and four distractors remain under human editorial review. No production DB, published question or learner-visible content changed.

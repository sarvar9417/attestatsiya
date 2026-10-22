# TASK-529 — 8 ta Office REVIEW savolining darslik manbasini mustaqil tekshirish (2026-10-22)

## Qamrov va metod
Productiondagi TASK-427 orqali yaratilgan 8 ta `S2.OFFICE` Y1 tahrirning **manba da’volari** foydalanuvchi yuklagan PDF darsliklarning bevosita matni va tegishli sahifalarining ko‘rinishi asosida tekshirildi. [Tuzilgan dalillar reyestri](quality/task529_office_source_evidence.json) har bir original savol UUIDsi bo‘yicha saqlanadi. **Manbaga havola borligi mavzu aynan shu sahifada ekanini anglatmaydi.**

PDF sahifa raqami va kitobning bosma raqami ajratib ko‘rsatildi. Ma’lumotlar o‘quv manbalaridan **parafraz** qilindi; o‘zgartirilgan savol javoblari avtomatik ravishda mustaqil ekspert tasdig‘iga tenglashtirilmaydi.

## Natijalar
| Original UUID (qisqa) | Savol | Bevosita tekshirilgan sahifa | Dalil holati |
|---|---|---|---|
| `cd772e39` | Excel shartli formatlash | 7-sinf Cambridge PDF 95–96, bosma 92–93 | **Tushuncha va Less than qoidasi tasdiqlandi**; 50 soni vaziyat parametri |
| `813fb43d` | Word Mail Merge, sertifikat | 7-sinf Cambridge PDF 121–122, bosma 118–119 | **Tushuncha tasdiqlandi**, lekin eski source_reference CAM7 6–35 oralig‘i **mos kelmaydi** |
| `dd8d8ed0` | Word bir sahifa Landscape | 7-sinf Cambridge PDF 27–28, bosma 24–25 | Faqat **sahifa orientatsiyasi** tasdiqlandi; manbada `Apply to Selected text` usuli berilgan, `Section Break (Next Page)` ikki marta qilish bevosita tasdiqlanmagan |
| `a88f3eab` | PowerPoint Entrance va Transition | ICT 6 (2021) PDF 151–152 | Animatsiya va slayd o‘tishi farqi tasdiqlandi; aynan Fade nomi shu betlarda mustaqil topilmadi |
| `15599f0c` | Enter va Shift+Enter | — | **Dalil yetarli emas**; original manba sohasi ochiq |
| `5672ac57` | PowerPoint avtomatik 15 sekund | ICT 6 (2021) PDF 151–152 | O‘tish va vaqt sozlamasi farqi tasdiqlandi; 15 sekund vaziyat parametri |
| `939fc993` | Excel SUM va COUNTIF | 10–11-sinf Cambridge PDF 134–135, bosma 125–126 | **COUNTIF shartli sanash** va SUM / SUMIF farqi tasdiqlandi |
| `d53d3cfc` | Excel katagida `#####` | 10–11-sinf Cambridge PDF 114, bosma 105 | **Faqat ustun kengligini o‘zgartirish** ko‘rsatilgan; aynan `#####` alomati manbada tasdiqlanmagan |

**Ehtiyot chorasi:** 5 ta savolning asosiy nazariyasi darslikda tekshirildi (shartli formatlash, Mail Merge, ikki PowerPoint savoli, COUNTIF). Bitta Word savoli qisman qo‘llab-quvvatlandi; ikkitasi uchun aynan nazarda tutilgan hodisa/klavish dalili yo‘q. Qisman tasdiqlangan yoki manbasi mos kelmaydigan savollar avtomatik learner publication uchun ruxsat hisoblanmaydi.

## Muammo va keyingi ish
1. Mail Merge `source_reference`dagi CAM7 6–35 oralig‘i dalil topilgan 121–122-sahifaga mos emas. Asl published savolni **joyida tahrirlamasdan**, yangi versiyada manbani qayta tekshirib tasdiqlash kerak.
2. Wordning bir sahifalik Landscape yechimi texnik jihatdan Section Break orqali bajarilishi mumkin, ammo ko‘rilgan Cambridge betlari boshqa — tanlangan matnga orientatsiyani qo‘llash — usulni ko‘rsatadi. Testning to‘g‘riligini boshqa ishonchli manbada asoslash yoki savolni manbaga mos qayta ifodalash kerak.
3. Word Enter/Shift+Enter va Excel `#####` uchun **aniq manba betlari**ni aniqlash zarur.
4. TASK-427dagi 8 ta `review` versiya **review** bo‘lib qoladi; ekspert tasdig‘ini yoki qayd etilgan aniq owner-authorized waiver mavjudligini tekshirmasdan productionga nashr qilib yuborilmaydi.
5. To‘g‘ri javob kalitlari, 8 original published versiya va 4 ta tarixiy exam item o‘zgartirilmaydi.

## Tekshirish
`src/tests/task529OfficeSourceEvidence.test.ts` son, status va source UUID invariantini saqlaydi. Ushbu PR **faqat hujjat va tekshiruv kodi**; Supabase migratsiyasi, Vercel deployment, test javoblari yoki learner kontenti o‘zgarmaydi.

**Handoff:** Task TASK-529; natija: 8 ta source dossier; o‘zgargan fayllar: `docs/quality/task529_office_source_evidence.json`, shu Markdown va test; migratsiya: yo‘q; qolgan xavf: 3 ta full-source blocker, 1 ta source_reference mapping drift; keyingi ish: issue #525.

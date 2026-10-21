# Pedagogika sifat nazorati — 2026-10-21, mustaqil tahrir bosqichi

## Aniq mazmuniy nuqsonlar

1. `7782afd8-62e4-4acc-bbf5-2e9e2946f649` — musiqa darsidagi «xatoni topish» mashg‘uloti didaktik o‘yin bo‘lishi uchun o‘yin qoidasi, jamoalarning navbati va ball berilishi ochiq ko‘rsatilishi lozim edi. Savol sharti, izoh tuzatildi. Joriy to‘g‘ri javob UUIDsi saqlandi.
2. `b3296a52-f20d-4f56-93f9-0b3f6cd18da9` — evristik va masofaviy ta’limning umumsalbiy ko‘rinishdagi «kamchiliklari» ilmiy jihatdan noaniq edi. Ikkita aniq kontekstga xos tashkiliy cheklov bilan almashtirildi, to‘rtta variant qayta yozildi va izoh asoslandi.

Original javoblar/IDs, tarixiy topshiriqlar va manba metama'lumotlari saqlandi. Ikkita yuqori xavfli `ambiguous_pedagogy_key` sifat topilmasi **aniq mazmuniy tuzatish va 4/4 variant validatsiyasidan keyin** `resolved_at` bilan yopildi. Uchinchi shaxs ekspert imzosi haqida da’vo qilinmadi.

SQL: `supabase/maintenance/20261021_fix_two_ambiguous_pedagogy_keys.sql`; qayta bajariladigan asosli rezolyutsiya: `supabase/maintenance/20261021_record_two_ambiguity_fixes.sql`.

## Nashrda ko‘rsatilgan savollar: yaxlitlik tekshiruvi

2026-10-21 Supabase `plyqezulrfowyblsfpzy` bo‘yicha:

| Savol formati | Nashrdagi soni | Buzilgan kalit yoki variant |
|---|---:|---:|
| Y1 | 809 | 0 |
| Y2 | 14 | 0 |
| Y3 | 16 | 0 |
| **Jami** | **839** | **0** |

Y1: 4 ta turlicha variant, kalit tanlagan option ID mavjud. Y2: 4 tadan chap/o‘ng element, har bir juftlik mavjud UUIDga bog‘langan. Y3: 4 ta turlicha element, kalitda 4 ta tartiblangan, takrorlanmagan mavjud ID bor. O‘quvchiga ko‘rinadigan stem ichida manba yorliqlari qidiruvi ham 0 natija berdi.

Doimiy SQL: `supabase/tests/pedagogy_published_y1_y2_y3_integrity_qa.sql`, productionda o‘tkazilganda xatolik qaytmadi.

## 13 ta Y3 savolda tartiblash mezonining aniqligi

16 ta faol Y3 stemning 13 tasida ishning **qayerdan boshlanishi va qayergacha davom etishi** ochiq ifodalanmagan. Har birining aniqroq matni alohida ID bilan saqlandi. Tarixiy published savollar o‘zgartirilmagan.

Manba va yangilangan nusxa ma'noli javoblar tartibini UUID remapping orqali **aynan bir xil** saqladi:
- 13/13 da eski published va yangi draft alohida;
- 13/13 da 4 ta turlicha element;
- 13/13 da to‘g‘ri tartibning tanlangan javob matnlari izchil bir xil;
- 13/13 da savol sharti aniqroq.

SQL: `supabase/maintenance/20261021_stage_13_clear_pedagogy_y3_prompts.sql`
QA: `supabase/tests/pedagogy_y3_13_clarification_lineage_qa.sql`.

**Chegara:** Y1/Y2/Y3 strukturaviy yaxlitlik tekshiruvi barcha nazariy tasniflar to‘g‘riligini yoki rasmiy inson ekspertizasi o‘tkazilganini anglatmaydi. Eski savollarning tarixiy natijalariga tegmasdan, sifatli nusxalar nashrga chiqarilishi uchun loyihaning belgilangan xavfsiz almashtirish tartibi saqlanadi. `PEDAGOGY_RELEASE_FREEZE.md` bo‘yicha oraliq merge yoki production Vercel deploy qilinmaydi.

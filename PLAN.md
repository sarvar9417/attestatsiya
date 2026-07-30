# Attestatsiya platformasi — to'liq arxitektura

## Stack
- React + Vite + TypeScript strict
- Supabase Auth + PostgreSQL (plan)
- localStorage (hozir) → Supabase (keyin)

## 16 bo'lim (CONTENT_BLUEPRINT.md asosida)

| # | Kod | Nomi | Section | Imtihon |
|---|------|------|---------|:-------:|
| 1 | M01 | Axborot va raqamli savodxonlik | specialty | 3 |
| 2 | M02 | Kompyuter tizimlari va dasturiy muhit | specialty | 2 |
| 3 | M03 | Microsoft Office | specialty | 5 |
| 4 | M04 | Mantiqiy fikrlash va modellashtirish | specialty | 3 |
| 5 | M05 | Sanoq sistemalari | specialty | 2 |
| 6 | M06 | Algoritmlash | specialty | 3 |
| 7 | M07 | Scratch va LOGO | specialty | 3 |
| 8 | M08 | Python va JavaScript | specialty | 3 |
| 9 | M09 | MB, MS Access va SQL | specialty | 2 |
| 10 | M10 | Kompyuter grafikasi va media | specialty | 2 |
| 11 | M11 | HTML va CSS | specialty | 3 |
| 12 | M12 | Kompyuter tarmoqlari va internet | specialty | 2 |
| 13 | M13 | Axborot xavfsizligi va raqamli xizmatlar | specialty | 2 |
| 14 | M14 | Kasb standarti | professional_standard | 5 |
| 15 | M15 | Umumiy pedagogika | pedagogy | 7 |
| 16 | M16 | Informatika o'qitish metodikasi | methodology | 3 |
| | | **Jami** | | **50** |

## Blueprint
- 35 specialty + 5 professional_standard + 7 pedagogy + 3 methodology = 50
- 8 knowledge + 35 application + 7 reasoning = 50
- 120 daqiqa, 2 ball × 50 = 100 ball

## Foydalanuvchi yo'li
```
Ro'yxatdan o'tish → Dashboard → Bo'lim tanlash → Mavzular → Test → Keyingi mavzu
                                                          ↓
                                            Attestatsiya sinov imtihoni (50 savol)
```

## Mavzu sahifasi
1. Nazariya (definition, formula, code, example, note, table)
2. Test (Y1 single choice, Y2 matching, Y3 ordering)
3. Natija ≥80% → keyingi mavzu

## Quiz turlari
- Y1: Single choice — 4 variant, 1 to'g'ri
- Y2: Matching — chap/o'ng elementlarni moslash
- Y3: Ordering — elementlarni tartibga keltirish

## Imtihon
- `/exam` — 50 savol, 120 daqiqa, BLUEPRINT bo'yicha
- Timer, flag, savol navigatori
- Natija: section/module/cognitive kesimi

## Keyingi qadamlar
1. Testlar (Vitest + Playwright)
2. Supabase migration (localStorage → PostgreSQL)
3. Content workflow (draft→review→publish)
4. Mastery + SRS
5. topicContent.ts ni to'liq to'ldirish

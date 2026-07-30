# 05 — Frontend

## Dizayn yo'nalishi

**Kim uchun:** 25–60 yoshli informatika o'qituvchilari, ko'pi arzon Android
telefonda, ko'pi sekin internetda, viloyatlarda. Ular uchun bu sinov jiddiy —
oylik va toifa unga bog'liq.

**Sahifaning yagona vazifasi:** qo'rqinchli rasmiy spetsifikatsiyani
o'zlashtirsa bo'ladigan, bo'lakka bo'lingan narsaga aylantirish.

**Vizual manba:** spetsifikatsiya hujjatining o'zi — jadval, kvota, kod
(`S3.NUM.02`), ball chegarasi. Va o'zbek kulolchiligining kobalt ko'ki
(Rishton, G'ijduvon) — oq ustiga ko'k, aniq va sovuq emas.

**Nima qilmaslik kerak:** issiq krem fon + serif sarlavha + terrakota urg'u.
Bu AI dizaynining eng tanilgan shabloni va bu brifga aloqasi yo'q.

### Ranglar

```css
--siyoh:     #14213D;   /* matn, sarlavha */
--qogoz:     #F7F8FA;   /* sahifa foni, sovuq oq */
--sirlangan: #1B5E9E;   /* asosiy: havola, faol holat, tugma */
--zar:       #C77D0A;   /* diqqat: jarayonda, muddati kelgan */
--yashil:    #256B54;   /* o'zlashtirildi */
--qizil:     #A8322D;   /* xato, o'tmadi */
--chiziq:    #DDE1E8;   /* hairline chegara */
--kul:       #6B7280;   /* ikkilamchi matn */
```

Qorong'i rejim **birinchi versiyada yo'q**. Kerak bo'lsa keyin — lekin barcha
rangni CSS o'zgaruvchi orqali bering, hech qayerda hex yozmang.

### Shriftlar

| Rol | Shrift | Qayerda |
|---|---|---|
| Display | **Archivo** (variable) | Sarlavha, bo'lim nomi, ball |
| Body | **IBM Plex Sans** | Dars matni, savol, interfeys |
| Mono | **IBM Plex Mono** | Konstrukt kodi, taymer, ball, kod bloki |

Archivo va IBM Plex ikkalasi ham to'liq Latin Extended qamrovga ega — `o'`, `g'`,
`ʻ` belgilar to'g'ri chiqadi. Bu O'zbek lotin alifbosi uchun majburiy talab.

Mono shriftni tanlash sababi: fan informatika. Konstrukt kodi `S4.CODE.02`,
taymer `01:47:12`, ball `86/100` — bularning hammasi tabular figure bo'lishi
kerak, aks holda raqamlar sakraydi.

```css
font-variant-numeric: tabular-nums;   /* barcha ball va taymerda */
```

### Tipografik shkala

```
display-l   Archivo   32/36  weight 600  letter-spacing -0.02em
display-m   Archivo   24/28  weight 600
display-s   Archivo   18/24  weight 600
body        Plex Sans 16/26  weight 400
body-s      Plex Sans 14/22  weight 400
label       Plex Sans 13/18  weight 500  uppercase yo'q
code        Plex Mono 13/20  weight 400
```

Dars matnida `line-height: 26px` — uzoq o'qish uchun. Telefonda 16px dan past
matn ishlatmang.

---

## Signature element: Blueprint strip

Bu platformaning eslab qolinadigan yagona elementi. Boshqa hamma narsa jim
va intizomli bo'lsin.

**Nima bu:** 15 ta katakdan iborat gorizontal chiziq. Har katak — blueprint
guruhi. Katak kengligi shu guruhning imtihondagi savol soniga **proporsional**
(3, 2, 5, 3, 2, 3, 3, 3, 2, 5, 2, 2, 5, 7, 3 — jami 50).

Ya'ni chiziqning o'zi imtihonning aynan tuzilishi. `PM.GEN` kengroq ko'rinadi,
chunki u haqiqatan ham 7 savol.

**To'lish darajasi** — shu guruh konstruktlarining o'zlashtirish foizi:

```
bo'sh          --chiziq          hali boshlanmagan
qisman         --zar             jarayonda
to'liq         --yashil          o'zlashtirildi
```

**Qayerda ko'rinadi:** kabinet (asosiy), bo'lim sahifasi (shu bo'lim kataklari
ajratilgan), mock natijasi (shu sinovdagi natija bilan).

```tsx
// components/lesson/BlueprintStrip.tsx
type Props = {
  groups: { code: string; weight: number; mastery: number }[]  // mastery 0..1
  highlight?: string[]        // ajratib ko'rsatiladigan guruh kodlari
  onSelect?: (code: string) => void
}
```

Balandligi 8px (kompakt) yoki 40px (kabinetda, kod yozuvi bilan). Telefonda
gorizontal skroll **yo'q** — 50 katak emas, 15 katak, hammasi sig'adi.

---

## Layout

Mobile-first. Sinov ekrani telefonda ishlashi shart — foydalanuvchilarning
yarmi kompyuterda mashq qilmaydi.

```
Telefon (<768px)     bitta ustun, pastda yopishgan harakat paneli
Planshet (768–1024)  bitta ustun, kengroq maydon
Desktop (>1024)      maksimal kenglik 720px matn uchun, 1100px panel uchun
```

Dars matni kengligi **hech qachon 720px dan oshmasin** — uzun qator o'qishni
qiyinlashtiradi.

---

## Sahifa kontraktlari

### `/bolimlar`

9 ta bo'lim kartasi. Har kartada:

```
[nomer]  Bo'lim nomi
         N mavzu · imtihonda M savol
         [ progress bar ]  X% o'zlashtirildi
```

Karta holati: `boshlanmagan` (chegara `--chiziq`), `jarayonda` (chap chegara
`--zar`, 3px), `tugallangan` (chap chegara `--yashil`).

Qulf **yo'q** — barcha bo'lim ochiq. Tajribali o'qituvchini majburiy ketma-ketlik
bilan bog'lash chiqib ketishga olib keladi. Tavsiya beriladi, majburlanmaydi.

### `/bolimlar/[module]/[lesson]`

```
< Bo'limga qaytish
Mavzu sarlavhasi                          [ ~15 daq ]
Konstrukt yorliqlari: S3.NUM.01  S3.NUM.02
─────────────────────────────────────────
MDX dars matni
─────────────────────────────────────────
[ Testni boshlash ]     ← asosiy harakat, yopishgan
```

Sahifa ochilganda `mark_lesson_read` chaqiriladi (bir marta, `useEffect`).

### Sinov ekrani (barcha rejim uchun bitta `ExamRunner`)

```
┌──────────────────────────────────────────┐
│ 12/50            [ 01:47:12 ]      [⚑]  │   ← taymer faqat mock/bo'limda
├──────────────────────────────────────────┤
│                                          │
│  Savol matni (markdown, kod bloki bor)   │
│                                          │
│  ○ A variant                             │
│  ○ B variant                             │
│  ● C variant                             │
│  ○ D variant                             │
│                                          │
├──────────────────────────────────────────┤
│ [ Oldingi ]              [ Keyingi ]     │
└──────────────────────────────────────────┘
     ● ● ● ○ ○ ⚑ ○ ○ ...     ← palitra
```

Rejimga qarab farq:

| | Taymer | Tushuntirish | Orqaga qaytish | Palitra |
|---|---|---|---|---|
| Mashq | yo'q | darhol | bor | yo'q |
| Mavzu testi | yo'q | oxirida | bor | bor |
| Bo'lim imtihoni | 30 daq | oxirida | bor | bor |
| Mock | 120 daq | oxirida | bor | bor |
| Takrorlash | yo'q | darhol | yo'q | yo'q |

**Taymer server vaqtiga tayanadi.** Klient `started_at + duration_sec` dan
hisoblaydi, lekin haqiqiy tekshiruv serverda. Klient taymerini o'zgartirish
hech narsa bermaydi.

Oxirgi 5 daqiqada taymer `--zar` rangga o'tadi. Titrash, tovush, modal **yo'q** —
bu stress qo'shadi va foydasi yo'q.

### Savol formatlari

```tsx
// Y1 — radio guruh
<Y1Choice options={...} value={optionId} onChange={...} />

// Y2 — moslashtirish: chap ustun (side='a'), o'ng ustun (side='b')
// Telefonda: har chap element ostida select. Drag-and-drop YO'Q.
<Y2Match left={...} right={...} value={pairs} onChange={...} />

// Y3 — ketma-ketlik
// Telefonda: har element yonida ↑ ↓ tugmasi. Drag ixtiyoriy qo'shimcha.
<Y3Order items={...} value={order} onChange={...} />
```

**Drag-and-drop hech qachon yagona usul bo'lmasin.** Arzon Android'da u ishlamaydi.
Tugma va select — asosiy, drag — qo'shimcha.

### `/mock/[examId]/natija`

```
        86 / 100
    Oliy toifa berilishi mumkin

[ Blueprint strip — shu sinov natijasi bilan ]

Bloklar bo'yicha
  Mutaxassislik fani      31/35
  Kasb standarti           4/5
  Pedagogik mahorat        8/10

Zaif konstruktlar
  S3.NUM.02   Sonlarni o'tkazish        0/2   [ mashq qilish ]
  S6.NET.03   IP manzil va maska        1/2   [ mashq qilish ]

[ Savollarni ko'rib chiqish ]   ← get_review
```

Ball 86+ bo'lsa qo'shimcha qator: *"86 balldan yuqori natija vazir jamg'armasi
ustamasi saralashining birinchi bosqichi hisoblanadi."*

Toifa qarori foydalanuvchining joriy toifasiga bog'liq — uni kabinetda bir marta
so'rang va `profiles` da saqlang. So'ralmagan bo'lsa, barcha variantni ko'rsating.

---

## Matn yozish qoidalari

Interfeys matni dizayn materiali. Shu qoidalarga rioya qiling:

- **Faol nisbat.** "Testni boshlash", "Saqlash" — "Yuborish" emas.
- **Tugma nomi natijada takrorlanadi.** "Testni boshlash" bosilsa, keyingi
  ekranda "Test boshlandi".
- **Xato uzr so'ramaydi.** Nima bo'lgani va nima qilish kerakligini aytadi.
  ✗ "Kechirasiz, xatolik yuz berdi"
  ✓ "Javob saqlanmadi. Internetni tekshiring — qayta urinamiz."
- **Bo'sh ekran — taklif.** ✗ "Ma'lumot yo'q" ✓ "Hali test ishlamadingiz.
  Birinchi mavzudan boshlang."
- **Gap boshida bosh harf, qolgani kichik.** Sarlavhalarda Ham Har So'zni
  Kattalashtirmang.
- **Foydalanuvchini ayblamang.** ✗ "Siz noto'g'ri javob berdingiz"
  ✓ "To'g'ri javob: B. Sababi..."

---

## Ishlash talablari

Viloyatdagi sekin internetni hisobga oling:

| Ko'rsatkich | Chegara |
|---|---|
| LCP (3G) | < 2.5s |
| Dastlabki JS | < 150 KB gzip |
| Shrift | `font-display: swap`, faqat kerakli og'irlik |
| Rasm | `next/image`, AVIF/WebP, lazy |

**Supabase Storage'ni statik fayl uchun ishlatmang.** Rasmlar `public/` yoki
Vercel Blob orqali — CDN bepul. Supabase faqat baza va auth uchun qolsin, aks
holda tekin tarifning 5 GB egress chegarasi mavsumda tugaydi.

Pyodide, sql.js kabi og'ir kutubxonalar **faqat kerak bo'lganda**
`dynamic(() => import(...), { ssr: false })` bilan yuklansin.

---

## Sifat pollari

Bular "keyin qilamiz" ro'yxatiga tushmasin:

- Klaviatura bilan to'liq navigatsiya, `:focus-visible` ko'rinadigan
- `prefers-reduced-motion` hurmat qilinadi
- Barcha rasmda `alt`, barcha tugmada matn yoki `aria-label`
- Kontrast AA (matn 4.5:1) — `--kul` fonda tekshiring
- 360px kenglikda gorizontal skroll yo'q

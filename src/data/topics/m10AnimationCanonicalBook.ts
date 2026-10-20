/** TASK-304: 2D animation, timing, timeline and Animate lifecycle book. */
import type { TheoryBlock } from '../topicContent'
export const M10_06_CANONICAL_BOOK: TheoryBlock[] = [
  {
    "type": "goal",
    "content": "Frame/FPS, timeline/keyframe/tween, easing, symbol, layer, storyboard, Adobe Animate maintenance mode, eksport va auditoriyaga qulay animatsiya talablarini farqlash; davomiylikni hisoblash."
  },
  {
    "type": "intro",
    "content": "Animatsiyada tasvirning o‘zi bilan vaqt boshqaruvi bir xil darajada muhim. Dars bitta oddiy harakatni rejalashdan boshlab Animate vositalari, kadr hisoblari va ta’lim uchun muqobil ko‘rsatishni bosqichma-bosqich o‘rgatadi."
  },
  {
    "type": "table",
    "content": "| Atama | O‘lchov/vazifa | Eslatma |\n|---|---|---|\n| Frame | Kadr | Bitta tasvir |\n| FPS | Kadr/s | Vaqt tezligi |\n| Keyframe | Muhim holat | Boshlash/yakun |\n| Tween | Oraliq holat | Hisoblash |\n| Easing | Tezlanish | Linear/Ease |\n| Symbol | Qayta ishlatiladigan obyekt | Instance bo‘lishi mumkin |"
  },
  {
    "type": "formula",
    "content": "Animatsiya davomiyligi (sekund) = ijro qilinadigan kadrlar soni ÷ sekunddagi kadrlar soni (FPS). Misol: 60 kadr / 30 FPS = 2 sekund."
  },
  {
    "type": "heading",
    "content": "1. Animatsiyaning asosiy g‘oyasi va kadr"
  },
  {
    "type": "definition",
    "content": "Animatsiya ketma-ket tasvirlar orqali harakat taassuroti hosil qiladi. Frame — bitta kadr, Timeline — kadrlarning vaqt bo‘yicha joylashuvi, FPS esa bir sekundda nechta kadr ko‘rsatilishini anglatadi. 24, 30 yoki 60 FPS loyihaga mos variantlar; har bir media uchun yagona majburiy standart yo‘q."
  },
  {
    "type": "case",
    "content": "48 kadr 24 FPSda 2 sekund, 30 FPSda esa 1,6 sekund ko‘rsatishga to‘g‘ri keladi. Harakatning ravonligi kadrlar orasidagi holat farqiga ham bog‘liq."
  },
  {
    "type": "trap",
    "content": "FPS rezolyutsiya yoki tasvirning yorqinligi emas; 60 FPS 30 FPSga qaraganda har doim pedagogik jihatdan yaxshiroq degani emas."
  },
  {
    "type": "task",
    "content": "1-mashq. 72 kadrli animatsiya 24 FPSda qancha davom etishini hisoblang."
  },
  {
    "type": "heading",
    "content": "2. Stop-motion va kadrma-kadr animatsiya"
  },
  {
    "type": "definition",
    "content": "Stop-motion fizik obyektni har gal ozgina siljitib, suratga olishdan iborat. Frame-by-frame esa rassom bir nechta tasvir/rasm kadrlarini alohida chizishi mumkin. Har ikki usulda kadrlar orasidagi o‘zgarish harakatni yaratadi."
  },
  {
    "type": "solved",
    "content": "Plastilin sharcha 12 suratda chapdan o‘ngga siljidi. 12 FPSda natija 1 sekund bo‘ladi; har 2 kadrni takrorlash 2 sekundga uzaytiradi."
  },
  {
    "type": "trap",
    "content": "Kadrlar sonini oshirish harakatning aniq hikoyasi va izchilligini avtomatik yaratmaydi."
  },
  {
    "type": "task",
    "content": "2-mashq. Bir predmetning 1 soniyalik stop-motion roligiga storyboard chizing."
  },
  {
    "type": "heading",
    "content": "3. Timeline, keyframe va interval"
  },
  {
    "type": "definition",
    "content": "Timeline kadr, layer va sahna elementlari joylashadigan vaqt shkalasi. Keyframe muhim holat saqlanadigan nuqta; ular orasidagi oddiy frame o‘zgarishsiz davom etishi yoki tween bilan hisoblanishi mumkin. Qismlar turli layerda boshqarilishi mumkin."
  },
  {
    "type": "example",
    "content": "Koptok 0-kadrda chapda, 30-kadrda o‘ngda: ikkita keyframe qo‘ying; oraliq kadrlar tween qoidasi bilan hisoblanadi."
  },
  {
    "type": "trap",
    "content": "Timeline ustidagi har bir frame mustaqil to‘liq qayta chizilgan keyframe degani emas."
  },
  {
    "type": "task",
    "content": "3-mashq. Keyframe, frame va timeline atamalarini bir vaziyatda farqlang."
  },
  {
    "type": "heading",
    "content": "4. Tween: motion va shape"
  },
  {
    "type": "definition",
    "content": "Tween dastur tomonidan tayanch holatlar orasidagi oraliq qiymatlarni hisoblashdir. Motion tween obyektdagi joy, aylanish yoki o‘lcham kabi parametrlarni, Shape tween esa mos shakllar o‘zgarishini ifodalashi mumkin. Har bir tur uchun kerakli obyekt/tuzilma sharti farq qiladi."
  },
  {
    "type": "case",
    "content": "Doira 0–2 soniyada pastdan tepaga chiqadi: bosh/tugash pozitsiyasini belgilang, oraliq yo‘lni dastur hisoblaydi."
  },
  {
    "type": "trap",
    "content": "Tween natijasi har doim tabiiy chiqmaydi; obyekt turi yoki easing noto‘g‘ri bo‘lsa kutilmagan siljish paydo bo‘ladi."
  },
  {
    "type": "task",
    "content": "4-mashq. Oddiy harakat bilan shakl o‘zgarishiga alohida tween misoli yozing."
  },
  {
    "type": "heading",
    "content": "5. Easing va harakat trayektoriyasi"
  },
  {
    "type": "definition",
    "content": "Easing vaqtning harakat masofasiga qanday taqsimlanishini belgilaydi. Linear bir xil tezlik taassurotini, Ease In asta tezlashishni, Ease Out sekinlashishni beradi. Trajectory (motion path) esa ekrandagi yo‘nalishni ifodalaydi."
  },
  {
    "type": "solved",
    "content": "Koptok pastga tushganda tezligi ortishi, tepaga ko‘tarilganda kamayishi mumkin. Harakat ssenariyini o‘quv maqsadiga mos tasvirlang."
  },
  {
    "type": "trap",
    "content": "Easing va yo‘l geometriyasi boshqa o‘lchovlar: obyekt bir xil yo‘ldan turli tezlik bilan o‘tishi mumkin."
  },
  {
    "type": "task",
    "content": "5-mashq. Linear va Ease In harakat grafigini vaqt bo‘yicha solishtiring."
  },
  {
    "type": "heading",
    "content": "6. Symbol va library tushunchasi"
  },
  {
    "type": "definition",
    "content": "Adobe Animate singari dasturlarda Symbol takror foydalaniladigan grafika, tugma yoki movie clip mazmunini bir joyda saqlashga yordam beradi. Libraryda ishlatiladigan resurslar jamlanadi; bir xil elementni qayta ishlatish sahnadagi yuzlab alohida nusxani boshqarishni osonlashtirishi mumkin."
  },
  {
    "type": "example",
    "content": "Bir xil qush belgisi uch sahnada ishlatiladi: umumiy symbolni tahrirlagach instancelar yangilanishini tekshiring."
  },
  {
    "type": "trap",
    "content": "Bitta symbolning instance nusxasi bilan alohida mustaqil grafik obyekti farq qilishi mumkin."
  },
  {
    "type": "task",
    "content": "6-mashq. Bir obyektdan beshta nusxa kerak bo‘lsa qaysi yondashuvni tanlaysiz?"
  },
  {
    "type": "heading",
    "content": "7. Layerlar va sahna tartibi"
  },
  {
    "type": "definition",
    "content": "Animatsiya layerlari fon, qahramon, ovoz va interaktiv elementlarni alohida boshqarishga yordam beradi. Qatlam tartibi obyekt ko‘rinishiga, timeline esa harakat vaqtiga ta’sir qiladi. Ovoz va harakat sinxronligi faqat preview emas, final eksportda ham sinov qilinadi."
  },
  {
    "type": "case",
    "content": "Yomg‘ir, fon, odam va subtitrni alohida qatlamlarda joylashtiring; odam yomg‘ir ortida ko‘rinishi kerakmi yoki oldindami, belgilang."
  },
  {
    "type": "trap",
    "content": "Qatlamlarni ko‘paytirish hikoya sifatini o‘zi oshirmaydi; qatlam nomlari va vaqt boshqaruvi tushunarli bo‘lsin."
  },
  {
    "type": "task",
    "content": "7-mashq. To‘rt qatlamli ikki soniyalik sahna rejasini yozing."
  },
  {
    "type": "heading",
    "content": "8. Storyboard va vizual ssenariy"
  },
  {
    "type": "definition",
    "content": "Storyboard sahna kadrlarini, voqea ketma-ketligini, asosiy harakat, matn va tovush vaqtini oldindan ko‘rsatadi. Dastur ochishdan oldin maqsad, auditoriya va davomiylikni yozish ortiqcha tahrirni kamaytiradi."
  },
  {
    "type": "solved",
    "content": "«Suvning aylanishi» uchun uch sahna: bug‘lanish, kondensatsiya, yog‘ingarchilik; har biriga harakat, qisqa matn va 5 soniyalik davomiylik rejalang."
  },
  {
    "type": "trap",
    "content": "Bitta animatsiyada juda ko‘p effekt va sarlavha bo‘lishi tushunishni qiyinlashtirishi mumkin."
  },
  {
    "type": "task",
    "content": "8-mashq. 12 soniyalik ta’limiy rolik uchun 3 kadrli storyboard tuzing."
  },
  {
    "type": "heading",
    "content": "9. Adobe Animate va 2026 dastur holati"
  },
  {
    "type": "definition",
    "content": "Adobe Animate (ilgari Flash Professional) timeline, keyframe, tween va symbol bilan 2D/vektor animatsiya yaratishda ishlatiladi. Adobe 2026-yil iyunidagi rasmiy ma’lumotga ko‘ra dastur maintenance mode holatida: mavjud va yangi foydalanuvchilarga ochiq, xatolar/xavfsizlik tuzatiladi, lekin yangi imkoniyatlar rejalashtirilmagan."
  },
  {
    "type": "example",
    "content": "O‘qituvchi darsdagi Animate menyularini namoyish qilayotganda o‘rnatilgan versiyani yozadi; boshqa dasturlarda ham umumiy timeline va keyframe tushunchalarini solishtiradi."
  },
  {
    "type": "trap",
    "content": "2026-yil fevralida yakunlash haqida tarqalgan eski xabarni yakuniy haqiqat sifatida takrorlamang: Adobe yangilangan FAQda Animate to‘xtatilmasligini aniq aytgan."
  },
  {
    "type": "task",
    "content": "9-mashq. Maintenance mode nima va uning foydalanuvchi uchun ikki oqibatini izohlang."
  },
  {
    "type": "heading",
    "content": "10. Animatsiya formatlari: GIF, video va HTML5"
  },
  {
    "type": "definition",
    "content": "GIF indekslangan rangli qisqa animatsiyalarni saqlashi mumkin, ammo katta rangli rolikda fayl hajmi va rang sifati noqulay. MP4 singari konteynerda turli video kodeklar bo‘lishi mumkin; HTML5 Canvas va SVG/veb animatsiyalari brauzerga moslikni talab qiladi."
  },
  {
    "type": "case",
    "content": "Maktab saytiga 4 soniyalik oddiy belgi animatsiyasi uchun GIF/Web formatlarini fayl hajmi va kirish imkoniyati bilan qiyoslang; subtitrli katta rolik uchun video tanlang."
  },
  {
    "type": "trap",
    "content": "MP4 — bitta harakat effekti emas; «video formati» bilan «kodek» atamalarini adashtirmang."
  },
  {
    "type": "task",
    "content": "10-mashq. Ikki turdagi animatsiya uchun eksport turini va tekshiruvini yozing."
  },
  {
    "type": "heading",
    "content": "11. Harakat sezgirligi va pedagogik mas’uliyat"
  },
  {
    "type": "definition",
    "content": "Tez chaqnash, takrorlanadigan keskin harakat va ortiqcha tovush ba’zi tomoshabinlar uchun noqulay bo‘lishi mumkin. Muhim ma’lumotni faqat animatsiyada berish o‘rniga statik matnli muqobilini ham yarating."
  },
  {
    "type": "solved",
    "content": "Qisqa ilmiy animatsiya ko‘rsatilgach, uch bosqichni oddiy chizmada ko‘rsatib savol bering; ovozsiz ham tushunish mumkinligini sinang."
  },
  {
    "type": "trap",
    "content": "Harakat e’tiborni tortishi uning har doim o‘rgatishini anglatmaydi; sinf natijasiga qarang."
  },
  {
    "type": "task",
    "content": "11-mashq. Chaqnashsiz, subtitrli va statik muqobilga ega sahna rejasini tuzing."
  },
  {
    "type": "heading",
    "content": "12. Amaliy yakun va regressiya"
  },
  {
    "type": "definition",
    "content": "Yakuniy animatsiya ishida vaqt/fpsni, keyframe va tweenni, qatlamlarni, bir xil belgilarni va eksportni tekshiring. Dastur loyiha faylini tarqatiladigan GIF/video/sahifadan ajratib saqlang; animatsiya o‘qitish maqsadiga xizmat qilsin."
  },
  {
    "type": "example",
    "content": "48 kadrli 24 FPS rolik 2 soniya bo‘lsin: obyekt chapdan o‘ngga siljisin, Ease Out qo‘llang, keyin ovozsiz preview va eksport sinovini qiling."
  },
  {
    "type": "trap",
    "content": "Tayyor video saqlanishi asl tahrirlanadigan Animate loyiha fayli saqlangani degani emas."
  },
  {
    "type": "task",
    "content": "12-mashq. Sahna, vaqt, o‘qilish, eksport va manba bo‘yicha 5 mezonli rubrika tuzing."
  },
  {
    "type": "summary",
    "content": "FPS — kadrlar sonining vaqtga nisbati; frame bitta surat, keyframe muhim holat, tween oraliq hisob, easing tezlik taqsimoti. Adobe Animate 2026-yilda maintenance mode holatida mavjud va qo‘llab-quvvatlanadi. Statik muqobil va real eksport sinovi har bir ta’limiy animatsiyada muhim."
  },
  {
    "type": "answers",
    "content": "1) 72/24 = 3 sekund; 2) stop-motion suratlardan; 3) keyframe vaqt holati, frame oddiy kadr; 4) tween oraliq hisoblaydi; 5) Ease In tezlashish; 6) symbol qayta foydalaniladi; 7) qatlam tartibi va timeline farqli; 8) 3 sahnali reja; 9) maintenance mode — xavfsizlik/bug tuzatish, yangi xususiyatlar rejalashtirilmagan; 10) GIF va video imkoniyatlari farqli; 11) chaqnashsiz va statik muqobil; 12) 48/24 = 2 soniya. Ochiq mashqlarda asosli yechim qabul qilinadi."
  },
  {
    "type": "source",
    "content": "Manbalar: Cambridge+ 8-sinf, video/animatsiya yaratish, kadr, rastr/vektor, qatlam va Tween boblari, bosma taxminan 110–124-betlar (https://drive.google.com/file/d/1hZyLM5n0OUtuJI3M3dFeAz8kyv9Sr6Ng/view); Adobe Animate maintenance mode rasmiy FAQ, 2026-06-08 (https://helpx.adobe.com/animate/desktop/kb/maintenance-mode.html). Mazmun mualliflik qayta bayoni; PDFning barcha fizik betlari va grafikasi 1:1 ekspert tasdiqlanmagan. Interfeys va eksport versiyaga bog‘liq."
  }
]

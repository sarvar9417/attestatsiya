-- TASK-204 forward content migration. Three V2 appendices; no mutation of published rows.
BEGIN;
CREATE TEMP TABLE _algo_appendix(idx int,slug text,title text,akey text,construct_code text,body text) ON COMMIT DROP;
INSERT INTO _algo_appendix VALUES
(13,'algoritmlash-v2-ilova-a','Ilova A. 14 ta batafsil ishlangan attestatsiya masalasi','A','S3.ALGO.04','Quyidagi masalalar mavzularni bog‘lab mashq qilish uchun **original tuzilgan**. Har birining maqsadi aniq, ijro izi mustaqil tekshiriladigan va kamida bitta nozik chegaraviy holati mavjud. Muayyan dasturlash tili sintaksisi talab qilinmaydi.

**A1. Chegirma algoritmi: chegaradagi tenglik**

Do‘konda xarid summasi $S>200000$ so‘m bo‘lsa, 12\% chegirma qo‘llanadi; aks holda to‘liq summa to‘lanadi. Uchta kirish uchun to‘lovni toping: $S=199000$, $200000$ va $250000$.

**solutionbox**

Model: $T=0.88S$ agar $S>200000$; aks holda $T=S$. Natijalar mos ravishda 199000, 200000 va 220000 so‘m. Aynan $S=200000$ da chegirma *yo‘q*, chunki $>$ qat''iy tengsizlik. $\ge$ bilan adashtirish 200000 holatini o‘zgartiradi. Testlar: oddiy past, chegaraning o‘zi, yuqori qiymat.

**A2. To‘g‘ri to‘rtburchak mumkinligini tekshirish**

Kirish $a,b\in\mathbb R$. Agar $a>0$ va $b>0$ bo‘lsa, $S=a\cdot b$; aks holda «Noto‘g‘ri tomon» xabari chiqsin. Kirishlar: $(3,7)$, $(0,7)$, $(-1,5)$.

**solutionbox**

Psevdokod: KIRIT $a,b$; AGAR $a\le0$ YOKI $b\le0$ BO‘LSA xabar chiqar va to‘xta; AKS HOLDA $S\leftarrow ab$; CHIQAR $S$. Natijalar: 21, «Noto‘g‘ri tomon», «Noto‘g‘ri tomon». **Farq:** noto‘g‘rilikni aniqlash uchun ikkita yomon holatni *OR* bilan birlashtiramiz.

**A3. Uchburchakning yuzi: shart va formula**

Tomonlar $(5,12,13)$ va $(1,2,3)$ uchun hisoblash jarayonini solishtiring.

**solutionbox**

Birinchi kirish: $5+12>13$, $5+13>12$, $12+13>5$ -- barchasi rost. Yarim perimetr $p=(5+12+13)/2=15$. Geron formulasi $S=\sqrt{15\cdot10\cdot3\cdot2}=30$. Ikkinchi kirish: $1+2>3$ yolg‘on, shuning uchun uchburchak mavjud emas va *yuzani hisoblash bosqichiga o‘tilmaydi*. Bu matematik model oldidagi validatsiya ahamiyatini ko‘rsatadi.

**A4. Tenglikni qamrab oladigan maksimum**

$A=8$, $B=8$ uchun «agar $A>B$ bo‘lsa $A$ chiqar, aks holda $B$» natijasi qaysi?

**solutionbox**

$8>8$ yolg‘on; algoritm $B=8$ chiqaradi. Bu **to‘g‘ri maksimal qiymat**. Tenglik tarmog‘ini maxsus chiqarish kerak emas, agar masala faqat qiymatni so‘rasa. Lekin *qaysi manba element tanlandi* degan talab bo‘lsa, bog‘lanish qoidasini aniqlash kerak. Masala maqsadi algoritmning to‘g‘ri yoki noto‘g‘riligini belgilaydi.

**A5. Faktorial va bo‘sh ko‘paytma**

Psevdokod: $P\leftarrow1$; $i\leftarrow1$; toki $i\le n$ bo‘lsa $P\leftarrow P\cdot i$, $i\leftarrow i+1$. $n=0$ va $n=4$ holatlarini tekshiring.

**solutionbox**

$n=0$ uchun siklga kirilmaydi, $P=1$, ya''ni $0!=1$. $n=4$ uchun $P$ qiymatlari $1\to1\to2\to6\to24$ (boshlang‘ich qiymat bilan). Agar $P=0$ boshlansa, har ikkala holat noto‘g‘ri bo‘ladi. **Nazorat:** $n<0$ kirish ushbu modelda qabul qilinmaydi.

**A6. Nol bilan tugaydigan kirish oqimi**

Foydalanuvchi sonlar kiritadi: $3,5,-2,4,0$. Nol «to‘xtat» belgisi; undan oldingi barcha sonlar yig‘ilsin.

**solutionbox**

$S\leftarrow0$; takror: $x$ ni kirit; agar $x=0$ bo‘lsa sikldan chiq; aks holda $S\leftarrow S+x$. Hisob: $3+5-2+4=10$. **Muammo:** agar xabar 0 bo‘lsa, uni yig‘indiga qo‘shish bilan qo‘shmaslik bu misolda son jihatdan farqsiz, ammo boshqa sentinel qiymatda farq qiladi. «To‘xtash belgisi hisobga qo‘shilmaydi» qoidasi aniq yozilishi kerak.

**A7. Har ikkinchi sonni yig‘ish**

$1$ dan $11$ gacha toq sonlar yig‘indisi uchun boshi $i=1$, qadami $2$ bo‘lgan algoritm tuzing.

**solutionbox**

$S\leftarrow0$; toki $i\le11$ bo‘lsa $S\leftarrow S+i$, $i\leftarrow i+2$. Iz: $1+3+5+7+9+11=36$. Jami 6 ta takror. Uni $11$ ta oddiy takror bilan har safar `mod 2` ni tekshirib ham yechish mumkin, lekin 2 qadamli sikl mantiqan soddaroq.

**A8. Ichma-ich siklning aniq takrorlar soni**

Tashqi $i=1,2,3,4$, ichki $j=1,\dots,i+1$ bo‘lsa, ichki amal necha marta bajariladi?

**solutionbox**

Ichki takrorlar soni: $2,3,4,5$. Jami $2+3+4+5=14$. Umumiy $n$ uchun $\sum_{i=1}^{n}(i+1)=n(n+1)/2+n$. E''tibor: ichki diapazon $i+1$ ga bog‘liq, shu sabab barcha takrorlar sonini $n$ ning o‘ziga ko‘paytirib bo‘lmaydi.

**A9. EKUB: qoldiqli va ayirmali ko‘rinish**

EKUB(48,18) ni ikkita algoritmik yo‘l bilan tekshiring.

**solutionbox**

**Qoldiq:** $48\bmod18=12$; $18\bmod12=6$; $12\bmod6=0$; EKUB $=6$.\\
**Ayirish:** $(48,18)\to(30,18)\to(12,18)\to(12,6)\to(6,6)$; EKUB $=6$. Natija bir xil; qoldiqli variant bu ma''lumotda kamroq aylanishga ega. **Kirish chegarasi:** $a=b=0$ holatida EKUBning ushbu algoritmik ta''rifi maxsus tekshiruvni talab qiladi.

**A10. Manfiy sonlarning maksimumini topish**

Ro‘yxat $[-10,-3,-8,-5]$ uchun maksimal qiymatni toping; nima uchun $M=0$ noto‘g‘ri?

**solutionbox**

To‘g‘ri bosqichlar: $M\leftarrow-10$; $-3>-10$ rost, $M=-3$; $-8>-3$ yolg‘on; $-5>-3$ yolg‘on. Natija $-3$. Agar $M=0$ dan boshlansa, hech bir manfiy element 0 dan katta bo‘lmaydi va noto‘g‘ri 0 chiqadi. **Qoida:** maksimumni birinchi elementdan boshlang, bo‘sh ro‘yxatni alohida ko‘ring.

**A11. Chiziqli qidiruv: takroriy uchrash**

$[4,2,7,2,5]$ massivida $2$ ni topish algoritmi birinchi mos indeksni chiqarishi kerak (indeks 0 dan boshlanadi).

**solutionbox**

0-indeksdagi 4 mos emas; 1-indeksdagi 2 mos va algoritm shu zahoti tugaydi. Natija indeks 1; taqqoslash soni 2. Agar oxirgi uchrashuv kerak bo‘lsa qidiruvni davom ettirish lozim va indeks 3 chiqadi. **Maqsad** algoritm to‘xtash nuqtasini belgilaydi.

**A12. Ikkilik qidiruv: saralanganlik sharti**

Saralangan $[1,4,7,9,12,15,18]$ ro‘yxatidan $4$ ni qidiring (o‘rta indeks pastga yaxlitlanadi).

**solutionbox**

0..6 chegaraning o‘rtasi indeks 3, qiymat 9; $4<9$ bo‘lgani uchun 0..2 ga o‘tamiz. Keyingi o‘rta indeks 1, qiymat 4 -- topildi. Jami 2 ta taqqoslash. Saralanmagan ro‘yxatga shu usulni qo‘llash kafolatli emas. O‘rta indeksni tanlashning boshqa standart qoidalari qadam sonini ayrim holatlarda o‘zgartirishi mumkin, *natijaning to‘g‘riligi* emas.

**A13. O‘sish tartibini matematik solishtirish**

$A(n)=4n$ va $B(n)=n^2$ amal bajaradi. Qaysi kirish hajmidan boshlab A kamroq amal ishlatadi (musbat butun $n$)?

**solutionbox**

$4n<n^2$ tengsizlik $n>4$ ga teng kuchli. Demak, $n=5$ dan A kamroq amal bajaradi. $n=4$ da ikkisi teng, $n=1,2,3$ da esa B arzonroq. $O(n)$ va $O(n^2)$ faqat katta $n$ uchun yo‘nalishni ko‘rsatadi; muayyan kichik $n$ da koeffitsiyentlar ham muhim.

**A14. Integratsion tanlov: to‘g‘rilikmi yoki tezlikmi?**

Ma''lumotlar ro‘yxati $[3,8,2,9,5]$ tartiblanmagan. Tizim faqat bir marta $9$ ni izlaydi. Bir nomzod dastlab tartiblamasdan ikkilik qidiruv qiladi; ikkinchisi chiziqli qidiruv qiladi. Qaysi asosli?

**solutionbox**

Birinchi nomzodning asosiy sharti (saralanganlik) bajarilmagan; tezlik haqida o‘ylashdan oldin **to‘g‘rilik** xavf ostida. Ikkinchi nomzod tartiblanmagan ro‘yxatni boshidan oxirigacha tekshirib, $9$ ni indeks 3 da topadi, 4 ta taqqoslash bajaradi. Bir martalik kichik vazifa uchun shu algoritm sodda va to‘g‘ri. Kelajakda juda ko‘p qidiruv bo‘lsa, oldindan saralash narxini ham hisoblab, keyin ikkilik qidiruvni baholash mumkin.

\sourcecite{Ilova A -- mustaqil tuzilgan attestatsiyaga tayyorlov mashqlari. Metodik tayanch: M9, PDF 28--47; L, PDF 46--55; 2026 SPETS, PDF 4. Barcha yechimlar arifmetik va mantiqiy tekshirildi.}'),
(14,'algoritmlash-v2-ilova-b','Ilova B. Xatolarni qayta ko‘rish kartasi','B','S3.ALGO.04','**Xato turi** — **Aniq tekshiruv savoli**

Ijrochi / IKT — Bu buyruq haqiqatan mavjudmi?

Kirish sohasi — Nima uchun manfiy, 0 yoki bo‘sh kirish tekshirilgan/tekshirilmagan?

Shart tarmog‘i — HA va YO‘Q yo‘llari birga barcha holatni qoplaydimi?

Qiymat berish — O‘ngdagi eski qiymat qachon o‘qildi?

Boshlang‘ich qiymat — Yig‘indi $0$, ko‘paytma $1$, maksimum birinchi elementdanmi?

Sikl sharti — $<$ o‘rniga $\le$ bo‘lishi kerakmi?

Cheksiz takror — Sanagich to‘xtash chegarasiga yaqinlashyaptimi?

EKUB / mod — Bo‘luvchi 0 bo‘lib qolmayaptimi?

Qidiruv — Ikkilik qidiruv uchun kirish tartiblanganmi?

Maqbullik — Nomzodlar avval to‘g‘riligi bo‘yicha tekshirildimi?

**Yakuniy audit usuli**

Testni yechgach, shunchaki javob harfini yodlamang. O‘z so‘zingiz bilan algoritmning nima uchun ishlashini, qaysi chegarada xato bo‘lishi mumkinligini va shu muammo uchun boshqa usulga nisbatan afzalligini ayting. Shu uch savol tushunish, mantiqiy tekshirish va maqbul tanlovni birgalikda mustahkamlaydi.

\backmatter'),
(15,'algoritmlash-v2-manbalar','Manbalar reyestri va qamrov auditi','S','S3.ALGO.01','**Kod** — **Manba** — **Qamrov**

SPETS — *Informatika Testlar spesifikatsiyasi.pdf* (2026), PDF 4 — Barcha to‘rt konstrukt, 3 savol

M9 — *ICT 9\_sinf-2020(1).pdf*, PDF 18--47 — Model, algoritm, xossalar, ifoda, turlar, sikl, aralash algoritm, EKUB

M6 — *ICT 6\_sinf-2021(1).pdf*, PDF 5--22 — Scratch orqali ketma-ketlik, tanlash, takrorlash

M5 — *ICT 5\_sinf-2020(1).pdf*, PDF 85--109 — Scratch muhiti va dastlabki ijrochi tasavvuri

L — *Ma''ruza (Tayyor).pdf*, PDF 46--55 — Algoritmlash xulosalari va misollar

C11 — *10-11-sinf informatika (Cambridge +)(1).pdf*, PDF 25--30 va 275--277 — Validatsiya va tizimdagi jarayonlar, grafik tavsiflar

DEMO — *20000 LIK informatika.pdf*, PDF 5--7; *Demo 2026 test 10 000 so‘mlik.pdf*, PDF 5--6 — Faqat savol murakkabligi va ko‘rinishlarini solishtirish

**2026 spetsifikatsiyasidagi konstrukt** — **Qamrov**

Algoritm va uning turlarini bilish va farqlash — 1-, 3-, 4-, 5-boblar

Algoritm tuzish, mantiqan tekshirish; blok-sxema/psevdokod — 2-, 3-, 4-, 5-, 6-boblar

Masalaning algoritmini tuzish va topshiriq bajarish — 3-, 4-, 5-, 7-boblar

Eng maqbul algoritmni tahlil qilib tanlash — 7-, 8-boblar

**Qamrov chegara eslatmasi**

Milliy va Cambridge manbalarda algoritmga bevosita tegishli bo‘lgan materiallar asosiy tayanch bo‘ldi; barcha darslik bo‘limlari algoritmlashga sun''iy ko‘chirilmagan. Sanoq sistemalari, dastur sintaksisi, kompyuter qurilmalari, Office va veb dizayn uchun alohida spetsifikatsiya bo‘limlari bor. Ushbu qo‘llanma ularga zarurat tug‘ilgan joydagina ko‘prik yaratadi.');
INSERT INTO public.lessons(id,module_id,order_idx,slug,title_uz,body_mdx,blocks,blocks_kind,est_minutes,topic_test_question_count,status)
SELECT md5('attestatsiya:algo-v2:appendix:'||p.akey)::uuid,m.id,p.idx,p.slug,p.title,p.body,
jsonb_build_array(jsonb_build_object('type','goal','label','V2 ilova','content',p.title),jsonb_build_object('type','text','content',p.body)),
'appendix',25,20,'review'::content_status
FROM _algo_appendix p JOIN public.modules m ON m.code='M06'
ON CONFLICT(id) DO NOTHING;
INSERT INTO public.lesson_constructs(lesson_id,construct_id,is_required,is_critical,min_questions)
SELECT l.id,c.id,false,false,1 FROM _algo_appendix p
JOIN public.lessons l ON l.slug=p.slug
JOIN public.constructs c ON c.code=p.construct_code
ON CONFLICT(lesson_id,construct_id) DO NOTHING;
DO $$
BEGIN
 IF (SELECT count(*) FROM public.lessons WHERE slug LIKE 'algoritmlash-v2-%' AND status='review')<>11 THEN
 RAISE EXCEPTION 'V2 lessons review mismatch'; END IF;
END $$;
COMMIT;
-- TASK-204: original content remains immutable; eight source-based V2 lessons staged for expert review.
BEGIN;
CREATE TEMP TABLE _algo_v2_lessons (ch int,title text,body text,construct_code text) ON COMMIT DROP;
INSERT INTO _algo_v2_lessons VALUES 
(1,'Masala, model, ijrochi va algoritmning xossalari','**Maqsad:**
Masaladan bajariladigan ko‘rsatmaga o‘tish, ijrochi chegarasini tushunish, algoritmning besh xossasini ma''no bilan farqlash.

### Masalani algoritmik ko‘rinishga keltirish

Biror masalani yechishdan avval **nima ma''lum**, **nimani topish kerak** va **qaysi amallar ruxsat etilgan** degan savollar aniqlanadi. Milliy 9-sinf darsligidagi «Masalalarni kompyuterda yechish bosqichlari» hamda «Model va uning turlari» mavzulari shu poydevorni beradi. Masala sharti mantiqiy to‘liq ifodalanmaguncha, dastur yozish ishni boshlashning eng qulay usuli bo‘lmasligi mumkin.

**Kirish -- jarayon -- chiqish (IPO) — Ta’rif:**

**Kirish** (input) -- algoritmga beriladigan qiymatlar; **jarayon** (process) -- ular ustida bajariladigan amallar; **chiqish** (output) -- natija yoki asosli xabar. Masalan, to‘g‘ri to‘rtburchak uchun kirish $a,b>0$, jarayon $P=2(a+b)$, chiqish $P$.

**Tarkib** — **Mazmun** — **«Ikki sondan kattasi» misolida**
Maqsad — Talab etilgan natija — $\max(a,b)$
Kirish — Ma''lumot, tip, soha — $a,b\in\mathbb R$
Model — Bog‘lanish va shart — $a\ge b$ bo‘lsa $a$, aks holda $b$
Algoritm — Bosqichma-bosqich buyruq — Kiritish, shart, tanlash, chiqarish
Test — Natijani tekshirish — $a>b$, $a<b$, $a=b$ holatlari

### Modellashtirish va dekompozitsiya

**Model** -- muammoning muhim belgilarini saqlagan soddalashtirilgan tasviri. Moddiy, grafik, axborotli yoki matematik model bo‘lishi mumkin. **Dekompozitsiya** murakkab vazifani mustaqilroq kichik vazifalarga ajratadi: masalan, uchburchak yuzini hisoblash uchun avval tomonlarning musbatligi, keyin uchburchak tengsizliklari, so‘ng yarim perimetr va yuza tekshiriladi. **Abstraksiya** masalaga ta''sir qilmaydigan xususiyatlarni tashlab yuboradi: to‘rtburchak perimetri uchun rangi kerak emas.

**Yechilgan misol: kirishdagi xatoni oldindan aniqlash — Yechilgan misol:**

Masala: $a,b,c$ tomonlar bo‘yicha uchburchak mavjudligini tekshirish.

**Yechim:**

Kirish -- uchta haqiqiy son. Shartlar: $a>0,b>0,c>0$ va $a+b>c$, $a+c>b$, $b+c>a$. Shu shartlarning **barchasi** rost bo‘lsa, uchburchak mavjud. $a=3,b=4,c=7$ bo‘lganda $3+4>7$ yolg‘on, demak uchburchak yo‘q. $3,4,5$ uchun barcha shartlar rost.

**Darslikdagi nozik holat: AND va OR — Diqqat:**

9-sinf milliy darsligining PDF 31-sahifasidagi uchburchak mavjudligini tekshiruvchi misolda ayrim nojo‘ya shartlarni «va» bilan bog‘lash ko‘rinishi uchraydi. **Uchburchak mavjud emas** degan xulosa uchun kamida *bitta* tengsizlik buzilishi kifoya: $a+b\le c\ \lor\ a+c\le b\ \lor\ b+c\le a$. Bu yerda **OR** zarur. Bundan tashqari, xato holatda yuza hisoblanmasdan algoritm yakunlanishi kerak. Ushbu izoh matematik tekshiruv asosidagi aniqlashtirishdir, darslik matnining ko‘chirmasi emas.

### Algoritm, qadam, ijrochi va ko‘rsatmalar tizimi

**Algoritm — Ta’rif:**

Ijrochi uchun qo‘yilgan masalani yechishga qaratilgan **aniq**, **tushunarli** va **chekli** ko‘rsatmalar ketma-ketligi algoritm deyiladi. Har bir alohida bajariladigan ko‘rsatma -- **qadam**. Bu milliy 9-sinf darsligining PDF 28--30-sahifalarida berilgan yondashuvga mos.

**Ijrochi** inson, robot yoki tegishli texnik tizim bo‘lishi mumkin. **Ijrochining ko‘rsatmalar tizimi (IKT)** -- u bevosita bajara oladigan buyruqlar to‘plami. Robotda faqat \{oldinga, chapga 90$^\circ$\} buyruqlari bo‘lsa, «o‘ngga 90$^\circ$» bevosita buyruq emas. Ammo «chapga 90$^\circ$»ni uch marta bajarish orqali o‘sha natijaga erishiladi. **Algoritm** reja, **dastur** esa uni muayyan dasturlash tilida yozib, bajaruvchi muhiti uchun ifodalashdir; bir algoritm ko‘plab tillarda amalga oshirilishi mumkin.

### Algoritmning asosiy besh xossasi

**Xossa** — **Qat''iy mazmun** — **Buzilish namunasi**
Diskretlilik — Jarayon alohida qadamlarga ajraladi — O‘tish qadamlarini ajratib bo‘lmaydi
Aniqlilik — Har bir ko‘rsatma bir ma''noda talqin qilinadi — «Bir oz kut», «ozgina chapga»
Tushunarlilik — Buyruq ijrochining imkoniyatiga mos keladi — Burilmaydigan qurilmaga «buril» deyish
Ommaviylik — Bir sinfdagi masalalarga tatbiq qilinadi — Faqat bitta son uchun mo‘ljallangan yechim
Natijaviylik — Chekli vaqtda natija yoki asosli yakun bo‘ladi — Shartsiz cheksiz takrorlash

**Natijaviylik -- «faqat yaxshi natija» degani emas — Farqlash:**

To‘g‘ri tekshiruvchi algoritm «yechim yo‘q», «kiritish mumkin emas», «fayl topilmadi» degan asosli yakunni ham qaytarishi mumkin. Muhimi, *masala talabiga muvofiq aniq yakun* berilishi. Hech qachon tugamaydigan jarayonni shunchaki «natijaviy» deb bo‘lmaydi.

**Tezkor tekshiruv protokoli — Attestatsiya:**

(1) Maqsad berilganmi? (2) Kirish sohasi aniqmi? (3) Ijrochi barcha buyruqlarni bajara oladimi? (4) Har bir yo‘lda qiymat aniqlanadimi? (5) Algoritm barcha talab qilingan kirishlarda to‘xtaydimi?

*Manba: M9 -- 9-sinf milliy darsligi, PDF 18--31; L -- Ma''ruza (Tayyor), PDF 46--48. Amaliy shartlar va test protokoli mualliflik sintezi.*','S3.ALGO.01'),
(2,'Algoritmni ifodalash: blok-sxema va psevdokod','**Maqsad:**
Bir algoritmni so‘z, formula, blok-sxema va psevdokodda bir xil ma''noda tasvirlash; grafik shaklni to‘g‘ri tanlash.

### Besh asosiy tasvirlash usuli

9-sinf milliy darsligi PDF 31--35-sahifalarda algoritmni **so‘zli**, **formulali**, **jadval**, **grafik** va **dastur** ko‘rinishida ifodalashni ko‘rsatadi. Psevdokod shu aniq, ammo dasturlash tilidan mustaqil ifodalashning amaliy usulidir. Bitta algoritmning turli ifodalari *bir xil kirishda bir xil natija* berishi kerak.

**Yagona algoritm -- bir nechta ifoda — Yechilgan misol:**

Masala: $a$ va $b$ ning yig‘indisi.

**Yechim:**

**So‘zli:** ikkita sonni o‘qi; ularni qo‘sh; natijani ko‘rsat.

**Formula:** $s=a+b$.

**Psevdokod:** KIRIT $a,b$; $s\leftarrow a+b$; CHIQAR $s$.

**Blok-sxema:** kirish, hisoblash va chiqish bloklari strelka bilan ketma-ket ulanadi.

### Blok-sxema belgilarini aniq farqlash

**Shakl** — **Vazifa**
Oval / yumaloq terminal — Algoritm boshlanishi yoki tugashi
Parallelogramm — Qiymat kiritish, natijani chiqarish
To‘g‘ri to‘rtburchak — Hisoblash, qiymat berish, bir nechta jarayon amali
Romb — Mantiqiy shart, odatda HA / YO‘Q yo‘li
Yo‘nalishli chiziq — Buyruqlar bajarilishining navbatdagi yo‘li
Ikki yon chiziqli to‘rtburchak — Oldindan tavsiflangan yordamchi jarayon

[Blok-sxemaning asl chizmasi V2 PDF qo‘llanmasida mavjud; veb uchun grafik qayta tayyorlanishi kerak.]

*Chizma: Yig‘indi algoritmining blok-sxemasi. Mualliflik chizmasi.*

### Psevdokodning tayanch konstruksiyalari

**Yozuv** — **Ma''nosi**
$A\leftarrow 5$ — 5 qiymatini $A$ ga berish
`IF shart THEN` — Shart rost bo‘lsa, tegishli qismni bajarish
`ELSE` — Shart yolg‘on bo‘lsa, muqobil qismni bajarish
`FOR i=1..n` — $i$ ning berilgan qiymatlarida sanagich sikli
`WHILE shart DO` — Shart rost bo‘lganida takrorlash
`mod`, `div` — Butun qoldiq va butun bo‘lish bo‘lagi

**Qiymat berish -- matematik tenglik emas — Diqqat:**

$A\leftarrow A+1$ bajarilishi mumkin: o‘ngdagi eski $A$ o‘qiladi, 1 qo‘shiladi va yangi qiymat $A$ ga yoziladi. Lekin oddiy matematik tenglik $A=A+1$ noto‘g‘ri. Ko‘plab attestatsiya savollarida shu farq tekshiriladi.

### Tarmoqlanish sxemasini o‘qish

[Blok-sxemaning asl chizmasi V2 PDF qo‘llanmasida mavjud; veb uchun grafik qayta tayyorlanishi kerak.]

*Chizma: Ikki son maksimumini tanlashning shartli sxemasi.*

**Sxemadagi nazorat savollari — Izoh:**

Har bir rombning chiqishlari nimaga mos? Qaysi yo‘lda natija aniqlanadi? Sikl bo‘lsa orqaga qaytish strelkasi bormi? Terminalga hech bir shartdan o‘tmay qolish ehtimoli bormi? Bloklar turiga qarab nomni emas, *vazifani* baholang.

*Manba: M9 -- 9-sinf, PDF 31--35; L -- Ma''ruza (Tayyor), PDF 47--48; C11 -- Cambridge+ 10--11-sinf, PDF 275--277 (qo‘shimcha tizim/grafika konteksti, asosiy algoritm manbasi emas). Diagrammalar qayta chizilgan.*','S3.ALGO.02'),
(3,'Chiziqli va tarmoqlanuvchi algoritmlar','**Maqsad:**
Chiziqli jarayonni shartli tanlashdan ajratish, chegaraviy qiymatlarda birorta yo‘lni yo‘qotmasdan algoritm tuzish.

### Chiziqli tuzilma

**Chiziqli algoritm** -- amallar hech qanday shart bilan ajratilmasdan, navbati bilan bajariladi. Masalan, $a,b>0$ tomonli to‘g‘ri to‘rtburchak uchun $P=2(a+b)$, $S=ab$, $d=\sqrt{a^2+b^2}$. Har bir qiymat uning oldidagi zarur ma''lumotlar tayyor bo‘lgandan so‘ng hisoblanishi kerak.

**Yechilgan misol: formuladagi amallar tartibi — Yechilgan misol:**

$a=3$, $b=4$ bo‘lsa: $P=2(3+4)=14$, $S=3\cdot4=12$, $d=\sqrt{3^2+4^2}=5$. Algoritm: kirit $a,b$; hisobla $P,S,d$; uchta natijani chiqar. **Tekshiruv:** birliklar mos, ildiz osti manfiy emas.

### Bir tomonlama va ikki tomonlama tanlash

**IF va IF--ELSE — Farqlash:**

**Bir tomonlama:** «agar $x>0$ bo‘lsa, $y\leftarrow x^2$» -- shart yolg‘on holatda $y$ aniqlanmasligi mumkin.

**To‘liq:** «agar $x>0$ bo‘lsa $y\leftarrow x^2$, aks holda $y\leftarrow -x$» -- ikkala yo‘lda qiymat bor. Har ikki holat uchun to‘g‘ri natija talab qilinsa, to‘liq tarmoqlanish xavfsizroq.

### Ko‘p tarmoqli shart va shartlar ustuvorligi

Masala: sonning ishorasini aniqlash.

```
[fontsize=\small]
KIRIT x
AGAR x < 0 BO''LSA
    CHIQAR "manfiy"
AKS HOLDA AGAR x = 0 BO''LSA
    CHIQAR "nol"
AKS HOLDA
    CHIQAR "musbat"
TAMOM

```

$x$ — $x<0$ — **Natija**
$-6$ — Rost — manfiy
$0$ — Yolg‘on — nol
$8$ — Yolg‘on — musbat

**Chegaraviy qiymatlar — Diqqat:**
`X >= 0` degan shart «musbat»ni anglatmaydi: nol musbat emas. Algoritmda «nol» alohida sinf bo‘lsa, $x>0$, $x<0$ va $x=0$ uch holatning hammasi ko‘rilishi lozim.

### Masalani matematik aniqlik bilan ifodalash

**Yechilgan misol: uchta sondan maksimalni topish — Yechilgan misol:**

Kirish $a,b,c$. Avval $m\leftarrow a$. Agar $b>m$ bo‘lsa $m\leftarrow b$. Agar $c>m$ bo‘lsa $m\leftarrow c$. Chiqar $m$. 

**Yechim:**

Misol $(-4,-2,-7)$ uchun iz: $m=-4\rightarrow-2\rightarrow-2$. Chiqish $-2$. $m=0$ bilan boshlansa, barcha qiymatlar manfiyligi sabab natija xato bo‘lardi. Ushbu yechim tenglikda ham ishlaydi, chunki $>$ bajarilmasa eski maksimum saqlanadi.

### Tarmoqlar to‘g‘riligini tekshirish

Shartlarni **to‘liq qamrov** va **o‘zaro istisno** mezonlari bilan baholang. Masalan, `IF x>0` va alohida `IF x<0` berilsa $x=0$ da ikkisi ham ishlamaydi. Shuningdek, quyidagi uchburchak shartini unutmang: uchta musbat tomonning *barcha* juft yig‘indilari uchinchi tomondan katta bo‘lishi kerak. Bu **AND** bog‘lanishi. Bitta talabning buzilishi haqidagi *inkor* esa **OR** bilan ifodalanadi.

*Manba: M9 -- 9-sinf, PDF 36--40; L -- Ma''ruza (Tayyor), PDF 49--53. Max va uch holat misollari shu mazmun asosida qayta tuzilgan.*','S3.ALGO.03'),
(4,'Takrorlanish va ichma-ich sikllar','**Maqsad:**
FOR, WHILE, avval/so‘ng tekshiriladigan sikllarni farqlash, sikl natijasini hisoblash, to‘xtash shartini asoslash.

### Siklning uch tarkibi

**Takrorlanuvchi algoritm** -- biror qismni shart yoki parametr qiymatlari asosida qayta bajaradigan algoritm. Zarur qismlar: **boshlang‘ich holat**, **davomiylik sharti**, **holat o‘zgarishi**. Ushbu uchtadan biri e''tiborsiz qolsa cheksiz sikl yoki noto‘g‘ri natija kelib chiqadi.

**Tuzilma** — **Bajarilish xususiyati** — **Eng muhim farq**
FOR — Sanagich yoki belgilangan diapazon — Takror soni oldindan ma''lum bo‘lishi mumkin
WHILE — Shart *oldin* tekshiriladi — Dastlabki shart yolg‘on bo‘lsa, tana 0 marta
REPEAT--UNTIL — Shart *keyin* tekshiriladi — Tana kamida 1 marta bajariladi

### Yig‘indi va ko‘paytmaning to‘g‘ri boshlanishi

**Neytral element — Ta’rif:**
**Yig‘indi** $S\leftarrow0$ bilan, **ko‘paytma** $P\leftarrow1$ bilan boshlanadi. Chunki $0+a=a$ va $1\cdot a=a$. $P\leftarrow0$ deb boshlangan ko‘paytma yangilansa ham 0 bo‘lib qoladi.

**Yechilgan misol: $1+2+\cdots+n$ — Yechilgan misol:**

```
[fontsize=\small]
KIRIT n          // n >= 0
S <- 0
FOR i <- 1..n
    S <- S + i
CHIQAR S

```

**Yechim:**

$n=5$ bo‘lsa, $S$: $0,1,3,6,10,15$. Umumiy formula $S=n(n+1)/2$. $n=0$ da sikl tanasi bajarilmaydi va $S=0$: bu to‘g‘ri, chunki bo‘sh yig‘indi 0.

[Blok-sxemaning asl chizmasi V2 PDF qo‘llanmasida mavjud; veb uchun grafik qayta tayyorlanishi kerak.]

*Chizma: $1$ dan $n$ gacha yig‘indini hisoblash algoritmi.*

### Shart va chegaralarning ahamiyati

**`i<n — Farqlash:**
 va \texttt{i<=n`}
$i=1$ dan boshlansa, `i<n` da oxirgi bajariladigan $i=n-1$, `i<=n` da oxirgisi $i=n$. Masalan, $n=5$ uchun mos ravishda 4 va 5 marta bajariladi. **Off-by-one** xatolari ko‘p hollarda $<$ / $\le$ farqini e''tiborsiz qoldirishdan kelib chiqadi.

### Ichma-ich sikl

Tashqi FOR 3 marta, ichki FOR har safar 4 marta bajarsa, ichki amal jami $3\cdot4=12$ marta bajariladi. Ammo ichki diapazon tashqi sanagichga bog‘liq bo‘lsa, sonni avtomatik ko‘paytirib bo‘lmaydi: `FOR i=1..n; FOR j=1..i` uchun jami $1+2+\cdots+n=n(n+1)/2$.

**Yechilgan misol: uchburchak ko‘rinishli bosma — Yechilgan misol:**

Tashqi $i=1,2,3,4$ bo‘lganda ichki sikl $j=1..i$ va bir dona yulduzcha chiqarsa, satrlardagi belgilar soni $1,2,3,4$, jami $10$. **Tekshiruv:** $4\cdot5/2=10$. To‘rt satr har xil uzunlikda bo‘lgani uchun $4\cdot4=16$ noto‘g‘ri.

### Takrorlash invariantlari va to‘xtash

Siklning har davri uchun haqiqiy bo‘lib qoladigan shart **invariant** deyiladi. Yig‘indi algoritmida $i$ ga o‘tishdan oldin $S=1+\dots+(i-1)$ bo‘lishi -- invariant. To‘xtash uchun $i$ o‘sishi va $i\le n$ shartining bir vaqt kelib yolg‘on bo‘lishi ko‘rsatiladi. $i\leftarrow i$ bo‘lsa, bu kafolat yo‘q.

*Manba: M9 -- 9-sinf, PDF 41--47; M6 -- 6-sinf, PDF 5--22 (Scratch tarmoqlanish va takrorlash); L -- Ma''ruza (Tayyor), PDF 54--55.*','S3.ALGO.03'),
(5,'Aralash algoritmlar va Yevklid usuli','**Maqsad:**
9-sinf milliy darsligining 24-darsini to‘liq qamrab olish: chiziqli, tarmoqlanuvchi va takrorlanuvchi konstruksiyalarni birlashtirish; bitta masalani so‘z, psevdokod va blok-sxemada yechish; sinov kiritishlari bilan natijani tekshirish.

### Aralash algoritmning ta''rifi va o‘rni

**Aralash algoritm — Ta’rif:**

**Tarkibida bir necha turdagi algoritmik tuzilmalar qatnashgan algoritm** **aralash (kombinatsiyalashgan) algoritm** deyiladi. Bu 9-sinf milliy darsligining 24-darsida (PDF 45--47) berilgan ta''rifga tayangan mazmundir. Masalan, ma''lumotlar ketma-ketligini o‘qish -- chiziqli, har elementni qayta tekshirish -- takrorlanuvchi, mos elementlarni tanlash -- tarmoqlanuvchi boshqaruvdir.

**Muhim farq: ketma-ketlik va aralashlik — Farqlash:**

Har qanday dastur buyruqlari ketma-ket joylashadi. Lekin barcha ketma-ket dasturlarni avtomatik *aralash* deb bo‘lmaydi: aralashlik uchun turli *boshqaruv tuzilmalari* (masalan, sikl ichida shart) birgalikda qatnashishi talab etiladi.

### 25 bahodan a''lochilar sonini topish

Bu 9-sinf milliy darsligi PDF 45--46-sahifasidagi masala g‘oyasiga tayangan yangidan yozilgan yechim.

**Masala va yechimni tekshirish — Yechilgan misol:**

Sinfda 25 o‘quvchi bor. Baho qiymatlari bitta-bitta kiritiladi. Nechta o‘quvchi 5 baho olganini toping.

**Yechim:**

**Kirish:** $b_1,b_2,\dots,b_{25}$; **chiqish:** $K$ -- 5 baholar soni.

**Bosqichlar:** $K\leftarrow0$; $i=1,\dots,25$ uchun $b_i$ ni o‘qi; agar $b_i=5$ bo‘lsa, $K\leftarrow K+1$; yakunda $K$ ni chiqar.

**Tekshiruv:** baholar $[5,4,5,3,5]$ bo‘lganda beshta qiymat ichidan uchta besh aniqlanadi. 25 bahoning hammasi 4 bo‘lsa $K=0$, hammasi 5 bo‘lsa $K=25$. Hisoblagichni har qadamda nollash mumkin emas.

**Blok-sxema (qisqartirilgan, lekin o‘qiladigan):**
\resizebox{.88\textwidth}{!}{[Blok-sxemaning asl chizmasi V2 PDF qo‘llanmasida mavjud; veb uchun grafik qayta tayyorlanishi kerak.]}

**Psevdokod — Izoh:**

`K <- 0; FOR i = 1..25: KIRIT baho; IF baho = 5 THEN K <- K+1; CHIQAR K`.

*FOR* -- takrorlash, *IF* -- tanlash, *K<-K+1* -- hisoblagichni yangilash.

### Filtrlangan yig‘indi va ko‘paytma

**5 ga karrali sonlarni yig‘ish — Yechilgan misol:**

$1$ dan $n$ gacha 5 ga karrali sonlar yig‘indisini topish algoritmi:

$S\leftarrow0$; $i=1,\dots,n$ da $i\bmod5=0$ bo‘lsa $S\leftarrow S+i$; chiqar $S$.

$n=17$ da $S=5+10+15=30$. $n=4$ da $S=0$. **Kiritish sharti:** $n\geq0$ butun son. $n<0$ ni bu shartda rad etish zarur.

**Musbat sonlar ko‘paytmasi — Yechilgan misol:**

$[-3,5,0,4,-2]$ orasida faqat musbat sonlar ko‘paytmasi: $P\leftarrow1$; har $x$ uchun $x>0$ bo‘lsa $P\leftarrow P\cdot x$. Natija $20$. 

**Yechim:**

$P=0$ dan boshlash noto‘g‘ri. **Nozik chegara**: barcha elementlar manfiy yoki nol bo‘lsa, ko‘paytma matematik kelishuvga ko‘ra $1$ bo‘lishi mumkin; agar topshiriq *«musbat element yo‘q»* xabarini talab qilsa, qo‘shimcha hisoblagich kiritish kerak.

### Yevklid algoritmi -- aynan aralash jarayon

9-sinf darsligining PDF 46-sahifasida **EKUB**ni takroriy ayirish bilan topish aralash algoritm sifatida ko‘rsatilgan. Natural $A,B>0$ uchun:

**Ayirish usuli — Izoh:**

**Toki** $A\ne B$: **agar** $A>B$ bo‘lsa $A\leftarrow A-B$, **aks holda** $B\leftarrow B-A$. **Chiqar** $A$. 
 Bu yerda WHILE + IF birlikda ishlaydi. Har qadam katta sondan kichikni ayiradi. $A=B$ bo‘lganda natija EKUB bo‘ladi.

**Misol: EKUB(18,30) — Yechilgan misol:**

$$(18,30)\to(18,12)\to(6,12)\to(6,6).$$
EKUB $=6$. **Muammoli qiymat:** nol yoki manfiy kirish berilsa, yuqoridagi usul kafolatlangan to‘xtashga ega emas. Shu sabab $A,B>0$ sharti aniq yozildi.

\resizebox{.80\textwidth}{!}{[Blok-sxemaning asl chizmasi V2 PDF qo‘llanmasida mavjud; veb uchun grafik qayta tayyorlanishi kerak.]}

### Kvadrat tenglamaning shartli algoritmi

Darslik PDF 47-sahifasida $ax^2+bx+c=0$ masalasi blok-sxema bilan beriladi. $a\ne0$ shartida $D=b^2-4ac$.

**Shart** — **Natija**
$D<0$ — Haqiqiy ildizlar mavjud emas.
$D=0$ — Yagona haqiqiy ildiz $x=-b/(2a)$.
$D>0$ — Ikkita turli ildiz: $x_{1,2}=(-b\pm\sqrt D)/(2a)$.

**Matematik aniqlashtirish — Diqqat:**

Bu sxema $a\ne0$ uchun ishlaydi. Agar $a=0$ bo‘lsa, tenglama chiziqli yoki ayniyat/ziddiyat bo‘lishi mumkin. **Avval $a=0$ holatini tekshiring**; aks holda $2a=0$ ga bo‘lish xatosi yuz beradi. Bu -- manbadan kelib chiqqan aniqlashtirish.

### Aralash algoritmning mantiqiy auditi

**Tekshiruv** — **Amaliy savol**
Tanlangan element — Shart sikl *ichida*mi, har bir element tekshirildimi?
Boshlanish — Yig‘indi 0 dan, ko‘paytma 1 dan boshlanadimi?
Chegaraviy holat — 0 ta mos element, barcha element mos, $n=0$ holatlari tekshirildimi?
To‘xtash — Takrorlanishda sanagich yoki qiymat to‘xtash tomon o‘zgaradimi?
Natija — IF ning rost/yolg‘on yo‘llarida chiqish aniqlanadimi?

**Attestatsiya uslubidagi diagnostika — Attestatsiya:**

Agar FOR sikli ichidagi `IF baho=5` sharti sikldan *tashqariga* ko‘chirilsa, natija 25 o‘quvchi uchun noto‘g‘ri bo‘lishi mumkin: boshqa o‘quvchilarning baholari tekshirilmaydi. Buni ko‘rsatish uchun $[5,4,5,3,5]$ va $[4,4,4,4,4]$ to‘plamlari bilan kod izini tuzing.

*Manba: M9 -- 9-sinf milliy ICT, PDF 45--47, «24-dars. Aralash (kombinatsiyalashgan) algoritmlar»: 25 bahodan a''lochilarni sanash, Yevklid ayirish usuli, diskriminantli sxema va uy mashqlari. Formulalar va audit misollari mazmuniy qayta ishlangan; sxemalar qayta chizilgan.*','S3.ALGO.03'),
(6,'Algoritmni tekshirish va mantiqiy xatolar','**Maqsad:**
Trace table, dry run, normal/chegaraviy/noto‘g‘ri kirish orqali haqiqiy natijani mustaqil tekshirish; tuzatishni sabab bilan asoslash.

### Izma-iz bajarish usuli

**Dry run** -- algoritmni kompyutersiz berilgan qiymatlarda bosqichma-bosqich yuritish. **Trace table** esa muhim o‘zgaruvchilarning har bir qadamdagi qiymatini jadvalga yozishdir. Bu terminlar darslikdagi «qadam/amallar/o‘zgaruvchi/shart» jadvallarining tizimli nomi bo‘lib, mazmun 9-sinfning PDF 41--47-sahifalaridagi misollarga mos.

**Yechilgan misol: qo‘shish va yangilash tartibi — Yechilgan misol:**

Psevdokod: $A\leftarrow2$; $B\leftarrow5$; $A\leftarrow A+3$; $C\leftarrow A\cdot B$; $B\leftarrow C-A$.

**Yechim:**

Boshlanish — 2 — 5 — --
$A\leftarrow A+3$ — 5 — 5 — --
$C\leftarrow A\cdot B$ — 5 — 5 — 25
$B\leftarrow C-A$ — 5 — 20 — 25

Natija $A=5,B=20,C=25$. $C$ hisoblanganda eski $A=2$ ni ishlatish xatodir.

### Test toifalari

**Tur** — **Vazifa** — **Misol, yosh 7--17**
Normal — Kutilgan odatiy to‘g‘ri kirish — 12
Chegaraviy — Chegara va yaqin qiymatlar — 6,7,17,18
Noto‘g‘ri — Ruxsat etilmagan kirish — 18, matnli qiymat

Chegaraviy test $6$ yoki $18$ qiymatlarda *rad etilishini*, $7$ yoki $17$ da esa *qabul qilinishini* tekshiradi. Bu ikkita toifa ustma-ust kelishi mumkin: $18$ ham chegaraga yaqin, ham noto‘g‘ri kirishdir. Shuning uchun test maqsadini ochiq yozish zarur.

### Xatolar xaritasi

**Xatolik** — **Tashxis usuli**
Boshlang‘ich qiymat — $S=0$, $P=1$, maksimum uchun birinchi element
Qadam tartibi — Eski qiymat qachon o‘qilgani trace jadvalda
$<$ / $\le$ — Chegaraviy ma''lumot bilan tekshirish
Nolga bo‘lish — Har bir bo‘luvchining noldan farqliligini tekshirish
Cheksiz sikl — Sanagich va to‘xtash sharti o‘zgarishini tekshirish
Qoplanmagan tarmoq — Barcha mantiqiy holatlarda chiqish aniqlanganmi
Ijrochi xatosi — Buyruq ko‘rsatmalar tizimida mavjudmi

**«To‘g‘rilangan retry» -- mustaqil to‘g‘ri javob emas — Diqqat:**

Qanday xato borligini ko‘rgach, o‘sha savolni qayta ishlash o‘rganish uchun foydali, biroq tushunchani egallaganlikni faqat yangi vaziyatdagi mustaqil yechim tasdiqlaydi. Test bankida xatoni sababiga ko‘ra belgilang va boshqa kirish qiymatida qayta sinang.

### Invariantsiz ishlovchi shartni fosh etish

**Yechilgan misol: sonlarni almashtirish — Yechilgan misol:**

Noto‘g‘ri ko‘rsatma: $A\leftarrow B$; $B\leftarrow A$. Dastlab $A=2,B=9$ bo‘lsa, ikkalasi ham 9 bo‘lib qoladi. To‘g‘ri algoritm: $T\leftarrow A$; $A\leftarrow B$; $B\leftarrow T$. Endi $A=9,B=2$ bo‘ladi. Vaqtinchalik qiymat eski $A$ ni yo‘qotmaslik uchun kerak.

*Manba: M9 -- 9-sinf, PDF 29--47 (qadamlar jadvali va sikl izlari); C11 -- Cambridge+ 10--11-sinf, PDF 25--30 (validatsiya, verifikatsiya farqi); SPETS -- 2026, PDF 4. Diagnostika jadvali sintez.*','S3.ALGO.04'),
(7,'Klassik hisoblash va qidirish usullari','**Maqsad:**
Algoritm turini vazifaga mos tanlash; yig‘indi, faktorial, EKUB, maksimum, raqamlar va qidirish masalalarini yechish.

### Yig‘indi, faktorial va raqamlar yig‘indisi

**Yig‘indi:** $1+\dots+n=n(n+1)/2$ ($n\ge0$ butun). **Faktorial:** $n!=1\cdot2\dots n$, $0!=1$. **Raqamlar yig‘indisi:** har takrorda $d\leftarrow n\bmod10$, $S\leftarrow S+d$, $n\leftarrow n\mathbin{\mathrm{div}}10$. Kirish manfiy bo‘lishi mumkin bo‘lsa avval modul olinadi; $n=0$ da raqamlar yig‘indisi 0, ammo raqamlar *soni* 1 ekanini unutmaslik kerak.

**Yechilgan misol: $n=5072$ raqamlar yig‘indisi — Yechilgan misol:**

**Yechim:**

$5072\bmod10=2$, keyingi $n=507$; $507\bmod10=7$, keyingi $n=50$; $50\bmod10=0$, keyingi $n=5$; $5\bmod10=5$, yakun $n=0$. Yig‘indi $2+7+0+5=14$. Raqamlar **soni** 4, yig‘indisi esa 14.

### Maksimum va minimumni izlash

To‘plam $a_1,\dots,a_n$ bo‘lsin, $n\ge1$. Boshlanish $M\leftarrow a_1$; har keyingi element uchun «agar $a_i>M$ bo‘lsa $M\leftarrow a_i$». Bu $n-1$ ta taqqoslash bilan maksimalni beradi. Barcha elementlar manfiy bo‘lishi mumkinligi uchun universal $M\leftarrow0$ xato. Minimum uchun $<$ ishlatiladi.

### Yevklid algoritmi

**EKUB uchun qoldiqli Yevklid usuli — Ta’rif:**

$a,b\ge0$ va kamida bittasi musbat bo‘lsa, $b\ne0$ davrida $r\leftarrow a\bmod b$, $a\leftarrow b$, $b\leftarrow r$. So‘nggi nol bo‘lmagan $a$ -- **EKUB**. Darsliklarda takroriy ayirish shakli ham berilgan; qoldiqli bo‘lish ko‘pincha kamroq takror talab qiladi.

**Yechilgan misol: EKUB(252,105) — Yechilgan misol:**

**Yechim:**

$252=2\cdot105+42$; $105=2\cdot42+21$; $42=2\cdot21+0$. Demak, $\operatorname{EKUB}(252,105)=21$. **Tekshiruv:** 252 va 105 ikkalasi ham 21 ga bo‘linadi; keyingi qoldiq 0.

[Blok-sxemaning asl chizmasi V2 PDF qo‘llanmasida mavjud; veb uchun grafik qayta tayyorlanishi kerak.]

*Chizma: Yevklidning qoldiqli algoritmi (kamida bittasi musbat bo‘lgan manfiy bo‘lmagan butun sonlar uchun).*

### Chiziqli va ikkilik qidiruv

**Chiziqli qidiruv** saralanmagan ro‘yxatdagi elementlarni ketma-ket tekshiradi: eng yomon holatda $n$ ta taqqoslash. **Ikkilik qidiruv** esa **oldindan saralangan** ro‘yxatda o‘rtadagi elementni tekshiradi, talabga mos yarmini saqlab qoladi. Interval kattaligi taxminan $\log_2 n$ marta qisqaradi. Saralash sharti bo‘lmasa oddiy ikkilik qidiruv xato natija berishi mumkin.

**Yechilgan misol: 7 elementli saralangan ro‘yxat — Yechilgan misol:**

$[2,5,8,12,15,19,24]$ ro‘yxatdan 19 ni topish: dastlab o‘rtadagi 12 bilan solishtiriladi ($19>12$), o‘ng yarmiga o‘tiladi; keyingi o‘rta 19 bo‘lsa topildi. Ikki tekshiruv yetdi. **Chegara:** yo‘q qiymat uchun ham qidiruv yakunlanishi shart; «topilmadi» asosli natija.

### Saralash va klassik masala turlarini farqlash

Saralash -- elementlarni kalit bo‘yicha tartiblash; qidirish -- ma''lum qiymat mavjudligini yoki joylashuvini aniqlash; maksimum -- eng katta qiymatni ajratish. Har doim butun ro‘yxatni saralash shart emas: faqat maksimum kerak bo‘lsa, bitta chiziqli o‘tish yetarli bo‘lishi mumkin. Psevdokod va nazariya darajasida algoritm mantig‘ini o‘rganish mazkur bo‘limning maqsadidir; amaliy dasturlash sinaksisi keyingi mazmun sohasida.

*Manba: M9 -- 9-sinf, PDF 30 (Yevklidning ayirish varianti), 40--47 (takrorlash, EKUB); L -- Ma''ruza (Tayyor), PDF 54--55. Qoldiqli algoritm, qidiruv va taqqoslash bo‘limi -- 2026 spetsifikatsiyasining «maqbul tanlash» talabini kengaytiruvchi mualliflik sintezi.*','S3.ALGO.04'),
(8,'Samaradorlik va maqbul algoritm','**Maqsad:**
Algoritm to‘g‘riligini yo‘qotmay vaqt/xotira xarajatini taqqoslash va masalaga mos variantni asoslab tanlash.

### Maqbullik -- birgina eng kam qadam emas

Algoritmlarning sifat mezoni: **to‘g‘rilik**, **yakunlanish**, **vaqt**, **xotira**, **kirish sharti** va **amalga oshirish qulayligi**. Bir marotaba 10 elementni qidirish uchun saralashdan ko‘ra chiziqli qidiruv oddiyroq bo‘lishi mumkin; million elementli allaqachon saralangan massivda takroriy qidiruv uchun ikkilik qidiruv ma''qul.

**Qo‘shimcha chuqurlashtirish — darslikning majburiy atamasi emas — Diqqat:**

Quyidagi *Big-O* yozuvi 2026 spetsifikatsiyasida mustaqil yodlanadigan termin sifatida keltirilmagan. U «eng maqbul algoritmni tanlash» mavzusining zamonaviy tahliliy kengaytmasi sifatida beriladi. Avvalo sodda amallar soni, aniqlik va kirish cheklovlari asosida tanlashni o‘rganing.

### O‘sish tartibi: $O(1)$, $O(\log n)$, $O(n)$, $O(n^2)$

Bu yozuvlar murakkablikning kirish hajmi oshgandagi **o‘sish tartibi**ni soddalashtirib ifodalaydi. Ularni hech qachon «aniq sekundlar» bilan aralashtirmang. Nazariyada konstantalar va aniq amallar modeli muhim bo‘lishi mumkin; qo‘llanmadagi taqqoslashlar asosan katta $n$ uchun o‘sish darajasi haqida.

**Tartib** — **Model misol** — **$n\to2n$ ta''siri**
$O(1)$ — 1 dan $n$ gacha formula bilan yig‘indi — Yetakchi xarajat o‘zgarmaydi
$O(\log n)$ — Saralangan ro‘yxatda ikkilik qidiruv — Taxminan bitta bosqich ortadi
$O(n)$ — Barcha elementlarni bir marta o‘qish — Taxminan ikki barobar
$O(n^2)$ — Har $i$ uchun $i$ martalik ichki sikl — Taxminan to‘rt barobar

**Attestatsiya chegarasi — Diqqat:**

$O$-belgilashlari ma''lumotni izchil tahlil qilish uchun **qo‘shimcha vosita**. 2026-yil spetsifikatsiyasida «eng maqbul algoritmni tanlash» deb yozilgan, unda `Big-O` atamasining o‘zi alohida majburiy atama sifatida sanalmagan. Shu sabab sinovda oddiy amallar sonini taqqoslash ham yetarli bo‘lishi mumkin.

### Ikki algoritmni aniq solishtirish

**Yechilgan misol: yig‘indi uchun ikki usul — Yechilgan misol:**

$1+2+\cdots+1000$ yig‘indisini topish: A usul -- 1000 ta qo‘shiluvchini siklda jamlash; B usul -- $n(n+1)/2$ formulasini hisoblash. Natija ikkala holda $500500$. B usul aniq formula sharti bajarilganda kamroq amal talab qiladi. Ammo yig‘indidagi sonlar ixtiyoriy ro‘yxat qiymatlari bo‘lsa, formula mos kelmaydi. **Tezroq bo‘lishning o‘zi** yetarli emas: **shartga moslik** birinchi.

**Yechilgan misol: turli o‘sish modelining farqi — Yechilgan misol:**

$A(n)=n$, $B(n)=n^2/2$ bo‘lsin. $n=40$ da $A(40)=40$, $B(40)=800$; B 20 marta ko‘p amal bajaradi. $n=80$ da $A(80)=80$, $B(80)=3200$; B 40 marta ko‘p. Demak, $O(n^2)$ usulning nisbiy xarajati $n$ bilan ortadi. Bu arifmetik mashq, real vaqtni bevosita o‘lchash emas.

### Maqbul variantni tanlash protokoli

- Masala maqsadi, kirish turi va chegaralarini yozing.

- Nomzod algoritmlar hammasi to‘g‘ri natija berishini va tugashini tekshiring.

- Kirish uchun kerakli dastlabki shartlarni tekshiring (masalan, ikkilik qidiruvda saralanganlik).

- Takrorlar sonini, vaqt va yordamchi xotirani baholang; kerak bo‘lsa boshlang‘ich xarajatlarni ham hisoblang.

- Talabga mosini tanlang va oddiy, chegaraviy, noto‘g‘ri kirishda qayta tekshiring.

### Yakuniy diagnostik masala

**Birlashtirilgan vaziyat — Attestatsiya:**

$[-4,-9,-2,-7]$ ro‘yxatidan eng kattasini topish kerak. A algoritm `MAX:=0` bilan boshlaydi; B algoritm `MAX:=birinchi element` bilan boshlaydi. Qaysi biri to‘g‘ri?

**Tekshirish:** A -- 0 beradi (xato), chunki 0 ro‘yxatda yo‘q. B -- $-2$ ni beradi (to‘g‘ri). B bir marta ro‘yxat bo‘ylab yuradi va $n-1$ ta taqqoslash qiladi. Butun ro‘yxatni oldindan saralash maqsad uchun shart emas. Shu bitta masala aniqlilik, chegaraviy test, bajarilish izi va maqbullikni birga tekshiradi.

### Imtihon oldi 12 bandli tezkor karta

[itemsep=2pt]

- Masala maqsadi aniq yozilganmi?

- Kirish son/ro‘yxat sohasi (manfiy, nol, bo‘sh) belgilanganmi?

- Ijrochining buyruq tizimi hisobga olinganmi?

- Chiziqli, tarmoqlanuvchi, sikl tuzilmalari farqlanganmi?

- Romb sharti va HA/YO‘Q yo‘li to‘g‘rimi?

- Chiqarishdan oldin barcha o‘zgaruvchilar aniqlanganmi?

- $\leftarrow$ qiymat berish tartibi kuzatilganmi?

- Sikl boshida boshlang‘ich sanagich/jamlagich to‘g‘rimi?

- $<$ va $\le$ farqi tekshirilganmi?

- Chegaraviy va noto‘g‘ri qiymatlar uchun natija aniqmi?

- Tanlangan algoritm vaqt/xotira bo‘yicha asosliligi ko‘rsatilganmi?

- Yakuniy natija kutilgan qiymatdan mustaqil usul bilan tekshirilganmi?

*Manba: SPETS -- 2026-yil Informatika test spetsifikatsiyasi, PDF 4 («algoritmni tahlil qilish, berilgan muammo uchun eng maqbul algoritmni tanlash»). M9 -- PDF 29--30 va 40--47. $O$-belgilari va optimallashtirish tahlili -- spetsifikatsiya maqsadi asosida kengaytirilgan tushuntirish.*','S3.ALGO.04');
DO $$
BEGIN
 IF (SELECT count(*) FROM public.modules WHERE code='M06')<>1 OR
    (SELECT count(*) FROM public.constructs WHERE code like 'S3.ALGO.0%')<4
 THEN RAISE EXCEPTION 'M06 or S3.ALGO constructs missing'; END IF;
END $$;
INSERT INTO public.lessons(id,module_id,order_idx,slug,title_uz,body_mdx,blocks,blocks_kind,est_minutes,topic_test_question_count,status)
SELECT md5('attestatsiya:algo-v2:lesson:'||p.ch::text)::uuid,m.id,4+p.ch,'algoritmlash-v2-'||lpad(p.ch::text,2,'0'),p.title,p.body,
jsonb_build_array(jsonb_build_object('type','goal','label','V2 nazariya','content',p.title),jsonb_build_object('type','text','content',p.body)),
'chapter',35,20,'review'::content_status
FROM _algo_v2_lessons p JOIN public.modules m ON m.code='M06'
ON CONFLICT(id) DO NOTHING;
INSERT INTO public.lesson_constructs(lesson_id,construct_id,is_required,is_critical,min_questions)
SELECT l.id,c.id,true,false,3
FROM _algo_v2_lessons p JOIN public.lessons l ON l.slug='algoritmlash-v2-'||lpad(p.ch::text,2,'0')
JOIN public.constructs c ON c.code=p.construct_code
ON CONFLICT(lesson_id,construct_id) DO NOTHING;
DO $$
BEGIN IF (SELECT count(*) FROM public.lessons WHERE slug like 'algoritmlash-v2-%' AND status='review')<>8
THEN RAISE EXCEPTION 'Expected exactly 8 review lessons'; END IF; END $$;
COMMIT;
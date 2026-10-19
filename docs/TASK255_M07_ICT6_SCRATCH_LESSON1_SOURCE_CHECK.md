# TASK-255 — ICT 6-sinf, 1-dars: Scratch chiziqli dasturlarining M06/M07 manba tekshiruvi

**2026-10-19. Status: editorial REVIEW; kod yoki production ma'lumotlari o‘zgartirilmagan.**

## Bevosita ochilgan birlamchi manba
Fayziyeva va boshqalar, *Informatika va axborot texnologiyalari*, 6-sinf (2021), 1-dars «Scratch muhitida chiziqli dasturlar tuzish», **bosma 5–8-betlar**. Google Drive: `1e7ogcVQypNmSVdnqSZqI5ZqhWLP964vq`. Sahifalarning matni o‘qildi; grafik Scratch bloklarining har bir tasviri hali mustaqil vizual tasdiqlanmagan. PDF bosma bet bilan avtomatik tenglashtirilmagan.

## Qiyoslash / qaysi modullar
- **M06.02 / M06.01:** chiziqli algoritm — buyruqlar shartsiz, ketma-ket bajariladi. Tarmoqlanish yoki takrorlanish bilan adashtirmaslik kerak.
- **M07.03:** o‘zgaruvchi qiymati o‘zgarishi mumkin, o‘zgarmasning qiymati o‘zgarmaydi. Darslik: `Variables` → `Make a Variable`, barcha spraytga `For all sprites` va bitta spraytga `For this sprite only` ko‘lamlari. Repozitoriyning `src/data/topicContent.ts` M07.03 statik nazariyasida umumiy «Variables» va «Make a Variable» tushuntirishlari mavjud; aynan **ikki xil ko‘lam** learnerga ko‘rinadigan yakuniy content ekanini alohida runtime test talab qiladi.
- **M07.02/M07.03:** `ask`, qiymatni o‘zgaruvchiga belgilash, hisoblash, `join` bloklari bosqichma-bosqich misolda qo‘llangan. Blok tasvirlariga hali audit tasdig‘i berilmagan.
- **M07/M06 amaliy hisob:** kvadrat tomoni `a`: `S=a×a`, `P=4×a`. Samolyot `1440/800+510/850=2.4` soat. Ikkala bo‘lakning vaqtini **qo‘shish** kerak; `(1440+510)/(800+850)` noto‘g‘ri.

## Noto‘g‘ri kontent ko‘chishining oldini olish
- Ushbu materiallar M02 qurilmalar va operatsion tizimlar nazariyasiga qo‘shilmaydi.
- M07 published 12-lesson Scratch/LOGO katalogi mavjud; statik `M07.03` matni bilan published canonical lessonni bir xil deb hisoblab, avtomatik almashtirish mumkin emas.
- Darslikdagi interfeys nomlari versiyaga bog‘liq bo‘lishi mumkin, test kaliti mustaqil tekshiruvsiz o‘zgartirilmaydi.

## Aniq keyingi ish
1. M07 published real lesson/body va statik `M07.03` qaysi yo‘lda namoyon bo‘lishini runtime va catalog bilan qiyoslash.
2. Grafik Scratch skriptlarini asl sahifalar bilan vizual tekshirish.
3. Darslik 9–15-betlari bo‘yicha tarmoqlanuvchi bloklar va amaliy misollarni navbatma-navbat audit qilish.
4. Topilgan semantik kamchilikni alohida test bilan ko‘rsatib, so‘ng qattiq CI green bo‘lganda qo‘shish. Testlar yoki live DB uchun publish/merge/deployga bu qaydning o‘zi ruxsat bermaydi.

## Tekshiruv natijasi — statik katalog, 2026-10-19

`src/data/topicContent.ts` dagi `M07.03` **allaqachon** `For all sprites` va `For this sprite only` farqini, `set/change` bloklari, kvadrat yuzi misoli va 3 ta statik nazorat savolini qamrab oladi. Demak, bu terminlarni yo‘q deb dublikat qo‘shish **xato**; statik yo‘lda mazmuniy bo‘shliq aniqlanmadi. Savol banki uchun statik testlar published DBdagi manba tasdig‘i o‘rnini bosa olmaydi.

`src/features/content/catalog.ts` esa M07 uchun 12 ta published Scratch/LOGO darsini afzal ko‘radi. Shu sababli qolgan aniq xavf: **statik mavzu bilan live published darslarning bir-biridan farqlanishi**. Runtime learner lesson ID va sahifadagi mazmunni ko‘rmaguncha M07.03 butunlay yakunlandi deyilmaydi.

**Mavjud kodga oʻzgartirish kiritilmadi**, chunki hozir aniqlangan ta’riflar takroran yozilmasligi kerak. Keyingi ish — `catalog.ts` va published darslar orasidagi mappingni test orqali tekshirish.

## Keyingi o‘qilgan darslik bo‘limi — 4-dars, bosma 16–22

Google Drive ICT 6 (2021) asosiy matnida `forever`, `repeat`, `repeat until` taqqoslandi. `repeat` sanalgan marta ishlaydi; `repeat until` shart boshida rost bo‘lsa tanani hatto bir marta ham bajarmaydi; `forever` tashqi to‘xtatish yoki skript bekor qilinmaguncha davom etadi. 17–18-betlarda ichma-ich sikllar, 19–21-betlarda Sensing/Operators bloklari va shartli takrorlash yoritiladi. `M07.04`dagi qisqa statik nazariya bu uch blokni umumiy to‘g‘ri farqlagan, ammo u 16–22-betlardagi real amaliy rasmlarning to‘liq aksi emas; vizual kod tekshiruvi ochiq. Bosma 22-betdan boshlanadigan amaliy mashqlar ham alohida sahifama-sahifa yakuniy tekshiruvga muhtoj. Bu qo‘shimcha na savol kalitini, na DB statusini o‘zgartiradi.

/** TASK-273: HTML/CSS source-grounded reading from Cambridge+ ICT.
 * These authored educational blocks are not complete licensed textbook pages.
 */
import type { TheoryBlock } from '../topicContent'
export const M11_WEB_TEXTBOOK_ADDITIONS: Record<string, TheoryBlock[]> = {
  "M11.01": [
    { type: "heading", content: "HTML hujjatining semantik skeleti" },
    { type: "code", content: "<!doctype html>\n<html lang=\"uz\">\n<head><meta charset=\"utf-8\"><title>Dars</title></head>\n<body><main><h1>Algoritmlar</h1><p>Kirish matni.</p></main></body>\n</html>" },
    { type: "table", content: "| Element | Vazifasi | Farqi |\n|---|---|---|\n| `html` | Hujjatning asosiy elementi | Barcha mazmunni qamrab oladi |\n| `head` | Metadata va resurs ulanishlari | Odatda asosiy kontent emas |\n| `title` | Sahifa nomi | Brauzer varag‘ida ishlatiladi |\n| `body` | Ko‘rinadigan asosiy kontent | Hujjat tanasi |\n| `main` | Yetakchi mazmun | Semantik bo‘lim |\n| `h1` | Asosiy sarlavha | Matn kattaligi o‘rniga semantika |" },
    { type: "example", content: "Brauzer ekranda h1 ni kattaroq ko‘rsatishi mumkin, ammo sarlavhani faqat katta shriftli p bilan berish hujjatning semantik tuzilmasini to‘liq almashtirmaydi." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), veb-sayt loyihalash, HTML va CSS bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), veb uchun dasturlash mavzusi (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Sintaksis namunasi alohida original yozilgan." },
  ],
  "M11.02": [
    { type: "heading", content: "Matn, rasm va ro‘yxatning to‘g‘ri HTML belgilari" },
    { type: "table", content: "| Vazifa | HTML elementi | Sifat talabi |\n|---|---|---|\n| Abzas | p | Mazmunli matn |\n| Tartibli ro‘yxat | ol, li | Qadamlar ketma-ketligi |\n| Tartibsiz ro‘yxat | ul, li | Mustaqil bandlar |\n| Rasm | img | Manzil va muqobil tavsif |\n| Ta’kidlash | strong, em | Mazmunli urg‘u |" },
    { type: "code", content: "<h2>Qadamlar</h2>\n<ol><li>Masalani o‘qing</li><li>Yechimni sinang</li></ol>\n<img src=\"schema.png\" alt=\"Ikki bosqichli blok-sxema\">" },
    { type: "example", content: "Rasm ko‘rinmasa yoki o‘quvchi ekran o‘qigichidan foydalansa, `alt` tavsifi mazmunni ifodalashi kerak. Faqat «rasm» deb yozish odatda ma’lumot bermaydi." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), veb-sayt loyihalash, HTML va CSS bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), veb uchun dasturlash mavzusi (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Accessible alt tavsif va ro‘yxat misoli o‘quv amaliyoti." },
  ],
  "M11.03": [
    { type: "heading", content: "Jadval va forma — ma’lumotni ko‘rsatish va kiritish" },
    { type: "table", content: "| Element | Vazifa |\n|---|---|\n| table | Jadval konteyneri |\n| tr | Jadval satri |\n| th | Ustun/satr sarlavha yacheykasi |\n| td | Oddiy yacheyka |\n| form | Ma’lumot yuborish shakli |\n| label | Kiritish maydonining mazmunli nomi |\n| input | Kiritish nazorati |" },
    { type: "code", content: "<form><label for=\"ism\">Ism</label>\n<input id=\"ism\" name=\"ism\" required>\n<button type=\"submit\">Yuborish</button></form>" },
    { type: "example", content: "Jadvaldan faqat sahifa maketini chizish uchun foydalanish semantikaga zid bo‘lishi mumkin; ustun-satr bog‘liq haqiqiy ma’lumotda table afzal. Formada label va input bir-biriga ulansa foydalanish qulaylashadi." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), veb-sayt loyihalash, HTML va CSS bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), veb uchun dasturlash mavzusi (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Formani backendda xavfsiz qayta ishlash talab qilinadi; namuna real ma’lumot yig‘maydi." },
  ],
  "M11.04": [
    { type: "heading", content: "Giperhavola va mediakontent" },
    { type: "table", content: "| Element | Qo‘llanish | Eslatma |\n|---|---|---|\n| a href | Boshqa sahifaga o‘tish | Ko‘rinadigan havola matni tushunarli |\n| iframe | Boshqa resursni ichki ko‘rsatish | title, ruxsat/sandboxni ko‘rish |\n| audio | Tovushni joylash | controls kerak bo‘lishi mumkin |\n| video | Videoni joylash | Format va subtitr mosligi |\n| source | Alternativ media manba | Ko‘proq formatga moslik |" },
    { type: "code", content: "<a href=\"/darslar\">Darslar ro‘yxati</a>\n<video controls><source src=\"dars.mp4\" type=\"video/mp4\"></video>" },
    { type: "example", content: "URL’ni ko‘rsatadigan «shu yerga» iborasi o‘rniga «HTML bo‘yicha qo‘llanma» kabi maqsadli havola matni o‘quvchiga nima ochilishini aniqroq bildiradi." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), veb-sayt loyihalash, HTML va CSS bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), veb uchun dasturlash mavzusi (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Iframe va mediakontent misollari xavfsizlik/foydalanish nuqtayi nazaridan original sharh." },
  ],
  "M11.05": [
    { type: "heading", content: "CSS qoidasi, selektor va kaskad" },
    { type: "table", content: "| Atama | Izoh |\n|---|---|\n| Selektor | Qaysi elementlarga qoida qo‘llanadi |\n| Xossa | Nima o‘zgaradi: color, margin ... |\n| Qiymat | Xossaga beriladigan qiymat |\n| Kaskad | Mos keluvchi qoidalarning ustuvorligi |\n| Box model | Content + padding + border + margin |" },
    { type: "code", content: "h1 { color: #1e40af; }\n.card { padding: 1rem; border: 1px solid #ddd; }" },
    { type: "example", content: "H1 uchun tashqi CSSda yozilgan rangni boshqa ko‘proq ustuvor qoida o‘zgartirishi mumkin. Shuning uchun ko‘rinish farq qilsa, haqiqiy qo‘llangan uslublarni brauzer vositalarida tekshiring." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), veb-sayt loyihalash, HTML va CSS bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), veb uchun dasturlash mavzusi (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Kaskad va box model qoidalari umumiy CSS mavzusi, uslublar mustaqil namuna." },
  ],
  "M11.06": [
    { type: "heading", content: "Responsiv matn, blok va forma" },
    { type: "table", content: "| Muammo | CSS yondashuvi | Tekshiruv |\n|---|---|---|\n| Ekran torayganda blok sig‘maydi | Moslashuvchan width, flex/grid | Gorizontal ortiqcha scroll yo‘qmi? |\n| Matn juda kichik | Nisbiy o‘lcham va o‘qiladigan oraliq | Telefonda o‘qish qulaymi? |\n| Forma maydonlari siqiladi | Bir ustunli mobil tartib | Label ko‘rinadimi? |\n| Jadval keng | O‘ralgan yoki gorizontal scroll konteyneri | Barcha ustun mavjudmi? |" },
    { type: "code", content: "@media (max-width: 600px) {\n  .columns { display: block; }\n}" },
    { type: "example", content: "Mobil qurilmada ikki ustunli darsni tor ekranga sig‘dirish uchun faqat matnni kichraytirish emas, bloklarni vertikal joylashtirish ko‘pincha qulayroq." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), veb-sayt loyihalash, HTML va CSS bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), veb uchun dasturlash mavzusi (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Responsiv CSS misoli original; HTML/CSSning barcha texnik standartlari bu mavzu bilan yakunlandi, deb e’lon qilinmaydi." },
  ],
  "M11.07": [
    { type: "heading", content: "Sayt loyihasining tekshiruv bosqichlari" },
    { type: "list", content: "1. Auditoriya va sayt vazifasini aniqlang.\n2. Sahifa sxemasi va navigatsiya xaritasini tuzing.\n3. Mazmunni semantik HTMLga joylang.\n4. Vizual dizayn va mobil moslashuvni yarating.\n5. Havolalar, rasm alternativi, formalar va kontrastni sinang.\n6. Kerakli tuzatishni kiritib, turli qurilmada qayta tekshiring." },
    { type: "table", content: "| Sinov | Kutiladigan natija |\n|---|---|\n| Havola | Belgilangan to‘g‘ri manzil ochiladi |\n| Mobil ekran | Matn va tugmalar ekrandan chiqib ketmaydi |\n| Klaviatura | Muhim boshqaruv elementlariga yetib borish mumkin |\n| Forma | Maydon nomlari tushunarli, xato izohi bor |\n| Tasvir | Mazmunli alternativ tavsif mavjud |" },
    { type: "example", content: "Maktab tadbiri uchun sayt tayyorlanayotgan bo‘lsa, foydalanuvchi kimligi, ularga qaysi ma’lumot kerakligi va qanday qurilmadan kirishi dizayn qarorini belgilaydi." },
    { type: "source", content: "Manba: Cambridge+ 9-sinf «Informatika va axborot texnologiyalari» (2021), veb-sayt loyihalash, HTML va CSS bo‘limlari (https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view); Cambridge+ 10–11-sinf (2021), veb uchun dasturlash mavzusi (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view). Loyiha sinov mezonlari original tushuntirish, barcha URL va vizuallar expert tekshiruvini talab etadi." },
  ],
}

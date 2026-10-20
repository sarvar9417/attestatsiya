-- TASK-346: conservative expert review of selected Telegram theory candidates.
-- Candidates and short original lesson drafts stay PRIVATE, unapproved and unpublished.
CREATE TABLE IF NOT EXISTS attest_ingest.telegram_informatika_theory_editorial_cases (
 source_message_id bigint PRIMARY KEY REFERENCES attest_ingest.telegram_informatika_theory_candidates(source_message_id),
 review_disposition text NOT NULL CHECK(review_disposition IN
 ('possible_lesson_example','incomplete_source_fragment','not_a_lesson','news_requires_primary_source')),
 reason_uz text NOT NULL CHECK(length(reason_uz)>=30),
 reviewed_by text NOT NULL DEFAULT 'ai_content_expert',
 human_approved boolean NOT NULL DEFAULT false CHECK (human_approved=false),
 publish_ready boolean NOT NULL DEFAULT false CHECK (publish_ready=false),
 reviewed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE attest_ingest.telegram_informatika_theory_editorial_cases ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON attest_ingest.telegram_informatika_theory_editorial_cases FROM PUBLIC,anon,authenticated;

CREATE TABLE IF NOT EXISTS attest_ingest.telegram_informatika_theory_lesson_drafts (
 source_message_id bigint PRIMARY KEY REFERENCES attest_ingest.telegram_informatika_theory_editorial_cases(source_message_id),
 module_hint text NOT NULL CHECK (module_hint IN ('M03','M08','M11')),
 title_uz text NOT NULL CHECK(length(title_uz)>=12),
 original_explanation_uz text NOT NULL CHECK(length(original_explanation_uz)>=200),
 external_reference_url text,
 editorial_state text NOT NULL DEFAULT 'draft_private_review'
 CHECK (editorial_state='draft_private_review'),
 human_approved boolean NOT NULL DEFAULT false CHECK(human_approved=false),
 published boolean NOT NULL DEFAULT false CHECK(published=false),
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE attest_ingest.telegram_informatika_theory_lesson_drafts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON attest_ingest.telegram_informatika_theory_lesson_drafts FROM PUBLIC,anon,authenticated;

WITH observations(source_message_id,review_disposition,reason_uz) AS (
 VALUES
 (12801,'news_requires_primary_source','Milliy o‘quv dasturining yangilanishi haqidagi yangilik; rasmiy hujjat bilan alohida tekshirish kerak, nazariya matni emas.'),
 (13994,'incomplete_source_fragment','Ta’rif boshida muhim tushuncha tushib qolgan; mazkur parcha bilan virus turi yoki xavfsizlik mavzusini ishonchli dars sifatida yozib bo‘lmaydi.'),
 (43909,'possible_lesson_example','HTML va CSSni element, class, id selektorlari va rasmning joylashuvi bilan ko‘rsatgan izoh; qoidalar MDN bilan tekshirilgach original dars yozish mumkin.'),
 (43985,'possible_lesson_example','Python raqamlar yig‘indisi haqidagi rekursiv ta’rif va 1–18 oralig‘i hisob-kitobi mustaqil tekshirildi; original dastur matni to‘liq emas.'),
 (50413,'possible_lesson_example','Word Crop to Shape, Oval va Aspect Ratio haqidagi ko‘rsatma Microsoft hujjatlaridagi desktop imkoniyatlari bilan mos; original izoh yozish mumkin.'),
 (51645,'not_a_lesson','Test tizimi va natija haqidagi shaxsiy fikr almashinuvi; mavzu nazariyasi yoki didaktik dars kontenti emas.'),
 (58316,'not_a_lesson','Mahsulotning sun’iy intellekt imkoniyatlari haqida targ‘ibot xabari; faktlar tekshirilmagan va u nazariy dars vazifasini bajarmaydi.'),
 (59377,'not_a_lesson','O‘quv rejasiga oid rasmiy murojaat matni; informatikadan fan asoslarini tushuntiradigan nazariya emas.')
)
INSERT INTO attest_ingest.telegram_informatika_theory_editorial_cases
 (source_message_id,review_disposition,reason_uz)
SELECT o.source_message_id,o.review_disposition,o.reason_uz
FROM observations o JOIN attest_ingest.telegram_informatika_theory_candidates t
  USING(source_message_id)
ON CONFLICT(source_message_id) DO NOTHING;

WITH drafts(source_message_id,module_hint,title_uz,original_explanation_uz,external_reference_url) AS (
 VALUES
 (43909,'M11','HTML va CSS: matn, rasm va selektorlarning ta’siri',
 'HTML hujjatning tuzilishini, CSS esa element ko‘rinishini belgilaydi. h1 tegidagi sarlavhani text-align: center orqali gorizontal markazga joylashtirish, color orqali rangini o‘zgartirish mumkin. Oddiy rasm odatda matn ichiga joylashadigan inline element sifatida namoyon bo‘ladi; faqat margin: 0 auto yozilishi uni avtomatik markazga ko‘chirmaydi. Rasmning eni belgilanganda uni blok sifatida ko‘rsatib, chap va o‘ng hoshiyalarni auto qilish odatiy yechimdir. Nuqta bilan yozilgan .class selektori bir nechta elementga, #id selektori esa o‘ziga xos identifikatorga murojaat qiladi. Bir elementda ham class, ham id ishlashi mumkin; bitta CSS xususiyati uchun zid qoidalar bo‘lsa ustuvorlik tekshiriladi. Mashq: rasmning display, width va margin qiymatlarini bittadan o‘zgartirib, brauzerdagi natijani solishtiring. Manbadagi test varianti dars kaliti sifatida ko‘chirilmagan.',
 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_alignment/In_block_abspos_tables'),
 (43985,'M08','Python rekursiyasi: son raqamlari yig‘indisini hisoblash',
 'Rekursiv funksiya masalani kichikroq shu turdagi masalaga keltirib, o‘zini qayta chaqiradi. Har qanday rekursiyada to‘xtash sharti bo‘lishi kerak. N(n) natural son raqamlarining yig‘indisini qaytarsin: n 10 dan kichik bo‘lsa natija n, aks holda oxirgi raqam n % 10 hamda qolgan raqamlar uchun N(n // 10) yig‘indisini olamiz. Masalan, N(123) = N(12) + 3 = N(1) + 2 + 3 = 6. Bir nechta son uchun M(k) degan umumiy yig‘indi kerak bo‘lsa, 1 dan k gacha har bir N(i) natijasi qo‘shiladi. k = 18 da 1–9 sonlar yig‘indisi 45; 10–18 raqamlar yig‘indisi yana 45; jami M(18)=90. Bu qoida musbat butun sonlar uchun; manfiy yoki kasrli kirishlar alohida tekshirilishi shart.',
 NULL),
 (50413,'M03','Microsoft Word: rasmni oval yoki doira shaklida qirqish',
 'Microsoft Word dasturining desktop versiyasida to‘rtburchak rasmning ko‘rinadigan chegarasini oval yoki doiraga o‘zgartirish mumkin. Hujjatga rasm qo‘shilgach uni tanlang; Picture Format panelidagi Crop yonidagi menyudan Crop to Shape ni oching va Oval ni tanlang. Agar aylana kerak bo‘lsa rasm ko‘rinishida 1:1 nisbatni qo‘llashga e’tibor bering. Crop Fill butun shaklni to‘ldirishga intiladi, lekin chet qismi kesilishi mumkin; Fit esa butun rasmni saqlaydi, lekin shakl ichida bo‘sh joy qoldirishi mumkin. Rasmning muhim qismini markazda ko‘rsatish uchun qirqish sohasi va joylashuvini surib moslang. Word veb-versiyasida bu imkoniyatlar desktopga qaraganda cheklangan; ish oldidan aynan ishlatilayotgan versiyani aniqlash zarur. Mashq: bitta suratga Oval, Fill va Fit usullarini ketma-ket qo‘llab natijani taqqoslang.',
 'https://support.microsoft.com/en-us/office/graphics-visuals/crop-a-picture-to-fit-in-a-shape')
)
INSERT INTO attest_ingest.telegram_informatika_theory_lesson_drafts
 (source_message_id,module_hint,title_uz,original_explanation_uz,external_reference_url)
SELECT d.source_message_id,d.module_hint,d.title_uz,d.original_explanation_uz,d.external_reference_url
FROM drafts d JOIN attest_ingest.telegram_informatika_theory_editorial_cases e
 ON e.source_message_id=d.source_message_id
 AND e.review_disposition='possible_lesson_example'
ON CONFLICT(source_message_id) DO NOTHING;

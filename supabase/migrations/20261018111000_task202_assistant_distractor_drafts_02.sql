-- TASK-202: source-specific assistant-proposed alternatives; NOT an approval.
begin;
insert into public.pedagogy_rewrite_proposals(source_question_id,proposed_distractors)
select source_question_id::uuid, proposed_distractors from (values
('2bc30a51-4e8e-472c-b568-a77ccccc6cd4',array[
'Binodagi jihozlar va yong‘in xavfsizligini',
'O‘quvchilarning elektron parollari va hisoblarini',
'Sport mashg‘ulotlari tartibi va ehtiyot choralarini']),
('4207d715-0922-4015-aaa8-b481c1f402e6',array[
'Metod qo‘llangani haqida hamkasblarga rasmiy hisobot berish',
'Seminardagi ko‘rsatmalarni barcha sinflarda o‘zgartirmasdan takrorlash',
'O‘rganilgan metodni keyingi malaka oshirishgacha qo‘llamaslik']),
('4208f80b-9301-4e93-8a9e-a866415bd13f',array[
'Chunki umumiy jazo uchun barcha o‘quvchilarning oldindan yozma roziligi olinishi majburiy',
'Chunki tarbiyaviy tadbirlarda intizom buzilishiga nisbatan har qanday chora qo‘llash mutlaqo taqiqlanadi',
'Chunki bunday vaziyatda faqat tadbir tashkilotchisi jazo qo‘llash vakolatiga ega hisoblanadi']),
('43d98352-77bf-426c-b8e0-5329246f8a9e',array[
'Topshiriqlarga sarflanadigan vaqtni barcha guruhlarda bir xil uzaytirish',
'Vazifalarni faqat o‘zlashtirishi yuqori o‘quvchilar uchun murakkablashtirish',
'Bir xil vazifaga qo‘shimcha nazorat savollarini kiritish']),
('4cfb892c-0215-4de9-a4d9-ecdc28bbd422',array[
'Tomonlarni avval umumiy intizom rejasi bilan tanishtirish',
'Tafsilotlarni bilmasdan sinf jamoasi oldida umumiy ogohlantirish berish',
'Nizoni ishtirokchilarning ota-onalariga topshirib darsni davom ettirish']),
('5e3047d5-03ce-464d-9df6-13dbbe4f8b93',array[
'Qo‘llanilgan metodlar sonining ko‘pligi va jihozlarning zamonaviyligi',
'Har bir darsda o‘quvchilarning doim band bo‘lib turishi',
'O‘qituvchining mavzu yuzasidan batafsil nutq tayyorlashi']),
('646ab703-158b-4f86-8937-25d33465bca3',array[
'Onlayn zo‘ravonlik xabarini sinf chatiga chiqarib, jamoatchilik fikrini olish yetarli',
'Raqamli hodisalarni o‘qituvchi faqat telefonni cheklash orqali ota-onaning aralashuvisiz hal qiladi',
'Maktabdan tashqaridagi hodisani faqat internet platformasi ma’muriyati ko‘rib chiqishi kerak']),
('6d9b002c-d226-4a2f-a99c-36f5c8f04560',array[
'Kuzatuv yakunida eng faol o‘quvchilar ro‘yxatini tuzib, boshqalarga namuna qilish',
'Savollar sonini ko‘paytirib, javob beradigan o‘quvchilar tarkibini o‘zgartirmaslik',
'Hamkasb darsini boshqa sinfda aynan takrorlab, natijani shaxsiy taassurotga asoslash']),
('6f2336d3-9584-45ee-ac1f-150ff5d5b048',array[
'Berilgan bahoni boshqa o‘quvchilarning ko‘rsatkichlari bilan qiyoslash',
'Umumiy rag‘bat so‘zlari bilan topshiriqqa oid izohni almashtirish',
'Xatolar ro‘yxatini berib, ularni tuzatish tartibini tushuntirmaslik']),
('70c6f5bc-3969-4a06-8469-e7c6279bb6a1',array[
'Har bir fan o‘qituvchisi alohida reja tuzib, boshqalarga bildirmasligi',
'Muammoni tez yopish uchun faqat yakuniy baholarni yagona mezon qilish',
'Turli fanlardagi qiyinchilikni vaqtinchalik deb hisoblab, mutaxassis fikrini e’tiborsiz qoldirish'])
) as proposed(source_question_id, proposed_distractors)
where exists(select 1 from public.questions q where q.id=proposed.source_question_id::uuid
  and q.status='published'::public.content_status and q.format='Y1'::public.question_format)
on conflict(source_question_id) do nothing;
commit;
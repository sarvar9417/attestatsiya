# M14 Kasb standarti — kontent tafovuti va xavfsiz yakunlash (2026-10-18)

**Holat:** 7 ta M14 mavzusidan har biri 20 ta published+keyed savol bilan ishlashi kerak. So‘nggi production read-only snapshot: **17, 17, 18, 14, 16, 16, 16** (jami 114/140; **26 ta yetishmaydi**). M15/M16 son jihatdan yetarli, ammo bu sifat tekshiruvi o‘rnini bosmaydi.

## Manbalar
Foydalanuvchining “Pedagogning kasbiy standarti - qollanma.pdf” fayli, betlar:
- KS.01 rejalash — 2–3-bet;
- KS.02 ta’lim samaradorligi — 4–5-bet;
- KS.03 baholash va qayta aloqa — 6–7-bet;
- KS.04 tarbiyaviy faoliyat — 8–9-bet;
- KS.05 xavfsiz rivojlantiruvchi muhit — 10–11-bet;
- KS.06 kasbiy o‘sish — 12-bet;
- KS.07 hamkorlik — 13-bet.

## Muharrirlik banki — maxfiy
42 ta manbaga bog‘langan, 7×6 yangi Y1 mashq savoli (4 variant, izoh, kalit) tayyorlangan va **Google Drive’da faqat egasiga ochiq** alohida hujjat sifatida saqlangan. Jamoatga ochiq Attestatsiya papkasiga qo‘yilmagan.

**MUHIM XAVFSIZLIK BLOCKERI:** `sarvar9417/attestatsiya` public repozitoriy. Dastlab ushbu savollar bilan kalitlar draft PR #137 ning avvalgi commitlarida ochiq saqlangan. Fayllarni branch boshidan olib tashlash GitHubning oldingi obyektlarini darhol mutlaq o‘chirishni KAFOLATLAMAYDI. Ushbu ochilib qolgan 42 savolni rasmiy baholanadigan testga ko‘r-ko‘rona nashr qilish taqiqlanadi. Ular nazoratli ochiq mashq materiallari sifatida qayta tasniflanishi mumkin; yopiq baholanadigan bank uchun mutlaqo yangi, hech qachon public repoda paydo bo‘lmagan savol-javoblar tayyorlanishi kerak.

## Qabul mezonlari (yakunlash)
1. Kamida 26 ta **yangi, public repo tarixida bo‘lmagan**, manba va betga bog‘langan savol mustaqil tekshiriladi, kaliti xatosiz deb tasdiqlanadi. M14.01–07 bo‘yicha minimum: +3, +3, +2, +6, +4, +4, +4.
2. Import `review` holatida, faqat yopiq/admin kanal orqali bajariladi. `authored_by`, `reviewed_by`, `final_approved_by` yozuvlari haqiqiy foydalanuvchini aks ettiradi. Keyin haqiqiy editorial fingerprint/challenge bilan `review→published`.
3. Qamrovda faqat son emas, barcha majburiy bilimlar tekshiriladi; Y1 variantlarida uzunlik/«faqat» ishorasi va semantik takrorlar aniqlanadi.
4. Har bir M14 dars uchun server `generate_topic_test` 20 ta savol yaratadi, 7/7 start → submit → finish → review, mobil/desktop, history saqlanadi.
5. 15 talik va 50 talik sinovning mavjud format/kvotalari o‘zgarmaydi; tarixiy published revisionlar tahrirlanmaydi.
6. GitHub merge yoki frontend deploy **productionga SQL yozish ruxsati hisoblanmaydi**. Baza migratsiyasi alohida tasdiq va tekshiruv bilan bajariladi.

## Xavfsiz diagnostika

```sql
select l.order_idx, l.topic_test_question_count AS target,
  count(distinct q.id) filter (where q.status='published'
    and k.question_id is not null and q.group_code=c.group_code and c.is_active) AS available
from public.lessons l
join public.modules m on m.id=l.module_id
join public.lesson_constructs lc on lc.lesson_id=l.id
join public.constructs c on c.id=lc.construct_id
left join public.questions q on q.construct_id=c.id
left join public.question_keys k on k.question_id=q.id
where m.code='M14' and l.order_idx between 1 and 7
  and l.status='published'
group by l.order_idx,l.topic_test_question_count
order by l.order_idx;
```

This documentation contains **no student-facing exam stems, options or answer keys**.

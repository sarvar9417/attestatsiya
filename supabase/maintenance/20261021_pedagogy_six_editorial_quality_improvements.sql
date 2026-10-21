-- Pedagogika bazasi: source labels, ambiguous stems, choice-balance and Y2 explanations.
-- Safe to re-run: updates only if target question is still in editorial status.
-- Published or archived historical question rows MUST remain untouched.
BEGIN;
UPDATE public.questions SET
stem_md='Musiqa o‘qituvchisi xatoni topish topshirig‘ini oldindan rejaladi: doskaga do–mi–sol notalarini yozib, pianinoda sol–mi–do ketma-ketligini chaldi. O‘quvchilar farqni topib tuzatishdi. Ushbu faoliyat qaysi metodga mos?',
updated_at=now()
WHERE id='7782afd8-62e4-4acc-bbf5-2e9e2946f649' AND status='review'::public.content_status;
UPDATE public.question_options SET content_md='Xavfsiz va inklyuziv ta’lim muhitini yaratish'
WHERE question_id='679b577c-45e9-4c09-be34-848716432319' AND order_idx=3
AND EXISTS (SELECT 1 FROM public.questions WHERE id=question_id AND status='review'::public.content_status);
UPDATE public.question_options SET content_md='Demokratik — o‘quvchilar fikrini inobatga olish'
WHERE question_id='f12016dc-14df-4c3e-9b51-59850e5ecf99' AND order_idx=1
AND EXISTS (SELECT 1 FROM public.questions WHERE id=question_id AND status='review'::public.content_status);
UPDATE public.question_options SET content_md='Fanlararo integratsiya'
WHERE question_id='3950058d-23bb-4d5b-8ce8-5e97fc3d3d36' AND order_idx=4
AND EXISTS (SELECT 1 FROM public.questions WHERE id=question_id AND status='review'::public.content_status);
UPDATE public.question_keys SET
explanation_md='Loyihaga asoslangan ta’limda o‘quvchi izlanib mahsulot yaratadi; muammoli ta’limda muammoni yechadi; hamkorlikdagi ta’limda faoliyat va mas’uliyat birgalikda taqsimlanadi; differensial ta’limda topshiriq hamda yordam ehtiyojga moslashtiriladi.', updated_at=now()
WHERE question_id='2e8798a8-259d-406b-8239-37e07e2521db'
AND EXISTS(SELECT 1 FROM public.questions WHERE id=question_id AND status='review'::public.content_status);
UPDATE public.question_keys SET
explanation_md='Diagnostika o‘quvchining boshlang‘ich holati va qiyinchilik sabablarini aniqlaydi. Monitoring vaqt davomida rivojlanishni kuzatadi. Qayta aloqa keyingi yaxshilash qadamini ko‘rsatadi. Yakuniy baholash davr oxiridagi natijani umumlashtiradi.', updated_at=now()
WHERE question_id='8c95856e-4af4-48a1-99ea-bcfe42cd7132'
AND EXISTS(SELECT 1 FROM public.questions WHERE id=question_id AND status='review'::public.content_status);
COMMIT;

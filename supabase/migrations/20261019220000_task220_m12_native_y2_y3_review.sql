-- TASK-220: convert 10 Y2 and 10 Y3 paper-choice samples to genuine native
-- matching/ordering format. Only review-stage M12 V2 items are changed.
-- Original V2 JSON and source references remain immutable.
BEGIN;
DO $native$
DECLARE x jsonb; qid uuid; aid uuid; bid uuid; pairs jsonb; ord jsonb; i int; n int:=0; k int;
BEGIN
 FOR x IN SELECT value FROM jsonb_array_elements($items$[{"id":"TAR-01-029","fmt":"Y2","stem":"Quyidagi tushunchalarni ularga mos ta’rif va xususiyatlar bilan juftlang.","a":["PAN","LAN","WAN"],"b":["katta geografik hudud","yaqin shaxsiy qurilmalar","mahalliy xona/bino"],"pairs":[1,2,0],"exp":"PAN yaqin, LAN mahalliy, WAN katta geografik hudud.","src":"M11, 129--139-betlar; C8, PDF 91--96"},{"id":"TAR-01-030","fmt":"Y3","stem":"Lokal resursdan foydalanishning mantiqiy ketma-ketligini toping: berilgan bosqichlarni to‘g‘ri tartiblang.","items":["xizmatga so'rov","tarmoqqa ulanish","resurs javobini olish"],"order":[1,0,2],"exp":"Avval ulanish, so'ng xizmatga so'rov, keyin javob olinadi.","src":"M11, 129--139-betlar; C8, PDF 91--96"},{"id":"TAR-02-029","fmt":"Y2","stem":"Quyidagi tushunchalarni ularga mos ta’rif va xususiyatlar bilan juftlang.","a":["switch","router","AP"],"b":["Wi-Fi kirishi","MAC freymlarni uzatish","IP tarmoqlar orasida yo'naltirish"],"pairs":[1,2,0],"exp":"Switch LAN freymini, router IP paketni, AP simsiz kirishni boshqaradi.","src":"M11, 146--166-betlar; C8, PDF 98--106"},{"id":"TAR-02-030","fmt":"Y3","stem":"Kompyuterdan boshqa subnetga paket yetkazish: berilgan bosqichlarni to‘g‘ri tartiblang.","items":["routerga yuborish","subnetni aniqlash","yo'naltirish natijasida qabul qilish"],"order":[1,0,2],"exp":"Avval lokal yoki boshqa subnet ekanligi tekshiriladi, keyin routerga uzatiladi.","src":"M11, 146--166-betlar; C8, PDF 98--106"},{"id":"TAR-03-029","fmt":"Y2","stem":"Quyidagi tushunchalarni ularga mos ta’rif va xususiyatlar bilan juftlang.","a":["yulduz","halqa","shina"],"b":["umumiy magistral","markaziy qurilma","yopiq zanjir"],"pairs":[1,2,0],"exp":"Yulduz markaziy qurilmaga, halqa yopiq zanjirga, shina magistralga asoslanadi.","src":"M11, 140--145; 167--171-betlar; C8, PDF 108--113"},{"id":"TAR-03-030","fmt":"Y3","stem":"Topologiyani rejalash ketma-ketligi: berilgan bosqichlarni to‘g‘ri tartiblang.","items":["ulanish sxemasini tanlash","talab/qurilmalarni aniqlash","nosozlik xatarini tekshirish"],"order":[1,0,2],"exp":"Talabni aniqlagandan keyingina sxema tanlanadi va xatar tekshiriladi.","src":"M11, 140--145; 167--171-betlar; C8, PDF 108--113"},{"id":"TAR-04-029","fmt":"Y2","stem":"Quyidagi tushunchalarni ularga mos ta’rif va xususiyatlar bilan juftlang.","a":["TCP","IP","DNS"],"b":["nomni aniqlash","ishonchli transport","tarmoqlararo manzillash"],"pairs":[1,2,0],"exp":"TCP transport, IP internet qatlam, DNS ilova xizmatidir.","src":"M11, 172--179-betlar; C11, tarmoq mavzusi"},{"id":"TAR-04-030","fmt":"Y3","stem":"Domen orqali veb-resurs olish: berilgan bosqichlarni to‘g‘ri tartiblang.","items":["HTTP(S) so'rovi","DNS nomni aniqlash","server javobi"],"order":[1,0,2],"exp":"DNS zarur bo'lsa nomni aniqlaydi, HTTP so'rovi ketadi, javob keladi.","src":"M11, 172--179-betlar; C11, tarmoq mavzusi"},{"id":"TAR-05-001","fmt":"Y2","stem":"Quyidagi tushunchalarni ularga mos ta’rif va xususiyatlar bilan juftlang.","a":["/24","/26","/27"],"b":["255.255.255.224","255.255.255.0","255.255.255.192"],"pairs":[1,2,0],"exp":"/24 -> .0, /26 -> .192, /27 -> .224.","src":"M11, 172--179-betlar; texnik aniqlashtirish: RFC 4632"},{"id":"TAR-05-002","fmt":"Y3","stem":"IPv4 maskaga qarab subnet topish: berilgan bosqichlarni to‘g‘ri tartiblang.","items":["networkni hisoblash","prefiksni niqobga aylantirish","host bitlarini ajratish"],"order":[1,2,0],"exp":"Prefiksdan maska, maskadan tarmoq/host bitlari aniqlanadi va AND bilan network chiqadi.","src":"M11, 172--179-betlar; texnik aniqlashtirish: RFC 4632"},{"id":"TAR-06-001","fmt":"Y2","stem":"Quyidagi tushunchalarni ularga mos ta’rif va xususiyatlar bilan juftlang.","a":["network","broadcast","usable"],"b":["oddiy host oralig'i","host bitlari 0","host bitlari 1"],"pairs":[1,2,0],"exp":"Network host bitlari nol, broadcast bir; odatiy usable orasidagi hostlardir.","src":"M11, 172--179-betlar; matematik/metodik chuqurlashtirish"},{"id":"TAR-06-002","fmt":"Y3","stem":"/26 subnetni tekshirish: berilgan bosqichlarni to‘g‘ri tartiblang.","items":["broadcastni topish","maska/qadamni aniqlash","networkni aniqlash"],"order":[1,2,0],"exp":"Maska va blokdan network, networkdan broadcast olinadi.","src":"M11, 172--179-betlar; matematik/metodik chuqurlashtirish"},{"id":"TAR-07-001","fmt":"Y2","stem":"Quyidagi tushunchalarni ularga mos ta’rif va xususiyatlar bilan juftlang.","a":["14 usable host","30 usable host","62 usable host"],"b":["/26","/28","/27"],"pairs":[1,2,0],"exp":"/28 14, /27 30, /26 62 usable host.","src":"M11, 180--185-betlar; texnik aniqlashtirish: RFC 4291"},{"id":"TAR-07-002","fmt":"Y3","stem":"VLSMni loyihalash: berilgan bosqichlarni to‘g‘ri tartiblang.","items":["subnetlarni blok chegarasiga qo'yish","host talablarini yozish","eng katta talabdan boshlash"],"order":[1,2,0],"exp":"Avval talab, so'ng katta subnet va mos chegara tanlanadi.","src":"M11, 180--185-betlar; texnik aniqlashtirish: RFC 4291"},{"id":"TAR-08-029","fmt":"Y2","stem":"Quyidagi tushunchalarni ularga mos ta’rif va xususiyatlar bilan juftlang.","a":["DNS","DHCP","NAT"],"b":["IP moslashtirish","nom yozuvlarini aniqlash","avtomatik tarmoq sozlamasi"],"pairs":[1,2,0],"exp":"DNS nomni, DHCP konfiguratsiyani, NAT manzillarni moslashtiradi.","src":"M11, 186--195-betlar; M6, 77--85-betlar"},{"id":"TAR-08-030","fmt":"Y3","stem":"Vebga kirish: berilgan bosqichlarni to‘g‘ri tartiblang.","items":["serverdan HTTP javob","URL kiritish","kerak bo'lsa DNS aniqlash","HTTP so'rov"],"order":[1,2,3,0],"exp":"URLdan so'ng zarur DNS bosqichi, keyin so'rov va javob keladi.","src":"M11, 186--195-betlar; M6, 77--85-betlar"},{"id":"TAR-09-029","fmt":"Y2","stem":"Quyidagi tushunchalarni ularga mos ta’rif va xususiyatlar bilan juftlang.","a":["site:","filetype:","qo'shtirnoq"],"b":["aniq ibora","domen doirasi","hujjat turi"],"pairs":[1,2,0],"exp":"site domen, filetype format, qo'shtirnoq aniq ibora.","src":"M6, 81--93-betlar; C5, axborotni qidirish"},{"id":"TAR-09-030","fmt":"Y3","stem":"Ishonchli ma'lumot izlash: berilgan bosqichlarni to‘g‘ri tartiblang.","items":["manbani tekshirish","savolni aniqlash","kalit so'z bilan qidirish"],"order":[1,2,0],"exp":"Maqsadni aniqlash, qidirish va mustaqil tekshirish to'g'ri tartib.","src":"M6, 81--93-betlar; C5, axborotni qidirish"},{"id":"TAR-10-029","fmt":"Y2","stem":"Quyidagi tushunchalarni ularga mos ta’rif va xususiyatlar bilan juftlang.","a":["phishing","ransomware","MFA"],"b":["ko'p faktorli tasdiq","maxfiy axborotni aldab olish","to'lov talab qiluvchi zararli dastur"],"pairs":[1,2,0],"exp":"Phishing aldov, ransomware tovlamachilik, MFA himoya chorasi.","src":"M11, 256--310-betlar; C11, xavfsizlik"},{"id":"TAR-10-030","fmt":"Y3","stem":"Phishingdan himoyalanish: berilgan bosqichlarni to‘g‘ri tartiblang.","items":["rasmiy kanalda mustaqil tekshirish","shubhali xatni aniqlash","havolani bosmaslik"],"order":[1,2,0],"exp":"Avval shubhali xat belgisi aniqlanadi; havola ochilmaydi; rasmiy kanal orqali tekshiriladi.","src":"M11, 256--310-betlar; C11, xavfsizlik"}]$items$::jsonb) LOOP
  SELECT id INTO STRICT qid FROM public.questions
   WHERE source_reference='network-v2-20261018:'||(x->>'id')||':original-'||(x->>'fmt')
     AND group_code='S6.NET' AND status='review'::public.content_status;
  UPDATE public.questions SET
    format=(x->>'fmt')::public.question_format, stem_md=x->>'stem'
   WHERE id=qid AND status='review'::public.content_status;
  DELETE FROM public.question_options WHERE question_id=qid;
  IF x->>'fmt'='Y2' THEN
    pairs:='{}'::jsonb;
    FOR i IN 0..2 LOOP
      aid:=md5('task220-native-y2-'||(x->>'id')||'-a-'||i)::uuid;
      bid:=md5('task220-native-y2-'||(x->>'id')||'-b-'||i)::uuid;
      INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
      VALUES(aid,qid,'a',i+1,x->'a'->>i),(bid,qid,'b',i+4,x->'b'->>i);
      k:=(x->'pairs'->>i)::int;
      pairs:=pairs||jsonb_build_object(aid::text,md5('task220-native-y2-'||(x->>'id')||'-b-'||k)::uuid::text);
    END LOOP;
    UPDATE public.question_keys SET payload=jsonb_build_object('pairs',pairs)
     WHERE question_id=qid;
  ELSIF x->>'fmt'='Y3' THEN
    ord:='[]'::jsonb;
    FOR i IN 0..jsonb_array_length(x->'items')-1 LOOP
      aid:=md5('task220-native-y3-'||(x->>'id')||'-a-'||i)::uuid;
      INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
      VALUES(aid,qid,'a',i+1,x->'items'->>i);
    END LOOP;
    FOR i IN 0..jsonb_array_length(x->'order')-1 LOOP
      k:=(x->'order'->>i)::int;
      ord:=ord||jsonb_build_array(md5('task220-native-y3-'||(x->>'id')||'-a-'||k)::uuid::text);
    END LOOP;
    UPDATE public.question_keys SET payload=jsonb_build_object('order',ord)
     WHERE question_id=qid;
  ELSE
    RAISE EXCEPTION 'TASK220 unsupported native format %',x->>'fmt';
  END IF;
  n:=n+1;
 END LOOP;
 IF n<>20 THEN RAISE EXCEPTION 'TASK220 native conversion expected 20, got %',n; END IF;
END $native$;
COMMIT;

-- TASK-230: replace 10 duplicate generic review Y2 stems with specific,
-- source-grounded text. All option/key payloads remain unchanged.
-- Fail closed if another actor published/edited the record; never mutate a published question.
BEGIN;
DO $retitle$
DECLARE x jsonb; vqid uuid; n integer:=0; affected integer;
BEGIN
 FOR x IN SELECT value FROM jsonb_array_elements($patch$[{"id":"TAR-01-029","new_stem":"PAN, LAN va WAN tarmoq ko‘lamini unga mos hudud tavsifi bilan juftlang."},{"id":"TAR-02-029","new_stem":"Switch, router va AP qurilmalarini ular bajaradigan tarmoq vazifalari bilan moslang."},{"id":"TAR-03-029","new_stem":"Yulduz, halqa va shina topologiyalarini ularning fizik tuzilish belgilariga moslang."},{"id":"TAR-04-029","new_stem":"TCP, IP va DNS protokollarining tarmoqdagi vazifalarini to‘g‘ri juftlang."},{"id":"TAR-05-001","new_stem":"/24, /26, /27 prefikslarini to‘g‘ri nuqtali-o‘nlik IPv4 maskalari bilan juftlang."},{"id":"TAR-06-001","new_stem":"Network, broadcast va usable atamalarini subnetning host-bitlari xossasi bilan moslang."},{"id":"TAR-07-001","new_stem":"14, 30 va 62 ta usable host sig‘diradigan odatiy IPv4 subnetlarni mos CIDR prefikslari bilan juftlang."},{"id":"TAR-08-029","new_stem":"DNS, DHCP va NAT xizmatlarini ularning asosiy vazifalari bilan juftlang."},{"id":"TAR-09-029","new_stem":"Qidiruv operatorlaridan `site:`, `filetype:` va qo‘shtirnoqning qidiruvdagi vazifalarini moslang."},{"id":"TAR-10-029","new_stem":"Phishing, ransomware va MFA tushunchalarini xatar yoki himoya funksiyasi bilan juftlang."}]$patch$::jsonb) LOOP
   SELECT q.id INTO STRICT vqid
   FROM public.questions q JOIN public.lessons l ON l.id=q.source_lesson_id
     JOIN public.modules m ON m.id=l.module_id
   WHERE m.code='M12' AND q.group_code='S6.NET'
     AND q.source_reference='network-v2-20261018:'||(x->>'id')||':original-Y2'
     AND q.format='Y2'::public.question_format
     AND q.status='review'::public.content_status
     AND q.stem_md='Quyidagi tushunchalarni ularga mos ta’rif va xususiyatlar bilan juftlang.';
   UPDATE public.questions SET stem_md=x->>'new_stem'
   WHERE id=vqid AND status='review'::public.content_status
     AND stem_md='Quyidagi tushunchalarni ularga mos ta’rif va xususiyatlar bilan juftlang.';
   GET DIAGNOSTICS affected=ROW_COUNT;
   IF affected<>1 THEN RAISE EXCEPTION 'TASK230 review-only Y2 retitle race at %',x->>'id'; END IF;
   n:=n+1;
 END LOOP;
 IF n<>10 THEN RAISE EXCEPTION 'TASK230 expected 10 Y2 retitles, got %',n; END IF;
END $retitle$;
COMMIT;

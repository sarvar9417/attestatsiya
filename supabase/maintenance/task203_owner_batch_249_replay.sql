-- TASK-203 / authoritative production snapshot, captured 2026-10-18.
-- MANUAL REPLAY ONLY; do not add to automatic migration chain.
-- Replay after task203_redrafted_options_01..04.sql on a database with
-- original pedagogika review items and the same owner profile.
-- This is OWNER BATCH APPROVAL: not independently signed source validation.
-- Idempotent for previously published items. Do NOT tamper with published
-- question texts, answer keys, option IDs or existing learner attempts.
BEGIN;
DO $owner_approval_replay$
DECLARE
  rec record;
  v_role text;
  v_status public.content_status;
  v_source text;
  v_valid boolean;
  v_options integer;
  v_a integer;
  v_b integer;
  v_uniq integer;
  v_min integer;
  v_max integer;
  v_cw integer;
  v_wrong integer;
  v_hits integer;
  v_payload jsonb;
  v_reviewed integer:=0;
  v_existing integer:=0;
  v_absent integer:=0;
  v_note text;
BEGIN
  SELECT role INTO v_role FROM public.profiles
  WHERE id='01f636a4-304c-4627-9d6c-3cde0f59ffbb'::uuid
    AND role='admin' AND coalesce(is_blocked,false)=false;
  IF v_role IS NULL THEN
    RAISE NOTICE 'TASK-203 owner profile not available in this installation: release deferred';
    RETURN;
  END IF;
  FOR rec IN SELECT * FROM (VALUES
('00bfaab5-17bd-4b77-9475-fd5af7b87498'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.GEN.08:002','Y1',false),
('00f6ced7-2306-532f-cc9e-d51009ea96bd'::uuid,'authored:m15-topictest-20261018:2:8','Y1',false),
('0136f81f-90a6-1ec4-1af3-486989c7e0da'::uuid,'authored:m15-topictest-20261018:7:5','Y1',false),
('030ef878-2203-0f1b-6957-b009a8866201'::uuid,'authored:m15-topictest-20261018:1:6','Y1',false),
('03861845-ee33-42ec-b182-fed9fa328d11'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.MET.03:002','Y1',false),
('042dde52-4ca2-7a5a-3c3a-a26e2fc268d9'::uuid,'authored:m15-topictest-20261018:5:13','Y1',false),
('05050add-58c3-4057-adf7-74bd61da7b5e'::uuid,'authored:pedagogy-pdf-corpus:v3:2026:spring:p3:q13','Y1',false),
('057109ed-4599-4543-816b-abcc63b931e1'::uuid,'authored:pedagogy-pdf-corpus:v1:KS.04:001','Y1',false),
('05f84224-90b4-a7eb-b7fc-72252762f602'::uuid,'authored:m15-topictest-20261018:5:8','Y1',false),
('08814f9f-df27-4a1f-b487-1fae867f8b15'::uuid,'authored:pedagogy-pdf-corpus:v3:2025:autumn:p9:q29','Y1',false),
('090b665c-70ee-46a0-91b2-94bc307593e2'::uuid,'authored:pedagogy-pdf-corpus:v3:2025:spring:p4:q14','Y1',false),
('0948c741-70fb-e247-1424-7a6780f4b67b'::uuid,'authored:m15-topictest-20261018:4:4','Y1',false),
('09d15c9c-5634-71bf-4f88-726fd14def21'::uuid,'authored:m15-topictest-20261018:1:7','Y1',false),
('0a722ed4-bba5-4e4c-a75b-e4c3407cc8be'::uuid,'authored:pedagogy-pdf-corpus:v3:2025:autumn:p7:q21','Y1',false),
('0ad1449a-463a-4105-a66e-088fb21d74c3'::uuid,'authored:pedagogy-pdf-corpus:v3:2025:spring:p2:q3','Y1',false),
('0adc7da7-21cd-4f58-9e9c-68ebd9806ba1'::uuid,'authored:pedagogy-pdf-corpus:v3:2026:spring:p2:q6','Y1',false),
('0d83913b-4924-7915-eff2-d4a6c76153c6'::uuid,'authored:m15-topictest-20261018:1:5','Y1',false),
('0f9e5aa5-7446-e4a5-8a63-1884295a5bba'::uuid,'authored:m15-topictest-20261018:4:3','Y1',false),
('128f3379-e6ae-4820-a3da-60f6927fda23'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.MET.01:002','Y1',false),
('12ff04b6-bf8f-3c87-96d5-267a31168c76'::uuid,'authored:m15-topictest-20261018:5:5','Y1',false),
('1b05f061-1e07-843f-cf9c-7046a1af2aaf'::uuid,'authored:m15-topictest-20261018:6:1','Y1',false),
('1cdce310-0d74-c95c-4572-812f9c3cef50'::uuid,'authored:m15-topictest-20261018:7:11','Y1',false),
('1dab8d08-2270-95c9-ea60-56d6a23f0150'::uuid,'authored:m15-topictest-20261018:8:4','Y1',false),
('24cc5f86-202e-07bb-af53-2b0b1f3bd05f'::uuid,'authored:m15-topictest-20261018:4:7','Y1',false),
('25daff9a-a4a0-0651-f96f-f1b6b534ab49'::uuid,'authored:m15-topictest-20261018:7:12','Y1',false),
('274755b5-cc01-ac37-0bc3-0012d1d415cd'::uuid,'authored:m15-topictest-20261018:4:9','Y1',false),
('286c99ea-3cee-48c7-9943-153a8e890752'::uuid,'authored:pedagogy-pdf-corpus:v3:2024:spring:p6:q29','Y1',false),
('2b40638e-cb94-e81f-4958-b62839c24117'::uuid,'authored:m15-topictest-20261018:3:6','Y1',false),
('2e2f6e1a-4ba2-cdbb-9120-c9327f2fd3b7'::uuid,'authored:m15-topictest-20261018:6:2','Y1',false),
('32b9c141-997e-4866-acd7-d924a058c0f8'::uuid,'authored:pedagogy-pdf-corpus:v3:2024:spring:p6:q27','Y1',false),
('33917ae2-4b00-3cde-a472-ef9933221b8d'::uuid,'authored:m15-topictest-20261018:6:5','Y1',false),
('34697a3c-be23-427b-b2b4-f2666b977000'::uuid,'authored:pedagogy-pdf-corpus:v1:KS.03:001','Y1',false),
('36007dc4-263c-45c8-9bd5-93b70a9ab5b2'::uuid,'authored:m15-topictest-20261018:6:3','Y1',false),
('36da375f-27f9-55dc-5048-83103ec04b41'::uuid,'authored:m15-topictest-20261018:1:3','Y1',false),
('38cbfc9d-00de-fa66-66a3-d4efc5b58731'::uuid,'authored:m15-topictest-20261018:7:13','Y1',false),
('3941af5a-95cd-421b-a6d8-d58fe7fd5877'::uuid,'authored:pedagogy-pdf-corpus:v2:PM.GEN.03:Y3:001','Y3',false),
('3b943bf8-2ce7-5a35-fc2c-9791b4c1c2b1'::uuid,'authored:m15-topictest-20261018:5:10','Y1',false),
('3e69eacc-4c1a-3b9c-1630-45252f7d52e3'::uuid,'authored:m15-topictest-20261018:8:1','Y1',false),
('418fbee1-01e4-70a1-9237-c4a9250f90b8'::uuid,'authored:m15-topictest-20261018:7:3','Y1',false),
('42769ade-8b46-4381-9bbf-3181117d1f1e'::uuid,'authored:pedagogy-pdf-corpus:v1:KS.01:002','Y1',false),
('43f89532-c8c7-7ef4-74dc-10575e6d02d5'::uuid,'authored:m15-topictest-20261018:5:9','Y1',false),
('451a9208-b787-761f-d523-0d9ad68244f6'::uuid,'authored:m15-topictest-20261018:6:11','Y1',false),
('457434d6-2c75-4640-8d3c-09f11a00d590'::uuid,'authored:pedagogy-pdf-corpus:v1:KS.07:002','Y1',false),
('47986bd9-4970-393e-d33c-78f2d86c0641'::uuid,'authored:m15-topictest-20261018:8:10','Y1',false),
('48cdf0b9-0fd7-4e1b-a810-33388a731cb7'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.GEN.07:001','Y1',true),
('49b79465-7cdd-4929-8c61-7188fae22c87'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.GEN.02:001','Y1',true),
('49cc9f8a-6015-48be-86b7-114c4dadab11'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.GEN.04:002','Y1',false),
('4b514de9-26ce-12f0-158d-323c334d1fb3'::uuid,'authored:m15-topictest-20261018:7:4','Y1',false),
('4c2aa246-132e-4cd7-85a8-5abdde14c0e7'::uuid,'authored:pedagogy-pdf-corpus:v2:KS.01:Y2:001','Y2',false),
('4c561ef8-93ab-4c96-8979-23819ecd0904'::uuid,'authored:pedagogy-pdf-corpus:v1:KS.02:001','Y1',false),
('4cd11649-cf96-c726-a26a-f80b320baa6e'::uuid,'authored:m15-topictest-20261018:6:6','Y1',false),
('4dee2206-4ffb-236b-1f3f-09c1ab2c9a77'::uuid,'authored:m15-topictest-20261018:5:1','Y1',false),
('4e02684b-3ac8-13d0-e89f-4cc261a9faa4'::uuid,'authored:m15-topictest-20261018:5:3','Y1',false),
('50ceaff9-f9e7-4d4e-8555-b3e103bacbd5'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.GEN.04:001','Y1',false),
('526803a4-3f67-4e8d-8cb1-74a211f0dd2d'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.GEN.01:001','Y1',false),
('53b961f3-3158-c176-5463-a49688645e35'::uuid,'authored:m15-topictest-20261018:4:6','Y1',false),
('5406e7d9-f2c1-bf2c-1a78-831637174b71'::uuid,'authored:m15-topictest-20261018:2:4','Y1',false),
('5411ff17-8030-4b65-af03-6022205d7df4'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.MET.02:002','Y1',false),
('54458d55-40ef-6a81-33b0-bc859b4a2cf9'::uuid,'authored:m15-topictest-20261018:1:11','Y1',false),
('55eeaa87-034b-f55a-4590-de0868be2671'::uuid,'authored:m15-topictest-20261018:6:4','Y1',false),
('56818ed2-6382-2ffa-ddef-61206ae15d39'::uuid,'authored:m15-topictest-20261018:1:9','Y1',false),
('5881852c-f616-795f-11ea-4873ac5c14e6'::uuid,'authored:m15-topictest-20261018:2:1','Y1',false),
('5b6f4db1-311b-26c3-d524-d8fddd054a27'::uuid,'authored:m15-topictest-20261018:3:4','Y1',false),
('5cff4b21-2324-3934-ea9c-8839e1adc6b8'::uuid,'authored:m15-topictest-20261018:5:2','Y1',false),
('5d673373-3a8e-442e-8b29-8cfc184f40cd'::uuid,'authored:pedagogy-pdf-corpus:v2:PM.MET.01:Y3:001','Y3',false),
('5ea0ba3d-d9e2-45b7-9a2e-6e350462a5fe'::uuid,'authored:pedagogy-pdf-corpus:v2:KS.02:Y2:001','Y2',false),
('614744ca-aff2-4c15-886f-e35891d4f232'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.GEN.07:002','Y1',false),
('65ebf957-f13c-0df8-5f40-5751028090eb'::uuid,'authored:m15-topictest-20261018:3:2','Y1',false),
('671be50e-8bfb-475c-b1e2-3b4a56a4639c'::uuid,'authored:pedagogy-pdf-corpus:v2:PM.GEN.07:Y3:001','Y3',false),
('6838e147-ca8d-f786-d16c-9f9a19064803'::uuid,'authored:m15-topictest-20261018:5:11','Y1',false),
('688d4e3d-899e-0409-10a5-d1c14cfff886'::uuid,'authored:m15-topictest-20261018:2:3','Y1',false),
('6982071a-cefa-4596-8892-828a4f6e4f59'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.MET.01:001','Y1',true),
('6b8c5680-bed5-f91c-367e-6d2a00041906'::uuid,'authored:m15-topictest-20261018:3:3','Y1',false),
('6bec6902-106e-1b35-5681-9f4e6c8147b8'::uuid,'authored:m15-topictest-20261018:1:12','Y1',false),
('6d3431cb-e0c3-4a9f-bdba-0dd61dcf6957'::uuid,'authored:pedagogy-key-correction:2026:spring:p30:q144','Y1',false),
('6e583401-8a00-72a1-1d7c-fdaeacc77dbd'::uuid,'authored:m15-topictest-20261018:2:12','Y1',false),
('6eb3f8fe-4eb2-e869-0cbc-bd9009da63dd'::uuid,'authored:m15-topictest-20261018:7:10','Y1',false),
('715e0994-8639-e6f0-13c0-d38845778d34'::uuid,'authored:m15-topictest-20261018:4:5','Y1',false),
('718afaa2-679e-450f-336d-8b4fb12fcea9'::uuid,'authored:m15-topictest-20261018:2:7','Y1',false),
('71d9be41-0717-4798-ad34-67b5f1d26186'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.GEN.06:002','Y1',false),
('729cc366-f9b8-e254-807d-b99263b6444b'::uuid,'authored:m15-topictest-20261018:4:8','Y1',false),
('735b776e-88f1-9dde-277f-0bb327bb03ef'::uuid,'authored:m15-topictest-20261018:3:1','Y1',false),
('73d08bec-72b5-f5eb-b72f-098906359746'::uuid,'authored:m15-topictest-20261018:2:2','Y1',false),
('78c75821-7327-13b8-d500-607099e4d4d8'::uuid,'authored:m15-topictest-20261018:8:8','Y1',false),
('79000000-0000-4000-8000-000000000101'::uuid,'authored:pedguli-topic-study:v2:KS.01:101','Y1',true),
('79000000-0000-4000-8000-000000000102'::uuid,'authored:pedguli-topic-study:v2:KS.02:102','Y1',true),
('79000000-0000-4000-8000-000000000103'::uuid,'authored:pedguli-topic-study:v2:KS.03:103','Y1',true),
('79000000-0000-4000-8000-000000000104'::uuid,'authored:pedguli-topic-study:v2:KS.04:104','Y1',true),
('79000000-0000-4000-8000-000000000105'::uuid,'authored:pedguli-topic-study:v2:KS.05:105','Y1',true),
('79000000-0000-4000-8000-000000000106'::uuid,'authored:pedguli-topic-study:v2:KS.05:106','Y1',false),
('79000000-0000-4000-8000-000000000107'::uuid,'authored:pedguli-topic-study:v2:KS.06:107','Y1',true),
('79000000-0000-4000-8000-000000000108'::uuid,'authored:pedguli-topic-study:v2:KS.07:108','Y1',true),
('79000000-0000-4000-8000-000000000109'::uuid,'authored:pedguli-topic-study:v2:PM.GEN.01:109','Y1',false),
('79000000-0000-4000-8000-000000000110'::uuid,'authored:pedguli-topic-study:v2:PM.GEN.01:110','Y1',true),
('79000000-0000-4000-8000-000000000111'::uuid,'authored:pedguli-topic-study:v2:PM.GEN.02:111','Y1',true),
('79000000-0000-4000-8000-000000000112'::uuid,'authored:pedguli-topic-study:v2:PM.GEN.02:112','Y1',true),
('79000000-0000-4000-8000-000000000113'::uuid,'authored:pedguli-topic-study:v2:PM.GEN.03:113','Y1',true),
('79000000-0000-4000-8000-000000000114'::uuid,'authored:pedguli-topic-study:v2:PM.GEN.04:114','Y1',true),
('79000000-0000-4000-8000-000000000115'::uuid,'authored:pedguli-topic-study:v2:PM.GEN.04:115','Y1',true),
('79000000-0000-4000-8000-000000000116'::uuid,'authored:pedguli-topic-study:v2:PM.GEN.05:116','Y1',true),
('79000000-0000-4000-8000-000000000117'::uuid,'authored:pedguli-topic-study:v2:PM.GEN.06:117','Y1',false),
('79000000-0000-4000-8000-000000000118'::uuid,'authored:pedguli-topic-study:v2:PM.GEN.06:118','Y1',true),
('79000000-0000-4000-8000-000000000119'::uuid,'authored:pedguli-topic-study:v2:PM.GEN.07:119','Y1',true),
('79000000-0000-4000-8000-000000000120'::uuid,'authored:pedguli-topic-study:v2:PM.GEN.07:120','Y1',true),
('79000000-0000-4000-8000-000000000121'::uuid,'authored:pedguli-topic-study:v2:PM.GEN.08:121','Y1',true),
('79000000-0000-4000-8000-000000000122'::uuid,'authored:pedguli-topic-study:v2:PM.GEN.08:122','Y1',true),
('79000000-0000-4000-8000-000000000123'::uuid,'authored:pedguli-topic-study:v2:PM.GEN.08:123','Y1',true),
('79000000-0000-4000-8000-000000000124'::uuid,'authored:pedguli-topic-study:v2:PM.GEN.08:124','Y1',true),
('79000000-0000-4000-8000-000000000125'::uuid,'authored:pedguli-topic-study:v2:PM.GEN.08:125','Y1',true),
('79000000-0000-4000-8000-000000000126'::uuid,'authored:pedguli-topic-study:v2:PM.GEN.08:126','Y1',true),
('79000000-0000-4000-8000-000000000127'::uuid,'authored:pedguli-topic-study:v2:PM.MET.01:127','Y1',true),
('79000000-0000-4000-8000-000000000128'::uuid,'authored:pedguli-topic-study:v2:PM.MET.01:128','Y1',true),
('79000000-0000-4000-8000-000000000129'::uuid,'authored:pedguli-topic-study:v2:PM.MET.02:129','Y1',false),
('79000000-0000-4000-8000-000000000130'::uuid,'authored:pedguli-topic-study:v2:PM.MET.03:130','Y1',true),
('79250000-0000-4000-8000-000000000201'::uuid,'authored:pedguli-html-concepts:v3:KS.01:201','Y1',true),
('79250000-0000-4000-8000-000000000202'::uuid,'authored:pedguli-html-concepts:v3:KS.03:202','Y1',true),
('79250000-0000-4000-8000-000000000203'::uuid,'authored:pedguli-html-concepts:v3:KS.05:203','Y1',true),
('79250000-0000-4000-8000-000000000204'::uuid,'authored:pedguli-html-concepts:v3:KS.07:204','Y1',true),
('79250000-0000-4000-8000-000000000205'::uuid,'authored:pedguli-html-concepts:v3:PM.GEN.01:205','Y1',true),
('79250000-0000-4000-8000-000000000206'::uuid,'authored:pedguli-html-concepts:v3:PM.GEN.01:206','Y1',true),
('79250000-0000-4000-8000-000000000207'::uuid,'authored:pedguli-html-concepts:v3:PM.GEN.02:207','Y1',true),
('79250000-0000-4000-8000-000000000208'::uuid,'authored:pedguli-html-concepts:v3:PM.GEN.02:208','Y1',true),
('79250000-0000-4000-8000-000000000209'::uuid,'authored:pedguli-html-concepts:v3:PM.GEN.04:209','Y1',true),
('79250000-0000-4000-8000-000000000210'::uuid,'authored:pedguli-html-concepts:v3:PM.GEN.04:210','Y1',true),
('79250000-0000-4000-8000-000000000211'::uuid,'authored:pedguli-html-concepts:v3:PM.GEN.05:211','Y1',true),
('79250000-0000-4000-8000-000000000212'::uuid,'authored:pedguli-html-concepts:v3:PM.GEN.06:212','Y1',true),
('79250000-0000-4000-8000-000000000213'::uuid,'authored:pedguli-html-concepts:v3:PM.GEN.06:213','Y1',true),
('79250000-0000-4000-8000-000000000214'::uuid,'authored:pedguli-html-concepts:v3:PM.GEN.06:214','Y1',false),
('79250000-0000-4000-8000-000000000215'::uuid,'authored:pedguli-html-concepts:v3:PM.GEN.07:215','Y1',false),
('79250000-0000-4000-8000-000000000216'::uuid,'authored:pedguli-html-concepts:v3:PM.GEN.07:216','Y1',false),
('79250000-0000-4000-8000-000000000217'::uuid,'authored:pedguli-html-concepts:v3:PM.GEN.07:217','Y1',false),
('79250000-0000-4000-8000-000000000218'::uuid,'authored:pedguli-html-concepts:v3:PM.GEN.08:218','Y1',false),
('79250000-0000-4000-8000-000000000219'::uuid,'authored:pedguli-html-concepts:v3:PM.GEN.08:219','Y1',true),
('79250000-0000-4000-8000-000000000220'::uuid,'authored:pedguli-html-concepts:v3:PM.GEN.08:220','Y1',true),
('79250000-0000-4000-8000-000000000221'::uuid,'authored:pedguli-html-concepts:v3:PM.GEN.08:221','Y1',false),
('79250000-0000-4000-8000-000000000222'::uuid,'authored:pedguli-html-concepts:v3:PM.GEN.08:222','Y1',true),
('79250000-0000-4000-8000-000000000223'::uuid,'authored:pedguli-html-concepts:v3:PM.MET.02:223','Y1',true),
('79250000-0000-4000-8000-000000000224'::uuid,'authored:pedguli-html-concepts:v3:PM.MET.03:224','Y1',true),
('79300000-0000-4000-8000-000000000301'::uuid,'authored:pedguli-topic-audit:v4:PM.MET.01:301','Y1',true),
('79300000-0000-4000-8000-000000000302'::uuid,'authored:pedguli-topic-audit:v4:PM.MET.01:302','Y1',true),
('79300000-0000-4000-8000-000000000303'::uuid,'authored:pedguli-topic-audit:v4:PM.MET.01:303','Y1',true),
('79300000-0000-4000-8000-000000000304'::uuid,'authored:pedguli-topic-audit:v4:PM.MET.01:304','Y1',true),
('79300000-0000-4000-8000-000000000305'::uuid,'authored:pedguli-topic-audit:v4:PM.MET.01:305','Y1',true),
('79300000-0000-4000-8000-000000000306'::uuid,'authored:pedguli-topic-audit:v4:PM.MET.01:306','Y1',true),
('79300000-0000-4000-8000-000000000307'::uuid,'authored:pedguli-topic-audit:v4:PM.MET.02:307','Y1',false),
('79300000-0000-4000-8000-000000000308'::uuid,'authored:pedguli-topic-audit:v4:PM.MET.02:308','Y1',true),
('79300000-0000-4000-8000-000000000309'::uuid,'authored:pedguli-topic-audit:v4:PM.MET.02:309','Y1',true),
('79300000-0000-4000-8000-000000000310'::uuid,'authored:pedguli-topic-audit:v4:PM.MET.02:310','Y1',true),
('79300000-0000-4000-8000-000000000311'::uuid,'authored:pedguli-topic-audit:v4:PM.MET.02:311','Y1',true),
('79300000-0000-4000-8000-000000000312'::uuid,'authored:pedguli-topic-audit:v4:PM.MET.02:312','Y1',true),
('79300000-0000-4000-8000-000000000313'::uuid,'authored:pedguli-topic-audit:v4:PM.MET.03:313','Y1',true),
('79300000-0000-4000-8000-000000000314'::uuid,'authored:pedguli-topic-audit:v4:PM.MET.03:314','Y1',true),
('79300000-0000-4000-8000-000000000315'::uuid,'authored:pedguli-topic-audit:v4:PM.MET.03:315','Y1',true),
('79300000-0000-4000-8000-000000000316'::uuid,'authored:pedguli-topic-audit:v4:PM.MET.03:316','Y1',true),
('79300000-0000-4000-8000-000000000317'::uuid,'authored:pedguli-topic-audit:v4:PM.MET.03:317','Y1',true),
('79300000-0000-4000-8000-000000000318'::uuid,'authored:pedguli-topic-audit:v4:PM.MET.03:318','Y1',true),
('79300000-0000-4000-8000-000000000319'::uuid,'authored:pedguli-topic-audit:v4:KS.02:319','Y1',true),
('79300000-0000-4000-8000-000000000320'::uuid,'authored:pedguli-topic-audit:v4:KS.02:320','Y1',true),
('79300000-0000-4000-8000-000000000321'::uuid,'authored:pedguli-topic-audit:v4:KS.04:321','Y1',true),
('79300000-0000-4000-8000-000000000322'::uuid,'authored:pedguli-topic-audit:v4:KS.04:322','Y1',true),
('79300000-0000-4000-8000-000000000323'::uuid,'authored:pedguli-topic-audit:v4:KS.06:323','Y1',true),
('79300000-0000-4000-8000-000000000324'::uuid,'authored:pedguli-topic-audit:v4:KS.06:324','Y1',true),
('79300000-0000-4000-8000-000000000325'::uuid,'authored:pedguli-topic-audit:v4:KS.07:325','Y1',true),
('79300000-0000-4000-8000-000000000326'::uuid,'authored:pedguli-topic-audit:v4:KS.07:326','Y1',true),
('79300000-0000-4000-8000-000000000327'::uuid,'authored:pedguli-topic-audit:v4:PM.GEN.02:327','Y1',true),
('79300000-0000-4000-8000-000000000328'::uuid,'authored:pedguli-topic-audit:v4:PM.GEN.04:328','Y1',true),
('79300000-0000-4000-8000-000000000329'::uuid,'authored:pedguli-topic-audit:v4:PM.GEN.06:329','Y1',true),
('79300000-0000-4000-8000-000000000330'::uuid,'authored:pedguli-topic-audit:v4:PM.GEN.08:330','Y1',true),
('7bd870f8-7bf2-4033-b3c1-ca087eb68109'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.MET.03:001','Y1',false),
('802e226f-2aab-4cf8-ad47-0630a95902a0'::uuid,'authored:pedagogy-pdf-corpus:v2:PM.GEN.02:Y2:001','Y2',false),
('80ffa6ee-f09d-4106-a547-2875a019d1a7'::uuid,'authored:pedagogy-pdf-corpus:v2:PM.GEN.08:Y3:001','Y3',false),
('81b34a2e-c7a0-4506-8f11-c037cdcb490b'::uuid,'authored:pedagogy-pdf-corpus:v1:KS.06:002','Y1',true),
('88729662-8f3a-8b8f-e8c0-c9177411803f'::uuid,'authored:m15-topictest-20261018:6:9','Y1',false),
('8930c547-aff0-4aac-b3de-9f94f67c2ed0'::uuid,'authored:pedagogy-pdf-corpus:v1:KS.04:002','Y1',false),
('8b0f9e3c-f7d3-540d-243b-1312add6e727'::uuid,'authored:m15-topictest-20261018:8:7','Y1',false),
('8ccbd40e-f934-4ef2-b4b1-ceb3738922f9'::uuid,'authored:pedagogy-pdf-corpus:v2:PM.GEN.04:Y3:001','Y3',false),
('8d12ce72-756f-421e-7362-9b68f464be37'::uuid,'authored:m15-topictest-20261018:3:5','Y1',false),
('8dc89a9e-f7eb-4585-aba7-34f45e43d692'::uuid,'authored:pedagogy-pdf-corpus:v3:2025:spring:p2:q4','Y1',false),
('8ed0ec97-98c7-0e9c-e2bf-01fbbf3769b4'::uuid,'authored:m15-topictest-20261018:2:10','Y1',false),
('907119bd-4be5-417e-9a74-118a00930686'::uuid,'authored:pedagogy-pdf-corpus:v1:KS.03:002','Y1',false),
('90ec42ff-6e19-4de2-5d84-2fd6e3808861'::uuid,'authored:m15-topictest-20261018:8:5','Y1',false),
('928b765d-c939-bb1d-c32e-b7470a317bda'::uuid,'authored:m15-topictest-20261018:3:12','Y1',false),
('92a2be61-074a-483e-96f7-cb9095273c76'::uuid,'authored:pedagogy-pdf-corpus:v1:KS.07:001','Y1',true),
('946e5e37-2d12-45bf-b64c-3b15b8135749'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.GEN.05:001','Y1',false),
('980d678b-b06b-85ab-82ee-fc3bc6347abe'::uuid,'authored:m15-topictest-20261018:5:12','Y1',false),
('98846aa5-6f2e-5e75-b721-c40497175fd4'::uuid,'authored:m15-topictest-20261018:2:6','Y1',false),
('9c02c0fe-caaf-7cb8-13e9-c91509856fc4'::uuid,'authored:m15-topictest-20261018:1:10','Y1',false),
('9e30da20-5cef-48e1-a1f2-ee8f933d2dbe'::uuid,'authored:pedagogy-pdf-corpus:v1:KS.05:001','Y1',false),
('9ff80e2d-04c2-44f1-ad6f-853e61be2db3'::uuid,'authored:pedagogy-pdf-corpus:v3:2026:spring:p1:q1','Y1',false),
('a12500e7-c47f-15e0-e3ff-21ed770eab00'::uuid,'authored:m15-topictest-20261018:8:11','Y1',false),
('a54dbb51-2e0f-4f74-9389-8fd201bc2073'::uuid,'authored:pedagogy-pdf-corpus:v3:2024:spring:p5:q20','Y1',false),
('a7033c32-098e-488c-af0e-8c08cf1fa3df'::uuid,'authored:pedagogy-pdf-corpus:v3:2026:spring:p5:q22','Y1',false),
('b00d6c90-e6b3-4f02-9172-6c2af208f35f'::uuid,'authored:pedagogy-pdf-corpus:v2:PM.MET.03:Y3:001','Y3',false),
('b03e3067-45b9-2348-ef62-f287e3ec1c13'::uuid,'authored:m15-topictest-20261018:2:9','Y1',false),
('b112651a-aea5-4f18-95be-8db149bdfa9b'::uuid,'authored:pedagogy-pdf-corpus:v3:2024:spring:p8:q35','Y1',false),
('b13f58c3-5907-48f3-922c-6dfe6a325e07'::uuid,'authored:pedagogy-pdf-corpus:v1:KS.06:001','Y1',true),
('b1be8065-59a2-4ea0-bd01-fa4135925f8e'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.GEN.01:002','Y1',false),
('b3a67927-4bb2-4b1b-8221-ef5189440acb'::uuid,'authored:pedagogy-pdf-corpus:v2:PM.MET.02:Y3:001','Y3',false),
('b41fa14f-7a68-23be-66a3-8df677063048'::uuid,'authored:m15-topictest-20261018:4:10','Y1',false),
('b45aa5f4-388e-4768-8ff4-8628847580e4'::uuid,'authored:pedagogy-pdf-corpus:v3:2025:autumn:p8:q25','Y1',false),
('b6acbb5f-c8f2-6298-9712-a5dec06d6f08'::uuid,'authored:m15-topictest-20261018:1:2','Y1',false),
('b7632513-aa4c-44a9-a308-52bfb60af145'::uuid,'authored:pedagogy-pdf-corpus:v2:KS.04:Y2:001','Y2',false),
('b8eeb227-e4d7-94b2-16fe-3cecfdab34a8'::uuid,'authored:m15-topictest-20261018:7:6','Y1',false),
('b9270878-b0fa-3298-2ddb-0486b8c69edf'::uuid,'authored:m15-topictest-20261018:6:7','Y1',false),
('bb0a508f-f37e-d00e-6709-835411b56d43'::uuid,'authored:m15-topictest-20261018:8:3','Y1',false),
('bb74be92-a3de-4f12-8e1a-d179944837c3'::uuid,'authored:pedagogy-pdf-corpus:v2:KS.06:Y2:001','Y2',false),
('bb897df8-2c9f-4990-9a79-04c856d59564'::uuid,'authored:pedagogy-pdf-corpus:v2:PM.GEN.05:Y3:001','Y3',false),
('be2ee11a-c30f-45bb-cdb3-04db4cb49e01'::uuid,'authored:m15-topictest-20261018:3:7','Y1',false),
('be6462ff-28c2-46b8-9678-02979594c172'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.MET.02:001','Y1',false),
('bfa28e5b-0e30-7f45-8d7b-f25627b2caf5'::uuid,'authored:m15-topictest-20261018:7:8','Y1',false),
('c3d2cc91-fc2b-4f06-a972-2574783dd9a3'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.GEN.02:002','Y1',true),
('c460d9f4-ee25-47b7-b22e-287dd6d22952'::uuid,'authored:pedagogy-pdf-corpus:v3:2025:spring:p7:q30','Y1',false),
('c7d38398-9166-3c9a-742d-5f53c1933c20'::uuid,'authored:m15-topictest-20261018:3:8','Y1',false),
('c8a98c0e-5504-4bf7-bb4b-8d434e8e485a'::uuid,'authored:pedagogy-pdf-corpus:v2:KS.07:Y2:001','Y2',false),
('c90d5d05-5995-a682-50a1-dcf829c09a5e'::uuid,'authored:m15-topictest-20261018:5:6','Y1',false),
('c950285d-ed1b-41a9-aa7b-730d1c448fcb'::uuid,'authored:pedagogy-pdf-corpus:v1:KS.02:002','Y1',false),
('cb44a291-e32a-dbaf-b09e-2af74200c958'::uuid,'authored:m15-topictest-20261018:5:4','Y1',false),
('cd4b4f31-7aa9-59a2-12ea-ee981a7a2bc2'::uuid,'authored:m15-topictest-20261018:2:11','Y1',false),
('cd673392-a09e-4cb0-b83b-67db1f606f9a'::uuid,'authored:pedagogy-pdf-corpus:v2:KS.05:Y2:001','Y2',false),
('d191837e-6f9c-983f-d110-7fdd760a8eb2'::uuid,'authored:m15-topictest-20261018:1:8','Y1',false),
('d2387b88-7ed9-f975-6183-c77d90b849a3'::uuid,'authored:m15-topictest-20261018:2:5','Y1',false),
('d3b874e5-4856-d8c4-85dd-a7dbe21c46e5'::uuid,'authored:m15-topictest-20261018:8:6','Y1',false),
('d53f0cb0-7196-a814-1247-f840cc365df3'::uuid,'authored:m15-topictest-20261018:7:1','Y1',false),
('d6a466be-9fcf-2a6a-c7b0-2d54f7cd77f8'::uuid,'authored:m15-topictest-20261018:6:10','Y1',false),
('daae8a4a-25d7-32e9-2a85-4080e71fd0c7'::uuid,'authored:m15-topictest-20261018:3:10','Y1',false),
('ddcf737a-feae-f94e-1569-857a77aa32e5'::uuid,'authored:m15-topictest-20261018:7:9','Y1',false),
('dde81ce5-bee8-42f5-b197-f1d7715af7f4'::uuid,'authored:pedagogy-pdf-corpus:v2:PM.GEN.01:Y2:001','Y2',false),
('df27c90b-21c8-f8fd-668a-0ea344500502'::uuid,'authored:m15-topictest-20261018:8:9','Y1',false),
('e06fdb4f-fdd9-f17a-6085-c9ff214194b6'::uuid,'authored:m15-topictest-20261018:7:7','Y1',false),
('e41237fd-bcb7-4080-a65b-21b4d8bd5afd'::uuid,'authored:pedagogy-pdf-corpus:v1:KS.05:002','Y1',false),
('e4fd5e49-a628-cd25-ad2a-90e8201dba27'::uuid,'authored:m15-topictest-20261018:6:8','Y1',false),
('e5c56cf9-316e-013a-6366-0bcfa9bf5438'::uuid,'authored:m15-topictest-20261018:8:2','Y1',false),
('e7695e5b-4237-a79b-75a7-afb49fca77d2'::uuid,'authored:m15-topictest-20261018:4:1','Y1',false),
('ec516d83-5f2e-4570-93c7-7e5aa2816f53'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.GEN.03:001','Y1',false),
('ecfd15a4-72c7-4c42-a47a-9679f8064472'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.GEN.05:002','Y1',true),
('f05cb1e0-129f-c4a5-a6ef-ae5e164d3f46'::uuid,'authored:m15-topictest-20261018:1:4','Y1',false),
('f099a140-e417-431f-839a-afca32139353'::uuid,'authored:m15-topictest-20261018:5:7','Y1',false),
('f0dfe1de-c040-0ffa-32cf-781a087492e2'::uuid,'authored:m15-topictest-20261018:7:2','Y1',false),
('f2fb9c97-44b7-4eef-8809-a8909e05ca74'::uuid,'authored:pedagogy-key-correction:2026:spring:p3:q14','Y1',false),
('f35ce286-3064-4b17-8ac2-a2bdc2a2d6e6'::uuid,'authored:pedagogy-pdf-corpus:v2:KS.03:Y2:001','Y2',false),
('f4a3359f-53b2-4c58-bd17-6e907d6e902f'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.GEN.08:001','Y1',false),
('f5a4689a-182b-4196-a8bd-a7e7766b888c'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.GEN.03:002','Y1',false),
('f5b0707d-cc7a-4f1b-9e4f-a0eb06007185'::uuid,'authored:pedagogy-pdf-corpus:v1:KS.01:001','Y1',false),
('f6052b28-c3f8-4872-808f-3f27f021e8cc'::uuid,'authored:pedagogy-pdf-corpus:v2:PM.GEN.06:Y3:001','Y3',false),
('f625ec26-0621-46e9-8678-2c3ba7b7673e'::uuid,'authored:pedagogy-pdf-corpus:v1:PM.GEN.06:001','Y1',true),
('f96b0003-7d17-3cf6-e4a1-620edf758144'::uuid,'authored:m15-topictest-20261018:3:11','Y1',false),
('fa1debb5-0dd4-2d66-d9c1-699d253e4de7'::uuid,'authored:m15-topictest-20261018:3:9','Y1',false),
('fe3396d3-84dc-4b0e-140a-0977e0507cc4'::uuid,'authored:m15-topictest-20261018:4:2','Y1',false),
('fea25041-deb0-d68f-4434-87a8cfb331f7'::uuid,'authored:m15-topictest-20261018:1:1','Y1',false)
  ) AS src(id,source_reference,format,redrafted) LOOP
    SELECT status,source_reference INTO v_status,v_source
      FROM public.questions WHERE id=rec.id FOR UPDATE;
    IF NOT FOUND THEN
      v_absent:=v_absent+1; CONTINUE;
    END IF;
    IF v_source IS DISTINCT FROM rec.source_reference THEN
      RAISE EXCEPTION 'TASK-203 provenance differs for %',rec.id;
    END IF;
    IF v_status='published'::public.content_status THEN
      -- Never rewrite an immutable question or forge a signature for old data.
      v_existing:=v_existing+1; CONTINUE;
    END IF;
    IF v_status<>'review'::public.content_status
       OR EXISTS(SELECT 1 FROM public.question_editorial_checks WHERE question_id=rec.id)
    THEN RAISE EXCEPTION 'TASK-203 unexpected approval state for %',rec.id; END IF;
    IF NOT EXISTS (
      SELECT 1 FROM public.questions q JOIN public.constructs c
        ON c.id=q.construct_id AND c.group_code=q.group_code AND c.is_active
      JOIN public.lesson_constructs lc
        ON lc.construct_id=q.construct_id AND lc.lesson_id=q.source_lesson_id
      JOIN public.lessons l ON l.id=lc.lesson_id AND l.status='published'::public.content_status
      WHERE q.id=rec.id AND q.group_code IN('KS','PM.GEN','PM.MET')
    ) THEN RAISE EXCEPTION 'TASK-203 source/lesson mismatch %',rec.id; END IF;
    SELECT count(o.id),count(o.id) FILTER(WHERE o.side='a'),
           count(o.id) FILTER(WHERE o.side='b'),
           count(DISTINCT lower(btrim(o.content_md))),
           min(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'))),
           max(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'))),
           max(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+')))
             FILTER(WHERE o.id::text=k.payload->>'correct_option_id'),
           max(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+')))
             FILTER(WHERE o.id::text<>k.payload->>'correct_option_id'),
           count(o.id) FILTER(WHERE o.id::text=k.payload->>'correct_option_id'),
           max(k.payload::text)::jsonb
      INTO v_options,v_a,v_b,v_uniq,v_min,v_max,v_cw,v_wrong,v_hits,v_payload
      FROM public.question_options o JOIN public.question_keys k ON k.question_id=o.question_id
      WHERE o.question_id=rec.id;
    v_valid:=CASE rec.format
      WHEN 'Y1' THEN v_options=4 AND v_a=4 AND v_uniq=4 AND v_hits=1
        AND v_min>0 AND v_max<=v_min*1.8 AND v_cw<=v_wrong*1.25
      WHEN 'Y2' THEN v_options=8 AND v_a=4 AND v_b=4 AND v_uniq=8
        AND jsonb_typeof(v_payload->'pairs')='object'
        AND (SELECT count(*) FROM jsonb_each_text(v_payload->'pairs'))=4
      WHEN 'Y3' THEN v_options=4 AND v_a=4 AND v_uniq=4
        AND jsonb_typeof(v_payload->'order')='array'
        AND jsonb_array_length(v_payload->'order')=4
      ELSE false
    END;
    IF NOT coalesce(v_valid,false) THEN
      RAISE EXCEPTION 'TASK-203 editorial option contract not satisfied for % (%).',rec.id,rec.format;
    END IF;
    IF rec.redrafted THEN
      v_note:='2026-10-18 OWNER BATCH APPROVAL documented from ChatGPT. Incorrect distractor texts were subsequently rewritten with AI for uniqueness and word-count balance; source and correct key unchanged. Owner authorization is recorded; no independent external human expert certification is claimed.';
    ELSE
      v_note:='2026-10-18 project owner approved the pending pedagogy question bank via ChatGPT. Owner batch approval, NOT an independent per-item external expert certification. Question-answer contract and canonical source/lesson linkage checked by database release gate.';
    END IF;
    INSERT INTO public.question_editorial_checks(
      question_id,reviewer_id,answer_verified,reference_verified,wording_verified,
      original_authorship_verified,reviewer_notes,content_fingerprint
    ) VALUES (
      rec.id,'01f636a4-304c-4627-9d6c-3cde0f59ffbb'::uuid,
      true,true,true,true,v_note,'stamped-by-trigger'
    );
    UPDATE public.questions SET status='published'::public.content_status,updated_at=now()
      WHERE id=rec.id AND status='review'::public.content_status;
    IF NOT FOUND THEN RAISE EXCEPTION 'TASK-203 concurrent mutation for %',rec.id; END IF;
    v_reviewed:=v_reviewed+1;
  END LOOP;
  RAISE NOTICE 'TASK-203 approved and published %, previously published %, absent %',v_reviewed,v_existing,v_absent;
END $owner_approval_replay$;
COMMIT;

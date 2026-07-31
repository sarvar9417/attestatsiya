-- 000014 da backfill bo'sh ketgan (generator filter bug'i tuzatilgandan keyin).
-- 000014 append-only qoladi; to'ldirish ushbu forward-fix migratsiyada.

begin;

update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'c8aa0008-2b2f-5a5c-9625-e5c482a91c12'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '7724aebe-0037-5ebb-a5c1-c06c2d019844'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '22155483-6420-55bf-9c2a-37f013401cb4'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '5ec1a774-385a-53fc-93fa-cd5436d45248'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '472f0874-056c-5443-a7be-921d14ea5f0c'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '350d4307-5990-5b7a-8fd2-bb03b7574f42'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '4d266d2f-aeed-5362-9cac-7df1c8d3ab1a'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '92267022-bc80-5d5d-92f4-b1a38f700a5a'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '86461dba-3ae4-53d6-bd65-9a3ea521324b'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'a9edea8e-33ca-5366-8cc5-8eeb868f1baf'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '10bd96d7-8ccf-5c10-84cc-bb23471a4e37'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '4c35dedd-001f-5ea0-8d29-bcde9a074750'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '9865a7d7-ff13-58f7-a2ad-75e9be28235f'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'e63ad566-fa2a-5478-ab78-9b4bb69a935a'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '68825207-5be9-56f3-8916-1f0ddd3ca24d'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'd6472433-4a74-59b7-87a5-b64cf759ff83'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '19be2fda-3a39-501c-970d-99a92c7575bd'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '8ee5aa36-a817-5bc4-a5c2-78364f9a962e'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '6a75c605-29b6-5c44-8bbb-d02d69de0798'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '8f4d1678-4268-521b-82c6-05b8d6e72117'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '506ec704-62b8-51bc-8288-0ec940633bc7'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'c6a69555-20b0-572c-94df-c641c2a7a12b'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '78916548-ca09-529e-b35f-832fe1c40c86'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '6533c3e0-c87b-55bf-87fa-9e99b5eb7795'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '9f1c443d-1bff-56e3-8fb6-04c9d3c5c9d0'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '52d2f764-c113-57b8-93f1-623dcd952dc1'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'b0d47b2d-1c56-5fc4-a2f5-05763dbfe3e1'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'd70e9832-bff6-5a82-b71e-6614b2df29a0'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '0c5f3e6e-d46d-51c1-be5d-81984e54e9bb'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '64105957-f49b-5682-b9fd-1b4b353dff50'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '7d1600a7-9555-5f98-9761-b73a7f960ab9'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'b8ee7cb5-6649-5a73-b91b-e961887396fc'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'bbe897ff-2a6f-5417-a753-3a7b09c94bd0'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'cfac2302-c40a-5132-9557-40c3c58a807a'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '9913fb4f-4d59-5667-89cf-f56413e73939'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '8d3f395c-f4b4-51b4-86fe-f766576cb247'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '2832eb3b-5d9a-5c9d-8866-991e764488a7'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'c3462947-dd64-5c52-b78d-85c57518db2c'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'a5b06704-1e98-54c8-918d-577218f5f05a'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'bf07afcf-6f21-5441-84fd-e0d7991f2029'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '36446ac4-368b-5cd5-a18a-4903c9b55ade'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '1c0a752b-ac62-59e3-bdbc-20b1388ee048'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'c8aa09e7-3424-55fa-8d21-ef29c41ca815'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'a6ee6c00-73cc-53ab-ae2d-7e7645ff29e4'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '6be2783c-3389-564a-910e-4f7b3b3e25d3'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '0fa65f53-ebcf-5bcb-8cf3-bb456d9de91e'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'ce096d06-2532-503a-b6bb-38258514f5ea'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '32abdd6c-598b-57b8-91ec-41d4891ddf0f'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '5c36908a-d347-5b91-9c8d-aebc228daf07'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'b6fa2020-f265-5704-acd5-7c496fce4f30'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '3bb6604f-41be-57f6-983d-f84d857427fe'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'c28a00c2-90ff-54f3-84e7-be1548be6870'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '6355acc3-d592-5db6-b1e3-9448d559fdda'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '788862d9-f896-5dff-9e42-5d67a30a1bbf'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'cc48c906-3854-576a-9734-4d7a3851be02'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '8c546919-2b72-5f90-b066-94fcf6d54cce'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '3a438c47-6c8b-5ce0-a43d-31c2fc4fc089'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '024c0191-5975-5432-a629-527eed778ed9'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = 'c6d700ce-66a8-5811-b664-cb33022badba'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-02'
   and q.id = '519189ae-2c89-5298-a551-6c4bbfabb9f9'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = 'ef4678af-ad1a-56c5-a709-6067475ed5af'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '3fc69a62-8d43-5e1a-9751-ae758a7f1cce'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = 'df76680b-9024-57bf-bbdb-44612db5c1c2'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '60b09194-8d8f-5b1a-8f46-aa435010e860'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '03d02590-6473-51bb-9303-b79078994a16'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '4345a41f-4e47-5ae1-9ab6-2a8f87abe509'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '7860dc5d-5a27-5e86-a10d-660b662fd225'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '38484954-677c-5ac1-8621-c27a03f9a383'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '4cc8e020-8734-50fe-a533-20e614356512'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '0cee520d-7408-5f33-91dd-f88620920d2c'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '9727036e-efc1-5b6a-9c4f-6bb4e6101802'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '643d9cc6-ba29-5a1a-92ef-8b7ed0a54ecc'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '326bad08-56af-5aa9-b18d-d78bee0d1043'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '707b55d5-2bbb-5499-9807-79dfdbb2a7d1'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '6e16e700-785a-5443-a8fb-3e42ec0dcfe1'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '2125285e-d6db-59b8-8788-3fefee1d2dd4'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = 'c4f8dc44-983a-5671-af23-a05adb5fdfe9'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '14ebaedb-b544-5fec-b9d2-f05a88f2123d'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '596e215d-e4d9-5009-b812-a87c9921fee1'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '88f14854-6524-5522-a217-fbeb95d65258'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '841ca516-2662-5d01-99c5-14b46a688365'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = 'be579e76-c2b2-5a0b-b799-3733b42ad973'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '3d9b3b7b-7222-5732-b101-3e9f5233d361'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = 'ade661e4-7110-5aeb-bb9a-cb932aefd38a'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '0f315633-8d3e-5fa4-926a-fe37c138134e'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '591ad681-018d-5b47-93ed-fbdce716d8fe'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = 'a97511e4-ed9b-5910-8603-f9ec9b6c71b8'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '93ec6428-37f7-5c33-a3e9-ac51b4d0f839'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '3da93a1c-600b-56ed-8211-9f533f96380f'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '22b3dd32-27dc-5be0-b4d9-cbf0f5bb5097'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '0c498fb3-60d7-59f7-b07c-d669e18f5697'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '21099094-3bb2-5ae2-b7ca-83ee02103cf6'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '01611a84-d41d-5fb4-bda6-22306aa24d42'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '8f679434-7c2b-5b4b-8833-cc03485c643a'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '9a585b5d-caa3-57d4-a094-b612a12db264'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = 'f896e2d3-4b72-5fa1-b1d9-cd60d14e7a02'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = 'eceb4b4a-02ce-562c-acea-04478a91b909'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '39eb2b9e-607f-5316-84aa-bd7ef2629779'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = 'a4f40975-0052-5597-892f-0f76ee0f7676'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '6f5fa8e5-e75e-5c63-afe3-0e832c8ebbee'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = 'a623a9dc-8438-55c9-8de2-83e34aff8842'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '65bd2cb5-08f9-5a14-a8b1-973b1e322419'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '76993e84-21cf-5e75-9822-b045bad783a6'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '1c7442ab-bd6d-5b04-ab57-dafaa1b65c73'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '6dcede2d-1a2b-5278-b77d-3b7c188facf0'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '294938c5-2b5c-530b-a943-0a83bd1da8c4'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '83b3bed7-a46d-560c-b2b0-1826f00a2091'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '16061a5c-8c5e-56ba-a3d4-94293fd5da26'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = 'a1ef23df-afe8-5c23-8587-f0b5265110ea'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = 'ee9b5ae9-3f70-587c-93e6-a9ec5d3b9c2c'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '764e68d3-e814-5687-af7d-b307e662ea17'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = 'e935583b-1531-5d7e-989e-8a3ec28ca926'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '4ab9e611-e990-52b5-9f29-53a1c9c22a67'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '0ceafe9b-858f-5dd4-ad5d-7e8619dd4d1e'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = 'fa01eef6-bec8-5ad5-ad35-38d8df085f19'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = 'e6932086-2e33-563e-8386-65e5b7130876'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '274577b0-ae37-5e54-a2a3-da0c6378ac97'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '13e390ce-4a9d-5e84-a611-b089261fc271'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = 'e482d6fe-7a4f-5d21-b7f0-49ad435558eb'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-03'
   and q.id = '5a6f864f-a312-5fa4-977e-708c688eb1ef'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '58c1a6d7-047d-568b-b055-b7d0f1eb7aeb'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '37eb396c-371a-5dd9-90c4-97717f775c46'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'e7f1ebf0-151a-53f7-8dca-963bbad45332'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '619f9e90-f1a6-573c-872c-41e0b18845a1'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '74a49843-5b3b-5cef-9a89-7dd0a8a21ca2'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '51e483db-ffea-5641-b9d2-72031525e0f9'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '513b9193-8c05-5518-8636-e5bc8f4c4da6'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '070e926c-6441-5edd-96c8-ef4a7e20a79a'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'b9f1669c-71a2-5109-b991-2a0fe5b524ac'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '578a7074-0168-5d45-aa04-0ce2430f448f'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '06e82163-0cb0-57ff-8ae8-5ab609a1f451'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '768a1ce6-5bfd-53e2-9168-d63a095e4583'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '049b9fab-999e-5da3-8272-9c7374d65c09'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '54384f7d-df44-5572-8e90-f745719adfa4'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '5ac8f89a-a59f-57ad-bd6d-6fe9dc609d4c'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'e49d19a8-7c94-5622-bed6-fc8a6bd93e14'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '0083f32c-ef8d-5621-953c-6100972f81eb'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '4c7289f8-96df-5ecb-adcc-3e1db3c1a8f8'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'd39f79fc-3987-547e-8e65-c5408f805ddd'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '8f5c32fa-344b-5f76-9e3b-3971e4acb034'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '455f6a6f-c663-58a4-a33a-54c0582caeca'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'f80a19a3-78dc-58ea-a7c9-dad3b7781aa5'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '94e3e26a-4ca1-5164-8ca2-2ec0db6c0483'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '7b430e5b-007f-5051-ad61-d69dd5f7992a'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '345dce1a-43a7-5b24-9276-40498d82d16d'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '2e60b13a-9908-59d0-991f-96a00af461fe'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'db89e91e-3325-5a64-b1a4-8b8a34b95c27'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'd1cccae9-dc67-513c-8323-4dd1f04f001e'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '61a4f4d6-6faa-51ab-9e9c-9b3aab4baaa8'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'd736da81-b352-5a7a-8dd8-432cc14be4f9'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'f08c8ee6-92dd-506d-958e-d77bb9364d52'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '48d2694c-ea76-59b9-8d37-cf75855479d3'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '42867d0d-0b9b-5c91-b58b-a332a8dfe316'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'b5649dc6-4a2b-56cc-8bfb-059f7d7e951a'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '43ee115a-e857-5f62-a92d-7cb17771d456'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '051b2505-16d1-56b1-b03c-f794b321f980'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '718c0128-12dc-52f6-aa65-d2728a442aac'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '4da0ecbd-eea8-5599-8ad6-3f3ebea890e4'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '43359b14-ba63-5537-9702-456bc431fa24'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '2aa96b5e-5571-5b1e-93b6-a51a715c20a9'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '66d27c1b-39ce-55e4-9fbe-0708d94c4e06'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'f4ae44b1-4817-5f93-9015-4287e6c3b168'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '78a96e0c-9fe7-5721-8d96-c3a8ddb9c9b2'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'f8b17255-2811-592e-be51-c4b6f523c9de'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'c3aa4e7a-cfb3-569b-9be4-e3a22f0b94aa'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'a0a03864-3f39-5bde-8651-2366cbed7fc2'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'b9c1ff61-f69b-569a-8752-0a15d4bbb281'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'e3e7b9d8-4be5-5bf3-abec-4c2ba895becd'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'bfb7bf45-0dc6-51be-99d4-f5ab25bac0d4'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'd81ef3de-5280-5a39-9556-48ac57e2308f'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'f58aaaec-3f26-5aa0-add9-702799dbd23b'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'a1450cad-83a3-565c-8297-ad4e4d859d1e'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '93830872-49b4-5c8f-ae7a-543ceadc47f5'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'f520c5ea-f7af-5a39-851f-d95199b42364'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '23aef2a7-d121-5ea6-a43a-b44d846868ee'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'bd46862e-c9a1-595e-883f-f21266472023'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '77eb3ca4-8439-583d-bb78-d5136d1624d7'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '2ad57c9b-56eb-5ad3-88cd-82e5ea854ddd'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '7b2787df-4d54-5cf7-8eba-f2dcc0fde87f'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '96655822-2825-5b68-85c4-25d355041fbe'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'f868e1ed-da21-5b35-a729-1c46fa92d46b'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'c2b18ca9-23c0-58d9-b6ca-8336f5433c96'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '88fcc37c-88fa-5973-a644-e80cb1183129'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '135b0bed-8db2-5157-bb4e-02556fcad1a5'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = 'f2c5dfc9-c239-5a31-a649-604ae7d23cc2'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '1dd23bba-f2d4-5c54-a87b-36439e72e5a0'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '5f195fd4-6298-5047-9285-5f1f2ec9dcf3'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '9ddbde56-eed2-5a87-9efb-1caf415c125c'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '9b916ae7-2c82-5a4e-bc2e-5f59f0b6779f'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-04'
   and q.id = '254c6cf7-95ee-5c8c-97bb-f572b180e1ad'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '391dc5c5-019d-51d6-ba3b-995c8233fc26'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '58ae6b8a-a39c-5561-8475-5e1b499e6559'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '437170ec-72f1-5b3f-a2df-35ae6f7393f7'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'a0bdd6d1-2ad7-54ac-a4e1-c83faefde4c9'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '85c85aa0-e86c-50e4-8fb5-43a156a70694'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '1d0773e3-780d-5a2e-9fc9-82ca4c9921a7'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '28656acf-7cb1-5381-b144-52ec4f7651ee'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'd6ff215f-f268-5717-a5f0-b03536a809d3'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '50af1ee9-3249-5e12-81a9-f08c5daad0a2'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '2e9b2113-476f-5ac9-acbc-c2aa4bcc1a63'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'c9814e9b-d611-5196-97d6-e91f2affa988'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'e2e6bda4-7690-5120-a78f-86c375cfc9f2'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '28f83a8d-7276-5c85-ae0f-2abaf47f073f'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '6c8224c8-deb3-5aaf-9152-05b105967235'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '17170d02-bc17-5b11-84cf-d657fff3c07e'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'e12c1cdc-f339-5393-95f2-d4a5f32aa925'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '651a433e-3f2b-5432-a4a5-fd6e76b7536d'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'efb3a50b-0c36-5956-94f8-897d45febfb4'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '968a2623-a879-5865-b09e-9b799b26bc69'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '02e46735-fa65-54b0-ba60-5e3206108fc1'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '76a3ddb8-f837-5900-a348-997fa53e24f7'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '9745fc4a-4e64-5240-8470-0c4a00befd43'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '98fc692b-3380-5d37-b066-e7cca9eefe88'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '47d9d7f2-a801-5c56-a8d8-a74c5bffcde2'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '86bfd308-3aa4-5e73-bf79-d9c3cbc424b4'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'cd374583-f0f9-5154-b71a-c02c1eb8c148'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '3ed47751-4392-5060-aa5a-909d1c47005e'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '73af6fd6-4464-5771-b77f-fdd5c236f8b1'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '76c8491e-e378-5ee1-98b8-5fb604801a23'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '3863d52e-59b9-5c72-a90b-8d69202fdb74'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'f904b46f-2198-5470-8030-bfcfb7f5be8e'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'b265868e-bf27-59b4-8553-c2b5b45136c3'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '8264cb99-c8ff-59a1-a0a0-fea0b89dfa07'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '75ae48c6-1315-5457-af78-61209df0a335'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'e4e33fe3-a8e2-524c-92cc-dcd4b6973fa6'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '6285684e-b001-5ad7-8016-d36e43b94921'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'e77af2bd-c98b-5a0e-a15b-81d466cf53d3'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'e9633b58-241d-5530-ae53-e3f9f3505e66'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '19f15cc2-1c4c-5f41-aabe-a2b23d5a13d7'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '46dafd34-f747-527b-8d20-e9d5fc7a9c4b'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '4552f2f7-d6aa-597d-97c3-39cb8775d1b7'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'c5826bed-5a23-57cb-807a-4d510c8e4198'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'f3a7f637-3fa0-538b-917b-b8967a2a0c68'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'db279ae2-82ef-5ec9-bd33-2fa2885a773f'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '79f55735-9685-514f-8fd5-3ccadbe73289'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'ecebf3fd-fafd-55a0-a014-fd52c74a80eb'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '574f6469-0608-5ddb-9caa-efcdec8b6b47'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'ad117b10-0654-5369-b8fd-4804277eb0ac'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '26fcf900-9b92-5949-9d08-c936041c87d9'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '48669f4d-98d9-5f48-b4f5-ed432e08235c'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'fd08fe70-278f-5ef8-9bde-c4948a93cfe2'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '28ee8950-2d01-56b7-bcee-4c9f88f88cd1'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '4dea5e24-a2fd-5028-8f1e-e91e6bed58d3'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '9bde5319-2e7a-5b12-bf23-689a970c684f'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'f30cb70d-56c5-500b-a6e5-8d7fa636b1d2'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'ff7dcb16-5e4c-5caa-a55d-424c8c51e307'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '447567c6-fafa-56aa-a6bc-b6af60fd32b3'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'a44dac7c-23a5-5c22-8489-4342f05c00fb'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'db829f4c-9ede-5bbe-aa18-fe8fefe118b4'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '4edae311-01b1-5af3-85a6-0f5d1cfe14b0'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'b59c91eb-a630-51d3-91d5-668534aebe79'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'bf5ac969-c772-5be1-a5dd-3dcddb40f550'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '15de5a09-74c5-5d4b-9abb-b0a0e0204c87'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'fbed1d2f-1819-578d-a581-72bea616fae6'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'd3225260-4a5b-55e2-885c-346161edda0e'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'f7d004d3-d39e-5ca9-a665-06ae862db59a'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '7790ef49-8773-5e1d-bc94-07a05c95af2d'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'd31eda2f-1f86-5ed6-a538-bba5eac9f59b'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '5f02a7dc-f8b0-5a56-9999-6825cb82f865'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'b84b914e-422a-53f6-965c-43799f665231'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '320cbae5-7fcc-5de0-8371-8b7961cb91a3'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '3451a189-57c3-554c-b59c-ea8b76d61e20'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'e7958818-3bac-531e-b4bc-421622c01b18'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '052ce3ce-6aca-5cf7-8e2f-9db1aa4f9817'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '2daf5ee2-a59e-5190-b5cd-51916a0bec96'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '759b631a-294a-59b3-95df-1fbdea5134f6'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'f0e73c85-ff71-5821-9a74-0cf0753e1774'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '7e7eaca1-2008-525f-aa7a-f8bb91745ddb'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'd4a2855a-8dcd-54bd-b7ee-a88ee05453c5'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '160379d1-e16c-5507-a439-b60136ca8b49'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '8b6796c3-549c-5fe2-9f59-5f7ca24fb1b5'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'c5018fad-3a89-5520-8c9c-25bdfa6d0aef'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '5099def2-fccd-5b2f-9f45-549b0dfaef73'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'a8aef085-3e89-5b30-ad7d-af767a052c63'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '39394f73-9841-5872-8633-3f964e2ca826'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '4dc2c0e8-fa0c-5a4e-b16b-ba20dad31d1f'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'daf6adf1-e587-52a4-a467-e01b90d14624'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '72d810bc-a764-5557-89ec-febca6351962'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'c74c38dd-5533-5b98-8b42-928cb8cb015f'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'd9f0da82-fef3-5f85-9272-afd227498a29'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '2d874e74-7e66-53fc-8a4e-4a1863ff50d1'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '5cfb7923-5ab1-524a-848b-b738af90c35b'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '1614106b-425c-5462-909c-df0877b215a8'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '0ae910a9-d0a3-5781-bb95-c1c9d4751fd7'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'b9b3494c-74bc-5687-8f58-6a390eb184af'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '7d192ceb-eccc-5f3c-a8f2-02b4054117a3'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '24b7eed9-d71f-5fe1-9dfa-2b70283836b9'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'fba11cc8-3fcc-585c-9f70-6e597a69f551'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = '423fd42d-4c7c-5e05-b888-9346be74dd27'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-05'
   and q.id = 'a82a3d54-973f-55b2-bfbe-2719d3528703'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '6c731185-d5f2-525b-aaa0-e9623807574e'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '739023a8-d9c3-5fcd-964a-f1398e773b10'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '9cac11d1-e53c-5130-85b0-7e72b5b92162'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '3e67ed3f-dd7e-5173-bf16-c65307232ec3'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '253ad9c7-c687-5304-87b9-35459839911b'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '315a3f23-8889-588c-9c4a-bd858a808faa'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '662845f0-ed49-5c05-a5df-baa93799dce9'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '87195888-c0cb-5346-9c0e-0caaac914cd3'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '884a2ed3-422b-5ccf-98af-8073a7cd272e'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '18fbd1c0-132a-5ffa-bf13-9ddf8e607c63'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '591b4907-159d-5207-98ec-8029a4296d0d'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'dcc19fdb-0b46-5562-a9c1-4b1b7c521538'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '0eaad8e9-b4a7-5c5d-a6d9-77e7f0aa87d6'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'bad14812-f1d3-5016-80eb-5b6987beda23'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '979f0c7f-05fd-5fc4-a32a-2b9d1ae20110'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'eabdd7f7-5c37-5a0f-9e85-4f405f301b76'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '0120aba4-f4b9-59fa-a0e8-08b57aa757d8'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'b28d4861-8fc3-5dcc-b993-0104093441d5'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'a07fbfb2-e145-544b-9f11-472c50735096'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '3a2ebffc-55df-5bee-8847-fc78c6c319a8'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '14203fdc-f623-53ba-8cb9-c9154b9503ee'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'cf977475-ab69-587a-b3dc-c38be2d723d2'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '7cf117e5-4bee-5aa2-b944-7eb1371da211'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '2562fd1d-5205-519c-aac2-63822efa85d4'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '04edd2d6-30be-55c4-95b1-63d1fddb9b43'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '43d347b6-2321-5d37-b13c-44c6f74667cc'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '619c2fb5-3318-582b-ae6e-1c6470ab831d'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '0cb7e589-50f3-59ce-9afe-fb101190f147'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'f4714ec5-2bc6-5fcf-8d2a-dabe7e0d0489'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'bbfd2a95-4001-5b74-a2ba-1a3d08611ce8'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'bdf71bec-6574-5b31-9f20-fd413346484a'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'cda9944c-c410-5379-8834-55f97682a7d8'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '479c809a-a4cc-5689-b2e0-4c8627c39b8b'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '08176775-daee-5446-807b-41ba0958e1f0'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '1960762b-e9c9-5470-9d1f-2cb8884bb013'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'cf9ce1ee-d6e4-5fde-8856-26934b32e61a'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '9e99f6f7-fa9a-52b0-ba59-775fe0a64b6b'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'c44438d1-1d41-5820-bce7-56e02104b370'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'd4636aa1-dcf9-592a-996f-df10d5d2fdf2'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '7ed881dd-0305-501f-a1b0-afbbe67b1818'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '81636e54-620c-5206-859c-c128fe834d58'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '4087d4a7-9a12-5ea3-837c-12e727e68390'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '7c16457e-e9d1-51f8-b270-d39ed861acaa'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '63465b5c-e012-5c31-9ecf-d1675509cd15'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'b47b184d-a1b8-57a4-b2a1-76d0c72456a1'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'b6b8c762-6860-565b-ba55-aaa1e4a0f4fb'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'de23129d-5031-53eb-b21c-794b3123ef6c'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'ed7b11a8-5629-5ac8-8089-6691aba86e83'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '8ab38998-209d-5443-8ae6-782c4124f589'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '0e6c7ca1-a000-5916-bd90-f6be5fe920f4'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'a22f7301-1232-5dcb-b678-f40de43004e2'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'd3bef342-9e3e-594c-bc3b-cc61c817696b'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '5638d3c1-8fe9-547f-beb9-f8be7cd1bfa3'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '36789265-34b5-5214-b45e-9f9e4de1cea1'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '00b9c574-1878-5e41-be95-7d8fd1d4f66e'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'f1400ee5-4385-5d34-92f6-42ac6dbf5292'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'cd65300a-dde6-5d73-9e57-19eebd90cc14'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'fb94fff6-ed5f-542e-a4c9-0b4609bcce28'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '175bf11a-917b-5282-8458-0d1d6046694e'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'c208d7d8-1d1e-5bc2-8a4c-eac9a6e2f65a'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '7bcb4faf-4a56-543c-b4f2-fe1040b17868'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '4f4f0066-617a-5070-add2-91e67c478632'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'ea382a64-3e2e-5155-bc8e-6afc68f90b79'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '34633a45-36de-51ed-a89e-de8eafb177c1'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '3bd0e1b7-cc41-5e81-9697-3021dd3e4a68'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '1874fd8a-8a90-585f-9843-36c1fffabd81'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '3196973f-5a1f-53f3-8e98-11f57aa6ca20'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'b5b42306-0b6b-554f-84ab-ddfee4c57a2a'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'c3b7261a-f28c-5ca0-b196-fd59fc8bde62'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'ccc072fb-2821-50a3-9897-baad4e5cf8b1'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '027890c2-672b-5d61-98ea-063217071d5b'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'a42b246a-1d6d-57f0-b336-6f042f66911b'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'a3d848fa-b535-5650-ba40-d6ae0a40877e'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '2c978642-7010-5e39-a49b-9472635dffcf'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'b36da9f3-83f6-5672-91d6-ea86eac92262'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '93ca5c39-69e2-5aff-8f29-197451e05f07'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '9549f7bf-1ab9-5053-9133-6cbdb8daa518'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '359a7d68-a15f-57f0-8f71-1ba7abb70590'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '9861745c-7455-56ba-bf8c-94270750a897'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '62980a6d-92ba-5503-b1a0-ee2b781f81ef'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '45f5b954-24e9-54c1-86c3-f61ca145a1e8'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '0ab0fe9a-fbbf-5094-b563-7d0e609de155'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '5f5f06e6-8381-58bb-855f-17a8439c2063'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '05dd64d3-72e9-5c5a-b873-381827c5e4d8'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '5b34608f-1bc9-5278-bbea-7bb2c600399c'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '0c6a4655-9719-543a-99d2-3b39ebed4d0f'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '809f22d2-ffde-5712-bdcf-e98519a16f35'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '0400b7dd-120d-5f91-84f8-34c802c40b8f'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '05525246-b05b-591f-964b-dfcfc0d7cc2b'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '1a292f6c-484d-5463-832e-bf54cb64e9dc'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '442ec4b1-4daa-55ac-8757-26c76a4de57b'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'c0937ecf-c007-5982-b79e-b1d61accd3df'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'a46f2ea6-fa94-5b1e-9ebb-63edefb21291'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '7ae7b975-84c2-56c7-a65b-63ceececc955'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'f01abfb2-cdac-59a2-96c4-cfedbcc1a72a'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '5578cd95-65e6-5373-a737-953decd243a2'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '63d98048-3b82-59f9-9d3f-396d32dd02fd'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'e6db2608-b89c-5a0f-9466-f9f2da8e075c'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '5f15c4f7-efb1-53be-8058-4bf3c774d339'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '6e276355-1760-519c-8bbc-700fd853e3f5'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'e7f0f485-4eda-5e11-a7ae-7d9cad1d8a5d'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '040c87c1-79fb-5364-b3ae-1a1a05fbcf7f'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '90e4af91-a7a4-51c6-9493-3d48f773ef10'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'f34486a6-52e3-5ef0-a6a6-3909cd37f128'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '90e9e9fc-ab4c-5032-b328-b39b97efd382'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '0009e8fd-8746-5553-8284-1258c61d4cfe'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '3bf9dfe2-e888-5f6b-bacd-895d2a827f8b'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = 'd40258b3-70ee-5bbc-8264-c44054cd5f50'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '3387d6a4-010c-5024-8b98-08bb030a11fd'
   and q.source_lesson_id is distinct from l.id;
update public.questions q
   set source_lesson_id = l.id
  from public.lessons l
  join public.modules m on m.id = l.module_id
 where m.code = 'M01'
   and l.slug = 'm01-06'
   and q.id = '242d3a5f-31ff-55dc-90e5-7908da0079fb'
   and q.source_lesson_id is distinct from l.id;

commit;

-- Conservative near-duplicate review links generated from normalized word-bigram Jaccard.
-- Threshold >= 0.82. These links are editorial hints only; they do not reject or publish content.
begin;

with pairs(candidate_id,representative_id,similarity) as (
  values
('b1350563-1aa1-4538-8fa2-c1fbaa751942'::uuid,'de420172-71f0-498b-89aa-ffb764613ae4'::uuid,1.000000::numeric),
('44263e61-6810-4161-b1d2-378fb5289ef3'::uuid,'f36eabe0-5db2-476e-968e-e5d73c05965d'::uuid,1.000000::numeric),
('cc0598a9-be62-47d6-bd0b-c43304ff4579'::uuid,'d541ceb6-a3fb-421b-a938-9eaf5ff3de3d'::uuid,1.000000::numeric),
('3bbaa218-a284-48fe-b08e-b6b42a7202fd'::uuid,'9c6477e7-eddc-4d6f-ba48-bc22492222b9'::uuid,1.000000::numeric),
('21c54e42-5c40-4a06-baba-0084eb6ac869'::uuid,'4d5cb262-2467-491d-83fd-3d6a76e2ede6'::uuid,1.000000::numeric),
('a7521479-6786-44db-b91e-de722bbc7b98'::uuid,'402b3d81-b0d3-4e01-9174-89004733b032'::uuid,1.000000::numeric),
('d788c13c-b7c8-4524-ad7e-da9e347ab0d4'::uuid,'1fae6ab4-d181-4e7d-a887-f5ce4c8d53a5'::uuid,1.000000::numeric),
('47ec336d-e90b-4016-b304-8d138fc80db2'::uuid,'7bc1e796-2858-49fd-bcca-3b93c3def08b'::uuid,1.000000::numeric),
('f636e1fd-7eac-431e-9d1d-46d81098b6ab'::uuid,'db2395c0-3265-4f1c-8eb9-0c2b7d0e2fb6'::uuid,0.969697::numeric),
('3aef05c5-e73d-48c0-8503-c9e3d7f96456'::uuid,'80b292b2-a2d2-4f4d-935a-42be5cce4856'::uuid,0.956522::numeric),
('f6769be0-3476-43bc-9122-255203a66dcb'::uuid,'104253a8-723f-40fd-b393-1b33dd73f1ae'::uuid,0.894737::numeric),
('8975910a-6344-47d0-b4a9-8d6f83956d68'::uuid,'13595aa6-1fe0-461e-be40-6ffa9ec9ff98'::uuid,0.892857::numeric),
('a1b257f5-0400-460d-9f70-aea438bf7e5f'::uuid,'620d9078-5a51-40c5-a02f-6c9f124dd98f'::uuid,0.888889::numeric),
('6e410b4d-be34-4b04-a56d-104499567461'::uuid,'4b550cc4-983f-4c16-a021-9adaab8d4a95'::uuid,0.878049::numeric),
('4d363466-53b0-492e-8e3c-14cb4dc89c38'::uuid,'00416fb4-b333-4cec-8660-3a61b864a406'::uuid,0.875000::numeric),
('a0b15459-8a43-4bbf-ba33-65bfc3d7edbc'::uuid,'83793352-81da-4d21-b17c-0d9af0651d81'::uuid,0.866667::numeric),
('e802b2f3-b5b0-4eca-9e2f-44c200d1edb1'::uuid,'4c6d241b-b6e1-4e85-81e6-55bfc4573930'::uuid,0.865854::numeric),
('3a8b58cb-a467-49a3-8fc8-c9643c6861fb'::uuid,'8c6e787f-042e-4829-a8b7-e9f28e0e1e2d'::uuid,0.851852::numeric),
('8e9a3341-d698-4c0b-98b5-7c53829cd2f1'::uuid,'805e9ca2-0bd2-4862-aa0c-17de19b2411d'::uuid,0.848485::numeric),
('1fd77ec0-35d1-407d-b3f4-85b545538ff3'::uuid,'05de5e6f-08a5-4362-9cef-2f6472b67503'::uuid,0.833333::numeric),
('2b2765e8-ff0b-4af7-ab83-9cecfd7c90bb'::uuid,'00416fb4-b333-4cec-8660-3a61b864a406'::uuid,0.828571::numeric),
('f4748334-3964-4e02-aabb-edb6828713e3'::uuid,'3f2e7224-adb2-4c6e-8f57-04555cbf4cad'::uuid,0.825000::numeric)
)
update public.pedagogy_pdf_source_candidates c
   set near_duplicate_of_candidate_id=p.representative_id,
       source_quality_flags=(
         select array_agg(distinct x order by x)
         from unnest(c.source_quality_flags || array['near_duplicate_review']) x
       ),
       review_notes=case
         when c.review_notes='' then format('Near-duplicate review candidate; normalized bigram similarity %.3f.',p.similarity)
         when c.review_notes not like '%Near-duplicate review candidate%'
           then c.review_notes || E'\n' || format('Near-duplicate review candidate; normalized bigram similarity %.3f.',p.similarity)
         else c.review_notes
       end
  from pairs p
 where c.id=p.candidate_id
   and c.duplicate_of_candidate_id is null
   and c.near_duplicate_of_candidate_id is null;

commit;

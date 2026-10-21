-- Private pedigree/QA queue; read-only and safe to run repeatedly.
select source_file_name,
       count(*) total,
       count(*) filter(where editorial_status='needs_review') pending,
       count(*) filter(where editorial_status='rejected') rejected,
       count(*) filter(where duplicate_of_candidate_id is not null) linked_duplicates,
       count(*) filter(where answer_key_status='independently_verified') verified_source_keys
from public.pedagogy_pdf_source_candidates
group by source_file_name
order by pending desc,source_file_name;

-- Compare the ENTIRE source stem; a shared opening sentence alone is insufficient.
select c.source_file_name,c.source_question_no,
       representative.source_file_name representative_file,
       representative.source_question_no representative_number,
       c.editorial_status,
       c.text_sha256=representative.text_sha256 as stored_hash_equal,
       md5(regexp_replace(lower(c.raw_question_private),'\s+','','g')) =
       md5(regexp_replace(lower(representative.raw_question_private),'\s+','','g'))
       as whitespace_insensitive_whole_stem_equal
from public.pedagogy_pdf_source_candidates c
join public.pedagogy_pdf_source_candidates representative
  on representative.id=c.duplicate_of_candidate_id
where c.source_file_name in ('Test Mirzayeva.pdf','Test Mirzayeva 2.pdf',
                            '2026 tushgan test 1.pdf')
order by c.source_file_name,c.source_question_no;

-- Original PDF page locations were visually identified for autumn (1) Q41-Q49.
-- This is only a metadata source check, not a request to guess scoring keys.
select source_file_name,source_question_no,page_no,
       editorial_status,answer_key_status
from public.pedagogy_pdf_source_candidates
where source_file_name='Pedmahorat to''plam 2025 kuzgi (1).pdf'
order by source_question_no;
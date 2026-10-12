-- Private 673 candidate review and 7 source-textbook comparisons.
-- STAGING ONLY. No candidate is marked approved, and no public exam tables change.
begin;
create table if not exists public.pedguli_candidate_stage4_reviews (
 candidate_id uuid primary key references public.pedguli_source_candidates(id) on delete cascade,
 proposed_construct text,
 alternate_construct text,
 model_margin numeric(10,6),
 review_bucket text not null check (review_bucket in ('model_high_margin','model_low_margin','media_blocked')),
 review_basis text not null default 'sklearn_char_svm_offline_2026_10_12',
 review_warning text not null default '',
 expert_approved boolean not null default false check(expert_approved=false),
 rights_cleared boolean not null default false check(rights_cleared=false),
 answer_verified boolean not null default false check(answer_verified=false),
 updated_at timestamptz not null default now(),
 constraint model_review_has_proposal check (
   (review_bucket='media_blocked' and proposed_construct is null)
   or (review_bucket<>'media_blocked' and proposed_construct ~ '^(KS|PM[.]GEN|PM[.]MET)[.][0-9][0-9]$')
 )
);
alter table public.pedguli_candidate_stage4_reviews enable row level security;
revoke all on public.pedguli_candidate_stage4_reviews from public,anon,authenticated;
grant select,insert,update,delete on public.pedguli_candidate_stage4_reviews to service_role;

create table if not exists public.pedguli_answer_source_comparisons (
 candidate_id uuid primary key references public.pedguli_source_candidates(id) on delete cascade,
 proposed_option text not null check(proposed_option in ('A','B','C','D')),
 compared_concept text not null,
 proposed_construct text not null check(proposed_construct ~ '^(KS|PM[.]GEN|PM[.]MET)[.][0-9][0-9]$'),
 source_title text not null,
 source_url text not null,
 evidence_summary text not null check(length(evidence_summary) between 35 and 2000),
 review_state text not null default 'source_correspondence_pending_editor'
   check(review_state='source_correspondence_pending_editor'),
 expert_approved boolean not null default false check(expert_approved=false),
 rights_cleared boolean not null default false check(rights_cleared=false),
 transferable_answer_key boolean not null default false check(transferable_answer_key=false),
 created_at timestamptz not null default now()
);
alter table public.pedguli_answer_source_comparisons enable row level security;
revoke all on public.pedguli_answer_source_comparisons from public,anon,authenticated;
grant select,insert,update,delete on public.pedguli_answer_source_comparisons to service_role;
commit;

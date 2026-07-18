-- Run this in Supabase SQL Editor (project: oifyuzuixchjuqzorvns)
-- Adds comparison_results table for the Resume Selector feature.

create table if not exists comparison_results (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete cascade,
  job_description text not null,
  resumes jsonb not null,
  results jsonb not null,
  winner_index int not null
);

-- Enable RLS
alter table comparison_results enable row level security;

-- Users can only see their own comparisons
create policy "Users can view own comparisons"
  on comparison_results for select
  using (auth.uid() = user_id);

-- Users can insert their own comparisons
create policy "Users can insert own comparisons"
  on comparison_results for insert
  with check (auth.uid() = user_id);

-- Users can delete their own comparisons
create policy "Users can delete own comparisons"
  on comparison_results for delete
  using (auth.uid() = user_id);

-- Index for fast lookups
create index if not exists idx_comparison_results_user_id
  on comparison_results(user_id);

create index if not exists idx_comparison_results_created_at
  on comparison_results(created_at desc);

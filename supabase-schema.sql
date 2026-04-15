-- ============================================================
-- COSMOS Database Schema — run this in your Supabase SQL Editor
-- Project → SQL Editor → New Query → paste & run
-- ============================================================

-- Family profiles
create table profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  relationship text not null default 'self',
  dob date not null,
  birth_time time,
  birth_place text,
  birth_time_known boolean default false,
  signature jsonb,
  life_path integer,
  expression integer,
  soul_urge integer,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Activity logs (every Oracle interaction)
create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  profile_name text,
  question text not null,
  response text,
  created_at timestamptz default now()
);

-- Index for fast log queries
create index idx_logs_created_at on activity_logs(created_at desc);
create index idx_profiles_relationship on profiles(relationship);

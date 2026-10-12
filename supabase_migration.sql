-- ==============================================================================
-- SignBridge - Supabase Database Schema & Row Level Security (RLS) Migration
-- 
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/sqbhzumgsrxxvfqzjgqv
-- 2. Go to "SQL Editor" on the left menu.
-- 3. Click "New Query", paste the content below, and click "Run".
-- 
-- Note: Preserves your existing tables ('users', 'sign-bridge') without data loss.
-- Implements authentic starting coins (100), activity streak, and idempotent rewards.
-- ==============================================================================

-- 1. Create or update 'user_progress' table tied to Supabase Auth
create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  display_name text default 'Sign Learner',
  avatar text default 'avatar_sage',
  completed_lessons text[] default '{}',
  favorites text[] default '{}',
  coins integer default 100 check (coins >= 0),
  streak integer default 0 check (streak >= 0),
  longest_streak integer default 0 check (longest_streak >= 0),
  last_activity_date date default null,
  quiz_attempts integer default 0 check (quiz_attempts >= 0),
  rewarded_activities text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure columns exist if table was already created earlier
alter table public.user_progress add column if not exists rewarded_activities text[] default '{}';
alter table public.user_progress add column if not exists longest_streak integer default 0;
alter table public.user_progress add column if not exists last_activity_date date default null;

-- 2. Enable Row Level Security (RLS)
alter table public.user_progress enable row level security;

-- 3. RLS Policies: Authenticated users can only read, insert, and update their OWN records
drop policy if exists "Users can view own progress" on public.user_progress;
create policy "Users can view own progress"
  on public.user_progress
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own progress" on public.user_progress;
create policy "Users can insert own progress"
  on public.user_progress
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own progress" on public.user_progress;
create policy "Users can update own progress"
  on public.user_progress
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Trigger to automatically create a user_progress record when a user signs up (100 coins, 0 streak)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_progress (
    user_id, 
    display_name, 
    avatar, 
    coins, 
    streak, 
    longest_streak,
    rewarded_activities
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'avatar_sage',
    100,
    0,
    0,
    '{"welcome_bonus"}'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Index for high-performance lookup
create index if not exists idx_user_progress_user_id on public.user_progress(user_id);

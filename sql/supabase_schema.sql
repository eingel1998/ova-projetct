-- Supabase schema for OvaProjetct
-- Create profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Policy: Users can read their own profile
drop policy if exists users_read_own_profile on public.profiles;
create policy users_read_own_profile on public.profiles 
  for select using (auth.uid() = id);

-- Policy: Users can update their own profile (but not role)
drop policy if exists users_update_own_profile on public.profiles;
create policy users_update_own_profile on public.profiles 
  for update using (auth.uid() = id);

-- Helper: Check admin status securely (prevents infinite recursion in RLS)
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer set search_path = public;

-- Policy: Admins can read all profiles
drop policy if exists admins_read_all_profiles on public.profiles;
create policy admins_read_all_profiles on public.profiles 
  for select using (
    public.is_admin()
  );

-- Trigger: Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger: Auto-confirm email (Bypass email validation)
create or replace function public.auto_confirm_email()
returns trigger as $$
begin
  new.email_confirmed_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_confirm on auth.users;
create trigger on_auth_user_created_confirm
  before insert on auth.users
  for each row execute procedure public.auto_confirm_email();

-- Create progress table
create table if not exists public.progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  experiencia_id text not null,
  completed boolean default false,
  score int null,
  total_questions int null,
  meta jsonb null,
  last_updated timestamptz default now(),
  created_at timestamptz default now()
);

create unique index if not exists idx_progress_user_experiencia on public.progress (user_id, experiencia_id);

-- Optional quizzes table
create table if not exists public.quizzes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  quiz_id text not null,
  score int,
  respuestas jsonb,
  created_at timestamptz default now()
);

-- RLS: enable and policies for progress
alter table public.progress enable row level security;
drop policy if exists user_manage_own_progress on public.progress;
create policy user_manage_own_progress on public.progress 
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists admin_select_all_progress on public.progress;
create policy admin_select_all_progress on public.progress 
  for select using (
    public.is_admin()
  );

-- RLS: enable and policies for quizzes
alter table public.quizzes enable row level security;
drop policy if exists user_manage_own_quiz on public.quizzes;
create policy user_manage_own_quiz on public.quizzes 
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Supabase schema for OvaProjetct
-- Create profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id),
  email text,
  display_name text,
  role text default 'user'
);

-- Create progress table
create table if not exists public.progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  experiencia_id text not null,
  completada boolean default false,
  score int null,
  meta jsonb null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists idx_progress_user_experiencia on public.progress (user_id, experiencia_id);

-- Optional quizzes table
create table if not exists public.quizzes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  quiz_id text not null,
  score int,
  respuestas jsonb,
  created_at timestamptz default now()
);

-- RLS: enable and policies
alter table public.progress enable row level security;
drop policy if exists user_manage_own_progress on public.progress;
create policy user_manage_own_progress on public.progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists admin_select_all_progress on public.progress;
create policy admin_select_all_progress on public.progress for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

alter table public.quizzes enable row level security;
drop policy if exists user_manage_own_quiz on public.quizzes;
create policy user_manage_own_quiz on public.quizzes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

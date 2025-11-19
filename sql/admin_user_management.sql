-- Migration: Admin User Management Policies
-- This allows admins to update and delete user profiles

-- Policy: Admins can update all profiles
drop policy if exists admins_update_all_profiles on public.profiles;
create policy admins_update_all_profiles on public.profiles 
  for update using (
    public.is_admin()
  );

-- Policy: Admins can delete profiles (Note: this will cascade to auth.users if configured)
drop policy if exists admins_delete_profiles on public.profiles;
create policy admins_delete_profiles on public.profiles 
  for delete using (
    public.is_admin()
  );

-- Policy: Admins can insert profiles (for user creation)
drop policy if exists admins_insert_profiles on public.profiles;
create policy admins_insert_profiles on public.profiles 
  for insert with check (
    public.is_admin()
  );

-- Add updated_at trigger to automatically update timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

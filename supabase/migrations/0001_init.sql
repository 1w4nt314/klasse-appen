-- Klasse-appen: lærerprofiler og favorit-apps.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  school text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Lærere kan læse egen profil"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Lærere kan opdatere egen profil"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Profilen oprettes automatisk ud fra metadata sendt med ved signUp.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, school)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'school', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  app_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, app_slug)
);

alter table public.favorites enable row level security;

create policy "Lærere kan læse egne favoritter"
  on public.favorites for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Lærere kan tilføje egne favoritter"
  on public.favorites for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Lærere kan fjerne egne favoritter"
  on public.favorites for delete
  to authenticated
  using ((select auth.uid()) = user_id);

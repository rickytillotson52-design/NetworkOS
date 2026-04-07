create extension if not exists pgcrypto;

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text not null default '',
  email text,
  phone text,
  title text,
  organization_name text,
  source text,
  relationship_status text not null default 'New',
  general_notes text,
  next_follow_up_date date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint contacts_relationship_status_check check (
    relationship_status in ('New', 'Met Once', 'Warm', 'Active', 'Strategic', 'Dormant')
  )
);

create table if not exists public.interactions (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  interaction_type text not null,
  interaction_date date not null default current_date,
  summary text not null,
  next_step text,
  created_at timestamptz not null default timezone('utc', now()),
  constraint interactions_interaction_type_check check (
    interaction_type in (
      'Intro',
      'Email',
      'Call',
      'Meeting',
      'Event',
      'Follow-Up',
      'Partnership Discussion'
    )
  )
);

create index if not exists contacts_user_updated_idx
  on public.contacts (user_id, updated_at desc);

create index if not exists contacts_user_status_idx
  on public.contacts (user_id, relationship_status);

create index if not exists contacts_user_org_idx
  on public.contacts (user_id, organization_name);

create index if not exists interactions_contact_date_idx
  on public.interactions (contact_id, interaction_date desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists contacts_set_updated_at on public.contacts;

create trigger contacts_set_updated_at
before update on public.contacts
for each row
execute function public.set_updated_at();

alter table public.contacts enable row level security;
alter table public.interactions enable row level security;

drop policy if exists "Users manage their own contacts" on public.contacts;
create policy "Users manage their own contacts"
on public.contacts
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users manage their own interactions" on public.interactions;
create policy "Users manage their own interactions"
on public.interactions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

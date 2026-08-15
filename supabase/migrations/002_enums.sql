-- Apply if you already ran an older 001_init.sql with text/check constraints.
-- Safe to run once in the Supabase SQL Editor.

-- Enums
do $$ begin
  create type public.verification_status as enum (
    'pending',
    'approved',
    'rejected'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.pet_category as enum (
    'all',
    'dogs',
    'cats',
    'rabbits',
    'birds',
    'fish',
    'others'
  );
exception when duplicate_object then null;
end $$;

-- Normalize existing verification_status values
update public.users
set verification_status = 'pending'
where verification_status::text = 'none';

-- Drop old check constraint if present
alter table public.users
  drop constraint if exists users_verification_status_check;

alter table public.users
  alter column verification_status drop default;

alter table public.users
  alter column verification_status type public.verification_status
  using verification_status::text::public.verification_status;

alter table public.users
  alter column verification_status set default 'pending'::public.verification_status;

-- Normalize existing category values (singular → plural)
update public.pets
set category = case category::text
  when 'dog' then 'dogs'
  when 'cat' then 'cats'
  when 'rabbit' then 'rabbits'
  when 'bird' then 'birds'
  when 'fish' then 'fish'
  when 'other' then 'others'
  when 'others' then 'others'
  when 'all' then 'all'
  when 'dogs' then 'dogs'
  when 'cats' then 'cats'
  when 'rabbits' then 'rabbits'
  when 'birds' then 'birds'
  else 'others'
end;

alter table public.pets
  alter column category type public.pet_category
  using category::text::public.pet_category;

create index if not exists pets_category_idx on public.pets (category);

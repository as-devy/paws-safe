-- Switch users.id from bigint identity → random base64 text.
-- Also updates pets.owner_id and pet_requests.requester_id.
-- Run in Supabase SQL Editor if tables already exist.

create extension if not exists "pgcrypto";

create or replace function public.generate_base64_id(byte_len integer default 16)
returns text
language sql
volatile
as $$
  select rtrim(encode(gen_random_bytes(byte_len), 'base64'), '=');
$$;

-- View depends on pets.*; drop before column renames
drop view if exists public.pets_with_request_counts;

-- Drop FKs that point at users.id
alter table public.pet_requests
  drop constraint if exists pet_requests_requester_id_fkey;

alter table public.pets
  drop constraint if exists pets_owner_id_fkey;

-- New text ids for existing users
alter table public.users
  add column if not exists id_text text;

update public.users
set id_text = public.generate_base64_id()
where id_text is null;

alter table public.users
  alter column id_text set not null;

-- Remap FKs
alter table public.pets
  add column if not exists owner_id_text text;

update public.pets p
set owner_id_text = u.id_text
from public.users u
where u.id::text = p.owner_id::text
  or u.id = p.owner_id;

alter table public.pet_requests
  add column if not exists requester_id_text text;

update public.pet_requests pr
set requester_id_text = u.id_text
from public.users u
where u.id::text = pr.requester_id::text
  or u.id = pr.requester_id;

-- Replace pets.owner_id
alter table public.pets drop column owner_id;
alter table public.pets rename column owner_id_text to owner_id;
alter table public.pets alter column owner_id set not null;

-- Replace pet_requests.requester_id
alter table public.pet_requests drop column requester_id;
alter table public.pet_requests rename column requester_id_text to requester_id;
alter table public.pet_requests alter column requester_id set not null;

-- Replace users.id (drop identity PK, swap in text)
alter table public.users drop constraint if exists users_pkey;

alter table public.users
  alter column id drop identity if exists;

alter table public.users drop column id;
alter table public.users rename column id_text to id;

alter table public.users
  add primary key (id);

alter table public.users
  alter column id set default public.generate_base64_id();

-- Restore FKs
alter table public.pets
  add constraint pets_owner_id_fkey
  foreign key (owner_id) references public.users (id) on delete cascade;

alter table public.pet_requests
  add constraint pet_requests_requester_id_fkey
  foreign key (requester_id) references public.users (id) on delete cascade;

create index if not exists pets_owner_id_idx on public.pets (owner_id);
create index if not exists pet_requests_requester_id_idx on public.pet_requests (requester_id);

-- Recreate view
create or replace view public.pets_with_request_counts as
select
  p.*,
  coalesce(count(pr.id) filter (where pr.status = 'pending'), 0)::int as pending_requests,
  coalesce(count(pr.id), 0)::int as total_requests
from public.pets p
left join public.pet_requests pr on pr.pet_id = p.id
group by p.id;

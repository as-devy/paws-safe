-- Paws Safe — initial schema for Supabase
-- Run this in the Supabase SQL Editor before seeding.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
<<<<<<< HEAD
-- enums
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- helpers
-- ---------------------------------------------------------------------------
-- 16 random bytes → base64 text (~22 chars, padding stripped)
create or replace function public.generate_base64_id(byte_len integer default 16)
returns text
language sql
volatile
as $$
  select rtrim(encode(gen_random_bytes(byte_len), 'base64'), '=');
$$;

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id text primary key default public.generate_base64_id(),
=======
-- users
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id bigint generated always as identity primary key,
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
  username text not null,
  email text not null unique,
  phone text,
  country text,
  city text,
  password text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
<<<<<<< HEAD
  verification_status public.verification_status not null default 'pending',
=======
  verification_status text not null default 'none'
    check (verification_status in ('none', 'pending', 'approved', 'rejected')),
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- pets
-- ---------------------------------------------------------------------------
create table if not exists public.pets (
<<<<<<< HEAD
  id text primary key default public.generate_base64_id(),
  owner_id text not null references public.users (id) on delete cascade,
  category public.pet_category not null,
=======
  id bigint generated always as identity primary key,
  owner_id bigint not null references public.users (id) on delete cascade,
  category text not null,
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
  img text,
  name text not null,
  age numeric(4, 1),
  gender text check (gender in ('male', 'female')),
  description text,
  country text,
  street_address text,
  city text,
  post_code text,
  vaccines_prevention text,
  health_history text,
  diet text,
  behavior text,
  rehoming boolean not null default false,
  foster boolean not null default false,
  emergency boolean not null default false,
  requested boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists pets_owner_id_idx on public.pets (owner_id);
create index if not exists pets_rehoming_idx on public.pets (rehoming);
create index if not exists pets_foster_idx on public.pets (foster);
<<<<<<< HEAD
create index if not exists pets_category_idx on public.pets (category);
=======
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799

-- ---------------------------------------------------------------------------
-- pet_requests  (replaces JSON arrays: pets.requests + users.requestedPets)
-- ---------------------------------------------------------------------------
create table if not exists public.pet_requests (
  id bigint generated always as identity primary key,
<<<<<<< HEAD
  pet_id text not null references public.pets (id) on delete cascade,
  requester_id text not null references public.users (id) on delete cascade,
=======
  pet_id bigint not null references public.pets (id) on delete cascade,
  requester_id bigint not null references public.users (id) on delete cascade,
>>>>>>> 9fbe6272ae14926655cd6155816221b0eb2ae799
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'withdrawn')),
  foster_duration text,
  full_name text,
  email text,
  phone text,
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (pet_id, requester_id)
);

create index if not exists pet_requests_pet_id_idx on public.pet_requests (pet_id);
create index if not exists pet_requests_requester_id_idx on public.pet_requests (requester_id);
create index if not exists pet_requests_status_idx on public.pet_requests (status);

-- Helpful views for listing counts
create or replace view public.pets_with_request_counts as
select
  p.*,
  coalesce(count(pr.id) filter (where pr.status = 'pending'), 0)::int as pending_requests,
  coalesce(count(pr.id), 0)::int as total_requests
from public.pets p
left join public.pet_requests pr on pr.pet_id = p.id
group by p.id;

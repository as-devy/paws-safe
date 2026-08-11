-- Paws Safe — initial schema for Supabase
-- Run this in the Supabase SQL Editor before seeding.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id bigint generated always as identity primary key,
  username text not null,
  email text not null unique,
  phone text,
  country text,
  city text,
  password text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  verification_status text not null default 'none'
    check (verification_status in ('none', 'pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- pets
-- ---------------------------------------------------------------------------
create table if not exists public.pets (
  id bigint generated always as identity primary key,
  owner_id bigint not null references public.users (id) on delete cascade,
  category text not null,
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

-- ---------------------------------------------------------------------------
-- pet_requests  (replaces JSON arrays: pets.requests + users.requestedPets)
-- ---------------------------------------------------------------------------
create table if not exists public.pet_requests (
  id bigint generated always as identity primary key,
  pet_id bigint not null references public.pets (id) on delete cascade,
  requester_id bigint not null references public.users (id) on delete cascade,
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

-- Switch pets.id from bigint identity → random base64 text.
-- Also updates pet_requests.pet_id.
-- Run in Supabase SQL Editor if tables already exist.

create extension if not exists "pgcrypto";

create or replace function public.generate_base64_id(byte_len integer default 16)
returns text
language sql
volatile
as $$
  select rtrim(encode(gen_random_bytes(byte_len), 'base64'), '=');
$$;

drop view if exists public.pets_with_request_counts;

alter table public.pet_requests
  drop constraint if exists pet_requests_pet_id_fkey;

-- New text ids for existing pets
alter table public.pets
  add column if not exists id_text text;

update public.pets
set id_text = public.generate_base64_id()
where id_text is null;

alter table public.pets
  alter column id_text set not null;

-- Remap pet_requests.pet_id
alter table public.pet_requests
  add column if not exists pet_id_text text;

update public.pet_requests pr
set pet_id_text = p.id_text
from public.pets p
where p.id::text = pr.pet_id::text
   or p.id = pr.pet_id;

alter table public.pet_requests drop column pet_id;
alter table public.pet_requests rename column pet_id_text to pet_id;
alter table public.pet_requests alter column pet_id set not null;

-- Replace pets.id
alter table public.pets drop constraint if exists pets_pkey;

alter table public.pets
  alter column id drop identity if exists;

alter table public.pets drop column id;
alter table public.pets rename column id_text to id;

alter table public.pets
  add primary key (id);

alter table public.pets
  alter column id set default public.generate_base64_id();

-- Restore FK
alter table public.pet_requests
  add constraint pet_requests_pet_id_fkey
  foreign key (pet_id) references public.pets (id) on delete cascade;

create index if not exists pet_requests_pet_id_idx on public.pet_requests (pet_id);

create or replace view public.pets_with_request_counts as
select
  p.*,
  coalesce(count(pr.id) filter (where pr.status = 'pending'), 0)::int as pending_requests,
  coalesce(count(pr.id), 0)::int as total_requests
from public.pets p
left join public.pet_requests pr on pr.pet_id = p.id
group by p.id;

-- Replace pets.rehoming / pets.foster booleans with a single status enum.

do $$ begin
  create type public.pet_status as enum ('adoption', 'foster');
exception
  when duplicate_object then null;
end $$;

alter table public.pets
  add column if not exists status public.pet_status;

-- Prefer adoption when both flags were true.
update public.pets
set status = case
  when rehoming = true then 'adoption'::public.pet_status
  when foster = true then 'foster'::public.pet_status
  else 'adoption'::public.pet_status
end
where status is null;

alter table public.pets
  alter column status set default 'adoption'::public.pet_status,
  alter column status set not null;

drop index if exists pets_rehoming_idx;
drop index if exists pets_foster_idx;

alter table public.pets
  drop column if exists rehoming,
  drop column if exists foster;

create index if not exists pets_status_idx on public.pets (status);

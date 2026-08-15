-- Email confirmation for signup. Separate from verification_status
-- (that flag is the poster identity badge).

alter table public.users
  add column if not exists email_verified boolean not null default false;

-- Existing accounts stay able to request pets.
update public.users
set email_verified = true
where email_verified = false;

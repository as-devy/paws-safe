-- Ensure email uniqueness so account linking works.
-- Safe if the constraint already exists from 001_init.
create unique index if not exists users_email_key on public.users (email);

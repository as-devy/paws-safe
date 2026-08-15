-- In-app notifications for pet requests and status updates.
-- LISTEN/NOTIFY powers the realtime header inbox.

create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  user_id text not null references public.users (id) on delete cascade,
  type text not null
    check (type in ('request', 'approval', 'denied', 'verification')),
  title text not null,
  body text not null,
  href text not null,
  pet_id text references public.pets (id) on delete cascade,
  request_id bigint references public.pet_requests (id) on delete cascade,
  actor_id text references public.users (id) on delete set null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_created_idx
  on public.notifications (user_id, created_at desc);

create index if not exists notifications_user_unread_idx
  on public.notifications (user_id)
  where read_at is null;

create or replace function public.notify_user_notification()
returns trigger
language plpgsql
as $$
declare
  uid text;
begin
  uid := coalesce(NEW.user_id, OLD.user_id);
  perform pg_notify(
    'user_notifications',
    json_build_object('user_id', uid)::text
  );
  return coalesce(NEW, OLD);
end;
$$;

drop trigger if exists notifications_notify on public.notifications;
create trigger notifications_notify
  after insert or update or delete on public.notifications
  for each row
  execute function public.notify_user_notification();

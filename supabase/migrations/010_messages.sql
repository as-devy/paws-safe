-- In-app chat between a requester and pet owner after a request is approved.

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  request_id bigint not null references public.pet_requests (id) on delete cascade,
  sender_id text not null references public.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  constraint messages_body_len check (
    char_length(trim(body)) > 0 and char_length(body) <= 2000
  )
);

create index if not exists messages_request_created_idx
  on public.messages (request_id, created_at);

alter table public.notifications
  drop constraint if exists notifications_type_check;

alter table public.notifications
  add constraint notifications_type_check
  check (type in ('request', 'approval', 'denied', 'verification', 'message'));

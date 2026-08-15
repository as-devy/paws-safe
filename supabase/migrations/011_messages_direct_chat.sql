-- Direct owner/visitor chat without requiring a pet request.

alter table public.messages
  add column if not exists owner_id text references public.users (id) on delete cascade,
  add column if not exists visitor_id text references public.users (id) on delete cascade,
  add column if not exists pet_id text references public.pets (id) on delete set null;

update public.messages m
set
  owner_id = p.owner_id,
  visitor_id = pr.requester_id,
  pet_id = coalesce(m.pet_id, pr.pet_id)
from public.pet_requests pr
join public.pets p on p.id = pr.pet_id
where m.request_id = pr.id
  and (m.owner_id is null or m.visitor_id is null);

delete from public.messages
where owner_id is null or visitor_id is null;

alter table public.messages
  alter column owner_id set not null,
  alter column visitor_id set not null,
  alter column request_id drop not null;

create index if not exists messages_owner_visitor_created_idx
  on public.messages (owner_id, visitor_id, created_at);

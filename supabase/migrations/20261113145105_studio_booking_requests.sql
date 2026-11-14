-- Server-only provisional requests, separate from paid projects and auth accounts.
create table public.studio_booking_requests (
 id uuid primary key,
 payload_hash text not null,
 snapshot jsonb not null,
 status text not null default 'pending_review' check (status = 'pending_review'),
 email_status text not null default 'pending' check (email_status in ('pending','sent')),
 email_provider_id text,
 rate_key text not null,
 created_at timestamptz not null default now()
);
alter table public.studio_booking_requests enable row level security;
revoke all on public.studio_booking_requests from public, anon, authenticated;
grant select, insert, update on public.studio_booking_requests to service_role;
create index studio_request_rate_idx on public.studio_booking_requests(rate_key,created_at);
-- Invoker privileges: only service_role can call; advisory lock serializes per-IP limits.
create function public.submit_studio_request(p_id uuid,p_hash text,p_snapshot jsonb,p_rate_key text)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare existing public.studio_booking_requests;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_id::text,0));
 select * into existing from public.studio_booking_requests where id=p_id;
 if found then
  if existing.payload_hash<>p_hash then return jsonb_build_object('error','conflict'); end if;
  return to_jsonb(existing);
 end if;
 perform pg_advisory_xact_lock(hashtextextended(p_rate_key,1));
 if (select count(*) from public.studio_booking_requests where rate_key=p_rate_key and created_at>now()-interval '1 hour')>=5 then
  return jsonb_build_object('error','rate_limit');
 end if;
 insert into public.studio_booking_requests(id,payload_hash,snapshot,rate_key)
 values(p_id,p_hash,p_snapshot,p_rate_key) returning * into existing;
 return to_jsonb(existing);
end; $$;
revoke all on function public.submit_studio_request(uuid,text,jsonb,text) from public,anon,authenticated;
grant execute on function public.submit_studio_request(uuid,text,jsonb,text) to service_role;

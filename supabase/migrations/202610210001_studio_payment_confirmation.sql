-- Studio production handoff: only the verified Razorpay webhook can call the confirmation RPC.
create extension if not exists pgcrypto;

create table if not exists public.studio_clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.studio_projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.studio_clients(id),
  provider_order_id text not null unique,
  booking_reference uuid not null unique,
  title text not null,
  goal text not null,
  scope jsonb not null default '{}'::jsonb,
  estimate_low_inr bigint not null,
  estimate_high_inr bigint not null,
  booking_amount_paise bigint not null,
  timeline_days integer not null,
  status text not null default 'confirmed' check (status in ('confirmed','in-progress','completed','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.studio_payments (
  id uuid primary key default gen_random_uuid(),
  provider_event_id text not null unique,
  provider_order_id text not null unique,
  provider_payment_id text not null unique,
  amount_paise bigint not null check (amount_paise > 0),
  currency text not null check (currency = 'INR'),
  project_id uuid not null references public.studio_projects(id),
  created_at timestamptz not null default now()
);

alter table public.studio_clients enable row level security;
alter table public.studio_projects enable row level security;
alter table public.studio_payments enable row level security;
revoke all on public.studio_clients, public.studio_projects, public.studio_payments from anon, authenticated;
grant select, insert, update on public.studio_clients, public.studio_projects, public.studio_payments to service_role;

create or replace function public.confirm_studio_payment(
  p_provider_event_id text,
  p_order_id text,
  p_payment_id text,
  p_amount_paise bigint,
  p_currency text,
  p_notes jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_client_id uuid;
  v_project_id uuid;
  v_existing_id uuid;
  v_email text;
  v_name text;
  v_phone text;
  v_booking_reference uuid;
begin
  if p_currency <> 'INR' or p_amount_paise <= 0
     or (p_notes->>'bookingAmountPaise')::bigint is distinct from p_amount_paise
     or nullif(trim(p_notes->>'bookingReference'),'') is null
     or nullif(trim(p_notes->>'email'),'') is null
     or nullif(trim(p_notes->>'name'),'') is null
     or nullif(trim(p_notes->>'phone'),'') is null then
    raise exception 'Payment metadata validation failed';
  end if;

  select project_id into v_existing_id from public.studio_payments
    where provider_order_id = p_order_id or provider_payment_id = p_payment_id or provider_event_id = p_provider_event_id;
  if v_existing_id is not null then
    return jsonb_build_object('ok', true, 'idempotent', true, 'project_id', v_existing_id);
  end if;

  v_email := lower(trim(p_notes->>'email'));
  v_name := trim(p_notes->>'name');
  v_phone := trim(p_notes->>'phone');
  v_booking_reference := (p_notes->>'bookingReference')::uuid;

  insert into public.studio_clients(name,email,phone)
    values(v_name,v_email,v_phone)
    on conflict(email) do update set name=excluded.name, phone=excluded.phone
    returning id into v_client_id;

  insert into public.studio_projects(
    client_id,provider_order_id,booking_reference,title,goal,scope,
    estimate_low_inr,estimate_high_inr,booking_amount_paise,timeline_days,status
  ) values (
    v_client_id,p_order_id,v_booking_reference,
    coalesce(nullif(p_notes->>'projectTitle',''),'Studio project'),
    coalesce(nullif(p_notes->>'goal',''),'presence'),
    p_notes,
    greatest(0,coalesce((p_notes->>'estimateLow')::bigint,0)),
    greatest(0,coalesce((p_notes->>'estimateHigh')::bigint,0)),
    p_amount_paise,
    greatest(1,coalesce((p_notes->>'timelineDays')::integer,1)),
    'confirmed'
  ) returning id into v_project_id;

  insert into public.studio_payments(provider_event_id,provider_order_id,provider_payment_id,amount_paise,currency,project_id)
    values(p_provider_event_id,p_order_id,p_payment_id,p_amount_paise,p_currency,v_project_id);

  return jsonb_build_object('ok',true,'idempotent',false,'project_id',v_project_id);
end;
$$;

revoke all on function public.confirm_studio_payment(text,text,text,bigint,text,jsonb) from public, anon, authenticated;
grant execute on function public.confirm_studio_payment(text,text,text,bigint,text,jsonb) to service_role;

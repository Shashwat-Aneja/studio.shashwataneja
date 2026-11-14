-- Link verified Studio clients to Supabase Auth identities for Dashboard access.
alter table public.studio_clients
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null,
  add column if not exists dashboard_invited_at timestamptz;

create unique index if not exists studio_clients_auth_user_id_uidx
  on public.studio_clients(auth_user_id)
  where auth_user_id is not null;

create or replace function public.is_studio_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

revoke all on function public.is_studio_admin() from public, anon;
grant execute on function public.is_studio_admin() to authenticated;

grant select on public.studio_clients, public.studio_projects, public.studio_payments to authenticated;

drop policy if exists "studio_clients_read_own_or_admin" on public.studio_clients;
create policy "studio_clients_read_own_or_admin"
on public.studio_clients
for select
to authenticated
using (auth_user_id = (select auth.uid()) or (select public.is_studio_admin()));

drop policy if exists "studio_projects_read_own_or_admin" on public.studio_projects;
create policy "studio_projects_read_own_or_admin"
on public.studio_projects
for select
to authenticated
using (
  (select public.is_studio_admin())
  or exists (
    select 1
    from public.studio_clients c
    where c.id = studio_projects.client_id
      and c.auth_user_id = (select auth.uid())
  )
);

drop policy if exists "studio_payments_read_own_or_admin" on public.studio_payments;
create policy "studio_payments_read_own_or_admin"
on public.studio_payments
for select
to authenticated
using (
  (select public.is_studio_admin())
  or exists (
    select 1
    from public.studio_projects p
    join public.studio_clients c on c.id = p.client_id
    where p.id = studio_payments.project_id
      and c.auth_user_id = (select auth.uid())
  )
);

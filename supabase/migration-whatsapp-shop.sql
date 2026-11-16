-- Middle Men WhatsApp shop migration
-- Run after schema.sql (or on an existing project)

do $$ begin
  create type public.product_category as enum ('vintage', 'player_version', 'other');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.availability_status as enum ('available', 'check_required', 'unavailable');
exception when duplicate_object then null;
end $$;

alter table public.products
  add column if not exists country text,
  add column if not exists category public.product_category not null default 'other',
  add column if not exists is_weekly boolean not null default false,
  add column if not exists availability_status public.availability_status not null default 'available',
  add column if not exists price_on_request boolean not null default false,
  add column if not exists badge_options jsonb not null default '[]'::jsonb,
  add column if not exists printing_enabled boolean not null default true;

create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Anyone read site settings" on public.site_settings;
create policy "Anyone read site settings"
  on public.site_settings for select
  using (true);

drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings"
  on public.site_settings for all
  using (public.is_admin())
  with check (public.is_admin());

insert into public.site_settings (key, value)
values ('weekly_collection_updated_at', now()::text)
on conflict (key) do nothing;

insert into storage.buckets (id, name, public)
values ('request-images', 'request-images', false)
on conflict (id) do nothing;

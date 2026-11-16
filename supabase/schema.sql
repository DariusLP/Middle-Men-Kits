-- Middle Men schema: run in Supabase SQL editor

create extension if not exists "pgcrypto";

create type public.user_role as enum ('customer', 'admin');
create type public.kit_type as enum ('home', 'away', 'third', 'goalkeeper', 'retro', 'special');
create type public.product_category as enum ('vintage', 'player_version', 'other');
create type public.availability_status as enum ('available', 'check_required', 'unavailable');
create type public.order_status as enum ('pending', 'paid', 'fulfilled', 'cancelled', 'refunded');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  club text not null,
  country text,
  kit_type public.kit_type not null default 'home',
  season text not null,
  category public.product_category not null default 'other',
  base_price numeric(10,2) not null check (base_price >= 0),
  price_on_request boolean not null default false,
  image_path text,
  image_paths text[] not null default '{}',
  is_weekly boolean not null default false,
  availability_status public.availability_status not null default 'available',
  badge_options jsonb not null default '[]'::jsonb,
  printing_enabled boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  size text not null,
  sku text not null unique,
  stock integer not null default 0 check (stock >= 0),
  price_override numeric(10,2),
  unique (product_id, size)
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts (id) on delete cascade,
  variant_id uuid not null references public.product_variants (id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  unique (cart_id, variant_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  stripe_session_id text unique,
  status public.order_status not null default 'pending',
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  shipping_address jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  variant_id uuid references public.product_variants (id) on delete set null,
  name text not null,
  size text not null,
  unit_price numeric(10,2) not null,
  quantity integer not null check (quantity > 0)
);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();

create trigger carts_updated_at
  before update on public.carts
  for each row execute function public.handle_updated_at();

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'customer'
  );
  insert into public.carts (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.site_settings enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Anyone read site settings"
  on public.site_settings for select
  using (true);

create policy "Admins manage site settings"
  on public.site_settings for all
  using (public.is_admin())
  with check (public.is_admin());

-- Profiles
create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

create policy "Admins update profiles"
  on public.profiles for update
  using (public.is_admin());

-- Products
create policy "Anyone read active products"
  on public.products for select
  using (active = true or public.is_admin());

create policy "Admins insert products"
  on public.products for insert
  with check (public.is_admin());

create policy "Admins update products"
  on public.products for update
  using (public.is_admin());

create policy "Admins delete products"
  on public.products for delete
  using (public.is_admin());

-- Variants
create policy "Anyone read variants of visible products"
  on public.product_variants for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (p.active = true or public.is_admin())
    )
  );

create policy "Admins manage variants"
  on public.product_variants for all
  using (public.is_admin())
  with check (public.is_admin());

-- Carts
create policy "Users manage own cart"
  on public.carts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own cart items"
  on public.cart_items for all
  using (
    exists (
      select 1 from public.carts c
      where c.id = cart_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.carts c
      where c.id = cart_id and c.user_id = auth.uid()
    )
  );

-- Orders
create policy "Users read own orders"
  on public.orders for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Users insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Admins update orders"
  on public.orders for update
  using (public.is_admin());

create policy "Users read own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "Users insert own order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admins upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin());

create policy "Admins delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());

-- ============================================================
-- SOCKS CO — Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query → Run)
-- This creates every table, policies, trigger and storage bucket the site needs.
-- ============================================================

-- ---------- Tables ----------

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price_per_pair numeric not null default 0,
  bundle_price numeric,
  bundle_size int not null default 12,
  moq int not null default 12,
  images text[] not null default '{}',
  colors text[] not null default '{}',
  sizes text[] not null default '{}',
  stock int not null default 0,
  category_id uuid references public.categories(id) on delete set null,
  is_featured boolean not null default false,
  is_new boolean not null default false,
  is_best_seller boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text,
  phone text,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  city text not null,
  province text not null,
  district text,
  delivery_method text not null default 'standard',
  subtotal numeric not null default 0,
  shipping_cost numeric not null default 0,
  total numeric not null default 0,
  notes text,
  status text not null default 'pending' check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  is_sample boolean not null default false,
  sample_business text,
  sample_styles text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_image text,
  quantity int not null default 1,
  unit_price numeric not null default 0,
  size text,
  color text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  key text primary key,
  value jsonb
);

-- ---------- RLS ----------

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.store_settings enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles where user_id = auth.uid() and role = 'admin'
  );
$$;

-- categories
create policy "categories public read" on public.categories for select using (true);
create policy "categories admin write" on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

-- products
create policy "products public read" on public.products for select using (true);
create policy "products admin write" on public.products for all
  using (public.is_admin()) with check (public.is_admin());

-- profiles
create policy "profiles read own or admin" on public.profiles for select
  using (auth.uid() = user_id or public.is_admin());
create policy "profiles update own" on public.profiles for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "profiles admin all" on public.profiles for all
  using (public.is_admin()) with check (public.is_admin());

-- orders: anyone can place (insert), only admin can read/update
create policy "orders public insert" on public.orders for insert to anon, authenticated with check (true);
create policy "orders admin all" on public.orders for all
  using (public.is_admin()) with check (public.is_admin());

-- order_items
create policy "order_items public insert" on public.order_items for insert to anon, authenticated with check (true);
create policy "order_items admin all" on public.order_items for all
  using (public.is_admin()) with check (public.is_admin());

-- order_status_history
create policy "history public insert" on public.order_status_history for insert to anon, authenticated with check (true);
create policy "history admin all" on public.order_status_history for all
  using (public.is_admin()) with check (public.is_admin());

-- store_settings: public read (needed for delivery charges + contact alerts), admin write
create policy "settings public read" on public.store_settings for select using (true);
create policy "settings admin all" on public.store_settings for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- Auto-create profile on signup ----------

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    'customer'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Storage bucket for product images ----------

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "products storage read" on storage.objects for select using (bucket_id = 'products');
create policy "products storage admin insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'products' and public.is_admin());
create policy "products storage admin update" on storage.objects for update to authenticated
  using (bucket_id = 'products' and public.is_admin());
create policy "products storage admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'products' and public.is_admin());

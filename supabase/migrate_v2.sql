-- ============================================================
-- SOCKS CO — Migration v2 (categories → subcategories)
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query → Run)
-- Adds the subcategories table and replaces the old category set with:
--   Men · Women · Childrens · Stockings · School Socks · Sports Socks · Baby Socks
-- Existing products are re-mapped to the closest new category/subcategory.
-- ============================================================

-- 1. Subcategories table + products column

create table if not exists public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  slug text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (category_id, slug)
);

alter table public.products add column if not exists subcategory_id uuid
  references public.subcategories(id) on delete set null;

-- 2. RLS

alter table public.subcategories enable row level security;

create policy "subcategories public read" on public.subcategories for select using (true);
create policy "subcategories admin write" on public.subcategories for all
  using (public.is_admin()) with check (public.is_admin());

-- 3. New categories

insert into public.categories (name, slug, image, sort_order) values
  ('Men',          'men',           '/images/products/men-crew-navy.svg',          1),
  ('Women',        'women',         '/images/products/womens-crew-lavender.svg',   2),
  ('Childrens',    'childrens',     '/images/products/kids-school-white-blue.svg', 3),
  ('Stockings',    'stockings',     '/images/products/womens-knee-coral.svg',      4),
  ('School Socks', 'school-socks',  '/images/products/kids-school-white-blue.svg', 5),
  ('Sports Socks', 'sports-socks',  '/images/products/sport-running-navy.svg',     6),
  ('Baby Socks',   'baby',          '/images/products/kids-ankle-sky.svg',         7)
on conflict (slug) do nothing;

-- 4. Subcategories

insert into public.subcategories (category_id, name, slug, sort_order)
select c.id, s.name, s.slug, s.ord
from (values
  ('men',        'Ankle',      'ankle',        1),
  ('men',        'Foot',       'foot',         2),
  ('men',        'Half',       'half',         3),
  ('men',        'Full Socks', 'full',         4),
  ('women',      'Ankle',      'ankle',        1),
  ('women',      'Foot',       'foot',         2),
  ('women',      'Half',       'half',         3),
  ('women',      'Full',       'full',         4),
  ('childrens',  'Boys',       'boys',         1),
  ('childrens',  'Girls',      'girls',        2),
  ('childrens',  'Party Socks','party-socks',  3),
  ('baby',       'Unisex',     'unisex',       1),
  ('baby',       'Party Socks','party-socks',  2)
) as s(cat_slug, name, slug, ord)
join public.categories c on c.slug = s.cat_slug
on conflict (category_id, slug) do nothing;

-- 5. Re-map existing products to the new structure
--    (product slug → new category slug → new subcategory slug; null = no sub)

update public.products p
set category_id = c.id
from (values
  ('classic-crew-sock',          'men'),
  ('formal-dress-sock',          'men'),
  ('everyday-ankle-sock',        'men'),
  ('argyle-crew-sock',           'men'),
  ('loafer-crew-sock',           'men'),
  ('fine-rib-dress-sock',        'men'),
  ('executive-micro-stripe-sock','men'),
  ('no-show-liner',              'women'),
  ('pastel-crew-sock',           'women'),
  ('knee-high-sock',             'women'),
  ('cozy-knit-sock',             'women'),
  ('colorful-knee-high-kids',    'childrens'),
  ('school-sock',                'school-socks'),
  ('running-performance-sock',   'sports-socks'),
  ('football-grip-sock',         'sports-socks'),
  ('tennis-quarter-sock',        'sports-socks'),
  ('toddler-ankle-sock',         'baby')
) as m(p_slug, cat_slug)
join public.categories c on c.slug = m.cat_slug
where p.slug = m.p_slug;

update public.products p
set subcategory_id = s.id
from (values
  ('classic-crew-sock',          'men',   'full'),
  ('formal-dress-sock',          'men',   'full'),
  ('everyday-ankle-sock',        'men',   'ankle'),
  ('argyle-crew-sock',           'men',   'half'),
  ('loafer-crew-sock',           'men',   'ankle'),
  ('fine-rib-dress-sock',        'men',   'full'),
  ('executive-micro-stripe-sock','men',   'full'),
  ('no-show-liner',              'women', 'ankle'),
  ('pastel-crew-sock',           'women', 'full'),
  ('knee-high-sock',             'women', 'full'),
  ('cozy-knit-sock',             'women', 'full'),
  ('colorful-knee-high-kids',    'childrens', 'party-socks'),
  ('toddler-ankle-sock',         'baby',  'unisex')
) as m(p_slug, cat_slug, sub_slug)
join public.subcategories s
  on s.slug = m.sub_slug
  and s.category_id = (select id from public.categories where slug = m.cat_slug)
where p.slug = m.p_slug;

-- 6. Remove the old categories (products already re-pointed above)

delete from public.categories
where slug in ('mens', 'womens', 'kids', 'sports', 'casual', 'formal');

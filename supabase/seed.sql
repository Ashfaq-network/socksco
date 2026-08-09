-- ============================================================
-- SOCKS CO — Seed Data
-- Run AFTER schema.sql. Inserts categories + sample products
-- with the built-in placeholder sock images.
-- ============================================================

truncate table public.order_items cascade;
truncate table public.orders cascade;
truncate table public.products cascade;
truncate table public.categories cascade;

-- ---------- Categories ----------

insert into public.categories (name, slug, image, sort_order) values
  ('Men''s Socks',   'mens',    '/images/products/men-crew-navy.svg',           1),
  ('Women''s Socks', 'womens',  '/images/products/womens-crew-lavender.svg',    2),
  ('Kids'' Socks',   'kids',    '/images/products/kids-school-white-blue.svg',  3),
  ('Sports',         'sports',  '/images/products/sport-running-navy.svg',      4),
  ('Casual',         'casual',  '/images/products/casual-knit-terracotta.svg',  5),
  ('Formal',         'formal',  '/images/products/formal-rib-navy.svg',         6);

-- ---------- Products ----------
-- price_per_pair = price for ONE pair (Rs)
-- bundle_price   = price for a bundle of 12 pairs
-- moq            = minimum order quantity in pairs

insert into public.products
(name, slug, description, price_per_pair, bundle_price, bundle_size, moq, images, colors, sizes, stock, category_id, is_featured, is_new, is_best_seller) values
('Classic Crew Sock', 'classic-crew-sock',
 'Premium combed-cotton crew sock. Soft, breathable and built to last wash after wash. Ideal everyday retail stock.',
 450, 4200, 12, 12, ARRAY['/images/products/men-crew-navy.svg'],
 ARRAY['#2C3E5C','#3C4148','#F7F8FA'], ARRAY['S','M','L','XL'], 500, (select id from public.categories where slug='mens'), true, true, true),

('Formal Dress Sock', 'formal-dress-sock',
 'Slim, smooth-knit dress sock with a fine rib finish. Pairs perfectly with suits and formal footwear.',
 520, 4800, 12, 12, ARRAY['/images/products/men-formal-charcoal.svg'],
 ARRAY['#3C4148','#2B2F35'], ARRAY['S','M','L'], 400, (select id from public.categories where slug='mens'), true, true, false),

('Everyday Ankle Sock', 'everyday-ankle-sock',
 'Low-cut ankle sock with reinforced heel and toe. Comfort that lasts the whole working day.',
 350, 3200, 12, 12, ARRAY['/images/products/men-ankle-black.svg'],
 ARRAY['#26282B','#2C3E5C','#F7F8FA'], ARRAY['S','M','L','XL'], 600, (select id from public.categories where slug='mens'), false, true, true),

('No-Show Liner', 'no-show-liner',
 'Invisible no-show liner that stays put. Ultra-thin and moisture-wicking — made for loafers and trainers.',
 300, 2700, 12, 12, ARRAY['/images/products/womens-no-show-blush.svg'],
 ARRAY['#E8B4BC','#F7F8FA','#B9A7D9'], ARRAY['XS','S','M','L'], 450, (select id from public.categories where slug='womens'), false, true, false),

('Pastel Crew Sock', 'pastel-crew-sock',
 'Soft pastel crew sock in a cushioned cotton blend. A bright, cheerful addition to any shelf.',
 400, 3600, 12, 12, ARRAY['/images/products/womens-crew-lavender.svg'],
 ARRAY['#B9A7D9','#E8B4BC','#7FB8E0'], ARRAY['S','M','L'], 380, (select id from public.categories where slug='womens'), true, false, true),

('Knee-High Sock', 'knee-high-sock',
 'Knee-high sock with a gentle, non-binding top band. Great with skirts, boots and school uniform.',
 480, 4400, 12, 12, ARRAY['/images/products/womens-knee-coral.svg'],
 ARRAY['#E88A7A','#7FB8E0','#2C3E5C'], ARRAY['S','M','L'], 350, (select id from public.categories where slug='womens'), false, true, false),

('School Sock', 'school-sock',
 'Classic white school sock with a reinforced toe and heel. Durable, bright and school-uniform approved.',
 380, 3400, 12, 12, ARRAY['/images/products/kids-school-white-blue.svg'],
 ARRAY['#F7F8FA','#4A6FA5'], ARRAY['Kids 3-5','Kids 6-9','Kids 10-13'], 700, (select id from public.categories where slug='kids'), true, false, true),

('Toddler Ankle Sock', 'toddler-ankle-sock',
 'Sized for little feet with a soft, stretchy cuff that never pinches. Gentle on sensitive skin.',
 320, 2800, 12, 12, ARRAY['/images/products/kids-ankle-sky.svg'],
 ARRAY['#7FB8E0','#F0B429','#5BB7A9'], ARRAY['Toddler 6-12m','Toddler 1-3y','Kids 3-5'], 520, (select id from public.categories where slug='kids'), false, true, false),

('Colorful Knee-High (Kids)', 'colorful-knee-high-kids',
 'Bright knee-high sock kids love to wear. Cushioned sole with a fun pop of color.',
 400, 3600, 12, 12, ARRAY['/images/products/kids-knee-teal.svg'],
 ARRAY['#5BB7A9','#F2A65A','#E88A7A'], ARRAY['Kids 6-9','Kids 10-13'], 420, (select id from public.categories where slug='kids'), false, false, false),

('Running Performance Sock', 'running-performance-sock',
 'Engineered for sport: arch support, cushioned heel and toe, and breathable zones. Sweat-wicking all the way.',
 650, 6000, 12, 12, ARRAY['/images/products/sport-running-navy.svg'],
 ARRAY['#223A5E','#E2572C','#26282B'], ARRAY['M','L','XL'], 300, (select id from public.categories where slug='sports'), true, true, true),

('Football Grip Sock', 'football-grip-sock',
 'High-density cushioning with grip zones built for turf. Team-ready from training to match day.',
 700, 6500, 12, 12, ARRAY['/images/products/sport-football-lime.svg'],
 ARRAY['#5E8A3A','#223A5E','#26282B'], ARRAY['M','L','XL'], 280, (select id from public.categories where slug='sports'), false, true, false),

('Tennis Quarter Sock', 'tennis-quarter-sock',
 'Quarter-length sport sock with targeted cushioning in the footbed. Cool, dry and comfortable on court.',
 550, 5100, 12, 12, ARRAY['/images/products/sport-tennis-white.svg'],
 ARRAY['#F3F4F6','#223A5E'], ARRAY['S','M','L','XL'], 360, (select id from public.categories where slug='sports'), false, false, false),

('Argyle Crew Sock', 'argyle-crew-sock',
 'Classic argyle pattern in a warm cotton blend. A heritage look that always sells.',
 580, 5400, 12, 12, ARRAY['/images/products/casual-argyle-mustard.svg'],
 ARRAY['#D9A441','#6B4E1F','#3C4148'], ARRAY['M','L'], 260, (select id from public.categories where slug='casual'), true, false, true),

('Cozy Knit Sock', 'cozy-knit-sock',
 'Thick, brushed knit sock for cool evenings. Soft inside, sturdy outside — a winter best-seller.',
 620, 5700, 12, 12, ARRAY['/images/products/casual-knit-terracotta.svg'],
 ARRAY['#C46A4A','#8B8E96','#6B4E1F'], ARRAY['S','M','L','XL'], 320, (select id from public.categories where slug='casual'), true, true, false),

('Loafer Crew Sock', 'loafer-crew-sock',
 'Fine-gauge heather crew that hides neatly under hems. Smart-casual comfort with zero bulk.',
 460, 4300, 12, 12, ARRAY['/images/products/casual-loafer-heather.svg'],
 ARRAY['#8B8E96','#3C4148','#2C3E5C'], ARRAY['S','M','L','XL'], 410, (select id from public.categories where slug='casual'), false, false, false),

('Fine Rib Dress Sock', 'fine-rib-dress-sock',
 'Extra-fine rib with a subtle sheen. The executive choice — smooth under leather.',
 580, 5400, 12, 12, ARRAY['/images/products/formal-rib-navy.svg'],
 ARRAY['#1F3A5F','#2B2F35','#3C4148'], ARRAY['S','M','L'], 340, (select id from public.categories where slug='formal'), true, false, true),

('Executive Micro-Stripe Sock', 'executive-micro-stripe-sock',
 'Understated micro-stripe detail on a soft cotton blend. Boardroom-ready, office-approved.',
 560, 5200, 12, 12, ARRAY['/images/products/formal-fine-dark.svg'],
 ARRAY['#2B2F35','#1F3A5F'], ARRAY['M','L'], 310, (select id from public.categories where slug='formal'), false, false, false);

-- ---------- Default store settings (owner can edit in Admin → Settings) ----------

insert into public.store_settings (key, value) values
  ('store_info', jsonb_build_object(
     'name', 'Socks Co',
     'email', 'orders@socksco.lk',
     'phone', '0770000000',
     'whatsapp', '94770000000',
     'address', 'Colombo, Sri Lanka'
  )),
  ('delivery_charges', jsonb_build_object(
     'standard', 400,
     'express', 900,
     'pickup', 0
  )),
  ('order_alerts', jsonb_build_object(
     'email_enabled', true,
     'whatsapp_enabled', true,
     'formsubmit_email', ''
  ))
on conflict (key) do nothing;

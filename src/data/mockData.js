// Built-in placeholder catalog, used only when Supabase is not configured yet.
// Mirrors supabase/seed.sql so the preview matches the seeded store.

export const MOCK_CATEGORIES = [
  { id: 'cat-mens', name: "Men's Socks", slug: 'mens', image: '/images/products/men-crew-navy.svg', sort_order: 1 },
  { id: 'cat-womens', name: "Women's Socks", slug: 'womens', image: '/images/products/womens-crew-lavender.svg', sort_order: 2 },
  { id: 'cat-kids', name: "Kids' Socks", slug: 'kids', image: '/images/products/kids-school-white-blue.svg', sort_order: 3 },
  { id: 'cat-sports', name: 'Sports', slug: 'sports', image: '/images/products/sport-running-navy.svg', sort_order: 4 },
  { id: 'cat-casual', name: 'Casual', slug: 'casual', image: '/images/products/casual-knit-terracotta.svg', sort_order: 5 },
  { id: 'cat-formal', name: 'Formal', slug: 'formal', image: '/images/products/formal-rib-navy.svg', sort_order: 6 },
]

const P = (id, name, slug, description, price, bundle, images, colors, sizes, categoryId, stock, featured, isNew, best) => ({
  id, name, slug, description,
  price_per_pair: price,
  bundle_price: bundle,
  bundle_size: 12,
  moq: 12,
  images, colors, sizes,
  stock, category_id: categoryId,
  is_featured: featured, is_new: isNew, is_best_seller: best,
  created_at: new Date().toISOString(),
})

export const MOCK_PRODUCTS = [
  P('p1', 'Classic Crew Sock', 'classic-crew-sock', 'Premium combed-cotton crew sock. Soft, breathable and built to last wash after wash.', 450, 4200, ['/images/products/men-crew-navy.svg'], ['#2C3E5C','#3C4148','#F7F8FA'], ['S','M','L','XL'], 'cat-mens', 500, true, true, true),
  P('p2', 'Formal Dress Sock', 'formal-dress-sock', 'Slim, smooth-knit dress sock with a fine rib finish. Pairs perfectly with suits and formal footwear.', 520, 4800, ['/images/products/men-formal-charcoal.svg'], ['#3C4148','#2B2F35'], ['S','M','L'], 'cat-mens', 400, true, true, false),
  P('p3', 'Everyday Ankle Sock', 'everyday-ankle-sock', 'Low-cut ankle sock with reinforced heel and toe. Comfort that lasts the whole working day.', 350, 3200, ['/images/products/men-ankle-black.svg'], ['#26282B','#2C3E5C','#F7F8FA'], ['S','M','L','XL'], 'cat-mens', 600, false, true, true),
  P('p4', 'No-Show Liner', 'no-show-liner', 'Invisible no-show liner that stays put. Ultra-thin and moisture-wicking — made for loafers and trainers.', 300, 2700, ['/images/products/womens-no-show-blush.svg'], ['#E8B4BC','#F7F8FA','#B9A7D9'], ['XS','S','M','L'], 'cat-womens', 450, false, true, false),
  P('p5', 'Pastel Crew Sock', 'pastel-crew-sock', 'Soft pastel crew sock in a cushioned cotton blend. A bright, cheerful addition to any shelf.', 400, 3600, ['/images/products/womens-crew-lavender.svg'], ['#B9A7D9','#E8B4BC','#7FB8E0'], ['S','M','L'], 'cat-womens', 380, true, false, true),
  P('p6', 'Knee-High Sock', 'knee-high-sock', 'Knee-high sock with a gentle, non-binding top band. Great with skirts, boots and school uniform.', 480, 4400, ['/images/products/womens-knee-coral.svg'], ['#E88A7A','#7FB8E0','#2C3E5C'], ['S','M','L'], 'cat-womens', 350, false, true, false),
  P('p7', 'School Sock', 'school-sock', 'Classic white school sock with a reinforced toe and heel. Durable, bright and school-uniform approved.', 380, 3400, ['/images/products/kids-school-white-blue.svg'], ['#F7F8FA','#4A6FA5'], ['Kids 3-5','Kids 6-9','Kids 10-13'], 'cat-kids', 700, true, false, true),
  P('p8', 'Toddler Ankle Sock', 'toddler-ankle-sock', 'Sized for little feet with a soft, stretchy cuff that never pinches. Gentle on sensitive skin.', 320, 2800, ['/images/products/kids-ankle-sky.svg'], ['#7FB8E0','#F0B429','#5BB7A9'], ['Toddler 6-12m','Toddler 1-3y','Kids 3-5'], 'cat-kids', 520, false, true, false),
  P('p9', 'Colorful Knee-High (Kids)', 'colorful-knee-high-kids', 'Bright knee-high sock kids love to wear. Cushioned sole with a fun pop of color.', 400, 3600, ['/images/products/kids-knee-teal.svg'], ['#5BB7A9','#F2A65A','#E88A7A'], ['Kids 6-9','Kids 10-13'], 'cat-kids', 420, false, false, false),
  P('p10', 'Running Performance Sock', 'running-performance-sock', 'Engineered for sport: arch support, cushioned heel and toe, and breathable zones. Sweat-wicking all the way.', 650, 6000, ['/images/products/sport-running-navy.svg'], ['#223A5E','#E2572C','#26282B'], ['M','L','XL'], 'cat-sports', 300, true, true, true),
  P('p11', 'Football Grip Sock', 'football-grip-sock', 'High-density cushioning with grip zones built for turf. Team-ready from training to match day.', 700, 6500, ['/images/products/sport-football-lime.svg'], ['#5E8A3A','#223A5E','#26282B'], ['M','L','XL'], 'cat-sports', 280, false, true, false),
  P('p12', 'Tennis Quarter Sock', 'tennis-quarter-sock', 'Quarter-length sport sock with targeted cushioning in the footbed. Cool, dry and comfortable on court.', 550, 5100, ['/images/products/sport-tennis-white.svg'], ['#F3F4F6','#223A5E'], ['S','M','L','XL'], 'cat-sports', 360, false, false, false),
  P('p13', 'Argyle Crew Sock', 'argyle-crew-sock', 'Classic argyle pattern in a warm cotton blend. A heritage look that always sells.', 580, 5400, ['/images/products/casual-argyle-mustard.svg'], ['#D9A441','#6B4E1F','#3C4148'], ['M','L'], 'cat-casual', 260, true, false, true),
  P('p14', 'Cozy Knit Sock', 'cozy-knit-sock', 'Thick, brushed knit sock for cool evenings. Soft inside, sturdy outside — a winter best-seller.', 620, 5700, ['/images/products/casual-knit-terracotta.svg'], ['#C46A4A','#8B8E96','#6B4E1F'], ['S','M','L','XL'], 'cat-casual', 320, true, true, false),
  P('p15', 'Loafer Crew Sock', 'loafer-crew-sock', 'Fine-gauge heather crew that hides neatly under hems. Smart-casual comfort with zero bulk.', 460, 4300, ['/images/products/casual-loafer-heather.svg'], ['#8B8E96','#3C4148','#2C3E5C'], ['S','M','L','XL'], 'cat-casual', 410, false, false, false),
  P('p16', 'Fine Rib Dress Sock', 'fine-rib-dress-sock', 'Extra-fine rib with a subtle sheen. The executive choice — smooth under leather.', 580, 5400, ['/images/products/formal-rib-navy.svg'], ['#1F3A5F','#2B2F35','#3C4148'], ['S','M','L'], 'cat-formal', 340, true, false, true),
  P('p17', 'Executive Micro-Stripe Sock', 'executive-micro-stripe-sock', 'Understated micro-stripe detail on a soft cotton blend. Boardroom-ready, office-approved.', 560, 5200, ['/images/products/formal-fine-dark.svg'], ['#2B2F35','#1F3A5F'], ['M','L'], 'cat-formal', 310, false, false, false),
]

export const MOCK_SETTINGS = {
  store_info: {
    name: 'Socks Co',
    email: 'orders@socksco.lk',
    phone: '0770000000',
    whatsapp: '94770000000',
    address: 'Colombo, Sri Lanka',
  },
  delivery_charges: { standard: 400, express: 900, pickup: 0 },
  order_alerts: { email_enabled: true, whatsapp_enabled: true, formsubmit_email: '' },
}

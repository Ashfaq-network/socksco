import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Truck, PackageCheck, FlaskConical, Layers, ArrowRight, ShieldCheck,
  BadgePercent, MapPin, Sparkles, Quote, ChevronDown,
} from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { fetchCategories, fetchProducts } from '@lib/service'
import ProductCard from '@components/ProductCard'
import Reveal from '@components/ui/Reveal'
import SectionHeading from '@components/ui/SectionHeading'

const features = [
  { icon: PackageCheck, title: 'Wholesale Only', sub: 'Factory-direct pricing for resellers & bulk buyers' },
  { icon: FlaskConical, title: 'Order Samples First', sub: 'Try any style before you commit to bulk' },
  { icon: Layers, title: '12-Pair Bundles', sub: 'Simple dozen pricing on every product' },
  { icon: Truck, title: 'Islandwide Delivery', sub: 'Reliable delivery across all of Sri Lanka' },
]

const heroStats = [
  { value: '40+', label: 'Styles in stock' },
  { value: '12-pair', label: 'Bundle pricing' },
  { value: '100%', label: 'Quality checked' },
]

const marqueeItems = [
  "Men's Crew", 'Sports Performance', "Women's Pastels", 'Kids School', 'Formal Dress',
  'No-Show Liners', 'Football Grip', 'Cozy Knit', 'Knee-High', 'Everyday Ankle',
]

const steps = [
  { n: '01', title: 'Order Samples', sub: 'Pick the styles you like and order sample pairs to check quality, sizes and finish before you commit.' },
  { n: '02', title: 'Place a Bulk Order', sub: 'Add your favourites to the cart. Every product is priced per pair and per dozen (12).' },
  { n: '03', title: 'We Deliver', sub: 'We confirm on WhatsApp or email, pack your order and deliver islandwide.' },
]

const testimonials = [
  {
    quote: 'Sample-first ordering took all the guesswork out of stocking socks. We re-order the same dozen every month.',
    name: 'Ravindu P.',
    role: 'Boutique owner · Kandy',
  },
  {
    quote: 'Quality and bundle pricing are hard to beat. Delivered on time, every time, even up to Jaffna.',
    name: 'Sajith F.',
    role: 'Wholesale buyer · Jaffna',
  },
  {
    quote: 'The kids school socks fly off our shelf. Staff restock online in under two minutes.',
    name: 'Dilini W.',
    role: 'Supermarket chain · Colombo',
  },
]

const heroCards = [
  {
    img: '/images/products/sport-running-navy.svg',
    tag: 'Sports · Performance',
    price: 'Rs 650 / pair',
    cls: 'top-0 right-24 w-40 md:w-52 rotate-2 animate-floaty',
  },
  {
    img: '/images/products/womens-crew-lavender.svg',
    tag: 'New · Pastel Crew',
    price: 'Rs 400 / pair',
    cls: 'top-44 right-2 w-36 md:w-44 -rotate-3 animate-floaty-delay',
  },
  {
    img: '/images/products/kids-school-white-blue.svg',
    tag: 'Kids · School',
    price: 'Rs 380 / pair',
    cls: 'top-80 right-36 w-32 md:w-40 animate-floaty-slow',
  },
]

const catTags = {
  mens: 'Crew · ankle · dress',
  womens: 'Liners · knee-high · pastels',
  kids: 'School · toddler · knee-high',
  sports: 'Running · football · tennis',
  casual: 'Argyle · knit · loafer',
  formal: 'Fine rib · micro-stripe',
}

export default function Home() {
  const [categories, setCategories] = useState([])
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])

  const { scrollY } = useScroll()
  const heroImgY = useTransform(scrollY, [0, 700], [0, 160])
  const heroTextY = useTransform(scrollY, [0, 700], [0, 80])

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]))
    fetchProducts({ featured: true, limit: 8 }).then(setFeatured).catch(() => setFeatured([]))
    fetchProducts({ isNew: true, limit: 8 }).then(setNewArrivals).catch(() => setNewArrivals([]))
  }, [])

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-[680px] md:min-h-[720px] flex items-center overflow-hidden">
        <motion.img
          src="/images/hero.svg"
          alt=""
          style={{ y: heroImgY }}
          className="absolute inset-0 w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-900/55 to-brand-900/10" />
        <div className="absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full bg-accent-500/20 blur-3xl" />

        <div className="container-brand relative z-10 py-20 grid lg:grid-cols-[1.15fr_0.85fr] items-center gap-12">
          <motion.div style={{ y: heroTextY }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <span className="badge bg-accent-500 text-white shadow-lg shadow-accent-500/30">
                <Sparkles className="w-3.5 h-3.5" /> Sri Lanka Wholesale · Since 2024
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mt-6 font-heading text-[2.6rem] sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.04]"
            >
              Premium socks at{' '}
              <span className="relative inline-block">
                <span className="text-accent-400">factory-direct</span>
                <span className="absolute left-0 -bottom-1.5 w-full h-[6px] rounded-full bg-accent-500/70 -z-10 skew-x-[-12deg]" />
              </span>{' '}
              prices.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mt-6 text-white/80 text-lg leading-relaxed max-w-lg"
            >
              Socks Co supplies men's, women's, kids' and sports socks across Sri Lanka.
              Order samples first, then stock up in 12-pair bundles — delivered islandwide.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mt-9 flex flex-wrap gap-4"
            >
              <Link to="/shop" className="btn-accent">
                Browse Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/samples"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-white/70 text-white font-heading font-bold uppercase tracking-wide text-sm hover:bg-white/10 hover:border-white transition-colors"
              >
                Order Samples
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3"
            >
              {heroStats.map((s, i) => (
                <div key={s.label} className="flex items-center gap-8">
                  {i > 0 && <span className="hidden sm:block w-px h-9 bg-white/20" />}
                  <div>
                    <p className="font-heading text-xl font-extrabold text-white">{s.value}</p>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-widest text-white/60">{s.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Floating product cards (desktop) */}
          <div className="relative hidden lg:block h-[460px]">
            {heroCards.map((c, i) => (
              <motion.div
                key={c.tag}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.35 + i * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
                className={`absolute ${c.cls}`}
              >
                <div className="rounded-3xl bg-white/95 backdrop-blur p-3 shadow-2xl shadow-black/30">
                  <img src={c.img} alt={c.tag} className="w-full aspect-square rounded-2xl object-cover" />
                  <div className="flex items-center justify-between px-1 py-1.5">
                    <p className="text-[0.68rem] font-bold uppercase tracking-widest text-muted-ink">{c.tag}</p>
                    <p className="text-[0.72rem] font-extrabold text-accent-600">{c.price}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.a
          href="#featured"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors hidden md:block"
        >
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </motion.a>
      </section>

      {/* MARQUEE */}
      <div className="relative bg-brand-800 border-y border-white/10 overflow-hidden">
        <div className="animate-marquee py-4">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center shrink-0">
              {marqueeItems.map((item) => (
                <span key={`${dup}-${item}`} className="flex items-center gap-6 mx-6 text-sm font-bold uppercase tracking-[0.22em] text-white/50 whitespace-nowrap">
                  {item}
                  <span className="w-1.5 h-1.5 rotate-45 bg-accent-500" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="bg-white border-b border-mist">
        <div className="container-brand grid grid-cols-2 md:grid-cols-4 gap-8 py-12 md:py-14">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.07}>
              <div className="group flex flex-col items-center text-center">
                <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white flex items-center justify-center mb-4 shadow-lg shadow-brand-600/25 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                  <f.icon className="w-6 h-6" strokeWidth={1.8} />
                </span>
                <h3 className="font-heading font-bold text-brand-800 text-sm uppercase tracking-wide">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-[0.82rem] text-muted-ink leading-relaxed">{f.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-brand py-16 md:py-24">
        <SectionHeading
          eyebrow="Shop by category"
          title="Six collections. One quality bar."
          sub="Every style is available as samples first, then in 12-pair bundles."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.06}>
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group relative block aspect-[4/5] rounded-3xl overflow-hidden bg-brand-800 shadow-lg shadow-black/5"
              >
                <img
                  src={cat.image || '/images/products/men-crew-navy.svg'}
                  alt={cat.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/15 to-transparent" />

                <span className="absolute top-4 right-4 font-heading text-2xl font-extrabold text-white/25 group-hover:text-accent-400/70 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="badge bg-white/15 backdrop-blur text-white/80 border border-white/20">
                    {catTags[cat.slug] || 'Wholesale'}
                  </span>
                  <h3 className="mt-3 font-heading text-xl md:text-2xl font-extrabold text-white">
                    {cat.name}
                  </h3>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STATS BAND */}
      <section className="relative bg-brand-700 overflow-hidden py-14 md:py-16">
        <div className="absolute -top-20 right-0 w-80 h-80 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="container-brand relative grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 text-center">
          {[
            { icon: Layers, value: '12', label: 'Pairs per bundle' },
            { icon: MapPin, value: '25', label: 'Districts delivered' },
            { icon: ShieldCheck, value: '100%', label: 'Quality checked' },
            { icon: Truck, value: '3–5', label: 'Day delivery' },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="flex flex-col items-center">
                <span className="w-12 h-12 rounded-full bg-white/10 border border-white/15 text-accent-400 flex items-center justify-center mb-3">
                  <s.icon className="w-5 h-5" strokeWidth={1.8} />
                </span>
                <p className="font-heading text-3xl font-extrabold text-white">{s.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-white/60">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section id="featured" className="bg-white py-16 md:py-24 border-y border-mist">
        <div className="container-brand">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
            <Reveal className="text-center md:text-left">
              <span className="eyebrow">Best sellers</span>
              <h2 className="mt-3 font-heading text-3xl md:text-4xl font-extrabold tracking-tight text-brand-800">
                Most requested styles
              </h2>
              <p className="mt-4 text-muted-ink max-w-xl text-[0.95rem] leading-relaxed md:mx-0">
                The socks retailers re-order again and again — proven sellers, proven quality.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <Link to="/shop" className="btn-outline">
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <ProductCard product={{ ...p, category_name: categories.find((c) => c.id === p.category_id)?.name }} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-brand py-16 md:py-24">
        <SectionHeading
          eyebrow="How it works"
          title="From sample to shelf in three steps"
          sub="We keep the wholesale process simple for stockists, boutiques and online sellers."
        />
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          <div className="hidden md:block absolute top-7 left-[16%] right-[16%] border-t-2 border-dashed border-brand-200" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="card card-hover p-8 h-full text-center relative">
                <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 text-white font-heading text-lg font-extrabold shadow-lg shadow-accent-500/25 mb-5">
                  {s.n}
                </div>
                <h3 className="font-heading text-xl font-extrabold text-brand-800">{s.title}</h3>
                <p className="mt-3 text-muted-ink text-sm leading-relaxed">{s.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-mist/60 py-16 md:py-24 border-y border-mist">
        <div className="container-brand">
          <SectionHeading
            eyebrow="Trusted by stockists"
            title="What resellers say"
            sub="Retailers across the island re-stock with us month after month."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className="card card-hover p-7 h-full flex flex-col">
                  <Quote className="w-8 h-8 text-accent-200 fill-accent-100" />
                  <p className="mt-4 text-gray-600 text-[0.95rem] leading-relaxed flex-1">"{t.quote}"</p>
                  <div className="mt-6 pt-5 border-t border-mist flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-white flex items-center justify-center text-sm font-bold">
                      {t.name.charAt(0)}
                    </span>
                    <div>
                      <p className="font-bold text-brand-800 text-sm">{t.name}</p>
                      <p className="text-xs text-muted-ink">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="container-brand py-16 md:py-24">
          <SectionHeading eyebrow="Fresh stock" title="New arrivals" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.slice(0, 4).map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <ProductCard product={{ ...p, category_name: categories.find((c) => c.id === p.category_id)?.name }} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* SAMPLES CTA */}
      <section className="container-brand pb-16 md:pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 px-6 py-16 md:px-14 md:py-20 text-center">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-accent-500/25 blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
            <img
              src="/images/products/men-crew-navy.svg"
              alt=""
              className="absolute -bottom-10 -right-8 w-52 opacity-20 rotate-12 pointer-events-none hidden md:block"
            />
            <div className="relative">
              <span className="badge bg-accent-500 text-white shadow-lg shadow-accent-500/30">
                <FlaskConical className="w-3.5 h-3.5" /> Try before you buy
              </span>
              <h2 className="mt-5 font-heading text-3xl md:text-4xl font-extrabold text-white max-w-2xl mx-auto leading-tight">
                Not sure which socks will sell?
              </h2>
              <p className="mt-4 text-white/75 max-w-xl mx-auto">
                Order samples of any style and check the quality yourself before committing to a bulk order.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Link to="/samples" className="btn-accent">
                  Request Samples <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/faq"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-white/40 text-white font-heading font-bold uppercase tracking-wide text-sm hover:bg-white/10 transition-colors"
                >
                  Read the FAQ
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

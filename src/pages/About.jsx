import { Link } from 'react-router-dom'
import { PackageCheck, FlaskConical, Truck, ShieldCheck, ArrowRight } from 'lucide-react'
import Reveal from '@components/ui/Reveal'
import SectionHeading from '@components/ui/SectionHeading'

const values = [
  { icon: ShieldCheck, title: 'Quality first', sub: 'Every sock is checked before it ships. We stand behind what we supply.' },
  { icon: FlaskConical, title: 'Samples before bulk', sub: 'We encourage every new buyer to try samples before committing.' },
  { icon: PackageCheck, title: 'Wholesale focused', sub: 'Simple per-pair and per-dozen pricing built for resellers.' },
  { icon: Truck, title: 'Reliable delivery', sub: 'Consistent islandwide delivery with order confirmations on WhatsApp.' },
]

const stats = [
  { value: '6', label: 'Collections' },
  { value: '17+', label: 'Styles' },
  { value: '12', label: 'Pairs per bundle' },
  { value: '9', label: 'Provinces served' },
]

export default function About() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="bg-brand-800 text-white">
        <div className="container-brand py-16 md:py-24 text-center">
          <Reveal>
            <span className="eyebrow !text-accent-400">About Socks Co</span>
            <h1 className="mt-4 font-heading text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
              The sock supplier built for Sri Lankan retailers
            </h1>
            <p className="mt-5 text-white/70 max-w-xl mx-auto text-lg">
              We supply stockists, boutiques, team sellers and online shops with
              quality socks at factory-direct prices — from one pair of samples to
              full 12-pair bundles.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="container-brand py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07} className="text-center">
              <p className="font-heading text-4xl font-extrabold text-brand-700">{s.value}</p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-muted-ink">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-white border-y border-mist py-16 md:py-24">
        <div className="container-brand">
          <SectionHeading eyebrow="What we stand for" title="How we work" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="card card-hover p-7 h-full">
                  <span className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                    <v.icon className="w-6 h-6" strokeWidth={1.8} />
                  </span>
                  <h3 className="font-heading text-lg font-extrabold text-brand-800">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-ink leading-relaxed">{v.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="container-brand py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="rounded-3xl overflow-hidden bg-brand-700 p-10 text-white h-full flex flex-col justify-center">
              <h3 className="font-heading text-2xl font-extrabold">Simple wholesale, no fuss</h3>
              <p className="mt-4 text-white/75 leading-relaxed">
                No membership, no complicated tiers. Pick the styles you like,
                order samples to check them, then buy in 12-pair bundles at
                wholesale prices. Every order is confirmed personally.
              </p>
              <Link to="/samples" className="btn-accent mt-8 self-start">
                Order Samples <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5">
              <div className="card p-6">
                <h4 className="font-heading font-extrabold text-brand-800">For online sellers</h4>
                <p className="mt-2 text-sm text-muted-ink">
                  Consistent quality and sizing you can rely on for your store's
                  reviews and repeat customers.
                </p>
              </div>
              <div className="card p-6">
                <h4 className="font-heading font-extrabold text-brand-800">For boutiques & stockists</h4>
                <p className="mt-2 text-sm text-muted-ink">
                  Fresh styles and bundle pricing that keep your shelves stocked
                  and your margins healthy.
                </p>
              </div>
              <div className="card p-6">
                <h4 className="font-heading font-extrabold text-brand-800">For teams & events</h4>
                <p className="mt-2 text-sm text-muted-ink">
                  Sports and school styles in volume, delivered on time for the
                  season.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="container-brand pb-16 md:pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-brand-700 px-6 py-14 md:px-14 text-center">
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-accent-500/20 blur-3xl" />
            <h2 className="relative font-heading text-3xl md:text-4xl font-extrabold text-white">Ready to stock up?</h2>
            <p className="relative mt-3 text-white/70 max-w-lg mx-auto">
              Browse the collection or start with a sample order today.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/shop" className="btn-accent">Browse Collection</Link>
              <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-white/70 text-white font-heading font-bold uppercase tracking-wide text-sm hover:bg-white/10 transition-colors">
                Talk to us
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

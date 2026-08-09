import { useState, useEffect } from 'react'
import { MessageCircle, Mail, MapPin, Clock, Loader2 } from 'lucide-react'
import { getSettings } from '@lib/service'
import Reveal from '@components/ui/Reveal'

export default function Contact() {
  const [settings, setSettings] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    getSettings().then(setSettings).catch(() => setSettings(null))
  }, [])

  const info = settings?.store_info || { name: 'Socks Co', email: 'orders@socksco.lk', phone: '0770000000', whatsapp: '94770000000', address: 'Colombo, Sri Lanka' }
  const number = (info.whatsapp || '94770000000').replace(/\D/g, '')

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)
    const message =
      `Hi Socks Co!\n\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\n${form.message}`
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    setTimeout(() => {
      window.open(url, '_blank')
      setSending(false)
      setSent(true)
      setTimeout(() => setSent(false), 4000)
    }, 300)
  }

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const cards = [
    { icon: MessageCircle, label: 'WhatsApp', value: info.phone, color: 'text-green-600', href: `https://wa.me/${number}` },
    { icon: Mail, label: 'Email', value: info.email, color: 'text-brand-500', href: `mailto:${info.email}` },
    { icon: MapPin, label: 'Address', value: info.address, color: 'text-accent-500' },
    { icon: Clock, label: 'Hours', value: 'Mon–Sat · 9am – 6pm', color: 'text-brand-600' },
  ]

  return (
    <div className="container-brand py-10 md:py-16">
      <div className="max-w-4xl mx-auto">
        <Reveal className="text-center mb-12">
          <span className="eyebrow">Get in touch</span>
          <h1 className="mt-3 font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-brand-800">
            Contact Socks Co
          </h1>
          <p className="mt-4 text-muted-ink text-lg max-w-xl mx-auto">
            Questions about samples, bundles or delivery? Send us a message — we
            reply fast on WhatsApp.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {cards.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.06}>
              {c.href ? (
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="card card-hover p-5 flex flex-col items-center text-center h-full">
                  <c.icon className={`w-7 h-7 ${c.color}`} />
                  <p className="mt-3 text-xs font-bold uppercase tracking-widest text-muted-ink">{c.label}</p>
                  <p className="mt-1.5 font-semibold text-brand-800 text-sm break-all">{c.value}</p>
                </a>
              ) : (
                <div className="card p-5 flex flex-col items-center text-center h-full">
                  <c.icon className={`w-7 h-7 ${c.color}`} />
                  <p className="mt-3 text-xs font-bold uppercase tracking-widest text-muted-ink">{c.label}</p>
                  <p className="mt-1.5 font-semibold text-brand-800 text-sm break-all">{c.value}</p>
                </div>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal>
          <form onSubmit={handleSubmit} className="card p-6 md:p-10">
            <h2 className="font-heading text-2xl font-extrabold text-brand-800">Send a message</h2>
            <p className="text-sm text-muted-ink mt-1">Your message opens in WhatsApp — the fastest way to reach us.</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-brand-800 mb-1.5">Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className="input-brand" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-800 mb-1.5">Phone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required className="input-brand" placeholder="07X XXX XXXX" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-brand-800 mb-1.5">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-brand" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-brand-800 mb-1.5">Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className="input-brand resize-none" placeholder="How can we help?" />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4 flex-wrap">
              <button type="submit" disabled={sending} className="btn-accent">
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                {sent ? 'Opened in WhatsApp!' : 'Send via WhatsApp'}
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </div>
  )
}

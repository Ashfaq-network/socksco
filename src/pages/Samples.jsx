import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, FlaskConical, MessageCircle, Mail, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { getSettings, saveOrder, fetchProducts } from '@lib/service'
import { generateOrderNumber } from '@lib/format'
import { buildOrderMessage, buildWhatsAppLink, sendOrderEmail } from '@lib/notify'
import Reveal from '@components/ui/Reveal'

const SAMPLE_SIZES = ['Toddler', 'Kids 3-5', 'Kids 6-9', 'Kids 10-13', 'S (Adult)', 'M (Adult)', 'L (Adult)', 'XL (Adult)']

export default function Samples() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselected = searchParams.get('style') || ''

  const [settings, setSettings] = useState(null)
  const [products, setProducts] = useState([])
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    name: '',
    business: '',
    phone: '',
    email: '',
    styles: preselected,
    sizes: [],
    address: '',
    notes: '',
  })

  useEffect(() => {
    getSettings().then(setSettings).catch(() => setSettings(null))
    fetchProducts({}).then(setProducts).catch(() => setProducts([]))
  }, [])

  const toggleSize = (s) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(s) ? prev.sizes.filter((x) => x !== s) : [...prev.sizes, s],
    }))
  }

  const isValid =
    form.name && form.phone && /^[0-9+\s-]{9,}$/.test(form.phone) && form.email.includes('@') && form.address

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    setError(null)

    const order = {
      order_number: generateOrderNumber('SP'),
      customer_name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: '',
      province: '',
      district: null,
      delivery_method: 'pickup',
      subtotal: 0,
      shipping_cost: 0,
      total: 0,
      notes: form.notes || null,
      is_sample: true,
      sample_business: form.business || null,
      sample_styles: `${form.styles || 'Various styles'}${form.sizes.length ? ` (sizes: ${form.sizes.join(', ')})` : ''}`,
      items: [],
    }

    try {
      await saveOrder(order)
      const message = buildOrderMessage(order)
      const whatsappNumber = (settings?.store_info?.whatsapp || '94770000000').replace(/\D/g, '')
      const whatsappUrl = buildWhatsAppLink(whatsappNumber, message)
      const emailResult = await sendOrderEmail(settings, order)

      navigate('/order-confirmation', {
        state: { orderNumber: order.order_number, whatsappUrl, emailSent: emailResult.sent, isSample: true, items: [] },
      })
    } catch (err) {
      console.error('Sample request failed:', err)
      setError('Something went wrong. Please try again or message us on WhatsApp.')
      setProcessing(false)
    }
  }

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  return (
    <div className="container-brand py-10 md:py-16">
      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center mb-12">
          <span className="badge bg-accent-500 text-white">
            <FlaskConical className="w-3.5 h-3.5" /> Try before you buy
          </span>
          <h1 className="mt-4 font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-brand-800">
            Order samples
          </h1>
          <p className="mt-4 text-muted-ink text-lg max-w-xl mx-auto">
            Order a few pairs of any style and check the quality yourself before
            committing to a bulk order. It's free and easy — we'll confirm by
            WhatsApp and email.
          </p>
        </Reveal>

        <Reveal>
          <form onSubmit={handleSubmit} className="card p-6 md:p-10">
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-brand-800 mb-1.5">Your name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className="input-brand" placeholder="Full name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-800 mb-1.5">Business name (optional)</label>
                <input name="business" value={form.business} onChange={handleChange} className="input-brand" placeholder="Shop / boutique / brand" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-800 mb-1.5">Phone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required className="input-brand" placeholder="07X XXX XXXX" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-800 mb-1.5">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-brand" placeholder="you@example.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-brand-800 mb-1.5">Delivery address *</label>
                <input name="address" value={form.address} onChange={handleChange} required className="input-brand" placeholder="Street, city" />
              </div>
            </div>

            {/* Style selection */}
            <div className="mt-7">
              <label className="block text-sm font-semibold text-brand-800 mb-2">
                Which styles interest you?
              </label>
              {products.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {products.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() =>
                        setForm((prev) => {
                          const list = prev.styles.split(',').map((s) => s.trim()).filter(Boolean)
                          const idx = list.indexOf(p.name)
                          const next = idx >= 0 ? list.filter((_, i) => i !== idx) : [...list, p.name]
                          return { ...prev, styles: next.join(', ') }
                        })
                      }
                      className={`px-3.5 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
                        form.styles.split(',').map((s) => s.trim()).includes(p.name)
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-brand-200 bg-white text-brand-800 hover:border-brand-400'
                      }`}
                    >
                      {form.styles.split(',').map((s) => s.trim()).includes(p.name) ? <Check className="w-3.5 h-3.5 inline mr-1" /> : null}
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
              <input
                name="styles"
                value={form.styles}
                onChange={handleChange}
                className="input-brand"
                placeholder="e.g. Classic Crew Sock, Running Performance Sock"
              />
            </div>

            {/* Sizes */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-brand-800 mb-2">
                Sample sizes (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSize(s)}
                    className={`px-3.5 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
                      form.sizes.includes(s)
                        ? 'border-accent-500 bg-accent-500 text-white'
                        : 'border-brand-200 bg-white text-brand-800 hover:border-accent-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-brand-800 mb-1.5">Anything else? (optional)</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="input-brand resize-none" placeholder="Quantities you're considering, target market, timeline..." />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-brand-50">
              <p className="text-xs text-muted-ink flex items-center gap-2">
                <span className="flex gap-1.5">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <Mail className="w-4 h-4 text-brand-500" />
                </span>
                We reply to every sample request on WhatsApp and email.
              </p>
              <button type="submit" disabled={processing || !isValid} className="btn-accent w-full sm:w-auto">
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending request...
                  </>
                ) : (
                  <>Request Samples</>
                )}
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </div>
  )
}
